# Nür Capital — Complete Codebase Summary

## Project Overview
Ethical investment intelligence platform. Tracks BUY/HOLD recommendations, analyses drawdowns, and helps users build a Shariah-compliant portfolio via AJ Bell ISA.

**Live URL:** https://harmonious-croissant-052df9.netlify.app
**Stack:** Next.js 14 + TypeScript + Tailwind CSS + Recharts
**Backend:** FastAPI (Python) on Render with Yahoo Finance pricing
**Hosting:** Netlify (frontend) + Render (backend)

## Navigation
1. **Dashboard** (`/`) — Portfolio Command Centre (drawdown anomaly detection)
2. **Conviction List** (`/research`) — Signal performance tracking with live price refresh
3. **Investment Lens** (`/themes`) — Interactive modular analyst pipeline for asset discovery

---

## Key Files

### 1. `src/app/page.tsx` — Dashboard (Portfolio Command Centre)
- Monitors 15 conviction list assets for drawdowns
- Classifies: Structural Discount (20%+) and Tactical Pullback (10-20%)
- Shows 3-point Kiro Rapid-Audit Checklist per anomaly
- Uses `src/lib/drawdown-engine.ts` for calculations

### 2. `src/app/research/page.tsx` — Conviction List
- 33 signal records (stocks + ETFs) with signal date, price, theme, rationale
- "Ask analyst to review" fetches live prices from backend (Yahoo Finance)
- localStorage persistence for price cache
- Cache freshness indicator (🟢 today / 🟡 this week / 🔴 overdue)
- Stocks/ETFs toggle filter
- Expandable signal detail with "How to Find This Asset" (ISIN, exchange, AJ Bell search)
- Summary cards: Total BUY, Avg Return, Best/Worst signal, Best theme
- Performance by theme breakdown

### 3. `src/app/themes/page.tsx` — Investment Lens
- Theme search input → searches 100+ asset universe
- 4 modular analyst tasks (run in any order):
  - Shariah Cleanse (screening filter)
  - Access & Liquidity (AJ Bell filter)
  - Technical Momentum Scan (bottom 20% removal)
  - Conviction Pricing Matrix (grading)
- Each task has "What is this?" explanation, loading spinner, reset button
- Pool tracker: Raw Matches → Active Filters → Surviving Pool
- Asset grid with "Promote to Conviction List" button
- Click asset → slides open AssetDrawer with multi-horizon chart

### 4. `src/components/AssetDrawer.tsx` — Asset Detail Drawer
- Slides in from right (450px)
- Shows: ticker, name, exchange, region, AJ Bell status, Shariah screening
- Multi-horizon chart (Recharts AreaChart): 1M, 6M, 1Y, 5Y, 10Y
- Deterministic mock price data (seeded random walk)
- Hover tooltips with date, price, % change
- GBX pricing for .L tickers, USD for US
- "Promote to Conviction List" footer button

### 5. `src/data/asset-universe.ts` — Asset Database
- 100+ pre-tagged assets across themes
- Fields: ticker, name, tags[], type, exchange, region, ajBell, screening
- Themes: Semiconductors, AI, Software, Cybersecurity, Healthcare, Oil & Gas, Industrial Automation, Battery/Clean Energy, Halal Finance, Emerging Markets
- `searchUniverse(terms)` — fuzzy matching by tag/name/ticker
- `getByTheme(theme)` — filter by theme
- Never modified at runtime

### 6. `src/lib/drawdown-engine.ts` — Drawdown Calculations
- `calculateDrawdown(currentPrice, high52w)` → { pctDrop, tier }
- `classifyOpportunity(pctDrop)` → "tactical" | "structural" | "none"
- `generateHealthCheck(ticker, pctDrop)` → 3-point audit
- `generateMockMarketData(ticker, signalPrice)` → mock 52w high, current price, volume

### 7. `src/data/asset-identity.ts` — AJ Bell Identity Layer
- ISIN, exchange, brokerSearchName per asset
- `ajBellStatus`: "eligible" | "research_only" | "unsupported"
- `isRecommendationEligible(ticker)` helper

### 8. `src/components/layout/Sidebar.tsx` — Navigation
- 3 items: Dashboard, Conviction List, Investment Lens

### 9. Backend (`backend/`) — FastAPI
- `backend/app/routers/mock_portfolio.py` — Price fetch endpoint
- `backend/app/services/providers/yahoo.py` — Yahoo Finance chart API (direct HTTP, not yfinance)
- `backend/app/services/trend_engine.py` — MA50, MA200, momentum, volatility calculations
- `backend/app/services/risk_engine.py` — Risk scoring
- `backend/app/services/eligibility_engine.py` — Shariah screening rules
- CORS: allows all origins (staging)
- Deployed on Render free tier (sleeps after 15min)

---

## Data Flow

```
User adds theme → searchUniverse() filters 100+ assets
  → Run modular tasks (shariah/access/technical/conviction)
  → Surviving assets shown with chart drawer
  → "Promote to Conviction List" saves to localStorage

Conviction List loads from static SIGNAL_RECORDS
  → "Ask analyst to review" → backend fetches Yahoo Finance prices
  → Prices cached in localStorage
  → Returns calculated: (currentPrice - signalPrice) / signalPrice × 100

Dashboard reads CONVICTION_SIGNALS
  → generateMockMarketData() creates 52w high/current prices
  → calculateDrawdown() classifies anomalies
  → Shows structural/tactical opportunities with health checks
```

---

## Design Principles
- Medium-to-long-term holder (not day trading)
- Shariah-compliant screening mandatory
- AJ Bell ISA actionable assets only for BUY signals
- Analyst language: "Ask analyst to review", "Conviction List", "Investment Lens"
- No trading language (no "execute trade", "live order")
- localStorage persistence for prices and custom themes
- All data sourced from static records + Yahoo Finance live refresh
