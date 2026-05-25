"""
Mock Portfolio Service — Paper portfolio engine for methodology validation.

NOT live trading. Simulates allocation decisions using approved assets only.
Tracks performance, theses, and review history.
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
    PositionPerformance,
    ThesisRecord,
    WeeklyReview,
)

logger = logging.getLogger(__name__)

# ── In-memory stores ──────────────────────────────────────────────────────────

_portfolio = PortfolioState()
_reviews: list[WeeklyReview] = []
_theses: list[ThesisRecord] = []


def get_portfolio() -> PortfolioState:
    """Get current portfolio state."""
    return _portfolio


def get_reviews() -> list[WeeklyReview]:
    """Get all weekly reviews."""
    return _reviews


def get_theses() -> list[ThesisRecord]:
    """Get all investment theses."""
    return _theses


# ── Portfolio Operations ──────────────────────────────────────────────────────

def add_position(
    ticker: str,
    company_name: str,
    entry_price: float,
    target_allocation_pct: float,
    theme: str = "",
    conviction: ConvictionLevel = ConvictionLevel.MEDIUM,
    signal: PortfolioSignal = PortfolioSignal.BUY,
    thesis_summary: str = "",
    invalidation_conditions: Optional[list[str]] = None,
    notes: str = "",
) -> Position:
    """Add a new position to the mock portfolio."""
    # Check if position already exists
    existing = next((p for p in _portfolio.positions if p.ticker == ticker), None)
    if existing:
        raise ValueError(f"Position {ticker} already exists. Use update_position instead.")

    # Check allocation limits
    current_equity = sum(p.target_allocation_pct for p in _portfolio.positions)
    if current_equity + target_allocation_pct > 95:
        raise ValueError(f"Cannot allocate {target_allocation_pct}%. Current equity: {current_equity}%. Max: 95%.")

    if target_allocation_pct > 15:
        raise ValueError(f"Max single position is 15%. Requested: {target_allocation_pct}%.")

    position = Position(
        ticker=ticker,
        company_name=company_name,
        entry_date=date.today(),
        entry_price=entry_price,
        current_price=entry_price,
        target_allocation_pct=target_allocation_pct,
        theme=theme,
        conviction=conviction,
        signal=signal,
        thesis_summary=thesis_summary,
        invalidation_conditions=invalidation_conditions or [],
        notes=notes,
    )

    _portfolio.positions.append(position)
    _recalculate_cash()

    logger.info(f"Added position: {ticker} at {target_allocation_pct}%")
    return position


def update_position(
    ticker: str,
    target_allocation_pct: Optional[float] = None,
    signal: Optional[PortfolioSignal] = None,
    conviction: Optional[ConvictionLevel] = None,
    notes: Optional[str] = None,
) -> Position:
    """Update an existing position."""
    position = next((p for p in _portfolio.positions if p.ticker == ticker), None)
    if not position:
        raise ValueError(f"Position {ticker} not found.")

    if target_allocation_pct is not None:
        if target_allocation_pct > 15:
            raise ValueError(f"Max single position is 15%.")
        position.target_allocation_pct = target_allocation_pct

    if signal is not None:
        position.signal = signal
    if conviction is not None:
        position.conviction = conviction
    if notes is not None:
        position.notes = notes

    _recalculate_cash()
    logger.info(f"Updated position: {ticker}")
    return position


def remove_position(ticker: str) -> dict:
    """Remove a position (simulate full exit)."""
    position = next((p for p in _portfolio.positions if p.ticker == ticker), None)
    if not position:
        raise ValueError(f"Position {ticker} not found.")

    _portfolio.positions = [p for p in _portfolio.positions if p.ticker != ticker]
    _recalculate_cash()

    logger.info(f"Removed position: {ticker}")
    return {"ticker": ticker, "action": "exited", "freed_allocation": position.target_allocation_pct}


def update_prices(price_map: dict[str, float]) -> int:
    """Update current prices for all positions. Returns count updated."""
    updated = 0
    for position in _portfolio.positions:
        if position.ticker in price_map:
            position.current_price = price_map[position.ticker]
            updated += 1
    return updated


def set_regime(regime: MarketRegime) -> dict:
    """Update market regime."""
    old_regime = _portfolio.regime
    _portfolio.regime = regime
    logger.info(f"Regime changed: {old_regime.value} → {regime.value}")
    return {"previous": old_regime.value, "current": regime.value}


# ── Metrics ───────────────────────────────────────────────────────────────────

def calculate_metrics() -> PortfolioMetrics:
    """Calculate current portfolio metrics."""
    positions = _portfolio.positions
    capital = _portfolio.starting_capital

    if not positions:
        return PortfolioMetrics(
            total_value=capital,
            total_return_pct=0.0,
            cash_pct=100.0,
            equity_pct=0.0,
            position_count=0,
            theme_count=0,
            largest_position_pct=0.0,
            largest_theme_pct=0.0,
            regime=_portfolio.regime,
        )

    # Calculate position values based on entry allocation and price change
    total_value = 0.0
    theme_weights: dict[str, float] = {}

    for p in positions:
        # Notional value = allocation * capital * (current/entry)
        if p.entry_price > 0:
            position_value = (p.target_allocation_pct / 100) * capital * (p.current_price / p.entry_price)
        else:
            position_value = (p.target_allocation_pct / 100) * capital
        total_value += position_value

        # Theme tracking
        theme = p.theme or "Unclassified"
        theme_weights[theme] = theme_weights.get(theme, 0) + p.target_allocation_pct

    cash_value = (_portfolio.cash_pct / 100) * capital
    total_value += cash_value

    total_return = ((total_value - capital) / capital) * 100

    largest_pos = max((p.target_allocation_pct for p in positions), default=0)
    largest_theme = max(theme_weights.values(), default=0)

    return PortfolioMetrics(
        total_value=round(total_value, 2),
        total_return_pct=round(total_return, 2),
        cash_pct=_portfolio.cash_pct,
        equity_pct=round(100 - _portfolio.cash_pct, 1),
        position_count=len(positions),
        theme_count=len(theme_weights),
        largest_position_pct=largest_pos,
        largest_theme_pct=largest_theme,
        regime=_portfolio.regime,
    )


def get_position_performance() -> list[PositionPerformance]:
    """Get performance data for all positions."""
    results = []
    for p in _portfolio.positions:
        return_pct = ((p.current_price - p.entry_price) / p.entry_price * 100) if p.entry_price > 0 else 0
        results.append(PositionPerformance(
            ticker=p.ticker,
            company_name=p.company_name,
            entry_price=p.entry_price,
            current_price=p.current_price,
            return_pct=round(return_pct, 2),
            allocation_pct=p.target_allocation_pct,
            theme=p.theme,
            signal=p.signal,
            conviction=p.conviction,
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
    """Create an investment thesis for a position."""
    position = next((p for p in _portfolio.positions if p.ticker == ticker), None)
    company_name = position.company_name if position else ticker

    thesis_id = f"{ticker}-{date.today().year}-Q{(date.today().month - 1) // 3 + 1}"

    thesis = ThesisRecord(
        ticker=ticker,
        company_name=company_name,
        thesis_id=thesis_id,
        created_date=date.today(),
        conviction=conviction,
        thesis_statement=thesis_statement,
        macro_drivers=macro_drivers or [],
        risk_considerations=risk_considerations or [],
        invalidation_conditions=invalidation_conditions or [],
    )

    _theses.append(thesis)
    logger.info(f"Created thesis: {thesis_id}")
    return thesis


def get_thesis_for_ticker(ticker: str) -> list[ThesisRecord]:
    """Get all theses for a ticker."""
    return [t for t in _theses if t.ticker == ticker]


# ── Weekly Review ─────────────────────────────────────────────────────────────

def create_weekly_review(
    actions_taken: Optional[list[str]] = None,
    notes: str = "",
) -> WeeklyReview:
    """Create a weekly review record."""
    metrics = calculate_metrics()

    # Generate alerts
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
        review_date=date.today(),
        regime=_portfolio.regime,
        portfolio_value=metrics.total_value,
        portfolio_return_pct=metrics.total_return_pct,
        cash_pct=metrics.cash_pct,
        position_count=metrics.position_count,
        alerts=alerts,
        actions_taken=actions_taken or [],
        notes=notes,
    )

    _reviews.append(review)
    _portfolio.last_review_date = date.today()
    logger.info(f"Weekly review created: {review.review_date}")
    return review


# ── Seed Portfolio ────────────────────────────────────────────────────────────

def seed_demo_portfolio() -> PortfolioState:
    """Seed the portfolio with the Nür Capital demo allocation."""
    global _portfolio, _theses

    _portfolio = PortfolioState(
        starting_capital=100000.0,
        regime=MarketRegime.WEAK_BULL,
    )
    _theses = []

    demo_positions = [
        ("TSM", "Taiwan Semiconductor", 165.20, 178.52, 12, "Semiconductors", ConvictionLevel.HIGH, PortfolioSignal.BUY, "Leading foundry with monopoly in advanced nodes. AI demand structural."),
        ("ASML", "ASML Holding", 878.50, 924.30, 10, "Semiconductors", ConvictionLevel.HIGH, PortfolioSignal.BUY, "Sole EUV manufacturer. Multi-year backlog. No competitor within decade."),
        ("HLAL", "Wahed FTSE USA Shariah ETF", 40.75, 42.15, 15, "Halal Finance", ConvictionLevel.HIGH, PortfolioSignal.HOLD, "Core Sharia-compliant US equity anchor. Low-cost diversification."),
        ("LLY", "Eli Lilly", 730.00, 820.40, 8, "Healthcare", ConvictionLevel.HIGH, PortfolioSignal.BUY, "GLP-1 leader. $100B+ obesity TAM. Strongest pharma pipeline."),
        ("CRWD", "CrowdStrike", 322.80, 355.20, 7, "Cybersecurity", ConvictionLevel.HIGH, PortfolioSignal.BUY, "Endpoint security leader. Non-discretionary spend. 97% retention."),
        ("AMD", "Advanced Micro Devices", 155.40, 162.30, 7, "Semiconductors", ConvictionLevel.HIGH, PortfolioSignal.BUY, "MI300 AI accelerator gaining share. Clean alternative to NVIDIA."),
        ("AVGO", "Broadcom", 168.20, 178.50, 7, "Semiconductors", ConvictionLevel.HIGH, PortfolioSignal.BUY, "Custom AI chips for Google/Meta. Networking dominance."),
        ("2222.SR", "Saudi Aramco", 8.02, 8.25, 8, "Oil & Gas", ConvictionLevel.HIGH, PortfolioSignal.HOLD, "Lowest-cost producer. 4%+ dividend. Energy security."),
        ("ABB", "ABB Ltd", 50.60, 52.80, 6, "Industrial Automation", ConvictionLevel.HIGH, PortfolioSignal.HOLD, "Global automation leader. Defensive industrial. Swiss quality."),
    ]

    for ticker, name, entry, current, alloc, theme, conv, signal, thesis in demo_positions:
        pos = Position(
            ticker=ticker,
            company_name=name,
            entry_date=date(2025, 3, 15),
            entry_price=entry,
            current_price=current,
            target_allocation_pct=alloc,
            theme=theme,
            conviction=conv,
            signal=signal,
            thesis_summary=thesis,
        )
        _portfolio.positions.append(pos)

    _recalculate_cash()

    # Add demo theses
    add_thesis("TSM", "Leading foundry with monopoly in advanced nodes benefiting from structural AI demand",
               macro_drivers=["AI training demand 40%+ YoY", "CHIPS Act reshoring", "2nm production 2025-2026"],
               risk_considerations=["Taiwan geopolitics", "Customer concentration (Apple 25%)"],
               invalidation_conditions=["Loss of Apple/NVIDIA as customer", "China-Taiwan military escalation", "Intel closes technology gap"],
               conviction=ConvictionLevel.HIGH)

    add_thesis("LLY", "GLP-1 category leader with $100B+ obesity TAM and strongest pipeline",
               macro_drivers=["Obesity market <5% penetrated", "Zepbound best-in-class efficacy", "Oral GLP-1 in Phase 3"],
               risk_considerations=["Premium valuation", "Manufacturing capacity constraints"],
               invalidation_conditions=["Serious safety signal for tirzepatide", "Generic competition before 2032", "Government price caps below $500/month"],
               conviction=ConvictionLevel.HIGH)

    add_thesis("CRWD", "Cloud-native endpoint security leader with AI-driven platform",
               macro_drivers=["Cybersecurity spend non-discretionary", "Platform consolidation trend", "Charlotte AI upsell"],
               risk_considerations=["July 2024 outage reputational risk", "Microsoft Defender competition"],
               invalidation_conditions=["Gross retention drops below 90%", "Major breach of CrowdStrike platform", "Microsoft achieves feature parity"],
               conviction=ConvictionLevel.HIGH)

    logger.info(f"Demo portfolio seeded: {len(_portfolio.positions)} positions, {_portfolio.cash_pct}% cash")
    return _portfolio


# ── Internal ──────────────────────────────────────────────────────────────────

def _recalculate_cash():
    """Recalculate cash allocation based on position targets."""
    total_equity = sum(p.target_allocation_pct for p in _portfolio.positions)
    _portfolio.cash_pct = round(max(0, 100 - total_equity), 1)
