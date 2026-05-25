"""
Eligibility Models — Hard exclusion rule system.

Core philosophy: Assets either PASS, REQUIRE REVIEW, or FAIL.
No weighted scoring. No partial compliance. No ESG-style percentages.
"""

from datetime import datetime
from enum import Enum
from typing import Optional

from pydantic import BaseModel, Field


class EligibilityStatus(str, Enum):
    APPROVED = "approved"
    WATCHLIST = "watchlist"
    REJECTED = "rejected"


class ExclusionCategory(str, Enum):
    GAMBLING = "gambling"
    ALCOHOL = "alcohol"
    INTEREST_BASED_FINANCE = "interest_based_finance"
    WEAPONS = "weapons"
    ISRAEL_EXPOSURE = "israel_exposure"
    ADULT_INDUSTRIES = "adult_industries"
    PROHIBITED_FINANCIAL_STRUCTURES = "prohibited_financial_structures"


class RuleResult(BaseModel):
    """Result of a single exclusion rule check."""
    category: ExclusionCategory
    triggered: bool
    severity: str = "pass"  # pass, review, fail
    explanation: str = ""


class EligibilityInput(BaseModel):
    """Input data for eligibility determination."""
    ticker: str
    company_name: str
    sector: Optional[str] = None
    industry: Optional[str] = None
    country: Optional[str] = None
    debt_to_market_cap: Optional[float] = None
    interest_income_ratio: Optional[float] = None
    manual_override: Optional[EligibilityStatus] = None
    override_reason: Optional[str] = None


class EligibilityResult(BaseModel):
    """Complete eligibility determination output."""
    ticker: str
    company_name: str
    status: EligibilityStatus
    rule_results: list[RuleResult]
    rejection_reasons: list[str]
    review_notes: list[str]
    confidence_level: str = "high"  # high, medium, low
    is_override: bool = False
    reviewed_at: datetime = Field(default_factory=datetime.utcnow)
