"""
Market Data Router — API endpoints for price data fetching and retrieval.
"""

from fastapi import APIRouter, HTTPException

from app.models.market_data import FetchRequest, FetchResult, PriceBar, RefreshStatus
from app.services.market_data_service import (
    fetch_prices,
    get_latest_price,
    get_stored_prices,
    refresh_all,
)

router = APIRouter()


@router.post("/fetch", response_model=FetchResult)
async def fetch_ticker_data(request: FetchRequest):
    """Fetch daily OHLCV data for a single ticker."""
    result = await fetch_prices(request)
    return result


@router.get("/prices/{ticker}", response_model=list[PriceBar])
def get_price_history(ticker: str):
    """Get stored price history for a ticker."""
    bars = get_stored_prices(ticker.upper())
    if not bars:
        raise HTTPException(status_code=404, detail=f"No price data for {ticker}")
    return bars


@router.get("/latest/{ticker}", response_model=PriceBar)
def get_latest(ticker: str):
    """Get the most recent price bar for a ticker."""
    bar = get_latest_price(ticker.upper())
    if not bar:
        raise HTTPException(status_code=404, detail=f"No price data for {ticker}")
    return bar


@router.post("/refresh", response_model=RefreshStatus)
async def refresh_prices(tickers: list[str], days: int = 30):
    """Refresh price data for multiple tickers (daily update)."""
    result = await refresh_all([t.upper() for t in tickers], days=days)
    return result


@router.get("/providers")
def list_providers():
    """List available data providers and their status."""
    from app.services.providers.yahoo import YahooProvider
    from app.services.providers.twelve_data import TwelveDataProvider

    yahoo = YahooProvider()
    twelve = TwelveDataProvider()

    return {
        "providers": [
            {"name": "yahoo", "available": yahoo.is_available(), "priority": 1},
            {"name": "twelve_data", "available": twelve.is_available(), "priority": 2},
        ]
    }
