"""
Theme Models — Pydantic schemas for the theme classification engine.
"""

from datetime import datetime
from enum import Enum
from typing import Optional

from pydantic import BaseModel, Field


class TagSource(str, Enum):
    MANUAL = "manual"
    RULE_BASED = "rule_based"
    AI_ASSISTED = "ai_assisted"


class ThemeCreate(BaseModel):
    """Input for creating a new theme."""
    theme_name: str = Field(min_length=2, max_length=100)
    description: Optional[str] = None
    icon: Optional[str] = None


class ThemeResponse(BaseModel):
    """Theme output."""
    id: str
    theme_name: str
    description: Optional[str] = None
    icon: Optional[str] = None
    is_active: bool = True
    asset_count: int = 0


class ThemeAssignment(BaseModel):
    """Assign an asset to a theme."""
    asset_id: str
    theme_id: str
    source: TagSource = TagSource.MANUAL
    confidence: float = Field(default=1.0, ge=0, le=1)
    reason: Optional[str] = None


class ThemeAssignmentResponse(BaseModel):
    """Theme assignment output."""
    id: str
    asset_id: str
    theme_id: str
    theme_name: str
    source: TagSource
    confidence: float
    reason: Optional[str] = None
    assigned_at: datetime


class ClassificationInput(BaseModel):
    """Input for auto-classifying an asset into themes."""
    ticker: str
    company_name: str
    sector: Optional[str] = None
    industry: Optional[str] = None
    description: Optional[str] = None


class ClassificationResult(BaseModel):
    """Output from the theme classifier."""
    ticker: str
    company_name: str
    suggested_themes: list[dict]  # [{theme_name, confidence, reason}]
    source: TagSource = TagSource.RULE_BASED
