"use client";

import { useState } from "react";

// ── Signal Performance Tracker ───────────────────────────────────────────────

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
  regime: string;
  returns: {
    current: number;
    twoWeek: number | null;
    oneMonth: number | null;
    threeMonth: number | null;
    sixMonth: number | null;
    oneYear: number | null;
  };
}

// Seeded historical signals (frozen at signal date)
const SIGNALS: Signal[] = [
  { id: 1, ticker: "TSM", companyName: "Taiwan Semiconductor", rating: "BUY", signalDate: "2025-03-15", signalPrice: 165.20, currentPrice: 178.52, theme: "Semiconductors", rationale: "Leading foundry. AI demand structural. Monopoly in advanced nodes.", regime: "strong_bull", returns: { current: 8.06, twoWeek: 3.2, oneMonth: 5.1, threeMonth: 8.06, sixMonth: null, oneYear: null } },
  { id: 2, ticker: "ASML", companyName: "ASML Holding", rating: "BUY", signalDate: "2025-03-15", signalPrice: 878.50, currentPrice: 924.30, theme: "Semiconductors", rationale: "Sole EUV manufacturer. Multi-year backlog. No competitor within decade.", regime: "strong_bull", returns: { current: 5.21, twoWeek: 2.1, oneMonth: 3.4, threeMonth: 5.21, sixMonth: null, oneYear: null } },
  { id: 3, ticker: "LLY", companyName: "Eli Lilly", rating: "BUY", signalDate: "2025-02-20", signalPrice: 730.00, currentPrice: 820.40, theme: "Healthcare", rationale: "GLP-1 leader. $100B+ obesity TAM. Strongest pharma pipeline.", regime: "sideways", returns: { current: 12.38, twoWeek: 4.5, oneMonth: 6.8, threeMonth: 12.38, sixMonth: null, oneYear: null } },
  { id: 4, ticker: "CRWD", companyName: "CrowdStrike", rating: "BUY", signalDate: "2025-03-01", signalPrice: 322.80, currentPrice: 355.20, theme: "Cybersecurity", rationale: "Endpoint security leader. Non-discretionary spend. 97% retention.", regime: "sideways", returns: { current: 10.04, twoWeek: 3.8, oneMonth: 5.5, threeMonth: 10.04, sixMonth: null, oneYear: null } },
  { id: 5, ticker: "AMD", companyName: "Advanced Micro Devices", rating: "BUY", signalDate: "2025-04-01", signalPrice: 155.40, currentPrice: 162.30, theme: "Semiconductors", rationale: "MI300 AI accelerator gaining share. Clean alternative to NVIDIA.", regime: "strong_bull", returns: { current: 4.44, twoWeek: 1.8, oneMonth: 4.44, threeMonth: null, sixMonth: null, oneYear: null } },
  { id: 6, ticker: "AVGO", companyName: "Broadcom", rating: "BUY", signalDate: "2025-04-01", signalPrice: 168.20, currentPrice: 178.50, theme: "Semiconductors", rationale: "Custom AI chips for Google/Meta. Networking dominance.", regime: "strong_bull", returns: { current: 6.12, twoWeek: 2.4, oneMonth: 6.12, threeMonth: null, sixMonth: null, oneYear: null } },
  { id: 7, ticker: "PANW", companyName: "Palo Alto Networks", rating: "BUY", signalDate: "2025-04-15", signalPrice: 180.40, currentPrice: 185.60, theme: "Cybersecurity", rationale: "Platform consolidation leader. Strong enterprise pipeline.", regime: "strong_bull", returns: { current: 2.88, twoWeek: 1.5, oneMonth: 2.88, threeMonth: null, sixMonth: null, oneYear: null } },
  { id: 8, ticker: "HLAL", companyName: "Wahed FTSE USA Shariah ETF", rating: "HOLD", signalDate: "2025-01-10", signalPrice: 40.75, currentPrice: 42.15, theme: "Halal Finance", rationale: "Core Sharia-compliant US equity anchor. Low-cost diversification.", regime: "sideways", returns: { current: 3.44, twoWeek: 0.8, oneMonth: 1.2, threeMonth: 2.5, sixMonth: null, oneYear: null } },
  { id: 9, ticker: "2222.SR", companyName: "Saudi Aramco", rating: "HOLD", signalDate: "2025-02-01", signalPrice: 8.02, currentPrice: 8.25, theme: "Oil & Gas", rationale: "Lowest-cost producer. 4%+ dividend. Energy security.", regime: "sideways", returns: { current: 2.87, twoWeek: 0.5, oneMonth: 1.1, threeMonth: 2.87, sixMonth: null, oneYear: null } },
  { id: 10, ticker: "ABB", companyName: "ABB Ltd", rating: "HOLD", signalDate: "2025-03-15", signalPrice: 50.60, currentPrice: 52.80, theme: "Industrial Automation", rationale: "Global automation leader. Defensive industrial. Swiss quality.", regime: "strong_bull", returns: { current: 4.35, twoWeek: 1.2, oneMonth: 2.8, threeMonth: 4.35, sixMonth: null, oneYear: null } },
  { id: 11, ticker: "NOVO-B", companyName: "Novo Nordisk", rating: "HOLD", signalDate: "2025-02-20", signalPrice: 137.00, currentPrice: 128.50, theme: "Healthcare", rationale: "GLP-1 pioneer. In correction but fundamentals intact.", regime: "sideways", returns: { current: -6.20, twoWeek: -2.1, oneMonth: -3.8, threeMonth: -6.20, sixMonth: null, oneYear: null } },
  { id: 12, ticker: "ENPH", companyName: "Enphase Energy", rating: "REDUCE", signalDate: "2025-05-20", signalPrice: 105.20, currentPrice: 98.45, theme: "Clean Energy", rationale: "Solar microinverter leader but in downtrend. High volatility.", regime: "weak_bull", returns: { current: -6.42, twoWeek: -3.1, oneMonth: null, threeMonth: null, sixMonth: null, oneYear: null } },
];

type FilterRating = "ALL" | "BUY" | "HOLD" | "REDUCE" | "WATCHLIST";
type FilterTheme = "ALL" | string;

export default function ResearchPage() {
  const [filterRating, setFilterRating] = useState<FilterRating>("ALL");
  const [filterTheme, setFilterTheme] = useState<FilterTheme>("ALL");

  const themes = [...new Set(SIGNALS.map((s) => s.theme))];
  const filtered = SIGNALS.filter((s) => {
    if (filterRating !== "ALL" && s.rating !== filterRating) return false;
    if (filterTheme !== "ALL" && s.theme !== filterTheme) return false;
    return true;
  });

  // Aggregate stats
  const buySignals = SIGNALS.filter((s) => s.rating === "BUY");
  const holdSignals = SIGNALS.filter((s) => s.rating === "HOLD");
  const reduceSignals = SIGNALS.filter((s) => s.rating === "REDUCE");

  const avgReturn = (signals: Signal[]) => {
    if (signals.length === 0) return 0;
    return signals.reduce((sum, s) => sum + s.returns.current, 0) / signals.length;
  };

  const avgHorizon = (signals: Signal[], key: keyof Signal["returns"]) => {
    const valid = signals.filter((s) => s.returns[key] !== null);
    if (valid.length === 0) return null;
    return valid.reduce((sum, s) => sum + (s.returns[key] as number), 0) / valid.length;
  };

  const ratingColors: Record<string, string> = { BUY: "badge-green", HOLD: "badge-blue", REDUCE: "badge-amber", WATCHLIST: "badge-gray" };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Recommendation Performance</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Track how Nür Capital research signals perform over time
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryCard label="BUY Signals" count={buySignals.length} avgReturn={avgReturn(buySignals)} />
        <SummaryCard label="HOLD Signals" count={holdSignals.length} avgReturn={avgReturn(holdSignals)} />
        <SummaryCard label="REDUCE Signals" count={reduceSignals.length} avgReturn={avgReturn(reduceSignals)} />
        <div className="card">
          <p className="text-[11px] font-medium uppercase text-muted-foreground">Total Signals</p>
          <p className="mt-1 text-2xl font-bold">{SIGNALS.length}</p>
          <p className="mt-1 text-xs text-muted-foreground">Since Jan 2025</p>
        </div>
      </div>

      {/* Performance by Horizon */}
      <div className="card">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted-foreground">Average Return by Horizon (BUY signals)</h2>
        <div className="grid gap-4 sm:grid-cols-5">
          <HorizonCard label="2 Weeks" value={avgHorizon(buySignals, "twoWeek")} />
          <HorizonCard label="1 Month" value={avgHorizon(buySignals, "oneMonth")} />
          <HorizonCard label="3 Months" value={avgHorizon(buySignals, "threeMonth")} />
          <HorizonCard label="6 Months" value={avgHorizon(buySignals, "sixMonth")} />
          <HorizonCard label="1 Year" value={avgHorizon(buySignals, "oneYear")} />
        </div>
      </div>

      {/* Performance by Theme */}
      <div className="card">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted-foreground">Performance by Theme</h2>
        <div className="space-y-2">
          {themes.map((theme) => {
            const themeSignals = SIGNALS.filter((s) => s.theme === theme);
            const avg = avgReturn(themeSignals);
            return (
              <div key={theme} className="flex items-center gap-3">
                <span className="w-40 text-sm">{theme}</span>
                <div className="flex-1">
                  <div className="h-3 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                    <div className={`h-full rounded-full ${avg >= 0 ? "bg-emerald-500" : "bg-red-500"}`} style={{ width: `${Math.min(Math.abs(avg) * 3, 100)}%` }} />
                  </div>
                </div>
                <span className={`w-16 text-right text-sm font-bold ${avg >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}`}>
                  {avg >= 0 ? "+" : ""}{avg.toFixed(1)}%
                </span>
                <span className="w-8 text-right text-xs text-muted-foreground">{themeSignals.length}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <select value={filterRating} onChange={(e) => setFilterRating(e.target.value as FilterRating)}
          className="rounded-lg border border-border bg-panel px-3 py-2 text-sm dark:border-border-dark dark:bg-panel-dark">
          <option value="ALL">All Ratings</option>
          <option value="BUY">BUY only</option>
          <option value="HOLD">HOLD only</option>
          <option value="REDUCE">REDUCE only</option>
        </select>
        <select value={filterTheme} onChange={(e) => setFilterTheme(e.target.value)}
          className="rounded-lg border border-border bg-panel px-3 py-2 text-sm dark:border-border-dark dark:bg-panel-dark">
          <option value="ALL">All Themes</option>
          {themes.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
        <span className="self-center text-xs text-muted-foreground">{filtered.length} signals shown</span>
      </div>

      {/* Signal History Table */}
      <div className="card overflow-x-auto">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted-foreground">Individual Signal History</h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-[11px] uppercase text-muted-foreground dark:border-border-dark">
              <th className="pb-2 pr-3">Asset</th>
              <th className="pb-2 pr-3">Rating</th>
              <th className="pb-2 pr-3">Date</th>
              <th className="pb-2 pr-3 text-right">Signal Price</th>
              <th className="pb-2 pr-3 text-right">Current</th>
              <th className="pb-2 pr-3 text-right">Return</th>
              <th className="pb-2 pr-3 text-right">2W</th>
              <th className="pb-2 pr-3 text-right">1M</th>
              <th className="pb-2 text-right">3M</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((s) => (
              <tr key={s.id} className="border-b border-border/30 dark:border-border-dark/30">
                <td className="py-2.5 pr-3">
                  <span className="font-mono font-bold">{s.ticker}</span>
                  <span className="ml-2 hidden text-muted-foreground lg:inline">{s.companyName}</span>
                  <div className="text-[10px] text-muted-foreground">{s.theme}</div>
                </td>
                <td className="py-2.5 pr-3"><span className={`badge ${ratingColors[s.rating]}`}>{s.rating}</span></td>
                <td className="py-2.5 pr-3 text-xs">{s.signalDate}</td>
                <td className="py-2.5 pr-3 text-right font-mono">${s.signalPrice.toFixed(2)}</td>
                <td className="py-2.5 pr-3 text-right font-mono">${s.currentPrice.toFixed(2)}</td>
                <td className={`py-2.5 pr-3 text-right font-bold ${s.returns.current >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}`}>
                  {s.returns.current >= 0 ? "+" : ""}{s.returns.current.toFixed(1)}%
                </td>
                <td className="py-2.5 pr-3 text-right text-xs">{s.returns.twoWeek !== null ? `${s.returns.twoWeek >= 0 ? "+" : ""}${s.returns.twoWeek.toFixed(1)}%` : "—"}</td>
                <td className="py-2.5 pr-3 text-right text-xs">{s.returns.oneMonth !== null ? `${s.returns.oneMonth >= 0 ? "+" : ""}${s.returns.oneMonth.toFixed(1)}%` : "—"}</td>
                <td className="py-2.5 text-right text-xs">{s.returns.threeMonth !== null ? `${s.returns.threeMonth >= 0 ? "+" : ""}${s.returns.threeMonth.toFixed(1)}%` : "Pending"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Disclaimer */}
      <div className="rounded-lg border border-border bg-slate-50 p-4 text-center dark:border-border-dark dark:bg-slate-800/50">
        <p className="text-xs text-muted-foreground">
          Past performance does not guarantee future results. Nür Capital provides research intelligence, not financial advice.
          Signal returns are calculated from the date the recommendation was issued using available market prices.
        </p>
      </div>
    </div>
  );
}

// ── Sub-components ───────────────────────────────────────────────────────────

function SummaryCard({ label, count, avgReturn }: { label: string; count: number; avgReturn: number }) {
  return (
    <div className="card">
      <p className="text-[11px] font-medium uppercase text-muted-foreground">{label}</p>
      <p className="mt-1 text-2xl font-bold">{count}</p>
      <p className={`mt-1 text-sm font-medium ${avgReturn >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}`}>
        Avg: {avgReturn >= 0 ? "+" : ""}{avgReturn.toFixed(1)}%
      </p>
    </div>
  );
}

function HorizonCard({ label, value }: { label: string; value: number | null }) {
  if (value === null) return (
    <div className="text-center">
      <p className="text-[10px] uppercase text-muted-foreground">{label}</p>
      <p className="mt-1 text-lg font-bold text-muted-foreground">Pending</p>
    </div>
  );
  return (
    <div className="text-center">
      <p className="text-[10px] uppercase text-muted-foreground">{label}</p>
      <p className={`mt-1 text-lg font-bold ${value >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}`}>
        {value >= 0 ? "+" : ""}{value.toFixed(1)}%
      </p>
    </div>
  );
}
