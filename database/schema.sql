-- ============================================
-- Nür Capital — Canonical Database Schema v2
-- Ethical Investment Intelligence Engine
-- ============================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ──────────────────────────────────────────────
-- 1. ASSETS (canonical master)
-- ──────────────────────────────────────────────

CREATE TABLE assets (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ticker        VARCHAR(20) NOT NULL UNIQUE,
  company_name  VARCHAR(255) NOT NULL,
  asset_type    VARCHAR(20) NOT NULL CHECK (asset_type IN ('equity','etf','fund','sukuk','reit')),
  exchange      VARCHAR(50) NOT NULL,
  country       VARCHAR(100) NOT NULL,
  sector        VARCHAR(100),
  industry      VARCHAR(150),
  description   TEXT,
  website       VARCHAR(500),
  market_cap    BIGINT,
  currency      VARCHAR(10) NOT NULL DEFAULT 'USD',
  is_active     BOOLEAN NOT NULL DEFAULT true,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ──────────────────────────────────────────────
-- 2. ELIGIBILITY (hard exclusion results)
-- ──────────────────────────────────────────────

CREATE TABLE eligibility (
  id                      UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  asset_id                UUID NOT NULL UNIQUE REFERENCES assets(id) ON DELETE CASCADE,
  status                  VARCHAR(20) NOT NULL CHECK (status IN ('approved','watchlist','rejected')),
  flag_gambling           BOOLEAN NOT NULL DEFAULT false,
  flag_alcohol            BOOLEAN NOT NULL DEFAULT false,
  flag_interest_finance   BOOLEAN NOT NULL DEFAULT false,
  flag_israel_exposure    BOOLEAN NOT NULL DEFAULT false,
  flag_weapons            BOOLEAN NOT NULL DEFAULT false,
  flag_adult              BOOLEAN NOT NULL DEFAULT false,
  flag_prohibited_structure BOOLEAN NOT NULL DEFAULT false,
  rejection_reasons       TEXT[],
  review_required         BOOLEAN NOT NULL DEFAULT false,
  review_notes            TEXT,
  reviewer                VARCHAR(100),
  confidence_level        VARCHAR(10) NOT NULL DEFAULT 'high' CHECK (confidence_level IN ('high','medium','low')),
  is_override             BOOLEAN NOT NULL DEFAULT false,
  override_reason         TEXT,
  reviewed_at             TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at              TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ──────────────────────────────────────────────
-- 3. THEMES
-- ──────────────────────────────────────────────

CREATE TABLE themes (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name        VARCHAR(100) NOT NULL UNIQUE,
  category    VARCHAR(50) NOT NULL,
  description TEXT,
  icon        VARCHAR(10),
  is_active   BOOLEAN NOT NULL DEFAULT true,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO themes (name, category, description, icon) VALUES
  ('Semiconductors', 'technology', 'Chip design, fabrication, and equipment', '⚡'),
  ('AI Infrastructure', 'technology', 'Cloud, data centres, AI hardware/software', '🧠'),
  ('Cybersecurity', 'technology', 'Network security, identity, threat detection', '🔒'),
  ('Industrial Automation', 'industrial', 'Robotics, factory automation, IoT', '⚙️'),
  ('Robotics', 'industrial', 'Autonomous systems and robotic platforms', '🤖'),
  ('Battery Technology', 'technology', 'Battery manufacturing and energy storage', '🔋'),
  ('Clean Energy', 'energy', 'Solar, wind, hydrogen, renewables', '☀️'),
  ('Oil & Gas', 'energy', 'Upstream, midstream, downstream energy', '🛢️'),
  ('Energy Infrastructure', 'energy', 'Grid, utilities, transmission', '🏗️'),
  ('Halal Finance', 'finance', 'Sharia-compliant financial services', '🕌'),
  ('Islamic Banking', 'finance', 'Islamic banking institutions', '🏦'),
  ('Healthcare', 'healthcare', 'Pharma, biotech, medical devices', '🧬'),
  ('Manufacturing', 'industrial', 'Industrial manufacturing and production', '🏭'),
  ('Logistics', 'industrial', 'Supply chain, shipping, transport', '🚛'),
  ('Consumer Staples', 'consumer', 'Essential goods, food, household', '🛒');

-- ──────────────────────────────────────────────
-- 4. ASSET-THEMES (many-to-many)
-- ──────────────────────────────────────────────

CREATE TABLE asset_themes (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  asset_id    UUID NOT NULL REFERENCES assets(id) ON DELETE CASCADE,
  theme_id    UUID NOT NULL REFERENCES themes(id) ON DELETE CASCADE,
  source      VARCHAR(20) NOT NULL DEFAULT 'manual' CHECK (source IN ('manual','rule_based','ai_assisted')),
  confidence  DECIMAL(3,2) DEFAULT 1.0 CHECK (confidence >= 0 AND confidence <= 1),
  assigned_by VARCHAR(100),
  assigned_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(asset_id, theme_id)
);

-- ──────────────────────────────────────────────
-- 5. PRICE HISTORY (daily OHLCV)
-- ──────────────────────────────────────────────

CREATE TABLE price_history (
  id        UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  asset_id  UUID NOT NULL REFERENCES assets(id) ON DELETE CASCADE,
  date      DATE NOT NULL,
  open      DECIMAL(12,4),
  high      DECIMAL(12,4),
  low       DECIMAL(12,4),
  close     DECIMAL(12,4) NOT NULL,
  volume    BIGINT,
  UNIQUE(asset_id, date)
);

-- ──────────────────────────────────────────────
-- 6. TREND SCORES
-- ──────────────────────────────────────────────

CREATE TABLE trend_scores (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  asset_id            UUID NOT NULL UNIQUE REFERENCES assets(id) ON DELETE CASCADE,
  current_price       DECIMAL(12,4),
  moving_average_50   DECIMAL(12,4),
  moving_average_200  DECIMAL(12,4),
  trend_score         DECIMAL(5,2) CHECK (trend_score >= -100 AND trend_score <= 100),
  momentum_score      DECIMAL(5,2) CHECK (momentum_score >= -100 AND momentum_score <= 100),
  relative_strength   DECIMAL(5,2),
  volatility_score    DECIMAL(5,2) CHECK (volatility_score >= 0 AND volatility_score <= 100),
  market_regime       VARCHAR(20) CHECK (market_regime IN ('bullish','neutral','bearish','volatile')),
  average_volume      BIGINT,
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ──────────────────────────────────────────────
-- 7. RISK SCORES
-- ──────────────────────────────────────────────

CREATE TABLE risk_scores (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  asset_id            UUID NOT NULL UNIQUE REFERENCES assets(id) ON DELETE CASCADE,
  volatility_risk     DECIMAL(5,2) CHECK (volatility_risk >= 0 AND volatility_risk <= 100),
  drawdown_risk       DECIMAL(5,2) CHECK (drawdown_risk >= 0 AND drawdown_risk <= 100),
  concentration_risk  DECIMAL(5,2) CHECK (concentration_risk >= 0 AND concentration_risk <= 100),
  liquidity_risk      DECIMAL(5,2) CHECK (liquidity_risk >= 0 AND liquidity_risk <= 100),
  geopolitical_risk   DECIMAL(5,2) CHECK (geopolitical_risk >= 0 AND geopolitical_risk <= 100),
  overall_risk        DECIMAL(5,2) CHECK (overall_risk >= 0 AND overall_risk <= 100),
  risk_rating         VARCHAR(20) CHECK (risk_rating IN ('low','moderate','elevated','high')),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ──────────────────────────────────────────────
-- 8. PORTFOLIO STATUS
-- ──────────────────────────────────────────────

CREATE TABLE portfolio_status (
  id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  asset_id              UUID NOT NULL REFERENCES assets(id) ON DELETE CASCADE,
  signal                VARCHAR(20) NOT NULL CHECK (signal IN ('buy','hold','reduce','watchlist')),
  suggested_allocation  DECIMAL(5,2) CHECK (suggested_allocation >= 0 AND suggested_allocation <= 100),
  attractiveness_score  DECIMAL(5,2),
  allocation_reason     TEXT,
  risk_profile          VARCHAR(20) NOT NULL CHECK (risk_profile IN ('conservative','balanced','growth','aggressive')),
  generated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ──────────────────────────────────────────────
-- 9. AUDIT LOG (append-only)
-- ──────────────────────────────────────────────

CREATE TABLE audit_log (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  asset_id    UUID REFERENCES assets(id) ON DELETE SET NULL,
  action      VARCHAR(50) NOT NULL,
  actor       VARCHAR(100) NOT NULL DEFAULT 'system',
  old_value   JSONB,
  new_value   JSONB,
  reason      TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ──────────────────────────────────────────────
-- INDEXES
-- ──────────────────────────────────────────────

CREATE INDEX idx_assets_ticker ON assets(ticker);
CREATE INDEX idx_assets_type ON assets(asset_type);
CREATE INDEX idx_assets_sector ON assets(sector);
CREATE INDEX idx_assets_country ON assets(country);
CREATE INDEX idx_assets_active ON assets(is_active) WHERE is_active = true;

CREATE INDEX idx_eligibility_status ON eligibility(status);
CREATE INDEX idx_eligibility_approved ON eligibility(asset_id) WHERE status = 'approved';

CREATE INDEX idx_asset_themes_asset ON asset_themes(asset_id);
CREATE INDEX idx_asset_themes_theme ON asset_themes(theme_id);

CREATE INDEX idx_prices_asset_date ON price_history(asset_id, date DESC);

CREATE INDEX idx_trends_score ON trend_scores(trend_score DESC);
CREATE INDEX idx_trends_momentum ON trend_scores(momentum_score DESC);

CREATE INDEX idx_risk_rating ON risk_scores(risk_rating);

CREATE INDEX idx_portfolio_signal ON portfolio_status(signal);
CREATE INDEX idx_portfolio_profile ON portfolio_status(risk_profile);

CREATE INDEX idx_audit_asset ON audit_log(asset_id);
CREATE INDEX idx_audit_time ON audit_log(created_at DESC);
CREATE INDEX idx_audit_action ON audit_log(action);

-- ──────────────────────────────────────────────
-- TRIGGERS (auto-update timestamps)
-- ──────────────────────────────────────────────

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_assets_updated BEFORE UPDATE ON assets FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_eligibility_updated BEFORE UPDATE ON eligibility FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_trends_updated BEFORE UPDATE ON trend_scores FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_risk_updated BEFORE UPDATE ON risk_scores FOR EACH ROW EXECUTE FUNCTION update_updated_at();
