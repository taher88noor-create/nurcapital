"""
Mock Portfolio Router — Paper portfolio with true position tracking.
NOT live trading. Methodology validation only.
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional

from app.models.mock_portfolio import ConvictionLevel, MarketRegime, PortfolioSignal
from app.services.mock_portfolio_service import (
    add_position, add_thesis, calculate_metrics, create_weekly_review,
    exit_position, get_portfolio, get_position_details, get_reviews,
    get_theses, get_thesis_for_ticker, get_transactions, reduce_position,
    seed_demo_portfolio, set_regime, update_position, update_prices,
)

router = APIRouter()


# ── Request Models ────────────────────────────────────────────────────────────

class AddPositionRequest(BaseModel):
    ticker: str
    company_name: str
    entry_price: float
    allocation_pct: float
    theme: str = ""
    conviction: ConvictionLevel = ConvictionLevel.MEDIUM
    signal: PortfolioSignal = PortfolioSignal.BUY
    thesis_summary: str = ""
    invalidation_conditions: list[str] = []
    notes: str = ""
    rationale: str = ""


class ReducePositionRequest(BaseModel):
    reduce_pct: float
    rationale: str = ""


class UpdatePositionRequest(BaseModel):
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


# ── Dashboard ─────────────────────────────────────────────────────────────────

@router.get("/dashboard")
def api_dashboard():
    """Complete dashboard data in a single call."""
    portfolio = get_portfolio()
    metrics = calculate_metrics()
    positions = get_position_details()
    theses = get_theses()
    reviews = get_reviews()
    transactions = get_transactions()

    # Theme breakdown by current value
    theme_weights: dict[str, float] = {}
    for p in positions:
        theme = p.theme or "Unclassified"
        theme_weights[theme] = theme_weights.get(theme, 0) + p.actual_allocation_pct

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
        "positions": [p.model_dump() for p in positions],
        "themes": {k: round(v, 1) for k, v in theme_weights.items()},
        "regime": portfolio.regime.value,
        "cash_balance": portfolio.cash_balance,
        "cash_pct": metrics.cash_pct,
        "alerts": alerts,
        "active_theses": len([t for t in theses if t.status == "active"]),
        "total_reviews": len(reviews),
        "last_review": reviews[-1].review_date.isoformat() if reviews else None,
        "last_price_refresh": portfolio.last_price_refresh.isoformat() if portfolio.last_price_refresh else None,
        "transaction_count": len(transactions),
    }


# ── Portfolio State ───────────────────────────────────────────────────────────

@router.get("/metrics")
def get_portfolio_metrics():
    return calculate_metrics().model_dump()


@router.get("/positions")
def api_get_positions():
    return {"positions": [p.model_dump() for p in get_position_details()]}


# ── Position Management ───────────────────────────────────────────────────────

@router.post("/positions")
def api_add_position(req: AddPositionRequest):
    try:
        position = add_position(
            ticker=req.ticker.upper(), company_name=req.company_name,
            entry_price=req.entry_price, allocation_pct=req.allocation_pct,
            theme=req.theme, conviction=req.conviction, signal=req.signal,
            thesis_summary=req.thesis_summary,
            invalidation_conditions=req.invalidation_conditions,
            notes=req.notes, rationale=req.rationale,
        )
        return {"status": "bought", "position": position.model_dump()}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/positions/{ticker}/reduce")
def api_reduce_position(ticker: str, req: ReducePositionRequest):
    try:
        position = reduce_position(ticker.upper(), req.reduce_pct, req.rationale)
        return {"status": "reduced", "position": position.model_dump()}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.delete("/positions/{ticker}")
def api_exit_position(ticker: str, rationale: str = ""):
    try:
        result = exit_position(ticker.upper(), rationale)
        return result
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.patch("/positions/{ticker}")
def api_update_position(ticker: str, req: UpdatePositionRequest):
    try:
        position = update_position(ticker.upper(), signal=req.signal, conviction=req.conviction, notes=req.notes)
        return {"status": "updated", "position": position.model_dump()}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


# ── Price Updates ─────────────────────────────────────────────────────────────

@router.post("/prices/update")
def api_update_prices(req: UpdatePricesRequest):
    count = update_prices(req.prices)
    return {"updated": count}


@router.post("/prices/refresh")
async def api_refresh_prices():
    """Fetch latest prices from Yahoo Finance for all positions."""
    import asyncio
    from app.services.market_data_service import fetch_prices
    from app.models.market_data import FetchRequest

    portfolio = get_portfolio()
    price_map = {}
    errors = []

    # Fetch all prices (sequential to avoid rate limiting)
    for position in portfolio.positions:
        try:
            result = await fetch_prices(FetchRequest(ticker=position.ticker, days=5))
            if result.success and result.bars:
                price_map[position.ticker] = result.bars[-1].close
        except Exception as e:
            errors.append({"ticker": position.ticker, "error": str(e)})

    count = update_prices(price_map)
    metrics = calculate_metrics()

    return {
        "updated": count,
        "prices": price_map,
        "errors": errors,
        "portfolio_value": metrics.total_portfolio_value,
        "total_return_pct": metrics.total_return_pct,
        "refreshed_at": portfolio.last_price_refresh.isoformat() if portfolio.last_price_refresh else None,
    }


class FetchTickersRequest(BaseModel):
    tickers: list[str]


@router.post("/prices/fetch")
async def api_fetch_prices_for_tickers(req: FetchTickersRequest):
    """Fetch latest prices for a list of tickers (used by recommendation tracker)."""
    from app.services.market_data_service import fetch_prices
    from app.models.market_data import FetchRequest

    price_map = {}
    errors = []

    for ticker in req.tickers:
        try:
            result = await fetch_prices(FetchRequest(ticker=ticker, days=5))
            if result.success and result.bars:
                price_map[ticker] = result.bars[-1].close
            else:
                errors.append({"ticker": ticker, "error": result.error or "No bars returned"})
        except Exception as e:
            errors.append({"ticker": ticker, "error": str(e)})

    return {
        "prices": price_map,
        "errors": errors,
        "fetched": len(price_map),
        "failed": len(errors),
        "tickers_requested": req.tickers,
    }


# ── Transactions ──────────────────────────────────────────────────────────────

@router.get("/transactions")
def api_get_transactions():
    txs = get_transactions()
    return {"transactions": [t.model_dump() for t in reversed(txs)], "total": len(txs)}


# ── Market Regime ─────────────────────────────────────────────────────────────

@router.post("/regime")
def api_set_regime(req: SetRegimeRequest):
    return set_regime(req.regime)


# ── Thesis Management ─────────────────────────────────────────────────────────

@router.get("/theses")
def api_get_theses():
    return {"theses": [t.model_dump() for t in get_theses()]}


@router.get("/theses/{ticker}")
def api_get_thesis_for_ticker(ticker: str):
    return {"ticker": ticker.upper(), "theses": [t.model_dump() for t in get_thesis_for_ticker(ticker.upper())]}


@router.post("/theses")
def api_add_thesis(req: AddThesisRequest):
    thesis = add_thesis(req.ticker.upper(), req.thesis_statement, req.macro_drivers, req.risk_considerations, req.invalidation_conditions, req.conviction)
    return {"status": "created", "thesis": thesis.model_dump()}


# ── Weekly Reviews ────────────────────────────────────────────────────────────

@router.get("/reviews")
def api_get_reviews():
    return {"reviews": [r.model_dump() for r in get_reviews()]}


@router.post("/reviews")
def api_create_review(req: CreateReviewRequest):
    review = create_weekly_review(req.actions_taken, req.notes)
    return {"status": "created", "review": review.model_dump()}


# ── Seed / Reset ──────────────────────────────────────────────────────────────

@router.post("/seed")
def api_seed_portfolio():
    portfolio = seed_demo_portfolio()
    metrics = calculate_metrics()
    return {
        "status": "seeded",
        "positions": len(portfolio.positions),
        "cash_balance": portfolio.cash_balance,
        "total_value": metrics.total_portfolio_value,
        "total_return_pct": metrics.total_return_pct,
    }
