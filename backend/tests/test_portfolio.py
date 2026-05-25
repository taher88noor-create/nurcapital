"""
Tests for the Portfolio & Allocation Engine.

IMPORTANT: All assets in these tests are PRE-APPROVED.
The portfolio engine does not perform ethical screening.
"""

from app.models.portfolio import (
    ApprovedAsset,
    MarketCondition,
    PortfolioRequest,
    RiskProfile,
    Signal,
)
from app.services.portfolio_engine import generate_portfolio


def _sample_approved_assets() -> list[ApprovedAsset]:
    """Pre-approved assets for testing (already passed eligibility)."""
    return [
        ApprovedAsset(ticker="TSLA", company_name="Tesla", trend_score=0.6, momentum_score=0.5, volatility_score=0.4, sector="Consumer Discretionary"),
        ApprovedAsset(ticker="ASML", company_name="ASML Holding", trend_score=0.4, momentum_score=0.3, volatility_score=0.3, sector="Technology"),
        ApprovedAsset(ticker="NOVO-B", company_name="Novo Nordisk", trend_score=0.5, momentum_score=0.4, volatility_score=0.2, sector="Healthcare"),
        ApprovedAsset(ticker="TSM", company_name="Taiwan Semiconductor", trend_score=0.3, momentum_score=0.2, volatility_score=0.35, sector="Technology"),
        ApprovedAsset(ticker="CRM", company_name="Salesforce", trend_score=0.2, momentum_score=0.1, volatility_score=0.3, sector="Technology"),
        ApprovedAsset(ticker="COST", company_name="Costco", trend_score=0.4, momentum_score=0.3, volatility_score=0.15, sector="Consumer Staples"),
        ApprovedAsset(ticker="LLY", company_name="Eli Lilly", trend_score=0.7, momentum_score=0.6, volatility_score=0.35, sector="Healthcare"),
        ApprovedAsset(ticker="AMD", company_name="AMD", trend_score=0.5, momentum_score=0.4, volatility_score=0.5, sector="Technology"),
    ]


def test_balanced_portfolio():
    """Balanced profile should produce reasonable holdings."""
    result = generate_portfolio(PortfolioRequest(
        assets=_sample_approved_assets(),
        risk_profile=RiskProfile.BALANCED,
        market_condition=MarketCondition.NEUTRAL,
    ))
    assert 4 <= result.total_holdings <= 8
    assert result.cash_allocation_pct >= 5
    assert result.portfolio_score > 0


def test_conservative_higher_cash():
    """Conservative should have more cash than growth."""
    conservative = generate_portfolio(PortfolioRequest(
        assets=_sample_approved_assets(),
        risk_profile=RiskProfile.CONSERVATIVE,
    ))
    growth = generate_portfolio(PortfolioRequest(
        assets=_sample_approved_assets(),
        risk_profile=RiskProfile.GROWTH,
    ))
    assert conservative.cash_allocation_pct > growth.cash_allocation_pct


def test_bearish_increases_cash():
    """Bearish market should increase cash."""
    neutral = generate_portfolio(PortfolioRequest(
        assets=_sample_approved_assets(),
        market_condition=MarketCondition.NEUTRAL,
    ))
    bearish = generate_portfolio(PortfolioRequest(
        assets=_sample_approved_assets(),
        market_condition=MarketCondition.BEARISH,
    ))
    assert bearish.cash_allocation_pct > neutral.cash_allocation_pct


def test_max_single_allocation():
    """No asset should exceed max allocation cap."""
    result = generate_portfolio(PortfolioRequest(
        assets=_sample_approved_assets(),
        max_single_allocation=20.0,
    ))
    for s in result.suggestions:
        assert s.allocation_pct <= 20.0


def test_total_near_100():
    """Total allocation should be approximately 100%."""
    result = generate_portfolio(PortfolioRequest(assets=_sample_approved_assets()))
    total = sum(s.allocation_pct for s in result.suggestions) + result.cash_allocation_pct
    assert 95.0 <= total <= 105.0


def test_signals_valid():
    """Every suggestion should have a valid signal."""
    result = generate_portfolio(PortfolioRequest(
        assets=_sample_approved_assets(),
        risk_profile=RiskProfile.GROWTH,
        market_condition=MarketCondition.BULLISH,
    ))
    for s in result.suggestions:
        assert s.signal in [Signal.BUY, Signal.HOLD, Signal.REDUCE, Signal.WATCHLIST]


def test_reasoning_present():
    """Every suggestion should have reasoning."""
    result = generate_portfolio(PortfolioRequest(assets=_sample_approved_assets()))
    for s in result.suggestions:
        assert len(s.reasoning) > 0
    assert len(result.reasoning) > 0


def test_empty_assets():
    """Should handle empty list gracefully."""
    result = generate_portfolio(PortfolioRequest(assets=[]))
    assert result.total_holdings == 0
    assert result.cash_allocation_pct == 100.0


def test_no_ethical_score_in_model():
    """ApprovedAsset should NOT have an ethical_score field."""
    asset = ApprovedAsset(
        ticker="TSLA", company_name="Tesla",
        trend_score=0.5, momentum_score=0.3, volatility_score=0.2,
    )
    assert not hasattr(asset, "ethical_score")


def test_attractiveness_score_range():
    """Attractiveness scores should be 0-100."""
    result = generate_portfolio(PortfolioRequest(
        assets=_sample_approved_assets(),
        risk_profile=RiskProfile.AGGRESSIVE,
        market_condition=MarketCondition.BULLISH,
    ))
    for s in result.suggestions:
        assert 0 <= s.attractiveness_score <= 100
