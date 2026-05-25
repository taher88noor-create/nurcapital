"""
Mock Portfolio Models — Paper portfolio tracking for methodology validation.

This is NOT live trading. This is a simulation system for validating
the Nür Capital investment methodology.
"""

from datetime import date, datetime
from enum import Enum
from typing import Optional

from pydantic import BaseModel, Field


class PortfolioSignal(str, Enum):
    BUY = "buy"
    HOLD = "hold"
    REDUCE = "reduce"
    WATCHLIST = "watchlist"


class MarketRegime(str, Enum):
    STRONG_BULL = "strong_bull"
    WEAK_BULL = "weak_bull"
    SIDEWAYS = "sideways"
    HIGH_VOLATILITY = "high_volatility"
    DEFENSIVE = "defensive"


class ConvictionLevel(str, Enum):
    HIGH = "high"
    MEDIUM = "medium"
    LOW = "low"


class Position(BaseModel):
    """A single position in the mock portfolio."""
    ticker: str
    company_name: str
    entry_date: date
    entry_price: float
    current_price: float = 0.0
    target_allocation_pct: float = Field(ge=0, le=15)
    theme: str = ""
    conviction: ConvictionLevel = ConvictionLevel.MEDIUM
    signal: PortfolioSignal = PortfolioSignal.HOLD
    thesis_summary: str = ""
    invalidation_conditions: list[str] = []
    notes: str = ""


class PortfolioState(BaseModel):
    """Complete mock portfolio state."""
    positions: list[Position] = []
    cash_pct: float = 100.0
    starting_capital: float = 100000.0
    regime: MarketRegime = MarketRegime.WEAK_BULL
    last_review_date: Optional[date] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)


class PortfolioMetrics(BaseModel):
    """Calculated portfolio metrics."""
    total_value: float
    total_return_pct: float
    cash_pct: float
    equity_pct: float
    position_count: int
    theme_count: int
    largest_position_pct: float
    largest_theme_pct: float
    regime: MarketRegime


class PositionPerformance(BaseModel):
    """Performance data for a single position."""
    ticker: str
    company_name: str
    entry_price: float
    current_price: float
    return_pct: float
    allocation_pct: float
    theme: str
    signal: PortfolioSignal
    conviction: ConvictionLevel


class WeeklyReview(BaseModel):
    """Weekly review record."""
    review_date: date
    regime: MarketRegime
    portfolio_value: float
    portfolio_return_pct: float
    cash_pct: float
    position_count: int
    alerts: list[str] = []
    actions_taken: list[str] = []
    notes: str = ""


class ThesisRecord(BaseModel):
    """Investment thesis for a position."""
    ticker: str
    company_name: str
    thesis_id: str
    created_date: date
    status: str = "active"  # active, validated, invalidated, expired
    conviction: ConvictionLevel
    thesis_statement: str
    macro_drivers: list[str] = []
    risk_considerations: list[str] = []
    invalidation_conditions: list[str] = []
    review_log: list[str] = []
