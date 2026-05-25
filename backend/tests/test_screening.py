"""
Tests for the ethical screening engine.
"""

from app.models.screening import ScreeningDecision, ScreeningInput
from app.services.screening_service import screen_asset


def test_approved_asset():
    """Tesla should be approved — no exposure in any category."""
    result = screen_asset(
        ScreeningInput(
            ticker="TSLA",
            company_name="Tesla Inc.",
            sector="Consumer Discretionary",
            industry="Electric Vehicles",
            country="US",
        )
    )
    assert result.decision == ScreeningDecision.APPROVED
    assert result.halal_status.value == "compliant"
    assert result.israel_exposure.value == "clear"
    assert result.confidence_score >= 0.8


def test_rejected_gambling():
    """Flutter should be rejected — gambling business activity."""
    result = screen_asset(
        ScreeningInput(
            ticker="FLTR",
            company_name="Flutter Entertainment",
            sector="Consumer Discretionary",
            industry="Gambling",
            country="UK",
        )
    )
    assert result.decision == ScreeningDecision.REJECTED
    assert result.halal_status.value == "non_compliant"


def test_rejected_alcohol():
    """Diageo should be rejected — alcohol production."""
    result = screen_asset(
        ScreeningInput(
            ticker="DGE",
            company_name="Diageo plc",
            sector="Consumer Staples",
            industry="Distillery and Spirits",
            country="UK",
        )
    )
    assert result.decision == ScreeningDecision.REJECTED
    assert result.halal_status.value == "non_compliant"


def test_rejected_weapons():
    """BAE Systems should be rejected — weapons/defence."""
    result = screen_asset(
        ScreeningInput(
            ticker="BA.",
            company_name="BAE Systems plc",
            sector="Industrials",
            industry="Defence",
            country="UK",
        )
    )
    assert result.decision == ScreeningDecision.REJECTED
    assert result.halal_status.value == "non_compliant"


def test_rejected_israel_exposure():
    """Microsoft should be rejected — Israel operations identified."""
    result = screen_asset(
        ScreeningInput(
            ticker="MSFT",
            company_name="Microsoft Corporation",
            sector="Technology",
            industry="Enterprise Software",
            country="US",
        )
    )
    assert result.decision == ScreeningDecision.REJECTED
    assert result.israel_exposure.value == "identified"


def test_rejected_banking():
    """HSBC should be rejected — conventional banking."""
    result = screen_asset(
        ScreeningInput(
            ticker="HSBA",
            company_name="HSBC Holdings plc",
            sector="Financials",
            industry="Banking",
            country="UK",
        )
    )
    assert result.decision == ScreeningDecision.REJECTED
    assert result.halal_status.value == "non_compliant"


def test_watchlist_financial_ratios():
    """Asset with borderline financial ratios should be watchlisted."""
    result = screen_asset(
        ScreeningInput(
            ticker="TEST",
            company_name="Test Corp",
            sector="Technology",
            industry="Software",
            country="US",
            debt_to_market_cap=0.35,  # Exceeds 33% threshold
        )
    )
    assert result.decision == ScreeningDecision.WATCHLIST


def test_manual_override():
    """Manual override should take precedence over engine decision."""
    result = screen_asset(
        ScreeningInput(
            ticker="MSFT",
            company_name="Microsoft Corporation",
            sector="Technology",
            industry="Enterprise Software",
            country="US",
            manual_override=ScreeningDecision.WATCHLIST,
            override_reason="Under review pending divestment announcement",
        )
    )
    assert result.decision == ScreeningDecision.WATCHLIST
    assert result.is_override is True
    assert "Manual override" in result.reasoning[-1]


def test_confidence_score_range():
    """Confidence score should always be between 0 and 1."""
    result = screen_asset(
        ScreeningInput(
            ticker="ASML",
            company_name="ASML Holding",
            sector="Technology",
            industry="Semiconductor Equipment",
            country="Netherlands",
        )
    )
    assert 0 <= result.confidence_score <= 1


def test_reasoning_populated():
    """Reasoning should always contain at least one entry."""
    result = screen_asset(
        ScreeningInput(
            ticker="COST",
            company_name="Costco Wholesale",
            sector="Consumer Staples",
            industry="Retail",
            country="US",
        )
    )
    assert len(result.reasoning) > 0
