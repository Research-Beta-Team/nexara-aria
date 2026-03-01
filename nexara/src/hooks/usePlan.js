import useStore from '../store/useStore';
import {
  PLANS,
  getUpgradePlan,
  planHasFeature,
  planHasAgent,
  getPlanLimit,
  isLimitReached as _isLimitReached,
} from '../config/plans';

export default function usePlan() {
  const planId = useStore(s => s.currentPlanId);
  const plan = PLANS[planId] ?? PLANS.starter;

  const upgradePlan = getUpgradePlan(planId);

  return {
    plan,
    planId,

    hasFeature: (featureKey) => planHasFeature(planId, featureKey),
    hasAgent: (agentId) => planHasAgent(planId, agentId),
    getLimit: (limitKey) => getPlanLimit(planId, limitKey),
    isLimitReached: (limitKey, currentUsage) => _isLimitReached(planId, limitKey, currentUsage),

    upgradePlan,
    canUpgrade: upgradePlan !== null,

    isStarter: planId === 'starter',
    isGrowth: planId === 'growth',
    isScale: planId === 'scale',
    isAgency: planId === 'agency',

    planColor: plan.color,
  };
}
