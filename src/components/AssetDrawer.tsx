"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from "recharts";
import type { AssetMaster } from "@/data/assets";

interface AssetDrawerProps {
  asset: AssetMaster | null;
  onClose: () => void;
  trackedTickers: string[];
  onPromote: (ticker: string, name: string) => void;
}

type Horizon = "1M" | "6M" | "1Y" | "5Y" | "10Y";

interface ChartPoint {
  date: string;
  price: number;
  pctChange: number;
}

// Deterministic string hash for seeded random walk
function seedFromString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash);
}

function generateHistoricalData(ticker: string, horizon: Horizon): ChartPoint[] {
  const pointsMap: Record<Horizon, number> = {
    "1M": 30, "6M": 180, "1Y": 365, "5Y": 260, "10Y": 520,
  };
  const steps = pointsMap[horizon];
  const data: ChartPoint[] = [];
  let seed = seedFromString(ticker);

  const random = () => {
    const x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
  };

  const basePrice = 50 + (seedFromString(ticker) % 450);
  const volatility = 0.015 + random() * 0.02;
  const drift = 0.0003 + random() * 0.0008;

  const startDate = new Date();
  if (horizon === "1M") startDate.setMonth(startDate.getMonth() - 1);
  else if (horizon === "6M") startDate.setMonth(startDate.getMonth() - 6);
  else if (horizon === "1Y") startDate.setFullYear(startDate.getFullYear() - 1);
  else if (horizon === "5Y") startDate.setFullYear(startDate.getFullYear() - 5);
  else startDate.setFullYear(startDate.getFullYear() - 10);

  const initialPrice = basePrice * (1 - steps * drift + (random() - 0.5) * 0.15);
  let currentPrice = Math.max(initialPrice, 5);
  const firstPrice = currentPrice;

  for (let i = 0; i < steps; i++) {
    const dayOffset = Math.floor((Date.now() - startDate.getTime()) / steps) * i;
    const pointDate = new Date(startDate.getTime() + dayOffset);
    const shock = random() - 0.48;
    currentPrice = currentPrice * (1 + drift + shock * volatility);
    if (currentPrice < 1) currentPrice = 1;
    const pctChange = ((currentPrice - firstPrice) / firstPrice) * 100;

    data.push({
      date: pointDate.toLocaleDateString(undefined, {
        month: "short",
        year: horizon === "5Y" || horizon === "10Y" ? "2-digit" : undefined,
        day: horizon === "1M" ? "numeric" : undefined,
      }),
      price: Math.round(currentPrice * 100) / 100,
      pctChange: Math.round(pctChange * 100) / 100,
    });
  }
  return data;
}

export default function AssetDrawer({ asset, onClose, trackedTickers, onPromote }: AssetDrawerProps) {
  const [horizon, setHorizon] = useState<Horizon>("1Y");

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const chartData = useMemo(() => {
    if (!asset) return [];
    return generateHistoricalData(asset.ticker, horizon);
  }, [asset, horizon]);

  if (!asset) return null;

  const isLse = asset.ticker.endsWith(".L");
  const currencySymbol = isLse ? "£" : "$";
  const startPrice = chartData[0]?.price || 1;
  const endPrice = chartData[chartData.length - 1]?.price || 1;
  const totalReturn = ((endPrice - startPrice) / startPrice) * 100;
  const isPositive = totalReturn >= 0;
  const isOnConvictionList = trackedTickers.includes(asset.ticker);

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed right-0 top-0 z-50 flex h-full w-full max-w-[450px] flex-col border-l border-border bg-surface shadow-elevated dark:border-border-dark dark:bg-surface-dark">
        {/* Header */}
        <div className="border-b border-border p-6 dark:border-border-dark">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="rounded border border-brand-200 bg-brand-50 px-2 py-0.5 font-mono text-xs font-bold text-brand-700 dark:border-brand-800 dark:bg-brand-950/30 dark:text-brand-400">{asset.ticker}</span>
                <span className="text-[10px] uppercase text-muted-foreground">{asset.type}</span>
              </div>
              <h2 className="mt-2 text-lg font-bold leading-tight">{asset.name}</h2>
            </div>
            <button onClick={onClose} className="rounded-lg p-1.5 text-muted-foreground hover:bg-slate-100 dark:hover:bg-slate-800">✕</button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 space-y-6 overflow-y-auto p-6">
          {/* Metadata */}
          <div className="grid grid-cols-2 gap-3 rounded-xl border border-border p-4 dark:border-border-dark">
            <div>
              <span className="text-[9px] uppercase text-muted-foreground">Exchange</span>
              <p className="text-sm font-medium">{isLse ? "London Stock Exchange" : asset.exchange}</p>
            </div>
            <div>
              <span className="text-[9px] uppercase text-muted-foreground">Region</span>
              <p className="text-sm font-medium">{asset.region}</p>
            </div>
            <div className="col-span-2 border-t border-border pt-3 dark:border-border-dark">
              <span className="text-[9px] uppercase text-muted-foreground">AJ Bell Status</span>
              {asset.ajBell ? (
                <p className="mt-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">✓ Available to Trade (ISA/SIPP)</p>
              ) : (
                <p className="mt-1 text-xs font-medium text-amber-600 dark:text-amber-400">⚠ Restricted Platform Access</p>
              )}
            </div>
          </div>

          {/* Price & Performance */}
          <div className="flex items-baseline justify-between">
            <div>
              <span className="text-[9px] uppercase text-muted-foreground">Current Price</span>
              <p className="text-2xl font-extrabold">{currencySymbol}{endPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
            </div>
            <div className="text-right">
              <span className="text-[9px] uppercase text-muted-foreground">Performance ({horizon})</span>
              <p className={`text-lg font-bold ${isPositive ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}`}>
                {isPositive ? "▲" : "▼"} {totalReturn.toFixed(2)}%
              </p>
            </div>
          </div>

          {/* Horizon Tabs */}
          <div className="flex gap-1 rounded-lg bg-slate-100 p-1 dark:bg-slate-800">
            {(["1M", "6M", "1Y", "5Y", "10Y"] as Horizon[]).map((tab) => (
              <button key={tab} onClick={() => setHorizon(tab)}
                className={`flex-1 rounded-md py-1.5 text-xs font-semibold transition ${horizon === tab ? "bg-white text-brand-600 shadow dark:bg-slate-700 dark:text-brand-400" : "text-muted-foreground hover:text-foreground"}`}>
                {tab}
              </button>
            ))}
          </div>

          {/* Chart */}
          <div className="relative h-48 rounded-xl border border-border p-2 dark:border-border-dark">
            <span className="absolute right-3 top-3 z-10 text-[10px] text-muted-foreground opacity-60">
              Simulated Price History — Click &apos;Ask analyst to review&apos; for live data
            </span>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={isPositive ? "#10b981" : "#f43f5e"} stopOpacity={0.2} />
                    <stop offset="95%" stopColor={isPositive ? "#10b981" : "#f43f5e"} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" stroke="#525252" fontSize={9} tickLine={false} axisLine={false} minTickGap={20} />
                <YAxis stroke="#525252" fontSize={9} tickLine={false} axisLine={false} domain={["auto", "auto"]}
                  tickFormatter={(v) => `${currencySymbol}${Math.round(v)}`} />
                <Tooltip content={({ active, payload }) => {
                  if (active && payload?.length) {
                    const d = payload[0].payload as ChartPoint;
                    return (
                      <div className="rounded-lg border border-border bg-panel p-3 shadow-elevated text-xs dark:border-border-dark dark:bg-panel-dark">
                        <p className="font-medium text-muted-foreground">{d.date}</p>
                        <p className="font-bold">{currencySymbol}{d.price.toFixed(2)}</p>
                        <p className={d.pctChange >= 0 ? "text-emerald-600" : "text-red-600"}>{d.pctChange >= 0 ? "+" : ""}{d.pctChange}%</p>
                      </div>
                    );
                  }
                  return null;
                }} />
                <Area type="monotone" dataKey="price" stroke={isPositive ? "#10b981" : "#f43f5e"} strokeWidth={2} fillOpacity={1} fill="url(#colorPrice)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Shariah Status */}
          <div className={`rounded-xl border p-4 ${
            asset.screening === "approved" ? "border-emerald-200 bg-emerald-50/50 dark:border-emerald-900 dark:bg-emerald-950/20" :
            "border-amber-200 bg-amber-50/50 dark:border-amber-900 dark:bg-amber-950/20"
          }`}>
            <div className="mb-2 flex items-center justify-between">
              <span className="text-[9px] uppercase text-muted-foreground">Shariah Screen</span>
              <span className={`rounded-full px-2 py-0.5 text-[9px] font-bold uppercase ${
                asset.screening === "approved" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400" : "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400"
              }`}>{asset.screening}</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {asset.screening === "approved"
                ? "Passed comprehensive ethical screening. Cash and interest leverage thresholds within strict 33% Islamic compliance limits. No revenue from non-ethical sectors."
                : "Under review — pending compliance verification for interest-based revenue thresholds."}
            </p>
          </div>
        </div>

        {/* Footer Action */}
        <div className="border-t border-border p-6 dark:border-border-dark">
          {isOnConvictionList ? (
            <Link href="/research" className="block w-full rounded-xl border border-border bg-panel py-3.5 text-center text-sm font-bold text-brand-600 transition hover:bg-slate-50 dark:border-border-dark dark:bg-panel-dark dark:hover:bg-slate-800">
              On Conviction List → View Performance
            </Link>
          ) : (
            <button onClick={() => onPromote(asset.ticker, asset.name)}
              className="w-full rounded-xl bg-emerald-600 py-3.5 text-sm font-bold text-white transition hover:bg-emerald-700">
              + Promote to Conviction List
            </button>
          )}
        </div>
      </div>
    </>
  );
}
