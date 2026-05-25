"use client";

import { useEffect, useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface DashboardData {
  metrics: {
    total_value: number;
    total_return_pct: number;
    cash_pct: number;
    equity_pct: number;
    position_count: number;
    theme_count: number;
    largest_position_pct: number;
    largest_theme_pct: number;
    regime: string;
  };
  positions: {
    ticker: string;
    company_name: string;
    entry_price: number;
    current_price: number;
    return_pct: number;
    allocation_pct: number;
    theme: string;
    signal: string;
    conviction: string;
  }[];
  themes: Record<string, number>;
  regime: string;
  cash_pct: number;
  alerts: { type: string; message: string }[];
  active_theses: number;
  total_reviews: number;
  last_review: string | null;
}

export default function MockPortfolioPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const loadDashboard = async () => {
    try {
      const res = await fetch(`${API_URL}/api/mock-portfolio/dashboard`);
      const json = await res.json();
      if (json.metrics.position_count === 0) {
        // Seed if empty
        await fetch(`${API_URL}/api/mock-portfolio/seed`, { method: "POST" });
        const res2 = await fetch(`${API_URL}/api/mock-portfolio/dashboard`);
        setData(await res2.json());
      } else {
        setData(json);
      }
    } catch {
      setError("Backend not reachable. Start the API server first.");
    }
    setLoading(false);
  };

  const refreshPrices = async () => {
    setRefreshing(true);
    try {
      await fetch(`${API_URL}/api/mock-portfolio/prices/refresh`, { method: "POST" });
      await loadDashboard();
    } catch {
      setError("Failed to refresh prices.");
    }
    setRefreshing(false);
  };

  useEffect(() => { loadDashboard(); }, []);

  if (loading) return <div className="p-8 text-muted-foreground">Loading portfolio...</div>;
  if (error) return <div className="p-8 text-red-500">{error}</div>;
  if (!data) return null;

  const regimeLabels: Record<string, string> = {
    strong_bull: "Strong Bull",
    weak_bull: "Weak Bull",
    sideways: "Sideways",
    high_volatility: "High Volatility",
    defensive: "Defensive",
  };

  const signalColors: Record<string, string> = {
    buy: "badge-green",
    hold: "badge-blue",
    reduce: "badge-amber",
    watchlist: "badge-gray",
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Mock Portfolio</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Paper portfolio validation — methodology testing only
          </p>
        </div>
        <button
          onClick={refreshPrices}
          disabled={refreshing}
          className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:opacity-50"
        >
          {refreshing ? "Refreshing..." : "Refresh Prices"}
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <MetricCard label="Portfolio Value" value={`$${data.metrics.total_value.toLocaleString()}`} />
        <MetricCard
          label="Total Return"
          value={`${data.metrics.total_return_pct >= 0 ? "+" : ""}${data.metrics.total_return_pct.toFixed(1)}%`}
          variant={data.metrics.total_return_pct >= 0 ? "green" : "red"}
        />
        <MetricCard label="Cash" value={`${data.cash_pct}%`} />
        <MetricCard label="Positions" value={String(data.metrics.position_count)} />
        <MetricCard label="Regime" value={regimeLabels[data.regime] || data.regime} variant="blue" />
      </div>

      {/* Alerts */}
      {data.alerts.length > 0 && (
        <div className="space-y-2">
          {data.alerts.map((alert, i) => (
            <div
              key={i}
              className={`rounded-lg border p-3 text-sm ${
                alert.type === "ok"
                  ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-400"
                  : "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-400"
              }`}
            >
              {alert.type === "ok" ? "✓" : "⚠"} {alert.message}
            </div>
          ))}
        </div>
      )}

      {/* Positions Table */}
      <div className="card">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Positions — Ranked by Return
        </h2>
        <div className="space-y-3">
          {data.positions.map((pos) => (
            <div key={pos.ticker} className="flex items-center gap-4 rounded-lg border border-border p-4 dark:border-border-dark">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm font-bold">{pos.ticker}</span>
                  <span className="truncate text-sm">{pos.company_name}</span>
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                    {pos.theme}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium">{pos.allocation_pct}%</p>
                <p className="text-[11px] text-muted-foreground">alloc</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium">${pos.current_price.toFixed(2)}</p>
                <p className="text-[11px] text-muted-foreground">price</p>
              </div>
              <div className="text-right">
                <p className={`text-sm font-bold ${pos.return_pct >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}`}>
                  {pos.return_pct >= 0 ? "+" : ""}{pos.return_pct.toFixed(1)}%
                </p>
                <p className="text-[11px] text-muted-foreground">return</p>
              </div>
              <span className={`badge ${signalColors[pos.signal] || "badge-gray"}`}>
                {pos.signal.toUpperCase()}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Theme Breakdown */}
      <div className="card">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Theme Allocation
        </h2>
        <div className="space-y-3">
          {Object.entries(data.themes)
            .sort(([, a], [, b]) => b - a)
            .map(([theme, weight]) => (
              <div key={theme} className="flex items-center gap-3">
                <span className="w-40 text-sm font-medium">{theme}</span>
                <div className="flex-1">
                  <div className="h-4 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                    <div
                      className={`h-full rounded-full ${weight > 35 ? "bg-amber-500" : "bg-brand-500"}`}
                      style={{ width: `${Math.min(weight, 100)}%` }}
                    />
                  </div>
                </div>
                <span className="w-12 text-right text-sm font-bold">{weight}%</span>
              </div>
            ))}
          <div className="flex items-center gap-3">
            <span className="w-40 text-sm font-medium text-muted-foreground">Cash</span>
            <div className="flex-1">
              <div className="h-4 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                <div className="h-full rounded-full bg-slate-400" style={{ width: `${data.cash_pct}%` }} />
              </div>
            </div>
            <span className="w-12 text-right text-sm font-bold">{data.cash_pct}%</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-border pt-4 text-center text-xs text-muted-foreground dark:border-border-dark">
        Paper portfolio only — Not live trading — Methodology validation system
      </div>
    </div>
  );
}

function MetricCard({ label, value, variant }: { label: string; value: string; variant?: "green" | "red" | "blue" }) {
  const colorMap = {
    green: "text-emerald-600 dark:text-emerald-400",
    red: "text-red-600 dark:text-red-400",
    blue: "text-blue-600 dark:text-blue-400",
  };
  const textColor = variant ? colorMap[variant] : "text-foreground";

  return (
    <div className="card">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className={`mt-2 text-xl font-bold ${textColor}`}>{value}</p>
    </div>
  );
}
