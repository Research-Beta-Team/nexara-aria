import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { C, F, R, S, cardStyle } from '../../tokens';

export default function PipelineFunnelWidget({ funnelData = [] }) {
  if (!funnelData.length) return null;

  const wrapStyle = {
    ...cardStyle,
    display: 'flex',
    flexDirection: 'column',
    gap: S[4],
  };

  return (
    <div style={wrapStyle}>
      <div style={{ fontFamily: F.display, fontSize: '13px', fontWeight: 700, color: C.textPrimary }}>
        Pipeline Funnel
      </div>
      <div style={{ height: '200px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={funnelData} layout="vertical" margin={{ top: 0, right: 8, bottom: 0, left: 60 }}>
            <XAxis type="number" hide />
            <YAxis
              type="category"
              dataKey="stage"
              width={56}
              tick={{ fontFamily: F.mono, fontSize: 10, fill: C.textMuted }}
              axisLine={false}
              tickLine={false}
            />
            <Bar
              dataKey="count"
              fill={C.primary}
              radius={[0, R.sm, R.sm, 0]}
              maxBarSize={20}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
