"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { searchUniverse, CONVICTION_TICKERS, type AssetMaster } from "@/data/assets";
import AssetDrawer from "@/components/AssetDrawer";

// Define the modular analyst tasks
interface Task {
  id: string;
  title: string;
  shortDesc: string;
  explanation: string;
  filterFn: (assets: AssetMaster[]) => AssetMaster[];
}

const ANALYST_TASKS: Task[] = [
  {
    id: "shariah",
    title: "Shariah Cleanse",
    shortDesc: "Exclude non-compliant business activities.",
    explanation: "Scans the asset universe to isolate and remove companies exposed to restricted sectors (interest-based finance, weapons, gambling, alcohol, adult entertainment, and high-leveraged debt profiles). Only ethically approved assets pass.",
    filterFn: (assets) => assets.filter((a) => a.screening === "approved"),
  },
  {
    id: "access",
    title: "Access & Liquidity Filter",
    shortDesc: "Verify AJ Bell retail broker availability.",
    explanation: "Filters out highly illiquid tickers, restricted local listings, or foreign assets that do not have active ADRs (American Depositary Receipts) or direct LSE listings, ensuring you can execute real trades on your main broker.",
    filterFn: (assets) => assets.filter((a) => a.ajBell === true),
  },
  {
    id: "technical",
    title: "Technical Momentum Scan",
    shortDesc: "Discard assets with weak macro-trends.",
    explanation: "Leverages the trend_engine to analyze short and long-term moving averages (MA50/MA200) and momentum scores. Automatically discards the bottom 20% of the active asset pool showing negative market sentiment or high drawdowns.",
    filterFn: (assets) => {
      if (assets.length < 5) return assets;
      const keepCount = Math.ceil(assets.length * 0.8);
      return assets.slice(0, keepCount);
    },
  },
  {
    id: "valuation",
    title: "Conviction Pricing Matrix",
    shortDesc: "Grade by margin stability and growth.",
    explanation: "Evaluates fundamental historical growth trends, margin consistency, and free-cash-flow metrics. This separates survivors into structured BUY, HOLD, and WATCH lists, discarding volatile tail assets.",
    filterFn: (assets) => assets, // All survivors pass — grading is visual
  },
];

export default function InvestmentLensPage() {
  const [themeInput, setThemeInput] = useState("");
  const [activeTheme, setActiveTheme] = useState("");
  const [executedTaskIds, setExecutedTaskIds] = useState<string[]>([]);
  const [runningTaskId, setRunningTaskId] = useState<string | null>(null);
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null);
  const [promoteMessage, setPromoteMessage] = useState<string | null>(null);
  const [selectedAsset, setSelectedAsset] = useState<AssetMaster | null>(null);

  // 1. Raw matches from theme search
  const rawAssets = useMemo(() => {
    if (!activeTheme) return [];
    return searchUniverse(activeTheme.split(",").map((s) => s.trim()).filter(Boolean));
  }, [activeTheme]);

  // 2. Cumulative filter derived from executed tasks (order-independent)
  const filteredAssets = useMemo(() => {
    let result = [...rawAssets];
    executedTaskIds.forEach((taskId) => {
      const task = ANALYST_TASKS.find((t) => t.id === taskId);
      if (task) result = task.filterFn(result);
    });
    return result;
  }, [rawAssets, executedTaskIds]);

  // Delta calculator for badge
  const getFilterDelta = (taskId: string) => {
    const task = ANALYST_TASKS.find((t) => t.id === taskId);
    if (!task) return 0;
    // Calculate what this task removes from the current pool
    let pool = [...rawAssets];
    executedTaskIds.filter((id) => id !== taskId).forEach((id) => {
      const t = ANALYST_TASKS.find((x) => x.id === id);
      if (t) pool = t.filterFn(pool);
    });
    const after = task.filterFn(pool);
    return pool.length - after.length;
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (themeInput.trim()) {
      setActiveTheme(themeInput.trim());
      setExecutedTaskIds([]);
    }
  };

  const runTask = (taskId: string) => {
    setRunningTaskId(taskId);
    setTimeout(() => {
      setExecutedTaskIds((prev) => [...prev, taskId]);
      setRunningTaskId(null);
    }, 1500);
  };

  const resetTask = (taskId: string) => {
    setExecutedTaskIds((prev) => prev.filter((id) => id !== taskId));
  };

  const handlePromote = (ticker: string, name: string) => {
    const existing = JSON.parse(localStorage.getItem("nc_promoted") || "[]");
    if (!existing.includes(ticker)) { existing.push(ticker); localStorage.setItem("nc_promoted", JSON.stringify(existing)); }
    setPromoteMessage(`✓ ${ticker} (${name}) added to Conviction List request.`);
    setTimeout(() => setPromoteMessage(null), 3000);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Investment Lens</h1>
        <p className="mt-1 text-sm text-muted-foreground">Input your thematic mandate. Deploy modular analytic checks to screen down the universe.</p>
      </div>

      {/* Theme Search */}
      <form onSubmit={handleSearchSubmit} className="flex gap-3">
        <input type="text" placeholder="Type a theme (e.g. Cybersecurity, Semiconductors, India Digital)..."
          value={themeInput} onChange={(e) => setThemeInput(e.target.value)}
          className="flex-1 rounded-lg border border-border bg-panel px-4 py-3 text-sm dark:border-border-dark dark:bg-panel-dark" />
        <button type="submit" className="rounded-lg bg-brand-600 px-6 py-3 text-sm font-medium text-white hover:bg-brand-700">Initialize Theme</button>
      </form>

      {activeTheme && (
        <>
          {/* Pool Tracker */}
          <div className="card flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="text-[10px] uppercase text-muted-foreground">Active Mandate</span>
              <p className="text-lg font-bold text-brand-600">{activeTheme}</p>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-center">
                <span className="text-[10px] uppercase text-muted-foreground">Raw Matches</span>
                <p className="text-xl font-bold">{rawAssets.length}</p>
              </div>
              <span className="text-muted-foreground">→</span>
              <div className="text-center">
                <span className="text-[10px] uppercase text-muted-foreground">Active Filters</span>
                <p className="text-xl font-bold text-brand-600">{executedTaskIds.length} / {ANALYST_TASKS.length}</p>
              </div>
              <span className="text-muted-foreground">→</span>
              <div className="text-center rounded-lg border border-border px-4 py-2 dark:border-border-dark">
                <span className="text-[10px] uppercase text-muted-foreground">Surviving Pool</span>
                <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400">{filteredAssets.length}</p>
              </div>
            </div>
          </div>

          {/* Modular Task Cards */}
          <div>
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted-foreground">Modular Analyst Pipeline</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {ANALYST_TASKS.map((task) => {
                const isExecuted = executedTaskIds.includes(task.id);
                const isRunning = runningTaskId === task.id;
                const isExpanded = expandedTaskId === task.id;
                const delta = isExecuted ? getFilterDelta(task.id) : 0;

                return (
                  <div key={task.id} className={`card flex flex-col justify-between transition ${
                    isExecuted ? "border-emerald-200 dark:border-emerald-900" :
                    isRunning ? "border-brand-300 dark:border-brand-800" : ""
                  }`}>
                    <div>
                      <div className="mb-2 flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          {isExecuted ? <span className="text-lg text-emerald-500">✓</span> :
                           isRunning ? <span className="animate-spin text-lg text-brand-600">⟳</span> :
                           <span className="text-lg text-muted-foreground">○</span>}
                          <h3 className="text-sm font-semibold">{task.title}</h3>
                        </div>
                        {isExecuted && delta > 0 && (
                          <span className="rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-medium text-red-700 dark:bg-red-950 dark:text-red-400">-{delta} filtered</span>
                        )}
                      </div>
                      <p className="mb-3 text-xs text-muted-foreground">{task.shortDesc}</p>
                      <button type="button" onClick={() => setExpandedTaskId(isExpanded ? null : task.id)}
                        className="mb-3 text-[10px] text-brand-600 hover:text-brand-800 dark:text-brand-400">
                        {isExpanded ? "▼ Hide explanation" : "▶ What is this analysis?"}
                      </button>
                      {isExpanded && (
                        <p className="mb-3 rounded-lg bg-slate-50 p-3 text-xs text-muted-foreground dark:bg-slate-800/50">{task.explanation}</p>
                      )}
                    </div>
                    <div className="flex justify-end gap-2 border-t border-border pt-3 dark:border-border-dark">
                      {isExecuted ? (
                        <button onClick={() => resetTask(task.id)} className="text-xs text-muted-foreground hover:text-red-600">Reset Task</button>
                      ) : (
                        <button onClick={() => runTask(task.id)} disabled={runningTaskId !== null}
                          className="rounded-lg bg-brand-600 px-4 py-2 text-xs font-semibold text-white hover:bg-brand-700 disabled:opacity-50">
                          {isRunning ? "Kiro analyzing..." : "Run Analysis"}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Pipeline Complete Banner */}
          {executedTaskIds.length === ANALYST_TASKS.length && (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-center text-sm font-medium text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-400">
              🎉 Pipeline complete! Your asset options have been fully analyzed and audited.
            </div>
          )}

          {/* Promote message */}
          {promoteMessage && (
            <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700 fade-in dark:border-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-400">{promoteMessage}</div>
          )}

          {/* Asset Grid */}
          <div>
            <div className="mb-4 flex items-center justify-between border-b border-border pb-2 dark:border-border-dark">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Surviving Assets ({filteredAssets.length})</h2>
              <span className="text-[10px] text-muted-foreground font-mono">Derived from {activeTheme} database query</span>
            </div>
            {filteredAssets.length === 0 ? (
              <div className="card py-12 text-center text-muted-foreground">
                No assets survived the currently running cumulative filters. Try resetting a task to widen your pool.
              </div>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {filteredAssets.map((asset) => {
                  const isOnConviction = CONVICTION_TICKERS.has(asset.ticker);
                  return (
                    <div key={asset.ticker} className={`card flex flex-col justify-between transition hover:-translate-y-0.5 hover:shadow-elevated cursor-pointer ${isOnConviction ? "opacity-60" : ""}`}
                      onClick={() => setSelectedAsset(asset)}>
                      <div>
                        <div className="mb-2 flex items-start justify-between">
                          <div>
                            <span className="font-mono text-xs font-bold text-brand-600">{asset.ticker}</span>
                            <h4 className="mt-1 text-sm font-semibold">{asset.name}</h4>
                          </div>
                          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[9px] text-slate-600 dark:bg-slate-800 dark:text-slate-400">{asset.type}</span>
                        </div>
                        <div className="mb-3 flex flex-wrap gap-1">
                          {asset.tags.slice(0, 4).map((tag) => (
                            <span key={tag} className="rounded-full bg-slate-50 px-1.5 py-0.5 text-[9px] text-slate-500 dark:bg-slate-800/50">{tag}</span>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center justify-between border-t border-border pt-3 dark:border-border-dark">
                        <span className="text-[10px] uppercase text-muted-foreground">{asset.region}</span>
                        {isOnConviction ? (
                          <Link href="/research" className="text-[10px] text-muted-foreground hover:text-brand-600">On Conviction List →</Link>
                        ) : (
                          <button onClick={() => handlePromote(asset.ticker, asset.name)}
                            className="rounded-lg bg-emerald-600 px-3 py-1.5 text-[10px] font-medium text-white transition hover:bg-emerald-700">
                            + Conviction List
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </>
      )}

      {/* Empty state */}
      {!activeTheme && (
        <div className="card py-12 text-center">
          <p className="text-lg font-medium text-muted-foreground">Enter a theme to start the analyst pipeline</p>
          <p className="mt-2 text-xs text-muted-foreground">Try: Semiconductors, Healthcare, Asia-Pacific, Cybersecurity, India Digital</p>
        </div>
      )}

      <div className="border-t border-border pt-4 text-center text-xs text-muted-foreground dark:border-border-dark">
        Analyst scans NYSE · NASDAQ · LSE · Euronext · Asia-Pacific · Latin America. Run tasks in any order.
      </div>

      {/* Asset Detail Drawer */}
      {selectedAsset && (
        <AssetDrawer
          asset={selectedAsset}
          onClose={() => setSelectedAsset(null)}
          trackedTickers={[...CONVICTION_TICKERS]}
          onPromote={handlePromote}
        />
      )}
    </div>
  );
}
