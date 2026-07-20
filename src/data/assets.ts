/**
 * Nür Capital — Single Source of Truth for all asset data.
 *
 * All other files should import from here.
 * Adding a new asset = editing ONE file.
 */

// ── Master Interface ─────────────────────────────────────────────────────────

export interface AssetMaster {
  ticker: string;
  name: string;
  tags: string[];
  type: "stock" | "etf" | "fund";
  exchange: string;
  region: string;
  ajBell: boolean;
  screening: "approved" | "watchlist" | "rejected";
  // Identity
  isin?: string;
  brokerSearchName?: string;
  currency?: string;
  country?: string;
  ajBellStatus?: "eligible" | "research_only" | "unsupported";
  statusReason?: string;
  // Conviction List signal data
  inConvictionList?: boolean;
  signalPrice?: number;
  signalDate?: string;
  rating?: "BUY" | "HOLD" | "REDUCE";
  rationale?: string;
  regime?: string;
  theme?: string;
}

// ── Conviction List Assets (33 signals — full metadata) ──────────────────────

const CONVICTION_ASSETS: AssetMaster[] = [
  // Developed Market Stocks
  { ticker: "TSM", name: "Taiwan Semiconductor", tags: ["Semiconductors", "AI", "Microchips", "Asia-Pacific", "Chip Manufacturing", "Foundry"], type: "stock", exchange: "NYSE", region: "Asia-Pacific", ajBell: true, screening: "approved", isin: "US8740391003", brokerSearchName: "Taiwan Semiconductor Manufacturing ADR", currency: "USD", country: "Taiwan", ajBellStatus: "eligible", inConvictionList: true, signalPrice: 165.20, signalDate: "2026-06-01", rating: "BUY", rationale: "Leading foundry. AI demand structural. Monopoly in advanced nodes.", regime: "Weak Bull", theme: "Semiconductors" },
  { ticker: "ASML", name: "ASML Holding", tags: ["Semiconductors", "Microchips", "Europe", "Chip Equipment", "EUV Lithography", "Technology"], type: "stock", exchange: "NASDAQ", region: "Europe", ajBell: true, screening: "approved", isin: "USN070592100", brokerSearchName: "ASML Holding", currency: "USD", country: "Netherlands", ajBellStatus: "eligible", inConvictionList: true, signalPrice: 878.50, signalDate: "2026-06-01", rating: "BUY", rationale: "Sole EUV manufacturer. Multi-year backlog.", regime: "Weak Bull", theme: "Semiconductors" },
  { ticker: "LLY", name: "Eli Lilly", tags: ["Healthcare", "GLP-1", "Obesity", "Pharmaceuticals", "Biotech"], type: "stock", exchange: "NYSE", region: "North America", ajBell: true, screening: "approved", isin: "US5324571083", brokerSearchName: "Eli Lilly", currency: "USD", country: "US", ajBellStatus: "eligible", inConvictionList: true, signalPrice: 1085.00, signalDate: "2026-06-01", rating: "BUY", rationale: "GLP-1 leader. $100B+ obesity TAM.", regime: "Weak Bull", theme: "Healthcare" },
  { ticker: "CRWD", name: "CrowdStrike", tags: ["Cybersecurity", "AI", "Cloud Security", "Endpoint", "Technology"], type: "stock", exchange: "NASDAQ", region: "North America", ajBell: true, screening: "approved", isin: "US22788C1053", brokerSearchName: "CrowdStrike Holdings", currency: "USD", country: "US", ajBellStatus: "eligible", inConvictionList: true, signalPrice: 422.50, signalDate: "2026-06-01", rating: "BUY", rationale: "Endpoint security leader. 97% retention.", regime: "Weak Bull", theme: "Cybersecurity" },
  { ticker: "AMD", name: "Advanced Micro Devices", tags: ["Semiconductors", "AI", "Microchips", "Technology", "Data Centre", "GPU"], type: "stock", exchange: "NASDAQ", region: "North America", ajBell: true, screening: "approved", isin: "US0079031078", brokerSearchName: "Advanced Micro Devices", currency: "USD", country: "US", ajBellStatus: "eligible", inConvictionList: true, signalPrice: 155.40, signalDate: "2026-06-01", rating: "BUY", rationale: "MI300 AI accelerator gaining share.", regime: "Weak Bull", theme: "Semiconductors" },
  { ticker: "AVGO", name: "Broadcom", tags: ["Semiconductors", "AI", "Networking", "Technology", "Custom Chips", "Data Centre"], type: "stock", exchange: "NASDAQ", region: "North America", ajBell: true, screening: "approved", isin: "US11135F1012", brokerSearchName: "Broadcom", currency: "USD", country: "US", ajBellStatus: "eligible", inConvictionList: true, signalPrice: 230.50, signalDate: "2026-06-01", rating: "BUY", rationale: "Custom AI chips for Google/Meta.", regime: "Weak Bull", theme: "Semiconductors" },
  { ticker: "PANW", name: "Palo Alto Networks", tags: ["Cybersecurity", "Network Security", "Cloud", "Platform", "Technology"], type: "stock", exchange: "NASDAQ", region: "North America", ajBell: true, screening: "approved", isin: "US6974351057", brokerSearchName: "Palo Alto Networks", currency: "USD", country: "US", ajBellStatus: "eligible", inConvictionList: true, signalPrice: 210.80, signalDate: "2026-06-01", rating: "BUY", rationale: "Platform consolidation leader.", regime: "Weak Bull", theme: "Cybersecurity" },
  { ticker: "ABB", name: "ABB Ltd", tags: ["Industrial Automation", "Robotics", "Electrification", "Europe"], type: "stock", exchange: "NYSE", region: "Europe", ajBell: true, screening: "approved", isin: "CH0012221716", brokerSearchName: "ABB Ltd", currency: "USD", country: "Switzerland", ajBellStatus: "eligible", inConvictionList: true, signalPrice: 56.20, signalDate: "2026-06-01", rating: "HOLD", rationale: "Global automation leader. Swiss quality.", regime: "Weak Bull", theme: "Industrial Automation" },
  { ticker: "NVO", name: "Novo Nordisk (ADR)", tags: ["Healthcare", "GLP-1", "Obesity", "Pharmaceuticals", "Europe"], type: "stock", exchange: "NYSE", region: "Europe", ajBell: true, screening: "approved", isin: "US6701002056", brokerSearchName: "Novo Nordisk ADR", currency: "USD", country: "Denmark", ajBellStatus: "eligible", inConvictionList: true, signalPrice: 95.80, signalDate: "2026-06-01", rating: "HOLD", rationale: "GLP-1 pioneer. In correction but fundamentals intact.", regime: "Weak Bull", theme: "Healthcare" },
  { ticker: "ENPH", name: "Enphase Energy", tags: ["Clean Energy", "Solar", "Battery Technology", "Microinverters"], type: "stock", exchange: "NASDAQ", region: "North America", ajBell: true, screening: "approved", isin: "US29355A1079", brokerSearchName: "Enphase Energy", currency: "USD", country: "US", ajBellStatus: "eligible", inConvictionList: true, signalPrice: 72.30, signalDate: "2026-06-01", rating: "REDUCE", rationale: "In downtrend. High volatility. Reduce exposure.", regime: "Weak Bull", theme: "Clean Energy" },
  // Emerging Market Stocks
  { ticker: "INFY", name: "Infosys (India)", tags: ["Technology", "AI", "Software", "IT Services", "Asia-Pacific", "India"], type: "stock", exchange: "NYSE", region: "Asia-Pacific", ajBell: true, screening: "approved", inConvictionList: true, signalPrice: 19.80, signalDate: "2026-06-01", rating: "BUY", rationale: "India #2 IT services. Enterprise AI implementation leader.", regime: "Weak Bull", theme: "AI Infrastructure" },
  { ticker: "NU", name: "Nu Holdings (Brazil)", tags: ["Fintech", "Latin America", "Digital Banking", "Technology", "Consumer"], type: "stock", exchange: "NYSE", region: "Latin America", ajBell: true, screening: "approved", inConvictionList: true, signalPrice: 14.20, signalDate: "2026-06-01", rating: "BUY", rationale: "World's largest digital bank. 200M+ customers. Fee-based model.", regime: "Weak Bull", theme: "Emerging Market Champions" },
  { ticker: "SE", name: "Sea Limited (Singapore)", tags: ["E-Commerce", "Fintech", "Asia-Pacific", "Southeast Asia", "Technology"], type: "stock", exchange: "NYSE", region: "Asia-Pacific", ajBell: true, screening: "approved", inConvictionList: true, signalPrice: 138.50, signalDate: "2026-06-01", rating: "BUY", rationale: "SE Asia's largest digital platform. Shopee + SeaMoney. Profitable.", regime: "Weak Bull", theme: "Emerging Market Champions" },
  { ticker: "CPNG", name: "Coupang (South Korea)", tags: ["E-Commerce", "Logistics", "Asia-Pacific", "South Korea", "Technology"], type: "stock", exchange: "NYSE", region: "Asia-Pacific", ajBell: true, screening: "approved", inConvictionList: true, signalPrice: 26.40, signalDate: "2026-06-01", rating: "BUY", rationale: "Korea's largest e-commerce. Rocket delivery. Now profitable.", regime: "Weak Bull", theme: "Emerging Market Champions" },
  { ticker: "GLOB", name: "Globant (Argentina)", tags: ["AI", "Software", "Digital Transformation", "Latin America", "Consulting"], type: "stock", exchange: "NYSE", region: "Latin America", ajBell: true, screening: "approved", inConvictionList: true, signalPrice: 215.30, signalDate: "2026-06-01", rating: "BUY", rationale: "Argentina-based digital transformation. AI services leader.", regime: "Weak Bull", theme: "AI Infrastructure" },
  { ticker: "MMYT", name: "MakeMyTrip (India)", tags: ["Travel", "Asia-Pacific", "India", "Consumer", "Technology"], type: "stock", exchange: "NASDAQ", region: "Asia-Pacific", ajBell: true, screening: "approved", inConvictionList: true, signalPrice: 108.40, signalDate: "2026-06-01", rating: "BUY", rationale: "India's largest online travel platform. Rising middle class.", regime: "Weak Bull", theme: "Emerging Market Champions" },
  { ticker: "VALE", name: "Vale SA (Brazil)", tags: ["Mining", "Latin America", "Iron Ore", "Materials", "Battery Materials"], type: "stock", exchange: "NYSE", region: "Latin America", ajBell: true, screening: "approved", inConvictionList: true, signalPrice: 10.50, signalDate: "2026-06-01", rating: "HOLD", rationale: "World's largest iron ore producer. Strong dividend.", regime: "Weak Bull", theme: "Emerging Market Champions" },
  { ticker: "PBR", name: "Petrobras (Brazil)", tags: ["Oil & Gas", "Energy", "Latin America", "Deep Water", "Dividends"], type: "stock", exchange: "NYSE", region: "Latin America", ajBell: true, screening: "approved", inConvictionList: true, signalPrice: 13.80, signalDate: "2026-06-01", rating: "HOLD", rationale: "Brazil national oil company. Deep-water pre-salt leader.", regime: "Weak Bull", theme: "Energy Infrastructure" },
  { ticker: "AMX", name: "América Móvil (Mexico)", tags: ["Telecoms", "Latin America", "Infrastructure", "Consumer"], type: "stock", exchange: "NYSE", region: "Latin America", ajBell: true, screening: "approved", inConvictionList: true, signalPrice: 18.20, signalDate: "2026-06-01", rating: "HOLD", rationale: "LatAm largest telecom. 300M+ subscribers.", regime: "Weak Bull", theme: "Emerging Market Champions" },
  { ticker: "FMX", name: "FEMSA (Mexico)", tags: ["Consumer", "Latin America", "Retail", "Beverages"], type: "stock", exchange: "NYSE", region: "Latin America", ajBell: true, screening: "approved", inConvictionList: true, signalPrice: 108.50, signalDate: "2026-06-01", rating: "HOLD", rationale: "Largest Coca-Cola bottler + OXXO stores (21,000+).", regime: "Weak Bull", theme: "Consumer Staples" },
  { ticker: "RDY", name: "Dr. Reddy's (India)", tags: ["Healthcare", "Generics", "Asia-Pacific", "India", "Pharmaceuticals"], type: "stock", exchange: "NYSE", region: "Asia-Pacific", ajBell: true, screening: "approved", inConvictionList: true, signalPrice: 74.20, signalDate: "2026-06-01", rating: "HOLD", rationale: "India's largest pharma. Generics + biosimilar pipeline.", regime: "Weak Bull", theme: "Healthcare" },
  { ticker: "UMC", name: "United Microelectronics (Taiwan)", tags: ["Semiconductors", "Asia-Pacific", "Foundry", "Mature Nodes"], type: "stock", exchange: "NYSE", region: "Asia-Pacific", ajBell: true, screening: "approved", inConvictionList: true, signalPrice: 8.05, signalDate: "2026-06-01", rating: "HOLD", rationale: "World #3 foundry. Mature node specialist.", regime: "Weak Bull", theme: "Semiconductors" },
  { ticker: "PKX", name: "POSCO Holdings (Korea)", tags: ["Materials", "Asia-Pacific", "Steel", "Battery Materials", "South Korea"], type: "stock", exchange: "NYSE", region: "Asia-Pacific", ajBell: true, screening: "approved", inConvictionList: true, signalPrice: 43.80, signalDate: "2026-06-01", rating: "HOLD", rationale: "World #4 steelmaker. Pivoting to battery materials.", regime: "Weak Bull", theme: "Emerging Market Champions" },
  { ticker: "TTM", name: "Tata Motors (India)", tags: ["Electric Vehicles", "Asia-Pacific", "India", "Automotive", "Battery Technology"], type: "stock", exchange: "NYSE", region: "Asia-Pacific", ajBell: true, screening: "approved", inConvictionList: true, signalPrice: 10.80, signalDate: "2026-06-01", rating: "HOLD", rationale: "India #1 commercial vehicles. Owns Jaguar Land Rover.", regime: "Weak Bull", theme: "Emerging Market Champions" },
  // ETFs (LSE-listed, priced in GBX)
  { ticker: "ISDE.L", name: "iShares MSCI EM Islamic UCITS ETF", tags: ["Halal Finance", "Shariah", "Emerging Markets", "Asia-Pacific", "Latin America"], type: "etf", exchange: "LSE", region: "Global", ajBell: true, screening: "approved", isin: "IE00B27YCP72", ajBellStatus: "eligible", inConvictionList: true, signalPrice: 1850.00, signalDate: "2026-07-10", rating: "BUY", rationale: "Only LSE-listed Shariah-compliant EM ETF. 0.85% TER.", regime: "Weak Bull", theme: "Emerging Market Champions" },
  { ticker: "ISWD.L", name: "iShares MSCI World Islamic UCITS ETF", tags: ["Halal Finance", "Shariah", "Global", "Diversified", "Technology"], type: "etf", exchange: "LSE", region: "Global", ajBell: true, screening: "approved", isin: "IE00B27YCN58", ajBellStatus: "eligible", inConvictionList: true, signalPrice: 4928.00, signalDate: "2026-07-10", rating: "BUY", rationale: "Global Shariah ETF. 0.30% TER. 32% 1Y return.", regime: "Weak Bull", theme: "Halal Finance" },
  { ticker: "HTWD.L", name: "HSBC MSCI Taiwan Capped UCITS ETF", tags: ["Semiconductors", "Asia-Pacific", "Technology", "Chip Manufacturing"], type: "etf", exchange: "LSE", region: "Asia-Pacific", ajBell: true, screening: "approved", isin: "IE00B3S1J086", ajBellStatus: "eligible", inConvictionList: true, signalPrice: 4582.00, signalDate: "2026-07-10", rating: "BUY", rationale: "Pure Taiwan semi exposure. TSMC ~35%. 0.30% TER.", regime: "Weak Bull", theme: "Semiconductors" },
  { ticker: "SEMI.L", name: "iShares MSCI Global Semiconductors UCITS ETF", tags: ["Semiconductors", "Microchips", "AI", "Global", "Technology"], type: "etf", exchange: "LSE", region: "Global", ajBell: true, screening: "approved", ajBellStatus: "eligible", inConvictionList: true, signalPrice: 575.00, signalDate: "2026-07-10", rating: "BUY", rationale: "Pure global semi ETF. +158% 1Y. 0.35% TER.", regime: "Weak Bull", theme: "Semiconductors" },
  { ticker: "SMH.L", name: "VanEck Semiconductor UCITS ETF", tags: ["Semiconductors", "Microchips", "AI", "Global", "Technology"], type: "etf", exchange: "LSE", region: "Global", ajBell: true, screening: "approved", ajBellStatus: "eligible", inConvictionList: true, signalPrice: 10960.00, signalDate: "2026-07-10", rating: "BUY", rationale: "Europe's first semi ETF. $9B AUM. Excludes weapons. 0.35% TER.", regime: "Weak Bull", theme: "Semiconductors" },
  { ticker: "INRG.L", name: "iShares Global Clean Energy UCITS ETF", tags: ["Clean Energy", "Solar", "Wind", "Battery Technology", "Global"], type: "etf", exchange: "LSE", region: "Global", ajBell: true, screening: "approved", ajBellStatus: "eligible", inConvictionList: true, signalPrice: 850.00, signalDate: "2026-07-10", rating: "HOLD", rationale: "Solar/wind/hydrogen. Cyclically weak. 0.65% TER.", regime: "Weak Bull", theme: "Clean Energy" },
  { ticker: "RENW.L", name: "L&G Clean Energy UCITS ETF", tags: ["Clean Energy", "Grid Storage", "Infrastructure", "Global"], type: "etf", exchange: "LSE", region: "Global", ajBell: true, screening: "approved", ajBellStatus: "eligible", inConvictionList: true, signalPrice: 920.00, signalDate: "2026-07-10", rating: "HOLD", rationale: "Broader clean energy. Grid storage. 0.49% TER.", regime: "Weak Bull", theme: "Clean Energy" },
  { ticker: "HEAL.L", name: "iShares Healthcare Innovation UCITS ETF", tags: ["Healthcare", "Biotech", "Medical Devices", "Innovation", "Global"], type: "etf", exchange: "LSE", region: "Global", ajBell: true, screening: "approved", ajBellStatus: "eligible", inConvictionList: true, signalPrice: 780.00, signalDate: "2026-07-10", rating: "HOLD", rationale: "Biotech/medtech. 0.40% TER. GLP-1 + gene therapy catalysts.", regime: "Weak Bull", theme: "Healthcare" },
  { ticker: "VFEM.L", name: "Vanguard FTSE Emerging Markets UCITS ETF", tags: ["Emerging Markets", "Asia-Pacific", "Latin America", "Diversified"], type: "etf", exchange: "LSE", region: "Global", ajBell: true, screening: "approved", ajBellStatus: "eligible", inConvictionList: true, signalPrice: 5200.00, signalDate: "2026-07-10", rating: "HOLD", rationale: "Cheapest EM exposure (0.22% TER). Use alongside ISDE.", regime: "Weak Bull", theme: "Emerging Market Champions" },
];

// ── Additional Universe Assets (not on Conviction List) ──────────────────────
// These are imported from the existing asset-universe.ts structure.
// Rather than duplicating 70+ records, we re-export from the existing file.

import { ASSET_UNIVERSE as RAW_UNIVERSE } from "./asset-universe";

// ── Build ASSET_MASTER ───────────────────────────────────────────────────────

// Merge conviction assets with remaining universe assets (avoid duplicates)
const convictionTickers = new Set(CONVICTION_ASSETS.map((a) => a.ticker));

const universeOnlyAssets: AssetMaster[] = RAW_UNIVERSE
  .filter((a) => !convictionTickers.has(a.ticker))
  .map((a) => ({
    ticker: a.ticker,
    name: a.name,
    tags: a.tags,
    type: a.type,
    exchange: a.exchange,
    region: a.region,
    ajBell: a.ajBell,
    screening: a.screening,
    inConvictionList: false,
  }));

export const ASSET_MASTER: AssetMaster[] = [...CONVICTION_ASSETS, ...universeOnlyAssets];

// ── Derived Exports (backward-compatible) ────────────────────────────────────

/** All conviction list signals (for research/page.tsx) */
export const SIGNAL_RECORDS = CONVICTION_ASSETS.map((a, i) => ({
  id: i + 1,
  ticker: a.ticker,
  companyName: a.name,
  rating: a.rating!,
  signalDate: a.signalDate!,
  signalPrice: a.signalPrice!,
  theme: a.theme || a.tags[0] || "",
  rationale: a.rationale || "",
  regime: a.regime || "Weak Bull",
  assetType: a.type as "stock" | "etf" | "fund" | undefined,
}));

/** Tickers on the conviction list (for themes/page.tsx) */
export const CONVICTION_TICKERS = new Set(CONVICTION_ASSETS.map((a) => a.ticker));

/** Approved universe assets for Investment Lens search */
export function searchUniverse(terms: string[]): AssetMaster[] {
  if (terms.length === 0) return ASSET_MASTER.filter((a) => a.screening === "approved");

  return ASSET_MASTER
    .filter((a) => a.screening === "approved")
    .map((a) => {
      let score = 0;
      const allText = [...a.tags, a.name, a.ticker, a.region].join(" ").toLowerCase();
      for (const term of terms) {
        const lower = term.toLowerCase();
        if (a.tags.some((t) => t.toLowerCase() === lower)) { score += 10; continue; }
        if (a.tags.some((t) => t.toLowerCase().includes(lower) || lower.includes(t.toLowerCase()))) { score += 5; continue; }
        if (allText.includes(lower)) { score += 3; continue; }
      }
      return { ...a, score };
    })
    .filter((a) => (a as any).score > 0)
    .sort((a, b) => ((b as any).score || 0) - ((a as any).score || 0));
}

/** Get asset identity by ticker */
export function getAssetIdentity(ticker: string): AssetMaster | undefined {
  return ASSET_MASTER.find((a) => a.ticker === ticker);
}
