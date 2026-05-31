"use client";

export default function ResearchNotesPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Research Notes</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Why do we hold this view? Investment rationale, market observations, and thesis updates.
        </p>
      </div>

      {/* Notes */}
      <div className="space-y-4">
        <Note
          date="2025-05-25"
          title="Market Regime Shift: Strong Bull → Weak Bull"
          theme="Market Regime"
          assets={[]}
          regime="Weak Bull"
          summary="Market breadth narrowed from 72% to 55% over 4 weeks. VIX rose from 12 to 18.5. Leadership concentrated in mega-cap tech. Confirmed regime transition after 2 consecutive weeks of deteriorating signals."
          risks="Further breadth deterioration could signal Sideways regime. Watch for VIX >22 and breadth <50%."
          view="Adjusting posture to quality + defensive. Increasing cash target from 10% to 20%. Reducing max position size from 15% to 12%. Favouring low-volatility themes (Healthcare, Islamic Banking, Infrastructure)."
        />
        <Note
          date="2025-05-20"
          title="NVIDIA Rejected — Israel Exposure Confirmed"
          theme="Screening"
          assets={["NVDA"]}
          regime="Weak Bull"
          summary="NVIDIA acquired Mellanox Technologies (Israel-based) in 2020 for $6.9B. Mellanox operations continue as NVIDIA Israel with 3,000+ employees across R&D centres in Yokneam, Tel Aviv, and Ra'anana. This constitutes significant and material Israel operations."
          risks="N/A — permanent rejection. No override possible for Israel exposure."
          view="Hard exclusion triggered. NVIDIA will not enter the recommendation universe regardless of financial attractiveness. Alternative semiconductor exposure maintained through TSM, ASML, AMD, AVGO."
        />
        <Note
          date="2025-04-15"
          title="Cybersecurity: Platform Consolidation Thesis"
          theme="Cybersecurity"
          assets={["PANW", "CRWD"]}
          regime="Strong Bull"
          summary="Enterprise cybersecurity spend is non-discretionary and growing 15%+ annually. Platform consolidation trend favours leaders who can replace multiple point solutions. CrowdStrike (endpoint) and Palo Alto (network) are the two dominant platforms."
          risks="Microsoft Defender bundling could pressure pricing. Major breach of either platform would be reputationally devastating. Vendor fatigue may slow enterprise adoption cycles."
          view="BUY signal issued for PANW. Existing BUY maintained for CRWD. Combined cybersecurity theme: STRONG."
        />
        <Note
          date="2025-04-01"
          title="Semiconductor AI Demand: Structural, Not Cyclical"
          theme="Semiconductors"
          assets={["AMD", "AVGO", "TSM", "ASML"]}
          regime="Strong Bull"
          summary="Hyperscaler capex guidance confirms multi-year AI infrastructure buildout. Microsoft, Google, Meta, and Amazon all increasing data centre spend 40%+ YoY. This is not a one-quarter spike — it's a structural shift in compute demand."
          risks="Overinvestment cycle possible if AI revenue doesn't materialise for enterprises. Inventory correction risk if hyperscalers pause simultaneously. Taiwan geopolitical risk remains for TSM."
          view="BUY signals issued for AMD and AVGO. Existing BUY maintained for TSM and ASML. Semiconductor theme status: STRONG."
        />
        <Note
          date="2025-02-20"
          title="GLP-1 Revolution: Healthcare Thesis"
          theme="Healthcare"
          assets={["LLY", "NOVO-B"]}
          regime="Sideways"
          summary="GLP-1 drugs (Mounjaro/Zepbound from Lilly, Ozempic/Wegovy from Novo) represent a $100B+ addressable market with <5% penetration. This is a generational healthcare opportunity comparable to statins in the 1990s."
          risks="Safety signals could emerge with long-term use. Government price controls in US election year. Manufacturing capacity constraints limiting near-term revenue. Premium valuations leave little margin for error."
          view="BUY signal for LLY (category leader, best efficacy data). HOLD for NOVO-B (in correction, fundamentals intact but momentum negative)."
        />
        <Note
          date="2025-02-01"
          title="Energy Security: Saudi Aramco Thesis"
          theme="Oil & Gas"
          assets={["2222.SR"]}
          regime="Sideways"
          summary="Saudi Aramco produces oil at <$5/barrel — lowest cost globally. OPEC+ supply discipline supports prices above $70. Dividend yield >4% provides income regardless of price appreciation. Sharia-compliant corporate structure confirmed."
          risks="Oil price sustained below $50 would pressure dividend. Saudi Arabia breaking OPEC+ discipline (price war scenario). Accelerated EV adoption causing demand peak before 2035."
          view="HOLD signal. Positioned as dividend anchor and energy security exposure. Low volatility, low correlation with tech holdings. Provides geographic diversification (GCC)."
        />
        <Note
          date="2025-01-10"
          title="Halal Finance: Core Allocation Anchor"
          theme="Halal Finance"
          assets={["HLAL", "SPUS"]}
          regime="Sideways"
          summary="Sharia-compliant ETFs provide broad US equity exposure with pre-screened compliance. HLAL tracks FTSE USA Shariah Index. SPUS tracks S&P 500 Shariah. Both exclude non-compliant sectors automatically."
          risks="Tracking error vs conventional benchmarks. Higher expense ratios. Limited product diversity in Islamic finance ETF space."
          view="HOLD signal. Core structural allocation — not a tactical position. Provides diversification anchor regardless of market regime. Low maintenance, high conviction."
        />
      </div>

      {/* Footer */}
      <div className="border-t border-border pt-4 text-center text-xs text-muted-foreground dark:border-border-dark">
        Research notes reflect Nür Capital analysis at time of writing. Not financial advice. Past performance does not guarantee future results.
      </div>
    </div>
  );
}

function Note({ date, title, theme, assets, regime, summary, risks, view }: {
  date: string; title: string; theme: string; assets: string[]; regime: string; summary: string; risks: string; view: string;
}) {
  return (
    <div className="card">
      <div>
        <h3 className="text-sm font-semibold">{title}</h3>
        <div className="mt-1 flex flex-wrap items-center gap-2">
          <span className="text-[10px] text-muted-foreground">{date}</span>
          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] text-slate-600 dark:bg-slate-800 dark:text-slate-400">{theme}</span>
          <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">{regime}</span>
          {assets.map((a) => (
            <span key={a} className="font-mono text-[10px] font-bold">{a}</span>
          ))}
        </div>
      </div>
      <div className="mt-4 space-y-3">
        <div>
          <p className="text-[10px] font-medium uppercase text-muted-foreground">Summary</p>
          <p className="mt-1 text-sm">{summary}</p>
        </div>
        <div>
          <p className="text-[10px] font-medium uppercase text-muted-foreground">Risks</p>
          <p className="mt-1 text-xs text-muted-foreground">{risks}</p>
        </div>
        <div>
          <p className="text-[10px] font-medium uppercase text-muted-foreground">Nür Capital View</p>
          <p className="mt-1 text-xs text-brand-700 dark:text-brand-400">{view}</p>
        </div>
      </div>
    </div>
  );
}
