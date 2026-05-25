# Nür Capital — Canonical Asset Model

## Single Source of Truth for All Assets

---

## Design Philosophy

The Canonical Asset Model is **normalized by domain** — each concern lives in its own table with clear foreign key relationships. This gives us:

- Independent update cycles (prices change daily, eligibility changes rarely)
- Clean audit trails per domain
- Efficient queries (join only what you need)
- Independent scaling per table

The **denormalized view** is constructed at the API layer for frontend consumption.

---

## Entity Relationship Diagram

```
                         ┌─────────────────────┐
                         │      assets          │
                         │  (canonical master)  │
                         └──────────┬──────────┘
                                    │
              ┌─────────────────────┼─────────────────────────┐
              │                     │                          │
              ▼                     ▼                          ▼
┌──────────────────────┐  ┌─────────────────┐  ┌──────────────────────┐
│  eligibility         │  │  asset_themes   │  │  price_history       │
│  (1:1 per asset)     │  │  (many:many)    │  │  (1:many per asset)  │
└──────────────────────┘  └────────┬────────┘  └──────────────────────┘
                                   │
                                   ▼
                          ┌─────────────────┐
                          │     themes      │
                          └─────────────────┘

              ┌─────────────────────┼─────────────────────────┐
              │                     │                          │
              ▼                     ▼                          ▼
┌──────────────────────┐  ┌─────────────────────┐  ┌──────────────────────┐
│  trend_scores        │  │  risk_scores        │  │  portfolio_status    │
│  (1:1 per asset)     │  │  (1:1 per asset)    │  │  (1:many per asset)  │
└──────────────────────┘  └─────────────────────┘  └──────────────────────┘

                          ┌─────────────────────┐
                          │  audit_log          │
                          │  (append-only)      │
                          └─────────────────────┘
```

---

## Canonical Schema (SQL)


### 1. Core Asset Table

```sql
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
```

### 2. Eligibility Table

```sql
CREATE TABLE eligibility (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  asset_id          UUID NOT NULL UNIQUE REFERENCES assets(id) ON DELETE CASCADE,
  status            VARCHAR(20) NOT NULL CHECK (status IN ('approved','watchlist','rejected')),
  -- Hard exclusion flags (boolean per category)
  flag_gambling     BOOLEAN NOT NULL DEFAULT false,
  flag_alcohol      BOOLEAN NOT NULL DEFAULT false,
  flag_interest_finance BOOLEAN NOT NULL DEFAULT false,
  flag_israel_exposure  BOOLEAN NOT NULL DEFAULT false,
  flag_weapons      BOOLEAN NOT NULL DEFAULT false,
  flag_adult        BOOLEAN NOT NULL DEFAULT false,
  flag_prohibited_structure BOOLEAN NOT NULL DEFAULT false,
  -- Metadata
  rejection_reasons TEXT[],          -- Array of reason strings
  review_required   BOOLEAN NOT NULL DEFAULT false,
  review_notes      TEXT,
  reviewer          VARCHAR(100),
  confidence_level  VARCHAR(10) NOT NULL DEFAULT 'high' CHECK (confidence_level IN ('high','medium','low')),
  is_override       BOOLEAN NOT NULL DEFAULT false,
  override_reason   TEXT,
  reviewed_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

### 3. Themes Table

```sql
CREATE TABLE themes (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name        VARCHAR(100) NOT NULL UNIQUE,
  category    VARCHAR(50) NOT NULL,  -- technology, energy, finance, industrial, healthcare
  description TEXT,
  icon        VARCHAR(10),
  is_active   BOOLEAN NOT NULL DEFAULT true,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

### 4. Asset-Themes Junction

```sql
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
```

### 5. Price History

```sql
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
```

### 6. Trend Scores

```sql
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
```

### 7. Risk Scores

```sql
CREATE TABLE risk_scores (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  asset_id          UUID NOT NULL UNIQUE REFERENCES assets(id) ON DELETE CASCADE,
  volatility_risk   DECIMAL(5,2) CHECK (volatility_risk >= 0 AND volatility_risk <= 100),
  drawdown_risk     DECIMAL(5,2) CHECK (drawdown_risk >= 0 AND drawdown_risk <= 100),
  concentration_risk DECIMAL(5,2) CHECK (concentration_risk >= 0 AND concentration_risk <= 100),
  liquidity_risk    DECIMAL(5,2) CHECK (liquidity_risk >= 0 AND liquidity_risk <= 100),
  geopolitical_risk DECIMAL(5,2) CHECK (geopolitical_risk >= 0 AND geopolitical_risk <= 100),
  overall_risk      DECIMAL(5,2) CHECK (overall_risk >= 0 AND overall_risk <= 100),
  risk_rating       VARCHAR(20) CHECK (risk_rating IN ('low','moderate','elevated','high')),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

### 8. Portfolio Status

```sql
CREATE TABLE portfolio_status (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  asset_id            UUID NOT NULL REFERENCES assets(id) ON DELETE CASCADE,
  signal              VARCHAR(20) NOT NULL CHECK (signal IN ('buy','hold','reduce','watchlist')),
  suggested_allocation DECIMAL(5,2) CHECK (suggested_allocation >= 0 AND suggested_allocation <= 100),
  attractiveness_score DECIMAL(5,2),
  allocation_reason   TEXT,
  risk_profile        VARCHAR(20) NOT NULL CHECK (risk_profile IN ('conservative','balanced','growth','aggressive')),
  generated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

### 9. Audit Log

```sql
CREATE TABLE audit_log (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  asset_id    UUID REFERENCES assets(id) ON DELETE SET NULL,
  action      VARCHAR(50) NOT NULL,  -- eligibility_check, override, theme_assign, etc.
  actor       VARCHAR(100),          -- system, analyst name, or API key
  old_value   JSONB,
  new_value   JSONB,
  reason      TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

---

## Indexing Strategy

```sql
-- Core lookups
CREATE INDEX idx_assets_ticker ON assets(ticker);
CREATE INDEX idx_assets_type ON assets(asset_type);
CREATE INDEX idx_assets_sector ON assets(sector);
CREATE INDEX idx_assets_country ON assets(country);
CREATE INDEX idx_assets_active ON assets(is_active) WHERE is_active = true;

-- Eligibility (most common filter)
CREATE INDEX idx_eligibility_status ON eligibility(status);
CREATE INDEX idx_eligibility_approved ON eligibility(asset_id) WHERE status = 'approved';

-- Themes
CREATE INDEX idx_asset_themes_asset ON asset_themes(asset_id);
CREATE INDEX idx_asset_themes_theme ON asset_themes(theme_id);

-- Prices (time-series queries)
CREATE INDEX idx_prices_asset_date ON price_history(asset_id, date DESC);

-- Trends (ranking queries)
CREATE INDEX idx_trends_score ON trend_scores(trend_score DESC) WHERE trend_score IS NOT NULL;
CREATE INDEX idx_trends_momentum ON trend_scores(momentum_score DESC);

-- Risk
CREATE INDEX idx_risk_rating ON risk_scores(risk_rating);

-- Portfolio
CREATE INDEX idx_portfolio_signal ON portfolio_status(signal);
CREATE INDEX idx_portfolio_profile ON portfolio_status(risk_profile);

-- Audit (time-based queries)
CREATE INDEX idx_audit_asset ON audit_log(asset_id);
CREATE INDEX idx_audit_time ON audit_log(created_at DESC);
CREATE INDEX idx_audit_action ON audit_log(action);
```

---

## API Representation — Canonical Asset Response

The API returns a **denormalized view** assembled from multiple tables:

```json
{
  "id": "uuid",
  "ticker": "TSLA",
  "company_name": "Tesla Inc.",
  "asset_type": "equity",
  "exchange": "NASDAQ",
  "country": "US",
  "sector": "Consumer Discretionary",
  "industry": "Electric Vehicles",
  "currency": "USD",
  "market_cap": 800000000000,
  "website": "https://tesla.com",

  "eligibility": {
    "status": "approved",
    "flags": {
      "gambling": false,
      "alcohol": false,
      "interest_finance": false,
      "israel_exposure": false,
      "weapons": false,
      "adult": false,
      "prohibited_structure": false
    },
    "rejection_reasons": [],
    "confidence_level": "high",
    "reviewed_at": "2026-05-25T00:00:00Z"
  },

  "themes": [
    { "name": "Clean Energy", "category": "energy", "confidence": 0.85 },
    { "name": "Battery Technology", "category": "technology", "confidence": 0.70 }
  ],

  "market_data": {
    "current_price": 248.50,
    "average_volume": 45000000,
    "last_updated": "2026-05-25"
  },

  "trend": {
    "moving_average_50": 242.30,
    "moving_average_200": 228.10,
    "trend_score": 65.2,
    "momentum_score": 48.0,
    "relative_strength": 72.1,
    "volatility_score": 38.5,
    "market_regime": "bullish"
  },

  "risk": {
    "volatility_risk": 42.0,
    "drawdown_risk": 28.0,
    "concentration_risk": 15.0,
    "liquidity_risk": 5.0,
    "geopolitical_risk": 10.0,
    "overall_risk": 32.0,
    "risk_rating": "moderate"
  },

  "portfolio": {
    "signal": "buy",
    "suggested_allocation": 12.5,
    "attractiveness_score": 72.3,
    "allocation_reason": "Strong uptrend, moderate volatility, approved eligibility"
  }
}
```

---

## Validation Rules

| Field | Rule | Enforcement |
|-------|------|-------------|
| `ticker` | Unique, 1-20 chars, uppercase | DB constraint + API validation |
| `asset_type` | Enum: equity, etf, fund, sukuk, reit | CHECK constraint |
| `eligibility.status` | Enum: approved, watchlist, rejected | CHECK constraint |
| `eligibility.flags` | All boolean, at least one true if rejected | Application logic |
| `trend_score` | -100 to 100 | CHECK constraint |
| `momentum_score` | -100 to 100 | CHECK constraint |
| `volatility_score` | 0 to 100 | CHECK constraint |
| `risk scores` | 0 to 100 | CHECK constraint |
| `allocation` | 0 to 100, sum ≤ 100 across portfolio | Application logic |
| `confidence` | 0 to 1 (decimal) | CHECK constraint |
| `price` | Positive decimal | Application logic |

---

## Theme Taxonomy

| Category | Themes |
|----------|--------|
| **Technology** | Semiconductors, AI Infrastructure, Cybersecurity, Industrial Automation, Robotics |
| **Energy** | Clean Energy, Oil & Gas, Energy Infrastructure, Grid & Utilities |
| **Finance** | Halal Finance, Islamic Banking, Ethical Asset Management |
| **Industrial** | Manufacturing, Logistics, Robotics |
| **Healthcare** | Pharma, Medical Devices, Biotech |
| **Consumer** | Consumer Staples, E-commerce |

---

## Normalized vs Denormalized Design

| Aspect | Approach | Rationale |
|--------|----------|-----------|
| **Storage** | Normalized (separate tables) | Independent update cycles, clean audit |
| **API response** | Denormalized (joined view) | Single request for full asset view |
| **Dashboard** | Denormalized (materialized view) | Fast reads for list pages |
| **Audit** | Append-only log | Never lose history |
| **Prices** | Time-series (normalized) | Efficient range queries |
| **Eligibility** | 1:1 with asset | Always exactly one status |
| **Themes** | Many-to-many (junction) | Flexible classification |
| **Portfolio** | 1:many (per risk profile) | Different suggestions per profile |

**Materialized view for dashboard (future):**

```sql
CREATE MATERIALIZED VIEW asset_dashboard AS
SELECT
  a.id, a.ticker, a.company_name, a.sector, a.exchange,
  e.status AS eligibility_status,
  t.trend_score, t.momentum_score, t.current_price,
  r.overall_risk, r.risk_rating
FROM assets a
LEFT JOIN eligibility e ON e.asset_id = a.id
LEFT JOIN trend_scores t ON t.asset_id = a.id
LEFT JOIN risk_scores r ON r.asset_id = a.id
WHERE a.is_active = true;
```

---

## Future Extensibility

| Extension | How to add | Impact |
|-----------|-----------|--------|
| New exclusion rule | Add `flag_*` column to `eligibility` | Schema migration |
| New theme | INSERT into `themes` | No schema change |
| New risk metric | Add column to `risk_scores` | Schema migration |
| Portfolio tracking | New `portfolio_history` table | No existing table changes |
| User watchlists | New `user_watchlists` table | No existing table changes |
| Alerts | New `alerts` table + subscription | No existing table changes |
| AI classification | Update `source` in `asset_themes` | No schema change |
| Multi-currency | Already supported via `currency` field | — |
| Compliance reports | Query `audit_log` + `eligibility` | Read-only |

---

## Data Lifecycle

```
Asset Created → Eligibility Check → Theme Classification → Market Data Fetch
                     │                                           │
                     │ (if REJECTED → stops)                     │
                     │                                           ▼
                     │                                    Trend Calculation
                     │                                           │
                     │                                           ▼
                     │                                    Risk Assessment
                     │                                           │
                     │                                           ▼
                     │                                    Portfolio Ranking
                     │                                           │
                     ▼                                           ▼
              Audit Log Entry                           Dashboard Display
```

**Update frequencies:**
- Asset metadata: On change (rare)
- Eligibility: On re-screen (weekly) or manual override
- Themes: On classification (rare) or manual tag
- Prices: Daily
- Trends: Daily (after prices)
- Risk: Daily (after trends)
- Portfolio: Weekly or on-demand
- Audit: Every state change (append-only)
