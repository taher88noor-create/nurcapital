"""
Twelve Data Provider — Fallback provider with API key.

Not active in MVP. Placeholder for future use.
Requires TWELVE_DATA_API_KEY environment variable.
"""

import logging
import os
from datetime import date, timedelta
from typing import Optional

import httpx

from app.models.market_data import DataProvider, FetchResult, PriceBar
from app.services.providers.base import BaseDataProvider

logger = logging.getLogger(__name__)

TWELVE_DATA_BASE_URL = "https://api.twelvedata.com"


class TwelveDataProvider(BaseDataProvider):
    """Twelve Data API provider (fallback)."""

    def __init__(self):
        self.api_key = os.getenv("TWELVE_DATA_API_KEY", "")

    @property
    def name(self) -> DataProvider:
        return DataProvider.TWELVE_DATA

    def is_available(self) -> bool:
        """Available only if API key is configured."""
        return bool(self.api_key)

    async def fetch_daily(
        self,
        ticker: str,
        start_date: Optional[date] = None,
        end_date: Optional[date] = None,
    ) -> FetchResult:
        """Fetch daily data from Twelve Data API."""
        if not self.is_available():
            return FetchResult(
                ticker=ticker,
                provider=self.name,
                bars=[],
                success=False,
                error="TWELVE_DATA_API_KEY not configured",
            )

        if end_date is None:
            end_date = date.today()
        if start_date is None:
            start_date = end_date - timedelta(days=365)

        try:
            params = {
                "symbol": ticker,
                "interval": "1day",
                "start_date": start_date.isoformat(),
                "end_date": end_date.isoformat(),
                "apikey": self.api_key,
                "format": "JSON",
            }

            async with httpx.AsyncClient(timeout=30) as client:
                resp = await client.get(f"{TWELVE_DATA_BASE_URL}/time_series", params=params)
                resp.raise_for_status()
                data = resp.json()

            if "values" not in data:
                return FetchResult(
                    ticker=ticker,
                    provider=self.name,
                    bars=[],
                    success=False,
                    error=data.get("message", "No values in response"),
                )

            bars = []
            for item in data["values"]:
                bars.append(
                    PriceBar(
                        date=date.fromisoformat(item["datetime"]),
                        open=float(item["open"]),
                        high=float(item["high"]),
                        low=float(item["low"]),
                        close=float(item["close"]),
                        volume=int(item.get("volume", 0)),
                    )
                )

            # Twelve Data returns newest first, reverse to chronological
            bars.reverse()

            return FetchResult(ticker=ticker, provider=self.name, bars=bars, success=True)

        except Exception as e:
            logger.error(f"Twelve Data error for {ticker}: {e}")
            return FetchResult(
                ticker=ticker, provider=self.name, bars=[], success=False, error=str(e)
            )
