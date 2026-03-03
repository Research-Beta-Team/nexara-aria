# NEXARA GTM AI OS — Claude Code Context

## Project Overview
NEXARA is a dark-mode GTM AI Operating System for marketing agencies. Think: Bloomberg Terminal meets Notion meets a GTM agency dashboard.

## Design System (NON-NEGOTIABLE — never deviate)
- Background: #070D09
- Surface: #0C1510
- Surface2: #111B14
- Surface3: #162019
- Border: #1C2E22
- Primary accent: #3DDC84 (mint green)
- Secondary: #5EEAD4 (teal)
- Text primary: #DFF0E8
- Text secondary: #6B9478
- Text muted: #3A5242
- Red/error: #FF6E7A
- Amber/warning: #F5C842
- Font display: 'Syne', sans-serif
- Font body: 'DM Sans', sans-serif
- Font mono: 'JetBrains Mono', monospace
- Card border-radius: 12px
- Button border-radius: 7px
- Input border-radius: 8px

## Tech Stack
- React 19 with hooks (no class components)
- Vite for build
- React Router DOM v6 for routing
- Zustand for global state
- Recharts for all charts
- Inline styles (no Tailwind, no CSS modules, no styled-components)
- All styles as JavaScript objects

## File Structure Rules
- One component per file
- Components in: src/components/[ModuleName]/ComponentName.jsx
- Pages (full screens) in: src/pages/PageName.jsx
- Global state in: src/store/useStore.js
- Design tokens in: src/tokens.js
- Mock data in: src/data/[module].js
- Shared UI atoms in: src/components/ui/

## Coding Rules
- Always use functional components with hooks
- No TypeScript (plain JavaScript)
- All mock data is hardcoded (no API calls in prototype)
- Import design tokens from src/tokens.js — never hardcode colors
- Every clickable element must have an onClick handler (even if it just toasts)
- Use the Toast system (src/components/ui/Toast.jsx) for all user feedback
- Never leave dead buttons that do nothing

## Current Build Stage
[UPDATE THIS as you build each module]
Completed: tokens, store, toast, router, layout (AppLayout), sidebar, topbar, dashboard, campaigns (list, detail, all 8 tabs, outreach detail), agents (roster, detail), meta monitor, escalations, analytics, inbox, content library, knowledge base, query manager, notification center, settings, research (ICP builder, competitive intel), ABM engine, vertical playbooks, revenue (pipeline, customer success, forecast engine), ARIA Intelligence (ARIABrain), workspace (white-label config), dev (role switcher), client portal, onboarding, billing/upgrade, login, signup
In Progress: —
Not Started: —

## Routes (main app, under protected layout)
- `/` — Dashboard
- `/campaigns` — Campaign list
- `/campaigns/new` — New campaign
- `/campaigns/:id` — Campaign detail
- `/campaigns/:id/prospect/:pid` — Outreach detail
- `/agents` — Agent roster
- `/agents/:id` — Agent detail
- `/meta` — Meta Monitor
- `/escalations` — Escalations
- `/analytics` — Analytics
- `/inbox` — Inbox
- `/content` — Content Library
- `/knowledge` — Knowledge Base
- `/querymanager` — Query Manager
- `/notification-center` — Notification Center
- `/research/icp` — ICP Builder
- `/competitive` — Competitive Intel
- `/abm` — ABM Engine
- `/revenue/pipeline` — Pipeline Manager
- `/customer-success` — Customer Success
- `/forecast` — Forecast Engine
- `/playbooks` — Vertical Playbooks
- `/team` — Coming Soon (Team & Workspace)
- `/billing` — redirects to /billing/upgrade
- `/billing/upgrade` — Upgrade / plans
- `/settings` — Settings
- `/settings/aria` — ARIA Persona Config
- `/aria-brain` — ARIA Intelligence
- `/aria/knowledge` — ARIA Knowledge Base
- `/aria/workflows` — Workflow Center
- `/workspace/whitelabel` — White-Label Config
- `/whitelabel` — White-Label Config (same page)
- `/dev/roles` — Role Switcher (dev only)
- `*` — 404 Not Found

Standalone routes: `/client-portal`, `/for_startups` (landing), `/for_startups/onboarding`, `/for_startups/dashboard`, `/login`, `/signup`, `/onboarding` (ARIA Moment — full-screen, no sidebar), `/onboarding/aria` (same), `/onboarding/setup` (tier-based onboarding)

## Pages Completed
- Dashboard
- CampaignList, CampaignDetail, CampaignNew, OutreachDetail
- AgentRoster, AgentDetail
- MetaMonitor
- Escalations
- Analytics
- Inbox
- ContentLibrary
- KnowledgeBase
- QueryManager
- NotificationCenter
- ICPBuilder (research), CompetitiveIntel (research)
- ABMEngine
- VerticalPlaybooks
- PipelineManager, CustomerSuccess, ForecastEngine (revenue)
- ARIABrain
- WhiteLabelConfig (workspace)
- RoleSwitcher (dev)
- Settings
- ClientPortal
- Onboarding
- ARIAKnowledge, WorkflowCenter, ARIAPersonaConfig (stubs)
- UpgradePage (billing)
- Login, Signup
- NotFound, ComingSoon (stubs)

## Run Commands
- npm run dev → starts dev server at localhost:5173
- npm run build → production build
- npm run lint → ESLint check

## Demo company (real-world example)
- **Default/demo company:** Medglobal — international humanitarian health NGO (medglobal.org). Founded 2017; delivers emergency healthcare and health programs to vulnerable communities in North/Latin America, Africa, MENA, Europe, Southeast Asia. Use “Medglobal” for all placeholder client names, billing placeholders, and mock data (e.g. activeClientId: 'medglobal', currentClient: 'Medglobal').

## Important Patterns
- Toast notifications: useToast() hook from src/hooks/useToast.js
- Role checking: useStore(s => s.currentRole)
- Navigation: useNavigate() from react-router-dom
- Global state: src/store/useStore.js (Zustand)

## Plan Gate System (T1–T4 Pages)
Every page that uses gated features must use the NEXARA plan gate system. At the start of each new feature session, apply this pattern.

**Imports (top of every new page component):**
```js
import { usePlan } from '../../hooks/usePlan';
import { useCredits } from '../../hooks/useCredits';
import PlanGate from '../../components/plan/PlanGate';
import PlanFeatureLock from '../../components/plan/PlanFeatureLock';
import CreditGate from '../../components/plan/CreditGate';
import LimitWarning from '../../components/plan/LimitWarning';
```

**At the top of the component function:**
```js
const { hasFeature, hasAgent, getLimit, isLimitReached, upgradePlan, plan } = usePlan();
const { creditsRemaining, canAffordAction, isLow, isCritical } = useCredits();
```

**Wrap plan-gated features:**
```jsx
<PlanGate feature="[featureKey]" requiredPlan="[planId]">
  <YourFeatureComponent />
</PlanGate>
```

**Wrap credit-costing actions:**
```jsx
<CreditGate creditCost={80} actionLabel="Generate content" onConfirm={handleGenerate}>
  <button>Generate</button>
</CreditGate>
```

**Feature keys (for PlanGate `feature` prop):**
| Key | Min plan |
|-----|----------|
| intentSignals, icpScoring, linkedinOutreach, whatsappOutreach, abmEngine | Growth+ |
| metaAdsManagement, googleAdsManagement, linkedinAdsManagement | Growth+ |
| unifiedInbox, pipelineManager, clientPortal, roleBasedAccess, outcomeBilling | Growth+ |
| competitiveIntel, predictiveForecasting, customerSuccess, whiteLabel, apiAccess, customAgents, dataWarehouseSync, ariaVoice | Scale+ |
| crossClientAnalytics, subBilling | Agency only |

## ARIA Configuration
- Anthropic API key: import.meta.env.VITE_ANTHROPIC_API_KEY (optional — demo mode when missing)
- Model: claude-sonnet-4-20250514
- ARIA engine: src/aria/ARIAEngine.js (singleton export: aria)
- Tools: src/aria/ARIATools.js (12 tools)
- Tool executor: src/aria/ARIAToolExecutor.js (mock in prototype)
- Memory: src/aria/ARIAMemory.js
- System prompt: src/aria/ARIASystemPrompt.js
- Demo mode: when API key is missing — pre-scripted responses simulate agentic behavior

## Best workflow: Create campaign with ARIA (per CLAUDE.md)
Use this flow so ARIA has full context and content follows the approval model. Implemented in AriaCampaignFlow (`/campaigns/new/aria`).

1. **Goal:** Campaign name + one-line objective.
2. **Learn from past (optional):** Select a previous campaign so ARIA can learn from it; or “None — starting fresh”.
3. **Who to target (ICP):** Use existing ICP / Build in ICP Builder / Generate with ARIA.
4. **Channels:** Choose channel(s) (Email, LinkedIn, Meta, Google Ads).
5. **Content access:** Connect accounts for chosen channels so ARIA can fetch content; or skip.
6. **Fetch content:** ARIA fetches content from connected channels (or skip to next).
7. **Ready:** Summary of choices; user clicks **Continue to Strategy & Plan** → navigate to **Campaign Detail → Strategy tab** with `?from_aria=1`.
8. **Strategy:** User adds or confirms strategy inputs (brief, ICP, positioning, competitor intel, roadmap). Strategy tab shows “ARIA, generate plan →”.
9. **Plan:** User clicks **ARIA, generate plan** → ARIA updates the plan; then open **Plan tab** (phased plan, tasks, Gantt). User can modify plan type and approve.
10. **Content:** After plan approval, content is generated with **Content IDs** (`CAMP-{campaignId}-{type}-{seq}`) and moves through approval: `draft` → `in_review` → `revision_requested` → `approved` → `published`.
11. **Launch:** When ready, launch; ARIA agents are briefed with ICP, KB docs, and channel strategy.

**Alternative (full wizard):** User can instead start at `/campaigns/new` (CampaignWizard) and go through all 8 steps (Basics → ICP → Channels → Agents & Knowledge → Phases → Team → Workflow → Review). The ARIA sidebar gives per-step tips; at launch the same content/approval and agent-briefing rules apply. For first-time owners, prefer routing to ICP Builder first (see docs/PLAN_NEW_CAMPAIGN_ICP_AND_USER_SEGMENTS.md).

## Content & approval patterns
- **Content IDs:** Format `CAMP-{campaignId}-{type}-{seq}`; assigned to all generated content (e.g. emails, ads, copy).
- **Approval states:** Content moves through: `draft` → `in_review` → `revision_requested` → `approved` → `published`.

## Role-Adaptive Design
- Same URL, different experience per role. Eight roles: **owner**, **founder**, **advisor**, **csm**, **mediaBuyer**, **contentStrategist**, **sdr**, **analyst**, **client**.
- **Config**: `src/config/roleConfig.js` (display names, sidebar variant, ARIA opening/quick-actions, access rules). Resolver: `src/utils/roleViews.js`; hook: `useRoleView(pageKey)` from `src/hooks/useRoleView.js`.
- **Sidebar**: Role-based section visibility via `getSidebarSections(role)`; founder gets compact 5-item nav; client gets minimal (Dashboard, Content, Inbox, Settings); sdr/csm/mediaBuyer/contentStrategist/analyst see role-specific subsets.
- **Dashboard**: Dispatches by role to `src/views/dashboard/` (DashboardOwner, DashboardAdvisor, DashboardCSM, DashboardMediaBuyer, DashboardContentStrategist, DashboardSDR, DashboardAnalyst, DashboardClient).
- **Campaign Detail**: Default tab and visible tabs per role; client layout (no tabs) via `CampaignDetailClient`; single-focus layouts (ads/content/outreach/analytics) for specialists.
- **Inbox**: Filter (all/outreach/client/content/team) and layout (default vs SDR) from `useRoleView('inbox')`; access can be denied (redirect to Dashboard).
- **Escalations**: Access true/readonly/false per role; filter (all/client/ads/content); analyst is read-only (no action buttons).
- **ARIA panel**: Opening message and quick actions from `roleConfig.roles[role].ariaOpening` and `ariaQuickActions`.
- Use **Dev → Switch Role** to verify behavior. No new routes.

## Tier & Onboarding Plan
- Full plan: docs/PLAN_TIER_AND_ONBOARDING.md
- Tiers: Starter, Growth, Scale, Agency (src/config/plans.js)
- Onboarding: company type → tier recommendation → optional connections (website, CRM, ads); skippable; connections editable in Settings
