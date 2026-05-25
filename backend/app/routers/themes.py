"""
Themes Router — API endpoints for theme management and classification.
"""

from fastapi import APIRouter, HTTPException

from app.models.themes import (
    ClassificationInput,
    ClassificationResult,
    ThemeAssignment,
    ThemeCreate,
    ThemeResponse,
)
from app.services.theme_service import (
    assign_theme,
    auto_classify_and_assign,
    create_theme,
    get_asset_themes,
    get_theme,
    get_theme_assets,
    list_themes,
    remove_theme_assignment,
)

router = APIRouter()


# ── Theme CRUD ────────────────────────────────────────────────────────────────

@router.get("/", response_model=list[ThemeResponse])
def get_all_themes(active_only: bool = True):
    """List all investment themes."""
    return list_themes(active_only=active_only)


@router.get("/{theme_id}", response_model=ThemeResponse)
def get_single_theme(theme_id: str):
    """Get a single theme by ID."""
    theme = get_theme(theme_id)
    if not theme:
        raise HTTPException(status_code=404, detail="Theme not found")
    return theme


@router.post("/", response_model=ThemeResponse, status_code=201)
def create_new_theme(data: ThemeCreate):
    """Create a new investment theme."""
    return create_theme(data)


# ── Asset-Theme Assignment ────────────────────────────────────────────────────

@router.post("/assign")
def assign_asset_to_theme(assignment: ThemeAssignment):
    """Manually assign an asset to a theme."""
    result = assign_theme(assignment)
    return result


@router.delete("/assign/{asset_id}/{theme_id}")
def remove_assignment(asset_id: str, theme_id: str):
    """Remove an asset-theme assignment."""
    removed = remove_theme_assignment(asset_id, theme_id)
    if not removed:
        raise HTTPException(status_code=404, detail="Assignment not found")
    return {"status": "removed"}


@router.get("/asset/{asset_id}")
def get_themes_for_asset(asset_id: str):
    """Get all themes assigned to a specific asset."""
    return get_asset_themes(asset_id)


@router.get("/{theme_id}/assets")
def get_assets_for_theme(theme_id: str):
    """Get all asset IDs assigned to a specific theme."""
    return {"theme_id": theme_id, "asset_ids": get_theme_assets(theme_id)}


# ── Classification ────────────────────────────────────────────────────────────

@router.post("/classify", response_model=ClassificationResult)
def classify_single_asset(input: ClassificationInput):
    """Classify an asset into themes (suggestions only, no auto-assign)."""
    return auto_classify_and_assign(input, asset_id="", auto_assign=False)


@router.post("/classify-and-assign")
def classify_and_assign(input: ClassificationInput, asset_id: str, threshold: float = 0.3):
    """Classify an asset and auto-assign themes above the confidence threshold."""
    result = auto_classify_and_assign(input, asset_id=asset_id, auto_assign=True)
    return {
        "classification": result,
        "auto_assigned": [s for s in result.suggested_themes if s["confidence"] >= threshold],
    }
