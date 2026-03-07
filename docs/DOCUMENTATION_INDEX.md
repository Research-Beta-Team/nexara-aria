# NEXARA — Documentation Index

**For CTO and Board of Directors**

This index lists all board- and CTO-oriented documentation. Use it to navigate to the right file for technical, product, or financial review.

---

## Root: `docs/`

| Document | Audience | Description |
|----------|----------|-------------|
| **TECHNICAL_DOCUMENTATION.md** | Engineering, CTO | Tech stack, project structure, state, routing, plan/credits, ARIA, roles, conventions. |
| **PROJECT_ARCHITECTURE.md** | CTO, Engineering | High-level architecture, layers, data flow, deployment, future backend. |
| **WORKFLOW_TUTORIAL.md** | Non-technical, CS, Board | Step-by-step: signup, onboarding, first campaign with ARIA, dashboard, ARIA panel, plans. |
| **API_DOCUMENTATION.md** | Engineering, Partners | ARIA tools (12), intended REST API, rate limits, Webhooks. |
| **FEATURES_AND_USER_INTERACTION.md** | Product, CS, Board | Features by plan, limits table, user roles and how they interact (sidebar, ARIA, access). |
| **WORKFLOW_EXECUTION.md** | Product, Engineering, Board | How workflows run: onboarding, campaign creation (wizard + ARIA), content approval, ARIA execution, billing, roles. |
| **PRICING_AND_MARGINS.md** | CTO, Finance, Board | Sell pricing, NEXARA-side API cost per campaign, tier cost vs sell, profit margin calculation. |
| **WORKFLOW_EXAMPLES_HUMAN_NEXARA_ARIA.md** | Non-technical, CS, Board | Role-by-role examples: Human + NEXARA + ARIA workflows and answers; how the platform helps each role. |
| **USAGE_ANALYTICS_AND_COSTING_NON_TECHNICAL.md** | Customers, CS, Non-technical | Usage = credits; what you see in-app; how usage becomes cost; cost per action; how to talk to customers. |
| **ARIA_COST_PER_WORD.md** | Customers, CS, Finance | ARIA cost in words: input/output cost per 1,000 words, examples, quick reference (underlying model cost). |
| **COST_TO_SERVE_20_CUSTOMERS.md** | CTO, Finance, Board | Total cost to serve 20 production customers (ARIA, infra, support); monthly/annual and margin. |
| **COST_TO_SERVE_1_CUSTOMER.md** | CTO, Finance, Board | Cost to serve 1 customer: incremental (platform exists) vs standalone (only one customer); by plan. |
| **CLIENT_ACQUISITION_COST.md** | CTO, Finance, Board, Marketing | CAC definition, S&M and CAC by year, components, CAC by plan, payback, LTV:CAC, levers. |
| **COST_PRE_REVENUE.md** | Board, Investors, Finance | Cost before first revenue: R&D, S&M, G&A, infra; no COGS; burn, runway, example 12-month budget. |
| **COST_MVP_AND_DEMO_2MONTHS.md** | Board, Finance, Founders | Cost: 1-month MVP (vibe coding, 2 devs) + 1-month demo (20 potential customers). |
| **FINANCIAL_PROJECTION.md** | Board, Investors, Finance | 5-year financial projection: revenue, COGS, OPEX, EBITDA, cash, unit economics, sensitivity. |

---

## Board pack: `docs/board/`

| Document | Audience | Description |
|----------|----------|-------------|
| **CTO_BOARD_BRIEF.md** | Board, CTO | One-page summary: what NEXARA is, product/tech summary, pricing/margins, risks, supporting docs, next steps. |
| **RISK_AND_ASSUMPTIONS.md** | Board, CTO | Assumptions, risk register (impact/likelihood/mitigation), dependencies, sign-off. |

---

## Other plans (reference)

- `LOCAL_WIP_BRANCHES.md` — How to use a local-only branch (e.g. ABM engine WIP) without pushing to GitHub.
- `PLAN_TIER_AND_ONBOARDING.md` — Tier-based redesign and onboarding flow spec.
- `PLAN_TIER1_WORKSPACE_PLATFORM.md` — Workspace/platform scope.
- `USER_FLOW_EXAMPLES.md` — Example user flows.
- `PLAN_INTENT_SIGNALS.md`, `PLAN_NEW_CAMPAIGN_ICP_AND_USER_SEGMENTS.md` — Feature plans.

---

## Quick links by role

- **Board:** Start with `board/CTO_BOARD_BRIEF.md`, then `PRICING_AND_MARGINS.md` and `board/RISK_AND_ASSUMPTIONS.md`.
- **CTO:** `TECHNICAL_DOCUMENTATION.md`, `PROJECT_ARCHITECTURE.md`, `API_DOCUMENTATION.md`, `WORKFLOW_EXECUTION.md`.
- **Product/CS:** `WORKFLOW_TUTORIAL.md`, `FEATURES_AND_USER_INTERACTION.md`, `WORKFLOW_EXECUTION.md`, **`WORKFLOW_EXAMPLES_HUMAN_NEXARA_ARIA.md`**, **`USAGE_ANALYTICS_AND_COSTING_NON_TECHNICAL.md`**, **`ARIA_COST_PER_WORD.md`** (usage, cost, and ARIA cost per word).
- **Finance:** `PRICING_AND_MARGINS.md`, `COST_TO_SERVE_20_CUSTOMERS.md`, `FINANCIAL_PROJECTION.md`.
