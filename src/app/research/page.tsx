"use client";

import { useState } from "react";

// ── Static Signal Records (loads instantly, no API call) ─────────────────────

interface Signal {
  id: number;
  ticker: string;
  companyName: string;
  rating: "BUY" | "HOLD" | "REDUCE" | "WATCHLIST";
  signalDate: string;
  signalPrice: number;
  currentPrice: number;
  theme: string;
  rationale: string;
  returns: {
    twoWeek: number | null;
    oneMonth: number | null;
    threeMonth: number | null;
    sixMonth: number | null;
    oneYear: number | null;
  };
}

const SIGNALS: Signal[] = [
  { id: 1, ticker: "TSM", companyName: "Taiwan Semiconductor", rating: "BUY", signalDate: "2025-03-15", signalPrice: 165.20, currentPrice: 178.52, theme: "Semiconductors", rationale: "Leading foundry. AI demand structural. Monopoly in advanced nodes.", returns: { twoWeek: 3.2, oneMonth: 5.1, threeMonth: 8.06, sixMonth: null, oneYear: null } },
  { id: 2, ticker: "ASML", companyName: "ASML Holding", rating: "BUY", signalDate: "2025-03-15", signalPrice: 878.50, currentPrice: 924.30, theme: "Semiconductors", rationale: "Sole EUV manufacturer. Multi-year backlog.", returns: { twoWeek: 2.1, oneMonth: 3.4, threeMonth: 5.21, sixMonth: null, oneYear: null } },
  { id: 3, ticker: "LLY", companyName: "Eli Lilly", rating: "BUY", signalDate: "2025-02-20", signalPrice: 730.00, currentPrice: 820.40, theme: "Healthcare", rationale: "GLP-1 leader. $100B+ obesity TAM.", returns: { twoWeek: 4.5, oneMonth: 6.8, threeMonth: 12.38, sixMonth: null, oneYear: null } },
  { id: 4, ticker: "CRWD", companyName: "CrowdStrike", rating: "BUY", signalDate: "2025-03-01", signalPrice: 322.80, currentPrice: 355.20, theme: "Cybersecurity", rationale: "Endpoint security leader. 97% retention.", returns: { twoWeek: 3.8, oneMonth: 5.5, threeMonth: 10.04, sixMonth: null, oneYear: null } },
  { id: 5, ticker: "AMD", companyName: "Advanced Micro Devices", rating: "BUY", signalDate: "2025-04-01", signalPrice: 155.40, currentPrice: 162.30, theme: "Semiconductors", rationale: "MI300 AI accelerator gaining share.", returns: { twoWeek: 1.8, oneMonth: 4.44, threeMonth: null, sixMonth: null, oneYear: null } },
  { id: 6, ticker: "AVGO", companyName: "Broadcom", rating: "BUY", signalDate: "2025-04-01", signalPrice: 168.20, currentPrice: 178.50, theme: "Semiconductors", rationale: "Custom AI chips for Google/Meta.", returns: { twoWeek: 2.4, oneMonth: 6.12, threeMonth: null, sixMonth: null, oneYear: null } },
  { id: 7, ticker: "PANW", companyName: "Palo Alto Networks", rating: "BUY", signalDate: "2025-04-15", signalPrice: 180.40, currentPrice: 185.60, theme: "Cybersecurity", rationale: "Platform consolidation leader.", returns: { twoWeek: 1.5, oneMonth: 2.88, threeMonth: null, sixMonth: null, oneYear: null } },
  { id: 8, ticker: "HLAL", companyName: "Wahed FTSE USA Shariah ETF", rating: "HOLD", signalDate: "2025-01-10", signalPrice: 40.75, currentPrice: 42.15, theme: "Halal Finance", rationale: "Core Sharia-compliant US equity anchor.", returns: { twoWeek: 0.8, oneMonth: 1.2, threeMonth: 2.5, sixMonth: null, oneYear: null } },
  { id: 9, ticker: "2222.SR", companyName: "Saudi Aramco", rating: "HOLD", signalDate: "2025-02-01", signalPrice: 8.02, currentPrice: 8.25, theme: "Oil & Gas", rationale: "Lowest-cost producer. 4%+ dividend.", returns: { twoWeek: 0.5, oneMonth: 1.1, threeMonth: 2.87, sixMonth: null, oneYear: null } },
  { id: 10, ticker: "ABB", companyName: "ABB Ltd", rating: "HOLD", signalDate: "2025-03-15", signalPrice: 50.60, currentPrice: 52.80, theme: "Industrial Automation", rationale: "Global automation leader. Swiss quality.", returns: { twoWeek: 1.2, oneMonth: 2.8, threeMonth: 4.35, sixMonth: null, oneYear: null } },
  { id: 11, ticker: "NOVO-B", companyName: "Novo Nordisk", rating: "HOLD", signalDate: "2025-02-20", signalPrice: 137.00, currentPrice: 128.50, theme: "Healthcare", rationale: "GLP-1 pioneer. In correction but fundamentals intact.", returns: { twoWeek: -2.1, oneMonth: -3.8, threeMonth: -6.20, sixMonth: null, oneYear: null } },
  { id: 12, ticker: "ENPH", companyName: "Enphase Energy", rating: "REDUCE", signalDate: "2025-05-20", signalPrice: 105.20, currentPrice: 98.45, theme: "Clean Energy", rationale: "In downtrend. High volatility. Reduce exposure.", returns: { twoWeek: -3.1, oneMonth: null, threeMonth: null, sixMonth: null, oneYear: null } },
];

// ── Component ────────────────────────────────────────────────────────────────

export default function ResearchPage() {
  const [signals, setSignals] = useState<Signal[]>(SIGNALS);
  const [refreshing, setRefreshing] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState<string | null>(null);
  const [dataMode, setDataMode] = useState<"stored" | "live">("stored");
  const [refreshError, setRefreshError] = useState<string | null>(null);
  const [filterRating, setFilterRating] = useState<string>("ALL");
  const [filterTheme, setFilterTheme] = useState<string>("ALL");

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  const refreshPerformance = async () => {
    setRefreshing(true);
    setRefreshError(null);
    try {
      const tickers = signals.map((s) => s.ticker);
      const res = await fetch(`${API_URL}/api/mock-portfolio/prices/refresh`, { method: "POST" });
      if (!res.ok) throw new Error("Backend unavailable");
      const json = await res.json();
      const prices = json.prices || {};

      setSignals((prev) =>
        prev.map((s) => {
          const livePrice = prices[s.ticker];
          if (livePrice) {
            const currentReturn = ((livePrice - s.signalPrice) / s.signalPrice) * 100;
            return { ...s, currentPrice: livePrice };
          }
          return s;
        })
      );
      setDataMode("live");
      setLastRefreshed(new Date().toLocaleString());
    } catch {
      setRefreshError("Could not fetch live prices. Showing stored signal data.");
    }
    setRefreshing(false);
  };

  // Calculations
  const currentReturn = (s: Signal) => ((s.currentPrice - s.signalPrice) / s.signalPrice) * 100;

  const themes = [...new Set(signals.map((s) => s.theme))];
  const filtered = signals.filter((s) => {
    if (filterRating !== "ALL" && s.rating !== filterRating) return false;
    if (filterTheme !== "ALL" && s.theme !== filterTheme) return false;
    return true;
  });

  const buySignals = signals.filter((s) => s.rating === "BUY");
  const avgBuyReturn = buySignals.length > 0 ? buySignals.reduce((sum, s) => sum + currentReturn(s), 0) / buySignals.length : 0;
  const bestSignal = [...signals].sort((a, b) => currentReturn(b) - currentReturn(a))[0];
  const worstSignal = [...signals].sort((a, b) => currentReturn(a) - currentReturn(b))[0];

  const themePerformance = themes.map((theme) => {
    const ts = signals.filter((s) => s.theme === theme);
    const avg = ts.reduce((sum, s) => sum + currentReturn(s), 0) / ts.length;
    return { theme, avg, count: ts.length };
  }).sort((a, b) => b.avg - a.avg);

  const bestTheme = themePerformance[0];

  const ratingColors: Record<string, string> = { BUY: "badge-green", HOLD: "badge-blue", REDUCE: "badge-amber", WATCHLIST: "badge-gray" };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Recommendation Performance</h1>
          <p className="mt-1 text-sm text-muted-foreground">Historical tracking of Nür Capital research signals</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className={`badge ${dataMode === "live" ? "badge-green" : "badge-amber"}`}>
              {dataMode === "live" ? "● Live Price Refreshed" : "● Stored Signal Data"}
            </span>
            {dataMode === "stored" && (
              <p className="mt-1 text-[10px] text-amber-600 dark:text-amber-400">Prices from signal date. Click refresh for latest.</p>
            )}
            {lastRefreshed && (
              <p className="mt-1 text-[10px] text-muted-foreground">Last updated: {lastRefreshed}</p>
            )}
          </div>
          <button onClick={refreshPerformance} disabled={refreshing}
            className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-50">
            {refreshing ? "Refreshing..." : "Refresh Performance"}
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
          <p className="text-xs text-emerald-600 dark:text-emerald-400">+{currentReturn(bestSignal).toFixed(1)}%</p>
        </div>
        <div className="card">
          <p className="text-[11px] font-medium uppercase text-muted-foreground">Worst Signal</p>
          <p className="mt-1 text-lg font-bold">{worstSignal?.ticker}</p>
          <p className="text-xs text-red-600 dark:text-red-400">{currentReturn(worstSignal).toFixed(1)}%</p>
        </div>
        <div className="card">
          <p className="text-[11px] font-medium uppercase text-muted-foreground">Best Theme</p>
          <p className="mt-1 text-lg font-bold">{bestTheme?.theme}</p>
          <p className="text-xs text-emerald-600 dark:text-emerald-400">+{bestTheme?.avg.toFixed(1)}%</p>
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

      {/* Horizon Averages (BUY signals only) */}
      <div className="card">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted-foreground">Average Return by Horizon (BUY Signals)</h2>
        <div className="grid gap-4 sm:grid-cols-5">
          <HorizonAvg label="2 Weeks" signals={buySignals} field="twoWeek" />
          <HorizonAvg label="1 Month" signals={buySignals} field="oneMonth" />
          <HorizonAvg label="3 Months" signals={buySignals} field="threeMonth" />
          <HorizonAvg label="6 Months" signals={buySignals} field="sixMonth" />
          <HorizonAvg label="1 Year" signals={buySignals} field="oneYear" />
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
        <span className="self-center text-xs text-muted-foreground">{filtered.length} signals</span>
      </div>

      {/* Signal Table */}
      <div className="card overflow-x-auto">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted-foreground">Individual Signal History</h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-[11px] uppercase text-muted-foreground dark:border-border-dark">
              <th className="pb-2 pr-3">Signal Date</th>
              <th className="pb-2 pr-3">Asset</th>
              <th className="pb-2 pr-3">Theme</th>
              <th className="pb-2 pr-3">Rating</th>
              <th className="pb-2 pr-3 text-right">Signal Price</th>
              <th className="pb-2 pr-3 text-right">Current Price</th>
              <th className="pb-2 pr-3 text-right">Current Return</th>
              <th className="pb-2 pr-3 text-right">2W</th>
              <th className="pb-2 pr-3 text-right">1M</th>
              <th className="pb-2 pr-3 text-right">3M</th>
              <th className="pb-2 pr-3 text-right">6M</th>
              <th className="pb-2 text-right">1Y</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((s) => {
              const ret = currentReturn(s);
              return (
                <tr key={s.id} className="border-b border-border/30 dark:border-border-dark/30">
                  <td className="py-2.5 pr-3 text-xs">{s.signalDate}</td>
                  <td className="py-2.5 pr-3">
                    <span className="font-mono font-bold">{s.ticker}</span>
                    <span className="ml-1 hidden text-muted-foreground lg:inline">{s.companyName}</span>
                  </td>
                  <td className="py-2.5 pr-3 text-xs">{s.theme}</td>
                  <td className="py-2.5 pr-3"><span className={`badge ${ratingColors[s.rating]}`}>{s.rating}</span></td>
                  <td className="py-2.5 pr-3 text-right font-mono">${s.signalPrice.toFixed(2)}</td>
                  <td className="py-2.5 pr-3 text-right font-mono">${s.currentPrice.toFixed(2)}</td>
                  <td className={`py-2.5 pr-3 text-right font-mono font-bold ${ret >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}`}>
                    {ret >= 0 ? "+" : ""}{ret.toFixed(1)}%
                  </td>
                  <td className="py-2.5 pr-3 text-right text-xs">{formatHorizon(s.returns.twoWeek)}</td>
                  <td className="py-2.5 pr-3 text-right text-xs">{formatHorizon(s.returns.oneMonth)}</td>
                  <td className="py-2.5 pr-3 text-right text-xs">{formatHorizon(s.returns.threeMonth)}</td>
                  <td className="py-2.5 pr-3 text-right text-xs">{formatHorizon(s.returns.sixMonth)}</td>
                  <td className="py-2.5 text-right text-xs">{formatHorizon(s.returns.oneYear)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Disclaimer */}
      <div className="rounded-lg border border-border bg-slate-50 p-4 text-center dark:border-border-dark dark:bg-slate-800/50">
        <p className="text-xs text-muted-foreground">
          Past performance does not guarantee future results. Nür Capital provides research intelligence, not financial advice.
          Returns are calculated from the date each recommendation was issued using available market prices.
        </p>
      </div>
    </div>
  );
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function formatHorizon(value: number | null): string {
  if (value === null) return "Pending";
  return `${value >= 0 ? "+" : ""}${value.toFixed(1)}%`;
}

function HorizonAvg({ label, signals, field }: { label: string; signals: Signal[]; field: keyof Signal["returns"] }) {
  const valid = signals.filter((s) => s.returns[field] !== null);
  if (valid.length === 0) return (
    <div className="text-center">
      <p className="text-[10px] uppercase text-muted-foreground">{label}</p>
      <p className="mt-1 text-lg font-bold text-muted-foreground">Pending</p>
      <p className="text-[10px] text-muted-foreground">0/{signals.length} matured</p>
    </div>
  );
  const avg = valid.reduce((sum, s) => sum + (s.returns[field] as number), 0) / valid.length;
  return (
    <div className="text-center">
      <p className="text-[10px] uppercase text-muted-foreground">{label}</p>
      <p className={`mt-1 text-lg font-bold ${avg >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}`}>
        {avg >= 0 ? "+" : ""}{avg.toFixed(1)}%
      </p>
      <p className="text-[10px] text-muted-foreground">{valid.length}/{signals.length} matured</p>
    </div>
  );
}
