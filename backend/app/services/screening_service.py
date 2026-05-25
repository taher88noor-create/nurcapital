"""
Screening Service — Orchestrates the full ethical screening pipeline.

Flow:
1. Accept screening input
2. Run rule engine (all exposure checks)
3. Run scoring engine (decision + confidence)
4. Handle manual overrides
5. Return complete screening result
"""

from app.models.screening import (
    ScreeningDecision,
    ScreeningInput,
    ScreeningResult,
)
from app.services.rule_engine import run_all_rules
from app.services.scoring_engine import (
    calculate_confidence,
    calculate_decision,
    calculate_halal_status,
    calculate_israel_exposure,
    determine_screening_status,
    generate_reasoning,
)


def screen_asset(input: ScreeningInput) -> ScreeningResult:
    """
    Run the complete ethical screening pipeline for an asset.

    Supports manual overrides — if provided, the override decision
    takes precedence but the full analysis is still recorded.
    """

    # Step 1: Run all rules
    flags = run_all_rules(input)

    # Step 2: Calculate scores and decision
    decision = calculate_decision(flags)
    halal_status = calculate_halal_status(flags)
    israel_exposure = calculate_israel_exposure(flags)
    confidence = calculate_confidence(flags)
    screening_status = determine_screening_status(decision, confidence)
    reasoning = generate_reasoning(flags, decision)

    # Step 3: Handle manual override
    is_override = False
    if input.manual_override is not None:
        decision = input.manual_override
        is_override = True
        reasoning.append(
            f"Manual override applied: {input.manual_override.value}. "
            f"Reason: {input.override_reason or 'No reason provided'}"
        )

    # Step 4: Assemble result
    return ScreeningResult(
        ticker=input.ticker,
        company_name=input.company_name,
        decision=decision,
        halal_status=halal_status,
        israel_exposure=israel_exposure,
        confidence_score=confidence,
        screening_status=screening_status,
        exposure_flags=flags,
        reasoning=reasoning,
        notes=input.override_reason,
        is_override=is_override,
    )


def batch_screen(inputs: list[ScreeningInput]) -> list[ScreeningResult]:
    """Screen multiple assets in batch."""
    return [screen_asset(inp) for inp in inputs]
