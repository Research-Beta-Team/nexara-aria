// ─────────────────────────────────────────────
//  NEXARA — Content Library Mock Data
// ─────────────────────────────────────────────

export const contentItems = [

  // ── Campaign c1: Acme VN CFO Q2 ──────────────
  {
    id: 'cl1',
    type: 'Email',
    name: 'CFO Q2 — Touch 1: Cold Intro',
    campaign: 'c1',
    campaignName: 'Acme VN CFO Q2',
    agent: 'Email Sequencer',
    agentId: 'a4',
    status: 'approved',
    brandScore: 90,
    channel: 'email',
    createdAt: '2025-02-11',
    updatedAt: '2025-02-12',
    tags: ['CFO', 'Vietnam', 'cold-outreach', 'touch-1'],
    performance: { opens: '38%', clicks: '9.1%', replies: '4.2%', sends: 250, leads: 11 },
    versions: [
      { v: 'v2', date: '2025-02-12', note: 'Subject line A/B winner applied', author: 'ARIA' },
      { v: 'v1', date: '2025-02-11', note: 'Initial ARIA draft', author: 'ARIA' },
    ],
    preview: "Finance automation for Vietnam-scale CFOs · Cold intro, personalized by company revenue tier.",
    body: `Subject: Finance automation for Vietnam-scale CFOs

Hi {{first_name}},

I came across {{company}} while researching high-growth Vietnamese enterprises — impressive expansion into the southern provinces.

We work with CFOs at companies like yours to automate the reporting workflows that get painful at scale: consolidation, FX reconciliation, management reporting.

Three questions that usually determine fit:
1. Are you running on local ERP or international (SAP/Oracle)?
2. How many entities do you consolidate monthly?
3. Is your current close cycle under 5 days?

Worth a 15-minute call? Happy to work around your schedule.

Best,
{{sender_name}}
{{sender_title}} · {{company_sender}}`,
  },

  {
    id: 'cl2',
    type: 'Email',
    name: 'CFO Q2 — Touch 2: Value Prop',
    campaign: 'c1',
    campaignName: 'Acme VN CFO Q2',
    agent: 'Email Sequencer',
    agentId: 'a4',
    status: 'pending',
    brandScore: 93,
    channel: 'email',
    createdAt: '2025-02-14',
    updatedAt: '2025-02-14',
    tags: ['CFO', 'Vietnam', 'follow-up', 'touch-2'],
    performance: null,
    versions: [
      { v: 'v1', date: '2025-02-14', note: 'Initial ARIA draft — awaiting approval', author: 'ARIA' },
    ],
    preview: "Subject: How [Company] CFOs cut reporting time by 60% · Follow-up value prop.",
    body: `Subject: How {{competitor_company}} CFOs cut reporting time by 60%

Hi {{first_name}},

Following up on my message last week — I wanted to share a quick data point that might be relevant to you.

We recently helped the CFO at a company similar to {{company}} reduce monthly close time from 8 days to 3 days by automating their consolidation workflow. No headcount added.

Given {{company}}'s growth trajectory in Vietnam, I imagine financial reporting complexity is something you're navigating.

Would a 15-minute call this week make sense? I can show you the exact workflow they used.

Best,
{{sender_name}}`,
  },

  {
    id: 'cl3',
    type: 'Email',
    name: 'CFO Q2 — Touch 3: Break-up',
    campaign: 'c1',
    campaignName: 'Acme VN CFO Q2',
    agent: 'Email Sequencer',
    agentId: 'a4',
    status: 'approved',
    brandScore: 88,
    channel: 'email',
    createdAt: '2025-02-08',
    updatedAt: '2025-02-08',
    tags: ['CFO', 'Vietnam', 'break-up', 'touch-3'],
    performance: { opens: '29%', clicks: '3.8%', replies: '5.1%', sends: 180, leads: 9 },
    versions: [
      { v: 'v2', date: '2025-02-08', note: 'Shortened per brand guidelines', author: 'Brand Enforcer' },
      { v: 'v1', date: '2025-02-06', note: 'Initial ARIA draft', author: 'ARIA' },
    ],
    preview: "Subject: Closing the loop, {{first_name}} · Polite break-up. Keeps door open.",
    body: `Subject: Closing the loop, {{first_name}}

Hi {{first_name}},

I've reached out a couple of times — I know inboxes are brutal, so I'll keep this short.

If automating your finance reporting isn't a priority right now, I completely understand. Happy to reconnect when the timing is better.

If it is on your radar, even a 10-minute call would help me understand if we're a fit.

Either way, best of luck with {{company}}'s growth this year.

{{sender_name}}`,
  },

  {
    id: 'cl4',
    type: 'LinkedIn Ad',
    name: 'CFO Q2 — LinkedIn Sponsored Post: Thought Leadership',
    campaign: 'c1',
    campaignName: 'Acme VN CFO Q2',
    agent: 'Ad Composer',
    agentId: 'a2',
    status: 'approved',
    brandScore: 88,
    channel: 'linkedin',
    createdAt: '2025-02-08',
    updatedAt: '2025-02-09',
    tags: ['LinkedIn', 'thought-leadership', 'CFO', 'B2B'],
    performance: { impressions: 142000, clicks: 1022, ctr: '0.72%', leads: 47, cpl: '$40.21' },
    versions: [
      { v: 'v2', date: '2025-02-09', note: 'CTA softened per brand review', author: 'Brand Enforcer' },
      { v: 'v1', date: '2025-02-08', note: 'Initial ARIA draft', author: 'ARIA' },
    ],
    preview: "3 signs your financial reporting is holding your company back. Thought leadership angle.",
    body: `HEADLINE:
3 signs your financial reporting is holding your company back

INTRO TEXT:
3 signs your financial reporting is holding your company back:

1. Your month-end close takes more than 5 days
2. You have more than 2 people dedicated to consolidation
3. Your CFO is still exporting to Excel for board reports

If any of these hit home — you're not alone. 73% of Vietnamese CFOs we spoke with last year identified manual reporting as their #1 operational bottleneck.

We built our platform specifically for finance teams at Vietnam's growth-stage companies. Implementation in 6 weeks. ROI in 3 months.

→ See how it works

CTA BUTTON: Learn More
DESTINATION: /vietnam-cfo-case-study

AUDIENCE: CFO, VP Finance | Vietnam | 32-55 | Company 500-5000 employees`,
  },

  {
    id: 'cl5',
    type: 'Meta Ad',
    name: 'CFO Q2 — Meta Carousel Batch B (3 cards)',
    campaign: 'c1',
    campaignName: 'Acme VN CFO Q2',
    agent: 'Ad Composer',
    agentId: 'a2',
    status: 'pending',
    brandScore: 90,
    channel: 'meta',
    createdAt: '2025-02-14',
    updatedAt: '2025-02-14',
    tags: ['Meta', 'carousel', 'CFO', 'paid-social'],
    performance: null,
    versions: [
      { v: 'v1', date: '2025-02-14', note: 'Initial ARIA draft — awaiting content approval', author: 'ARIA' },
    ],
    preview: 'Card 1: "Close in 3 days, not 3 weeks." Card 2: "One platform. All entities." Card 3: ROI calculator CTA.',
    body: `META CAROUSEL AD — BATCH B

━━━ CARD 1 ━━━
Headline: Close in 3 days, not 3 weeks.
Body: Finance teams at Vietnam's fastest-growing companies are automating what used to take weeks.
CTA: See How →

━━━ CARD 2 ━━━
Headline: One platform. All entities.
Body: Consolidate across 5, 10, or 50 entities without the spreadsheet chaos.
CTA: Learn More →

━━━ CARD 3 ━━━
Headline: What's your CFO time worth?
Body: Use our ROI calculator to see what manual reporting is actually costing you.
CTA: Calculate ROI →

━━━ AD SPECS ━━━
Format: Carousel (3 cards)
Objective: Lead Generation
Placement: Facebook Feed, Instagram Feed
Budget: $571/day
Audience: Lookalike 1% (Finance/CFO Vietnam)`,
  },

  {
    id: 'cl6',
    type: 'SEO Article',
    name: 'CFO Guide: Automating Month-End Close in Vietnam',
    campaign: 'c1',
    campaignName: 'Acme VN CFO Q2',
    agent: 'Content Strategist',
    agentId: 'a3',
    status: 'approved',
    brandScore: 83,
    channel: 'content',
    createdAt: '2025-02-06',
    updatedAt: '2025-02-07',
    tags: ['SEO', 'blog', 'month-end-close', 'Vietnam', 'CFO'],
    performance: { pageViews: 1840, avgTimeOnPage: '4m 12s', organicClicks: 312, leads: 6, bounceRate: '42%' },
    versions: [
      { v: 'v3', date: '2025-02-07', note: 'Published — SEO meta tags added', author: 'Content Strategist' },
      { v: 'v2', date: '2025-02-06', note: 'SEO score optimized (72 → 81)', author: 'ARIA' },
      { v: 'v1', date: '2025-02-05', note: 'Initial ARIA draft', author: 'ARIA' },
    ],
    preview: '2,400-word SEO article targeting "month-end close automation Vietnam". SEO score: 81/100. Published.',
    body: `# CFO Guide: Automating Month-End Close in Vietnam

**Target keyword:** month-end close automation Vietnam
**Word count:** 2,412 | **SEO Score:** 81/100 | **Brand Score:** 83/100

---

## The State of Financial Close in Vietnamese Companies

Vietnam's economy has grown at 7-8% annually for the past decade. But many finance teams at the country's fastest-growing companies are still running their month-end close on Excel, email, and manual data entry.

According to a 2024 survey of 180 CFOs across Vietnam, the average month-end close cycle takes **8.3 working days**. The APAC benchmark for high-performing finance teams is 3 days or fewer.

That gap — 5+ days — represents an enormous operational cost.

---

## The 5 Biggest Bottlenecks in Manual Close Processes

**1. Multi-entity consolidation by hand**
Companies with 3+ legal entities typically require a dedicated team member to manually pull reports from each entity, reconcile intercompany transactions, and consolidate in Excel.

**2. FX reconciliation delays**
Vietnam-based companies with USD, EUR, or SGD exposure must reconcile exchange rate variances at close. Manual FX reconciliation often takes 1-2 days alone.

**3. Local tax authority compliance**
Vietnam's Ministry of Finance has specific reporting requirements that differ from IFRS. Finance teams must maintain parallel reporting frameworks, doubling the workload.

**4. ERP data extraction limitations**
Most legacy ERPs used in Vietnam require manual report extraction. Modern APIs that enable automated data pulls are absent from older SAP and local ERP installations.

**5. Board reporting formatting**
Even when close data is ready, converting it into board-ready format — charts, variance analysis, commentary — takes another 1-2 days of analyst time.

---

## What Automation Actually Looks Like

Modern finance automation doesn't replace your finance team — it eliminates the repetitive, low-value tasks that consume their time.

A typical automation workflow for a 5-entity Vietnamese company looks like this:

1. **Day 1:** All entity data automatically pulled via API at 6 PM (no manual extraction)
2. **Day 1:** Intercompany eliminations applied automatically using pre-set rules
3. **Day 2:** FX revaluation applied using live rates from SBV API
4. **Day 2:** Variance analysis generated automatically against prior month and budget
5. **Day 3:** Board pack generated, ready for CFO review

---

## ROI Framework for Justifying the Investment

To build the business case, CFOs should calculate the fully-loaded cost of their current close process:

- Finance team time dedicated to close: __ hours × average hourly cost
- Error correction and rework time: typically 15-20% of total close time
- Opportunity cost: what could your team accomplish with 5 extra days per month?

Most CFOs we work with find the ROI calculation straightforward. If your team spends 200+ hours per quarter on manual close activities, automation typically pays for itself within 2 quarters.

---

*Published: February 7, 2025 | Author: ARIA Content Strategist | Campaign: Acme VN CFO Q2*`,
  },

  // ── Campaign c2: APAC Brand Awareness ────────
  {
    id: 'cl7',
    type: 'Meta Ad',
    name: 'APAC Brand — Single Image Ad: Awareness',
    campaign: 'c2',
    campaignName: 'APAC Brand Awareness',
    agent: 'Ad Composer',
    agentId: 'a2',
    status: 'approved',
    brandScore: 87,
    channel: 'meta',
    createdAt: '2025-01-20',
    updatedAt: '2025-01-21',
    tags: ['Meta', 'brand-awareness', 'APAC', 'single-image'],
    performance: { impressions: 384000, clicks: 1920, ctr: '0.50%', reach: 210000, frequency: '1.8×' },
    versions: [
      { v: 'v2', date: '2025-01-21', note: 'CTA changed from "Get Started" to "Learn More"', author: 'ARIA' },
      { v: 'v1', date: '2025-01-20', note: 'Initial ARIA draft', author: 'ARIA' },
    ],
    preview: '"Your finance team is working harder than it should." Brand awareness single image ad.',
    body: `META SINGLE IMAGE AD

PRIMARY TEXT:
Your finance team is working harder than it should.

While your competitors have automated month-end close, FX reconciliation, and management reporting — most finance teams in Asia are still doing it manually.

We help CFOs at high-growth Asian companies reclaim 60% of their reporting time. Without adding headcount.

HEADLINE: Finance automation built for Asia's growth stage.

DESCRIPTION: Trusted by CFOs at leading companies across APAC.

CTA BUTTON: Learn More
DESTINATION: /apac-finance-automation

CREATIVE SPECS:
Format: Single Image
Size: 1080×1080px
Primary text: ≤125 chars ✓
Headline: ≤27 chars ✓
Placement: Facebook Feed, Instagram Feed, Audience Network`,
  },

  {
    id: 'cl8',
    type: 'Blog',
    name: 'The CFO Automation Playbook for Asia-Pacific',
    campaign: 'c2',
    campaignName: 'APAC Brand Awareness',
    agent: 'Content Strategist',
    agentId: 'a3',
    status: 'approved',
    brandScore: 85,
    channel: 'content',
    createdAt: '2025-01-25',
    updatedAt: '2025-01-28',
    tags: ['blog', 'APAC', 'CFO', 'playbook', 'thought-leadership'],
    performance: { pageViews: 3240, avgTimeOnPage: '5m 48s', organicClicks: 580, leads: 14, bounceRate: '38%' },
    versions: [
      { v: 'v3', date: '2025-01-28', note: 'Final edit + images added', author: 'Content Strategist' },
      { v: 'v2', date: '2025-01-27', note: 'Brand review passed (score 85)', author: 'Brand Enforcer' },
      { v: 'v1', date: '2025-01-25', note: 'Initial ARIA long-form draft', author: 'ARIA' },
    ],
    preview: '3,100-word thought leadership piece on CFO automation across APAC markets. Best performing content this quarter.',
    body: `# The CFO Automation Playbook for Asia-Pacific

Finance leaders across APAC are navigating one of the most complex operating environments in decades. Multi-currency exposure, regulatory fragmentation across 10+ jurisdictions, and explosive growth are colliding with finance teams that were built for a simpler era.

This playbook is a practical guide for CFOs who know automation is the answer but aren't sure where to start.

---

## Part 1: Audit Your Current Close

Before automating anything, you need an honest picture of where your time goes.

Track every activity in your next month-end close cycle:
- Data extraction from ERP/systems
- Intercompany reconciliation
- FX revaluation
- Consolidation
- Variance analysis
- Board pack preparation
- Review cycles and corrections

Most CFOs who do this exercise for the first time are surprised: 60-70% of close time is spent on data movement and formatting, not actual analysis.

---

## Part 2: Prioritize High-ROI Automation

Not all automation is equal. These three areas deliver the fastest ROI:

**1. Data extraction automation (Week 1 win)**
Replace manual ERP report extraction with API-based automated pulls. This alone typically saves 1-2 days per close cycle.

**2. Intercompany elimination rules (Month 1 win)**
Automate your intercompany elimination logic once, run it automatically every close. Eliminates one of the highest-error, highest-effort close activities.

**3. Board pack generation (Quarter 1 win)**
Templatize your board reporting format and connect it to your close data. Generate first drafts automatically, leaving the CFO to add commentary and insights.

---

## Part 3: The 90-Day Implementation Roadmap

Week 1-2: API connections and data extraction automation
Week 3-4: Intercompany elimination rules and FX revaluation
Week 5-8: Consolidation workflow and variance analysis
Week 9-12: Board pack templates and reporting automation

Most APAC finance teams complete this full implementation in 10-14 weeks with a 2-3 person internal team.

---

*Published: January 28, 2025 | Campaign: APAC Brand Awareness*`,
  },

  {
    id: 'cl9',
    type: 'LinkedIn Ad',
    name: 'APAC Brand — LinkedIn Lead Gen: ROI Calculator',
    campaign: 'c2',
    campaignName: 'APAC Brand Awareness',
    agent: 'Ad Composer',
    agentId: 'a2',
    status: 'approved',
    brandScore: 84,
    channel: 'linkedin',
    createdAt: '2025-01-18',
    updatedAt: '2025-01-19',
    tags: ['LinkedIn', 'lead-gen', 'ROI', 'APAC'],
    performance: { impressions: 68000, clicks: 544, ctr: '0.80%', leads: 22, cpl: '$72.50' },
    versions: [
      { v: 'v1', date: '2025-01-19', note: 'Approved after brand review', author: 'Brand Enforcer' },
    ],
    preview: 'LinkedIn Lead Gen Form ad promoting the CFO ROI Calculator tool. Strong lead quality.',
    body: `LINKEDIN LEAD GEN FORM AD

INTRO TEXT:
CFOs across APAC are discovering they're paying $180,000/year more than they need to — in hidden reporting costs.

We built a free ROI calculator that shows exactly how much your current manual finance process is costing you vs. automation.

Takes 3 minutes. No sales call required.

HEADLINE: Calculate Your Finance Automation ROI

LEAD GEN FORM:
- First Name
- Last Name
- Company
- Number of Entities (dropdown: 1-5, 6-15, 15+)
- Current Close Cycle (dropdown: 1-3 days, 4-7 days, 8+ days)
- Email

THANK YOU MESSAGE:
"Your personalized ROI report is on its way! Our finance automation team will also reach out within 1 business day."

CTA: Get My ROI Report`,
  },

  {
    id: 'cl10',
    type: 'Blog',
    name: 'Finance Automation vs Manual: The True Cost Comparison',
    campaign: 'c2',
    campaignName: 'APAC Brand Awareness',
    agent: 'Content Strategist',
    agentId: 'a3',
    status: 'draft',
    brandScore: 74,
    channel: 'content',
    createdAt: '2025-02-10',
    updatedAt: '2025-02-12',
    tags: ['blog', 'comparison', 'ROI', 'APAC', 'draft'],
    performance: null,
    versions: [
      { v: 'v2', date: '2025-02-12', note: 'Brand score improved from 68 to 74 after rewrite', author: 'ARIA' },
      { v: 'v1', date: '2025-02-10', note: 'Initial draft — brand score 68, needs work', author: 'ARIA' },
    ],
    preview: 'Comparison article: manual vs automated finance processes. Draft. Brand score 74 — pending review.',
    body: `# Finance Automation vs Manual: The True Cost Comparison

[DRAFT — Pending content approval]

This article provides a head-to-head comparison of manual and automated finance processes across key dimensions: time, cost, error rate, and scalability.

## The Setup: Two Finance Teams

To make this concrete, we'll compare two hypothetical 5-entity companies in APAC:

**Company A:** Manual process (Excel-based consolidation, manual ERP extraction)
**Company B:** Automated process (API-based extraction, automated consolidation)

Both companies have $50M revenue, 3 finance team members dedicated to close.

## Time to Close

| Activity | Company A (Manual) | Company B (Automated) |
|----------|-------------------|----------------------|
| Data extraction | 2 days | 2 hours |
| Intercompany recon | 1.5 days | 4 hours |
| FX revaluation | 1 day | 1 hour |
| Consolidation | 1.5 days | 3 hours |
| Board pack | 2 days | 6 hours |
| **Total** | **8 days** | **2 days** |

## Cost Analysis

Finance team fully-loaded cost: $80,000/year per person
Time spent on close activities: 30% of total time
Annual close cost (Company A): $72,000
Annual automation platform cost: $24,000
Annual close cost (Company B): $24,000 + $16,000 team time = $40,000

**Annual savings: $32,000 + 6 recovered days per month**

[Section on error rates and scalability — TO BE WRITTEN]`,
  },

  // ── Campaign c3: SEA Demand Gen ───────────────
  {
    id: 'cl11',
    type: 'Email',
    name: 'SEA Demand Gen — Outreach Sequence (3 touches)',
    campaign: 'c3',
    campaignName: 'SEA Demand Gen',
    agent: 'Email Sequencer',
    agentId: 'a4',
    status: 'approved',
    brandScore: 91,
    channel: 'email',
    createdAt: '2025-01-25',
    updatedAt: '2025-01-26',
    tags: ['email', 'sequence', 'SEA', 'VP-Director', 'financial-services'],
    performance: { opens: '31%', clicks: '6.8%', replies: '3.4%', sends: 420, leads: 14 },
    versions: [
      { v: 'v2', date: '2025-01-26', note: 'Touch 3 shortened per SDR feedback', author: 'ARIA' },
      { v: 'v1', date: '2025-01-25', note: 'Initial ARIA sequence draft', author: 'ARIA' },
    ],
    preview: '3-touch cold outreach sequence for VP/Director level in SEA financial services. Reply rate 3.4%.',
    body: `COLD OUTREACH SEQUENCE — SEA Demand Gen
Target: VP Finance / Finance Director, Financial Services, SEA markets

━━━ TOUCH 1 (Day 1) ━━━
Subject: Finance consolidation for {{company}}'s growth stage

Hi {{first_name}},

I noticed {{company}} has been expanding across SEA — consolidating financial data across multiple markets must be getting complex.

We help VP Finance and Finance Directors at financial services companies automate multi-country consolidation. Our clients typically cut reporting time by 55-65% in the first quarter.

Quick question: is multi-country reporting consolidation on your roadmap for 2025?

{{sender_name}}

━━━ TOUCH 2 (Day 5) ━━━
Subject: The consolidation playbook that worked for {{similar_company}}

Hi {{first_name}},

Following up — wanted to share a quick example.

{{similar_company}}'s VP Finance used our platform to consolidate 8 Southeast Asian entities into a single reporting view. First month-end using the system: 4 days (down from 11).

Happy to share the exact implementation steps — would a 20-minute call work?

{{sender_name}}

━━━ TOUCH 3 (Day 10) ━━━
Subject: Last note — {{company}}

Hi {{first_name}},

I'll leave it here. If cross-entity consolidation becomes a bottleneck for {{company}} this year, I'd love to chat then.

Either way, best of luck with the SEA expansion.

{{sender_name}}`,
  },

  {
    id: 'cl12',
    type: 'LinkedIn Ad',
    name: 'SEA Demand Gen — LinkedIn Sponsored InMail',
    campaign: 'c3',
    campaignName: 'SEA Demand Gen',
    agent: 'Ad Composer',
    agentId: 'a2',
    status: 'approved',
    brandScore: 86,
    channel: 'linkedin',
    createdAt: '2025-01-22',
    updatedAt: '2025-01-23',
    tags: ['LinkedIn', 'InMail', 'SEA', 'VP-Finance', 'demand-gen'],
    performance: { opens: '44%', clicks: '3.2%', ctr: '3.2%', leads: 18, cpl: '$58.20' },
    versions: [
      { v: 'v1', date: '2025-01-23', note: 'Approved after brand review', author: 'Brand Enforcer' },
    ],
    preview: 'LinkedIn Message Ad (Sponsored InMail) targeting VP Finance in SEA. Open rate 44%.',
    body: `LINKEDIN SPONSORED INMAIL

SENDER: [Campaign Owner Name], [Title]

SUBJECT LINE:
Quick question about {{company}}'s reporting stack, {{first_name}}

MESSAGE BODY:
Hi {{first_name}},

I came across your profile while researching finance leaders at {{company}} — your work scaling the finance function across SEA markets caught my attention.

I'm reaching out because we've been working with VP Finance and Finance Directors at financial services companies to automate one specific headache: multi-country consolidation.

The companies we work with typically spend 8-12 days on monthly close across their SEA entities. After implementing our platform, that drops to 3-4 days — without adding finance headcount.

Would it make sense to connect for 15 minutes to see if there's a fit?

[CTA Button: Yes, let's connect]
[Secondary link: See a 3-minute demo first]

TARGETING:
- Job Title: VP Finance, Finance Director, Head of Finance
- Industry: Financial Services, Banking, Insurance
- Geography: Singapore, Malaysia, Thailand, Indonesia, Philippines
- Company size: 500-5,000 employees`,
  },

  {
    id: 'cl13',
    type: 'Landing Page',
    name: 'SEA Demand Gen — Demo Request Landing Page',
    campaign: 'c3',
    campaignName: 'SEA Demand Gen',
    agent: 'Content Strategist',
    agentId: 'a3',
    status: 'pending',
    brandScore: 79,
    channel: 'content',
    createdAt: '2025-02-01',
    updatedAt: '2025-02-03',
    tags: ['landing-page', 'SEA', 'demo-request', 'conversion'],
    performance: { pageViews: 620, leads: 8, conversionRate: '1.3%', bounceRate: '58%' },
    versions: [
      { v: 'v2', date: '2025-02-03', note: 'Hero headline changed — A/B test variant B', author: 'ARIA' },
      { v: 'v1', date: '2025-02-01', note: 'Initial ARIA draft', author: 'ARIA' },
    ],
    preview: 'Demo request landing page for SEA Demand Gen campaign. Conversion rate 1.3% — below 2% target. Pending review.',
    body: `LANDING PAGE COPY — Demo Request (Variant B)
URL: /sea-finance-demo

━━━ HERO SECTION ━━━
HEADLINE: Close your books in 3 days across every SEA entity

SUBHEADLINE:
Finance leaders at APAC's fastest-growing companies are using AI-powered consolidation to cut reporting time by 60%. Without adding to their team.

CTA BUTTON: See a 15-Minute Demo →
TRUST LINE: Trusted by 200+ CFOs across Southeast Asia

━━━ SOCIAL PROOF ━━━
"We went from 11 days to 3 days on monthly close. The ROI was clear in the first quarter."
— VP Finance, Leading SEA Financial Services Company

━━━ FEATURES SECTION ━━━
✓ Multi-entity consolidation in hours, not days
✓ Automated FX revaluation with live SBV/regional rates
✓ Built-in compliance for SG, MY, TH, ID, PH regulations
✓ Board-ready reports generated automatically
✓ 6-week implementation, not 6 months

━━━ DEMO FORM ━━━
Fields: First Name, Last Name, Company, Country, Number of Entities, Current Close Cycle, Email, Phone (optional)

━━━ FOOTER CTA ━━━
"Questions first? Email our team at demo@[company].com"

━━━ NOTES ━━━
Current conversion: 1.3% (target: 2%)
Issue: Bounce rate high (58%) — suggests mismatch between ad and page messaging. Recommend aligning hero headline with LinkedIn InMail subject line.`,
  },

  // ── Drafts / No campaign ──────────────────────
  {
    id: 'cl14',
    type: 'Meta Ad',
    name: 'Q2 Brand Refresh — Meta Video Script (Draft)',
    campaign: null,
    campaignName: 'Unassigned',
    agent: 'Ad Composer',
    agentId: 'a2',
    status: 'draft',
    brandScore: 72,
    channel: 'meta',
    createdAt: '2025-02-13',
    updatedAt: '2025-02-13',
    tags: ['Meta', 'video', 'brand-refresh', 'draft'],
    performance: null,
    versions: [
      { v: 'v1', date: '2025-02-13', note: 'Initial ARIA draft — not yet reviewed', author: 'ARIA' },
    ],
    preview: 'Video ad script for Q2 brand refresh campaign. 30-second format. Draft — not yet assigned to campaign.',
    body: `META VIDEO AD SCRIPT — Q2 Brand Refresh
Format: 30-second video
Status: DRAFT — Not yet approved

━━━ SCRIPT ━━━

[0:00-0:03] — HOOK
Visual: Finance team looking frustrated at spreadsheets, multiple screens
VO: "Your finance team is brilliant. But they're spending 60% of their time on tasks that don't need humans."

[0:03-0:10] — PROBLEM
Visual: Stack of entity reports, manual consolidation, clock fast-forwarding through 8 days
VO: "8 days. That's how long the average month-end close takes. All that manual work — consolidation, FX, compliance."

[0:10-0:20] — SOLUTION
Visual: Platform interface, data flowing automatically, close complete in 3 days
VO: "We automated it. Every entity, every currency, every compliance requirement. In one platform. In 3 days."

[0:20-0:27] — SOCIAL PROOF
Visual: CFO portrait / testimonial card
VO: "CFOs at 200+ companies across APAC have made the switch. ROI in under 90 days."

[0:27-0:30] — CTA
Visual: Logo lockup, URL, CTA button
VO: "See how it works. Free demo."
Text: "Book a Demo → [URL]"

━━━ PRODUCTION NOTES ━━━
Recommended talent: B2B finance professional (30s-40s)
Music: Understated corporate, upbeat but not cheesy
Voiceover style: Confident, peer-to-peer (not salesy)`,
  },

  {
    id: 'cl15',
    type: 'Email',
    name: 'Winback Sequence — Churned CFO Prospects',
    campaign: null,
    campaignName: 'Unassigned',
    agent: 'Email Sequencer',
    agentId: 'a4',
    status: 'draft',
    brandScore: 82,
    channel: 'email',
    createdAt: '2025-02-09',
    updatedAt: '2025-02-09',
    tags: ['email', 'winback', 're-engagement', 'draft'],
    performance: null,
    versions: [
      { v: 'v1', date: '2025-02-09', note: 'Initial ARIA draft for winback sequence', author: 'ARIA' },
    ],
    preview: 'Re-engagement email sequence for contacts who went cold after touch 3. Draft — needs campaign assignment.',
    body: `WINBACK SEQUENCE — Churned CFO Prospects

Purpose: Re-engage contacts who received 3-touch sequence 90+ days ago with no response

━━━ WINBACK TOUCH 1 ━━━
Subject: {{first_name}}, a lot has changed since we last spoke

Hi {{first_name}},

It's been a while — I reached out back in {{last_contact_month}} about automating finance reporting at {{company}}.

A lot has changed since then. We've onboarded 40+ new clients across APAC, launched our Vietnam compliance module, and cut average implementation time to 4 weeks.

I wanted to check in — is multi-entity reporting still on your radar for 2025?

If priorities have shifted, no worries at all. But if it's still a bottleneck, I'd love to share what's new.

{{sender_name}}

━━━ WINBACK TOUCH 2 (Day 14) ━━━
Subject: The Vietnam Q1 close results just came in

Hi {{first_name}},

Thought this might be relevant: we just published results from our Vietnam client cohort's Q1 close.

Average close time reduction: 64%
Average headcount saved: 1.4 FTE
Time to first value: 3.2 weeks

If you'd like the full report, happy to send it over.

{{sender_name}}`,
  },

  {
    id: 'cl16',
    type: 'SEO Article',
    name: 'Top 5 ERP Integrations for Vietnam CFOs (2025)',
    campaign: 'c1',
    campaignName: 'Acme VN CFO Q2',
    agent: 'Content Strategist',
    agentId: 'a3',
    status: 'archived',
    brandScore: 77,
    channel: 'content',
    createdAt: '2025-01-15',
    updatedAt: '2025-01-20',
    tags: ['SEO', 'ERP', 'Vietnam', 'CFO', 'archived'],
    performance: { pageViews: 420, avgTimeOnPage: '2m 18s', organicClicks: 89, leads: 2, bounceRate: '71%' },
    versions: [
      { v: 'v2', date: '2025-01-20', note: 'Archived — low performance (bounce rate 71%)', author: 'Campaign Owner' },
      { v: 'v1', date: '2025-01-15', note: 'Published, underperformed expectations', author: 'ARIA' },
    ],
    preview: 'SEO listicle on ERP integrations. Archived — high bounce rate (71%), low engagement. Content type mismatch.',
    body: `# Top 5 ERP Integrations for Vietnam CFOs (2025)

[ARCHIVED — Performance below threshold. High bounce rate 71% vs. 42% average.]

This article was archived on January 20, 2025 due to underperformance. The listicle format did not resonate with CFO-level audience. Recommend replacing with a more strategic, analysis-driven piece.

---

Original content below (archived for reference):

## 1. SAP S/4HANA Cloud Integration

SAP's flagship ERP now offers native API connectivity for external reporting tools. The Vietnam-specific tax connector supports HTKK format export...

[Rest of article archived]`,
  },
];

// ── Lookup & helpers ──────────────────────────
export const getContentItem = (id) => contentItems.find((c) => c.id === id) ?? null;

export const CONTENT_TYPE_COLORS = {
  'Email':        '#3DDC84',
  'LinkedIn Ad':  '#0A66C2',
  'Meta Ad':      '#1877F2',
  'Blog':         '#F5C842',
  'SEO Article':  '#F5C842',
  'Landing Page': '#5EEAD4',
  'Cold Sequence':'#3DDC84',
};

export const CONTENT_STATUS_ORDER = { pending: 0, draft: 1, approved: 2, archived: 3 };
