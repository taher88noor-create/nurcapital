"""
Eligibility Router — API endpoints for the hard exclusion eligibility engine.
"""

from fastapi import APIRouter

from app.models.eligibility import EligibilityInput, EligibilityResult
from app.services.eligibility_engine import batch_eligibility, determine_eligibility

router = APIRouter()


@router.post("/check", response_model=EligibilityResult)
def check_eligibility(input: EligibilityInput):
    """Check eligibility for a single asset. Returns APPROVED, WATCHLIST, or REJECTED."""
    return determine_eligibility(input)


@router.post("/batch", response_model=list[EligibilityResult])
def check_batch(inputs: list[EligibilityInput]):
    """Check eligibility for multiple assets."""
    return batch_eligibility(inputs)


@router.get("/rules")
def list_exclusion_rules():
    """List all hard exclusion categories and their logic."""
    return {
        "philosophy": "Hard exclusion. Assets either PASS, REQUIRE REVIEW, or FAIL. No weighted scoring.",
        "rules": [
            {"category": "gambling", "severity": "fail", "description": "Any gambling business activity"},
            {"category": "alcohol", "severity": "fail", "description": "Alcohol production or distribution"},
            {"category": "weapons", "severity": "fail", "description": "Weapons manufacturing or significant defence revenue"},
            {"category": "interest_based_finance", "severity": "fail", "description": "Conventional interest-based finance as core business"},
            {"category": "israel_exposure", "severity": "fail", "description": "Identified Israel-linked operational or procurement exposure"},
            {"category": "adult_industries", "severity": "fail", "description": "Adult/pornography industries"},
            {"category": "prohibited_financial_structures", "severity": "fail", "description": "Leveraged, inverse, or prohibited financial products"},
        ],
        "statuses": {
            "approved": "Passes all rules. Enters investment universe.",
            "watchlist": "Borderline on one or more rules. Requires manual review.",
            "rejected": "Fails one or more hard exclusion rules. Cannot enter investment universe.",
        },
    }
