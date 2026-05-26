# Nür Capital — Asset Universe Management System

**Version:** 1.0  
**Classification:** Internal — System Architecture  
**Last Updated:** May 2025  

---

## Purpose

This document defines the architecture for the Nür Capital Asset Universe Management System — the core data layer that feeds the investment intelligence engine. Every asset that enters, exits, or moves within the system follows the workflows defined here.

---

## System Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    ASSET UNIVERSE MANAGEMENT SYSTEM                           │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌──────────────┐                                                            │
│  │  INGESTION   │  Manual + Automated sources                                │
│  │  LAYER       │  Equities, ETFs, Thematic Funds                            │
│  └──────┬───────┘                                                            │
│         │                                                                    │
│         ▼                                                                    │
│  ┌──────────────┐                                                            │
│  │  ELIGIBILITY │  Hard exclusion screening                                  │
│  │  ENGINE      │  7 categories, binary pass/fail                            │
│  └──────┬───────┘                                                            │
│         │                                                                    │
│    ┌────┼────────────────┐                                                   │
│    ▼    ▼                ▼                                                   │
│  ┌────────┐  ┌──────────┐  ┌──────────┐                                    │
│  │APPROVED│  │WATCHLIST │  │REJECTED  │                                    │
│  │UNIVERSE│  │UNIVERSE  │  │UNIVERSE  │                                    │
│  └───┬────┘  └──────────┘  └──────────┘                                    │
│      │                                                                       │
│      ▼                                                                       │
│  ┌──────────────┐                                                            │
│  │  THEME       │  Multi-theme classification                                │
│  │  ENGINE      │  14 supported themes                                       │
│  └──────┬───────┘                                                            │
│         │                                                                    │
│         ▼                                                                    │
│  ┌──────────────┐                                                            │
│  │  TREND &     │  MA50, MA200, momentum, volatility                         │
│  │  OPPORTUNITY │  Market regime alignment                                   │
│  │  ENGINE      │                                                            │
│  └──────┬───────┘                                                            │
│         │                                                                    │
│         ▼                                                                    │
│  ┌──────────────┐                                                            │
│  │  PORTFOLIO   │  Ranked candidates for allocation                          │
│  │  UNIVERSE    │  BUY / HOLD / REDUCE / WATCHLIST                           │
│  └──────────────┘                                                            │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Section 1 — Asset Ingestion Layer

### Purpose

The ingestion layer is the entry point for all assets into the Nür Capital system. Every asset must be ingested before it can be screened, classified, or ranked.

### Supported Asset Types

| Type | Description | Examples |
|------|-------------|---------|
| **Equity** | Individual stocks listed on public exchanges | TSM, ASML, LLY |
| **ETF** | Exchange-traded funds (Sharia-compliant or thematic) | HLAL, SPUS |
| **Thematic Fund** | Sector or theme-focused funds | Clean energy funds, Islamic banking funds |

### Asset Record Schema

Every ingested asset stores:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| ticker | string | Yes | Exchange symbol (e.g., TSM, 1211.HK) |
| company_name | string | Yes | Full legal/trading name |
| asset_type | enum | Yes | equity / etf / fund |
| exchange | string | Yes | Primary listing exchange |
| country | string | Yes | Country of incorporation |
| sector | string | Yes | GICS sector classification |
| industry | string | Yes | Sub-industry |
| market_cap | number | No | Market capitalisation (USD) |
| currency | string | No | Trading currency |
| website | string | No | Company website |
| description | text | No | Brief business description |
| discovery_source | string | Yes | How this asset was identified |
| ingested_at | datetime | Auto | When the asset entered the system |
| status | enum | Auto | pending / screened / classified |

### Ingestion Sources

| Source | Method | Priority | Volume |
|--------|--------|----------|--------|
| Manual entry | Analyst adds via API or workspace | HIGH | 1-5 per week |
| Thematic research | Deep-dive into supported themes | HIGH | 5-10 per quarter |
| ETF constituent analysis | Decompose Sharia-compliant ETFs | MEDIUM | 10-20 per quarter |
| Sector screening | Systematic sector scans | MEDIUM | 5-15 per quarter |
| Macro opportunity | Assets benefiting from macro shifts | MEDIUM | 2-5 per quarter |
| Automated scan (future) | API-driven screening pipelines | LOW | Scalable |

### Ingestion Workflow

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│  Identify    │────▶│  Validate    │────▶│  Store       │────▶│  Queue for   │
│  Asset       │     │  Metadata    │     │  Record      │     │  Screening   │
└──────────────┘     └──────────────┘     └──────────────┘     └──────────────┘
```

### Validation Rules

Before an asset enters the system:
1. Ticker must be unique (no duplicates)
2. Exchange must be a recognised public exchange
3. Asset type must be one of: equity, etf, fund
4. Country must be specified
5. Sector must be specified

### API Endpoints

| Method | Path | Purpose |
|--------|------|---------|
| POST | `/api/universe/ingest` | Add a new asset to the system |
| GET | `/api/universe/pending` | Assets awaiting screening |
| GET | `/api/universe/all` | Complete asset universe |
| GET | `/api/universe/{ticker}` | Single asset detail |

---

## Section 2 — Eligibility Engine

### Purpose

The Eligibility Engine is the binary gate that determines whether an asset may enter the Approved Universe. It enforces hard exclusion rules with no exceptions.

### Hard Exclusion Categories

| # | Category | Flag Field | Trigger |
|---|----------|-----------|---------|
| 1 | Gambling | flag_gambling | >5% revenue from betting/casinos/lotteries |
| 2 | Alcohol | flag_alcohol | >5% revenue from alcohol production/distribution |
| 3 | Interest-Based Finance | flag_interest_finance | >5% revenue from conventional lending/interest |
| 4 | Israel Exposure | flag_israel_exposure | HQ in Israel, or significant operations/revenue |
| 5 | Weapons | flag_weapons | Any involvement in weapons manufacturing |
| 6 | Adult Industry | flag_adult | Any involvement in adult content |
| 7 | Prohibited Structure | flag_prohibited_structure | Corporate structure incompatible with Sharia |

### Screening Process

```
┌─────────────────────────────────────────────────────────────────┐
│                    ELIGIBILITY SCREENING                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  INPUT: Ingested asset with metadata                             │
│                                                                  │
│  STEP 1: Flag Assessment (7 categories)                          │
│  ├── Each flag: CLEAR or FLAGGED                                 │
│  └── Evidence documented for each determination                  │
│                                                                  │
│  STEP 2: Financial Ratio Check (AAOIFI)                          │
│  ├── Debt/Assets < 33%                                           │
│  ├── Interest Income/Revenue < 5%                                │
│  ├── Illiquid Assets/Total Assets > 25%                          │
│  └── Cash+Receivables/Total Assets < 70%                         │
│                                                                  │
│  STEP 3: Determination                                           │
│  ├── All CLEAR + ratios pass → APPROVED                          │
│  ├── Any flag under investigation → WATCHLIST                    │
│  └── Any flag FLAGGED (HIGH confidence) → REJECTED               │
│                                                                  │
│  STEP 4: Documentation                                           │
│  ├── Record all flag results                                     │
│  ├── Document rationale                                          │
│  ├── Set confidence level                                        │
│  └── Set next review date                                        │
│                                                                  │
│  OUTPUT: Asset routed to appropriate universe                    │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Eligibility Statuses

| Status | Definition | Consequence |
|--------|-----------|-------------|
| **APPROVED** | All flags CLEAR, ratios pass | Enters Approved Universe. Eligible for themes, scoring, allocation. |
| **WATCHLIST** | Under investigation or data insufficient | Cannot be allocated. Monitored. Must resolve within 90 days. |
| **REJECTED** | One or more hard exclusions triggered | Permanently excluded. Never enters ranking or allocation. Retained for audit. |

### Screening Record Schema

| Field | Type | Description |
|-------|------|-------------|
| asset_id | FK | Reference to ingested asset |
| status | enum | approved / watchlist / rejected |
| flag_gambling | enum | clear / flagged |
| flag_alcohol | enum | clear / flagged |
| flag_interest_finance | enum | clear / flagged |
| flag_israel_exposure | enum | clear / flagged |
| flag_weapons | enum | clear / flagged |
| flag_adult | enum | clear / flagged |
| flag_prohibited_structure | enum | clear / flagged |
| rejection_reasons | text[] | Specific rules triggered |
| review_notes | text | Analyst commentary |
| confidence_level | enum | high / medium / low |
| evidence_sources | text | Where determination came from |
| screened_at | datetime | When screening occurred |
| next_review_date | date | Scheduled re-screening |
| screened_by | string | Analyst who performed review |

### Critical Rule

> **Rejected assets MUST NEVER enter the ranking engine, opportunity engine, or portfolio allocation system. This is a hard architectural constraint, not a soft guideline.**

### API Endpoints

| Method | Path | Purpose |
|--------|------|---------|
| POST | `/api/universe/screen/{ticker}` | Screen an asset |
| GET | `/api/universe/approved` | All approved assets |
| GET | `/api/universe/watchlist` | All watchlist assets |
| GET | `/api/universe/rejected` | All rejected assets |
| PATCH | `/api/universe/screen/{ticker}` | Update screening result |

---

## Section 3 — Theme Classification Engine

### Purpose

Approved assets are classified into investment themes. Themes enable thematic portfolio construction, concentration monitoring, and macro-aligned allocation.

### Supported Themes

| # | Theme | Category | Description |
|---|-------|----------|-------------|
| 1 | Semiconductors | technology | Chip design, fabrication, equipment |
| 2 | AI Infrastructure | technology | Cloud, data centres, AI hardware/software |
| 3 | Battery Technology | technology | Battery manufacturing, energy storage |
| 4 | Halal Finance | finance | Sharia-compliant ETFs, Islamic fintech |
| 5 | Islamic Banking | finance | Full Islamic banks, sukuk issuers |
| 6 | Clean Energy | energy | Solar, wind, hydrogen, renewables |
| 7 | Oil & Gas | energy | Upstream, midstream, downstream |
| 8 | Energy Infrastructure | energy | Grid, utilities, transmission |
| 9 | Healthcare | healthcare | Pharma, biotech, medical devices |
| 10 | Industrial Automation | industrial | Factory automation, IoT, PLCs |
| 11 | Robotics | industrial | Autonomous systems, surgical robots |
| 12 | Cybersecurity | technology | Network security, identity, threat detection |
| 13 | Manufacturing | industrial | Advanced manufacturing, reshoring |
| 14 | Logistics | industrial | Supply chain, shipping, warehousing |

### Classification Rules

- Each asset receives 1 **Primary Theme** (mandatory)
- Each asset may receive 1 **Secondary Theme** (optional)
- Maximum 3 themes per asset
- Classification sources: Manual (analyst), Rule-based (sector mapping), AI-assisted (future)

### Rule-Based Mapping

| Industry Contains | → Primary Theme |
|-------------------|-----------------|
| Semiconductor, Chip, Foundry | Semiconductors |
| AI, Cloud, Data Centre | AI Infrastructure |
| Battery, Energy Storage | Battery Technology |
| Sharia, Halal, Islamic ETF | Halal Finance |
| Islamic Bank, Sukuk | Islamic Banking |
| Solar, Wind, Hydrogen | Clean Energy |
| Oil, Gas, Petroleum | Oil & Gas |
| Grid, Utility, Transmission | Energy Infrastructure |
| Pharma, Biotech, Medical | Healthcare |
| Automation, PLC, Factory | Industrial Automation |
| Robot, Autonomous | Robotics |
| Security, Cyber, Identity | Cybersecurity |
| Manufacturing, Production | Manufacturing |
| Logistics, Shipping, Warehouse | Logistics |

### Classification Schema

| Field | Type | Description |
|-------|------|-------------|
| asset_id | FK | Reference to approved asset |
| primary_theme | enum | Main theme assignment |
| secondary_theme | enum | Optional secondary theme |
| additional_themes | text | Comma-separated additional themes |
| classification_source | enum | manual / rule_based / ai_assisted |
| confidence | decimal | 0.0 to 1.0 |
| classified_by | string | Analyst or system |
| classified_at | datetime | When classification occurred |

### API Endpoints

| Method | Path | Purpose |
|--------|------|---------|
| POST | `/api/universe/classify/{ticker}` | Classify an approved asset |
| GET | `/api/universe/themes` | All themes with asset counts |
| GET | `/api/universe/themes/{theme}` | Assets in a specific theme |
| PATCH | `/api/universe/classify/{ticker}` | Reclassify an asset |

---

## Section 4 — Trend & Opportunity Engine

### Purpose

The Trend & Opportunity Engine evaluates the market attractiveness of approved, classified assets. It determines which assets are candidates for portfolio allocation based on technical positioning and risk.

### Input Requirements

Only assets that are:
1. APPROVED (passed eligibility)
2. CLASSIFIED (assigned at least one theme)
3. Have price data available (minimum 50 days)

### Metrics Calculated

| Metric | Calculation | Range |
|--------|-------------|-------|
| MA50 | 50-day simple moving average | Price |
| MA200 | 200-day simple moving average | Price |
| Trend Score | Weighted: price vs MAs + MA cross + slope | -1 to +1 |
| Momentum Score | Rate of change over 20 days | -1 to +1 |
| Volatility Score | Annualised std dev, normalised | 0 to 1 |
| Relative Strength | RSI-style (14-day) | 0 to 100 |
| Market Regime | Derived from trend + volatility | bullish/neutral/bearish/volatile |

### Opportunity Scoring

```
Opportunity Score = (
    Theme Strength × 0.20 +
    Trend Score × 0.25 +
    Momentum Score × 0.20 +
    Regime Alignment × 0.15 +
    Risk-Adjusted Quality × 0.20
) × 100

Range: 0 to 100
```

### Signal Assignment

| Score | Signal | Action |
|-------|--------|--------|
| 70-100 | BUY | Strong allocation candidate |
| 50-69 | BUY | Allocation candidate |
| 35-49 | HOLD | Maintain if held, don't initiate |
| 20-34 | REDUCE | Trim if held |
| 0-19 | WATCHLIST | Monitor only |

### Ranking Output

The engine produces a ranked list of approved assets ordered by Opportunity Score. This feeds the Portfolio Universe.

### Defensive Rules

- If market regime is BEARISH: all scores reduced by 20%
- If volatility is HIGH: max allocation capped at 8%
- If trend score is negative: asset cannot receive BUY signal
- Cash allocation increases automatically in defensive regimes

### Trend Data Schema

| Field | Type | Description |
|-------|------|-------------|
| asset_id | FK | Reference to approved asset |
| current_price | decimal | Latest closing price |
| ma50 | decimal | 50-day moving average |
| ma200 | decimal | 200-day moving average |
| trend_score | decimal | -1 to +1 |
| momentum_score | decimal | -1 to +1 |
| volatility_score | decimal | 0 to 1 |
| relative_strength | decimal | 0 to 100 |
| market_regime | enum | bullish/neutral/bearish/volatile |
| opportunity_score | decimal | 0 to 100 |
| signal | enum | buy/hold/reduce/watchlist |
| calculated_at | datetime | When metrics were computed |

### API Endpoints

| Method | Path | Purpose |
|--------|------|---------|
| POST | `/api/universe/analyse/{ticker}` | Run trend analysis on one asset |
| POST | `/api/universe/analyse/all` | Run analysis on all approved assets |
| GET | `/api/universe/rankings` | Ranked approved assets |
| GET | `/api/universe/opportunities` | Assets with BUY signal |

---

## Section 5 — Universe Management

### Four Universes

The system maintains four distinct universes with strict boundaries:

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  APPROVED UNIVERSE                                       │    │
│  │  Assets that passed all eligibility checks               │    │
│  │  → Eligible for themes, scoring, allocation              │    │
│  │  → Reviewed quarterly                                    │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  WATCHLIST UNIVERSE                                      │    │
│  │  Assets under investigation                              │    │
│  │  → Cannot be allocated capital                           │    │
│  │  → Must resolve within 90 days                           │    │
│  │  → Reviewed monthly                                      │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  REJECTED UNIVERSE                                       │    │
│  │  Assets that failed hard exclusion                       │    │
│  │  → Permanently excluded from scoring/allocation          │    │
│  │  → Retained for audit trail                              │    │
│  │  → Never deleted                                         │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  PORTFOLIO UNIVERSE                                      │    │
│  │  Subset of Approved that are actively held               │    │
│  │  → Currently allocated capital                           │    │
│  │  → Tracked with P&L, quantities, theses                  │    │
│  │  → Reviewed weekly                                       │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Universe Transitions

| From | To | Trigger | Reversible? |
|------|----|---------|-------------|
| Pending → Approved | All flags CLEAR, ratios pass | Yes (if new info emerges) |
| Pending → Watchlist | Insufficient data or borderline | Yes (resolve within 90 days) |
| Pending → Rejected | Hard exclusion triggered | Extremely rare reversal |
| Watchlist → Approved | Investigation resolves positively | Yes |
| Watchlist → Rejected | Investigation confirms exclusion | No |
| Approved → Rejected | New information triggers exclusion | No (immediate exit from portfolio) |
| Approved → Portfolio | BUY signal + capital allocated | Yes (exit returns to Approved) |
| Portfolio → Approved | Position exited (REDUCE/EXIT) | Yes |

### Critical Constraint

```
REJECTED ──╳──▶ APPROVED    (never)
REJECTED ──╳──▶ PORTFOLIO   (never)
REJECTED ──╳──▶ RANKING     (never)
WATCHLIST ──╳──▶ PORTFOLIO   (never)
```

### Universe Counts (Current State)

| Universe | Count | Review Cadence |
|----------|-------|---------------|
| Approved | 22 | Quarterly |
| Watchlist | 6 | Monthly |
| Rejected | 15 | Never (audit only) |
| Portfolio | 9 | Weekly |

### Reclassification Workflow

When an asset needs to move between universes:

1. **Trigger identified** (new information, M&A, regulatory change)
2. **Review initiated** (analyst documents the trigger)
3. **Re-screening** (full eligibility check repeated)
4. **Determination** (new status assigned)
5. **Action** (if moving to Rejected from Portfolio → immediate exit)
6. **Audit log** (transition recorded with rationale)

### API Endpoints

| Method | Path | Purpose |
|--------|------|---------|
| GET | `/api/universe/summary` | Counts per universe |
| GET | `/api/universe/approved` | Full approved universe |
| GET | `/api/universe/watchlist` | Full watchlist |
| GET | `/api/universe/rejected` | Full rejected universe |
| GET | `/api/universe/portfolio` | Currently held positions |
| POST | `/api/universe/transition/{ticker}` | Move asset between universes |

---

## Section 6 — Database Relationships

### Entity-Relationship Model

```
┌──────────────┐       ┌──────────────────┐       ┌──────────────────┐
│   assets     │──1:1──│   eligibility    │       │   themes         │
│              │       │                  │       │                  │
│ id (PK)      │       │ asset_id (FK)    │       │ id (PK)          │
│ ticker       │       │ status           │       │ name             │
│ company_name │       │ flag_*           │       │ category         │
│ asset_type   │       │ confidence       │       │ description      │
│ exchange     │       │ reviewed_at      │       └────────┬─────────┘
│ country      │       └──────────────────┘                │
│ sector       │                                           │
│ industry     │       ┌──────────────────┐                │
│ market_cap   │──1:N──│  asset_themes    │──N:1───────────┘
└──────┬───────┘       │                  │
       │               │ asset_id (FK)    │
       │               │ theme_id (FK)    │
       │               │ source           │
       │               │ confidence       │
       │               └──────────────────┘
       │
       │               ┌──────────────────┐
       │──1:N──────────│  trend_scores    │
       │               │                  │
       │               │ asset_id (FK)    │
       │               │ current_price    │
       │               │ ma50, ma200      │
       │               │ trend_score      │
       │               │ momentum_score   │
       │               │ opportunity_score│
       │               │ signal           │
       │               └──────────────────┘
       │
       │               ┌──────────────────┐
       │──1:N──────────│  price_history   │
       │               │                  │
       │               │ asset_id (FK)    │
       │               │ date             │
       │               │ open/high/low    │
       │               │ close            │
       │               │ volume           │
       │               └──────────────────┘
       │
       │               ┌──────────────────┐
       └──1:N──────────│  portfolio_pos   │
                       │                  │
                       │ asset_id (FK)    │
                       │ quantity         │
                       │ entry_price      │
                       │ invested_amount  │
                       │ signal           │
                       │ thesis           │
                       └──────────────────┘
```

### Key Relationships

| Relationship | Type | Description |
|-------------|------|-------------|
| Asset → Eligibility | 1:1 | Every asset has exactly one screening result |
| Asset → Themes | 1:N | An asset can have 1-3 theme assignments |
| Theme → Assets | 1:N | A theme contains many assets |
| Asset → Trend Scores | 1:1 | Latest trend analysis (overwritten on refresh) |
| Asset → Price History | 1:N | Daily OHLCV bars (append-only) |
| Asset → Portfolio Position | 0:1 | An asset may or may not be in the portfolio |
| Asset → Transactions | 1:N | All buy/sell/reduce actions |
| Asset → Audit Log | 1:N | All decisions and changes |

### Data Integrity Rules

1. An asset cannot exist in `portfolio_positions` unless `eligibility.status = 'approved'`
2. An asset cannot have `trend_scores` unless `eligibility.status = 'approved'`
3. Deleting an asset cascades to all related records
4. `eligibility` records are never deleted — only status changes
5. `price_history` is append-only (no updates, no deletes)
6. `audit_log` is append-only (immutable)

---

## Section 7 — Ranking Workflow

### End-to-End Ranking Pipeline

```
┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐
│ Fetch   │───▶│ Compute │───▶│ Score   │───▶│ Rank    │───▶│ Signal  │
│ Prices  │    │ MAs &   │    │ Opport- │    │ Assets  │    │ Assign  │
│         │    │ Metrics │    │ unity   │    │         │    │         │
└─────────┘    └─────────┘    └─────────┘    └─────────┘    └─────────┘
     │              │              │              │              │
     ▼              ▼              ▼              ▼              ▼
  Yahoo         MA50/200       Composite      Descending     BUY/HOLD/
  Finance       Momentum       Score          by Score       REDUCE
  API           Volatility     (0-100)                       WATCHLIST
```

### Ranking Cadence

| Frequency | Scope | Trigger |
|-----------|-------|---------|
| Daily | Price refresh for portfolio positions | Automatic (or manual) |
| Weekly | Full trend analysis for all approved assets | Monday review |
| Monthly | Complete re-ranking with signal updates | Monthly portfolio review |
| On-demand | Single asset analysis | Analyst request |

### Ranking Output Format

| Rank | Ticker | Score | Signal | Theme | Trend | Momentum | Risk |
|------|--------|-------|--------|-------|-------|----------|------|
| 1 | TSM | 62.4 | BUY | Semiconductors | +0.72 | +0.58 | moderate |
| 2 | CRWD | 58.2 | BUY | Cybersecurity | +0.62 | +0.52 | moderate |
| 3 | AVGO | 57.8 | BUY | Semiconductors | +0.58 | +0.50 | moderate |
| ... | ... | ... | ... | ... | ... | ... | ... |

### Ranking Constraints

1. Only APPROVED assets appear in rankings
2. Assets without price data are excluded (ranked as "insufficient data")
3. Rankings are regime-aware (defensive regime reduces growth scores)
4. Maximum 50 assets ranked at any time (universe cap for MVP)
5. Rankings are timestamped and historical rankings retained

---

## Section 8 — Scalability Recommendations

### Current State (MVP)

| Component | Implementation | Capacity |
|-----------|---------------|----------|
| Storage | In-memory (Python dicts) | 50 assets |
| Price data | Yahoo Finance (yfinance) | 5-10 tickers/minute |
| Screening | Manual + rule-based | 5-10 per week |
| Classification | Manual + rule-based | Immediate |
| Ranking | On-demand calculation | Seconds |

### Phase 2 (Production-Ready)

| Component | Upgrade | Capacity |
|-----------|---------|----------|
| Storage | PostgreSQL (Supabase) | 500+ assets |
| Price data | Yahoo + Twelve Data fallback | 50+ tickers/minute |
| Screening | Semi-automated with analyst review | 20+ per week |
| Classification | Rule-based + AI-assisted | Immediate |
| Ranking | Scheduled daily pipeline | Minutes |
| Caching | Redis for price data | Sub-second reads |

### Phase 3 (Scaled)

| Component | Upgrade | Capacity |
|-----------|---------|----------|
| Storage | PostgreSQL with read replicas | 5000+ assets |
| Price data | Multiple providers + WebSocket | Real-time |
| Screening | AI-assisted with human review | 100+ per week |
| Classification | ML-based with validation | Automated |
| Ranking | Real-time scoring pipeline | Continuous |
| API | Rate-limited, authenticated | Multi-user |

### Migration Path

1. **MVP → Phase 2:** Replace in-memory stores with Supabase tables. Add scheduled daily refresh via cron/scheduler.
2. **Phase 2 → Phase 3:** Add Redis caching, WebSocket price feeds, ML classification, and multi-user auth.

### Key Architectural Decisions

| Decision | Rationale |
|----------|-----------|
| In-memory for MVP | Speed of development. No infrastructure cost. Acceptable for <50 assets. |
| Separate universes (not status field) | Clear boundaries. Prevents accidental mixing. Easier to audit. |
| Append-only audit log | Immutability ensures trust. No retroactive changes. |
| Theme as separate table (not field) | Supports multi-theme. Enables theme-level analytics. |
| Price history separate from trend scores | Raw data preserved. Scores are derived and recalculated. |

---

## Important Principles

### What This System IS

- A principle-filtered investment intelligence system
- A disciplined opportunity identification engine
- An auditable, explainable research platform
- A methodology validation tool

### What This System is NOT

- A speculative stock scanner
- A day trading engine
- A momentum-chasing algorithm
- An automated execution system

### Design Constraints

1. **Ethics first:** No asset enters ranking without passing eligibility
2. **Explainability:** Every score, signal, and decision has documented rationale
3. **Auditability:** Complete history of all transitions and decisions
4. **Discipline:** Fixed review cadences, concentration limits, regime awareness
5. **Transparency:** Any stakeholder can trace any decision to its source

---

## Document Control

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | May 2025 | Nür Capital | Initial universe management system design |

---

*End of document.*
