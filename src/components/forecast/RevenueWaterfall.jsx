import { ComposedChart, Bar, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, CartesianGrid } from 'recharts';
import { C, F, R, S } from '../../tokens';

const COLOR = { mint: '#3DDC84', teal: '#5EEAD4', amber: '#F5C842', red: '#FF6E7A' };

export default function RevenueWaterfall({ data = [] }) {
  return (
    <div style={{ backgroundColor: C.surface, border: `1px solid ${C.border}`, borderRadius: R.card, padding: S[5] }}>
      <ResponsiveContainer width="100%" height={280}>
        <ComposedChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={C.border} vertical={false} />
          <XAxis dataKey="month" tick={{ fontFamily: F.body, fontSize: 11, fill: C.textSecondary }} axisLine={{ stroke: C.border }} />
          <YAxis tick={{ fontFamily: F.mono, fontSize: 10, fill: C.textMuted }} axisLine={false} tickLine={false} />
          <Tooltip
            contentStyle={{ backgroundColor: C.surface2, border: `1px solid ${C.border}`, borderRadius: R.card }}
            labelStyle={{ color: C.textPrimary }}
          />
          <Legend />
          <Bar dataKey="closedWon" name="Closed Won" fill={COLOR.mint} stackId="a" radius={[4, 4, 0, 0]} />
          <Bar dataKey="likely" name="Likely" fill={COLOR.teal} stackId="a" radius={[4, 4, 0, 0]} />
          <Bar dataKey="atRisk" name="At Risk" fill={COLOR.amber} stackId="a" radius={[4, 4, 0, 0]} />
          <Line type="monotone" dataKey="target" name="Target" stroke={COLOR.red} strokeWidth={2} strokeDasharray="5 5" dot={false} />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
