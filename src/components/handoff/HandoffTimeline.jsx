/**
 * Bar chart: MQLs, hours to first touch, target line 1h, color by urgency.
 */
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Cell,
} from 'recharts';
import { C } from '../../tokens';

const TARGET_HOURS = 1;

export default function HandoffTimeline({ data = [] }) {
  const getBarColor = (entry) => {
    const h = entry.avgHours ?? 0;
    if (h >= 4) return C.red;
    if (h >= 1) return C.amber;
    return C.primary;
  };

  return (
    <div style={{ width: '100%', height: 280 }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <ReferenceLine y={TARGET_HOURS} stroke={C.primary} strokeDasharray="4 4" strokeWidth={2} />
          <XAxis dataKey="date" tick={{ fontSize: 11, fill: C.textMuted }} axisLine={{ stroke: C.border }} />
          <YAxis
            yAxisId="left"
            tick={{ fontSize: 11, fill: C.textMuted }}
            axisLine={{ stroke: C.border }}
            label={{ value: 'Avg hours', angle: -90, position: 'insideLeft', style: { fill: C.textMuted, fontSize: 10 } }}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            dataKey="mqls"
            tick={{ fontSize: 11, fill: C.textMuted }}
            axisLine={{ stroke: C.border }}
            label={{ value: 'MQLs', angle: 90, position: 'insideRight', style: { fill: C.textMuted, fontSize: 10 } }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: C.surface2,
              border: `1px solid ${C.border}`,
              borderRadius: '8px',
              fontSize: '12px',
            }}
            labelStyle={{ color: C.textPrimary }}
            formatter={(value, name) => [name === 'avgHours' ? `${value}h` : value, name === 'avgHours' ? 'Avg hours' : 'MQLs']}
            labelFormatter={(label) => `Day: ${label}`}
          />
          <Bar yAxisId="left" dataKey="avgHours" name="avgHours" radius={[4, 4, 0, 0]} fill={C.primary}>
            {data.map((entry, index) => (
              <Cell key={entry.date} fill={getBarColor(entry)} />
            ))}
          </Bar>
          <Bar yAxisId="right" dataKey="mqls" name="MQLs" radius={[4, 4, 0, 0]} fill={C.secondary} opacity={0.6} />
        </BarChart>
      </ResponsiveContainer>
      <div style={{ fontSize: '10px', color: C.textMuted, marginTop: 4 }}>
        — — Target &lt;1h first touch
      </div>
    </div>
  );
}
