# Plan: New Campaign → ICP First (First-Time Owner) & New vs Returning User Interactions

**Status:** Design only — no implementation changes yet.

---

## 1. Goal

- **First-time owner** starting a new campaign should be taken to **ICP Builder first** to build or choose an ICP before the rest of the wizard.
- ICP can be: **manually created**, **already there** (existing), or **generated with ARIA** (new workflow).
- **Different interactions** for **new customers/users** vs **users who have used the service previously**.

---

## 2. When Is a User “First-Time” for This Flow?

Recommended signals (one or a combination):

| Signal | Source | Use |
|--------|--------|-----|
| **Role** | `useStore` → `currentRole === 'owner'` | Only owners get “ICP first” flow (or extend to founder). |
| **Has launched any campaign** | New: e.g. `hasLaunchedCampaign` in store, or `activeCampaignsCount > 0` | First-time = never launched a campaign. |
| **Has defined/saved an ICP** | New: e.g. `hasSavedIcp` or “ICP Builder has been used and saved at least once” | First-time = no ICP in the workspace yet. |

**Suggested “first-time owner for campaign” definition:**

- `currentRole === 'owner'` **and**
- Either `activeCampaignsCount === 0` **or** “no workspace-level ICP saved” (e.g. no `hasSavedIcp` / ICP never completed in ICP Builder).

Returning owner = has at least one launched campaign **or** has a saved ICP.

---

## 3. New Campaign Flow for First-Time Owner (ICP First)

### 3.1 Entry points

- User clicks **“New Campaign”** from:
  - Dashboard
  - Campaign list
  - Outreach
  - Any other “New Campaign” CTA

### 3.2 Routing / step order

**Option A – Redirect to ICP Builder page**

- If first-time owner → navigate to **`/research/icp`** (or a dedicated **`/research/icp?context=campaign`**).
- ICP Builder shows a banner: “You’re creating your first campaign. Define your ICP below, then continue to campaign setup.”
- On “Continue to campaign” (or “Use this ICP and create campaign”) → navigate to **`/campaigns/new`** with ICP already set (e.g. in wizard state or store), and wizard starts at **Basics** (step 1) with ICP step (2) pre-filled.

**Option B – ICP as step 0 in wizard**

- If first-time owner → open **`/campaigns/new`** but show an **ICP step before Basics** (e.g. “Step 0: Build your ICP”).
- This step either:
  - Embeds ICP Builder–like UI (definition + optional ARIA), or
  - Offers three actions: “Build in ICP Builder”, “Use existing ICP”, “Generate with ARIA” (see below).
- After ICP is set → wizard continues to Basics (current step 1).

**Option C – Hybrid**

- First-time owner → redirect to **`/research/icp?returnTo=campaigns/new`**.
- ICP Builder has a clear CTA: “Save ICP & create campaign” which saves ICP and then navigates to **`/campaigns/new`** with ICP in context; wizard step 2 (ICP) is then read-only or “Edit in ICP Builder”.

Recommendation: **Option A or C** reuses the full ICP Builder; **Option B** keeps everything inside the wizard at the cost of more wizard complexity.

---

## 4. ICP Sources (Manual, Existing, ARIA-Generated)

Wizard step 2 (or the “ICP first” step) should offer three paths.

### 4.1 Use existing ICP

- **Who:** User already has a saved ICP (from ICP Builder or a previous campaign).
- **UI:** List of saved ICPs (e.g. by name/version); user picks one.
- **Data:** Set `data.icpSource = 'existing'` and `data.icpId` (or copy selected ICP into wizard state). Wizard step 2 “ICP” section can show a summary and “Change” linking to ICP Builder.

### 4.2 Manual

- **Who:** User defines ICP in place (current WizardStep2: job titles, company size, industries, geographies, exclusions, optional file upload).
- **UI:** Keep/enhance current manual form in wizard; optional “Open full ICP Builder” for power users.
- **Data:** `data.icpSource = 'manual'`; store job titles, company size, industries, geographies, exclusions (and any extra fields if you add them).

### 4.3 Generate with ARIA (new workflow)

- **Who:** User wants ARIA to propose an ICP from their data (e.g. closed-won deals, CRM, or a short questionnaire).
- **Flow:**
  1. User selects “Generate with ARIA” in the campaign wizard (or in ICP Builder when `?context=campaign`).
  2. **Input step:** Choose source, e.g.:
     - “From closed-won deals” (e.g. last N deals from pipeline/CRM),
     - “From CRM / upload” (e.g. CSV of customers),
     - “From short questionnaire” (e.g. 5–8 questions: industry, size, role, pain points).
  3. **ARIA step:** UI shows “ARIA is analyzing…” (spinner/status). Backend (or mock) runs ICP inference and returns a draft ICP (titles, industries, size, geos, pain points, etc.).
  4. **Review step:** User sees ARIA’s draft ICP (e.g. same shape as `ICP_DEFINITION` / ICPDefinitionPanel). Actions: “Edit”, “Regenerate”, “Use this ICP”.
  5. On “Use this ICP” → draft is saved as workspace ICP (or campaign-scoped) and wizard receives it (`data.icpSource = 'aria_generated'`, plus the ICP payload).
- **Data:** Store `icpSource: 'aria_generated'`, plus the generated definition (firmographic, contact criteria, etc.) so step 2 and downstream steps don’t need to call ARIA again.

---

## 5. How to Show Different Interactions for New vs Returning Users

### 5.1 Defining “new” vs “returning”

| Segment | Definition (example) | Where to store |
|--------|------------------------|----------------|
| **New user** | Never launched a campaign **and** (optional) no saved ICP | Derived: `activeCampaignsCount === 0` and `!hasSavedIcp` |
| **Returning user** | Has launched at least one campaign **or** has saved an ICP | Same, inverted |

Optional: “New customer” = first time in workspace (e.g. `isOnboarded` just completed, or first login after signup). You can add a store flag like `hasEverLaunchedCampaign` or `hasSavedIcp` and set it when the user launches a campaign or saves an ICP.

### 5.2 Where to branch UX

- **New campaign entry**
  - **New:** Redirect to ICP Builder (or ICP-first step) and show short copy: “Define who you’re targeting first.”
  - **Returning:** Go straight to **`/campaigns/new`** (current flow); step 2 still offers “Use existing ICP” so they can skip redefining.
- **Dashboard**
  - **New:** Emphasize “Create your first campaign” and “Start by building your ICP” (link to ICP Builder or ICP-first flow).
  - **Returning:** Emphasize “New campaign”, “Recent campaigns”, and maybe “Use existing ICP” in the CTA.
- **ICP Builder**
  - **New:** Banner + short onboarding: “Build your first ICP so ARIA can target the right accounts.”
  - **Returning:** No banner; show “Regenerate from wins”, “Export”, “Use in campaign” as today.
- **Wizard step 2 (ICP)**
  - **New (if they didn’t come from ICP Builder):** Prominent “Build in ICP Builder” or “Generate with ARIA” so they don’t get stuck on a blank form.
  - **Returning:** Default to “Use existing ICP” and show list of saved ICPs; still show “Manual” and “Generate with ARIA”.

### 5.3 Summary table

| Area | New user / first-time owner | Returning user |
|------|-----------------------------|-----------------|
| **New campaign CTA** | Redirect to ICP Builder (or ICP-first step) | Go to `/campaigns/new` (Basics first) |
| **ICP step** | Emphasize “Build” or “Generate with ARIA”; optional short tooltip | Emphasize “Use existing ICP”; show saved ICPs |
| **Dashboard** | “Create first campaign” + “Start with ICP” | “New campaign” + recent activity |
| **ICP Builder** | Onboarding banner + “Save & create campaign” | Normal builder; “Regenerate”, “Export” |

---

## 6. Implementation Checklist (When You Implement)

- [ ] **Store / state**
  - Add (if needed): `hasSavedIcp`, `hasEverLaunchedCampaign` (or derive from `activeCampaignsCount` and existing ICP persistence).
- [ ] **First-time detection**
  - Helper: `isFirstTimeOwnerForCampaign(role, activeCampaignsCount, hasSavedIcp)`.
- [ ] **Routing**
  - On “New Campaign”: if first-time owner → redirect to `/research/icp?returnTo=campaigns/new` (or show ICP step 0 in wizard).
  - From ICP Builder: “Save & create campaign” → set ICP in context and navigate to `/campaigns/new`.
- [ ] **Wizard**
  - Step 2: support `icpSource`: `existing` | `manual` | `aria_generated`.
  - When `existing`: load and show saved ICPs; pre-fill from selected ICP.
  - When `aria_generated`: accept and store ARIA payload; show read-only summary + “Edit in ICP Builder” if needed.
- [ ] **ARIA-generated ICP workflow**
  - Add “Generate with ARIA” path: input (deals / CRM / questionnaire) → ARIA call (or mock) → review screen → “Use this ICP” → write into wizard/store.
- [ ] **Segments in UI**
  - Use `isFirstTimeOwnerForCampaign` (and optional “new customer”) in Dashboard, Campaign list, and wizard to show the different copy and entry flows above.

---

## 7. Files to Touch (Reference Only)

- **Routing / entry:** `App.jsx`, `CampaignWizard.jsx`, `Dashboard.jsx`, `CampaignList.jsx`, `views/dashboard/DashboardOwner.jsx`, any “New Campaign” buttons.
- **Store:** `useStore.js` (e.g. `hasSavedIcp`, or derive from `activeCampaignsCount` + ICP API/storage).
- **ICP:** `research/ICPBuilder.jsx`, `components/wizard/WizardStep2.jsx`, `data/icp.js`.
- **ARIA workflow:** New component or steps for “Generate with ARIA” (input → loading → review); optional ARIA tool/API for ICP generation.

No code changes have been made; this document is the plan only.
