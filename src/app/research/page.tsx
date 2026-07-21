"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { getAssetIdentity } from "@/data/asset-identity";
import { SIGNAL_RECORDS } from "@/data/assets";
import { postAPIFresh } from "@/lib/api";
import { formatPrice } from "@/lib/format";

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
      const eased = 1 - Math.pow(1 - progress, 3);
      setCurrent(start + (target - start) * eased);
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [target, duration]);

  return current;
}

// ── Signal type ──────────────────────────────────────────────────────────────

type Signal = (typeof SIGNAL_RECORDS)[number];

// ── Component ────────────────────────────────────────────────────────────────

export default function RecommendationPerformancePage() {
  const loadCached = (): { prices: Record<string, number>; timestamp: string | null; isoTimestamp: string | null } => {
    if (typeof window === "undefined") return { prices: {}, timestamp: null, isoTimestamp: null };
    try {
      const raw = localStorage.getItem("nc_prices");
      if (raw) {
        const parsed = JSON.parse(raw);
        return { prices: parsed.prices || {}, timestamp: parsed.timestamp || null, isoTimestamp: parsed.isoTimestamp || null };
      }
    } catch { /* ignore */ }
    return { prices: {}, timestamp: null, isoTimestamp: null };
  };

  const cached = loadCached();

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
  const [showLog, setShowLog] = useState(false);

  // Cache freshness
  const getCacheFreshness = (): { label: string; color: string; icon: string } => {
    if (!lastRefreshedIso) return { label: "Analyst has not reviewed yet", color: "text-muted-foreground", icon: "○" };
    const ageMs = Date.now() - new Date(lastRefreshedIso).getTime();
    const ageHours = ageMs / (1000 * 60 * 60);
    if (ageHours <= 24) return { label: "Analyst reviewed today", color: "text-emerald-600 dark:text-emerald-400", icon: "🟢" };
    if (ageHours <= 168) return { label: "Analyst reviewed this week", color: "text-amber-600 dark:text-amber-400", icon: "🟡" };
    return { label: "Analyst review overdue", color: "text-red-600 dark:text-red-400", icon: "🔴" };
  };
  const freshness = getCacheFreshness();

  const getCacheAge = (): string | null => {
    if (!lastRefreshedIso) return null;
    const ageMs = Date.now() - new Date(lastRefreshedIso).getTime();
    const ageHours = Math.floor(ageMs / (1000 * 60 * 60));
    if (ageHours < 1) return "< 1 hour ago";
    if (ageHours < 24) return `${ageHours} hour${ageHours > 1 ? "s" : ""} ago`;
    const ageDays = Math.floor(ageHours / 24);
    return `${ageDays} day${ageDays > 1 ? "s" : ""} ago`;
  };
  const cacheAge = getCacheAge();

  // Staged prices (ultimate fallback)
  const stagedPrices: Record<string, number> = {
    TSM: 168.40, ASML: 885.20, LLY: 1092.50, CRWD: 418.80,
    AMD: 158.20, AVGO: 228.40, PANW: 208.50, ABB: 55.80,
    NVO: 97.20, ENPH: 74.50,
    INFY: 20.40, NU: 15.20, SE: 142.80, CPNG: 27.80,
    GLOB: 220.50, MMYT: 115.60, VALE: 10.90, PBR: 14.10,
    AMX: 18.40, FMX: 109.80, RDY: 76.40, UMC: 8.20,
    PKX: 44.50, TTM: 11.10,
    "ISDE.L": 18.50, "ISWD.L": 49.28, "HTWD.L": 45.82,
    "SEMI.L": 5.75, "SMH.L": 109.60, "INRG.L": 8.50,
    "RENW.L": 9.20, "HEAL.L": 7.80, "VFEM.L": 52.00,
  };

  const getPriceSource = (ticker: string): "live" | "staged" | "failed" => {
    if (livePrices[ticker]) return "live";
    if (failedTickers.has(ticker)) return "failed";
    return "staged";
  };

  const refreshPerformance = async () => {
    setRefreshing(true);
    setRefreshError(null);
    setFailedTickers(new Set());
    const log: string[] = [];

    try {
      const tickers = SIGNAL_RECORDS.map((s) => s.ticker);
      log.push(`Requesting prices for ${tickers.length} tickers`);

      const json = await postAPIFresh<{ prices: Record<string, number>; errors: { ticker: string; error: string }[] }>(
        "/api/mock-portfolio/prices/fetch",
        { tickers }
      );

      const prices = json.prices || {};
      const errors = json.errors || [];
      log.push(`Yahoo Finance returned: ${Object.keys(prices).length} prices, ${errors.length} failures`);

      for (const [ticker, price] of Object.entries(prices)) {
        const staged = stagedPrices[ticker];
        const variance = staged ? Math.abs(((price as number) - staged) / staged * 100).toFixed(1) : "—";
        log.push(`  ${ticker}: ${formatPrice(price as number, ticker)} (variance: ${variance}%)`);
      }

      const failed = new Set<string>();
      for (const err of errors) { log.push(`  ${err.ticker}: FAILED — ${err.error}`); failed.add(err.ticker); }
      setFailedTickers(failed);

      if (Object.keys(prices).length > 0) {
        setLivePrices(prices);
        setDataMode("live");
        const now = new Date();
        const timestamp = now.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) + " " + now.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }) + " UTC";
        const isoTimestamp = now.toISOString();
        setLastRefreshed(timestamp);
        setLastRefreshedIso(isoTimestamp);
        log.push(`Complete at ${isoTimestamp}`);
        try { localStorage.setItem("nc_prices", JSON.stringify({ prices, timestamp, isoTimestamp })); } catch { /* */ }
      } else {
        throw new Error("No prices returned");
      }
    } catch (e) {
      log.push(`FAILED: ${e}`);
      setRefreshError("Unable to fetch latest market prices. Showing last known data.");
      setFailedTickers(new Set());
    }
    setRefreshLog(log);
    setRefreshing(false);
  };

  const getCurrentPrice = (ticker: string, signalPrice: number): number => {
    if (livePrices[ticker]) return livePrices[ticker];
    if (stagedPrices[ticker]) return stagedPrices[ticker];
    return signalPrice;
  };

  const calcReturn = (signalPrice: number, currentPrice: number): number => {
    return ((currentPrice - signalPrice) / signalPrice) * 100;
  };

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

  const buyReturns = signalReturns.filter((s) => s.rating === "BUY");
  const bestSignal = [...buyReturns].sort((a, b) => b.returnPct - a.returnPct)[0];
  const worstSignal = [...buyReturns].sort((a, b) => a.returnPct - b.returnPct)[0];

  const themePerformance = themes.map((theme) => {
    const ts = signalReturns.filter((s) => s.theme === theme);
    const avg = ts.reduce((sum, s) => sum + s.returnPct, 0) / ts.length;
    return { theme, avg, count: ts.length };
  }).sort((a, b) => b.avg - a.avg);

  const ratingColors: Record<string, string> = { BUY: "badge-green", HOLD: "badge-blue", REDUCE: "badge-amber" };

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
            <span className={`text-xs font-medium ${freshness.color}`}>{freshness.icon} {freshness.label}</span>
            {dataMode === "stored" && !lastRefreshedIso && (
              <p className="mt-1 text-[10px] text-amber-600 dark:text-amber-400">Ask analyst to review for latest market direction.</p>
            )}
            {dataMode === "live" && lastRefreshed && (
              <p className="mt-1 text-[10px] text-muted-foreground">Last reviewed: {lastRefreshed}{cacheAge ? ` (${cacheAge})` : ""}</p>
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
      {dataMode === "stored" && !lastRefreshedIso && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-700 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-400">
          ⚠ Showing signal prices only. Click <strong>Ask analyst to review</strong> for live market data and returns.
        </div>
      )}
      {dataMode === "live" && cacheAge && freshness.icon === "🔴" && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-700 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-400">
          ⚠ Showing cached prices from {cacheAge}. Click <strong>Ask analyst to review</strong> for fresh data.
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
              <th className="pb-2 pr-3 text-right">Return</th>
              <th className="pb-2 text-center">Source</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((s) => {
              const price = getCurrentPrice(s.ticker, s.signalPrice);
              const ret = calcReturn(s.signalPrice, price);
              const identity = getAssetIdentity(s.ticker);
              const isExpanded = expandedSignal === s.id;
              const source = getPriceSource(s.ticker);
              const sourceLabel = source === "live" ? "Live" : source === "failed" ? "Failed" : "Signal price";
              const sourceColor = source === "live" ? "text-emerald-600 dark:text-emerald-400" : source === "failed" ? "text-red-600 dark:text-red-400" : "text-muted-foreground";
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
                  <td className="py-2.5 pr-3 text-right font-mono">{formatPrice(s.signalPrice, s.ticker)}</td>
                  <td className="py-2.5 pr-3 text-right font-mono">{formatPrice(price, s.ticker)}</td>
                  <td className={`py-2.5 pr-3 text-right font-mono font-bold ${ret >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}`}>
                    {`${ret >= 0 ? "+" : ""}${ret.toFixed(1)}%`}
                  </td>
                  <td className={`py-2.5 text-center text-[10px] font-medium ${sourceColor}`}>{sourceLabel}</td>
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
                <p className="mt-1 text-sm font-mono font-medium">{formatPrice(s.signalPrice, s.ticker)}</p>
                <p className="text-[10px] text-muted-foreground">Price at recommendation</p>
              </div>
              <div>
                <p className="text-[10px] uppercase text-muted-foreground">Market Price</p>
                <p className="mt-1 text-sm font-mono font-medium">{formatPrice(price, s.ticker)}</p>
                <p className="text-[10px] text-muted-foreground">{lastRefreshed ? `Updated: ${lastRefreshed}` : "Signal price (staged)"}</p>
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
                <p className="mt-3 text-[10px] text-muted-foreground">Search for &quot;{identity.brokerSearchName}&quot; or ISIN &quot;{identity.isin}&quot; on AJ Bell or your investment platform.</p>
              </div>
            )}
          </div>
        );
      })()}

      {/* Analyst Log (collapsible) */}
      {dataMode === "live" && refreshLog.length > 0 && (
        <div className="card">
          <button onClick={() => setShowLog(!showLog)} className="flex w-full items-center justify-between text-xs text-muted-foreground hover:text-foreground">
            <span className="font-medium uppercase tracking-wide">{showLog ? "Hide" : "Show"} analyst log</span>
            <span>{showLog ? "▼" : "▶"} {refreshLog.length} entries</span>
          </button>
          {showLog && (
            <pre className="mt-3 max-h-48 overflow-y-auto rounded-lg bg-slate-50 p-3 text-[10px] text-muted-foreground dark:bg-slate-800/50">
              {refreshLog.join("\n")}
            </pre>
          )}
        </div>
      )}

      {/* Disclaimer */}
      <div className="rounded-lg border border-border bg-slate-50 p-4 text-center dark:border-border-dark dark:bg-slate-800/50">
        <p className="text-xs text-muted-foreground">
          Past performance does not guarantee future results. Nür Capital provides research intelligence, not financial advice.
          Returns are calculated dynamically: ((current price − signal price) / signal price) × 100.
        </p>
      </div>
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
