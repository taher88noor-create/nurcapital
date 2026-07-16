"use client";

import { useState, useEffect, useMemo } from "react";
import { searchUniverse } from "@/data/asset-universe";
import type { UniverseAsset } from "@/data/asset-universe";
import Link from "next/link";

// Tickers already on Conviction List
const CONVICTION_LIST_TICKERS = new Set([
  "TSM", "ASML", "LLY", "CRWD", "AMD", "AVGO", "PANW", "ABB", "NVO", "ENPH",
  "INFY", "NU", "SE", "CPNG", "GLOB", "MMYT", "VALE", "PBR", "AMX", "FMX",
  "RDY", "UMC", "PKX", "TTM",
  "ISDE.L", "ISWD.L", "HTWD.L", "SEMI.L", "SMH.L", "INRG.L", "RENW.L", "HEAL.L", "VFEM.L",
]);

const REGIONS = ["Global", "MENA", "Asia-Pacific", "Europe", "North America", "Latin America"];
const SECTORS = ["Technology", "Healthcare", "Energy", "Industrials", "Consumer", "Financials"];

// Task definitions
interface TaskDef {
  id: string;
  label: string;
  description: string;
  explanation: string;
  loadingText: string;
}

const TASKS: TaskDef[] = [
  { id: "shariah", label: "Shariah Cleanse", description: "Ethical compliance filter", explanation: "Filters out companies tied to non-ethical sectors (interest-based finance, weapons, gambling, alcohol, Israel exposure) based on Shariah compliance rules.", loadingText: "Kiro screening compliance data..." },
  { id: "access", label: "Access & Liquidity Filter", description: "AJ Bell availability check", explanation: "Keeps only companies with highly liquid ADRs or direct listings available to purchase on your retail brokerage (AJ Bell).", loadingText: "Kiro checking broker availability..." },
  { id: "technical", label: "Technical Momentum Scan", description: "Price trend analysis", explanation: "Removes the bottom 20% of companies showing negative momentum (trading below their 200-day moving average or in sustained downtrend).", loadingText: "Kiro analyzing price momentum..." },
  { id: "conviction", label: "Conviction Sizing & Valuation", description: "Portfolio engine grading", explanation: "Grades the remaining assets into clear BUY, HOLD, or WATCH tiers based on revenue stability, competitive position, and volatility.", loadingText: "Kiro running conviction engine..." },
];

export default function InvestmentLensPage() {
  const [searchTerms, setSearchTerms] = useState<string[]>([]);
  const [newTerm, setNewTerm] = useState("");
  const [executedTaskIds, setExecutedTaskIds] = useState<string[]>([]);
  const [runningTaskId, setRunningTaskId] = useState<string | null>(null);
  const [taskRemovedCounts, setTaskRemovedCounts] = useState<Record<string, number>>({});
  const [promoteMessage, setPromoteMessage] = useState<string | null>(null);
  const [expandedTask, setExpandedTask] = useState<string | null>(null);

  // Raw theme search results (source of truth)
  const rawThemeAssets = useMemo(() => {
    if (searchTerms.length === 0) return [];
    return searchUniverse(searchTerms);
  }, [searchTerms]);

  // Dynamically filter based on executed tasks (order-independent)
  const filteredAssets = useMemo(() => {
    let assets = [...rawThemeAssets];
    if (executedTaskIds.includes("shariah")) {
      assets = assets.filter((a) => a.screening === "approved");
    }
    if (executedTaskIds.includes("access")) {
      assets = assets.filter((a) => a.ajBell === true);
    }
    if (executedTaskIds.includes("technical")) {
      const cutoff = Math.ceil(assets.length * 0.8);
      assets = assets.slice(0, Math.max(cutoff, 3));
    }
    return assets;
  }, [rawThemeAssets, executedTaskIds]);

  // Add search term
  const addTerm = (term: string) => {
    if (!term.trim() || searchTerms.includes(term.trim())) return;
    setSearchTerms([...searchTerms, term.trim()]);
    setNewTerm("");
    setExecutedTaskIds([]);
    setTaskRemovedCounts({});
  };

  const removeTerm = (term: string) => {
    const updated = searchTerms.filter((t) => t !== term);
    setSearchTerms(updated);
    if (updated.length === 0) { setExecutedTaskIds([]); setTaskRemovedCounts({}); }
  };

  // Execute a task
  const executeTask = async (taskId: string) => {
    setRunningTaskId(taskId);
    await new Promise((r) => setTimeout(r, 1500));

    const beforeCount = filteredAssets.length;
    const newExecuted = [...executedTaskIds, taskId];
    setExecutedTaskIds(newExecuted);

    // Calculate removed count after state updates
    setTimeout(() => {
      let tempAssets = [...rawThemeAssets];
      if (newExecuted.includes("shariah")) tempAssets = tempAssets.filter((a) => a.screening === "approved");
      if (newExecuted.includes("access")) tempAssets = tempAssets.filter((a) => a.ajBell === true);
      if (newExecuted.includes("technical")) tempAssets = tempAssets.slice(0, Math.max(Math.ceil(tempAssets.length * 0.8), 3));
      setTaskRemovedCounts((prev) => ({ ...prev, [taskId]: beforeCount - tempAssets.length }));
    }, 50);

    setRunningTaskId(null);
  };

  // Reset a task
  const resetTask = (taskId: string) => {
    setExecutedTaskIds((prev) => prev.filter((id) => id !== taskId));
    setTaskRemovedCounts((prev) => { const n = { ...prev }; delete n[taskId]; return n; });
  };

  const handlePromote = (ticker: string, name: string) => {
    const existing = JSON.parse(localStorage.getItem("nc_promoted") || "[]");
    if (!existing.includes(ticker)) { existing.push(ticker); localStorage.setItem("nc_promoted", JSON.stringify(existing)); }
    setPromoteMessage(`✓ ${ticker} (${name}) added to Conviction List request.`);
    setTimeout(() => setPromoteMessage(null), 3000);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Investment Lens</h1>
        <p className="mt-1 text-sm text-muted-foreground">Define themes. Run modular analyst tasks in any order. Promote survivors to Conviction List.</p>
      </div>

      {/* Search Input */}
      <div className="card">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">Search Themes</h2>
        <div className="flex gap-2">
          <input value={newTerm} onChange={(e) => setNewTerm(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addTerm(newTerm)}
            placeholder="e.g. Semiconductors, Healthcare, Asia-Pacific..."
            className="flex-1 rounded-lg border border-border bg-panel px-3 py-2 text-sm dark:border-border-dark dark:bg-panel-dark" />
          <button onClick={() => addTerm(newTerm)} disabled={!newTerm.trim()} className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 disabled:opacity-50">Search</button>
        </div>
        <div className="mt-3 flex flex-wrap gap-1">
          {[...REGIONS, ...SECTORS].map((t) => (
            <button key={t} onClick={() => addTerm(t)} className={`rounded-full px-2.5 py-1 text-[10px] font-medium transition ${searchTerms.includes(t) ? "bg-brand-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400"}`}>{t}</button>
          ))}
        </div>
        {searchTerms.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {searchTerms.map((t) => (
              <span key={t} className="inline-flex items-center gap-1 rounded-full bg-brand-50 px-3 py-1 text-xs font-medium text-brand-700 dark:bg-brand-950/30 dark:text-brand-400">{t}<button onClick={() => removeTerm(t)} className="ml-1 hover:text-brand-900">×</button></span>
            ))}
          </div>
        )}
      </div>

      {/* Pool Tracker */}
      {rawThemeAssets.length > 0 && (
        <div className="flex items-center gap-3 rounded-lg bg-slate-50 px-4 py-3 text-sm dark:bg-slate-800/50">
          <span>Raw Matches: <strong>{rawThemeAssets.length}</strong></span>
          <span className="text-muted-foreground">→</span>
          <span>Remaining: <strong className={filteredAssets.length < rawThemeAssets.length ? "text-emerald-600 dark:text-emerald-400" : ""}>{filteredAssets.length}</strong></span>
          {executedTaskIds.length > 0 && <span className="ml-auto text-xs text-muted-foreground">{executedTaskIds.length}/{TASKS.length} tasks executed</span>}
        </div>
      )}

      {/* Modular Task Cards */}
      {rawThemeAssets.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2">
          {TASKS.map((task) => {
            const isExecuted = executedTaskIds.includes(task.id);
            const isRunning = runningTaskId === task.id;
            const removed = taskRemovedCounts[task.id] || 0;
            const isExpanded = expandedTask === task.id;

            return (
              <div key={task.id} className={`rounded-xl border p-5 transition ${
                isExecuted ? "border-emerald-200 bg-emerald-50/50 dark:border-emerald-900 dark:bg-emerald-950/20" :
                isRunning ? "border-brand-300 bg-brand-50/50 dark:border-brand-800 dark:bg-brand-950/20" :
                "border-border bg-panel dark:border-border-dark dark:bg-panel-dark"
              }`}>
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                      isExecuted ? "bg-emerald-500 text-white" : isRunning ? "bg-brand-600 text-white" : "bg-slate-200 text-slate-500 dark:bg-slate-700 dark:text-slate-400"
                    }`}>
                      {isExecuted ? "✓" : isRunning ? "⟳" : "○"}
                    </span>
                    <div>
                      <p className="text-sm font-semibold">{task.label}</p>
                      <p className="text-[11px] text-muted-foreground">{task.description}</p>
                    </div>
                  </div>
                  {isExecuted && removed > 0 && (
                    <span className="rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-medium text-red-700 dark:bg-red-950 dark:text-red-400">-{removed} filtered</span>
                  )}
                </div>

                {/* Expandable explanation */}
                <button onClick={() => setExpandedTask(isExpanded ? null : task.id)} className="mt-2 text-[10px] text-brand-600 hover:text-brand-800 dark:text-brand-400">
                  {isExpanded ? "Hide explanation ▲" : "What is this? ▼"}
                </button>
                {isExpanded && (
                  <p className="mt-2 rounded-lg bg-slate-100 p-3 text-xs text-muted-foreground dark:bg-slate-800/50">{task.explanation}</p>
                )}

                {/* Action */}
                <div className="mt-4">
                  {isRunning && (
                    <div className="flex items-center gap-2 text-xs text-brand-700 dark:text-brand-400">
                      <span className="h-3 w-3 animate-spin rounded-full border-2 border-brand-600 border-t-transparent" />
                      {task.loadingText}
                    </div>
                  )}
                  {!isExecuted && !isRunning && (
                    <button onClick={() => executeTask(task.id)} className="rounded-lg bg-brand-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-brand-700">
                      Run Analysis
                    </button>
                  )}
                  {isExecuted && (
                    <button onClick={() => resetTask(task.id)} className="text-[10px] text-muted-foreground hover:text-red-600">
                      Reset Task
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Promote message */}
      {promoteMessage && (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700 fade-in dark:border-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-400">{promoteMessage}</div>
      )}

      {/* Asset Results */}
      {filteredAssets.length > 0 && (
        <div className="card">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            {executedTaskIds.length === TASKS.length ? `Conviction Candidates (${filteredAssets.length})` : `Assets Surviving Filters (${filteredAssets.length})`}
          </h2>
          <div className="space-y-2">
            {filteredAssets.map((asset) => {
              const inConviction = CONVICTION_LIST_TICKERS.has(asset.ticker);
              return (
                <div key={asset.ticker} className={`flex items-center gap-3 rounded-lg border border-border/50 p-3 transition hover:-translate-y-0.5 hover:shadow-elevated dark:border-border-dark/50 ${inConviction ? "opacity-50" : ""}`}>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-bold">{asset.ticker}</span>
                      <span className="text-sm">{asset.name}</span>
                      <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[9px] text-slate-500 dark:bg-slate-800">{asset.type}</span>
                      {inConviction && (
                        <Link href="/research" className="rounded bg-emerald-100 px-1.5 py-0.5 text-[9px] font-medium text-emerald-700 hover:underline dark:bg-emerald-950 dark:text-emerald-400">
                          On Conviction List →
                        </Link>
                      )}
                    </div>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {asset.tags.slice(0, 4).map((tag) => (
                        <span key={tag} className={`rounded-full px-1.5 py-0.5 text-[9px] ${searchTerms.some((t) => tag.toLowerCase().includes(t.toLowerCase())) ? "bg-brand-100 text-brand-700 dark:bg-brand-950 dark:text-brand-400" : "bg-slate-50 text-slate-500 dark:bg-slate-800/50"}`}>{tag}</span>
                      ))}
                    </div>
                  </div>
                  <span className="text-[10px] text-muted-foreground">{asset.region}</span>
                  {!inConviction && (
                    <button onClick={() => handlePromote(asset.ticker, asset.name)}
                      className="shrink-0 rounded-lg border border-brand-300 px-3 py-1.5 text-[10px] font-medium text-brand-700 transition hover:bg-brand-50 dark:border-brand-700 dark:text-brand-400 dark:hover:bg-brand-950/30">
                      + Conviction List
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Empty state */}
      {searchTerms.length === 0 && (
        <div className="card py-12 text-center">
          <p className="text-lg font-medium text-muted-foreground">Enter a theme to start the analyst pipeline</p>
          <p className="mt-2 text-xs text-muted-foreground">Try: Semiconductors, Healthcare, Asia-Pacific, Clean Energy, Cybersecurity</p>
        </div>
      )}

      <div className="border-t border-border pt-4 text-center text-xs text-muted-foreground dark:border-border-dark">
        Analyst scans NYSE · NASDAQ · LSE · Euronext · Asia-Pacific · Latin America. Run tasks in any order.
      </div>
    </div>
  );
}
