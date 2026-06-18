/**
 * Nür Capital — Asset Identity Layer
 *
 * Every recommended asset must be identifiable on AJ Bell.
 * Non-AJ Bell assets are marked and excluded from active BUY recommendations.
 */

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
  priceTicker: string; // Ticker used for Yahoo Finance pricing
}

export const ASSET_IDENTITIES: Record<string, AssetIdentity> = {
  // ── AJ Bell Actionable (eligible for BUY recommendations) ──────────────────
  TSM: {
    ticker: "TSM", companyName: "Taiwan Semiconductor Manufacturing Company",
    exchange: "NYSE", isin: "US8740391003", assetType: "Equity",
    brokerSearchName: "Taiwan Semiconductor Manufacturing ADR",
    currency: "USD", country: "Taiwan", ajBellActionable: true, priceTicker: "TSM",
  },
  ASML: {
    ticker: "ASML", companyName: "ASML Holding NV",
    exchange: "NASDAQ", isin: "USN070592100", assetType: "Equity",
    brokerSearchName: "ASML Holding",
    currency: "USD", country: "Netherlands", ajBellActionable: true, priceTicker: "ASML",
  },
  LLY: {
    ticker: "LLY", companyName: "Eli Lilly and Company",
    exchange: "NYSE", isin: "US5324571083", assetType: "Equity",
    brokerSearchName: "Eli Lilly",
    currency: "USD", country: "US", ajBellActionable: true, priceTicker: "LLY",
  },
  CRWD: {
    ticker: "CRWD", companyName: "CrowdStrike Holdings Inc",
    exchange: "NASDAQ", isin: "US22788C1053", assetType: "Equity",
    brokerSearchName: "CrowdStrike Holdings",
    currency: "USD", country: "US", ajBellActionable: true, priceTicker: "CRWD",
  },
  AMD: {
    ticker: "AMD", companyName: "Advanced Micro Devices Inc",
    exchange: "NASDAQ", isin: "US0079031078", assetType: "Equity",
    brokerSearchName: "Advanced Micro Devices",
    currency: "USD", country: "US", ajBellActionable: true, priceTicker: "AMD",
  },
  AVGO: {
    ticker: "AVGO", companyName: "Broadcom Inc",
    exchange: "NASDAQ", isin: "US11135F1012", assetType: "Equity",
    brokerSearchName: "Broadcom",
    currency: "USD", country: "US", ajBellActionable: true, priceTicker: "AVGO",
  },
  PANW: {
    ticker: "PANW", companyName: "Palo Alto Networks Inc",
    exchange: "NASDAQ", isin: "US6974351057", assetType: "Equity",
    brokerSearchName: "Palo Alto Networks",
    currency: "USD", country: "US", ajBellActionable: true, priceTicker: "PANW",
  },
  NVO: {
    ticker: "NVO", companyName: "Novo Nordisk A/S (ADR)",
    exchange: "NYSE", isin: "US6701002056", assetType: "Equity",
    brokerSearchName: "Novo Nordisk ADR",
    currency: "USD", country: "Denmark", ajBellActionable: true, priceTicker: "NVO",
  },
  ABB: {
    ticker: "ABB", companyName: "ABB Ltd",
    exchange: "NYSE", isin: "CH0012221716", assetType: "Equity",
    brokerSearchName: "ABB Ltd",
    currency: "USD", country: "Switzerland", ajBellActionable: true, priceTicker: "ABB",
  },
  ENPH: {
    ticker: "ENPH", companyName: "Enphase Energy Inc",
    exchange: "NASDAQ", isin: "US29355A1079", assetType: "Equity",
    brokerSearchName: "Enphase Energy",
    currency: "USD", country: "US", ajBellActionable: true, priceTicker: "ENPH",
  },
  // ── Research-only (NOT AJ Bell actionable) ─────────────────────────────────
  HLAL: {
    ticker: "HLAL", companyName: "Wahed FTSE USA Shariah ETF",
    exchange: "NASDAQ", isin: "US92790R1041", assetType: "ETF",
    brokerSearchName: "Wahed FTSE USA Shariah ETF",
    currency: "USD", country: "US", ajBellActionable: false, priceTicker: "HLAL",
  },
  "2222.SR": {
    ticker: "2222.SR", companyName: "Saudi Arabian Oil Company (Aramco)",
    exchange: "TADAWUL", isin: "SA14TG012N13", assetType: "Equity",
    brokerSearchName: "Saudi Aramco",
    currency: "SAR", country: "Saudi Arabia", ajBellActionable: false, priceTicker: "2222.SR",
  },
  "1211.HK": {
    ticker: "1211.HK", companyName: "BYD Company Limited",
    exchange: "HKEX", isin: "CNE100000296", assetType: "Equity",
    brokerSearchName: "BYD Company",
    currency: "HKD", country: "China", ajBellActionable: false, priceTicker: "1211.HK",
  },
};

export function getAssetIdentity(ticker: string): AssetIdentity | undefined {
  return ASSET_IDENTITIES[ticker];
}

export function getAjBellActionableAssets(): AssetIdentity[] {
  return Object.values(ASSET_IDENTITIES).filter((a) => a.ajBellActionable);
}
