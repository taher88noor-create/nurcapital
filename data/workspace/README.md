# Nür Capital — Research Workspace (Populated)

## Files

| File | Records | Purpose |
|------|---------|---------|
| `approved-assets.csv` | 22 assets | All approved assets with scores, signals, and allocations |
| `watchlist-assets.csv` | 6 assets | Assets under active investigation |
| `rejected-assets.csv` | 15 assets | Permanently excluded assets with full audit trail |
| `themes.csv` | 12 themes | Theme dashboard with status, weights, and macro analysis |
| `portfolio-tracker.csv` | 12 positions + cash | Current portfolio state with drift monitoring |
| `market-regime.csv` | 7 entries | Regime history from March–May 2025 |
| `investment-theses.csv` | 6 theses | Active investment theses with evidence and invalidation conditions |
| `audit-log.csv` | 53 entries | Complete decision history from January–May 2025 |

## Universe Summary

| Status | Count |
|--------|-------|
| Approved | 22 |
| Watchlist | 6 |
| Rejected | 15 |
| **Total** | **43** |

## Portfolio Summary

| Metric | Value |
|--------|-------|
| Equity allocation | 76% |
| Cash reserve | 24% |
| Positions | 12 |
| Themes represented | 7 |
| Current regime | Weak Bull |
| Largest position | TSM (12.8%) |

## How to Use

### Import to Google Sheets
1. Open Google Sheets
2. File → Import → Upload each CSV
3. Create one sheet per file
4. Add data validation dropdowns (see `docs/research-workspace.md` for values)

### Import to Airtable
1. Create new Airtable base
2. Import each CSV as a separate table
3. Convert text fields to appropriate types (Select, Date, Currency, etc.)
4. Create linked record relationships between tables

### Import to Notion
1. Create new Notion database for each table
2. Import CSV data
3. Set property types
4. Create relations between databases

## Data Integrity Notes

- All eligibility decisions have documented rationale
- All rejected assets have evidence sources cited
- All portfolio positions have associated theses
- All regime changes have confirmation (2-week rule)
- Audit log is append-only (never edit existing entries)
- Timestamps are sequential and consistent with the narrative
