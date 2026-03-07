/**
 * Small sparkline for digest KPI trend (e.g. last 7 days).
 */
import { AreaChart, Area, ResponsiveContainer } from 'recharts';
import { C } from '../../tokens';

export default function DigestMiniChart({ values = [], color = C.primary, id = 'digestMini' }) {
  const data = values.map((v, i) => ({ day: i, value: v }));
  const gradId = `digestMiniGrad-${id}`;
  return (
    <div style={{ width: '100%', height: 36 }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 2, right: 2, left: 2, bottom: 2 }}>
          <defs>
            <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.4} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area type="monotone" dataKey="value" stroke={color} strokeWidth={1.5} fill={`url(#${gradId})`} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
