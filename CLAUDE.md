# Antarious GTM AI OS — Claude Code Context

## Project Overview
Antarious is a dark-mode GTM AI Operating System for marketing agencies. Think: Bloomberg Terminal meets Notion meets a GTM agency dashboard.

## Design System (Antarious Brand Guidelines v1.1 — never deviate)
- **Product UI (default dark):** Marketing palette. Background: ink #1C2B27. Surfaces: #2D3F3B, #364a44, #3e554d. Primary: sage #4A7C6F. Secondary: sage-light #6BA396. Borders: sage-border rgba. Text: cream #FAF8F3, secondary #C8DDD8, muted #8B9E98. Text-inverse: ink #1C2B27.
- **Light theme:** Cream #F7F5F0, surfaces white/FAF8F3/EEF5F3. Primary: sage #4A7C6F. Ink text #1C2B27, #5A7168, #8B9E98. Borders #C8DDD8.
- **Semantic:** Red #EF4444, Amber #FBBF24, Green #10B981.
- **Font display:** 'Outfit', sans-serif. **Font body:** 'Plus Jakarta Sans', sans-serif. **Font mono:** 'JetBrains Mono', monospace.
- **Radius:** sm 6px, md 10px, card 14px, button 8px, input 10px.

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
Completed: tokens, store, toast, router, layout (AppLayout), sidebar, topbar, dashboard, campaigns (list, detail, all 8 tabs, outreach detail), agents (roster, detail), meta monitor, escalations, analytics, inbox, content library, knowledge base, query manager, notification center, settings, research (ICP builder, competitive intel), ABM engine, vertical playbooks, revenue (pipeline, customer success, forecast engine), ARIA Intelligence (ARIABrain), workspace (white-label config), dev (role switcher), client portal, onboarding, billing/upgrade, login, signup. Gap Mitigation (Sessions 1–8): ARIA Memory, Content Approval, MQL Handoff, Multi-Touch Attribution, Executive Digest, Campaign Briefer, Lead Enrichment, Board Report — all 8 pages implemented., Multi-Agent Runtime (AgentRegistry, AgentRuntime, MessageBus, TriggerEngine, SkillLoader), Memory Layer (MemoryLayer, KnowledgeBase, PatternStore, DecisionLog), Freya Orchestrator (workflows, delegation), Agent UI components, CRO suite (7 pages), SEO suite (4 pages), Marketing pages (3 pages), Settings agent config, Onboarding agent intro, UpgradePage agent tiers
In Progress: —
Not Started: —

## Multi-Agent Architecture

### The 8 Agents
| Agent | ID | Role | Skills | Autonomy |
|-------|-----|------|--------|----------|
| Freya | `freya` | Orchestrator | All 34 | autonomous |
| Strategist | `strategist` | Specialist | content-strategy, launch-strategy, marketing-ideas, marketing-psychology, pricing-strategy, product-marketing-context | act_with_approval |
| Copywriter | `copywriter` | Specialist | copywriting, copy-editing, ad-creative, social-content, email-sequence, lead-magnets | act_with_approval |
| Analyst | `analyst` | Specialist | analytics-tracking, seo-audit, ai-seo, site-architecture, programmatic-seo, schema-markup, customer-research, competitor-alternatives | act_with_approval |
| Prospector | `prospector` | Specialist | customer-research, cold-email, revops, sales-enablement | act_with_approval |
| Optimizer | `optimizer` | Specialist | page-cro, form-cro, signup-flow-cro, onboarding-cro, popup-cro, paywall-upgrade-cro, ab-test-setup | act_with_approval |
| Outreach | `outreach` | Specialist | cold-email, email-sequence, social-content, referral-program, free-tool-strategy | act_with_approval |
| Revenue | `revenue` | Specialist | revops, sales-enablement, pricing-strategy, churn-prevention, referral-program | act_with_approval |
| Guardian | `guardian` | Specialist | copy-editing, product-marketing-context | suggest_only |

### Agent System Files
- `src/agents/AgentRegistry.js` — Agent definitions, skills, triggers, canDelegate
- `src/agents/AgentRuntime.js` — Agent lifecycle: idle→thinking→executing→done/error
- `src/agents/MessageBus.js` — Inter-agent messaging (TASK_REQUEST, TASK_RESULT, TRIGGER, APPROVAL_REQUEST, ESCALATION, INSIGHT)
- `src/agents/TriggerEngine.js` — USER_ACTION, DATA_CHANGE, SCHEDULE, AGENT_MESSAGE triggers
- `src/agents/SkillLoader.js` — 34 marketing skills registry with metadata
- `src/memory/MemoryLayer.js` — Shared memory: brand, audience, campaigns, performance, knowledge, decisions namespaces
- `src/memory/KnowledgeBase.js` — Document ingestion + fact extraction + semantic query
- `src/memory/PatternStore.js` — Learned behavioral patterns
- `src/memory/DecisionLog.js` — Full audit trail per agent
- `src/freya/FreyaEngine.js` — Freya orchestrator with delegate() and orchestrate() methods
- `src/freya/workflows/registry.js` — 6 pre-built multi-agent workflow definitions

### Agent Hooks
- `useAgent(agentId)` — activate/cancel agent, get live status + feed
- `useMemory(namespace)` — read/write memory namespace
- `useFreya()` — chat, delegate, agent statuses, pending approvals
- `useTrigger(triggerId)` — fire triggers
- `useAgentFeed(limit)` — global agent activity feed

### Agent UI Components (src/components/agents/)
- `AgentAvatar` — emoji avatar with status ring
- `AgentStatusBar` — horizontal bar showing all agent statuses
- `AgentCard` — agent card for roster view
- `AgentFeed` — scrollable activity feed
- `AgentChatBubble` — chat message with agent attribution
- `AgentApprovalCard` — pending approval action card
- `AgentWorkflowVisualizer` — step-chain visualization for active workflow
- `AgentThinking` — loading/thinking animation
- `AgentResultPanel` — structured output renderer per result type

### Zustand Store — Agent Slice
```js
s.agents.statuses[agentId]  // { status, currentTask, lastResult, error }
s.agents.messageHistory      // MessageBus ring buffer mirror
s.agents.activeWorkflow      // currently running workflow id or null
s.agents.pendingApprovals    // actions awaiting human approval
s.agents.agentFeed           // chronological activity feed
```

### Pre-built Workflows (src/freya/workflows/)
| Workflow | Steps | Time | Credits |
|----------|-------|------|---------|
| Campaign Launch | strategist→copywriter→guardian→outreach | 8-12m | 120 |
| Content Creation | strategist→copywriter→guardian | 5-8m | 80 |
| Lead to Customer | prospector→analyst→outreach→revenue | 10-15m | 100 |
| Performance Review | analyst→strategist→freya | 5-7m | 60 |
| SEO Audit | analyst→copywriter→optimizer | 8-12m | 90 |
| A/B Test | optimizer→copywriter→analyst | 6-10m | 70 |

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
- `/aria/memory` — ARIA Memory Engine (4 namespaces, health score, test chat)
- `/campaigns/approvals` — Content Approval Workflow (5-stage chain, queue tabs, comments, history)
- `/campaigns/briefer` — ARIA Campaign Briefer (goal input → generation → brief doc with budget, KPIs, checklist)
- `/crm/handoff` — MQL Handoff Center (live queue, lead brief, SDR assign, ARIA draft, handoff timeline)
- `/crm/enrichment` — Lead Enrichment Center (health dash, queue/duplicates/incomplete tabs, intent feed, detail modal)
- `/analytics/attribution` — Multi-Touch Attribution (5 models, channel chart, deal journey, ARIA insights)
- `/reports/digest` — Weekly Executive Digest (narrative, 6 KPIs, anomalies, priority actions, schedule config)
- `/reports/board` — Board Report Generator (configure → generate → preview with slide nav, narrative editor, export PDF/PPTX)
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
- ARIAMemoryEngine, ContentApprovalWorkflow, MQLHandoffCenter, MultiTouchAttribution, WeeklyExecutiveDigest, ARIACampaignBriefer, LeadEnrichmentCenter, BoardReportGenerator
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
Every page that uses gated features must use the Antarious plan gate system. At the start of each new feature session, apply this pattern.

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
- **Co-pilot display name:** Freya (per Antarious Brand Guidelines). User-facing copy uses "Freya"; code/keys remain `aria` (e.g. ariaOpening, src/aria/).
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

## New patterns (Gap Mitigation — Sessions 1–8)
- **Memory context injection:** Persistent ARIA memory (brand, audience, campaigns, performance) in store; `buildSystemPrompt(context)` appends "ARIA MEMORY CONTEXT" when `context.persistentMemory` is passed by callers of `aria.chat()`.
- **Approval state flow:** Content approval chain `draft` → `legal` → `brand` → `cmo` → `published`; compliance score; comments and history per item; BulkApproveBar for multi-select.
- **MQL urgency colors:** Mint &lt;1h, amber 1–4h, red/OVERDUE 4h+; handoff metrics (avg handoff time vs target, queue, assigned today, response rate); lead brief + SDR assign + ARIA first-touch draft.
- **Attribution models:** `first_touch` | `last_touch` | `linear` | `w_shaped` (default) | `time_decay`; channel revenue/pipeline chart; deal journey touchpoint timeline; ARIA insight cards.
- **Board slides light theme:** Slide canvas uses light background `#F8F9FA`; Antarious app shell stays dark; narrative teal underline for ARIA-generated; export PDF/PPTX prominent.
- **Enrichment sources:** Clearbit, LinkedIn, Bombora, G2; data quality score ring; completeness bar mint/amber/red; duplicate match fields highlighted; intent feed with optional surge banner.
- **Memory namespaces:** brand, audience, campaigns, performance (Session 1).
- **MQL states:** `raw` → `enriched` → `scored` → `mql` → `assigned` → `contacted`.

## Gap Mitigation — Post-build summary
All 8 CMO-validated gap sessions are implemented. Routes and one-line descriptions:

| Route | Page | Description |
|-------|------|-------------|
| `/aria/memory` | ARIAMemoryEngine | ARIA Memory Engine: 4 namespaces, health score, test chat. |
| `/campaigns/approvals` | ContentApprovalWorkflow | Content Approval: 5-stage chain, queue tabs, comments, history. |
| `/crm/handoff` | MQLHandoffCenter | MQL Handoff: live queue, lead brief, SDR assign, ARIA draft, handoff timeline. |
| `/analytics/attribution` | MultiTouchAttribution | Multi-Touch Attribution: 5 models, channel chart, deal journey, ARIA insights. |
| `/reports/digest` | WeeklyExecutiveDigest | Executive Digest: narrative, 6 KPIs, anomalies, priority actions, schedule config. |
| `/campaigns/briefer` | ARIACampaignBriefer | Campaign Briefer: goal input → generation → brief with budget, KPIs, checklist. |
| `/crm/enrichment` | LeadEnrichmentCenter | Lead Enrichment: health dash, queue/duplicates/incomplete tabs, intent feed, detail modal. |
| `/reports/board` | BoardReportGenerator | Board Report: configure → generate → preview, slide nav, narrative editor, export PDF/PPTX. |

**Gaps closed:** All 8 critical CMO gaps from the Gap Mitigation plan are addressed. Target: CMO readiness score 7.5+/10 (memory, approvals, handoff speed, attribution, digest, briefer, enrichment, board reporting).

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
