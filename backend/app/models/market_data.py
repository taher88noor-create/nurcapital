"""
Market Data Models — Pydantic schemas for price data and provider responses.
"""

from datetime import date, datetime
from enum import Enum
from typing import Optional

from pydantic import BaseModel, Field


class DataProvider(str, Enum):
    YAHOO = "yahoo"
    TWELVE_DATA = "twelve_data"
    ALPHA_VANTAGE = "alpha_vantage"


class PriceBar(BaseModel):
    """Single day OHLCV bar."""
    date: date
    open: Optional[float] = None
    high: Optional[float] = None
    low: Optional[float] = None
    close: float
    volume: Optional[int] = None


class FetchRequest(BaseModel):
    """Request to fetch price data for a ticker."""
    ticker: str
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    days: int = Field(default=365, ge=1, le=3650)


class FetchResult(BaseModel):
    """Result from a data fetch operation."""
    ticker: str
    provider: DataProvider
    bars: list[PriceBar]
    fetched_at: datetime = Field(default_factory=datetime.utcnow)
    success: bool = True
    error: Optional[str] = None


class RefreshStatus(BaseModel):
    """Status of a batch refresh operation."""
    total_tickers: int
    successful: int
    failed: int
    skipped: int
    errors: list[dict] = []
    duration_seconds: float = 0.0
