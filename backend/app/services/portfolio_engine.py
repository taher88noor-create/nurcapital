"""
Portfolio & Allocation Engine — Generates allocation suggestions for APPROVED assets only.

IMPORTANT PRINCIPLE:
This engine does NOT perform ethical screening.
All assets entering this engine have ALREADY passed the Eligibility Engine.
Scoring here is based ONLY on: trend, momentum, and risk.

Architecture:
1. Accept pre-approved assets with trend/momentum/risk scores
2. Compute attractiveness score (trend + momentum - volatility)
3. Apply risk profile parameters
4. Apply market condition adjustments (defensive in bearish)
5. Rank and select top N holdings
6. Allocate weights (score-proportional, capped)
7. Assign signals (buy/hold/reduce/watchlist)
8. Generate reasoning

Constraints:
- No leverage
- No short selling
- Defensive positioning during weak markets
- Max allocation per asset
- Diversified thematic exposure
"""

from app.models.portfolio import (
    ApprovedAsset,
    AssetSuggestion,
    MarketCondition,
    PortfolioRequest,
    PortfolioResult,
    RiskProfile,
    Signal,
)


# ── Risk Profile Parameters ───────────────────────────────────────────────────
# No ethical_weight — eligibility is binary, not weighted.

RISK_PARAMS = {
    RiskProfile.CONSERVATIVE: {
        "trend_weight": 0.35,
        "momentum_weight": 0.25,
        "volatility_penalty": 0.40,
        "cash_target": 15.0,
        "max_holdings": 6,
    },
    RiskProfile.BALANCED: {
        "trend_weight": 0.40,
        "momentum_weight": 0.35,
        "volatility_penalty": 0.25,
        "cash_target": 8.0,
        "max_holdings": 8,
    },
    RiskProfile.GROWTH: {
        "trend_weight": 0.40,
        "momentum_weight": 0.45,
        "volatility_penalty": 0.15,
        "cash_target": 5.0,
        "max_holdings": 10,
    },
    RiskProfile.AGGRESSIVE: {
        "trend_weight": 0.40,
        "momentum_weight": 0.50,
        "volatility_penalty": 0.10,
        "cash_target": 3.0,
        "max_holdings": 10,
    },
}

# ── Market Condition Adjustments ──────────────────────────────────────────────

MARKET_ADJUSTMENTS = {
    MarketCondition.BULLISH: {"cash_add": -3.0, "momentum_boost": 0.1, "label": "Risk-on: reduced cash, momentum favoured"},
    MarketCondition.NEUTRAL: {"cash_add": 0.0, "momentum_boost": 0.0, "label": "Neutral positioning"},
    MarketCondition.BEARISH: {"cash_add": 12.0, "momentum_boost": -0.15, "label": "Defensive: elevated cash, momentum discounted"},
    MarketCondition.VOLATILE: {"cash_add": 6.0, "momentum_boost": -0.05, "label": "Cautious: increased cash buffer"},
}


# ── Attractiveness Scoring (trend + momentum only) ────────────────────────────

def _compute_attractiveness(asset: ApprovedAsset, params: dict, market_adj: dict) -> float:
    """
    Compute market attractiveness score for an approved asset.

    Score = (trend × w_trend) + (momentum × w_momentum) - (volatility × penalty)

    This is NOT ethical scoring. Eligibility is already determined.
    """
    # Normalise from [-1,1] to [0,1]
    trend_norm = (asset.trend_score + 1) / 2
    momentum_norm = (asset.momentum_score + 1) / 2 + market_adj["momentum_boost"]
    momentum_norm = max(0, min(1, momentum_norm))

    score = (
        trend_norm * params["trend_weight"]
        + momentum_norm * params["momentum_weight"]
        - asset.volatility_score * params["volatility_penalty"]
    )

    return round(max(0, min(100, score * 100)), 1)


# ── Signal Assignment ─────────────────────────────────────────────────────────

def _assign_signal(score: float, rank: int, max_holdings: int, market: MarketCondition) -> Signal:
    """Assign signal based on attractiveness score and rank."""
    if rank > max_holdings:
        return Signal.WATCHLIST

    if market == MarketCondition.BEARISH:
        if score >= 60:
            return Signal.BUY
        elif score >= 40:
            return Signal.HOLD
        else:
            return Signal.REDUCE
    else:
        if score >= 50:
            return Signal.BUY
        elif score >= 30:
            return Signal.HOLD
        else:
            return Signal.REDUCE


# ── Allocation ────────────────────────────────────────────────────────────────

def _allocate_weights(
    scored: list[tuple[ApprovedAsset, float]],
    max_holdings: int,
    max_single: float,
    cash_pct: float,
) -> list[tuple[ApprovedAsset, float, float]]:
    """Allocate weights proportional to attractiveness scores."""
    top = scored[:max_holdings]
    if not top:
        return []

    total_score = sum(s for _, s in top)
    if total_score == 0:
        # Equal weight if all scores are zero
        equity_budget = 100.0 - cash_pct
        equal_weight = round(equity_budget / len(top), 1)
        return [(a, s, min(equal_weight, max_single)) for a, s in top]

    equity_budget = 100.0 - cash_pct
    allocations = []

    for asset, score in top:
        raw_weight = (score / total_score) * equity_budget
        capped_weight = min(raw_weight, max_single)
        allocations.append((asset, score, round(capped_weight, 1)))

    # Redistribute excess from capping
    total_allocated = sum(w for _, _, w in allocations)
    if total_allocated < equity_budget - 1:
        deficit = equity_budget - total_allocated
        uncapped = [(i, w) for i, (_, _, w) in enumerate(allocations) if w < max_single]
        if uncapped:
            per_asset = deficit / len(uncapped)
            for i, w in uncapped:
                a, s, _ = allocations[i]
                allocations[i] = (a, s, round(min(w + per_asset, max_single), 1))

    return allocations


# ── Reasoning ─────────────────────────────────────────────────────────────────

def _generate_reasoning(asset: ApprovedAsset, score: float, signal: Signal) -> list[str]:
    """Generate reasoning for a single asset."""
    reasons = []

    if asset.trend_score > 0.3:
        reasons.append("Strong uptrend")
    elif asset.trend_score > 0:
        reasons.append("Mild uptrend")
    elif asset.trend_score < -0.3:
        reasons.append("Downtrend — caution")

    if asset.momentum_score > 0.3:
        reasons.append("Strong recent momentum")
    elif asset.momentum_score < -0.3:
        reasons.append("Weak momentum")

    if asset.volatility_score > 0.6:
        reasons.append("High volatility — position sized conservatively")
    elif asset.volatility_score < 0.25:
        reasons.append("Low volatility — stable")

    if signal == Signal.BUY:
        reasons.append("Above allocation threshold")
    elif signal == Signal.REDUCE:
        reasons.append("Below threshold — consider reducing")

    return reasons


# ── Main Engine ───────────────────────────────────────────────────────────────

def generate_portfolio(request: PortfolioRequest) -> PortfolioResult:
    """
    Generate portfolio allocation suggestions.

    ALL assets in the request must have already passed the Eligibility Engine.
    This engine scores on market attractiveness only.
    """
    if not request.assets:
        return PortfolioResult(
            suggestions=[],
            cash_allocation_pct=100.0,
            portfolio_score=0,
            risk_profile=request.risk_profile,
            market_condition=request.market_condition,
            total_holdings=0,
            reasoning=["No approved assets provided"],
        )

    params = RISK_PARAMS[request.risk_profile]
    market_adj = MARKET_ADJUSTMENTS[request.market_condition]

    max_holdings = min(request.max_holdings, params["max_holdings"])
    cash_target = max(request.cash_minimum, params["cash_target"] + market_adj["cash_add"])
    cash_target = min(cash_target, 50.0)

    # Score each asset on market attractiveness
    scored = [(a, _compute_attractiveness(a, params, market_adj)) for a in request.assets]
    scored.sort(key=lambda x: x[1], reverse=True)

    # Allocate
    allocated = _allocate_weights(scored, max_holdings, request.max_single_allocation, cash_target)

    # Build suggestions
    suggestions = []
    for rank, (asset, score, weight) in enumerate(allocated, 1):
        signal = _assign_signal(score, rank, max_holdings, request.market_condition)
        reasoning = _generate_reasoning(asset, score, signal)
        suggestions.append(AssetSuggestion(
            ticker=asset.ticker,
            company_name=asset.company_name,
            signal=signal,
            allocation_pct=weight,
            attractiveness_score=score,
            reasoning=reasoning,
        ))

    # Portfolio metrics
    total_equity = sum(s.allocation_pct for s in suggestions)
    actual_cash = round(100.0 - total_equity, 1)
    avg_score = sum(s.attractiveness_score for s in suggestions) / len(suggestions) if suggestions else 0

    portfolio_reasoning = [
        f"Risk profile: {request.risk_profile.value}",
        f"Market condition: {request.market_condition.value} — {market_adj['label']}",
        f"Holdings: {len(suggestions)} of {len(request.assets)} approved assets selected",
        f"Cash reserve: {actual_cash}%",
    ]

    buy_count = sum(1 for s in suggestions if s.signal == Signal.BUY)
    if buy_count > len(suggestions) / 2:
        portfolio_reasoning.append("Positioning: constructive — majority buy signals")
    else:
        portfolio_reasoning.append("Positioning: cautious — selective allocation")

    return PortfolioResult(
        suggestions=suggestions,
        cash_allocation_pct=actual_cash,
        portfolio_score=round(avg_score, 1),
        risk_profile=request.risk_profile,
        market_condition=request.market_condition,
        total_holdings=len(suggestions),
        reasoning=portfolio_reasoning,
    )
