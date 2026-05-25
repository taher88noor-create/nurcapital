"""
MVP Pipeline — Orchestrates the complete end-to-end flow.

Stages:
1. Asset Ingestion (seed data)
2. Eligibility Engine (hard exclusion)
3. Theme Classification
4. Market Data Fetch
5. Trend & Momentum Analysis
6. Risk Analysis
7. Portfolio Ranking

This produces the complete CanonicalAsset view for the dashboard.
"""

import logging
from datetime import date, timedelta
from typing import Optional

from app.data.seed_assets import MVP_ASSETS, MVP_THEME_ASSIGNMENTS
from app.models.eligibility import EligibilityInput, EligibilityStatus
from app.models.market_data import FetchRequest, PriceBar
from app.services.eligibility_engine import determine_eligibility
from app.services.market_data_service import fetch_prices, get_stored_prices, store_prices
from app.services.trend_engine import analyse_asset
from app.services.risk_engine import analyse_risk

logger = logging.getLogger(__name__)


# ── In-memory asset store (MVP — replace with DB) ─────────────────────────────

_pipeline_results: dict[str, dict] = {}


def get_pipeline_results() -> list[dict]:
    """Get all processed assets from the pipeline."""
    return list(_pipeline_results.values())


def get_asset_by_ticker(ticker: str) -> Optional[dict]:
    """Get a single processed asset."""
    return _pipeline_results.get(ticker)


# ── Pipeline Stages ───────────────────────────────────────────────────────────

def stage_1_ingest() -> list[dict]:
    """Stage 1: Load seed assets into memory."""
    logger.info(f"Stage 1: Ingesting {len(MVP_ASSETS)} assets")
    return MVP_ASSETS


def stage_2_eligibility(assets: list[dict]) -> list[dict]:
    """Stage 2: Run eligibility engine on all assets."""
    results = []
    for asset in assets:
        input_data = EligibilityInput(
            ticker=asset["ticker"],
            company_name=asset["company_name"],
            sector=asset.get("sector"),
            industry=asset.get("industry"),
            country=asset.get("country"),
        )
        result = determine_eligibility(input_data)
        asset["eligibility"] = {
            "status": result.status.value,
            "rejection_reasons": result.rejection_reasons,
            "review_notes": result.review_notes,
            "confidence_level": result.confidence_level,
            "rule_results": [
                {"category": r.category.value, "triggered": r.triggered, "severity": r.severity}
                for r in result.rule_results
            ],
        }
        results.append(asset)
        logger.info(f"  {asset['ticker']}: {result.status.value}")
    return results


def stage_3_themes(assets: list[dict]) -> list[dict]:
    """Stage 3: Assign themes to approved assets."""
    for asset in assets:
        ticker = asset["ticker"]
        themes = MVP_THEME_ASSIGNMENTS.get(ticker, [])
        asset["themes"] = themes
        if themes:
            logger.info(f"  {ticker}: {', '.join(themes)}")
    return assets


async def stage_4_market_data(assets: list[dict]) -> list[dict]:
    """Stage 4: Fetch market data for approved assets."""
    for asset in assets:
        if asset["eligibility"]["status"] != "approved":
            asset["price_history"] = []
            continue

        ticker = asset["ticker"]
        try:
            result = await fetch_prices(FetchRequest(ticker=ticker, days=365))
            if result.success:
                asset["price_history"] = result.bars
                logger.info(f"  {ticker}: {len(result.bars)} bars fetched")
            else:
                asset["price_history"] = []
                logger.warning(f"  {ticker}: fetch failed — {result.error}")
        except Exception as e:
            asset["price_history"] = []
            logger.error(f"  {ticker}: error — {e}")

    return assets


def stage_5_trends(assets: list[dict]) -> list[dict]:
    """Stage 5: Calculate trend & momentum for approved assets with price data."""
    for asset in assets:
        bars = asset.get("price_history", [])
        if not bars or asset["eligibility"]["status"] != "approved":
            asset["trend"] = None
            continue

        trend_data = analyse_asset(bars)
        asset["trend"] = trend_data
        logger.info(f"  {asset['ticker']}: trend={trend_data.get('trend_score')}, momentum={trend_data.get('momentum_score')}")

    return assets


def stage_6_risk(assets: list[dict]) -> list[dict]:
    """Stage 6: Calculate risk metrics for approved assets."""
    for asset in assets:
        bars = asset.get("price_history", [])
        if not bars or asset["eligibility"]["status"] != "approved":
            asset["risk"] = None
            continue

        risk_data = analyse_risk(bars, country=asset.get("country", "US"))
        asset["risk"] = risk_data
        logger.info(f"  {asset['ticker']}: risk={risk_data['overall_risk']} ({risk_data['risk_rating']})")

    return assets


def stage_7_ranking(assets: list[dict]) -> list[dict]:
    """Stage 7: Rank approved assets by attractiveness."""
    approved = [a for a in assets if a["eligibility"]["status"] == "approved" and a.get("trend")]

    for asset in approved:
        trend = asset["trend"]
        risk = asset.get("risk", {})

        # Attractiveness = trend + momentum - volatility_risk
        t = (trend.get("trend_score") or 0)
        m = (trend.get("momentum_score") or 0)
        v = (risk.get("volatility_risk") or 30) / 100

        # Normalise trend/momentum from [-1,1] to [0,1]
        t_norm = (t + 1) / 2
        m_norm = (m + 1) / 2

        score = (t_norm * 0.4 + m_norm * 0.35 - v * 0.25) * 100
        asset["attractiveness_score"] = round(max(0, min(100, score)), 1)

        # Signal
        if score >= 55:
            asset["signal"] = "buy"
        elif score >= 35:
            asset["signal"] = "hold"
        else:
            asset["signal"] = "reduce"

    # Sort by attractiveness
    approved.sort(key=lambda a: a.get("attractiveness_score", 0), reverse=True)

    # Mark non-approved
    for asset in assets:
        if asset["eligibility"]["status"] != "approved":
            asset["attractiveness_score"] = None
            asset["signal"] = None

    return assets


# ── Full Pipeline ─────────────────────────────────────────────────────────────

async def run_full_pipeline() -> list[dict]:
    """
    Execute the complete MVP pipeline end-to-end.
    Returns fully processed assets ready for dashboard display.
    """
    logger.info("=" * 50)
    logger.info("Nür Capital — Running Full Pipeline")
    logger.info("=" * 50)

    # Stage 1
    logger.info("\n[Stage 1] Asset Ingestion")
    assets = stage_1_ingest()

    # Stage 2
    logger.info("\n[Stage 2] Eligibility Engine")
    assets = stage_2_eligibility(assets)

    # Stage 3
    logger.info("\n[Stage 3] Theme Classification")
    assets = stage_3_themes(assets)

    # Stage 4
    logger.info("\n[Stage 4] Market Data")
    assets = await stage_4_market_data(assets)

    # Stage 5
    logger.info("\n[Stage 5] Trend & Momentum")
    assets = stage_5_trends(assets)

    # Stage 6
    logger.info("\n[Stage 6] Risk Analysis")
    assets = stage_6_risk(assets)

    # Stage 7
    logger.info("\n[Stage 7] Opportunity Ranking")
    assets = stage_7_ranking(assets)

    # Store results
    for asset in assets:
        # Remove raw price history from response (too large)
        asset_view = {k: v for k, v in asset.items() if k != "price_history"}
        asset_view["price_count"] = len(asset.get("price_history", []))
        _pipeline_results[asset["ticker"]] = asset_view

    logger.info(f"\n✓ Pipeline complete. {len(assets)} assets processed.")
    approved_count = sum(1 for a in assets if a["eligibility"]["status"] == "approved")
    logger.info(f"  Approved: {approved_count}, Rejected: {len(assets) - approved_count}")

    return [_pipeline_results[a["ticker"]] for a in assets]
