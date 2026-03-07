# NEXARA — Cost Pre-Revenue

**Version:** 1.0 (Model)  
**Audience:** Board, Investors, Finance  

This document estimates **costs before first revenue**: the period from start (or last funding) until first paying customers. No ARIA variable cost from customers; no support for payers. Focus is build, launch, and early go-to-market.

---

## 1. Scope of “Pre-Revenue”

- **Start:** Incorporation / start of build (or post–seed raise).
- **End:** First paying customer(s) and first MRR.
- **Typical length:** 6–18 months depending on team size and scope (prototype → production → first sales).

---

## 2. Cost Buckets (Pre-Revenue)

There is **no cost of revenue** (no ARIA usage from payers, no support for payers, no Stripe on customer payments). Only **operating expenses** and **minimal infra** for dev/staging.

**Developer rate (reference):** **$200–500/month** per developer. Used where R&D is expressed as dev cost.

| Category | What it includes | Typical monthly (USD) |
|----------|-------------------|------------------------|
| **R&D** | Engineering: 2–4 devs × $200–500 each; product/tools if any | $0.4K–2.5K |
| **S&M** | Founder or first sales/marketing (often part-time or 1 FTE), minimal ads, website, tools | $8K–25K |
| **G&A** | Legal (incorporation, cap table, terms), accounting, insurance, office/admin | $3K–12K |
| **Infra** | Hosting (staging/dev), dev tools, optional ARIA API for demos (low usage) | $0.5K–3K |
| **Total burn (monthly)** | | **~$12K–43K** |

**No COGS in this phase:** ARIA calls for demos or internal testing can be capped (e.g. &lt;$500/mo); no customer-driven ARIA or support.

---

## 3. Example Pre-Revenue Budget (12 months)

Assumes a **lean build** toward production launch and first customers by month 12. **Developer rate:** $200–500/month per developer. Example: 2–3 devs in first half, 3–4 in second half.

| Category | Months 1–6 ($K) | Months 7–12 ($K) | Full year ($K) |
|----------|-------------------|-------------------|----------------|
| **R&D** | 7 (2–3 devs × $200–500 × 6) | 12 (3–4 devs × $200–500 × 6) | 19 |
| **S&M** | 60 (founder + light tools) | 180 (1–2 sales/marketing ramp) | 240 |
| **G&A** | 36 | 72 | 108 |
| **Infra** | 6 | 12 | 18 |
| **Total** | **109** | **276** | **385** |

**Average burn:** ~$32K/month (year 1 pre-revenue).  
**If first revenue at month 12:** Pre-revenue **total cost ≈ $385K** (with $200–500/month dev rate).

---

## 4. Runway (Pre-Revenue)

| Opening cash | Monthly burn | Runway (months) |
|--------------|--------------|------------------|
| $100K | $15K | ~7 |
| $200K | $25K | ~8 |
| $400K | $32K | ~12 |
| $600K | $35K | ~17 |

**Runway** = Opening cash ÷ Monthly burn. Plan to raise or reach first revenue before runway runs out; buffer 2–3 months for slippage. *Burn assumes developer rate $200–500/month and lean S&M/G&A.*

---

## 5. What Changes at First Revenue

- **COGS appear:** ARIA (Anthropic) per customer, support allocation, infra share (see `COST_TO_SERVE_1_CUSTOMER.md`).
- **Stripe:** Payment processing on revenue.
- **Support:** Any committed support for early customers (can stay light until Scale/Agency).

Pre-revenue, **all cost is OPEX + minimal infra**; after first revenue, **cost of revenue** is added on a per-customer basis.

---

## 6. Summary for Board

- **Pre-revenue cost** = R&D + S&M + G&A + minimal infra; **no COGS** (no customer ARIA/support).
- **Developer rate:** **$200–500/month** per developer. Typical burn **~$12K–43K/month** depending on S&M/G&A; example **~$32K/month** for a 12-month path with 2–4 devs at this rate.
- **Example total pre-revenue (12 months):** **~$385K** (lean build, $200–500/month dev rate).
- **Runway:** Opening cash ÷ monthly burn; e.g. $400K at $32K burn ≈ 12 months. Plan raise or first revenue before runway ends.

Adjust team size, monthly rates, and timeline to match your plan; this is a model, not a forecast.
