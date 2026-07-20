"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { getAssetIdentity } from "@/data/asset-identity";
import { SIGNAL_RECORDS } from "@/data/assets";

// ── Animated Counter Hook ────────────────────────────────────────────────────

function useAnimatedNumber(target: number, duration = 600): number {
  const [current, setCurrent] = useState(0);
  const prevTarget = useRef(target);

  useEffect(() => {
    const start = prevTarget.current;
    prevTarget.current = target;
    const startTime = performance.now();

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCurrent(start + (target - start) * eased);
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [target, duration]);

  return current;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// ── Signal type (derived from assets.ts SIGNAL_RECORDS) ──────────────────────

type Signal = (typeof SIGNAL_RECORDS)[number];

// ── Horizon maturity calculation ─────────────────────────────────────────────

function daysSince(dateStr: string): number {
  const signal = new Date(dateStr);
  const now = new Date();
  return Math.floor((now.getTime() - signal.getTime()) / (1000 * 60 * 60 * 24));
}

function isHorizonMatured(signalDate: string, horizonDays: number): boolean {
  return daysSince(signalDate) >= horizonDays;
}

// ── Component ────────────────────────────────────────────────────────────────

export default function RecommendationPerformancePage() {
  // Load cached prices from localStorage on mount
  const loadCached = (): { prices: Record<string, number>; timestamp: string | null; isoTimestamp: string | null } => {
    if (typeof window === "undefined") return { prices: {}, timestamp: null, isoTimestamp: null };
    try {
      const raw = localStorage.getItem("nc_prices");
      if (raw) {
        const parsed = JSON.parse(raw);
        return { prices: parsed.prices || {}, timestamp: parsed.timestamp || null, isoTimestamp: parsed.isoTimestamp || null };
      }
    } catch { /* ignore parse errors */ }
    return { prices: {}, timestamp: null, isoTimestamp: null };
  };

  const cached = loadCached();

  // Live prices (initialized from localStorage if available)
  const [livePrices, setLivePrices] = useState<Record<string, number>>(cached.prices);
  const [failedTickers, setFailedTickers] = useState<Set<string>>(new Set());
  const [refreshing, setRefreshing] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState<string | null>(cached.timestamp);
  const [lastRefreshedIso, setLastRefreshedIso] = useState<string | null>(cached.isoTimestamp);
  const [dataMode, setDataMode] = useState<"stored" | "live">(Object.keys(cached.prices).length > 0 ? "live" : "stored");
  const [refreshError, setRefreshError] = useState<string | null>(null);
  const [filterRating, setFilterRating] = useState<string>("ALL");
  const [filterTheme, setFilterTheme] = useState<string>("ALL");
  const [filterAssetType, setFilterAssetType] = useState<string>("ALL");
  const [expandedSignal, setExpandedSignal] = useState<number | null>(null);
  const [refreshLog, setRefreshLog] = useState<string[]>([]);

  // Cache freshness calculation
  const getCacheFreshness = (): { label: string; color: string; icon: string } => {
    if (dataMode === "stored") return { label: "Analyst has not reviewed yet", color: "text-muted-foreground", icon: "○" };
    if (!lastRefreshedIso) return { label: "Analyst has not reviewed yet", color: "text-muted-foreground", icon: "○" };
    const ageMs = Date.now() - new Date(lastRefreshedIso).getTime();
    const ageHours = ageMs / (1000 * 60 * 60);
    if (ageHours <= 24) return { label: "Analyst reviewed today", color: "text-emerald-600 dark:text-emerald-400", icon: "🟢" };
    if (ageHours <= 168) return { label: "Analyst reviewed this week", color: "text-amber-600 dark:text-amber-400", icon: "🟡" };
    return { label: "Analyst review overdue", color: "text-red-600 dark:text-red-400", icon: "🔴" };
  };

  const freshness = getCacheFreshness();

  // Staged prices — approximate market prices as of signal dates
  const stagedPrices: Record<string, number> = {
    TSM: 168.40, ASML: 885.20, LLY: 1092.50, CRWD: 418.80,
    AMD: 158.20, AVGO: 228.40, PANW: 208.50, ABB: 55.80,
    NVO: 97.20, ENPH: 74.50,
    INFY: 20.40, NU: 15.20, SE: 142.80, CPNG: 27.80,
    GLOB: 220.50, MMYT: 115.60, VALE: 10.90, PBR: 14.10,
    AMX: 18.40, FMX: 109.80, RDY: 76.40, UMC: 8.20,
    PKX: 44.50, TTM: 11.10,
    "ISDE.L": 1850.00, "ISWD.L": 4928.00, "HTWD.L": 4582.00,
    "SEMI.L": 575.00, "SMH.L": 10960.00, "INRG.L": 850.00,
    "RENW.L": 920.00, "HEAL.L": 780.00, "VFEM.L": 5200.00,
  };

  // Get price source for display
  const getPriceSource = (ticker: string): "live" | "staged" | "failed" => {
    if (livePrices[ticker]) return "live";
    if (failedTickers.has(ticker)) return "failed";
    return "staged";
  };

  // Detect large variance between staged and live
  const hasLargeVariance = (ticker: string): boolean => {
    if (!livePrices[ticker] || !stagedPrices[ticker]) return false;
    const variance = Math.abs((livePrices[ticker] - stagedPrices[ticker]) / stagedPrices[ticker]) * 100;
    return variance > 10;
  };

  const refreshPerformance = async () => {
    setRefreshing(true);
    setRefreshError(null);
    setFailedTickers(new Set());
    const log: string[] = [];

    // First wake up the backend (free tier may be sleeping)
    try {
      log.push("Waking backend...");
      await fetch(`${API_URL}/api/health`, { signal: AbortSignal.timeout(60000) });
      log.push("Backend awake.");
    } catch {
      log.push("Backend wake-up timed out. Trying price fetch anyway...");
    }

    try {
      const tickers = SIGNAL_RECORDS.map((s) => s.ticker);
      log.push(`Requesting prices for ${tickers.length} tickers: ${tickers.join(", ")}`);

      const res = await fetch(`${API_URL}/api/mock-portfolio/prices/fetch`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tickers }),
        signal: AbortSignal.timeout(90000), // 90 second timeout for price fetch
      });
      if (!res.ok) throw new Error(`Backend returned ${res.status}`);
      const json = await res.json();
      const prices = json.prices || {};
      const errors = json.errors || [];

      log.push(`Provider: Yahoo Finance`);
      log.push(`Returned: ${Object.keys(prices).length} prices, ${errors.length} failures`);

      // Log each returned price
      for (const [ticker, price] of Object.entries(prices)) {
        const staged = stagedPrices[ticker as string];
        const variance = staged ? Math.abs(((price as number) - staged) / staged * 100).toFixed(1) : "N/A";
        log.push(`  ${ticker}: $${(price as number).toFixed(2)} (staged: $${staged?.toFixed(2) || "N/A"}, variance: ${variance}%)`);
      }

      // Log failures from the API response
      const failed = new Set<string>();
      for (const err of errors) {
        log.push(`  ${err.ticker}: FAILED — ${err.error}`);
        failed.add(err.ticker);
      }

      setFailedTickers(failed);

      if (Object.keys(prices).length > 0) {
        setLivePrices(prices);
        setDataMode("live");
        const now = new Date();
        const timestamp = now.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) + " " + now.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }) + " UTC";
        const isoTimestamp = now.toISOString();
        setLastRefreshed(timestamp);
        setLastRefreshedIso(isoTimestamp);
        log.push(`Refresh complete at ${isoTimestamp}`);

        // Persist to localStorage
        try {
          localStorage.setItem("nc_prices", JSON.stringify({ prices, timestamp, isoTimestamp }));
        } catch { /* storage full or unavailable */ }
      } else {
        throw new Error("No prices returned");
      }
    } catch (e) {
      log.push(`REFRESH FAILED: ${e}`);
      setRefreshError("Unable to fetch latest market prices. Showing last known data.");
      setFailedTickers(new Set());
    }
    setRefreshLog(log);
    setRefreshing(false);
  };

  // Get current price for a ticker (live > staged > signal price)
  const getCurrentPrice = (ticker: string, signalPrice: number): number => {
    if (livePrices[ticker]) return livePrices[ticker];
    if (stagedPrices[ticker]) return stagedPrices[ticker];
    return signalPrice;
  };

  // Calculate return % dynamically
  const calcReturn = (signalPrice: number, currentPrice: number): number => {
    return ((currentPrice - signalPrice) / signalPrice) * 100;
  };

  // Calculate horizon return (only if matured)
  const getHorizonReturn = (signalDate: string, signalPrice: number, ticker: string, horizonDays: number): number | null => {
    if (!isHorizonMatured(signalDate, horizonDays)) return null;
    // For matured horizons, use current price as approximation
    // (In production, would store historical price at horizon date)
    const price = getCurrentPrice(ticker, signalPrice);
    return calcReturn(signalPrice, price);
  };

  // Derived data
  const getAssetType = (s: Signal): string => {
    if (s.assetType) return s.assetType;
    if (s.ticker.endsWith(".L")) return "etf";
    return "stock";
  };

  const themes = [...new Set(SIGNAL_RECORDS.map((s) => s.theme))];
  const filtered = SIGNAL_RECORDS.filter((s) => {
    if (filterAssetType !== "ALL" && getAssetType(s) !== filterAssetType) return false;
    if (filterRating === "AJBELL") {
      const identity = getAssetIdentity(s.ticker);
      if (!identity || !identity.ajBellActionable) return false;
    } else if (filterRating !== "ALL" && s.rating !== filterRating) return false;
    if (filterTheme !== "ALL" && s.theme !== filterTheme) return false;
    return true;
  });

  const buySignals = SIGNAL_RECORDS.filter((s) => s.rating === "BUY");
  const avgBuyReturn = buySignals.length > 0
    ? buySignals.reduce((sum, s) => sum + calcReturn(s.signalPrice, getCurrentPrice(s.ticker, s.signalPrice)), 0) / buySignals.length
    : 0;

  const signalReturns = SIGNAL_RECORDS.map((s) => ({
    ...s,
    currentPrice: getCurrentPrice(s.ticker, s.signalPrice),
    returnPct: calcReturn(s.signalPrice, getCurrentPrice(s.ticker, s.signalPrice)),
  }));

  // Best/Worst only from BUY signals (REDUCE going up is a bad call, not a good one)
  const buyReturns = signalReturns.filter((s) => s.rating === "BUY");
  const bestSignal = [...buyReturns].sort((a, b) => b.returnPct - a.returnPct)[0];
  const worstSignal = [...buyReturns].sort((a, b) => a.returnPct - b.returnPct)[0];

  const themePerformance = themes.map((theme) => {
    const ts = signalReturns.filter((s) => s.theme === theme);
    const avg = ts.reduce((sum, s) => sum + s.returnPct, 0) / ts.length;
    return { theme, avg, count: ts.length };
  }).sort((a, b) => b.avg - a.avg);

  const ratingColors: Record<string, string> = { BUY: "badge-green", HOLD: "badge-blue", REDUCE: "badge-amber" };

  // Determine which horizon columns to show
  // Hide if: no signals matured (Pending), OR all matured but no historical data (N/A)
  // Since we don't store historical snapshots yet, matured horizons always show N/A
  // So hide ALL horizon columns until we implement price snapshot storage
  const show2W = false;
  const show1M = false;
  const show3M = false;
  const show6M = false;
  const show1Y = false;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Conviction List & Performance</h1>
          <p className="mt-1 text-sm text-muted-foreground">Tracking direction and performance of assets we believe in</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className={`text-xs font-medium ${freshness.color}`}>
              {freshness.icon} {freshness.label}
            </span>
            {dataMode === "stored" && (
              <p className="mt-1 text-[10px] text-amber-600 dark:text-amber-400">Ask analyst to review for latest market direction.</p>
            )}
            {dataMode === "live" && lastRefreshed && (
              <p className="mt-1 text-[10px] text-muted-foreground">Last reviewed: {lastRefreshed}</p>
            )}
            {freshness.icon === "🔴" && (
              <p className="mt-1 text-[10px] text-red-600 dark:text-red-400">Click Ask analyst to review for the latest prices.</p>
            )}
          </div>
          <button onClick={refreshPerformance} disabled={refreshing}
            className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-50">
            {refreshing ? "Analyst reviewing..." : "Ask analyst to review"}
          </button>
        </div>
      </div>

      {/* Error */}
      {refreshError && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-700 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-400">
          ⚠ {refreshError}
        </div>
      )}

      {/* Staged data info */}
      {dataMode === "stored" && (
        <div className="rounded-lg border border-blue-200 bg-blue-50 p-3 text-sm text-blue-700 dark:border-blue-900 dark:bg-blue-950/30 dark:text-blue-400">
          ℹ Showing prices from signal date. Click <strong>Ask analyst to review</strong> for latest market direction.
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <AnimatedCard label="Total BUY Signals" value={buySignals.length} suffix="" />
        <AnimatedCard label="Avg BUY Return" value={avgBuyReturn} suffix="%" signed />
        <div className="card card-hover fade-in">
          <p className="text-[11px] font-medium uppercase text-muted-foreground">Best Signal</p>
          <p className="mt-1 text-lg font-bold">{bestSignal?.ticker}</p>
          <p className="text-xs text-emerald-600 dark:text-emerald-400">+{bestSignal?.returnPct.toFixed(1)}%</p>
        </div>
        <div className="card card-hover fade-in">
          <p className="text-[11px] font-medium uppercase text-muted-foreground">Worst Signal</p>
          <p className="mt-1 text-lg font-bold">{worstSignal?.ticker}</p>
          <p className={`text-xs ${(worstSignal?.returnPct ?? 0) >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}`}>{worstSignal?.returnPct.toFixed(1)}%</p>
        </div>
        <div className="card card-hover fade-in">
          <p className="text-[11px] font-medium uppercase text-muted-foreground">Best Theme</p>
          <p className="mt-1 text-lg font-bold">{themePerformance[0]?.theme}</p>
          <p className="text-xs text-emerald-600 dark:text-emerald-400">+{themePerformance[0]?.avg.toFixed(1)}%</p>
        </div>
      </div>

      {/* Performance by Theme */}
      <div className="card">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted-foreground">Performance by Theme</h2>
        <div className="space-y-2">
          {themePerformance.map(({ theme, avg, count }) => (
            <div key={theme} className="flex items-center gap-3">
              <span className="w-40 text-sm">{theme}</span>
              <div className="flex-1">
                <div className="h-3 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                  <div className={`h-full rounded-full ${avg >= 0 ? "bg-emerald-500" : "bg-red-500"}`}
                    style={{ width: `${Math.min(Math.abs(avg) * 4, 100)}%` }} />
                </div>
              </div>
              <span className={`w-14 text-right text-sm font-bold ${avg >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}`}>
                {avg >= 0 ? "+" : ""}{avg.toFixed(1)}%
              </span>
              <span className="w-6 text-right text-[10px] text-muted-foreground">{count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Horizon Averages */}
      {/* Horizon Averages — hidden until historical price snapshots are available */}
      {(show2W || show1M || show3M || show6M || show1Y) && (
        <div className="card">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted-foreground">Average Return by Horizon (BUY Signals)</h2>
          <div className="grid gap-4 sm:grid-cols-5">
            <HorizonAvg label="2 Weeks" days={14} signals={buySignals} getPrice={getCurrentPrice} livePrices={livePrices} />
            <HorizonAvg label="1 Month" days={30} signals={buySignals} getPrice={getCurrentPrice} livePrices={livePrices} />
            <HorizonAvg label="3 Months" days={90} signals={buySignals} getPrice={getCurrentPrice} livePrices={livePrices} />
            <HorizonAvg label="6 Months" days={180} signals={buySignals} getPrice={getCurrentPrice} livePrices={livePrices} />
            <HorizonAvg label="1 Year" days={365} signals={buySignals} getPrice={getCurrentPrice} livePrices={livePrices} />
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <select value={filterRating} onChange={(e) => setFilterRating(e.target.value)}
          className="rounded-lg border border-border bg-panel px-3 py-2 text-sm dark:border-border-dark dark:bg-panel-dark">
          <option value="ALL">All Ratings</option>
          <option value="BUY">BUY</option><option value="HOLD">HOLD</option><option value="REDUCE">REDUCE</option>
        </select>
        <select value={filterTheme} onChange={(e) => setFilterTheme(e.target.value)}
          className="rounded-lg border border-border bg-panel px-3 py-2 text-sm dark:border-border-dark dark:bg-panel-dark">
          <option value="ALL">All Themes</option>
          {themes.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
        <label className="flex items-center gap-2 self-center text-xs">
          <input type="checkbox" checked={filterRating === "AJBELL"} onChange={(e) => setFilterRating(e.target.checked ? "AJBELL" : "ALL")}
            className="rounded" />
          AJ Bell Actionable only
        </label>
        <div className="flex items-center gap-1 rounded-lg border border-border bg-panel p-0.5 dark:border-border-dark dark:bg-panel-dark">
          <button onClick={() => setFilterAssetType("ALL")} className={`rounded-md px-3 py-1.5 text-xs font-medium transition ${filterAssetType === "ALL" ? "bg-white shadow dark:bg-slate-700" : "text-muted-foreground"}`}>All</button>
          <button onClick={() => setFilterAssetType("stock")} className={`rounded-md px-3 py-1.5 text-xs font-medium transition ${filterAssetType === "stock" ? "bg-white shadow dark:bg-slate-700" : "text-muted-foreground"}`}>Stocks</button>
          <button onClick={() => setFilterAssetType("etf")} className={`rounded-md px-3 py-1.5 text-xs font-medium transition ${filterAssetType === "etf" ? "bg-white shadow dark:bg-slate-700" : "text-muted-foreground"}`}>ETFs & Funds</button>
        </div>
        <span className="self-center text-xs text-muted-foreground">{filtered.length} signals</span>
      </div>

      {/* Signal Table */}
      <div className="card overflow-x-auto">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted-foreground">Individual Signal History</h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-[11px] uppercase text-muted-foreground dark:border-border-dark">
              <th className="pb-2 pr-3">Signal Date</th>
              <th className="pb-2 pr-3">Ticker</th>
              <th className="pb-2 pr-3">Company</th>
              <th className="pb-2 pr-3">Theme</th>
              <th className="pb-2 pr-3">Rating</th>
              <th className="pb-2 pr-3 text-right">Signal Price</th>
              <th className="pb-2 pr-3 text-right">Current Price</th>
              <th className="pb-2 pr-3 text-right">Current Return</th>
              <th className="pb-2 pr-3 text-center">Source</th>
              {show2W && <th className="pb-2 pr-3 text-right">2W</th>}
              {show1M && <th className="pb-2 pr-3 text-right">1M</th>}
              {show3M && <th className="pb-2 pr-3 text-right">3M</th>}
              {show6M && <th className="pb-2 pr-3 text-right">6M</th>}
              {show1Y && <th className="pb-2 text-right">1Y</th>}
            </tr>
          </thead>
          <tbody>
            {filtered.map((s) => {
              const price = getCurrentPrice(s.ticker, s.signalPrice);
              const ret = calcReturn(s.signalPrice, price);
              const identity = getAssetIdentity(s.ticker);
              const isExpanded = expandedSignal === s.id;
              const source = getPriceSource(s.ticker);
              const sourceLabel = source === "live" ? "Live" : source === "failed" ? "Failed" : "Staged";
              const sourceColor = source === "live" ? "text-emerald-600 dark:text-emerald-400" : source === "failed" ? "text-red-600 dark:text-red-400" : "text-amber-600 dark:text-amber-400";
              const ajBell = identity?.ajBellActionable;
              return (
                <tr key={s.id} className={`border-b border-border/30 cursor-pointer hover:bg-slate-50 dark:border-border-dark/30 dark:hover:bg-slate-800/50 ${!ajBell ? "opacity-60" : ""}`} onClick={() => setExpandedSignal(isExpanded ? null : s.id)}>
                  <td className="py-2.5 pr-3 text-xs">{s.signalDate}</td>
                  <td className="py-2.5 pr-3 font-mono font-bold">
                    {s.ticker}
                    {!ajBell && <span className="ml-1 text-[9px] text-amber-600">⚠</span>}
                  </td>
                  <td className="py-2.5 pr-3 hidden text-muted-foreground lg:table-cell">{s.companyName}</td>
                  <td className="py-2.5 pr-3 text-xs">{s.theme}</td>
                  <td className="py-2.5 pr-3"><span className={`badge ${ratingColors[s.rating]}`}>{s.rating}</span></td>
                  <td className="py-2.5 pr-3 text-right font-mono">${s.signalPrice.toFixed(2)}</td>
                  <td className="py-2.5 pr-3 text-right font-mono">${price.toFixed(2)}</td>
                  <td className={`py-2.5 pr-3 text-right font-mono font-bold ${ret >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}`}>
                    {`${ret >= 0 ? "+" : ""}${ret.toFixed(1)}%`}
                  </td>
                  <td className={`py-2.5 pr-3 text-center text-[10px] font-medium ${sourceColor}`}>{sourceLabel}</td>
                  {show2W && <td className="py-2.5 pr-3 text-right text-xs">{formatHorizon(s.signalDate, s.signalPrice, s.ticker, 14)}</td>}
                  {show1M && <td className="py-2.5 pr-3 text-right text-xs">{formatHorizon(s.signalDate, s.signalPrice, s.ticker, 30)}</td>}
                  {show3M && <td className="py-2.5 pr-3 text-right text-xs">{formatHorizon(s.signalDate, s.signalPrice, s.ticker, 90)}</td>}
                  {show6M && <td className="py-2.5 pr-3 text-right text-xs">{formatHorizon(s.signalDate, s.signalPrice, s.ticker, 180)}</td>}
                  {show1Y && <td className="py-2.5 text-right text-xs">{formatHorizon(s.signalDate, s.signalPrice, s.ticker, 365)}</td>}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Expanded Signal Detail */}
      {expandedSignal && (() => {
        const s = SIGNAL_RECORDS.find((sig) => sig.id === expandedSignal);
        if (!s) return null;
        const identity = getAssetIdentity(s.ticker);
        const price = getCurrentPrice(s.ticker, s.signalPrice);
        const ret = calcReturn(s.signalPrice, price);
        return (
          <div className="card">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold">{s.ticker} — {s.companyName}</h3>
              <button onClick={() => setExpandedSignal(null)} className="text-xs text-muted-foreground hover:text-foreground">✕ Close</button>
            </div>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div>
                <p className="text-[10px] uppercase text-muted-foreground">BUY Signal</p>
                <p className="mt-1 text-sm font-medium">{s.signalDate}</p>
                <p className="text-[10px] text-muted-foreground">Recommendation date (fixed)</p>
              </div>
              <div>
                <p className="text-[10px] uppercase text-muted-foreground">Signal Price</p>
                <p className="mt-1 text-sm font-mono font-medium">${s.signalPrice.toFixed(2)}</p>
                <p className="text-[10px] text-muted-foreground">Price at recommendation</p>
              </div>
              <div>
                <p className="text-[10px] uppercase text-muted-foreground">Market Price</p>
                <p className="mt-1 text-sm font-mono font-medium">${price.toFixed(2)}</p>
                <p className="text-[10px] text-muted-foreground">{lastRefreshed ? `Updated: ${lastRefreshed}` : "Staged data"}</p>
              </div>
            </div>
            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              <div><p className="text-[10px] uppercase text-muted-foreground">Performance Since Recommendation</p><p className={`mt-1 text-lg font-bold ${ret >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}`}>{ret >= 0 ? "+" : ""}{ret.toFixed(1)}%</p></div>
              <div><p className="text-[10px] uppercase text-muted-foreground">Theme</p><p className="mt-1 text-sm">{s.theme}</p></div>
              <div><p className="text-[10px] uppercase text-muted-foreground">Market Regime at Signal</p><p className="mt-1 text-sm">{s.regime}</p></div>
            </div>
            <div className="mt-4">
              <p className="text-[10px] uppercase text-muted-foreground">Rationale</p>
              <p className="mt-1 text-sm">{s.rationale}</p>
            </div>

            {/* How to Find This Asset */}
            {identity && (
              <div className="mt-6 rounded-lg border border-border bg-slate-50 p-4 dark:border-border-dark dark:bg-slate-800/50">
                <h4 className="text-xs font-semibold uppercase text-muted-foreground">How to Find This Asset</h4>
                <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  <div><p className="text-[10px] text-muted-foreground">Company</p><p className="text-sm font-medium">{identity.companyName}</p></div>
                  <div><p className="text-[10px] text-muted-foreground">Ticker</p><p className="text-sm font-mono font-bold">{identity.ticker}</p></div>
                  <div><p className="text-[10px] text-muted-foreground">Exchange</p><p className="text-sm">{identity.exchange}</p></div>
                  <div><p className="text-[10px] text-muted-foreground">ISIN</p><p className="text-sm font-mono">{identity.isin}</p></div>
                  <div><p className="text-[10px] text-muted-foreground">AJ Bell Search</p><p className="text-sm font-medium text-brand-700 dark:text-brand-400">{identity.brokerSearchName}</p></div>
                  <div><p className="text-[10px] text-muted-foreground">Asset Type</p><p className="text-sm">{identity.assetType}</p></div>
                </div>
                <p className="mt-3 text-[10px] text-muted-foreground">Search for "{identity.brokerSearchName}" or ISIN "{identity.isin}" on AJ Bell or your investment platform.</p>
              </div>
            )}
          </div>
        );
      })()}

      {/* Disclaimer */}
      <div className="rounded-lg border border-border bg-slate-50 p-4 text-center dark:border-border-dark dark:bg-slate-800/50">
        <p className="text-xs text-muted-foreground">
          Past performance does not guarantee future results. Nür Capital provides research intelligence, not financial advice.
          Returns are calculated dynamically: ((current price − signal price) / signal price) × 100.
        </p>
      </div>
    </div>
  );

  // Helper: format horizon cell
  function formatHorizon(signalDate: string, signalPrice: number, ticker: string, horizonDays: number): string {
    if (!isHorizonMatured(signalDate, horizonDays)) return "Pending";
    // Horizon has matured but we don't store historical price snapshots yet.
    // We can only show accurate horizon returns when we have the price AT the horizon date.
    // For now, mark as "N/A" — in future, store periodic price snapshots.
    return "N/A";
  }
}

// ── Sub-components ───────────────────────────────────────────────────────────

function HorizonAvg({ label, days, signals, getPrice, livePrices }: { label: string; days: number; signals: Signal[]; getPrice: (ticker: string, fallback: number) => number; livePrices: Record<string, number> }) {
  const matured = signals.filter((s) => isHorizonMatured(s.signalDate, days));

  if (matured.length === 0) return (
    <div className="text-center">
      <p className="text-[10px] uppercase text-muted-foreground">{label}</p>
      <p className="mt-1 text-lg font-bold text-muted-foreground">Pending</p>
      <p className="text-[10px] text-muted-foreground">0/{signals.length} matured</p>
    </div>
  );

  const avg = matured.reduce((sum, s) => {
    const price = getPrice(s.ticker, s.signalPrice);
    return sum + ((price - s.signalPrice) / s.signalPrice) * 100;
  }, 0) / matured.length;

  return (
    <div className="text-center">
      <p className="text-[10px] uppercase text-muted-foreground">{label}</p>
      <p className={`mt-1 text-lg font-bold ${avg >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}`}>
        {avg >= 0 ? "+" : ""}{avg.toFixed(1)}%
      </p>
      <p className="text-[10px] text-muted-foreground">{matured.length}/{signals.length} matured</p>
    </div>
  );
}

// ── Animated Card Component ──────────────────────────────────────────────────

function AnimatedCard({ label, value, suffix, signed }: { label: string; value: number; suffix: string; signed?: boolean }) {
  const animated = useAnimatedNumber(value);
  const display = suffix === "%" ? animated.toFixed(1) : Math.round(animated).toString();
  const color = signed
    ? value >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"
    : "text-foreground";

  return (
    <div className="card card-hover fade-in">
      <p className="text-[11px] font-medium uppercase text-muted-foreground">{label}</p>
      <p className={`mt-1 text-2xl font-bold ${color}`}>
        {signed && value >= 0 ? "+" : ""}{display}{suffix}
      </p>
    </div>
  );
}
