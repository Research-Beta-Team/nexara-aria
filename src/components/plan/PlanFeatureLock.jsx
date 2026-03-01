import { useState } from 'react';
import { Lock } from 'lucide-react';
import usePlan from '../../hooks/usePlan';
import { PLANS, PLAN_ORDER } from '../../config/plans';
import { C, F, R, S, Z } from '../../tokens';
import UpgradeModal from './UpgradeModal';

// ── Helpers ───────────────────────────────────────────────────────────────────

const DISPLAY_NAME_OVERRIDES = {
  abmEngine:            'ABM Engine',
  icpBuilder:           'ICP Builder',
  icpScoring:           'ICP Scoring',
  apiAccess:            'API Access',
  ariaVoice:            'ARIA Voice',
  dataWarehouseSync:    'Data Warehouse Sync',
  crossClientAnalytics: 'Cross-Client Analytics',
  roleBasedAccess:      'Role-Based Access',
  subBilling:           'Sub-Billing',
  metaAdsManagement:    'Meta Ads Management',
  googleAdsManagement:  'Google Ads Management',
  linkedinAdsManagement:'LinkedIn Ads Management',
  unifiedInbox:         'Unified Inbox',
  intentSignals:        'Intent Signals',
  competitiveIntel:     'Competitive Intel',
  predictiveForecasting:'Predictive Forecasting',
  pipelineManager:      'Pipeline Manager',
  clientPortal:         'Client Portal',
  whiteLabel:           'White-Label',
  customAgents:         'Custom Agents',
};

function toDisplayName(key) {
  if (!key) return '';
  if (DISPLAY_NAME_OVERRIDES[key]) return DISPLAY_NAME_OVERRIDES[key];
  return key.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase()).trim();
}

function findRequiredPlan(feature) {
  for (const planId of PLAN_ORDER) {
    if (PLANS[planId]?.features?.[feature]) return planId;
  }
  return 'agency';
}

// ── Component ─────────────────────────────────────────────────────────────────

/**
 * PlanFeatureLock — lighter lock for individual UI elements (buttons, tabs, menu items).
 * Dims the child, intercepts clicks, shows a tooltip, and opens the upgrade modal.
 *
 * Usage:
 *   <PlanFeatureLock feature="whiteLabel" requiredPlan="agency">
 *     <button onClick={openConfig}>White-Label Settings</button>
 *   </PlanFeatureLock>
 */
export default function PlanFeatureLock({
  feature,
  requiredPlan,
  children,
  tooltipText,
}) {
  const { hasFeature, planId } = usePlan();
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [hovered,     setHovered]     = useState(false);

  // ── Access granted — passthrough ──────────────────────────────────────────
  if (hasFeature(feature)) return children;

  // ── Locked ────────────────────────────────────────────────────────────────
  const neededPlan    = requiredPlan ?? findRequiredPlan(feature);
  const neededPlanObj = PLANS[neededPlan] ?? PLANS.growth;
  const tip = tooltipText
    ?? `Requires ${neededPlanObj.displayName} plan · Click to upgrade`;

  return (
    <>
      <div style={{ position: 'relative', display: 'inline-flex' }}>
        {/* Dimmed child — non-interactive */}
        <div style={{ opacity: 0.35, pointerEvents: 'none', userSelect: 'none' }}>
          {children}
        </div>

        {/* Invisible click + hover capture layer */}
        <div
          role="button"
          aria-label={tip}
          style={{
            position: 'absolute', inset: 0,
            cursor: 'pointer', zIndex: Z.raised,
          }}
          onClick={() => setShowUpgrade(true)}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        />

        {/* Lock badge — top-right corner */}
        <div style={{
          position: 'absolute', top: '-6px', right: '-6px',
          width: '18px', height: '18px',
          borderRadius: '50%',
          backgroundColor: C.surface2,
          border: `1px solid ${C.amber}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: Z.raised + 1,
          flexShrink: 0,
          pointerEvents: 'none',
        }}>
          <Lock size={10} color={C.amber} />
        </div>

        {/* Tooltip */}
        {hovered && (
          <div style={{
            position: 'absolute',
            bottom: 'calc(100% + 10px)',
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: C.surface3,
            border: `1px solid ${C.border}`,
            borderRadius: R.md,
            padding: `${S[1]} ${S[3]}`,
            fontFamily: F.body,
            fontSize: '12px',
            color: C.textSecondary,
            whiteSpace: 'nowrap',
            zIndex: Z.dropdown,
            pointerEvents: 'none',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
          }}>
            {tip}
            {/* Tiny arrow */}
            <div style={{
              position: 'absolute', bottom: '-5px', left: '50%',
              transform: 'translateX(-50%)',
              width: 0, height: 0,
              borderLeft: '5px solid transparent',
              borderRight: '5px solid transparent',
              borderTop: `5px solid ${C.border}`,
            }} />
          </div>
        )}
      </div>

      {/* Upgrade modal (portaled) */}
      {showUpgrade && (
        <UpgradeModal
          fromPlan={planId}
          toPlan={neededPlan}
          featureUnlocked={feature}
          onClose={() => setShowUpgrade(false)}
        />
      )}
    </>
  );
}
