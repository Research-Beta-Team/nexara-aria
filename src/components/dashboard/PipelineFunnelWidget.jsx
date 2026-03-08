import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell } from 'recharts';
import { C, F, R, S, cardStyle } from '../../tokens';

const BAR_COLORS = [C.primary, C.secondary, C.primaryDim, C.secondaryDim, C.surface3, C.textMuted];

export default function PipelineFunnelWidget({ funnelData = [] }) {
  if (!funnelData.length) {
    return (
      <div
        style={{
          ...cardStyle,
          display: 'flex',
          flexDirection: 'column',
          gap: S[4],
          padding: S[5],
          minHeight: '200px',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <div style={{ fontFamily: F.display, fontSize: '13px', fontWeight: 700, color: C.textPrimary, display: 'flex', alignItems: 'center', gap: S[2] }}>
          <PipelineIcon />
          Pipeline Funnel
        </div>
        <p style={{ fontFamily: F.body, fontSize: '13px', color: C.textMuted, margin: 0 }}>No pipeline data</p>
      </div>
    );
  }

  const maxCount = Math.max(...funnelData.map((d) => d.count), 1);
  const total = funnelData.reduce((s, d) => s + d.count, 0);
  const firstStage = funnelData[0]?.count ?? 0;
  const lastStage = funnelData[funnelData.length - 1]?.count ?? 0;
  const conversionPct = firstStage > 0 ? Math.round((lastStage / firstStage) * 100) : 0;

  const wrapStyle = {
    ...cardStyle,
    display: 'flex',
    flexDirection: 'column',
    gap: S[4],
    padding: S[5],
  };

  const headingStyle = {
    fontFamily: F.display,
    fontSize: '13px',
    fontWeight: 700,
    color: C.textPrimary,
    display: 'flex',
    alignItems: 'center',
    gap: S[2],
  };

  return (
    <div style={wrapStyle}>
      {/* Header — matches Meta widget */}
      <div style={headingStyle}>
        <PipelineIcon />
        Pipeline Funnel
      </div>

      {/* Summary row */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: S[2],
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '2px',
            padding: `${S[3]} ${S[4]}`,
            backgroundColor: C.surface2,
            border: `1px solid ${C.border}`,
            borderRadius: R.md,
          }}
        >
          <span
            style={{
              fontFamily: F.body,
              fontSize: '11px',
              fontWeight: 600,
              color: C.textMuted,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
            }}
          >
            Total in funnel
          </span>
          <span style={{ fontFamily: F.mono, fontSize: '20px', fontWeight: 700, color: C.textPrimary, lineHeight: 1 }}>
            {total.toLocaleString()}
          </span>
        </div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '2px',
            padding: `${S[3]} ${S[4]}`,
            backgroundColor: C.surface2,
            border: `1px solid ${C.border}`,
            borderRadius: R.md,
          }}
        >
          <span
            style={{
              fontFamily: F.body,
              fontSize: '11px',
              fontWeight: 600,
              color: C.textMuted,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
            }}
          >
            IQL → Won
          </span>
          <span style={{ fontFamily: F.mono, fontSize: '20px', fontWeight: 700, color: C.primary, lineHeight: 1 }}>
            {conversionPct}%
          </span>
        </div>
      </div>

      {/* Funnel chart — horizontal bars, stage labels */}
      <div>
        <span
          style={{
            display: 'block',
            fontFamily: F.body,
            fontSize: '11px',
            fontWeight: 600,
            color: C.textMuted,
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            marginBottom: S[2],
          }}
        >
          By stage
        </span>
        <div style={{ height: Math.min(200, funnelData.length * 36) }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={funnelData}
              layout="vertical"
              margin={{ top: 2, right: 8, bottom: 2, left: 0 }}
            >
              <XAxis
                type="number"
                hide
                domain={[0, maxCount * 1.05]}
              />
              <YAxis
                type="category"
                dataKey="stage"
                width={72}
                tick={{ fontFamily: F.body, fontSize: 11, fill: C.textSecondary, fontWeight: 600 }}
                axisLine={false}
                tickLine={false}
              />
              <Bar dataKey="count" radius={[0, R.sm, R.sm, 0]} maxBarSize={24} minPointSize={4}>
                {funnelData.map((_, i) => (
                  <Cell key={i} fill={BAR_COLORS[i % BAR_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

function PipelineIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path
        d="M2 4h10v1H2V4zm0 2h8v1H2V6zm0 2h6v1H2V8zm0 2h4v1H2v-1z"
        stroke={C.primary}
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}
