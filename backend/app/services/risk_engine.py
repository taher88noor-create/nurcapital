"""
Risk Analysis Engine — Evaluates risk metrics for approved assets.

Inputs: Price history + trend scores
Outputs: volatility_risk, drawdown_risk, liquidity_risk, overall_risk, risk_rating

Only operates on APPROVED assets.
"""

import math
from typing import Optional

from app.models.market_data import PriceBar


def calculate_volatility_risk(bars: list[PriceBar], period: int = 60) -> Optional[float]:
    """
    Annualised volatility as a risk score (0-100).
    Higher = more risky.
    """
    if len(bars) < period + 1:
        return None

    recent = bars[-(period + 1):]
    returns = []
    for i in range(1, len(recent)):
        if recent[i - 1].close > 0:
            r = (recent[i].close - recent[i - 1].close) / recent[i - 1].close
            returns.append(r)

    if len(returns) < 10:
        return None

    mean = sum(returns) / len(returns)
    variance = sum((r - mean) ** 2 for r in returns) / (len(returns) - 1)
    annualised_vol = math.sqrt(variance) * math.sqrt(252)

    # Scale: 0% = 0, 50%+ = 100
    score = min(100, (annualised_vol / 0.5) * 100)
    return round(score, 1)


def calculate_drawdown_risk(bars: list[PriceBar], period: int = 90) -> Optional[float]:
    """
    Maximum drawdown over period as risk score (0-100).
    """
    if len(bars) < period:
        return None

    recent = bars[-period:]
    peak = recent[0].close
    max_dd = 0

    for bar in recent:
        if bar.close > peak:
            peak = bar.close
        dd = (peak - bar.close) / peak if peak > 0 else 0
        if dd > max_dd:
            max_dd = dd

    # Scale: 0% dd = 0, 40%+ dd = 100
    score = min(100, (max_dd / 0.4) * 100)
    return round(score, 1)


def calculate_liquidity_risk(bars: list[PriceBar]) -> Optional[float]:
    """
    Liquidity risk based on average volume.
    Lower volume = higher risk.
    """
    recent_vols = [b.volume for b in bars[-20:] if b.volume and b.volume > 0]
    if not recent_vols:
        return 50.0  # Unknown = moderate risk

    avg_vol = sum(recent_vols) / len(recent_vols)

    # Scale: >50M = 0 risk, <1M = 80 risk
    if avg_vol >= 50_000_000:
        return 0.0
    elif avg_vol >= 10_000_000:
        return 10.0
    elif avg_vol >= 5_000_000:
        return 20.0
    elif avg_vol >= 1_000_000:
        return 40.0
    else:
        return round(min(80, 80 - (avg_vol / 1_000_000) * 40), 1)


def calculate_geopolitical_risk(country: str) -> float:
    """
    Simple geopolitical risk based on country.
    """
    low_risk = {"us", "uk", "netherlands", "germany", "japan", "switzerland", "canada", "australia"}
    moderate_risk = {"taiwan", "south korea", "india", "brazil", "mexico"}
    elevated_risk = {"china", "russia", "turkey", "saudi arabia"}

    c = country.lower()
    if c in low_risk:
        return 10.0
    elif c in moderate_risk:
        return 35.0
    elif c in elevated_risk:
        return 55.0
    else:
        return 30.0  # Unknown = moderate


def determine_risk_rating(overall: float) -> str:
    """Convert overall risk score to rating."""
    if overall <= 25:
        return "low"
    elif overall <= 45:
        return "moderate"
    elif overall <= 65:
        return "elevated"
    else:
        return "high"


def analyse_risk(bars: list[PriceBar], country: str = "US") -> dict:
    """
    Run full risk analysis on an asset.
    Returns all risk metrics.
    """
    vol_risk = calculate_volatility_risk(bars) or 30.0
    dd_risk = calculate_drawdown_risk(bars) or 25.0
    liq_risk = calculate_liquidity_risk(bars) or 30.0
    geo_risk = calculate_geopolitical_risk(country)

    # Overall: weighted average
    overall = (vol_risk * 0.35 + dd_risk * 0.30 + liq_risk * 0.15 + geo_risk * 0.20)
    rating = determine_risk_rating(overall)

    return {
        "volatility_risk": vol_risk,
        "drawdown_risk": dd_risk,
        "concentration_risk": 0.0,  # Calculated at portfolio level
        "liquidity_risk": liq_risk,
        "geopolitical_risk": geo_risk,
        "overall_risk": round(overall, 1),
        "risk_rating": rating,
    }
