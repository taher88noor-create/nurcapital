"""
Yahoo Finance Provider — Fetches daily OHLCV data via yfinance.

Primary provider for MVP. Free, no API key required.
"""

import logging
from datetime import date, datetime, timedelta
from typing import Optional

from app.models.market_data import DataProvider, FetchResult, PriceBar
from app.services.providers.base import BaseDataProvider

logger = logging.getLogger(__name__)


class YahooProvider(BaseDataProvider):
    """Yahoo Finance data provider using yfinance library."""

    @property
    def name(self) -> DataProvider:
        return DataProvider.YAHOO

    def is_available(self) -> bool:
        """Yahoo Finance is always available (no API key needed)."""
        try:
            import yfinance  # noqa: F401
            return True
        except ImportError:
            return False

    async def fetch_daily(
        self,
        ticker: str,
        start_date: Optional[date] = None,
        end_date: Optional[date] = None,
    ) -> FetchResult:
        """
        Fetch daily OHLCV data from Yahoo Finance.

        Args:
            ticker: Stock ticker symbol (e.g., "TSLA", "ASML")
            start_date: Start of date range (default: 1 year ago)
            end_date: End of date range (default: today)

        Returns:
            FetchResult with list of PriceBar objects
        """
        try:
            import yfinance as yf
        except ImportError:
            return FetchResult(
                ticker=ticker,
                provider=self.name,
                bars=[],
                success=False,
                error="yfinance not installed. Run: pip install yfinance",
            )

        if end_date is None:
            end_date = date.today()
        if start_date is None:
            start_date = end_date - timedelta(days=365)

        try:
            stock = yf.Ticker(ticker)
            df = stock.history(
                start=start_date.isoformat(),
                end=end_date.isoformat(),
                interval="1d",
            )

            if df.empty:
                return FetchResult(
                    ticker=ticker,
                    provider=self.name,
                    bars=[],
                    success=False,
                    error=f"No data returned for {ticker}",
                )

            bars = []
            for idx, row in df.iterrows():
                bar_date = idx.date() if hasattr(idx, "date") else idx
                bars.append(
                    PriceBar(
                        date=bar_date,
                        open=round(row.get("Open", 0), 4) if row.get("Open") else None,
                        high=round(row.get("High", 0), 4) if row.get("High") else None,
                        low=round(row.get("Low", 0), 4) if row.get("Low") else None,
                        close=round(row["Close"], 4),
                        volume=int(row.get("Volume", 0)) if row.get("Volume") else None,
                    )
                )

            logger.info(f"Fetched {len(bars)} bars for {ticker} from Yahoo Finance")

            return FetchResult(
                ticker=ticker,
                provider=self.name,
                bars=bars,
                success=True,
            )

        except Exception as e:
            logger.error(f"Yahoo Finance error for {ticker}: {e}")
            return FetchResult(
                ticker=ticker,
                provider=self.name,
                bars=[],
                success=False,
                error=str(e),
            )
