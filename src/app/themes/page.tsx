"use client";

import { useState, useEffect } from "react";
import { ASSET_UNIVERSE, searchUniverse } from "@/data/asset-universe";
import type { UniverseAsset } from "@/data/asset-universe";

// Tickers already on Conviction List
const CONVICTION_LIST_TICKERS = new Set([
  "TSM", "ASML", "LLY", "CRWD", "AMD", "AVGO", "PANW", "ABB", "NVO", "ENPH",
  "INFY", "NU", "SE", "CPNG", "GLOB", "MMYT", "VALE", "PBR", "AMX", "FMX",
  "RDY", "UMC", "PKX", "TTM",
  "ISDE.L", "ISWD.L", "HTWD.L", "SEMI.L", "SMH.L", "INRG.L", "RENW.L", "HEAL.L", "VFEM.L",
]);

// Hardcoded categories
const REGIONS = ["Global", "MENA", "Asia-Pacific", "Europe", "North America", "Latin America", "Africa"];
const SECTORS = ["Technology", "Healthcare", "Energy", "Industrials", "Consumer", "Financials", "Materials"];

// Pipeline step definition
interface PipelineStep {
  id: string;
  label: string;
  description: string;
  isExecuted: boolean;
  active: boolean;
  assetsRemoved: number;
}

const INITIAL_STEPS: PipelineStep[] = [
  { id: "discovery", label: "Theme Discovery", description: "Scanning global indices for keyword matches", isExecuted: false, active: true, assetsRemoved: 0 },
  { id: "screening", label: "Shariah Cleanse", description: "Excluding assets exposed to non-compliant sectors", isExecuted: false, active: false, assetsRemoved: 0 },
  { id: "access", label: "Access & Liquidity Filter", description: "Checking availability on AJ Bell / local brokers", isExecuted: false, active: false, assetsRemoved: 0 },
  { id: "technical", label: "Technical Momentum Scan", description: "Analyzing price vs MA50, MA200 & RSI trends", isExecuted: false, active: false, assetsRemoved: 0 },
  { id: "output", label: "Generate Conviction Ranking", description: "Applying portfolio engine weightings and Buy/Hold signals", isExecuted: false, active: false, assetsRemoved: 0 },
];

export default function InvestmentLensPage() {
  const [searchTerms, setSearchTerms] = useState<string[]>([]);
  const [newTerm, setNewTerm] = useState("");
  const [pipelineSteps, setPipelineSteps] = useState<PipelineStep[]>(INITIAL_STEPS);
  const [discoveredAssets, setDiscoveredAssets] = useState<UniverseAsset[]>([]);
  const [filteredAssets, setFilteredAssets] = useState<UniverseAsset[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [pipelineComplete, setPipelineComplete] = useState(false);
  const [promoteMessage, setPromoteMessage] = useState<string | null>(null);

  // Custom tags from localStorage
  const [customTags, setCustomTags] = useState<string[]>([]);
  useEffect(() => {
    const saved = localStorage.getItem("nc_custom_tags");
    if (saved) setCustomTags(JSON.parse(saved));
  }, []);

  const saveCustomTags = (tags: string[]) => {
    setCustomTags(tags);
    localStorage.setItem("nc_custom_tags", JSON.stringify(tags));
  };

  // Add a search term and auto-run discovery
  const addTerm = (term: string) => {
    if (!term.trim()) return;
    const updated = [...searchTerms, term.trim()];
    setSearchTerms(updated);
    setNewTerm("");
    if (!customTags.includes(term.trim())) saveCustomTags([...customTags, term.trim()]);
    runDiscovery(updated);
  };

  const removeTerm = (term: string) => {
    const updated = searchTerms.filter((t) => t !== term);
    setSearchTerms(updated);
    if (updated.length > 0) runDiscovery(updated);
    else resetPipeline();
  };

  // Step 1: Discovery — runs automatically when terms change
  const runDiscovery = (terms: string[]) => {
    const results = searchUniverse(terms);
    setDiscoveredAssets(results);
    setFilteredAssets(results);
    setPipelineComplete(false);
    setPipelineSteps((prev) => prev.map((s, i) =>
      i === 0 ? { ...s, isExecuted: true, active: false, assetsRemoved: ASSET_UNIVERSE.length - results.length }
      : i === 1 ? { ...s, active: true, isExecuted: false, assetsRemoved: 0 }
      : { ...s, active: false, isExecuted: false, assetsRemoved: 0 }
    ));
  };

  const resetPipeline = () => {
    setPipelineSteps(INITIAL_STEPS);
    setDiscoveredAssets([]);
    setFilteredAssets([]);
    setPipelineComplete(false);
  };

  // Execute the next active step
  const executeStep = async (stepId: string) => {
    setIsRunning(true);

    // Simulate analyst processing time
    await new Promise((resolve) => setTimeout(resolve, 1500));

    let currentAssets = [...filteredAssets];
    let removed = 0;

    switch (stepId) {
      case "screening": {
        const before = currentAssets.length;
        currentAssets = currentAssets.filter((a) => a.screening === "approved");
        removed = before - currentAssets.length;
        break;
      }
      case "access": {
        const before = currentAssets.length;
        currentAssets = currentAssets.filter((a) => a.ajBell === true);
        removed = before - currentAssets.length;
        break;
      }
      case "technical": {
        // Simulate technical filter — remove bottom 20% by fuzzy score
        const before = currentAssets.length;
        const cutoff = Math.floor(currentAssets.length * 0.8);
        currentAssets = currentAssets.slice(0, Math.max(cutoff, 3));
        removed = before - currentAssets.length;
        break;
      }
      case "output": {
        // Final step — just mark complete, assets already filtered
        removed = 0;
        setPipelineComplete(true);
        break;
      }
    }

    setFilteredAssets(currentAssets);

    // Update pipeline state
    setPipelineSteps((prev) => {
      const stepIndex = prev.findIndex((s) => s.id === stepId);
      return prev.map((s, i) => {
        if (i === stepIndex) return { ...s, isExecuted: true, active: false, assetsRemoved: removed };
        if (i === stepIndex + 1) return { ...s, active: true };
        return s;
      });
    });

    setIsRunning(false);
  };

  const handlePromote = (ticker: string, name: string) => {
    const existing = JSON.parse(localStorage.getItem("nc_promoted") || "[]");
    if (!existing.includes(ticker)) {
      existing.push(ticker);
      localStorage.setItem("nc_promoted", JSON.stringify(existing));
    }
    setPromoteMessage(`✓ ${ticker} (${name}) added to Conviction List request.`);
    setTimeout(() => setPromoteMessage(null), 3000);
  };

  const activeStep = pipelineSteps.find((s) => s.active && !s.isExecuted);
  const ratingColors: Record<string, string> = { BUY: "badge-green", HOLD: "badge-blue", REDUCE: "badge-amber" };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Investment Lens</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Define what you want to invest in. The analyst runs a step-by-step pipeline to find the best matches.
        </p>
      </div>

      {/* Theme Input */}
      <div className="card">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">Your Search Themes</h2>
        <div className="flex gap-2">
          <input value={newTerm} onChange={(e) => setNewTerm(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addTerm(newTerm)}
            placeholder="e.g. Semiconductors, Asia-Pacific, Healthcare, Aviation..."
            className="flex-1 rounded-lg border border-border bg-panel px-3 py-2 text-sm dark:border-border-dark dark:bg-panel-dark" />
          <button onClick={() => addTerm(newTerm)} disabled={!newTerm.trim()}
            className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 disabled:opacity-50">
            Search
          </button>
        </div>

        {/* Quick filters */}
        <div className="mt-3 flex flex-wrap gap-1">
          {REGIONS.map((r) => (
            <button key={r} onClick={() => addTerm(r)}
              className={`rounded-full px-2.5 py-1 text-[10px] font-medium transition ${searchTerms.includes(r) ? "bg-brand-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400"}`}>
              {r}
            </button>
          ))}
          {SECTORS.map((s) => (
            <button key={s} onClick={() => addTerm(s)}
              className={`rounded-full px-2.5 py-1 text-[10px] font-medium transition ${searchTerms.includes(s) ? "bg-brand-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400"}`}>
              {s}
            </button>
          ))}
        </div>

        {/* Active terms */}
        {searchTerms.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {searchTerms.map((term) => (
              <span key={term} className="inline-flex items-center gap-1 rounded-full bg-brand-50 px-3 py-1 text-xs font-medium text-brand-700 dark:bg-brand-950/30 dark:text-brand-400">
                {term}
                <button onClick={() => removeTerm(term)} className="ml-1 text-brand-500 hover:text-brand-700">×</button>
              </span>
            ))}
            <button onClick={resetPipeline} className="text-[10px] text-red-500 hover:text-red-700">Clear all</button>
          </div>
        )}
      </div>

      {/* Interactive Analyst Pipeline */}
      {searchTerms.length > 0 && (
        <div className="card">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted-foreground">Analyst Pipeline</h2>
          <div className="space-y-3">
            {pipelineSteps.map((step, i) => (
              <div key={step.id} className={`rounded-lg border p-4 transition ${
                step.isExecuted ? "border-emerald-200 bg-emerald-50/50 dark:border-emerald-900 dark:bg-emerald-950/20" :
                step.active ? "border-brand-300 bg-brand-50/50 dark:border-brand-800 dark:bg-brand-950/20" :
                "border-border/50 opacity-40 dark:border-border-dark/50"
              }`}>
                <div className="flex items-center gap-3">
                  {/* Step indicator */}
                  <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                    step.isExecuted ? "bg-emerald-500 text-white" :
                    step.active ? "bg-brand-600 text-white" :
                    "bg-slate-200 text-slate-500 dark:bg-slate-700"
                  }`}>
                    {step.isExecuted ? "✓" : i + 1}
                  </span>

                  {/* Step info */}
                  <div className="flex-1">
                    <p className="text-sm font-semibold">{step.label}</p>
                    <p className="text-[11px] text-muted-foreground">{step.description}</p>
                  </div>

                  {/* Status / Action */}
                  {step.isExecuted && (
                    <div className="text-right">
                      <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">Complete</span>
                      {step.assetsRemoved > 0 && (
                        <p className="text-[10px] text-muted-foreground">-{step.assetsRemoved} assets filtered</p>
                      )}
                    </div>
                  )}
                  {step.active && !step.isExecuted && (
                    <button
                      onClick={() => executeStep(step.id)}
                      disabled={isRunning}
                      className="shrink-0 rounded-lg bg-brand-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-brand-700 disabled:opacity-50"
                    >
                      {isRunning ? (
                        <span className="flex items-center gap-2">
                          <span className="h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent" />
                          Analysing...
                        </span>
                      ) : (
                        `Run ${step.label}`
                      )}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Pipeline summary */}
          {discoveredAssets.length > 0 && (
            <div className="mt-4 flex items-center gap-4 rounded-lg bg-slate-50 p-3 text-xs dark:bg-slate-800/50">
              <span>Started: <strong>{discoveredAssets.length}</strong> assets</span>
              <span>→</span>
              <span>Remaining: <strong>{filteredAssets.length}</strong> assets</span>
              {pipelineComplete && <span className="ml-auto font-medium text-emerald-600 dark:text-emerald-400">✓ Pipeline complete</span>}
            </div>
          )}
        </div>
      )}

      {/* Promote message */}
      {promoteMessage && (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700 fade-in dark:border-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-400">
          {promoteMessage}
        </div>
      )}

      {/* Asset Results */}
      {filteredAssets.length > 0 && (
        <div className="card">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              {pipelineComplete ? `Conviction Candidates (${filteredAssets.length})` : `Assets in Pipeline (${filteredAssets.length})`}
            </h2>
          </div>
          <div className="space-y-2">
            {filteredAssets.map((asset) => {
              const inConviction = CONVICTION_LIST_TICKERS.has(asset.ticker);
              return (
                <div key={asset.ticker} className={`flex items-center gap-3 rounded-lg border border-border/50 p-3 transition hover:-translate-y-0.5 hover:shadow-elevated dark:border-border-dark/50 ${inConviction ? "opacity-50" : ""}`}>
                  <span className={`badge ${asset.screening === "approved" ? "badge-green" : asset.screening === "watchlist" ? "badge-amber" : "badge-red"}`}>
                    {asset.screening === "approved" ? "✓" : asset.screening === "watchlist" ? "?" : "✗"}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-bold">{asset.ticker}</span>
                      <span className="text-sm">{asset.name}</span>
                      <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[9px] text-slate-500 dark:bg-slate-800">{asset.type}</span>
                      {inConviction && <span className="rounded bg-emerald-100 px-1.5 py-0.5 text-[9px] font-medium text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400">On Conviction List</span>}
                    </div>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {asset.tags.slice(0, 4).map((tag) => (
                        <span key={tag} className={`rounded-full px-1.5 py-0.5 text-[9px] ${searchTerms.some((t) => tag.toLowerCase().includes(t.toLowerCase())) ? "bg-brand-100 text-brand-700 dark:bg-brand-950 dark:text-brand-400" : "bg-slate-50 text-slate-500 dark:bg-slate-800/50"}`}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <span className="text-[10px] text-muted-foreground">{asset.region}</span>
                  {pipelineComplete && !inConviction && (
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
        <div className="card text-center py-12">
          <p className="text-lg font-medium text-muted-foreground">Enter a theme to start the analyst pipeline</p>
          <p className="mt-2 text-xs text-muted-foreground">Try: Semiconductors, Healthcare, Asia-Pacific, Clean Energy</p>
        </div>
      )}

      {/* Footer */}
      <div className="border-t border-border pt-4 text-center text-xs text-muted-foreground dark:border-border-dark">
        The analyst scans NYSE · NASDAQ · LSE · Euronext · Asia-Pacific (via ETFs/ADRs) · Latin America (via ADRs)
      </div>
    </div>
  );
}
