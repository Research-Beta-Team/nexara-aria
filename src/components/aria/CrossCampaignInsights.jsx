import { C, F, R, S } from '../../tokens';

export default function CrossCampaignInsights({ benchmarks = [] }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: S[4] }}>
      <h3 style={{ fontFamily: F.display, fontSize: '16px', fontWeight: 700, color: C.textPrimary, margin: 0 }}>
        Your performance vs benchmarks
      </h3>
      <div style={{ border: `1px solid ${C.border}`, borderRadius: R.card, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: F.body, fontSize: '13px' }}>
          <thead>
            <tr style={{ borderBottom: `2px solid ${C.border}`, backgroundColor: C.surface2 }}>
              <th style={{ textAlign: 'left', padding: S[3], color: C.textMuted, fontWeight: 600 }}>Metric</th>
              <th style={{ textAlign: 'right', padding: S[3], color: C.textMuted, fontWeight: 600 }}>You</th>
              <th style={{ textAlign: 'right', padding: S[3], color: C.textMuted, fontWeight: 600 }}>Industry avg</th>
              <th style={{ textAlign: 'left', padding: S[3], color: C.textMuted, fontWeight: 600 }}>Difference</th>
            </tr>
          </thead>
          <tbody>
            {benchmarks.map((row) => {
              const youVal = row.your;
              const indVal = row.industryAvg;
              const isPercent = row.unit === '%';
              const youWin = row.youWin;
              let diffText;
              if (isPercent) {
                const pp = (youVal - indVal).toFixed(1);
                diffText = `${Number(pp) >= 0 ? '+' : ''}${pp}%`;
              } else {
                const pct = indVal > 0 ? (((indVal - youVal) / indVal) * 100).toFixed(0) : '—';
                diffText = youWin ? `${pct}% lower` : `${Math.abs(Number(pct))}% higher`;
              }
              return (
                <tr
                  key={row.metric}
                  style={{
                    borderBottom: `1px solid ${C.border}`,
                    backgroundColor: youWin ? 'rgba(61,220,132,0.08)' : 'rgba(245,200,66,0.08)',
                  }}
                >
                  <td style={{ padding: S[3], color: C.textPrimary, fontWeight: 500 }}>{row.metric}</td>
                  <td style={{ padding: S[3], textAlign: 'right', fontFamily: F.mono, color: C.textPrimary }}>{row.unit === '$' ? `$${youVal}` : `${youVal}%`}</td>
                  <td style={{ padding: S[3], textAlign: 'right', fontFamily: F.mono, color: C.textSecondary }}>{row.unit === '$' ? `$${indVal}` : `${indVal}%`}</td>
                  <td style={{ padding: S[3], color: youWin ? C.primary : C.amber, fontWeight: 600 }}>
                    {youWin ? `+${diffText}` : diffText}
                    {row.ariaRecommendation && (
                      <div style={{ fontFamily: F.body, fontSize: '11px', fontWeight: 400, color: C.textSecondary, marginTop: 4 }}>
                        ARIA: {row.ariaRecommendation}
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
