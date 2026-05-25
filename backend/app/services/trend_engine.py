"""
Trend & Momentum Engine — Calculates technical indicators for approved assets.

Inputs: Price history (from market data service)
Outputs: MA50, MA200, trend_score, momentum_score, volatility_score

This engine only operates on APPROVED assets.
"""

import math
from typing import Optional

from app.models.market_data import PriceBar


def calculate_moving_average(bars: list[PriceBar], period: int) -> Optional[float]:
    """Calculate simple moving average over N most recent bars."""
    if len(bars) < period:
        return None
    recent = bars[-period:]
    return round(sum(b.close for b in recent) / period, 4)


def calculate_momentum(bars: list[PriceBar], lookback: int = 20) -> Optional[float]:
    """
    Calculate momentum as rate of change over lookback period.
    Returns value between -1 and 1.
    """
    if len(bars) < lookback + 1:
        return None
    current = bars[-1].close
    past = bars[-(lookback + 1)].close
    if past == 0:
        return None
    roc = (current - past) / past
    # Clamp to [-1, 1]
    return round(max(-1.0, min(1.0, roc)), 4)


def calculate_volatility(bars: list[PriceBar], period: int = 30) -> Optional[float]:
    """
    Calculate annualised volatility (standard deviation of daily returns).
    Returns value between 0 and 1 (normalised).
    """
    if len(bars) < period + 1:
        return None
    recent = bars[-(period + 1):]
    returns = []
    for i in range(1, len(recent)):
        if recent[i - 1].close > 0:
            daily_return = (recent[i].close - recent[i - 1].close) / recent[i - 1].close
            returns.append(daily_return)

    if len(returns) < 2:
        return None

    mean = sum(returns) / len(returns)
    variance = sum((r - mean) ** 2 for r in returns) / (len(returns) - 1)
    std_dev = math.sqrt(variance)
    annualised = std_dev * math.sqrt(252)

    # Normalise: 0% vol = 0, 60%+ vol = 1
    normalised = min(1.0, annualised / 0.6)
    return round(normalised, 4)


def calculate_trend_score(bars: list[PriceBar]) -> Optional[float]:
    """
    Calculate trend score (-1 to 1).
    Based on: price vs MA50, MA50 vs MA200, and MA slope.
    """
    if len(bars) < 200:
        # Fallback: use shorter period if not enough data
        if len(bars) < 50:
            return None
        ma50 = calculate_moving_average(bars, 50)
        current = bars[-1].close
        if ma50 and ma50 > 0:
            return round(max(-1, min(1, (current - ma50) / ma50 * 5)), 4)
        return None

    ma50 = calculate_moving_average(bars, 50)
    ma200 = calculate_moving_average(bars, 200)
    current = bars[-1].close

    if not ma50 or not ma200 or ma200 == 0:
        return None

    # Component 1: Price vs MA50 (40% weight)
    price_vs_ma50 = (current - ma50) / ma50

    # Component 2: MA50 vs MA200 (40% weight)
    ma_cross = (ma50 - ma200) / ma200

    # Component 3: MA50 slope (20% weight)
    ma50_10_ago = calculate_moving_average(bars[:-10], 50) if len(bars) > 60 else ma50
    ma_slope = ((ma50 - ma50_10_ago) / ma50_10_ago) if ma50_10_ago and ma50_10_ago > 0 else 0

    score = (price_vs_ma50 * 0.4 + ma_cross * 0.4 + ma_slope * 0.2) * 10
    return round(max(-1.0, min(1.0, score)), 4)


def calculate_relative_strength(bars: list[PriceBar], period: int = 14) -> Optional[float]:
    """Calculate RSI-style relative strength (0-100)."""
    if len(bars) < period + 1:
        return None

    recent = bars[-(period + 1):]
    gains = []
    losses = []

    for i in range(1, len(recent)):
        change = recent[i].close - recent[i - 1].close
        if change > 0:
            gains.append(change)
            losses.append(0)
        else:
            gains.append(0)
            losses.append(abs(change))

    avg_gain = sum(gains) / period
    avg_loss = sum(losses) / period

    if avg_loss == 0:
        return 100.0

    rs = avg_gain / avg_loss
    rsi = 100 - (100 / (1 + rs))
    return round(rsi, 2)


def analyse_asset(bars: list[PriceBar]) -> dict:
    """
    Run full trend analysis on an asset's price history.
    Returns all calculated metrics.
    """
    if not bars or len(bars) < 20:
        return {
            "current_price": bars[-1].close if bars else None,
            "moving_average_50": None,
            "moving_average_200": None,
            "trend_score": None,
            "momentum_score": None,
            "relative_strength": None,
            "volatility_score": None,
            "market_regime": "neutral",
            "average_volume": None,
        }

    ma50 = calculate_moving_average(bars, 50)
    ma200 = calculate_moving_average(bars, 200)
    trend = calculate_trend_score(bars)
    momentum = calculate_momentum(bars, 20)
    volatility = calculate_volatility(bars, 30)
    rsi = calculate_relative_strength(bars, 14)

    # Determine market regime
    regime = "neutral"
    if trend is not None:
        if trend > 0.3:
            regime = "bullish"
        elif trend < -0.3:
            regime = "bearish"
    if volatility is not None and volatility > 0.6:
        regime = "volatile"

    # Average volume (last 20 days)
    recent_vols = [b.volume for b in bars[-20:] if b.volume]
    avg_vol = int(sum(recent_vols) / len(recent_vols)) if recent_vols else None

    return {
        "current_price": bars[-1].close,
        "moving_average_50": ma50,
        "moving_average_200": ma200,
        "trend_score": trend,
        "momentum_score": momentum,
        "relative_strength": rsi,
        "volatility_score": volatility,
        "market_regime": regime,
        "average_volume": avg_vol,
    }
