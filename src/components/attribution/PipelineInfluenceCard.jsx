/**
 * Per-campaign pipeline influence (bar or list).
 */
import { C, F, R, S } from '../../tokens';

export default function PipelineInfluenceCard({ data = [] }) {
  const max = Math.max(...data.map((d) => d.pipeline), 1);
  return (
    <div
      style={{
        backgroundColor: C.surface,
        border: `1px solid ${C.border}`,
        borderRadius: R.card,
        padding: S[4],
      }}
    >
      <div style={{ fontFamily: F.display, fontSize: '14px', fontWeight: 700, color: C.textPrimary, marginBottom: S[4] }}>
        Pipeline influence
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: S[3] }}>
        {data.map((row) => (
          <div key={row.campaign}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: S[1] }}>
              <span style={{ fontFamily: F.body, fontSize: '12px', color: C.textPrimary }}>{row.campaign}</span>
              <span style={{ fontFamily: F.mono, fontSize: '12px', color: C.textSecondary }}>
                ${(row.pipeline / 1000).toFixed(0)}K · {row.pct}%
              </span>
            </div>
            <div
              style={{
                height: 8,
                backgroundColor: C.surface3,
                borderRadius: R.pill,
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  width: `${(row.pipeline / max) * 100}%`,
                  height: '100%',
                  backgroundColor: C.primary,
                  borderRadius: R.pill,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
