"use client";

import { useState } from "react";

// ── Theme Data ───────────────────────────────────────────────────────────────

interface ThemeSignal {
  ticker: string;
  company: string;
  rating: "BUY" | "HOLD" | "REDUCE";
  signalDate: string;
  signalPrice: number;
  currentPrice: number;
}

interface ThemeData {
  name: string;
  description: string;
  thesis: string;
  status: "STRONG" | "NEUTRAL" | "WEAK";
  approvedAssets: number;
  signals: ThemeSignal[];
  horizons: { oneMonth: number | null; threeMonth: number | null; sixMonth: number | null; oneYear: number | null };
  researchNotes: string[];
}

const THEMES: ThemeData[] = [
  {
    name: "Semiconductors",
    description: "AI and chip infrastructure — design, fabrication, and equipment",
    thesis: "AI training demand drives structural growth in advanced chip manufacturing. Supply is concentrated in few players with extreme barriers to entry. CHIPS Act reshoring creates multi-year capex cycle.",
    status: "STRONG",
    approvedAssets: 5,
    signals: [
      { ticker: "TSM", company: "Taiwan Semiconductor", rating: "BUY", signalDate: "2025-03-15", signalPrice: 165.20, currentPrice: 178.52 },
      { ticker: "ASML", company: "ASML Holding", rating: "BUY", signalDate: "2025-03-15", signalPrice: 878.50, currentPrice: 924.30 },
      { ticker: "AMD", company: "Advanced Micro Devices", rating: "BUY", signalDate: "2025-04-01", signalPrice: 155.40, currentPrice: 162.30 },
      { ticker: "AVGO", company: "Broadcom", rating: "BUY", signalDate: "2025-04-01", signalPrice: 168.20, currentPrice: 178.50 },
    ],
    horizons: { oneMonth: 4.2, threeMonth: 6.0, sixMonth: null, oneYear: null },
    researchNotes: ["Semiconductor AI Demand: Structural, Not Cyclical (Apr 2025)", "Hyperscaler capex confirms multi-year buildout"],
  },
  {
    name: "Cybersecurity",
    description: "Network security, identity, and threat detection platforms",
    thesis: "Cybersecurity spend is non-discretionary and grows regardless of economic conditions. Platform consolidation trend favours leaders who replace multiple point solutions. AI-powered threats increase urgency.",
    status: "STRONG",
    approvedAssets: 2,
    signals: [
      { ticker: "CRWD", company: "CrowdStrike", rating: "BUY", signalDate: "2025-03-01", signalPrice: 322.80, currentPrice: 355.20 },
      { ticker: "PANW", company: "Palo Alto Networks", rating: "BUY", signalDate: "2025-04-15", signalPrice: 180.40, currentPrice: 185.60 },
    ],
    horizons: { oneMonth: 4.2, threeMonth: 10.0, sixMonth: null, oneYear: null },
    researchNotes: ["Cybersecurity: Platform Consolidation Thesis (Apr 2025)", "Non-discretionary spend growing 15%+ annually"],
  },
  {
    name: "Healthcare",
    description: "Pharmaceuticals, biotech, and medical devices",
    thesis: "GLP-1 drugs represent a $100B+ addressable market with <5% penetration. Aging demographics drive structural healthcare spend growth. Innovation cycles create new multi-billion dollar markets.",
    status: "NEUTRAL",
    approvedAssets: 3,
    signals: [
      { ticker: "LLY", company: "Eli Lilly", rating: "BUY", signalDate: "2025-02-20", signalPrice: 730.00, currentPrice: 820.40 },
      { ticker: "NOVO-B", company: "Novo Nordisk", rating: "HOLD", signalDate: "2025-02-20", signalPrice: 137.00, currentPrice: 128.50 },
    ],
    horizons: { oneMonth: 1.5, threeMonth: 3.1, sixMonth: null, oneYear: null },
    researchNotes: ["GLP-1 Revolution: Healthcare Thesis (Feb 2025)", "LLY best-in-class efficacy. NOVO-B in correction."],
  },
  {
    name: "Halal Finance",
    description: "Sharia-compliant ETFs and Islamic financial services",
    thesis: "Structural allocation anchor. Growing Muslim middle class (1.8B+ population) drives demand for compliant products. Pre-screened ETFs provide low-cost diversification with ethical compliance built in.",
    status: "NEUTRAL",
    approvedAssets: 2,
    signals: [
      { ticker: "HLAL", company: "Wahed FTSE USA Shariah ETF", rating: "HOLD", signalDate: "2025-01-10", signalPrice: 40.75, currentPrice: 42.15 },
    ],
    horizons: { oneMonth: 1.2, threeMonth: 2.5, sixMonth: null, oneYear: null },
    researchNotes: ["Halal Finance: Core Allocation Anchor (Jan 2025)", "Low maintenance, high conviction structural position"],
  },
  {
    name: "Oil & Gas",
    description: "Upstream, midstream, and downstream energy",
    thesis: "Cash flow generation theme. Supply underinvestment since 2015 creates structural tightness. OPEC+ discipline supports prices. Sharia-compliant producers provide dividend income and energy security exposure.",
    status: "NEUTRAL",
    approvedAssets: 3,
    signals: [
      { ticker: "2222.SR", company: "Saudi Aramco", rating: "HOLD", signalDate: "2025-02-01", signalPrice: 8.02, currentPrice: 8.25 },
    ],
    horizons: { oneMonth: 1.1, threeMonth: 2.9, sixMonth: null, oneYear: null },
    researchNotes: ["Energy Security: Saudi Aramco Thesis (Feb 2025)", "Lowest-cost producer globally. 4%+ dividend yield."],
  },
  {
    name: "Industrial Automation",
    description: "Factory automation, robotics, and smart manufacturing",
    thesis: "Labour shortages and reshoring drive automation adoption. Penetration is still low globally (<10% of addressable tasks). Secular trend with defensive characteristics.",
    status: "NEUTRAL",
    approvedAssets: 2,
    signals: [
      { ticker: "ABB", company: "ABB Ltd", rating: "HOLD", signalDate: "2025-03-15", signalPrice: 50.60, currentPrice: 52.80 },
    ],
    horizons: { oneMonth: 2.8, threeMonth: 4.4, sixMonth: null, oneYear: null },
    researchNotes: ["Defensive industrial with secular automation tailwind", "Swiss quality. Well-diversified geographically."],
  },
  {
    name: "Clean Energy",
    description: "Solar, wind, hydrogen, and renewables",
    thesis: "Structurally sound but cyclically weak. High interest rates hurt capital-intensive projects. Theme will strengthen when rate cycle turns. Data centre power demand is emerging tailwind.",
    status: "WEAK",
    approvedAssets: 2,
    signals: [
      { ticker: "ENPH", company: "Enphase Energy", rating: "REDUCE", signalDate: "2025-05-20", signalPrice: 105.20, currentPrice: 98.45 },
    ],
    horizons: { oneMonth: null, threeMonth: null, sixMonth: null, oneYear: null },
    researchNotes: ["Theme structurally sound but cyclically weak", "Underweight until rate cycle turns"],
  },
];

// ── Component ────────────────────────────────────────────────────────────────

export default function ThemesPage() {
  const [expandedTheme, setExpandedTheme] = useState<string | null>(null);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Investment Themes</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Which long-term themes do we believe in? Thematic conviction and recommendation performance.
        </p>
      </div>

      {/* Theme Cards */}
      <div className="space-y-4">
        {THEMES.map((theme) => {
          const buySignals = theme.signals.filter((s) => s.rating === "BUY");
          const avgReturn = theme.signals.length > 0
            ? theme.signals.reduce((sum, s) => sum + ((s.currentPrice - s.signalPrice) / s.signalPrice) * 100, 0) / theme.signals.length
            : 0;
          const isExpanded = expandedTheme === theme.name;
          const statusColors: Record<string, string> = { STRONG: "badge-green", NEUTRAL: "badge-blue", WEAK: "badge-amber" };

          return (
            <div key={theme.name} className="card">
              {/* Theme Summary (always visible) */}
              <div className="flex cursor-pointer items-center gap-4" onClick={() => setExpandedTheme(isExpanded ? null : theme.name)}>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-3">
                    <h3 className="text-sm font-semibold">{theme.name}</h3>
                    <span className={`badge ${statusColors[theme.status]}`}>{theme.status}</span>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">{theme.description}</p>
                </div>
                <div className="grid grid-cols-3 gap-6 text-center">
                  <div>
                    <p className="text-lg font-bold">{theme.approvedAssets}</p>
                    <p className="text-[10px] text-muted-foreground">Approved</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold">{buySignals.length}</p>
                    <p className="text-[10px] text-muted-foreground">BUY Signals</p>
                  </div>
                  <div>
                    <p className={`text-lg font-bold ${avgReturn >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}`}>
                      {avgReturn >= 0 ? "+" : ""}{avgReturn.toFixed(1)}%
                    </p>
                    <p className="text-[10px] text-muted-foreground">Avg Return</p>
                  </div>
                </div>
                <span className="text-muted-foreground">{isExpanded ? "▲" : "▼"}</span>
              </div>

              {/* Expanded Detail */}
              {isExpanded && (
                <div className="mt-6 space-y-6 border-t border-border pt-6 dark:border-border-dark">
                  {/* Thesis */}
                  <div>
                    <p className="text-[10px] font-medium uppercase text-muted-foreground">Theme Thesis</p>
                    <p className="mt-1 text-sm">{theme.thesis}</p>
                  </div>

                  {/* Active Recommendations */}
                  <div>
                    <p className="mb-3 text-[10px] font-medium uppercase text-muted-foreground">Active Recommendations</p>
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-border/50 text-left text-[10px] uppercase text-muted-foreground dark:border-border-dark/50">
                          <th className="pb-2 pr-3">Asset</th>
                          <th className="pb-2 pr-3">Rating</th>
                          <th className="pb-2 pr-3 text-right">Signal Price</th>
                          <th className="pb-2 text-right">Return Since Signal</th>
                        </tr>
                      </thead>
                      <tbody>
                        {theme.signals.map((s) => {
                          const ret = ((s.currentPrice - s.signalPrice) / s.signalPrice) * 100;
                          const rColors: Record<string, string> = { BUY: "badge-green", HOLD: "badge-blue", REDUCE: "badge-amber" };
                          return (
                            <tr key={s.ticker} className="border-b border-border/20 dark:border-border-dark/20">
                              <td className="py-2 pr-3"><span className="font-mono font-bold">{s.ticker}</span> <span className="text-muted-foreground">{s.company}</span></td>
                              <td className="py-2 pr-3"><span className={`badge ${rColors[s.rating]}`}>{s.rating}</span></td>
                              <td className="py-2 pr-3 text-right font-mono">${s.signalPrice.toFixed(2)}</td>
                              <td className={`py-2 text-right font-bold ${ret >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}`}>
                                {ret >= 0 ? "+" : ""}{ret.toFixed(1)}%
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  {/* Theme Performance by Horizon */}
                  <div>
                    <p className="mb-3 text-[10px] font-medium uppercase text-muted-foreground">Theme Performance</p>
                    <div className="grid grid-cols-4 gap-4 text-center">
                      <HorizonCell label="1M" value={theme.horizons.oneMonth} />
                      <HorizonCell label="3M" value={theme.horizons.threeMonth} />
                      <HorizonCell label="6M" value={theme.horizons.sixMonth} />
                      <HorizonCell label="1Y" value={theme.horizons.oneYear} />
                    </div>
                  </div>

                  {/* Research Notes */}
                  <div>
                    <p className="mb-2 text-[10px] font-medium uppercase text-muted-foreground">Related Research</p>
                    <ul className="space-y-1">
                      {theme.researchNotes.map((note, i) => (
                        <li key={i} className="text-xs text-muted-foreground">• {note}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Disclaimer */}
      <div className="border-t border-border pt-4 text-center text-xs text-muted-foreground dark:border-border-dark">
        Past performance does not guarantee future results. Theme status reflects current market conditions and may change.
      </div>
    </div>
  );
}

function HorizonCell({ label, value }: { label: string; value: number | null }) {
  return (
    <div>
      <p className="text-[10px] uppercase text-muted-foreground">{label}</p>
      {value !== null ? (
        <p className={`mt-1 text-sm font-bold ${value >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}`}>
          {value >= 0 ? "+" : ""}{value.toFixed(1)}%
        </p>
      ) : (
        <p className="mt-1 text-sm font-bold text-muted-foreground">Pending</p>
      )}
    </div>
  );
}
