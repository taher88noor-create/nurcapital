"use client";

import { useState, useEffect } from "react";

// ── Hardcoded Categories ─────────────────────────────────────────────────────

const REGIONS = ["Global", "MENA", "Asia-Pacific", "Europe", "North America", "Latin America", "Africa"];
const SECTORS = ["Technology", "Healthcare", "Energy", "Industrials", "Consumer", "Financials", "Materials"];

// ── Asset Tag Mapping ────────────────────────────────────────────────────────

interface TaggedAsset {
  ticker: string;
  companyName: string;
  tags: string[];
  rating: "BUY" | "HOLD" | "REDUCE";
  assetType: "stock" | "etf";
}

const TAGGED_ASSETS: TaggedAsset[] = [
  // Developed — Semiconductors
  { ticker: "TSM", companyName: "Taiwan Semiconductor", tags: ["Technology", "Asia-Pacific", "Semiconductors", "AI Infrastructure", "Chip Manufacturing"], rating: "BUY", assetType: "stock" },
  { ticker: "ASML", companyName: "ASML Holding", tags: ["Technology", "Europe", "Semiconductors", "Chip Equipment", "EUV Lithography"], rating: "BUY", assetType: "stock" },
  { ticker: "AMD", companyName: "Advanced Micro Devices", tags: ["Technology", "North America", "Semiconductors", "AI Infrastructure", "Data Centre"], rating: "BUY", assetType: "stock" },
  { ticker: "AVGO", companyName: "Broadcom", tags: ["Technology", "North America", "Semiconductors", "AI Infrastructure", "Networking"], rating: "BUY", assetType: "stock" },
  { ticker: "UMC", companyName: "United Microelectronics", tags: ["Technology", "Asia-Pacific", "Semiconductors", "Chip Manufacturing", "Mature Nodes"], rating: "HOLD", assetType: "stock" },
  // Developed — Healthcare
  { ticker: "LLY", companyName: "Eli Lilly", tags: ["Healthcare", "North America", "GLP-1", "Obesity", "Pharmaceuticals"], rating: "BUY", assetType: "stock" },
  { ticker: "NVO", companyName: "Novo Nordisk (ADR)", tags: ["Healthcare", "Europe", "GLP-1", "Obesity", "Pharmaceuticals"], rating: "HOLD", assetType: "stock" },
  { ticker: "RDY", companyName: "Dr. Reddy's", tags: ["Healthcare", "Asia-Pacific", "Generics", "Pharmaceuticals", "India Digital"], rating: "HOLD", assetType: "stock" },
  // Developed — Cybersecurity
  { ticker: "CRWD", companyName: "CrowdStrike", tags: ["Technology", "North America", "Cybersecurity", "Cloud Security", "AI Infrastructure"], rating: "BUY", assetType: "stock" },
  { ticker: "PANW", companyName: "Palo Alto Networks", tags: ["Technology", "North America", "Cybersecurity", "Network Security", "Platform Consolidation"], rating: "BUY", assetType: "stock" },
  // Developed — Industrial
  { ticker: "ABB", companyName: "ABB Ltd", tags: ["Industrials", "Europe", "Automation", "Robotics", "Electrification"], rating: "HOLD", assetType: "stock" },
  // Developed — Energy
  { ticker: "ENPH", companyName: "Enphase Energy", tags: ["Energy", "North America", "Clean Energy", "Solar", "Microinverters"], rating: "REDUCE", assetType: "stock" },
  // Emerging — India
  { ticker: "INFY", companyName: "Infosys", tags: ["Technology", "Asia-Pacific", "India Digital", "IT Services", "AI Infrastructure"], rating: "BUY", assetType: "stock" },
  { ticker: "MMYT", companyName: "MakeMyTrip", tags: ["Technology", "Asia-Pacific", "India Digital", "Travel", "Consumer"], rating: "BUY", assetType: "stock" },
  { ticker: "TTM", companyName: "Tata Motors", tags: ["Industrials", "Asia-Pacific", "India Digital", "Electric Vehicles", "Automotive"], rating: "HOLD", assetType: "stock" },
  // Emerging — Brazil
  { ticker: "NU", companyName: "Nu Holdings", tags: ["Financials", "Latin America", "Digital Banking", "Fintech", "Consumer"], rating: "BUY", assetType: "stock" },
  { ticker: "VALE", companyName: "Vale SA", tags: ["Materials", "Latin America", "Mining", "Iron Ore", "Battery Materials"], rating: "HOLD", assetType: "stock" },
  { ticker: "PBR", companyName: "Petrobras", tags: ["Energy", "Latin America", "Oil & Gas", "Deep Water", "Dividends"], rating: "HOLD", assetType: "stock" },
  { ticker: "STNE", companyName: "StoneCo", tags: ["Technology", "Latin America", "Fintech", "Payments", "SMB"], rating: "HOLD", assetType: "stock" },
  // Emerging — SE Asia
  { ticker: "SE", companyName: "Sea Limited", tags: ["Technology", "Asia-Pacific", "E-Commerce", "Fintech", "Southeast Asia"], rating: "BUY", assetType: "stock" },
  { ticker: "CPNG", companyName: "Coupang", tags: ["Technology", "Asia-Pacific", "E-Commerce", "Logistics", "South Korea"], rating: "BUY", assetType: "stock" },
  // Emerging — LatAm/Other
  { ticker: "GLOB", companyName: "Globant", tags: ["Technology", "Latin America", "AI Infrastructure", "Digital Transformation", "Consulting"], rating: "BUY", assetType: "stock" },
  { ticker: "AMX", companyName: "América Móvil", tags: ["Technology", "Latin America", "Telecoms", "Digital Infrastructure", "MENA"], rating: "HOLD", assetType: "stock" },
  { ticker: "FMX", companyName: "FEMSA", tags: ["Consumer", "Latin America", "Retail", "Beverages", "Convenience"], rating: "HOLD", assetType: "stock" },
  { ticker: "PKX", companyName: "POSCO Holdings", tags: ["Materials", "Asia-Pacific", "Steel", "Battery Materials", "South Korea"], rating: "HOLD", assetType: "stock" },
  // ETFs
  { ticker: "ISDE.L", companyName: "iShares MSCI EM Islamic ETF", tags: ["Global", "Asia-Pacific", "Shariah Finance", "Emerging Markets", "Diversified"], rating: "BUY", assetType: "etf" },
  { ticker: "ISWD.L", companyName: "iShares MSCI World Islamic ETF", tags: ["Global", "Shariah Finance", "Technology", "Healthcare", "Diversified"], rating: "BUY", assetType: "etf" },
  { ticker: "HTWD.L", companyName: "HSBC MSCI Taiwan Capped ETF", tags: ["Technology", "Asia-Pacific", "Semiconductors", "Chip Manufacturing"], rating: "BUY", assetType: "etf" },
  { ticker: "SEMI.L", companyName: "iShares Global Semiconductors ETF", tags: ["Technology", "Global", "Semiconductors", "AI Infrastructure"], rating: "BUY", assetType: "etf" },
  { ticker: "SMH.L", companyName: "VanEck Semiconductor ETF", tags: ["Technology", "Global", "Semiconductors", "Chip Manufacturing"], rating: "BUY", assetType: "etf" },
  { ticker: "INRG.L", companyName: "iShares Global Clean Energy ETF", tags: ["Energy", "Global", "Clean Energy", "Solar", "Wind"], rating: "HOLD", assetType: "etf" },
  { ticker: "RENW.L", companyName: "L&G Clean Energy ETF", tags: ["Energy", "Global", "Clean Energy", "Grid Storage", "Infrastructure"], rating: "HOLD", assetType: "etf" },
  { ticker: "HEAL.L", companyName: "iShares Healthcare Innovation ETF", tags: ["Healthcare", "Global", "Biotech", "Medical Devices", "Innovation"], rating: "HOLD", assetType: "etf" },
  { ticker: "VFEM.L", companyName: "Vanguard FTSE Emerging Markets ETF", tags: ["Global", "Asia-Pacific", "Latin America", "Emerging Markets", "Diversified"], rating: "HOLD", assetType: "etf" },
];

// ── Fuzzy Match Logic ────────────────────────────────────────────────────────

function matchScore(asset: TaggedAsset, searchTerms: string[]): number {
  if (searchTerms.length === 0) return 0;
  let score = 0;
  const allText = [...asset.tags, asset.companyName, asset.ticker].join(" ").toLowerCase();

  for (const term of searchTerms) {
    const lower = term.toLowerCase();
    // Exact tag match = 10 points
    if (asset.tags.some((t) => t.toLowerCase() === lower)) { score += 10; continue; }
    // Partial tag match = 5 points
    if (asset.tags.some((t) => t.toLowerCase().includes(lower) || lower.includes(t.toLowerCase()))) { score += 5; continue; }
    // Company/ticker contains term = 3 points
    if (allText.includes(lower)) { score += 3; continue; }
    // Fuzzy: term shares 3+ chars with a tag = 1 point
    if (asset.tags.some((t) => {
      const tLow = t.toLowerCase();
      return lower.length >= 3 && tLow.includes(lower.slice(0, 3));
    })) { score += 1; }
  }
  return score;
}

// ── Component ────────────────────────────────────────────────────────────────

export default function ThemesPage() {
  const [customTags, setCustomTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [promoted, setPromoted] = useState<string[]>([]);
  const [promoteMessage, setPromoteMessage] = useState<string | null>(null);

  // Load custom tags from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("nc_custom_tags");
    if (saved) setCustomTags(JSON.parse(saved));
    const savedPromoted = localStorage.getItem("nc_promoted");
    if (savedPromoted) setPromoted(JSON.parse(savedPromoted));
  }, []);

  // Save custom tags
  const saveCustomTags = (tags: string[]) => {
    setCustomTags(tags);
    localStorage.setItem("nc_custom_tags", JSON.stringify(tags));
  };

  const addTag = () => {
    if (newTag.trim() && !customTags.includes(newTag.trim()) && !REGIONS.includes(newTag.trim()) && !SECTORS.includes(newTag.trim())) {
      saveCustomTags([...customTags, newTag.trim()]);
      setNewTag("");
    }
  };

  const removeTag = (tag: string) => {
    saveCustomTags(customTags.filter((t) => t !== tag));
    setActiveFilters(activeFilters.filter((f) => f !== tag));
  };

  const toggleFilter = (tag: string) => {
    setActiveFilters((prev) => prev.includes(tag) ? prev.filter((f) => f !== tag) : [...prev, tag]);
  };

  const handlePromote = (ticker: string, name: string) => {
    // Save to localStorage as promoted assets
    const existing = JSON.parse(localStorage.getItem("nc_promoted") || "[]");
    if (!existing.includes(ticker)) {
      existing.push(ticker);
      localStorage.setItem("nc_promoted", JSON.stringify(existing));
    }
    setPromoted((prev) => [...prev, ticker]);
    setPromoteMessage(`✓ ${ticker} (${name}) added to Conviction List request. Ask analyst to review in Kiro.`);
    setTimeout(() => setPromoteMessage(null), 4000);
  };

  // Filter and rank assets by active filters
  const rankedAssets = activeFilters.length > 0
    ? TAGGED_ASSETS
        .map((a) => ({ ...a, score: matchScore(a, activeFilters) }))
        .filter((a) => a.score > 0)
        .sort((a, b) => b.score - a.score)
    : TAGGED_ASSETS.sort((a, b) => (a.rating === "BUY" ? 0 : a.rating === "HOLD" ? 1 : 2) - (b.rating === "BUY" ? 0 : b.rating === "HOLD" ? 1 : 2));

  const ratingColors: Record<string, string> = { BUY: "badge-green", HOLD: "badge-blue", REDUCE: "badge-amber" };

  // Suggested themes based on existing assets
  const allUsedTags = [...new Set(TAGGED_ASSETS.flatMap((a) => a.tags))];
  const suggestedTags = allUsedTags.filter((t) => !REGIONS.includes(t) && !SECTORS.includes(t) && !customTags.includes(t)).slice(0, 8);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Investment Lens</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Define what you want to invest in. The analyst finds assets that match.
        </p>
      </div>

      {/* Custom Tags Input */}
      <div className="card">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">Your Investment Themes</h2>
        <p className="mb-4 text-xs text-muted-foreground">Add industries, regions, sectors, or any buzzword. Assets will be matched to your themes.</p>

        <div className="flex gap-2">
          <input value={newTag} onChange={(e) => setNewTag(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addTag()}
            placeholder="e.g. Aviation, India Digital, GLP-1, Defence-Free..."
            className="flex-1 rounded-lg border border-border bg-panel px-3 py-2 text-sm dark:border-border-dark dark:bg-panel-dark" />
          <button onClick={addTag} disabled={!newTag.trim()}
            className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 disabled:opacity-50">
            Add Theme
          </button>
        </div>

        {/* Custom tags */}
        {customTags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {customTags.map((tag) => (
              <span key={tag} className="inline-flex items-center gap-1 rounded-full bg-brand-50 px-3 py-1 text-xs font-medium text-brand-700 dark:bg-brand-950/30 dark:text-brand-400">
                {tag}
                <button onClick={() => removeTag(tag)} className="ml-1 text-brand-500 hover:text-brand-700">×</button>
              </span>
            ))}
          </div>
        )}

        {/* Suggested */}
        {suggestedTags.length > 0 && (
          <div className="mt-4">
            <p className="text-[10px] uppercase text-muted-foreground">Suggested themes from your assets:</p>
            <div className="mt-2 flex flex-wrap gap-1">
              {suggestedTags.map((tag) => (
                <button key={tag} onClick={() => saveCustomTags([...customTags, tag])}
                  className="rounded-full border border-border px-2 py-0.5 text-[10px] text-muted-foreground hover:border-brand-500 hover:text-brand-600 dark:border-border-dark">
                  + {tag}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Filter Buttons */}
      <div className="card">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">Filter by Lens</h2>
        <p className="mb-3 text-xs text-muted-foreground">Select one or more. Assets are ranked by closest match — not exact match only.</p>

        {/* Regions */}
        <div className="mb-3">
          <p className="mb-2 text-[10px] font-medium uppercase text-muted-foreground">Regions</p>
          <div className="flex flex-wrap gap-1">
            {REGIONS.map((r) => (
              <button key={r} onClick={() => toggleFilter(r)}
                className={`rounded-full px-3 py-1 text-xs font-medium transition ${activeFilters.includes(r) ? "bg-brand-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400"}`}>
                {r}
              </button>
            ))}
          </div>
        </div>

        {/* Sectors */}
        <div className="mb-3">
          <p className="mb-2 text-[10px] font-medium uppercase text-muted-foreground">Sectors</p>
          <div className="flex flex-wrap gap-1">
            {SECTORS.map((s) => (
              <button key={s} onClick={() => toggleFilter(s)}
                className={`rounded-full px-3 py-1 text-xs font-medium transition ${activeFilters.includes(s) ? "bg-brand-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400"}`}>
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Custom */}
        {customTags.length > 0 && (
          <div>
            <p className="mb-2 text-[10px] font-medium uppercase text-muted-foreground">Your Themes</p>
            <div className="flex flex-wrap gap-1">
              {customTags.map((t) => (
                <button key={t} onClick={() => toggleFilter(t)}
                  className={`rounded-full px-3 py-1 text-xs font-medium transition ${activeFilters.includes(t) ? "bg-brand-600 text-white" : "bg-brand-50 text-brand-700 hover:bg-brand-100 dark:bg-brand-950/30 dark:text-brand-400"}`}>
                  {t}
                </button>
              ))}
            </div>
          </div>
        )}

        {activeFilters.length > 0 && (
          <div className="mt-3 flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Active: {activeFilters.join(" + ")}</span>
            <button onClick={() => setActiveFilters([])} className="text-xs text-red-500 hover:text-red-700">Clear all</button>
          </div>
        )}
      </div>

      {/* Promote Message */}
      {promoteMessage && (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-400 fade-in">
          {promoteMessage}
        </div>
      )}

      {/* Results */}
      <div className="card">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            {activeFilters.length > 0 ? `Closest Matches (${rankedAssets.length})` : `All Assets (${rankedAssets.length})`}
          </h2>
          {activeFilters.length > 0 && (
            <span className="text-xs text-muted-foreground">Ranked by relevance to: {activeFilters.join(", ")}</span>
          )}
        </div>

        <div className="space-y-2">
          {rankedAssets.slice(0, 30).map((asset) => (
            <div key={asset.ticker + asset.companyName} className="flex items-center gap-3 rounded-lg border border-border/50 p-3 transition hover:-translate-y-0.5 hover:shadow-elevated dark:border-border-dark/50">
              <span className={`badge ${ratingColors[asset.rating]}`}>{asset.rating}</span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm font-bold">{asset.ticker}</span>
                  <span className="text-sm">{asset.companyName}</span>
                  <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[9px] text-slate-500 dark:bg-slate-800">{asset.assetType}</span>
                </div>
                <div className="mt-1 flex flex-wrap gap-1">
                  {asset.tags.slice(0, 5).map((tag) => (
                    <span key={tag} className={`rounded-full px-1.5 py-0.5 text-[9px] ${activeFilters.includes(tag) ? "bg-brand-100 text-brand-700 dark:bg-brand-950 dark:text-brand-400" : "bg-slate-50 text-slate-500 dark:bg-slate-800/50 dark:text-slate-500"}`}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              {"score" in asset && (
                <span className="text-xs font-medium text-muted-foreground">{(asset as any).score}pts</span>
              )}
              <button
                onClick={() => handlePromote(asset.ticker, asset.companyName)}
                className="shrink-0 rounded-lg border border-brand-300 px-3 py-1.5 text-[10px] font-medium text-brand-700 transition hover:bg-brand-50 dark:border-brand-700 dark:text-brand-400 dark:hover:bg-brand-950/30"
              >
                + Conviction List
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Analyst Methodology */}
      <div className="card">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted-foreground">How The Analyst Works</h2>
        <p className="mb-4 text-xs text-muted-foreground">When you ask the analyst to review, this is the research process followed for every theme you define:</p>

        <div className="space-y-4">
          <AnalystStep step={1} title="Global Index Scan" status="systematic"
            items={["MSCI World (developed markets)", "MSCI Emerging Markets", "FTSE All-World", "Identify all companies matching your theme keywords"]} />
          <AnalystStep step={2} title="Regional Breakdown" status="systematic"
            items={["North America → S&P 500, NASDAQ 100", "Europe → STOXX 600, FTSE 100", "Asia-Pacific → MSCI Asia ex-Japan, Nikkei, KOSPI, TWSE", "Latin America → MSCI LatAm", "MENA → MSCI GCC, Tadawul", "Per region: top 5–10 matching companies"]} />
          <AnalystStep step={3} title="Access Filter" status="practical"
            items={["Does it have a NYSE/NASDAQ ADR? → Stock (direct buy)", "Is it in an LSE-listed ETF? → ETF route", "Is it in an AJ Bell OEIC? → Fund route", "None of the above → Research only (flag for future)"]} />
          <AnalystStep step={4} title="Screening Filter" status="ethical"
            items={["Gambling? → Exclude", "Alcohol? → Exclude", "Weapons? → Exclude", "Interest-based finance? → Exclude", "Israel exposure? → Exclude", "Only APPROVED assets proceed"]} />
          <AnalystStep step={5} title="Fundamental Analysis" status="systematic"
            items={["Revenue growth trajectory (3-year trend)", "Profitability: ROE, margins, free cash flow", "Balance sheet health: debt/equity, net cash position", "Competitive moat: market share, pricing power, barriers to entry", "Valuation context: P/E relative to growth rate and sector", "Dividend yield and sustainability (where applicable)"]} />
          <AnalystStep step={6} title="Technical Analysis" status="systematic"
            items={["Price vs 50-day moving average (short-term trend)", "Price vs 200-day moving average (long-term trend)", "Momentum: rate of change, relative strength", "Volatility: annualised standard deviation", "Market regime alignment: bullish/neutral/defensive", "Entry timing: is trend supportive for new position?"]} />
          <AnalystStep step={7} title="Output & Conviction" status="actionable"
            items={["Stocks (ADRs you can buy directly on AJ Bell)", "ETFs (LSE-listed, covering the theme)", "Funds (OEICs available on AJ Bell)", "Ranked by conviction: BUY / HOLD / WATCH", "Position sizing guidance based on risk rating"]} />
        </div>

        <div className="mt-6 rounded-lg bg-slate-50 p-4 dark:bg-slate-800/50">
          <p className="text-xs font-medium text-muted-foreground">Markets covered:</p>
          <p className="mt-1 text-xs">NYSE · NASDAQ · LSE · Euronext · TWSE (via ETFs) · HKEX (via ADRs) · BSE/NSE (via ADRs) · B3 Brazil (via ADRs) · BMV Mexico (via ADRs) · Tadawul (via ETFs) · KRX Korea (via ADRs) · SGX (via ADRs)</p>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-border pt-4 text-center text-xs text-muted-foreground dark:border-border-dark">
        Define your investment themes. The analyst scans global markets and returns closest matches.
      </div>
    </div>
  );
}

// ── Analyst Step Component ───────────────────────────────────────────────────

function AnalystStep({ step, title, status, items }: { step: number; title: string; status: string; items: string[] }) {
  const statusColors: Record<string, string> = {
    systematic: "border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-blue-950/30",
    practical: "border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950/30",
    ethical: "border-emerald-200 bg-emerald-50 dark:border-emerald-900 dark:bg-emerald-950/30",
    actionable: "border-brand-200 bg-brand-50 dark:border-brand-900 dark:bg-brand-950/30",
  };
  const stepColor = statusColors[status] || "border-border bg-panel dark:border-border-dark dark:bg-panel-dark";

  return (
    <div className={`rounded-lg border p-4 ${stepColor}`}>
      <div className="flex items-center gap-3">
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white text-xs font-bold shadow-sm dark:bg-slate-800">
          {step}
        </span>
        <h3 className="text-sm font-semibold">{title}</h3>
      </div>
      <ul className="mt-3 space-y-1 pl-10">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
            <span className="mt-1 text-[8px]">├──</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
