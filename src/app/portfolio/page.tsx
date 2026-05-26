"use client";

import { useEffect, useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
const THEME_LIMIT = 35;

// ── Types ────────────────────────────────────────────────────────────────────

interface PositionData {
  ticker: string;
  company_name: string;
  entry_price: number;
  current_price: number;
  quantity: number;
  invested_amount: number;
  current_value: number;
  unrealized_pnl: number;
  return_pct: number;
  target_allocation_pct: number;
  actual_allocation_pct: number;
  allocation_drift_pct: number;
  theme: string;
  signal: string;
  conviction: string;
  entry_date: string;
}

interface TransactionData {
  id: number;
  timestamp: string;
  transaction_type: string;
  ticker: string;
  company_name: string;
  price: number;
  quantity: number;
  amount: number;
  allocation_pct: number;
  rationale: string;
  regime_at_time: string;
}

interface DashboardData {
  metrics: {
    starting_capital: number;
    total_invested: number;
    total_current_value: number;
    total_portfolio_value: number;
    total_unrealized_pnl: number;
    total_return_pct: number;
    cash_balance: number;
    cash_pct: number;
    equity_pct: number;
    position_count: number;
    theme_count: number;
    largest_position_pct: number;
    largest_theme_pct: number;
    regime: string;
  };
  positions: PositionData[];
  themes: Record<string, number>;
  regime: string;
  cash_balance: number;
  cash_pct: number;
  alerts: { type: string; message: string }[];
  last_price_refresh: string | null;
  transaction_count: number;
  active_theses: number;
  total_reviews: number;
  last_review: string | null;
}

type Tab = "portfolio" | "buy" | "sell" | "transactions" | "review";

// ── Main Component ───────────────────────────────────────────────────────────

export default function MockPortfolioPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [transactions, setTransactions] = useState<TransactionData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("portfolio");
  const [dataSource, setDataSource] = useState<"live" | "staged">("staged");

  const loadDashboard = async () => {
    try {
      const res = await fetch(`${API_URL}/api/mock-portfolio/dashboard`);
      const json = await res.json();
      if (json.metrics.position_count === 0) {
        await fetch(`${API_URL}/api/mock-portfolio/seed`, { method: "POST" });
        const res2 = await fetch(`${API_URL}/api/mock-portfolio/dashboard`);
        setData(await res2.json());
      } else {
        setData(json);
      }
      if (json.last_price_refresh) setDataSource("live");
    } catch {
      setError("Backend not reachable. Start the API server first.");
    }
    setLoading(false);
  };

  const loadTransactions = async () => {
    try {
      const res = await fetch(`${API_URL}/api/mock-portfolio/transactions`);
      const json = await res.json();
      setTransactions(json.transactions || []);
    } catch { /* ignore */ }
  };

  const refreshPrices = async () => {
    setRefreshing(true);
    try {
      await fetch(`${API_URL}/api/mock-portfolio/prices/refresh`, { method: "POST" });
      await loadDashboard();
      setDataSource("live");
    } catch {
      setError("Failed to refresh prices.");
    }
    setRefreshing(false);
  };

  useEffect(() => { loadDashboard(); loadTransactions(); }, []);

  if (loading) return <div className="p-8 text-muted-foreground">Loading portfolio...</div>;
  if (error) return <div className="p-8 text-red-500">{error}</div>;
  if (!data) return null;

  const m = data.metrics;
  const regimeLabels: Record<string, string> = {
    strong_bull: "Strong Bull", weak_bull: "Weak Bull", sideways: "Sideways",
    high_volatility: "High Volatility", defensive: "Defensive",
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Paper Portfolio Simulator</h1>
          <p className="mt-1 text-sm text-muted-foreground">Mock positions with real market prices — no real trades executed</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className={`badge ${dataSource === "live" ? "badge-green" : "badge-amber"}`}>
              {dataSource === "live" ? "● Live Prices" : "● Staged Data"}
            </span>
            {dataSource === "staged" && (
              <p className="mt-1 text-[10px] text-amber-600 dark:text-amber-400">Demo values, not live market prices</p>
            )}
            {dataSource === "live" && data.last_price_refresh && (
              <p className="mt-1 text-[10px] text-muted-foreground">Refreshed: {new Date(data.last_price_refresh).toLocaleString()}</p>
            )}
          </div>
          <button onClick={refreshPrices} disabled={refreshing}
            className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-50">
            {refreshing ? "Refreshing..." : "Refresh Prices"}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 rounded-lg bg-slate-100 p-1 dark:bg-slate-800">
        {(["portfolio", "buy", "sell", "transactions", "review"] as Tab[]).map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition ${activeTab === tab ? "bg-white shadow dark:bg-slate-700" : "text-muted-foreground hover:text-foreground"}`}>
            {tab === "portfolio" ? "Portfolio" : tab === "buy" ? "Mock Buy" : tab === "sell" ? "Mock Sell" : tab === "transactions" ? "History" : "Review"}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === "portfolio" && <PortfolioTab data={data} regimeLabels={regimeLabels} />}
      {activeTab === "buy" && <BuyTab cashBalance={m.cash_balance} onComplete={() => { loadDashboard(); loadTransactions(); setActiveTab("portfolio"); }} />}
      {activeTab === "sell" && <SellTab positions={data.positions} onComplete={() => { loadDashboard(); loadTransactions(); setActiveTab("portfolio"); }} />}
      {activeTab === "transactions" && <TransactionsTab transactions={transactions} />}
      {activeTab === "review" && <ReviewTab data={data} regimeLabels={regimeLabels} />}

      {/* Footer */}
      <div className="border-t border-border pt-4 text-center text-xs text-muted-foreground dark:border-border-dark">
        Paper portfolio simulator — No real trades — Not financial advice — Methodology validation only
      </div>
    </div>
  );
}

// ── Portfolio Tab ─────────────────────────────────────────────────────────────

function PortfolioTab({ data, regimeLabels }: { data: DashboardData; regimeLabels: Record<string, string> }) {
  const m = data.metrics;
  const signalColors: Record<string, string> = { buy: "badge-green", hold: "badge-blue", reduce: "badge-amber", watchlist: "badge-gray" };
  const overThemes = Object.entries(data.themes).filter(([, w]) => w > THEME_LIMIT);

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="card">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-xs font-medium uppercase text-muted-foreground">Portfolio Summary</span>
          <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-mono text-muted-foreground dark:bg-slate-800">
            Portfolio Value = Cash Balance + Current Value of Open Positions
          </span>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Stat label="Starting Capital" value={`$${m.starting_capital.toLocaleString()}`} />
          <Stat label="Portfolio Value" value={`$${m.total_portfolio_value.toLocaleString()}`} />
          <Stat label="Unrealized P&L" value={`${m.total_unrealized_pnl >= 0 ? "+" : ""}$${m.total_unrealized_pnl.toLocaleString()}`} variant={m.total_unrealized_pnl >= 0 ? "green" : "red"} />
          <Stat label="Total Return" value={`${m.total_return_pct >= 0 ? "+" : ""}${m.total_return_pct.toFixed(2)}%`} variant={m.total_return_pct >= 0 ? "green" : "red"} />
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Stat label="Cash Balance" value={`$${m.cash_balance.toLocaleString()}`} />
          <Stat label="Invested" value={`$${m.total_invested.toLocaleString()}`} />
          <Stat label="Positions" value={`${m.position_count} open`} />
          <Stat label="Regime" value={regimeLabels[m.regime] || m.regime} variant="blue" />
        </div>
      </div>

      {/* Alerts */}
      {data.alerts.map((a, i) => (
        <div key={i} className={`rounded-lg border p-3 text-sm ${a.type === "ok" ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-400" : "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-400"}`}>
          {a.type === "ok" ? "✓" : "⚠"} {a.message}
        </div>
      ))}
      {overThemes.map(([theme, w]) => (
        <div key={theme} className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-700 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-400">
          ⚠ <strong>{theme}</strong>: {w.toFixed(1)}% (limit {THEME_LIMIT}%). Reduce by {Math.ceil(w - THEME_LIMIT)}–{Math.ceil(w - THEME_LIMIT) + 2}%.
        </div>
      ))}

      {/* Positions Table */}
      <div className="card overflow-x-auto">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">Open Positions</h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-[11px] uppercase text-muted-foreground dark:border-border-dark">
              <th className="pb-2 pr-3">Asset</th>
              <th className="pb-2 pr-3 text-right">Entry</th>
              <th className="pb-2 pr-3 text-right">Current</th>
              <th className="pb-2 pr-3 text-right">Qty</th>
              <th className="pb-2 pr-3 text-right">Invested</th>
              <th className="pb-2 pr-3 text-right">Value</th>
              <th className="pb-2 pr-3 text-right">P&L</th>
              <th className="pb-2 pr-3 text-right">Return</th>
              <th className="pb-2 text-right">Signal</th>
            </tr>
          </thead>
          <tbody>
            {data.positions.map((p) => (
              <tr key={p.ticker} className="border-b border-border/30 dark:border-border-dark/30">
                <td className="py-2.5 pr-3">
                  <span className="font-mono font-bold">{p.ticker}</span>
                  <span className="ml-2 hidden text-muted-foreground lg:inline">{p.company_name}</span>
                  <div className="text-[10px] text-muted-foreground">{p.theme} · {p.actual_allocation_pct}%</div>
                </td>
                <td className="py-2.5 pr-3 text-right font-mono">${p.entry_price.toFixed(2)}</td>
                <td className="py-2.5 pr-3 text-right font-mono">${p.current_price.toFixed(2)}</td>
                <td className="py-2.5 pr-3 text-right font-mono">{p.quantity.toFixed(2)}</td>
                <td className="py-2.5 pr-3 text-right font-mono">${p.invested_amount.toLocaleString()}</td>
                <td className="py-2.5 pr-3 text-right font-mono">${p.current_value.toLocaleString()}</td>
                <td className={`py-2.5 pr-3 text-right font-mono font-bold ${p.unrealized_pnl >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}`}>
                  {p.unrealized_pnl >= 0 ? "+" : ""}${Math.abs(p.unrealized_pnl).toLocaleString()}
                </td>
                <td className={`py-2.5 pr-3 text-right font-bold ${p.return_pct >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}`}>
                  {p.return_pct >= 0 ? "+" : ""}{p.return_pct.toFixed(1)}%
                </td>
                <td className="py-2.5 text-right"><span className={`badge ${signalColors[p.signal] || "badge-gray"}`}>{p.signal.toUpperCase()}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Theme Allocation */}
      <div className="card">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">Theme Allocation</h2>
        <div className="space-y-2">
          {Object.entries(data.themes).sort(([, a], [, b]) => b - a).map(([theme, w]) => (
            <div key={theme} className="flex items-center gap-3">
              <span className="w-36 text-sm">{theme}</span>
              <div className="flex-1"><div className="h-3 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800"><div className={`h-full rounded-full ${w > THEME_LIMIT ? "bg-amber-500" : "bg-brand-500"}`} style={{ width: `${Math.min(w, 100)}%` }} /></div></div>
              <span className={`w-12 text-right text-sm font-bold ${w > THEME_LIMIT ? "text-amber-600" : ""}`}>{w.toFixed(1)}%</span>
            </div>
          ))}
          <div className="flex items-center gap-3">
            <span className="w-36 text-sm text-muted-foreground">Cash</span>
            <div className="flex-1"><div className="h-3 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800"><div className="h-full rounded-full bg-slate-400" style={{ width: `${data.cash_pct}%` }} /></div></div>
            <span className="w-12 text-right text-sm font-bold">{data.cash_pct.toFixed(1)}%</span>
          </div>
        </div>
      </div>

      {data.last_price_refresh && (
        <p className="text-center text-[11px] text-muted-foreground">Last price refresh: {new Date(data.last_price_refresh).toLocaleString()}</p>
      )}
    </div>
  );
}

// ── Mock Buy Tab ─────────────────────────────────────────────────────────────

function BuyTab({ cashBalance, onComplete }: { cashBalance: number; onComplete: () => void }) {
  // Recommended approved assets (only BUY/HOLD eligible)
  const recommendedAssets = [
    { ticker: "TSM", name: "Taiwan Semiconductor", theme: "Semiconductors", signal: "BUY", price: 178.52, conviction: "high", risk: "moderate" },
    { ticker: "ASML", name: "ASML Holding", theme: "Semiconductors", signal: "BUY", price: 924.30, conviction: "high", risk: "moderate" },
    { ticker: "HLAL", name: "Wahed FTSE USA Shariah ETF", theme: "Halal Finance", signal: "HOLD", price: 42.15, conviction: "high", risk: "low" },
    { ticker: "SPUS", name: "SP Funds S&P 500 Sharia ETF", theme: "Halal Finance", signal: "HOLD", price: 34.82, conviction: "high", risk: "low" },
    { ticker: "LLY", name: "Eli Lilly", theme: "Healthcare", signal: "BUY", price: 820.40, conviction: "high", risk: "moderate" },
    { ticker: "CRWD", name: "CrowdStrike", theme: "Cybersecurity", signal: "BUY", price: 355.20, conviction: "high", risk: "moderate" },
    { ticker: "PANW", name: "Palo Alto Networks", theme: "Cybersecurity", signal: "BUY", price: 185.60, conviction: "high", risk: "moderate" },
    { ticker: "AMD", name: "Advanced Micro Devices", theme: "Semiconductors", signal: "BUY", price: 162.30, conviction: "high", risk: "moderate" },
    { ticker: "AVGO", name: "Broadcom", theme: "Semiconductors", signal: "BUY", price: 178.50, conviction: "high", risk: "moderate" },
    { ticker: "NOVO-B", name: "Novo Nordisk", theme: "Healthcare", signal: "HOLD", price: 128.50, conviction: "high", risk: "moderate" },
    { ticker: "JNJ", name: "Johnson & Johnson", theme: "Healthcare", signal: "HOLD", price: 155.80, conviction: "high", risk: "low" },
    { ticker: "ABB", name: "ABB Ltd", theme: "Industrial Automation", signal: "HOLD", price: 52.80, conviction: "high", risk: "low" },
    { ticker: "2222.SR", name: "Saudi Aramco", theme: "Oil & Gas", signal: "HOLD", price: 8.25, conviction: "high", risk: "low" },
    { ticker: "NEE", name: "NextEra Energy", theme: "Clean Energy", signal: "HOLD", price: 78.90, conviction: "high", risk: "low" },
    { ticker: "QISMUT", name: "Qatar Islamic Bank", theme: "Islamic Banking", signal: "HOLD", price: 5.20, conviction: "high", risk: "low" },
    { ticker: "XOM", name: "Exxon Mobil", theme: "Oil & Gas", signal: "HOLD", price: 108.20, conviction: "high", risk: "moderate" },
    { ticker: "1211.HK", name: "BYD Company", theme: "Battery Technology", signal: "HOLD", price: 293.80, conviction: "medium", risk: "elevated" },
    { ticker: "CATL", name: "CATL", theme: "Battery Technology", signal: "HOLD", price: 48.20, conviction: "medium", risk: "elevated" },
  ];

  const [selectedAsset, setSelectedAsset] = useState<typeof recommendedAssets[0] | null>(null);
  const [amount, setAmount] = useState("");
  const [conviction, setConviction] = useState("high");
  const [thesis, setThesis] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const estimatedQty = selectedAsset && amount ? parseFloat(amount) / selectedAsset.price : 0;
  const allocationPct = amount ? (parseFloat(amount) / 100000) * 100 : 0;

  const handleSelectAsset = (ticker: string) => {
    const asset = recommendedAssets.find((a) => a.ticker === ticker);
    setSelectedAsset(asset || null);
    if (asset) {
      setConviction(asset.conviction);
    }
    setShowConfirmation(false);
    setResult(null);
  };

  const handleReview = () => {
    if (!selectedAsset || !amount) { setResult("Select an asset and enter an amount."); return; }
    if (parseFloat(amount) > cashBalance) { setResult(`Insufficient cash. Available: $${cashBalance.toLocaleString()}`); return; }
    if (allocationPct > 15) { setResult("Max single position is 15% ($15,000). Reduce amount."); return; }
    setResult(null);
    setShowConfirmation(true);
  };

  const handleBuy = async () => {
    if (!selectedAsset || !amount) return;
    setSubmitting(true);
    try {
      const res = await fetch(`${API_URL}/api/mock-portfolio/positions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ticker: selectedAsset.ticker,
          company_name: selectedAsset.name,
          entry_price: selectedAsset.price,
          allocation_pct: Math.min(allocationPct, 15),
          theme: selectedAsset.theme,
          conviction,
          signal: "buy",
          thesis_summary: thesis,
          rationale: `Mock buy: $${amount} of ${selectedAsset.ticker} at $${selectedAsset.price.toFixed(2)}. Thesis: ${thesis || "N/A"}`,
        }),
      });
      const json = await res.json();
      if (res.ok) {
        setResult(`✓ Mock bought ${json.position?.quantity?.toFixed(2) || estimatedQty.toFixed(2)} shares of ${selectedAsset.ticker} at $${selectedAsset.price.toFixed(2)}`);
        setTimeout(onComplete, 1500);
      } else {
        setResult(`✗ ${json.detail || "Failed to execute mock buy"}`);
      }
    } catch {
      setResult("✗ Network error");
    }
    setSubmitting(false);
    setShowConfirmation(false);
  };

  return (
    <div className="card max-w-2xl space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Mock Buy — Simulate Position</h2>
        <p className="text-sm text-muted-foreground">Select an approved asset and simulate a purchase. No real trade is executed.</p>
        <p className="mt-2 text-sm">Available cash: <strong className="text-emerald-600">${cashBalance.toLocaleString()}</strong></p>
      </div>

      {/* Asset Selection Dropdown */}
      <div>
        <label className="text-xs font-medium uppercase text-muted-foreground">Select Recommended Asset</label>
        <select
          value={selectedAsset?.ticker || ""}
          onChange={(e) => handleSelectAsset(e.target.value)}
          className="mt-1 w-full rounded-lg border border-border bg-panel px-3 py-2.5 text-sm dark:border-border-dark dark:bg-panel-dark"
        >
          <option value="">Choose an approved asset...</option>
          {recommendedAssets.map((a) => (
            <option key={a.ticker} value={a.ticker}>
              {a.ticker} — {a.name} — {a.theme} — {a.signal}
            </option>
          ))}
        </select>
        <p className="mt-1 text-[10px] text-muted-foreground">Only APPROVED assets with BUY or HOLD signals are shown. Watchlist and rejected assets are not eligible.</p>
      </div>

      {/* Auto-populated asset details */}
      {selectedAsset && (
        <div className="rounded-lg bg-slate-50 p-4 dark:bg-slate-800/50">
          <div className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
            <div><span className="text-[10px] uppercase text-muted-foreground">Ticker</span><p className="font-mono font-bold">{selectedAsset.ticker}</p></div>
            <div><span className="text-[10px] uppercase text-muted-foreground">Theme</span><p>{selectedAsset.theme}</p></div>
            <div><span className="text-[10px] uppercase text-muted-foreground">Price</span><p className="font-mono">${selectedAsset.price.toFixed(2)}</p></div>
            <div><span className="text-[10px] uppercase text-muted-foreground">Signal</span><p><span className={`badge ${selectedAsset.signal === "BUY" ? "badge-green" : "badge-blue"}`}>{selectedAsset.signal}</span></p></div>
            <div><span className="text-[10px] uppercase text-muted-foreground">Risk</span><p>{selectedAsset.risk}</p></div>
            <div><span className="text-[10px] uppercase text-muted-foreground">Conviction</span><p>{selectedAsset.conviction}</p></div>
          </div>
        </div>
      )}

      {/* Amount and Thesis */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="text-xs font-medium uppercase text-muted-foreground">Amount to Allocate ($)</label>
          <input type="number" value={amount} onChange={(e) => { setAmount(e.target.value); setShowConfirmation(false); }} placeholder="e.g. 12000" max="15000"
            className="mt-1 w-full rounded-lg border border-border bg-panel px-3 py-2 text-sm dark:border-border-dark dark:bg-panel-dark" />
          {amount && <p className="mt-1 text-[10px] text-muted-foreground">= {allocationPct.toFixed(1)}% of portfolio{allocationPct > 15 ? " ⚠ exceeds 15% limit" : ""}</p>}
        </div>
        <div>
          <label className="text-xs font-medium uppercase text-muted-foreground">Conviction Level</label>
          <select value={conviction} onChange={(e) => setConviction(e.target.value)}
            className="mt-1 w-full rounded-lg border border-border bg-panel px-3 py-2 text-sm dark:border-border-dark dark:bg-panel-dark">
            <option value="high">High — Strong thesis, clear catalysts</option>
            <option value="medium">Medium — Reasonable thesis, some uncertainty</option>
            <option value="low">Low — Speculative, limited data</option>
          </select>
        </div>
      </div>

      <div>
        <label className="text-xs font-medium uppercase text-muted-foreground">Investment Thesis (required)</label>
        <textarea value={thesis} onChange={(e) => setThesis(e.target.value)} rows={3}
          placeholder="Why are you buying this asset? What macro trends support it? What would invalidate this thesis?"
          className="mt-1 w-full rounded-lg border border-border bg-panel px-3 py-2 text-sm dark:border-border-dark dark:bg-panel-dark" />
      </div>

      {/* Estimated Quantity Preview */}
      {selectedAsset && amount && parseFloat(amount) > 0 && (
        <div className="rounded-lg border border-brand-200 bg-brand-50 p-3 dark:border-brand-800 dark:bg-brand-950/30">
          <p className="text-sm">
            <strong>Estimated quantity:</strong> {estimatedQty.toFixed(2)} shares of {selectedAsset.ticker} at ${selectedAsset.price.toFixed(2)}/share
          </p>
        </div>
      )}

      {/* Confirmation Preview */}
      {showConfirmation && selectedAsset && (
        <div className="rounded-lg border-2 border-emerald-300 bg-emerald-50 p-4 dark:border-emerald-700 dark:bg-emerald-950/30">
          <p className="text-sm font-medium text-emerald-800 dark:text-emerald-300">Confirm Mock Buy</p>
          <p className="mt-2 text-sm text-emerald-700 dark:text-emerald-400">
            You are about to simulate buying <strong>${parseFloat(amount).toLocaleString()}</strong> of <strong>{selectedAsset.ticker}</strong> ({selectedAsset.name}) at <strong>${selectedAsset.price.toFixed(2)}</strong>.
          </p>
          <p className="mt-1 text-sm text-emerald-700 dark:text-emerald-400">
            Estimated quantity: <strong>{estimatedQty.toFixed(2)} shares</strong>. Allocation: <strong>{allocationPct.toFixed(1)}%</strong>.
          </p>
          <p className="mt-2 text-xs text-emerald-600 dark:text-emerald-500">No real trade will be executed. This is a paper portfolio simulation.</p>
          <div className="mt-3 flex gap-3">
            <button onClick={handleBuy} disabled={submitting}
              className="rounded-lg bg-emerald-600 px-5 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-50">
              {submitting ? "Processing..." : "Confirm Mock Buy"}
            </button>
            <button onClick={() => setShowConfirmation(false)}
              className="rounded-lg border border-emerald-300 px-5 py-2 text-sm font-medium text-emerald-700 hover:bg-emerald-100 dark:border-emerald-700 dark:text-emerald-400">
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Review Button (before confirmation) */}
      {!showConfirmation && (
        <button onClick={handleReview} disabled={!selectedAsset || !amount || !thesis}
          className="rounded-lg bg-emerald-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-50">
          Review Mock Buy
        </button>
      )}

      {result && <p className={`text-sm ${result.startsWith("✓") ? "text-emerald-600" : "text-red-600"}`}>{result}</p>}

      <p className="text-[11px] text-muted-foreground">This is a simulated purchase. No real money is spent. No broker is contacted. Only APPROVED assets are eligible.</p>
    </div>
  );
}

// ── Mock Sell Tab ────────────────────────────────────────────────────────────

function SellTab({ positions, onComplete }: { positions: PositionData[]; onComplete: () => void }) {
  const [selectedTicker, setSelectedTicker] = useState("");
  const [sellType, setSellType] = useState<"full" | "partial">("full");
  const [reducePct, setReducePct] = useState("50");
  const [rationale, setRationale] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const selectedPosition = positions.find((p) => p.ticker === selectedTicker);

  const handleSell = async () => {
    if (!selectedTicker) { setResult("Select a position to sell."); return; }
    setSubmitting(true);

    try {
      if (sellType === "full") {
        const res = await fetch(`${API_URL}/api/mock-portfolio/positions/${selectedTicker}?rationale=${encodeURIComponent(rationale)}`, { method: "DELETE" });
        const json = await res.json();
        if (res.ok) {
          setResult(`✓ Exited ${selectedTicker}. Proceeds: $${json.proceeds?.toLocaleString()}. P&L: ${json.pnl >= 0 ? "+" : ""}$${json.pnl?.toLocaleString()}`);
          setTimeout(onComplete, 1500);
        } else {
          setResult(`✗ ${json.detail}`);
        }
      } else {
        const res = await fetch(`${API_URL}/api/mock-portfolio/positions/${selectedTicker}/reduce`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ reduce_pct: parseFloat(reducePct), rationale }),
        });
        const json = await res.json();
        if (res.ok) {
          setResult(`✓ Reduced ${selectedTicker} by ${reducePct}%.`);
          setTimeout(onComplete, 1500);
        } else {
          setResult(`✗ ${json.detail}`);
        }
      }
    } catch {
      setResult("✗ Network error");
    }
    setSubmitting(false);
  };

  return (
    <div className="card max-w-2xl space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Mock Sell / Reduce</h2>
        <p className="text-sm text-muted-foreground">Simulate selling or reducing a position. No real trade is executed.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="text-xs font-medium uppercase text-muted-foreground">Select Position</label>
          <select value={selectedTicker} onChange={(e) => setSelectedTicker(e.target.value)}
            className="mt-1 w-full rounded-lg border border-border bg-panel px-3 py-2 text-sm dark:border-border-dark dark:bg-panel-dark">
            <option value="">Choose position...</option>
            {positions.map((p) => (
              <option key={p.ticker} value={p.ticker}>{p.ticker} — ${p.current_value.toLocaleString()} ({p.return_pct >= 0 ? "+" : ""}{p.return_pct.toFixed(1)}%)</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs font-medium uppercase text-muted-foreground">Sell Type</label>
          <select value={sellType} onChange={(e) => setSellType(e.target.value as "full" | "partial")}
            className="mt-1 w-full rounded-lg border border-border bg-panel px-3 py-2 text-sm dark:border-border-dark dark:bg-panel-dark">
            <option value="full">Full Exit (sell all)</option>
            <option value="partial">Partial Reduce (%)</option>
          </select>
        </div>
        {sellType === "partial" && (
          <div>
            <label className="text-xs font-medium uppercase text-muted-foreground">Reduce by %</label>
            <input type="number" value={reducePct} onChange={(e) => setReducePct(e.target.value)} min="1" max="99"
              className="mt-1 w-full rounded-lg border border-border bg-panel px-3 py-2 text-sm dark:border-border-dark dark:bg-panel-dark" />
          </div>
        )}
      </div>

      {selectedPosition && (
        <div className="rounded-lg bg-slate-50 p-4 dark:bg-slate-800/50">
          <p className="text-sm"><strong>{selectedPosition.ticker}</strong> — {selectedPosition.company_name}</p>
          <div className="mt-2 grid grid-cols-3 gap-4 text-xs">
            <div><span className="text-muted-foreground">Qty:</span> {selectedPosition.quantity.toFixed(2)}</div>
            <div><span className="text-muted-foreground">Value:</span> ${selectedPosition.current_value.toLocaleString()}</div>
            <div><span className="text-muted-foreground">P&L:</span> <span className={selectedPosition.unrealized_pnl >= 0 ? "text-emerald-600" : "text-red-600"}>{selectedPosition.unrealized_pnl >= 0 ? "+" : ""}${selectedPosition.unrealized_pnl.toLocaleString()}</span></div>
          </div>
        </div>
      )}

      <div>
        <label className="text-xs font-medium uppercase text-muted-foreground">Rationale</label>
        <textarea value={rationale} onChange={(e) => setRationale(e.target.value)} rows={2} placeholder="Why are you selling? Thesis invalidated? Rebalancing?"
          className="mt-1 w-full rounded-lg border border-border bg-panel px-3 py-2 text-sm dark:border-border-dark dark:bg-panel-dark" />
      </div>

      <div className="flex items-center gap-4">
        <button onClick={handleSell} disabled={submitting || !selectedTicker}
          className="rounded-lg bg-red-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50">
          {submitting ? "Processing..." : sellType === "full" ? "Execute Mock Sell (Full Exit)" : `Reduce by ${reducePct}%`}
        </button>
        {result && <p className={`text-sm ${result.startsWith("✓") ? "text-emerald-600" : "text-red-600"}`}>{result}</p>}
      </div>

      <p className="text-[11px] text-muted-foreground">This is a simulated sale. No real shares are sold. No broker is contacted.</p>
    </div>
  );
}

// ── Transactions Tab ─────────────────────────────────────────────────────────

function TransactionsTab({ transactions }: { transactions: TransactionData[] }) {
  const typeColors: Record<string, string> = {
    buy: "text-emerald-600 dark:text-emerald-400",
    reduce: "text-amber-600 dark:text-amber-400",
    exit: "text-red-600 dark:text-red-400",
    rebalance: "text-blue-600 dark:text-blue-400",
    cash_adjustment: "text-muted-foreground",
  };

  return (
    <div className="card space-y-4">
      <div>
        <h2 className="text-lg font-semibold">Transaction History</h2>
        <p className="text-sm text-muted-foreground">{transactions.length} transactions recorded</p>
      </div>

      {transactions.length === 0 ? (
        <p className="py-8 text-center text-muted-foreground">No transactions yet. Use Mock Buy to create your first position.</p>
      ) : (
        <div className="space-y-2">
          {transactions.slice(0, 30).map((tx) => (
            <div key={tx.id} className="flex items-start gap-3 rounded-lg border border-border/50 p-3 dark:border-border-dark/50">
              <span className={`mt-0.5 text-xs font-bold uppercase ${typeColors[tx.transaction_type] || "text-muted-foreground"}`}>
                {tx.transaction_type}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  {tx.ticker && <span className="font-mono text-sm font-bold">{tx.ticker}</span>}
                  {tx.company_name && <span className="text-sm text-muted-foreground">{tx.company_name}</span>}
                </div>
                <p className="mt-0.5 text-xs text-muted-foreground">{tx.rationale}</p>
              </div>
              <div className="text-right">
                {tx.quantity > 0 && <p className="text-xs">{tx.quantity.toFixed(2)} shares</p>}
                {tx.amount > 0 && <p className="text-xs font-medium">${tx.amount.toLocaleString()}</p>}
                {tx.price > 0 && <p className="text-[10px] text-muted-foreground">@ ${tx.price.toFixed(2)}</p>}
              </div>
              <span className="text-[10px] text-muted-foreground">{new Date(tx.timestamp).toLocaleDateString()}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Review Tab ───────────────────────────────────────────────────────────────

function ReviewTab({ data, regimeLabels }: { data: DashboardData; regimeLabels: Record<string, string> }) {
  const strong = data.positions.filter((p) => p.return_pct > 5);
  const weak = data.positions.filter((p) => p.return_pct < -3);
  const needsReview = data.positions.filter((p) => p.signal === "reduce" || p.return_pct < -8);
  const overThemes = Object.entries(data.themes).filter(([, w]) => w > THEME_LIMIT);

  return (
    <div className="space-y-6">
      <div className="card">
        <h2 className="text-lg font-semibold">Weekly Portfolio Review</h2>
        <p className="text-sm text-muted-foreground">Regime: {regimeLabels[data.regime]} · {data.metrics.position_count} positions · {data.metrics.cash_pct.toFixed(1)}% cash</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="card">
          <h3 className="text-xs font-semibold uppercase text-emerald-600 dark:text-emerald-400">Strengthened</h3>
          {strong.length > 0 ? (
            <ul className="mt-3 space-y-2">{strong.slice(0, 5).map((p) => (
              <li key={p.ticker} className="text-sm"><span className="font-mono font-bold">{p.ticker}</span> +{p.return_pct.toFixed(1)}% — thesis intact, momentum positive</li>
            ))}</ul>
          ) : <p className="mt-3 text-sm text-muted-foreground">No positions above +5%</p>}
        </div>

        <div className="card">
          <h3 className="text-xs font-semibold uppercase text-red-600 dark:text-red-400">Weakened</h3>
          {weak.length > 0 ? (
            <ul className="mt-3 space-y-2">{weak.map((p) => (
              <li key={p.ticker} className="text-sm"><span className="font-mono font-bold">{p.ticker}</span> {p.return_pct.toFixed(1)}% — monitor thesis validity</li>
            ))}</ul>
          ) : <p className="mt-3 text-sm text-muted-foreground">No positions below -3%</p>}
        </div>

        <div className="card">
          <h3 className="text-xs font-semibold uppercase text-amber-600 dark:text-amber-400">Requires Action</h3>
          {needsReview.length > 0 ? (
            <ul className="mt-3 space-y-2">{needsReview.map((p) => (
              <li key={p.ticker} className="text-sm"><span className="font-mono font-bold">{p.ticker}</span> — {p.signal === "reduce" ? "REDUCE signal active" : `significant drawdown`}</li>
            ))}</ul>
          ) : <p className="mt-3 text-sm text-muted-foreground">No immediate action required</p>}
        </div>

        <div className="card">
          <h3 className="text-xs font-semibold uppercase text-blue-600 dark:text-blue-400">Suggested Next Action</h3>
          <p className="mt-3 text-sm">
            {overThemes.length > 0
              ? `Reduce ${overThemes[0][0]} concentration (${overThemes[0][1].toFixed(1)}% → ≤${THEME_LIMIT}%). Trim 1-2 positions or increase cash.`
              : weak.length > 0
              ? `Review thesis for ${weak[0].ticker}. Check if invalidation conditions are triggered. Consider reducing if thesis broken.`
              : "Portfolio is well-positioned. Maintain current allocation. No changes recommended this week."}
          </p>
        </div>
      </div>

      <div className="card">
        <h3 className="text-xs font-semibold uppercase text-muted-foreground">Portfolio Thesis</h3>
        <p className="mt-2 text-sm">Concentrated exposure to structural themes (AI/semiconductors, cybersecurity, healthcare) within Sharia-compliant boundaries. Anchored by Halal Finance ETFs. Energy and industrial positions provide defensive balance.</p>
        <div className="mt-3 grid gap-2 text-xs sm:grid-cols-3">
          <div><span className="text-muted-foreground">Posture:</span> {regimeLabels[data.regime]} — Quality + Defensive</div>
          <div><span className="text-muted-foreground">Key Risk:</span> Semiconductor concentration ({data.themes["Semiconductors"]?.toFixed(1) || "0"}%)</div>
          <div><span className="text-muted-foreground">Review:</span> Weekly (Monday)</div>
        </div>
      </div>
    </div>
  );
}

// ── Shared Components ────────────────────────────────────────────────────────

function Stat({ label, value, variant }: { label: string; value: string; variant?: "green" | "red" | "blue" }) {
  const colors = { green: "text-emerald-600 dark:text-emerald-400", red: "text-red-600 dark:text-red-400", blue: "text-blue-600 dark:text-blue-400" };
  return (
    <div>
      <p className="text-[11px] font-medium uppercase text-muted-foreground">{label}</p>
      <p className={`mt-1 text-lg font-bold ${variant ? colors[variant] : "text-foreground"}`}>{value}</p>
    </div>
  );
}
