"""
Rule Engine — Evaluates individual exposure rules against asset data.

Each rule is a pure function that takes screening input and returns an ExposureFlag.
Rules are composable, testable, and extensible.
"""

from app.models.screening import ExposureFlag, ScreeningInput


# ── Excluded Sectors (business activity screening) ────────────────────────────

GAMBLING_KEYWORDS = ["gambling", "casino", "betting", "lottery", "wagering"]
ALCOHOL_KEYWORDS = ["alcohol", "brewery", "distillery", "spirits", "wine", "beer"]
WEAPONS_KEYWORDS = ["weapons", "defence", "defense", "military", "arms", "munitions"]
TOBACCO_KEYWORDS = ["tobacco", "cigarette", "smoking"]

FINANCIAL_SECTORS = ["banking", "insurance", "conventional finance", "credit services"]

# Known Israel-linked entities (from structured intelligence)
ISRAEL_EXPOSURE_ENTITIES = {
    "microsoft": "R&D operations in Herzliya, Azure government cloud contracts",
    "apple": "R&D centre in Herzliya, Israeli acquisitions",
    "alphabet": "Project Nimbus government contract, R&D centres in Tel Aviv/Haifa",
    "google": "Project Nimbus government contract, R&D centres in Tel Aviv/Haifa",
    "amazon": "AWS Israel region, Project Nimbus contract",
    "meta": "R&D operations in Tel Aviv",
    "nvidia": "R&D operations in Israel, Mellanox acquisition",
    "intel": "Major fabrication and R&D facilities in Israel",
    "booking holdings": "Operations in Israel",
    "caterpillar": "Equipment used in demolition of Palestinian structures",
    "pepsico": "SodaStream manufacturing in occupied West Bank",
    "unilever": "Factory operations in Israel",
    "barclays": "Investment holdings linked to Israel",
}


def check_gambling(input: ScreeningInput) -> ExposureFlag:
    """Check for gambling-related business activity."""
    industry = (input.industry or "").lower()
    sector = (input.sector or "").lower()
    name = input.company_name.lower()

    detected = any(
        kw in industry or kw in sector or kw in name for kw in GAMBLING_KEYWORDS
    )

    return ExposureFlag(
        category="gambling",
        detected=detected,
        severity="high" if detected else "none",
        explanation="Gambling-related business activity identified" if detected else "",
    )


def check_alcohol(input: ScreeningInput) -> ExposureFlag:
    """Check for alcohol production/distribution."""
    industry = (input.industry or "").lower()
    name = input.company_name.lower()

    detected = any(kw in industry or kw in name for kw in ALCOHOL_KEYWORDS)

    return ExposureFlag(
        category="alcohol",
        detected=detected,
        severity="high" if detected else "none",
        explanation="Alcohol production or distribution identified" if detected else "",
    )


def check_weapons(input: ScreeningInput) -> ExposureFlag:
    """Check for weapons/defence manufacturing."""
    industry = (input.industry or "").lower()
    sector = (input.sector or "").lower()
    name = input.company_name.lower()

    detected = any(
        kw in industry or kw in sector or kw in name for kw in WEAPONS_KEYWORDS
    )

    return ExposureFlag(
        category="weapons",
        detected=detected,
        severity="high" if detected else "none",
        explanation="Weapons or defence manufacturing identified" if detected else "",
    )


def check_interest_based_finance(input: ScreeningInput) -> ExposureFlag:
    """Check for conventional interest-based financial services."""
    sector = (input.sector or "").lower()
    industry = (input.industry or "").lower()

    # Business activity check
    is_financial = any(kw in sector or kw in industry for kw in FINANCIAL_SECTORS)

    # Financial ratio check (if data available)
    ratio_fail = False
    if input.interest_income_ratio is not None and input.interest_income_ratio > 0.05:
        ratio_fail = True
    if input.debt_to_market_cap is not None and input.debt_to_market_cap > 0.33:
        ratio_fail = True

    detected = is_financial or ratio_fail
    severity = "high" if is_financial else ("medium" if ratio_fail else "none")

    explanation = ""
    if is_financial:
        explanation = "Core business is conventional interest-based finance"
    elif ratio_fail:
        explanation = "Financial ratios exceed AAOIFI permissible thresholds"

    return ExposureFlag(
        category="interest_based_finance",
        detected=detected,
        severity=severity,
        explanation=explanation,
    )


def check_israel_exposure(input: ScreeningInput) -> ExposureFlag:
    """Check for Israel-linked operational or procurement exposure."""
    name_key = input.company_name.lower().split()[0]  # First word of company name
    ticker_key = input.ticker.lower()

    # Check against known entities
    match = None
    for entity, detail in ISRAEL_EXPOSURE_ENTITIES.items():
        if entity in name_key or entity == ticker_key:
            match = detail
            break

    detected = match is not None

    return ExposureFlag(
        category="israel_exposure",
        detected=detected,
        severity="high" if detected else "none",
        explanation=match or "",
    )


# ── Rule Registry ─────────────────────────────────────────────────────────────

ALL_RULES = [
    check_gambling,
    check_alcohol,
    check_weapons,
    check_interest_based_finance,
    check_israel_exposure,
]


def run_all_rules(input: ScreeningInput) -> list[ExposureFlag]:
    """Execute all screening rules and return flags."""
    return [rule(input) for rule in ALL_RULES]
