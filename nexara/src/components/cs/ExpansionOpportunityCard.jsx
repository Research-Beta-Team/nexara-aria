import { C, F, R, S, btn } from '../../tokens';

function formatMrr(mrr) {
  if (mrr >= 1000) return `$${(mrr / 1000).toFixed(1)}K`;
  return `$${mrr}`;
}

export default function ExpansionOpportunityCard({ customer, toast }) {
  if (!customer) return null;
  const { name, mrr, plan, expansionSignals = [] } = customer;
  const expansionPotential = mrr * 1.5; // example
  const recommendation = plan === 'Starter'
    ? `Suggest upgrading to Growth plan — saves $200/mo vs current usage.`
    : `Suggest upgrading to Scale plan — saves $200/mo vs current.`;

  return (
    <div
      style={{
        backgroundColor: C.surface,
        border: `1px solid ${C.border}`,
        borderLeft: `4px solid ${C.secondary}`,
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
          <div style={{ fontFamily: F.body, fontSize: '13px', color: C.textSecondary }}>
            Current MRR: <strong style={{ color: C.primary }}>{formatMrr(mrr)}</strong>
            {' · '}
            Expansion potential: <strong style={{ color: C.secondary }}>{formatMrr(expansionPotential)}</strong>
          </div>
        </div>
      </div>
      {expansionSignals.length > 0 && (
        <div style={{ marginBottom: S[4] }}>
          <div style={{ fontFamily: F.mono, fontSize: '10px', color: C.textMuted, textTransform: 'uppercase', marginBottom: S[2] }}>
            Signals
          </div>
          <ul style={{ margin: 0, paddingLeft: S[5], fontFamily: F.body, fontSize: '13px', color: C.textSecondary, lineHeight: 1.8 }}>
            {expansionSignals.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
        </div>
      )}
      <div
        style={{
          padding: S[4],
          backgroundColor: 'rgba(94,234,212,0.08)',
          border: `1px solid rgba(94,234,212,0.2)`,
          borderLeft: `3px solid ${C.secondary}`,
          borderRadius: R.sm,
          marginBottom: S[4],
        }}
      >
        <div style={{ fontFamily: F.mono, fontSize: '10px', color: C.secondary, textTransform: 'uppercase', marginBottom: S[2] }}>
          ARIA upsell recommendation
        </div>
        <p style={{ fontFamily: F.body, fontSize: '13px', color: C.textPrimary, margin: 0 }}>
          {recommendation}
        </p>
      </div>
      <button
        style={{ ...btn.primary, fontSize: '13px' }}
        onClick={() => toast?.info('ARIA is generating your expansion proposal…')}
      >
        Generate expansion proposal
      </button>
    </div>
  );
}
