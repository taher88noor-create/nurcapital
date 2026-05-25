# Nür Capital — Asset Review & Investment Workflow Framework

**Version:** 1.0  
**Classification:** Internal — Operational Process  
**Last Updated:** May 2025  

---

## Document Purpose

This document defines the operational workflows used to evaluate, review, classify, and monitor investment opportunities within Nür Capital. It establishes a disciplined, auditable process from asset discovery through portfolio allocation and ongoing monitoring.

Every asset that enters or exits the Nür Capital universe follows the workflows defined here.

---

## Table of Contents

1. [Asset Discovery Workflow](#section-1--asset-discovery-workflow)
2. [Eligibility Review Workflow](#section-2--eligibility-review-workflow)
3. [Theme Classification Workflow](#section-3--theme-classification-workflow)
4. [Market & Trend Review Workflow](#section-4--market--trend-review-workflow)
5. [Risk Review Workflow](#section-5--risk-review-workflow)
6. [Opportunity Review Workflow](#section-6--opportunity-review-workflow)
7. [Portfolio Review Workflow](#section-7--portfolio-review-workflow)
8. [Investment Committee Model](#section-8--investment-committee-model)
9. [Explainability & Auditability](#section-9--explainability--auditability)

---

## Section 1 — Asset Discovery Workflow

### Purpose

Asset discovery is the process by which new investment candidates enter the Nür Capital review pipeline. Every asset must have a documented discovery source and a clear reason for consideration.

### Discovery Sources

| Source | Description | Priority |
|--------|-------------|----------|
| **Thematic Research** | Assets identified through deep-dive research into supported themes | High |
| **Market Trends** | Assets surfacing through momentum, volume, or breakout detection | Medium |
| **Sector Analysis** | Systematic screening of sectors aligned with Nür Capital themes | High |
| **ETF Holdings** | Constituent analysis of Sharia-compliant or thematic ETFs | Medium |
| **Analyst Review** | Manual identification by the investment operator/analyst | High |
| **Macro Opportunities** | Assets benefiting from macro shifts (policy, rates, geopolitics) | Medium |
| **User Suggestions** | External suggestions from stakeholders or advisors | Low (requires validation) |
| **Momentum Detection** | Systematic scans for trend/momentum signals in approved sectors | Medium |

### Discovery Record

Every discovered asset must be logged with:

| Field | Description | Required |
|-------|-------------|----------|
| Ticker | Exchange symbol | Yes |
| Company Name | Full name | Yes |
| Discovery Source | Which source identified this asset | Yes |
| Discovery Date | When it was identified | Yes |
| Discovery Rationale | Why it deserves consideration (1-2 sentences) | Yes |
| Submitted By | Who submitted it to the pipeline | Yes |
| Priority | HIGH / MEDIUM / LOW | Yes |
| Status | QUEUED / IN_REVIEW / COMPLETED | Yes |

### Discovery-to-Review Pipeline

```
┌──────────────┐     ┌──────────────┐     ┌──────────────────┐     ┌─────────────┐
│  Discovery   │────▶│  Queue       │────▶│  Eligibility     │────▶│  Universe   │
│  (identify)  │     │  (prioritise)│     │  Review          │     │  Decision   │
└──────────────┘     └──────────────┘     └──────────────────┘     └─────────────┘
                                                                          │
                                                          ┌───────────────┼───────────────┐
                                                          ▼               ▼               ▼
                                                     APPROVED        WATCHLIST        REJECTED
```

### Queue Management

- HIGH priority assets are reviewed within 48 hours
- MEDIUM priority assets are reviewed within 1 week
- LOW priority assets are reviewed within 2 weeks
- Queue is processed in priority order, then FIFO within priority level
- Maximum queue size: 20 assets (prevents backlog accumulation)

### Source Attribution Rules

- Every asset in the universe retains its discovery source permanently
- If an asset is discovered through multiple sources, all are recorded
- Source attribution supports future analysis of which discovery channels produce the best outcomes

---

## Section 2 — Eligibility Review Workflow

### Purpose

The eligibility review determines whether an asset is permitted to enter the Nür Capital investment universe. This is a binary gate with three possible outcomes: APPROVED, WATCHLIST, or REJECTED.

### Review Process

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        ELIGIBILITY REVIEW WORKFLOW                            │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  Step 1: INITIAL SCREENING                                                   │
│  ├── Identify asset type, sector, country, industry                          │
│  ├── Check for obvious exclusions (gambling, weapons, alcohol)               │
│  └── If obvious exclusion → FAST REJECT (skip to Step 5)                     │
│                                                                              │
│  Step 2: FLAG ASSESSMENT                                                     │
│  ├── Israel Exposure        → CLEAR / FLAGGED                                │
│  ├── Gambling Exposure      → CLEAR / FLAGGED                                │
│  ├── Alcohol Exposure       → CLEAR / FLAGGED                                │
│  ├── Interest-Based Finance → CLEAR / FLAGGED                                │
│  ├── Weapons Exposure       → CLEAR / FLAGGED                                │
│  ├── Adult Industry         → CLEAR / FLAGGED                                │
│  └── Prohibited Structure   → CLEAR / FLAGGED                                │
│                                                                              │
│  Step 3: FINANCIAL RATIO ANALYSIS (AAOIFI Thresholds)                        │
│  ├── Total debt / total assets         < 33%                                 │
│  ├── Interest income / total revenue   < 5%                                  │
│  ├── Illiquid assets / total assets    > 25%                                 │
│  └── Cash + receivables / total assets < 70%                                 │
│                                                                              │
│  Step 4: DETERMINATION                                                       │
│  ├── All flags CLEAR + ratios pass     → APPROVED                            │
│  ├── Any flag under investigation      → WATCHLIST                           │
│  ├── Any flag FLAGGED with HIGH conf   → REJECTED                            │
│  └── Borderline ratios (4-6% range)    → WATCHLIST                           │
│                                                                              │
│  Step 5: DOCUMENTATION                                                       │
│  ├── Record all flag results                                                 │
│  ├── Document rejection reasons (if applicable)                              │
│  ├── Write analyst review notes                                              │
│  ├── Set confidence level (HIGH / MEDIUM / LOW)                              │
│  ├── Set review date and next review date                                    │
│  └── Sign off                                                                │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Hard Exclusion Rules

| Category | Trigger Condition | Threshold | Override Possible? |
|----------|-------------------|-----------|-------------------|
| Gambling | Core business involves betting/casinos/lotteries | >5% revenue | No |
| Alcohol | Production or primary distribution of alcohol | >5% revenue | No |
| Interest-Based Finance | Conventional banking/lending as core business | >5% interest income | No |
| Weapons | Manufacturing or sale of weapons/military systems | Any involvement | No |
| Israel Exposure | HQ in Israel, or significant operations/revenue | Material presence | No |
| Adult Industry | Production or distribution of adult content | Any involvement | No |
| Prohibited Structure | Corporate structure incompatible with Sharia | Structural issue | No |

### Watchlist Handling

Assets on WATCHLIST:
- Cannot receive capital allocation
- Are monitored monthly for status changes
- Require documented reason for watchlist placement
- Have a target resolution date (max 90 days)
- Must be resolved to APPROVED or REJECTED within 90 days

**Watchlist triggers:**
- Pending quarterly financials needed for ratio analysis
- Corporate restructuring that may change exposure
- Borderline ratio (between 4% and 6%)
- Insufficient public information for determination
- Analyst confidence is LOW

### Escalation Rules

| Condition | Escalation |
|-----------|-----------|
| Borderline case (analyst unsure) | Escalate to Investment Committee review |
| Conflicting information sources | Require two independent sources before determination |
| Asset previously APPROVED now flagged | Immediate review within 48 hours |
| Watchlist asset exceeds 90-day limit | Force determination (APPROVED or REJECTED) |
| External event changes exposure (M&A, expansion) | Trigger re-review regardless of schedule |

### Manual Override Workflow

Overrides are **extremely rare** and require:
1. Written justification explaining why the override is appropriate
2. Investment Committee approval (or sole operator sign-off with documented reasoning)
3. Time-limited approval (max 6 months, then re-review)
4. Permanent audit trail marking the asset as "override active"
5. Override reason must reference a specific principle or exceptional circumstance

**Overrides are NOT permitted for:**
- Israel exposure (hard exclusion, no exceptions)
- Weapons manufacturing (hard exclusion, no exceptions)
- Core gambling businesses (hard exclusion, no exceptions)

### Confidence Levels

| Level | Definition | Evidence Required | Review Frequency |
|-------|-----------|-------------------|-----------------|
| **HIGH** | Clear determination, strong evidence, no ambiguity | Annual report + 2 independent sources | Annual |
| **MEDIUM** | Reasonable determination, minor ambiguity exists | Annual report + 1 additional source | Quarterly |
| **LOW** | Insufficient data or significant ambiguity | Limited sources available | Monthly |

### Re-Review Triggers

- Scheduled review date reached
- M&A activity involving the company
- News of expansion into excluded geographies/sectors
- Financial ratio changes reported in earnings
- External analyst flags a concern
- Stakeholder raises a question

---

## Section 3 — Theme Classification Workflow

### Purpose

Theme classification assigns approved assets to one or more investment themes. This enables thematic portfolio construction, concentration monitoring, and macro-aligned allocation.

### Classification Process

```
┌──────────────┐     ┌──────────────────┐     ┌──────────────────┐     ┌─────────────┐
│  APPROVED    │────▶│  Sector/Industry │────▶│  Theme Mapping   │────▶│  Analyst    │
│  Asset       │     │  Analysis        │     │  (rule-based)    │     │  Validation │
└──────────────┘     └──────────────────┘     └──────────────────┘     └─────────────┘
                                                                              │
                                                                              ▼
                                                                     ┌─────────────────┐
                                                                     │  Final Theme    │
                                                                     │  Assignment     │
                                                                     │  (1-3 themes)   │
                                                                     └─────────────────┘
```

### Supported Themes

| Theme | Category | Typical Sectors |
|-------|----------|-----------------|
| Semiconductors | Technology | Chip design, fabrication, equipment |
| AI Infrastructure | Technology | Cloud, data centres, AI hardware/software |
| Battery Technology | Technology | Battery manufacturing, energy storage |
| Halal Finance | Finance | Sharia-compliant ETFs, Islamic fintech |
| Islamic Banking | Finance | Full Islamic banks, sukuk issuers |
| Clean Energy | Energy | Solar, wind, hydrogen, renewables |
| Oil & Gas | Energy | Upstream, midstream, downstream |
| Energy Infrastructure | Energy | Grid, utilities, transmission, LNG |
| Healthcare | Healthcare | Pharma, biotech, medical devices |
| Industrial Automation | Industrial | Factory automation, IoT, PLCs |
| Robotics | Industrial | Autonomous systems, surgical robots |
| Cybersecurity | Technology | Network security, identity, threat detection |
| Manufacturing | Industrial | Advanced manufacturing, reshoring |
| Logistics | Industrial | Supply chain, shipping, warehousing |

### Classification Rules

**Multi-theme support:**
- Each asset receives 1 Primary Theme (mandatory)
- Each asset may receive 1 Secondary Theme (optional)
- Each asset may receive Additional Themes (optional, comma-separated)
- Maximum 3 themes per asset to prevent dilution

**Assignment sources:**

| Source | Description | Confidence |
|--------|-------------|-----------|
| **Manual** | Analyst assigns based on research | Highest |
| **Rule-Based** | Automatic mapping from sector/industry | High |
| **AI-Assisted** | Future: ML-based classification from descriptions | Medium (requires validation) |

### Rule-Based Mapping (Initial)

| Industry Contains | → Primary Theme |
|-------------------|-----------------|
| Semiconductor, Chip, Foundry | Semiconductors |
| AI, Cloud, Data Centre | AI Infrastructure |
| Battery, Energy Storage | Battery Technology |
| Sharia, Halal, Islamic ETF | Halal Finance |
| Islamic Bank, Sukuk | Islamic Banking |
| Solar, Wind, Hydrogen, Renewable | Clean Energy |
| Oil, Gas, Petroleum | Oil & Gas |
| Grid, Utility, Transmission | Energy Infrastructure |
| Pharma, Biotech, Medical | Healthcare |
| Automation, PLC, Factory | Industrial Automation |
| Robot, Autonomous | Robotics |
| Security, Cyber, Identity | Cybersecurity |
| Manufacturing, Production | Manufacturing |
| Logistics, Shipping, Warehouse | Logistics |

### Analyst Validation Requirements

- Rule-based assignments must be validated by analyst before finalisation
- Analyst may override rule-based assignment with documented reasoning
- Theme changes require a note explaining why the reclassification occurred
- Historical theme assignments are retained for audit

### Reclassification Triggers

- Company pivots business model (e.g., energy company moves to renewables)
- M&A changes primary revenue source
- Quarterly review identifies misclassification
- New theme added to the framework

---

## Section 4 — Market & Trend Review Workflow

### Purpose

The market and trend review evaluates the technical positioning of approved assets. It determines whether an asset's price action supports allocation — regardless of fundamental quality.

An asset may be fundamentally sound but technically weak. The trend review prevents allocation into deteriorating price structures.

### Trend Assessment Process

```
┌──────────────────┐     ┌──────────────────┐     ┌──────────────────┐
│  Price Data      │────▶│  Moving Average  │────▶│  Trend Score     │
│  (1yr daily)     │     │  Calculation     │     │  Calculation     │
└──────────────────┘     └──────────────────┘     └──────────────────┘
                                                          │
                                                          ▼
┌──────────────────┐     ┌──────────────────┐     ┌──────────────────┐
│  Risk Rating     │◀────│  Volatility      │◀────│  Momentum Score  │
│  Assignment      │     │  Assessment      │     │  Calculation     │
└──────────────────┘     └──────────────────┘     └──────────────────┘
                                                          │
                                                          ▼
                                                  ┌──────────────────┐
                                                  │  Market Regime   │
                                                  │  Alignment Check │
                                                  └──────────────────┘
```

### Metrics Calculated

| Metric | Calculation | Interpretation |
|--------|-------------|----------------|
| **MA50** | 50-day simple moving average | Short-term trend direction |
| **MA200** | 200-day simple moving average | Long-term trend direction |
| **Trend Score** | Normalised position relative to MAs (-1 to +1) | >0 = uptrend, <0 = downtrend |
| **Momentum Score** | Rate of change + relative strength (-1 to +1) | >0 = accelerating, <0 = decelerating |
| **Volatility** | Annualised standard deviation of daily returns | Bucketed: low/moderate/elevated/high |
| **Relative Strength** | Performance vs broad market over 3 months | >1 = outperforming |

### Trend Score Calculation

```
Trend Score = weighted average of:
  - Price vs MA50 position     (weight: 0.3)
  - Price vs MA200 position    (weight: 0.3)
  - MA50 vs MA200 relationship (weight: 0.2)
  - 3-month price change       (weight: 0.2)

Normalised to range [-1, +1]
```

### Condition Definitions

#### Bullish Conditions
- Price above MA50 AND MA200
- MA50 above MA200 (golden cross territory)
- Trend score > +0.3
- Momentum score > +0.2
- Volatility: low or moderate

**Implication:** Full position sizing permitted. BUY signals active.

#### Neutral Conditions
- Price between MA50 and MA200 (mixed signals)
- OR: Price above both MAs but momentum declining
- Trend score between -0.3 and +0.3
- Momentum score between -0.2 and +0.2

**Implication:** HOLD existing positions. No new BUY signals. Monitor weekly.

#### Defensive Conditions
- Price below MA50 AND MA200
- MA50 below MA200 (death cross territory)
- Trend score < -0.3
- Momentum score < -0.2
- Volatility: elevated or high

**Implication:** REDUCE positions. No new allocation. Increase cash. Review weekly.

### Trend Review Cadence

| Market Regime | Review Frequency | Action Threshold |
|---------------|-----------------|------------------|
| Strong Bull | Monthly | Score drops below +0.3 |
| Weak Bull | Bi-weekly | Score drops below 0 |
| Sideways | Weekly | Score drops below -0.3 |
| Bear/Crisis | Weekly | Any positive reversal signal |

### Historical Tracking

- All trend scores are timestamped and retained
- Score history enables trend-of-trend analysis (is the score improving or deteriorating?)
- Historical scores support backtesting of allocation decisions

---

## Section 5 — Risk Review Workflow

### Purpose

The risk review evaluates threats to capital for each approved asset and for the portfolio as a whole. Risk assessment determines position sizing, concentration limits, and defensive behaviour.

### Risk Assessment Process

```
┌──────────────────────────────────────────────────────────────────┐
│                      RISK REVIEW WORKFLOW                          │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  For each APPROVED asset:                                         │
│                                                                   │
│  1. VOLATILITY RISK                                               │
│     └── Annualised volatility of daily returns                    │
│     └── Compared to universe median                               │
│     └── Score: 0-100 (higher = riskier)                           │
│                                                                   │
│  2. CONCENTRATION RISK                                            │
│     └── Current portfolio weight vs limits                        │
│     └── Theme concentration check                                 │
│     └── Geography concentration check                             │
│     └── Score: 0-100                                              │
│                                                                   │
│  3. LIQUIDITY RISK                                                │
│     └── Average daily volume                                      │
│     └── Market cap (small-cap = higher risk)                      │
│     └── Bid-ask spread (where available)                          │
│     └── Score: 0-100                                              │
│                                                                   │
│  4. GEOPOLITICAL RISK                                             │
│     └── Country risk assessment                                   │
│     └── Supply chain exposure to unstable regions                 │
│     └── Regulatory/sanctions risk                                 │
│     └── Score: 0-100                                              │
│                                                                   │
│  5. THEMATIC CONCENTRATION RISK                                   │
│     └── How much portfolio is in this asset's theme               │
│     └── Theme correlation with other holdings                     │
│     └── Score: 0-100                                              │
│                                                                   │
│  6. MACROECONOMIC RISK                                            │
│     └── Interest rate sensitivity                                 │
│     └── Currency exposure                                         │
│     └── Economic cycle positioning                                │
│     └── Score: 0-100                                              │
│                                                                   │
│  OVERALL RISK = Weighted average of all categories                │
│  RISK RATING = low / moderate / elevated / high                   │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
```

### Risk Rating Thresholds

| Overall Score | Rating | Position Size Impact |
|---------------|--------|---------------------|
| 0-25 | **Low** | Full position permitted (up to 15%) |
| 26-50 | **Moderate** | Standard position (up to 12%) |
| 51-75 | **Elevated** | Reduced position (up to 8%) |
| 76-100 | **High** | Minimal position (up to 4%) or exclude |

### Risk Category Weights

| Category | Weight | Rationale |
|----------|--------|-----------|
| Volatility | 25% | Direct measure of price uncertainty |
| Concentration | 20% | Portfolio-level diversification |
| Liquidity | 15% | Ability to exit without impact |
| Geopolitical | 20% | Tail risk from political events |
| Thematic Concentration | 10% | Correlation within themes |
| Macroeconomic | 10% | Sensitivity to macro shifts |

### Geopolitical Risk by Country

| Country/Region | Base Risk Level | Key Concerns |
|----------------|----------------|--------------|
| US | Low | Regulatory, political cycle |
| EU (core) | Low | Regulatory complexity |
| Japan | Low | Currency, demographics |
| GCC (UAE, Saudi, Qatar) | Low-Moderate | Oil dependency, regional tensions |
| Taiwan | Elevated | China-Taiwan geopolitical risk |
| China | Elevated | Regulatory, geopolitical, capital controls |
| Emerging Markets | Moderate-Elevated | Currency, governance, liquidity |

### Allocation Safeguards

Risk ratings directly constrain allocation:

1. **No asset with HIGH risk rating receives >4% allocation**
2. **No asset with ELEVATED risk receives >8% allocation**
3. **If portfolio overall risk exceeds 50: trigger defensive review**
4. **If any single risk category exceeds 80 for a position: flag for immediate review**

### Defensive Positioning Logic

When portfolio risk is elevated:
1. Reduce highest-risk positions first (highest overall risk score)
2. Increase cash allocation by 5-10%
3. Shift toward low-risk themes (Islamic Banking, Healthcare, Infrastructure)
4. Tighten position size caps by one tier
5. Increase review frequency to weekly

### Risk Review Cadence

| Condition | Frequency |
|-----------|-----------|
| Normal market conditions | Monthly |
| Elevated volatility (VIX >25) | Weekly |
| Position approaching concentration limit | Immediate |
| Geopolitical event affecting holdings | Within 24 hours |
| Quarterly portfolio review | Full risk reassessment |

---

## Section 6 — Opportunity Review Workflow

### Purpose

The opportunity review determines whether an approved asset deserves capital allocation at this time. It synthesises eligibility, theme, trend, and risk assessments into an actionable investment decision.

### Opportunity Review Questions

Every asset considered for allocation must answer these five questions:

| # | Question | What It Evaluates |
|---|----------|-------------------|
| 1 | **Why does this asset deserve capital?** | Fundamental thesis and competitive position |
| 2 | **What macro trends support it?** | Theme strength and structural tailwinds |
| 3 | **What invalidates the thesis?** | Kill conditions and thesis breakers |
| 4 | **What risks exist?** | Specific risks accepted at this allocation |
| 5 | **Is the market regime supportive?** | Technical positioning and timing |

### Opportunity Review Template

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
OPPORTUNITY REVIEW: [TICKER] — [COMPANY NAME]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Date:           [YYYY-MM-DD]
Analyst:        [Name]
Theme:          [Primary Theme]
Current Score:  [XX.X / 100]

─── INVESTMENT THESIS ───────────────────────────────────────────

Why this asset deserves capital:
[2-3 sentences on competitive position, moat, structural advantage]

Macro trends supporting the thesis:
[2-3 bullet points on theme drivers]

─── THESIS INVALIDATION ─────────────────────────────────────────

What would break this thesis:
• [Condition 1]
• [Condition 2]
• [Condition 3]

─── RISK ACCEPTANCE ─────────────────────────────────────────────

Risks accepted at this allocation:
• [Risk 1 — why it's acceptable]
• [Risk 2 — why it's acceptable]

Risk rating: [low / moderate / elevated / high]

─── MARKET REGIME CHECK ─────────────────────────────────────────

Current regime: [Strong Bull / Weak Bull / Sideways / etc.]
Trend score:    [X.XX]
Momentum:       [X.XX]
Regime supports allocation: [YES / NO / CONDITIONAL]

─── DECISION ────────────────────────────────────────────────────

Signal:         [BUY / HOLD / REDUCE / WATCHLIST]
Allocation:     [X%]
Confidence:     [HIGH / MEDIUM / LOW]
Next review:    [YYYY-MM-DD]

─── NOTES ───────────────────────────────────────────────────────

[Additional context, conditions, or observations]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### Signal Definitions

| Signal | Criteria | Action |
|--------|----------|--------|
| **BUY** | Score >50, positive trend, acceptable risk, regime supportive | Initiate or increase to target allocation |
| **HOLD** | Score 35-50, or positive but decelerating, or regime neutral | Maintain current position unchanged |
| **REDUCE** | Score <35, negative trend, elevated risk, or regime defensive | Trim 30-50% of position. Reallocate to cash |
| **WATCHLIST** | Approved but conditions not yet favourable for allocation | Monitor. Do not allocate. Review monthly |

### Decision Rules

- An asset cannot receive BUY if trend score is negative
- An asset cannot receive BUY if risk rating is HIGH
- An asset in REDUCE must be reviewed within 2 weeks (either recover to HOLD or exit)
- WATCHLIST assets are reviewed monthly for upgrade potential
- All decisions require documented rationale (no signal without explanation)

### Confidence Tracking

| Level | Meaning | Position Size Modifier |
|-------|---------|----------------------|
| HIGH | Strong conviction, clear thesis, supportive data | Full target allocation |
| MEDIUM | Reasonable conviction, some uncertainty | 70% of target allocation |
| LOW | Speculative, limited data, uncertain thesis | 40% of target allocation or WATCHLIST |

---

## Section 7 — Portfolio Review Workflow

### Purpose

The portfolio review ensures the overall portfolio remains diversified, risk-appropriate, and aligned with Nür Capital principles. It operates at the portfolio level — not individual asset level.

### Portfolio Construction Principles

1. **Only APPROVED assets receive allocation** — no exceptions
2. **Thematic diversification is mandatory** — minimum 3 themes represented
3. **Concentration limits are hard constraints** — never exceeded
4. **Cash is an active position** — sized to market regime
5. **Defensive positioning overrides opportunity** — capital preservation first

### Concentration Limits

| Dimension | Maximum | Monitoring |
|-----------|---------|-----------|
| Single position | 15% | Real-time |
| Single theme | 35% | Weekly |
| Single country | 40% | Monthly |
| Single sector | 40% | Monthly |
| Top 3 positions combined | 40% | Weekly |
| Correlation cluster | 50% | Quarterly |

### Portfolio Review Process

```
┌─────────────────────────────────────────────────────────────────┐
│                    PORTFOLIO REVIEW WORKFLOW                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  1. COMPOSITION CHECK                                            │
│     ├── Verify all positions are APPROVED status                 │
│     ├── Check for eligibility status changes                     │
│     └── Remove any asset that moved to REJECTED                  │
│                                                                  │
│  2. CONCENTRATION CHECK                                          │
│     ├── Single position limits                                   │
│     ├── Theme concentration                                      │
│     ├── Geographic concentration                                 │
│     └── Flag any breaches                                        │
│                                                                  │
│  3. RISK CHECK                                                   │
│     ├── Portfolio-level volatility                                │
│     ├── Maximum drawdown estimate                                │
│     ├── Correlation analysis                                     │
│     └── Regime appropriateness                                   │
│                                                                  │
│  4. PERFORMANCE CHECK                                            │
│     ├── Individual position performance                          │
│     ├── Theme performance                                        │
│     ├── Relative to benchmark                                    │
│     └── Attribution analysis                                     │
│                                                                  │
│  5. REBALANCE DECISION                                           │
│     ├── Identify positions needing adjustment                    │
│     ├── Calculate target weights                                 │
│     ├── Generate rebalance actions                               │
│     └── Document rationale                                       │
│                                                                  │
│  6. CASH ALLOCATION                                              │
│     ├── Verify cash meets regime minimum                         │
│     ├── Identify deployment opportunities                        │
│     └── Set cash target for next period                          │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Review Cadence

| Review Type | Frequency | Scope |
|-------------|-----------|-------|
| **Full Portfolio Review** | Quarterly | Complete reassessment of all positions, themes, risk |
| **Rebalance Review** | Monthly | Check concentration limits, drift from targets |
| **Risk Review** | Monthly (weekly in volatile markets) | Portfolio-level risk metrics |
| **Theme Review** | Quarterly | Theme performance, macro alignment, rotation needs |
| **Eligibility Audit** | Quarterly | Verify all positions still APPROVED |
| **Regime Check** | Bi-weekly | Market regime assessment, cash positioning |

### Rebalancing Triggers

| Trigger | Action |
|---------|--------|
| Position drifts >3% from target | Trim or add to restore target |
| Concentration limit breached | Immediate trim to below limit |
| Market regime changes | Adjust all positions to new regime caps |
| Asset moves to REJECTED | Immediate full exit |
| New BUY signal for high-conviction asset | Fund from cash or lowest-conviction position |
| Quarterly calendar | Full review regardless of triggers |

### Cash Allocation Logic

```
Target Cash = Regime Minimum + Opportunity Reserve + Defensive Buffer

Where:
  Regime Minimum    = Defined by current market regime (5-60%)
  Opportunity Reserve = 5% (always available for dislocations)
  Defensive Buffer  = 0-10% (increases as portfolio risk rises)
```

### Portfolio Health Indicators

| Indicator | Healthy | Warning | Critical |
|-----------|---------|---------|----------|
| Number of positions | 8-15 | <5 or >20 | <3 or >25 |
| Theme count | 4-8 | 2-3 | 1 |
| Cash level vs regime target | Within 5% | 5-10% deviation | >10% deviation |
| Largest position | <12% | 12-15% | >15% |
| Portfolio beta | 0.6-1.1 | 1.1-1.3 | >1.3 |

---

## Section 8 — Investment Committee Model

### Purpose

Even with a single operator, Nür Capital operates with the discipline of an institutional investment committee. This means structured reviews, documented decisions, thesis tracking, and accountability — regardless of team size.

The Investment Committee model ensures that decisions are never made casually, emotionally, or without documentation.

### Committee Structure (Solo Operator Model)

When operating with a single person, the "committee" is a structured self-review process:

| Role | Responsibility | Frequency |
|------|---------------|-----------|
| **Analyst** | Research, screening, theme classification | Ongoing |
| **Risk Officer** | Risk assessment, concentration monitoring | Weekly |
| **Portfolio Manager** | Allocation decisions, rebalancing | Monthly |
| **Committee Chair** | Final sign-off, strategic direction | Quarterly |

All four roles are performed by the same person but at different times with different mindsets. This prevents conflicts of interest within a single review session.

### Structured Review Sessions

#### Weekly Review (30 minutes)

**Agenda:**
1. Market regime check (5 min)
2. Watchlist status update (5 min)
3. Position alerts (any breaches or flags) (10 min)
4. Discovery queue review (5 min)
5. Action items for the week (5 min)

**Output:** Brief notes documenting any decisions or flags raised.

#### Monthly Review (60 minutes)

**Agenda:**
1. Portfolio composition review (10 min)
2. Concentration limit check (10 min)
3. Risk assessment update (10 min)
4. Opportunity pipeline review (10 min)
5. Rebalancing decisions (10 min)
6. Thesis validation for top positions (10 min)

**Output:** Monthly review memo with decisions, rationale, and action items.

#### Quarterly Review (120 minutes)

**Agenda:**
1. Full portfolio performance review (20 min)
2. Theme performance and rotation analysis (20 min)
3. Eligibility re-screening of all positions (20 min)
4. Risk framework review (15 min)
5. Market regime and outlook assessment (15 min)
6. Strategic allocation changes (15 min)
7. Process improvement review (15 min)

**Output:** Quarterly investment report with full documentation.

### Decision Documentation Standard

Every investment decision must be recorded with:

| Field | Description |
|-------|-------------|
| Decision Date | When the decision was made |
| Decision Type | BUY / HOLD / REDUCE / EXIT / WATCHLIST / REJECT |
| Asset | Ticker and company name |
| Rationale | 2-3 sentences explaining why |
| Thesis | Core investment thesis (for BUY decisions) |
| Invalidation Conditions | What would reverse this decision |
| Confidence | HIGH / MEDIUM / LOW |
| Review Date | When this decision will be reassessed |
| Outcome (retrospective) | Filled in at next review — was the decision correct? |

### Thesis Tracking

Every BUY decision creates a thesis that must be tracked:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
THESIS: [TICKER] — [ONE-LINE THESIS STATEMENT]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Created:        [YYYY-MM-DD]
Status:         ACTIVE / VALIDATED / INVALIDATED / EXPIRED

Core thesis:    [2-3 sentences]

Supporting evidence:
• [Evidence 1]
• [Evidence 2]
• [Evidence 3]

Invalidation conditions:
• [Condition 1] — would trigger REDUCE
• [Condition 2] — would trigger EXIT
• [Condition 3] — would trigger EXIT

Quarterly check-ins:
• [Q1 YYYY] — Thesis intact. [Brief note]
• [Q2 YYYY] — [Update]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### Accountability Mechanisms

Even as a solo operator, accountability is maintained through:

1. **Written decisions** — No verbal-only decisions. Everything is documented.
2. **Retrospective reviews** — Every quarterly review includes "was this decision correct?" analysis
3. **Thesis expiry** — Theses expire after 12 months and must be renewed or the position is reviewed
4. **Process adherence** — The workflow is the authority, not the operator's mood
5. **External review** — Annual review by a Sharia advisor (when available)

### Scaling to Multi-Person Committee

When Nür Capital grows beyond a single operator:

| Phase | Team Size | Committee Model |
|-------|-----------|-----------------|
| Phase 1 (current) | 1 person | Structured self-review with role separation |
| Phase 2 | 2-3 people | Analyst + PM model with peer review |
| Phase 3 | 4+ people | Formal committee with voting, quorum, and minutes |

The documentation standards remain identical across all phases. Only the review process gains additional participants.

---

## Section 9 — Explainability & Auditability

### Purpose

Every decision within Nür Capital must be explainable to any stakeholder at any time. This section defines the standards, formats, and requirements for maintaining a fully auditable investment process.

### Explainability Principle

> If you cannot explain a decision in plain language to a non-technical stakeholder, the decision process is flawed.

### What Must Be Explainable

| Decision Type | Must Explain |
|---------------|-------------|
| **Eligibility: APPROVED** | Which flags were checked, all results, financial ratios, confidence level |
| **Eligibility: REJECTED** | Specific rule triggered, evidence source, why override is not possible |
| **Eligibility: WATCHLIST** | What is uncertain, what data is needed, target resolution date |
| **Theme Assignment** | Why this theme fits, what evidence supports it, source of classification |
| **Opportunity Score** | Factor decomposition, what drives the score, what would change it |
| **BUY Signal** | Thesis, macro support, risk acceptance, regime alignment |
| **HOLD Signal** | Why not increasing, what would trigger upgrade or downgrade |
| **REDUCE Signal** | What deteriorated, what threshold was breached, timeline for exit |
| **Allocation Size** | Why this percentage, what constraints apply, confidence modifier |
| **Risk Posture Change** | What signals triggered it, new parameters, expected duration |
| **Rebalance Action** | What drifted, what the target is, why now |

### Audit Trail Requirements

Every record in the system must include:

| Field | Purpose |
|-------|---------|
| Timestamp | When the decision/action occurred |
| Actor | Who made the decision (person or system) |
| Action | What was decided or changed |
| Previous State | What the value was before |
| New State | What the value is now |
| Rationale | Why the change was made |
| Evidence | Source of information supporting the decision |
| Confidence | How certain we are |
| Next Review | When this will be reassessed |

### Audit Scenarios

**Scenario 1: "Why is NVDA rejected?"**

Expected answer:
> "NVDA is REJECTED (since 2025-05-20) because flag_israel_exposure = FLAGGED. NVIDIA acquired Mellanox Technologies (Israel-based) in 2020. Mellanox operations continue in Israel with 3,000+ employees across multiple R&D centres. This constitutes significant Israel operations and triggers the hard exclusion rule. Confidence: HIGH. Source: NVIDIA 10-K filing, Mellanox acquisition press release. No override is possible for Israel exposure. Next review: 2025-08-20."

**Scenario 2: "Why does TSM get 12% allocation?"**

Expected answer:
> "TSM receives 12% allocation because: (1) Opportunity score is 62.4 (rank #1 in universe), (2) Primary theme Semiconductors is in a structural AI supercycle, (3) Trend score +0.72 confirms bullish positioning, (4) Risk rating is 'moderate' which permits up to 12% under current regime, (5) Current regime is 'Weak Bull' with 12% max position cap. Confidence: HIGH. Thesis: Leading foundry with monopoly in advanced nodes, secular AI demand tailwind. Invalidation: Loss of Apple/NVIDIA as customers, or China-Taiwan military escalation."

**Scenario 3: "Why did cash increase from 15% to 30%?"**

Expected answer:
> "Cash increased from 15% to 30% on 2025-04-15 because market regime transitioned from 'Weak Bull' to 'Sideways' (confirmed over 2 weeks). Signals: S&P 500 crossed below MA50, breadth deteriorated to 45% above MA200, VIX rose to 22. Under Sideways regime, target cash is 25-40%. Positions trimmed: ENPH (-3%), FSLR (-2%). Next regime reassessment: 2025-04-29."

### Historical Record Retention

| Record Type | Retention Period | Format |
|-------------|-----------------|--------|
| Eligibility decisions | Indefinite | Structured record |
| Opportunity scores | 5 years | Time-series |
| Portfolio snapshots | Indefinite | Monthly snapshot |
| Rebalance actions | Indefinite | Transaction log |
| Regime changes | Indefinite | Event log |
| Thesis documents | Indefinite | Structured document |
| Review meeting notes | 5 years | Free text with structure |

### Transparency Commitments

1. **No black boxes** — Every score is decomposable into its factors
2. **No hidden rules** — All exclusion criteria are documented in this framework
3. **No retroactive changes** — Decisions are recorded at the time they are made, not edited later
4. **No selective disclosure** — All stakeholders have access to the same information
5. **No complexity for its own sake** — If a simpler model produces equivalent results, use the simpler model

### Future Audit Support

The system is designed to support:
- External Sharia advisory board review
- Regulatory compliance audits (if applicable)
- Investor due diligence requests
- Internal process improvement analysis
- Performance attribution and decision quality assessment

---

## Document Control

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | May 2025 | Nür Capital | Initial workflow framework |

---

*End of document.*
