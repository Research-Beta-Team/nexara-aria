import { C, F, R, S } from '../../tokens';

function formatCurrency(value) {
  if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
  return `$${value}`;
}

export default function PipelineStats({ stats }) {
  const {
    totalPipeline = 0,
    weightedPipeline = 0,
    dealsAtRisk = 0,
    avgDealSize = 0,
    winRate = 0,
  } = stats || {};

  const cards = [
    { label: 'Total Pipeline', value: formatCurrency(totalPipeline) },
    { label: 'Weighted Pipeline', value: formatCurrency(Math.round(weightedPipeline)) },
    { label: 'Deals at Risk', value: dealsAtRisk },
    { label: 'Avg Deal Size', value: formatCurrency(avgDealSize) },
    { label: 'Win Rate', value: `${winRate}%` },
  ];

  return (
    <div style={{ display: 'flex', gap: S[4], flexWrap: 'wrap' }}>
      {cards.map((c) => (
        <div
          key={c.label}
          style={{
            flex: '1 1 140px',
            minWidth: 0,
            padding: S[4],
            backgroundColor: C.surface,
            border: `1px solid ${C.border}`,
            borderRadius: R.card,
          }}
        >
          <div style={{ fontFamily: F.mono, fontSize: '20px', fontWeight: 700, color: C.textPrimary, lineHeight: 1 }}>
            {c.value}
          </div>
          <div style={{ fontFamily: F.body, fontSize: '11px', color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: 4 }}>
            {c.label}
          </div>
        </div>
      ))}
    </div>
  );
}
