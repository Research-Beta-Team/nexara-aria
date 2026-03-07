# NEXARA — Pricing, API Cost per Campaign & Profit Margins

**Version:** 1.0 (Prototype / Model)  
**Audience:** CTO, Finance, Board

---

## 1. Sell Pricing (from plans.js)

| Plan | Monthly (list) | Annual (effective/mo) | Credits included | Top-up (per 1k credits) |
|------|----------------|------------------------|------------------|-------------------------|
| **Starter** | $189 | $149 | 5,000 | $12 |
| **Growth** | $599 | $499 | 25,000 | $12 |
| **Scale** | $1,799 | $1,499 | 100,000 | $10 |
| **Agency** | $4,799 | $3,999 | 500,000 | $8 |

- Rollover: Starter/Growth 2× cap, Scale 3× cap, Agency no cap (use or lose in model).

---

## 2. NEXARA-Side API Cost (Model)

**Primary variable cost:** Anthropic (Claude) for ARIA.

- **Model:** claude-sonnet-4-20250514 (check current Anthropic pricing for input/output per 1M tokens).
- **Assumption (example):** $3 / 1M input, $15 / 1M output (replace with actual pricing).
- **Per ARIA request (example):** ~2k input + ~0.5k output → ~$0.0105 per request.  
- **Credit mapping (example):** 1 NEXARA credit = 1 ARIA request (or 100 tokens); define consistently for margin calc.

**Cost per campaign (example model):**

- Assume **50 ARIA requests** per campaign (create, strategy, plan, content drafts, analytics) → 50 × $0.0105 ≈ **$0.53** per campaign (NEXARA cost).
- If 1 credit = 1 request and 50 credits per campaign → **50 credits** consumed per campaign from NEXARA side.

Use your actual token counts and Anthropic pricing to replace the above.

---

## 3. Tier-Based Cost vs Sell

| Plan | Annual revenue (sell) | Credits included | Est. cost of credits (if bought at API cost) | Gross margin (before infra/support) |
|------|------------------------|-------------------|----------------------------------------------|-------------------------------------|
| Starter | $1,788 | 5,000 | ~$52.50 (5k × $0.0105) | High |
| Growth | $5,988 | 25,000 | ~$262.50 | High |
| Scale | $17,988 | 100,000 | ~$1,050 | High |
| Agency | $47,988 | 500,000 | ~$5,250 | High |

- **Note:** “Cost of credits” above assumes each credit ≈ 1 ARIA request at ~$0.0105. Real cost depends on token usage and Anthropic pricing.
- **Other costs:** Infrastructure, support (Scale/Agency: Slack, CSM), payment processing. Not included in table.

---

## 4. Profit Margin Calculation (Formula)

- **Revenue per plan:** `price.annual` or `price.monthly × 12`.
- **Variable cost per customer:**
  - **Credits:** `(credits_included + expected_top_up) × cost_per_credit`.  
    `cost_per_credit` = your cost per 1k tokens (or per request) from Anthropic.
  - **Support:** e.g. Scale = dedicated Slack + 1h SLA; Agency = dedicated CSM → allocate cost per seat.
- **Contribution margin:** Revenue − Variable cost (credits + support allocation).
- **Gross margin %:** (Revenue − COGS) / Revenue; COGS = credits + infra + support allocation.

**Example (Growth, annual):**

- Revenue: $5,988.
- Credits: 25,000 × $0.0105 = $262.50.
- Support: e.g. $50/customer (email, 4h SLA).
- Contribution: $5,988 − $262.50 − $50 = $5,675.50 → **~94.8%** before fixed costs.

---

## 5. Top-Up and Overage

- **Top-up price:** $8–12 per 1k credits (plan-dependent).
- **Your cost:** e.g. 1k credits ≈ 1k requests × $0.0105 = $10.50 (if margin negative at $12, adjust price or usage).
- **Margin on top-up:** (topUpPricePer1k − cost_per_1k_credits) / topUpPricePer1k.

---

## 6. Summary for Board

- **Sell pricing:** Four tiers, $149–$3,999/mo (annual).
- **NEXARA-side API cost:** Dominated by Anthropic; model as cost per request/token and apply to credits consumed per campaign and per plan.
- **Cost per campaign:** Example ~$0.53 per campaign (50 requests); calibrate with real usage and pricing.
- **Margins:** High contribution margin possible if credit cost is a small fraction of revenue; refine with actual token usage and support costs.
- **Sensitivity:** Track (1) actual token consumption per plan, (2) top-up take rate, (3) support cost per tier.
- **Cost to serve (20 customers):** See `docs/COST_TO_SERVE_20_CUSTOMERS.md` for production-ready total cost (ARIA, infra, support) and margin at scale.
