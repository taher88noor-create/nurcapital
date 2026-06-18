/**
 * Nür Capital — Emerging Market Champions Universe
 *
 * Curated high-quality emerging market businesses that:
 * - Pass Nür Capital ethical screening
 * - Available on AJ Bell (NYSE/NASDAQ ADR)
 * - Support reliable Yahoo Finance pricing
 * - Market leaders with strong competitive advantages
 */

import type { AjBellStatus } from "./asset-identity";

export interface EmergingMarketAsset {
  ticker: string;
  companyName: string;
  exchange: string;
  isin: string;
  country: string;
  sector: string;
  theme: string;
  ajBellStatus: AjBellStatus;
  priceTicker: string;
  brokerSearchName: string;
  currency: string;
  screeningStatus: "approved" | "watchlist" | "rejected";
  screeningNotes: string;
  thesis: string;
  attractivenessScore: number;
  riskScore: number;
  recommendation: "BUY" | "HOLD" | "WATCHLIST" | "REJECT";
}

export const EMERGING_MARKET_UNIVERSE: EmergingMarketAsset[] = [
  // ── TAIWAN — Semiconductor Supply Chain ────────────────────────────────────
  {
    ticker: "UMC", companyName: "United Microelectronics Corporation",
    exchange: "NYSE", isin: "US9108734057", country: "Taiwan",
    sector: "Technology", theme: "Semiconductors",
    ajBellStatus: "eligible", priceTicker: "UMC", brokerSearchName: "United Microelectronics ADR", currency: "USD",
    screeningStatus: "approved", screeningNotes: "All flags clear. Taiwan foundry. No prohibited exposure.",
    thesis: "World's #3 foundry. Mature node specialist (28nm/22nm). Benefits from chip demand without leading-edge capex burden.",
    attractivenessScore: 52, riskScore: 40, recommendation: "HOLD",
  },
  {
    ticker: "ASX", companyName: "ASE Technology Holding",
    exchange: "NYSE", isin: "US00215W1009", country: "Taiwan",
    sector: "Technology", theme: "Semiconductors",
    ajBellStatus: "eligible", priceTicker: "ASX", brokerSearchName: "ASE Technology", currency: "USD",
    screeningStatus: "approved", screeningNotes: "All flags clear. Chip packaging/testing. No prohibited exposure.",
    thesis: "World's largest semiconductor packaging and testing company. Essential supply chain position. Benefits from all chip demand regardless of node.",
    attractivenessScore: 48, riskScore: 35, recommendation: "HOLD",
  },
  // ── INDIA — IT Services & Digital Infrastructure ───────────────────────────
  {
    ticker: "INFY", companyName: "Infosys Limited",
    exchange: "NYSE", isin: "US4567881085", country: "India",
    sector: "Technology", theme: "AI Infrastructure",
    ajBellStatus: "eligible", priceTicker: "INFY", brokerSearchName: "Infosys ADR", currency: "USD",
    screeningStatus: "approved", screeningNotes: "All flags clear. IT services company. No prohibited exposure. Conservative balance sheet.",
    thesis: "India's #2 IT services company. Leading enterprise digital transformation and AI implementation partner. 1,800+ clients globally.",
    attractivenessScore: 55, riskScore: 30, recommendation: "BUY",
  },
  {
    ticker: "WIT", companyName: "Wipro Limited",
    exchange: "NYSE", isin: "US97651M1099", country: "India",
    sector: "Technology", theme: "AI Infrastructure",
    ajBellStatus: "eligible", priceTicker: "WIT", brokerSearchName: "Wipro ADR", currency: "USD",
    screeningStatus: "approved", screeningNotes: "All flags clear. IT services. No prohibited exposure.",
    thesis: "Top-5 Indian IT services. Cloud migration and cybersecurity consulting. Restructuring improving margins.",
    attractivenessScore: 45, riskScore: 35, recommendation: "HOLD",
  },
  {
    ticker: "RDY", companyName: "Dr. Reddy's Laboratories",
    exchange: "NYSE", isin: "US2561352038", country: "India",
    sector: "Healthcare", theme: "Healthcare",
    ajBellStatus: "eligible", priceTicker: "RDY", brokerSearchName: "Dr Reddys Laboratories ADR", currency: "USD",
    screeningStatus: "approved", screeningNotes: "All flags clear. Pharmaceutical company. No prohibited exposure.",
    thesis: "India's largest pharma company. Generics powerhouse with biosimilar pipeline. Growing US market share.",
    attractivenessScore: 50, riskScore: 35, recommendation: "HOLD",
  },
  {
    ticker: "TTM", companyName: "Tata Motors Limited",
    exchange: "NYSE", isin: "US8765685024", country: "India",
    sector: "Consumer", theme: "Emerging Market Champions",
    ajBellStatus: "eligible", priceTicker: "TTM", brokerSearchName: "Tata Motors ADR", currency: "USD",
    screeningStatus: "approved", screeningNotes: "All flags clear. Automotive manufacturer. Owns Jaguar Land Rover. No prohibited exposure.",
    thesis: "India's #1 commercial vehicles. Owns JLR (premium). EV transition underway. Domestic + international diversification.",
    attractivenessScore: 52, riskScore: 45, recommendation: "HOLD",
  },
  {
    ticker: "MMYT", companyName: "MakeMyTrip Limited",
    exchange: "NASDAQ", isin: "US56088PAB85", country: "India",
    sector: "Technology", theme: "Emerging Market Champions",
    ajBellStatus: "eligible", priceTicker: "MMYT", brokerSearchName: "MakeMyTrip", currency: "USD",
    screeningStatus: "approved", screeningNotes: "All flags clear. Online travel platform. No prohibited exposure.",
    thesis: "India's largest online travel platform. Benefiting from rising middle class travel demand. Asset-light model.",
    attractivenessScore: 55, riskScore: 40, recommendation: "BUY",
  },
  // ── BRAZIL — Industrial & Infrastructure ───────────────────────────────────
  {
    ticker: "VALE", companyName: "Vale SA",
    exchange: "NYSE", isin: "US91912E1055", country: "Brazil",
    sector: "Materials", theme: "Emerging Market Champions",
    ajBellStatus: "eligible", priceTicker: "VALE", brokerSearchName: "Vale SA ADR", currency: "USD",
    screeningStatus: "approved", screeningNotes: "All flags clear. Mining company. Iron ore + nickel. No prohibited exposure.",
    thesis: "World's largest iron ore producer. Essential to global steel supply. Nickel exposure for EV batteries. Strong dividend.",
    attractivenessScore: 48, riskScore: 45, recommendation: "HOLD",
  },
  {
    ticker: "PBR", companyName: "Petrobras",
    exchange: "NYSE", isin: "US71654V4086", country: "Brazil",
    sector: "Energy", theme: "Energy Infrastructure",
    ajBellStatus: "eligible", priceTicker: "PBR", brokerSearchName: "Petrobras ADR", currency: "USD",
    screeningStatus: "approved", screeningNotes: "All flags clear. National oil company. Deep-water expertise. Passes AAOIFI debt ratios.",
    thesis: "Brazil's national oil company. Deep-water pre-salt leader. Massive reserves. High dividend yield. Energy security.",
    attractivenessScore: 50, riskScore: 50, recommendation: "HOLD",
  },
  {
    ticker: "NU", companyName: "Nu Holdings Ltd",
    exchange: "NYSE", isin: "KYG6683N1034", country: "Brazil",
    sector: "Technology", theme: "Emerging Market Champions",
    ajBellStatus: "eligible", priceTicker: "NU", brokerSearchName: "Nu Holdings", currency: "USD",
    screeningStatus: "approved", screeningNotes: "Digital bank — primarily fee-based revenue model. Interest income below AAOIFI threshold. Passes screening.",
    thesis: "World's largest digital bank (200M+ customers). LatAm fintech leader. Fee-based model, not traditional lending. Rapid growth.",
    attractivenessScore: 58, riskScore: 45, recommendation: "BUY",
  },
  {
    ticker: "STNE", companyName: "StoneCo Ltd",
    exchange: "NASDAQ", isin: "KYG851581069", country: "Brazil",
    sector: "Technology", theme: "Emerging Market Champions",
    ajBellStatus: "eligible", priceTicker: "STNE", brokerSearchName: "StoneCo", currency: "USD",
    screeningStatus: "approved", screeningNotes: "Payment processing platform. Fee-based revenue. No interest-based lending as core business.",
    thesis: "Brazil's leading fintech payments platform. Merchant services for SMBs. Massive TAM in underbanked market.",
    attractivenessScore: 50, riskScore: 50, recommendation: "HOLD",
  },
  // ── MEXICO — Consumer & Infrastructure ─────────────────────────────────────
  {
    ticker: "AMX", companyName: "América Móvil SAB",
    exchange: "NYSE", isin: "MXP001691213", country: "Mexico",
    sector: "Telecom", theme: "Emerging Market Champions",
    ajBellStatus: "eligible", priceTicker: "AMX", brokerSearchName: "America Movil ADR", currency: "USD",
    screeningStatus: "approved", screeningNotes: "All flags clear. Telecom company. No prohibited exposure. Carlos Slim controlled.",
    thesis: "Latin America's largest telecom. 300M+ subscribers across 25 countries. Digital infrastructure backbone. Defensive cash flows.",
    attractivenessScore: 48, riskScore: 35, recommendation: "HOLD",
  },
  {
    ticker: "FMX", companyName: "Fomento Económico Mexicano (FEMSA)",
    exchange: "NYSE", isin: "US3444041033", country: "Mexico",
    sector: "Consumer", theme: "Consumer Staples",
    ajBellStatus: "eligible", priceTicker: "FMX", brokerSearchName: "FEMSA ADR", currency: "USD",
    screeningStatus: "approved", screeningNotes: "Coca-Cola bottler + OXXO convenience stores. Alcohol revenue from beer distribution is below 5% de minimis. Passes.",
    thesis: "Largest Coca-Cola bottler globally. OXXO is Latin America's largest convenience store chain (21,000+ stores). Defensive consumer.",
    attractivenessScore: 52, riskScore: 30, recommendation: "HOLD",
  },
  {
    ticker: "CX", companyName: "CEMEX SAB",
    exchange: "NYSE", isin: "US1512908898", country: "Mexico",
    sector: "Industrial", theme: "Emerging Market Champions",
    ajBellStatus: "eligible", priceTicker: "CX", brokerSearchName: "CEMEX ADR", currency: "USD",
    screeningStatus: "approved", screeningNotes: "All flags clear. Cement/construction materials. No prohibited exposure.",
    thesis: "Global cement leader. Infrastructure theme — essential for emerging market urbanisation. Pricing power. Balance sheet improving.",
    attractivenessScore: 45, riskScore: 45, recommendation: "HOLD",
  },
  // ── SOUTHEAST ASIA — Consumer & Digital ────────────────────────────────────
  {
    ticker: "SE", companyName: "Sea Limited",
    exchange: "NYSE", isin: "US81141R1005", country: "Singapore",
    sector: "Technology", theme: "Emerging Market Champions",
    ajBellStatus: "eligible", priceTicker: "SE", brokerSearchName: "Sea Limited ADR", currency: "USD",
    screeningStatus: "approved", screeningNotes: "E-commerce (Shopee) + digital finance (SeaMoney). Gaming revenue (Garena) — not gambling, passes. SeaMoney lending under 5% threshold.",
    thesis: "Southeast Asia's largest digital platform. Shopee dominates e-commerce. SeaMoney expanding financial services. Profitable and growing.",
    attractivenessScore: 56, riskScore: 50, recommendation: "BUY",
  },
  // ── SOUTH KOREA — Technology ───────────────────────────────────────────────
  {
    ticker: "PKX", companyName: "POSCO Holdings Inc",
    exchange: "NYSE", isin: "US6934831099", country: "South Korea",
    sector: "Materials", theme: "Emerging Market Champions",
    ajBellStatus: "eligible", priceTicker: "PKX", brokerSearchName: "POSCO Holdings ADR", currency: "USD",
    screeningStatus: "approved", screeningNotes: "All flags clear. Steelmaker + battery materials. No prohibited exposure.",
    thesis: "World's #4 steelmaker pivoting to battery materials (lithium, nickel). Vertically integrating EV supply chain. Strategic positioning.",
    attractivenessScore: 48, riskScore: 45, recommendation: "HOLD",
  },
  {
    ticker: "CPNG", companyName: "Coupang Inc",
    exchange: "NYSE", isin: "US22266T1097", country: "South Korea",
    sector: "Technology", theme: "Emerging Market Champions",
    ajBellStatus: "eligible", priceTicker: "CPNG", brokerSearchName: "Coupang", currency: "USD",
    screeningStatus: "approved", screeningNotes: "All flags clear. E-commerce platform. No prohibited exposure. Asset-light marketplace.",
    thesis: "Korea's largest e-commerce platform. 'Amazon of Korea'. Rocket delivery infrastructure. Now profitable. Expanding into streaming/food.",
    attractivenessScore: 54, riskScore: 40, recommendation: "BUY",
  },
  // ── LATIN AMERICA — Digital & Services ─────────────────────────────────────
  {
    ticker: "GLOB", companyName: "Globant SA",
    exchange: "NYSE", isin: "LU0974299876", country: "Argentina",
    sector: "Technology", theme: "AI Infrastructure",
    ajBellStatus: "eligible", priceTicker: "GLOB", brokerSearchName: "Globant", currency: "USD",
    screeningStatus: "approved", screeningNotes: "All flags clear. IT services/AI consulting. No prohibited exposure. Luxembourg-domiciled.",
    thesis: "Argentina-based digital transformation leader. AI implementation services for enterprises. High-growth, high-margin. Strong client roster.",
    attractivenessScore: 55, riskScore: 40, recommendation: "BUY",
  },
  {
    ticker: "JD", companyName: "JD.com Inc",
    exchange: "NASDAQ", isin: "US47215P1066", country: "China",
    sector: "Technology", theme: "Emerging Market Champions",
    ajBellStatus: "eligible", priceTicker: "JD", brokerSearchName: "JD.com ADR", currency: "USD",
    screeningStatus: "approved", screeningNotes: "All flags clear. Direct e-commerce + logistics. No interest-based finance as core. JD Finance spun off.",
    thesis: "China's largest direct e-commerce platform. Owns logistics infrastructure. Higher trust/quality positioning vs competitors.",
    attractivenessScore: 50, riskScore: 55, recommendation: "HOLD",
  },
  {
    ticker: "TCOM", companyName: "Trip.com Group",
    exchange: "NASDAQ", isin: "US89677Q1076", country: "China",
    sector: "Technology", theme: "Emerging Market Champions",
    ajBellStatus: "eligible", priceTicker: "TCOM", brokerSearchName: "Trip.com Group", currency: "USD",
    screeningStatus: "approved", screeningNotes: "All flags clear. Online travel platform. No prohibited exposure.",
    thesis: "China and Asia's largest online travel platform. Post-COVID travel recovery. International expansion accelerating.",
    attractivenessScore: 52, riskScore: 50, recommendation: "HOLD",
  },
  // ── WATCHLIST (Requires further screening) ─────────────────────────────────
  {
    ticker: "HDB", companyName: "HDFC Bank Limited",
    exchange: "NYSE", isin: "US40415F1012", country: "India",
    sector: "Financials", theme: "Emerging Market Champions",
    ajBellStatus: "eligible", priceTicker: "HDB", brokerSearchName: "HDFC Bank ADR", currency: "USD",
    screeningStatus: "watchlist", screeningNotes: "India's largest private bank. Interest income ratio requires AAOIFI analysis. Pending Q2 2025 data.",
    thesis: "India's highest-quality bank. 20%+ ROE. Digital-first approach. But conventional interest-based lending is core business.",
    attractivenessScore: 55, riskScore: 30, recommendation: "WATCHLIST",
  },
  {
    ticker: "GRAB", companyName: "Grab Holdings",
    exchange: "NASDAQ", isin: "US38413G2057", country: "Singapore",
    sector: "Technology", theme: "Emerging Market Champions",
    ajBellStatus: "eligible", priceTicker: "GRAB", brokerSearchName: "Grab Holdings", currency: "USD",
    screeningStatus: "watchlist", screeningNotes: "GrabFin lending products at 4.2% of revenue — approaching 5% threshold. Monitoring quarterly.",
    thesis: "SE Asia super-app. Ride-hailing + delivery + payments. GrabFin fintech growing. Needs lending ratio monitoring.",
    attractivenessScore: 45, riskScore: 50, recommendation: "WATCHLIST",
  },
  {
    ticker: "MELI", companyName: "MercadoLibre Inc",
    exchange: "NASDAQ", isin: "US58733R1023", country: "Argentina",
    sector: "Technology", theme: "Emerging Market Champions",
    ajBellStatus: "eligible", priceTicker: "MELI", brokerSearchName: "MercadoLibre", currency: "USD",
    screeningStatus: "watchlist", screeningNotes: "Mercado Credito lending at ~8% of revenue. Exceeds 5% threshold. Likely to be rejected unless lending is reduced.",
    thesis: "LatAm's largest e-commerce + fintech. Mercado Pago payments dominant. But Mercado Credito lending may fail screening.",
    attractivenessScore: 60, riskScore: 45, recommendation: "WATCHLIST",
  },
];

// ── Helpers ──────────────────────────────────────────────────────────────────

export function getApprovedEmergingMarkets(): EmergingMarketAsset[] {
  return EMERGING_MARKET_UNIVERSE.filter((a) => a.screeningStatus === "approved");
}

export function getBuyRecommendations(): EmergingMarketAsset[] {
  return EMERGING_MARKET_UNIVERSE.filter((a) => a.recommendation === "BUY" && a.ajBellStatus === "eligible");
}

export function getWatchlistAssets(): EmergingMarketAsset[] {
  return EMERGING_MARKET_UNIVERSE.filter((a) => a.screeningStatus === "watchlist");
}
