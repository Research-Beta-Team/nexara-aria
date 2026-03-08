import { C, F, R, S, cardStyle } from '../../tokens';

// Build map metric id -> { label, target, unit, direction } from kpis config
function getKpiSpec(kpis) {
  const order = kpis?.dashboardKPIOrder ?? [];
  const byMetric = {};
  ['primary', 'secondary', 'tertiary'].forEach((key) => {
    const def = kpis?.[key];
    if (def?.metric) byMetric[def.metric] = def;
  });
  return { order, byMetric };
}

// Percent of target (for direction up: value/target; for down: (target - value)/target or inverse)
function pctOfTarget(value, target, direction) {
  if (target == null || target === 0) return 100;
  if (direction === 'down') {
    // Lower is better: 100% when value <= target
    const pct = Math.min(100, (target / Math.max(value, 0.001)) * 100);
    return pct;
  }
  return Math.min(100, (value / target) * 100);
}

// Color by progress: green >= 80%, amber 50–79%, red < 50%
function progressColor(pct) {
  if (pct >= 80) return C.primary;
  if (pct >= 50) return C.amber;
  return C.red;
}

function formatValue(value, unit) {
  if (unit === '$') return `$${Number(value).toLocaleString()}`;
  if (unit === '%') return `${value}%`;
  if (unit === 'x' || unit === 'index') return `${value}`;
  if (unit?.startsWith('/')) return `${value}${unit}`;
  return `${value} ${unit || ''}`.trim();
}

export default function KPIHeader({ kpisConfig, kpiValues = {} }) {
  const { order, byMetric } = getKpiSpec(kpisConfig);
  const metrics = order.filter((id) => byMetric[id]).slice(0, 4);

  if (metrics.length === 0) return null;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${metrics.length}, 1fr)`, gap: S[4] }}>
      {metrics.map((metricId) => {
        const spec = byMetric[metricId];
        const value = kpiValues[metricId] ?? 0;
        const target = spec?.target ?? 0;
        const direction = spec?.direction ?? 'up';
        const pct = pctOfTarget(value, target, direction);
        const barColor = progressColor(pct);

        return (
          <div
            key={metricId}
            style={{
              ...cardStyle,
              padding: S[5],
              display: 'flex',
              flexDirection: 'column',
              gap: S[3],
              transition: 'box-shadow 0.2s ease, border-color 0.2s ease',
            }}
          >
            <div style={{ fontFamily: F.body, fontSize: '11px', fontWeight: 600, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              {spec?.label ?? metricId}
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: S[2], flexWrap: 'wrap' }}>
              <span style={{ fontFamily: F.mono, fontSize: '26px', fontWeight: 700, color: C.textPrimary, lineHeight: 1, letterSpacing: '-0.02em' }}>
                {formatValue(value, spec?.unit)}
              </span>
              <span style={{ fontFamily: F.body, fontSize: '12px', color: C.textMuted }}>
                / {formatValue(target, spec?.unit)} target
              </span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <div style={{
                height: '6px',
                borderRadius: R.pill,
                backgroundColor: C.surface3,
                overflow: 'hidden',
              }}>
                <div style={{
                  height: '100%',
                  width: `${Math.min(100, pct)}%`,
                  borderRadius: R.pill,
                  backgroundColor: barColor,
                  transition: 'width 0.3s ease',
                }} />
              </div>
              <span style={{ fontFamily: F.mono, fontSize: '11px', color: C.textMuted }}>
                {direction === 'up' ? `${Math.round(pct)}% of target` : `${Math.round(pct)}% efficiency`}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
