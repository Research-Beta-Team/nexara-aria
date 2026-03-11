import { useState } from 'react';
import { C, F, R, S, T, btn, shadows } from '../../tokens';
import ApprovalChainBadge from './ApprovalChainBadge';

const SEV_COLORS = {
  High:   { color: '#EF4444', bg: 'rgba(239,68,68,0.12)',   border: 'rgba(239,68,68,0.25)' },
  Medium: { color: C.amber,  bg: 'rgba(245,200,66,0.12)',   border: 'rgba(245,200,66,0.25)' },
  Low:    { color: C.primary, bg: 'rgba(61,220,132,0.10)',  border: 'rgba(61,220,132,0.25)' },
};

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
 * Full-width dual-track approval card.
 * Strategy track (left): CRO/CMO → Business Manager → Marketing Manager.
 * Budget track (right): CFO.
 * Execute Now only when both approved.
 */
export default function DualApprovalCard({
  escalation,
  onStrategyApprove,
  onBudgetApprove,
  onDecline,
  onExecute,
  selected,
  onSelect,
  resolved,
  readOnly,
}) {
  const [executing, setExecuting] = useState(false);

  const sev = SEV_COLORS[escalation.severity] ?? SEV_COLORS.Medium;
  const strategyStatus = escalation.strategyApprovalStatus ?? 'pending';
  const budgetStatus = escalation.budgetApprovalStatus ?? 'pending';
  const bothApproved = strategyStatus === 'approved' && budgetStatus === 'approved';
  const anyDeclined = strategyStatus === 'declined' || budgetStatus === 'declined';
  const ctx = escalation.budgetContext ?? {};
  const maxBar = Math.max(ctx.campaignBudget ?? 0, ctx.newTotal ?? ctx.changeAmount ?? 1);
  const currentPct = maxBar ? ((ctx.campaignBudget ?? 0) / maxBar) * 100 : 0;
  const newPct = maxBar && ctx.newTotal != null ? (ctx.newTotal / maxBar) * 100 : 100;

  const handleExecute = () => {
    if (!bothApproved || executing) return;
    setExecuting(true);
    onExecute?.(escalation.id);
    setExecuting(false);
  };

  const borderColor = selected ? C.borderHover : C.border;

  return (
    <div style={{
      backgroundColor: C.surface,
      border: `1px solid ${borderColor}`,
      borderRadius: R.card,
      overflow: 'hidden',
      boxShadow: selected ? shadows.cardHover : 'none',
      transition: T.base,
    }}>
      {/* Top row: severity, title, amount, badge */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: S[3], padding: `${S[4]} ${S[4]} ${S[2]}` }}>
        {onSelect && !readOnly && (
          <div
            style={{
              width: '16px', height: '16px', borderRadius: '4px', flexShrink: 0, marginTop: '2px',
              border: `1.5px solid ${selected ? C.primary : C.border}`,
              backgroundColor: selected ? C.primary : 'transparent',
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
            onClick={(e) => { e.stopPropagation(); onSelect(escalation.id); }}
          >
            {selected && (
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <path d="M2 5l2.5 2.5 3.5-4" stroke={C.bg} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
          </div>
        )}
        <span style={{
          fontFamily: F.mono, fontSize: '10px', fontWeight: 700,
          color: sev.color, backgroundColor: sev.bg, border: `1px solid ${sev.border}`,
          borderRadius: R.pill, padding: '1px 8px', whiteSpace: 'nowrap', flexShrink: 0,
        }}>
          {escalation.severity.toUpperCase()}
        </span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: F.body, fontSize: '14px', fontWeight: 700, color: C.textPrimary, lineHeight: '1.3' }}>
            {escalation.title}
          </div>
          <div style={{ fontFamily: F.body, fontSize: '12px', color: C.textMuted, marginTop: '3px' }}>
            {escalation.agentType} · {escalation.campaign} · {escalation.timing}
          </div>
        </div>
        <span style={{
          fontFamily: F.mono, fontSize: '12px', fontWeight: 700, color: C.primary,
          backgroundColor: 'rgba(61,220,132,0.12)', border: `1px solid rgba(61,220,132,0.3)`,
          borderRadius: R.pill, padding: '2px 10px', whiteSpace: 'nowrap',
        }}>
          ${(escalation.budgetAmount ?? 0).toLocaleString()}
        </span>
        <ApprovalChainBadge strategyStatus={strategyStatus} budgetStatus={budgetStatus} />
        <span style={{
          fontFamily: F.mono, fontSize: '9px', fontWeight: 700, color: C.textMuted,
          textTransform: 'uppercase', letterSpacing: '0.08em',
        }}>
          Dual Approval Required
        </span>
      </div>

      {/* Situation / recommendation summary */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: S[3], padding: `0 ${S[4]} ${S[3]}` }}>
        <div style={{ backgroundColor: C.surface2, borderRadius: R.md, padding: S[3] }}>
          <div style={{ fontFamily: F.mono, fontSize: '10px', fontWeight: 700, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: S[2] }}>Situation</div>
          <p style={{ fontFamily: F.body, fontSize: '12px', color: C.textSecondary, margin: 0, lineHeight: '1.6' }}>{escalation.situation}</p>
        </div>
        <div style={{ backgroundColor: `${sev.color}0A`, border: `1px solid ${sev.border}`, borderRadius: R.md, padding: S[3] }}>
          <div style={{ fontFamily: F.mono, fontSize: '10px', fontWeight: 700, color: sev.color, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: S[2] }}>Freya Recommendation</div>
          <p style={{ fontFamily: F.body, fontSize: '12px', color: C.textPrimary, margin: 0, lineHeight: '1.6', fontWeight: 500 }}>{escalation.recommendation}</p>
        </div>
      </div>

      {/* Two 50/50 tracks */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0, borderTop: `1px solid ${C.border}` }}>
        {/* Strategy track */}
        <div style={{ padding: S[4], borderRight: `1px solid ${C.border}` }}>
          <div style={{ fontFamily: F.mono, fontSize: '10px', fontWeight: 700, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: S[2] }}>Strategy</div>
          <div style={{ fontFamily: F.body, fontSize: '11px', color: C.textSecondary, marginBottom: S[2] }}>
            CRO/CMO → Business Manager → Marketing Manager
          </div>
          {escalation.strategyApprovedBy && (
            <div style={{ fontFamily: F.body, fontSize: '11px', color: C.primary, marginBottom: S[2] }}>
              Approved by {escalation.strategyApprovedBy.name} · {escalation.strategyApprovedBy.timestamp}
            </div>
          )}
          <StatusChip status={strategyStatus} />
          {(escalation.ariaRecommendation || escalation.recommendation) && (
            <div style={{ marginTop: S[3], padding: S[2], backgroundColor: C.bg, borderRadius: R.sm }}>
              <div style={{ fontFamily: F.mono, fontSize: '10px', color: C.textMuted, marginBottom: '4px' }}>Freya</div>
              <div style={{ fontFamily: F.body, fontSize: '11px', color: C.textSecondary, lineHeight: 1.4 }}>
                {escalation.ariaRecommendation ?? escalation.recommendation}
              </div>
            </div>
          )}
          {!resolved && !readOnly && strategyStatus === 'pending' && (
            <div style={{ display: 'flex', gap: S[2], marginTop: S[3] }}>
              <button style={{ ...btn.secondary, fontSize: '11px', color: C.red, borderColor: `${C.red}40` }} onClick={() => onDecline?.(escalation.id, 'strategy')}>Decline</button>
              <button style={{ ...btn.primary, fontSize: '11px' }} onClick={() => onStrategyApprove?.(escalation.id)}>Approve</button>
            </div>
          )}
        </div>

        {/* Budget track */}
        <div style={{ padding: S[4] }}>
          <div style={{ fontFamily: F.mono, fontSize: '10px', fontWeight: 700, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: S[2] }}>Budget</div>
          <div style={{ fontFamily: F.body, fontSize: '11px', color: C.textSecondary, marginBottom: S[2] }}>CFO</div>
          {escalation.budgetApprovedBy && (
            <div style={{ fontFamily: F.body, fontSize: '11px', color: C.primary, marginBottom: S[2] }}>
              Approved by {escalation.budgetApprovedBy.name} · {escalation.budgetApprovedBy.timestamp}
            </div>
          )}
          <StatusChip status={budgetStatus} />
          {(ctx.changeLabel || ctx.newTotal != null) && (
            <div style={{ marginTop: S[3] }}>
              <div style={{ fontFamily: F.body, fontSize: '11px', color: C.textSecondary, marginBottom: '4px' }}>{ctx.changeLabel ?? `New total: $${ctx.newTotal?.toLocaleString()}`}</div>
              <div style={{ height: '8px', backgroundColor: C.bg, borderRadius: R.sm, overflow: 'hidden', display: 'flex' }}>
                <div style={{ width: `${currentPct}%`, backgroundColor: C.border, transition: T.base }} />
                <div style={{ width: `${Math.min(100 - currentPct, newPct - currentPct)}%`, backgroundColor: C.primary, opacity: 0.7 }} />
              </div>
            </div>
          )}
          {!resolved && !readOnly && budgetStatus === 'pending' && (
            <div style={{ display: 'flex', gap: S[2], marginTop: S[3] }}>
              <button style={{ ...btn.secondary, fontSize: '11px', color: C.red, borderColor: `${C.red}40` }} onClick={() => onDecline?.(escalation.id, 'budget')}>Decline</button>
              <button style={{ ...btn.primary, fontSize: '11px' }} onClick={() => onBudgetApprove?.(escalation.id)}>Approve</button>
            </div>
          )}
        </div>
      </div>

      {/* Bottom: status + Execute Now — hidden when read-only */}
      {!resolved && !readOnly && (
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: S[3],
          padding: `${S[3]} ${S[4]}`, borderTop: `1px solid ${C.border}`, backgroundColor: C.surface2,
        }}>
          <div style={{ fontFamily: F.body, fontSize: '12px', color: C.textSecondary }}>
            {anyDeclined && 'Blocked — one or more tracks declined'}
            {!anyDeclined && bothApproved && 'Ready to execute'}
            {!anyDeclined && !bothApproved && `Waiting for ${strategyStatus !== 'approved' ? 'Strategy' : 'Budget'} approval`}
          </div>
          {bothApproved && (
            <button
              style={{ ...btn.primary, fontSize: '12px' }}
              onClick={handleExecute}
              disabled={executing}
            >
              Execute Now
            </button>
          )}
        </div>
      )}
    </div>
  );
}
