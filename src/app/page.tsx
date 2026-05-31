"use client";

export default function DashboardPage() {
  return (
    <div className="space-y-10">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Intelligence Dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          What does Nür Capital recommend today?
        </p>
      </div>

      {/* Section 1 — Latest BUY Recommendations */}
      <section className="card">
        <h2 className="mb-5 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Latest BUY Recommendations
        </h2>
        <div className="space-y-3">
          <Recommendation ticker="TSM" company="Taiwan Semiconductor" theme="Semiconductors" date="15 Mar 2025" price={165.20} />
          <Recommendation ticker="ASML" company="ASML Holding" theme="Semiconductors" date="15 Mar 2025" price={878.50} />
          <Recommendation ticker="LLY" company="Eli Lilly" theme="Healthcare" date="20 Feb 2025" price={730.00} />
          <Recommendation ticker="CRWD" company="CrowdStrike" theme="Cybersecurity" date="01 Mar 2025" price={322.80} />
          <Recommendation ticker="AMD" company="Advanced Micro Devices" theme="Semiconductors" date="01 Apr 2025" price={155.40} />
          <Recommendation ticker="AVGO" company="Broadcom" theme="Semiconductors" date="01 Apr 2025" price={168.20} />
          <Recommendation ticker="PANW" company="Palo Alto Networks" theme="Cybersecurity" date="15 Apr 2025" price={180.40} />
        </div>
      </section>

      {/* Section 2 — Recommendation Performance Summary */}
      <section className="card">
        <h2 className="mb-5 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Recommendation Performance Summary
        </h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <Stat label="Total BUY Signals" value="7" />
          <Stat label="Avg Return Since Signal" value="+6.3%" variant="green" />
          <Stat label="Best Performing Signal" value="LLY +12.4%" variant="green" />
          <Stat label="Best Performing Theme" value="Cybersecurity +6.5%" variant="green" />
        </div>
        <p className="mt-4 text-[11px] text-muted-foreground">
          Returns calculated from signal date to latest available price. View full breakdown on Recommendation Performance page.
        </p>
      </section>

      {/* Section 3 — Theme Summary */}
      <section className="card">
        <h2 className="mb-5 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Theme Summary
        </h2>
        <div className="space-y-3">
          <ThemeRow theme="Semiconductors" recommendations={4} avgReturn={5.97} status="STRONG" />
          <ThemeRow theme="Cybersecurity" recommendations={2} avgReturn={6.46} status="STRONG" />
          <ThemeRow theme="Healthcare" recommendations={2} avgReturn={3.09} status="NEUTRAL" />
          <ThemeRow theme="Halal Finance" recommendations={1} avgReturn={3.44} status="NEUTRAL" />
          <ThemeRow theme="Oil & Gas" recommendations={1} avgReturn={2.87} status="NEUTRAL" />
          <ThemeRow theme="Industrial Automation" recommendations={1} avgReturn={4.35} status="NEUTRAL" />
        </div>
      </section>

      {/* Section 4 — Screening Summary */}
      <section className="card">
        <h2 className="mb-5 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Screening Principles
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <PrincipleCard icon="🎰" label="No Gambling" />
          <PrincipleCard icon="🍺" label="No Alcohol" />
          <PrincipleCard icon="⚔️" label="No Weapons" />
          <PrincipleCard icon="🏦" label="No Interest-Based Finance" />
        </div>
        <p className="mt-4 text-xs text-muted-foreground">
          Only assets that pass all ethical screening criteria receive BUY or HOLD recommendations.
          Rejected assets never enter the recommendation system.
        </p>
      </section>

      {/* Section 5 — Latest Research Notes */}
      <section className="card">
        <h2 className="mb-5 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Latest Research Notes
        </h2>
        <div className="space-y-3">
          <NotePreview date="25 May 2025" title="Market Regime Shift: Strong Bull → Weak Bull" theme="Market Regime" />
          <NotePreview date="20 May 2025" title="NVIDIA Rejected — Israel Exposure Confirmed" theme="Screening" />
          <NotePreview date="15 Apr 2025" title="Cybersecurity: Platform Consolidation Thesis" theme="Cybersecurity" />
          <NotePreview date="01 Apr 2025" title="Semiconductor AI Demand: Structural, Not Cyclical" theme="Semiconductors" />
        </div>
      </section>

      {/* Disclaimer */}
      <div className="border-t border-border pt-4 text-center text-xs text-muted-foreground dark:border-border-dark">
        Past performance does not guarantee future results. Nür Capital provides research intelligence, not financial advice.
      </div>
    </div>
  );
}

// ── Sub-components ───────────────────────────────────────────────────────────

function Recommendation({ ticker, company, theme, date, price }: { ticker: string; company: string; theme: string; date: string; price: number }) {
  return (
    <div className="flex items-center gap-4 rounded-lg border border-border p-3 dark:border-border-dark">
      <span className="badge badge-green">BUY</span>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="font-mono text-sm font-bold">{ticker}</span>
          <span className="text-sm">{company}</span>
        </div>
        <span className="text-[10px] text-muted-foreground">{theme}</span>
      </div>
      <div className="text-right">
        <p className="text-sm font-mono font-medium">${price.toFixed(2)}</p>
        <p className="text-[10px] text-muted-foreground">{date}</p>
      </div>
    </div>
  );
}

function Stat({ label, value, variant }: { label: string; value: string; variant?: "green" | "red" }) {
  const color = variant === "green" ? "text-emerald-600 dark:text-emerald-400" : variant === "red" ? "text-red-600 dark:text-red-400" : "text-foreground";
  return (
    <div>
      <p className="text-[11px] font-medium uppercase text-muted-foreground">{label}</p>
      <p className={`mt-1 text-xl font-bold ${color}`}>{value}</p>
    </div>
  );
}

function ThemeRow({ theme, recommendations, avgReturn, status }: { theme: string; recommendations: number; avgReturn: number; status: string }) {
  const statusColors: Record<string, string> = { STRONG: "badge-green", NEUTRAL: "badge-blue", WEAK: "badge-amber" };
  return (
    <div className="flex items-center gap-4 rounded-lg border border-border/50 p-3 dark:border-border-dark/50">
      <span className="w-40 text-sm font-medium">{theme}</span>
      <span className="text-xs text-muted-foreground">{recommendations} signals</span>
      <span className={`text-sm font-bold ${avgReturn >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}`}>
        {avgReturn >= 0 ? "+" : ""}{avgReturn.toFixed(1)}%
      </span>
      <span className={`badge ml-auto ${statusColors[status] || "badge-gray"}`}>{status}</span>
    </div>
  );
}

function PrincipleCard({ icon, label }: { icon: string; label: string }) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-border p-3 dark:border-border-dark">
      <span className="text-xl">{icon}</span>
      <span className="text-sm font-medium">{label}</span>
    </div>
  );
}

function NotePreview({ date, title, theme }: { date: string; title: string; theme: string }) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-border/50 p-3 dark:border-border-dark/50">
      <span className="text-[10px] text-muted-foreground">{date}</span>
      <span className="flex-1 text-sm">{title}</span>
      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] text-slate-600 dark:bg-slate-800 dark:text-slate-400">{theme}</span>
    </div>
  );
}
