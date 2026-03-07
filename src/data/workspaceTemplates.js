// ─────────────────────────────────────────────
//  Antarious — Workspace Industry Templates
//  Layer 1: Standard starting points per vertical
// ─────────────────────────────────────────────

export const workspaceTemplates = [
  // ── 1. B2B SaaS ─────────────────────────────
  {
    id: 'b2b-saas',
    name: 'B2B SaaS',
    description: 'Demos, pipeline, ICP research, outreach, paid and analytics.',
    icon: '🚀',
    color: '#3DDC84',
    layout: {
      visibleModules: ['dashboard', 'campaigns', 'outreach', 'content', 'knowledge', 'calendar', 'analytics', 'inbox', 'pipeline', 'forecast', 'customer-success', 'research/icp', 'research/intent', 'research/competitive', 'abm', 'playbooks', 'querymanager', 'meta-monitoring'],
      hiddenModules: ['social', 'escalations'],
      sidebarOrder: ['dashboard', 'campaigns', 'outreach', 'content', 'knowledge', 'calendar', 'analytics', 'inbox', 'pipeline', 'forecast', 'customer-success', 'research/icp', 'research/intent', 'research/competitive', 'abm', 'playbooks', 'querymanager', 'meta-monitoring'],
      dashboardWidgets: ['campaign_health', 'meta_spend', 'aria_insights', 'agent_activity', 'escalation_queue', 'pipeline_funnel'],
      dashboardLayout: '2-col',
    },
    agents: {
      active: ['gtm_strategist', 'icp_researcher', 'copywriter', 'sdr', 'meta_ads', 'meta_monitor', 'analytics', 'seo'],
      disabled: ['competitor_intel', 'social_media'],
      primaryAgent: 'gtm_strategist',
    },
    aria: {
      persona: 'cro',
      language: 'en',
      defaultRules: [
        { id: 'r1', text: 'Lead with pipeline impact', enabled: true, category: 'STRATEGY' },
        { id: 'r2', text: 'Be concise for executives', enabled: true, category: 'TONE' },
      ],
      greeting: 'Focus on pipeline and demos this week. I\'ll flag at-risk deals and content blocking launches.',
      proactiveInsights: true,
    },
    workflows: {
      approvalChain: ['content_strategist', 'csm', 'client'],
      escalationThreshold: 3000,
      reportingCadence: 'weekly',
      autoApproveBelow: 500,
    },
    kpis: {
      primary: { metric: 'demos_booked', label: 'Demos Booked', target: 50, unit: '/mo', direction: 'up' },
      secondary: { metric: 'cpl', label: 'CPL', target: 28, unit: '$', direction: 'down' },
      tertiary: { metric: 'pipeline_value', label: 'Pipeline Value', target: 200000, unit: '$', direction: 'up' },
      dashboardKPIOrder: ['demos_booked', 'cpl', 'pipeline_value'],
    },
    recommendedPlaybooks: ['saas-demo-generator', 'enterprise-abm-program', 'product-launch-sprint'],
  },

  // ── 2. E-commerce / D2C ─────────────────────
  {
    id: 'ecommerce-d2c',
    name: 'E-commerce / D2C',
    description: 'ROAS, Meta, social, content. No outreach or pipeline.',
    icon: '🛒',
    color: '#5EEAD4',
    layout: {
      visibleModules: ['dashboard', 'campaigns', 'content', 'analytics', 'social', 'meta-monitoring'],
      hiddenModules: ['outreach', 'inbox', 'pipeline', 'research/icp', 'research/intent', 'research/competitive', 'abm', 'playbooks', 'forecast', 'customer-success', 'escalations', 'knowledge', 'querymanager'],
      sidebarOrder: ['dashboard', 'campaigns', 'content', 'analytics', 'social', 'meta-monitoring'],
      dashboardWidgets: ['campaign_health', 'meta_spend', 'aria_insights', 'agent_activity', 'roas_tracker', 'social_reach'],
      dashboardLayout: '2-col',
    },
    agents: {
      active: ['copywriter', 'meta_ads', 'meta_monitor', 'social_media', 'seo', 'analytics'],
      disabled: ['gtm_strategist', 'icp_researcher', 'competitor_intel', 'sdr'],
      primaryAgent: 'growth_marketer',
    },
    aria: {
      persona: 'growth_marketer',
      language: 'en',
      defaultRules: [
        { id: 'r1', text: 'Lead with ROAS and CAC', enabled: true, category: 'STRATEGY' },
      ],
      greeting: 'ROAS is the north star this week. I\'ll surface creative winners and underperforming audiences.',
      proactiveInsights: true,
    },
    workflows: {
      approvalChain: ['content_strategist', 'client'],
      escalationThreshold: 2000,
      reportingCadence: 'daily',
      autoApproveBelow: 300,
    },
    kpis: {
      primary: { metric: 'roas', label: 'ROAS', target: 4.0, unit: 'x', direction: 'up' },
      secondary: { metric: 'aov', label: 'AOV', target: 65, unit: '$', direction: 'up' },
      tertiary: { metric: 'meta_spend_efficiency', label: 'Meta Spend Efficiency', target: 1.2, unit: 'index', direction: 'up' },
      dashboardKPIOrder: ['roas', 'aov', 'meta_spend_efficiency'],
    },
    recommendedPlaybooks: ['ecomm-revenue-accelerator', 'product-launch-sprint'],
  },

  // ── 3. Professional Services ────────────────
  {
    id: 'professional-services',
    name: 'Professional Services',
    description: 'Referral pipeline, BD lead, competitive intel, outreach.',
    icon: '💼',
    color: '#F5C842',
    layout: {
      visibleModules: ['dashboard', 'campaigns', 'outreach', 'content', 'analytics', 'research/competitive'],
      hiddenModules: ['inbox', 'pipeline', 'social', 'research/icp', 'research/intent', 'abm', 'playbooks', 'forecast', 'customer-success', 'meta-monitoring', 'escalations', 'knowledge', 'querymanager'],
      sidebarOrder: ['dashboard', 'campaigns', 'outreach', 'content', 'analytics', 'research/competitive'],
      dashboardWidgets: ['campaign_health', 'aria_insights', 'agent_activity', 'pipeline_funnel'],
      dashboardLayout: '2-col',
    },
    agents: {
      active: ['gtm_strategist', 'icp_researcher', 'competitor_intel', 'copywriter', 'sdr', 'analytics'],
      disabled: ['meta_ads', 'meta_monitor', 'social_media', 'seo'],
      primaryAgent: 'bd_lead',
    },
    aria: {
      persona: 'bd_lead',
      language: 'en',
      defaultRules: [
        { id: 'r1', text: 'Focus on referral and relationship pipeline', enabled: true, category: 'STRATEGY' },
      ],
      greeting: 'Referral and pipeline health are top of mind. I\'ll highlight at-risk relationships and proposal follow-ups.',
      proactiveInsights: true,
    },
    workflows: {
      approvalChain: ['strategic_advisor', 'csm', 'client'],
      escalationThreshold: 5000,
      reportingCadence: 'biweekly',
      autoApproveBelow: 1000,
    },
    kpis: {
      primary: { metric: 'qualified_meetings', label: 'Qualified Meetings', target: 20, unit: '/mo', direction: 'up' },
      secondary: { metric: 'proposals_sent', label: 'Proposals Sent', target: 8, unit: '/mo', direction: 'up' },
      tertiary: { metric: 'win_rate', label: 'Win Rate', target: 30, unit: '%', direction: 'up' },
      dashboardKPIOrder: ['qualified_meetings', 'proposals_sent', 'win_rate'],
    },
    recommendedPlaybooks: ['professional-services-lead-gen', 'market-entry-strategy'],
  },

  // ── 4. NGO / Fundraising ────────────────────
  {
    id: 'ngo-fundraising',
    name: 'NGO / Fundraising',
    description: 'Donor impact, content, social, email. No outreach or meta monitoring.',
    icon: '🌍',
    color: '#FF6E7A',
    layout: {
      visibleModules: ['dashboard', 'campaigns', 'content', 'analytics', 'social', 'inbox'],
      hiddenModules: ['outreach', 'pipeline', 'research/icp', 'research/intent', 'research/competitive', 'abm', 'playbooks', 'forecast', 'customer-success', 'meta-monitoring', 'escalations', 'knowledge', 'querymanager'],
      sidebarOrder: ['dashboard', 'campaigns', 'content', 'analytics', 'social', 'inbox'],
      dashboardWidgets: ['campaign_health', 'aria_insights', 'agent_activity', 'donor_pipeline', 'social_reach'],
      dashboardLayout: '2-col',
    },
    agents: {
      active: ['copywriter', 'social_media', 'seo', 'analytics'],
      disabled: ['gtm_strategist', 'icp_researcher', 'competitor_intel', 'sdr', 'meta_ads', 'meta_monitor'],
      primaryAgent: 'campaign_coordinator',
    },
    aria: {
      persona: 'campaign_coordinator',
      language: 'en',
      defaultRules: [
        { id: 'r1', text: 'Lead with donor impact and campaign reach', enabled: true, category: 'STRATEGY' },
      ],
      greeting: 'Donor impact and campaign reach are front and center. I\'ll surface top-performing content and email engagement.',
      proactiveInsights: true,
    },
    workflows: {
      approvalChain: ['content_strategist', 'client'],
      escalationThreshold: 1000,
      reportingCadence: 'monthly',
      autoApproveBelow: 200,
    },
    kpis: {
      primary: { metric: 'donations', label: 'Donations', target: 50000, unit: '$/quarter', direction: 'up' },
      secondary: { metric: 'email_open_rate', label: 'Email Open Rate', target: 35, unit: '%', direction: 'up' },
      tertiary: { metric: 'social_reach', label: 'Social Reach', target: 100000, unit: 'impressions', direction: 'up' },
      dashboardKPIOrder: ['donations', 'email_open_rate', 'social_reach'],
    },
    recommendedPlaybooks: ['market-entry-strategy'],
  },

  // ── 5. Local Business Bangladesh ─────────────
  {
    id: 'local-business-bd',
    name: 'Local Business Bangladesh',
    description: 'Facebook-first, Bengali–English, simplified modules.',
    icon: '🇧🇩',
    color: '#3DDC84',
    layout: {
      visibleModules: ['dashboard', 'campaigns', 'content', 'social', 'inbox', 'analytics'],
      hiddenModules: ['outreach', 'pipeline', 'research/icp', 'research/intent', 'research/competitive', 'abm', 'playbooks', 'forecast', 'customer-success', 'meta-monitoring', 'escalations', 'knowledge', 'querymanager'],
      sidebarOrder: ['dashboard', 'campaigns', 'content', 'social', 'inbox', 'analytics'],
      dashboardWidgets: ['campaign_health', 'meta_spend', 'aria_insights', 'agent_activity', 'social_reach'],
      dashboardLayout: '2-col',
    },
    agents: {
      active: ['copywriter', 'meta_ads', 'meta_monitor', 'social_media'],
      disabled: ['gtm_strategist', 'icp_researcher', 'competitor_intel', 'sdr', 'seo', 'analytics'],
      primaryAgent: 'growth_marketer',
    },
    aria: {
      persona: 'growth_marketer',
      language: 'bn-en',
      defaultRules: [
        { id: 'r1', text: 'Default to Bengali–English mixed when appropriate', enabled: true, category: 'FORMAT' },
      ],
      greeting: 'Meta leads and page engagement are priorities. I\'ll highlight top creatives and CPL trends.',
      proactiveInsights: true,
    },
    workflows: {
      approvalChain: ['csm', 'client'],
      escalationThreshold: 50000,
      reportingCadence: 'weekly',
      autoApproveBelow: 5000,
    },
    kpis: {
      primary: { metric: 'leads_from_meta', label: 'Leads from Meta', target: 100, unit: '/mo', direction: 'up' },
      secondary: { metric: 'cpl', label: 'CPL', target: 200, unit: 'BDT', direction: 'down' },
      tertiary: { metric: 'page_engagement', label: 'Page Engagement', target: 5000, unit: 'actions', direction: 'up' },
      dashboardKPIOrder: ['leads_from_meta', 'cpl', 'page_engagement'],
    },
    recommendedPlaybooks: ['rmg-export-accelerator', 'market-entry-strategy'],
  },

  // ── 6. Custom ───────────────────────────────
  {
    id: 'custom',
    name: 'Custom',
    description: 'Everything enabled; KPIs and workflow configured by CSM.',
    icon: '⚙️',
    color: '#6B9478',
    layout: {
      visibleModules: ['dashboard', 'campaigns', 'outreach', 'content', 'analytics', 'inbox', 'pipeline', 'social', 'research/icp', 'research/intent', 'research/competitive', 'abm', 'playbooks', 'forecast', 'customer-success', 'meta-monitoring', 'escalations', 'knowledge', 'querymanager'],
      hiddenModules: [],
      sidebarOrder: ['dashboard', 'campaigns', 'outreach', 'content', 'analytics', 'inbox', 'pipeline', 'social', 'research/icp', 'research/intent', 'research/competitive', 'abm', 'playbooks', 'forecast', 'customer-success', 'meta-monitoring', 'escalations', 'knowledge', 'querymanager'],
      dashboardWidgets: ['campaign_health', 'meta_spend', 'aria_insights', 'agent_activity', 'escalation_queue', 'pipeline_funnel', 'social_reach', 'donor_pipeline', 'roas_tracker'],
      dashboardLayout: '3-col',
    },
    agents: {
      active: ['gtm_strategist', 'icp_researcher', 'copywriter', 'sdr', 'meta_ads', 'meta_monitor', 'analytics', 'seo', 'competitor_intel', 'social_media'],
      disabled: [],
      primaryAgent: 'gtm_strategist',
    },
    aria: {
      persona: 'cro',
      language: 'en',
      defaultRules: [],
      greeting: 'Your workspace is fully custom. Tell me your priorities and I\'ll align insights and actions.',
      proactiveInsights: true,
    },
    workflows: {
      approvalChain: ['csm', 'client'],
      escalationThreshold: 5000,
      reportingCadence: 'weekly',
      autoApproveBelow: 500,
    },
    kpis: {
      primary: { metric: 'custom_1', label: 'Primary KPI', target: 0, unit: '', direction: 'up' },
      secondary: { metric: 'custom_2', label: 'Secondary KPI', target: 0, unit: '', direction: 'up' },
      tertiary: { metric: 'custom_3', label: 'Tertiary KPI', target: 0, unit: '', direction: 'up' },
      dashboardKPIOrder: ['custom_1', 'custom_2', 'custom_3'],
    },
    recommendedPlaybooks: [],
  },
];

export const getTemplateById = (id) => workspaceTemplates.find((t) => t.id === id) ?? null;
