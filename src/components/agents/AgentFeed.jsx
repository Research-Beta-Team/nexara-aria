import { useMemo } from 'react';
import { C, F, R, S, T, scrollbarStyle, shadows } from '../../tokens';
import { getAgent } from '../../agents/AgentRegistry';
import useStore from '../../store/useStore';
import AgentAvatar from './AgentAvatar';

const ACTION_ICONS = {
  activated: { symbol: '\u25B6', color: C.green },
  completed: { symbol: '\u2713', color: C.primary },
  delegated: { symbol: '\u2192', color: '#8B5CF6' },
  insight: { symbol: '\u2605', color: C.amber },
  approval: { symbol: '\u26A0', color: '#F59E0B' },
};

function timeAgo(isoStr) {
  if (!isoStr) return '';
  const diff = Date.now() - new Date(isoStr).getTime();
  const secs = Math.floor(diff / 1000);
  if (secs < 60) return 'Just now';
  const mins = Math.floor(secs / 60);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function AgentFeed({ limit = 15 }) {
  const allFeed = useStore((s) => s.agents.agentFeed);
  const items = useMemo(() => (allFeed || []).slice(0, limit), [allFeed, limit]);

  const containerStyle = {
    backgroundColor: C.surface,
    border: `1px solid ${C.border}`,
    borderRadius: R.card,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    boxShadow: shadows.card,
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
    animation: 'agentFeedPulse 1.5s ease-in-out infinite',
    flexShrink: 0,
  };

  const listStyle = {
    overflowY: 'auto',
    maxHeight: '400px',
    ...scrollbarStyle,
  };

  const emptyStyle = {
    padding: S[6],
    textAlign: 'center',
    fontFamily: F.body,
    fontSize: '13px',
    color: C.textMuted,
  };

  return (
    <div style={containerStyle}>
      <style>{`
        @keyframes agentFeedPulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.35; }
        }
        @keyframes agentFeedFadeIn {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div style={headerStyle}>
        <div style={liveDotStyle} />
        <span style={{ fontFamily: F.display, fontSize: '13px', fontWeight: 700, color: C.textPrimary }}>
          Agent Activity
        </span>
        <span style={{
          marginLeft: 'auto',
          fontFamily: F.mono,
          fontSize: '10px',
          fontWeight: 700,
          color: C.primary,
          backgroundColor: C.primaryGlow,
          border: `1px solid ${C.primaryDim}`,
          borderRadius: '4px',
          padding: '1px 6px',
          letterSpacing: '0.08em',
        }}>
          LIVE
        </span>
      </div>

      <div style={listStyle}>
        {items.length === 0 && (
          <div style={emptyStyle}>No agent activity yet</div>
        )}
        {items.map((item, i) => {
          const agent = getAgent(item.agentId);
          const actionCfg = ACTION_ICONS[item.type] || ACTION_ICONS.activated;

          return (
            <div
              key={item.id || i}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: S[3],
                padding: `${S[3]} ${S[4]}`,
                borderBottom: i < items.length - 1 ? `1px solid ${C.border}` : 'none',
                animation: 'agentFeedFadeIn 0.3s ease',
              }}
            >
              <AgentAvatar agentId={item.agentId} size={24} showStatus={false} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: S[2] }}>
                  <span style={{
                    fontFamily: F.mono,
                    fontSize: '11px',
                    fontWeight: 700,
                    color: agent?.color || C.textSecondary,
                    letterSpacing: '0.04em',
                  }}>
                    {agent?.name || item.agentId}
                  </span>
                  <span style={{
                    fontFamily: F.body,
                    fontSize: '10px',
                    color: C.textMuted,
                    flexShrink: 0,
                  }}>
                    {timeAgo(item.timestamp)}
                  </span>
                </div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: S[1],
                  marginTop: '2px',
                }}>
                  <span style={{ color: actionCfg.color, fontSize: '10px', flexShrink: 0 }}>
                    {actionCfg.symbol}
                  </span>
                  <span style={{
                    fontFamily: F.body,
                    fontSize: '12px',
                    color: C.textSecondary,
                    lineHeight: 1.4,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}>
                    {item.text || item.message}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
