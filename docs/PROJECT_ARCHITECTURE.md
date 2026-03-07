# NEXARA — Project Architecture

**Version:** 1.0 (Prototype)  
**Audience:** CTO, Engineering Leads, Board (technical view)

---

## 1. High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              CLIENT (Browser)                                │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │  React 19 + Vite SPA                                                  │   │
│  │  • AppLayout (Sidebar, TopBar, AppFooter)                             │   │
│  │  • Protected routes (Dashboard, Campaigns, Revenue, Settings, etc.)   │   │
│  │  • ARIA Co-pilot (slide-in panel, history, file/voice input)         │   │
│  │  • Zustand store (auth, plan, credits, ARIA chats, UI)               │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────┘
                                        │
                    (Prototype: no backend; future: REST/GraphQL + Auth)
                                        ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  EXTERNAL SERVICES (when integrated)                                         │
│  • Anthropic API (ARIA / Claude)                                             │
│  • CRM / Ads / Inbox connectors (HubSpot, Meta, LinkedIn, etc.)             │
│  • Identity / Billing (e.g. Stripe, Auth0)                                  │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Application Layers

| Layer | Responsibility | Key artifacts |
|-------|----------------|----------------|
| **Routing** | Guards, public vs protected routes, onboarding vs app | `App.jsx`, `ProtectedLayout`, `OnboardingGuard` |
| **Layout** | Shell, sidebar, top bar, footer, ARIA panel | `AppLayout.jsx`, `Sidebar.jsx`, `TopBar.jsx`, `AppFooter.jsx`, `AriaPanel.jsx` |
| **Pages** | Full-screen views per route | `src/pages/*.jsx` |
| **Components** | Reusable UI by domain | `src/components/{aria,billing,campaign,dashboard,plan,ui,...}` |
| **State** | Global app state, persistence | `src/store/useStore.js`, localStorage |
| **Config** | Plans, roles, feature flags | `src/config/plans.js`, `roleConfig.js` |
| **Hooks** | Plan, credits, toast, role view, workspace | `src/hooks/*.js` |
| **ARIA** | AI engine, tools, executor, memory | `src/aria/*.js` |
| **Data** | Mock data (prototype) | `src/data/*.js` |

---

## 3. Data Flow (Prototype)

- **Auth:** Login/Signup set `isAuthenticated` / `isOnboarded` in store and persist to `nexara_auth` (localStorage).
- **Onboarding:** Tier flow sets `currentPlanId`, `creditsIncluded`, `connections`; ARIA flow can set `onboardingExtraction`; completion sets `isOnboarded`.
- **Plans/Credits:** Read from store; gating via `usePlan()` / `useCredits()`; upgrades write `currentPlanId`, `creditsIncluded`.
- **ARIA chats:** Chats and folders in store; persisted to `nexara_aria_chats` (localStorage).
- **Campaigns/Content:** Mock data in `src/data/`; no server round-trip in prototype.

---

## 4. Security Model (Current)

- **Auth:** Client-only (store + localStorage). No server sessions in prototype.
- **Roles:** Client-side role switching for UX; no RBAC enforcement on APIs (no backend yet).
- **Plan/Feature gating:** Client-side; features hidden or locked by plan/credits.

---

## 5. Deployment

- **Build:** Static SPA (`npm run build` → `dist/`).
- **Hosting:** Deploy `dist/` to any static host (e.g. Vercel, Netlify).
- **Env:** `VITE_*` variables baked in at build time (e.g. `VITE_ANTHROPIC_API_KEY` for ARIA).

---

## 6. Future Backend (Not in Prototype)

Planned for production:

- **API:** REST or GraphQL for campaigns, users, billing, ARIA proxy.
- **Auth:** Server-side sessions or JWT; identity provider optional.
- **Database:** Persist campaigns, content, approvals, usage, billing.
- **Integrations:** CRM, ad platforms, inbox — server-side connectors with secure credentials.
- **ARIA:** Server-side proxy to Anthropic to protect API keys and meter usage.

---

## 7. Diagram: User → App → External

```
User
  │
  ├─ Login/Signup ──────► Store (auth) + localStorage
  ├─ Onboarding ────────► Store (plan, connections, isOnboarded)
  ├─ Dashboard / Pages ─► Store (read) + mock data
  ├─ ARIA chat ─────────► Store (chats) + (optional) Anthropic API
  ├─ Campaign create ───► Store + mock data
  └─ Upgrade / Billing ──► Store (plan, credits); (future) Stripe etc.
```
