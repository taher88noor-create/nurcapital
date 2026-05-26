"""
Mock Portfolio Models — Paper portfolio with true position tracking.

This is NOT live trading. This is a simulation system for validating
the Nür Capital investment methodology with real market prices.
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


class TransactionType(str, Enum):
    BUY = "buy"
    REDUCE = "reduce"
    EXIT = "exit"
    REBALANCE = "rebalance"
    CASH_ADJUSTMENT = "cash_adjustment"


class Position(BaseModel):
    """A single position with true quantity tracking."""
    ticker: str
    company_name: str
    entry_date: date
    entry_price: float
    current_price: float = 0.0
    quantity: float = 0.0
    invested_amount: float = 0.0
    current_value: float = 0.0
    unrealized_pnl: float = 0.0
    return_pct: float = 0.0
    target_allocation_pct: float = Field(ge=0, le=15)
    actual_allocation_pct: float = 0.0
    theme: str = ""
    conviction: ConvictionLevel = ConvictionLevel.MEDIUM
    signal: PortfolioSignal = PortfolioSignal.HOLD
    thesis_summary: str = ""
    invalidation_conditions: list[str] = []
    notes: str = ""


class Transaction(BaseModel):
    """A single transaction in the portfolio journal."""
    id: int = 0
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    transaction_type: TransactionType
    ticker: str = ""
    company_name: str = ""
    price: float = 0.0
    quantity: float = 0.0
    amount: float = 0.0
    allocation_pct: float = 0.0
    rationale: str = ""
    regime_at_time: MarketRegime = MarketRegime.WEAK_BULL


class PortfolioState(BaseModel):
    """Complete mock portfolio state."""
    positions: list[Position] = []
    cash_balance: float = 100000.0
    starting_capital: float = 100000.0
    regime: MarketRegime = MarketRegime.WEAK_BULL
    last_review_date: Optional[date] = None
    last_price_refresh: Optional[datetime] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)


class PortfolioMetrics(BaseModel):
    """Calculated portfolio metrics."""
    starting_capital: float
    total_invested: float
    total_current_value: float
    total_portfolio_value: float
    total_unrealized_pnl: float
    total_return_pct: float
    cash_balance: float
    cash_pct: float
    equity_pct: float
    position_count: int
    theme_count: int
    largest_position_pct: float
    largest_theme_pct: float
    regime: MarketRegime


class PositionDetail(BaseModel):
    """Full position detail for dashboard display."""
    ticker: str
    company_name: str
    entry_price: float
    current_price: float
    quantity: float
    invested_amount: float
    current_value: float
    unrealized_pnl: float
    return_pct: float
    target_allocation_pct: float
    actual_allocation_pct: float
    allocation_drift_pct: float
    theme: str
    signal: PortfolioSignal
    conviction: ConvictionLevel
    entry_date: date


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
    status: str = "active"
    conviction: ConvictionLevel
    thesis_statement: str
    macro_drivers: list[str] = []
    risk_considerations: list[str] = []
    invalidation_conditions: list[str] = []
    review_log: list[str] = []
