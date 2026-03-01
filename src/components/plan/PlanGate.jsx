import { useState } from 'react';
import { Lock } from 'lucide-react';
import usePlan from '../../hooks/usePlan';
import { PLANS, PLAN_ORDER } from '../../config/plans';
import { C, F, R, S, Z, btn } from '../../tokens';
import PlanBadge from './PlanBadge';
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
  metaAdsMonitoring:    'Meta Ads Monitoring',
  googleAdsManagement:  'Google Ads Management',
  linkedinAdsManagement:'LinkedIn Ads Management',
  unifiedInbox:         'Unified Inbox',
  intentSignals:        'Intent Signals',
  competitiveIntel:     'Competitive Intel',
  predictiveForecasting:'Predictive Forecasting',
  pipelineManager:      'Pipeline Manager',
  customerSuccess:      'Customer Success',
  queryManager:         'Query Manager',
  calendarView:         'Calendar View',
  ganttPlan:            'Gantt Plan',
  clientPortal:         'Client Portal',
  whiteLabel:           'White-Label',
  customAgents:         'Custom Agents',
  verticalPlaybooks:    'Vertical Playbooks',
  outcomeBilling:       'Outcome Billing',
  advancedAnalytics:    'Advanced Analytics',
};

function toDisplayName(key) {
  if (!key) return '';
  if (DISPLAY_NAME_OVERRIDES[key]) return DISPLAY_NAME_OVERRIDES[key];
  return key.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase()).trim();
}

// Find the lowest plan tier that includes this feature
function findRequiredPlan(feature) {
  for (const planId of PLAN_ORDER) {
    if (PLANS[planId]?.features?.[feature]) return planId;
  }
  return 'agency';
}

// Placeholder shown when showPreview=false
function PlaceholderCard() {
  return (
    <div style={{
      minHeight: '200px',
      border: `1px dashed ${C.border}`,
      borderRadius: R.card,
      backgroundColor: C.surface2,
    }} />
  );
}

// ── Component ─────────────────────────────────────────────────────────────────

/**
 * PlanGate — wraps a feature section and shows an upgrade overlay when the
 * current plan does not include the feature.
 *
 * Usage:
 *   <PlanGate feature="competitiveIntel" requiredPlan="scale">
 *     <CompetitiveIntelSection />
 *   </PlanGate>
 */
export default function PlanGate({
  feature,
  requiredPlan,
  children,
  fallback,
  showPreview = true,
}) {
  const { hasFeature, planId } = usePlan();
  const [showUpgrade, setShowUpgrade] = useState(false);

  // ── Access granted ────────────────────────────────────────────────────────
  if (hasFeature(feature)) return children;

  // ── Custom fallback ───────────────────────────────────────────────────────
  if (fallback) return fallback;

  // ── Lock overlay ──────────────────────────────────────────────────────────
  const neededPlan    = requiredPlan ?? findRequiredPlan(feature);
  const neededPlanObj = PLANS[neededPlan] ?? PLANS.growth;

  return (
    <div style={{ position: 'relative' }}>
      {/* Blurred preview (or placeholder) */}
      {showPreview ? (
        <div
          aria-hidden="true"
          style={{ filter: 'blur(4px)', pointerEvents: 'none', userSelect: 'none' }}
        >
          {children}
        </div>
      ) : (
        <PlaceholderCard />
      )}

      {/* Overlay */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'rgba(7,13,9,0.85)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: S[3],
        borderRadius: R.card,
        zIndex: Z.raised,
        padding: S[6],
        textAlign: 'center',
      }}>
        {/* Icon ring */}
        <div style={{
          width: '52px', height: '52px',
          borderRadius: '50%',
          backgroundColor: C.amberDim,
          border: `1px solid ${C.amber}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>
          <Lock size={24} color={C.amber} />
        </div>

        <p style={{
          fontFamily: F.body, fontWeight: 700, fontSize: '16px',
          color: C.textPrimary, margin: 0,
        }}>
          {toDisplayName(feature)} is a {neededPlanObj.name} feature
        </p>

        <p style={{
          fontFamily: F.body, fontSize: '13px',
          color: C.textSecondary, margin: 0,
        }}>
          Upgrade to {neededPlanObj.displayName} to unlock this
        </p>

        <button
          style={btn.primary}
          onClick={() => setShowUpgrade(true)}
        >
          Upgrade to {neededPlanObj.displayName} →
        </button>

        <PlanBadge planId={neededPlan} size="sm" showIcon />
      </div>

      {/* Upgrade modal */}
      {showUpgrade && (
        <UpgradeModal
          fromPlan={planId}
          toPlan={neededPlan}
          featureUnlocked={feature}
          onClose={() => setShowUpgrade(false)}
        />
      )}
    </div>
  );
}
