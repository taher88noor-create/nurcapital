/**
 * Nür Capital — API Utilities
 *
 * fetchWithRetry: Resilient fetch with exponential backoff.
 * Handles Render free-tier cold starts (15min sleep).
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

/**
 * Fetch with automatic retries and exponential backoff.
 * Designed for Render free-tier where backend may be sleeping.
 */
export async function fetchWithRetry(
  url: string,
  options: RequestInit = {},
  retries = 3,
  backoff = [2000, 4000, 8000]
): Promise<Response> {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 120000); // 120s timeout

      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (response.ok) {
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

    // Wait before retry (unless this was the last attempt)
    if (attempt < retries) {
      const delay = backoff[Math.min(attempt, backoff.length - 1)];
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  throw lastError || new Error("All retries exhausted");
}

/**
 * Wake the backend (Render free tier sleeps after 15min).
 */
export async function wakeBackend(): Promise<boolean> {
  try {
    const res = await fetch(`${API_URL}/api/health`, {
      signal: AbortSignal.timeout(60000),
    });
    return res.ok;
  } catch {
    return false;
  }
}

/**
 * POST JSON to the API with retry logic.
 */
export async function postAPI<T>(path: string, body: unknown): Promise<T> {
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
