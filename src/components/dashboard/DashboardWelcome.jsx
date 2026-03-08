/**
 * Dashboard welcome strip — personalized greeting, client, date.
 * Time-based greeting + name; sleek, modern layout.
 */
import useStore from '../../store/useStore';
import { C, F, S, R } from '../../tokens';

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

function getDateLabel() {
  return new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export default function DashboardWelcome({ clientName, campaignCount }) {
  const userFirstName = useStore((s) => s.userFirstName) || 'there';
  const greeting = getGreeting();
  const dateLabel = getDateLabel();

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: S[2],
        padding: `${S[5]} ${S[6]}`,
        background: `linear-gradient(135deg, ${C.surface} 0%, ${C.surface2} 100%)`,
        border: `1px solid ${C.border}`,
        borderRadius: R.card,
        marginBottom: S[5],
      }}
    >
      <div style={{ display: 'flex', alignItems: 'baseline', flexWrap: 'wrap', gap: S[2] }}>
        <h1
          style={{
            fontFamily: F.display,
            fontSize: '28px',
            fontWeight: 800,
            color: C.textPrimary,
            margin: 0,
            letterSpacing: '-0.03em',
            lineHeight: 1.2,
          }}
        >
          {greeting}, {userFirstName}
        </h1>
        <span
          style={{
            fontFamily: F.body,
            fontSize: '14px',
            color: C.textSecondary,
            fontWeight: 500,
          }}
        >
          {dateLabel}
        </span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: S[3], flexWrap: 'wrap' }}>
        {clientName && (
          <span
            style={{
              fontFamily: F.body,
              fontSize: '13px',
              color: C.textMuted,
              display: 'inline-flex',
              alignItems: 'center',
              gap: S[1],
            }}
          >
            <span
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                backgroundColor: C.primary,
                flexShrink: 0,
              }}
            />
            {clientName}
          </span>
        )}
        {campaignCount != null && (
          <span
            style={{
              fontFamily: F.body,
              fontSize: '13px',
              color: C.textMuted,
            }}
          >
            {campaignCount} {campaignCount === 1 ? 'campaign' : 'campaigns'} active
          </span>
        )}
      </div>
    </div>
  );
}
