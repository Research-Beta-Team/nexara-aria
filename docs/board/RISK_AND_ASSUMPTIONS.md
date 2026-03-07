# NEXARA — Risks & Assumptions (Board / CTO)

**Version:** 1.0  
**Audience:** Board of Directors, CTO, Risk review

---

## 1. Assumptions

- **Product:** Target segment (agencies, GTM teams) will pay for an integrated AI workspace at the proposed price points. Role-based and tier-based differentiation is valued.
- **ARIA:** Claude (Anthropic) remains the primary model; pricing and rate limits are stable enough to support margin targets. Demo mode is sufficient for sales demos without API key.
- **Credits:** Credit-based consumption is understood by customers; top-up and overage pricing are accepted. 1 credit ≈ 1 ARIA request (or defined token equivalent) for costing.
- **Prototype:** Current UI and flows are representative of v1 product; no major pivot required before backend build.
- **Integrations:** CRM (HubSpot, Salesforce), Meta/LinkedIn/Google Ads, and inbox are planned; scope and timeline TBD. Product is usable without some integrations (e.g. manual uploads, mock data).
- **Compliance:** Data residency, GDPR, and SOC2 (or equivalent) will be addressed in production; prototype does not process real PII beyond what is stored in localStorage.

---

## 2. Risks

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| **Anthropic API cost or availability** | High — ARIA is core | Medium | Proxy through backend; meter usage; consider multi-model fallback long-term. |
| **Credit economics** | Margins compress if usage spikes | Medium | Instrument usage per plan; align credit definition to token cost; adjust top-up or included credits. |
| **No backend in prototype** | Delays production launch | Certain | Roadmap: auth, persistence, billing, ARIA proxy as Phase 1. |
| **Scope creep on integrations** | Delays and cost overrun | Medium | Prioritize by plan (e.g. Growth = inbox/ads; Scale = API/warehouse). |
| **User adoption of ARIA** | Low engagement → low perceived value | Medium | Onboarding flow, quick actions, and role-specific prompts; track engagement and iterate. |
| **Security / key exposure** | API key in client in prototype | High if shipped | Never ship client-side API key; production must use server-side ARIA proxy. |
| **Competitive response** | Incumbents add AI co-pilot | Medium | Differentiate on GTM depth, role-adaptive UX, and agency-specific workflows. |

---

## 3. Dependencies

- **Anthropic:** API availability, pricing, and terms.
- **Payment provider:** Stripe (or similar) for billing and top-ups.
- **Identity:** Optional IdP (e.g. Auth0) or custom auth; decision pending.
- **Hosting:** Static SPA + backend (e.g. cloud provider); no lock-in assumed.

---

## 4. Approval / Sign-off

- Technical approach and prototype scope: CTO.
- Pricing and margin model: Finance / Board.
- Risk register and mitigations: reviewed periodically; updates in this document.
