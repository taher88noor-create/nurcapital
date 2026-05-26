"use client";

export default function ScreeningPrinciplesPage() {
  return (
    <div className="space-y-10">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Screening Principles</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          No gambling. No alcohol. No weapons. No interest-based finance.
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          Nür Capital excludes companies that conflict with our ethical investment principles.
        </p>
      </div>

      {/* Exclusion Categories */}
      <div className="card">
        <h2 className="mb-6 text-sm font-semibold uppercase tracking-wide text-muted-foreground">Hard Exclusion Categories</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <ExclusionCard icon="🎰" title="Gambling" description="Companies deriving material revenue (>5%) from betting, casinos, lotteries, or online gambling platforms." examples="DraftKings, Flutter, Wynn Resorts, MGM" />
          <ExclusionCard icon="🍺" title="Alcohol" description="Producers or primary distributors of alcoholic beverages where alcohol constitutes material revenue." examples="Diageo, AB InBev, Pernod Ricard" />
          <ExclusionCard icon="⚔️" title="Weapons" description="Manufacturers, sellers, or distributors of weapons, military systems, or defence equipment." examples="Lockheed Martin, RTX (Raytheon), BAE Systems" />
          <ExclusionCard icon="🏦" title="Interest-Based Finance" description="Conventional banks and lenders where interest income exceeds 5% of total revenue (AAOIFI threshold)." examples="JPMorgan, Goldman Sachs, HSBC" />
          <ExclusionCard icon="🔞" title="Adult Industries" description="Companies involved in the production or distribution of adult content or services." examples="Any adult content platform" />
          <ExclusionCard icon="🌍" title="Geopolitical Exposure" description="Companies headquartered in or with significant operations in excluded geographies, including Israel." examples="Intel, NVIDIA (Mellanox), Check Point, SolarEdge" />
          <ExclusionCard icon="⚠️" title="Prohibited Structure" description="Corporate structures incompatible with Sharia principles, including excessive leverage or speculative instruments." examples="Highly leveraged SPACs, derivative-heavy funds" />
        </div>
      </div>

      {/* Eligibility Statuses */}
      <div className="card">
        <h2 className="mb-6 text-sm font-semibold uppercase tracking-wide text-muted-foreground">Eligibility Statuses</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-5 dark:border-emerald-900 dark:bg-emerald-950/30">
            <p className="text-lg font-bold text-emerald-700 dark:text-emerald-400">APPROVED</p>
            <p className="mt-2 text-sm text-emerald-800 dark:text-emerald-300">
              All exclusion flags clear. Financial ratios pass AAOIFI thresholds. Eligible for recommendation, scoring, and allocation.
            </p>
            <p className="mt-3 text-xs text-emerald-600 dark:text-emerald-500">Reviewed quarterly. Full audit trail maintained.</p>
          </div>
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-5 dark:border-amber-900 dark:bg-amber-950/30">
            <p className="text-lg font-bold text-amber-700 dark:text-amber-400">WATCHLIST</p>
            <p className="mt-2 text-sm text-amber-800 dark:text-amber-300">
              Under investigation. Insufficient data or borderline ratios. Cannot receive capital allocation. Must resolve within 90 days.
            </p>
            <p className="mt-3 text-xs text-amber-600 dark:text-amber-500">Reviewed monthly. Target resolution date set.</p>
          </div>
          <div className="rounded-lg border border-red-200 bg-red-50 p-5 dark:border-red-900 dark:bg-red-950/30">
            <p className="text-lg font-bold text-red-700 dark:text-red-400">REJECTED</p>
            <p className="mt-2 text-sm text-red-800 dark:text-red-300">
              Failed one or more hard exclusion rules. Permanently excluded from scoring and allocation. Retained for audit purposes only.
            </p>
            <p className="mt-3 text-xs text-red-600 dark:text-red-500">Never enters ranking or recommendation systems.</p>
          </div>
        </div>
      </div>

      {/* Financial Ratio Thresholds */}
      <div className="card">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted-foreground">AAOIFI Financial Thresholds</h2>
        <p className="mb-4 text-sm text-muted-foreground">In addition to hard exclusions, approved assets must pass these financial ratio checks:</p>
        <div className="space-y-3">
          <RatioRow label="Total Debt / Total Assets" threshold="< 33%" description="Ensures company is not excessively leveraged" />
          <RatioRow label="Interest Income / Total Revenue" threshold="< 5%" description="Limits exposure to interest-based earnings" />
          <RatioRow label="Illiquid Assets / Total Assets" threshold="> 25%" description="Ensures tangible asset backing" />
          <RatioRow label="Cash + Receivables / Total Assets" threshold="< 70%" description="Prevents purely financial holdings" />
        </div>
      </div>

      {/* Methodology */}
      <div className="card">
        <h2 className="mb-6 text-sm font-semibold uppercase tracking-wide text-muted-foreground">Screening Methodology</h2>
        <div className="grid gap-6 sm:grid-cols-2">
          <MethodCard title="Manual Review Process" description="Every asset is individually reviewed by an analyst. No automated pass/fail without human verification. Evidence sources are documented for each determination." />
          <MethodCard title="Ongoing Monitoring" description="Approved assets are re-screened quarterly. Corporate events (M&A, expansion, restructuring) trigger immediate re-review regardless of schedule." />
          <MethodCard title="Explainable Screening" description="Every eligibility decision includes documented rationale, evidence sources, confidence level, and review date. Any stakeholder can audit any decision." />
          <MethodCard title="Transparent Classification" description="Rejection reasons are specific and traceable to a rule. No opaque scoring. Binary pass/fail on each exclusion category." />
        </div>
      </div>

      {/* Principles */}
      <div className="card">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted-foreground">Core Principles</h2>
        <div className="space-y-3">
          <Principle text="Principles before returns — no asset enters recommendation regardless of financial attractiveness unless it passes screening." />
          <Principle text="Explainability over complexity — every decision must be explainable in plain language." />
          <Principle text="Transparency builds trust — all exclusion criteria are documented and auditable." />
          <Principle text="No overrides for hard exclusions — Israel exposure, weapons, and gambling exclusions cannot be overridden." />
          <Principle text="Rejected assets are retained — for audit trail and to prevent repeated evaluation." />
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-border pt-4 text-center text-xs text-muted-foreground dark:border-border-dark">
        Nür Capital — Ethical investment intelligence. Principled screening. Transparent methodology.
      </div>
    </div>
  );
}

function ExclusionCard({ icon, title, description, examples }: { icon: string; title: string; description: string; examples: string }) {
  return (
    <div className="rounded-lg border border-border p-4 dark:border-border-dark">
      <div className="flex items-center gap-2">
        <span className="text-xl">{icon}</span>
        <h3 className="text-sm font-semibold">{title}</h3>
      </div>
      <p className="mt-2 text-xs text-muted-foreground">{description}</p>
      <p className="mt-2 text-[10px] text-red-600 dark:text-red-400">Excluded: {examples}</p>
    </div>
  );
}

function RatioRow({ label, threshold, description }: { label: string; threshold: string; description: string }) {
  return (
    <div className="flex items-center gap-4 rounded-lg border border-border/50 p-3 dark:border-border-dark/50">
      <span className="w-48 text-sm font-medium">{label}</span>
      <span className="w-16 text-center font-mono text-sm font-bold text-brand-600">{threshold}</span>
      <span className="flex-1 text-xs text-muted-foreground">{description}</span>
    </div>
  );
}

function MethodCard({ title, description }: { title: string; description: string }) {
  return (
    <div>
      <h3 className="text-sm font-semibold">{title}</h3>
      <p className="mt-1 text-xs text-muted-foreground">{description}</p>
    </div>
  );
}

function Principle({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-2">
      <span className="mt-0.5 text-brand-600">●</span>
      <p className="text-sm">{text}</p>
    </div>
  );
}
