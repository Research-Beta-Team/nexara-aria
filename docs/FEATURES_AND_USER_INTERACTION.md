# NEXARA — Features List & User Interaction by Role

**Version:** 1.0 (Prototype)  
**Audience:** Product, CS, Board

---

## 1. Features by Plan Tier

| Feature | Starter | Growth | Scale | Agency |
|---------|---------|--------|-------|--------|
| **Core** | | | | |
| Campaigns | ✓ | ✓ | ✓ | ✓ |
| Campaign wizard | ✓ | ✓ | ✓ | ✓ |
| Content library | ✓ | ✓ | ✓ | ✓ |
| Knowledge base | ✓ | ✓ | ✓ | ✓ |
| Escalation queue | ✓ | ✓ | ✓ | ✓ |
| Dashboard | ✓ | ✓ | ✓ | ✓ |
| Basic analytics | ✓ | ✓ | ✓ | ✓ |
| Calendar view | ✓ | ✓ | ✓ | ✓ |
| Vertical playbooks | ✓ | ✓ | ✓ | ✓ |
| **Channels** | | | | |
| Email outreach | ✓ | ✓ | ✓ | ✓ |
| Meta ads monitoring | ✓ | ✓ | ✓ | ✓ |
| LinkedIn outreach | — | ✓ | ✓ | ✓ |
| WhatsApp outreach | — | ✓ | ✓ | ✓ |
| Meta/Google/LinkedIn ads mgmt | — | ✓ | ✓ | ✓ |
| **Growth+** | | | | |
| Advanced analytics | — | ✓ | ✓ | ✓ |
| Unified inbox | — | ✓ | ✓ | ✓ |
| ABM engine | — | ✓ | ✓ | ✓ |
| Intent signals | — | ✓ | ✓ | ✓ |
| ICP builder | — | ✓ | ✓ | ✓ |
| ICP scoring | — | ✓ | ✓ | ✓ |
| Pipeline manager | — | ✓ | ✓ | ✓ |
| Gantt plan | — | ✓ | ✓ | ✓ |
| Outcome billing | — | ✓ | ✓ | ✓ |
| Role-based access | — | ✓ | ✓ | ✓ |
| Query manager | — | ✓ | ✓ | ✓ |
| **Scale+** | | | | |
| Competitive intel | — | — | ✓ | ✓ |
| Predictive forecasting | — | — | ✓ | ✓ |
| Customer success | — | — | ✓ | ✓ |
| White-label | — | — | ✓ | ✓ |
| API access | — | — | ✓ | ✓ |
| Custom agents | — | — | ✓ | ✓ |
| ARIA Voice | — | — | ✓ | ✓ |
| Data warehouse sync | — | — | ✓ | ✓ |
| **Agency only** | | | | |
| Client portal | — | — | — | ✓ |
| Cross-client analytics | — | — | — | ✓ |
| Sub-billing | — | — | — | ✓ |

---

## 2. Plan Limits (Summary)

| Limit | Starter | Growth | Scale | Agency |
|-------|---------|--------|-------|--------|
| Active campaigns | 2 | Unlimited | Unlimited | Unlimited |
| Team seats | 3 | 10 | 25 | Unlimited |
| Workspaces | 1 | 3 | 10 | Unlimited |
| Client portals | 0 | 3 | 10 | Unlimited |
| Credits/month | 5,000 | 25,000 | 100,000 | 500,000 |
| Intent signal accounts | 0 | 500 | Unlimited | Unlimited |
| Competitor tracking | 0 | 3 | Unlimited | Unlimited |
| Named accounts (ABM) | 0 | 50 | Unlimited | Unlimited |
| WhatsApp messages | 0 | 1,000 | Unlimited | Unlimited |
| API calls/month | 0 | 0 | 10,000 | Unlimited |
| ARIA Voice minutes | 0 | 0 | 500 | Unlimited |
| Custom agents | 0 | 0 | 1 | Unlimited |

---

## 3. User Roles & How They Interact

| Role | Who | Sidebar | ARIA opening / focus | Escalations | Inbox | Team |
|------|-----|---------|----------------------|-------------|-------|------|
| **Owner/CEO** | Full control | Full | Decisions, risk, weekly brief | Full | Full | Full |
| **Founder** | Same as owner, compact nav | Compact (5 items) | Same as owner | Full | Full | Full |
| **Advisor** | Strategy | Full | Strategy, competitive scan, memos | Full | Full | Full |
| **CSM** | Client success | CSM subset | Call prep, reports, check-ins | Full | Full | No |
| **Media buyer** | Ads | Media/revenue/content/ads | Spend, audiences, performance | Full | No | — |
| **Content strategist** | Content | Content + ARIA | Reviews, brand, calendar | Full | Full | No |
| **SDR** | Outreach | Ops, campaigns, admin | Replies, next contact, follow-ups | No | Full | — |
| **Analyst** | Data | Ops, research, revenue | Reports, performance breakdown | Read-only | No | — |
| **Client** | External client | Minimal (Dashboard, Content, Inbox, Settings) | Results, goals, next steps | No | Full | — |

- **Same URL, different experience:** Dashboard, Campaign detail, Inbox, Escalations render differently (or hide sections) by role via `useRoleView()` and `roleConfig`.
- **Assigned clients:** CSM role has `assignedClients` (e.g. Medglobal, Delta Garments); used for filtering where applicable.

---

## 4. Support by Plan

| Plan | Support type | SLA | Strategy call | Dedicated Slack | Dedicated CSM |
|------|--------------|-----|---------------|-----------------|---------------|
| Starter | Community | — | No | No | No |
| Growth | Email | 4h | Yes | No | No |
| Scale | Slack | 1h | Yes | Yes | No |
| Agency | Dedicated CSM | 30 min | Yes | Yes | Yes |

---

## 5. Agent Availability by Plan

- **Starter:** copywriter, sdr, analytics, meta_monitor.
- **Growth:** adds icp_researcher, intent_monitor, seo, social_media, brand_guardian, linkedin_agent, meta_ads, google_ads, linkedin_ads, revops, aria_cs.
- **Scale:** adds competitor_intel, market_analyst, geo, video_script, abm_agent, whatsapp_agent, creative_intel, forecasting, cs_success, meeting_intel (aria_voice included).
- **Agency:** all agents including aria_voice.

Locked agents show upgrade CTAs; available agents can be assigned in campaign/workspace flows (prototype: mock).
