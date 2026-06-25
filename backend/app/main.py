"""
Nür Capital — Backend API
Ethical Investment Intelligence Engine
"""

import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import screening, assets, themes, market_data, portfolio, eligibility, pipeline, mock_portfolio

app = FastAPI(
    title="Nür Capital API",
    description="Ethical investment intelligence engine",
    version="0.1.0",
)

# CORS: allow localhost for dev + deployed frontend URL from env
# For staging: allow all origins. Restrict in production.
cors_origins = ["http://localhost:3000"]
extra_origins = os.getenv("CORS_ORIGINS", "")
if extra_origins:
    cors_origins.extend([o.strip() for o in extra_origins.split(",") if o.strip()])

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for staging
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(pipeline.router, prefix="/api/pipeline", tags=["pipeline"])
app.include_router(mock_portfolio.router, prefix="/api/mock-portfolio", tags=["mock-portfolio"])
app.include_router(eligibility.router, prefix="/api/eligibility", tags=["eligibility"])
app.include_router(screening.router, prefix="/api/screening", tags=["screening"])
app.include_router(assets.router, prefix="/api/assets", tags=["assets"])
app.include_router(themes.router, prefix="/api/themes", tags=["themes"])
app.include_router(market_data.router, prefix="/api/market-data", tags=["market-data"])
app.include_router(portfolio.router, prefix="/api/portfolio", tags=["portfolio"])


@app.get("/api/health")
def health_check():
    return {"status": "ok", "service": "nurcapital-api"}
