import { useMemo, useState } from 'react';
import useStore from '../../store/useStore';
import useToast from '../../hooks/useToast';
import { PLANS, PLAN_ORDER, planHasFeature, planHasAgent, getPlanLimit } from '../../config/plans';
import DowngradeImpactCard from './DowngradeImpactCard';
import { C, F, R, S, btn } from '../../tokens';

function getDowngradeImpact(fromPlanId, toPlanId, usage) {
  const fromPlan = PLANS[fromPlanId];
  const toPlan = PLANS[toPlanId];
  if (!fromPlan || !toPlan) return null;

  const campaignLimit = getPlanLimit(toPlanId, 'activeCampaigns');
  const campaignConflict =
    campaignLimit !== -1 && usage.activeCampaignsCount > campaignLimit
      ? {
          current: usage.activeCampaignsCount,
          newLimit: campaignLimit,
          difference: usage.activeCampaignsCount - campaignLimit,
        }
      : null;

  const seatLimit = getPlanLimit(toPlanId, 'teamSeats');
  const seatConflict =
    seatLimit !== -1 && usage.seatsUsed > seatLimit
      ? {
          current: usage.seatsUsed,
          newLimit: seatLimit,
          difference: usage.seatsUsed - seatLimit,
        }
      : null;

  const workspaceLimit = getPlanLimit(toPlanId, 'workspaces');
  const workspaceConflict =
    workspaceLimit !== -1 && usage.workspacesUsed > workspaceLimit
      ? {
          current: usage.workspacesUsed,
          newLimit: workspaceLimit,
          difference: usage.workspacesUsed - workspaceLimit,
        }
      : null;

  const fromFeatures = fromPlan.features ?? {};
  const toFeatures = toPlan.features ?? {};
  const featureLoss = Object.keys(fromFeatures).filter(
    (k) => fromFeatures[k] && !toFeatures[k]
  );

  const fromAvailable =
    fromPlan.agents?.available === 'all'
      ? []
      : Array.isArray(fromPlan.agents?.available)
        ? fromPlan.agents.available
        : [];
  const agentDeactivation = fromAvailable.filter(
    (id) => !planHasAgent(toPlanId, id)
  );

  const addonConflict = usage.addonsActive ?? [];

  const creditReduction = {
    from: fromPlan.credits?.included ?? 0,
    to: toPlan.credits?.included ?? 0,
  };

  const dataLoss = {};
  if (featureLoss.includes('abmEngine')) dataLoss.abmAccounts = 50;
  if (featureLoss.includes('intentSignals')) dataLoss.intentDataStops = true;

  return {
    campaignConflict,
    seatConflict,
    workspaceConflict,
    featureLoss,
    agentDeactivation,
    addonConflict,
    creditReduction,
    dataLoss: Object.keys(dataLoss).length ? dataLoss : null,
  };
}

function getChecklistItems(impact) {
  const items = [];
  if (impact.campaignConflict)
    items.push({
      key: 'campaigns',
      label: `I understand ${impact.campaignConflict.difference} campaigns will be paused`,
    });
  if (impact.seatConflict)
    items.push({
      key: 'seats',
      label: `I understand ${impact.seatConflict.difference} team members will lose access`,
    });
  if (impact.agentDeactivation?.length)
    items.push({
      key: 'agents',
      label: `I understand ${impact.agentDeactivation.length} agents will be deactivated`,
    });
  if (impact.creditReduction?.to != null)
    items.push({
      key: 'credits',
      label: `I understand my credit limit will drop to ${impact.creditReduction.to >= 1000 ? `${impact.creditReduction.to / 1000}K` : impact.creditReduction.to}/month`,
    });
  return items;
}

export default function DowngradeFlow({ fromPlanId, toPlanId, onCancel, onConfirmSchedule }) {
  const toast = useToast();
  const planRenewsAt = useStore((s) => s.planRenewsAt);
  const activeCampaignsCount = useStore((s) => s.activeCampaignsCount);
  const seatsUsed = useStore((s) => s.seatsUsed);
  const workspacesUsed = useStore((s) => s.workspacesUsed);
  const addonsActive = useStore((s) => s.addonsActive);
  const creditsIncluded = useStore((s) => s.creditsIncluded);
  const rolloverBalance = useStore((s) => s.rolloverBalance);

  const [screen, setScreen] = useState('impact');
  const [checklist, setChecklist] = useState({});

  const usage = useMemo(
    () => ({
      activeCampaignsCount,
      seatsUsed,
      workspacesUsed,
      addonsActive,
      creditsIncluded,
      rolloverBalance,
    }),
    [activeCampaignsCount, seatsUsed, workspacesUsed, addonsActive, creditsIncluded, rolloverBalance]
  );

  const impact = useMemo(
    () => getDowngradeImpact(fromPlanId, toPlanId, usage),
    [fromPlanId, toPlanId, usage]
  );

  const checklistItems = useMemo(() => (impact ? getChecklistItems(impact) : []), [impact]);
  const allChecked = checklistItems.length > 0 && checklistItems.every((item) => checklist[item.key]);

  const fromPlan = PLANS[fromPlanId];
  const toPlan = PLANS[toPlanId];
  const newPlanDisplayName = toPlan?.displayName ?? toPlanId;
  const downgradeDate = planRenewsAt
    ? new Date(planRenewsAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : 'end of billing period';

  const handleConfirmDowngrade = () => {
    toast.success(`Downgrade scheduled for ${downgradeDate} · You have full access until then`);
    onConfirmSchedule?.();
  };

  const toggleCheck = (key) => {
    setChecklist((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  if (!impact || !fromPlan || !toPlan) return null;

  const paddingStyle = { padding: S[8] };

  if (screen === 'impact') {
    return (
      <div style={paddingStyle}>
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: S[3],
            marginBottom: S[6],
            paddingLeft: S[4],
            borderLeft: `4px solid ${C.amber}`,
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, color: C.amber }}>
            <path d="M12 2L2 22h20L12 2z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
            <path d="M12 9v4M12 17h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <div>
            <h2 style={{ fontFamily: F.display, fontSize: 22, fontWeight: 800, color: C.textPrimary, margin: 0 }}>
              Before you downgrade...
            </h2>
            <p style={{ fontFamily: F.body, fontSize: 14, color: C.textSecondary, marginTop: S[1] }}>
              Review the impact below. Your plan will change at the end of your billing period.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: S[4], marginBottom: S[6] }}>
          {impact.campaignConflict && (
            <DowngradeImpactCard
              variant="campaigns"
              data={impact.campaignConflict}
              newPlanDisplayName={newPlanDisplayName}
              linkLabel="Select campaigns to keep →"
              onLinkClick={() => toast.info('Go to Campaigns to choose which to keep active.')}
            />
          )}
          {impact.seatConflict && (
            <DowngradeImpactCard
              variant="seats"
              data={impact.seatConflict}
              newPlanDisplayName={newPlanDisplayName}
              linkLabel="Review team access →"
              onLinkClick={() => toast.info('Go to Team settings to review access.')}
            />
          )}
          {impact.featureLoss?.length > 0 && (
            <DowngradeImpactCard variant="features" data={impact.featureLoss} />
          )}
          {impact.agentDeactivation?.length > 0 && (
            <DowngradeImpactCard variant="agents" data={impact.agentDeactivation} />
          )}
          <DowngradeImpactCard
            variant="credits"
            data={impact.creditReduction}
            rolloverBalance={rolloverBalance}
          />
          {impact.addonConflict?.length > 0 && (
            <DowngradeImpactCard variant="addons" data={impact.addonConflict} />
          )}
          {impact.dataLoss && (
            <DowngradeImpactCard variant="dataLoss" data={impact.dataLoss} />
          )}
        </div>

        <div
          style={{
            padding: S[4],
            borderRadius: R.md,
            backgroundColor: C.surface2,
            border: `1px solid ${C.border}`,
            marginBottom: S[6],
          }}
        >
          <div style={{ fontFamily: F.mono, fontSize: 11, color: C.textMuted, marginBottom: S[1] }}>
            DOWNGRADE DATE
          </div>
          <div style={{ fontFamily: F.body, fontSize: 14, color: C.textPrimary }}>
            Your plan will downgrade at end of current billing period: {downgradeDate}
          </div>
          <div style={{ fontFamily: F.body, fontSize: 13, color: C.textSecondary, marginTop: S[1] }}>
            You&apos;ll continue to have full access until then.
          </div>
        </div>

        <div style={{ marginBottom: S[6] }}>
          <div style={{ fontFamily: F.body, fontSize: 13, color: C.textSecondary, marginBottom: S[2] }}>
            Instead of downgrading, consider:
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: S[2] }}>
            <button
              type="button"
              style={btn.secondary}
              onClick={() => toast.info('You can pause campaigns from the Campaigns page.')}
            >
              Pause inactive campaigns
            </button>
            <button
              type="button"
              style={btn.secondary}
              onClick={() => toast.info('Manage team seats in Team & Workspace settings.')}
            >
              Remove unused seats
            </button>
            <button
              type="button"
              style={btn.secondary}
              onClick={() => toast.info('Contact sales for custom pricing.')}
            >
              Talk to us about pricing
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', gap: S[4], flexWrap: 'wrap' }}>
          <button type="button" style={btn.primary} onClick={onCancel}>
            Cancel — Keep {fromPlan.displayName}
          </button>
          <button
            type="button"
            style={{
              ...btn.secondary,
              borderColor: C.amber,
              color: C.amber,
            }}
            onClick={() => setScreen('confirm')}
          >
            I understand — Schedule downgrade →
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={paddingStyle}>
      <h2 style={{ fontFamily: F.display, fontSize: 22, fontWeight: 800, color: C.textPrimary, margin: 0, marginBottom: S[2] }}>
        Schedule Downgrade Confirmation
      </h2>
      <p style={{ fontFamily: F.body, fontSize: 14, color: C.textSecondary, marginBottom: S[6] }}>
        Your plan will downgrade from {fromPlan.name} to {toPlan.name} on {downgradeDate}.
      </p>
      <p style={{ fontFamily: F.body, fontSize: 13, color: C.textMuted, marginBottom: S[6] }}>
        Until then, you have full {fromPlan.name} access.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: S[3], marginBottom: S[6] }}>
        {checklistItems.map((item) => (
          <label
            key={item.key}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: S[3],
              fontFamily: F.body,
              fontSize: 14,
              color: C.textPrimary,
              cursor: 'pointer',
            }}
          >
            <input
              type="checkbox"
              checked={!!checklist[item.key]}
              onChange={() => toggleCheck(item.key)}
              style={{ width: 18, height: 18, accentColor: C.primary }}
            />
            {item.label}
          </label>
        ))}
      </div>

      <button
        type="button"
        disabled={!allChecked}
        onClick={handleConfirmDowngrade}
        style={{
          ...btn.danger,
          width: '100%',
          opacity: allChecked ? 1 : 0.5,
          cursor: allChecked ? 'pointer' : 'not-allowed',
        }}
      >
        Confirm Downgrade
      </button>
      <p style={{ fontFamily: F.body, fontSize: 12, color: C.textMuted, marginTop: S[4], textAlign: 'center' }}>
        You can reverse this anytime before {downgradeDate}.
      </p>
    </div>
  );
}
