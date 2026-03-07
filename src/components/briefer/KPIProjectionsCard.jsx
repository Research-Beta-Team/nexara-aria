/**
 * MQLs, Pipeline, CAC, confidence %; expandable basis.
 */
import { useState } from 'react';
import { C, F, R, S } from '../../tokens';

export default function KPIProjectionsCard({ mqls = 0, pipeline = 0, cac = 0, confidencePct = 0, basis = '' }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div
      style={{
        padding: S[4],
        backgroundColor: C.surface,
        border: `1px solid ${C.border}`,
        borderRadius: R.card,
      }}
    >
      <div style={{ fontFamily: F.display, fontSize: '14px', fontWeight: 700, color: C.textPrimary, marginBottom: S[4] }}>
        KPI projections
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: S[4], marginBottom: S[3] }}>
        <div>
          <div style={{ fontFamily: F.body, fontSize: '11px', color: C.textMuted, textTransform: 'uppercase', marginBottom: S[1] }}>MQLs</div>
          <div style={{ fontFamily: F.mono, fontSize: '20px', fontWeight: 700, color: C.primary }}>{mqls}</div>
        </div>
        <div>
          <div style={{ fontFamily: F.body, fontSize: '11px', color: C.textMuted, textTransform: 'uppercase', marginBottom: S[1] }}>Pipeline</div>
          <div style={{ fontFamily: F.mono, fontSize: '20px', fontWeight: 700, color: C.textPrimary }}>
            ${(pipeline / 1000).toFixed(0)}K
          </div>
        </div>
        <div>
          <div style={{ fontFamily: F.body, fontSize: '11px', color: C.textMuted, textTransform: 'uppercase', marginBottom: S[1] }}>CAC</div>
          <div style={{ fontFamily: F.mono, fontSize: '20px', fontWeight: 700, color: C.textPrimary }}>${cac}</div>
        </div>
        <div>
          <div style={{ fontFamily: F.body, fontSize: '11px', color: C.textMuted, textTransform: 'uppercase', marginBottom: S[1] }}>Confidence</div>
          <div style={{ fontFamily: F.mono, fontSize: '20px', fontWeight: 700, color: C.primary }}>{confidencePct}%</div>
        </div>
      </div>
      {basis && (
        <>
          <button
            type="button"
            onClick={() => setExpanded((e) => !e)}
            style={{
              background: 'none',
              border: 'none',
              fontFamily: F.body,
              fontSize: '12px',
              color: C.secondary,
              cursor: 'pointer',
              padding: 0,
              marginBottom: expanded ? S[2] : 0,
            }}
          >
            {expanded ? 'Hide basis' : 'Show basis'}
          </button>
          {expanded && (
            <p style={{ fontFamily: F.body, fontSize: '12px', color: C.textSecondary, lineHeight: 1.5, margin: 0 }}>
              {basis}
            </p>
          )}
        </>
      )}
    </div>
  );
}
