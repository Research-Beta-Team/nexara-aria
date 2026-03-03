# NEXARA Tier 1 — Workspace-Personalized Platform — Full Build Plan

**Branch:** `feature/tier1-workspace-platform`  
**Constraints:** Inline styles only · Colors from `src/tokens.js` only · One component per file · Every button toasts or navigates · Functional components + hooks only · All mock data in `src/data/`

---

## 1. Files to CREATE (by phase)

### Phase 0 — Foundation

| File | Purpose |
|------|--------|
| `src/data/workspaceTemplates.js` | 6 industry templates (b2b-saas, ecommerce-d2c, professional-services, ngo-fundraising, local-business-bd, custom) with layout, agents, aria, workflows, kpis, recommendedPlaybooks |
| `src/data/clientWorkspaceProfiles.js` | 4 mock clients (Acme Corp, GlowUp Cosmetics, TechBridge Consulting, Grameen Impact Fund) with templateBase + overrides, clientPreferences, clientEditableFields |
| `src/context/WorkspaceContext.jsx` | React context: reads activeClientId from store → looks up profile → provides merged config + helpers (isModuleVisible, isAgentActive, getAriaConfig, getKPIs, getApprovalChain, canClientEdit, getClientPreference, setClientPreference) |
| `src/hooks/useWorkspace.js` | Convenience hook that consumes WorkspaceContext |

**Note:** `src/tokens.js` and `src/store/useStore.js` already exist; Phase 0 **modifies** them (see §2).  
**New data files** (client-aware mock data, keyed or filterable by clientId):  
`src/data/dashboard.js` (replace or extend), `src/data/campaigns.js` (extend), `src/data/agents.js` (extend), `src/data/escalations.js` (extend), `src/data/inbox.js` (extend), `src/data/outreach.js` (new if missing), `src/data/content.js` (extend), `src/data/knowledge.js` (new), `src/data/analytics.js` (new), `src/data/playbooks.js` (extend).  
If any of these already exist, **modify** to be client-aware; otherwise **create**.

### Phase 1 — Core layout

| File | Purpose |
|------|--------|
| `src/components/layout/ClientSwitcher.jsx` | Dropdown: client avatar/initial + name + template badge + status dot; on select calls setActiveClient(id) |

**Note:** `App.jsx`, `AppLayout.jsx`, `ClientLayout.jsx`, `Sidebar.jsx`, `TopBar.jsx`, `Toast.jsx`, `useToast.js` exist; Phase 1 **modifies** them (see §2).

### Phase 2 — Dashboard

| File | Purpose |
|------|--------|
| `src/components/dashboard/KPIHeader.jsx` | 3–4 KPI cards in a row: label, value, target, progress bar, direction; green/amber/red by % of target |
| `src/components/dashboard/CampaignHealthCards.jsx` | Grid of campaign cards: name, status badge, goal progress, metrics, channel labels; click → /campaigns/:id; Pause → toast |
| `src/components/dashboard/ARIAInsightStrip.jsx` | Expandable strip: persona label, aria.greeting, 3 insight rows + "Ask ARIA" buttons |
| `src/components/dashboard/MetaPerformanceWidget.jsx` | Spend gauge, CPL trend, leads; Recharts AreaChart; only if meta-monitoring visible |
| `src/components/dashboard/AgentActivityFeed.jsx` | Live feed of agent actions (workspace-active agents only); LIVE dot, scrollable, max 300px |
| `src/components/dashboard/EscalationMini.jsx` | Top 3 escalations; severity, title, time; "View all" → /escalations |
| `src/components/dashboard/PipelineFunnelWidget.jsx` | Funnel viz; only if pipeline visible |
| `src/components/dashboard/SocialReachWidget.jsx` | Social metrics placeholder card |
| `src/components/dashboard/DonorPipelineWidget.jsx` | Donor funnel placeholder (NGO) |
| `src/components/dashboard/ROASTrackerWidget.jsx` | ROAS tracker placeholder (e‑commerce) |

### Phase 3 — Campaign module

| File | Purpose |
|------|--------|
| `src/components/campaign/tabs/OverviewTab.jsx` | Funnel + channel breakdown + milestones |
| `src/components/campaign/tabs/StrategyTab.jsx` | Strategy brief, ICP, positioning, roadmap |
| `src/components/campaign/tabs/ContentTab.jsx` | Content items list + preview modal |
| `src/components/campaign/tabs/OutreachTab.jsx` | Sequence health + prospect list |
| `src/components/campaign/tabs/PaidAdsTab.jsx` | Meta/Google/LinkedIn ad performance |
| `src/components/campaign/tabs/AnalyticsTab.jsx` | Recharts, attribution, CAC |
| `src/components/campaign/tabs/CalendarTab.jsx` | Visual calendar of activities |
| `src/components/campaign/ContentPreviewModal.jsx` | Full-screen content preview modal |

**Note:** CampaignDetail, CampaignWizard, CampaignList, OutreachDetail pages exist; Phase 3 **modifies** them and adds/aligns tabs and wizard steps.

### Phase 4 — Agent roster

| File | Purpose |
|------|--------|
| `src/components/agents/AgentCard.jsx` | Active (green dot) / primary (gold star) / disabled (dimmed); action buttons or disabled |
| `src/components/agents/AgentOutputHistory.jsx` | Log of outputs with version, approval badges, confidence |

**Note:** `AgentRoster.jsx`, `AgentDetail.jsx` exist; **modify** to be workspace-aware.

### Phase 5 — Content, knowledge, inbox

(ContentLibrary, KnowledgeBase, UnifiedInbox pages exist; **modify** for workspace visibility and client-filtered data. No new components required unless we add ContentPreviewModal reuse.)

### Phase 6 — Operations

( EscalationQueue, QueryManager, Analytics, MetaMonitoring pages — use spec names; some exist as Escalations, QueryManager, Analytics, MetaMonitor. **Modify** for workspace awareness and full content.)

### Phase 7 — ARIA

| File | Purpose |
|------|--------|
| (ARIAPanel exists; **modify** for workspace persona, quick actions filtered by visible modules) |
| `src/pages/settings/ARIAPersonaConfig.jsx` | Exists; **modify** to 6 persona cards 3×2, context inputs, Rules of Engagement editor, live preview |
| `src/pages/ARIAKnowledge.jsx` | Exists; **modify** for Documents / Beliefs / Health / Teach ARIA |
| `src/pages/ARIAMomentOnboarding.jsx` | Exists; **modify** for 5-step flow, sets isOnboarded on completion |

### Phase 8 — Admin

| File | Purpose |
|------|--------|
| `src/pages/admin/WorkspaceTemplates.jsx` | Gallery of 6 templates; Preview Full Template modal; Assign to Client → toast |
| `src/pages/admin/CSMWorkspaceConfigurator.jsx` | Two-column: form (template, modules, agents, ARIA, KPI, workflow) + summary sidebar; Preview as Client, Save & Apply |
| `src/pages/admin/WorkspacePreview.jsx` | Full app in preview mode with amber banner; Exit Preview → configurator |

### Phase 9 — Client-facing

| File | Purpose |
|------|--------|
| `src/pages/settings/ClientWorkspacePreferences.jsx` | Your Settings (editable) + Managed Settings (read-only + "Request change" → toast); Save Preferences |
| (ClientPortal.jsx exists; **modify** for Overview / Approvals / Reports / Messages, light theme) |

### Phase 10 — Remaining full pages

(All listed in spec: ICPBuilder, IntentSignals, CompetitiveIntel, PipelineManager, ForecastEngine, CustomerSuccess, ABMEngine, VerticalPlaybooks, SocialMedia, Settings, BillingPlans, TeamManagement, WhiteLabelConfig, NotificationCenter. Most exist; **modify** to respect workspace visibility and full implementation.)

### Phase 11 — Polish

| File | Purpose |
|------|--------|
| (ARIA proactive alerts: floating cards from bottom-right, 3 timed alerts) — can be inside existing ARIAPanel or a small `ARIAProactiveAlerts.jsx` |
| Empty state component (reusable): `src/components/ui/EmptyState.jsx` | Centered illustration, headline, subtitle, single CTA |
| (Dev tools: Client Switcher, Role Switcher, Template Override at bottom of sidebar — **modify** Sidebar or existing RoleSwitcher / dev components) |

---

## 2. Files to MODIFY (summary)

### Phase 0

- **`src/tokens.js`**  
  Add `CLIENT_PORTAL_TOKENS` export: `{ bg, surface, border, primary, textPrimary, textSecondary }` with hex values for client portal light theme (#F8FAF9, #FFFFFF, #E2EBE6, #1A5C35, #1A2E22, #4A6B58). Keep existing C, F, R, S, shadows, makeStyles, card/button/input/label/flex utilities.

- **`src/store/useStore.js`**  
  Add state: `activeClientId: 'acme-corp'`, `workspaceProfiles: {}` (loaded from clientWorkspaceProfiles on init).  
  Add actions: `setActiveClient(clientId)`, `updateClientPreference(clientId, key, value)`, `updateWorkspaceConfig(clientId, config)`.  
  Keep: `currentRole`, `ariaOpen`, `notifications`, `toasts`, `toggleAria`, `addToast`, `removeToast`, etc.  
  Optionally derive `currentClient` (display name) from activeClientId + workspaceProfiles or keep separate.

- **`src/data/dashboard.js`**  
  Structure so data is keyed by clientId (e.g. `dashboardByClient[clientId]`: campaigns, agentFeed, escalations, metaStats, ariaInsights, chartData).

- **`src/data/campaigns.js`**  
  Ensure 4 campaigns per client, keyed or filterable by clientId.

- **`src/data/agents.js`**  
  Ensure 13 agent definitions with persona, skills, tool access, status.

- **`src/data/escalations.js`**, **`src/data/inbox.js`**, **`src/data/content.js`**  
  Key or filter by clientId.

- **`src/data/outreach.js`** (create if missing), **`src/data/knowledge.js`** (create if missing), **`src/data/analytics.js`** (create if missing), **`src/data/playbooks.js`** (extend to 8 vertical playbooks, client-aware if needed).

- **`src/index.css`**  
  Remove `@import "tailwindcss"` so styling is inline-only per spec; keep CSS variables and any minimal global resets.

### Phase 1

- **`src/App.jsx`**  
  Wrap all routes in `WorkspaceProvider`.  
  Add all routes from spec (see §3). Use `AppLayout` for dark app routes; `ClientLayout` for `/client-portal`.  
  Stub pages: one shared stub component (e.g. `ComingSoon`) for any route not yet built.  
  Align paths: `/revenue/pipeline`, `/revenue/forecast`, `/revenue/customers`, `/analytics/meta` → MetaMonitoring, `/research/competitive`, `/escalations`, `/querymanager`, `/settings/workspace-preferences`, `/settings/aria`, `/aria/knowledge`, `/billing` → BillingPlans, `/admin/workspace-templates`, `/admin/clients/:clientId/workspace`, `/admin/clients/:clientId/preview`, `/workspace/team`, `/workspace/whitelabel`, `/notification-center`, `/onboarding` → ARIAMomentOnboarding.

- **`src/components/layout/AppLayout.jsx`**  
  Ensure shell: sidebar + topbar + main content; no structural change unless needed for WorkspaceProvider placement (provider is in App.jsx).

- **`src/components/layout/ClientLayout.jsx`**  
  Use CLIENT_PORTAL_TOKENS for light theme (apply to container/background).

- **`src/components/layout/Sidebar.jsx`**  
  Use `useWorkspace()`. Build `MODULE_TO_NAV_MAP` and section groups (MAIN, CAMPAIGNS, OUTREACH, RESEARCH, REVENUE, CONTENT, ANALYTICS, OPERATIONS). Filter nav items with `isModuleVisible()`, order with `layout.sidebarOrder`. Collapsible sections; only render section if at least one module visible. Bottom: ADMIN (Workspace Templates, Client Workspaces), Settings, Billing, ARIA Intelligence; current client name + template badge; ARIA floating button.

- **`src/components/layout/TopBar.jsx`**  
  Left: logo + ClientSwitcher (owner/csm only). Center: breadcrumb. Right: notification bell (count), ARIA toggle, user avatar + role badge.

- **`src/components/ui/Toast.jsx`** / **`src/hooks/useToast.js`**  
  Already present; no change unless we need to pass duration/type from new buttons.

### Phase 2

- **`src/pages/Dashboard.jsx`**  
  Read from useWorkspace(): KPI order, dashboardWidgets, dashboardLayout (2-col/3-col), aria.greeting. Render KPIHeader, then widget grid by widget id → component mapping (campaign_health → CampaignHealthCards, meta_spend → MetaPerformanceWidget, etc.).

### Phases 3–11

- **Campaign list/detail/wizard:** Use workspace template for default channel mix, recommended playbooks in wizard step 1; ensure all tabs and ContentPreviewModal are wired.
- **Agent roster/detail:** Filter and order by workspace active/disabled/primary; AgentCard and AgentOutputHistory as specified.
- **Content, Knowledge, Inbox:** Filter by activeClientId; Inbox only if `inbox` visible.
- **Escalations, QueryManager, Analytics, Meta:** Workspace-aware; Meta only if meta-monitoring visible.
- **ARIAPanel:** Persona from workspace; quick actions filtered by visible modules.
- **Admin pages:** New files as above; routing in App.jsx.
- **Client portal & preferences:** ClientLayout theme; ClientWorkspacePreferences form; ClientPortal tabs.
- **Research, revenue, social, playbooks, settings, billing, team, whitelabel, notification center:** Full implementations respecting workspace visibility.
- **Polish:** Proactive alerts (3 timed), EmptyState component, dev switchers in sidebar.

---

## 3. Dependency tree (high level)

```
data/*.js (workspaceTemplates, clientWorkspaceProfiles, dashboard, campaigns, …)
    ↓
useStore.js (activeClientId, workspaceProfiles, setActiveClient, …)
    ↓
WorkspaceContext.jsx (consumes store, merges template + profile, exposes helpers)
    ↓
useWorkspace.js (consumes context)
    ↓
Sidebar, TopBar, Dashboard, CampaignList, … (all pages/components that need workspace)
    ↓
App.jsx (WorkspaceProvider wraps routes; routes use AppLayout or ClientLayout)
```

- **Router** depends on App.jsx; App.jsx wraps with WorkspaceProvider and defines Routes.
- **AppLayout** → Sidebar (useWorkspace), TopBar (ClientSwitcher, notifications, ARIA).
- **Dashboard** → useWorkspace, KPIHeader, *Widget components, data from dashboard.js keyed by activeClientId.
- **Campaign** pages → useWorkspace for visibility; data from campaigns.js (and related) by clientId.
- **Agent** pages → useWorkspace (active/disabled/primary); data from agents.js.
- **ClientLayout** → uses CLIENT_PORTAL_TOKENS; ClientPortal uses client-scoped data.

---

## 4. Route table (final, from spec)

| Path | Layout | Page / Component |
|------|--------|-------------------|
| `/` | AppLayout | Dashboard |
| `/campaigns` | AppLayout | CampaignList |
| `/campaigns/:id` | AppLayout | CampaignDetail |
| `/campaigns/new` | AppLayout | CampaignWizard |
| `/outreach` | AppLayout | OutreachList (stub) |
| `/outreach/:id` | AppLayout | OutreachDetail |
| `/agents` | AppLayout | AgentRoster |
| `/agents/:id` | AppLayout | AgentDetail |
| `/content` | AppLayout | ContentLibrary |
| `/knowledge` | AppLayout | KnowledgeBase |
| `/inbox` | AppLayout | UnifiedInbox |
| `/analytics` | AppLayout | Analytics |
| `/analytics/meta` | AppLayout | MetaMonitoring |
| `/escalations` | AppLayout | EscalationQueue |
| `/querymanager` | AppLayout | QueryManager |
| `/social` | AppLayout | SocialMedia |
| `/research/icp` | AppLayout | ICPBuilder |
| `/research/intent` | AppLayout | IntentSignals |
| `/research/competitive` | AppLayout | CompetitiveIntel |
| `/revenue/pipeline` | AppLayout | PipelineManager |
| `/revenue/forecast` | AppLayout | ForecastEngine |
| `/revenue/customers` | AppLayout | CustomerSuccess |
| `/abm` | AppLayout | ABMEngine |
| `/playbooks` | AppLayout | VerticalPlaybooks |
| `/settings` | AppLayout | Settings |
| `/settings/workspace-preferences` | AppLayout | ClientWorkspacePreferences |
| `/settings/aria` | AppLayout | ARIAPersonaConfig |
| `/aria/knowledge` | AppLayout | ARIAKnowledge |
| `/billing` | AppLayout | BillingPlans |
| `/admin/workspace-templates` | AppLayout | WorkspaceTemplates |
| `/admin/clients/:clientId/workspace` | AppLayout | CSMWorkspaceConfigurator |
| `/admin/clients/:clientId/preview` | AppLayout | WorkspacePreview |
| `/workspace/team` | AppLayout | TeamManagement |
| `/workspace/whitelabel` | AppLayout | WhiteLabelConfig |
| `/notification-center` | AppLayout | NotificationCenter |
| `/onboarding` | None (full-screen) | ARIAMomentOnboarding |
| `/client-portal` | ClientLayout | ClientPortal |
| `/login`, `/signup` | Standalone | Login, Signup |
| `/for_startups/*` | ForStartupsLayout | (existing) |
| `*` | — | NotFound |

---

## 5. Rough layout sketches (per page)

### Dashboard
- **Top:** KPIHeader (3–4 cards in a row; metric, value, target, progress bar).
- **Body:** Grid (2 or 3 columns from workspace layout): widgets in order of dashboardWidgets (CampaignHealthCards, MetaPerformanceWidget, ARIAInsightStrip, AgentActivityFeed, EscalationMini, PipelineFunnelWidget, SocialReachWidget, DonorPipelineWidget, ROASTrackerWidget — only those enabled for workspace).
- **ARIA strip:** Expandable; persona + greeting + 3 insights + "Ask ARIA".

### Campaign list
- Header: title, "New Campaign" button, search, status filters.
- Grid of campaign cards (from mock keyed by activeClientId); click → detail.

### Campaign detail
- Header card: name, progress, 4 KPI boxes, status.
- Tabs: Overview | Strategy | Content | Outreach | Paid Ads | Analytics | Calendar | Plan.
- Each tab: content area with relevant components (funnel, strategy brief, content list with preview modal, etc.).

### Campaign wizard
- Stepper: 1 Basics → 2 ICP → 3 Channel mix → 4 Budget → 5 Content brief → 6 Sequence → 7 Review.
- Pre-fill from workspace template; Step 1 quick-start from recommended playbooks.

### Agent roster
- Grid of AgentCards: primary first (gold star), then active, then disabled (dimmed). Buttons or disabled per status.

### Agent detail
- Header: name, persona, status; skills; tool connections.
- Tabs: Output history, Performance metrics. "Test Agent" → toast.

### Content library
- Filters: type, status, agent. Grid of content cards; click → ContentPreviewModal.

### Knowledge base
- Upload zone (drag/drop). Document cards with category badges (Brand, ICP, Competitor, Campaign Data, Product).

### Unified inbox
- Left: conversation list (unread badges). Right: thread view + reply input. "Let ARIA handle this" per thread. Only if inbox visible.

### Escalation queue
- Prioritized cards: severity, agent source, situation, recommendation, confidence; approve/reject/escalate, assign dropdown.

### Query manager
- Left: thread list. Right: message thread. Tags: campaign, client, agent task.

### Analytics
- Full dashboard: channel attribution, funnel, CAC, anomaly detection; Recharts in ResponsiveContainer with pixel height.

### Meta monitoring
- Spend gauge, CTR/CPM/CPL trends, creative ranking, audience health, alerts. Only route if meta-monitoring visible.

### ARIA panel (slide-out)
- 40% width, right. Header: "ARIA · [persona]". Chat + quick actions (filtered by visible modules). Verbosity chip; custom rules chip.

### ARIAPersonaConfig
- 3×2 grid of 6 persona cards. Context inputs (company, industry, market). Rules of Engagement editor (toggle, edit, TONE/STRATEGY/FORMAT). Live preview chat.

### ARIAKnowledge
- Tabs: Documents, Beliefs, Health (radar). "Teach ARIA" section: upload or write rule.

### ARIAMomentOnboarding
- Full-screen, 5 steps: 1 Drop zone, 2 Reading animation (3s), 3 Extracted preview, 4 Auto-fill demo, 5 Success + "Go to Dashboard". Set isOnboarded on complete.

### WorkspaceTemplates (admin)
- 3-column grid of template cards (name, description, modules pills, agents, KPIs, persona). [Preview Full Template] modal; [Assign to Client] → toast.

### CSMWorkspaceConfigurator (admin)
- 65% form: template picker, module toggles (4-col), agent roster (active/primary), ARIA config, KPI builder, workflow config. 35% sticky summary. [Preview as Client] → preview route; [Save & Apply] → store + toast.

### WorkspacePreview (admin)
- Amber banner: "PREVIEW MODE — Viewing as: [Client Name]". [Exit Preview]. Rest of app as that client (sidebar, dashboard, data).

### ClientWorkspacePreferences
- "Your Settings": widget order, notification frequency, report format, report day, ARIA verbosity, auto-approve. "Managed Settings": read-only + "Request change" → toast. [Save Preferences].

### Client portal (light theme)
- Horizontal nav: Overview | Approvals | Reports | Messages. Overview: campaign health + KPI summary + timeline. Approvals: pending items, approve/reject. Reports: list. Messages: thread with CSM.

### BillingPlans
- Current plan (Tier 1 Hybrid context), plan display.

### Remaining (research, revenue, social, playbooks, settings, team, whitelabel, notification center)
- Full pages; sidebar visibility from workspace; all buttons toast or navigate.

### Empty states (list pages)
- Centered area: illustration, headline, subtitle, one CTA button.

### Dev tools (sidebar bottom, non-client roles)
- Client Switcher dropdown, Role Switcher dropdown, Template Override dropdown.

---

## 6. Verification checklist (post-build)

- [ ] Switching clients in TopBar updates sidebar, dashboard widgets, KPIs, ARIA greeting, agent roster, campaign data.
- [ ] B2B SaaS client: outreach, pipeline, ICP, 8 agents, CRO persona.
- [ ] E‑commerce client: social, meta monitor; no outreach, no pipeline; growth marketer persona.
- [ ] NGO client: content, social, inbox; no outreach, no meta monitoring; coordinator persona.
- [ ] Local BD client: simplified sidebar, Bengali–English ARIA greeting, Facebook-focused.
- [ ] Preview mode shows exactly what client would see.
- [ ] Client portal (light theme) works with correct data.
- [ ] Every button toasts or navigates.
- [ ] No hardcoded hex; all from tokens.js.
- [ ] Background #070D09 (dark app); client portal uses CLIENT_PORTAL_TOKENS.
- [ ] Recharts in ResponsiveContainer with pixel height.
- [ ] One component per file; inline styles only.

---

## 7. Checkpoint after each phase

**Do not commit.** After each phase, run the app locally to verify:

```bash
npm run dev
```

Then confirm the new/updated screens and behavior work before starting the next phase.
