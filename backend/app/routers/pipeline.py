"""
Pipeline Router — API endpoints for the MVP pipeline.
"""

from fastapi import APIRouter, HTTPException

from app.services.pipeline import get_asset_by_ticker, get_pipeline_results, run_full_pipeline

router = APIRouter()


@router.post("/run")
async def execute_pipeline():
    """Run the complete end-to-end pipeline. Returns all processed assets."""
    results = await run_full_pipeline()
    return {
        "status": "complete",
        "total_assets": len(results),
        "approved": sum(1 for r in results if r.get("eligibility", {}).get("status") == "approved"),
        "assets": results,
    }


@router.get("/assets")
def get_all_assets():
    """Get all processed assets from the last pipeline run."""
    results = get_pipeline_results()
    if not results:
        return {"status": "not_run", "message": "Pipeline has not been executed yet. POST /api/pipeline/run first.", "assets": []}
    return {
        "status": "ready",
        "total": len(results),
        "approved": sum(1 for r in results if r.get("eligibility", {}).get("status") == "approved"),
        "assets": results,
    }


@router.get("/assets/{ticker}")
def get_single_asset(ticker: str):
    """Get a single processed asset by ticker."""
    asset = get_asset_by_ticker(ticker.upper())
    if not asset:
        # Try with original casing
        asset = get_asset_by_ticker(ticker)
    if not asset:
        raise HTTPException(status_code=404, detail=f"Asset {ticker} not found. Run pipeline first.")
    return asset


@router.get("/approved")
def get_approved_assets():
    """Get only approved assets (ready for portfolio)."""
    results = get_pipeline_results()
    approved = [r for r in results if r.get("eligibility", {}).get("status") == "approved"]
    return {
        "total": len(approved),
        "assets": sorted(approved, key=lambda a: a.get("attractiveness_score") or 0, reverse=True),
    }


@router.get("/rankings")
def get_rankings():
    """Get approved assets ranked by attractiveness score."""
    results = get_pipeline_results()
    approved = [r for r in results if r.get("eligibility", {}).get("status") == "approved" and r.get("attractiveness_score")]
    ranked = sorted(approved, key=lambda a: a["attractiveness_score"], reverse=True)
    return {
        "rankings": [
            {
                "rank": i + 1,
                "ticker": a["ticker"],
                "company_name": a["company_name"],
                "signal": a.get("signal"),
                "attractiveness_score": a["attractiveness_score"],
                "trend_score": a.get("trend", {}).get("trend_score") if a.get("trend") else None,
                "risk_rating": a.get("risk", {}).get("risk_rating") if a.get("risk") else None,
                "themes": a.get("themes", []),
            }
            for i, a in enumerate(ranked)
        ]
    }
