/**
 * Nür Capital — API Utilities
 *
 * Resilient fetch with cold-start handling, in-memory + localStorage caching.
 * Designed for Render free-tier (sleeps after 15min inactivity).
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// ── Global Status (observable by sidebar) ────────────────────────────────────

export type AnalystStatus = "standby" | "warming" | "live" | "offline";

let _status: AnalystStatus = "standby";
let _statusTimestamp: string | null = null;
const _listeners: Set<() => void> = new Set();

export function getAnalystStatus(): { status: AnalystStatus; timestamp: string | null } {
  return { status: _status, timestamp: _statusTimestamp };
}

export function subscribeAnalystStatus(fn: () => void): () => void {
  _listeners.add(fn);
  return () => { _listeners.delete(fn); };
}

function setStatus(s: AnalystStatus, ts?: string | null) {
  _status = s;
  if (ts !== undefined) _statusTimestamp = ts;
  _listeners.forEach((fn) => fn());
}

// ── Cache Layer (in-memory + localStorage) ───────────────────────────────────

const CACHE_TTL = 300_000; // 5 minutes
const STORAGE_KEY = "nc_api_cache";

interface CacheEntry {
  data: unknown;
  timestamp: number;
}

const API_CACHE = new Map<string, CacheEntry>();

// Hydrate from localStorage on module load (client-side only)
if (typeof window !== "undefined") {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const entries: Record<string, CacheEntry> = JSON.parse(stored);
      const now = Date.now();
      for (const [key, entry] of Object.entries(entries)) {
        // Only hydrate entries within TTL
        if (now - entry.timestamp < CACHE_TTL) {
          API_CACHE.set(key, entry);
        }
      }
    }
  } catch { /* ignore */ }

  // Also check if we have live prices → set initial status
  try {
    const priceData = localStorage.getItem("nc_prices");
    if (priceData) {
      const parsed = JSON.parse(priceData);
      if (parsed.prices && Object.keys(parsed.prices).length > 0) {
        _status = "live";
        _statusTimestamp = parsed.timestamp || null;
      }
    }
  } catch { /* ignore */ }
}

function getCacheKey(path: string, body: unknown): string {
  return `${path}:${JSON.stringify(body)}`;
}

function getFromCache<T>(key: string): T | null {
  const entry = API_CACHE.get(key);
  if (!entry) return null;
  if (Date.now() - entry.timestamp > CACHE_TTL) {
    API_CACHE.delete(key);
    return null;
  }
  return entry.data as T;
}

function setInCache(key: string, data: unknown): void {
  API_CACHE.set(key, { data, timestamp: Date.now() });
  persistCache();
}

function persistCache(): void {
  if (typeof window === "undefined") return;
  try {
    const obj: Record<string, CacheEntry> = {};
    API_CACHE.forEach((entry, key) => { obj[key] = entry; });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(obj));
  } catch { /* storage full */ }
}

// ── Session-aware cold start tracking ────────────────────────────────────────

let _firstCallMade = false;

// ── fetchWithRetry ───────────────────────────────────────────────────────────

/**
 * Fetch with cold-start awareness and exponential backoff.
 *
 * Strategy:
 * 1. Fire request immediately (120s timeout)
 * 2. If first call in session fails with network/timeout → wait 3s grace, retry
 * 3. Then apply normal exponential backoff [2s, 4s, 8s]
 */
export async function fetchWithRetry(
  url: string,
  options: RequestInit = {},
  retries = 3,
  backoff = [2000, 4000, 8000]
): Promise<Response> {
  let lastError: Error | null = null;
  const isFirstSessionCall = !_firstCallMade;
  _firstCallMade = true;

  // Set warming status on first call
  if (isFirstSessionCall && _status !== "live") {
    setStatus("warming");
  }

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 120000);

      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        setStatus("live", new Date().toLocaleString("en-GB", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" }));
        return response;
      }

      // Don't retry on 4xx client errors
      if (response.status >= 400 && response.status < 500) {
        return response;
      }

      lastError = new Error(`HTTP ${response.status}`);
    } catch (e) {
      lastError = e instanceof Error ? e : new Error(String(e));
    }

    // Cold-start grace: on first session call failure, wait 3s then retry immediately
    if (attempt === 0 && isFirstSessionCall) {
      await new Promise((resolve) => setTimeout(resolve, 3000));
      continue;
    }

    // Wait before retry (unless this was the last attempt)
    if (attempt < retries) {
      const delay = backoff[Math.min(attempt - (isFirstSessionCall ? 1 : 0), backoff.length - 1)];
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  setStatus("offline");
  throw lastError || new Error("All retries exhausted");
}

// ── postAPI (with cache) ─────────────────────────────────────────────────────

export interface CachedResponse<T> {
  data: T;
  fromCache: boolean;
}

/**
 * POST JSON to the API with retry logic and caching.
 * Returns { data, fromCache } so the UI can indicate cache hits.
 */
export async function postAPI<T>(path: string, body: unknown, useCache = true): Promise<CachedResponse<T>> {
  const cacheKey = getCacheKey(path, body);

  // Check cache first
  if (useCache) {
    const cached = getFromCache<T>(cacheKey);
    if (cached !== null) {
      return { data: cached, fromCache: true };
    }
  }

  const url = `${API_URL}${path}`;
  const response = await fetchWithRetry(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  const data: T = await response.json();

  // Store in cache
  if (useCache) {
    setInCache(cacheKey, data);
  }

  return { data, fromCache: false };
}

/**
 * POST JSON without caching (for price refreshes where you always want fresh data).
 */
export async function postAPIFresh<T>(path: string, body: unknown): Promise<T> {
  const url = `${API_URL}${path}`;
  const response = await fetchWithRetry(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  return response.json();
}
