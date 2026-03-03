import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, ReferenceLine } from 'recharts';
import { C, F, R, S } from '../../tokens';

const MINT = '#3DDC84';

export default function PerformanceTrendChart({ data = [], milestoneLabel = 'Milestone: 80%+ accuracy reached (Feb 2026)' }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: S[4] }}>
      <h3 style={{ fontFamily: F.display, fontSize: '16px', fontWeight: 700, color: C.textPrimary, margin: 0 }}>
        How ARIA is improving
      </h3>
      <div style={{ backgroundColor: C.surface, border: `1px solid ${C.border}`, borderRadius: R.card, padding: S[5] }}>
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={C.border} vertical={false} />
            <XAxis dataKey="month" tick={{ fontFamily: F.body, fontSize: 11, fill: C.textSecondary }} axisLine={{ stroke: C.border }} />
            <YAxis domain={[0, 100]} tick={{ fontFamily: F.mono, fontSize: 10, fill: C.textMuted }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}%`} />
            <Tooltip
              contentStyle={{ backgroundColor: C.surface2, border: `1px solid ${C.border}`, borderRadius: R.card }}
              labelStyle={{ color: C.textPrimary }}
              formatter={(value) => [`${value}%`, 'Accuracy']}
            />
            <ReferenceLine y={80} stroke={C.amber} strokeDasharray="4 4" />
            <Line type="monotone" dataKey="accuracy" name="Accuracy" stroke={MINT} strokeWidth={2} dot={{ fill: MINT, r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
        <p style={{ fontFamily: F.body, fontSize: '12px', color: C.amber, margin: `${S[2]} 0 0`, fontWeight: 600 }}>
          {milestoneLabel}
        </p>
      </div>
      <p style={{ fontFamily: F.body, fontSize: '12px', color: C.textSecondary, margin: 0, lineHeight: 1.5 }}>
        Every campaign makes ARIA smarter. Your data stays private — only anonymised aggregate signals contribute to cross-client learning.
      </p>
    </div>
  );
}
