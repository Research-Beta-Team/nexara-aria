import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { C, F, R, S, T, btn, badge, shadows, scrollbarStyle } from '../tokens';
import useToast from '../hooks/useToast';
import useStore from '../store/useStore';
import { getAgent, AGENTS } from '../agents/AgentRegistry';
import { AgentRuntime } from '../agents/AgentRuntime';
import AgentRoleIcon from '../components/ui/AgentRoleIcon';

/* ─── Memory namespace mapping ────────────────────────────── */
const MEMORY_NAMESPACES = {
  freya:      { reads: ['brand', 'audience', 'campaigns', 'performance', 'knowledge', 'decisions'], writes: ['decisions', 'campaigns'] },
  strategist: { reads: ['brand', 'audience', 'campaigns', 'knowledge'], writes: ['campaigns', 'decisions'] },
  copywriter: { reads: ['brand', 'campaigns', 'knowledge'], writes: ['campaigns'] },
  analyst:    { reads: ['performance', 'knowledge', 'campaigns'], writes: ['performance', 'decisions'] },
  prospector: { reads: ['audience', 'campaigns', 'knowledge'], writes: ['audience', 'campaigns'] },
  optimizer:  { reads: ['performance', 'campaigns', 'knowledge'], writes: ['performance', 'decisions'] },
  outreach:   { reads: ['audience', 'campaigns', 'knowledge'], writes: ['campaigns'] },
  revenue:    { reads: ['performance', 'campaigns', 'audience'], writes: ['performance', 'decisions'] },
  guardian:   { reads: ['brand', 'knowledge', 'campaigns'], writes: ['decisions'] },
};

/* ─── Decision log per agent ───────────────────────────────── */
const DECISION_LOG = {
  freya: [
    { time: 'Apr 2, 09:14', decision: 'Delegated MENA campaign brief to Strategist', reasoning: 'Brand context + audience data fully loaded; Strategist has highest skill match at 94%.', confidence: 94, outcome: 'success' },
    { time: 'Apr 2, 08:02', decision: 'Escalated ANZ budget anomaly to owner', reasoning: 'Audience burnout exceeded 90% threshold; automatic pause requires owner approval.', confidence: 89, outcome: 'pending' },
    { time: 'Apr 1, 16:30', decision: 'Approved Copywriter output for review chain', reasoning: 'Guardian compliance score: 97/100; brand tone alignment confirmed.', confidence: 91, outcome: 'success' },
    { time: 'Apr 1, 09:00', decision: 'Scheduled weekly performance review workflow', reasoning: 'Triggered by calendar event; no conflicts in agent queue.', confidence: 97, outcome: 'success' },
    { time: 'Mar 31, 14:15', decision: 'Resolved conflict: Strategist vs Guardian on Yemen ad copy', reasoning: 'Strategist urgency score (8.2) outweighed Guardian sensitivity flag; added disclaimer.', confidence: 85, outcome: 'revision' },
    { time: 'Mar 31, 11:00', decision: 'Orchestrated Campaign Launch workflow for Yemen Emergency', reasoning: '4-agent chain initiated: Strategist → Copywriter → Guardian → Outreach.', confidence: 92, outcome: 'success' },
    { time: 'Mar 30, 15:44', decision: 'Prioritised MENA over SEA demand gen for budget cycle', reasoning: 'MENA ICP match 89% vs SEA 74%; pipeline potential 2.1x higher.', confidence: 88, outcome: 'success' },
    { time: 'Mar 30, 09:20', decision: 'Routed board report request to Analyst + Revenue agents', reasoning: 'Task complexity exceeds single-agent scope; parallel delegation reduces ETA by 40%.', confidence: 93, outcome: 'success' },
  ],
  strategist: [
    { time: 'Apr 2, 08:45', decision: 'Generated MENA Healthcare Donor campaign brief', reasoning: 'ICP data + competitor intel loaded; brief structure follows Q2 Donor Acquisition template.', confidence: 91, outcome: 'success' },
    { time: 'Apr 1, 14:30', decision: 'Recommended 15% Meta → LinkedIn budget shift', reasoning: 'LinkedIn CPL $62 vs Meta $89 for healthcare donor persona — 30% efficiency gain.', confidence: 86, outcome: 'pending' },
    { time: 'Apr 1, 10:00', decision: 'Updated ICP targeting based on intent signals', reasoning: 'Bombora surge: Healthcare Professionals + Medical NGO clusters up 42% in MENA.', confidence: 89, outcome: 'success' },
    { time: 'Mar 31, 17:00', decision: 'Flagged competitor positioning shift — MSF expanding MENA digital', reasoning: 'G2 + LinkedIn ad intelligence shows MSF increased spend 28%; repositioning recommended.', confidence: 78, outcome: 'revision' },
    { time: 'Mar 31, 11:30', decision: 'Briefed Copywriter on Yemen Emergency campaign positioning', reasoning: 'Key message: "We operate where others can\'t." Differentiator: 95% operational staff ratio.', confidence: 93, outcome: 'success' },
    { time: 'Mar 30, 16:15', decision: 'Approved SEA Demand Gen phase 2 go/no-go', reasoning: 'Phase 1 CAC $138 (target $150); conversion rate tracking 12% ahead.', confidence: 87, outcome: 'success' },
    { time: 'Mar 30, 09:45', decision: 'Defined Q2 Donor Acquisition positioning: "Operational bridge"', reasoning: 'ICP research: 78% of major donors prioritise operational efficiency over awareness metrics.', confidence: 92, outcome: 'success' },
    { time: 'Mar 29, 15:00', decision: 'Paused APAC Brand Awareness A/B test variant C', reasoning: 'Statistical significance not reached after 14 days; variant C underperforming at p=0.82.', confidence: 95, outcome: 'success' },
  ],
  copywriter: [
    { time: 'Apr 2, 10:00', decision: 'Generated email variant 4 for Q2 Donor Acquisition', reasoning: 'Variants 1-3 open rate avg 41.2%; testing subject line personalisation with recipient title.', confidence: 88, outcome: 'pending' },
    { time: 'Apr 1, 15:30', decision: 'Drafted LinkedIn ad creative for APAC campaign', reasoning: 'Strategist brief calls for professional credibility angle; used "95% operational staff" stat.', confidence: 84, outcome: 'success' },
    { time: 'Apr 1, 11:00', decision: 'Revised Yemen ad copy after Guardian feedback', reasoning: 'Guardian flagged 2 unverified statistics; replaced with Medglobal 2024 Annual Report citations.', confidence: 96, outcome: 'success' },
    { time: 'Mar 31, 14:00', decision: 'Created lead magnet: "Healthcare in Crisis Zones" whitepaper outline', reasoning: 'ICP research shows 68% of major donors research before committing; gated content scores +2.1x.', confidence: 82, outcome: 'success' },
    { time: 'Mar 31, 09:30', decision: 'Produced 5 social posts for MENA donor awareness series', reasoning: 'Content calendar gap detected for Apr 3-7; Strategist brief provided; Guardian pre-approved.', confidence: 91, outcome: 'success' },
    { time: 'Mar 30, 16:00', decision: 'Rejected AI-generated stat about Yemen mortality rates', reasoning: 'Unverifiable figure; requested verified data from Medglobal knowledge base before using.', confidence: 98, outcome: 'revision' },
    { time: 'Mar 30, 10:15', decision: 'Generated 3 subject line variants for SEA email sequence', reasoning: 'Control: "Healthcare professionals are changing the world" — testing urgency and curiosity frames.', confidence: 87, outcome: 'success' },
    { time: 'Mar 29, 14:45', decision: 'Approved final copy for Yemen Emergency landing page', reasoning: 'Brand tone check: 9.2/10. Readability: Grade 11. CTA clarity: strong. Guardian: cleared.', confidence: 94, outcome: 'success' },
  ],
  analyst: [
    { time: 'Apr 2, 09:14', decision: 'Detected 23% CTR drop on Yemen campaign post Feb 22', reasoning: 'Anomaly threshold: >15% drop over 3-day window. Frequency cap breached at 4.2x.', confidence: 96, outcome: 'success' },
    { time: 'Apr 1, 14:00', decision: 'Completed multi-touch attribution model for Q1', reasoning: 'W-shaped model recommended; accounts for both MENA brand and email conversion touchpoints.', confidence: 89, outcome: 'success' },
    { time: 'Apr 1, 09:30', decision: 'SEO audit flagged 14 technical issues on medglobal.org', reasoning: 'Crawl triggered by 12% organic traffic drop week-over-week; 3 critical, 7 moderate, 4 low.', confidence: 94, outcome: 'success' },
    { time: 'Mar 31, 16:00', decision: 'Scheduled weekly performance digest for Fridays 9am', reasoning: 'Owner preference set in Settings; includes KPI summary, anomalies, and recommended actions.', confidence: 98, outcome: 'success' },
    { time: 'Mar 31, 11:00', decision: 'Identified ANZ LinkedIn audience fatigue at 94% overlap', reasoning: 'Lookalike 1% seed fully saturated after 28 days; CPL trending +19% over 2 weeks.', confidence: 91, outcome: 'pending' },
    { time: 'Mar 30, 15:30', decision: 'Flagged MENA email open rate anomaly (+34% WoW) — positive', reasoning: 'Subject line A/B variant B outperforming by 2.1 standard deviations.', confidence: 87, outcome: 'success' },
    { time: 'Mar 30, 10:00', decision: 'Confirmed SEA Demand Gen CTR drop: keyword cluster issue', reasoning: 'Three branded keywords cannibalising non-branded; estimated 8% lead loss recoverable.', confidence: 88, outcome: 'revision' },
    { time: 'Mar 29, 14:00', decision: 'Generated Q1 board-ready analytics report', reasoning: 'Freya delegation; synthesised performance across 6 campaigns; pipeline at $2.4M (112% of target).', confidence: 93, outcome: 'success' },
  ],
  prospector: [
    { time: 'Apr 2, 09:30', decision: 'Enriched 24 new leads from ANZ inbound form', reasoning: 'Clearbit + LinkedIn match rate 87%; Bombora intent signals loaded for 19 of 24.', confidence: 88, outcome: 'success' },
    { time: 'Apr 2, 08:15', decision: 'Qualified 8 leads as MQLs — triggered SDR handoff', reasoning: 'Score >82/100; Healthcare Professional segment; intent: "medical NGO donation" active.', confidence: 91, outcome: 'success' },
    { time: 'Apr 1, 17:00', decision: 'Flagged 3 duplicate records in CRM pipeline', reasoning: 'Email + LinkedIn URL match with <72h gap; merging automatically with primary record.', confidence: 94, outcome: 'success' },
    { time: 'Apr 1, 11:00', decision: 'Scored 40 MENA leads using Bombora intent data', reasoning: 'Surge topics: "international humanitarian healthcare" (+67%) and "Yemen crisis 2026" (+142%).', confidence: 86, outcome: 'success' },
    { time: 'Mar 31, 15:00', decision: 'Identified 12 warm accounts for MENA ABM targeting', reasoning: 'Account score >75; 3+ employees with matched ICP profile; budget indicators: $5M+ org.', confidence: 83, outcome: 'success' },
    { time: 'Mar 31, 10:30', decision: 'Rejected 6 leads as non-ICP — excluded from sequences', reasoning: 'Seniority <Director; org size <200; outside target geographies.', confidence: 97, outcome: 'success' },
    { time: 'Mar 30, 14:00', decision: 'Triggered re-enrichment for 15 stale leads (>90 days)', reasoning: 'Role/company changes detected via LinkedIn API for 8 of 15; 3 now match ICP.', confidence: 85, outcome: 'success' },
    { time: 'Mar 30, 09:15', decision: 'Scored Yemen emergency inbound spike: 31 leads in 48h', reasoning: 'Surge triggered by Yemen media coverage; 18 match major donor ICP (score >80).', confidence: 92, outcome: 'success' },
  ],
  optimizer: [
    { time: 'Apr 2, 08:30', decision: 'Paused ANZ Retargeting A/B test — audience burnout', reasoning: 'Frequency >4x; CTR decayed 23%; statistical power at 61%. Test inconclusive.', confidence: 94, outcome: 'revision' },
    { time: 'Apr 1, 16:00', decision: 'Recommended 3-step form for Yemen landing page', reasoning: 'Current 7-field form has 64% drop-off at field 4; 3-step reduces cognitive load 2.1x historically.', confidence: 81, outcome: 'pending' },
    { time: 'Apr 1, 10:30', decision: 'A/B test: "Save a Life" vs "Donate Now" — winner declared', reasoning: '"Save a Life" reached 95% confidence at day 14. CTR +18%. Applied to all Medglobal pages.', confidence: 97, outcome: 'success' },
    { time: 'Mar 31, 15:30', decision: 'Exit-intent popup optimised — reduced exit rate 14%', reasoning: 'Timing adjusted from 5s to 25s scroll depth; offer changed to whitepaper download.', confidence: 88, outcome: 'success' },
    { time: 'Mar 31, 09:00', decision: 'Onboarding flow audit — 3 friction points identified', reasoning: 'Field 2 (org type), field 5 (budget range), and field 7 (decision timeline) cause most drops.', confidence: 85, outcome: 'pending' },
    { time: 'Mar 30, 14:30', decision: 'Recommended expanding ANZ lookalike seed from 1% to 3%', reasoning: 'Current 1% fully saturated; 3% projects CPL reduction of $18 and 2.4x reach expansion.', confidence: 82, outcome: 'pending' },
    { time: 'Mar 30, 10:00', decision: 'Approved MENA email send-time optimisation: 10am local', reasoning: 'Open rate analysis across 847 MENA leads; peak engagement 9:45-10:30am local time.', confidence: 91, outcome: 'success' },
    { time: 'Mar 29, 16:00', decision: 'SEA landing page heatmap: hero section CTA above fold', reasoning: 'Mobile traffic 62%; CTA was below fold on all mobile viewports; moved saves ~2 clicks.', confidence: 86, outcome: 'success' },
  ],
  outreach: [
    { time: 'Apr 2, 10:15', decision: 'Scheduled Yemen Emergency email sequences for 3 segments', reasoning: 'Strategist brief: Healthcare Professionals, NGO Donors, and Major Gift prospects — separate tracks.', confidence: 92, outcome: 'pending' },
    { time: 'Apr 2, 08:00', decision: 'Sent MENA follow-up sequence to 31 warm leads', reasoning: 'Leads replied to step 1 but not step 2; personalised follow-up with Yemen update.', confidence: 89, outcome: 'success' },
    { time: 'Apr 1, 15:30', decision: 'Paused ANZ cold email sequence pending Guardian review', reasoning: 'Guardian flagged unverified statistic in subject line; sequence held until correction approved.', confidence: 95, outcome: 'revision' },
    { time: 'Apr 1, 11:00', decision: 'Drafted 5-touch LinkedIn sequence for Q2 Donor Acquisition', reasoning: 'ICP: Healthcare Professionals 45-60 in MENA/ANZ; sequence mirrors top-performing CFO sequence.', confidence: 86, outcome: 'success' },
    { time: 'Mar 31, 16:00', decision: 'Scaled MENA email sends by 20% after Analyst insight', reasoning: 'Open rate 48.2% (benchmark 36%); Analyst flagged outperformance; Freya approved scale-up.', confidence: 88, outcome: 'success' },
    { time: 'Mar 31, 10:00', decision: 'Referral program outreach to top 20 Medglobal supporters', reasoning: 'Revenue agent identified high-NPS donors; personalised ask with impact story.', confidence: 91, outcome: 'success' },
    { time: 'Mar 30, 15:00', decision: 'Reply from Dr. Amir Hassan (MENA) — triggered SDR notification', reasoning: 'High-intent reply: "interested in major gift discussion" — routed to SDR within 4 minutes.', confidence: 97, outcome: 'success' },
    { time: 'Mar 30, 09:30', decision: 'Paused APAC sequence step 3 — low reply rate', reasoning: 'Step 3 reply rate 1.2% vs 4.8% benchmark; testing revised subject line before continuing.', confidence: 83, outcome: 'revision' },
  ],
  revenue: [
    { time: 'Apr 2, 09:00', decision: 'Updated Q2 pipeline forecast — 94% of $2.55M target', reasoning: 'Closed 4 new donors in MENA; adjusted forecast model with 30-day rolling conversion rate.', confidence: 90, outcome: 'success' },
    { time: 'Apr 1, 16:00', decision: 'Detected churn signal: Médecins volunteer #4812 lapsed', reasoning: 'No donation in 14 months + email unsubscribe; reactivation playbook triggered.', confidence: 83, outcome: 'pending' },
    { time: 'Apr 1, 11:30', decision: 'Recommended expansion play for 3 APAC major gift accounts', reasoning: 'Accounts increased digital engagement 3x; upgrade from recurring to major gift conversation ready.', confidence: 80, outcome: 'pending' },
    { time: 'Mar 31, 15:00', decision: 'Generated Q2 board-ready revenue projection', reasoning: 'Freya delegation; includes scenario analysis: base $2.4M, upside $2.9M, downside $1.9M.', confidence: 87, outcome: 'success' },
    { time: 'Mar 31, 10:00', decision: 'Win/loss analysis on 6 closed deals in Q1', reasoning: 'Won: operational transparency resonated (4/4). Lost: budget cycle mismatch (2/2).', confidence: 89, outcome: 'success' },
    { time: 'Mar 30, 14:00', decision: 'Flagged pricing friction: recurring gift page showing too early', reasoning: 'Heatmap: 71% drop-off when recurring ask shown on page 1 vs page 3.', confidence: 84, outcome: 'revision' },
    { time: 'Mar 30, 09:00', decision: 'Identified 8 accounts for Q2 major gift pipeline', reasoning: 'ICP score >80 + Bombora intent active + 2+ email engagements in last 30 days.', confidence: 87, outcome: 'success' },
    { time: 'Mar 29, 15:30', decision: 'Churn prevention: re-engagement playbook for 12 lapsed donors', reasoning: 'Time-since-donation >12 months; segment: healthcare professional; impact story + match campaign.', confidence: 85, outcome: 'success' },
  ],
  guardian: [
    { time: 'Apr 2, 09:45', decision: 'Flagged 2 brand tone issues in Yemen CFO email sequence', reasoning: 'Urgency framing too aggressive (7/10); Medglobal brand guideline: max 5/10. Revision requested.', confidence: 95, outcome: 'revision' },
    { time: 'Apr 1, 16:30', decision: 'Approved APAC LinkedIn ad creative', reasoning: 'Brand score 9.4/10; statistics verified against 2024 Annual Report; no compliance issues.', confidence: 93, outcome: 'success' },
    { time: 'Apr 1, 11:15', decision: 'Blocked outreach sequence with unverified mortality statistic', reasoning: '"43% of conflict casualties are preventable" — no source found. Requested Medglobal data team.', confidence: 97, outcome: 'revision' },
    { time: 'Mar 31, 14:00', decision: 'Cleared Medglobal MENA press release draft', reasoning: 'All statistics from verified sources; mission statement accurate; no legal red flags.', confidence: 98, outcome: 'success' },
    { time: 'Mar 31, 09:00', decision: 'Flagged pricing claim in Yemen fundraising copy', reasoning: '"Only $12 provides a week of essential care" — requires Finance team verification before publishing.', confidence: 96, outcome: 'pending' },
    { time: 'Mar 30, 15:00', decision: 'Approved SEA email sequence after revision', reasoning: 'Statistics corrected; tone within brand guidelines; imagery descriptions compliant.', confidence: 94, outcome: 'success' },
    { time: 'Mar 30, 10:30', decision: 'Reviewed Yemen landing page — minor revision requested', reasoning: 'Hero image alt text does not meet accessibility standard; meta description too promotional.', confidence: 91, outcome: 'revision' },
    { time: 'Mar 29, 16:00', decision: 'Cleared Q2 Donor Acquisition email variants 1-3', reasoning: 'All 3 variants: brand tone 8+/10; no unverified stats; CTA compliant. Approved for A/B test.', confidence: 96, outcome: 'success' },
  ],
};

/* ─── Agent outputs per agent ───────────────────────────────── */
const AGENT_OUTPUTS = {
  strategist: [
    { id: 'os1', title: 'Q2 Donor Acquisition Strategy Brief', date: 'Apr 2, 2026', words: 2400, status: 'approved', channel: 'Strategy', confidence: '91%',
      preview: 'Positioning Medglobal as the operational bridge between healthcare professionals and crisis zones. Primary message: "We operate where others cannot." Key differentiator: 95% operational staff ratio vs 60% industry average. Target donor profile: Healthcare Professionals aged 45-60 with history of international giving...' },
    { id: 'os2', title: 'MENA Healthcare Donor ICP Analysis', date: 'Apr 1, 2026', words: 847, status: 'in_review', channel: 'Research', confidence: '86%',
      preview: 'Primary donor persona: Healthcare professionals aged 45-60, income $180k+, previously donated to international health causes. Secondary: NGO sector professionals with decision-making authority. MENA-specific: high concentration in UAE, KSA, Qatar; strong digital engagement via LinkedIn...' },
    { id: 'os3', title: 'Yemen Emergency Campaign Positioning', date: 'Mar 31, 2026', words: 1100, status: 'approved', channel: 'Campaign', confidence: '93%',
      preview: 'Key message: "We operate where others can\'t." 95% operational staff ratio. Humanitarian credibility frame: Medglobal active in Yemen since 2017, 14 clinics operational as of Q1 2026. Urgency without exploitation: lead with outcomes, not suffering...' },
    { id: 'os4', title: 'Competitor NGO Landscape: MENA 2026', date: 'Mar 29, 2026', words: 1650, status: 'approved', channel: 'Research', confidence: '88%',
      preview: 'MSF expanding MENA digital presence — spend up 28%. IRC repositioning from emergency to development. Medglobal unique positioning: only organisation combining 95% operational staff ratio with direct healthcare delivery. Key differentiator remains defensible for 12-18 months...' },
    { id: 'os5', title: 'Q2 Pricing Strategy: Donor Tier Restructure', date: 'Mar 28, 2026', words: 920, status: 'in_review', channel: 'Revenue', confidence: '84%',
      preview: 'Recommended tier restructure: Entry ($25/mo), Sustaining ($100/mo), Major ($500/mo). Rationale: current mid-tier ($50) creates decision paralysis. New structure mirrors MSF (most-studied peer), reduces cognitive load, projected to increase average recurring gift by 18%...' },
  ],
  copywriter: [
    { id: 'oc1', title: 'Q2 Donor Email Variant 4 — "Your Impact"', date: 'Apr 2, 2026', words: 320, status: 'in_review', channel: 'Email', confidence: '88%',
      preview: 'Subject: "Dr. Sarah, your donation to Yemen saved 4 lives this month." Opening: personalisation with recipient\'s title and name. Body: specific patient outcomes tied to donation amount. CTA: "See your impact report →". Testing: personalised vs generic subject line...' },
    { id: 'oc2', title: 'Yemen Emergency Landing Page Copy', date: 'Apr 1, 2026', words: 740, status: 'approved', channel: 'Web', confidence: '94%',
      preview: 'Hero: "14 Medglobal clinics are operational in Yemen today. Because of donors like you." Subhead: "We\'ve been on the ground since 2017 — when others left." Social proof: 94,000 patients treated in 2025. CTA: "Donate Now — 95¢ of every dollar goes to the field."...' },
    { id: 'oc3', title: 'MENA LinkedIn Ad Creative — 3 Variants', date: 'Apr 1, 2026', words: 290, status: 'approved', channel: 'LinkedIn', confidence: '91%',
      preview: 'Variant A: "Medglobal: 95% of staff are healthcare professionals. 0% overhead stories." Variant B: "Yemen Crisis Update: teams on the ground — we need your support now." Variant C: "Join 4,200 healthcare professionals who fund where they can\'t go."...' },
    { id: 'oc4', title: '"Healthcare in Crisis Zones" Whitepaper', date: 'Mar 31, 2026', words: 1840, status: 'in_review', channel: 'Content', confidence: '82%',
      preview: 'Section 1: The operational reality of crisis healthcare (field data from Yemen, Syria, South Sudan). Section 2: Why donor funding efficiency matters — the 95% model. Section 3: Case studies — what $10,000 buys in a crisis zone. Section 4: How to give effectively...' },
    { id: 'oc5', title: 'SEA Demand Gen Email Sequence — 5 Steps', date: 'Mar 30, 2026', words: 1250, status: 'approved', channel: 'Email', confidence: '87%',
      preview: 'Step 1: "Healthcare professionals are the most effective donors. Here\'s why." Step 2: "We\'ve been in [Country] since [Year]. The numbers are hard to ignore." Step 3: Patient outcome story. Step 4: Specific ask — recurring $200/month. Step 5: Objection handling...' },
  ],
  analyst: [
    { id: 'oa1', title: 'Yemen Campaign CTR Anomaly Report', date: 'Apr 2, 2026', words: 480, status: 'approved', channel: 'Analytics', confidence: '96%',
      preview: 'CTR dropped 23% on Feb 22 across Meta and LinkedIn placements for Yemen Emergency campaign. Root cause: ad fatigue — frequency reached 4.2x (threshold: 3.5x). Affected segments: Healthcare Professionals 45-60 ANZ and MENA. Recommendation: rotate to 3 new creative sets...' },
    { id: 'oa2', title: 'Multi-Touch Attribution Model — Q1 2026', date: 'Apr 1, 2026', words: 1200, status: 'approved', channel: 'Analytics', confidence: '89%',
      preview: 'W-Shaped model recommended for Medglobal pipeline analysis. Revenue credit distribution: First Touch 24%, W-Shaped 31%, Linear 18%, Time Decay 19%, Last Touch 8%. Top converting touchpoint: LinkedIn → Email nurture → landing page → donation form...' },
    { id: 'oa3', title: 'medglobal.org Technical SEO Audit', date: 'Apr 1, 2026', words: 2100, status: 'in_review', channel: 'SEO', confidence: '94%',
      preview: 'Critical issues: 3 (Core Web Vitals failure on mobile; missing canonical tags on 47 campaign pages; broken hreflang for Arabic/French). Moderate: 7. Organic traffic down 12% WoW — attributed to Google March 2026 core update. Recovery timeline: 4-6 weeks post-fix...' },
    { id: 'oa4', title: 'Channel Performance Report — Mar 2026', date: 'Mar 31, 2026', words: 860, status: 'approved', channel: 'Analytics', confidence: '93%',
      preview: 'Best performer: Email at $49 CAC (3x better than LinkedIn). ROAS leaders: Email 6.1x, Meta 3.8x, LinkedIn 2.9x. MENA email sequences outperforming forecast by 34%. ANZ retargeting underperforming — audience burnout at 94%...' },
    { id: 'oa5', title: 'Weekly Performance Digest — W13 2026', date: 'Mar 29, 2026', words: 540, status: 'approved', channel: 'Report', confidence: '97%',
      preview: 'Total leads this week: 61 (vs 48 target). Pipeline: $2.4M (+$180k WoW). Blended CAC: $144 (down $6). ROAS: 3.2x. Anomalies: Yemen CTR drop, ANZ burnout. Wins: MENA email open rate +34%. Actions required: rotate Yemen creatives, pause ANZ...' },
  ],
  prospector: [
    { id: 'op1', title: 'ANZ Inbound Lead Enrichment Report — Apr 2', date: 'Apr 2, 2026', words: 340, status: 'approved', channel: 'CRM', confidence: '88%',
      preview: '24 new leads enriched: 19 matched Clearbit, 18 matched LinkedIn, 15 have active Bombora intent signals. MQL-qualified: 8. Top segment: Hospital Administrators (6) and Private Practice GPs (4). Geographic split: Sydney 9, Melbourne 7, Auckland 5...' },
    { id: 'op2', title: 'MENA ABM Target Account List — Q2 2026', date: 'Apr 1, 2026', words: 720, status: 'in_review', channel: 'ABM', confidence: '86%',
      preview: '12 priority accounts identified for MENA ABM campaign. Score range: 76-94/100. Top: Dubai Health Authority — 34 employees matching Healthcare Professional ICP, $8M+ institutional giving history. Bombora intent: "medical humanitarian aid" surge active for 6 of 12...' },
    { id: 'op3', title: 'Intent Signal Summary — Mar 28 - Apr 2', date: 'Apr 1, 2026', words: 420, status: 'approved', channel: 'Intent', confidence: '91%',
      preview: 'Top surging topics: "international humanitarian healthcare" (+67% in MENA), "Yemen crisis 2026" (+142% globally), "NGO donation tax deduction" (+38% in ANZ). 18 leads re-scored to MQL tier following surge detection...' },
    { id: 'op4', title: 'CRM Duplicate Resolution Report', date: 'Mar 31, 2026', words: 280, status: 'approved', channel: 'CRM', confidence: '94%',
      preview: '3 duplicate records resolved: Dr. P. Nair (appeared under 2 emails), Mohammed Al-Rashid (LinkedIn vs form submission), Sarah Chen (company name variant). Primary records preserved; duplicate data merged. Net pipeline impact: -3 leads...' },
    { id: 'op5', title: 'Yemen Emergency Inbound Surge Analysis', date: 'Mar 30, 2026', words: 510, status: 'approved', channel: 'Analytics', confidence: '92%',
      preview: '31 inbound leads captured in 48h following Yemen media coverage surge. 18 match major donor ICP (score >80). Average donation intent: $2,400 (vs $800 baseline). Recommended: fast-track to Outreach within 24h...' },
  ],
  optimizer: [
    { id: 'oop1', title: 'ANZ A/B Test Pause Report — Apr 2', date: 'Apr 2, 2026', words: 380, status: 'approved', channel: 'A/B Test', confidence: '94%',
      preview: 'Test paused at day 28 — audience burnout. Frequency: 4.2x. CTR decay: -23%. Statistical power at test pause: 61% (target: 95%). Conclusion: inconclusive. Recommendation: refresh creative pool, restart with expanded 3% lookalike seed...' },
    { id: 'oop2', title: 'CTA Test Winner: "Save a Life" vs "Donate Now"', date: 'Apr 1, 2026', words: 520, status: 'approved', channel: 'A/B Test', confidence: '97%',
      preview: '"Save a Life" reached 95% confidence at day 14. CTR improvement: +18%. Conversion rate: +12%. Applied to all Medglobal campaign landing pages. Estimated incremental donations per quarter: $28,000 based on current traffic...' },
    { id: 'oop3', title: 'Yemen Landing Page CRO Recommendations', date: 'Apr 1, 2026', words: 640, status: 'in_review', channel: 'CRO', confidence: '81%',
      preview: 'Current conversion rate: 4.2%. Industry benchmark for emergency appeals: 6.8%. Gap: 7-field form (64% drop-off at field 4), CTA below fold on mobile (62% of traffic), no social proof near donation button. Recommendations: 3-step form, move CTA above fold...' },
    { id: 'oop4', title: 'Exit-Intent Popup Optimisation Report', date: 'Mar 31, 2026', words: 290, status: 'approved', channel: 'CRO', confidence: '88%',
      preview: 'Previous: 5-second trigger, "Don\'t miss out" generic offer. Updated: 25-second scroll depth trigger, whitepaper download offer. Exit rate reduced 14%. Email capture increased 31%. Whitepaper leads: 42 in first week, 28% higher quality score...' },
    { id: 'oop5', title: 'MENA Send-Time Optimisation Analysis', date: 'Mar 30, 2026', words: 340, status: 'approved', channel: 'Email', confidence: '91%',
      preview: 'Analysed 847 MENA donor email engagements over 90 days. Peak open window: 9:45-10:30am local time. Day-of-week: Tuesday and Thursday perform 22% above average. Updated send schedule for all MENA sequences. Projected open rate improvement: +6-9pp...' },
  ],
  outreach: [
    { id: 'ore1', title: 'Yemen Emergency Email Sequence — 3-Segment Plan', date: 'Apr 2, 2026', words: 1800, status: 'in_review', channel: 'Email', confidence: '92%',
      preview: 'Segment A (Healthcare Professionals): 5-touch sequence, leads with impact data, closes with peer testimonial. Segment B (NGO Donors): 4-touch, institutional angle, UN partnership highlighted. Segment C (Major Gift Prospects): 3-touch, personalised opening, SDR handoff at step 3...' },
    { id: 'ore2', title: 'MENA Donor LinkedIn Sequence — 5 Steps', date: 'Apr 1, 2026', words: 960, status: 'approved', channel: 'LinkedIn', confidence: '86%',
      preview: 'Step 1 connection note: "Fellow healthcare professional — sharing what Medglobal is doing in Yemen." Step 2: Yemen impact story. Step 3: Whitepaper offer. Step 4: Soft ask — monthly recurring. Step 5: SDR handoff if >2 engagements. Expected reply rate: 8.4%...' },
    { id: 'ore3', title: 'Referral Program Outreach — Top 20 Supporters', date: 'Mar 31, 2026', words: 480, status: 'approved', channel: 'Email', confidence: '91%',
      preview: 'Personalised outreach to Medglobal\'s top 20 donors by lifetime value. Message: "You\'ve helped us reach 94,000 patients. Would you introduce us to one colleague?" Referral incentive: named patient sponsorship for referred donor. Expected referral conversion: 12%...' },
    { id: 'ore4', title: 'ANZ Outreach Sequence — Revised Step 3', date: 'Mar 31, 2026', words: 380, status: 'in_review', channel: 'Email', confidence: '83%',
      preview: 'Original step 3 reply rate: 1.2% (benchmark 4.8%). Root cause: generic subject line and no personalisation. Revised: subject line includes recipient\'s country + role. Body: uses specific ANZ healthcare context. Estimated improvement: 3.2-4.4% reply rate...' },
    { id: 'ore5', title: 'SDR Handoff Report — Dr. Amir Hassan', date: 'Mar 30, 2026', words: 240, status: 'approved', channel: 'SDR', confidence: '97%',
      preview: 'High-intent reply received: "I\'m interested in discussing a major gift in support of your Yemen operations." Account: Dubai-based senior cardiologist, $8M+ institutional giving history. Handoff completed in 4 minutes. SDR briefed: context, history, recommended talk track...' },
  ],
  revenue: [
    { id: 'orv1', title: 'Q2 Pipeline Forecast Update — Apr 2', date: 'Apr 2, 2026', words: 520, status: 'approved', channel: 'Forecast', confidence: '90%',
      preview: 'Q2 forecast: $2.4M pipeline, 94% of $2.55M target. Scenario analysis: Base $2.4M, Upside $2.9M (MENA major gifts + Yemen surge), Downside $1.9M. Key risk: 3 major gift conversations stalled at negotiation...' },
    { id: 'orv2', title: 'APAC Expansion Play — 3 Priority Accounts', date: 'Apr 1, 2026', words: 680, status: 'in_review', channel: 'Pipeline', confidence: '80%',
      preview: 'Account 1: Auckland DHB Foundation — recurring gift upgrade from $12k/yr to $50k/yr. Account 2: Singapore Medical Association — institutional partnership discussion ready. Account 3: Melbourne Private Hospital Group — major gift conversation recommended...' },
    { id: 'orv3', title: 'Q1 Win/Loss Analysis — 6 Closed Deals', date: 'Mar 31, 2026', words: 940, status: 'approved', channel: 'Analysis', confidence: '89%',
      preview: 'Won: 4 deals. Common factor: donor cited "operational transparency" and "95% field ratio". Lost: 2 deals. Common factor: budget cycle mismatch. Recommendation: track fiscal year data; create quarterly touchpoint calendar...' },
    { id: 'orv4', title: 'Churn Prevention — 12 Lapsed Donor Playbook', date: 'Mar 30, 2026', words: 760, status: 'approved', channel: 'Retention', confidence: '85%',
      preview: 'Segment: 12 donors lapsed >12 months, previous gift >$1,000. Reactivation strategy: impact story tied to original campaign. Match offer: "Your renewal will be matched 2:1 by our APAC board member." Expected reactivation rate: 25-35%...' },
    { id: 'orv5', title: 'Board Revenue Projection — Q2 2026', date: 'Mar 29, 2026', words: 1400, status: 'approved', channel: 'Board', confidence: '87%',
      preview: 'Board-ready Q2 projection. Headline: $2.4M pipeline on $112.5K marketing investment = ROAS 3.2x. Major gift pipeline: $890K. Recurring donor base: $74K/month growing 8% MoM. Institutional giving target: $680K, currently at 62%...' },
  ],
  guardian: [
    { id: 'og1', title: 'Yemen Email Sequence Brand Audit — Apr 2', date: 'Apr 2, 2026', words: 340, status: 'revision_requested', channel: 'Compliance', confidence: '95%',
      preview: 'Issues found: (1) Urgency framing score 7/10 — exceeds Medglobal guideline max of 5/10. (2) Statistic on page 2 requires Annual Report citation. Revision requested before send approval. Non-blocking issues: 2 minor tone adjustments suggested...' },
    { id: 'og2', title: 'APAC LinkedIn Ad — Compliance Clearance', date: 'Apr 1, 2026', words: 180, status: 'approved', channel: 'Compliance', confidence: '93%',
      preview: 'Brand score: 9.4/10. All statistics verified. Mission statement accurate. No compliance issues. Tone: professional, credible, within humanitarian standards. Cleared for publication. Notes: image alt text should be updated for WCAG 2.1 AA...' },
    { id: 'og3', title: 'Mortality Statistic Block — Yemen Outreach', date: 'Apr 1, 2026', words: 220, status: 'revision_requested', channel: 'Compliance', confidence: '97%',
      preview: 'Blocked: "43% of conflict casualties in Yemen are preventable with basic medical care." Source: not found in Medglobal knowledge base, WHO publications, or OCHA data. Sequence held pending resolution...' },
    { id: 'og4', title: 'MENA Press Release — Compliance Clearance', date: 'Mar 31, 2026', words: 290, status: 'approved', channel: 'PR', confidence: '98%',
      preview: 'Full compliance clearance for MENA Q2 press release. All statistics sourced and verified. Mission statement matches website and official materials. Legal: no claims requiring review. Minor clarity improvement recommended in paragraph 3...' },
    { id: 'og5', title: 'SEA Email Sequence — Post-Revision Clearance', date: 'Mar 30, 2026', words: 210, status: 'approved', channel: 'Email', confidence: '94%',
      preview: 'Revised version cleared. Statistics verified. Brand tone: 8.8/10. Humanitarian standards: compliant. No exploitation language. Imagery references: appropriate. Sequence approved for all 3 SEA segments...' },
  ],
  freya: [
    { id: 'of1', title: 'Yemen Emergency Campaign Orchestration Plan', date: 'Apr 2, 2026', words: 980, status: 'approved', channel: 'Workflow', confidence: '92%',
      preview: 'Orchestrated 4-agent Campaign Launch workflow: Strategist (positioning brief, 45min), Copywriter (landing page + email copy, 2.1h), Guardian (compliance review, 28min), Outreach (sequence scheduling, ongoing). 8 of 12 workflow steps complete. Launch on track for Apr 4...' },
    { id: 'of2', title: 'ANZ Budget Reallocation Recommendation', date: 'Apr 2, 2026', words: 420, status: 'in_review', channel: 'Strategy', confidence: '88%',
      preview: 'Recommendation: Pause ANZ Retargeting ($6,200/mo) and reallocate to MENA Healthcare Donor campaign. Rationale: ANZ burnout at 94%; MENA ICP signal up 67%; MENA projected 2.4x higher pipeline value. Requires owner approval. Estimated impact: +$48k pipeline in 60 days...' },
    { id: 'of3', title: 'Weekly Agent Status Report — W13 2026', date: 'Mar 29, 2026', words: 740, status: 'approved', channel: 'Report', confidence: '96%',
      preview: 'Agent health: All 8 agents operational. Highest activity: Outreach (31 tasks), Analyst (24), Copywriter (18). Escalations: 2. Approvals pending: 4. Workflow completions: 3. Credits used: 340 of 500. No errors in reporting period...' },
    { id: 'of4', title: 'Q2 Donor Acquisition Workflow Blueprint', date: 'Mar 28, 2026', words: 560, status: 'approved', channel: 'Workflow', confidence: '93%',
      preview: 'Blueprint for Q2: 6-workflow sequence over 8 weeks. Week 1-2: Campaign Launch (Strategist→Copywriter→Guardian→Outreach). Week 3-4: Lead-to-Customer. Week 5-6: Performance Review. Week 7-8: A/B Test optimisation. Estimated total credits: 480...' },
    { id: 'of5', title: 'Agent Conflict Resolution — Yemen Ad Copy', date: 'Mar 31, 2026', words: 320, status: 'approved', channel: 'Governance', confidence: '85%',
      preview: 'Conflict: Strategist urgency score (8.2) vs Guardian sensitivity flag on Yemen imagery. Resolution: added contextual disclaimer, reduced urgency score to 5.5/10, imagery description adjusted for humanitarian standards. Both agents accepted resolution...' },
  ],
};

/* ─── Live data per agent ───────────────────────────────────── */
const AGENT_LIVE = {
  freya: { currentTask: 'Orchestrating Q2 Campaign Launch — Copywriter step active', status: 'executing', tasks: 34, approvalRate: '—', avgTime: '1.2m', escalations: 2 },
  strategist: { currentTask: 'Analyzing MENA competitor positioning', status: 'executing', tasks: 24, approvalRate: '96%', avgTime: '4.2m', escalations: 1 },
  copywriter: { currentTask: 'Drafting email variant 4 for Q2 Donor Acquisition', status: 'executing', tasks: 31, approvalRate: '94%', avgTime: '3.1m', escalations: 0 },
  analyst: { currentTask: 'Processing 30-day Meta Ads data — CTR anomaly detection', status: 'idle', tasks: 28, approvalRate: '97%', avgTime: '2.8m', escalations: 1 },
  prospector: { currentTask: 'Enriching 47 new MENA leads from LinkedIn scrape', status: 'idle', tasks: 19, approvalRate: '91%', avgTime: '5.2m', escalations: 0 },
  optimizer: { currentTask: 'A/B test: donation CTA (n=1,240, day 3 of 7)', status: 'executing', tasks: 22, approvalRate: '93%', avgTime: '3.4m', escalations: 0 },
  outreach: { currentTask: 'Scheduling 12 APAC follow-ups — 9:00–11:00 AM window', status: 'idle', tasks: 26, approvalRate: '95%', avgTime: '2.9m', escalations: 0 },
  revenue: { currentTask: 'Updating Q2 forecast with 6 new pipeline entries', status: 'idle', tasks: 18, approvalRate: '98%', avgTime: '4.8m', escalations: 0 },
  guardian: { currentTask: 'Reviewing 3 Yemen ad creatives — claims + imagery policy', status: 'idle', tasks: 12, approvalRate: '100%', avgTime: '6.1m', escalations: 1 },
};

/* ─── Helpers ─────────────────────────────────────────────────── */
function statusColor(s) {
  if (s === 'thinking')  return C.amber;
  if (s === 'executing') return C.primary;
  if (s === 'done')      return C.green;
  if (s === 'error')     return C.red;
  return C.textMuted;
}
function statusLabel(s) {
  if (s === 'thinking')  return 'Thinking';
  if (s === 'executing') return 'Active';
  if (s === 'done')      return 'Done';
  if (s === 'error')     return 'Error';
  return 'Idle';
}
function outcomeColor(o) {
  if (o === 'success')  return C.green;
  if (o === 'pending')  return C.amber;
  if (o === 'revision') return C.secondary;
  return C.textMuted;
}
function outputStatusConfig(status) {
  const map = {
    approved:           { label: 'Approved',      color: C.green,     bg: 'rgba(16,185,129,0.1)',   border: C.green,     leftColor: C.green },
    in_review:          { label: 'In Review',     color: C.amber,     bg: 'rgba(251,191,36,0.08)',  border: C.amber,     leftColor: C.amber },
    draft:              { label: 'Draft',          color: C.textMuted, bg: C.surface2,               border: C.border,    leftColor: C.surface3 },
    revision_requested: { label: 'Revision Req.', color: C.red,       bg: 'rgba(239,68,68,0.08)',   border: C.red,       leftColor: C.red },
    rejected:           { label: 'Rejected',       color: C.red,       bg: 'rgba(239,68,68,0.1)',    border: C.red,       leftColor: C.red },
  };
  return map[status] || map.draft;
}

/* ─── Output Card ─────────────────────────────────────────────── */
function OutputCard({ output, onAction }) {
  const [expanded, setExpanded] = useState(false);
  const sc = outputStatusConfig(output.status);

  return (
    <div style={{
      backgroundColor: C.surface, border: `1px solid ${C.border}`,
      borderLeft: `3px solid ${sc.leftColor}`,
      borderRadius: R.md, padding: S[4],
      display: 'flex', flexDirection: 'column', gap: S[2],
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: S[3] }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: F.display, fontSize: '14px', fontWeight: 700, color: C.textPrimary, marginBottom: '3px' }}>
            {output.title}
          </div>
          <div style={{ display: 'flex', gap: S[3], flexWrap: 'wrap' }}>
            <span style={{ fontFamily: F.mono, fontSize: '10px', color: C.textMuted }}>{output.date}</span>
            <span style={{ fontFamily: F.mono, fontSize: '10px', color: C.textMuted }}>{output.words.toLocaleString()}w</span>
            {output.channel && (
              <span style={{ fontFamily: F.mono, fontSize: '9px', color: C.primary, backgroundColor: 'rgba(74,124,111,0.1)', border: `1px solid rgba(74,124,111,0.2)`, borderRadius: R.pill, padding: '1px 6px' }}>
                {output.channel}
              </span>
            )}
            {output.confidence && (
              <span style={{ fontFamily: F.mono, fontSize: '9px', color: C.secondary, backgroundColor: C.surface3, border: `1px solid ${C.border}`, borderRadius: R.pill, padding: '1px 6px' }}>
                {output.confidence} confidence
              </span>
            )}
          </div>
        </div>
        <span style={{
          fontFamily: F.mono, fontSize: '10px', fontWeight: 700,
          color: sc.color, backgroundColor: sc.bg,
          border: `1px solid ${sc.border}40`, borderRadius: R.pill,
          padding: '2px 8px', flexShrink: 0,
        }}>
          {sc.label}
        </span>
      </div>

      {/* Preview text */}
      <div
        onClick={() => setExpanded(!expanded)}
        style={{
          fontFamily: F.body, fontSize: '12px', color: C.textSecondary, lineHeight: 1.55,
          display: expanded ? 'block' : '-webkit-box',
          WebkitLineClamp: expanded ? 'unset' : 3,
          WebkitBoxOrient: 'vertical',
          overflow: expanded ? 'visible' : 'hidden',
          cursor: 'pointer',
        }}
      >
        {output.preview}
      </div>
      {!expanded && (
        <button
          onClick={() => setExpanded(true)}
          style={{ alignSelf: 'flex-start', fontFamily: F.body, fontSize: '11px', color: C.primary, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
        >
          Read more ↓
        </button>
      )}

      {/* Actions */}
      <div style={{ display: 'flex', gap: S[2], paddingTop: S[1], borderTop: `1px solid ${C.border}` }}>
        <button onClick={() => onAction('view', output)} style={{ ...btn.ghost, fontSize: '11px', padding: `3px ${S[3]}` }}>
          View Full
        </button>
        <button onClick={() => onAction('copy', output)} style={{ ...btn.ghost, fontSize: '11px', padding: `3px ${S[3]}` }}>
          Copy
        </button>
        {output.status === 'in_review' && (
          <>
            <button
              onClick={() => onAction('approve', output)}
              style={{ fontFamily: F.body, fontSize: '11px', fontWeight: 600, color: C.green, backgroundColor: 'rgba(16,185,129,0.1)', border: `1px solid rgba(16,185,129,0.3)`, borderRadius: R.button, padding: `3px ${S[3]}`, cursor: 'pointer' }}
            >
              ✓ Approve
            </button>
            <button
              onClick={() => onAction('reject', output)}
              style={{ fontFamily: F.body, fontSize: '11px', fontWeight: 600, color: C.red, backgroundColor: 'rgba(239,68,68,0.1)', border: `1px solid rgba(239,68,68,0.2)`, borderRadius: R.button, padding: `3px ${S[3]}`, cursor: 'pointer' }}
            >
              ✕ Reject
            </button>
          </>
        )}
      </div>
    </div>
  );
}

/* ─── Tab: Outputs ─────────────────────────────────────────────── */
function OutputsTab({ agentId, outputs, onAction }) {
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  const FILTERS = [
    { id: 'all', label: 'All' },
    { id: 'approved', label: 'Approved' },
    { id: 'in_review', label: 'In Review' },
    { id: 'draft', label: 'Draft' },
    { id: 'revision_requested', label: 'Revision' },
  ];

  const filtered = (outputs || []).filter((o) => {
    const matchFilter = filter === 'all' || o.status === filter;
    const matchSearch = !search.trim() || o.title.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: S[4] }}>
      {/* Filter + search bar */}
      <div style={{ display: 'flex', gap: S[3], alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: '1 1 200px', maxWidth: '280px' }}>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search outputs..."
            style={{
              width: '100%', boxSizing: 'border-box',
              backgroundColor: C.surface, color: C.textPrimary,
              border: `1px solid ${C.border}`, borderRadius: R.input,
              padding: `${S[2]} ${S[3]}`,
              fontFamily: F.body, fontSize: '13px', outline: 'none',
            }}
          />
        </div>
        <div style={{ display: 'flex', gap: S[1] }}>
          {FILTERS.map((f) => {
            const isAct = filter === f.id;
            return (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                style={{
                  fontFamily: F.body, fontSize: '12px', fontWeight: isAct ? 600 : 400,
                  color: isAct ? C.primary : C.textSecondary,
                  backgroundColor: isAct ? 'rgba(74,124,111,0.12)' : C.surface2,
                  border: `1px solid ${isAct ? 'rgba(74,124,111,0.3)' : C.border}`,
                  borderRadius: R.pill, padding: `${S[1]} ${S[3]}`,
                  cursor: 'pointer',
                }}
              >
                {f.label}
              </button>
            );
          })}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: `${S[8]} 0`, color: C.textMuted, fontFamily: F.body, fontSize: '14px' }}>
          No outputs match this filter.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: S[3] }}>
          {filtered.map((o) => (
            <OutputCard key={o.id} output={o} onAction={onAction} />
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── Tab: Live ─────────────────────────────────────────────────── */
function LiveTab({ agentId, agent, liveData, onActivate }) {
  const isActive = liveData?.status === 'executing' || liveData?.status === 'thinking';
  const dotC = statusColor(liveData?.status || 'idle');

  const MOCK_FEED = [
    { time: '9:22 AM', type: 'executing', msg: liveData?.currentTask || 'Processing task...' },
    { time: '9:14 AM', type: 'done',      msg: 'Completed previous task — result stored in memory' },
    { time: '8:48 AM', type: 'message',   msg: 'Received delegation from Freya: MENA campaign brief' },
    { time: '8:42 AM', type: 'done',      msg: 'Retrieved brand context from memory namespace' },
    { time: '8:30 AM', type: 'executing', msg: 'Loaded ICP data + competitor intel for brief' },
    { time: 'Yesterday', type: 'done',    msg: 'Completed Yemen Emergency Campaign Positioning (1,100w)' },
    { time: 'Yesterday', type: 'message', msg: 'Approval received from owner on Q2 Strategy Brief' },
    { time: 'Yesterday', type: 'error',   msg: 'Guardian flagged urgency framing — revision request sent' },
  ];

  const typeColor = { executing: C.amber, done: C.green, message: '#60A5FA', error: C.red };
  const typeLabel = { executing: '●', done: '✓', message: '↔', error: '✕' };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: S[4] }}>
      {/* Current task banner */}
      <div style={{
        backgroundColor: isActive ? 'rgba(74,124,111,0.08)' : C.surface,
        border: `1px solid ${isActive ? C.primary : C.border}`,
        borderRadius: R.md, padding: S[4],
        display: 'flex', alignItems: 'center', gap: S[3],
      }}>
        <div style={{
          width: '10px', height: '10px', borderRadius: '50%',
          backgroundColor: dotC,
          boxShadow: isActive ? `0 0 8px ${dotC}` : 'none',
          animation: isActive ? 'adPulse 1.8s ease-in-out infinite' : 'none',
          flexShrink: 0,
        }} />
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: F.mono, fontSize: '10px', color: C.textMuted, fontWeight: 700, textTransform: 'uppercase', marginBottom: '2px' }}>
            {isActive ? 'Current Task' : 'Idle — awaiting task'}
          </div>
          {isActive && (
            <div style={{ fontFamily: F.body, fontSize: '13px', color: C.amber }}>
              {liveData.currentTask}
            </div>
          )}
        </div>
        {!isActive && (
          <button onClick={onActivate} style={{ ...btn.primary, fontSize: '12px' }}>
            ▶ Activate Now
          </button>
        )}
      </div>

      {/* Activity feed */}
      <div>
        <div style={{ fontFamily: F.mono, fontSize: '10px', fontWeight: 700, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: S[3] }}>
          Activity Feed
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: S[2] }}>
          {MOCK_FEED.map((item, i) => (
            <div key={i} style={{ display: 'flex', gap: S[3], alignItems: 'flex-start' }}>
              <span style={{ fontFamily: F.mono, fontSize: '10px', color: C.textMuted, width: '70px', flexShrink: 0, marginTop: '2px' }}>
                {item.time}
              </span>
              <span style={{
                width: '16px', height: '16px', borderRadius: '50%', flexShrink: 0,
                backgroundColor: `${typeColor[item.type]}20`,
                border: `1px solid ${typeColor[item.type]}40`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: F.mono, fontSize: '9px', color: typeColor[item.type], fontWeight: 700,
                marginTop: '1px',
              }}>
                {typeLabel[item.type]}
              </span>
              <span style={{ fontFamily: F.body, fontSize: '12px', color: item.type === 'executing' ? C.amber : C.textSecondary, lineHeight: 1.45 }}>
                {item.msg}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Tab: Decisions ────────────────────────────────────────────── */
function DecisionsTab({ agentId, decisions }) {
  const agentDecisions = decisions || [];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: S[3] }}>
      <div style={{ fontFamily: F.body, fontSize: '12px', color: C.textSecondary, marginBottom: S[1] }}>
        {agentDecisions.length} decisions logged in the last 7 days
      </div>
      {agentDecisions.map((d, i) => {
        const oColor = outcomeColor(d.outcome);
        return (
          <div key={i} style={{
            backgroundColor: C.surface, border: `1px solid ${C.border}`,
            borderLeft: `3px solid ${oColor}`,
            borderRadius: R.md, padding: S[4],
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: S[3], marginBottom: S[2] }}>
              <div style={{ fontFamily: F.display, fontSize: '13px', fontWeight: 700, color: C.textPrimary, flex: 1 }}>
                {d.decision}
              </div>
              <span style={{
                fontFamily: F.mono, fontSize: '9px', fontWeight: 700,
                color: oColor, backgroundColor: `${oColor}15`,
                border: `1px solid ${oColor}40`,
                borderRadius: R.pill, padding: '2px 7px', flexShrink: 0,
                textTransform: 'uppercase',
              }}>
                {d.outcome}
              </span>
            </div>
            <div style={{ fontFamily: F.body, fontSize: '12px', color: C.textSecondary, marginBottom: S[3], lineHeight: 1.5 }}>
              {d.reasoning}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: S[4] }}>
              <span style={{ fontFamily: F.mono, fontSize: '10px', color: C.textMuted }}>{d.time}</span>
              {/* Confidence bar */}
              <div style={{ display: 'flex', alignItems: 'center', gap: S[2], flex: 1 }}>
                <span style={{ fontFamily: F.mono, fontSize: '10px', color: C.textMuted, flexShrink: 0 }}>Confidence</span>
                <div style={{ flex: 1, height: '4px', backgroundColor: C.surface3, borderRadius: R.pill, overflow: 'hidden' }}>
                  <div style={{
                    height: '100%', width: `${d.confidence}%`,
                    backgroundColor: d.confidence >= 90 ? C.green : d.confidence >= 80 ? C.primary : C.amber,
                    borderRadius: R.pill,
                  }} />
                </div>
                <span style={{ fontFamily: F.mono, fontSize: '10px', fontWeight: 700, color: C.textPrimary, flexShrink: 0 }}>
                  {d.confidence}%
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ─── Tab: Memory ────────────────────────────────────────────────── */
function MemoryTab({ agentId }) {
  const navigate = useNavigate();
  const toast    = useToast();
  const nsMap    = MEMORY_NAMESPACES[agentId] || { reads: [], writes: [] };
  const allNs    = ['brand', 'audience', 'campaigns', 'performance', 'knowledge', 'decisions'];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: S[3] }}>
      <div style={{ fontFamily: F.body, fontSize: '12px', color: C.textSecondary }}>
        Memory namespaces this agent reads and writes to.
      </div>
      {allNs.map((ns) => {
        const reads  = nsMap.reads?.includes(ns);
        const writes = nsMap.writes?.includes(ns);
        if (!reads && !writes) return null;
        return (
          <div key={ns} style={{
            backgroundColor: C.surface, border: `1px solid ${C.border}`,
            borderRadius: R.md, padding: S[4],
            display: 'flex', alignItems: 'center', gap: S[4],
          }}>
            <div style={{
              width: '40px', height: '40px', borderRadius: R.md,
              backgroundColor: 'rgba(74,124,111,0.1)', border: `1px solid rgba(74,124,111,0.2)`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: F.mono, fontSize: '12px', fontWeight: 700, color: C.primary,
              flexShrink: 0,
            }}>
              {ns.slice(0, 2).toUpperCase()}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: F.display, fontSize: '14px', fontWeight: 700, color: C.textPrimary, marginBottom: '4px', textTransform: 'capitalize' }}>
                {ns}
              </div>
              <div style={{ display: 'flex', gap: S[2] }}>
                {reads && (
                  <span style={{ fontFamily: F.mono, fontSize: '10px', color: '#60A5FA', backgroundColor: 'rgba(96,165,250,0.1)', border: `1px solid rgba(96,165,250,0.2)`, borderRadius: R.pill, padding: '1px 7px' }}>
                    reads
                  </span>
                )}
                {writes && (
                  <span style={{ fontFamily: F.mono, fontSize: '10px', color: C.green, backgroundColor: 'rgba(16,185,129,0.1)', border: `1px solid rgba(16,185,129,0.2)`, borderRadius: R.pill, padding: '1px 7px' }}>
                    writes
                  </span>
                )}
                <span style={{ fontFamily: F.body, fontSize: '11px', color: C.textMuted }}>Last access: 4m ago</span>
              </div>
            </div>
            <button
              onClick={() => navigate('/aria/memory')}
              style={{ ...btn.secondary, fontSize: '11px' }}
            >
              Inspect →
            </button>
          </div>
        );
      })}
    </div>
  );
}

/* ─── Tab: Skills ────────────────────────────────────────────────── */
function SkillsTab({ agent }) {
  const toast = useToast();
  const [enabled, setEnabled] = useState(() => {
    const init = {};
    agent.skills.forEach((s) => { init[s] = true; });
    return init;
  });

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: S[3] }}>
      {agent.skills.map((sk) => (
        <div key={sk} style={{
          backgroundColor: C.surface, border: `1px solid ${C.border}`,
          borderRadius: R.md, padding: S[4],
          display: 'flex', flexDirection: 'column', gap: S[2],
          opacity: enabled[sk] ? 1 : 0.5,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontFamily: F.display, fontSize: '13px', fontWeight: 700, color: C.textPrimary }}>
              {sk}
            </span>
            {/* Toggle */}
            <div
              onClick={() => { setEnabled((prev) => ({ ...prev, [sk]: !prev[sk] })); toast.info(`${sk} ${enabled[sk] ? 'disabled' : 'enabled'}`); }}
              style={{
                width: '28px', height: '16px', borderRadius: R.pill,
                backgroundColor: enabled[sk] ? C.primary : C.surface3,
                border: `1px solid ${enabled[sk] ? C.primary : C.border}`,
                position: 'relative', cursor: 'pointer', flexShrink: 0,
              }}
            >
              <div style={{
                width: '12px', height: '12px', borderRadius: '50%',
                backgroundColor: 'white', position: 'absolute',
                top: '1px', left: enabled[sk] ? '13px' : '1px',
                transition: T.fast,
              }} />
            </div>
          </div>
          <span style={{
            fontFamily: F.mono, fontSize: '9px', color: C.primary,
            backgroundColor: 'rgba(74,124,111,0.1)', border: `1px solid rgba(74,124,111,0.2)`,
            borderRadius: R.pill, padding: '1px 6px', alignSelf: 'flex-start',
          }}>
            {sk.split('-')[0]}
          </span>
          <button
            onClick={() => toast.info(`Running skill: ${sk}`)}
            style={{ ...btn.secondary, fontSize: '11px', alignSelf: 'flex-start' }}
          >
            ▶ Run this skill
          </button>
        </div>
      ))}
    </div>
  );
}

/* ─── Tab: Config ────────────────────────────────────────────────── */
function ConfigTab({ agent }) {
  const toast = useToast();
  const [autonomy, setAutonomy]     = useState(agent.autonomyLevel || 'act_with_approval');
  const [maxTasks, setMaxTasks]     = useState(3);
  const [notifyEmail, setNotifyEmail] = useState(true);
  const [notifySlack, setNotifySlack] = useState(true);
  const [notifyEscalate, setNotifyEscalate] = useState(true);

  const AUTONOMY_OPTIONS = [
    { id: 'autonomous',        label: 'Autonomous',           desc: 'Acts without approval — full self-direction' },
    { id: 'act_with_approval', label: 'Act with Approval',    desc: 'Acts, but pauses for human review' },
    { id: 'suggest_only',      label: 'Suggest Only',         desc: 'Proposes actions, never executes' },
    { id: 'disabled',          label: 'Disabled',             desc: 'No action taken by this agent' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: S[5] }}>
      {/* Autonomy */}
      <div>
        <div style={{ fontFamily: F.display, fontSize: '14px', fontWeight: 700, color: C.textPrimary, marginBottom: S[3] }}>
          Autonomy Level
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: S[2] }}>
          {AUTONOMY_OPTIONS.map((opt) => {
            const isActive = autonomy === opt.id;
            return (
              <div
                key={opt.id}
                onClick={() => { setAutonomy(opt.id); toast.info(`Autonomy set to: ${opt.label}`); }}
                style={{
                  backgroundColor: isActive ? 'rgba(74,124,111,0.1)' : C.surface,
                  border: `1px solid ${isActive ? C.primary : C.border}`,
                  borderRadius: R.md, padding: S[3],
                  display: 'flex', alignItems: 'center', gap: S[3],
                  cursor: 'pointer',
                }}
              >
                <div style={{
                  width: '14px', height: '14px', borderRadius: '50%',
                  border: `2px solid ${isActive ? C.primary : C.border}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  {isActive && <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: C.primary }} />}
                </div>
                <div>
                  <div style={{ fontFamily: F.body, fontSize: '13px', fontWeight: isActive ? 700 : 500, color: isActive ? C.textPrimary : C.textSecondary }}>
                    {opt.label}
                  </div>
                  <div style={{ fontFamily: F.body, fontSize: '11px', color: C.textMuted }}>
                    {opt.desc}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Max concurrent tasks */}
      <div>
        <div style={{ fontFamily: F.display, fontSize: '14px', fontWeight: 700, color: C.textPrimary, marginBottom: S[3] }}>
          Max Concurrent Tasks: {maxTasks}
        </div>
        <div style={{ display: 'flex', gap: S[2] }}>
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              onClick={() => { setMaxTasks(n); toast.info(`Max tasks set to ${n}`); }}
              style={{
                width: '40px', height: '40px',
                fontFamily: F.mono, fontSize: '14px', fontWeight: 700,
                color: maxTasks === n ? C.textInverse : C.textSecondary,
                backgroundColor: maxTasks === n ? C.primary : C.surface2,
                border: `1px solid ${maxTasks === n ? C.primary : C.border}`,
                borderRadius: R.md, cursor: 'pointer',
              }}
            >
              {n}
            </button>
          ))}
        </div>
      </div>

      {/* Notifications */}
      <div>
        <div style={{ fontFamily: F.display, fontSize: '14px', fontWeight: 700, color: C.textPrimary, marginBottom: S[3] }}>
          Notifications
        </div>
        {[
          { label: 'Email notifications', value: notifyEmail, set: setNotifyEmail },
          { label: 'Slack notifications', value: notifySlack, set: setNotifySlack },
          { label: 'Escalation alerts',   value: notifyEscalate, set: setNotifyEscalate },
        ].map(({ label, value, set }) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: `${S[2]} 0`, borderBottom: `1px solid ${C.border}` }}>
            <span style={{ fontFamily: F.body, fontSize: '13px', color: C.textPrimary }}>{label}</span>
            <div
              onClick={() => { set(!value); toast.info(`${label}: ${!value ? 'on' : 'off'}`); }}
              style={{
                width: '36px', height: '20px', borderRadius: R.pill,
                backgroundColor: value ? C.primary : C.surface3,
                border: `1px solid ${value ? C.primary : C.border}`,
                position: 'relative', cursor: 'pointer', flexShrink: 0,
              }}
            >
              <div style={{
                width: '16px', height: '16px', borderRadius: '50%',
                backgroundColor: 'white', position: 'absolute',
                top: '1px', left: value ? '17px' : '1px',
                transition: T.fast,
              }} />
            </div>
          </div>
        ))}
      </div>

      {/* Buttons */}
      <div style={{ display: 'flex', gap: S[3], paddingTop: S[2] }}>
        <button onClick={() => toast.success('Configuration saved')} style={{ ...btn.primary, fontSize: '13px' }}>
          Save Configuration
        </button>
        <button onClick={() => toast.info('Settings reset to defaults')} style={{ ...btn.secondary, fontSize: '13px' }}>
          Reset to Defaults
        </button>
      </div>

      {/* Danger zone */}
      <div style={{ border: `1px solid rgba(239,68,68,0.3)`, borderRadius: R.md, padding: S[4], backgroundColor: 'rgba(239,68,68,0.04)' }}>
        <div style={{ fontFamily: F.display, fontSize: '14px', fontWeight: 700, color: C.red, marginBottom: S[2] }}>
          Danger Zone
        </div>
        <button
          onClick={() => toast.error(`${agent.displayName} suspended — no tasks will execute`)}
          style={{
            fontFamily: F.body, fontSize: '13px', fontWeight: 600,
            color: C.red, backgroundColor: 'rgba(239,68,68,0.1)',
            border: `1px solid rgba(239,68,68,0.3)`, borderRadius: R.button,
            padding: `${S[2]} ${S[4]}`, cursor: 'pointer',
          }}
        >
          ⏸ Suspend Agent
        </button>
      </div>
    </div>
  );
}

/* ─── Page ─────────────────────────────────────────────────────── */
export default function AgentDetail() {
  const { id }    = useParams();
  const navigate  = useNavigate();
  const toast     = useToast();

  const agentStatuses = useStore((s) => s.agents.statuses);
  const agent         = getAgent(id) || AGENTS[id];

  const [activeTab, setActiveTab] = useState('outputs');

  if (!agent) {
    return (
      <div style={{ padding: S[8], color: C.textPrimary, fontFamily: F.body, textAlign: 'center' }}>
        <p>Agent "{id}" not found.</p>
        <button onClick={() => navigate('/agents')} style={{ ...btn.secondary, marginTop: S[4] }}>
          ← Back to Team
        </button>
      </div>
    );
  }

  const liveData      = AGENT_LIVE[agent.id] || {};
  const statusObj     = agentStatuses[agent.id] || {};
  const resolvedStatus = liveData?.status || statusObj?.status || 'idle';
  const isActive      = resolvedStatus === 'executing' || resolvedStatus === 'thinking';
  const dotC          = statusColor(resolvedStatus);
  const outputs       = AGENT_OUTPUTS[agent.id] || [];
  const decisions     = DECISION_LOG[agent.id] || [];

  const handleOutputAction = (action, output) => {
    if (action === 'view')    toast.info(`Viewing: ${output.title}`);
    if (action === 'copy')    toast.success('Copied to clipboard');
    if (action === 'approve') toast.success(`Approved: ${output.title}`);
    if (action === 'reject')  toast.error(`Rejected: ${output.title}`);
  };

  const handleActivate = () => {
    AgentRuntime.activateAgent(agent.id, { description: 'Manual activation from detail' }, {})
      .then(() => toast.success(`${agent.displayName} completed task`))
      .catch(() => toast.error(`${agent.displayName} encountered an error`));
    toast.info(`Activating ${agent.displayName}...`);
  };

  const TABS = [
    { id: 'outputs',   label: 'Outputs',   count: outputs.length },
    { id: 'live',      label: 'Live',      count: null },
    { id: 'decisions', label: 'Decisions', count: decisions.length },
    { id: 'memory',    label: 'Memory',    count: null },
    { id: 'skills',    label: 'Skills',    count: agent.skills.length },
    { id: 'config',    label: 'Config',    count: null },
  ];

  return (
    <div style={{ height: '100vh', overflowY: 'auto', backgroundColor: C.bg, ...scrollbarStyle }}>
      <div style={{ padding: `${S[6]} ${S[8]} ${S[10]}` }}>

        {/* ── Back nav ──────────────────────────────────── */}
        <button
          onClick={() => navigate('/agents')}
          style={{ ...btn.ghost, marginBottom: S[4], paddingLeft: 0, color: C.textMuted, fontSize: '13px' }}
        >
          ← AI Team
        </button>

        {/* ── Header ────────────────────────────────────── */}
        <div style={{
          backgroundColor: C.surface, border: `1px solid ${isActive ? C.primary : C.border}`,
          borderRadius: R.card, padding: S[6], marginBottom: S[5],
          boxShadow: isActive ? `0 0 24px rgba(74,124,111,0.12)` : 'none',
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: `linear-gradient(90deg, ${C.primary}, ${C.secondary})` }} />

          <div style={{ display: 'flex', alignItems: 'flex-start', gap: S[5], flexWrap: 'wrap' }}>
            {/* Avatar */}
            <div style={{ position: 'relative', flexShrink: 0 }}>
              <div style={{
                width: '72px', height: '72px', borderRadius: '50%',
                backgroundColor: 'rgba(74,124,111,0.2)', border: `3px solid ${dotC}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                lineHeight: 0,
                animation: isActive ? 'adPulseRing 2s ease-in-out infinite' : 'none',
              }}>
                <AgentRoleIcon agentId={agent.id} size={34} color={agent.color} />
              </div>
              <div style={{
                position: 'absolute', bottom: 2, right: 2,
                width: '14px', height: '14px', borderRadius: '50%',
                backgroundColor: dotC, border: `2px solid ${C.surface}`,
                boxShadow: isActive ? `0 0 8px ${dotC}` : 'none',
                animation: isActive ? 'adPulse 1.8s ease-in-out infinite' : 'none',
              }} />
            </div>

            {/* Identity */}
            <div style={{ flex: 1, minWidth: '200px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: S[3], marginBottom: S[2], flexWrap: 'wrap' }}>
                <h1 style={{ fontFamily: F.display, fontSize: '28px', fontWeight: 800, color: C.textPrimary, margin: 0, letterSpacing: '-0.02em' }}>
                  {agent.displayName}
                </h1>
                <span style={{
                  fontFamily: F.mono, fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em',
                  color: agent.role === 'orchestrator' ? C.primary : C.textMuted,
                  backgroundColor: agent.role === 'orchestrator' ? 'rgba(74,124,111,0.12)' : C.surface3,
                  border: `1px solid ${agent.role === 'orchestrator' ? 'rgba(74,124,111,0.3)' : C.border}`,
                  borderRadius: R.pill, padding: '2px 8px',
                }}>
                  {agent.role === 'orchestrator' ? 'Orchestrator' : 'Specialist'}
                </span>
                <span style={{
                  fontFamily: F.mono, fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em',
                  color: C.secondary, backgroundColor: C.surface3, border: `1px solid ${C.border}`,
                  borderRadius: R.pill, padding: '2px 8px',
                }}>
                  {agent.autonomyLevel}
                </span>
              </div>

              {/* Status line */}
              <div style={{
                fontFamily: F.body, fontSize: '13px',
                color: isActive ? C.amber : C.textSecondary,
                marginBottom: S[3],
              }}>
                {isActive ? (
                  <>
                    <span style={{ fontSize: '10px', marginRight: '6px' }}>●</span>
                    Executing: {liveData.currentTask}
                  </>
                ) : 'Idle — awaiting task'}
              </div>

              {/* Performance strip */}
              <div style={{ display: 'flex', gap: S[5], flexWrap: 'wrap', marginBottom: S[4] }}>
                {[
                  { label: 'Tasks/week', value: liveData.tasks || '—' },
                  { label: 'Approval rate', value: liveData.approvalRate || '—' },
                  { label: 'Avg time', value: liveData.avgTime || '—' },
                  { label: 'Escalations', value: liveData.escalations ?? '—', warn: (liveData.escalations || 0) > 0 },
                ].map(({ label, value, warn }) => (
                  <div key={label}>
                    <div style={{ fontFamily: F.mono, fontSize: '18px', fontWeight: 700, color: warn ? C.amber : C.textPrimary, lineHeight: 1 }}>{value}</div>
                    <div style={{ fontFamily: F.body, fontSize: '10px', color: C.textMuted, marginTop: '2px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{label}</div>
                  </div>
                ))}
              </div>

              {/* Action buttons */}
              <div style={{ display: 'flex', gap: S[2], flexWrap: 'wrap' }}>
                <button
                  onClick={handleActivate}
                  style={{ ...btn.primary, fontSize: '13px' }}
                >
                  ▶ Manual Activate
                </button>
                <button
                  onClick={() => {
                    AgentRuntime.cancelAgent(agent.id);
                    toast.info(`${agent.displayName} suspended`);
                  }}
                  style={{ ...btn.secondary, fontSize: '13px' }}
                >
                  ⏸ Suspend Agent
                </button>
                <button
                  onClick={() => { setActiveTab('config'); toast.info('Switched to Config tab'); }}
                  style={{ ...btn.secondary, fontSize: '13px' }}
                >
                  ⚙ Configure
                </button>
                <button
                  onClick={() => { setActiveTab('outputs'); toast.info('Switched to Outputs tab'); }}
                  style={{ ...btn.secondary, fontSize: '13px' }}
                >
                  📊 View All Outputs
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ── Tab bar ───────────────────────────────────── */}
        <div style={{
          display: 'flex', gap: 0, borderBottom: `1px solid ${C.border}`,
          marginBottom: S[5], overflowX: 'auto', ...scrollbarStyle,
        }}>
          {TABS.map((tab) => {
            const isAct = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  fontFamily: F.body, fontSize: '14px', fontWeight: isAct ? 700 : 500,
                  color: isAct ? C.textPrimary : C.textSecondary,
                  backgroundColor: 'transparent', border: 'none',
                  borderBottom: `2px solid ${isAct ? C.primary : 'transparent'}`,
                  padding: `${S[3]} ${S[5]}`,
                  cursor: 'pointer', transition: T.color,
                  whiteSpace: 'nowrap', flexShrink: 0,
                  display: 'flex', alignItems: 'center', gap: S[1],
                }}
              >
                {tab.label}
                {tab.count !== null && (
                  <span style={{
                    fontFamily: F.mono, fontSize: '10px',
                    color: isAct ? C.primary : C.textMuted,
                    backgroundColor: isAct ? 'rgba(74,124,111,0.12)' : C.surface3,
                    borderRadius: R.pill, padding: '0 5px',
                  }}>
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* ── Tab content ───────────────────────────────── */}
        {activeTab === 'outputs' && (
          <OutputsTab agentId={agent.id} outputs={outputs} onAction={handleOutputAction} />
        )}
        {activeTab === 'live' && (
          <LiveTab agentId={agent.id} agent={agent} liveData={liveData} onActivate={handleActivate} />
        )}
        {activeTab === 'decisions' && (
          <DecisionsTab agentId={agent.id} decisions={decisions} />
        )}
        {activeTab === 'memory' && (
          <MemoryTab agentId={agent.id} />
        )}
        {activeTab === 'skills' && (
          <SkillsTab agent={agent} />
        )}
        {activeTab === 'config' && (
          <ConfigTab agent={agent} />
        )}

      </div>

      <style>{`
        @keyframes adPulseRing { 0%,100%{box-shadow:0 0 0 0 rgba(74,124,111,0.3)} 50%{box-shadow:0 0 0 8px rgba(74,124,111,0)} }
        @keyframes adPulse      { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.4;transform:scale(0.7)} }
      `}</style>
    </div>
  );
}
