"use client";

import { MOCK_ASSETS, MOCK_THEMES } from "@/data/mock-data";
import type { Asset, Theme } from "@/data/mock-data";

// Static recommendation data (loads instantly)
const LATEST_BUYS = [
  { ticker: "PANW", company: "Palo Alto Networks", theme: "Cybersecurity", signalDate: "2025-04-15", signalPrice: 180.40, currentPrice: 185.60, returnPct: 2.88 },
  { ticker: "AMD", company: "Advanced Micro Devices", theme: "Semiconductors", signalDate: "2025-04-01", signalPrice: 155.40, currentPrice: 162.30, returnPct: 4.44 },
  { ticker: "AVGO", company: "Broadcom", theme: "Semiconductors", signalDate: "2025-04-01", signalPrice: 168.20, currentPrice: 178.50, returnPct: 6.12 },
  { ticker: "TSM", company: "Taiwan Semiconductor", theme: "Semiconductors", signalDate: "2025-03-15", signalPrice: 165.20, currentPrice: 178.52, returnPct: 8.06 },
  { ticker: "CRWD", company: "CrowdStrike", theme: "Cybersecurity", signalDate: "2025-03-01", signalPrice: 322.80, currentPrice: 355.20, returnPct: 10.04 },
];

const THEME_PERFORMANCE = [
  { theme: "Semiconductors", avgReturn: 5.97, count: 4 },
  { theme: "Cybersecurity", avgReturn: 6.46, count: 2 },
  { theme: "Healthcare", avgReturn: 3.09, count: 2 },
  { theme: "Halal Finance", avgReturn: 3.44, count: 1 },
  { theme: "Oil & Gas", avgReturn: 2.87, count: 1 },
  { theme: "Industrial Automation", avgReturn: 4.35, count: 1 },
  { theme: "Clean Energy", avgReturn: -6.42, count: 1 },
];

export default function DashboardPage() {
  const approved = MOCK_ASSETS.filter((a) => a.eligibilityStatus === "approved");
  const watchlist = MOCK_ASSETS.filter((a) => a.eligibilityStatus === "watchlist");
  const rejected = MOCK_ASSETS.filter((a) => a.eligibilityStatus === "rejected");

  const avgBuyReturn = LATEST_BUYS.reduce((sum, b) => sum + b.returnPct, 0) / LATEST_BUYS.length;
  const bestSignal = [...LATEST_BUYS].sort((a, b) => b.returnPct - a.returnPct)[0];
  const worstSignal = [...LATEST_BUYS].sort((a, b) => a.returnPct - b.returnPct)[0];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Intelligence Dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Ethical investment intelligence — recommendation tracking and research
        </p>
      </div>

      {/* Recommendation Performance Summary */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="card">
          <p className="text-[11px] font-medium uppercase text-muted-foreground">Active BUY Signals</p>
          <p className="mt-1 text-2xl font-bold">7</p>
          <p className="mt-1 text-xs text-muted-foreground">Since Feb 2025</p>
        </div>
        <div className="card">
          <p className="text-[11px] font-medium uppercase text-muted-foreground">Avg BUY Return</p>
          <p className="mt-1 text-2xl font-bold text-emerald-600 dark:text-emerald-400">+{avgBuyReturn.toFixed(1)}%</p>
          <p className="mt-1 text-xs text-muted-foreground">Performance since signal</p>
        </div>
        <div className="card">
          <p className="text-[11px] font-medium uppercase text-muted-foreground">Best Signal</p>
          <p className="mt-1 text-lg font-bold">{bestSignal.ticker}</p>
          <p className="text-xs text-emerald-600 dark:text-emerald-400">+{bestSignal.returnPct.toFixed(1)}% since {bestSignal.signalDate}</p>
        </div>
        <div className="card">
          <p className="text-[11px] font-medium uppercase text-muted-foreground">Market Regime</p>
          <p className="mt-1 text-lg font-bold text-blue-600 dark:text-blue-400">Weak Bull</p>
          <p className="text-xs text-muted-foreground">Quality + Defensive posture</p>
        </div>
      </div>

      {/* Latest BUY Recommendations */}
      <div className="card">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Latest BUY Recommendations
        </h2>
        <div className="space-y-3">
          {LATEST_BUYS.map((rec) => (
            <div key={rec.ticker} className="flex items-center gap-4 rounded-lg border border-border p-3 dark:border-border-dark">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm font-bold">{rec.ticker}</span>
                  <span className="text-sm text-foreground">{rec.company}</span>
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] text-slate-600 dark:bg-slate-800 dark:text-slate-400">{rec.theme}</span>
                </div>
                <p className="mt-0.5 text-[10px] text-muted-foreground">Signal: {rec.signalDate} at ${rec.signalPrice.toFixed(2)}</p>
              </div>
              <div className="text-right">
                <p className={`text-sm font-bold ${rec.returnPct >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}`}>
                  {rec.returnPct >= 0 ? "+" : ""}{rec.returnPct.toFixed(1)}%
                </p>
                <p className="text-[10px] text-muted-foreground">since signal</p>
              </div>
              <span className="badge badge-green">BUY</span>
            </div>
          ))}
        </div>
      </div>

      {/* Theme Performance */}
      <div className="card">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Performance by Theme
        </h2>
        <div className="space-y-2">
          {THEME_PERFORMANCE.map(({ theme, avgReturn, count }) => (
            <div key={theme} className="flex items-center gap-3">
              <span className="w-40 text-sm">{theme}</span>
              <div className="flex-1">
                <div className="h-3 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                  <div className={`h-full rounded-full ${avgReturn >= 0 ? "bg-emerald-500" : "bg-red-500"}`}
                    style={{ width: `${Math.min(Math.abs(avgReturn) * 5, 100)}%` }} />
                </div>
              </div>
              <span className={`w-14 text-right text-sm font-bold ${avgReturn >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}`}>
                {avgReturn >= 0 ? "+" : ""}{avgReturn.toFixed(1)}%
              </span>
              <span className="w-6 text-right text-[10px] text-muted-foreground">{count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Screening Summary */}
      <div className="card">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Screening Summary
        </h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-lg bg-emerald-50 p-4 text-center dark:bg-emerald-950/30">
            <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{approved.length}</p>
            <p className="text-xs text-muted-foreground">Approved</p>
          </div>
          <div className="rounded-lg bg-amber-50 p-4 text-center dark:bg-amber-950/30">
            <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">{watchlist.length}</p>
            <p className="text-xs text-muted-foreground">Watchlist</p>
          </div>
          <div className="rounded-lg bg-red-50 p-4 text-center dark:bg-red-950/30">
            <p className="text-2xl font-bold text-red-600 dark:text-red-400">{rejected.length}</p>
            <p className="text-xs text-muted-foreground">Rejected</p>
          </div>
        </div>
      </div>

      {/* Recent Research Notes */}
      <div className="card">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Recent Research Notes
        </h2>
        <div className="space-y-3">
          <ResearchNote date="2025-05-25" title="Regime Change: Strong Bull → Weak Bull" content="Breadth narrowing to 55%. VIX rising. Adjusting posture to quality + defensive. Increasing cash target to 20%." />
          <ResearchNote date="2025-05-20" title="NVDA Rejected — Israel Exposure" content="NVIDIA fails hard exclusion due to Mellanox acquisition. 3,000+ employees in Israel R&D. Permanent rejection." />
          <ResearchNote date="2025-04-15" title="PANW Added — BUY Signal" content="Palo Alto Networks platform consolidation thesis. Non-discretionary cybersecurity spend. Strong enterprise pipeline." />
          <ResearchNote date="2025-04-01" title="AMD & AVGO — BUY Signals" content="MI300 AI accelerator gaining share (AMD). Custom AI chips for hyperscalers (AVGO). Both pass eligibility screening." />
        </div>
      </div>

      {/* Disclaimer */}
      <div className="border-t border-border pt-4 text-center text-xs text-muted-foreground dark:border-border-dark">
        Past performance does not guarantee future results. Nür Capital provides research intelligence, not financial advice.
      </div>
    </div>
  );
}

function ResearchNote({ date, title, content }: { date: string; title: string; content: string }) {
  return (
    <div className="rounded-lg border border-border/50 p-3 dark:border-border-dark/50">
      <div className="flex items-center gap-2">
        <span className="text-[10px] text-muted-foreground">{date}</span>
        <span className="text-sm font-medium">{title}</span>
      </div>
      <p className="mt-1 text-xs text-muted-foreground">{content}</p>
    </div>
  );
}
