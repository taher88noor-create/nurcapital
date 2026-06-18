"use client";

import { useState, useMemo } from "react";
import { getAssetIdentity } from "@/data/asset-identity";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// ── Static Signal Records (frozen at signal date — never overwritten) ────────

interface Signal {
  id: number;
  ticker: string;
  companyName: string;
  rating: "BUY" | "HOLD" | "REDUCE";
  signalDate: string;
  signalPrice: number;
  theme: string;
  rationale: string;
  regime: string;
}

const SIGNAL_RECORDS: Signal[] = [
  { id: 1, ticker: "TSM", companyName: "Taiwan Semiconductor", rating: "BUY", signalDate: "2025-03-15", signalPrice: 165.20, theme: "Semiconductors", rationale: "Leading foundry. AI demand structural. Monopoly in advanced nodes.", regime: "Strong Bull" },
  { id: 2, ticker: "ASML", companyName: "ASML Holding", rating: "BUY", signalDate: "2025-03-15", signalPrice: 878.50, theme: "Semiconductors", rationale: "Sole EUV manufacturer. Multi-year backlog.", regime: "Strong Bull" },
  { id: 3, ticker: "LLY", companyName: "Eli Lilly", rating: "BUY", signalDate: "2025-02-20", signalPrice: 730.00, theme: "Healthcare", rationale: "GLP-1 leader. $100B+ obesity TAM.", regime: "Sideways" },
  { id: 4, ticker: "CRWD", companyName: "CrowdStrike", rating: "BUY", signalDate: "2025-03-01", signalPrice: 322.80, theme: "Cybersecurity", rationale: "Endpoint security leader. 97% retention.", regime: "Sideways" },
  { id: 5, ticker: "AMD", companyName: "Advanced Micro Devices", rating: "BUY", signalDate: "2025-04-01", signalPrice: 155.40, theme: "Semiconductors", rationale: "MI300 AI accelerator gaining share.", regime: "Strong Bull" },
  { id: 6, ticker: "AVGO", companyName: "Broadcom", rating: "BUY", signalDate: "2025-04-01", signalPrice: 168.20, theme: "Semiconductors", rationale: "Custom AI chips for Google/Meta.", regime: "Strong Bull" },
  { id: 7, ticker: "PANW", companyName: "Palo Alto Networks", rating: "BUY", signalDate: "2025-04-15", signalPrice: 180.40, theme: "Cybersecurity", rationale: "Platform consolidation leader.", regime: "Strong Bull" },
  { id: 8, ticker: "HLAL", companyName: "Wahed FTSE USA Shariah ETF", rating: "HOLD", signalDate: "2025-01-10", signalPrice: 40.75, theme: "Halal Finance", rationale: "Core Sharia-compliant US equity anchor.", regime: "Sideways" },
  { id: 9, ticker: "2222.SR", companyName: "Saudi Aramco", rating: "HOLD", signalDate: "2025-02-01", signalPrice: 8.02, theme: "Oil & Gas", rationale: "Lowest-cost producer. 4%+ dividend.", regime: "Sideways" },
  { id: 10, ticker: "ABB", companyName: "ABB Ltd", rating: "HOLD", signalDate: "2025-03-15", signalPrice: 50.60, theme: "Industrial Automation", rationale: "Global automation leader. Swiss quality.", regime: "Strong Bull" },
  { id: 11, ticker: "NVO", companyName: "Novo Nordisk (ADR)", rating: "HOLD", signalDate: "2025-02-20", signalPrice: 110.50, theme: "Healthcare", rationale: "GLP-1 pioneer. In correction but fundamentals intact. Using NYSE ADR for AJ Bell compatibility.", regime: "Sideways" },
  { id: 12, ticker: "ENPH", companyName: "Enphase Energy", rating: "REDUCE", signalDate: "2025-05-20", signalPrice: 105.20, theme: "Clean Energy", rationale: "In downtrend. High volatility. Reduce exposure.", regime: "Weak Bull" },
];

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
  // Live prices (null until refreshed)
  const [livePrices, setLivePrices] = useState<Record<string, number>>({});
  const [failedTickers, setFailedTickers] = useState<Set<string>>(new Set());
  const [refreshing, setRefreshing] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState<string | null>(null);
  const [dataMode, setDataMode] = useState<"stored" | "live">("stored");
  const [refreshError, setRefreshError] = useState<string | null>(null);
  const [filterRating, setFilterRating] = useState<string>("ALL");
  const [filterTheme, setFilterTheme] = useState<string>("ALL");
  const [expandedSignal, setExpandedSignal] = useState<number | null>(null);
  const [refreshLog, setRefreshLog] = useState<string[]>([]);

  // Staged prices — demo values from signal period (may be outdated)
  const stagedPrices: Record<string, number> = {
    TSM: 178.52, ASML: 924.30, LLY: 820.40, CRWD: 355.20,
    AMD: 162.30, AVGO: 178.50, PANW: 185.60, HLAL: 42.15,
    "2222.SR": 8.25, ABB: 52.80, NVO: 110.50, ENPH: 98.45,
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
    try {
      const tickers = SIGNAL_RECORDS.map((s) => s.ticker);
      log.push(`Requesting prices for ${tickers.length} tickers: ${tickers.join(", ")}`);

      const res = await fetch(`${API_URL}/api/mock-portfolio/prices/fetch`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tickers }),
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

      // Log failures
      const failed = new Set<string>();
      for (const err of errors) {
        log.push(`  ${err.ticker}: FAILED — ${err.error}`);
        failed.add(err.ticker);
      }
      // Mark tickers not in response as failed
      for (const t of tickers) {
        if (!prices[t] && !failed.has(t)) {
          failed.add(t);
          log.push(`  ${t}: No price returned — using staged fallback`);
        }
      }

      setFailedTickers(failed);

      if (Object.keys(prices).length > 0) {
        setLivePrices(prices);
        setDataMode("live");
        const now = new Date();
        setLastRefreshed(now.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) + " " + now.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }) + " UTC");
        log.push(`Refresh complete at ${new Date().toISOString()}`);
      } else {
        throw new Error("No prices returned");
      }
    } catch (e) {
      log.push(`REFRESH FAILED: ${e}`);
      setRefreshError("Unable to refresh market prices. Showing previously stored recommendation performance.");
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
  const themes = [...new Set(SIGNAL_RECORDS.map((s) => s.theme))];
  const filtered = SIGNAL_RECORDS.filter((s) => {
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

  const bestSignal = [...signalReturns].sort((a, b) => b.returnPct - a.returnPct)[0];
  const worstSignal = [...signalReturns].sort((a, b) => a.returnPct - b.returnPct)[0];

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
          <h1 className="text-2xl font-bold tracking-tight">Recommendation Performance</h1>
          <p className="mt-1 text-sm text-muted-foreground">Historical tracking of research signals — performance since recommendation date</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className={`badge ${dataMode === "live" ? "badge-green" : "badge-amber"}`}>
              {dataMode === "live" ? "● Live Market Data" : "● Stored Recommendation Data"}
            </span>
            {dataMode === "stored" && (
              <p className="mt-1 text-[10px] text-amber-600 dark:text-amber-400">Click refresh for latest market prices.</p>
            )}
            {lastRefreshed && (
              <p className="mt-1 text-[10px] text-muted-foreground">Last Updated: {lastRefreshed}</p>
            )}
          </div>
          <button onClick={refreshPerformance} disabled={refreshing}
            className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-50">
            {refreshing ? `Refreshing ${SIGNAL_RECORDS.length} recommendations...` : "Refresh Performance"}
          </button>
        </div>
      </div>

      {/* Error */}
      {refreshError && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-700 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-400">
          ⚠ {refreshError}
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <div className="card">
          <p className="text-[11px] font-medium uppercase text-muted-foreground">Total BUY Signals</p>
          <p className="mt-1 text-2xl font-bold">{buySignals.length}</p>
        </div>
        <div className="card">
          <p className="text-[11px] font-medium uppercase text-muted-foreground">Avg BUY Return</p>
          <p className={`mt-1 text-2xl font-bold ${avgBuyReturn >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}`}>
            {avgBuyReturn >= 0 ? "+" : ""}{avgBuyReturn.toFixed(1)}%
          </p>
        </div>
        <div className="card">
          <p className="text-[11px] font-medium uppercase text-muted-foreground">Best Signal</p>
          <p className="mt-1 text-lg font-bold">{bestSignal?.ticker}</p>
          <p className="text-xs text-emerald-600 dark:text-emerald-400">+{bestSignal?.returnPct.toFixed(1)}%</p>
        </div>
        <div className="card">
          <p className="text-[11px] font-medium uppercase text-muted-foreground">Worst Signal</p>
          <p className="mt-1 text-lg font-bold">{worstSignal?.ticker}</p>
          <p className={`text-xs ${worstSignal?.returnPct >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}`}>{worstSignal?.returnPct.toFixed(1)}%</p>
        </div>
        <div className="card">
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
      <div className="card">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted-foreground">Average Return by Horizon (BUY Signals)</h2>
        <div className="grid gap-4 sm:grid-cols-5">
          <HorizonAvg label="2 Weeks" days={14} signals={buySignals} getPrice={getCurrentPrice} />
          <HorizonAvg label="1 Month" days={30} signals={buySignals} getPrice={getCurrentPrice} />
          <HorizonAvg label="3 Months" days={90} signals={buySignals} getPrice={getCurrentPrice} />
          <HorizonAvg label="6 Months" days={180} signals={buySignals} getPrice={getCurrentPrice} />
          <HorizonAvg label="1 Year" days={365} signals={buySignals} getPrice={getCurrentPrice} />
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
              <th className="pb-2 pr-3 text-right">2W</th>
              <th className="pb-2 pr-3 text-right">1M</th>
              <th className="pb-2 pr-3 text-right">3M</th>
              <th className="pb-2 pr-3 text-right">6M</th>
              <th className="pb-2 text-right">1Y</th>
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
                  <td className={`py-2.5 pr-3 text-right font-mono font-bold ${source === "staged" ? "text-muted-foreground" : ret >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}`}>
                    {source === "staged" && dataMode === "stored" ? "—" : `${ret >= 0 ? "+" : ""}${ret.toFixed(1)}%`}
                  </td>
                  <td className={`py-2.5 pr-3 text-center text-[10px] font-medium ${sourceColor}`}>{sourceLabel}</td>
                  <td className="py-2.5 pr-3 text-right text-xs">{formatHorizon(s.signalDate, s.signalPrice, s.ticker, 14)}</td>
                  <td className="py-2.5 pr-3 text-right text-xs">{formatHorizon(s.signalDate, s.signalPrice, s.ticker, 30)}</td>
                  <td className="py-2.5 pr-3 text-right text-xs">{formatHorizon(s.signalDate, s.signalPrice, s.ticker, 90)}</td>
                  <td className="py-2.5 pr-3 text-right text-xs">{formatHorizon(s.signalDate, s.signalPrice, s.ticker, 180)}</td>
                  <td className="py-2.5 text-right text-xs">{formatHorizon(s.signalDate, s.signalPrice, s.ticker, 365)}</td>
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
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div><p className="text-[10px] uppercase text-muted-foreground">Signal Date</p><p className="mt-1 text-sm font-medium">{s.signalDate}</p></div>
              <div><p className="text-[10px] uppercase text-muted-foreground">Signal Price</p><p className="mt-1 text-sm font-mono font-medium">${s.signalPrice.toFixed(2)}</p></div>
              <div><p className="text-[10px] uppercase text-muted-foreground">Current Price</p><p className="mt-1 text-sm font-mono font-medium">${price.toFixed(2)}</p></div>
              <div><p className="text-[10px] uppercase text-muted-foreground">Current Return</p><p className={`mt-1 text-sm font-bold ${ret >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}`}>{ret >= 0 ? "+" : ""}{ret.toFixed(1)}%</p></div>
            </div>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
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
    const price = getCurrentPrice(ticker, signalPrice);
    const ret = calcReturn(signalPrice, price);
    return `${ret >= 0 ? "+" : ""}${ret.toFixed(1)}%`;
  }
}

// ── Sub-components ───────────────────────────────────────────────────────────

function HorizonAvg({ label, days, signals, getPrice }: { label: string; days: number; signals: Signal[]; getPrice: (ticker: string, fallback: number) => number }) {
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
