import { useState } from 'react';
import { C, F, R, S, btn } from '../../tokens';
import ApprovalChainBadge from '../approvals/ApprovalChainBadge';

const BUDGET_DUAL_THRESHOLD = 500;
const STATUS_COLOR = {
  pending:  { bg: 'rgba(245,200,66,0.12)', color: C.amber, label: 'Pending' },
  approved: { bg: 'rgba(61,220,132,0.12)', color: C.primary, label: 'Approved' },
  declined: { bg: 'rgba(255,110,122,0.12)', color: C.red, label: 'Declined' },
};

function StatusChip({ status }) {
  const st = STATUS_COLOR[status] ?? STATUS_COLOR.pending;
  return (
    <span style={{
      fontFamily: F.mono, fontSize: '10px', fontWeight: 700,
      color: st.color, backgroundColor: st.bg, border: `1px solid ${st.color}40`,
      borderRadius: R.pill, padding: '2px 8px', whiteSpace: 'nowrap',
    }}>
      {st.label}
    </span>
  );
}

/**
 * Inline approval for an ARIA action (e.g. update_campaign).
 * If budget impact > $500 → dual-track (Strategy + Budget); else single Approve/Decline.
 * Optional "I'm approving as budget owner" checkbox for single-track.
 */
export default function ARIAActionApproval({
  action,
  onStrategyApprove,
  onBudgetApprove,
  onDecline,
  onExecute,
}) {
  const [strategyStatus, setStrategyStatus] = useState(action?.strategyApprovalStatus ?? 'pending');
  const [budgetStatus, setBudgetStatus] = useState(action?.budgetApprovalStatus ?? 'pending');
  const [approveAsBudgetOwner, setApproveAsBudgetOwner] = useState(false);
  const [singleDone, setSingleDone] = useState(false);

  const budgetAmount = Number(
    action?.payload?.budget ?? action?.payload?.monthly_budget ?? action?.budgetAmount ?? 0
  );
  const dualTrack = budgetAmount > BUDGET_DUAL_THRESHOLD;
  const bothApproved = strategyStatus === 'approved' && budgetStatus === 'approved';
  const anyDeclined = strategyStatus === 'declined' || budgetStatus === 'declined';

  const handleStrategyApprove = () => {
    setStrategyStatus('approved');
    onStrategyApprove?.(action);
  };

  const handleBudgetApprove = () => {
    setBudgetStatus('approved');
    onBudgetApprove?.(action);
  };

  const handleDecline = (track) => {
    if (track === 'strategy') setStrategyStatus('declined');
    if (track === 'budget') setBudgetStatus('declined');
    if (!dualTrack) onDecline?.(action);
  };

  const handleExecute = () => {
    if (dualTrack && !bothApproved) return;
    onExecute?.(action);
  };

  const actionDescription = action?.description ?? `Increase daily budget by 20% for top-performing ad sets. Budget impact: $${budgetAmount.toLocaleString()}.`;

  if (anyDeclined) {
    return (
      <div style={{ marginTop: '8px', fontFamily: F.body, fontSize: '12px', color: C.red }}>
        Action declined
      </div>
    );
  }

  if (dualTrack) {
    return (
      <div style={{
        marginTop: '10px',
        padding: S[3],
        backgroundColor: C.bg,
        borderRadius: R.md,
        border: `1px solid ${C.border}`,
      }}>
        <div style={{ fontFamily: F.mono, fontSize: '10px', fontWeight: 700, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: S[2] }}>
          Dual approval required (budget &gt; $500)
        </div>
        <div style={{ fontFamily: F.body, fontSize: '12px', color: C.textSecondary, marginBottom: S[3] }}>{actionDescription}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: S[2], marginBottom: S[3] }}>
          <ApprovalChainBadge strategyStatus={strategyStatus} budgetStatus={budgetStatus} />
          <span style={{ fontFamily: F.mono, fontSize: '11px', color: C.primary }}>${budgetAmount.toLocaleString()}</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: S[3] }}>
          <div>
            <div style={{ fontFamily: F.mono, fontSize: '9px', color: C.textMuted, marginBottom: '2px' }}>Strategy</div>
            <StatusChip status={strategyStatus} />
            {strategyStatus === 'pending' && (
              <div style={{ display: 'flex', gap: S[1], marginTop: S[2] }}>
                <button style={{ ...btn.secondary, fontSize: '10px', padding: '4px 8px', color: C.red }} onClick={() => handleDecline('strategy')}>Decline</button>
                <button style={{ ...btn.primary, fontSize: '10px', padding: '4px 8px' }} onClick={handleStrategyApprove}>Approve</button>
              </div>
            )}
          </div>
          <div>
            <div style={{ fontFamily: F.mono, fontSize: '9px', color: C.textMuted, marginBottom: '2px' }}>Budget (CFO)</div>
            <StatusChip status={budgetStatus} />
            {budgetStatus === 'pending' && (
              <div style={{ display: 'flex', gap: S[1], marginTop: S[2] }}>
                <button style={{ ...btn.secondary, fontSize: '10px', padding: '4px 8px', color: C.red }} onClick={() => handleDecline('budget')}>Decline</button>
                <button style={{ ...btn.primary, fontSize: '10px', padding: '4px 8px' }} onClick={handleBudgetApprove}>Approve</button>
              </div>
            )}
          </div>
        </div>
        {bothApproved && (
          <div style={{ marginTop: S[3], display: 'flex', justifyContent: 'flex-end' }}>
            <button style={{ ...btn.primary, fontSize: '11px' }} onClick={handleExecute}>Execute now</button>
          </div>
        )}
      </div>
    );
  }

  /* Single-track */
  if (singleDone) {
    return (
      <div style={{ marginTop: '8px', fontFamily: F.body, fontSize: '12px', color: C.primary, display: 'flex', alignItems: 'center', gap: '6px' }}>
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 7l4 4 6-6" stroke={C.primary} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
        Action confirmed
      </div>
    );
  }

  return (
    <div style={{ marginTop: '10px' }}>
      {budgetAmount > 0 && (
        <label style={{ display: 'flex', alignItems: 'center', gap: S[2], marginBottom: S[2], cursor: 'pointer', fontFamily: F.body, fontSize: '11px', color: C.textSecondary }}>
          <input
            type="checkbox"
            checked={approveAsBudgetOwner}
            onChange={(e) => setApproveAsBudgetOwner(e.target.checked)}
            style={{ accentColor: C.primary }}
          />
          I'm approving as budget owner
        </label>
      )}
      <div style={{ display: 'flex', gap: '8px' }}>
        <button
          style={{ flex: 1, ...btn.primary, fontSize: '12px' }}
          onClick={() => { setSingleDone(true); onStrategyApprove?.(action); onExecute?.(action); }}
        >
          Approve
        </button>
        <button
          style={{ flex: 1, ...btn.secondary, fontSize: '12px', color: C.red, borderColor: `${C.red}40` }}
          onClick={() => { setSingleDone(true); onDecline?.(action); }}
        >
          Decline
        </button>
      </div>
    </div>
  );
}
