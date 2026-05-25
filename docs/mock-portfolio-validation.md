# Nür Capital — Mock Portfolio Validation Framework

**Version:** 1.0  
**Classification:** Internal — Paper Portfolio System  
**Last Updated:** May 2025  

---

## Purpose

This framework defines a paper portfolio validation system for Nür Capital. It allows the operator to simulate investment decisions, track reasoning, validate methodology, and build a decision-quality track record — without live trading, broker execution, or real capital at risk.

The mock portfolio exists to answer one question: **Does the Nür Capital methodology produce coherent, disciplined, explainable investment decisions over time?**

---

## What This Is

- A paper portfolio validation system
- A methodology stress-test
- A decision-quality tracker
- A discipline-building tool
- A historical record of investment reasoning

## What This Is NOT

- Live trading
- Broker execution
- Automated investing
- Performance marketing
- Return optimisation

---

## Section 1 — Mock Portfolio Structure

### Portfolio Parameters

| Parameter | Value | Rationale |
|-----------|-------|-----------|
| Starting capital | $100,000 (notional) | Round number for easy % calculation |
| Position count | 4–10 assets | Concentrated enough to matter, diversified enough to survive |
| Asset eligibility | APPROVED only | No exceptions. Watchlist and Rejected assets cannot be held |
| Cash allocation | 5–70% (regime-dependent) | Cash is an active position, not idle capital |
| Rebalance frequency | Monthly (or on regime change) | Prevents over-trading while maintaining discipline |
| Review frequency | Weekly | Builds habit and catches deterioration early |

### Position Record Structure

Every position in the mock portfolio tracks:

| Field | Description | Example |
|-------|-------------|---------|
| Ticker | Asset symbol | TSM |
| Company Name | Full name | Taiwan Semiconductor |
| Entry Date | When position was initiated | 2025-03-15 |
| Entry Price | Price at initiation | $165.20 |
| Target Allocation % | Desired portfolio weight | 12% |
| Actual Allocation % | Current weight (price-adjusted) | 12.8% |
| Theme | Primary investment theme | Semiconductors |
| Conviction Level | HIGH / MEDIUM / LOW | HIGH |
| Risk Profile | conservative / balanced / growth / aggressive | growth |
| Thesis ID | Link to investment thesis | TSM-2025-Q1 |
| Signal | BUY / HOLD / REDUCE | BUY |
| Current Price | Latest price | $178.52 |
| Return % | Unrealised gain/loss | +8.1% |
| Last Reviewed | Date of last review | 2025-05-25 |
| Notes | Current position commentary | Thesis intact. AI demand accelerating. |

### Portfolio Constraints

| Constraint | Limit | Enforcement |
|-----------|-------|-------------|
| Maximum single position | 15% | Hard cap — trim if exceeded |
| Maximum single theme | 35% | Soft cap — review if approached |
| Maximum single country | 40% | Soft cap — review if approached |
| Minimum themes represented | 3 | Hard minimum — diversify if below |
| Minimum cash (Strong Bull) | 5% | Hard floor |
| Minimum cash (Bear/Crisis) | 40% | Hard floor |
| Maximum positions | 10 | Prevents over-diversification |
| Minimum positions | 4 | Prevents over-concentration |

### Thematic Diversification Requirements

The portfolio must represent at least 3 of these theme categories:

| Category | Themes Included |
|----------|----------------|
| Technology Growth | Semiconductors, AI Infrastructure, Cybersecurity |
| Ethical Finance | Halal Finance, Islamic Banking |
| Energy | Oil & Gas, Clean Energy, Energy Infrastructure |
| Healthcare | Healthcare |
| Industrial | Industrial Automation, Robotics, Manufacturing |
| Defensive | Consumer Staples, Logistics |

---

## Section 2 — Investment Thesis Tracking

### Thesis Requirements

Every position MUST have an associated investment thesis. No allocation without documented reasoning.

### Thesis Template

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
INVESTMENT THESIS: [TICKER] — [COMPANY]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Thesis ID:      [TICKER-YYYY-QN]
Created:        [YYYY-MM-DD]
Status:         ACTIVE / VALIDATED / INVALIDATED / EXPIRED
Conviction:     HIGH / MEDIUM / LOW
Allocation:     [X%]

─── WHY THIS ASSET ──────────────────────────────────────────────

[2-3 sentences: What makes this company exceptional? What is the
competitive advantage or structural positioning?]

─── MACRO DRIVERS ───────────────────────────────────────────────

• [Driver 1 — specific, measurable]
• [Driver 2 — specific, measurable]
• [Driver 3 — specific, measurable]

─── THEME RATIONALE ─────────────────────────────────────────────

Theme: [Primary Theme]
Why this theme matters now: [1-2 sentences on theme timing]

─── RISK CONSIDERATIONS ─────────────────────────────────────────

Risks accepted at this allocation:
• [Risk 1 — why acceptable at this size]
• [Risk 2 — why acceptable at this size]
• [Risk 3 — monitoring approach]

─── INVALIDATION CONDITIONS ─────────────────────────────────────

This thesis is INVALID if:
• [Condition 1 — specific, observable, binary]
• [Condition 2 — specific, observable, binary]
• [Condition 3 — specific, observable, binary]

Action on invalidation: [REDUCE / EXIT / REVIEW]

─── REVIEW LOG ──────────────────────────────────────────────────

[YYYY-MM-DD] — [Status update. What changed? Thesis intact?]
[YYYY-MM-DD] — [Next review entry]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### Thesis Lifecycle

```
CREATED → ACTIVE → [Quarterly Reviews] → VALIDATED / INVALIDATED / EXPIRED
                                              │
                                              ▼
                                    Position adjusted or exited
```

| Status | Meaning | Action |
|--------|---------|--------|
| ACTIVE | Thesis is current and position is held | Continue holding. Review quarterly. |
| VALIDATED | Thesis played out as expected | Document outcome. May create new thesis. |
| INVALIDATED | One or more invalidation conditions triggered | Reduce or exit position immediately. |
| EXPIRED | 12 months passed without renewal | Must write new thesis or exit position. |
| SUPERSEDED | New thesis replaces this one for same asset | Archive. New thesis is now active. |

### Thesis Revision Rules

- Theses can be updated with new evidence (append to review log)
- Core thesis statement should NOT change (if it does, create a new thesis)
- Invalidation conditions can be refined but not weakened
- Conviction level can change based on new data
- All changes are timestamped in the review log

---

## Section 3 — Weekly Review System

### Purpose

The weekly review builds discipline, catches deterioration early, and creates a continuous record of decision-making quality. It is the heartbeat of the mock portfolio system.

### Weekly Review Template

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
WEEKLY REVIEW — Week of [YYYY-MM-DD]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

MARKET REGIME: [Current regime]
PORTFOLIO VALUE: $[XXX,XXX] ([+/-X.X%] WoW)
CASH: [XX%]

─── 1. REGIME CHECK (5 min) ─────────────────────────────────────

Current regime:     [Strong Bull / Weak Bull / Sideways / etc.]
Changed this week:  [Yes / No]
Key signals:        [VIX: XX | Breadth: XX% | S&P vs MA50: Above/Below]
Action required:    [None / Adjust cash / Review positions]

─── 2. POSITION SCAN (10 min) ──────────────────────────────────

| Ticker | Alloc | WoW Δ | Signal | Alert? |
|--------|-------|--------|--------|--------|
| [TSM]  | [12%] | [+2%]  | [BUY]  | [No]   |
| [...]  | [...] | [...]  | [...]  | [...]  |

Drift alerts (>3% from target): [None / List]
Signal changes this week: [None / List]

─── 3. THEME HEALTH (5 min) ─────────────────────────────────────

| Theme | Status | Weight | Concern? |
|-------|--------|--------|----------|
| [Semiconductors] | [STRONG] | [36%] | [Approaching 35% limit] |
| [...]            | [...]    | [...]  | [...]                   |

─── 4. WATCHLIST UPDATE (5 min) ─────────────────────────────────

Items on watchlist: [X]
Any resolution this week: [Yes/No — details]
Any new additions: [Yes/No — details]
Overdue items: [None / List]

─── 5. RISK FLAGS (5 min) ──────────────────────────────────────

New risks identified: [None / Description]
Existing risks changed: [None / Description]
Geopolitical developments: [None / Brief note]
Earnings this week affecting holdings: [None / List]

─── 6. DECISIONS & ACTIONS ──────────────────────────────────────

Actions taken this week:
• [Action 1 — rationale]
• [Action 2 — rationale]

Actions deferred:
• [Deferred action — why waiting]

─── 7. NEXT WEEK FOCUS ─────────────────────────────────────────

• [Item to watch]
• [Item to watch]
• [Scheduled review or event]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### Review Cadence

| Day | Activity | Duration |
|-----|----------|----------|
| Monday | Weekly review (full template above) | 30 min |
| Wednesday | Mid-week check (prices, news, alerts only) | 10 min |
| Friday | End-of-week note (brief — any changes?) | 5 min |

### Review Discipline Rules

1. **Never skip a weekly review** — even if "nothing happened." Document that nothing happened.
2. **Time-box strictly** — 30 minutes maximum. Prevents analysis paralysis.
3. **Write before acting** — Document the decision rationale before making any change.
4. **One decision per review** — If multiple changes needed, prioritise the most important.
5. **No intra-week trading** — Changes happen at weekly review only (except regime change or thesis invalidation).

### Example Weekly Review

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
WEEKLY REVIEW — Week of 2025-05-25
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

MARKET REGIME: Weak Bull (confirmed this week)
PORTFOLIO VALUE: $108,200 (+1.2% WoW)
CASH: 24%

─── 1. REGIME CHECK ─────────────────────────────────────────────

Current regime:     Weak Bull
Changed this week:  Yes (from Strong Bull — confirmed after 2 weeks)
Key signals:        VIX: 18.5 | Breadth: 55% | S&P vs MA50: Above
Action required:    Adjust cash target to 20%. Cap positions at 12%.
                    All current positions already within new limits.

─── 2. POSITION SCAN ───────────────────────────────────────────

| Ticker | Alloc  | WoW Δ  | Signal | Alert? |
|--------|--------|--------|--------|--------|
| TSM    | 12.8%  | +1.5%  | BUY    | No     |
| ASML   | 9.6%   | +0.8%  | BUY    | No     |
| HLAL   | 14.8%  | +0.3%  | HOLD   | No     |
| LLY    | 8.5%   | +2.1%  | BUY    | No     |
| CRWD   | 7.2%   | +1.8%  | BUY    | No     |
| AMD    | 6.8%   | +1.2%  | BUY    | No     |
| AVGO   | 7.1%   | +0.9%  | BUY    | No     |
| ABB    | 5.8%   | +0.5%  | HOLD   | No     |
| 2222   | 7.9%   | -0.2%  | HOLD   | No     |
| SPUS   | 7.8%   | +0.4%  | HOLD   | No     |
| NOVO-B | 4.8%   | -1.5%  | HOLD   | No     |
| PANW   | 5.1%   | +0.6%  | BUY    | No     |

Drift alerts: None (all within 3% of target)
Signal changes: None

─── 3. THEME HEALTH ─────────────────────────────────────────────

| Theme              | Status  | Weight | Concern?                    |
|--------------------|---------|--------|-----------------------------|
| Semiconductors     | STRONG  | 36%    | Slightly above 35% soft cap |
| Halal Finance      | NEUTRAL | 23%    | None                        |
| Healthcare         | NEUTRAL | 13%    | NOVO-B in correction        |
| Cybersecurity      | STRONG  | 12%    | None                        |
| Oil & Gas          | NEUTRAL | 8%     | None                        |
| Ind. Automation    | NEUTRAL | 6%     | None                        |

Note: Semiconductors at 36% — 1% above soft cap. Not trimming yet
because all positions are within individual limits. Will trim if
any single semi position drifts above 13%.

─── 4. WATCHLIST UPDATE ─────────────────────────────────────────

Items: 6 (BABA, PDD, GRAB, UNH, MELI, SIEGY)
Resolutions: None this week
New additions: None
Overdue: None (earliest resolution date: August)

─── 5. RISK FLAGS ──────────────────────────────────────────────

New risks: Regime transition to Weak Bull. Breadth narrowing.
Existing: Taiwan geopolitical (stable). China holdings (stable).
Geopolitical: No new developments.
Earnings: None of our holdings reporting this week.

─── 6. DECISIONS & ACTIONS ──────────────────────────────────────

Actions taken:
• Increased HLAL from 12% to 15% (defensive reallocation in
  Weak Bull regime — strengthening Sharia-compliant anchor)
• Logged regime change in audit log

Actions deferred:
• Semiconductor trim — deferring unless theme exceeds 38%

─── 7. NEXT WEEK FOCUS ─────────────────────────────────────────

• Monitor breadth — if drops below 50%, consider further
  defensive shift
• NOVO-B correction — watch for stabilisation signal
• SIEGY eligibility review — target completion by June

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## Section 4 — Market Regime Tracking

### Regime Definitions

| Regime | Characteristics | Portfolio Posture |
|--------|----------------|-------------------|
| **Strong Bull** | Broad uptrend. Breadth >65%. VIX <18. MA50 > MA200. | Fully invested (85-95%). Growth themes. Full position sizes. |
| **Weak Bull** | Uptrend but narrowing. Breadth 50-65%. VIX 18-22. | Moderately invested (70-85%). Quality + defensive mix. |
| **Sideways** | Range-bound. Breadth 40-55%. VIX 18-25. No clear direction. | Cautious (60-75%). Defensive themes. Elevated cash. |
| **High Volatility** | Sharp swings. VIX >25. Uncertainty dominant. | Defensive (50-70%). Reduce positions. High cash. |
| **Defensive/Bear** | Sustained downtrend. Breadth <40%. VIX >25. Risk-off. | Capital preservation (30-60%). Minimal positions. Maximum cash. |

### Regime Assessment Template

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
REGIME ASSESSMENT — [YYYY-MM-DD]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SIGNALS:
  S&P 500 vs MA200:    [ABOVE / BELOW]
  S&P 500 vs MA50:     [ABOVE / BELOW]
  MA50 vs MA200:       [ABOVE / BELOW]
  Market breadth:      [XX%] stocks above MA200
  VIX:                 [XX.X]
  Credit spreads:      [TIGHTENING / STABLE / WIDENING]
  Sector leadership:   [Which sectors leading]

DETERMINATION:
  Current regime:      [Regime name]
  Previous regime:     [Regime name]
  Changed:            [Yes / No]
  Confirmation:       [TENTATIVE / CONFIRMED]

PORTFOLIO IMPLICATIONS:
  Target cash:         [XX%]
  Max position size:   [XX%]
  Theme preference:    [Growth / Quality / Defensive]
  Risk tolerance:      [High / Moderate / Low]

NOTES:
  [Context for the assessment. What's driving conditions?]

NEXT ASSESSMENT: [YYYY-MM-DD] (bi-weekly)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### Regime Transition Rules

1. **Two-week confirmation** — No regime change is acted upon until confirmed over 2 consecutive assessments
2. **One step at a time** — Move one regime level per transition (Bull → Weak Bull, not Bull → Bear)
3. **Cash adjusts by 10%** — Each regime step down adds ~10% to cash target
4. **Position caps reduce by 3%** — Each step down reduces max position by ~3%
5. **No panic** — Even in rapid deterioration, follow the one-step rule. The system is designed for this.

### Posture Summary Table

| Regime | Equity | Cash | Max Position | Themes |
|--------|--------|------|-------------|--------|
| Strong Bull | 85-95% | 5-15% | 15% | Growth (Semis, AI, Cyber) |
| Weak Bull | 70-85% | 15-30% | 12% | Quality growth + defensive |
| Sideways | 60-75% | 25-40% | 10% | Defensive (Healthcare, Islamic Banking) |
| High Volatility | 50-70% | 30-50% | 8% | Low-beta (Energy, Infrastructure) |
| Defensive/Bear | 30-60% | 40-70% | 6% | Cash + dividends only |

---

## Section 5 — Performance Validation

### Philosophy

Performance validation in Nür Capital is NOT primarily about returns. Returns are an outcome. The system validates **decision quality** — whether the methodology produces coherent, disciplined, explainable decisions consistently.

A portfolio that loses 5% in a bear market while maintaining discipline is a SUCCESS. A portfolio that gains 20% through undisciplined speculation is a FAILURE of the methodology.

### Validation Metrics

#### Decision Quality Metrics (Primary)

| Metric | What It Measures | Target |
|--------|-----------------|--------|
| **Thesis Accuracy** | % of theses that played out as expected | >60% |
| **Invalidation Response Time** | Days between invalidation trigger and action | <7 days |
| **Review Consistency** | % of weekly reviews completed on schedule | >90% |
| **Concentration Discipline** | % of time within all concentration limits | >95% |
| **Regime Response** | Did portfolio adjust within 1 week of confirmed regime change? | 100% |
| **Eligibility Integrity** | Were any rejected/watchlist assets ever allocated? | 0 violations |

#### Risk Management Metrics (Secondary)

| Metric | What It Measures | Target |
|--------|-----------------|--------|
| **Maximum Drawdown** | Largest peak-to-trough decline | <20% |
| **Cash Discipline** | Was cash within regime-appropriate range? | >90% of time |
| **Diversification Score** | Themes represented / minimum required | ≥1.0 always |
| **Position Sizing** | Were all positions within regime caps? | >95% of time |
| **Risk Flag Response** | Were flagged risks addressed within 2 reviews? | >90% |

#### Methodology Metrics (Tertiary)

| Metric | What It Measures | Target |
|--------|-----------------|--------|
| **Theme Coherence** | Do allocated themes match macro conditions? | Qualitative review |
| **Signal Consistency** | Do signals align with scores and regime? | >95% |
| **Explainability** | Can every position be explained in 2 sentences? | 100% |
| **Audit Completeness** | Does every change have a log entry? | 100% |

### Monthly Validation Scorecard

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
VALIDATION SCORECARD — [Month YYYY]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

DECISION QUALITY:
  Weekly reviews completed:        [X/4]  [✓/✗]
  Concentration limits respected:  [Yes/No]
  Regime response timely:          [Yes/No/N/A]
  Eligibility integrity:           [0 violations]
  Thesis reviews current:          [X/X active theses reviewed]

RISK MANAGEMENT:
  Max drawdown this month:         [X.X%]
  Cash within regime range:        [Yes/No]
  All positions within caps:       [Yes/No]
  Diversification maintained:      [X themes / 3 minimum]

METHODOLOGY:
  Signals consistent with scores:  [Yes/No]
  All changes logged in audit:     [Yes/No]
  All positions have active thesis:[Yes/No]

OVERALL GRADE: [A / B / C / D]
  A = All targets met
  B = 1-2 minor misses
  C = Significant discipline lapse
  D = Methodology failure (requires process review)

NOTES:
  [What went well? What needs improvement?]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### Quarterly Retrospective

Every quarter, conduct a deeper retrospective:

1. **Decision audit** — Review all decisions made. Were they consistent with methodology?
2. **Thesis review** — Which theses were validated? Which invalidated? What did we learn?
3. **Regime accuracy** — Did regime assessments correctly identify market conditions?
4. **Missed opportunities** — Were there approved assets we should have allocated to but didn't? Why?
5. **Process improvement** — What workflow changes would improve decision quality?

---

## Section 6 — Portfolio Dashboard

### Dashboard Layout

The portfolio dashboard provides a single-screen view of the current state. It answers: "What do I own, why, and is anything wrong?"

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  NÜR CAPITAL — MOCK PORTFOLIO DASHBOARD                                      │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │  SUMMARY BAR                                                         │    │
│  │  Value: $108,200 | Return: +8.2% | Positions: 12 | Cash: 24%       │    │
│  │  Regime: Weak Bull | Grade: A | Last Review: 2025-05-25             │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  ┌──────────────────────────┐  ┌──────────────────────────────────────┐    │
│  │  ALLOCATION PIE          │  │  THEME EXPOSURE                      │    │
│  │                          │  │                                      │    │
│  │  ■ Semis      36%       │  │  Semiconductors  ████████████ 36%   │    │
│  │  ■ Halal Fin  23%       │  │  Halal Finance   ███████     23%   │    │
│  │  ■ Healthcare 13%       │  │  Healthcare      ████        13%   │    │
│  │  ■ Cyber      12%       │  │  Cybersecurity   ████        12%   │    │
│  │  ■ Oil & Gas   8%       │  │  Oil & Gas       ███          8%   │    │
│  │  ■ Industrial  6%       │  │  Industrial      ██           6%   │    │
│  │  □ Cash       24%       │  │                                      │    │
│  └──────────────────────────┘  └──────────────────────────────────────┘    │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │  POSITIONS                                                           │    │
│  │                                                                      │    │
│  │  #  Ticker  Alloc  Return  Signal  Risk     Theme          Thesis   │    │
│  │  1  TSM     12.8%  +8.1%   BUY     moderate Semiconductors ACTIVE   │    │
│  │  2  ASML     9.6%  +5.2%   BUY     moderate Semiconductors ACTIVE   │    │
│  │  3  HLAL    14.8%  +3.4%   HOLD    low      Halal Finance  —        │    │
│  │  4  LLY      8.5%  +12.3%  BUY     moderate Healthcare     ACTIVE   │    │
│  │  5  CRWD     7.2%  +9.8%   BUY     moderate Cybersecurity  ACTIVE   │    │
│  │  6  AMD      6.8%  +4.4%   BUY     moderate Semiconductors ACTIVE   │    │
│  │  7  AVGO     7.1%  +6.1%   BUY     moderate Semiconductors ACTIVE   │    │
│  │  8  SPUS     7.8%  +3.9%   HOLD    low      Halal Finance  —        │    │
│  │  9  2222.SR  7.9%  +2.9%   HOLD    low      Oil & Gas      ACTIVE   │    │
│  │  10 ABB      5.8%  +4.3%   HOLD    low      Industrial     —        │    │
│  │  11 PANW     5.1%  +2.9%   BUY     moderate Cybersecurity  —        │    │
│  │  12 NOVO-B   4.8%  -6.2%   HOLD    moderate Healthcare     —        │    │
│  │  —  CASH    24.0%   —      —       —        —              —        │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  ┌──────────────────────────┐  ┌──────────────────────────────────────┐    │
│  │  ALERTS                  │  │  REGIME STATUS                       │    │
│  │                          │  │                                      │    │
│  │  ⚠ Semis at 36%         │  │  Current: Weak Bull                 │    │
│  │    (soft cap: 35%)       │  │  Since: 2025-05-25                  │    │
│  │                          │  │  Cash target: 20%                   │    │
│  │  ℹ NOVO-B in correction │  │  Max position: 12%                  │    │
│  │    (-6.2%, thesis intact)│  │  Posture: Quality + Defensive       │    │
│  │                          │  │  Next assessment: 2025-06-08        │    │
│  │  ✓ No drift alerts      │  │                                      │    │
│  │  ✓ No eligibility issues│  │  Trend: Breadth narrowing            │    │
│  └──────────────────────────┘  └──────────────────────────────────────┘    │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Dashboard Data Points

| Section | Data Source | Update Frequency |
|---------|------------|-----------------|
| Summary Bar | Portfolio tracker (calculated) | Weekly |
| Allocation Pie | Portfolio tracker | Weekly |
| Theme Exposure | Portfolio tracker + themes | Weekly |
| Positions Table | Portfolio tracker | Weekly (prices), Monthly (signals) |
| Alerts | Automated checks against limits | Real-time |
| Regime Status | Market regime tracker | Bi-weekly |

### Alert Conditions

| Alert Type | Trigger | Severity |
|-----------|---------|----------|
| Drift alert | Position >3% from target | ⚠ Warning |
| Concentration alert | Theme >35% | ⚠ Warning |
| Regime change | New regime confirmed | ℹ Info |
| Thesis expiring | Thesis expires within 30 days | ℹ Info |
| Eligibility change | Asset moved to REJECTED | 🚨 Critical |
| Drawdown alert | Portfolio down >10% from peak | ⚠ Warning |
| Review overdue | Weekly review not completed | ⚠ Warning |

---

## Section 7 — Important Principles

### What Nür Capital Mock Portfolio IS

| Principle | Implementation |
|-----------|---------------|
| **Disciplined** | Fixed review cadence. No impulsive changes. Write before acting. |
| **Explainable** | Every position has a thesis. Every change has a rationale. |
| **Coherent** | Allocations align with themes, regime, and risk tolerance. |
| **Risk-aware** | Concentration limits enforced. Cash sized to conditions. Defensive when needed. |
| **Long-term** | Theses are 12-month horizons. No day-trading. Patience is the edge. |
| **Auditable** | Complete decision log. Any decision can be traced to a principle. |
| **Principled** | Only approved assets. No exceptions. Ethics before returns. |

### What Nür Capital Mock Portfolio is NOT

| Anti-Pattern | Why It's Excluded |
|-------------|-------------------|
| Day trading | Incompatible with long-term thesis-driven approach |
| Momentum chasing | System follows themes, not short-term price action |
| Leverage | Violates capital preservation principle |
| Derivatives | Not part of the methodology |
| Speculation | Every position requires documented thesis |
| Performance obsession | Decision quality matters more than returns |
| Emotional trading | Weekly cadence prevents reactive behaviour |
| Over-diversification | 4-10 positions. Concentrated enough to matter. |

### Decision-Making Hierarchy

When in doubt, follow this priority order:

```
1. PRINCIPLES    — Does this violate any Nür Capital principle?
2. ELIGIBILITY   — Is this asset APPROVED?
3. RISK          — Does this respect concentration and regime limits?
4. THESIS        — Is there a documented thesis supporting this?
5. TIMING        — Does the trend and regime support action now?
6. SIZING        — Is the allocation appropriate for conviction and risk?
```

If any level fails, do not proceed to the next. The hierarchy is absolute.

### Behavioural Guardrails

| Temptation | Guardrail |
|-----------|-----------|
| "This stock is hot, I should buy it" | Does it pass eligibility? Is there a thesis? Is the regime supportive? |
| "I should sell everything, market is scary" | Follow the regime framework. One step at a time. No panic. |
| "I'll just make a small exception" | No exceptions. The system IS the discipline. |
| "I'll review next week instead" | Never skip. Even 5 minutes of notes maintains the habit. |
| "Returns are bad, methodology must be wrong" | Validate decision quality, not returns. Bear markets happen. |
| "This rejected asset is too good to miss" | Principles before returns. Always. No override for hard exclusions. |

---

## Appendix — Quick Reference Card

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
NÜR CAPITAL — MOCK PORTFOLIO QUICK REFERENCE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

POSITIONS:     4-10 assets (approved only)
CASH:          5-70% (regime-dependent)
MAX POSITION:  15% (Strong Bull) → 6% (Bear)
MAX THEME:     35%
MIN THEMES:    3 categories

REVIEWS:
  Weekly:      Monday, 30 min (full template)
  Mid-week:    Wednesday, 10 min (prices + alerts)
  Monthly:     Full portfolio review, 60 min
  Quarterly:   Deep retrospective, 120 min

SIGNALS:
  BUY    = Score >50, positive trend, acceptable risk
  HOLD   = Score 35-50, or decelerating
  REDUCE = Score <35, negative trend, elevated risk

REGIME RESPONSE:
  Change confirmed → Adjust cash within 1 week
  One step at a time → Never skip levels
  Cash adjusts by ~10% per step

THESIS RULES:
  Every position needs a thesis
  Theses expire after 12 months
  Invalidation → action within 7 days
  Review quarterly (minimum)

VALIDATION FOCUS:
  Decision quality > Returns
  Discipline > Performance
  Process > Outcome

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## Document Control

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | May 2025 | Nür Capital | Initial mock portfolio validation framework |

---

*End of document.*
