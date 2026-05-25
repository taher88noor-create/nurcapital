"""
Daily Refresh Script — Fetches latest price data for all approved assets.

Run via cron or scheduler:
  python scripts/daily_refresh.py

Or via GitHub Actions / scheduled task.
"""

import asyncio
import sys
import os

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.services.market_data_service import refresh_all


# ── Approved tickers to refresh daily ─────────────────────────────────────────

APPROVED_TICKERS = [
    "TSLA",
    "NOVO-B.CO",  # Novo Nordisk (Copenhagen)
    "ASML",
    "TSM",
    "CRM",
    "COST",
    "LLY",
    "AMD",
    "NFLX",
    "AVGO",
]


async def main():
    print("=" * 50)
    print("Nür Capital — Daily Price Refresh")
    print("=" * 50)
    print(f"Tickers: {len(APPROVED_TICKERS)}")
    print()

    result = await refresh_all(APPROVED_TICKERS, days=30)

    print(f"✓ Successful: {result.successful}")
    print(f"⏭ Skipped (already fresh): {result.skipped}")
    print(f"✗ Failed: {result.failed}")
    print(f"⏱ Duration: {result.duration_seconds}s")

    if result.errors:
        print("\nErrors:")
        for err in result.errors:
            print(f"  - {err['ticker']}: {err['error']}")

    print("\nDone.")


if __name__ == "__main__":
    asyncio.run(main())
