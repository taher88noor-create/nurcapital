"""
Base Provider — Abstract interface for all market data providers.
"""

from abc import ABC, abstractmethod
from datetime import date
from typing import Optional

from app.models.market_data import DataProvider, FetchResult


class BaseDataProvider(ABC):
    """Abstract base class for market data providers."""

    @property
    @abstractmethod
    def name(self) -> DataProvider:
        """Provider identifier."""
        ...

    @abstractmethod
    async def fetch_daily(
        self,
        ticker: str,
        start_date: Optional[date] = None,
        end_date: Optional[date] = None,
    ) -> FetchResult:
        """Fetch daily OHLCV data for a ticker."""
        ...

    @abstractmethod
    def is_available(self) -> bool:
        """Check if the provider is configured and reachable."""
        ...
