# NEXARA — CTO / Board Brief (One-Page)

**Date:** 2025  
**Status:** Prototype  
**Prepared for:** Board of Directors

---

## What Is NEXARA?

NEXARA is a **GTM AI Operating System** for marketing agencies: a single workspace for campaigns, content, analytics, and an AI co-pilot (ARIA) that assists with strategy, content, and operations. Think Bloomberg Terminal meets Notion for GTM teams.

---

## Product Summary

- **Platform:** Web app (React 19, Vite). Dark-mode UI, role-adaptive (Owner, CSM, SDR, Media Buyer, Analyst, Client, etc.), tiered plans (Starter → Agency).
- **ARIA:** Claude-powered co-pilot with 12 tools (search prospects, create content, query campaigns, send outreach, escalate to human, etc.). Works in demo mode without API key; production uses Anthropic API.
- **Monetization:** SaaS plans ($149–$3,999/mo annual); credit-based AI usage; top-ups at $8–12 per 1k credits by plan.
- **Current state:** Full UI prototype; client-side state and mock data; no backend. Ready for board demo and roadmap decisions.

---

## Technical Highlights

- **Stack:** React 19, Zustand, React Router, Recharts, inline styles (design tokens).
- **Architecture:** SPA; planned backend for auth, campaigns, billing, ARIA proxy. ARIA tool execution is mocked; production will run server-side with rate limits and cost control.
- **Security:** Client-only auth in prototype; production will use server-side auth and API key protection for ARIA.

---

## Pricing & Margins (Summary)

- **Sell:** Starter $149/mo, Growth $499/mo, Scale $1,499/mo, Agency $3,999/mo (annual). Credits included: 5k–500k/month; top-up $8–12/1k.
- **Cost:** Dominated by Anthropic (ARIA). Example: ~$0.53/campaign (50 requests); margin remains high if credit cost is modeled and contained.
- **Detail:** See `docs/PRICING_AND_MARGINS.md`.

---

## Risks & Assumptions

- **Prototype:** No persistence beyond localStorage; no real billing or CRM/ads integrations.
- **Production:** Requires backend, auth, billing (e.g. Stripe), ARIA proxy, and integration connectors. API pricing and token usage will drive unit economics.
- **Dependencies:** Anthropic API availability and pricing; optional CRM/ads APIs for full feature set.

---

## Supporting Documents

| Document | Purpose |
|----------|---------|
| `TECHNICAL_DOCUMENTATION.md` | Stack, structure, conventions |
| `PROJECT_ARCHITECTURE.md` | High-level architecture, data flow |
| `WORKFLOW_TUTORIAL.md` | Non-technical user flows |
| `API_DOCUMENTATION.md` | ARIA tools, intended REST API |
| `FEATURES_AND_USER_INTERACTION.md` | Features by plan, behavior by role |
| `WORKFLOW_EXECUTION.md` | How workflows run (onboarding, campaign, ARIA) |
| `PRICING_AND_MARGINS.md` | Sell pricing, API cost per campaign, margin formulas |
| `board/RISK_AND_ASSUMPTIONS.md` | Risks, assumptions, mitigations |

---

## Asks / Next Steps

1. **Approve** prototype as basis for production roadmap.
2. **Prioritize** backend scope: auth, billing, ARIA proxy, campaign/content persistence.
3. **Lock** pricing and credit-to-cost model using real usage data once ARIA is instrumented.
