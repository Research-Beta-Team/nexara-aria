# NEXARA — Tier-Based Redesign & Onboarding Plan

This document defines how existing pages align to plan tiers (Starter, Growth, Scale, Agency), the new onboarding flow (company type → tier recommendation → connections), and Settings additions. Use it as the spec before building the frontend.

---

## 1. Tier Summary (from `src/config/plans.js`)

| Tier     | Target               | Price (annual) | Key limits                          | Key unlocks                          |
|----------|----------------------|----------------|-------------------------------------|--------------------------------------|
| **Starter** | Solo / small team   | $149/mo        | 2 campaigns, 3 seats, 1 workspace  | Email + Meta Monitor, ICP Builder, Playbooks |
| **Growth**  | Growing agency      | $499/mo        | Unlimited campaigns, 10 seats      | Inbox, ABM, Intent, Pipeline, Client Portal, Gantt |
| **Scale**   | Scale-up / multi-client | $1,499/mo  | 25 seats, custom agents, API       | Competitive Intel, Forecasting, CS, White-label, ARIA Voice |
| **Agency**  | Enterprise agency   | $3,999/mo      | Unlimited everything               | Cross-client analytics, sub-billing, dedicated CSM |

---

## 2. Tier-Based Redesign of Existing Pages

### 2.1 Dashboard
- **Starter:** Show only: Campaign health (max 2), Agent feed, Escalation mini. Hide or soft-gate: Meta widget (show “Upgrade for Meta Monitor”), cross-campaign insights.
- **Growth+:** Full dashboard as today + Inbox preview if `unifiedInbox`.
- **Scale+:** Add “Cross-Client Snapshot” or ARIA Voice widget if enabled.
- **Implementation:** Use `usePlan().hasFeature('advancedAnalytics')`, `hasFeature('unifiedInbox')` etc. to conditionally render sections. Add “Upgrade to see this” cards with link to `/billing/upgrade` for locked sections.

### 2.2 Campaigns (list & detail)
- **Starter:** Enforce limit of 2 campaigns. At 2/2, “New Campaign” opens upgrade modal (or redirect to upgrade with sourceFeature=`campaigns`). List shows “1/2” or “2/2” in header.
- **Growth+:** No campaign count cap in UI (unlimited).
- **Implementation:** `usePlan().getLimit('activeCampaigns')`, `isLimitReached('activeCampaigns', campaigns.length)`. When at limit, CTA = “Upgrade to add more campaigns”.

### 2.3 Sidebar
- Already gated per item (`gatedFeature`, `requiredPlan`). Keep as-is. Optionally show a small “Upgrade” badge or lock icon next to locked items that opens upgrade modal with `featureUnlocked` set.

### 2.4 Feature pages (Inbox, Intent, ABM, Pipeline, Competitive Intel, etc.)
- Already protected by route + sidebar (locked items either hidden or show lock). Keep **PlanGate** on pages that render full feature; ensure “Upgrade to [Plan]” uses correct `requiredPlan` from `plans.js`.
- **Limit-aware UI:** Where a plan has a limit (e.g. Intent Signal accounts 500 on Growth), show usage in header or settings (e.g. “420 / 500 accounts”). Use `getPlanLimit`, store usage in Zustand or mock per campaign.

### 2.5 Billing / Upgrade
- **Upgrade flow:** Already exists (UpgradePage, CheckoutStep1–4, PlanCard). Ensure `completeUpgrade` sets `currentPlanId` and credits. No change needed except optional “Recommended for you” on Upgrade page based on onboarding answer (see 3.2).

### 2.6 Settings
- **Workspace section:** Already shows Plan, Seats, Renewal. Ensure plan name and limits come from `usePlan()` and store (e.g. `currentPlanId`, `seatsUsed`, `activeCampaignsCount`). Add link “Change plan” → `/billing/upgrade`.
- **New section: Connections** (see 4).

---

## 3. New Onboarding Flow

### 3.1 Goals
- Understand **company type** (solo/startup vs SMB vs agency/enterprise).
- Recommend a **tier** and let user confirm or pick another.
- Optional **connections**: company website, CRM (HubSpot/Salesforce), Meta/LinkedIn/Google Ads (optional).
- User can **skip** any step; skipped items can be added later from **Settings → Connections**.

### 3.2 Steps (order)

1. **Welcome**
   - Short headline: “Let’s set up NEXARA for you.”
   - Subtext: “Takes about 2 minutes. You can skip and configure later.”
   - Primary: “Get started” → step 2. Secondary: “Skip to Dashboard” → `completeOnboarding()`, `navigate('/')`, set a flag e.g. `onboardingSkipped: true` in store or localStorage.

2. **Company type**
   - Question: “What best describes you?”
   - Options (single select):
     - **Solo founder / freelancer** — “Just me or a tiny team.”
     - **Startup / small team** — “Small team, few campaigns.”
     - **Growing agency** — “Multiple clients, need scale.”
     - **Enterprise / large agency** — “Many teams, full control.”
   - Store answer as `onboardingCompanyType` (e.g. in Zustand or sessionStorage). Next → step 3.

3. **Tier recommendation**
   - Map company type → suggested plan:
     - Solo/freelancer → **Starter**
     - Startup/small team → **Starter** or **Growth** (if “few campaigns” and “need LinkedIn/Inbox” → Growth)
     - Growing agency → **Growth** or **Scale**
     - Enterprise → **Scale** or **Agency**
   - UI: “We recommend **Growth** for you” with 2–3 bullet reasons. Show plan card (name, price, 3 feature bullets). Buttons: “Choose Growth” | “See other plans”. If “See other plans” → show all 4 tiers briefly; user picks one. Store `onboardingSelectedPlanId` (e.g. `starter` | `growth` | `scale` | `agency`). On “Choose [X]” or pick → apply plan: `setPlan(selectedPlanId)` (and optionally set credits from plan), then Next → step 4.

4. **Connections (optional)**
   - Headline: “Connect your tools (optional).”
   - Subtext: “You can skip and add these anytime from Settings.”
   - Cards (each can be skipped):
     - **Company website** — Input: URL. “We’ll use this for ICP and ARIA context.” [Connect] or [Skip].
     - **CRM** — “HubSpot, Salesforce, or Pipedrive.” [Connect] → mock “Coming soon” or placeholder; or [Skip].
     - **Ads / channels** — “Meta, LinkedIn, Google Ads.” [Connect] → placeholder; or [Skip].
   - Store which were connected (e.g. `onboardingConnections: { website?: string, crm?: string, ads?: boolean }`). No real API; just persist in store/localStorage for UI state.
   - Buttons: “Finish setup” (primary) and “Skip all” (secondary). Both → `completeOnboarding()`, clear any “analyzing” state, then navigate to Dashboard or “Launch first campaign” (e.g. `/campaigns/new`).

5. **Done**
   - If they didn’t skip step 2–3: optional confirmation screen “You’re on [Plan]. [X] connections added.” with [Go to Dashboard] and [Create first campaign].
   - If they skipped from step 1: no step 2–4; just land on dashboard.

### 3.3 Data to persist (Zustand or localStorage)
- `onboardingSkipped: boolean`
- `onboardingCompanyType: string`
- `onboardingSelectedPlanId: string` (used to set `currentPlanId` when they confirm)
- `onboardingConnections: { website?: string, crm?: string, ads?: boolean }`

After completion, `completeOnboarding()` runs; plan and connections remain in store so Settings and app can use them.

### 3.4 Existing onboarding vs new
- **Replace** current Onboarding.jsx flow (ARIA Q&A → campaign brief) with the new flow above, or keep the old flow as an optional “Campaign quick-start” after the new onboarding (e.g. “Want ARIA to build your first campaign brief?” with [Yes] → current chat flow, [No] → Dashboard).
- **Recommendation:** Replace with new flow; add a separate entry point “Create campaign with ARIA” from Dashboard or Campaigns that runs the old brief flow if desired.

---

## 4. Settings: Connections Section

### 4.1 New section: “Connections”
- **Location:** Settings left nav, new item “Connections” (icon: plug/link).
- **Content:**
  - **Company website** — Display current value (from onboarding or previously set). [Edit] / [Disconnect]. Input to add/change URL; save to store (e.g. `connections.website`).
  - **CRM** — “Connect HubSpot, Salesforce, or Pipedrive.” Status: “Not connected” or “Connected (HubSpot)”. [Connect] → placeholder modal “Coming soon.”
  - **Ads & channels** — “Meta, LinkedIn, Google Ads.” List 3 rows: Meta [Connect], LinkedIn [Connect], Google [Connect]. Placeholder or “Coming soon.”
- **Copy:** “Add or remove integrations. Some features use these connections.” Same “skip” idea: everything here is optional; onboarding just surfaces the same list.

### 4.2 Store (or localStorage) for connections
- Add to Zustand, e.g.:
  - `connections: { website: string | null, crm: string | null, meta: boolean, linkedin: boolean, google: boolean }`
  - Actions: `setConnectionWebsite(url)`, `setConnectionCrm(name)`, `setConnectionAds(platform, connected)`.
- Use in onboarding (step 4) and Settings so both read/write the same state.

---

## 5. Files to Create or Modify (Frontend Checklist)

### 5.1 Onboarding
- **Modify:** `src/pages/Onboarding.jsx`
  - Replace with new multi-step flow: Welcome → Company type → Tier recommendation → Connections (optional) → Done.
  - Use existing tokens, F, R, S, C, buttons; keep “Skip to Dashboard” and “Skip” on connections.
  - Persist choices to store (and optionally localStorage for refresh).
- **Optional:** `src/data/onboardingTiers.js` — copy for tier recommendation (company type → suggested plan + reasons).

### 5.2 Store
- **Modify:** `src/store/useStore.js`
  - Add: `onboardingSkipped`, `onboardingCompanyType`, `onboardingSelectedPlanId`, `onboardingConnections`.
  - Add: `connections: { website, crm, meta, linkedin, google }` and setters.
  - Add: `setOnboardingCompleted(data)` or reuse `completeOnboarding` and set plan when user confirms tier in onboarding.

### 5.3 Dashboard (tier-aware)
- **Modify:** `src/pages/Dashboard.jsx`
  - Use `usePlan().hasFeature(...)` and `getLimit` / `isLimitReached` to show/hide or replace sections.
  - Add “Upgrade to unlock” cards for locked features (e.g. Meta widget for Starter).

### 5.4 Campaigns (limit-aware)
- **Modify:** `src/pages/CampaignList.jsx`
  - Read `getLimit('activeCampaigns')` and current list length; at limit, “New Campaign” opens upgrade modal or navigates to upgrade with `sourceFeature='campaigns'`.

### 5.5 Settings
- **Modify:** `src/pages/Settings.jsx`
  - Add section “Connections” to `SECTIONS` and new `ConnectionsSection` component.
  - ConnectionsSection: display and edit `connections` from store; Company website, CRM, Ads placeholders.

### 5.6 Billing/Upgrade (optional)
- **Modify:** `src/pages/billing/UpgradePage.jsx`
  - If `onboardingSelectedPlanId` is set and user just came from onboarding, optionally pre-select that plan or show “Recommended for you” badge.

### 5.7 Config / data
- **Create (optional):** `src/data/onboardingTiers.js` — mapping company type → recommended plan id + label + 3 reason bullets.

---

## 6. Flow Diagram (Summary)

```
[Login/Signup]
      →
[Onboarding]
   ├─ Skip → Dashboard (onboardingSkipped = true)
   └─ Get started
        → Company type (solo / startup / agency / enterprise)
        → Tier recommendation → User confirms or picks plan → setPlan(id)
        → Connections (website, CRM, ads) [all skippable]
        → Finish → completeOnboarding() → Dashboard or Campaigns/new
      →
[Dashboard] (tier-aware widgets and limits)
[Campaigns]  (at limit → upgrade CTA)
[Sidebar]    (existing gating)
[Settings]
   └─ Connections (add/edit website, CRM, ads same as onboarding)
```

---

## 7. What We Will Build (Order)

1. **Store updates** — onboarding and connections state + setters.
2. **Onboarding page** — new steps (Welcome, Company type, Tier recommendation, Connections, Done).
3. **Settings → Connections** — new section and form.
4. **Dashboard** — tier-based visibility and upgrade CTAs.
5. **Campaign list** — campaign limit check and upgrade when at limit.
6. **Optional:** Upgrade page “Recommended” badge from onboarding choice.

Once this plan is approved, the frontend can be implemented in this order.
