/**
 * Nür Capital — Static Mock Data
 * No API, no database. Hardcoded seed data for demo purposes.
 */

export interface Asset {
  ticker: string;
  companyName: string;
  assetType: "equity" | "etf";
  exchange: string;
  country: string;
  sector: string;
  industry: string;
  themes: string[];
  eligibilityStatus: "approved" | "watchlist" | "rejected";
  rejectionReasons?: string[];
  confidenceLevel: "high" | "medium" | "low";
  trendScore: number | null;
  momentumScore: number | null;
  currentPrice: number | null;
  marketRegime: "bullish" | "neutral" | "bearish" | "volatile" | null;
  riskRating: "low" | "moderate" | "elevated" | "high" | null;
  overallRisk: number | null;
  volatilityRisk: number | null;
  attractivenessScore: number | null;
  signal: "buy" | "hold" | "reduce" | "watchlist" | null;
  allocationSuggestion: number | null;
}

export const MOCK_ASSETS: Asset[] = [
  {
    ticker: "TSM",
    companyName: "Taiwan Semiconductor Manufacturing",
    assetType: "equity",
    exchange: "NYSE",
    country: "Taiwan",
    sector: "Technology",
    industry: "Semiconductors",
    themes: ["Semiconductors", "AI Infrastructure"],
    eligibilityStatus: "approved",
    confidenceLevel: "high",
    trendScore: 0.72,
    momentumScore: 0.58,
    currentPrice: 178.52,
    marketRegime: "bullish",
    riskRating: "moderate",
    overallRisk: 42,
    volatilityRisk: 38,
    attractivenessScore: 62.4,
    signal: "buy",
    allocationSuggestion: 25,
  },
  {
    ticker: "ASML",
    companyName: "ASML Holding",
    assetType: "equity",
    exchange: "EURONEXT",
    country: "Netherlands",
    sector: "Technology",
    industry: "Semiconductor Equipment",
    themes: ["Semiconductors"],
    eligibilityStatus: "approved",
    confidenceLevel: "high",
    trendScore: 0.61,
    momentumScore: 0.45,
    currentPrice: 924.3,
    marketRegime: "bullish",
    riskRating: "moderate",
    overallRisk: 45,
    volatilityRisk: 41,
    attractivenessScore: 55.8,
    signal: "buy",
    allocationSuggestion: 20,
  },
  {
    ticker: "HLAL",
    companyName: "Wahed FTSE USA Shariah ETF",
    assetType: "etf",
    exchange: "NASDAQ",
    country: "US",
    sector: "Multi-Sector",
    industry: "Sharia-Compliant ETF",
    themes: ["Halal Finance"],
    eligibilityStatus: "approved",
    confidenceLevel: "high",
    trendScore: 0.44,
    momentumScore: 0.38,
    currentPrice: 42.15,
    marketRegime: "neutral",
    riskRating: "low",
    overallRisk: 22,
    volatilityRisk: 18,
    attractivenessScore: 48.2,
    signal: "hold",
    allocationSuggestion: 30,
  },
  {
    ticker: "1211.HK",
    companyName: "BYD Company",
    assetType: "equity",
    exchange: "HKEX",
    country: "China",
    sector: "Consumer Discretionary",
    industry: "Electric Vehicles & Batteries",
    themes: ["Battery Technology", "Clean Energy"],
    eligibilityStatus: "approved",
    confidenceLevel: "medium",
    trendScore: 0.35,
    momentumScore: 0.29,
    currentPrice: 293.8,
    marketRegime: "neutral",
    riskRating: "elevated",
    overallRisk: 58,
    volatilityRisk: 52,
    attractivenessScore: 41.6,
    signal: "hold",
    allocationSuggestion: 15,
  },
  {
    ticker: "NVDA",
    companyName: "NVIDIA Corporation",
    assetType: "equity",
    exchange: "NASDAQ",
    country: "US",
    sector: "Technology",
    industry: "Semiconductors",
    themes: ["Semiconductors", "AI Infrastructure"],
    eligibilityStatus: "rejected",
    rejectionReasons: [
      "Israel exposure — R&D operations via Mellanox acquisition",
      "Fails hard exclusion rule: flag_israel_exposure",
    ],
    confidenceLevel: "high",
    trendScore: null,
    momentumScore: null,
    currentPrice: 135.4,
    marketRegime: null,
    riskRating: null,
    overallRisk: null,
    volatilityRisk: null,
    attractivenessScore: null,
    signal: null,
    allocationSuggestion: null,
  },
  {
    ticker: "BABA",
    companyName: "Alibaba Group",
    assetType: "equity",
    exchange: "NYSE",
    country: "China",
    sector: "Technology",
    industry: "E-Commerce",
    themes: ["AI Infrastructure"],
    eligibilityStatus: "watchlist",
    rejectionReasons: [
      "Under review — potential interest-based revenue exceeds 5% threshold",
    ],
    confidenceLevel: "low",
    trendScore: 0.22,
    momentumScore: 0.15,
    currentPrice: 82.6,
    marketRegime: "bearish",
    riskRating: "elevated",
    overallRisk: 62,
    volatilityRisk: 55,
    attractivenessScore: 28.4,
    signal: "watchlist",
    allocationSuggestion: null,
  },
  {
    ticker: "MSFT",
    companyName: "Microsoft Corporation",
    assetType: "equity",
    exchange: "NASDAQ",
    country: "US",
    sector: "Technology",
    industry: "Software",
    themes: ["AI Infrastructure", "Cybersecurity"],
    eligibilityStatus: "rejected",
    rejectionReasons: [
      "Israel exposure — significant operations in Israel (Azure, R&D centres)",
      "Fails hard exclusion rule: flag_israel_exposure",
    ],
    confidenceLevel: "high",
    trendScore: null,
    momentumScore: null,
    currentPrice: 425.2,
    marketRegime: null,
    riskRating: null,
    overallRisk: null,
    volatilityRisk: null,
    attractivenessScore: null,
    signal: null,
    allocationSuggestion: null,
  },
];

export interface Theme {
  name: string;
  category: string;
  icon: string;
  description: string;
  assetCount: number;
}

export const MOCK_THEMES: Theme[] = [
  { name: "Semiconductors", category: "technology", icon: "⚡", description: "Chip design, fabrication, and equipment", assetCount: 3 },
  { name: "AI Infrastructure", category: "technology", icon: "🧠", description: "Cloud, data centres, AI hardware/software", assetCount: 2 },
  { name: "Battery Technology", category: "technology", icon: "🔋", description: "Battery manufacturing and energy storage", assetCount: 1 },
  { name: "Clean Energy", category: "energy", icon: "☀️", description: "Solar, wind, hydrogen, renewables", assetCount: 1 },
  { name: "Halal Finance", category: "finance", icon: "🕌", description: "Sharia-compliant financial services", assetCount: 1 },
  { name: "Cybersecurity", category: "technology", icon: "🔒", description: "Network security, identity, threat detection", assetCount: 0 },
  { name: "Healthcare", category: "healthcare", icon: "🧬", description: "Pharma, biotech, medical devices", assetCount: 0 },
  { name: "Consumer Staples", category: "consumer", icon: "🛒", description: "Essential goods, food, household", assetCount: 0 },
];

export interface PortfolioSuggestion {
  ticker: string;
  companyName: string;
  signal: "buy" | "hold" | "reduce" | "watchlist";
  allocation: number;
  reason: string;
  riskProfile: "conservative" | "balanced" | "growth" | "aggressive";
}

export const MOCK_PORTFOLIO: PortfolioSuggestion[] = [
  {
    ticker: "TSM",
    companyName: "Taiwan Semiconductor",
    signal: "buy",
    allocation: 25,
    reason: "Strong trend + momentum. Leading foundry with AI tailwinds.",
    riskProfile: "growth",
  },
  {
    ticker: "ASML",
    companyName: "ASML Holding",
    signal: "buy",
    allocation: 20,
    reason: "Monopoly in EUV lithography. Secular growth in chip demand.",
    riskProfile: "growth",
  },
  {
    ticker: "HLAL",
    companyName: "Wahed FTSE USA Shariah ETF",
    signal: "hold",
    allocation: 30,
    reason: "Core Sharia-compliant US equity exposure. Low volatility anchor.",
    riskProfile: "balanced",
  },
  {
    ticker: "1211.HK",
    companyName: "BYD Company",
    signal: "hold",
    allocation: 15,
    reason: "EV + battery leader. Higher geopolitical risk offsets strong fundamentals.",
    riskProfile: "aggressive",
  },
];
