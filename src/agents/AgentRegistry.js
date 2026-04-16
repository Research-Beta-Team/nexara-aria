/**
 * AgentRegistry.js
 * Central registry of all 8 Antarious multi-agent runtime agents.
 */

export const AGENTS = {
  freya: {
    id: 'freya',
    name: 'Freya',
    displayName: 'Freya',
    role: 'orchestrator',
    description: 'AI orchestrator — routes tasks, resolves conflicts, maintains global state',
    color: '#4A7C6F',
    skills: [
      'content-strategy', 'launch-strategy', 'marketing-ideas', 'marketing-psychology',
      'pricing-strategy', 'product-marketing-context', 'copywriting', 'copy-editing',
      'ad-creative', 'social-content', 'email-sequence', 'lead-magnets',
      'analytics-tracking', 'seo-audit', 'ai-seo', 'site-architecture',
      'programmatic-seo', 'schema-markup', 'customer-research', 'competitor-alternatives',
      'cold-email', 'revops', 'sales-enablement', 'page-cro', 'form-cro',
      'signup-flow-cro', 'onboarding-cro', 'popup-cro', 'paywall-upgrade-cro',
      'ab-test-setup', 'referral-program', 'free-tool-strategy', 'churn-prevention', 'paid-ads',
    ],
    triggers: ['user_chat', 'at_mention', 'scheduled_brief', 'escalation'],
    canDelegate: ['strategist', 'copywriter', 'analyst', 'prospector', 'optimizer', 'outreach', 'revenue', 'guardian'],
    autonomyLevel: 'autonomous',
  },

  strategist: {
    id: 'strategist',
    name: 'Strategist',
    displayName: 'Strategy Agent',
    role: 'specialist',
    description: 'Plans marketing strategy, campaigns, positioning, and pricing',
    color: '#4A7C6F',
    skills: [
      'content-strategy', 'launch-strategy', 'marketing-ideas',
      'marketing-psychology', 'pricing-strategy', 'product-marketing-context',
    ],
    triggers: ['campaign_created', 'strategy_requested', 'icp_changed', 'competitor_update'],
    canDelegate: ['copywriter', 'analyst', 'revenue'],
    autonomyLevel: 'act_with_approval',
  },

  copywriter: {
    id: 'copywriter',
    name: 'Copywriter',
    displayName: 'Content Agent',
    role: 'specialist',
    description: 'Creates all marketing content — emails, ads, social posts, landing pages, lead magnets',
    color: '#6BA396',
    skills: [
      'copywriting', 'copy-editing', 'ad-creative',
      'social-content', 'email-sequence', 'lead-magnets',
    ],
    triggers: ['content_requested', 'strategy_complete', 'revision_requested', 'campaign_content_tab'],
    canDelegate: ['guardian'],
    autonomyLevel: 'act_with_approval',
  },

  analyst: {
    id: 'analyst',
    name: 'Analyst',
    displayName: 'Insights Agent',
    role: 'specialist',
    description: 'Monitors data, runs audits, detects anomalies, builds attribution models',
    color: '#3B82F6',
    skills: [
      'analytics-tracking', 'seo-audit', 'ai-seo', 'site-architecture',
      'programmatic-seo', 'schema-markup', 'customer-research', 'competitor-alternatives',
    ],
    triggers: ['audit_requested', 'data_anomaly', 'scheduled_report', 'performance_review'],
    canDelegate: ['optimizer', 'strategist'],
    autonomyLevel: 'autonomous',
  },

  prospector: {
    id: 'prospector',
    name: 'Prospector',
    displayName: 'Lead Agent',
    role: 'specialist',
    description: 'Finds, qualifies, and enriches leads — triggers handoff when MQL threshold hit',
    color: '#F59E0B',
    skills: ['customer-research', 'cold-email', 'revops', 'sales-enablement'],
    triggers: ['lead_ingested', 'mql_threshold', 'enrichment_needed', 'handoff_requested'],
    canDelegate: ['outreach', 'revenue', 'analyst'],
    autonomyLevel: 'act_with_approval',
  },

  optimizer: {
    id: 'optimizer',
    name: 'Optimizer',
    displayName: 'CRO Agent',
    role: 'specialist',
    description: 'Optimizes every conversion point — pages, forms, signups, onboarding, popups, paywalls, A/B tests',
    color: '#EF4444',
    skills: [
      'page-cro', 'form-cro', 'signup-flow-cro', 'onboarding-cro',
      'popup-cro', 'paywall-upgrade-cro', 'ab-test-setup',
    ],
    triggers: ['optimize_requested', 'test_complete', 'conversion_drop', 'cro_audit'],
    canDelegate: ['analyst', 'copywriter'],
    autonomyLevel: 'suggest',
  },

  outreach: {
    id: 'outreach',
    name: 'Outreach',
    displayName: 'Outreach Agent',
    role: 'specialist',
    description: 'Manages email sequences, social outreach, referral programs, and follow-ups',
    color: '#8B5CF6',
    skills: ['cold-email', 'email-sequence', 'social-content', 'referral-program', 'free-tool-strategy'],
    triggers: ['sequence_step_due', 'reply_received', 'lead_assigned', 'outreach_requested'],
    canDelegate: ['copywriter', 'guardian'],
    autonomyLevel: 'act_with_approval',
  },

  revenue: {
    id: 'revenue',
    name: 'Revenue',
    displayName: 'Revenue Agent',
    role: 'specialist',
    description: 'Manages pipeline, forecasting, customer success, churn prevention, and pricing',
    color: '#10B981',
    skills: ['revops', 'sales-enablement', 'pricing-strategy', 'churn-prevention', 'referral-program'],
    triggers: ['deal_stage_change', 'churn_signal', 'forecast_requested', 'pipeline_update', 'expansion_signal'],
    canDelegate: ['prospector', 'analyst', 'strategist'],
    autonomyLevel: 'act_with_approval',
  },

  guardian: {
    id: 'guardian',
    name: 'Guardian',
    displayName: 'Compliance Agent',
    role: 'specialist',
    description: 'Reviews all content for brand voice, legal compliance, and factual accuracy before publication',
    color: '#6366F1',
    skills: ['copy-editing', 'product-marketing-context'],
    triggers: ['content_submitted', 'outreach_pending', 'budget_change', 'approval_requested'],
    canDelegate: ['copywriter'],
    autonomyLevel: 'autonomous',
  },
};

/** Get a single agent definition by id */
export const getAgent = (id) => AGENTS[id] || null;

/** Get all agents that have a particular skill */
export const getAgentsBySkill = (skillName) =>
  Object.values(AGENTS).filter((a) => a.skills.includes(skillName));

/** Get all specialist agents (excludes the orchestrator) */
export const getSpecialistAgents = () =>
  Object.values(AGENTS).filter((a) => a.role === 'specialist');

/** Get every registered agent id */
export const getAllAgentIds = () => Object.keys(AGENTS);
