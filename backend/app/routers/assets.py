"""
Assets Router — API endpoints for asset management.
"""

from fastapi import APIRouter

router = APIRouter()


@router.get("/")
def list_assets():
    """List all assets (placeholder — will connect to database)."""
    return {
        "assets": [],
        "total": 0,
        "message": "Connect to database to populate",
    }


@router.get("/{ticker}")
def get_asset(ticker: str):
    """Get a single asset by ticker (placeholder)."""
    return {
        "ticker": ticker.upper(),
        "message": "Connect to database to populate",
    }
