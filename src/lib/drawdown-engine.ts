/**
 * Nür Capital — Drawdown Engine
 *
 * Reusable utility for calculating portfolio drawdowns,
 * opportunity classification, and health checks.
 * Read-only consumer of asset/price data.
 */

export type OpportunityTier = "tactical" | "structural" | "none";

export interface DrawdownResult {
  ticker: string;
  name: string;
  currentPrice: number;
  high52w: number;
  pctDrop: number;
  tier: OpportunityTier;
  daysSinceHigh: number;
  volumeSpikeRatio: number;
}

export interface HealthCheck {
  maSupport: boolean;
  maSupportNote: string;
  shariahGuard: boolean;
  shariahGuardNote: string;
  moatStatus: boolean;
  moatStatusNote: string;
}

/**
 * Calculate drawdown from 52-week high
 */
export function calculateDrawdown(currentPrice: number, high52w: number): { pctDrop: number; tier: OpportunityTier } {
  if (high52w <= 0 || currentPrice <= 0) return { pctDrop: 0, tier: "none" };
  const pctDrop = ((high52w - currentPrice) / high52w) * 100;
  const tier = classifyOpportunity(pctDrop);
  return { pctDrop: Math.round(pctDrop * 10) / 10, tier };
}

/**
 * Classify opportunity tier based on drawdown percentage
 */
export function classifyOpportunity(pctDrop: number): OpportunityTier {
  if (pctDrop >= 20) return "structural";
  if (pctDrop >= 10) return "tactical";
  return "none";
}

/**
 * Generate health check for a drawn-down asset (mock/deterministic)
 */
export function generateHealthCheck(ticker: string, pctDrop: number): HealthCheck {
  // Deterministic seed from ticker
  let seed = 0;
  for (let i = 0; i < ticker.length; i++) seed += ticker.charCodeAt(i);

  const maSupport = pctDrop < 25 && seed % 3 !== 0;
  const shariahGuard = pctDrop < 30;
  const moatStatus = seed % 4 !== 0;

  return {
    maSupport,
    maSupportNote: maSupport
      ? "Price stabilizing near MA200 support zone. Historical bounce probability elevated."
      : "Price has broken below MA200. Extended downtrend — higher risk of continued decline.",
    shariahGuard,
    shariahGuardNote: shariahGuard
      ? "Market cap decline has not pushed debt/equity ratios beyond 33% compliance threshold."
      : "Warning: Declining market cap may push leverage ratios toward Shariah compliance limits.",
    moatStatus,
    moatStatusNote: moatStatus
      ? "Core revenue streams and competitive advantages remain intact despite share price decline."
      : "Caution: Revenue metrics showing deterioration alongside price decline. Thesis under pressure.",
  };
}

/**
 * Generate mock 52-week high and volume data for conviction list assets
 * (deterministic from ticker — will be replaced with real data when connected)
 */
export function generateMockMarketData(ticker: string, signalPrice: number) {
  let seed = 0;
  for (let i = 0; i < ticker.length; i++) seed += ticker.charCodeAt(i);

  // 52w high is 5-40% above signal price (deterministic)
  const highPremium = 1.05 + (seed % 35) / 100;
  const high52w = Math.round(signalPrice * highPremium * 100) / 100;

  // Current price varies from signal (some up, some down)
  const priceVariation = 0.85 + (((seed * 7) % 30) / 100);
  const currentPrice = Math.round(signalPrice * priceVariation * 100) / 100;

  // Days since high (10-180 days)
  const daysSinceHigh = 10 + (seed % 170);

  // Volume spike ratio (0.5x to 3x normal)
  const volumeSpikeRatio = Math.round((0.5 + ((seed * 3) % 25) / 10) * 10) / 10;

  return { high52w, currentPrice, daysSinceHigh, volumeSpikeRatio };
}
