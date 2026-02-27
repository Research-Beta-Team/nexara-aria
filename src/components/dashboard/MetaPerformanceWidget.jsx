import {
  AreaChart, Area, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid,
} from 'recharts';
import { C, F, R, S, cardStyle } from '../../tokens';

// ── Custom tooltip ────────────────────────────
function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      backgroundColor: C.surface3,
      border: `1px solid ${C.border}`,
      borderRadius: R.md,
      padding: `${S[1]} ${S[3]}`,
      fontFamily: F.mono,
      fontSize: '11px',
      color: C.textPrimary,
    }}>
      <span style={{ color: C.textMuted }}>{label} </span>
      <span style={{ color: C.primary }}>{payload[0].value}%</span>
    </div>
  );
}

// ── Stat cell ─────────────────────────────────
function StatCell({ label, value, sub }) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '2px',
      padding: `${S[3]} ${S[4]}`,
      backgroundColor: C.surface2,
      border: `1px solid ${C.border}`,
      borderRadius: R.md,
    }}>
      <span style={{
        fontFamily: F.body,
        fontSize: '11px',
        fontWeight: 600,
        color: C.textMuted,
        textTransform: 'uppercase',
        letterSpacing: '0.06em',
      }}>
        {label}
      </span>
      <span style={{
        fontFamily: F.mono,
        fontSize: '20px',
        fontWeight: 700,
        color: C.textPrimary,
        lineHeight: 1,
      }}>
        {value}
      </span>
      {sub && (
        <span style={{ fontFamily: F.body, fontSize: '11px', color: C.textSecondary }}>
          {sub}
        </span>
      )}
    </div>
  );
}

// ── Main widget ───────────────────────────────
export default function MetaPerformanceWidget({ stats = {}, chartData = [] }) {
  const { spend = 0, leads = 0, cpl = 0, ctr = 0 } = stats;

  const wrapStyle = {
    ...cardStyle,
    display: 'flex',
    flexDirection: 'column',
    gap: S[4],
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

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: S[2],
  };

  const gradientId = 'ctrGradient';

  return (
    <div style={wrapStyle}>
      {/* Header */}
      <div style={headingStyle}>
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <rect x="1" y="1" width="12" height="12" rx="2" stroke={C.primary} strokeWidth="1.5"/>
          <path d="M4 7.5l2 2 4-3.5" stroke={C.primary} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        Meta Performance
      </div>

      {/* 2×2 stat grid */}
      <div style={gridStyle}>
        <StatCell label="Spend"  value={`$${spend.toLocaleString()}`} />
        <StatCell label="Leads"  value={leads} />
        <StatCell label="CPL"    value={`$${cpl}`} />
        <StatCell label="CTR"    value={`${ctr}%`} />
      </div>

      {/* CTR area chart */}
      <div>
        <span style={{
          display: 'block',
          fontFamily: F.body,
          fontSize: '11px',
          fontWeight: 600,
          color: C.textMuted,
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
          marginBottom: S[2],
        }}>
          CTR — 7 day
        </span>
        <div style={{ height: '80px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 2, right: 2, bottom: 0, left: -32 }}>
              <defs>
                <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%"   stopColor={C.primary} stopOpacity={0.25}/>
                  <stop offset="100%" stopColor={C.primary} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid
                vertical={false}
                stroke={C.border}
                strokeDasharray="3 3"
              />
              <XAxis
                dataKey="day"
                tick={{ fontFamily: F.mono, fontSize: 10, fill: C.textMuted }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontFamily: F.mono, fontSize: 10, fill: C.textMuted }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `${v}%`}
              />
              <Tooltip content={<ChartTooltip />} />
              <Area
                type="monotone"
                dataKey="ctr"
                stroke={C.primary}
                strokeWidth={2}
                fill={`url(#${gradientId})`}
                dot={false}
                activeDot={{ r: 4, fill: C.primary, strokeWidth: 0 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
