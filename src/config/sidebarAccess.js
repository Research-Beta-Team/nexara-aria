/**
 * Sidebar visibility by subscription plan (intersects with role-driven section lists).
 * Uses feature flags from src/config/plans.js.
 */

import { planHasFeature } from './plans';

const PLAN_RANK = { starter: 0, growth: 1, scale: 2, agency: 3 };

export function planMeetsMinimum(planId, minPlanId) {
  const a = PLAN_RANK[planId] ?? 0;
  const b = PLAN_RANK[minPlanId] ?? 0;
  return a >= b;
}

/**
 * Entire nav section is omitted when the plan cannot use any meaningful item in that group.
 */
export function isSidebarSectionVisibleForPlan(sectionId, planId) {
  switch (sectionId) {
    case 'teamManagement':
      return planHasFeature(planId, 'queryManager');
    case 'research':
      return (
        planHasFeature(planId, 'icpBuilder') ||
        planHasFeature(planId, 'intentSignals') ||
        planHasFeature(planId, 'competitiveIntel')
      );
    case 'abmPlaybooks':
      return (
        planHasFeature(planId, 'abmEngine') ||
        planHasFeature(planId, 'verticalPlaybooks')
      );
    case 'crm':
      return planMeetsMinimum(planId, 'growth');
    default:
      return true;
  }
}

/**
 * Per-item plan rules (in addition to GatedNavItem / PlanGate feature checks).
 */
export function isSidebarNavItemVisibleForPlan(item, planId) {
  if (item.hideForPlans?.includes(planId)) return false;
  if (item.minPlan && !planMeetsMinimum(planId, item.minPlan)) return false;
  return true;
}
