"""
Theme Service — Manages themes and asset-theme relationships.

Responsibilities:
- CRUD operations for themes
- Asset-theme assignment (manual + automated)
- Theme querying and filtering
- Orchestrates the classifier for auto-tagging
"""

from typing import Optional

from app.models.themes import (
    ClassificationInput,
    ClassificationResult,
    TagSource,
    ThemeAssignment,
    ThemeCreate,
    ThemeResponse,
)
from app.services.theme_classifier import classify_asset


# ── In-memory store (replace with database in production) ─────────────────────

_themes: list[dict] = [
    {"id": "t-001", "theme_name": "Semiconductors", "description": "Chip design, fabrication, and semiconductor equipment", "icon": "⚡", "is_active": True},
    {"id": "t-002", "theme_name": "Battery Technology", "description": "Battery manufacturing, materials, and energy storage", "icon": "🔋", "is_active": True},
    {"id": "t-003", "theme_name": "AI Infrastructure", "description": "Cloud computing, data centres, and AI hardware/software", "icon": "🧠", "is_active": True},
    {"id": "t-004", "theme_name": "Industrial Automation", "description": "Robotics, factory automation, and industrial IoT", "icon": "⚙️", "is_active": True},
    {"id": "t-005", "theme_name": "Healthcare", "description": "Pharmaceuticals, biotech, medical devices", "icon": "🧬", "is_active": True},
    {"id": "t-006", "theme_name": "Renewable Energy", "description": "Solar, wind, hydrogen, and clean energy infrastructure", "icon": "☀️", "is_active": True},
    {"id": "t-007", "theme_name": "Cybersecurity", "description": "Network security, identity management, threat detection", "icon": "🔒", "is_active": True},
    {"id": "t-008", "theme_name": "Infrastructure", "description": "Utilities, transport, and physical infrastructure", "icon": "🏗️", "is_active": True},
    {"id": "t-009", "theme_name": "Consumer Staples", "description": "Essential consumer goods, food, household products", "icon": "🛒", "is_active": True},
    {"id": "t-010", "theme_name": "Digital Payments", "description": "Payment processing and fintech infrastructure", "icon": "💳", "is_active": True},
]

_assignments: list[dict] = []


# ── Theme CRUD ────────────────────────────────────────────────────────────────

def list_themes(active_only: bool = True) -> list[ThemeResponse]:
    """List all themes with asset counts."""
    results = []
    for t in _themes:
        if active_only and not t["is_active"]:
            continue
        count = sum(1 for a in _assignments if a["theme_id"] == t["id"])
        results.append(ThemeResponse(
            id=t["id"],
            theme_name=t["theme_name"],
            description=t.get("description"),
            icon=t.get("icon"),
            is_active=t["is_active"],
            asset_count=count,
        ))
    return results


def get_theme(theme_id: str) -> Optional[ThemeResponse]:
    """Get a single theme by ID."""
    for t in _themes:
        if t["id"] == theme_id:
            count = sum(1 for a in _assignments if a["theme_id"] == t["id"])
            return ThemeResponse(
                id=t["id"],
                theme_name=t["theme_name"],
                description=t.get("description"),
                icon=t.get("icon"),
                is_active=t["is_active"],
                asset_count=count,
            )
    return None


def create_theme(data: ThemeCreate) -> ThemeResponse:
    """Create a new theme."""
    new_id = f"t-{len(_themes) + 1:03d}"
    theme = {
        "id": new_id,
        "theme_name": data.theme_name,
        "description": data.description,
        "icon": data.icon,
        "is_active": True,
    }
    _themes.append(theme)
    return ThemeResponse(id=new_id, theme_name=data.theme_name, description=data.description, icon=data.icon, is_active=True, asset_count=0)


# ── Asset-Theme Assignment ────────────────────────────────────────────────────

def assign_theme(assignment: ThemeAssignment) -> dict:
    """Manually assign an asset to a theme."""
    # Check for duplicate
    for a in _assignments:
        if a["asset_id"] == assignment.asset_id and a["theme_id"] == assignment.theme_id:
            return {"status": "already_assigned", "assignment": a}

    record = {
        "id": f"at-{len(_assignments) + 1:04d}",
        "asset_id": assignment.asset_id,
        "theme_id": assignment.theme_id,
        "source": assignment.source.value,
        "confidence": assignment.confidence,
        "reason": assignment.reason,
    }
    _assignments.append(record)
    return {"status": "assigned", "assignment": record}


def remove_theme_assignment(asset_id: str, theme_id: str) -> bool:
    """Remove an asset-theme assignment."""
    global _assignments
    before = len(_assignments)
    _assignments = [a for a in _assignments if not (a["asset_id"] == asset_id and a["theme_id"] == theme_id)]
    return len(_assignments) < before


def get_asset_themes(asset_id: str) -> list[dict]:
    """Get all themes assigned to an asset."""
    results = []
    for a in _assignments:
        if a["asset_id"] == asset_id:
            theme = next((t for t in _themes if t["id"] == a["theme_id"]), None)
            if theme:
                results.append({**a, "theme_name": theme["theme_name"], "icon": theme.get("icon")})
    return results


def get_theme_assets(theme_id: str) -> list[str]:
    """Get all asset IDs assigned to a theme."""
    return [a["asset_id"] for a in _assignments if a["theme_id"] == theme_id]


# ── Auto-Classification ───────────────────────────────────────────────────────

def auto_classify_and_assign(input: ClassificationInput, asset_id: str, auto_assign: bool = False) -> ClassificationResult:
    """
    Run the classifier and optionally auto-assign themes above threshold.

    If auto_assign=True, themes with confidence >= 0.3 are automatically assigned.
    Otherwise, suggestions are returned for manual review.
    """
    result = classify_asset(input)

    if auto_assign:
        for suggestion in result.suggested_themes:
            if suggestion["confidence"] >= 0.3:
                # Find theme ID
                theme = next((t for t in _themes if t["theme_name"] == suggestion["theme_name"]), None)
                if theme:
                    assign_theme(ThemeAssignment(
                        asset_id=asset_id,
                        theme_id=theme["id"],
                        source=TagSource.RULE_BASED,
                        confidence=suggestion["confidence"],
                        reason=suggestion["reason"],
                    ))

    return result
