/**
 * Onboarding: company type → recommended plan + reasons.
 * Used by Onboarding step 3 (tier recommendation).
 */

import { PLANS, PLAN_ORDER } from '../config/plans';

export const COMPANY_TYPES = [
  { id: 'solo', label: 'Solo founder / freelancer', sublabel: 'Just me or a tiny team.' },
  { id: 'startup', label: 'Startup / small team', sublabel: 'Small team, few campaigns.' },
  { id: 'agency', label: 'Growing agency', sublabel: 'Multiple clients, need scale.' },
  { id: 'enterprise', label: 'Enterprise / large agency', sublabel: 'Many teams, full control.' },
];

const RECOMMENDATIONS = {
  solo: {
    planId: 'starter',
    reasons: ['2 campaigns and 3 seats are enough to start.', 'Email + Meta Monitor included.', 'Upgrade anytime as you grow.'],
  },
  startup: {
    planId: 'growth',
    reasons: ['Unlimited campaigns and unified Inbox.', 'Intent Signals and ABM for better targeting.', 'Pipeline and Gantt for execution.'],
  },
  agency: {
    planId: 'growth',
    reasons: ['Multi-client ready with 3 workspaces.', 'Client Portals and outcome billing.', 'Scale to 10 seats and beyond.'],
  },
  enterprise: {
    planId: 'scale',
    reasons: ['Custom agents and API access.', 'White-label and cross-client analytics.', 'ARIA Voice and dedicated support.'],
  },
};

export function getRecommendedPlan(companyTypeId) {
  return RECOMMENDATIONS[companyTypeId] || RECOMMENDATIONS.solo;
}

export function getPlanForOnboarding(planId) {
  return PLANS[planId] || PLANS.starter;
}

export function getAllPlansForPicker() {
  return PLAN_ORDER.map((id) => PLANS[id]).filter(Boolean);
}
