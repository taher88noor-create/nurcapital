"""
Eligibility Engine — Hard exclusion rule system.

CORE PRINCIPLE:
Assets either PASS, REQUIRE REVIEW, or FAIL.
There is NO weighted scoring. No partial compliance.
If an asset fails ANY hard exclusion rule, it is REJECTED.
Rejected assets NEVER enter ranking, scoring, or allocation.

Architecture:
1. Run all exclusion rules
2. If ANY rule returns "fail" → REJECTED
3. If ANY rule returns "review" → WATCHLIST
4. If ALL rules return "pass" → APPROVED
5. Manual overrides supported for edge cases
"""

from app.models.eligibility import (
    EligibilityInput,
    EligibilityResult,
    EligibilityStatus,
    ExclusionCategory,
    RuleResult,
)


# ── Known Exclusion Data ──────────────────────────────────────────────────────

GAMBLING_KEYWORDS = ["gambling", "casino", "betting", "lottery", "wagering", "bookmaker"]
ALCOHOL_KEYWORDS = ["alcohol", "brewery", "distillery", "spirits", "wine", "beer", "brewing"]
WEAPONS_KEYWORDS = ["weapons", "defence", "defense", "military", "arms", "munitions", "missile"]
ADULT_KEYWORDS = ["adult", "pornography", "escort"]
TOBACCO_KEYWORDS = ["tobacco", "cigarette"]

FINANCIAL_SECTORS = ["banking", "insurance", "conventional finance", "credit services", "lending"]

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
    "hp": "Operations in Israel",
    "siemens": "Infrastructure projects in Israel",
}


# ── Exclusion Rules ───────────────────────────────────────────────────────────

def _check_gambling(input: EligibilityInput) -> RuleResult:
    """HARD FAIL: Any gambling business activity."""
    text = f"{input.industry or ''} {input.sector or ''} {input.company_name}".lower()
    triggered = any(kw in text for kw in GAMBLING_KEYWORDS)
    return RuleResult(
        category=ExclusionCategory.GAMBLING,
        triggered=triggered,
        severity="fail" if triggered else "pass",
        explanation="Gambling business activity identified — excluded" if triggered else "",
    )


def _check_alcohol(input: EligibilityInput) -> RuleResult:
    """HARD FAIL: Any alcohol production or distribution."""
    text = f"{input.industry or ''} {input.company_name}".lower()
    triggered = any(kw in text for kw in ALCOHOL_KEYWORDS)
    return RuleResult(
        category=ExclusionCategory.ALCOHOL,
        triggered=triggered,
        severity="fail" if triggered else "pass",
        explanation="Alcohol production or distribution — excluded" if triggered else "",
    )


def _check_weapons(input: EligibilityInput) -> RuleResult:
    """HARD FAIL: Weapons manufacturing or significant defence revenue."""
    text = f"{input.industry or ''} {input.sector or ''} {input.company_name}".lower()
    triggered = any(kw in text for kw in WEAPONS_KEYWORDS)
    return RuleResult(
        category=ExclusionCategory.WEAPONS,
        triggered=triggered,
        severity="fail" if triggered else "pass",
        explanation="Weapons or defence manufacturing — excluded" if triggered else "",
    )


def _check_interest_based_finance(input: EligibilityInput) -> RuleResult:
    """
    HARD FAIL: Conventional interest-based finance as core business.
    REVIEW: Borderline financial ratios.
    """
    sector = (input.sector or "").lower()
    industry = (input.industry or "").lower()

    # Core business check — immediate fail
    is_core_finance = any(kw in sector or kw in industry for kw in FINANCIAL_SECTORS)
    if is_core_finance:
        return RuleResult(
            category=ExclusionCategory.INTEREST_BASED_FINANCE,
            triggered=True,
            severity="fail",
            explanation="Core business is conventional interest-based finance — excluded",
        )

    # Financial ratio check — review if borderline
    if input.interest_income_ratio is not None and input.interest_income_ratio > 0.05:
        return RuleResult(
            category=ExclusionCategory.INTEREST_BASED_FINANCE,
            triggered=True,
            severity="fail",
            explanation=f"Interest income ratio ({input.interest_income_ratio:.1%}) exceeds 5% threshold — excluded",
        )

    if input.debt_to_market_cap is not None and input.debt_to_market_cap > 0.33:
        return RuleResult(
            category=ExclusionCategory.INTEREST_BASED_FINANCE,
            triggered=True,
            severity="review",
            explanation=f"Debt/market cap ({input.debt_to_market_cap:.1%}) exceeds 33% threshold — requires review",
        )

    return RuleResult(
        category=ExclusionCategory.INTEREST_BASED_FINANCE,
        triggered=False,
        severity="pass",
        explanation="",
    )


def _check_israel_exposure(input: EligibilityInput) -> RuleResult:
    """HARD FAIL: Identified Israel-linked operational or procurement exposure."""
    name_lower = input.company_name.lower()

    for entity, detail in ISRAEL_EXPOSURE_ENTITIES.items():
        if entity in name_lower:
            return RuleResult(
                category=ExclusionCategory.ISRAEL_EXPOSURE,
                triggered=True,
                severity="fail",
                explanation=f"Israel-linked exposure identified: {detail}",
            )

    return RuleResult(
        category=ExclusionCategory.ISRAEL_EXPOSURE,
        triggered=False,
        severity="pass",
        explanation="",
    )


def _check_adult_industries(input: EligibilityInput) -> RuleResult:
    """HARD FAIL: Adult/pornography industries."""
    text = f"{input.industry or ''} {input.company_name}".lower()
    triggered = any(kw in text for kw in ADULT_KEYWORDS)
    return RuleResult(
        category=ExclusionCategory.ADULT_INDUSTRIES,
        triggered=triggered,
        severity="fail" if triggered else "pass",
        explanation="Adult industry — excluded" if triggered else "",
    )


def _check_prohibited_structures(input: EligibilityInput) -> RuleResult:
    """HARD FAIL: Prohibited financial structures (leveraged ETFs, derivatives-heavy)."""
    name_lower = input.company_name.lower()
    prohibited = ["leveraged", "inverse", "3x", "2x", "-3x", "-2x", "short"]
    triggered = any(kw in name_lower for kw in prohibited)
    return RuleResult(
        category=ExclusionCategory.PROHIBITED_FINANCIAL_STRUCTURES,
        triggered=triggered,
        severity="fail" if triggered else "pass",
        explanation="Prohibited financial structure (leveraged/inverse) — excluded" if triggered else "",
    )


# ── Rule Registry ─────────────────────────────────────────────────────────────

ALL_RULES = [
    _check_gambling,
    _check_alcohol,
    _check_weapons,
    _check_interest_based_finance,
    _check_israel_exposure,
    _check_adult_industries,
    _check_prohibited_structures,
]


# ── Engine ────────────────────────────────────────────────────────────────────

def determine_eligibility(input: EligibilityInput) -> EligibilityResult:
    """
    Determine asset eligibility using hard exclusion rules.

    Logic:
    - ANY rule with severity "fail" → REJECTED
    - ANY rule with severity "review" → WATCHLIST
    - ALL rules pass → APPROVED

    Manual overrides take precedence but full analysis is recorded.
    """
    # Run all rules
    results = [rule(input) for rule in ALL_RULES]

    # Determine status
    rejection_reasons = []
    review_notes = []

    has_fail = False
    has_review = False

    for r in results:
        if r.severity == "fail":
            has_fail = True
            rejection_reasons.append(f"[{r.category.value}] {r.explanation}")
        elif r.severity == "review":
            has_review = True
            review_notes.append(f"[{r.category.value}] {r.explanation}")

    if has_fail:
        status = EligibilityStatus.REJECTED
    elif has_review:
        status = EligibilityStatus.WATCHLIST
    else:
        status = EligibilityStatus.APPROVED

    # Confidence level
    rules_evaluated = len(results)
    if rules_evaluated >= 7:
        confidence = "high"
    elif rules_evaluated >= 5:
        confidence = "medium"
    else:
        confidence = "low"

    # Manual override
    is_override = False
    if input.manual_override is not None:
        status = input.manual_override
        is_override = True
        review_notes.append(
            f"Manual override to {input.manual_override.value}: "
            f"{input.override_reason or 'No reason provided'}"
        )

    return EligibilityResult(
        ticker=input.ticker,
        company_name=input.company_name,
        status=status,
        rule_results=results,
        rejection_reasons=rejection_reasons,
        review_notes=review_notes,
        confidence_level=confidence,
        is_override=is_override,
    )


def batch_eligibility(inputs: list[EligibilityInput]) -> list[EligibilityResult]:
    """Check eligibility for multiple assets."""
    return [determine_eligibility(inp) for inp in inputs]


def is_approved(input: EligibilityInput) -> bool:
    """Quick check: is this asset approved? (For gating other engines.)"""
    result = determine_eligibility(input)
    return result.status == EligibilityStatus.APPROVED
