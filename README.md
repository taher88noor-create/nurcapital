# Nür Capital

Ethical investment intelligence platform.

## Quick Start

### Backend (Python FastAPI)

```bash
cd backend
pip install -r requirements.txt
python run.py
```

API available at: http://localhost:8000
Docs at: http://localhost:8000/docs

### Frontend (Next.js)

```bash
npm install
npm run dev
```

Dashboard at: http://localhost:3000

### Run the Pipeline

Once the backend is running, trigger the full pipeline:

```bash
curl -X POST http://localhost:8000/api/pipeline/run
```

Or click "Run Pipeline" on the dashboard.

---

## MVP Asset Universe

| Ticker | Company | Status |
|--------|---------|--------|
| TSM | Taiwan Semiconductor | ✓ Approved |
| ASML | ASML Holding | ✓ Approved |
| NVDA | NVIDIA Corporation | ✗ Rejected (Israel exposure) |
| 1211.HK | BYD Company | ✓ Approved |
| HLAL | Wahed FTSE USA Shariah ETF | ✓ Approved |

## Pipeline Stages

```
1. Asset Ingestion     → Load 5 seed assets
2. Eligibility Engine  → Hard exclusion rules (pass/fail)
3. Theme Classification → Assign investment themes
4. Market Data         → Fetch 1yr daily prices (Yahoo Finance)
5. Trend & Momentum   → MA50, MA200, trend score, momentum
6. Risk Analysis       → Volatility, drawdown, geopolitical
7. Opportunity Ranking → Score and rank approved assets
```

## API Endpoints

| Method | Path | Purpose |
|--------|------|---------|
| POST | `/api/pipeline/run` | Execute full pipeline |
| GET | `/api/pipeline/assets` | All processed assets |
| GET | `/api/pipeline/approved` | Approved assets only |
| GET | `/api/pipeline/rankings` | Ranked by attractiveness |
| GET | `/api/pipeline/assets/{ticker}` | Single asset detail |

## Architecture

- **Eligibility:** Hard exclusion (no weighted scoring)
- **Themes:** Multi-tag classification
- **Trends:** MA50/MA200, momentum, RSI
- **Risk:** Volatility, drawdown, liquidity, geopolitical
- **Portfolio:** Attractiveness ranking (trend + momentum - risk)

## Tech Stack

- **Frontend:** Next.js 14 + TypeScript + Tailwind CSS
- **Backend:** Python FastAPI
- **Market Data:** Yahoo Finance (yfinance)
- **Database:** In-memory (MVP) → PostgreSQL/Supabase (production)

## What This Is NOT

- Not a trading platform
- Not a broker
- Not automated execution
- Not crypto speculation
