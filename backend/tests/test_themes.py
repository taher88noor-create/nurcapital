"""
Tests for the theme classification engine.
"""

from app.models.themes import ClassificationInput, ThemeAssignment, ThemeCreate, TagSource
from app.services.theme_classifier import classify_asset
from app.services.theme_service import (
    assign_theme,
    create_theme,
    get_asset_themes,
    list_themes,
)


def test_classify_semiconductor():
    """ASML should be classified as Semiconductors."""
    result = classify_asset(
        ClassificationInput(
            ticker="ASML",
            company_name="ASML Holding",
            sector="Technology",
            industry="Semiconductor Equipment",
        )
    )
    theme_names = [s["theme_name"] for s in result.suggested_themes]
    assert "Semiconductors" in theme_names


def test_classify_healthcare():
    """Novo Nordisk should be classified as Healthcare."""
    result = classify_asset(
        ClassificationInput(
            ticker="NOVO-B",
            company_name="Novo Nordisk",
            sector="Healthcare",
            industry="Pharmaceuticals",
        )
    )
    theme_names = [s["theme_name"] for s in result.suggested_themes]
    assert "Healthcare" in theme_names


def test_classify_ai_infrastructure():
    """NVIDIA should be classified as AI Infrastructure and Semiconductors."""
    result = classify_asset(
        ClassificationInput(
            ticker="NVDA",
            company_name="NVIDIA Corporation",
            sector="Technology",
            industry="Semiconductors",
            description="Designs GPUs for AI training and data center workloads",
        )
    )
    theme_names = [s["theme_name"] for s in result.suggested_themes]
    assert "Semiconductors" in theme_names
    assert "AI Infrastructure" in theme_names


def test_classify_renewable():
    """First Solar should be classified as Renewable Energy."""
    result = classify_asset(
        ClassificationInput(
            ticker="FSLR",
            company_name="First Solar Inc.",
            sector="Technology",
            industry="Solar Equipment",
            description="Manufactures solar photovoltaic panels for utility-scale solar farms",
        )
    )
    theme_names = [s["theme_name"] for s in result.suggested_themes]
    assert "Renewable Energy" in theme_names


def test_classify_multiple_themes():
    """An asset can belong to multiple themes."""
    result = classify_asset(
        ClassificationInput(
            ticker="AMD",
            company_name="Advanced Micro Devices",
            sector="Technology",
            industry="Semiconductors",
            description="Designs CPUs and GPUs for data center AI workloads",
        )
    )
    assert len(result.suggested_themes) >= 2


def test_classify_no_match():
    """An unrelated company should return few or no suggestions."""
    result = classify_asset(
        ClassificationInput(
            ticker="TEST",
            company_name="Generic Holdings Ltd",
            sector="Conglomerate",
            industry="Diversified",
        )
    )
    # May still match on broad sector keywords, but confidence should be low
    high_confidence = [s for s in result.suggested_themes if s["confidence"] >= 0.5]
    assert len(high_confidence) == 0


def test_confidence_ordering():
    """Suggestions should be ordered by confidence descending."""
    result = classify_asset(
        ClassificationInput(
            ticker="TSLA",
            company_name="Tesla Inc.",
            sector="Consumer Discretionary",
            industry="Electric Vehicles",
            description="Electric vehicles and battery energy storage systems",
        )
    )
    if len(result.suggested_themes) >= 2:
        confidences = [s["confidence"] for s in result.suggested_themes]
        assert confidences == sorted(confidences, reverse=True)


def test_list_themes():
    """Should return all active themes."""
    themes = list_themes()
    assert len(themes) >= 8
    names = [t.theme_name for t in themes]
    assert "Semiconductors" in names
    assert "Healthcare" in names


def test_create_theme():
    """Should create a new theme."""
    result = create_theme(ThemeCreate(theme_name="Space Technology", description="Satellites and launch systems", icon="🚀"))
    assert result.theme_name == "Space Technology"
    assert result.is_active is True


def test_assign_theme():
    """Should assign an asset to a theme."""
    result = assign_theme(ThemeAssignment(
        asset_id="asset-001",
        theme_id="t-001",
        source=TagSource.MANUAL,
        confidence=1.0,
        reason="Manually tagged as semiconductor company",
    ))
    assert result["status"] == "assigned"


def test_get_asset_themes():
    """Should retrieve themes for an asset."""
    # First assign
    assign_theme(ThemeAssignment(asset_id="asset-002", theme_id="t-005", source=TagSource.MANUAL, confidence=1.0))
    themes = get_asset_themes("asset-002")
    assert len(themes) >= 1
    assert themes[0]["theme_id"] == "t-005"
