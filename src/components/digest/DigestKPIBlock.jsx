/**
 * Metric name, value, vs last week, vs target.
 */
import { C, F, R, S } from '../../tokens';

export default function DigestKPIBlock({ name, value, vsLastWeek, vsTarget, trend = 'neutral' }) {
  const trendUp = trend === 'up';
  const trendDown = trend === 'down';
  const deltaColor = trendUp ? C.primary : trendDown ? C.amber : C.textMuted;
  return (
    <div
      style={{
        padding: S[4],
        backgroundColor: C.surface,
        border: `1px solid ${C.border}`,
        borderRadius: R.card,
      }}
    >
      <div style={{ fontFamily: F.body, fontSize: '11px', fontWeight: 600, color: C.textSecondary, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: S[2] }}>
        {name}
      </div>
      <div style={{ fontFamily: F.mono, fontSize: '22px', fontWeight: 700, color: C.textPrimary, marginBottom: S[2] }}>
        {value}
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: S[3], fontSize: '12px' }}>
        {vsLastWeek != null && vsLastWeek !== '—' && (
          <span style={{ fontFamily: F.body, color: deltaColor }}>
            {vsLastWeek} vs last week
          </span>
        )}
        {vsTarget != null && vsTarget !== '—' && (
          <span style={{ fontFamily: F.body, color: C.textMuted }}>
            · {vsTarget} of target
          </span>
        )}
      </div>
    </div>
  );
}
