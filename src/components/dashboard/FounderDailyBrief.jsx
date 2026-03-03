import { useNavigate } from 'react-router-dom';
import useStore from '../../store/useStore';
import { C, F, R, S, btn } from '../../tokens';

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

// ── Stat chip icons (theme: currentColor) ──
const IconInbox = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" style={{ flexShrink: 0 }}>
    <rect x="1.5" y="3.5" width="15" height="11" rx="2" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M1.5 7l7.5 4.5L16.5 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const IconContent = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" style={{ flexShrink: 0 }}>
    <rect x="3" y="1.5" width="12" height="15" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M6 6h6M6 9h6M6 12h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);
const IconAlert = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" style={{ flexShrink: 0 }}>
    <path d="M9 2L16 14H2L9 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
    <path d="M9 7v3M9 12v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);
const IconAria = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" style={{ flexShrink: 0 }}>
    <circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth="1.5"/>
    <circle cx="9" cy="9" r="2.5" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M9 2v2M9 14v2M2 9h2M14 9h2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

// Mock stats for founder daily brief
const MOCK_STATS = {
  outreachReplies: '3 new replies to follow up',
  contentPending: '2 pieces awaiting your approval',
  campaignsAttention: '1 campaign needs attention',
  ariaInsights: '4 insights ready',
};

const ARIA_RECOMMENDATION = "The LinkedIn sequence for CFO Vietnam has a 31% reply rate — follow up on the 8 contacts who opened but didn't reply.";

/**
 * Founder-only dashboard header: greeting, date, four stat chips, ARIA daily focus.
 * Replaces AriaInsightStrip when currentRole === 'founder'.
 */
export default function FounderDailyBrief({ onTellAria }) {
  const navigate = useNavigate();
  const userFirstName = useStore((s) => s.userFirstName) || 'Founder';
  const toggleAria = useStore((s) => s.toggleAria);

  const now = new Date();
  const dateStr = now.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  const dayStr = DAYS[now.getDay()];

  const cardStyle = {
    backgroundColor: C.surface2,
    border: `1px solid ${C.border}`,
    borderLeft: `4px solid ${C.primary}`,
    borderRadius: R.card,
    padding: S[5],
    marginBottom: S[4],
  };

  const chipStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: S[2],
    padding: `${S[2]} ${S[4]}`,
    backgroundColor: C.surface3,
    border: `1px solid ${C.border}`,
    borderRadius: R.button,
    fontFamily: F.body,
    fontSize: '13px',
    color: C.textPrimary,
    cursor: 'pointer',
    transition: 'background-color 0.15s ease, border-color 0.15s ease',
  };

  const handleTellAria = () => {
    toggleAria();
    onTellAria?.(ARIA_RECOMMENDATION);
  };

  return (
    <div style={cardStyle}>
      <div style={{ marginBottom: S[4] }}>
        <h2 style={{
          fontFamily: F.display,
          fontSize: '18px',
          fontWeight: 700,
          color: C.textPrimary,
          margin: 0,
          letterSpacing: '-0.02em',
        }}>
          Good morning, {userFirstName}. Here&apos;s your day.
        </h2>
        <p style={{
          fontFamily: F.body,
          fontSize: '13px',
          color: C.textMuted,
          margin: `${S[1]} 0 0`,
        }}>
          {dayStr}, {dateStr}
        </p>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: S[3], marginBottom: S[5] }}>
        <button
          type="button"
          style={chipStyle}
          onClick={() => navigate('/inbox')}
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = C.surface; e.currentTarget.style.borderColor = C.borderHover; }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = C.surface3; e.currentTarget.style.borderColor = C.border; }}
        >
          <IconInbox />
          <span><strong>Outreach:</strong> {MOCK_STATS.outreachReplies}</span>
        </button>
        <button
          type="button"
          style={chipStyle}
          onClick={() => navigate('/content')}
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = C.surface; e.currentTarget.style.borderColor = C.borderHover; }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = C.surface3; e.currentTarget.style.borderColor = C.border; }}
        >
          <IconContent />
          <span><strong>Content:</strong> {MOCK_STATS.contentPending}</span>
        </button>
        <button
          type="button"
          style={chipStyle}
          onClick={() => navigate('/campaigns')}
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = C.surface; e.currentTarget.style.borderColor = C.borderHover; }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = C.surface3; e.currentTarget.style.borderColor = C.border; }}
        >
          <IconAlert />
          <span><strong>Campaigns:</strong> {MOCK_STATS.campaignsAttention}</span>
        </button>
        <button
          type="button"
          style={chipStyle}
          onClick={() => toggleAria()}
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = C.surface; e.currentTarget.style.borderColor = C.borderHover; }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = C.surface3; e.currentTarget.style.borderColor = C.border; }}
        >
          <IconAria />
          <span><strong>ARIA:</strong> {MOCK_STATS.ariaInsights}</span>
        </button>
      </div>

      <div style={{
        paddingTop: S[4],
        borderTop: `1px solid ${C.border}`,
      }}>
        <p style={{
          fontFamily: F.body,
          fontSize: '12px',
          fontWeight: 600,
          color: C.textMuted,
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
          margin: `0 0 ${S[2]}`,
        }}>
          Today ARIA recommends focusing on:
        </p>
        <p style={{
          fontFamily: F.body,
          fontSize: '14px',
          color: C.textSecondary,
          lineHeight: 1.5,
          margin: `0 0 ${S[3]}`,
        }}>
          {ARIA_RECOMMENDATION}
        </p>
        <button
          type="button"
          style={{ ...btn.primary, fontSize: '13px' }}
          onClick={handleTellAria}
        >
          Tell ARIA
        </button>
      </div>
    </div>
  );
}
