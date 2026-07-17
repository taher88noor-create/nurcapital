"use client";

import { useState, useMemo } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import type { UniverseAsset } from "@/data/asset-universe";

// ── Mock Historical Data Generator ──────────────────────────────────────────

type Horizon = "1M" | "6M" | "1Y" | "5Y" | "10Y";

interface PricePoint {
  date: string;
  price: number;
  change: number;
}

function generateHistoricalData(ticker: string, horizon: Horizon): PricePoint[] {
  const days: Record<Horizon, number> = { "1M": 30, "6M": 180, "1Y": 365, "5Y": 1825, "10Y": 3650 };
  const numPoints = Math.min(days[horizon], 200); // Cap data points for performance
  const isGBX = ticker.endsWith(".L");

  // Seed price based on ticker hash (deterministic)
  let seed = 0;
  for (let i = 0; i < ticker.length; i++) seed += ticker.charCodeAt(i);
  const basePrice = isGBX ? (seed % 5000) + 500 : (seed % 300) + 20;

  // Generate random walk
  const points: PricePoint[] = [];
  let price = basePrice * 0.7; // Start lower for upward trend bias
  const volatility = isGBX ? 0.015 : 0.02;
  const drift = 0.0003; // Slight upward bias

  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days[horizon]);

  const step = days[horizon] / numPoints;

  for (let i = 0; i <= numPoints; i++) {
    const dayOffset = Math.floor(i * step);
    const d = new Date(startDate);
    d.setDate(d.getDate() + dayOffset);

    // Random walk with drift
    const random = (Math.random() - 0.48) * volatility * price;
    price = Math.max(price * 0.5, price + random + price * drift);

    const change = ((price - basePrice * 0.7) / (basePrice * 0.7)) * 100;

    points.push({
      date: d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: horizon === "1M" || horizon === "6M" ? undefined : "2-digit" }),
      price: Math.round(price * 100) / 100,
      change: Math.round(change * 10) / 10,
    });
  }

  return points;
}

// ── Custom Tooltip ──────────────────────────────────────────────────────────

function ChartTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  const data = payload[0].payload as PricePoint;
  return (
    <div className="rounded-lg border border-border bg-panel px-3 py-2 shadow-elevated dark:border-border-dark dark:bg-panel-dark">
      <p className="text-[10px] text-muted-foreground">{data.date}</p>
      <p className="text-sm font-bold">${data.price.toLocaleString()}</p>
      <p className={`text-xs font-medium ${data.change >= 0 ? "text-emerald-600" : "text-red-600"}`}>
        {data.change >= 0 ? "+" : ""}{data.change}%
      </p>
    </div>
  );
}

// ── Drawer Component ────────────────────────────────────────────────────────

interface AssetDrawerProps {
  asset: UniverseAsset | null;
  onClose: () => void;
}

export default function AssetDrawer({ asset, onClose }: AssetDrawerProps) {
  const [horizon, setHorizon] = useState<Horizon>("1Y");

  const chartData = useMemo(() => {
    if (!asset) return [];
    return generateHistoricalData(asset.ticker, horizon);
  }, [asset, horizon]);

  if (!asset) return null;

  const isGBX = asset.ticker.endsWith(".L");
  const currency = isGBX ? "GBX" : "USD";
  const currentPrice = chartData.length > 0 ? chartData[chartData.length - 1].price : 0;
  const startPrice = chartData.length > 0 ? chartData[0].price : 0;
  const totalChange = startPrice > 0 ? ((currentPrice - startPrice) / startPrice) * 100 : 0;
  const horizons: Horizon[] = ["1M", "6M", "1Y", "5Y", "10Y"];

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      {/* Drawer */}
      <div className="fixed right-0 top-0 z-50 flex h-full w-full max-w-[450px] flex-col overflow-y-auto border-l border-border bg-panel shadow-elevated dark:border-border-dark dark:bg-panel-dark">
        {/* Header */}
        <div className="sticky top-0 z-10 border-b border-border bg-panel px-6 py-4 dark:border-border-dark dark:bg-panel-dark">
          <div className="flex items-center justify-between">
            <div>
              <span className="font-mono text-xs font-bold text-brand-600">{asset.ticker}</span>
              <h2 className="text-lg font-bold">{asset.name}</h2>
            </div>
            <button onClick={onClose} className="rounded-lg p-2 text-muted-foreground hover:bg-slate-100 dark:hover:bg-slate-800">✕</button>
          </div>
          <div className="mt-2 flex flex-wrap gap-1">
            {asset.tags.slice(0, 5).map((tag) => (
              <span key={tag} className="rounded-full bg-slate-100 px-2 py-0.5 text-[9px] text-slate-600 dark:bg-slate-800 dark:text-slate-400">{tag}</span>
            ))}
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 space-y-6 px-6 py-6">
          {/* Asset Info */}
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="rounded-lg bg-slate-50 p-3 dark:bg-slate-800/50">
              <p className="text-[9px] uppercase text-muted-foreground">Type</p>
              <p className="text-sm font-medium">{asset.type.toUpperCase()}</p>
            </div>
            <div className="rounded-lg bg-slate-50 p-3 dark:bg-slate-800/50">
              <p className="text-[9px] uppercase text-muted-foreground">Exchange</p>
              <p className="text-sm font-medium">{asset.exchange}</p>
            </div>
            <div className="rounded-lg bg-slate-50 p-3 dark:bg-slate-800/50">
              <p className="text-[9px] uppercase text-muted-foreground">Region</p>
              <p className="text-sm font-medium">{asset.region}</p>
            </div>
          </div>

          {/* Screening Status */}
          <div className={`rounded-lg border p-3 ${
            asset.screening === "approved" ? "border-emerald-200 bg-emerald-50 dark:border-emerald-900 dark:bg-emerald-950/30" :
            asset.screening === "watchlist" ? "border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950/30" :
            "border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950/30"
          }`}>
            <p className="text-xs font-medium">
              {asset.screening === "approved" ? "✓ Shariah Approved — passes all ethical screening criteria" :
               asset.screening === "watchlist" ? "⏳ Under Review — pending compliance verification" :
               "✗ Rejected — fails ethical screening"}
            </p>
          </div>

          {/* Chart Section */}
          <div>
            <div className="mb-3 flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Price ({currency})</p>
                <p className="text-xl font-bold">{isGBX ? "" : "$"}{currentPrice.toLocaleString()}{isGBX ? "p" : ""}</p>
              </div>
              <p className={`text-sm font-bold ${totalChange >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}`}>
                {totalChange >= 0 ? "+" : ""}{totalChange.toFixed(1)}%
              </p>
            </div>

            {/* Horizon Tabs */}
            <div className="mb-4 flex gap-1 rounded-lg bg-slate-100 p-1 dark:bg-slate-800">
              {horizons.map((h) => (
                <button key={h} onClick={() => setHorizon(h)}
                  className={`flex-1 rounded-md px-2 py-1.5 text-xs font-medium transition ${horizon === h ? "bg-white shadow dark:bg-slate-700" : "text-muted-foreground hover:text-foreground"}`}>
                  {h}
                </button>
              ))}
            </div>

            {/* Chart */}
            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
                  <XAxis dataKey="date" tick={{ fontSize: 9 }} tickLine={false} axisLine={false} interval="preserveStartEnd" />
                  <YAxis hide domain={["auto", "auto"]} />
                  <Tooltip content={<ChartTooltip />} />
                  <Line type="monotone" dataKey="price" stroke={totalChange >= 0 ? "#10b981" : "#ef4444"} strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <p className="mt-2 text-[9px] text-muted-foreground text-center">
              Simulated price trajectory. Connect live Yahoo Finance data for real historical charts.
            </p>
          </div>

          {/* AJ Bell Status */}
          <div className="rounded-lg border border-border p-3 dark:border-border-dark">
            <p className="text-xs font-medium">
              {asset.ajBell ? "✓ Available on AJ Bell" : "✗ Not available on AJ Bell (research only)"}
            </p>
            {asset.ajBell && <p className="mt-1 text-[10px] text-muted-foreground">Search for "{asset.name}" on AJ Bell to purchase.</p>}
          </div>
        </div>
      </div>
    </>
  );
}
