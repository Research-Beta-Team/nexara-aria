import { useMemo } from 'react';
import { C, F, R, S } from '../../tokens';

function formatCurrency(value) {
  if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
  return `$${value}`;
}

export default function CohortAnalysis({ cohorts = [], insight = '' }) {
  const sorted = useMemo(() => [...cohorts].sort((a, b) => (b.ltvCac || 0) - (a.ltvCac || 0)), [cohorts]);
  const bestLtvCac = sorted[0]?.ltvCac;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: S[4] }}>
      <h3 style={{ fontFamily: F.display, fontSize: '16px', fontWeight: 700, color: C.textPrimary, margin: 0 }}>
        Which ICP segments drive the best returns?
      </h3>
      <div style={{ border: `1px solid ${C.border}`, borderRadius: R.card, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: F.body, fontSize: '13px' }}>
          <thead>
            <tr style={{ borderBottom: `2px solid ${C.border}`, backgroundColor: C.surface2 }}>
              <th style={{ textAlign: 'left', padding: S[3], color: C.textMuted, fontWeight: 600 }}>Segment</th>
              <th style={{ textAlign: 'left', padding: S[3], color: C.textMuted, fontWeight: 600 }}>Deals</th>
              <th style={{ textAlign: 'left', padding: S[3], color: C.textMuted, fontWeight: 600 }}>Avg Deal Size</th>
              <th style={{ textAlign: 'left', padding: S[3], color: C.textMuted, fontWeight: 600 }}>Sales Cycle</th>
              <th style={{ textAlign: 'left', padding: S[3], color: C.textMuted, fontWeight: 600 }}>Win Rate</th>
              <th style={{ textAlign: 'left', padding: S[3], color: C.textMuted, fontWeight: 600 }}>CAC</th>
              <th style={{ textAlign: 'left', padding: S[3], color: C.textMuted, fontWeight: 600 }}>LTV:CAC</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((row) => {
              const isBest = row.ltvCac === bestLtvCac;
              return (
                <tr
                  key={row.segment}
                  style={{
                    borderBottom: `1px solid ${C.border}`,
                    backgroundColor: isBest ? 'rgba(61,220,132,0.08)' : undefined,
                  }}
                >
                  <td style={{ padding: S[3], color: C.textPrimary, fontWeight: isBest ? 600 : 400 }}>{row.segment}</td>
                  <td style={{ padding: S[3], color: C.textSecondary }}>{row.deals}</td>
                  <td style={{ padding: S[3], fontFamily: F.mono, color: C.primary }}>{formatCurrency(row.avgDealSize)}</td>
                  <td style={{ padding: S[3], color: C.textSecondary }}>{row.avgSalesCycle}d</td>
                  <td style={{ padding: S[3], color: C.textSecondary }}>{row.winRate}%</td>
                  <td style={{ padding: S[3], fontFamily: F.mono, color: C.textSecondary }}>{formatCurrency(row.cac)}</td>
                  <td style={{ padding: S[3], fontFamily: F.mono, fontWeight: 700, color: isBest ? C.primary : C.textPrimary }}>{row.ltvCac}×</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {insight && (
        <div
          style={{
            padding: S[4],
            backgroundColor: 'rgba(61,220,132,0.08)',
            border: `1px solid rgba(61,220,132,0.2)`,
            borderLeft: `3px solid ${C.primary}`,
            borderRadius: R.sm,
          }}
        >
          <div style={{ fontFamily: F.mono, fontSize: '10px', color: C.primary, textTransform: 'uppercase', marginBottom: S[2] }}>ARIA insight</div>
          <p style={{ fontFamily: F.body, fontSize: '13px', color: C.textPrimary, margin: 0, lineHeight: 1.5 }}>{insight}</p>
        </div>
      )}
    </div>
  );
}
