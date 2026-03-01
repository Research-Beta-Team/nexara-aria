import { useState } from 'react';
import { AlertTriangle, Plus } from 'lucide-react';
import usePlan from '../../hooks/usePlan';
import { getPlanLimit } from '../../config/plans';
import useToast from '../../hooks/useToast';
import { C, F, R, S, btn, flex } from '../../tokens';
import UpgradeModal from './UpgradeModal';

// ── Limit config ──────────────────────────────────────────────────────────────
// Per-limitKey messaging and optional add-on suggestion

const LIMIT_CONFIG = {
  activeCampaigns: {
    label: 'campaign', plural: 'campaigns',
    upgrade: 'unlimited campaigns',
    addon: null,
  },
  teamSeats: {
    label: 'team seat', plural: 'team seats',
    upgrade: '25 seats',
    addon: { label: 'Buy 5-pack add-on', id: 'extra_seats_5pack' },
  },
  workspaces: {
    label: 'workspace', plural: 'workspaces',
    upgrade: '10 workspaces',
    addon: { label: 'Add workspace — $99/mo', id: 'extra_workspace' },
  },
  clientPortals: {
    label: 'client portal', plural: 'client portals',
    upgrade: 'unlimited portals',
    addon: null,
  },
  customAgents: {
    label: 'custom agent', plural: 'custom agents',
    upgrade: 'unlimited custom agents',
    addon: { label: 'Custom Agent Build', id: 'custom_agent_build' },
  },
  ariaVoiceMinutes: {
    label: 'ARIA Voice minute', plural: 'ARIA Voice minutes',
    upgrade: 'unlimited minutes',
    addon: { label: '+500 min expansion', id: 'aria_voice_expansion' },
  },
  intentSignalAccounts: {
    label: 'intent signal account', plural: 'intent signal accounts',
    upgrade: 'unlimited accounts',
    addon: { label: 'Intent Data Boost', id: 'intent_data_boost' },
  },
  namedAccountsABM: {
    label: 'named ABM account', plural: 'named ABM accounts',
    upgrade: 'unlimited named accounts',
    addon: null,
  },
};

// Generic fallback for unknown limit keys
function getConfig(limitKey) {
  return LIMIT_CONFIG[limitKey] ?? {
    label: limitKey,
    plural: `${limitKey}s`,
    upgrade: 'more',
    addon: null,
  };
}

// ── Component ─────────────────────────────────────────────────────────────────

/**
 * LimitWarning — shows a contextual amber banner when a plan limit is ≥ 85% used.
 * Returns null when the limit is unlimited or usage is safely below threshold.
 *
 * Usage:
 *   <LimitWarning limitKey="activeCampaigns" currentUsage={2} />
 *   <LimitWarning limitKey="teamSeats" currentUsage={9} planId="growth" />
 */
export default function LimitWarning({ limitKey, currentUsage, planId: planIdProp }) {
  const { planId: storePlanId, upgradePlan } = usePlan();
  const toast = useToast();

  const [showUpgrade, setShowUpgrade] = useState(false);

  const resolvedPlanId = planIdProp ?? storePlanId;
  const limit = getPlanLimit(resolvedPlanId, limitKey);

  // Unlimited or inapplicable — render nothing
  if (limit === -1 || limit === 0) return null;

  const threshold = limit * 0.85;

  // Not close enough to the limit — render nothing
  if (currentUsage < threshold) return null;

  const isAtLimit  = currentUsage >= limit;
  const remaining  = limit - currentUsage;
  const config     = getConfig(limitKey);
  const targetPlan = upgradePlan;

  // Build warning message
  let message;
  if (isAtLimit) {
    message = `You've reached your ${limit}-${config.label} limit.`;
  } else {
    message = `${remaining} ${remaining === 1 ? config.label : config.plural} remaining.`;
  }

  const upgradeText = targetPlan
    ? `Upgrade to ${targetPlan.displayName} for ${config.upgrade}.`
    : null;

  return (
    <>
      <div style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: S[3],
        backgroundColor: C.amberDim,
        border: `1px solid ${C.amber}`,
        borderRadius: R.md,
        padding: `${S[3]} ${S[4]}`,
      }}>
        {/* Icon */}
        <AlertTriangle size={15} color={C.amber} style={{ flexShrink: 0, marginTop: '1px' }} />

        {/* Text + actions */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: S[1] }}>
          <span style={{
            fontFamily: F.body, fontSize: '13px', fontWeight: 500,
            color: C.amber, lineHeight: 1.4,
          }}>
            {message}
            {upgradeText && ` ${upgradeText}`}
          </span>

          {/* Action buttons */}
          <div style={{ ...flex.row, gap: S[2], flexWrap: 'wrap' }}>
            {targetPlan && (
              <button
                style={{
                  fontFamily: F.body, fontSize: '12px', fontWeight: 600,
                  color: C.amber, background: 'none', border: 'none',
                  cursor: 'pointer', padding: 0,
                  textDecoration: 'underline', textUnderlineOffset: '2px',
                }}
                onClick={() => setShowUpgrade(true)}
              >
                Upgrade
              </button>
            )}

            {config.addon && (
              <>
                {targetPlan && (
                  <span style={{ fontFamily: F.body, fontSize: '12px', color: C.amberDim }}>·</span>
                )}
                <button
                  style={{
                    ...flex.row,
                    gap: S[1],
                    fontFamily: F.body, fontSize: '12px', fontWeight: 600,
                    color: C.amber, background: 'none', border: 'none',
                    cursor: 'pointer', padding: 0,
                    textDecoration: 'underline', textUnderlineOffset: '2px',
                  }}
                  onClick={() => toast.info(`Add-on "${config.addon.label}" — opening billing... (mock)`)}
                >
                  <Plus size={12} />
                  {config.addon.label}
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Upgrade modal */}
      {showUpgrade && targetPlan && (
        <UpgradeModal
          fromPlan={resolvedPlanId}
          toPlan={targetPlan.id}
          featureUnlocked={null}
          onClose={() => setShowUpgrade(false)}
        />
      )}
    </>
  );
}
