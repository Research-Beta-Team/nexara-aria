import { C, F, R, S } from '../../tokens';
import { IconTrendUp, IconTrendDown } from '../ui/Icons';

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
        sub={replyRateTrend != null ? { trend: replyRateTrend, text: `${Math.abs(replyRateTrend)}% vs last week` } : null}
      />
      <StatBox label="Sequence" value="5-step" />
    </div>
  );
}

function StatBox({ label, value, color, sub }) {
  const isTrendObj = sub && typeof sub === 'object' && 'trend' in sub;
  const trend = isTrendObj ? sub.trend : null;
  const subText = isTrendObj ? sub.text : sub;
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
      {subText != null && (
        <span style={{ fontFamily: F.body, fontSize: '11px', color: C.textMuted, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
          {trend != null && (trend > 0 ? <IconTrendUp color={C.primary} w={12} /> : <IconTrendDown color={C.textMuted} w={12} />)}
          {subText}
        </span>
      )}
    </div>
  );
}
