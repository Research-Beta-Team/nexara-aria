/**
 * SkillLoader.js
 * Skill registry — 34 skills across 8 categories.
 * Each skill has metadata and a mock executor that returns structured demo data.
 */

import { AGENTS } from './AgentRegistry';

// ── Skill definitions ──────────────────────────────────────────

const SKILLS = {
  // ── Strategy (6) ──────────────────────────────────────────
  'content-strategy': {
    name: 'content-strategy',
    description: 'Build a full content strategy aligned to ICP, funnel stage, and channels',
    category: 'strategy',
    inputs: ['icp', 'channels', 'objective'],
    outputFormat: 'strategy',
    estimatedTime: '8s',
    creditCost: 120,
  },
  'launch-strategy': {
    name: 'launch-strategy',
    description: 'Create a go-to-market launch plan with phases, milestones, and KPIs',
    category: 'strategy',
    inputs: ['product', 'market', 'timeline'],
    outputFormat: 'strategy',
    estimatedTime: '10s',
    creditCost: 150,
  },
  'marketing-ideas': {
    name: 'marketing-ideas',
    description: 'Generate creative marketing campaign ideas for a given objective',
    category: 'strategy',
    inputs: ['objective', 'audience', 'budget'],
    outputFormat: 'strategy',
    estimatedTime: '5s',
    creditCost: 80,
  },
  'marketing-psychology': {
    name: 'marketing-psychology',
    description: 'Apply behavioral psychology frameworks to messaging and positioning',
    category: 'strategy',
    inputs: ['audience', 'product', 'pain_points'],
    outputFormat: 'strategy',
    estimatedTime: '6s',
    creditCost: 100,
  },
  'pricing-strategy': {
    name: 'pricing-strategy',
    description: 'Analyze market positioning and recommend pricing tiers, anchoring, and packaging',
    category: 'strategy',
    inputs: ['product', 'competitors', 'target_segment'],
    outputFormat: 'strategy',
    estimatedTime: '7s',
    creditCost: 110,
  },
  'product-marketing-context': {
    name: 'product-marketing-context',
    description: 'Build product-market context document — positioning, value props, competitive moat',
    category: 'strategy',
    inputs: ['product', 'market', 'competitors'],
    outputFormat: 'strategy',
    estimatedTime: '6s',
    creditCost: 90,
  },

  // ── Content (6) ───────────────────────────────────────────
  'copywriting': {
    name: 'copywriting',
    description: 'Write marketing copy — landing pages, headlines, body text, CTAs',
    category: 'content',
    inputs: ['brief', 'tone', 'audience', 'channel'],
    outputFormat: 'content',
    estimatedTime: '5s',
    creditCost: 80,
  },
  'copy-editing': {
    name: 'copy-editing',
    description: 'Edit and refine existing copy for clarity, brand voice, and compliance',
    category: 'content',
    inputs: ['draft', 'brand_guidelines', 'compliance_rules'],
    outputFormat: 'content',
    estimatedTime: '4s',
    creditCost: 50,
  },
  'ad-creative': {
    name: 'ad-creative',
    description: 'Generate ad copy and creative briefs for Meta, Google, LinkedIn campaigns',
    category: 'content',
    inputs: ['platform', 'audience', 'objective', 'budget'],
    outputFormat: 'content',
    estimatedTime: '6s',
    creditCost: 100,
  },
  'social-content': {
    name: 'social-content',
    description: 'Create social media posts, captions, and thread content for multiple platforms',
    category: 'content',
    inputs: ['platform', 'topic', 'tone', 'hashtags'],
    outputFormat: 'content',
    estimatedTime: '4s',
    creditCost: 60,
  },
  'email-sequence': {
    name: 'email-sequence',
    description: 'Design multi-step email sequences — welcome, nurture, re-engagement, cold outreach',
    category: 'content',
    inputs: ['sequence_type', 'audience', 'goal', 'steps'],
    outputFormat: 'content',
    estimatedTime: '8s',
    creditCost: 120,
  },
  'lead-magnets': {
    name: 'lead-magnets',
    description: 'Create lead magnet concepts — checklists, templates, mini-courses, calculators',
    category: 'content',
    inputs: ['audience', 'pain_point', 'format'],
    outputFormat: 'content',
    estimatedTime: '5s',
    creditCost: 90,
  },

  // ── Analytics (4) ─────────────────────────────────────────
  'analytics-tracking': {
    name: 'analytics-tracking',
    description: 'Set up and audit analytics tracking — events, funnels, attribution, dashboards',
    category: 'analytics',
    inputs: ['platform', 'events', 'goals'],
    outputFormat: 'analytics',
    estimatedTime: '6s',
    creditCost: 80,
  },
  'customer-research': {
    name: 'customer-research',
    description: 'Analyze customer segments, survey data, and behavioral patterns',
    category: 'analytics',
    inputs: ['data_source', 'segment', 'questions'],
    outputFormat: 'analytics',
    estimatedTime: '7s',
    creditCost: 100,
  },
  'competitor-alternatives': {
    name: 'competitor-alternatives',
    description: 'Research competitor landscape — positioning, pricing, features, weaknesses',
    category: 'analytics',
    inputs: ['competitors', 'market', 'focus_areas'],
    outputFormat: 'analytics',
    estimatedTime: '8s',
    creditCost: 110,
  },

  // ── SEO (5) ───────────────────────────────────────────────
  'seo-audit': {
    name: 'seo-audit',
    description: 'Full technical and content SEO audit with prioritized fix list',
    category: 'seo',
    inputs: ['url', 'target_keywords'],
    outputFormat: 'seo',
    estimatedTime: '10s',
    creditCost: 130,
  },
  'ai-seo': {
    name: 'ai-seo',
    description: 'AI-powered keyword research, content optimization, and SERP analysis',
    category: 'seo',
    inputs: ['seed_keywords', 'competitors', 'content_type'],
    outputFormat: 'seo',
    estimatedTime: '8s',
    creditCost: 100,
  },
  'site-architecture': {
    name: 'site-architecture',
    description: 'Plan site architecture — navigation, URL structure, internal linking',
    category: 'seo',
    inputs: ['pages', 'goals', 'current_structure'],
    outputFormat: 'seo',
    estimatedTime: '7s',
    creditCost: 90,
  },
  'programmatic-seo': {
    name: 'programmatic-seo',
    description: 'Design programmatic SEO templates for scalable content generation',
    category: 'seo',
    inputs: ['template_type', 'data_source', 'target_keywords'],
    outputFormat: 'seo',
    estimatedTime: '9s',
    creditCost: 120,
  },
  'schema-markup': {
    name: 'schema-markup',
    description: 'Generate structured data / schema.org markup for rich search results',
    category: 'seo',
    inputs: ['page_type', 'content'],
    outputFormat: 'seo',
    estimatedTime: '4s',
    creditCost: 50,
  },

  // ── CRO (7) ───────────────────────────────────────────────
  'page-cro': {
    name: 'page-cro',
    description: 'Audit and optimize landing page conversion — layout, copy, CTA placement',
    category: 'cro',
    inputs: ['url', 'current_rate', 'goal'],
    outputFormat: 'cro',
    estimatedTime: '7s',
    creditCost: 100,
  },
  'form-cro': {
    name: 'form-cro',
    description: 'Optimize form conversion — field reduction, progressive disclosure, microcopy',
    category: 'cro',
    inputs: ['form_type', 'fields', 'current_rate'],
    outputFormat: 'cro',
    estimatedTime: '5s',
    creditCost: 70,
  },
  'signup-flow-cro': {
    name: 'signup-flow-cro',
    description: 'Optimize signup / registration flow — friction points, social proof, defaults',
    category: 'cro',
    inputs: ['flow_steps', 'drop_off_rates'],
    outputFormat: 'cro',
    estimatedTime: '6s',
    creditCost: 80,
  },
  'onboarding-cro': {
    name: 'onboarding-cro',
    description: 'Improve user onboarding — activation metrics, checklists, nudges',
    category: 'cro',
    inputs: ['steps', 'activation_metric', 'current_rate'],
    outputFormat: 'cro',
    estimatedTime: '6s',
    creditCost: 80,
  },
  'popup-cro': {
    name: 'popup-cro',
    description: 'Design and optimize popups — exit-intent, scroll-trigger, timed offers',
    category: 'cro',
    inputs: ['trigger_type', 'offer', 'audience'],
    outputFormat: 'cro',
    estimatedTime: '4s',
    creditCost: 60,
  },
  'paywall-upgrade-cro': {
    name: 'paywall-upgrade-cro',
    description: 'Optimize upgrade / paywall conversion — pricing page, feature gates, urgency',
    category: 'cro',
    inputs: ['plans', 'current_conversion', 'blockers'],
    outputFormat: 'cro',
    estimatedTime: '6s',
    creditCost: 90,
  },
  'ab-test-setup': {
    name: 'ab-test-setup',
    description: 'Design A/B test — hypothesis, variants, sample size, success criteria',
    category: 'cro',
    inputs: ['element', 'hypothesis', 'traffic'],
    outputFormat: 'cro',
    estimatedTime: '5s',
    creditCost: 70,
  },

  // ── Outreach (4) ──────────────────────────────────────────
  'cold-email': {
    name: 'cold-email',
    description: 'Write personalized cold email sequences with research-backed hooks',
    category: 'outreach',
    inputs: ['prospect', 'value_prop', 'steps'],
    outputFormat: 'outreach',
    estimatedTime: '5s',
    creditCost: 80,
  },
  'referral-program': {
    name: 'referral-program',
    description: 'Design referral program — incentives, mechanics, messaging, viral loops',
    category: 'outreach',
    inputs: ['product', 'audience', 'incentive_budget'],
    outputFormat: 'outreach',
    estimatedTime: '6s',
    creditCost: 90,
  },
  'free-tool-strategy': {
    name: 'free-tool-strategy',
    description: 'Identify and design free tool / calculator concepts for lead generation',
    category: 'outreach',
    inputs: ['audience', 'pain_points', 'product'],
    outputFormat: 'outreach',
    estimatedTime: '5s',
    creditCost: 80,
  },
  'paid-ads': {
    name: 'paid-ads',
    description: 'Plan and optimize paid advertising campaigns across Meta, Google, LinkedIn',
    category: 'outreach',
    inputs: ['platform', 'budget', 'audience', 'objective'],
    outputFormat: 'outreach',
    estimatedTime: '7s',
    creditCost: 110,
  },

  // ── Revenue (2) ───────────────────────────────────────────
  'revops': {
    name: 'revops',
    description: 'Analyze revenue operations — pipeline health, velocity, bottlenecks, forecasting',
    category: 'revenue',
    inputs: ['pipeline_data', 'period', 'segments'],
    outputFormat: 'revenue',
    estimatedTime: '8s',
    creditCost: 120,
  },
  'sales-enablement': {
    name: 'sales-enablement',
    description: 'Create sales collateral — battle cards, one-pagers, objection handlers, demo scripts',
    category: 'revenue',
    inputs: ['product', 'icp', 'competitors'],
    outputFormat: 'revenue',
    estimatedTime: '6s',
    creditCost: 90,
  },
  'churn-prevention': {
    name: 'churn-prevention',
    description: 'Identify churn signals and design retention playbooks — re-engagement, rescue flows',
    category: 'revenue',
    inputs: ['churn_signals', 'customer_data', 'product_usage'],
    outputFormat: 'revenue',
    estimatedTime: '7s',
    creditCost: 100,
  },
};

// ── Mock output generators by category ─────────────────────────

function mockStrategy(skillName, input) {
  return {
    strategy: `${skillName} plan for Medglobal's healthcare outreach in underserved regions`,
    phases: [
      { name: 'Discovery', duration: '2 weeks', focus: 'Audience research & competitive analysis' },
      { name: 'Foundation', duration: '3 weeks', focus: 'Messaging framework & channel selection' },
      { name: 'Execution', duration: '6 weeks', focus: 'Content creation & campaign launch' },
      { name: 'Optimization', duration: 'Ongoing', focus: 'Performance review & iteration' },
    ],
    channels: ['Email', 'LinkedIn', 'Google Ads', 'Webinars'],
    timeline: '11 weeks total',
    keyInsight: 'Medglobal\'s donor base responds best to impact-driven storytelling with quantified outcomes',
  };
}

function mockContent(skillName, input) {
  const contentIdSeq = Math.floor(Math.random() * 900) + 100;
  return {
    content: `[${skillName}] Draft for Medglobal — Delivering emergency healthcare to 1.2M+ patients across 14 countries. Our mobile medical units reach communities within 72 hours of crisis.`,
    contentId: `CAMP-MG-${skillName.toUpperCase().replace(/-/g, '').slice(0, 4)}-${contentIdSeq}`,
    wordCount: 320,
    variants: [
      { label: 'Impact-focused', hook: 'Every donation saves 12 lives on average' },
      { label: 'Urgency-driven', hook: 'Right now, 40M people lack access to basic healthcare' },
      { label: 'Story-led', hook: 'When the earthquake hit, our team was there in 48 hours' },
    ],
  };
}

function mockAnalytics(skillName, input) {
  return {
    metrics: {
      impressions: 284_500,
      clicks: 12_340,
      conversions: 842,
      ctr: '4.34%',
      conversionRate: '6.82%',
      costPerAcquisition: '$14.20',
    },
    insights: [
      'LinkedIn campaigns outperform Meta by 2.3x on donor acquisition for Medglobal',
      'Email open rates peak on Tuesday mornings (9-10 AM EST) for healthcare professionals',
      'Webinar registrations correlate strongly with subsequent major gift pledges',
    ],
    anomalies: [
      { metric: 'Email bounce rate', value: '8.2%', expected: '<3%', severity: 'warning' },
    ],
    recommendations: [
      'Shift 20% of Meta budget to LinkedIn for higher-intent donor targeting',
      'Implement re-engagement sequence for 3,400 lapsed donors (>90 days inactive)',
    ],
  };
}

function mockSeo(skillName, input) {
  return {
    score: 72,
    issues: [
      { severity: 'high', issue: 'Missing H1 tags on 12 program pages', fix: 'Add descriptive H1s with target keywords' },
      { severity: 'medium', issue: 'Thin content on country-specific landing pages', fix: 'Expand each page to 800+ words with local impact data' },
      { severity: 'low', issue: 'Missing alt text on 34 images', fix: 'Add descriptive alt text to all program photos' },
    ],
    fixes: [
      'Add schema.org/NonprofitOrganization markup to homepage',
      'Create internal linking hub for "emergency healthcare" topic cluster',
      'Implement hreflang for Arabic and French program pages',
    ],
    schema: { '@type': 'NonprofitOrganization', name: 'Medglobal', areaServed: '14 countries' },
  };
}

function mockCro(skillName, input) {
  return {
    currentScore: 3.2,
    recommendations: [
      { change: 'Simplify donation form from 8 to 4 fields', impact: '+18% completion', effort: 'low' },
      { change: 'Add social proof — "2,400 donors this month"', impact: '+12% conversion', effort: 'low' },
      { change: 'Implement progressive disclosure on volunteer signup', impact: '+25% completion', effort: 'medium' },
      { change: 'Add exit-intent popup with impact calculator', impact: '+8% recovery', effort: 'medium' },
    ],
    projectedImprovement: '+22% overall conversion rate within 6 weeks',
  };
}

function mockOutreach(skillName, input) {
  return {
    messages: [
      { step: 1, subject: 'Medglobal impact in [Region] — quick question', body: 'Hi {{firstName}}, I noticed your organization\'s work in humanitarian health...' },
      { step: 2, subject: 'Re: Healthcare access data you might find useful', body: 'Following up with a brief from our latest field report...' },
      { step: 3, subject: 'Partnership opportunity — 3 min read', body: 'Medglobal is expanding operations in {{region}} and looking for...' },
    ],
    sequence: { steps: 3, cadence: 'Day 1 → Day 4 → Day 9', channel: 'email' },
    timing: { bestDay: 'Tuesday', bestTime: '9:30 AM', timezone: 'recipient local' },
    personalization: ['organization name', 'region of operation', 'recent news/event'],
  };
}

function mockRevenue(skillName, input) {
  return {
    forecast: {
      currentQuarter: '$2.4M',
      projectedQuarter: '$2.8M',
      confidence: '78%',
      bestCase: '$3.1M',
      worstCase: '$2.2M',
    },
    pipeline: {
      totalValue: '$8.6M',
      weightedValue: '$4.2M',
      avgDealSize: '$42K',
      velocity: '28 days avg cycle',
    },
    risks: [
      'Two major grants ($180K total) stalled at proposal stage for 45+ days',
      'Corporate sponsorship pipeline down 15% QoQ',
    ],
    opportunities: [
      'Expand recurring donor program — $340K annual potential from lapsed major givers',
      'Cross-sell volunteer programs to existing institutional donors',
    ],
  };
}

function mockCompliance(skillName, input) {
  return {
    approved: false,
    issues: [
      { type: 'brand_voice', severity: 'medium', detail: 'Tone is too casual for institutional donor communications', suggestion: 'Use formal register with impact-focused language' },
      { type: 'legal', severity: 'high', detail: 'Missing required 501(c)(3) disclosure in fundraising email', suggestion: 'Add standard tax-deductibility disclaimer' },
      { type: 'factual', severity: 'low', detail: 'Patient count figure needs source citation', suggestion: 'Add "Source: Medglobal 2025 Impact Report" footnote' },
    ],
    suggestions: [
      'Replace "kids" with "children" for brand consistency',
      'Add impact metric to subject line for higher open rates',
    ],
    confidenceScore: 0.72,
  };
}

const MOCK_GENERATORS = {
  strategy: mockStrategy,
  content: mockContent,
  analytics: mockAnalytics,
  seo: mockSeo,
  cro: mockCro,
  outreach: mockOutreach,
  revenue: mockRevenue,
  compliance: mockCompliance,
};

// ── Public API ──────────────────────────────────────────────────

export const SkillLoader = {
  /** Get a skill config by name */
  getSkill(skillName) {
    return SKILLS[skillName] || null;
  },

  /** Execute a skill (mock) and return structured output */
  executeSkill(skillName, input = {}, context = {}) {
    const skill = SKILLS[skillName];
    if (!skill) {
      return Promise.reject(new Error(`Unknown skill: ${skillName}`));
    }

    const generator = MOCK_GENERATORS[skill.category] || mockStrategy;
    const delay = 1500 + Math.random() * 1500; // 1.5–3s

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          skill: skillName,
          category: skill.category,
          creditCost: skill.creditCost,
          data: generator(skillName, input),
          executedAt: Date.now(),
        });
      }, delay);
    });
  },

  /** Get all skill definitions */
  getAllSkills() {
    return { ...SKILLS };
  },

  /** Get skills assigned to an agent */
  getSkillsForAgent(agentId) {
    const agent = AGENTS[agentId];
    if (!agent) return [];
    return agent.skills
      .map((name) => SKILLS[name])
      .filter(Boolean);
  },
};
