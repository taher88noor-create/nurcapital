# Nür Capital — Investment Methodology Framework

**Version:** 1.0  
**Classification:** Internal — Source of Truth  
**Last Updated:** May 2025  

---

## Document Purpose

This document defines the intellectual and operational foundation of Nür Capital. It serves as the internal source of truth for asset eligibility, opportunity analysis, thematic investing, portfolio allocation, risk management, and explainability.

Every investment decision made within the Nür Capital system must be traceable to a principle, rule, or framework defined in this document.

---

## Table of Contents

1. [Nür Capital Principles](#section-1--nür-capital-principles)
2. [Eligibility Methodology](#section-2--eligibility-methodology)
3. [Thematic Investing Framework](#section-3--thematic-investing-framework)
4. [Opportunity Engine](#section-4--opportunity-engine)
5. [Market Regime Framework](#section-5--market-regime-framework)
6. [Risk Management Framework](#section-6--risk-management-framework)
7. [Portfolio Construction](#section-7--portfolio-construction)
8. [Explainability & Trust](#section-8--explainability--trust)

---

## Section 1 — Nür Capital Principles

### Investment Philosophy

Nür Capital exists to provide disciplined, principled, and transparent investment intelligence within an ethical framework. We believe that capital allocation should reflect values without sacrificing rigour.

### Core Principles

**1. Principles Before Returns**

Capital allocation must align with ethical boundaries. No asset enters the portfolio — regardless of financial attractiveness — unless it passes eligibility screening. Principles are non-negotiable.

**2. Excluded Assets Never Enter Ranking**

An asset that fails eligibility is permanently excluded from opportunity scoring, portfolio construction, and allocation. There is no override mechanism that bypasses hard exclusion rules.

**3. Explainability Over Complexity**

Every decision must be explainable in plain language. If a model, score, or allocation cannot be explained to a non-technical stakeholder, it is too complex. Simplicity and transparency are design constraints.

**4. Long-Term Structural Themes**

We invest in multi-year secular trends — not short-term momentum trades. Themes are selected for their structural durability, not their recent performance.

**5. Capital Preservation First**

Protecting capital takes priority over growing it. Defensive positioning, cash reserves, and concentration limits exist to survive adverse conditions, not to maximise upside.

**6. Discipline Over Speculation**

Systematic allocation rules replace emotional decision-making. Position sizing, rebalancing triggers, and regime-aware behaviour are codified — not discretionary.

**7. Transparency Builds Trust**

Every eligibility decision, every score, every allocation has a documented rationale. Stakeholders can audit any decision at any time. Opacity is a design failure.

**8. Patience Is an Edge**

We do not chase momentum or react to noise. Structural themes compound over years. The system is designed for quarterly review cycles, not daily trading.

---

## Section 2 — Eligibility Methodology

### Purpose

The Eligibility Engine determines whether an asset is permitted to enter the Nür Capital investment universe. It is a binary gate: an asset either passes or it does not. There is no partial compliance.

### Eligibility Statuses

| Status | Definition | Consequence |
|--------|-----------|-------------|
| **APPROVED** | Passes all hard exclusion rules and financial ratio thresholds | Eligible for theme classification, scoring, and portfolio allocation |
| **WATCHLIST** | One or more flags are under investigation or data is insufficient | Cannot be allocated capital. Monitored for future determination |
| **REJECTED** | Fails one or more hard exclusion rules | Permanently excluded from scoring and allocation. Retained for audit |

### Hard Exclusion Categories

These are binary pass/fail rules. A single flag triggers rejection.

| Category | Rule | Threshold |
|----------|------|-----------|
| **Gambling** | Revenue from betting, casinos, lotteries, or gambling platforms | Any material revenue (>5%) |
| **Alcohol** | Production or primary distribution of alcoholic beverages | Any material revenue (>5%) |
| **Interest-Based Finance** | Conventional banking, lending, or interest income | Interest income >5% of total revenue (AAOIFI standard) |
| **Weapons** | Manufacturing, sale, or distribution of weapons and military systems | Any involvement in weapons production |
| **Israel Exposure** | Headquartered in Israel, or significant operations/revenue from Israel | Any material presence (HQ, R&D centres, major contracts) |
| **Adult Industries** | Production or distribution of adult content or services | Any involvement |
| **Prohibited Structure** | Corporate structure incompatible with Sharia principles | Structural non-compliance |

### Approval Criteria

An asset is APPROVED when:
1. All seven hard exclusion flags return CLEAR
2. Financial ratios pass AAOIFI thresholds (debt/assets <33%, interest income <5%, illiquid assets >25%)
3. Confidence level is HIGH or MEDIUM with documented rationale
4. Review has been conducted within the last 90 days

### Watchlist Criteria

An asset is placed on WATCHLIST when:
1. One or more flags are under active investigation
2. Financial data is insufficient for determination (e.g., awaiting quarterly report)
3. A borderline ratio (between 4% and 6%) requires closer monitoring
4. Corporate restructuring may change eligibility status
5. Confidence level is LOW

### Rejection Criteria

An asset is REJECTED when:
1. Any single hard exclusion flag is FLAGGED with HIGH confidence
2. Financial ratios clearly exceed AAOIFI thresholds
3. The company's core business model is a prohibited activity

### Review Workflow

```
New Asset → Initial Screening → Flag Assessment → Ratio Analysis → Determination
                                                                        ↓
                                                          APPROVED / WATCHLIST / REJECTED
                                                                        ↓
                                                              Document Rationale
                                                                        ↓
                                                              Set Review Date
```

### Confidence Levels

| Level | Definition | Review Frequency |
|-------|-----------|-----------------|
| **HIGH** | Clear determination with strong evidence | Annual review |
| **MEDIUM** | Reasonable determination but some ambiguity | Quarterly review |
| **LOW** | Insufficient data or borderline case | Monthly monitoring |

### Explainability Requirements

Every eligibility decision must include:
1. Which flags were assessed and their results
2. Which specific rule triggered rejection (if applicable)
3. Source of information for the determination
4. Analyst notes providing context
5. Date of review and next review date

---

## Section 3 — Thematic Investing Framework

### Philosophy

Nür Capital invests through the lens of long-term structural themes. Themes represent multi-year secular trends driven by technology shifts, demographic changes, policy tailwinds, or structural economic transformation.

We do not chase short-term sector rotation. We identify durable themes and allocate to the highest-quality approved assets within those themes.

### Theme Catalogue

---

#### Semiconductors

**Why it matters:** Semiconductors are the foundation of every digital system. Demand is structurally growing as AI, EVs, IoT, and cloud computing require exponentially more compute.

**Macro drivers:** AI training demand, automotive electrification, data centre buildout, geopolitical reshoring (CHIPS Act, EU Chips Act)

**Long-term rationale:** Chip demand grows faster than GDP. Supply is concentrated in few players. Barriers to entry are extreme ($20B+ for a leading-edge fab).

**Key risks:** Cyclicality, geopolitical tension (Taiwan), inventory corrections, customer concentration

**Market sensitivity:** High beta to tech spending cycles. Sensitive to interest rates via growth stock valuations.

---

#### AI Infrastructure

**Why it matters:** Artificial intelligence requires massive infrastructure — compute, networking, storage, and software platforms. This is a generational buildout.

**Macro drivers:** Enterprise AI adoption, cloud hyperscaler capex, model scaling laws, inference demand growth

**Long-term rationale:** AI infrastructure spend is in early innings. Every industry will require AI compute. The picks-and-shovels layer captures value regardless of which AI applications win.

**Key risks:** Overinvestment cycles, commoditisation of inference, regulatory intervention, energy constraints

**Market sensitivity:** Correlated with tech capex cycles. Sensitive to hyperscaler earnings guidance.

---

#### Battery Technology

**Why it matters:** Batteries are the enabling technology for electric vehicles, grid storage, and renewable energy integration. The energy transition depends on battery cost and performance curves.

**Macro drivers:** EV adoption mandates, grid storage requirements, raw material supply chains, solid-state R&D

**Long-term rationale:** Battery demand grows 5-10x by 2035. Cost curves continue declining. Vertical integration creates moats.

**Key risks:** Raw material price volatility (lithium, cobalt), technology disruption (solid-state), China supply chain concentration, overcapacity

**Market sensitivity:** Sensitive to EV sales data, commodity prices, and government subsidy policies.

---

#### Halal Finance

**Why it matters:** The global Islamic finance market exceeds $3 trillion. Sharia-compliant investment products serve a growing Muslim population seeking ethical financial services.

**Macro drivers:** Muslim population growth (1.8B+), rising middle class in Muslim-majority countries, institutional demand for Sharia-compliant products

**Long-term rationale:** Structural underserving of Muslim investors. Growing awareness and demand for compliant products. Regulatory support in GCC, Malaysia, and Indonesia.

**Key risks:** Limited product diversity, higher expense ratios, tracking error vs conventional benchmarks, regulatory fragmentation

**Market sensitivity:** Correlated with broad equity markets but with sector exclusions creating tracking differences.

---

#### Islamic Banking

**Why it matters:** Islamic banks operate without interest (riba), using profit-sharing and asset-backed structures. They represent the purest form of Sharia-compliant financial services.

**Macro drivers:** GCC economic diversification, fintech innovation in Islamic finance, regulatory frameworks maturing, sukuk market growth

**Long-term rationale:** Islamic banking assets growing at 10-12% annually. Underpenetrated in many Muslim-majority markets. Digital transformation creating new distribution.

**Key risks:** Concentration in GCC economies, oil price sensitivity, regulatory differences across jurisdictions, competition from conventional banks offering Islamic windows

**Market sensitivity:** Sensitive to GCC economic health, oil prices, and regional geopolitics.

---

#### Clean Energy

**Why it matters:** The global energy transition from fossil fuels to renewables is a multi-decade structural shift driven by climate policy, economics, and energy security.

**Macro drivers:** Net-zero commitments, declining solar/wind costs, grid modernisation, energy security post-Ukraine, IRA/EU Green Deal subsidies

**Long-term rationale:** Renewables are now cheapest new-build generation in most markets. Policy support is bipartisan (energy security framing). Electrification of transport and heating expands addressable market.

**Key risks:** Interest rate sensitivity (capital-intensive), policy reversal risk, grid integration challenges, supply chain bottlenecks, intermittency

**Market sensitivity:** Highly sensitive to interest rates, government policy, and utility regulation.

---

#### Oil & Gas

**Why it matters:** Hydrocarbons remain essential to global energy supply and will for decades. Well-managed oil companies generate strong cash flows that fund dividends and energy transition investments.

**Macro drivers:** Supply discipline (OPEC+), underinvestment in new supply, petrochemical demand growth, energy security

**Long-term rationale:** Peak oil demand is decades away. Supply underinvestment creates structural tightness. Cash flow generation funds shareholder returns.

**Key risks:** Demand destruction from EVs, carbon regulation, stranded asset risk, geopolitical supply disruption, ESG-driven capital flight

**Market sensitivity:** Directly correlated with oil prices. Sensitive to OPEC decisions and geopolitical events.

---

#### Energy Infrastructure

**Why it matters:** The energy transition requires massive grid buildout, transmission upgrades, and storage deployment. Infrastructure is the bottleneck.

**Macro drivers:** Grid modernisation, renewable interconnection, EV charging networks, hydrogen infrastructure, LNG terminals

**Long-term rationale:** Decades of underinvestment in grids. Electrification requires 2-3x current grid capacity. Regulated returns provide visibility.

**Key risks:** Regulatory risk, permitting delays, interest rate sensitivity, construction cost inflation, NIMBY opposition

**Market sensitivity:** Defensive/utility-like. Sensitive to interest rates and regulatory decisions.

---

#### Healthcare

**Why it matters:** Healthcare spending grows structurally with aging populations, innovation in biologics, and expanding access in emerging markets.

**Macro drivers:** Aging demographics, GLP-1 revolution, gene therapy, AI drug discovery, emerging market healthcare access

**Long-term rationale:** Healthcare spend as % of GDP rises structurally. Innovation cycles (GLP-1, cell therapy, AI) create new multi-billion dollar markets.

**Key risks:** Drug pricing regulation, patent cliffs, clinical trial failures, reimbursement pressure, political risk

**Market sensitivity:** Defensive sector. Less correlated with economic cycles. Sensitive to regulatory/political headlines.

---

#### Industrial Automation

**Why it matters:** Labour shortages, reshoring, and productivity demands drive adoption of automation, robotics, and smart manufacturing across all industries.

**Macro drivers:** Labour cost inflation, reshoring/nearshoring, Industry 4.0, quality requirements, safety regulations

**Long-term rationale:** Automation penetration is still low globally (<10% of addressable tasks). Labour demographics worsen in developed markets. ROI payback periods are shortening.

**Key risks:** Capex cyclicality, integration complexity, SME adoption barriers, China competition in low-end automation

**Market sensitivity:** Cyclical with manufacturing PMI. Sensitive to capex spending intentions.

---

#### Robotics

**Why it matters:** Robotics extends automation into unstructured environments — warehouses, surgery, agriculture, construction. AI enables a step-change in capability.

**Macro drivers:** AI-enabled perception, labour shortages in logistics/agriculture, surgical robotics adoption, autonomous vehicles

**Long-term rationale:** AI transforms robots from programmed machines to adaptive systems. Addressable market expands from factories to services, healthcare, and consumer.

**Key risks:** Technology maturity gaps, regulatory barriers (autonomous systems), high unit costs, customer ROI uncertainty

**Market sensitivity:** Growth/venture-like risk profile. Sensitive to tech sentiment and AI narrative.

---

#### Cybersecurity

**Why it matters:** Digital transformation expands attack surfaces. Cybersecurity spend is non-discretionary and grows regardless of economic conditions.

**Macro drivers:** Ransomware epidemic, regulatory compliance (GDPR, NIS2), cloud migration, AI-powered threats, zero-trust adoption

**Long-term rationale:** Cybersecurity is a permanent cost of digital operations. Spend grows faster than IT budgets. Platform consolidation creates winners.

**Key risks:** Vendor fatigue, commoditisation of point solutions, talent shortage limiting growth, government-funded alternatives

**Market sensitivity:** Defensive within tech. Less cyclical than enterprise software. Sensitive to breach headlines (positive catalyst).

---

#### Manufacturing

**Why it matters:** Global supply chain restructuring (reshoring, friend-shoring) drives investment in domestic manufacturing capacity across developed markets.

**Macro drivers:** Supply chain resilience, CHIPS Act/IRA incentives, national security concerns, automation of production

**Long-term rationale:** Decades of offshoring are partially reversing. Government incentives create multi-year capex cycles. Advanced manufacturing requires sophisticated equipment.

**Key risks:** Labour availability, energy costs, trade policy reversal, overcapacity in subsidised sectors

**Market sensitivity:** Cyclical with industrial production. Sensitive to trade policy and PMI data.

---

#### Logistics

**Why it matters:** E-commerce growth, supply chain complexity, and just-in-time pressures drive demand for efficient logistics infrastructure and technology.

**Macro drivers:** E-commerce penetration, same-day delivery expectations, cold chain growth, autonomous delivery, warehouse automation

**Long-term rationale:** Global trade volumes grow with GDP. E-commerce shifts logistics from B2B to B2C complexity. Technology adoption is early.

**Key risks:** Fuel cost volatility, labour disputes, overcapacity in shipping, regulatory (emissions), economic sensitivity

**Market sensitivity:** Cyclical with trade volumes. Sensitive to consumer spending and fuel prices.

---

## Section 4 — Opportunity Engine

### Purpose

The Opportunity Engine identifies the most attractive approved assets for capital allocation. Only assets with APPROVED eligibility status enter this stage. Rejected and watchlisted assets are never scored.

### Scoring Philosophy

The Opportunity Engine is **systematic investment intelligence** — not predictive AI trading. It does not predict future prices. It identifies assets with favourable structural positioning, positive trend alignment, and acceptable risk characteristics.

The system answers: "Among our approved assets, which ones have the strongest combination of theme strength, trend, momentum, and risk-adjusted positioning right now?"

### Scoring Factors

| Factor | Weight | Description |
|--------|--------|-------------|
| Theme Strength | 20% | Is the asset's primary theme in a favourable macro environment? |
| Trend Score | 25% | Is price above key moving averages? Is the trend positive? |
| Momentum Score | 20% | Is the rate of change accelerating? Recent relative strength? |
| Regime Alignment | 15% | Does the current market regime favour this asset's characteristics? |
| Risk-Adjusted Quality | 20% | Lower volatility and drawdown risk improve the score |

### Scoring Scale

| Score Range | Interpretation | Typical Action |
|-------------|---------------|----------------|
| 70-100 | Highly attractive | Strong BUY candidate |
| 50-69 | Attractive | BUY or increase position |
| 35-49 | Neutral | HOLD current position |
| 20-34 | Unattractive | REDUCE or trim position |
| 0-19 | Weak | Exit or do not allocate |

### Ranking Logic

1. Calculate composite score for each approved asset
2. Rank assets by composite score (descending)
3. Apply regime-aware adjustments (e.g., reduce growth scores in bear markets)
4. Apply concentration checks (no single asset >15% of portfolio)
5. Generate suggested action (BUY / HOLD / REDUCE / WATCHLIST)

### Explainability Requirements

Every score must be decomposable:
- "TSM scores 62.4 because: theme strength (Semiconductors in AI supercycle) = 85, trend (above MA50 and MA200) = 72, momentum (positive and accelerating) = 58, regime (bullish favours growth) = 70, risk-adjusted (moderate volatility) = 55"

### Defensive Positioning Rules

- If overall market regime is BEAR or CRISIS: reduce all scores by 20%
- If volatility regime is HIGH: cap maximum allocation at 8% per position
- If an asset's trend score is negative: it cannot receive a BUY signal regardless of other factors
- Cash allocation increases automatically in defensive regimes

### Important Constraints

- The engine does NOT generate trade orders
- The engine does NOT predict future prices
- The engine does NOT use leverage or derivatives
- The engine provides intelligence for human decision-making
- All outputs are suggestions, not instructions

---

## Section 5 — Market Regime Framework

### Purpose

Market regimes define the macro environment in which the portfolio operates. The regime determines allocation posture, risk tolerance, cash positioning, and theme preferences. The system adapts behaviour to conditions — it does not fight the market.

### Regime Definitions

---

#### Strong Bull Market

**Characteristics:** Broad market uptrend. Major indices above MA50 and MA200. Breadth expanding. Volatility low and declining. Risk appetite high.

| Parameter | Posture |
|-----------|---------|
| Equity allocation | 85-95% |
| Cash reserve | 5-15% |
| Risk tolerance | High |
| Position sizing | Full positions (up to 15%) |
| Theme preference | Growth themes (Semiconductors, AI, Robotics) |
| Rebalancing | Quarterly |

---

#### Weak Bull Market

**Characteristics:** Market trending up but with narrowing breadth. Leadership concentrated. Volatility low but rising. Late-cycle indicators appearing.

| Parameter | Posture |
|-----------|---------|
| Equity allocation | 70-85% |
| Cash reserve | 15-30% |
| Risk tolerance | Moderate-High |
| Position sizing | Standard positions (up to 12%) |
| Theme preference | Quality growth + defensive themes |
| Rebalancing | Monthly review |

---

#### Sideways Market

**Characteristics:** Range-bound price action. No clear trend. Mixed signals. Sector rotation without directional conviction.

| Parameter | Posture |
|-----------|---------|
| Equity allocation | 60-75% |
| Cash reserve | 25-40% |
| Risk tolerance | Moderate |
| Position sizing | Reduced positions (up to 10%) |
| Theme preference | Defensive themes (Healthcare, Infrastructure, Halal Finance) |
| Rebalancing | Monthly |

---

#### High Volatility Market

**Characteristics:** Elevated VIX (>25). Sharp intraday swings. Uncertainty-driven. May be trending or range-bound but with extreme moves.

| Parameter | Posture |
|-----------|---------|
| Equity allocation | 50-70% |
| Cash reserve | 30-50% |
| Risk tolerance | Low-Moderate |
| Position sizing | Reduced positions (up to 8%) |
| Theme preference | Low-beta themes (Islamic Banking, Energy Infrastructure, Consumer Staples) |
| Rebalancing | Bi-weekly review |

---

#### Bear Market

**Characteristics:** Major indices below MA200. Sustained downtrend. Breadth deteriorating. Risk-off sentiment dominant. Credit spreads widening.

| Parameter | Posture |
|-----------|---------|
| Equity allocation | 40-60% |
| Cash reserve | 40-60% |
| Risk tolerance | Low |
| Position sizing | Minimal positions (up to 6%) |
| Theme preference | Defensive only (Healthcare, Islamic Banking, Oil & Gas dividends) |
| Rebalancing | Weekly monitoring |

---

#### Crisis / Defensive Market

**Characteristics:** Systemic stress. Correlation spike (everything sells). Liquidity deterioration. Flight to safety. Potential for permanent capital loss.

| Parameter | Posture |
|-----------|---------|
| Equity allocation | 20-40% |
| Cash reserve | 60-80% |
| Risk tolerance | Minimal |
| Position sizing | Survival positions only (up to 4%) |
| Theme preference | Cash, sukuk, defensive dividend payers only |
| Rebalancing | Daily monitoring, no new positions |

---

### Regime Detection Signals

| Signal | Bullish | Bearish |
|--------|---------|---------|
| Price vs MA200 | Above | Below |
| MA50 vs MA200 | Golden cross | Death cross |
| Market breadth | >60% above MA200 | <40% above MA200 |
| VIX level | <18 | >30 |
| Credit spreads | Tightening | Widening |
| Sector leadership | Growth leading | Defensives leading |

### Regime Transition Rules

- Regime changes require **confirmation over 2 consecutive weeks** (no single-day reactions)
- Transitions are gradual: move one regime level at a time (Bull → Weak Bull → Sideways, not Bull → Crisis)
- Cash allocation adjusts by 10% per regime step
- Position sizing caps reduce by 2-3% per regime step downward

---

## Section 6 — Risk Management Framework

### Philosophy

Risk management at Nür Capital is not about avoiding risk — it is about understanding, sizing, and surviving risk. Capital preservation is the first priority. Growth is the second.

The system is designed to survive the worst case, not optimise for the best case.

### Core Risk Principles

**1. Never risk what you cannot afford to lose**

Maximum portfolio drawdown tolerance: 25%. If the system approaches this threshold, it shifts to Crisis/Defensive posture automatically.

**2. Concentration kills**

No single position, theme, or geography should represent an existential risk to the portfolio.

**3. Volatility is information, not danger**

High volatility signals uncertainty. The system responds by reducing position sizes — not by panic selling.

**4. Cash is a position**

Holding cash is an active allocation decision. In uncertain regimes, cash is the highest-conviction position.

**5. Diversification is mandatory**

Diversification across themes, geographies, and asset types is a structural requirement — not a suggestion.

### Concentration Limits

| Dimension | Maximum | Rationale |
|-----------|---------|-----------|
| Single position | 15% | No single asset can dominate the portfolio |
| Single theme | 35% | Thematic conviction has limits |
| Single country | 40% | Geographic diversification required |
| Single sector | 40% | Sector concentration creates fragility |
| Top 3 positions | 40% | Prevents top-heavy portfolios |

### Cash Reserve Philosophy

| Market Regime | Minimum Cash | Target Cash |
|---------------|-------------|-------------|
| Strong Bull | 5% | 10% |
| Weak Bull | 15% | 20% |
| Sideways | 25% | 30% |
| High Volatility | 30% | 40% |
| Bear | 40% | 50% |
| Crisis | 60% | 70% |

Cash reserves serve three purposes:
1. **Survival buffer** — Absorb drawdowns without forced selling
2. **Opportunity reserve** — Deploy into dislocations at attractive prices
3. **Psychological anchor** — Reduces pressure to act during uncertainty

### Position Sizing Philosophy

Position size is determined by:
1. **Conviction** (opportunity score) — Higher score = larger position
2. **Volatility** (risk rating) — Higher volatility = smaller position
3. **Regime** (market conditions) — Defensive regime = smaller positions
4. **Concentration** (existing exposure) — Approaching limits = no increase

Formula concept:
```
Position Size = Base Allocation × Conviction Multiplier × Volatility Discount × Regime Cap
```

### Defensive Allocation Behaviour

When the system detects deteriorating conditions:
1. Stop adding to positions (no new BUY signals)
2. Reduce highest-volatility positions first
3. Increase cash allocation by 10% per regime step down
4. Shift theme preference toward defensive (Healthcare, Islamic Banking, Infrastructure)
5. Tighten stop-loss monitoring (not automated — flagged for review)

### Rebalancing Philosophy

| Trigger | Action |
|---------|--------|
| Position exceeds max allocation by >3% | Trim to target |
| Position drops below minimum threshold | Review: add or exit |
| Theme exceeds concentration limit | Redistribute within theme |
| Regime change confirmed | Adjust all positions to new regime caps |
| Quarterly calendar | Full portfolio review regardless of triggers |

### Risk Metrics Tracked

| Metric | Description | Alert Threshold |
|--------|-------------|-----------------|
| Portfolio volatility | Annualised standard deviation | >20% |
| Maximum drawdown | Peak-to-trough decline | >15% |
| Concentration (HHI) | Herfindahl-Hirschman Index | >0.15 |
| Beta to benchmark | Sensitivity to broad market | >1.3 |
| Theme correlation | Cross-theme return correlation | >0.7 |

---

## Section 7 — Portfolio Construction

### Purpose

Portfolio construction translates opportunity scores, risk limits, and regime awareness into a concrete allocation. The output is a set of positions with target weights, signals, and rationale.

### Construction Rules

1. **Only APPROVED assets may receive capital allocation**
2. **Thematic diversification is mandatory** — minimum 3 themes represented
3. **Concentration limits are hard constraints** — never exceeded regardless of conviction
4. **Cash reserve is sized to regime** — never below minimum for current regime
5. **Total allocation must equal 100%** (equity positions + cash)

### Portfolio Signals

| Signal | Definition | Action |
|--------|-----------|--------|
| **BUY** | Asset scores >50, positive trend, acceptable risk | Initiate or increase position to target weight |
| **HOLD** | Asset scores 35-50, or positive but decelerating | Maintain current position. No changes |
| **REDUCE** | Asset scores <35, negative trend, or elevated risk | Trim position by 30-50%. Reallocate to cash |
| **WATCHLIST** | Approved but not yet suitable for allocation | Monitor. Do not allocate capital |

### Construction Process

```
1. Start with approved asset universe
2. Score all assets via Opportunity Engine
3. Determine current market regime
4. Apply regime-appropriate allocation caps
5. Rank assets by score (descending)
6. Allocate top-ranked assets up to concentration limits
7. Ensure thematic diversification minimums
8. Size cash reserve to regime requirement
9. Verify total = 100%
10. Generate signals and rationale for each position
```

### Example Portfolio (Balanced Regime)

| Asset | Theme | Score | Signal | Allocation | Rationale |
|-------|-------|-------|--------|-----------|-----------|
| TSM | Semiconductors | 62.4 | BUY | 12% | Leading foundry, AI tailwinds, bullish trend |
| ASML | Semiconductors | 55.8 | BUY | 10% | EUV monopoly, secular demand |
| CRWD | Cybersecurity | 58.2 | BUY | 7% | Non-discretionary spend, platform consolidation |
| LLY | Healthcare | 55.0 | BUY | 8% | GLP-1 leader, strong pipeline |
| HLAL | Halal Finance | 48.2 | HOLD | 15% | Core Sharia-compliant diversification |
| ABB | Industrial Automation | 45.5 | HOLD | 6% | Defensive industrial, automation secular trend |
| 2222.SR | Oil & Gas | 42.0 | HOLD | 8% | Dividend anchor, energy security |
| 1211.HK | Battery Technology | 41.6 | HOLD | 5% | EV leader, higher risk accepted at small size |
| NOVO-B | Healthcare | 38.5 | HOLD | 5% | GLP-1 correction, fundamentals intact |
| *Cash* | — | — | — | 24% | Regime-appropriate reserve |
| **Total** | | | | **100%** | |

### Allocation Bands

| Category | Minimum | Target | Maximum |
|----------|---------|--------|---------|
| Core holdings (HLAL, Islamic banks) | 15% | 25% | 35% |
| Growth themes (Semis, AI, Cyber) | 20% | 35% | 50% |
| Defensive themes (Healthcare, Energy) | 10% | 20% | 30% |
| Cash reserve | 5% | 20% | 70% |

### Rebalancing Triggers

- Any position deviates >3% from target
- Market regime changes (confirmed over 2 weeks)
- Quarterly calendar review
- Eligibility status change (asset moves to REJECTED → immediate exit)
- New high-conviction opportunity enters universe

---

## Section 8 — Explainability & Trust

### Philosophy

Nür Capital operates on the principle that **every decision must be explainable**. If a stakeholder asks "why?" at any point in the system, there must be a clear, documented, traceable answer.

Explainability is not a feature — it is a design constraint. Complexity that cannot be explained is complexity that must be removed.

### Explainability Standards

#### Eligibility Decisions

Every eligibility determination must answer:
- **What was assessed?** — List of flags checked and their results
- **What triggered the decision?** — Specific rule or threshold that determined the outcome
- **What is the evidence?** — Source of information (annual report, news, regulatory filing)
- **How confident are we?** — HIGH / MEDIUM / LOW with justification
- **When was this reviewed?** — Date and next review date

Example:
> "NVDA is REJECTED because flag_israel_exposure = FLAGGED. Evidence: NVIDIA acquired Mellanox Technologies (Israel-based) in 2020 for $7B. Mellanox operations continue in Israel with 3,000+ employees. This constitutes significant Israel operations. Confidence: HIGH. Reviewed: 2025-05-20. Next review: 2025-08-20."

#### Opportunity Scores

Every score must be decomposable into its factors:
- **What is the score?** — Composite number and rank
- **What drives it?** — Breakdown by factor (theme, trend, momentum, regime, risk)
- **What would change it?** — Conditions that would improve or worsen the score
- **What is the signal?** — BUY / HOLD / REDUCE and why

Example:
> "TSM scores 62.4 (rank #1). Drivers: Theme strength 85 (Semiconductors in AI supercycle), Trend 72 (above MA50 and MA200), Momentum 58 (positive and accelerating), Regime alignment 70 (bullish favours growth), Risk-adjusted 55 (moderate volatility accepted). Signal: BUY at 12% allocation. Score would improve if momentum accelerates or volatility declines."

#### Portfolio Allocation

Every allocation must explain:
- **Why this asset?** — Score, theme, and strategic rationale
- **Why this size?** — Conviction level, risk constraints, concentration limits
- **Why now?** — Regime conditions, trend alignment, entry timing
- **What are the risks?** — Key risks accepted at this allocation

#### Risk Posture Changes

Every regime or risk adjustment must explain:
- **What changed?** — Specific signals that triggered the adjustment
- **What is the new posture?** — Updated regime, cash target, position caps
- **What actions follow?** — Specific positions to trim, add, or hold
- **When do we reassess?** — Next review date or reversal conditions

### Trust Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    TRUST LAYER                                │
├─────────────────────────────────────────────────────────────┤
│  Every decision has:                                         │
│  ✓ A documented rationale                                    │
│  ✓ A traceable rule or principle                             │
│  ✓ A confidence level                                        │
│  ✓ A review date                                             │
│  ✓ An audit trail                                            │
│  ✓ A plain-language explanation                              │
└─────────────────────────────────────────────────────────────┘
```

### Audit Requirements

1. **Eligibility audit:** Any stakeholder can request the full screening history of any asset
2. **Score audit:** Any stakeholder can request the factor decomposition of any score
3. **Allocation audit:** Any stakeholder can request the rationale for any position size
4. **Regime audit:** Any stakeholder can request the signals that determined current regime
5. **Historical audit:** All decisions are timestamped and retained indefinitely

### What Nür Capital Does NOT Do

To maintain trust, it is equally important to be clear about limitations:

- We do NOT predict future prices
- We do NOT guarantee returns
- We do NOT provide personal financial advice
- We do NOT execute trades automatically
- We do NOT use leverage or derivatives
- We do NOT engage in short selling
- We do NOT provide tax or legal advice

The system provides **investment intelligence** — structured, principled, explainable information to support human decision-making.

---

## Document Control

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | May 2025 | Nür Capital | Initial methodology framework |

---

*End of document.*
