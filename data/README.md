# Nür Capital — Master Asset Universe

## Purpose

This spreadsheet is the **source of truth** for the Nür Capital investment universe. It tracks every asset considered for the portfolio — approved, watchlisted, or rejected — with full eligibility audit trails.

## File

- **`asset-universe.csv`** — Open in Excel, Google Sheets, or any spreadsheet tool

---

## Column Reference

### Core Asset Data

| Column | Description | Example Values |
|--------|-------------|----------------|
| Ticker | Exchange symbol | TSM, ASML, 1211.HK |
| Company Name | Full legal/trading name | Taiwan Semiconductor Manufacturing |
| Asset Type | Security classification | `equity`, `etf`, `fund`, `sukuk`, `reit` |
| Exchange | Primary listing exchange | NYSE, NASDAQ, EURONEXT, HKEX, TADAWUL |
| Country | Country of incorporation | US, Taiwan, Netherlands, China |
| Sector | GICS sector | Technology, Healthcare, Energy, Financials |
| Industry | Sub-industry | Semiconductors, Islamic Banking, Solar |
| Market Cap (USD) | Market capitalisation in USD | 700000000000 |
| Website | Company website | https://tsmc.com |

### Eligibility Engine

| Column | Description | Allowed Values |
|--------|-------------|----------------|
| Eligibility Status | Final determination | `APPROVED`, `WATCHLIST`, `REJECTED` |
| Israel Exposure | Israel operations/revenue | `CLEAR`, `FLAGGED` |
| Gambling Exposure | Gambling revenue | `CLEAR`, `FLAGGED` |
| Alcohol Exposure | Alcohol production/revenue | `CLEAR`, `FLAGGED` |
| Interest-Based Finance | Conventional banking/lending | `CLEAR`, `FLAGGED` |
| Weapons Exposure | Arms manufacturing/sales | `CLEAR`, `FLAGGED` |
| Adult Industry | Adult content/services | `CLEAR`, `FLAGGED` |
| Prohibited Structure | Non-compliant corporate structure | `CLEAR`, `FLAGGED` |
| Rejection Reasons | Free text explanation | Specific rule that triggered exclusion |
| Review Notes | Analyst commentary | Context for the decision |
| Confidence Level | Certainty of assessment | `HIGH`, `MEDIUM`, `LOW` |
| Last Reviewed Date | Date of last eligibility review | YYYY-MM-DD format |

### Theme Classification

| Column | Description | Allowed Values |
|--------|-------------|----------------|
| Primary Theme | Main investment theme | See theme list below |
| Secondary Theme | Additional theme | See theme list below |
| Additional Themes | Further themes (comma-separated) | See theme list below |

**Available Themes:**
- Semiconductors
- AI Infrastructure
- Battery Technology
- Halal Finance
- Islamic Banking
- Clean Energy
- Oil & Gas
- Energy Infrastructure
- Healthcare
- Industrial Automation
- Robotics
- Cybersecurity
- Manufacturing
- Logistics
- Consumer Staples

### Market & Trend Data

| Column | Description | Notes |
|--------|-------------|-------|
| Current Price | Latest closing price (USD) | Updated daily |
| MA50 | 50-day moving average | Trend indicator |
| MA200 | 200-day moving average | Long-term trend |
| Trend Score | Normalised trend (-1 to +1) | >0 = uptrend |
| Momentum Score | Normalised momentum (-1 to +1) | >0 = positive momentum |
| Volatility Rating | Annualised volatility bucket | `low`, `moderate`, `elevated`, `high` |
| Risk Rating | Overall risk assessment | `low`, `moderate`, `elevated`, `high` |

### Portfolio Engine

| Column | Description | Allowed Values |
|--------|-------------|----------------|
| Suggested Action | Portfolio signal | `BUY`, `HOLD`, `REDUCE`, `WATCHLIST` |
| Suggested Allocation % | Target weight in portfolio | 0-100 (total should ≤ 100) |
| Portfolio Notes | Rationale for allocation | Free text |

---

## Eligibility Rules (Hard Exclusion)

An asset is **REJECTED** if ANY of these flags are triggered:

1. **Israel Exposure** — Company headquartered in Israel, or has significant operations/revenue from Israel
2. **Gambling** — Core business involves betting, casinos, or gambling platforms
3. **Alcohol** — Manufacturer or primary distributor of alcoholic beverages
4. **Interest-Based Finance** — Conventional banks, lenders, or companies where interest income exceeds AAOIFI thresholds
5. **Weapons** — Manufacturers of weapons, military equipment, or defence systems
6. **Adult Industry** — Producers or distributors of adult content
7. **Prohibited Structure** — Corporate structure incompatible with Sharia principles

An asset is **WATCHLIST** when:
- One or more flags are under investigation
- Financial ratios are borderline (near 5% threshold)
- Awaiting updated financial data for determination

---

## Dropdown Values (for Excel/Sheets validation)

When importing to Excel or Google Sheets, set data validation on these columns:

| Column | Dropdown Values |
|--------|----------------|
| Asset Type | equity, etf, fund, sukuk, reit |
| Eligibility Status | APPROVED, WATCHLIST, REJECTED |
| All Exposure columns | CLEAR, FLAGGED |
| Confidence Level | HIGH, MEDIUM, LOW |
| Volatility Rating | low, moderate, elevated, high |
| Risk Rating | low, moderate, elevated, high |
| Suggested Action | BUY, HOLD, REDUCE, WATCHLIST |

---

## Current Universe Summary

| Status | Count | Description |
|--------|-------|-------------|
| APPROVED | 27 | Passes all exclusion rules |
| WATCHLIST | 6 | Under review / pending data |
| REJECTED | 12 | Failed one or more hard exclusions |
| **Total** | **45** | |

### Rejection Breakdown

| Reason | Count | Examples |
|--------|-------|----------|
| Israel Exposure | 6 | NVDA, MSFT, INTC, SEDG, ISRA, CHKP |
| Interest-Based Finance | 2 | JPM, GS |
| Weapons + Israel | 2 | LMT, RTX |
| Gambling | 4 | DKNG, FLUT, WYNN, MGM |
| Alcohol | 1 | DEO |

---

## How to Use

1. **Adding new assets:** Add a row, fill Core Asset Data, then run eligibility screening
2. **Reviewing watchlist:** Check flagged items quarterly against updated financials
3. **Updating prices:** Refresh Market & Trend Data columns weekly or daily
4. **Portfolio rebalancing:** Review Suggested Action and Allocation % monthly
5. **Audit trail:** Never delete rejected assets — they serve as documentation

---

## Notes

- This is a **staging/research** tool, not a live trading system
- All data is point-in-time and requires regular refresh
- Eligibility decisions should be reviewed by a qualified Sharia advisor
- Market data shown is illustrative for the demo period
