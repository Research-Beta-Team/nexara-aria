import { useState, useEffect, useRef } from 'react';
import useStore from '../store/useStore';
import usePlan from './usePlan';
import useCredits from './useCredits';
import { PLANS, PLAN_ORDER } from '../config/plans';

const PLAN_ORDER_IDX = Object.fromEntries(PLAN_ORDER.map((id, i) => [id, i]));

function isHigherPlan(prevId, nextId) {
  if (!prevId || !nextId) return false;
  return (PLAN_ORDER_IDX[nextId] ?? -1) > (PLAN_ORDER_IDX[prevId] ?? -1);
}

function countAgents(plan) {
  if (!plan?.agents) return 0;
  const a = plan.agents.available;
  return a === 'all' ? 22 : (Array.isArray(a) ? a.length : 0);
}

const CREDIT_LOW_THRESHOLD = 0.15;   // 15% remaining = low
const CREDIT_CRITICAL_THRESHOLD = 0.05; // 5% remaining = critical
const CREDIT_TOAST_COOLDOWN_KEY = 'nexara_credit_toast_last';
const CREDIT_TOAST_COOLDOWN_MS = 60 * 60 * 1000; // 1 hour

/**
 * usePlanAlerts — central state for plan-related toasts, welcome banner, and expiry warnings.
 * Used by AppLayout, Dashboard, TopBar, and UpgradePage.
 */
export default function usePlanAlerts() {
  const planId = useStore((s) => s.currentPlanId);
  const planRenewsAt = useStore((s) => s.planRenewsAt);
  const billingCycle = useStore((s) => s.billingCycle);
  const { plan } = usePlan();
  const { creditsRemaining, rolloverBalance } = useCredits();

  const prevPlanIdRef = useRef(planId);
  const creditCooldownRef = useRef(null);
  const [planChangeToast, setPlanChangeToast] = useState(null);
  const [creditToast, setCreditToast] = useState(null);
  const [showWelcomeBanner, setShowWelcomeBannerState] = useState(false);

  const totalCredits = (useStore.getState().creditsIncluded ?? 0) + (rolloverBalance ?? 0);
  const remainingRatio = totalCredits > 0 ? creditsRemaining / totalCredits : 1;

  // ── Upgrade detection: show plan-change toast once when plan goes up ──
  useEffect(() => {
    const prev = prevPlanIdRef.current;
    if (prev !== planId && isHigherPlan(prev, planId)) {
      const prevPlan = PLANS[prev];
      const nextPlan = PLANS[planId] ?? plan;
      const creditsAdded = nextPlan?.credits?.included ?? 0;
      const agentsBefore = prevPlan ? countAgents(prevPlan) : 0;
      const agentsAfter = countAgents(nextPlan);
      const agentsUnlocked = Math.max(0, agentsAfter - agentsBefore);

      setPlanChangeToast({
        type: 'upgrade',
        planId,
        planDisplayName: nextPlan?.displayName ?? planId,
        creditsAdded,
        agentsUnlockedCount: agentsUnlocked,
      });

      const bannerKey = `nexara_welcome_banner_dismissed_${planId}`;
      if (!localStorage.getItem(bannerKey)) {
        setShowWelcomeBannerState(true);
      }
    }
    prevPlanIdRef.current = planId;
  }, [planId, plan]);

  // ── Credit toast: low (15%) and critical (5%) with cooldown ──
  useEffect(() => {
    if (remainingRatio > CREDIT_LOW_THRESHOLD) {
      setCreditToast(null);
      return;
    }
    const level = remainingRatio <= CREDIT_CRITICAL_THRESHOLD ? 'critical' : 'low';
    const now = Date.now();
    const last = creditCooldownRef.current;
    if (last && last.level === level && now - last.time < CREDIT_TOAST_COOLDOWN_MS) return;
    creditCooldownRef.current = { level, time: now };
    setCreditToast({ level, creditsRemaining });
  }, [remainingRatio, creditsRemaining]);

  function dismissPlanChangeToast() {
    setPlanChangeToast(null);
  }

  function dismissCreditToast() {
    sessionStorage.setItem(CREDIT_TOAST_COOLDOWN_KEY, String(Date.now()));
    setCreditToast(null);
  }

  function dismissWelcomeBanner() {
    const key = `nexara_welcome_banner_dismissed_${planId}`;
    localStorage.setItem(key, '1');
    setShowWelcomeBannerState(false);
  }

  // ── Expiry / renewal warning (30d, 7d, failed payment mock) ──
  let expiryWarning = null;
  if (planRenewsAt && planId) {
    const renewDate = new Date(planRenewsAt);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    renewDate.setHours(0, 0, 0, 0);
    const daysLeft = Math.ceil((renewDate - today) / (24 * 60 * 60 * 1000));
    const planObj = PLANS[planId];
    const amount = planObj?.price?.[billingCycle ?? 'annual'] ?? 0;

    if (daysLeft <= 30 && daysLeft > 7) {
      expiryWarning = { kind: '30d', renewDate: planRenewsAt, amount, cardLast4: '4242', daysLeft };
    } else if (daysLeft <= 7 && daysLeft > 0) {
      expiryWarning = { kind: '7d', renewDate: planRenewsAt, amount, cardLast4: '4242', daysLeft };
    } else if (daysLeft <= 0) {
      expiryWarning = { kind: 'overdue', renewDate: planRenewsAt, amount, daysLeft: 0 };
    }
  }

  return {
    planChangeToast,
    dismissPlanChangeToast,
    creditToast,
    dismissCreditToast,
    showWelcomeBanner,
    dismissWelcomeBanner,
    expiryWarning,
  };
}
