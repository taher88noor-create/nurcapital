"""
Market Data Service — Orchestrates data fetching, storage, and refresh.

Responsibilities:
- Provider selection with fallback
- Batch fetching for multiple tickers
- Deduplication before storage
- Graceful error handling
- Refresh scheduling support
"""

import logging
import time
from datetime import date, timedelta
from typing import Optional

from app.models.market_data import DataProvider, FetchRequest, FetchResult, PriceBar, RefreshStatus
from app.services.providers.base import BaseDataProvider
from app.services.providers.yahoo import YahooProvider
from app.services.providers.twelve_data import TwelveDataProvider

logger = logging.getLogger(__name__)


# ── Provider Registry ─────────────────────────────────────────────────────────

def _build_provider_chain() -> list[BaseDataProvider]:
    """Build ordered list of providers (primary first, fallbacks after)."""
    providers: list[BaseDataProvider] = []

    yahoo = YahooProvider()
    if yahoo.is_available():
        providers.append(yahoo)

    twelve = TwelveDataProvider()
    if twelve.is_available():
        providers.append(twelve)

    return providers


# ── In-memory price store (replace with database in production) ───────────────

_price_store: dict[str, list[PriceBar]] = {}


def get_stored_prices(ticker: str) -> list[PriceBar]:
    """Get stored price history for a ticker."""
    return _price_store.get(ticker, [])


def get_latest_price(ticker: str) -> Optional[PriceBar]:
    """Get the most recent price bar for a ticker."""
    bars = _price_store.get(ticker, [])
    return bars[-1] if bars else None


def store_prices(ticker: str, bars: list[PriceBar]) -> int:
    """
    Store price bars, deduplicating by date.
    Returns number of new bars added.
    """
    existing = _price_store.get(ticker, [])
    existing_dates = {b.date for b in existing}

    new_bars = [b for b in bars if b.date not in existing_dates]
    if new_bars:
        existing.extend(new_bars)
        existing.sort(key=lambda b: b.date)
        _price_store[ticker] = existing

    return len(new_bars)


# ── Fetch Operations ──────────────────────────────────────────────────────────

async def fetch_prices(request: FetchRequest) -> FetchResult:
    """
    Fetch price data for a single ticker using provider chain with fallback.

    Tries each provider in order until one succeeds.
    """
    providers = _build_provider_chain()

    if not providers:
        return FetchResult(
            ticker=request.ticker,
            provider=DataProvider.YAHOO,
            bars=[],
            success=False,
            error="No data providers available",
        )

    end_date = request.end_date or date.today()
    start_date = request.start_date or (end_date - timedelta(days=request.days))

    for provider in providers:
        result = await provider.fetch_daily(
            ticker=request.ticker,
            start_date=start_date,
            end_date=end_date,
        )

        if result.success and len(result.bars) > 0:
            # Store fetched data
            new_count = store_prices(request.ticker, result.bars)
            logger.info(
                f"Stored {new_count} new bars for {request.ticker} "
                f"(provider: {provider.name.value})"
            )
            return result

        logger.warning(
            f"Provider {provider.name.value} failed for {request.ticker}: {result.error}"
        )

    # All providers failed
    return FetchResult(
        ticker=request.ticker,
        provider=providers[0].name if providers else DataProvider.YAHOO,
        bars=[],
        success=False,
        error="All providers failed",
    )


async def refresh_all(tickers: list[str], days: int = 30) -> RefreshStatus:
    """
    Refresh price data for multiple tickers.

    Used for daily scheduled updates.
    Fetches last N days to fill any gaps.
    """
    start_time = time.time()
    successful = 0
    failed = 0
    skipped = 0
    errors = []

    for ticker in tickers:
        # Check if we already have today's data
        latest = get_latest_price(ticker)
        if latest and latest.date >= date.today() - timedelta(days=1):
            skipped += 1
            continue

        result = await fetch_prices(FetchRequest(ticker=ticker, days=days))

        if result.success:
            successful += 1
        else:
            failed += 1
            errors.append({"ticker": ticker, "error": result.error})

    duration = time.time() - start_time

    return RefreshStatus(
        total_tickers=len(tickers),
        successful=successful,
        failed=failed,
        skipped=skipped,
        errors=errors,
        duration_seconds=round(duration, 2),
    )
