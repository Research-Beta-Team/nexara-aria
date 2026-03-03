import { C, F, R, S, scrollbarStyle } from '../../tokens';

export default function AgentFeed({ feed = [] }) {
  const cardStyle = {
    backgroundColor: C.surface,
    border: `1px solid ${C.border}`,
    borderRadius: R.card,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  };

  const headerStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: S[2],
    padding: `${S[3]} ${S[4]}`,
    borderBottom: `1px solid ${C.border}`,
    flexShrink: 0,
  };

  const liveDotStyle = {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    backgroundColor: C.primary,
    boxShadow: `0 0 6px ${C.primary}`,
    animation: 'feedPulse 1.5s ease-in-out infinite',
    flexShrink: 0,
  };

  const listStyle = {
    overflowY: 'auto',
    maxHeight: '300px',
    ...scrollbarStyle,
  };

  return (
    <div style={cardStyle}>
      <style>{`
        @keyframes feedPulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.35; }
        }
      `}</style>

      {/* Header */}
      <div style={headerStyle}>
        <div style={liveDotStyle}/>
        <span style={{ fontFamily: F.display, fontSize: '13px', fontWeight: 700, color: C.textPrimary }}>
          Agent Feed
        </span>
        <span style={{
          marginLeft: 'auto',
          fontFamily: F.mono,
          fontSize: '10px',
          fontWeight: 700,
          color: C.primary,
          backgroundColor: 'rgba(61,220,132,0.1)',
          border: `1px solid rgba(61,220,132,0.2)`,
          borderRadius: '4px',
          padding: '1px 6px',
          letterSpacing: '0.08em',
        }}>
          LIVE
        </span>
      </div>

      {/* Feed items */}
      <div style={listStyle}>
        {feed.map((item, i) => (
          <div
            key={item.id}
            style={{
              display: 'flex',
              gap: S[3],
              padding: `${S[3]} ${S[4]}`,
              borderBottom: i < feed.length - 1 ? `1px solid ${C.border}` : 'none',
              borderLeft: `3px solid ${item.color}`,
            }}
          >
            {/* Content */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: S[2] }}>
                <span style={{
                  fontFamily: F.mono,
                  fontSize: '11px',
                  fontWeight: 700,
                  color: item.color,
                  letterSpacing: '0.04em',
                }}>
                  {item.agent}
                </span>
                <span style={{ fontFamily: F.body, fontSize: '11px', color: C.textMuted, flexShrink: 0 }}>
                  {item.time}
                </span>
              </div>
              <span style={{ fontFamily: F.body, fontSize: '12px', color: C.textSecondary, lineHeight: '1.45' }}>
                {item.message}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
