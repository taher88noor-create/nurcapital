"""
Screening Router — API endpoints for the ethical screening engine.
"""

from fastapi import APIRouter

from app.models.screening import ScreeningInput, ScreeningResult
from app.services.screening_service import batch_screen, screen_asset

router = APIRouter()


@router.post("/screen", response_model=ScreeningResult)
def screen_single_asset(input: ScreeningInput):
    """Screen a single asset through the ethical screening engine."""
    return screen_asset(input)


@router.post("/batch", response_model=list[ScreeningResult])
def screen_batch(inputs: list[ScreeningInput]):
    """Screen multiple assets in a single request."""
    return batch_screen(inputs)


@router.get("/rules")
def list_rules():
    """List all active screening rules and their categories."""
    return {
        "rules": [
            {"category": "gambling", "type": "business_activity", "severity_if_detected": "high"},
            {"category": "alcohol", "type": "business_activity", "severity_if_detected": "high"},
            {"category": "weapons", "type": "business_activity", "severity_if_detected": "high"},
            {"category": "interest_based_finance", "type": "financial_ratio", "severity_if_detected": "high/medium"},
            {"category": "israel_exposure", "type": "operational_presence", "severity_if_detected": "high"},
        ],
        "decision_logic": {
            "approved": "No disqualifying exposure detected",
            "watchlist": "Medium-severity concerns requiring further review",
            "rejected": "High-severity exposure in any category",
        },
    }
