# NEXARA — API Documentation

**Version:** 1.0 (Prototype — intended surface)  
**Audience:** Engineering, integration partners

---

## 1. Overview

In the **prototype**, all data is client-side (Zustand + mock data); there is no backend API. This document describes the **intended** API surface for production and the **ARIA tool interface** used by the AI engine.

---

## 2. ARIA Tools (Agent Capabilities)

ARIA uses 12 tools when calling the Anthropic API. Each tool has a name, description, and input schema. Execution is mocked in the prototype via `ARIAToolExecutor.js`.

| Tool | Purpose |
|------|---------|
| `search_prospects` | Search prospects by ICP (query, filters, limit) |
| `enrich_contact` | Enrich contact/company (name, email, company, linkedin_url) |
| `read_document` | Extract from uploaded document (document_id, extract_type) |
| `extract_from_image` | Extract from image (image_id, extract_type) |
| `fill_form` | Auto-fill app form (form_id, fields) |
| `query_campaign_data` | Query performance, prospects, content, agents, pipeline |
| `update_campaign` | Pause/resume, update budget, ICP, prospects |
| `create_content` | Generate email, LinkedIn, ad copy, blog, brief, one-pager |
| `send_outreach` | Send/schedule email, LinkedIn, WhatsApp |
| `analyze_performance` | Analyze metrics, trends, anomalies |
| `schedule_action` | Schedule future action (send, run agent, report, pause) |
| `escalate_to_human` | Create escalation for human review |

**Input schemas:** See `src/aria/ARIATools.js` for full JSON schemas (Anthropic tool-definition format).

---

## 3. Intended REST API (Production)

Planned resource groups (not implemented in prototype):

| Area | Endpoints (planned) |
|------|----------------------|
| **Auth** | POST /auth/login, /auth/signup, /auth/refresh, /auth/logout |
| **Users** | GET/PATCH /users/me, GET /users (team) |
| **Workspaces** | GET/POST/PATCH /workspaces, /workspaces/:id |
| **Campaigns** | GET/POST/PATCH /campaigns, /campaigns/:id, /campaigns/:id/content, /campaigns/:id/prospects |
| **Content** | GET/POST/PATCH /content, /content/:id/approvals |
| **Inbox** | GET /inbox, POST /inbox/:id/reply |
| **Escalations** | GET /escalations, PATCH /escalations/:id |
| **ARIA** | POST /aria/chat (streaming), POST /aria/tools/execute (server-side tool execution) |
| **Billing** | GET /billing/plan, POST /billing/upgrade, GET /billing/usage, POST /billing/credits/topup |
| **Connections** | GET/PATCH /connections (website, crm, ads) |

**Authentication:** Bearer token or session cookie (TBD).

---

## 4. ARIA Chat API (Anthropic)

- **Model:** `claude-sonnet-4-20250514`.
- **Flow:** Client sends messages; backend (or client in demo) calls Anthropic Messages API with tools; tool calls are executed (mock in prototype); results appended and streamed back.
- **Environment:** `VITE_ANTHROPIC_API_KEY` (client in prototype; should move to server in production).

---

## 5. Rate Limits & Quotas (Planned)

- **Per plan:** See `src/config/plans.js` — e.g. `apiCallsPerMonth`, `intentSignalAccounts`, `whatsappMessages`.
- **Credits:** Consumed per AI action; top-up at `topUpPricePer1k` per 1k credits (plan-dependent).
- **ARIA:** Production should proxy through backend to enforce per-workspace rate limits and cost caps.

---

## 6. Webhooks (Planned)

- **Outbound:** Campaign state changes, content approved, escalation created/resolved (optional).
- **Inbound:** CRM/ads platform events (e.g. lead created, ad spend) — integration-dependent.

---

## 7. SDK / Client (Future)

- No official SDK in prototype. Production may offer JS/TS or server SDK for API access (Scale/Agency).
