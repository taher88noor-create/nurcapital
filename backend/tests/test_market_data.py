"""
Tests for the market data engine.
"""

import pytest
from datetime import date

from app.models.market_data import FetchRequest, PriceBar
from app.services.market_data_service import (
    get_stored_prices,
    store_prices,
    get_latest_price,
)


def test_store_prices():
    """Should store price bars and deduplicate."""
    bars = [
        PriceBar(date=date(2026, 5, 20), close=150.0, open=148.0, high=151.0, low=147.0, volume=1000000),
        PriceBar(date=date(2026, 5, 21), close=152.0, open=150.0, high=153.0, low=149.0, volume=1100000),
    ]
    added = store_prices("TEST1", bars)
    assert added == 2

    # Store again — should deduplicate
    added_again = store_prices("TEST1", bars)
    assert added_again == 0

    # Total stored should still be 2
    stored = get_stored_prices("TEST1")
    assert len(stored) == 2


def test_store_prices_merge():
    """Should merge new bars with existing."""
    bars1 = [PriceBar(date=date(2026, 5, 20), close=150.0)]
    bars2 = [PriceBar(date=date(2026, 5, 21), close=152.0)]

    store_prices("TEST2", bars1)
    store_prices("TEST2", bars2)

    stored = get_stored_prices("TEST2")
    assert len(stored) == 2
    assert stored[0].date < stored[1].date  # Chronological order


def test_get_latest_price():
    """Should return the most recent bar."""
    bars = [
        PriceBar(date=date(2026, 5, 18), close=145.0),
        PriceBar(date=date(2026, 5, 19), close=147.0),
        PriceBar(date=date(2026, 5, 20), close=150.0),
    ]
    store_prices("TEST3", bars)

    latest = get_latest_price("TEST3")
    assert latest is not None
    assert latest.date == date(2026, 5, 20)
    assert latest.close == 150.0


def test_get_latest_price_empty():
    """Should return None for unknown ticker."""
    latest = get_latest_price("UNKNOWN_TICKER_XYZ")
    assert latest is None


def test_get_stored_prices_empty():
    """Should return empty list for unknown ticker."""
    bars = get_stored_prices("NONEXISTENT")
    assert bars == []


@pytest.mark.asyncio
async def test_fetch_request_model():
    """FetchRequest should validate correctly."""
    req = FetchRequest(ticker="TSLA", days=90)
    assert req.ticker == "TSLA"
    assert req.days == 90
    assert req.start_date is None
