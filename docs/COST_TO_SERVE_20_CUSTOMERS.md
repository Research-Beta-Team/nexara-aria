# NEXARA — Total Cost to Serve 20 Customers (Production-Ready)

**Version:** 1.0 (Model)  
**Audience:** CTO, Finance, Board  
**Scope:** Production-ready NEXARA + ARIA for 20 paying customers.

---

## 1. Assumptions

### Customer mix (20 customers)

| Plan    | Customers | Revenue/customer/mo (annual) | Monthly revenue |
|---------|-----------|------------------------------|-----------------|
| Starter | 6         | $149                         | $894            |
| Growth  | 10        | $499                         | $4,990          |
| Scale   | 3         | $1,499                       | $4,497          |
| Agency  | 1         | $3,999                       | $3,999          |
| **Total** | **20**  | —                            | **$14,380**     |

**Annual revenue (20 customers):** ~$172,560.

### ARIA / credit usage

- **Cost per credit (NEXARA side):** ~$0.0105 per ARIA request (from Anthropic: ~2k input + ~0.5k output; adjust with actual pricing).
- **Utilization:** Assume customers use **60%** of included credits on average (40% headroom).
- **Credits per plan (included):** Starter 5k, Growth 25k, Scale 100k, Agency 500k.

### Production stack

- **Frontend:** SPA on Vercel/Netlify or same origin as API.
- **Backend:** API (Node/Python etc.), auth, ARIA proxy, campaign/content persistence.
- **Database:** Managed Postgres (e.g. Supabase, Neon, or cloud RDS).
- **Cache/queue:** Redis or equivalent if needed (optional at 20 customers).
- **Payments:** Stripe. **Auth:** Optional IdP (Auth0) or custom.
- **Monitoring:** Error tracking + basic APM/metrics.

---

## 2. Variable Costs (ARIA / Anthropic)

| Plan    | Customers | Credits included | 60% usage (credits/mo) | Cost per credit | Monthly ARIA cost |
|---------|-----------|------------------|-------------------------|-----------------|-------------------|
| Starter | 6         | 5,000            | 3,000                   | $0.0105         | 6 × $31.50 = $189 |
| Growth  | 10        | 25,000           | 15,000                  | $0.0105         | 10 × $157.50 = $1,575 |
| Scale   | 3         | 100,000          | 60,000                  | $0.0105         | 3 × $630 = $1,890 |
| Agency  | 1         | 500,000          | 300,000                 | $0.0105         | 1 × $3,150 = $3,150 |
| **Total** | **20**  | —                | —                       | —               | **$6,804**       |

**Variable (ARIA) total:** **~$6,800/month** at 60% utilization.  
If utilization is **40%**: ~$4,535/mo. If **80%**: ~$9,070/mo.

---

## 3. Fixed Costs (Infrastructure & Ops)

| Item | Monthly cost (USD) | Notes |
|------|--------------------|--------|
| **Hosting (backend + DB)** | $350–600 | 1–2 app instances + managed Postgres (small instance). |
| **Frontend (static)** | $0–50 | Vercel/Netlify free or low tier. |
| **Stripe** | ~$420 | ~2.9% + $0.30 on ~$14,380 revenue. |
| **Auth (optional IdP)** | $0–75 | Auth0 free tier or similar; or $0 if custom. |
| **Monitoring / errors** | $50–100 | Sentry + basic metrics (e.g. Datadog/Vercel Analytics). |
| **Email / transactional** | $20–50 | SendGrid or similar. |
| **Misc (domains, secrets, backup)** | $30–50 | — |
| **Subtotal infra** | **$870–1,345** | **~$1,100/mo** (midpoint). |

---

## 4. Support & Customer Success

| Plan    | Customers | Support type | Estimated allocation (monthly) |
|---------|-----------|--------------|--------------------------------|
| Starter | 6         | Community    | $0 (forums/docs) or $50 shared |
| Growth  | 10        | Email, 4h SLA| $400–600 (fractional FTE or tooling) |
| Scale   | 3         | Slack, 1h SLA| $600–900 (more hands-on) |
| Agency  | 1         | Dedicated CSM| $1,500–2,500 (partial FTE) |
| **Total support** | **20** | — | **$2,500–4,050** → **~$3,300/mo** (midpoint) |

Support can be blended (e.g. 0.3–0.5 FTE CSM + async) instead of full dedicated for one Agency customer.

---

## 5. Cost to Serve 1 Customer

Two views: **incremental** (adding one customer when the platform already exists) and **standalone** (only one customer in production).

### 5a. Incremental cost per customer (platform already running)

Assumes infra is shared; each new customer adds **ARIA + support allocation + fair share of infra** (e.g. 1/20 of ~$1,100 ≈ **$55/mo**).

| Plan    | ARIA (60% util.) | Support (allocation) | Infra share | **Total per customer/mo** |
|---------|-------------------|----------------------|-------------|----------------------------|
| Starter | ~$32              | $0–8                 | ~$55        | **~$87–95**                |
| Growth  | ~$158             | $40–60               | ~$55        | **~$253–273**              |
| Scale   | ~$630             | $200–300             | ~$55        | **~$885–985**              |
| Agency  | ~$3,150           | $1,500–2,500         | ~$55        | **~$4,705–5,705**          |

So **cost to serve 1 customer** (incremental) is **~$90/mo (Starter)** to **~$5,200/mo (Agency)** depending on plan.

### 5b. If you have only 1 customer (standalone)

You still need a minimal production stack. Infra is **~$500–800/mo** (small backend + DB + Stripe + monitoring) instead of shared across 20.

| Plan    | ARIA (60% util.) | Support           | Infra (solo) | **Total/mo**   |
|---------|-------------------|-------------------|--------------|----------------|
| Starter | ~$32              | $0–50             | ~$600        | **~$632–682**  |
| Growth  | ~$158             | $400–600          | ~$600        | **~$1,158–1,358** |
| Scale   | ~$630             | $600–900          | ~$600        | **~$1,830–2,130** |
| Agency  | ~$3,150           | $1,500–2,500      | ~$600        | **~$5,250–6,250** |

**One-sentence answer:** Cost to serve **1 customer** is **~$90–$5,200/month** incremental (by plan), or **~$630–$6,250/month** if that customer is the only one (standalone). ARIA is the main variable; support and infra dominate at Scale/Agency.

---

## 6. Total Cost to Serve (20 Customers — Monthly & Annual)

| Category | Monthly (USD) | Annual (USD) |
|----------|----------------|--------------|
| **Variable (ARIA)** | ~$6,800 | ~$81,600 |
| **Infrastructure** | ~$1,100 | ~$13,200 |
| **Support** | ~$3,300 | ~$39,600 |
| **Total** | **~$11,200** | **~$134,400** |

**Revenue (20 customers, assumed mix):** ~$14,380/mo → **~$172,560/year**.

**Gross margin (before G&A, sales, R&D):**  
Revenue − Cost to serve = $14,380 − $11,200 ≈ **$3,180/mo** (~22%) or **~$38,160/year**.

---

## 7. Sensitivity

- **ARIA utilization:** 40% → total variable ~$4,535/mo (total cost ~$8,935/mo). 80% → ~$9,070 variable (total ~$13,470/mo).
- **Support:** If Agency gets shared CSM (no dedicated), support can drop to ~$1,500–2,000/mo; total cost to serve ~$9,400–9,900/mo.
- **Infra:** Can be trimmed to ~$700–800/mo with a single region and minimal redundancy at 20 customers.

---

## 8. Summary for Board

- **Total cost to serve 20 production customers:** **~$11,200/month** (~$134,400/year) at assumed mix and 60% ARIA utilization.
- **Largest bucket:** ARIA (Anthropic) at **~$6,800/mo**; then support **~$3,300/mo**; then infra **~$1,100/mo**.
- **Revenue at this mix:** ~$14,380/mo (~$172,560/year); **gross margin ~22%** before company-level overhead.
- **Levers:** Reduce ARIA cost (usage caps, efficiency, or model mix); scale support with automation and tiered SLAs; keep infra lean until growth justifies more spend.

Replace Anthropic unit cost, utilization, and support assumptions with real data as you go live.
