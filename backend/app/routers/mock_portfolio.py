"""
Mock Portfolio Router — API endpoints for paper portfolio validation.

NOT live trading. This is a methodology validation system.
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional

from app.models.mock_portfolio import ConvictionLevel, MarketRegime, PortfolioSignal
from app.services.mock_portfolio_service import (
    add_position,
    add_thesis,
    calculate_metrics,
    create_weekly_review,
    get_portfolio,
    get_position_performance,
    get_reviews,
    get_theses,
    get_thesis_for_ticker,
    remove_position,
    seed_demo_portfolio,
    set_regime,
    update_position,
    update_prices,
)

router = APIRouter()


# ── Request Models ────────────────────────────────────────────────────────────

class AddPositionRequest(BaseModel):
    ticker: str
    company_name: str
    entry_price: float
    target_allocation_pct: float
    theme: str = ""
    conviction: ConvictionLevel = ConvictionLevel.MEDIUM
    signal: PortfolioSignal = PortfolioSignal.BUY
    thesis_summary: str = ""
    invalidation_conditions: list[str] = []
    notes: str = ""


class UpdatePositionRequest(BaseModel):
    target_allocation_pct: Optional[float] = None
    signal: Optional[PortfolioSignal] = None
    conviction: Optional[ConvictionLevel] = None
    notes: Optional[str] = None


class UpdatePricesRequest(BaseModel):
    prices: dict[str, float]


class SetRegimeRequest(BaseModel):
    regime: MarketRegime


class AddThesisRequest(BaseModel):
    ticker: str
    thesis_statement: str
    macro_drivers: list[str] = []
    risk_considerations: list[str] = []
    invalidation_conditions: list[str] = []
    conviction: ConvictionLevel = ConvictionLevel.MEDIUM


class CreateReviewRequest(BaseModel):
    actions_taken: list[str] = []
    notes: str = ""


# ── Portfolio State ───────────────────────────────────────────────────────────

@router.get("/state")
def get_portfolio_state():
    """Get complete portfolio state including positions and cash."""
    portfolio = get_portfolio()
    return {
        "positions": [p.model_dump() for p in portfolio.positions],
        "cash_pct": portfolio.cash_pct,
        "regime": portfolio.regime.value,
        "starting_capital": portfolio.starting_capital,
        "position_count": len(portfolio.positions),
        "last_review_date": portfolio.last_review_date,
    }


@router.get("/metrics")
def get_portfolio_metrics():
    """Get calculated portfolio metrics (value, return, concentration)."""
    metrics = calculate_metrics()
    return metrics.model_dump()


@router.get("/performance")
def get_performance():
    """Get per-position performance data."""
    perf = get_position_performance()
    return {"positions": [p.model_dump() for p in perf]}


# ── Position Management ───────────────────────────────────────────────────────

@router.post("/positions")
def api_add_position(req: AddPositionRequest):
    """Add a new position to the mock portfolio."""
    try:
        position = add_position(
            ticker=req.ticker.upper(),
            company_name=req.company_name,
            entry_price=req.entry_price,
            target_allocation_pct=req.target_allocation_pct,
            theme=req.theme,
            conviction=req.conviction,
            signal=req.signal,
            thesis_summary=req.thesis_summary,
            invalidation_conditions=req.invalidation_conditions,
            notes=req.notes,
        )
        return {"status": "added", "position": position.model_dump()}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.patch("/positions/{ticker}")
def api_update_position(ticker: str, req: UpdatePositionRequest):
    """Update an existing position."""
    try:
        position = update_position(
            ticker=ticker.upper(),
            target_allocation_pct=req.target_allocation_pct,
            signal=req.signal,
            conviction=req.conviction,
            notes=req.notes,
        )
        return {"status": "updated", "position": position.model_dump()}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.delete("/positions/{ticker}")
def api_remove_position(ticker: str):
    """Remove a position (simulate exit)."""
    try:
        result = remove_position(ticker.upper())
        return result
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


# ── Price Updates ─────────────────────────────────────────────────────────────

@router.post("/prices/update")
def api_update_prices(req: UpdatePricesRequest):
    """Update current prices for positions."""
    count = update_prices(req.prices)
    return {"updated": count, "total_positions": len(get_portfolio().positions)}


@router.post("/prices/refresh")
async def api_refresh_prices():
    """Fetch latest prices from Yahoo Finance for all positions."""
    from app.services.market_data_service import fetch_prices
    from app.models.market_data import FetchRequest

    portfolio = get_portfolio()
    price_map = {}
    errors = []

    for position in portfolio.positions:
        try:
            result = await fetch_prices(FetchRequest(ticker=position.ticker, days=5))
            if result.success and result.bars:
                price_map[position.ticker] = result.bars[-1].close
        except Exception as e:
            errors.append({"ticker": position.ticker, "error": str(e)})

    count = update_prices(price_map)
    return {
        "updated": count,
        "prices": price_map,
        "errors": errors,
    }


# ── Market Regime ─────────────────────────────────────────────────────────────

@router.post("/regime")
def api_set_regime(req: SetRegimeRequest):
    """Update market regime assessment."""
    result = set_regime(req.regime)
    return result


# ── Thesis Management ─────────────────────────────────────────────────────────

@router.get("/theses")
def api_get_theses():
    """Get all investment theses."""
    theses = get_theses()
    return {"theses": [t.model_dump() for t in theses]}


@router.get("/theses/{ticker}")
def api_get_thesis_for_ticker(ticker: str):
    """Get theses for a specific ticker."""
    theses = get_thesis_for_ticker(ticker.upper())
    return {"ticker": ticker.upper(), "theses": [t.model_dump() for t in theses]}


@router.post("/theses")
def api_add_thesis(req: AddThesisRequest):
    """Create a new investment thesis."""
    thesis = add_thesis(
        ticker=req.ticker.upper(),
        thesis_statement=req.thesis_statement,
        macro_drivers=req.macro_drivers,
        risk_considerations=req.risk_considerations,
        invalidation_conditions=req.invalidation_conditions,
        conviction=req.conviction,
    )
    return {"status": "created", "thesis": thesis.model_dump()}


# ── Weekly Reviews ────────────────────────────────────────────────────────────

@router.get("/reviews")
def api_get_reviews():
    """Get all weekly reviews."""
    reviews = get_reviews()
    return {"reviews": [r.model_dump() for r in reviews]}


@router.post("/reviews")
def api_create_review(req: CreateReviewRequest):
    """Create a weekly review."""
    review = create_weekly_review(
        actions_taken=req.actions_taken,
        notes=req.notes,
    )
    return {"status": "created", "review": review.model_dump()}


# ── Seed / Reset ──────────────────────────────────────────────────────────────

@router.post("/seed")
def api_seed_portfolio():
    """Seed the mock portfolio with demo data."""
    portfolio = seed_demo_portfolio()
    metrics = calculate_metrics()
    return {
        "status": "seeded",
        "positions": len(portfolio.positions),
        "cash_pct": portfolio.cash_pct,
        "regime": portfolio.regime.value,
        "total_value": metrics.total_value,
        "total_return_pct": metrics.total_return_pct,
    }


# ── Dashboard Summary ─────────────────────────────────────────────────────────

@router.get("/dashboard")
def api_dashboard():
    """Get complete dashboard data in a single call."""
    portfolio = get_portfolio()
    metrics = calculate_metrics()
    performance = get_position_performance()
    theses = get_theses()
    reviews = get_reviews()

    # Theme breakdown
    theme_weights: dict[str, float] = {}
    for p in portfolio.positions:
        theme = p.theme or "Unclassified"
        theme_weights[theme] = theme_weights.get(theme, 0) + p.target_allocation_pct

    # Alerts
    alerts = []
    if metrics.largest_position_pct > 12:
        alerts.append({"type": "warning", "message": f"Position concentration: {metrics.largest_position_pct}% (limit: 15%)"})
    if metrics.largest_theme_pct > 35:
        alerts.append({"type": "warning", "message": f"Theme concentration: {metrics.largest_theme_pct}% (limit: 35%)"})
    if metrics.cash_pct < 10:
        alerts.append({"type": "warning", "message": f"Low cash reserve: {metrics.cash_pct}%"})
    if not alerts:
        alerts.append({"type": "ok", "message": "All limits within range"})

    return {
        "metrics": metrics.model_dump(),
        "positions": [p.model_dump() for p in performance],
        "themes": theme_weights,
        "regime": portfolio.regime.value,
        "cash_pct": portfolio.cash_pct,
        "alerts": alerts,
        "active_theses": len([t for t in theses if t.status == "active"]),
        "total_reviews": len(reviews),
        "last_review": reviews[-1].review_date.isoformat() if reviews else None,
    }
