/**
 * Workflow registry — all pre-built multi-agent workflows.
 * Each workflow defines a sequence of agent:skill steps.
 */

export const WORKFLOWS = {
  campaign_launch: {
    id: 'campaign_launch',
    name: 'Campaign Launch',
    description: 'End-to-end campaign creation: strategy, content, compliance review, and outreach scheduling',
    steps: ['strategist:strategy', 'copywriter:content', 'guardian:review', 'outreach:schedule'],
    estimatedTime: '8-12 minutes',
    creditCost: 120,
  },
  content_creation: {
    id: 'content_creation',
    name: 'Content Creation',
    description: 'Content with compliance: strategic brief, content generation, and guardian approval',
    steps: ['strategist:brief', 'copywriter:generate', 'guardian:approve'],
    estimatedTime: '5-8 minutes',
    creditCost: 80,
  },
  lead_to_customer: {
    id: 'lead_to_customer',
    name: 'Lead to Customer',
    description: 'Full lead lifecycle: enrich, score, contact, and revenue tracking',
    steps: ['prospector:enrich', 'analyst:score', 'outreach:contact', 'revenue:track'],
    estimatedTime: '10-15 minutes',
    creditCost: 100,
  },
  performance_review: {
    id: 'performance_review',
    name: 'Performance Review',
    description: 'Weekly performance synthesis: analyze data, generate recommendations, and create executive brief',
    steps: ['analyst:analyze', 'strategist:recommend', 'freya:brief'],
    estimatedTime: '5-7 minutes',
    creditCost: 60,
  },
  seo_audit: {
    id: 'seo_audit',
    name: 'SEO Audit',
    description: 'Audit, fix, test cycle: technical audit, content fixes, and conversion testing',
    steps: ['analyst:audit', 'copywriter:fix', 'optimizer:test'],
    estimatedTime: '8-12 minutes',
    creditCost: 90,
  },
  ab_test: {
    id: 'ab_test',
    name: 'A/B Test',
    description: 'Design, create, measure: test design, content variants, and statistical evaluation',
    steps: ['optimizer:design', 'copywriter:variants', 'analyst:evaluate'],
    estimatedTime: '6-10 minutes',
    creditCost: 70,
  },
};

/**
 * Get a workflow by ID.
 * @param {string} workflowId
 * @returns {Object|null}
 */
export function getWorkflow(workflowId) {
  return WORKFLOWS[workflowId] || null;
}

/**
 * Get all available workflow IDs.
 * @returns {string[]}
 */
export function getWorkflowIds() {
  return Object.keys(WORKFLOWS);
}
