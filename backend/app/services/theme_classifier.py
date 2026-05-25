"""
Theme Classifier — Rule-based engine for classifying assets into investment themes.

Architecture:
- Each theme has a set of classification rules (keyword + sector matching)
- Rules are composable and extensible
- Supports future AI-assisted classification via the same interface
"""

from app.models.themes import ClassificationInput, ClassificationResult, TagSource


# ── Theme Classification Rules ────────────────────────────────────────────────
# Each rule: (theme_name, keywords_industry, keywords_sector, keywords_description)

THEME_RULES: list[dict] = [
    {
        "theme_name": "Semiconductors",
        "industry_keywords": ["semiconductor", "chip", "fabrication", "wafer", "integrated circuit"],
        "sector_keywords": [],
        "name_keywords": ["semiconductor", "tsmc", "asml", "amd", "nvidia", "broadcom", "qualcomm", "arm"],
        "description_keywords": ["chip design", "fab", "lithography", "silicon"],
    },
    {
        "theme_name": "Battery Technology",
        "industry_keywords": ["battery", "energy storage", "lithium", "solid state"],
        "sector_keywords": [],
        "name_keywords": ["catl", "panasonic energy", "quantumscape", "solid power"],
        "description_keywords": ["battery", "energy storage", "lithium-ion", "ev battery"],
    },
    {
        "theme_name": "AI Infrastructure",
        "industry_keywords": ["artificial intelligence", "cloud computing", "data centre", "data center", "machine learning"],
        "sector_keywords": [],
        "name_keywords": ["nvidia", "amd", "broadcom", "salesforce", "palantir", "snowflake"],
        "description_keywords": ["ai", "machine learning", "gpu", "cloud", "data center"],
    },
    {
        "theme_name": "Industrial Automation",
        "industry_keywords": ["automation", "robotics", "industrial iot", "factory automation", "plc"],
        "sector_keywords": ["industrials"],
        "name_keywords": ["fanuc", "abb", "siemens", "rockwell", "keyence", "cognex"],
        "description_keywords": ["robot", "automation", "industrial control", "motion control"],
    },
    {
        "theme_name": "Healthcare",
        "industry_keywords": ["pharmaceutical", "biotech", "medical device", "diagnostics", "health"],
        "sector_keywords": ["healthcare"],
        "name_keywords": ["novo nordisk", "eli lilly", "astrazeneca", "roche", "johnson"],
        "description_keywords": ["drug", "therapy", "clinical", "patient", "medical"],
    },
    {
        "theme_name": "Renewable Energy",
        "industry_keywords": ["solar", "wind", "renewable", "hydrogen", "clean energy", "geothermal"],
        "sector_keywords": [],
        "name_keywords": ["enphase", "first solar", "vestas", "orsted", "nextera"],
        "description_keywords": ["solar", "wind", "renewable", "clean energy", "green hydrogen"],
    },
    {
        "theme_name": "Cybersecurity",
        "industry_keywords": ["cybersecurity", "network security", "identity management", "threat detection"],
        "sector_keywords": [],
        "name_keywords": ["crowdstrike", "palo alto", "fortinet", "zscaler", "sentinelone"],
        "description_keywords": ["security", "threat", "firewall", "endpoint", "zero trust"],
    },
    {
        "theme_name": "Infrastructure",
        "industry_keywords": ["infrastructure", "construction", "utilities", "water", "transport"],
        "sector_keywords": ["utilities"],
        "name_keywords": ["national grid", "american tower", "brookfield", "vinci"],
        "description_keywords": ["infrastructure", "grid", "pipeline", "utility", "transport"],
    },
    {
        "theme_name": "Consumer Staples",
        "industry_keywords": ["consumer goods", "food", "household", "personal care", "retail"],
        "sector_keywords": ["consumer staples"],
        "name_keywords": ["costco", "procter", "unilever", "nestle", "colgate"],
        "description_keywords": ["consumer", "grocery", "household", "food", "beverage"],
    },
    {
        "theme_name": "Digital Payments",
        "industry_keywords": ["payment", "fintech", "transaction processing"],
        "sector_keywords": [],
        "name_keywords": ["adyen", "block", "paypal", "stripe"],
        "description_keywords": ["payment", "transaction", "merchant", "checkout"],
    },
]


def _match_score(text: str, keywords: list[str]) -> float:
    """Calculate match score: proportion of keywords found in text."""
    if not text or not keywords:
        return 0.0
    text_lower = text.lower()
    matches = sum(1 for kw in keywords if kw.lower() in text_lower)
    return matches / len(keywords) if keywords else 0.0


def classify_asset(input: ClassificationInput) -> ClassificationResult:
    """
    Classify an asset into themes using rule-based matching.

    Scoring:
    - Industry keyword match: weight 0.4
    - Sector keyword match: weight 0.2
    - Company name match: weight 0.25
    - Description match: weight 0.15

    Threshold: 0.15 minimum confidence to suggest a theme.
    """
    suggestions = []

    for rule in THEME_RULES:
        score = 0.0

        # Industry match (highest signal)
        industry_score = _match_score(input.industry or "", rule["industry_keywords"])
        score += industry_score * 0.4

        # Sector match
        sector_score = _match_score(input.sector or "", rule["sector_keywords"])
        score += sector_score * 0.2

        # Company name match
        name_score = _match_score(input.company_name or "", rule["name_keywords"])
        score += name_score * 0.25

        # Description match
        desc_score = _match_score(input.description or "", rule["description_keywords"])
        score += desc_score * 0.15

        # Threshold check
        if score >= 0.15:
            # Generate reason
            matched_areas = []
            if industry_score > 0:
                matched_areas.append("industry")
            if sector_score > 0:
                matched_areas.append("sector")
            if name_score > 0:
                matched_areas.append("company profile")
            if desc_score > 0:
                matched_areas.append("description")

            reason = f"Matched on: {', '.join(matched_areas)}" if matched_areas else "Rule-based match"

            suggestions.append({
                "theme_name": rule["theme_name"],
                "confidence": round(min(score, 1.0), 2),
                "reason": reason,
            })

    # Sort by confidence descending
    suggestions.sort(key=lambda x: x["confidence"], reverse=True)

    return ClassificationResult(
        ticker=input.ticker,
        company_name=input.company_name,
        suggested_themes=suggestions,
        source=TagSource.RULE_BASED,
    )


def batch_classify(inputs: list[ClassificationInput]) -> list[ClassificationResult]:
    """Classify multiple assets in batch."""
    return [classify_asset(inp) for inp in inputs]
