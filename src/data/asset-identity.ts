/**
 * Nür Capital — Asset Identity Layer
 *
 * AJ Bell Eligibility Framework:
 * - eligible: Available on AJ Bell, reliable pricing, valid ISIN. Can receive BUY ratings.
 * - research_only: Passes screening, interesting thesis, but not AJ Bell actionable.
 * - unsupported: Cannot be validated, no reliable pricing.
 *
 * Only "eligible" assets may receive BUY recommendations or appear in performance stats.
 */

export type AjBellStatus = "eligible" | "research_only" | "unsupported";

export interface AssetIdentity {
  ticker: string;
  companyName: string;
  exchange: string;
  isin: string;
  assetType: "Equity" | "ETF" | "Fund";
  brokerSearchName: string;
  currency: string;
  country: string;
  ajBellActionable: boolean;
  ajBellStatus: AjBellStatus;
  priceTicker: string;
  statusReason: string;
}

export const ASSET_IDENTITIES: Record<string, AssetIdentity> = {
  // ── Recommendation Eligible (AJ Bell actionable, reliable pricing) ─────────
  TSM: {
    ticker: "TSM", companyName: "Taiwan Semiconductor Manufacturing Company",
    exchange: "NYSE", isin: "US8740391003", assetType: "Equity",
    brokerSearchName: "Taiwan Semiconductor Manufacturing ADR",
    currency: "USD", country: "Taiwan", ajBellActionable: true,
    ajBellStatus: "eligible", priceTicker: "TSM",
    statusReason: "NYSE-listed ADR. Available on AJ Bell. Reliable Yahoo Finance pricing.",
  },
  ASML: {
    ticker: "ASML", companyName: "ASML Holding NV",
    exchange: "NASDAQ", isin: "USN070592100", assetType: "Equity",
    brokerSearchName: "ASML Holding",
    currency: "USD", country: "Netherlands", ajBellActionable: true,
    ajBellStatus: "eligible", priceTicker: "ASML",
    statusReason: "NASDAQ-listed. Available on AJ Bell. Reliable Yahoo Finance pricing.",
  },
  LLY: {
    ticker: "LLY", companyName: "Eli Lilly and Company",
    exchange: "NYSE", isin: "US5324571083", assetType: "Equity",
    brokerSearchName: "Eli Lilly",
    currency: "USD", country: "US", ajBellActionable: true,
    ajBellStatus: "eligible", priceTicker: "LLY",
    statusReason: "NYSE-listed US equity. Available on AJ Bell. Reliable Yahoo Finance pricing.",
  },
  CRWD: {
    ticker: "CRWD", companyName: "CrowdStrike Holdings Inc",
    exchange: "NASDAQ", isin: "US22788C1053", assetType: "Equity",
    brokerSearchName: "CrowdStrike Holdings",
    currency: "USD", country: "US", ajBellActionable: true,
    ajBellStatus: "eligible", priceTicker: "CRWD",
    statusReason: "NASDAQ-listed US equity. Available on AJ Bell. Reliable Yahoo Finance pricing.",
  },
  AMD: {
    ticker: "AMD", companyName: "Advanced Micro Devices Inc",
    exchange: "NASDAQ", isin: "US0079031078", assetType: "Equity",
    brokerSearchName: "Advanced Micro Devices",
    currency: "USD", country: "US", ajBellActionable: true,
    ajBellStatus: "eligible", priceTicker: "AMD",
    statusReason: "NASDAQ-listed US equity. Available on AJ Bell. Reliable Yahoo Finance pricing.",
  },
  AVGO: {
    ticker: "AVGO", companyName: "Broadcom Inc",
    exchange: "NASDAQ", isin: "US11135F1012", assetType: "Equity",
    brokerSearchName: "Broadcom",
    currency: "USD", country: "US", ajBellActionable: true,
    ajBellStatus: "eligible", priceTicker: "AVGO",
    statusReason: "NASDAQ-listed US equity. Available on AJ Bell. Reliable Yahoo Finance pricing.",
  },
  PANW: {
    ticker: "PANW", companyName: "Palo Alto Networks Inc",
    exchange: "NASDAQ", isin: "US6974351057", assetType: "Equity",
    brokerSearchName: "Palo Alto Networks",
    currency: "USD", country: "US", ajBellActionable: true,
    ajBellStatus: "eligible", priceTicker: "PANW",
    statusReason: "NASDAQ-listed US equity. Available on AJ Bell. Reliable Yahoo Finance pricing.",
  },
  NVO: {
    ticker: "NVO", companyName: "Novo Nordisk A/S (ADR)",
    exchange: "NYSE", isin: "US6701002056", assetType: "Equity",
    brokerSearchName: "Novo Nordisk ADR",
    currency: "USD", country: "Denmark", ajBellActionable: true,
    ajBellStatus: "eligible", priceTicker: "NVO",
    statusReason: "NYSE-listed ADR. Available on AJ Bell. Reliable Yahoo Finance pricing.",
  },
  ABB: {
    ticker: "ABB", companyName: "ABB Ltd",
    exchange: "NYSE", isin: "CH0012221716", assetType: "Equity",
    brokerSearchName: "ABB Ltd",
    currency: "USD", country: "Switzerland", ajBellActionable: true,
    ajBellStatus: "eligible", priceTicker: "ABB",
    statusReason: "NYSE-listed. Available on AJ Bell. Reliable Yahoo Finance pricing.",
  },
  ENPH: {
    ticker: "ENPH", companyName: "Enphase Energy Inc",
    exchange: "NASDAQ", isin: "US29355A1079", assetType: "Equity",
    brokerSearchName: "Enphase Energy",
    currency: "USD", country: "US", ajBellActionable: true,
    ajBellStatus: "eligible", priceTicker: "ENPH",
    statusReason: "NASDAQ-listed US equity. Available on AJ Bell. Reliable Yahoo Finance pricing.",
  },
  // ── Research Only (Not AJ Bell actionable) ─────────────────────────────────
  HLAL: {
    ticker: "HLAL", companyName: "Wahed FTSE USA Shariah ETF",
    exchange: "NASDAQ", isin: "US92790R1041", assetType: "ETF",
    brokerSearchName: "Wahed FTSE USA Shariah ETF",
    currency: "USD", country: "US", ajBellActionable: false,
    ajBellStatus: "research_only", priceTicker: "HLAL",
    statusReason: "Niche US Shariah ETF. Not typically available on AJ Bell. Pricing reliable but not actionable for UK investors.",
  },
  "2222.SR": {
    ticker: "2222.SR", companyName: "Saudi Arabian Oil Company (Aramco)",
    exchange: "TADAWUL", isin: "SA14TG012N13", assetType: "Equity",
    brokerSearchName: "Saudi Aramco",
    currency: "SAR", country: "Saudi Arabia", ajBellActionable: false,
    ajBellStatus: "research_only", priceTicker: "2222.SR",
    statusReason: "TADAWUL-listed (Saudi exchange). Not available on AJ Bell. Yahoo Finance pricing unreliable for this ticker.",
  },
  "1211.HK": {
    ticker: "1211.HK", companyName: "BYD Company Limited",
    exchange: "HKEX", isin: "CNE100000296", assetType: "Equity",
    brokerSearchName: "BYD Company",
    currency: "HKD", country: "China", ajBellActionable: false,
    ajBellStatus: "research_only", priceTicker: "1211.HK",
    statusReason: "HKEX-listed. Limited AJ Bell availability. Yahoo Finance pricing may be unreliable.",
  },
};

export function getAssetIdentity(ticker: string): AssetIdentity | undefined {
  return ASSET_IDENTITIES[ticker];
}

export function getAjBellActionableAssets(): AssetIdentity[] {
  return Object.values(ASSET_IDENTITIES).filter((a) => a.ajBellStatus === "eligible");
}

export function getResearchOnlyAssets(): AssetIdentity[] {
  return Object.values(ASSET_IDENTITIES).filter((a) => a.ajBellStatus === "research_only");
}

export function isRecommendationEligible(ticker: string): boolean {
  const asset = ASSET_IDENTITIES[ticker];
  return asset?.ajBellStatus === "eligible";
}
