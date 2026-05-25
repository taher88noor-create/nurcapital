"""
Portfolio Router — API endpoints for portfolio suggestion generation.
"""

from fastapi import APIRouter

from app.models.portfolio import PortfolioRequest, PortfolioResult
from app.services.portfolio_engine import generate_portfolio

router = APIRouter()


@router.post("/suggest", response_model=PortfolioResult)
def suggest_portfolio(request: PortfolioRequest):
    """Generate portfolio allocation suggestions based on asset scores and risk profile."""
    return generate_portfolio(request)


@router.get("/profiles")
def list_risk_profiles():
    """List available risk profiles and their parameters."""
    return {
        "profiles": [
            {
                "id": "conservative",
                "label": "Conservative",
                "description": "Lower risk, higher cash, fewer holdings",
                "typical_cash": "12-18%",
                "max_holdings": 6,
            },
            {
                "id": "balanced",
                "label": "Balanced",
                "description": "Moderate risk, diversified allocation",
                "typical_cash": "6-12%",
                "max_holdings": 8,
            },
            {
                "id": "growth",
                "label": "Growth",
                "description": "Higher risk tolerance, momentum-favoured",
                "typical_cash": "3-8%",
                "max_holdings": 10,
            },
            {
                "id": "aggressive",
                "label": "Aggressive",
                "description": "Maximum equity exposure, concentrated positions",
                "typical_cash": "2-5%",
                "max_holdings": 10,
            },
        ]
    }


@router.get("/signals")
def list_signals():
    """Explain portfolio signal definitions."""
    return {
        "signals": {
            "buy": "Asset scores well across ethical, trend, and momentum factors. Allocate or increase position.",
            "hold": "Asset is acceptable but not top-ranked. Maintain current allocation.",
            "reduce": "Asset scores below threshold. Consider reducing exposure.",
            "watchlist": "Asset is approved but not selected for current portfolio. Monitor for entry.",
        }
    }
