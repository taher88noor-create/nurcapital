"""
Analyst Router — Real technical analysis and conviction grading endpoints.

Uses existing trend_engine, risk_engine, and Yahoo Finance provider
to deliver live analytical data for the Investment Lens pipeline.
"""

from datetime import date, timedelta

from fastapi import APIRouter
from pydantic import BaseModel

from app.models.market_data import FetchRequest
from app.services.market_data_service import fetch_prices
from app.services.trend_engine import analyse_asset
from app.services.risk_engine import analyse_risk

router = APIRouter()


# ── Country mapping for geopolitical risk ─────────────────────────────────────

TICKER_COUNTRY: dict[str, str] = {
    "TSM": "Taiwan", "ASML": "Netherlands", "LLY": "US", "CRWD": "US",
    "AMD": "US", "AVGO": "US", "PANW": "US", "ABB": "Switzerland",
    "NVO": "Denmark", "ENPH": "US", "INFY": "India", "NU": "Brazil",
    "SE": "Singapore", "CPNG": "South Korea", "GLOB": "Argentina",
    "MMYT": "India", "VALE": "Brazil", "PBR": "Brazil", "AMX": "Mexico",
    "FMX": "Mexico", "RDY": "India", "UMC": "Taiwan", "PKX": "South Korea",
    "TTM": "India", "MSFT": "US", "GOOGL": "US", "META": "US",
    "ORCL": "US", "NOW": "US", "SNOW": "US", "CRM": "US", "ADBE": "US",
    "QCOM": "US", "MRVL": "US", "ON": "US", "ADI": "US", "MU": "US",
    "KLAC": "US", "LRCX": "US", "AMAT": "US", "FTNT": "US", "ZS": "US",
    "NET": "US", "JNJ": "US", "ABBV": "US", "AMGN": "US", "ISRG": "US",
    "TMO": "US", "AZN": "UK", "XOM": "US", "CVX": "US", "SHEL": "UK",
    "TTE": "France", "SLB": "US", "ROK": "US", "EMR": "US", "HON": "US",
    "ETN": "US", "FSLR": "US", "NEE": "US", "TSLA": "US", "RIVN": "US",
    "ALB": "US", "JD": "China", "TCOM": "China",
}


# ── Request Models ────────────────────────────────────────────────────────────

class TickerListRequest(BaseModel):
    tickers: list[str]


# ── Endpoint 1: Technical Scan ────────────────────────────────────────────────

@router.post("/technical-scan")
async def technical_scan(req: TickerListRequest):
    """
    Run technical analysis on a pool of assets.
    Returns MA50, MA200, RSI, trend scores, and pass/fail classification.
    """
    results: dict[str, dict] = {}
    errors: list[dict] = []

    for ticker in req.tickers:
        try:
            # Fetch ~400 days of data to ensure 200+ bars for MA200
            result = await fetch_prices(FetchRequest(
                ticker=ticker,
                days=400,
            ))

            if not result.success or not result.bars:
                errors.append({"ticker": ticker, "error": result.error or "No data returned"})
                continue

            bars = result.bars

            # Run trend analysis
            analysis = analyse_asset(bars)

            current_price = analysis["current_price"]
            ma50 = analysis["moving_average_50"]
            ma200 = analysis["moving_average_200"]
            rsi14 = analysis["relative_strength"]
            trend_score = analysis["trend_score"]
            momentum_score = analysis["momentum_score"]
            volatility_score = analysis["volatility_score"]
            market_regime = analysis["market_regime"]

            # Pass criteria:
            # price > MA50 AND price > MA200 AND RSI >= 40
            # If MA200 is None (insufficient data), pass = false
            passed = False
            if current_price and ma50 and ma200 and rsi14 is not None:
                passed = (
                    current_price > ma50
                    and current_price > ma200
                    and rsi14 >= 40
                )

            results[ticker] = {
                "current_price": current_price,
                "ma50": ma50,
                "ma200": ma200,
                "rsi14": rsi14,
                "trend_score": trend_score,
                "momentum_score": momentum_score,
                "volatility_score": volatility_score,
                "market_regime": market_regime,
                "pass": passed,
            }

        except Exception as e:
            errors.append({"ticker": ticker, "error": str(e)})

    return {"results": results, "errors": errors}


# ── Endpoint 2: Conviction Grade ─────────────────────────────────────────────

@router.post("/conviction-grade")
async def conviction_grade(req: TickerListRequest):
    """
    Grade assets using trend scores and risk analysis.
    Returns risk metrics and BUY/HOLD/WATCH classification.
    """
    results: dict[str, dict] = {}
    errors: list[dict] = []

    for ticker in req.tickers:
        try:
            # Fetch ~400 days of data
            result = await fetch_prices(FetchRequest(
                ticker=ticker,
                days=400,
            ))

            if not result.success or not result.bars:
                errors.append({"ticker": ticker, "error": result.error or "No data returned"})
                continue

            bars = result.bars

            # Trend analysis
            analysis = analyse_asset(bars)
            trend_score = analysis["trend_score"]
            current_price = analysis["current_price"]

            # Risk analysis
            country = TICKER_COUNTRY.get(ticker, "US")
            risk = analyse_risk(bars, country)

            volatility_risk = risk["volatility_risk"]
            drawdown_risk = risk["drawdown_risk"]
            liquidity_risk = risk["liquidity_risk"]
            geopolitical_risk = risk["geopolitical_risk"]
            overall_risk = risk["overall_risk"]
            risk_rating = risk["risk_rating"]

            # Grade criteria
            grade = "WATCH"
            if (
                trend_score is not None
                and trend_score > 0.2
                and risk_rating in ("low", "moderate")
                and overall_risk < 40
            ):
                grade = "BUY"
            elif (
                (trend_score is not None and trend_score > 0)
                or risk_rating == "moderate"
            ):
                grade = "HOLD"

            results[ticker] = {
                "current_price": current_price,
                "trend_score": trend_score,
                "volatility_risk": volatility_risk,
                "drawdown_risk": drawdown_risk,
                "liquidity_risk": liquidity_risk,
                "geopolitical_risk": geopolitical_risk,
                "overall_risk": overall_risk,
                "risk_rating": risk_rating,
                "grade": grade,
            }

        except Exception as e:
            errors.append({"ticker": ticker, "error": str(e)})

    return {"results": results, "errors": errors}
