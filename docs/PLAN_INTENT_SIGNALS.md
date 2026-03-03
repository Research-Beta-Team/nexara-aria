# Intent Signals — Purpose, Workflow & User Interactions

## 1. Purpose

**Intent Signals** surfaces **buying signals before prospects contact you** (the "dark funnel"). It answers: *Which accounts are researching solutions like ours, right now?*

- **For the business:** Prioritize outreach on accounts showing intent (website visits, G2/Capterra research, job postings, content engagement, technographic and funding news). Improve reply rates and pipeline by acting on signals early.
- **For the user (SDR, CSM, owner):** One place to **monitor** intent, **triage** (filter by type/score, sort), **act** (add to sequence, start outreach, view in CRM, or dismiss), and optionally **ask ARIA** for next-best action or draft.

**Data sources (concept):** Website (visits, pricing/case-study views), G2/Capterra research, job postings, LinkedIn activity, email engagement, content downloads, technographic signals, funding/leadership news. Growth plan: 500 tracked accounts; Scale+: unlimited (per plans.js).

---

## 2. Workflow (how the module works)

1. **Monitor** — ARIA / Intent Monitor agent ingests signals from connected sources (and mock data in prototype). Signals appear in a live feed with account, contact (if known), signal type, detail, intent score (0–100), channel, and status (new / actioned / dismissed).
2. **Triage** — User filters by signal type (Website, G2, LinkedIn, Job Posting, News, etc.) and minimum intent score; sorts by most recent, highest intent, or actioned last. "Highest intent right now" sidebar shows accounts ranked by score for quick prioritization.
3. **Act** — For each signal (or account card):
   - **Add to sequence** — Add account/contact to an existing outreach sequence.
   - **Outreach** — Start outreach (e.g. open Outreach or create task); if account is already in CRM, **View in CRM** instead.
   - **Dismiss** — Mark as not relevant (removes from "new" triage; can still appear in history).
   - **Ask ARIA** — Get a suggested next step or draft (e.g. "What should I say to this account?").
4. **Review & tune** — Signal trend chart (total, high-intent, actioned over time) and "By signal type" breakdown show volume and mix. Configure signals and alert settings (toast/placeholder) to control which sources and thresholds trigger.

**Outcome:** High-intent accounts get contacted first; low-intent or noise is dismissed; ARIA recommendations (e.g. "Add Apex to Sequence A") drive one-click actions.

---

## 3. User interactions (by role)

| Action | Who | Where |
|--------|-----|--------|
| View intent feed, filter, sort | SDR, CSM, owner, analyst | Main feed (left) |
| See highest-intent accounts | SDR, CSM, owner | Right sidebar (account cards) |
| Add to sequence / Outreach / View in CRM | SDR, CSM, owner | Per-signal buttons; per-account card CTA |
| Dismiss signal | SDR, CSM, owner | Per-signal "Dismiss" |
| Ask ARIA | Any | Per-signal "Ask ARIA"; or global ARIA panel |
| Configure signals / Alert settings | Owner, admin | Header actions (Configure, Alert settings) |
| View trend and breakdown | Analyst, owner | Chart + "By signal type" |
| See usage (e.g. 420/500 accounts) | Owner | Header or limit strip (Growth plan) |

**Plan gate:** Intent Signals is Growth+ (`intentSignals`). Show PlanGate with upgrade CTA if user is on Starter. Show **usage** (e.g. "420 / 500 accounts") when plan has a limit so users know how much capacity remains.

---

## 4. Redesign principles (applied to the page)

- **Purpose upfront:** Short line under the title explaining what Intent Signals does (monitor → triage → act).
- **Workflow-first layout:** Top = key stats + usage (if limited). Main = **Signal feed** (filter, sort, list) + **Highest intent** sidebar. Bottom = **Trend chart** + **ARIA recommendation** strip. Header = Configure, Alert settings.
- **Clear CTAs:** Primary action per signal = "Add to sequence" or "Outreach"; secondary = View account, Dismiss, Ask ARIA. Account cards = Outreach (if not in CRM) or View in CRM.
- **Limit-aware:** If `intentSignalAccounts` is capped (e.g. 500), show "Tracking 420 / 500 accounts" and optional LimitWarning or upgrade nudge.
- **Consistent with CLAUDE.md:** Design tokens (C, F, R, S, btn), inline styles, toast for feedback, no new routes.

---

## 5. Files

- **Page:** `src/pages/research/IntentSignals.jsx`
- **Data:** `src/data/intentSignals.js`
- **Components:** `SignalFeed.jsx`, `AccountIntentCard.jsx`, `SignalTypeBreakdown.jsx`
- **Plan:** `src/config/plans.js` (intentSignals, intentSignalAccounts); gate via `PlanGate` and `usePlan`.

No new routes. Intent Signals remains at `/research/intent`.
