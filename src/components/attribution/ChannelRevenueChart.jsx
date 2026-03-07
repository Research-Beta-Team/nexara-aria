/**
 * Horizontal bars by channel: pipeline + revenue, % and CPL. Recharts.
 */
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  Legend,
} from 'recharts';
import { C, F, R, S } from '../../tokens';
import { CHANNEL_COLORS } from '../../data/attributionMock';

export default function ChannelRevenueChart({ data = [] }) {
  const formatK = (v) => (v >= 1000 ? `$${(v / 1000).toFixed(0)}K` : `$${v}`);
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
        Channel revenue & pipeline
      </div>
      <div style={{ width: '100%', height: 320 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 0, right: 24, left: 70, bottom: 0 }}
          >
            <XAxis type="number" tick={{ fontSize: 11, fill: C.textMuted }} axisLine={{ stroke: C.border }} tickFormatter={formatK} />
            <YAxis type="category" dataKey="channel" width={64} tick={{ fontSize: 12, fill: C.textPrimary }} axisLine={{ stroke: C.border }} />
            <Tooltip
              contentStyle={{ backgroundColor: C.surface2, border: `1px solid ${C.border}`, borderRadius: R.card, fontSize: '12px' }}
              labelStyle={{ color: C.textPrimary }}
              formatter={(value, name) => [name === 'pipeline' ? formatK(value) : name === 'revenue' ? formatK(value) : value, name === 'pipeline' ? 'Pipeline' : name === 'revenue' ? 'Revenue' : 'CPL']}
              labelFormatter={(label) => `${label}`}
            />
            <Legend wrapperStyle={{ fontSize: '11px' }} formatter={(v) => v} />
            <Bar dataKey="pipeline" name="Pipeline" radius={[0, 4, 4, 0]} maxBarSize={28} fill={C.primary} fillOpacity={0.7} />
            <Bar dataKey="revenue" name="Revenue" radius={[0, 4, 4, 0]} maxBarSize={28} fill={C.secondary}>
              {data.map((entry, index) => (
                <Cell key={entry.channel} fill={CHANNEL_COLORS[entry.channel] || C.secondary} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: S[4], marginTop: S[3], fontSize: '11px', color: C.textMuted }}>
        {data.slice(0, 6).map((row) => (
          <span key={row.channel}>
            {row.channel}: {row.pipelinePct}% pipeline · CPL ${row.cpl}
          </span>
        ))}
      </div>
    </div>
  );
}
