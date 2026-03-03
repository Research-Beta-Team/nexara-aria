import { AlertCircle, CreditCard, Calendar } from 'lucide-react';
import { C, F, R, S, btn } from '../../tokens';

const kindStyles = {
  '30d': {
    bg: C.surface3,
    border: C.border,
    accent: C.textMuted,
    icon: Calendar,
  },
  '7d': {
    bg: 'rgba(245,200,66,0.08)',
    border: 'rgba(245,200,66,0.3)',
    accent: C.amber,
    icon: AlertCircle,
  },
  overdue: {
    bg: 'rgba(255,110,122,0.08)',
    border: 'rgba(255,110,122,0.3)',
    accent: C.red,
    icon: AlertCircle,
  },
  failed: {
    bg: 'rgba(255,110,122,0.12)',
    border: C.red,
    accent: C.red,
    icon: CreditCard,
  },
};

/**
 * PlanExpiryWarning — renewal / payment alerts.
 * Variants: 30d (muted), 7d (amber), overdue, failed.
 * Use compact for TopBar.
 */
export default function PlanExpiryWarning({
  kind = '30d',
  renewDate,
  amount,
  cardLast4,
  daysLeft,
  onReviewPlan,
  onUpdatePayment,
  compact = false,
}) {
  const style = kindStyles[kind] ?? kindStyles['30d'];
  const Icon = style.icon;

  const wrap = {
    backgroundColor: style.bg,
    border: `1px solid ${style.border}`,
    borderRadius: R.card,
    padding: compact ? `${S[2]} ${S[3]}` : S[4],
    display: 'flex',
    alignItems: 'center',
    gap: S[3],
    flexWrap: 'wrap',
  };

  const msg = {
    '30d': renewDate
      ? `Your plan renews in ${daysLeft} days (${new Date(renewDate).toLocaleDateString()}).`
      : 'Your plan will renew at the end of the billing period.',
    '7d': `Your plan renews in ${daysLeft} day${daysLeft === 1 ? '' : 's'}.${amount ? ` $${amount} will be charged.` : ''}`,
    overdue: 'Your plan renewal is overdue. Update payment to avoid interruption.',
    failed: 'Payment failed. Update your payment method to restore access.',
  };

  const text = msg[kind] ?? msg['30d'];

  if (compact) {
    return (
      <div style={wrap}>
        <Icon size={14} color={style.accent} style={{ flexShrink: 0 }} />
        <span style={{ fontFamily: F.body, fontSize: '12px', color: C.textPrimary, flex: 1 }}>
          {text}
        </span>
        {onReviewPlan && (
          <button
            style={{ ...btn.ghost, fontSize: '12px', padding: `${S[1]} ${S[2]}` }}
            onClick={onReviewPlan}
          >
            Review
          </button>
        )}
        {onUpdatePayment && (kind === 'failed' || kind === 'overdue') && (
          <button
            style={{ ...btn.primary, fontSize: '12px', padding: `${S[1]} ${S[3]}` }}
            onClick={onUpdatePayment}
          >
            Update payment
          </button>
        )}
      </div>
    );
  }

  return (
    <div style={wrap}>
      <div style={{
        width: 40, height: 40, borderRadius: R.full,
        backgroundColor: `${style.accent}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
      }}>
        <Icon size={20} color={style.accent} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: F.body, fontSize: '14px', fontWeight: 600, color: C.textPrimary }}>
          {kind === '30d' && 'Renewal coming up'}
          {kind === '7d' && 'Renewal in 7 days'}
          {kind === 'overdue' && 'Renewal overdue'}
          {kind === 'failed' && 'Payment failed'}
        </div>
        <div style={{ fontFamily: F.body, fontSize: '13px', color: C.textSecondary, marginTop: '2px' }}>
          {text}
          {cardLast4 && (kind === '7d' || kind === 'failed') && (
            <span style={{ fontFamily: F.mono, marginLeft: S[1] }}> · Card ****{cardLast4}</span>
          )}
        </div>
      </div>
      <div style={{ display: 'flex', gap: S[2], flexShrink: 0 }}>
        {onReviewPlan && (
          <button style={{ ...btn.secondary, fontSize: '13px' }} onClick={onReviewPlan}>
            Review plan
          </button>
        )}
        {onUpdatePayment && (kind === 'failed' || kind === 'overdue') && (
          <button style={{ ...btn.primary, fontSize: '13px' }} onClick={onUpdatePayment}>
            Update payment
          </button>
        )}
      </div>
    </div>
  );
}
