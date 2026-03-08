import { C, F, R, S } from '../../tokens';

export default function OutreachStats({ prospects = [], replyRateTrend }) {
  const replied = prospects.filter((p) => p.replied).length;
  const highIntent = prospects.filter((p) => p.intent === 'high').length;
  const replyRate = prospects.length ? Math.round((replied / prospects.length) * 100) : 0;

  return (
    <div style={{ display: 'flex', gap: S[3], flexWrap: 'wrap' }}>
      <StatBox label="Prospects" value={prospects.length} />
      <StatBox label="Replied" value={replied} color={C.primary} />
      <StatBox label="High intent" value={highIntent} color={C.secondary} />
      <StatBox
        label="Reply rate"
        value={`${replyRate}%`}
        color={C.primary}
        sub={replyRateTrend != null ? `${replyRateTrend > 0 ? '↑' : '↓'} ${Math.abs(replyRateTrend)}% vs last week` : null}
      />
      <StatBox label="Sequence" value="5-step" />
    </div>
  );
}

function StatBox({ label, value, color, sub }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '2px',
        padding: `${S[3]} ${S[4]}`,
        backgroundColor: C.surface2,
        border: `1px solid ${C.border}`,
        borderRadius: R.md,
        flex: 1,
        minWidth: '100px',
      }}
    >
      <span style={{ fontFamily: F.body, fontSize: '11px', color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        {label}
      </span>
      <span style={{ fontFamily: F.mono, fontSize: '18px', fontWeight: 700, color: color ?? C.textPrimary, lineHeight: 1 }}>
        {value}
      </span>
      {sub && <span style={{ fontFamily: F.body, fontSize: '11px', color: C.textMuted }}>{sub}</span>}
    </div>
  );
}
