"""
Tests for the Eligibility Engine — Hard exclusion rules.
"""

from app.models.eligibility import EligibilityInput, EligibilityStatus
from app.services.eligibility_engine import determine_eligibility, is_approved


# ── APPROVED ──────────────────────────────────────────────────────────────────

def test_approved_clean_tech():
    """Tesla should be APPROVED — no exclusion triggers."""
    result = determine_eligibility(EligibilityInput(
        ticker="TSLA", company_name="Tesla Inc.",
        sector="Consumer Discretionary", industry="Electric Vehicles", country="US",
    ))
    assert result.status == EligibilityStatus.APPROVED
    assert len(result.rejection_reasons) == 0


def test_approved_semiconductor():
    """ASML should be APPROVED."""
    result = determine_eligibility(EligibilityInput(
        ticker="ASML", company_name="ASML Holding",
        sector="Technology", industry="Semiconductor Equipment", country="Netherlands",
    ))
    assert result.status == EligibilityStatus.APPROVED


def test_approved_healthcare():
    """Novo Nordisk should be APPROVED."""
    result = determine_eligibility(EligibilityInput(
        ticker="NOVO-B", company_name="Novo Nordisk",
        sector="Healthcare", industry="Pharmaceuticals", country="Denmark",
    ))
    assert result.status == EligibilityStatus.APPROVED


# ── REJECTED: Gambling ────────────────────────────────────────────────────────

def test_rejected_gambling():
    """Flutter should be REJECTED — gambling."""
    result = determine_eligibility(EligibilityInput(
        ticker="FLTR", company_name="Flutter Entertainment",
        sector="Consumer Discretionary", industry="Gambling",
    ))
    assert result.status == EligibilityStatus.REJECTED
    assert any("gambling" in r.lower() for r in result.rejection_reasons)


# ── REJECTED: Alcohol ─────────────────────────────────────────────────────────

def test_rejected_alcohol():
    """Diageo should be REJECTED — alcohol."""
    result = determine_eligibility(EligibilityInput(
        ticker="DGE", company_name="Diageo plc",
        sector="Consumer Staples", industry="Distillery and Spirits",
    ))
    assert result.status == EligibilityStatus.REJECTED


# ── REJECTED: Weapons ─────────────────────────────────────────────────────────

def test_rejected_weapons():
    """BAE Systems should be REJECTED — weapons/defence."""
    result = determine_eligibility(EligibilityInput(
        ticker="BA.", company_name="BAE Systems plc",
        sector="Industrials", industry="Defence",
    ))
    assert result.status == EligibilityStatus.REJECTED


# ── REJECTED: Interest-based finance ──────────────────────────────────────────

def test_rejected_banking():
    """HSBC should be REJECTED — conventional banking."""
    result = determine_eligibility(EligibilityInput(
        ticker="HSBA", company_name="HSBC Holdings plc",
        sector="Financials", industry="Banking",
    ))
    assert result.status == EligibilityStatus.REJECTED


def test_rejected_insurance():
    """Insurance company should be REJECTED."""
    result = determine_eligibility(EligibilityInput(
        ticker="AV.", company_name="Aviva plc",
        sector="Financials", industry="Insurance",
    ))
    assert result.status == EligibilityStatus.REJECTED


# ── REJECTED: Israel exposure ─────────────────────────────────────────────────

def test_rejected_israel_microsoft():
    """Microsoft should be REJECTED — Israel operations."""
    result = determine_eligibility(EligibilityInput(
        ticker="MSFT", company_name="Microsoft Corporation",
        sector="Technology", industry="Enterprise Software",
    ))
    assert result.status == EligibilityStatus.REJECTED
    assert any("israel" in r.lower() for r in result.rejection_reasons)


def test_rejected_israel_amazon():
    """Amazon should be REJECTED — Project Nimbus."""
    result = determine_eligibility(EligibilityInput(
        ticker="AMZN", company_name="Amazon.com Inc.",
        sector="Consumer Discretionary", industry="E-commerce",
    ))
    assert result.status == EligibilityStatus.REJECTED


# ── REJECTED: Prohibited structures ──────────────────────────────────────────

def test_rejected_leveraged_etf():
    """Leveraged ETF should be REJECTED."""
    result = determine_eligibility(EligibilityInput(
        ticker="TQQQ", company_name="ProShares UltraPro QQQ 3x Leveraged",
        sector="ETF", industry="Leveraged ETF",
    ))
    assert result.status == EligibilityStatus.REJECTED


# ── WATCHLIST ─────────────────────────────────────────────────────────────────

def test_watchlist_borderline_debt():
    """Asset with borderline debt ratio should be WATCHLIST."""
    result = determine_eligibility(EligibilityInput(
        ticker="TEST", company_name="Test Corp",
        sector="Technology", industry="Software",
        debt_to_market_cap=0.35,
    ))
    assert result.status == EligibilityStatus.WATCHLIST
    assert len(result.review_notes) > 0


# ── MANUAL OVERRIDE ───────────────────────────────────────────────────────────

def test_manual_override():
    """Manual override should take precedence."""
    result = determine_eligibility(EligibilityInput(
        ticker="MSFT", company_name="Microsoft Corporation",
        sector="Technology", industry="Enterprise Software",
        manual_override=EligibilityStatus.WATCHLIST,
        override_reason="Under review pending divestment",
    ))
    assert result.status == EligibilityStatus.WATCHLIST
    assert result.is_override is True


# ── HELPER ────────────────────────────────────────────────────────────────────

def test_is_approved_helper():
    """is_approved() should return True for clean assets."""
    assert is_approved(EligibilityInput(
        ticker="COST", company_name="Costco Wholesale",
        sector="Consumer Staples", industry="Retail",
    )) is True

    assert is_approved(EligibilityInput(
        ticker="DGE", company_name="Diageo plc",
        sector="Consumer Staples", industry="Distillery",
    )) is False


# ── CONFIDENCE ────────────────────────────────────────────────────────────────

def test_confidence_level():
    """Should report high confidence when all rules evaluated."""
    result = determine_eligibility(EligibilityInput(
        ticker="TSLA", company_name="Tesla Inc.",
        sector="Consumer Discretionary", industry="Electric Vehicles",
    ))
    assert result.confidence_level == "high"
