"""
Scoring Engine — Calculates confidence scores and final decisions from exposure flags.

Converts raw rule outputs into:
- A final decision (approved / watchlist / rejected)
- A confidence score (0–1)
- Explainable reasoning
"""

from app.models.screening import (
    ExposureFlag,
    HalalStatus,
    IsraelExposure,
    ScreeningDecision,
    ScreeningStatus,
)


# ── Severity Weights ──────────────────────────────────────────────────────────

SEVERITY_WEIGHTS = {
    "none": 0.0,
    "low": 0.15,
    "medium": 0.4,
    "high": 1.0,
}

# Categories that trigger immediate rejection
HARD_REJECT_CATEGORIES = {"gambling", "alcohol", "weapons"}

# Categories that trigger watchlist (unless also hard reject)
WATCHLIST_CATEGORIES = {"interest_based_finance", "israel_exposure"}


def calculate_decision(flags: list[ExposureFlag]) -> ScreeningDecision:
    """
    Determine final screening decision from exposure flags.

    Logic:
    - Any high-severity flag in a hard-reject category → REJECTED
    - Any detected flag in a watchlist category with high severity → REJECTED
    - Any detected flag in a watchlist category with medium severity → WATCHLIST
    - Otherwise → APPROVED
    """
    for flag in flags:
        if not flag.detected:
            continue

        if flag.category in HARD_REJECT_CATEGORIES and flag.severity == "high":
            return ScreeningDecision.REJECTED

        if flag.category in WATCHLIST_CATEGORIES and flag.severity == "high":
            return ScreeningDecision.REJECTED

    # Check for medium-severity watchlist items
    for flag in flags:
        if not flag.detected:
            continue
        if flag.category in WATCHLIST_CATEGORIES and flag.severity == "medium":
            return ScreeningDecision.WATCHLIST

    return ScreeningDecision.APPROVED


def calculate_halal_status(flags: list[ExposureFlag]) -> HalalStatus:
    """Derive Sharia compliance status from flags."""
    for flag in flags:
        if not flag.detected:
            continue
        if flag.category in HARD_REJECT_CATEGORIES and flag.severity == "high":
            return HalalStatus.NON_COMPLIANT
        if flag.category == "interest_based_finance" and flag.severity == "high":
            return HalalStatus.NON_COMPLIANT

    # Medium interest-based finance = review needed
    for flag in flags:
        if flag.detected and flag.category == "interest_based_finance":
            return HalalStatus.REVIEW_NEEDED

    return HalalStatus.COMPLIANT


def calculate_israel_exposure(flags: list[ExposureFlag]) -> IsraelExposure:
    """Derive Israel exposure status from flags."""
    for flag in flags:
        if flag.category == "israel_exposure" and flag.detected:
            return IsraelExposure.IDENTIFIED
    return IsraelExposure.CLEAR


def calculate_confidence(flags: list[ExposureFlag]) -> float:
    """
    Calculate confidence score (0–1).

    Higher confidence when:
    - More rules were evaluated
    - Results are consistent (all clear or all flagged)
    - No ambiguous medium-severity flags
    """
    if not flags:
        return 0.5

    total_rules = len(flags)
    detected_count = sum(1 for f in flags if f.detected)
    high_count = sum(1 for f in flags if f.severity == "high")
    medium_count = sum(1 for f in flags if f.severity == "medium")

    # Base confidence from rule coverage
    base = min(0.7 + (total_rules * 0.04), 0.95)

    # Penalty for ambiguity (medium-severity flags reduce confidence)
    ambiguity_penalty = medium_count * 0.08

    # Bonus for clear results (all clear or clearly flagged)
    if detected_count == 0:
        clarity_bonus = 0.05
    elif high_count > 0:
        clarity_bonus = 0.03  # Clear rejection is also high confidence
    else:
        clarity_bonus = 0.0

    score = base - ambiguity_penalty + clarity_bonus
    return round(max(0.3, min(score, 0.99)), 2)


def generate_reasoning(flags: list[ExposureFlag], decision: ScreeningDecision) -> list[str]:
    """Generate human-readable reasoning from flags and decision."""
    reasons = []

    # Positive signals
    clear_flags = [f for f in flags if not f.detected]
    if clear_flags:
        categories = [f.category.replace("_", " ") for f in clear_flags]
        reasons.append(f"Clear on: {', '.join(categories)}")

    # Negative signals
    for flag in flags:
        if flag.detected and flag.explanation:
            reasons.append(f"{flag.category.replace('_', ' ').title()}: {flag.explanation}")

    # Decision summary
    if decision == ScreeningDecision.APPROVED:
        reasons.append("No disqualifying exposure identified. Asset approved.")
    elif decision == ScreeningDecision.WATCHLIST:
        reasons.append("Medium-severity concerns identified. Placed on watchlist for further review.")
    elif decision == ScreeningDecision.REJECTED:
        reasons.append("High-severity exposure identified. Asset does not pass ethical screening.")

    return reasons


def determine_screening_status(decision: ScreeningDecision, confidence: float) -> ScreeningStatus:
    """Determine the screening status based on confidence level."""
    if confidence >= 0.85:
        return ScreeningStatus.REVIEWED
    elif confidence >= 0.7:
        return ScreeningStatus.PRELIMINARY
    else:
        return ScreeningStatus.PENDING
