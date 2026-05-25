"use client";

import { MOCK_ASSETS, MOCK_THEMES, MOCK_PORTFOLIO } from "@/data/mock-data";
import type { Asset, Theme, PortfolioSuggestion } from "@/data/mock-data";

export default function DashboardPage() {
  const approved = MOCK_ASSETS.filter((a) => a.eligibilityStatus === "approved")
    .sort((a, b) => (b.attractivenessScore || 0) - (a.attractivenessScore || 0));
  const watchlist = MOCK_ASSETS.filter((a) => a.eligibilityStatus === "watchlist");
  const rejected = MOCK_ASSETS.filter((a) => a.eligibilityStatus === "rejected");

  return (
    <div className="space-y-10">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Ethical investment intelligence — Static demo with seeded data
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <StatCard label="Total Assets" value={String(MOCK_ASSETS.length)} />
        <StatCard label="Approved" value={String(approved.length)} variant="green" />
        <StatCard label="Watchlist" value={String(watchlist.length)} variant="amber" />
        <StatCard label="Rejected" value={String(rejected.length)} variant="red" />
        <StatCard label="Themes" value={String(MOCK_THEMES.length)} variant="blue" />
      </div>

      {/* Approved Assets */}
      <section>
        <SectionHeader title="Approved Assets" subtitle="Ranked by attractiveness score" badge={`${approved.length} assets`} badgeVariant="green" />
        <div className="mt-4 space-y-3">
          {approved.map((asset, i) => (
            <ApprovedAssetRow key={asset.ticker} asset={asset} rank={i + 1} />
          ))}
        </div>
      </section>

      {/* Watchlist */}
      <section>
        <SectionHeader title="Watchlist" subtitle="Under review — pending eligibility decision" badge={`${watchlist.length} assets`} badgeVariant="amber" />
        <div className="mt-4 space-y-3">
          {watchlist.map((asset) => (
            <WatchlistRow key={asset.ticker} asset={asset} />
          ))}
        </div>
      </section>

      {/* Rejected Assets */}
      <section>
        <SectionHeader title="Rejected Assets" subtitle="Failed hard exclusion rules" badge={`${rejected.length} assets`} badgeVariant="red" />
        <div className="mt-4 space-y-3">
          {rejected.map((asset) => (
            <RejectedRow key={asset.ticker} asset={asset} />
          ))}
        </div>
      </section>

      {/* Themes */}
      <section>
        <SectionHeader title="Investment Themes" subtitle="Thematic classification of the asset universe" badge={`${MOCK_THEMES.length} themes`} badgeVariant="blue" />
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {MOCK_THEMES.map((theme) => (
            <ThemeCard key={theme.name} theme={theme} />
          ))}
        </div>
      </section>

      {/* Portfolio Suggestions */}
      <section>
        <SectionHeader title="Portfolio Suggestions" subtitle="Model allocation for balanced Sharia-compliant portfolio" badge="90% allocated" badgeVariant="green" />
        <div className="mt-4 space-y-3">
          {MOCK_PORTFOLIO.map((item) => (
            <PortfolioRow key={item.ticker} item={item} />
          ))}
          <div className="card flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Unallocated (cash reserve)</span>
            <span className="text-lg font-bold">10%</span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border pt-6 text-center text-xs text-muted-foreground dark:border-border-dark">
        Nür Capital v0.1.0 — Static Demo · Not a trading platform · Not financial advice
      </footer>
    </div>
  );
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function StatCard({ label, value, variant }: { label: string; value: string; variant?: "green" | "red" | "amber" | "blue" }) {
  const colorMap = {
    green: "text-emerald-600 dark:text-emerald-400",
    red: "text-red-600 dark:text-red-400",
    amber: "text-amber-600 dark:text-amber-400",
    blue: "text-blue-600 dark:text-blue-400",
  };
  const textColor = variant ? colorMap[variant] : "text-foreground";

  return (
    <div className="card">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className={`mt-2 text-2xl font-bold ${textColor}`}>{value}</p>
    </div>
  );
}

function SectionHeader({ title, subtitle, badge, badgeVariant }: { title: string; subtitle: string; badge: string; badgeVariant: "green" | "red" | "amber" | "blue" }) {
  const badgeClass = {
    green: "badge-green",
    red: "badge-red",
    amber: "badge-amber",
    blue: "badge-blue",
  }[badgeVariant];

  return (
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-lg font-semibold">{title}</h2>
        <p className="text-sm text-muted-foreground">{subtitle}</p>
      </div>
      <span className={`badge ${badgeClass}`}>{badge}</span>
    </div>
  );
}

function ApprovedAssetRow({ asset, rank }: { asset: Asset; rank: number }) {
  const signalColors: Record<string, string> = {
    buy: "badge-green",
    hold: "badge-blue",
    reduce: "badge-amber",
  };

  const riskColors: Record<string, string> = {
    low: "text-emerald-600 dark:text-emerald-400",
    moderate: "text-yellow-600 dark:text-yellow-400",
    elevated: "text-orange-600 dark:text-orange-400",
    high: "text-red-600 dark:text-red-400",
  };

  return (
    <div className="card flex items-center gap-4">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-50 text-sm font-bold text-brand-700 dark:bg-brand-950 dark:text-brand-400">
        {rank}
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="font-mono text-sm font-bold">{asset.ticker}</span>
          <span className="truncate text-sm text-foreground">{asset.companyName}</span>
          <span className="badge badge-gray text-[10px]">{asset.assetType.toUpperCase()}</span>
        </div>
        <div className="mt-1 flex flex-wrap gap-1">
          {asset.themes.map((t) => (
            <span key={t} className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] text-slate-600 dark:bg-slate-800 dark:text-slate-400">
              {t}
            </span>
          ))}
        </div>
      </div>
      <div className="hidden text-right sm:block">
        <p className="text-lg font-bold">{asset.attractivenessScore?.toFixed(1)}</p>
        <p className="text-[11px] text-muted-foreground">score</p>
      </div>
      <div className="hidden text-right md:block">
        <p className="text-sm font-medium">${asset.currentPrice?.toFixed(2)}</p>
        <p className="text-[11px] text-muted-foreground">price</p>
      </div>
      <div className="hidden text-right lg:block">
        <p className={`text-xs font-medium ${riskColors[asset.riskRating || "moderate"]}`}>
          {asset.riskRating}
        </p>
        <p className="text-[11px] text-muted-foreground">risk</p>
      </div>
      {asset.signal && (
        <span className={`badge ${signalColors[asset.signal] || "badge-gray"}`}>
          {asset.signal.toUpperCase()}
        </span>
      )}
    </div>
  );
}

function WatchlistRow({ asset }: { asset: Asset }) {
  return (
    <div className="card border-amber-200 dark:border-amber-900/50">
      <div className="flex items-center gap-3">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-50 text-sm dark:bg-amber-950/50">⏳</span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="font-mono text-sm font-bold">{asset.ticker}</span>
            <span className="truncate text-sm">{asset.companyName}</span>
            <span className="badge badge-amber">Under Review</span>
          </div>
          <div className="mt-1 flex flex-wrap gap-1">
            {asset.themes.map((t) => (
              <span key={t} className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                {t}
              </span>
            ))}
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm font-medium">${asset.currentPrice?.toFixed(2)}</p>
          <p className="text-[11px] text-muted-foreground">price</p>
        </div>
      </div>
      {asset.rejectionReasons && (
        <div className="mt-3 rounded-lg bg-amber-50 p-3 text-xs text-amber-800 dark:bg-amber-950/30 dark:text-amber-300">
          <strong>Review note:</strong> {asset.rejectionReasons[0]}
        </div>
      )}
    </div>
  );
}

function RejectedRow({ asset }: { asset: Asset }) {
  return (
    <div className="card border-red-200 opacity-80 dark:border-red-900/50">
      <div className="flex items-center gap-3">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-50 text-sm dark:bg-red-950/50">✗</span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="font-mono text-sm font-bold text-red-600 dark:text-red-400">{asset.ticker}</span>
            <span className="truncate text-sm text-muted-foreground">{asset.companyName}</span>
            <span className="badge badge-red">Rejected</span>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm font-medium text-muted-foreground">${asset.currentPrice?.toFixed(2)}</p>
        </div>
      </div>
      {asset.rejectionReasons && (
        <div className="mt-3 space-y-1 rounded-lg bg-red-50 p-3 dark:bg-red-950/30">
          {asset.rejectionReasons.map((reason, i) => (
            <p key={i} className="text-xs text-red-700 dark:text-red-300">• {reason}</p>
          ))}
        </div>
      )}
    </div>
  );
}

function ThemeCard({ theme }: { theme: Theme }) {
  return (
    <div className="card flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <span className="text-xl">{theme.icon}</span>
        <span className="text-sm font-semibold">{theme.name}</span>
      </div>
      <p className="text-xs text-muted-foreground">{theme.description}</p>
      <div className="mt-auto flex items-center justify-between pt-2">
        <span className="badge badge-gray">{theme.category}</span>
        <span className="text-xs text-muted-foreground">{theme.assetCount} asset{theme.assetCount !== 1 ? "s" : ""}</span>
      </div>
    </div>
  );
}

function PortfolioRow({ item }: { item: PortfolioSuggestion }) {
  const signalColors: Record<string, string> = {
    buy: "badge-green",
    hold: "badge-blue",
    reduce: "badge-amber",
    watchlist: "badge-gray",
  };

  const profileColors: Record<string, string> = {
    conservative: "text-blue-600 dark:text-blue-400",
    balanced: "text-emerald-600 dark:text-emerald-400",
    growth: "text-purple-600 dark:text-purple-400",
    aggressive: "text-orange-600 dark:text-orange-400",
  };

  return (
    <div className="card flex items-center gap-4">
      {/* Allocation bar */}
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-50 dark:bg-brand-950">
        <span className="text-xs font-bold text-brand-700 dark:text-brand-400">{item.allocation}%</span>
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="font-mono text-sm font-bold">{item.ticker}</span>
          <span className="truncate text-sm">{item.companyName}</span>
        </div>
        <p className="mt-0.5 text-xs text-muted-foreground">{item.reason}</p>
      </div>
      <div className="hidden text-right sm:block">
        <p className={`text-xs font-medium ${profileColors[item.riskProfile]}`}>{item.riskProfile}</p>
        <p className="text-[11px] text-muted-foreground">profile</p>
      </div>
      <span className={`badge ${signalColors[item.signal]}`}>
        {item.signal.toUpperCase()}
      </span>
    </div>
  );
}
