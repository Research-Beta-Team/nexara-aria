import { C, F, R, S, btn } from '../../tokens';
import { IconWarning } from '../ui/Icons';

function formatMrr(mrr) {
  if (mrr >= 1000) return `$${(mrr / 1000).toFixed(1)}K`;
  return `$${mrr}`;
}

const SAVE_PLAYBOOK = [
  'Schedule discovery call with new champion within 48 hours.',
  'Send re-engagement email with value recap and offer to simplify setup.',
  'If no response in 5 days, escalate to CSM for executive outreach.',
];

export default function ChurnRiskCard({ customer, toast }) {
  if (!customer) return null;
  const { name, mrr, renewalDate, churnRisk = {}, nextAction } = customer;
  const { reasons = [], daysToRenewal } = churnRisk;

  return (
    <div
      style={{
        backgroundColor: C.surface,
        border: `1px solid ${C.border}`,
        borderLeft: `4px solid ${C.red}`,
        borderRadius: R.card,
        padding: S[6],
        marginBottom: S[4],
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: S[4], marginBottom: S[4] }}>
        <div>
          <h3 style={{ fontFamily: F.display, fontSize: '18px', fontWeight: 700, color: C.textPrimary, margin: '0 0 4px' }}>
            {name}
          </h3>
          <div style={{ fontFamily: F.mono, fontSize: '14px', color: C.red }}>
            {formatMrr(mrr)} MRR at risk
          </div>
        </div>
        <div style={{ fontFamily: F.body, fontSize: '13px', color: C.textSecondary }}>
          Renewal in <strong style={{ color: C.textPrimary }}>{daysToRenewal}</strong> days · {renewalDate}
        </div>
      </div>
      <div style={{ marginBottom: S[4] }}>
        <div style={{ fontFamily: F.mono, fontSize: '10px', color: C.textMuted, textTransform: 'uppercase', marginBottom: S[2] }}>
          Churn signals
        </div>
        <ul style={{ margin: 0, paddingLeft: S[5], fontFamily: F.body, fontSize: '13px', color: C.textSecondary, lineHeight: 1.8 }}>
          {reasons.map((r, i) => (
            <li key={i} style={{ display: 'flex', alignItems: 'center', gap: S[2] }}>
              <IconWarning color={C.red} width={14} height={14} /> {r}
            </li>
          ))}
        </ul>
      </div>
      <div
        style={{
          padding: S[4],
          backgroundColor: 'rgba(61,220,132,0.08)',
          border: `1px solid rgba(61,220,132,0.2)`,
          borderLeft: `3px solid ${C.primary}`,
          borderRadius: R.sm,
          marginBottom: S[4],
        }}
      >
        <div style={{ fontFamily: F.mono, fontSize: '10px', color: C.primary, textTransform: 'uppercase', marginBottom: S[2] }}>
          ARIA save playbook
        </div>
        <ol style={{ margin: 0, paddingLeft: S[5], fontFamily: F.body, fontSize: '13px', color: C.textPrimary, lineHeight: 1.7 }}>
          {SAVE_PLAYBOOK.map((step, i) => (
            <li key={i}>{step}</li>
          ))}
        </ol>
      </div>
      <div style={{ display: 'flex', gap: S[2], flexWrap: 'wrap' }}>
        <button style={{ ...btn.primary, fontSize: '13px' }} onClick={() => toast?.info('Scheduling call…')}>
          Schedule call
        </button>
        <button style={{ ...btn.secondary, fontSize: '13px' }} onClick={() => toast?.success('Re-engagement email sent')}>
          Send re-engagement email
        </button>
        <button style={{ ...btn.ghost, fontSize: '13px' }} onClick={() => toast?.info('Escalating to CSM')}>
          Escalate to CSM
        </button>
      </div>
    </div>
  );
}
