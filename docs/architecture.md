# Nür Capital — System Architecture

## End-to-End Data Flow & Workflow

---

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           DATA SOURCES                                       │
├──────────┬──────────┬──────────┬──────────┬──────────┬─────────────────────┤
│ Yahoo    │ SEC      │ FCA      │ Manual   │ Analyst  │ Future:             │
│ Finance  │ EDGAR    │ RNS      │ Seed     │ Input    │ Reuters, FT, etc.   │
└────┬─────┴────┬─────┴────┬─────┴────┬─────┴────┬─────┴─────────────────────┘
     │          │          │          │          │
     ▼          ▼          ▼          ▼          ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  STAGE 1: ASSET INGESTION                                                   │
│  Service: asset_ingestion_service                                           │
│  Output: Raw asset records in database                                      │
└──────────────────────────────────┬──────────────────────────────────────────┘
                                   │
                                   ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  STAGE 2: ELIGIBILITY ENGINE                                                │
│  Service: eligibility_engine                                                │
│  Logic: Hard exclusion rules (pass/fail/review)                             │
│  Output: APPROVED | WATCHLIST | REJECTED                                    │
│                                                                             │
│  ⛔ REJECTED assets STOP HERE. Never enter downstream systems.              │
└──────────────────────────────────┬──────────────────────────────────────────┘
                                   │ (APPROVED only)
                                   ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  STAGE 3: THEME CLASSIFICATION                                              │
│  Service: theme_classifier + theme_service                                  │
│  Output: Asset-theme assignments (many-to-many)                             │
└──────────────────────────────────┬──────────────────────────────────────────┘
                                   │
                                   ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  STAGE 4: MARKET DATA PROCESSING                                            │
│  Service: market_data_service + providers                                   │
│  Output: Daily OHLCV stored in price_history                                │
└──────────────────────────────────┬──────────────────────────────────────────┘
                                   │
                                   ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  STAGE 5: TREND & MOMENTUM ANALYSIS                                         │
│  Service: trend_engine (planned)                                            │
│  Output: trend_score, momentum_score, MA50, MA200                           │
└──────────────────────────────────┬──────────────────────────────────────────┘
                                   │
                                   ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  STAGE 6: RISK ANALYSIS                                                     │
│  Service: risk_engine (planned)                                             │
│  Output: volatility_score, drawdown_risk, concentration_risk                │
└──────────────────────────────────┬──────────────────────────────────────────┘
                                   │
                                   ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  STAGE 7: OPPORTUNITY RANKING                                               │
│  Service: ranking_service (planned)                                         │
│  Output: Ranked list of approved assets by attractiveness                   │
└──────────────────────────────────┬──────────────────────────────────────────┘
                                   │
                                   ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  STAGE 8: PORTFOLIO SUGGESTION ENGINE                                       │
│  Service: portfolio_engine                                                  │
│  Output: Allocation suggestions (Buy/Hold/Reduce/Watchlist)                 │
└──────────────────────────────────┬──────────────────────────────────────────┘
                                   │
                                   ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  STAGE 9: DASHBOARD PRESENTATION                                            │
│  Frontend: Next.js App                                                      │
│  Output: Interactive dashboard, asset cards, portfolio view                  │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Stage-by-Stage Specification

### Stage 1: Asset Ingestion

| Attribute | Detail |
|-----------|--------|
| **Inputs** | Ticker, company name, sector, industry, exchange, country |
| **Outputs** | Asset record in `assets` table |
| **Service** | `asset_ingestion_service.py` |
| **Database** | INSERT into `assets` |
| **API** | `POST /api/assets` (manual), `POST /api/assets/import` (batch) |
| **Scheduled** | None (event-driven or manual) |
| **Cache** | None needed |
| **Scalability** | Batch import support, idempotent upserts |

### Stage 2: Eligibility Engine

| Attribute | Detail |
|-----------|--------|
| **Inputs** | Asset record (ticker, name, sector, industry, ratios) |
| **Outputs** | `EligibilityResult` → status, rule_results, rejection_reasons |
| **Service** | `eligibility_engine.py` |
| **Database** | INSERT/UPDATE `ethical_screening` table |
| **API** | `POST /api/eligibility/check`, `POST /api/eligibility/batch` |
| **Scheduled** | Re-screen on data change or quarterly review |
| **Cache** | Cache eligibility status per asset (invalidate on re-screen) |
| **Scalability** | Stateless, horizontally scalable, rule registry extensible |

**Hard exclusion rules:**
- Gambling, Alcohol, Weapons, Interest-based finance
- Israel exposure, Adult industries, Prohibited structures

**Audit:** Every eligibility decision logged with timestamp, rule results, and analyst ID.

### Stage 3: Theme Classification

| Attribute | Detail |
|-----------|--------|
| **Inputs** | Approved asset (ticker, name, sector, industry, description) |
| **Outputs** | Theme assignments in `asset_themes` table |
| **Service** | `theme_classifier.py` + `theme_service.py` |
| **Database** | INSERT into `asset_themes` |
| **API** | `POST /api/themes/classify`, `POST /api/themes/assign` |
| **Scheduled** | Re-classify on new asset or theme rule change |
| **Cache** | Theme list cached (rarely changes) |
| **Scalability** | Rule-based now, AI-assisted later (same interface) |

### Stage 4: Market Data Processing

| Attribute | Detail |
|-----------|--------|
| **Inputs** | Ticker list (approved assets only) |
| **Outputs** | OHLCV bars in `price_history` table |
| **Service** | `market_data_service.py` + provider chain |
| **Database** | INSERT into `price_history` (deduplicated) |
| **API** | `POST /api/market-data/fetch`, `POST /api/market-data/refresh` |
| **Scheduled** | Daily at 06:00 UTC (after market close) |
| **Cache** | Latest price cached per ticker (5 min TTL) |
| **Scalability** | Provider fallback chain, rate limiting, batch processing |

### Stage 5: Trend & Momentum Analysis

| Attribute | Detail |
|-----------|--------|
| **Inputs** | Price history (from Stage 4) |
| **Outputs** | `trend_scores` table (MA50, MA200, momentum, trend) |
| **Service** | `trend_engine.py` (planned) |
| **Database** | UPSERT into `trend_scores` |
| **API** | `GET /api/trends/{ticker}`, `POST /api/trends/refresh` |
| **Scheduled** | Daily after market data refresh |
| **Cache** | Trend scores cached (24h TTL) |
| **Scalability** | Pure computation, parallelisable per asset |

**Calculations:**
- MA50: 50-day simple moving average
- MA200: 200-day simple moving average
- Momentum: Rate of change over 20 days
- Trend: MA50 vs MA200 crossover + slope

### Stage 6: Risk Analysis

| Attribute | Detail |
|-----------|--------|
| **Inputs** | Price history + trend scores |
| **Outputs** | Risk metrics (volatility, drawdown, concentration) |
| **Service** | `risk_engine.py` (planned) |
| **Database** | UPSERT into `trend_scores` (extended) |
| **API** | `GET /api/risk/{ticker}` |
| **Scheduled** | Daily after trend analysis |
| **Cache** | Risk scores cached (24h TTL) |
| **Scalability** | Stateless computation |

**Metrics:**
- Volatility: 30-day annualised standard deviation
- Max drawdown: Largest peak-to-trough decline (90 days)
- Beta: Correlation to benchmark (future)

### Stage 7: Opportunity Ranking

| Attribute | Detail |
|-----------|--------|
| **Inputs** | Trend scores + risk scores (approved assets only) |
| **Outputs** | Ranked asset list by attractiveness |
| **Service** | `ranking_service.py` (planned) |
| **Database** | Read-only (computes from existing scores) |
| **API** | `GET /api/ranking?profile=balanced` |
| **Scheduled** | On-demand (computed at request time) |
| **Cache** | Ranked list cached per risk profile (1h TTL) |
| **Scalability** | In-memory sort, fast |

### Stage 8: Portfolio Suggestion Engine

| Attribute | Detail |
|-----------|--------|
| **Inputs** | Ranked approved assets + risk profile + market condition |
| **Outputs** | `PortfolioResult` (allocations, signals, reasoning) |
| **Service** | `portfolio_engine.py` |
| **Database** | INSERT into `portfolio_suggestions` |
| **API** | `POST /api/portfolio/suggest` |
| **Scheduled** | Weekly regeneration, on-demand per user |
| **Cache** | Latest suggestion cached per profile (1h TTL) |
| **Scalability** | Stateless, fast computation |

### Stage 9: Dashboard Presentation

| Attribute | Detail |
|-----------|--------|
| **Inputs** | All API responses |
| **Outputs** | Interactive UI |
| **Service** | Next.js frontend |
| **Database** | None (reads via API) |
| **API** | Consumes all backend APIs |
| **Scheduled** | None (real-time via API) |
| **Cache** | React Query / SWR with stale-while-revalidate |
| **Scalability** | Static generation where possible, CDN |

---

## Backend Service Architecture

```
backend/
├── app/
│   ├── main.py                          ← FastAPI app, router registration
│   ├── config.py                        ← Environment config (planned)
│   │
│   ├── models/                          ← Pydantic schemas (request/response)
│   │   ├── eligibility.py
│   │   ├── portfolio.py
│   │   ├── market_data.py
│   │   ├── themes.py
│   │   └── screening.py
│   │
│   ├── routers/                         ← API endpoint definitions
│   │   ├── eligibility.py
│   │   ├── portfolio.py
│   │   ├── market_data.py
│   │   ├── themes.py
│   │   ├── assets.py
│   │   └── screening.py
│   │
│   ├── services/                        ← Business logic (stateless)
│   │   ├── eligibility_engine.py        ← Hard exclusion rules
│   │   ├── portfolio_engine.py          ← Allocation suggestions
│   │   ├── market_data_service.py       ← Data fetch orchestration
│   │   ├── theme_classifier.py          ← Rule-based classification
│   │   ├── theme_service.py             ← Theme CRUD + assignment
│   │   ├── trend_engine.py              ← (planned) MA, momentum
│   │   ├── risk_engine.py               ← (planned) Volatility, drawdown
│   │   ├── ranking_service.py           ← (planned) Opportunity ranking
│   │   └── providers/
│   │       ├── base.py                  ← Abstract provider interface
│   │       ├── yahoo.py                 ← Yahoo Finance (primary)
│   │       └── twelve_data.py           ← Twelve Data (fallback)
│   │
│   └── db/                              ← (planned) Database layer
│       ├── connection.py                ← Supabase/PostgreSQL client
│       ├── repositories/                ← Data access objects
│       │   ├── asset_repo.py
│       │   ├── screening_repo.py
│       │   ├── price_repo.py
│       │   └── portfolio_repo.py
│       └── migrations/                  ← Schema migrations
│
├── scripts/
│   ├── daily_refresh.py                 ← Scheduled price update
│   ├── rescreen_all.py                  ← (planned) Batch re-eligibility
│   └── seed_assets.py                   ← (planned) Initial data load
│
├── tests/
│   ├── test_eligibility.py
│   ├── test_portfolio.py
│   ├── test_themes.py
│   └── test_market_data.py
│
└── requirements.txt
```

---

## Database Interaction Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                        PostgreSQL / Supabase                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────┐    ┌───────────────────┐    ┌──────────────┐      │
│  │  assets  │───▶│ ethical_screening │    │   themes     │      │
│  └──────────┘    └───────────────────┘    └──────────────┘      │
│       │                                         │                │
│       │          ┌───────────────────┐          │                │
│       ├─────────▶│  asset_themes     │◀─────────┘                │
│       │          └───────────────────┘                           │
│       │                                                          │
│       │          ┌───────────────────┐                           │
│       ├─────────▶│  price_history    │                           │
│       │          └───────────────────┘                           │
│       │                                                          │
│       │          ┌───────────────────┐                           │
│       ├─────────▶│  trend_scores     │                           │
│       │          └───────────────────┘                           │
│       │                                                          │
│       │          ┌───────────────────────┐                       │
│       └─────────▶│ portfolio_suggestions │                       │
│                  └───────────────────────┘                       │
│                                                                   │
│  ┌───────────────────┐                                           │
│  │  audit_log        │  ← (planned) All decisions logged         │
│  └───────────────────┘                                           │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

**Read patterns:**
- Dashboard: assets + screening + trend_scores (joined)
- Portfolio: assets + trend_scores + screening (approved only)
- Asset detail: asset + screening + themes + price_history + trend_scores

**Write patterns:**
- Ingestion: INSERT assets
- Eligibility: UPSERT ethical_screening
- Market data: INSERT price_history (deduplicated)
- Trends: UPSERT trend_scores
- Portfolio: INSERT portfolio_suggestions

---

## API Architecture

```
/api
├── /health                    GET     Health check
│
├── /eligibility
│   ├── /check                 POST    Single asset eligibility
│   ├── /batch                 POST    Batch eligibility
│   └── /rules                 GET     List exclusion rules
│
├── /assets
│   ├── /                      GET     List assets (filtered)
│   ├── /{ticker}              GET     Single asset detail
│   └── /import                POST    Batch import (planned)
│
├── /themes
│   ├── /                      GET     List themes
│   ├── /{id}                  GET     Single theme
│   ├── /                      POST    Create theme
│   ├── /classify              POST    Classify asset
│   ├── /assign                POST    Manual assignment
│   └── /asset/{id}            GET     Themes for asset
│
├── /market-data
│   ├── /fetch                 POST    Fetch ticker data
│   ├── /prices/{ticker}       GET     Price history
│   ├── /latest/{ticker}       GET     Latest price
│   ├── /refresh               POST    Batch refresh
│   └── /providers             GET     Provider status
│
├── /trends (planned)
│   ├── /{ticker}              GET     Trend scores
│   └── /refresh               POST    Recalculate
│
├── /risk (planned)
│   └── /{ticker}              GET     Risk metrics
│
├── /ranking (planned)
│   └── /                      GET     Ranked opportunities
│
└── /portfolio
    ├── /suggest               POST    Generate suggestions
    ├── /profiles              GET     Risk profiles
    └── /signals               GET     Signal definitions
```

---

## Frontend Interaction Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                     Next.js Frontend                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  Pages:                                                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │  Dashboard   │  │   Assets     │  │   Themes     │          │
│  │              │  │              │  │              │          │
│  │ • Stats      │  │ • List       │  │ • Grid       │          │
│  │ • Signals    │  │ • Filters    │  │ • Counts     │          │
│  │ • Allocation │  │ • Search     │  │ • Drill-down │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
│                                                                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │ Asset Detail │  │  Portfolio   │  │  Research    │          │
│  │              │  │              │  │              │          │
│  │ • Screening  │  │ • Profiles   │  │ • Search     │          │
│  │ • Trend      │  │ • Allocation │  │ • Insights   │          │
│  │ • Evidence   │  │ • Signals    │  │ • Signals    │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
│                                                                   │
│  Data fetching: React Query / SWR                                │
│  State: URL params + React state (no global store needed)        │
│  Caching: stale-while-revalidate (5 min for prices, 1h others)  │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## Deployment Architecture

### MVP (Current)

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   Vercel         │     │   Railway /      │     │   Supabase      │
│   (Frontend)     │────▶│   Render         │────▶│   (Database)    │
│   Next.js        │     │   (Backend API)  │     │   PostgreSQL    │
└─────────────────┘     └─────────────────┘     └─────────────────┘
                               │
                               ▼
                        ┌─────────────────┐
                        │  GitHub Actions  │
                        │  (Daily refresh) │
                        └─────────────────┘
```

### Future State

```
┌──────────┐     ┌──────────────┐     ┌──────────────┐     ┌──────────┐
│  Vercel  │     │  API Gateway │     │  Services    │     │  Supabase│
│  CDN     │────▶│  (rate limit)│────▶│  (FastAPI)   │────▶│  + Redis │
└──────────┘     └──────────────┘     └──────────────┘     └──────────┘
                                             │
                                    ┌────────┼────────┐
                                    ▼        ▼        ▼
                              ┌─────────┐ ┌──────┐ ┌──────┐
                              │ Workers │ │ Cron │ │ Queue│
                              │ (trend) │ │(data)│ │(jobs)│
                              └─────────┘ └──────┘ └──────┘
```

---

## Scheduled Jobs

| Job | Frequency | Service | Purpose |
|-----|-----------|---------|---------|
| `daily_refresh.py` | Daily 06:00 UTC | market_data_service | Fetch latest prices |
| `trend_refresh` | Daily 06:30 UTC | trend_engine | Recalculate MA/momentum |
| `risk_refresh` | Daily 07:00 UTC | risk_engine | Update volatility/drawdown |
| `rescreen_all` | Weekly (Sunday) | eligibility_engine | Re-check all assets |
| `portfolio_regen` | Weekly (Monday) | portfolio_engine | Regenerate suggestions |

---

## Caching Strategy

| Data | TTL | Layer | Invalidation |
|------|-----|-------|-------------|
| Asset list | 1 hour | API + Frontend | On new asset |
| Eligibility status | 24 hours | API | On re-screen |
| Theme list | 24 hours | API + Frontend | On theme change |
| Latest price | 5 minutes | API | On market data refresh |
| Trend scores | 24 hours | API | On trend refresh |
| Portfolio suggestions | 1 hour | API | On regeneration |
| Ranked list | 1 hour | API | On trend/risk change |

---

## Logging & Auditability

| Event | Logged | Purpose |
|-------|--------|---------|
| Eligibility decision | Always | Audit trail, compliance |
| Manual override | Always | Accountability |
| Portfolio generation | Always | Decision history |
| Market data fetch | On error | Debugging |
| Theme assignment | Always | Classification history |
| API requests | Always | Usage analytics |

**Log format:** Structured JSON → stdout → log aggregator (future)

---

## MVP vs Future State

| Capability | MVP | Future |
|-----------|-----|--------|
| Asset ingestion | Manual + seed SQL | API + bulk import |
| Eligibility | Rule engine (7 rules) | + AI-assisted review |
| Themes | Rule-based classifier | + LLM classification |
| Market data | Yahoo Finance | + Twelve Data, Alpha Vantage |
| Trend analysis | Basic MA + momentum | + RSI, MACD, Bollinger |
| Risk | Volatility only | + drawdown, beta, VaR |
| Portfolio | Score-based allocation | + optimisation, rebalancing |
| Frontend | Static pages | + real-time updates, alerts |
| Auth | None | Supabase Auth |
| Deployment | Single server | Microservices + queue |
| Monitoring | Console logs | Structured logging + alerts |

---

## Extensibility Points

| Extension | Interface | How to add |
|-----------|-----------|-----------|
| New exclusion rule | Add function to `ALL_RULES` in `eligibility_engine.py` | Pure function, same signature |
| New data provider | Implement `BaseDataProvider` | Drop into `providers/` |
| New theme | `POST /api/themes` or add to seed | No code change |
| New risk metric | Add to `risk_engine.py` | Extend output model |
| AI classification | Implement `TagSource.AI_ASSISTED` | Same `ClassificationResult` interface |
| Portfolio tracking | New `portfolio_history` table | New service, same API pattern |
| User accounts | Supabase Auth + RLS | Add auth middleware |
| Alerts/notifications | New `alerts` service | Subscribe to eligibility/trend changes |

---

## Implementation Milestones

| # | Stage | Status | Priority |
|---|-------|--------|----------|
| 1 | System architecture (this doc) | ✅ Complete | — |
| 2 | Database schema | ✅ Complete | — |
| 3 | Asset ingestion | ✅ Seed data ready | — |
| 4 | Eligibility engine | ✅ Complete (7 rules) | — |
| 5 | Theme engine | ✅ Complete (10 themes) | — |
| 6 | Market data engine | ✅ Complete (Yahoo + fallback) | — |
| 7 | Portfolio engine | ✅ Complete (no ethical weighting) | — |
| 8 | Trend engine | 🔲 Planned | Next |
| 9 | Risk engine | 🔲 Planned | Next |
| 10 | Ranking service | 🔲 Planned | Next |
| 11 | Dashboard (frontend) | 🔲 Scaffolded | Next |
| 12 | Database connection | 🔲 Planned | Next |
| 13 | Auth & user accounts | 🔲 Future | Later |
| 14 | Portfolio tracking | 🔲 Future | Later |
| 15 | AI-assisted classification | 🔲 Future | Later |
