"""
Portfolio Models — Allocation engine schemas.

IMPORTANT: This engine only operates on APPROVED assets.
Eligibility is determined upstream by the Eligibility Engine.
No ethical scoring happens here — only trend, momentum, and risk.
"""

from datetime import datetime
from enum import Enum
from typing import Optional

from pydantic import BaseModel, Field


class Signal(str, Enum):
    BUY = "buy"
    HOLD = "hold"
    REDUCE = "reduce"
    WATCHLIST = "watchlist"


class RiskProfile(str, Enum):
    CONSERVATIVE = "conservative"
    BALANCED = "balanced"
    GROWTH = "growth"
    AGGRESSIVE = "aggressive"


class MarketCondition(str, Enum):
    BULLISH = "bullish"
    NEUTRAL = "neutral"
    BEARISH = "bearish"
    VOLATILE = "volatile"


class ApprovedAsset(BaseModel):
    """
    An asset that has PASSED the Eligibility Engine.
    Only approved assets enter the portfolio engine.
    """
    ticker: str
    company_name: str
    trend_score: float = Field(ge=-1, le=1, description="From Trend Engine. Positive = uptrend")
    momentum_score: float = Field(ge=-1, le=1, description="From Trend Engine. Recent momentum")
    volatility_score: float = Field(ge=0, le=1, description="From Risk Engine. 0=stable, 1=volatile")
    sector: Optional[str] = None
    theme: Optional[str] = None


class PortfolioRequest(BaseModel):
    """Request to generate portfolio suggestions. ALL assets must be pre-approved."""
    assets: list[ApprovedAsset]
    risk_profile: RiskProfile = RiskProfile.BALANCED
    market_condition: MarketCondition = MarketCondition.NEUTRAL
    max_holdings: int = Field(default=8, ge=3, le=15)
    max_single_allocation: float = Field(default=20.0, ge=5, le=40)
    cash_minimum: float = Field(default=5.0, ge=0, le=50)


class AssetSuggestion(BaseModel):
    """Suggestion for a single approved asset."""
    ticker: str
    company_name: str
    signal: Signal
    allocation_pct: float = Field(ge=0, le=100)
    attractiveness_score: float = Field(ge=0, le=100)
    reasoning: list[str]


class PortfolioResult(BaseModel):
    """Complete portfolio suggestion output."""
    suggestions: list[AssetSuggestion]
    cash_allocation_pct: float
    portfolio_score: float = Field(ge=0, le=100)
    risk_profile: RiskProfile
    market_condition: MarketCondition
    total_holdings: int
    reasoning: list[str]
    generated_at: datetime = Field(default_factory=datetime.utcnow)
