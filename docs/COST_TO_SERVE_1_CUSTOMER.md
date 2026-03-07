# NEXARA — Cost to Serve 1 Customer

**Version:** 1.0  
**Audience:** CTO, Finance, Board  

This document summarizes the cost to serve **one customer** in two scenarios: when the platform already exists (incremental) and when that customer is the only one (standalone).

---

## Case 1: Incremental (platform already exists; you add one more customer)

When the platform is already running, each new customer adds **ARIA cost + support allocation + a fair share of infrastructure**. Infrastructure is shared (e.g. 1/20 of ~$1,100 ≈ **$55/mo** per customer at 20 customers).

| Plan    | Cost to serve 1 customer/month |
|---------|---------------------------------|
| **Starter** | ~$87–95 (ARIA ~$32 + support ~$0–8 + infra share ~$55) |
| **Growth**  | ~$253–273 (ARIA ~$158 + support ~$40–60 + infra share ~$55) |
| **Scale**   | ~$885–985 (ARIA ~$630 + support ~$200–300 + infra share ~$55) |
| **Agency**  | ~$4,705–5,705 (ARIA ~$3,150 + support ~$1,500–2,500 + infra share ~$55) |

**Summary:** Per customer (incremental): **~$90/mo (Starter)** to **~$5,200/mo (Agency)**.

---

## Case 2: Standalone (only one customer in production)

When that customer is the **only** one, you still need a minimal production stack. Infrastructure is **~$500–800/mo** for the whole stack (backend, DB, Stripe, monitoring) with no sharing.

| Plan    | Total cost to serve 1 customer/month |
|---------|--------------------------------------|
| **Starter** | ~$632–682  |
| **Growth**  | ~$1,158–1,358 |
| **Scale**   | ~$1,830–2,130 |
| **Agency**  | ~$5,250–6,250 |

**Summary:** If that one customer is the only one: **~$630–$6,250/mo** depending on plan.

---

## Short answer

- **Incremental (platform already running):** **~$90–$5,200/mo** per customer, by plan.
- **Standalone (only one customer):** **~$630–$6,250/mo** for that customer.

**ARIA** is the main variable cost; **support** drives most of the rest at Scale and Agency.

---

*Source: COST_TO_SERVE_20_CUSTOMERS.md. ARIA assumes 60% utilization of included credits; cost per credit ~$0.0105. Adjust with actual usage and Anthropic pricing.*
