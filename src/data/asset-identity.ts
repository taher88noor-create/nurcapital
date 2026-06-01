/**
 * Nür Capital — Asset Identity Layer
 *
 * Ensures every recommended asset can be located on AJ Bell
 * and other UK investment platforms.
 *
 * No broker integration. No trading functionality.
 * Identification and searchability only.
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
}

export const ASSET_IDENTITIES: Record<string, AssetIdentity> = {
  TSM: {
    ticker: "TSM",
    companyName: "Taiwan Semiconductor Manufacturing Company",
    exchange: "NYSE",
    isin: "US8740391003",
    assetType: "Equity",
    brokerSearchName: "Taiwan Semiconductor Manufacturing ADR",
    currency: "USD",
    country: "Taiwan",
  },
  ASML: {
    ticker: "ASML",
    companyName: "ASML Holding NV",
    exchange: "EURONEXT / NASDAQ",
    isin: "USN070592100",
    assetType: "Equity",
    brokerSearchName: "ASML Holding",
    currency: "EUR / USD",
    country: "Netherlands",
  },
  LLY: {
    ticker: "LLY",
    companyName: "Eli Lilly and Company",
    exchange: "NYSE",
    isin: "US5324571083",
    assetType: "Equity",
    brokerSearchName: "Eli Lilly",
    currency: "USD",
    country: "US",
  },
  CRWD: {
    ticker: "CRWD",
    companyName: "CrowdStrike Holdings Inc",
    exchange: "NASDAQ",
    isin: "US22788C1053",
    assetType: "Equity",
    brokerSearchName: "CrowdStrike Holdings",
    currency: "USD",
    country: "US",
  },
  AMD: {
    ticker: "AMD",
    companyName: "Advanced Micro Devices Inc",
    exchange: "NASDAQ",
    isin: "US0079031078",
    assetType: "Equity",
    brokerSearchName: "Advanced Micro Devices",
    currency: "USD",
    country: "US",
  },
  AVGO: {
    ticker: "AVGO",
    companyName: "Broadcom Inc",
    exchange: "NASDAQ",
    isin: "US11135F1012",
    assetType: "Equity",
    brokerSearchName: "Broadcom",
    currency: "USD",
    country: "US",
  },
  PANW: {
    ticker: "PANW",
    companyName: "Palo Alto Networks Inc",
    exchange: "NASDAQ",
    isin: "US6974351057",
    assetType: "Equity",
    brokerSearchName: "Palo Alto Networks",
    currency: "USD",
    country: "US",
  },
  HLAL: {
    ticker: "HLAL",
    companyName: "Wahed FTSE USA Shariah ETF",
    exchange: "NASDAQ",
    isin: "US92790R1041",
    assetType: "ETF",
    brokerSearchName: "Wahed FTSE USA Shariah ETF",
    currency: "USD",
    country: "US",
  },
  "2222.SR": {
    ticker: "2222.SR",
    companyName: "Saudi Arabian Oil Company (Aramco)",
    exchange: "TADAWUL",
    isin: "SA14TG012N13",
    assetType: "Equity",
    brokerSearchName: "Saudi Aramco",
    currency: "SAR",
    country: "Saudi Arabia",
  },
  ABB: {
    ticker: "ABB",
    companyName: "ABB Ltd",
    exchange: "NYSE / SIX",
    isin: "CH0012221716",
    assetType: "Equity",
    brokerSearchName: "ABB Ltd",
    currency: "CHF / USD",
    country: "Switzerland",
  },
  "NOVO-B": {
    ticker: "NOVO-B",
    companyName: "Novo Nordisk A/S",
    exchange: "CPH / NYSE (NVO)",
    isin: "DK0062498333",
    assetType: "Equity",
    brokerSearchName: "Novo Nordisk",
    currency: "DKK / USD",
    country: "Denmark",
  },
  ENPH: {
    ticker: "ENPH",
    companyName: "Enphase Energy Inc",
    exchange: "NASDAQ",
    isin: "US29355A1079",
    assetType: "Equity",
    brokerSearchName: "Enphase Energy",
    currency: "USD",
    country: "US",
  },
  SPUS: {
    ticker: "SPUS",
    companyName: "SP Funds S&P 500 Sharia Industry Exclusions ETF",
    exchange: "NYSE",
    isin: "US78463X8719",
    assetType: "ETF",
    brokerSearchName: "SP Funds S&P 500 Sharia ETF",
    currency: "USD",
    country: "US",
  },
  "1211.HK": {
    ticker: "1211.HK",
    companyName: "BYD Company Limited",
    exchange: "HKEX",
    isin: "CNE100000296",
    assetType: "Equity",
    brokerSearchName: "BYD Company",
    currency: "HKD",
    country: "China",
  },
};

/**
 * Get asset identity by ticker. Returns undefined if not found.
 */
export function getAssetIdentity(ticker: string): AssetIdentity | undefined {
  return ASSET_IDENTITIES[ticker];
}
