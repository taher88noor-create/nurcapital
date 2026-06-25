"""
Yahoo Finance Provider — Fetches daily prices via Yahoo Finance chart API.

Uses direct HTTP requests instead of yfinance library to avoid
IP blocking on cloud hosting platforms (Render, Railway, etc).
"""

import logging
from datetime import date, timedelta
from typing import Optional

import httpx

from app.models.market_data import DataProvider, FetchResult, PriceBar
from app.services.providers.base import BaseDataProvider

logger = logging.getLogger(__name__)

YAHOO_CHART_URL = "https://query1.finance.yahoo.com/v8/finance/chart/{ticker}"


class YahooProvider(BaseDataProvider):
    """Yahoo Finance data provider using direct chart API."""

    @property
    def name(self) -> DataProvider:
        return DataProvider.YAHOO

    def is_available(self) -> bool:
        return True

    async def fetch_daily(
        self,
        ticker: str,
        start_date: Optional[date] = None,
        end_date: Optional[date] = None,
    ) -> FetchResult:
        """Fetch daily OHLCV via Yahoo Finance chart API."""
        if end_date is None:
            end_date = date.today()
        if start_date is None:
            start_date = end_date - timedelta(days=7)

        period1 = int((start_date - date(1970, 1, 1)).total_seconds())
        period2 = int((end_date - date(1970, 1, 1)).total_seconds()) + 86400

        url = YAHOO_CHART_URL.format(ticker=ticker)
        params = {
            "period1": str(period1),
            "period2": str(period2),
            "interval": "1d",
            "includePrePost": "false",
        }
        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        }

        try:
            async with httpx.AsyncClient(timeout=30, follow_redirects=True) as client:
                resp = await client.get(url, params=params, headers=headers)

            if resp.status_code == 404:
                return FetchResult(
                    ticker=ticker, provider=self.name, bars=[],
                    success=False, error=f"Ticker {ticker} not found on Yahoo Finance",
                )

            if resp.status_code != 200:
                return FetchResult(
                    ticker=ticker, provider=self.name, bars=[],
                    success=False, error=f"Yahoo returned HTTP {resp.status_code}",
                )

            data = resp.json()
            chart = data.get("chart", {}).get("result")
            if not chart:
                error_msg = data.get("chart", {}).get("error", {}).get("description", "No chart data")
                return FetchResult(
                    ticker=ticker, provider=self.name, bars=[],
                    success=False, error=error_msg,
                )

            result = chart[0]
            timestamps = result.get("timestamp", [])
            quote = result.get("indicators", {}).get("quote", [{}])[0]

            if not timestamps:
                return FetchResult(
                    ticker=ticker, provider=self.name, bars=[],
                    success=False, error=f"No timestamps for {ticker}",
                )

            bars = []
            opens = quote.get("open", [])
            highs = quote.get("high", [])
            lows = quote.get("low", [])
            closes = quote.get("close", [])
            volumes = quote.get("volume", [])

            for i, ts in enumerate(timestamps):
                close_val = closes[i] if i < len(closes) else None
                if close_val is None:
                    continue
                bar_date = date.fromtimestamp(ts)
                bars.append(PriceBar(
                    date=bar_date,
                    open=round(opens[i], 4) if i < len(opens) and opens[i] else None,
                    high=round(highs[i], 4) if i < len(highs) and highs[i] else None,
                    low=round(lows[i], 4) if i < len(lows) and lows[i] else None,
                    close=round(close_val, 4),
                    volume=int(volumes[i]) if i < len(volumes) and volumes[i] else None,
                ))

            if not bars:
                return FetchResult(
                    ticker=ticker, provider=self.name, bars=[],
                    success=False, error=f"No valid price bars for {ticker}",
                )

            logger.info(f"Fetched {len(bars)} bars for {ticker} from Yahoo Chart API")
            return FetchResult(ticker=ticker, provider=self.name, bars=bars, success=True)

        except httpx.TimeoutException:
            return FetchResult(
                ticker=ticker, provider=self.name, bars=[],
                success=False, error=f"Timeout fetching {ticker}",
            )
        except Exception as e:
            logger.error(f"Yahoo Chart API error for {ticker}: {e}")
            return FetchResult(
                ticker=ticker, provider=self.name, bars=[],
                success=False, error=str(e),
            )
