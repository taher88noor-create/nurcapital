"use client";

import { useMemo } from "react";
import {
  calculateDrawdown,
  generateHealthCheck,
  generateMockMarketData,
  type DrawdownResult,
  type HealthCheck,
} from "@/lib/drawdown-engine";
import { SIGNAL_RECORDS } from "@/data/assets";

// Derive conviction signals from the single source of truth
const CONVICTION_SIGNALS = SIGNAL_RECORDS.map((s) => ({
  ticker: s.ticker,
  name: s.companyName,
  signalPrice: s.signalPrice,
  theme: s.theme,
}));

interface AnomalyCard extends DrawdownResult {
  theme: string;
  health: HealthCheck;
}

export default function DashboardPage() {
  // Calculate drawdowns for all conviction assets
  const anomalies = useMemo<AnomalyCard[]>(() => {
    const results: AnomalyCard[] = [];
    for (const signal of CONVICTION_SIGNALS) {
      const market = generateMockMarketData(signal.ticker, signal.signalPrice);
      const { pctDrop, tier } = calculateDrawdown(market.currentPrice, market.high52w);

      if (tier !== "none") {
        results.push({
          ticker: signal.ticker,
          name: signal.name,
          currentPrice: market.currentPrice,
          high52w: market.high52w,
          pctDrop,
          tier,
          daysSinceHigh: market.daysSinceHigh,
          volumeSpikeRatio: market.volumeSpikeRatio,
          theme: signal.theme,
          health: generateHealthCheck(signal.ticker, pctDrop),
        });
      }
    }
    return results.sort((a, b) => b.pctDrop - a.pctDrop);
  }, []);

  const structural = anomalies.filter((a) => a.tier === "structural");
  const tactical = anomalies.filter((a) => a.tier === "tactical");

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Portfolio Command Centre</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Real-time anomaly detection across your Conviction List. Identifying drawdown opportunities.
        </p>
      </div>

      {/* Status Bar */}
      <div className="flex items-center gap-4 rounded-xl border border-border bg-panel p-4 dark:border-border-dark dark:bg-panel-dark">
        <div className="flex-1">
          <span className="text-[10px] uppercase text-muted-foreground">Conviction Assets Monitored</span>
          <p className="text-xl font-bold">{CONVICTION_SIGNALS.length}</p>
        </div>
        <div className="flex-1 text-center">
          <span className="text-[10px] uppercase text-muted-foreground">Active Anomalies</span>
          <p className={`text-xl font-bold ${anomalies.length > 0 ? "text-amber-600 dark:text-amber-400" : "text-emerald-600 dark:text-emerald-400"}`}>{anomalies.length}</p>
        </div>
        <div className="flex-1 text-right">
          <span className="text-[10px] uppercase text-muted-foreground">Structural Discounts</span>
          <p className={`text-xl font-bold ${structural.length > 0 ? "text-red-600 dark:text-red-400" : "text-emerald-600 dark:text-emerald-400"}`}>{structural.length}</p>
        </div>
      </div>

      {/* No Anomalies State */}
      {anomalies.length === 0 && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-8 text-center dark:border-emerald-900 dark:bg-emerald-950/20">
          <p className="text-lg font-semibold text-emerald-700 dark:text-emerald-400">No systemic portfolio discounts detected.</p>
          <p className="mt-2 text-sm text-emerald-600 dark:text-emerald-500">Risk parameters normal. All conviction assets trading within expected ranges.</p>
        </div>
      )}

      {/* Structural Discounts (20%+) */}
      {structural.length > 0 && (
        <div>
          <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide">
            <span className="h-2 w-2 rounded-full bg-red-500" />
            <span className="text-red-600 dark:text-red-400">Structural Discounts (20%+ drawdown)</span>
          </h2>
          <div className="space-y-4">
            {structural.map((anomaly) => (
              <AnomalyPanel key={anomaly.ticker} anomaly={anomaly} />
            ))}
          </div>
        </div>
      )}

      {/* Tactical Pullbacks (10-20%) */}
      {tactical.length > 0 && (
        <div>
          <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide">
            <span className="h-2 w-2 rounded-full bg-amber-500" />
            <span className="text-amber-600 dark:text-amber-400">Tactical Pullbacks (10-20% drawdown)</span>
          </h2>
          <div className="space-y-4">
            {tactical.map((anomaly) => (
              <AnomalyPanel key={anomaly.ticker} anomaly={anomaly} />
            ))}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="border-t border-border pt-4 text-center text-xs text-muted-foreground dark:border-border-dark">
        Drawdowns calculated against simulated 52-week highs. Connect live data for real-time anomaly detection. Not financial advice.
      </div>
    </div>
  );
}

// ── Anomaly Card Component ───────────────────────────────────────────────────

function AnomalyPanel({ anomaly }: { anomaly: AnomalyCard }) {
  const tierColor = anomaly.tier === "structural"
    ? "border-red-200 bg-red-50/50 dark:border-red-900 dark:bg-red-950/20"
    : "border-amber-200 bg-amber-50/50 dark:border-amber-900 dark:bg-amber-950/20";

  return (
    <div className={`rounded-xl border p-5 ${tierColor}`}>
      {/* Header */}
      <div className="mb-4 flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-sm font-bold">{anomaly.ticker}</span>
            <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[9px] text-slate-600 dark:bg-slate-800 dark:text-slate-400">{anomaly.theme}</span>
          </div>
          <p className="mt-1 text-sm font-medium">{anomaly.name}</p>
        </div>
        <div className="text-right">
          <p className={`text-2xl font-extrabold ${anomaly.tier === "structural" ? "text-red-600 dark:text-red-400" : "text-amber-600 dark:text-amber-400"}`}>
            -{anomaly.pctDrop}%
          </p>
          <p className="text-[10px] text-muted-foreground">from 52w high</p>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="mb-4 grid grid-cols-4 gap-3 rounded-lg bg-white/60 p-3 dark:bg-slate-900/40">
        <div className="text-center">
          <p className="text-[9px] uppercase text-muted-foreground">Current</p>
          <p className="text-sm font-bold">${anomaly.currentPrice}</p>
        </div>
        <div className="text-center">
          <p className="text-[9px] uppercase text-muted-foreground">52W High</p>
          <p className="text-sm font-bold">${anomaly.high52w}</p>
        </div>
        <div className="text-center">
          <p className="text-[9px] uppercase text-muted-foreground">Days Since High</p>
          <p className="text-sm font-bold">{anomaly.daysSinceHigh}d</p>
        </div>
        <div className="text-center">
          <p className="text-[9px] uppercase text-muted-foreground">Volume Spike</p>
          <p className={`text-sm font-bold ${anomaly.volumeSpikeRatio > 1.5 ? "text-amber-600" : ""}`}>{anomaly.volumeSpikeRatio}x</p>
        </div>
      </div>

      {/* Health Check */}
      <div className="space-y-2">
        <p className="text-[9px] font-semibold uppercase text-muted-foreground">Kiro Rapid-Audit Checklist</p>
        <HealthCheckItem label="Moving Average Support" passed={anomaly.health.maSupport} note={anomaly.health.maSupportNote} />
        <HealthCheckItem label="Shariah Capitalisation Guard" passed={anomaly.health.shariahGuard} note={anomaly.health.shariahGuardNote} />
        <HealthCheckItem label="Underlying Moat Status" passed={anomaly.health.moatStatus} note={anomaly.health.moatStatusNote} />
      </div>
    </div>
  );
}

function HealthCheckItem({ label, passed, note }: { label: string; passed: boolean; note: string }) {
  return (
    <div className="flex items-start gap-2 rounded-lg bg-white/40 p-2 dark:bg-slate-900/30">
      <span className={`mt-0.5 text-sm ${passed ? "text-emerald-500" : "text-red-500"}`}>
        {passed ? "✓" : "✗"}
      </span>
      <div>
        <p className="text-xs font-medium">{label}</p>
        <p className="text-[10px] text-muted-foreground">{note}</p>
      </div>
    </div>
  );
}
