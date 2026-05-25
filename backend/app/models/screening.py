"""
Screening Models — Pydantic schemas for the ethical screening engine.
"""

from datetime import datetime
from enum import Enum
from typing import Optional

from pydantic import BaseModel, Field


class HalalStatus(str, Enum):
    COMPLIANT = "compliant"
    NON_COMPLIANT = "non_compliant"
    REVIEW_NEEDED = "review_needed"


class IsraelExposure(str, Enum):
    CLEAR = "clear"
    IDENTIFIED = "identified"
    NOT_REVIEWED = "not_reviewed"


class ScreeningStatus(str, Enum):
    PENDING = "pending"
    PRELIMINARY = "preliminary"
    REVIEWED = "reviewed"
    VERIFIED = "verified"


class ScreeningDecision(str, Enum):
    APPROVED = "approved"
    WATCHLIST = "watchlist"
    REJECTED = "rejected"


class ExposureFlag(BaseModel):
    """Individual exposure check result."""
    category: str
    detected: bool
    severity: str = "none"  # none, low, medium, high
    explanation: str = ""


class ScreeningInput(BaseModel):
    """Input data for screening an asset."""
    ticker: str
    company_name: str
    sector: Optional[str] = None
    industry: Optional[str] = None
    country: Optional[str] = None
    revenue_breakdown: Optional[dict] = None
    debt_to_market_cap: Optional[float] = None
    interest_income_ratio: Optional[float] = None
    manual_override: Optional[ScreeningDecision] = None
    override_reason: Optional[str] = None


class ScreeningResult(BaseModel):
    """Complete screening output for an asset."""
    ticker: str
    company_name: str
    decision: ScreeningDecision
    halal_status: HalalStatus
    israel_exposure: IsraelExposure
    confidence_score: float = Field(ge=0, le=1)
    screening_status: ScreeningStatus
    exposure_flags: list[ExposureFlag]
    reasoning: list[str]
    notes: Optional[str] = None
    is_override: bool = False
    screened_at: datetime = Field(default_factory=datetime.utcnow)
