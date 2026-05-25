# Nür Capital — Complete Folder Structure

```
nurcapital/
│
├── src/                                 ← FRONTEND (Next.js)
│   ├── app/
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   ├── page.tsx                     ← Dashboard
│   │   ├── assets/
│   │   │   ├── page.tsx                 ← Approved Assets list
│   │   │   └── [id]/page.tsx            ← Asset detail
│   │   ├── themes/page.tsx              ← Thematic investing
│   │   ├── portfolio/page.tsx           ← Portfolio suggestions
│   │   └── research/page.tsx            ← Research & insights
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Sidebar.tsx
│   │   │   └── TopBar.tsx
│   │   ├── dashboard/
│   │   │   ├── StatsGrid.tsx
│   │   │   ├── RecentSignals.tsx
│   │   │   └── PortfolioSummary.tsx
│   │   ├── assets/                      ← (planned)
│   │   │   ├── AssetCard.tsx
│   │   │   ├── AssetFilters.tsx
│   │   │   └── EligibilityBadge.tsx
│   │   ├── portfolio/                   ← (planned)
│   │   │   ├── AllocationChart.tsx
│   │   │   └── SuggestionCard.tsx
│   │   └── shared/                      ← (planned)
│   │       ├── Badge.tsx
│   │       ├── Card.tsx
│   │       └── Skeleton.tsx
│   └── lib/
│       ├── types/
│       │   └── database.ts              ← TypeScript types
│       ├── api/                          ← (planned) API client
│       │   └── client.ts
│       └── utils/                        ← (planned) Helpers
│
├── backend/                             ← BACKEND (Python FastAPI)
│   ├── app/
│   │   ├── main.py                      ← App entry point
│   │   ├── config.py                    ← (planned) Settings
│   │   ├── models/                      ← Pydantic schemas
│   │   │   ├── eligibility.py
│   │   │   ├── portfolio.py
│   │   │   ├── market_data.py
│   │   │   ├── themes.py
│   │   │   └── screening.py
│   │   ├── routers/                     ← API routes
│   │   │   ├── eligibility.py
│   │   │   ├── portfolio.py
│   │   │   ├── market_data.py
│   │   │   ├── themes.py
│   │   │   ├── assets.py
│   │   │   └── screening.py
│   │   ├── services/                    ← Business logic
│   │   │   ├── eligibility_engine.py
│   │   │   ├── portfolio_engine.py
│   │   │   ├── market_data_service.py
│   │   │   ├── theme_classifier.py
│   │   │   ├── theme_service.py
│   │   │   ├── trend_engine.py          ← (planned)
│   │   │   ├── risk_engine.py           ← (planned)
│   │   │   ├── ranking_service.py       ← (planned)
│   │   │   └── providers/
│   │   │       ├── base.py
│   │   │       ├── yahoo.py
│   │   │       └── twelve_data.py
│   │   └── db/                          ← (planned) Database layer
│   │       ├── connection.py
│   │       └── repositories/
│   ├── scripts/
│   │   ├── daily_refresh.py
│   │   ├── rescreen_all.py              ← (planned)
│   │   └── seed_assets.py               ← (planned)
│   ├── tests/
│   │   ├── test_eligibility.py
│   │   ├── test_portfolio.py
│   │   ├── test_themes.py
│   │   └── test_market_data.py
│   └── requirements.txt
│
├── database/                            ← DATABASE
│   ├── schema.sql                       ← Table definitions
│   └── seed.sql                         ← Initial data
│
├── docs/                                ← DOCUMENTATION
│   ├── architecture.md                  ← This document
│   └── folder-structure.md              ← Project layout
│
├── package.json                         ← Frontend dependencies
├── tailwind.config.ts                   ← Design system
├── tsconfig.json                        ← TypeScript config
├── next.config.mjs                      ← Next.js config
├── postcss.config.mjs
├── .gitignore
├── next-env.d.ts
└── README.md
```
