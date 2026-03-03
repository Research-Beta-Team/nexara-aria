# NEXARA — User Flow Examples

Step-by-step flows for key features. Use these for QA, onboarding, and product specs.

---

## 1. Admin: Preview a client workspace

**Actor:** CSM or Owner  
**Goal:** See the app exactly as a specific client would see it.

| Step | Action | Result |
|------|--------|--------|
| 1 | Go to **Admin → Client Workspaces** (`/admin/clients`) | List of clients with "Configure workspace" and "Preview" per row |
| 2 | Click **Preview** for a client (e.g. GlowUp Cosmetics) | Navigate to `/admin/clients/glowup-cosmetics/preview` |
| 3 | (Automatic) | Store switches to "view as" that client; redirect to Dashboard (`/`) |
| 4 | See amber banner at top: **PREVIEW MODE — Viewing as: GlowUp Cosmetics** | Sidebar, dashboard, and all data reflect that client’s workspace |
| 5 | Navigate to other sections (Campaigns, Social, Content, etc.) | Same client context; banner stays visible |
| 6 | Click **Exit Preview** | Restore previous client; navigate to `/admin/clients/glowup-cosmetics/workspace` (configurator) |

**Alternative entry:** From **CSM Workspace Configurator** for a client, click **Preview as Client** → same flow from step 3.

---

## 2. Admin: Assign a template to a client

**Actor:** CSM  
**Goal:** Assign a workspace template to a client from the template gallery.

| Step | Action | Result |
|------|--------|--------|
| 1 | Go to **Admin → Workspace Templates** (`/admin/workspace-templates`) | 3-column grid of templates (B2B SaaS, E‑commerce D2C, Professional Services, NGO Fundraising, etc.) |
| 2 | Click **Preview Full Template** on one card | Modal opens with full template details (modules, agents, ARIA, KPIs, workflows) |
| 3 | Close modal | Back to grid |
| 4 | Click **Assign to Client** on same template | Modal: dropdown to pick a client |
| 5 | Select client, confirm | `updateWorkspaceConfig` called; success toast; modal closes |

---

## 3. Admin: Configure a client workspace and save

**Actor:** CSM  
**Goal:** Customize a client’s workspace (modules, agents, ARIA, workflow) and persist.

| Step | Action | Result |
|------|--------|--------|
| 1 | Go to **Admin → Client Workspaces** → **Configure workspace** for a client | Navigate to `/admin/clients/:clientId/workspace` (CSM Workspace Configurator) |
| 2 | Change **Template** (if desired) | Summary sidebar and form update |
| 3 | Toggle **modules** (e.g. turn off Outreach, turn on Social) | Summary reflects visible modules |
| 4 | Set **active/primary agents** | Summary shows agent list |
| 5 | Edit **ARIA** (persona, greeting) | Summary shows ARIA config |
| 6 | Adjust **workflow** (escalation threshold, auto-approve) | Summary updates |
| 7 | Click **Save & Apply** | `updateWorkspaceConfig`; success toast |
| 8 | Click **Preview as Client** | Same as flow 1 from step 3 |

---

## 4. User: Switch client (daily context switch)

**Actor:** Owner or CSM  
**Goal:** Change the active client to work in another workspace.

| Step | Action | Result |
|------|--------|--------|
| 1 | In TopBar, open **Client Switcher** (avatar/initial + client name) | Dropdown with all clients; template badge and status per option |
| 2 | Select a different client (e.g. TechBridge Consulting) | `setActiveClient(clientId)`; store updates |
| 3 | — | Sidebar, dashboard, campaigns, outreach, content, etc. all show that client’s data and config |
| 4 | Navigate to any page | Context remains the selected client until switched again |

---

## 5. User: Connect a social account (Social page)

**Actor:** Media buyer or content strategist  
**Goal:** Connect LinkedIn or Meta/Instagram for the current client.

| Step | Action | Result |
|------|--------|--------|
| 1 | Go to **Social** (`/social`) | Social dashboard: connected accounts, KPIs, reach chart, recent posts |
| 2 | Click **Connect account** (or equivalent CTA) | Connect Account modal opens |
| 3 | Choose platform (e.g. LinkedIn) | Option selected |
| 4 | Click **Authorize & connect** | Simulated OAuth; modal closes; new account appears in connected list; toast |
| 5 | (Optional) Click **Disconnect** on an account | Confirm modal → account removed from list; toast |

---

## 6. User: Edit and reorder posts in a social campaign

**Actor:** Content strategist  
**Goal:** Change copy and order of posts in a social campaign.

| Step | Action | Result |
|------|--------|--------|
| 1 | Go to **Social** → **Social campaigns** section | List of campaigns |
| 2 | Click a campaign (e.g. "Q2 Launch") | Navigate to `/social/campaigns/:campaignId` |
| 3 | See ordered list of posts | Each row: channel, content preview, Move up / Move down, Edit |
| 4 | Click **Edit** on a post | Edit Post modal: channel + content fields |
| 5 | Change content, save | Modal closes; list updates; toast |
| 6 | Click **Move up** / **Move down** | Order changes; `setSocialCampaignPosts`; list re-renders |

---

## 7. User: View outreach and open a prospect

**Actor:** SDR or CSM  
**Goal:** Filter prospects and open prospect detail.

| Step | Action | Result |
|------|--------|--------|
| 1 | Go to **Outreach** (`/outreach`) | Prospect list for current client; stats; filters (All / Replied / High intent / In sequence) |
| 2 | Use **search** or **filters** | List updates |
| 3 | Click a row | Navigate to `/campaigns/c1/prospect/:id` (OutreachDetail) |
| 4 | View thread, take action | Per existing OutreachDetail behavior |

---

## 8. User: Access client portal (Agency plan only)

**Actor:** Owner/CSM (to show) or Client (to use)  
**Goal:** Open the client-facing portal.

| Step | Action | Result |
|------|--------|--------|
| 1 | User on **Starter / Growth / Scale** plan goes to `/client-portal` | Full-page message: "Client portal is only available on the Agency plan" + **Upgrade to Agency** CTA |
| 2 | User on **Agency** plan goes to `/client-portal` | ClientLayout (light theme); ClientPortal with tabs: Overview, Approvals, Reports, Messages |

---

## 9. New user: ARIA Moment onboarding

**Actor:** New user (post-signup)  
**Goal:** Complete 5-step onboarding (extract company context, see auto-fill demo, land on dashboard).

| Step | Action | Result |
|------|--------|--------|
| 1 | Land on onboarding route (e.g. `/onboarding` or ARIAMomentOnboarding) | Step 1: Drop zone / upload for company context |
| 2 | Upload or provide input | Step 2: Reading animation (~3s) |
| 3 | — | Step 3: Extracted preview (company/role/market, etc.) |
| 4 | — | Step 4: Auto-fill demo (e.g. campaign brief pre-filled) |
| 5 | Click **Go to Dashboard** (or equivalent) | `isOnboarded` set; redirect to Dashboard (`/`) |

---

## 10. User: Create a new campaign (wizard)

**Actor:** GTM strategist or CSM  
**Goal:** Start a new campaign using the wizard.

| Step | Action | Result |
|------|--------|--------|
| 1 | Go to **Campaigns** → **New Campaign** (or `/campaigns/new`) | Campaign wizard opens |
| 2 | Step 1 — Basics: name, goal; optional quick-start from **recommended playbooks** (from workspace template) | Next |
| 3 | Step 2 — ICP: select or define ICP | Next |
| 4 | Step 3 — Channel mix (defaults from workspace) | Next |
| 5 | Step 4 — Budget | Next |
| 6 | Step 5 — Content brief | Next |
| 7 | Step 6 — Sequence (if outreach visible) | Next |
| 8 | Step 7 — Review | Submit → campaign created; toast; navigate to campaign detail or list |

---

## 11. User: Open ARIA and ask a question

**Actor:** Any role  
**Goal:** Use ARIA for insights or actions in context of the current client.

| Step | Action | Result |
|------|--------|--------|
| 1 | Click **ARIA** (sidebar or TopBar) | ARIA panel slides in (right, ~40% width) |
| 2 | See header: **ARIA · [persona]** and **greeting** from workspace ARIA config | Quick actions filtered by visible modules |
| 3 | Type a question or click a quick action | Chat response (mock or real); context = active client + current page |
| 4 | Close panel | Panel slides out; state preserved for next open |

---

## 12. User: Handle an escalation

**Actor:** CSM or Owner  
**Goal:** Review and approve/reject an escalated item.

| Step | Action | Result |
|------|--------|--------|
| 1 | See **Escalation** widget on Dashboard (top N) or go to **Escalations** (`/escalations`) | List of escalation cards (severity, title, agent, recommendation) |
| 2 | Click **View all** (from widget) or open a card | Escalation queue or detail view |
| 3 | Choose **Approve** / **Reject** / **Escalate** (and optionally assign) | Action recorded; toast; item removed or updated in list |

---

## Flow summary table

| # | Flow | Primary route(s) | Key store/context |
|---|------|------------------|--------------------|
| 1 | Workspace preview | `/admin/clients/:id/preview` → `/` | `setPreviewAsClient`, `exitPreview`, `previousClientIdBeforePreview` |
| 2 | Assign template to client | `/admin/workspace-templates` | `updateWorkspaceConfig` |
| 3 | Configure client workspace | `/admin/clients/:id/workspace` | `updateWorkspaceConfig`, workspace profiles |
| 4 | Switch client | TopBar Client Switcher | `setActiveClient`, `activeClientId` |
| 5 | Connect social account | `/social` | `addConnectedAccount`, `connectedAccounts` |
| 6 | Edit/reorder social posts | `/social/campaigns/:id` | `setSocialCampaignPosts`, `updateSocialPost` |
| 7 | Outreach → prospect detail | `/outreach` → `/campaigns/c1/prospect/:id` | `activeClientId` for prospect list |
| 8 | Client portal (Agency) | `/client-portal` | Plan feature `clientPortal`, `ClientPortalGuard` |
| 9 | ARIA Moment onboarding | `/onboarding` | `isOnboarded` |
| 10 | New campaign wizard | `/campaigns/new` | Workspace template, playbooks |
| 11 | ARIA panel | Global (sidebar/TopBar) | `useWorkspace()` → ARIA config, persona |
| 12 | Escalation queue | `/escalations`, Dashboard widget | Client-filtered escalations |

---

*Last updated to match workspace preview, social, outreach, client portal guard, and admin flows.*
