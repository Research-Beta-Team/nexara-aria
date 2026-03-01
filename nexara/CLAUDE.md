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
- `/aria-brain` — ARIA Intelligence
- `/workspace/whitelabel` — White-Label Config
- `/whitelabel` — White-Label Config (same page)
- `/dev/roles` — Role Switcher (dev only)
- `*` — 404 Not Found

Standalone routes: `/client-portal`, `/login`, `/signup`, `/onboarding`

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
- UpgradePage (billing)
- Login, Signup
- NotFound, ComingSoon (stubs)

## Run Commands
- npm run dev → starts dev server at localhost:5173
- npm run build → production build
- npm run lint → ESLint check

## Important Patterns
- Toast notifications: useToast() hook from src/hooks/useToast.js
- Role checking: useStore(s => s.currentRole)
- Navigation: useNavigate() from react-router-dom
- Global state: src/store/useStore.js (Zustand)

## ARIA Configuration
- Anthropic API key: import.meta.env.VITE_ANTHROPIC_API_KEY (optional — demo mode when missing)
- Model: claude-sonnet-4-20250514
- ARIA engine: src/aria/ARIAEngine.js (singleton export: aria)
- Tools: src/aria/ARIATools.js (12 tools)
- Tool executor: src/aria/ARIAToolExecutor.js (mock in prototype)
- Memory: src/aria/ARIAMemory.js
- System prompt: src/aria/ARIASystemPrompt.js
- Demo mode: when API key is missing — pre-scripted responses simulate agentic behavior

## Tier & Onboarding Plan
- Full plan: docs/PLAN_TIER_AND_ONBOARDING.md
- Tiers: Starter, Growth, Scale, Agency (src/config/plans.js)
- Onboarding: company type → tier recommendation → optional connections (website, CRM, ads); skippable; connections editable in Settings
