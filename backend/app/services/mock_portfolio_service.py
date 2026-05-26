"""
Mock Portfolio Service — True position-tracking paper portfolio.

Tracks quantities, invested amounts, P&L, and transaction history.
NOT live trading. Methodology validation only.
"""

import logging
from datetime import date, datetime
from typing import Optional

from app.models.mock_portfolio import (
    ConvictionLevel,
    MarketRegime,
    PortfolioMetrics,
    PortfolioSignal,
    PortfolioState,
    Position,
    PositionDetail,
    ThesisRecord,
    Transaction,
    TransactionType,
    WeeklyReview,
)

logger = logging.getLogger(__name__)

# ── In-memory stores ──────────────────────────────────────────────────────────

_portfolio = PortfolioState()
_transactions: list[Transaction] = []
_reviews: list[WeeklyReview] = []
_theses: list[ThesisRecord] = []
_tx_counter = 0


def get_portfolio() -> PortfolioState:
    return _portfolio


def get_transactions() -> list[Transaction]:
    return _transactions


def get_reviews() -> list[WeeklyReview]:
    return _reviews


def get_theses() -> list[ThesisRecord]:
    return _theses


# ── Position Operations ───────────────────────────────────────────────────────

def add_position(
    ticker: str,
    company_name: str,
    entry_price: float,
    allocation_pct: float,
    theme: str = "",
    conviction: ConvictionLevel = ConvictionLevel.MEDIUM,
    signal: PortfolioSignal = PortfolioSignal.BUY,
    thesis_summary: str = "",
    invalidation_conditions: Optional[list[str]] = None,
    notes: str = "",
    rationale: str = "",
) -> Position:
    """Simulate buying a position. Calculates quantity from allocation."""
    existing = next((p for p in _portfolio.positions if p.ticker == ticker), None)
    if existing:
        raise ValueError(f"Position {ticker} already exists. Use update_position instead.")

    if allocation_pct > 15:
        raise ValueError(f"Max single position is 15%. Requested: {allocation_pct}%.")

    # Calculate invested amount and quantity
    invested_amount = (_portfolio.starting_capital * allocation_pct) / 100
    if invested_amount > _portfolio.cash_balance:
        raise ValueError(f"Insufficient cash. Need ${invested_amount:.2f}, have ${_portfolio.cash_balance:.2f}.")

    quantity = invested_amount / entry_price if entry_price > 0 else 0

    position = Position(
        ticker=ticker,
        company_name=company_name,
        entry_date=date.today(),
        entry_price=entry_price,
        current_price=entry_price,
        quantity=round(quantity, 4),
        invested_amount=round(invested_amount, 2),
        current_value=round(invested_amount, 2),
        unrealized_pnl=0.0,
        return_pct=0.0,
        target_allocation_pct=allocation_pct,
        theme=theme,
        conviction=conviction,
        signal=signal,
        thesis_summary=thesis_summary,
        invalidation_conditions=invalidation_conditions or [],
        notes=notes,
    )

    _portfolio.positions.append(position)
    _portfolio.cash_balance -= invested_amount
    _portfolio.cash_balance = round(_portfolio.cash_balance, 2)

    _record_transaction(TransactionType.BUY, ticker, company_name, entry_price, quantity, invested_amount, allocation_pct, rationale or f"Initiated {allocation_pct}% position in {ticker}")

    logger.info(f"BUY {ticker}: {quantity:.4f} shares @ ${entry_price:.2f} = ${invested_amount:.2f} ({allocation_pct}%)")
    return position


def reduce_position(ticker: str, reduce_pct: float, rationale: str = "") -> Position:
    """Reduce a position by a percentage of its current value."""
    position = next((p for p in _portfolio.positions if p.ticker == ticker), None)
    if not position:
        raise ValueError(f"Position {ticker} not found.")

    reduce_fraction = reduce_pct / 100
    sell_quantity = position.quantity * reduce_fraction
    sell_value = sell_quantity * position.current_price

    position.quantity = round(position.quantity - sell_quantity, 4)
    position.invested_amount = round(position.invested_amount * (1 - reduce_fraction), 2)
    position.target_allocation_pct = round(position.target_allocation_pct * (1 - reduce_fraction), 1)

    _portfolio.cash_balance += sell_value
    _portfolio.cash_balance = round(_portfolio.cash_balance, 2)

    _recalculate_position(position)
    _record_transaction(TransactionType.REDUCE, ticker, position.company_name, position.current_price, sell_quantity, sell_value, position.target_allocation_pct, rationale or f"Reduced {ticker} by {reduce_pct}%")

    logger.info(f"REDUCE {ticker}: sold {sell_quantity:.4f} shares @ ${position.current_price:.2f} = ${sell_value:.2f}")
    return position


def exit_position(ticker: str, rationale: str = "") -> dict:
    """Fully exit a position. Returns proceeds to cash."""
    position = next((p for p in _portfolio.positions if p.ticker == ticker), None)
    if not position:
        raise ValueError(f"Position {ticker} not found.")

    proceeds = position.quantity * position.current_price
    _portfolio.cash_balance += proceeds
    _portfolio.cash_balance = round(_portfolio.cash_balance, 2)

    _record_transaction(TransactionType.EXIT, ticker, position.company_name, position.current_price, position.quantity, proceeds, 0, rationale or f"Exited {ticker} — full position sold")

    _portfolio.positions = [p for p in _portfolio.positions if p.ticker != ticker]

    logger.info(f"EXIT {ticker}: sold all for ${proceeds:.2f}")
    return {"ticker": ticker, "action": "exited", "proceeds": round(proceeds, 2), "pnl": round(proceeds - position.invested_amount, 2)}


def update_position(
    ticker: str,
    signal: Optional[PortfolioSignal] = None,
    conviction: Optional[ConvictionLevel] = None,
    notes: Optional[str] = None,
) -> Position:
    """Update position metadata (signal, conviction, notes)."""
    position = next((p for p in _portfolio.positions if p.ticker == ticker), None)
    if not position:
        raise ValueError(f"Position {ticker} not found.")

    if signal is not None:
        position.signal = signal
    if conviction is not None:
        position.conviction = conviction
    if notes is not None:
        position.notes = notes

    return position


# ── Price Updates ─────────────────────────────────────────────────────────────

def update_prices(price_map: dict[str, float]) -> int:
    """Update current prices and recalculate all position metrics."""
    updated = 0
    for position in _portfolio.positions:
        if position.ticker in price_map:
            position.current_price = price_map[position.ticker]
            _recalculate_position(position)
            updated += 1

    _portfolio.last_price_refresh = datetime.utcnow()
    return updated


def set_regime(regime: MarketRegime) -> dict:
    old_regime = _portfolio.regime
    _portfolio.regime = regime
    _record_transaction(TransactionType.CASH_ADJUSTMENT, "", "", 0, 0, 0, 0, f"Regime changed: {old_regime.value} → {regime.value}")
    return {"previous": old_regime.value, "current": regime.value}


# ── Metrics ───────────────────────────────────────────────────────────────────

def calculate_metrics() -> PortfolioMetrics:
    """Calculate portfolio metrics with true P&L."""
    positions = _portfolio.positions
    capital = _portfolio.starting_capital

    if not positions:
        return PortfolioMetrics(
            starting_capital=capital,
            total_invested=0,
            total_current_value=0,
            total_portfolio_value=_portfolio.cash_balance,
            total_unrealized_pnl=0,
            total_return_pct=0,
            cash_balance=_portfolio.cash_balance,
            cash_pct=100.0,
            equity_pct=0.0,
            position_count=0,
            theme_count=0,
            largest_position_pct=0,
            largest_theme_pct=0,
            regime=_portfolio.regime,
        )

    total_invested = sum(p.invested_amount for p in positions)
    total_current_value = sum(p.current_value for p in positions)
    total_unrealized_pnl = total_current_value - total_invested
    total_portfolio_value = total_current_value + _portfolio.cash_balance
    total_return_pct = ((total_portfolio_value - capital) / capital) * 100

    # Theme weights based on current value
    theme_weights: dict[str, float] = {}
    for p in positions:
        theme = p.theme or "Unclassified"
        pct = (p.current_value / total_portfolio_value * 100) if total_portfolio_value > 0 else 0
        theme_weights[theme] = theme_weights.get(theme, 0) + pct

    largest_pos = max((p.actual_allocation_pct for p in positions), default=0)
    largest_theme = max(theme_weights.values(), default=0)
    cash_pct = (_portfolio.cash_balance / total_portfolio_value * 100) if total_portfolio_value > 0 else 100

    return PortfolioMetrics(
        starting_capital=capital,
        total_invested=round(total_invested, 2),
        total_current_value=round(total_current_value, 2),
        total_portfolio_value=round(total_portfolio_value, 2),
        total_unrealized_pnl=round(total_unrealized_pnl, 2),
        total_return_pct=round(total_return_pct, 2),
        cash_balance=_portfolio.cash_balance,
        cash_pct=round(cash_pct, 1),
        equity_pct=round(100 - cash_pct, 1),
        position_count=len(positions),
        theme_count=len(theme_weights),
        largest_position_pct=round(largest_pos, 1),
        largest_theme_pct=round(largest_theme, 1),
        regime=_portfolio.regime,
    )


def get_position_details() -> list[PositionDetail]:
    """Get full position details with P&L for dashboard."""
    metrics = calculate_metrics()
    total_value = metrics.total_portfolio_value
    results = []

    for p in _portfolio.positions:
        actual_pct = (p.current_value / total_value * 100) if total_value > 0 else 0
        drift = actual_pct - p.target_allocation_pct

        results.append(PositionDetail(
            ticker=p.ticker,
            company_name=p.company_name,
            entry_price=p.entry_price,
            current_price=p.current_price,
            quantity=p.quantity,
            invested_amount=p.invested_amount,
            current_value=p.current_value,
            unrealized_pnl=p.unrealized_pnl,
            return_pct=p.return_pct,
            target_allocation_pct=p.target_allocation_pct,
            actual_allocation_pct=round(actual_pct, 1),
            allocation_drift_pct=round(drift, 1),
            theme=p.theme,
            signal=p.signal,
            conviction=p.conviction,
            entry_date=p.entry_date,
        ))

    results.sort(key=lambda x: x.return_pct, reverse=True)
    return results


# ── Thesis Management ─────────────────────────────────────────────────────────

def add_thesis(
    ticker: str,
    thesis_statement: str,
    macro_drivers: Optional[list[str]] = None,
    risk_considerations: Optional[list[str]] = None,
    invalidation_conditions: Optional[list[str]] = None,
    conviction: ConvictionLevel = ConvictionLevel.MEDIUM,
) -> ThesisRecord:
    position = next((p for p in _portfolio.positions if p.ticker == ticker), None)
    company_name = position.company_name if position else ticker
    thesis_id = f"{ticker}-{date.today().year}-Q{(date.today().month - 1) // 3 + 1}"

    thesis = ThesisRecord(
        ticker=ticker, company_name=company_name, thesis_id=thesis_id,
        created_date=date.today(), conviction=conviction,
        thesis_statement=thesis_statement,
        macro_drivers=macro_drivers or [],
        risk_considerations=risk_considerations or [],
        invalidation_conditions=invalidation_conditions or [],
    )
    _theses.append(thesis)
    return thesis


def get_thesis_for_ticker(ticker: str) -> list[ThesisRecord]:
    return [t for t in _theses if t.ticker == ticker]


# ── Weekly Review ─────────────────────────────────────────────────────────────

def create_weekly_review(actions_taken: Optional[list[str]] = None, notes: str = "") -> WeeklyReview:
    metrics = calculate_metrics()
    alerts = []
    if metrics.largest_position_pct > 12:
        alerts.append(f"Position concentration: largest at {metrics.largest_position_pct}%")
    if metrics.largest_theme_pct > 35:
        alerts.append(f"Theme concentration: largest at {metrics.largest_theme_pct}%")
    if metrics.cash_pct < 10:
        alerts.append(f"Low cash: {metrics.cash_pct}%")
    if metrics.total_return_pct < -10:
        alerts.append(f"Drawdown alert: {metrics.total_return_pct}%")

    review = WeeklyReview(
        review_date=date.today(), regime=_portfolio.regime,
        portfolio_value=metrics.total_portfolio_value,
        portfolio_return_pct=metrics.total_return_pct,
        cash_pct=metrics.cash_pct, position_count=metrics.position_count,
        alerts=alerts, actions_taken=actions_taken or [], notes=notes,
    )
    _reviews.append(review)
    _portfolio.last_review_date = date.today()
    return review


# ── Seed Portfolio ────────────────────────────────────────────────────────────

def seed_demo_portfolio() -> PortfolioState:
    """Seed with true position tracking — quantities calculated from allocation."""
    global _portfolio, _theses, _transactions, _tx_counter
    _portfolio = PortfolioState(starting_capital=100000.0, cash_balance=100000.0, regime=MarketRegime.WEAK_BULL)
    _theses = []
    _transactions = []
    _tx_counter = 0

    demo = [
        ("TSM", "Taiwan Semiconductor", 165.20, 178.52, 12, "Semiconductors", ConvictionLevel.HIGH, PortfolioSignal.BUY, "Leading foundry. AI demand structural. Monopoly in advanced nodes."),
        ("ASML", "ASML Holding", 878.50, 924.30, 10, "Semiconductors", ConvictionLevel.HIGH, PortfolioSignal.BUY, "Sole EUV manufacturer. Multi-year backlog."),
        ("HLAL", "Wahed FTSE USA Shariah ETF", 40.75, 42.15, 15, "Halal Finance", ConvictionLevel.HIGH, PortfolioSignal.HOLD, "Core Sharia-compliant US equity anchor."),
        ("LLY", "Eli Lilly", 730.00, 820.40, 8, "Healthcare", ConvictionLevel.HIGH, PortfolioSignal.BUY, "GLP-1 leader. $100B+ obesity TAM."),
        ("CRWD", "CrowdStrike", 322.80, 355.20, 7, "Cybersecurity", ConvictionLevel.HIGH, PortfolioSignal.BUY, "Endpoint security leader. 97% retention."),
        ("AMD", "Advanced Micro Devices", 155.40, 162.30, 7, "Semiconductors", ConvictionLevel.HIGH, PortfolioSignal.BUY, "MI300 AI accelerator gaining share."),
        ("AVGO", "Broadcom", 168.20, 178.50, 7, "Semiconductors", ConvictionLevel.HIGH, PortfolioSignal.BUY, "Custom AI chips for Google/Meta."),
        ("2222.SR", "Saudi Aramco", 8.02, 8.25, 8, "Oil & Gas", ConvictionLevel.HIGH, PortfolioSignal.HOLD, "Lowest-cost producer. 4%+ dividend."),
        ("ABB", "ABB Ltd", 50.60, 52.80, 6, "Industrial Automation", ConvictionLevel.HIGH, PortfolioSignal.HOLD, "Global automation leader. Swiss quality."),
    ]

    for ticker, name, entry, current, alloc, theme, conv, signal, thesis in demo:
        invested = (_portfolio.starting_capital * alloc) / 100
        qty = invested / entry
        pos = Position(
            ticker=ticker, company_name=name, entry_date=date(2025, 3, 15),
            entry_price=entry, current_price=current, quantity=round(qty, 4),
            invested_amount=round(invested, 2), target_allocation_pct=alloc,
            theme=theme, conviction=conv, signal=signal, thesis_summary=thesis,
        )
        _recalculate_position(pos)
        _portfolio.positions.append(pos)
        _portfolio.cash_balance -= invested

    _portfolio.cash_balance = round(_portfolio.cash_balance, 2)

    # Record seed transactions
    for pos in _portfolio.positions:
        _record_transaction(TransactionType.BUY, pos.ticker, pos.company_name, pos.entry_price, pos.quantity, pos.invested_amount, pos.target_allocation_pct, f"Initial allocation: {pos.thesis_summary}")

    # Add theses
    add_thesis("TSM", "Leading foundry with monopoly in advanced nodes benefiting from structural AI demand",
               macro_drivers=["AI training demand 40%+ YoY", "CHIPS Act reshoring", "2nm production 2025-2026"],
               risk_considerations=["Taiwan geopolitics", "Customer concentration (Apple 25%)"],
               invalidation_conditions=["Loss of Apple/NVIDIA as customer", "China-Taiwan military escalation"],
               conviction=ConvictionLevel.HIGH)
    add_thesis("LLY", "GLP-1 category leader with $100B+ obesity TAM",
               macro_drivers=["Obesity market <5% penetrated", "Zepbound best-in-class efficacy"],
               risk_considerations=["Premium valuation", "Manufacturing constraints"],
               invalidation_conditions=["Serious safety signal", "Generic competition before 2032"],
               conviction=ConvictionLevel.HIGH)
    add_thesis("CRWD", "Cloud-native endpoint security leader",
               macro_drivers=["Non-discretionary spend", "Platform consolidation", "Charlotte AI"],
               risk_considerations=["July 2024 outage risk", "Microsoft competition"],
               invalidation_conditions=["Retention drops below 90%", "Major platform breach"],
               conviction=ConvictionLevel.HIGH)

    logger.info(f"Seeded: {len(_portfolio.positions)} positions, cash ${_portfolio.cash_balance:.2f}")
    return _portfolio


# ── Internal Helpers ──────────────────────────────────────────────────────────

def _recalculate_position(position: Position):
    """Recalculate derived fields for a position."""
    position.current_value = round(position.quantity * position.current_price, 2)
    position.unrealized_pnl = round(position.current_value - position.invested_amount, 2)
    position.return_pct = round(((position.current_price - position.entry_price) / position.entry_price) * 100, 2) if position.entry_price > 0 else 0

    # Actual allocation based on total portfolio value
    total_value = sum(p.quantity * p.current_price for p in _portfolio.positions) + _portfolio.cash_balance
    position.actual_allocation_pct = round((position.current_value / total_value) * 100, 1) if total_value > 0 else 0


def _record_transaction(tx_type: TransactionType, ticker: str, company_name: str, price: float, quantity: float, amount: float, allocation_pct: float, rationale: str):
    global _tx_counter
    _tx_counter += 1
    _transactions.append(Transaction(
        id=_tx_counter, transaction_type=tx_type, ticker=ticker,
        company_name=company_name, price=round(price, 2),
        quantity=round(quantity, 4), amount=round(amount, 2),
        allocation_pct=allocation_pct, rationale=rationale,
        regime_at_time=_portfolio.regime,
    ))
