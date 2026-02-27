import { useState } from 'react';
import useToast from '../../hooks/useToast';
import { C, F, R, S, T } from '../../tokens';

// ARIA icon
function AriaIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="10" r="9" stroke={C.primary} strokeWidth="1.5"/>
      <circle cx="10" cy="10" r="4" stroke={C.primary} strokeWidth="1.5"/>
      <circle cx="10" cy="10" r="1.5" fill={C.primary}/>
      <path d="M10 1v3M10 16v3M1 10h3M16 10h3" stroke={C.primary} strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}

export default function AriaInsightStrip({ insights = [], onAskAria }) {
  const [expanded, setExpanded] = useState(false);
  const toast = useToast();

  const handleAskAria = (insight) => {
    if (onAskAria) {
      onAskAria(insight);
    } else {
      toast.info('ARIA AI assistant coming soon');
    }
  };

  const stripStyle = {
    backgroundColor: C.surface,
    border: `1px solid ${C.border}`,
    borderLeft: `3px solid ${C.primary}`,
    borderRadius: R.card,
    overflow: 'hidden',
    transition: T.base,
  };

  const headerStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: S[3],
    padding: `${S[3]} ${S[5]}`,
    cursor: 'pointer',
    userSelect: 'none',
  };

  const pulseStyle = {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    backgroundColor: C.primary,
    flexShrink: 0,
    boxShadow: `0 0 6px ${C.primary}`,
    animation: 'ariaPulse 2s ease-in-out infinite',
  };

  const countStyle = {
    fontFamily: F.mono,
    fontSize: '12px',
    fontWeight: 700,
    color: C.primary,
    backgroundColor: 'rgba(61,220,132,0.12)',
    border: `1px solid rgba(61,220,132,0.2)`,
    borderRadius: '4px',
    padding: `1px ${S[2]}`,
    marginLeft: S[1],
  };

  return (
    <div style={stripStyle}>
      <style>{`
        @keyframes ariaPulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.5; transform: scale(0.85); }
        }
      `}</style>

      {/* Header — always visible */}
      <div style={headerStyle} onClick={() => setExpanded((e) => !e)}>
        <AriaIcon />
        <span style={{ fontFamily: F.body, fontSize: '13px', fontWeight: 600, color: C.textPrimary, flex: 1 }}>
          ARIA has
          <span style={countStyle}>{insights.length}</span>
          {' '}insights that need attention
        </span>
        <div style={pulseStyle}/>
        {/* Chevron */}
        <svg
          width="16" height="16" viewBox="0 0 16 16" fill="none"
          style={{ color: C.textMuted, transform: expanded ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s ease', flexShrink: 0 }}
        >
          <path d="M3 6l5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>

      {/* Expanded insights */}
      {expanded && (
        <div style={{ borderTop: `1px solid ${C.border}` }}>
          {insights.map((insight, i) => (
            <div
              key={insight.id}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: S[4],
                padding: `${S[3]} ${S[5]}`,
                borderBottom: i < insights.length - 1 ? `1px solid ${C.border}` : 'none',
                backgroundColor: C.surface,
                borderLeft: `3px solid ${insight.color}`,
              }}
            >
              {/* Colored indicator */}
              <div style={{
                width: '4px',
                height: '4px',
                borderRadius: '50%',
                backgroundColor: insight.color,
                marginTop: '7px',
                flexShrink: 0,
                boxShadow: `0 0 4px ${insight.color}`,
              }}/>

              <span style={{
                fontFamily: F.body,
                fontSize: '13px',
                color: C.textSecondary,
                flex: 1,
                lineHeight: '1.5',
              }}>
                {insight.text}
              </span>

              <button
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: S[1],
                  backgroundColor: 'rgba(61,220,132,0.08)',
                  border: `1px solid rgba(61,220,132,0.25)`,
                  borderRadius: '6px',
                  padding: `3px ${S[2]}`,
                  fontFamily: F.body,
                  fontSize: '12px',
                  fontWeight: 600,
                  color: C.primary,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  flexShrink: 0,
                  transition: T.color,
                }}
                onClick={() => handleAskAria(insight)}
              >
                Ask ARIA
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <path d="M2 5h6M5 2l3 3-3 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
