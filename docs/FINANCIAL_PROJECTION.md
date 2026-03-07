# NEXARA — Financial Projection (Startup)

**Version:** 1.0 (Model)  
**Audience:** Board, Investors, Finance  
**Horizon:** 5 years (Year 1 = first full year post–production launch)

---

## 1. Executive Summary

| Metric | Y1 | Y2 | Y3 | Y4 | Y5 |
|--------|-----|-----|-----|-----|-----|
| **Payers (end of period)** | 80 | 220 | 480 | 820 | 1,200 |
| **ARR ($K)** | 860 | 2,640 | 6,720 | 12,400 | 19,200 |
| **Gross margin %** | 54% | 57% | 62% | 64% | 65% |
| **EBITDA ($K)** | (555) | (80) | 1,860 | 4,960 | 8,880 |
| **Operating cash flow ($K)** | (605) | (130) | 1,850 | 4,940 | 8,860 |

- **Path to profitability:** EBITDA-positive by Y3; margin improves as plan mix shifts to Growth/Scale and infra is absorbed.
- **Key drivers:** Customer growth and plan mix; ARIA utilization and unit cost; support and infra scaling; OPEX discipline.

---

## 2. Key Assumptions

### 2.1 Pricing (annual commitment, $/month)

| Plan | $/mo | ARR/customer |
|------|------|----------------|
| Starter | $149 | $1,788 |
| Growth | $499 | $5,988 |
| Scale | $1,499 | $17,988 |
| Agency | $3,999 | $47,988 |

### 2.2 Customer growth

- **Y1:** Launch; end with **80** paying customers (net adds ~6–8/mo by end of year).
- **Y2:** **220** payers (net ~12/mo average).
- **Y3:** **480** payers (net ~22/mo).
- **Y4:** **820** payers (net ~28/mo).
- **Y5:** **1,200** payers (net ~32/mo).

**Churn (monthly):** 2.5% in Y1–Y2; 2.0% in Y3; 1.5% in Y4–Y5 (improving retention and tier mix).

### 2.3 Plan mix (share of payers, %)

| Plan | Y1 | Y2 | Y3 | Y4 | Y5 |
|------|-----|-----|-----|-----|-----|
| Starter | 45% | 38% | 32% | 28% | 25% |
| Growth | 40% | 42% | 45% | 46% | 47% |
| Scale | 12% | 16% | 18% | 20% | 22% |
| Agency | 3% | 4% | 5% | 6% | 6% |

Mix shifts toward Growth and Scale as product and sales mature.

### 2.4 Cost of revenue (per customer, incremental)

From `COST_TO_SERVE_20_CUSTOMERS.md` (ARIA 60% utilization, support allocation, infra share):

| Plan | ARIA | Support | Infra share | Total/customer/mo |
|------|------|---------|-------------|--------------------|
| Starter | $32 | $8 | $55 | ~$95 |
| Growth | $158 | $50 | $55 | ~$263 |
| Scale | $630 | $250 | $55 | ~$935 |
| Agency | $3,150 | $2,000 | $55 | ~$5,205 |

**Infra scaling:** Base ~$1,100/mo up to ~50 customers; then ~$2,500 (100), ~$5,000 (250), ~$10,000 (500), ~$18,000 (1,200). Stripe ~2.9% + $0.30 on revenue.

### 2.5 Operating expenses (OPEX)

| Category | Y1 ($K) | Y2 ($K) | Y3 ($K) | Y4 ($K) | Y5 ($K) |
|----------|---------|---------|---------|---------|---------|
| **R&D** (engineering, product) | 520 | 720 | 960 | 1,200 | 1,440 |
| **S&M** (sales, marketing, CAC) | 380 | 680 | 1,080 | 1,400 | 1,720 |
| **G&A** (legal, finance, ops) | 120 | 180 | 280 | 380 | 480 |
| **Total OPEX** | 1,020 | 1,580 | 2,320 | 2,980 | 3,640 |

Assumes small team in Y1 (e.g. 4–5 eng, 1 product, 2 sales/marketing, 0.5 G&A) scaling up by Y5.

---

## 3. Revenue Projection

**ARPU (blended)** from plan mix and pricing:

| Year | Payers (EoP) | Starter % | Growth % | Scale % | Agency % | Blended ARPU/mo | ARR ($K) |
|------|----------------|------------|----------|---------|----------|----------------|----------|
| Y1 | 80 | 45% | 40% | 12% | 3% | ~$896 | ~860 |
| Y2 | 220 | 38% | 42% | 16% | 4% | ~$1,000 | ~2,640 |
| Y3 | 480 | 32% | 45% | 18% | 5% | ~$1,167 | ~6,720 |
| Y4 | 820 | 28% | 46% | 20% | 6% | ~$1,262 | ~12,400 |
| Y5 | 1,200 | 25% | 47% | 22% | 6% | ~$1,333 | ~19,200 |

*ARR = payers × 12 × blended ARPU (simplified; use monthly run rate × 12 for exact).*

**Revenue (annual, $K):**

| | Y1 | Y2 | Y3 | Y4 | Y5 |
|---|-----|-----|-----|-----|-----|
| **Revenue** | 860 | 2,640 | 6,720 | 12,400 | 19,200 |

---

## 4. Cost of Revenue (COGS)

| Component | Y1 ($K) | Y2 ($K) | Y3 ($K) | Y4 ($K) | Y5 ($K) |
|-----------|---------|---------|---------|---------|---------|
| **ARIA (Anthropic)** | 195 | 580 | 1,320 | 2,380 | 3,520 |
| **Support** | 145 | 420 | 900 | 1,520 | 2,280 |
| **Infra + Stripe** | 55 | 140 | 320 | 580 | 880 |
| **Total COGS** | 395 | 1,140 | 2,540 | 4,480 | 6,680 |
| **Gross margin %** | 54%* | 57% | 62% | 64% | 65% |

*Y1 gross margin before OPEX is high; infra is under-absorbed early. Table below uses same COGS for EBITDA.*

**Simplified gross margin (revenue − COGS):**

| | Y1 | Y2 | Y3 | Y4 | Y5 |
|---|-----|-----|-----|-----|-----|
| Revenue | 860 | 2,640 | 6,720 | 12,400 | 19,200 |
| COGS | 395 | 1,140 | 2,540 | 4,480 | 6,680 |
| **Gross profit** | 465 | 1,500 | 4,180 | 7,920 | 12,520 |
| **Gross margin %** | 54% | 57% | 62% | 64% | 65% |

---

## 5. P&L Summary

| Line | Y1 ($K) | Y2 ($K) | Y3 ($K) | Y4 ($K) | Y5 ($K) |
|------|---------|---------|---------|---------|---------|
| **Revenue** | 860 | 2,640 | 6,720 | 12,400 | 19,200 |
| **Cost of revenue** | (395) | (1,140) | (2,540) | (4,480) | (6,680) |
| **Gross profit** | 465 | 1,500 | 4,180 | 7,920 | 12,520 |
| **R&D** | (520) | (720) | (960) | (1,200) | (1,440) |
| **S&M** | (380) | (680) | (1,080) | (1,400) | (1,720) |
| **G&A** | (120) | (180) | (280) | (380) | (480) |
| **EBITDA** | **(555)** | **(80)** | **1,860** | **4,960** | **8,880** |

**Note:** Tune OPEX (R&D, S&M, G&A) to match your hiring and spend plan. More conservative OPEX in Y1–Y2 improves EBITDA and extends runway.

---

## 6. Unit Economics (Summary)

| Metric | Y1 | Y2 | Y3 | Y4 | Y5 |
|--------|-----|-----|-----|-----|-----|
| **Blended ARPU ($/mo)** | ~896 | ~1,000 | ~1,167 | ~1,262 | ~1,333 |
| **Cost to serve ($/payer/mo)** | ~411 | ~432 | ~441 | ~456 | ~464 |
| **Gross margin per payer ($/mo)** | ~485 | ~568 | ~726 | ~806 | ~869 |
| **CAC (assumed, $)** | 4,750 | 3,090 | 2,250 | 1,707 | 1,433 |
| **LTV (36-mo, gross)** | ~17,460 | ~20,448 | ~26,136 | ~29,016 | ~31,284 |
| **LTV:CAC** | 3.7x | 6.6x | 11.6x | 17.0x | 21.8x |

*CAC = S&M / new customers (net + churn replacement). LTV = gross margin per payer × 36 months (simplified).*

---

## 7. Cash and Runway

| | Y1 | Y2 | Y3 | Y4 | Y5 |
|---|-----|-----|-----|-----|-----|
| **EBITDA** | (555) | (80) | 1,860 | 4,960 | 8,880 |
| **CapEx (minimal)** | (20) | (30) | (50) | (80) | (100) |
| **Change in working capital** | (30) | (20) | 40 | 60 | 80 |
| **Operating cash flow** | **(605)** | **(130)** | **1,850** | **4,940** | **8,860** |

**Cumulative cash (assuming $1,200K opening cash, no new funding):**

| End of | Y1 | Y2 | Y3 | Y4 | Y5 |
|--------|-----|-----|-----|-----|-----|
| **Cash** | 595 | 465 | 2,315 | 7,255 | 16,115 |

- **Runway from $1.2M:** Through ~Y2 before needing more revenue or funding if OCF stays as above. EBITDA turns positive in Y3; cash builds thereafter.
- **If Y1–Y2 EBITDA is (680) and (420):** Cumulative cash at end Y2 ≈ $100K; **funding or cost cuts needed by mid–Y2.**

---

## 8. Sensitivity and Scenarios

| Scenario | Change | Y3 EBITDA impact (approx.) |
|----------|--------|-----------------------------|
| **Slower growth** | Payers 320 (not 480) | ~$800K lower profit |
| **Higher churn** | +1% monthly churn | ~$400K lower profit |
| **ARIA cost +20%** | Anthropic price or usage up | ~$260K lower profit |
| **Mix to more Growth** | +5% Growth, −5% Starter | ~$150K higher profit |
| **Faster Scale adoption** | +5% Scale, −5% Growth | ~$200K higher profit |

---

## 9. Summary for Board / Investors

- **Revenue:** 80 payers in Y1 → 1,200 in Y5; ARR from **$860K to $19.2M**. Plan mix shifts from Starter-heavy to Growth/Scale.
- **Cost to serve:** ARIA is the largest variable cost; support and infra scale with payers. Gross margin improves from ~54% to ~65% over the period.
- **Profitability:** EBITDA turns positive in **Y3** in the base case; cash flow turns positive in the same year. Y1–Y2 require funding or very lean OPEX.
- **Unit economics:** LTV:CAC improves as CAC drops and ARPU/margin rise with tier mix.
- **Risks:** Customer growth and churn; ARIA unit cost; OPEX timing. Use sensitivity to stress-test.

Replace growth rates, plan mix, OPEX, and ARIA cost with your own assumptions and update this document as you launch and collect data.
