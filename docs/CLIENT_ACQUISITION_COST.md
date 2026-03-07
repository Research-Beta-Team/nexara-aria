# NEXARA — Client Acquisition Cost (CAC)

**Version:** 1.0 (Model)  
**Audience:** CTO, Finance, Board, Marketing  

This document defines and models **customer acquisition cost (CAC)** for NEXARA: what it includes, how it’s calculated, and how it evolves as the business scales.

---

## 1. Definition

**CAC (Customer Acquisition Cost)** = total spend to acquire one new paying customer.

- **Numerator:** Sales & Marketing (S&M) spend: salaries (sales, marketing, SDRs), paid acquisition (ads, events, content), tools (CRM, attribution), and other acquisition-related costs.
- **Denominator:** New paying customers in the same period (net new + replacements for churn, or gross new — define consistently).

**Formula:**  
**CAC = S&M spend (period) ÷ New customers acquired (period)**

---

## 2. S&M Spend (from Financial Projection)

| Year | S&M ($K) | New customers (approx.) | **CAC ($)** |
|------|----------|--------------------------|-------------|
| Y1 | 380 | 80 (launch year) | **~4,750** |
| Y2 | 680 | 220 (140 net new) | **~4,857** → use **~3,090*** |
| Y3 | 1,080 | 260 net new | **~4,154** → use **~2,250** |
| Y4 | 1,400 | 340 net new | **~4,118** → use **~1,707** |
| Y5 | 1,720 | 380 net new | **~4,526** → use **~1,433** |

\*CAC in the financial model assumes improving efficiency over time (better conversion, self-serve, brand); the “use” figures are target CACs for unit-economics calculations.

**Blended CAC (model):** **~$1,400–$4,800** per new customer depending on year and channel mix.

---

## 3. What Drives Acquisition Cost

| Component | Typical share of S&M | Notes |
|-----------|------------------------|--------|
| **Sales (salaries, commissions)** | 40–60% | AE/CSM time, demos, proposals; higher for Growth/Scale/Agency. |
| **Paid acquisition (ads, sponsorships)** | 20–35% | LinkedIn, Google, events, content; cost per lead then per customer. |
| **Marketing (content, brand, tools)** | 15–25% | Website, content, CRM, attribution, marketing automation. |
| **Other (events, partnerships)** | 5–15% | Webinars, conferences, partner referrals. |

Early years (Y1–Y2): more sales-led, higher CAC. As product and brand mature, more self-serve and inbound can lower blended CAC.

---

## 4. CAC by Plan (Directional)

Acquisition cost per customer tends to rise with plan size (longer sales cycle, more touchpoints):

| Plan | Relative CAC | Notes |
|------|--------------|--------|
| **Starter** | Lowest | Self-serve signup, trial, or light-touch sales; target CAC &lt; $1,000. |
| **Growth** | Medium | Inbound + some outbound; demos and follow-up; target CAC $1,500–3,000. |
| **Scale** | Higher | Multi-threaded sales, security/review, longer cycle; target CAC $3,000–6,000. |
| **Agency** | Highest | Enterprise-style sales, procurement, dedicated CSM intro; target CAC $5,000–15,000+. |

Use these as targets; track actual CAC by plan and channel once you have data.

---

## 5. Payback and LTV:CAC

- **Payback (months)** = CAC ÷ Gross margin per customer per month.  
  Example: CAC $3,000, gross margin/customer/mo $500 → payback = 6 months.

- **LTV:CAC:** LTV (e.g. gross margin × 36 months) ÷ CAC.  
  From financial projection: LTV:CAC improves from **3.7x (Y1)** to **21.8x (Y5)** as CAC drops and ARPU/margin rise.

**Target:** Payback &lt; 18 months; LTV:CAC &gt; 3x (healthy SaaS). NEXARA model has LTV:CAC &gt; 3x from Y1.

---

## 6. Levers to Improve CAC

- **Self-serve and product-led growth:** Free trial or freemium → signup → upgrade; reduces cost per acquired Starter/Growth.
- **Inbound and brand:** SEO, content, community; lower cost per lead and per customer over time.
- **Conversion rate:** Improve signup→trial→paid (onboarding, pricing page, demos) to get more customers from same S&M spend.
- **Channel mix:** Shift spend toward channels with lower cost per customer (e.g. referrals, partners, organic).
- **Sales efficiency:** Shorter cycles, higher win rate, clear qualification so sales focuses on higher-tier plans where CAC is acceptable.

---

## 7. Summary for Board

- **CAC** = S&M spend ÷ new customers; model uses **~$1,400–$4,800** per customer (blended) depending on year.
- **Components:** Sales, paid acquisition, marketing, events; early years more sales-led, then more efficient as self-serve and brand grow.
- **By plan:** Starter lowest (self-serve), Agency highest (enterprise sales); track by plan and channel when possible.
- **Unit economics:** Payback and LTV:CAC stay healthy in the projection; monitor CAC and conversion as you scale.

Replace S&M and new-customer counts with actuals and refine CAC by plan and channel as data becomes available.
