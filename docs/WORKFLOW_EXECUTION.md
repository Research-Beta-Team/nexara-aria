# NEXARA — Workflow Execution

**Version:** 1.0 (Prototype)  
**Audience:** Product, Engineering, Board

---

## 1. Overview

This document describes how key workflows are executed in NEXARA: onboarding, campaign creation (with and without ARIA), content approval, and ARIA co-pilot usage. In the prototype, execution is client-side with mock data and optional Anthropic API calls for ARIA.

---

## 2. Onboarding Workflow

1. **Trigger:** User logs in or signs up; `isOnboarded` is false → redirect to `/onboarding/setup`.
2. **Steps:**
   - Welcome → Get started (or Skip to Dashboard).
   - Company type → Solo / Startup / Agency / Enterprise (stored).
   - Tier recommendation → Map company type to suggested plan; user confirms or picks another → `currentPlanId`, `creditsIncluded` set.
   - Connections (optional) → Website URL, CRM, Ads; each can be skipped; stored in `connections`.
   - Done → `completeOnboarding()` sets `isOnboarded: true`, persist auth; redirect to Dashboard or “Create first campaign with ARIA” → `/first-onboarding/aria`.
3. **First campaign with ARIA:** User can upload a file (brief, list); ARIA reads it (read_document / extract); summary shown; user continues to campaign or dashboard. No server in prototype — extraction simulated or via ARIA tool mock.

---

## 3. Campaign Creation Workflows

### 3.1 Full wizard (`/campaigns/new`)

- Steps: Basics → ICP → Channels → Agents & Knowledge → Phases → Team → Workflow → Review.
- Each step reads/writes store (and mock data); ARIA sidebar can suggest per step.
- On launch: campaign created in store; content IDs and approval flow available; agents “briefed” (mock).

### 3.2 Create with ARIA (`/campaigns/new/aria` or first-onboarding)

- Goal + optional “learn from past campaign” → ICP (existing / build / generate with ARIA) → Channels → Content access (connect accounts or skip) → Fetch content (ARIA) or skip → Ready summary → Continue to Strategy & Plan.
- Strategy tab: user confirms/edits; “ARIA, generate plan” → plan updated (mock or tool).
- Plan tab: phased plan, tasks, Gantt; user approves.
- Content: generate with Content IDs (`CAMP-{id}-{type}-{seq}`); approval states: draft → in_review → revision_requested → approved → published.
- Launch: agents briefed (mock); campaign active.

### 3.3 Start from file (Dashboard)

- User uploads file on Dashboard (or New campaign → Start from file); file stored in `dashboardCampaignFiles`.
- User opens “Create with ARIA” flow; banner shows “Using your file”; ARIA uses it in context (read_document mock); file cleared on unmount.

---

## 4. Content & Approval Workflow

- **Content IDs:** `CAMP-{campaignId}-{type}-{seq}`.
- **States:** draft → in_review → revision_requested → approved → published.
- **Execution:** User or ARIA creates content → state in store; approver sees in Content library or Escalations; actions (approve / request revision) update state. No backend in prototype.

---

## 5. ARIA Co-pilot Execution

1. **Open:** User clicks FAB → ARIA panel opens; optional history/folders; optional file attach and voice input.
2. **Send message:** Message appended to current chat; store updated; persisted to `nexara_aria_chats` (localStorage).
3. **Engine:** `ARIAEngine` runs conversation loop:
   - If no API key: **demo mode** — pre-scripted replies and mock tool calls.
   - If API key: send messages to Anthropic Messages API with tools; stream response; on tool_calls, run `ARIAToolExecutor` (mock in prototype); append tool results; continue until no more tool use.
4. **Tools:** search_prospects, enrich_contact, read_document, extract_from_image, fill_form, query_campaign_data, update_campaign, create_content, send_outreach, analyze_performance, schedule_action, escalate_to_human. All executed client-side mock; production would run server-side and optionally deduct credits per request.

---

## 6. Billing / Upgrade Workflow

- User goes to Billing or clicks Upgrade on a gated feature.
- Select plan → Checkout steps (plan summary, payment placeholder, confirm).
- On complete: store updates `currentPlanId`, `creditsIncluded` (and optionally `rolloverBalance`); in production this would call billing API and Stripe (or similar).
- Credit consumption: on AI/content actions, decrement credits in store; at limit, CreditGate blocks or prompts top-up. Top-up price from plan (`topUpPricePer1k`).

---

## 7. Role-Based View Execution

- **Resolver:** `useRoleView(pageKey)` returns defaultTab, tabs, layout, access (e.g. escalations: true | false | 'readonly').
- **Sidebar:** `getSidebarSections(role)` → different nav sections; founder gets compact list; client gets minimal.
- **Dashboard:** Role key maps to view component (e.g. DashboardOwner, DashboardCSM); same route, different component.
- **Escalations/Inbox:** Access flags hide or show actions; analyst gets read-only escalations.

---

## 8. Sequence Summary

| Workflow | Trigger | Main steps | Where executed |
|----------|---------|------------|----------------|
| Onboarding | Login/signup, !isOnboarded | Company type → Tier → Connections → Done | Client (store + localStorage) |
| First campaign (ARIA) | Done → “Create first campaign with ARIA” | File upload → ARIA extract → Summary → Campaign/Strategy | Client + optional Anthropic (demo or live) |
| Campaign wizard | New campaign (wizard) | 8 steps → Launch | Client (store + mock data) |
| Campaign (ARIA flow) | New campaign (ARIA) | Goal → ICP → Channels → Content → Strategy → Plan → Content IDs → Launch | Client + ARIA tools (mock) |
| Content approval | Content created / in review | State transitions draft→…→published | Client (store) |
| ARIA chat | User message in panel | Send → Engine → (API + tools) → Stream reply | Client; Anthropic when key set; tools mock |
| Upgrade | User selects plan & pays | Checkout → Update plan/credits | Client (store); production: billing API |
