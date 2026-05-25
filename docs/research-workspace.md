# Nür Capital — Research Workspace Design

**Version:** 1.0  
**Classification:** Internal — Operational System Design  
**Last Updated:** May 2025  

---

## Purpose

This document defines the internal operating system for Nür Capital's investment research, tracking, and decision-making. It is designed as a structured workspace (implementable in Airtable, Notion, or spreadsheet tools) that supports the full investment lifecycle.

The workspace is the single source of truth for:
- Asset eligibility and screening
- Thematic classification
- Opportunity identification and scoring
- Portfolio construction and monitoring
- Investment thesis tracking
- Audit and review history

---

## Workspace Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                     NÜR CAPITAL RESEARCH WORKSPACE                       │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐                     │
│  │  Approved   │  │  Watchlist  │  │  Rejected   │                     │
│  │  Assets     │  │  Assets     │  │  Assets     │                     │
│  └──────┬──────┘  └──────┬──────┘  └─────────────┘                     │
│         │                 │                                              │
│         ▼                 ▼                                              │
│  ┌─────────────────────────────┐                                        │
│  │     Theme Dashboard         │                                        │
│  └──────────────┬──────────────┘                                        │
│                 │                                                         │
│                 ▼                                                         │
│  ┌─────────────────────────────┐     ┌─────────────────────────────┐   │
│  │   Portfolio Tracker         │◀───▶│   Market Regime Tracker     │   │
│  └──────────────┬──────────────┘     └─────────────────────────────┘   │
│                 │                                                         │
│                 ▼                                                         │
│  ┌─────────────────────────────┐     ┌─────────────────────────────┐   │
│  │  Investment Thesis Tracker  │◀───▶│   Review & Audit Log        │   │
│  └─────────────────────────────┘     └─────────────────────────────┘   │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

### Table Relationships

| From | To | Relationship |
|------|----|-------------|
| Approved Assets | Theme Dashboard | Many-to-Many (asset has themes) |
| Approved Assets | Portfolio Tracker | One-to-One (asset has allocation) |
| Approved Assets | Investment Thesis | One-to-Many (asset has theses over time) |
| Watchlist Assets | Review & Audit Log | One-to-Many (reviews tracked) |
| All Assets | Review & Audit Log | One-to-Many (all decisions logged) |
| Portfolio Tracker | Market Regime Tracker | Many-to-One (regime affects all positions) |

---

## Table 1 — Approved Assets

### Purpose
The canonical register of all assets that have passed eligibility screening and are permitted for scoring, allocation, and portfolio inclusion.

### Fields

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| Ticker | Text (Primary Key) | Exchange symbol | TSM |
| Company Name | Text | Full trading name | Taiwan Semiconductor Manufacturing |
| Asset Type | Select | equity / etf / fund / sukuk / reit | equity |
| Exchange | Text | Primary listing | NYSE |
| Country | Text | Country of incorporation | Taiwan |
| Sector | Text | GICS sector | Technology |
| Industry | Text | Sub-industry | Semiconductors |
| Market Cap (USD) | Currency | Market capitalisation | $700,000,000,000 |
| Website | URL | Company website | https://tsmc.com |
| Primary Theme | Linked Record → Theme Dashboard | Main investment theme | Semiconductors |
| Secondary Theme | Linked Record → Theme Dashboard | Additional theme | AI Infrastructure |
| Approval Date | Date | When eligibility was confirmed | 2025-05-20 |
| Confidence Level | Select | HIGH / MEDIUM / LOW | HIGH |
| Next Review Date | Date | Scheduled re-screening | 2025-08-20 |
| Current Price | Currency | Latest closing price | $178.52 |
| Trend Score | Number (-1 to +1) | Technical trend position | 0.72 |
| Momentum Score | Number (-1 to +1) | Rate of change | 0.58 |
| Risk Rating | Select | low / moderate / elevated / high | moderate |
| Opportunity Score | Number (0-100) | Composite attractiveness | 62.4 |
| Signal | Select | BUY / HOLD / REDUCE / WATCHLIST | BUY |
| Allocation % | Percent | Current portfolio weight | 12% |
| Thesis Link | Linked Record → Thesis Tracker | Active investment thesis | TSM-2025-Q2 |
| Analyst Notes | Long Text | Current commentary | Leading foundry, AI tailwinds |
| Last Updated | Date (auto) | Last modification timestamp | 2025-05-25 |

### Workflow
- **Entry:** Asset moves here after passing Eligibility Review
- **Update cadence:** Prices weekly, scores monthly, eligibility quarterly
- **Exit:** Asset moves to Rejected if eligibility changes; allocation zeroed if REDUCE signal persists

### Views
- **Default:** All approved assets sorted by Opportunity Score (descending)
- **By Theme:** Grouped by Primary Theme
- **By Signal:** Filtered to show only BUY signals
- **Review Due:** Filtered to Next Review Date ≤ today + 7 days

### Example Entry

| Field | Value |
|-------|-------|
| Ticker | TSM |
| Company Name | Taiwan Semiconductor Manufacturing |
| Asset Type | equity |
| Exchange | NYSE |
| Country | Taiwan |
| Sector | Technology |
| Industry | Semiconductors |
| Market Cap | $700,000,000,000 |
| Primary Theme | Semiconductors |
| Secondary Theme | AI Infrastructure |
| Approval Date | 2025-05-20 |
| Confidence | HIGH |
| Next Review | 2025-08-20 |
| Current Price | $178.52 |
| Trend Score | 0.72 |
| Momentum Score | 0.58 |
| Risk Rating | moderate |
| Opportunity Score | 62.4 |
| Signal | BUY |
| Allocation % | 12% |
| Analyst Notes | World's largest foundry. Monopoly in advanced nodes (3nm, 2nm). AI demand driving structural growth. Geopolitical risk (Taiwan) accepted at this allocation. |

---

## Table 2 — Watchlist Assets

### Purpose
Assets under active investigation where eligibility has not yet been determined, or where conditions are not yet favourable for allocation despite approval.

### Fields

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| Ticker | Text (Primary Key) | Exchange symbol | BABA |
| Company Name | Text | Full name | Alibaba Group |
| Asset Type | Select | equity / etf / fund / sukuk / reit | equity |
| Exchange | Text | Primary listing | NYSE |
| Country | Text | Country | China |
| Sector | Text | GICS sector | Technology |
| Industry | Text | Sub-industry | E-Commerce & Fintech |
| Watchlist Reason | Select | ELIGIBILITY_REVIEW / TREND_UNFAVOURABLE / DATA_PENDING / RATIO_BORDERLINE | ELIGIBILITY_REVIEW |
| Flagged Categories | Multi-Select | Which exclusion flags are under review | Interest-Based Finance |
| Investigation Notes | Long Text | What is being investigated | Ant Financial subsidiary may exceed 5% interest-based revenue threshold |
| Discovery Source | Select | How this asset was identified | Thematic Research |
| Discovery Date | Date | When first identified | 2025-04-10 |
| Added to Watchlist | Date | When placed on watchlist | 2025-05-15 |
| Target Resolution Date | Date | Must be resolved by (max 90 days) | 2025-08-13 |
| Resolution Status | Select | PENDING / RESOLVED_APPROVED / RESOLVED_REJECTED | PENDING |
| Confidence Level | Select | HIGH / MEDIUM / LOW | LOW |
| Assigned Analyst | Text | Who is responsible for resolution | Tahir |
| Current Price | Currency | Latest price | $82.60 |
| Preliminary Theme | Text | Expected theme if approved | AI Infrastructure |
| Last Updated | Date (auto) | Last modification | 2025-05-25 |

### Workflow
- **Entry:** Asset fails to achieve APPROVED status but is not clearly REJECTED
- **Update cadence:** Weekly status check, monthly deep review
- **Exit:** Resolved to Approved Assets table OR Rejected Assets table within 90 days
- **Escalation:** If target resolution date passes without resolution, escalate to Investment Committee review

### Views
- **Default:** All watchlist assets sorted by Target Resolution Date (soonest first)
- **Overdue:** Filtered to Target Resolution Date < today
- **By Reason:** Grouped by Watchlist Reason
- **My Items:** Filtered by Assigned Analyst

### Example Entry

| Field | Value |
|-------|-------|
| Ticker | BABA |
| Company Name | Alibaba Group |
| Watchlist Reason | ELIGIBILITY_REVIEW |
| Flagged Categories | Interest-Based Finance |
| Investigation Notes | Ant Financial (33% owned) operates lending products. Need Q2 2025 financials to determine if interest-based revenue exceeds 5% of consolidated group revenue. Ant Group restructuring ongoing — regulatory outcome affects ratio calculation. |
| Discovery Source | Thematic Research |
| Added to Watchlist | 2025-05-15 |
| Target Resolution Date | 2025-08-13 |
| Resolution Status | PENDING |
| Confidence Level | LOW |
| Assigned Analyst | Tahir |
| Preliminary Theme | AI Infrastructure |

---

## Table 3 — Rejected Assets

### Purpose
Permanent record of all assets that failed eligibility screening. Retained for audit, reference, and to prevent re-evaluation of clearly excluded assets.

### Fields

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| Ticker | Text (Primary Key) | Exchange symbol | NVDA |
| Company Name | Text | Full name | NVIDIA Corporation |
| Asset Type | Select | equity / etf / fund / sukuk / reit | equity |
| Exchange | Text | Primary listing | NASDAQ |
| Country | Text | Country | US |
| Sector | Text | GICS sector | Technology |
| Industry | Text | Sub-industry | Semiconductors |
| Rejection Date | Date | When rejected | 2025-05-20 |
| Triggered Flags | Multi-Select | Which exclusion rules failed | Israel Exposure |
| Rejection Reasons | Long Text | Detailed explanation | Israel exposure via Mellanox acquisition (2020). Significant R&D operations in Israel with 3,000+ employees. |
| Evidence Sources | Long Text | Where the determination came from | NVIDIA 10-K filing 2024, Mellanox acquisition press release, LinkedIn employee data |
| Confidence Level | Select | HIGH / MEDIUM / LOW | HIGH |
| Override Possible | Checkbox | Whether override is theoretically possible | No |
| Re-Review Eligible | Checkbox | Whether circumstances could change | No |
| Re-Review Trigger | Text | What would need to change for reconsideration | NVIDIA would need to fully divest all Israel operations |
| Original Discovery Source | Select | How it was first identified | Thematic Research |
| Reviewed By | Text | Analyst who made determination | Tahir |
| Last Updated | Date (auto) | Last modification | 2025-05-20 |

### Workflow
- **Entry:** Asset fails eligibility review with HIGH confidence on a hard exclusion
- **Update cadence:** None (static record). Only updated if re-review is triggered by extraordinary circumstances
- **Exit:** Extremely rare. Only if the company fundamentally changes (e.g., divests all prohibited operations)
- **Purpose:** Audit trail + prevents repeated evaluation of the same excluded asset

### Views
- **Default:** All rejected assets sorted by Rejection Date (newest first)
- **By Reason:** Grouped by Triggered Flags
- **Israel Exposure:** Filtered to show only Israel-related rejections
- **Gambling/Alcohol:** Filtered to show prohibited activity rejections

### Example Entry

| Field | Value |
|-------|-------|
| Ticker | NVDA |
| Company Name | NVIDIA Corporation |
| Rejection Date | 2025-05-20 |
| Triggered Flags | Israel Exposure |
| Rejection Reasons | NVIDIA acquired Mellanox Technologies (Israel-based, Yokneam) in 2020 for $6.9B. Mellanox operations continue under NVIDIA Israel with 3,000+ employees across multiple R&D centres. This constitutes significant and material Israel operations. Hard exclusion rule flag_israel_exposure triggered. No override possible. |
| Evidence Sources | NVIDIA 10-K 2024 (Note 14: Geographic Revenue), Mellanox acquisition press release (April 2020), NVIDIA Israel careers page (active hiring), LinkedIn data (3,200+ NVIDIA Israel employees) |
| Confidence Level | HIGH |
| Override Possible | No |
| Re-Review Eligible | No |
| Re-Review Trigger | Full divestiture of all Israel operations (extremely unlikely) |
| Reviewed By | Tahir |

---

## Table 4 — Theme Dashboard

### Purpose
Central registry of all investment themes supported by Nür Capital. Tracks theme health, asset count, allocation weight, and macro conditions.

### Fields

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| Theme Name | Text (Primary Key) | Theme identifier | Semiconductors |
| Category | Select | technology / energy / finance / healthcare / industrial / consumer | technology |
| Icon | Text | Visual identifier | ⚡ |
| Description | Long Text | What this theme covers | Chip design, fabrication, equipment, and packaging |
| Macro Drivers | Long Text | Current tailwinds | AI training demand, automotive electrification, CHIPS Act reshoring |
| Key Risks | Long Text | Current headwinds | Cyclicality, Taiwan geopolitics, inventory corrections |
| Theme Status | Select | STRONG / NEUTRAL / WEAK / DEFENSIVE | STRONG |
| Asset Count | Number (rollup) | How many approved assets in this theme | 5 |
| Portfolio Weight | Percent (rollup) | Total allocation to this theme | 28% |
| Concentration Alert | Checkbox (formula) | True if weight > 35% | No |
| Top Asset | Linked Record → Approved Assets | Highest-scoring asset in theme | TSM |
| Last Reviewed | Date | Last theme assessment | 2025-05-20 |
| Next Review | Date | Scheduled reassessment | 2025-08-20 |
| Analyst Notes | Long Text | Current theme commentary | AI supercycle driving structural demand. Inventory correction complete. |

### Workflow
- **Update cadence:** Monthly theme status review, quarterly deep assessment
- **Concentration monitoring:** Alert triggers if any theme exceeds 35% of portfolio
- **Theme rotation:** Status changes (STRONG → NEUTRAL) trigger portfolio review

### Views
- **Default:** All themes sorted by Portfolio Weight (descending)
- **Active Themes:** Filtered to themes with Asset Count > 0
- **Concentration Alerts:** Filtered to Concentration Alert = true
- **By Category:** Grouped by Category

### Example Entries

| Theme | Status | Assets | Weight | Top Asset |
|-------|--------|--------|--------|-----------|
| Semiconductors | STRONG | 5 | 28% | TSM |
| AI Infrastructure | STRONG | 3 | 15% | CRWD |
| Halal Finance | NEUTRAL | 2 | 17% | HLAL |
| Healthcare | NEUTRAL | 3 | 13% | LLY |
| Clean Energy | WEAK | 2 | 5% | NEE |
| Oil & Gas | NEUTRAL | 3 | 12% | 2222.SR |
| Islamic Banking | NEUTRAL | 2 | 9% | QISMUT |
| Cybersecurity | STRONG | 2 | 13% | CRWD |
| Battery Technology | NEUTRAL | 2 | 8% | 1211.HK |
| Industrial Automation | NEUTRAL | 2 | 8% | ABB |

---

## Table 5 — Portfolio Tracker

### Purpose
Real-time view of the current portfolio allocation, performance, and health metrics. This is the operational dashboard for portfolio management.

### Fields

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| Ticker | Linked Record → Approved Assets | Asset reference | TSM |
| Company Name | Lookup | From Approved Assets | Taiwan Semiconductor |
| Signal | Lookup | Current signal from Approved Assets | BUY |
| Target Allocation % | Percent | Desired portfolio weight | 12% |
| Actual Allocation % | Percent | Current weight (drift-adjusted) | 12.8% |
| Drift | Percent (formula) | Actual - Target | +0.8% |
| Drift Alert | Checkbox (formula) | True if |Drift| > 3% | No |
| Entry Price | Currency | Average cost basis | $165.20 |
| Current Price | Currency | Latest price | $178.52 |
| Return % | Percent (formula) | (Current - Entry) / Entry | +8.1% |
| Theme | Lookup | Primary theme | Semiconductors |
| Risk Rating | Lookup | From Approved Assets | moderate |
| Position Size (USD) | Currency | Dollar value of position | $178,520 |
| Confidence | Select | HIGH / MEDIUM / LOW | HIGH |
| Date Added | Date | When position was initiated | 2025-03-15 |
| Last Rebalanced | Date | Last time position was adjusted | 2025-05-01 |
| Thesis Status | Lookup | From Thesis Tracker | ACTIVE |
| Notes | Long Text | Position-specific commentary | Core holding. Thesis intact. |

### Portfolio Summary Row (calculated)

| Metric | Value |
|--------|-------|
| Total Equity Allocation | 76% |
| Total Cash | 24% |
| Number of Positions | 10 |
| Number of Themes | 6 |
| Largest Position | TSM (12.8%) |
| Top 3 Combined | 34.6% |
| Portfolio Beta (est.) | 0.85 |
| Drift Alerts | 0 |

### Workflow
- **Update cadence:** Prices weekly, allocations monthly, full review quarterly
- **Drift monitoring:** Any position drifting >3% from target triggers rebalance review
- **Regime adjustment:** When market regime changes, all target allocations are recalculated

### Views
- **Default:** All positions sorted by Allocation % (descending)
- **Drift Alerts:** Filtered to Drift Alert = true
- **By Theme:** Grouped by Theme
- **Performance:** Sorted by Return % (descending)
- **Cash + Summary:** Shows cash position and portfolio-level metrics

### Example Portfolio State

| Ticker | Target | Actual | Signal | Return | Theme |
|--------|--------|--------|--------|--------|-------|
| TSM | 12% | 12.8% | BUY | +8.1% | Semiconductors |
| ASML | 10% | 9.6% | BUY | +5.2% | Semiconductors |
| HLAL | 15% | 14.8% | HOLD | +3.4% | Halal Finance |
| LLY | 8% | 8.5% | BUY | +12.3% | Healthcare |
| CRWD | 7% | 7.2% | BUY | +9.8% | Cybersecurity |
| ABB | 6% | 5.8% | HOLD | +4.1% | Industrial Automation |
| 2222.SR | 8% | 7.9% | HOLD | +2.8% | Oil & Gas |
| 1211.HK | 5% | 4.6% | HOLD | -3.2% | Battery Technology |
| NOVO-B | 5% | 4.8% | HOLD | -6.5% | Healthcare |
| *Cash* | 24% | 24.0% | — | — | — |

---

## Table 6 — Market Regime Tracker

### Purpose
Tracks the current and historical market regime, which determines portfolio posture, cash allocation, and position sizing caps.

### Fields

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| Date | Date (Primary Key) | Assessment date | 2025-05-25 |
| Regime | Select | Strong Bull / Weak Bull / Sideways / High Volatility / Bear / Crisis | Weak Bull |
| Previous Regime | Select | What regime was before this assessment | Strong Bull |
| Regime Changed | Checkbox | Did regime change this period? | Yes |
| Confirmation Status | Select | TENTATIVE / CONFIRMED | CONFIRMED |
| S&P 500 vs MA200 | Select | ABOVE / BELOW | ABOVE |
| S&P 500 vs MA50 | Select | ABOVE / BELOW | ABOVE |
| Market Breadth | Percent | % of stocks above MA200 | 55% |
| VIX Level | Number | Current VIX reading | 18.5 |
| Credit Spreads | Select | TIGHTENING / STABLE / WIDENING | STABLE |
| Sector Leadership | Text | Which sectors are leading | Tech, Healthcare |
| Target Cash % | Percent | Regime-appropriate cash level | 20% |
| Max Position Size | Percent | Regime cap on single position | 12% |
| Equity Allocation Band | Text | Permitted equity range | 70-85% |
| Risk Tolerance | Select | High / Moderate-High / Moderate / Low-Moderate / Low / Minimal | Moderate-High |
| Theme Preference | Text | Favoured themes in this regime | Quality growth + defensive |
| Analyst Notes | Long Text | Context for regime assessment | Breadth narrowing. Late-cycle signals emerging. Transitioning from Strong to Weak Bull. |
| Next Assessment | Date | Scheduled reassessment | 2025-06-08 |

### Workflow
- **Update cadence:** Bi-weekly assessment (weekly in volatile markets)
- **Confirmation rule:** Regime change requires 2 consecutive weeks of signals before CONFIRMED
- **Transition rule:** Move one level at a time (no jumping from Bull to Crisis)
- **Portfolio impact:** Confirmed regime change triggers immediate portfolio review

### Views
- **Current:** Single record showing today's active regime
- **History:** All records sorted by Date (newest first)
- **Transitions:** Filtered to Regime Changed = true

### Example History

| Date | Regime | Changed | VIX | Breadth | Cash Target |
|------|--------|---------|-----|---------|-------------|
| 2025-05-25 | Weak Bull | Yes | 18.5 | 55% | 20% |
| 2025-05-11 | Weak Bull | No (tentative) | 19.2 | 52% | 20% |
| 2025-04-27 | Strong Bull | No | 14.8 | 68% | 10% |
| 2025-04-13 | Strong Bull | No | 13.5 | 72% | 10% |
| 2025-03-30 | Strong Bull | Yes | 12.8 | 75% | 10% |
| 2025-03-16 | Sideways | No | 22.1 | 48% | 30% |

---

## Table 7 — Investment Thesis Tracker

### Purpose
Every BUY decision creates a thesis. This table tracks all active and historical theses, enabling accountability, retrospective analysis, and thesis-driven portfolio management.

### Fields

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| Thesis ID | Text (Primary Key) | Unique identifier | TSM-2025-Q2 |
| Ticker | Linked Record → Approved Assets | Asset reference | TSM |
| Company Name | Lookup | From Approved Assets | Taiwan Semiconductor |
| Thesis Statement | Text | One-line thesis | Leading foundry with monopoly in advanced nodes, benefiting from structural AI demand |
| Created Date | Date | When thesis was written | 2025-03-15 |
| Status | Select | ACTIVE / VALIDATED / INVALIDATED / EXPIRED / SUPERSEDED | ACTIVE |
| Expiry Date | Date | Auto-expires after 12 months | 2026-03-15 |
| Confidence | Select | HIGH / MEDIUM / LOW | HIGH |
| Core Thesis | Long Text | Detailed investment rationale | TSMC manufactures >90% of the world's most advanced chips. AI training requires exponentially more compute, driving structural demand for leading-edge nodes. TSMC's technology lead (3nm, 2nm) is 2-3 years ahead of competitors. Capex discipline and pricing power support margin expansion. |
| Supporting Evidence | Long Text | Data points supporting the thesis | (1) AI accelerator revenue growing 40%+ YoY, (2) Apple/NVIDIA/AMD locked in as customers, (3) Arizona fab diversifies geopolitical risk, (4) 2nm on track for 2025 production |
| Invalidation Conditions | Long Text | What would break the thesis | (1) Loss of Apple or NVIDIA as customer, (2) China-Taiwan military escalation, (3) Intel or Samsung close technology gap to within 1 year, (4) AI demand plateau confirmed by hyperscaler capex cuts |
| Entry Price | Currency | Price when thesis was created | $165.20 |
| Target Outcome | Text | What success looks like | 20%+ return over 12 months with maintained market leadership |
| Quarterly Reviews | Long Text | Check-in notes over time | Q2 2025: Thesis intact. AI revenue beat expectations. Arizona fab on schedule. Geopolitical risk stable. Score: 62.4. Maintaining BUY at 12%. |
| Outcome Notes | Long Text | Filled when thesis is closed | (Filled at expiry or invalidation) |
| Reviewed By | Text | Analyst responsible | Tahir |

### Workflow
- **Creation:** Every BUY signal must have an associated thesis
- **Update cadence:** Quarterly review (minimum). More frequent if conditions change.
- **Expiry:** Theses expire after 12 months. Must be renewed (new thesis) or position reviewed.
- **Invalidation:** If any invalidation condition is met, thesis status changes and position is reviewed immediately.
- **Superseded:** If a new thesis replaces an old one for the same asset, old thesis is marked SUPERSEDED.

### Views
- **Active Theses:** Filtered to Status = ACTIVE, sorted by Created Date
- **Expiring Soon:** Filtered to Expiry Date ≤ today + 30 days
- **By Asset:** Grouped by Ticker (shows thesis history per asset)
- **Invalidated:** Filtered to Status = INVALIDATED (lessons learned)

### Example Entry

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
THESIS: TSM-2025-Q2
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Asset:          TSM — Taiwan Semiconductor Manufacturing
Status:         ACTIVE
Created:        2025-03-15
Expires:        2026-03-15
Confidence:     HIGH

THESIS STATEMENT:
Leading foundry with monopoly in advanced nodes, benefiting from
structural AI demand that drives multi-year revenue growth.

CORE THESIS:
TSMC manufactures >90% of the world's most advanced chips (<7nm).
AI training and inference require exponentially more compute,
driving structural demand for leading-edge nodes. TSMC's technology
lead is 2-3 years ahead of Samsung and Intel. Pricing power and
capex discipline support margin expansion. Arizona fab reduces
geopolitical concentration risk.

SUPPORTING EVIDENCE:
• AI accelerator revenue growing 40%+ YoY (Q1 2025 earnings)
• Apple, NVIDIA, AMD, Qualcomm locked in as customers
• Arizona fab Phase 1 on track for 2025 production
• 2nm technology validated, production 2025-2026
• Gross margins expanding (57% → 59% guidance)

INVALIDATION CONDITIONS:
• Loss of Apple or NVIDIA as customer (>20% revenue each)
• China-Taiwan military escalation or blockade
• Intel/Samsung close technology gap to within 1 year
• AI demand plateau confirmed by 2+ hyperscaler capex cuts
• US export controls prevent serving Chinese customers

QUARTERLY REVIEWS:
• Q2 2025 (May): Thesis intact. AI revenue beat expectations.
  Arizona fab on schedule. Geopolitical risk stable but monitored.
  Score: 62.4. Maintaining BUY at 12%.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## Table 8 — Review & Audit Log

### Purpose
Append-only record of every decision, change, and review action taken within the workspace. This is the master audit trail that enables full traceability of all investment decisions.

### Fields

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| Log ID | Auto-Number | Unique sequential ID | 00147 |
| Timestamp | DateTime (auto) | When the action occurred | 2025-05-25 14:30:00 |
| Action Type | Select | See action types below | ELIGIBILITY_DECISION |
| Asset | Linked Record | Which asset this relates to | TSM |
| Actor | Text | Who performed the action | Tahir |
| Previous State | Text | What the value was before | WATCHLIST |
| New State | Text | What the value is now | APPROVED |
| Rationale | Long Text | Why this action was taken | All 7 exclusion flags CLEAR. AAOIFI ratios pass. Confidence HIGH. |
| Evidence | Long Text | Supporting documentation | 10-K filing review, no Israel operations, debt/assets 18% |
| Confidence | Select | HIGH / MEDIUM / LOW | HIGH |
| Review Type | Select | SCHEDULED / TRIGGERED / AD_HOC | SCHEDULED |
| Related Thesis | Linked Record → Thesis Tracker | If applicable | TSM-2025-Q2 |
| Attachments | File | Supporting documents | (none) |

### Action Types

| Action Type | Description | Typical Trigger |
|-------------|-------------|-----------------|
| ELIGIBILITY_DECISION | Asset approved, watchlisted, or rejected | New asset review |
| ELIGIBILITY_RESCREEN | Scheduled re-review of existing asset | Calendar trigger |
| SIGNAL_CHANGE | BUY/HOLD/REDUCE signal changed | Score update |
| ALLOCATION_CHANGE | Position size adjusted | Rebalance |
| THESIS_CREATED | New investment thesis written | BUY decision |
| THESIS_INVALIDATED | Thesis conditions breached | Market event |
| THESIS_RENEWED | Thesis extended for another period | Quarterly review |
| REGIME_CHANGE | Market regime assessment changed | Bi-weekly review |
| PORTFOLIO_REVIEW | Full portfolio review conducted | Monthly/quarterly |
| RISK_ALERT | Risk threshold breached | Monitoring |
| WATCHLIST_ADDED | Asset placed on watchlist | Eligibility review |
| WATCHLIST_RESOLVED | Watchlist asset resolved | Investigation complete |
| POSITION_EXIT | Asset fully exited from portfolio | REDUCE → exit |
| OVERRIDE_APPLIED | Manual override of system recommendation | Exceptional circumstance |
| DISCOVERY_LOGGED | New asset entered discovery queue | Research |

### Workflow
- **Entry:** Automatic on every state change in any table. Manual for reviews and notes.
- **Update cadence:** Real-time (append-only, never edited)
- **Retention:** Indefinite. Never deleted.
- **Access:** Read-only for all except the Actor field (auto-populated)

### Views
- **Recent Activity:** Last 50 entries sorted by Timestamp (newest first)
- **By Asset:** Filtered to specific asset (full history of one asset)
- **Eligibility Decisions:** Filtered to ELIGIBILITY_DECISION and ELIGIBILITY_RESCREEN
- **Signal Changes:** Filtered to SIGNAL_CHANGE
- **Regime History:** Filtered to REGIME_CHANGE
- **Portfolio Reviews:** Filtered to PORTFOLIO_REVIEW

### Example Entries

| # | Timestamp | Action | Asset | Previous | New | Rationale |
|---|-----------|--------|-------|----------|-----|-----------|
| 147 | 2025-05-25 14:30 | ELIGIBILITY_DECISION | TSM | (new) | APPROVED | All flags CLEAR. Ratios pass. No Israel exposure. |
| 146 | 2025-05-25 14:15 | ELIGIBILITY_DECISION | NVDA | (new) | REJECTED | Israel exposure via Mellanox. Hard exclusion. |
| 145 | 2025-05-25 10:00 | REGIME_CHANGE | — | Strong Bull | Weak Bull | Breadth narrowing to 55%. Confirmed over 2 weeks. |
| 144 | 2025-05-20 09:00 | SIGNAL_CHANGE | ENPH | HOLD | REDUCE | Trend score dropped to -0.22. Below MA50 and MA200. |
| 143 | 2025-05-18 16:00 | ALLOCATION_CHANGE | HLAL | 12% | 15% | Increasing core Sharia-compliant anchor in Weak Bull regime. |
| 142 | 2025-05-15 11:00 | WATCHLIST_ADDED | BABA | (new) | WATCHLIST | Ant Financial interest-based revenue unclear. Pending Q2 data. |
| 141 | 2025-05-01 09:00 | PORTFOLIO_REVIEW | — | — | — | Monthly review. All positions within limits. No rebalance needed. |

---

## Operational Workflows

### Workflow 1: New Asset Discovery → Portfolio Allocation

```
Day 1:  Analyst identifies TSM through thematic research (Semiconductors)
        → Log DISCOVERY_LOGGED in Audit Log
        → Add to Discovery Queue (Priority: HIGH)

Day 2:  Eligibility Review begins
        → Check all 7 exclusion flags → All CLEAR
        → Check AAOIFI ratios → All pass
        → Determination: APPROVED (Confidence: HIGH)
        → Log ELIGIBILITY_DECISION in Audit Log
        → Move to Approved Assets table

Day 3:  Theme Classification
        → Primary: Semiconductors
        → Secondary: AI Infrastructure
        → Source: Rule-based (industry = Semiconductors) + Analyst validation

Day 7:  Opportunity Scoring
        → Fetch 1yr price data
        → Calculate: Trend 0.72, Momentum 0.58, Risk moderate
        → Composite score: 62.4
        → Signal: BUY

Day 7:  Investment Thesis Created
        → Write thesis TSM-2025-Q2
        → Document rationale, evidence, invalidation conditions
        → Log THESIS_CREATED in Audit Log

Day 8:  Portfolio Allocation
        → Target: 12% (based on score, risk, regime)
        → Verify concentration limits (Semiconductors theme at 28% < 35% limit)
        → Log ALLOCATION_CHANGE in Audit Log
        → Position live in Portfolio Tracker
```

### Workflow 2: Watchlist Resolution

```
Week 1: BABA identified through thematic research
        → Initial screening: Interest-Based Finance flag UNCLEAR
        → Determination: WATCHLIST (Confidence: LOW)
        → Target resolution: 90 days
        → Assigned to: Tahir

Week 4: Quarterly financials released
        → Ant Financial revenue breakdown available
        → Interest-based revenue: 4.8% of consolidated (borderline)
        → Status: Still WATCHLIST (need one more quarter to confirm trend)

Week 8: Q2 financials confirm
        → Interest-based revenue: 5.3% (exceeds threshold)
        → Determination: REJECTED
        → Log ELIGIBILITY_DECISION (WATCHLIST → REJECTED)
        → Move to Rejected Assets table
        → Document: "Ant Financial interest income confirmed at 5.3%, exceeding 5% AAOIFI threshold"
```

### Workflow 3: Regime Change Response

```
Week 1: Bi-weekly regime assessment
        → S&P 500 crosses below MA50
        → Breadth drops to 52%
        → VIX rises to 19
        → Assessment: TENTATIVE regime change (Strong Bull → Weak Bull)
        → No portfolio action yet (requires confirmation)

Week 3: Confirmation assessment
        → S&P 500 still below MA50 (2 weeks confirmed)
        → Breadth at 55%
        → VIX at 18.5
        → Assessment: CONFIRMED regime change to Weak Bull
        → Log REGIME_CHANGE in Audit Log

Week 3: Portfolio adjustment triggered
        → New cash target: 20% (was 10%)
        → Max position size: 12% (was 15%)
        → Trim highest-volatility positions (ENPH -3%, FSLR -2%)
        → Increase HLAL (defensive anchor) from 12% to 15%
        → Log all ALLOCATION_CHANGE entries
        → Schedule next regime assessment: 2 weeks
```

### Workflow 4: Thesis Invalidation

```
Event:  News breaks that NVIDIA acquires TSM's largest customer (hypothetical)
        → Invalidation condition triggered: "Loss of NVIDIA as customer"

Day 1:  Immediate review triggered
        → Verify: Is this confirmed? (Check multiple sources)
        → Confirmed: NVIDIA bringing chip design in-house

Day 1:  Thesis status change
        → TSM-2025-Q2 status: ACTIVE → INVALIDATED
        → Log THESIS_INVALIDATED in Audit Log
        → Outcome notes: "NVIDIA in-house fab confirmed. 20% revenue at risk."

Day 2:  Signal change
        → TSM signal: BUY → REDUCE
        → Log SIGNAL_CHANGE in Audit Log
        → Rationale: "Core thesis invalidated. Revenue concentration risk materialised."

Day 3:  Allocation change
        → TSM allocation: 12% → 6% (trim 50%)
        → Freed capital → Cash
        → Log ALLOCATION_CHANGE in Audit Log

Day 30: Full reassessment
        → Write new thesis or exit completely
        → If no valid thesis: exit remaining position
```

---

## Analyst Usage Examples

### Example 1: Weekly Review Session (30 min)

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
WEEKLY REVIEW — 2025-05-25
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. REGIME CHECK (5 min)
   Current: Weak Bull (confirmed 2025-05-25)
   Change from last week: Yes (was Strong Bull)
   Action: Adjust cash target to 20%. Review position caps.

2. WATCHLIST UPDATE (5 min)
   BABA: Pending Q2 financials (due June). No change.
   GRAB: GrabFin data expected next month. No change.
   UNH: Insurance income ratio still unclear. Monitoring.
   No items overdue.

3. POSITION ALERTS (10 min)
   ENPH: Trend score dropped to -0.22. Signal now REDUCE.
   → Action: Trim from 5% to 2% this week.
   All other positions within limits.
   No concentration breaches.

4. DISCOVERY QUEUE (5 min)
   New candidate: MRVL (Marvell Technology) — Semiconductors/AI
   Source: Sector analysis (custom AI chip demand)
   Priority: MEDIUM
   → Queue for eligibility review next week.

5. ACTION ITEMS
   □ Trim ENPH to 2%
   □ Increase cash to 20%
   □ Review MRVL eligibility
   □ Next regime assessment: 2025-06-08

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### Example 2: Monthly Portfolio Review (60 min)

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
MONTHLY PORTFOLIO REVIEW — May 2025
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

PORTFOLIO COMPOSITION:
  Positions: 10 (target: 8-15) ✓
  Themes: 6 (target: 4-8) ✓
  Cash: 24% (target: 20% for Weak Bull) ✓
  Largest position: TSM 12.8% (limit: 15%) ✓
  Top 3: 34.6% (limit: 40%) ✓

CONCENTRATION CHECK:
  Semiconductors: 28% (limit: 35%) ✓
  No theme exceeds limit.
  US exposure: 38% (limit: 40%) ✓
  No geography exceeds limit.

RISK ASSESSMENT:
  Portfolio volatility (est.): 14% (threshold: 20%) ✓
  No individual position at HIGH risk.
  Geopolitical: Taiwan (TSM) and China (1211.HK) monitored.

PERFORMANCE:
  Portfolio MTD: +2.1%
  Best performer: LLY (+12.3%)
  Worst performer: NOVO-B (-6.5%)
  NOVO-B thesis still intact (GLP-1 correction, not structural).

REBALANCE DECISIONS:
  No positions exceed 3% drift threshold.
  No rebalance required this month.
  ENPH trimmed earlier this week (separate action).

CASH DEPLOYMENT:
  Cash at 24% (target 20%). Slight overweight.
  Opportunity: If MRVL passes eligibility, deploy 4% from cash.
  Otherwise: maintain current level (regime uncertainty).

NEXT REVIEW: June 2025

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### Example 3: Eligibility Review (Analyst Workflow)

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ELIGIBILITY REVIEW: CRWD — CrowdStrike Holdings
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Date:       2025-05-19
Analyst:    Tahir
Source:     Sector analysis (Cybersecurity theme)

STEP 1 — INITIAL SCREENING:
  Asset type: equity
  Sector: Technology
  Industry: Cybersecurity
  Country: US
  No obvious exclusions. Proceed to flag assessment.

STEP 2 — FLAG ASSESSMENT:
  ☑ Israel Exposure:        CLEAR (US-HQ, Austin TX. No Israel operations found.)
  ☑ Gambling:               CLEAR (Cybersecurity SaaS. No gambling involvement.)
  ☑ Alcohol:                CLEAR (No alcohol involvement.)
  ☑ Interest-Based Finance: CLEAR (SaaS revenue model. No lending/banking.)
  ☑ Weapons:                CLEAR (Defensive cybersecurity, not weapons.)
  ☑ Adult Industry:         CLEAR (No involvement.)
  ☑ Prohibited Structure:   CLEAR (Standard US corporation.)

STEP 3 — FINANCIAL RATIOS (AAOIFI):
  Total debt / total assets:         22% (threshold: <33%) ✓
  Interest income / total revenue:   0.8% (threshold: <5%) ✓
  Illiquid assets / total assets:    68% (threshold: >25%) ✓
  Cash + receivables / total assets: 32% (threshold: <70%) ✓

STEP 4 — DETERMINATION:
  All 7 flags: CLEAR
  All 4 ratios: PASS
  → APPROVED

STEP 5 — DOCUMENTATION:
  Confidence: HIGH
  Review notes: Cloud-native cybersecurity platform. Pure SaaS model
  with subscription revenue. No prohibited exposure of any kind.
  Conservative balance sheet. US-headquartered with global operations
  (no Israel presence).
  Next review: 2025-08-19 (quarterly)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## Implementation Guide

### Option A: Airtable Implementation

| Workspace Table | Airtable Feature |
|-----------------|-----------------|
| Approved Assets | Main table with linked records to Themes |
| Watchlist Assets | Separate table with formula for overdue alerts |
| Rejected Assets | Separate table (append-only) |
| Theme Dashboard | Linked table with rollup fields for asset count and weight |
| Portfolio Tracker | Table with formula fields for drift and return calculations |
| Market Regime | Table with single "current" record highlighted |
| Thesis Tracker | Table linked to Approved Assets |
| Audit Log | Append-only table with automation triggers |

**Airtable automations:**
- When Eligibility Status changes → Create Audit Log entry
- When Signal changes → Create Audit Log entry
- When Watchlist Target Resolution Date passes → Send notification
- When Thesis Expiry Date approaches → Send reminder

### Option B: Notion Implementation

| Workspace Section | Notion Feature |
|-------------------|---------------|
| Approved Assets | Database with views (table, board, gallery) |
| Watchlist Assets | Database with Kanban view (by resolution status) |
| Rejected Assets | Database (locked, append-only convention) |
| Theme Dashboard | Database with linked relations + rollups |
| Portfolio Tracker | Database with formula properties |
| Market Regime | Database with "Current" toggle property |
| Thesis Tracker | Database with template for new theses |
| Audit Log | Database with auto-created entries via buttons |

**Notion views:**
- Board view for Watchlist (columns: PENDING → INVESTIGATING → RESOLVED)
- Calendar view for Review Dates
- Gallery view for Theme Dashboard (visual cards)
- Timeline view for Thesis Tracker (creation → expiry)

### Option C: Spreadsheet Implementation (Google Sheets / Excel)

| Tab | Purpose |
|-----|---------|
| Approved | Main asset register |
| Watchlist | Assets under review |
| Rejected | Excluded assets (protected/locked) |
| Themes | Theme reference + rollup formulas |
| Portfolio | Current allocation with drift formulas |
| Regime | Current + historical regime log |
| Theses | Investment thesis register |
| Audit | Append-only decision log |
| Config | Dropdown values, thresholds, limits |
| Dashboard | Summary charts and KPIs |

**Spreadsheet features:**
- Data validation dropdowns for all Select fields
- Conditional formatting (green = approved, amber = watchlist, red = rejected)
- VLOOKUP/INDEX-MATCH for cross-table relationships
- Protected sheets for Rejected and Audit (prevent accidental edits)
- Named ranges for threshold values (easy to update)

---

## Review Cadence Summary

| Review | Frequency | Duration | Scope |
|--------|-----------|----------|-------|
| Regime Assessment | Bi-weekly | 15 min | Market signals, VIX, breadth |
| Weekly Review | Weekly | 30 min | Alerts, watchlist, queue, quick checks |
| Monthly Portfolio Review | Monthly | 60 min | Full composition, risk, rebalance |
| Quarterly Deep Review | Quarterly | 120 min | Performance, themes, eligibility re-screen, strategy |
| Thesis Review | Quarterly | 30 min per thesis | Validate or invalidate each active thesis |
| Annual Strategy Review | Annual | Half day | Full methodology review, theme additions, process improvements |

---

## Scalability Roadmap

| Phase | Team Size | Workspace Evolution |
|-------|-----------|-------------------|
| **Phase 1** (current) | 1 operator | Spreadsheet or Notion. Manual workflows. Self-review discipline. |
| **Phase 2** | 2-3 people | Airtable with automations. Assigned reviewers. Peer review on eligibility. |
| **Phase 3** | 4-8 people | Custom application (from codebase). Role-based access. Formal committee. |
| **Phase 4** | 8+ people | Full platform with API integrations, automated data feeds, compliance module. |

At every phase, the data model and audit requirements remain identical. Only the tooling and access controls evolve.

---

## Document Control

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | May 2025 | Nür Capital | Initial workspace design |

---

*End of document.*
