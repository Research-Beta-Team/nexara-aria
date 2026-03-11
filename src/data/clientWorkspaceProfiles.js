// ─────────────────────────────────────────────
//  Antarious — Client Workspace Profiles (mock)
//  Layer 2: CSM-configured overrides per client
// ─────────────────────────────────────────────

import { getTemplateById } from './workspaceTemplates';

function mergeProfile(templateId, overrides = {}) {
  const base = getTemplateById(templateId);
  if (!base) return null;
  return {
    ...base,
    layout: { ...base.layout, ...(overrides.layout || {}) },
    agents: { ...base.agents, ...(overrides.agents || {}) },
    freya: { ...base.freya, ...(overrides.freya || {}) },
    workflows: { ...base.workflows, ...(overrides.workflows || {}) },
    kpis: { ...base.kpis, ...(overrides.kpis || {}) },
  };
}

export const clientWorkspaceProfiles = {
  'medglobal': {
    clientId: 'medglobal',
    clientName: 'Medglobal',
    templateBase: 'b2b-saas',
    configuredBy: 'Sarah Chen',
    status: 'active',
    ...mergeProfile('b2b-saas', {
      agents: {
        active: ['gtm_strategist', 'icp_researcher', 'copywriter', 'sdr', 'meta_ads', 'meta_monitor', 'analytics', 'seo', 'linkedin_ads'],
        disabled: ['competitor_intel', 'social_media'],
        primaryAgent: 'gtm_strategist',
      },
      workflows: {
        escalationThreshold: 5000,
      },
    }),
    clientPreferences: {
      dashboardWidgetOrder: ['campaign_health', 'pipeline_funnel', 'freya_insights', 'agent_activity', 'meta_spend', 'escalation_queue'],
      notificationFrequency: 'daily',
      reportFormat: 'pdf',
      preferredReportDay: 'Monday',
      freyaVerbosity: 'standard',
      autoApproveContent: false,
      language: 'en',
    },
    clientEditableFields: ['dashboardWidgetOrder', 'notificationFrequency', 'reportFormat', 'preferredReportDay', 'freyaVerbosity', 'autoApproveContent', 'language'],
  },

  'glowup-cosmetics': {
    clientId: 'glowup-cosmetics',
    clientName: 'GlowUp Cosmetics',
    templateBase: 'ecommerce-d2c',
    configuredBy: 'Sarah Chen',
    status: 'active',
    ...mergeProfile('ecommerce-d2c', {
      freya: {
        persona: 'growth_marketer',
        greeting: 'ROAS and Instagram Reels performance are top of mind. I\'ll surface top creatives and audience insights.',
      },
      layout: {
        dashboardWidgets: ['campaign_health', 'meta_spend', 'freya_insights', 'agent_activity', 'roas_tracker', 'social_reach'],
      },
    }),
    clientPreferences: {
      dashboardWidgetOrder: ['campaign_health', 'roas_tracker', 'meta_spend', 'social_reach', 'freya_insights', 'agent_activity'],
      notificationFrequency: 'daily',
      reportFormat: 'pdf',
      preferredReportDay: 'Friday',
      freyaVerbosity: 'concise',
      autoApproveContent: true,
      language: 'en',
    },
    clientEditableFields: ['dashboardWidgetOrder', 'notificationFrequency', 'reportFormat', 'preferredReportDay', 'freyaVerbosity', 'autoApproveContent', 'language'],
  },

  'techbridge-consulting': {
    clientId: 'techbridge-consulting',
    clientName: 'TechBridge Consulting',
    templateBase: 'professional-services',
    configuredBy: 'Sarah Chen',
    status: 'active',
    ...mergeProfile('professional-services', {
      agents: {
        active: ['gtm_strategist', 'icp_researcher', 'competitor_intel', 'copywriter', 'sdr', 'analytics', 'seo'],
        disabled: ['meta_ads', 'meta_monitor', 'social_media'],
        primaryAgent: 'bd_lead',
      },
      layout: {
        visibleModules: ['dashboard', 'campaigns', 'outreach', 'content', 'analytics', 'research/icp', 'research/intent', 'research/competitive'],
        sidebarOrder: ['dashboard', 'campaigns', 'outreach', 'content', 'analytics', 'research/icp', 'research/intent', 'research/competitive'],
      },
    }),
    clientPreferences: {
      dashboardWidgetOrder: ['campaign_health', 'freya_insights', 'agent_activity', 'pipeline_funnel'],
      notificationFrequency: 'weekly',
      reportFormat: 'pdf',
      preferredReportDay: 'Wednesday',
      freyaVerbosity: 'detailed',
      autoApproveContent: false,
      language: 'en',
    },
    clientEditableFields: ['dashboardWidgetOrder', 'notificationFrequency', 'reportFormat', 'preferredReportDay', 'freyaVerbosity', 'autoApproveContent', 'language'],
  },

  'grameen-impact-fund': {
    clientId: 'grameen-impact-fund',
    clientName: 'Grameen Impact Fund',
    templateBase: 'ngo-fundraising',
    configuredBy: 'Sarah Chen',
    status: 'active',
    ...mergeProfile('ngo-fundraising', {
      agents: {
        active: ['copywriter', 'social_media', 'seo', 'analytics', 'meta_ads'],
        disabled: ['gtm_strategist', 'icp_researcher', 'competitor_intel', 'sdr', 'meta_monitor'],
        primaryAgent: 'campaign_coordinator',
      },
      freya: {
        language: 'bn-en',
        greeting: 'Donor impact and campaign reach. Meta and email performance at a glance. I\'ll surface top content.',
      },
    }),
    clientPreferences: {
      dashboardWidgetOrder: ['campaign_health', 'donor_pipeline', 'freya_insights', 'agent_activity', 'social_reach'],
      notificationFrequency: 'weekly',
      reportFormat: 'pdf',
      preferredReportDay: 'Monday',
      freyaVerbosity: 'standard',
      autoApproveContent: false,
      language: 'bn-en',
    },
    clientEditableFields: ['dashboardWidgetOrder', 'notificationFrequency', 'reportFormat', 'preferredReportDay', 'freyaVerbosity', 'autoApproveContent', 'language'],
  },
};

export const getProfileByClientId = (clientId) => clientWorkspaceProfiles[clientId] ?? null;

export const getAllClientIds = () => Object.keys(clientWorkspaceProfiles);
