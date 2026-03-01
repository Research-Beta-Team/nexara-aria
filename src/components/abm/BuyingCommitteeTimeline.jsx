import { C, F, R, S, btn } from '../../tokens';
import { IconSend, IconPhone, IconCalendar, IconLink } from '../ui/Icons';

const TYPE_ICON = {
  email:    { Icon: IconSend,   color: C.textSecondary },
  call:    { Icon: IconPhone,   color: C.primary },
  meeting: { Icon: IconCalendar, color: C.amber },
  linkedin: { text: 'in',      color: C.textSecondary },
};

const DIRECTION_ARROW = { inbound: '←', outbound: '→' };

// Distinct colors per stakeholder for timeline
const STAKEHOLDER_COLORS = [
  C.primary,
  C.secondary,
  C.amber,
  '#8B7CF6',
  '#FF9F7A',
];

export default function BuyingCommitteeTimeline({ account, toast }) {
  const touchpoints = [...(account?.touchpoints || [])].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );
  const names = [...new Set(touchpoints.map((t) => t.stakeholderName))];
  const colorByStakeholder = Object.fromEntries(names.map((n, i) => [n, STAKEHOLDER_COLORS[i % STAKEHOLDER_COLORS.length]]));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: S[4] }}>
      <button
        style={{ ...btn.primary, alignSelf: 'flex-start', fontSize: '13px' }}
        onClick={() => toast?.info('Log touchpoint flow coming soon')}
      >
        Log new touchpoint
      </button>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 0, position: 'relative' }}>
        {touchpoints.map((t, i) => {
          const color = colorByStakeholder[t.stakeholderName] || C.textSecondary;
          const isLast = i === touchpoints.length - 1;
          return (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: S[4],
                paddingBottom: isLast ? 0 : S[2],
                position: 'relative',
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                <div
                  style={{
                    width: 12,
                    height: 12,
                    borderRadius: '50%',
                    marginTop: 4,
                    backgroundColor: color,
                    border: `2px solid ${C.surface}`,
                  }}
                />
                {!isLast && (
                  <div
                    style={{
                      width: 2,
                      flex: 1,
                      minHeight: 24,
                      marginTop: 4,
                      backgroundColor: C.border,
                    }}
                  />
                )}
              </div>
              <div
                style={{
                  flex: 1,
                  display: 'grid',
                  gridTemplateColumns: '90px 1fr 60px 80px 1fr',
                  gap: S[3],
                  alignItems: 'center',
                  padding: S[3],
                  backgroundColor: C.surface2,
                  border: `1px solid ${C.border}`,
                  borderRadius: R.sm,
                }}
              >
                <span style={{ fontFamily: F.mono, fontSize: '11px', color: C.textMuted }}>{t.date}</span>
                <span style={{ fontFamily: F.body, fontSize: '13px', fontWeight: 600, color }}>{t.stakeholderName}</span>
                <span style={{ fontFamily: F.body, fontSize: '12px', color: C.textSecondary, display: 'flex', alignItems: 'center', gap: 4 }}>
                  {(() => {
                    const ticon = TYPE_ICON[t.type] ?? { text: t.type, color: C.textMuted };
                    const Icon = ticon.Icon;
                    if (Icon) return <Icon color={ticon.color} width={14} height={14} />;
                    return <span style={{ color: ticon.color }}>{ticon.text}</span>;
                  })()}
                </span>
                <span style={{ fontFamily: F.mono, fontSize: '11px', color: C.textMuted }}>
                  {DIRECTION_ARROW[t.direction]} {t.direction}
                </span>
                <span style={{ fontFamily: F.body, fontSize: '12px', color: C.textPrimary }}>{t.outcome}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
