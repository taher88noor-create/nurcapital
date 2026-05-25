// ============================================
// Nür Capital — Canonical Asset Model Types
// Mirrors database/schema.sql
// ============================================

// ── Enums ────────────────────────────────────────────────────────────────────

export type AssetType = "equity" | "etf" | "fund" | "sukuk" | "reit";
export type EligibilityStatus = "approved" | "watchlist" | "rejected";
export type ConfidenceLevel = "high" | "medium" | "low";
export type TagSource = "manual" | "rule_based" | "ai_assisted";
export type MarketRegime = "bullish" | "neutral" | "bearish" | "volatile";
export type RiskRating = "low" | "moderate" | "elevated" | "high";
export type Signal = "buy" | "hold" | "reduce" | "watchlist";
export type RiskProfile = "conservative" | "balanced" | "growth" | "aggressive";
export type ThemeCategory = "technology" | "energy" | "finance" | "industrial" | "healthcare" | "consumer";

// ── Core Asset ───────────────────────────────────────────────────────────────

export interface Asset {
  id: string;
  ticker: string;
  company_name: string;
  asset_type: AssetType;
  exchange: string;
  country: string;
  sector: string | null;
  industry: string | null;
  description: string | null;
  website: string | null;
  market_cap: number | null;
  currency: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// ── Eligibility ──────────────────────────────────────────────────────────────

export interface Eligibility {
  id: string;
  asset_id: string;
  status: EligibilityStatus;
  flag_gambling: boolean;
  flag_alcohol: boolean;
  flag_interest_finance: boolean;
  flag_israel_exposure: boolean;
  flag_weapons: boolean;
  flag_adult: boolean;
  flag_prohibited_structure: boolean;
  rejection_reasons: string[];
  review_required: boolean;
  review_notes: string | null;
  reviewer: string | null;
  confidence_level: ConfidenceLevel;
  is_override: boolean;
  override_reason: string | null;
  reviewed_at: string;
  updated_at: string;
}

// ── Themes ───────────────────────────────────────────────────────────────────

export interface Theme {
  id: string;
  name: string;
  category: ThemeCategory;
  description: string | null;
  icon: string | null;
  is_active: boolean;
  created_at: string;
}

export interface AssetTheme {
  id: string;
  asset_id: string;
  theme_id: string;
  source: TagSource;
  confidence: number;
  assigned_by: string | null;
  assigned_at: string;
}

// ── Price History ────────────────────────────────────────────────────────────

export interface PriceBar {
  id: string;
  asset_id: string;
  date: string;
  open: number | null;
  high: number | null;
  low: number | null;
  close: number;
  volume: number | null;
}

// ── Trend Scores ─────────────────────────────────────────────────────────────

export interface TrendScore {
  id: string;
  asset_id: string;
  current_price: number | null;
  moving_average_50: number | null;
  moving_average_200: number | null;
  trend_score: number | null;
  momentum_score: number | null;
  relative_strength: number | null;
  volatility_score: number | null;
  market_regime: MarketRegime | null;
  average_volume: number | null;
  updated_at: string;
}

// ── Risk Scores ──────────────────────────────────────────────────────────────

export interface RiskScore {
  id: string;
  asset_id: string;
  volatility_risk: number | null;
  drawdown_risk: number | null;
  concentration_risk: number | null;
  liquidity_risk: number | null;
  geopolitical_risk: number | null;
  overall_risk: number | null;
  risk_rating: RiskRating | null;
  updated_at: string;
}

// ── Portfolio Status ─────────────────────────────────────────────────────────

export interface PortfolioStatus {
  id: string;
  asset_id: string;
  signal: Signal;
  suggested_allocation: number | null;
  attractiveness_score: number | null;
  allocation_reason: string | null;
  risk_profile: RiskProfile;
  generated_at: string;
}

// ── Audit Log ────────────────────────────────────────────────────────────────

export interface AuditEntry {
  id: string;
  asset_id: string | null;
  action: string;
  actor: string;
  old_value: Record<string, unknown> | null;
  new_value: Record<string, unknown> | null;
  reason: string | null;
  created_at: string;
}

// ── Canonical Asset (denormalized API response) ──────────────────────────────

export interface CanonicalAsset extends Asset {
  eligibility: Eligibility | null;
  themes: (Theme & { confidence: number })[];
  trend: TrendScore | null;
  risk: RiskScore | null;
  portfolio: PortfolioStatus | null;
  latest_price: PriceBar | null;
}
