"use client";

export default function ResearchNotesPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Research Notes</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Why do we hold this view? Transparent reasoning behind every recommendation.
        </p>
        <p className="mt-2 text-xs text-muted-foreground">
          Research Notes explain <strong>WHY</strong>. Recommendation Performance shows <strong>WHAT HAPPENED</strong>.
        </p>
      </div>

      {/* Notes */}
      <div className="space-y-6">
        <Note
          title="Semiconductor Demand Outlook: AI Supercycle Confirmed"
          date="01 Apr 2025"
          theme="Semiconductors"
          assets={["TSM", "ASML", "AMD", "AVGO"]}
          regime="Strong Bull"
          summary="Hyperscaler capex guidance confirms multi-year AI infrastructure buildout. Microsoft, Google, Meta, and Amazon all increasing data centre spend 40%+ YoY. This is structural, not cyclical."
          bullCase="AI training requires exponentially more compute. Leading-edge chip demand (3nm, 2nm) outstrips supply. CHIPS Act creates reshoring tailwind. Pricing power intact for foundries and equipment makers."
          risks="Overinvestment cycle if enterprise AI revenue disappoints. Inventory correction risk if hyperscalers pause simultaneously. Taiwan geopolitical risk for TSM. Export controls could limit China revenue."
          conclusion="BUY signals maintained for TSM, ASML, AMD, AVGO. Theme status: STRONG. Semiconductor demand is structural — driven by AI compute requirements that grow with model scale."
        />
        <Note
          title="Project Nimbus Analysis: Israel Exposure Screening"
          date="20 May 2025"
          theme="Screening"
          assets={["NVDA", "MSFT", "INTC"]}
          regime="Weak Bull"
          summary="Multiple major tech companies have significant Israel operations. NVIDIA (Mellanox), Microsoft (Azure Israel, R&D), and Intel (largest private employer in Israel) all fail the Israel exposure hard exclusion."
          bullCase="N/A — this is a screening analysis, not a buy thesis."
          risks="Excluding these companies removes access to some of the world's largest and most profitable technology businesses. Alternative exposure must be found through compliant competitors."
          conclusion="NVIDIA, Microsoft, and Intel permanently REJECTED. Alternative semiconductor exposure maintained through TSM, ASML, AMD, AVGO (all pass screening). Cybersecurity exposure through CRWD and PANW (US-headquartered, no Israel operations)."
        />
        <Note
          title="Cybersecurity: Platform Consolidation Thesis"
          date="15 Apr 2025"
          theme="Cybersecurity"
          assets={["CRWD", "PANW"]}
          regime="Strong Bull"
          summary="Enterprise cybersecurity spend is non-discretionary and growing 15%+ annually. The market is consolidating around platform leaders who can replace multiple point solutions with unified security."
          bullCase="Ransomware epidemic drives urgency. Regulatory compliance (GDPR, NIS2, SEC rules) mandates spend. AI-powered threats increase attack surface. Platform consolidation creates winner-take-most dynamics."
          risks="Microsoft Defender bundling could pressure pricing for endpoint security. Major breach of CrowdStrike or Palo Alto platform would be reputationally devastating. July 2024 CrowdStrike outage — monitoring for sustained customer losses."
          conclusion="BUY signal issued for PANW. Existing BUY maintained for CRWD. Both pass eligibility screening (US-headquartered, no Israel operations, no prohibited revenue). Theme status: STRONG."
        />
        <Note
          title="Healthcare Innovation: GLP-1 Revolution"
          date="20 Feb 2025"
          theme="Healthcare"
          assets={["LLY", "NOVO-B"]}
          regime="Sideways"
          summary="GLP-1 receptor agonists (Mounjaro/Zepbound from Lilly, Ozempic/Wegovy from Novo) represent a generational healthcare opportunity. $100B+ addressable market with <5% penetration."
          bullCase="Obesity affects 40%+ of US adults. GLP-1 efficacy proven (15-25% weight loss). Pipeline expanding: oral formulations, combination therapies. Manufacturing scale-up underway. Insurance coverage expanding."
          risks="Long-term safety signals could emerge. Government price controls in election year. Manufacturing constraints limit near-term revenue. Premium valuations leave little margin for error. Competition from Amgen, Pfizer entering market."
          conclusion="BUY signal for LLY (category leader, best efficacy, strongest pipeline). HOLD for NOVO-B (pioneer, in correction, fundamentals intact but momentum negative). Both pass eligibility screening."
        />
        <Note
          title="Energy Security: Aramco & GCC Thesis"
          date="01 Feb 2025"
          theme="Oil & Gas"
          assets={["2222.SR"]}
          regime="Sideways"
          summary="Saudi Aramco produces oil at <$5/barrel — lowest cost globally. OPEC+ supply discipline supports prices above $70. Sharia-compliant structure confirmed. Dividend yield >4%."
          bullCase="Supply underinvestment since 2015 creates structural tightness. Peak oil demand is decades away. Energy security narrative strengthened post-Ukraine. Cash flow generation funds reliable dividends."
          risks="Oil price sustained below $50 would pressure dividend. Saudi Arabia breaking OPEC+ discipline (price war). Accelerated EV adoption causing demand peak before 2035. Geopolitical risk in Middle East."
          conclusion="HOLD signal. Positioned as dividend anchor and energy security exposure. Low volatility, low correlation with tech holdings. Provides geographic diversification (GCC). Not a growth thesis — a stability thesis."
        />
        <Note
          title="Halal Finance: Structural Allocation Anchor"
          date="10 Jan 2025"
          theme="Halal Finance"
          assets={["HLAL", "SPUS"]}
          regime="Sideways"
          summary="Sharia-compliant ETFs provide broad US equity exposure with pre-screened compliance. HLAL tracks FTSE USA Shariah Index. SPUS tracks S&P 500 Shariah. Both exclude non-compliant sectors automatically."
          bullCase="Growing Muslim middle class (1.8B+ population). Institutional demand for compliant products. Low-cost diversification with ethical compliance built in. Regulatory support in GCC, Malaysia, Indonesia."
          risks="Tracking error vs conventional benchmarks due to sector exclusions. Higher expense ratios than conventional ETFs. Limited product diversity in Islamic finance ETF space."
          conclusion="HOLD signal. Core structural allocation — not a tactical position. Provides diversification anchor regardless of market regime. Low maintenance, high conviction. This is a permanent allocation, not a trade."
        />
        <Note
          title="Market Regime Shift: Strong Bull → Weak Bull"
          date="25 May 2025"
          theme="Market Regime"
          assets={[]}
          regime="Weak Bull"
          summary="Market breadth narrowed from 72% to 55% over 4 weeks. VIX rose from 12 to 18.5. Leadership concentrated in mega-cap tech. Confirmed regime transition after 2 consecutive weeks of deteriorating signals."
          bullCase="Underlying earnings growth remains positive. AI capex cycle intact. No recession indicators. Breadth could recover if rate cut expectations materialise."
          risks="Further breadth deterioration could signal Sideways regime. VIX >22 and breadth <50% would trigger next downgrade. Narrow leadership historically precedes corrections."
          conclusion="Regime confirmed: Weak Bull. Adjusting posture to quality + defensive. Cash target increased from 10% to 20%. Max position size reduced from 15% to 12%. Favouring low-volatility themes."
        />
      </div>

      {/* Footer */}
      <div className="border-t border-border pt-4 text-center text-xs text-muted-foreground dark:border-border-dark">
        Research notes reflect Nür Capital analysis at time of writing. Not financial advice. Past performance does not guarantee future results.
      </div>
    </div>
  );
}

function Note({ title, date, theme, assets, regime, summary, bullCase, risks, conclusion }: {
  title: string; date: string; theme: string; assets: string[]; regime: string;
  summary: string; bullCase: string; risks: string; conclusion: string;
}) {
  return (
    <div className="card">
      {/* Header */}
      <h3 className="text-sm font-semibold">{title}</h3>
      <div className="mt-2 flex flex-wrap items-center gap-2">
        <span className="text-[10px] text-muted-foreground">{date}</span>
        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] text-slate-600 dark:bg-slate-800 dark:text-slate-400">{theme}</span>
        <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">{regime}</span>
        {assets.map((a) => (
          <span key={a} className="rounded-full bg-emerald-50 px-2 py-0.5 font-mono text-[10px] font-bold text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400">{a}</span>
        ))}
      </div>

      {/* Body */}
      <div className="mt-5 space-y-4">
        <Section label="Summary" content={summary} />
        <Section label="Bull Case" content={bullCase} />
        <Section label="Risks" content={risks} variant="muted" />
        <Section label="Nür Capital Conclusion" content={conclusion} variant="brand" />
      </div>
    </div>
  );
}

function Section({ label, content, variant }: { label: string; content: string; variant?: "muted" | "brand" }) {
  const textColor = variant === "brand" ? "text-brand-700 dark:text-brand-400" : variant === "muted" ? "text-muted-foreground" : "";
  return (
    <div>
      <p className="text-[10px] font-medium uppercase text-muted-foreground">{label}</p>
      <p className={`mt-1 text-sm ${textColor}`}>{content}</p>
    </div>
  );
}
