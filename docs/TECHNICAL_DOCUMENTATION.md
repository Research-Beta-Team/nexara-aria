# NEXARA — Technical Documentation

**Version:** 1.0 (Prototype)  
**Audience:** Engineering, CTO  
**Last updated:** 2025

---

## 1. Overview

NEXARA is a GTM (Go-To-Market) AI Operating System for marketing agencies. It provides campaign management, ARIA (AI co-pilot), role-based dashboards, tiered plans, and credit-based usage. This document describes the technical stack, structure, and conventions used in the prototype.

---

## 2. Tech Stack

| Layer | Technology |
|-------|------------|
| **Runtime** | Node.js 18+ |
| **Framework** | React 19 (functional components, hooks only) |
| **Build** | Vite |
| **Routing** | React Router DOM v6 |
| **State** | Zustand (single store) |
| **Charts** | Recharts |
| **Styling** | Inline JavaScript style objects (no Tailwind, no CSS modules, no styled-components) |
| **AI** | Anthropic Claude (claude-sonnet-4-20250514); demo mode when no API key |
| **Language** | JavaScript (no TypeScript in prototype) |

---

## 3. Design System

- **Tokens:** `src/tokens.js` — colors (CSS variables), typography (Syne, DM Sans, JetBrains Mono), spacing (4px base), radii, shadows, z-index.
- **Background:** `#070D09` (dark).
- **Primary accent:** `#3DDC84` (mint green).
- **Convention:** All styles reference tokens; no hardcoded hex in components.

---

## 4. Project Structure

```
src/
├── components/     # Reusable UI by domain
│   ├── aria/       # ARIA panel, history, approvals
│   ├── billing/    # Checkout, plan cards, upgrade
│   ├── campaign/   # Campaign wizard, cards, content preview
│   ├── dashboard/  # KPI, widgets, campaign-from-file
│   ├── layout/     # AppLayout, Sidebar, TopBar, AppFooter
│   ├── plan/       # PlanGate, CreditGate, LimitWarning
│   └── ui/         # Toast, Icons, shared atoms
├── config/         # plans.js, roleConfig.js, defaultLayout
├── context/        # WorkspaceContext
├── data/           # Mock data per domain (campaigns, dashboard, etc.)
├── hooks/          # usePlan, useCredits, useToast, useRoleView, useWorkspace
├── aria/           # ARIAEngine, ARIATools, ARIAToolExecutor, ARIAMemory, ARIASystemPrompt
├── layouts/        # ClientLayout, ForStartupsLayout
├── pages/          # Route-level screens
├── store/          # useStore.js (Zustand)
├── utils/          # roleViews, helpers
└── tokens.js       # Design tokens
```

---

## 5. State Management (Zustand)

- **Single store:** `src/store/useStore.js`.
- **Slices:** Auth, UI, team, notifications, plan/credits, ARIA (chats, folders, persona), approvals, checkout, connections, social, etc.
- **Persistence:** `nexara_auth` and `nexara_aria_chats` in localStorage.
- **Pattern:** Selectors for read; actions for write. No middleware in prototype.

---

## 6. Routing

- **Protected routes** (auth + onboarding required): under `/` with `ProtectedLayout` — Dashboard, Campaigns, Agents, Analytics, Inbox, Settings, etc.
- **Auth:** `/login`, `/signup`.
- **Onboarding:** `/onboarding/setup` (tier flow), `/first-onboarding/aria` (ARIA file-upload flow), `/onboarding` (ARIA Moment).
- **Standalone:** `/client-portal`, `/for_startups/*`.
- **Guards:** `OnboardingGuard` for onboarding routes; `ProtectedLayout` redirects unauthenticated to `/login` and non-onboarded to `/onboarding/setup`.

---

## 7. Plan & Credits System

- **Plans:** Starter, Growth, Scale, Agency — defined in `src/config/plans.js` (price, credits, limits, features, agents).
- **Gating:** `usePlan()` (hasFeature, getLimit, isLimitReached), `PlanGate`, `PlanFeatureLock`, `CreditGate`, `LimitWarning`.
- **Credits:** Stored in store (`creditsIncluded`, `creditsUsed`, `rolloverBalance`); consumed for AI/content actions (prototype uses mock consumption).

---

## 8. ARIA Integration

- **Engine:** `src/aria/ARIAEngine.js` — conversation loop, tool calls, streaming.
- **Model:** Claude Sonnet 4 (20250514); API base: Anthropic.
- **Tools:** 12 tools in `ARIATools.js` (query_campaign_data, search_prospects, create_content, etc.); execution mocked in `ARIAToolExecutor.js`.
- **Demo mode:** When `VITE_ANTHROPIC_API_KEY` is missing, pre-scripted responses and tool-call demos are used.
- **Co-pilot UI:** `AriaPanel.jsx` — sidebar chat with history, project folders, file upload, voice input; persists chats in localStorage.

---

## 9. Role-Adaptive Design

- **Roles:** owner, founder, advisor, csm, mediaBuyer, contentStrategist, sdr, analyst, client.
- **Config:** `src/config/roleConfig.js` — displayName, sidebarVariant, ariaOpening, ariaQuickActions, access (escalations, inbox, team).
- **Resolver:** `src/utils/roleViews.js`; hook: `useRoleView(pageKey)`.
- **Sidebar:** `getSidebarSections(role)` — different nav sections per role.
- **Dashboard:** Role-specific views in `src/views/dashboard/` (e.g. DashboardOwner, DashboardCSM).
- **Dev:** `/dev/roles` — RoleSwitcher to test all roles.

---

## 10. Content & Approval Model

- **Content IDs:** `CAMP-{campaignId}-{type}-{seq}`.
- **States:** draft → in_review → revision_requested → approved → published.
- **Approvals:** Store slice `approvals`, `openApprovalId`; components in `src/components/approvals/`.

---

## 11. Build & Run

```bash
npm install
npm run dev    # http://localhost:5173
npm run build  # Production build
npm run lint   # ESLint
```

**Environment:** `VITE_ANTHROPIC_API_KEY` optional; omit for demo mode.

---

## 12. Conventions

- One component per file; functional components only.
- Import tokens from `src/tokens.js`; use Toast for user feedback.
- Mock data in `src/data/`; no real API calls in prototype.
- Plan/credit gating on all gated features; every clickable element has an onClick.
