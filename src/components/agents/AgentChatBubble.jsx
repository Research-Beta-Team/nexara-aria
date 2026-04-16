import { C, F, R, S, T, badge, makeStyles } from '../../tokens';
import { getAgent } from '../../agents/AgentRegistry';
import AgentAvatar from './AgentAvatar';

function renderContent(content) {
  if (!content) return null;

  // If content is a string, render as text
  if (typeof content === 'string') {
    return (
      <p style={{
        fontFamily: F.body,
        fontSize: '13px',
        color: C.textPrimary,
        lineHeight: 1.55,
        margin: 0,
        whiteSpace: 'pre-wrap',
      }}>
        {content}
      </p>
    );
  }

  // If content is an array (list of items)
  if (Array.isArray(content)) {
    return (
      <ul style={{
        margin: 0,
        paddingLeft: S[5],
        fontFamily: F.body,
        fontSize: '13px',
        color: C.textPrimary,
        lineHeight: 1.55,
        listStyleType: 'disc',
      }}>
        {content.map((item, i) => (
          <li key={i} style={{ marginBottom: '4px' }}>
            {typeof item === 'string' ? item : item.text || JSON.stringify(item)}
          </li>
        ))}
      </ul>
    );
  }

  // If content is an object with headers/rows (table)
  if (content.headers && content.rows) {
    return (
      <div style={{ overflowX: 'auto' }}>
        <table style={{
          width: '100%',
          borderCollapse: 'collapse',
          fontFamily: F.body,
          fontSize: '12px',
        }}>
          <thead>
            <tr>
              {content.headers.map((h, i) => (
                <th key={i} style={{
                  textAlign: 'left',
                  padding: `${S[1]} ${S[2]}`,
                  borderBottom: `1px solid ${C.border}`,
                  color: C.textSecondary,
                  fontWeight: 600,
                  fontSize: '11px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {content.rows.map((row, ri) => (
              <tr key={ri}>
                {row.map((cell, ci) => (
                  <td key={ci} style={{
                    padding: `${S[1]} ${S[2]}`,
                    borderBottom: `1px solid ${C.border}`,
                    color: C.textPrimary,
                  }}>
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  // Fallback: render as JSON text
  return (
    <pre style={{
      fontFamily: F.mono,
      fontSize: '11px',
      color: C.textSecondary,
      margin: 0,
      whiteSpace: 'pre-wrap',
      overflowWrap: 'break-word',
    }}>
      {JSON.stringify(content, null, 2)}
    </pre>
  );
}

export default function AgentChatBubble({ agentId, content, skill, confidence, timestamp }) {
  const agent = getAgent(agentId);
  if (!agent) return null;

  const wrapperStyle = {
    display: 'flex',
    alignItems: 'flex-start',
    gap: S[3],
  };

  const bubbleStyle = {
    flex: 1,
    backgroundColor: C.surface2,
    border: `1px solid ${C.border}`,
    borderLeft: `3px solid ${agent.color}`,
    borderRadius: R.card,
    padding: S[4],
    display: 'flex',
    flexDirection: 'column',
    gap: S[2],
  };

  const headerStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: S[2],
    flexWrap: 'wrap',
  };

  const nameStyle = {
    fontFamily: F.display,
    fontSize: '13px',
    fontWeight: 700,
    color: agent.color,
  };

  const timeStyle = {
    fontFamily: F.mono,
    fontSize: '10px',
    color: C.textMuted,
    marginLeft: 'auto',
  };

  const confidenceBadge = confidence != null ? (
    <span style={makeStyles(badge.base, {
      backgroundColor: confidence >= 80 ? C.greenDim : confidence >= 50 ? C.amberDim : C.redDim,
      color: confidence >= 80 ? C.green : confidence >= 50 ? C.amber : C.red,
      border: 'none',
    })}>
      {confidence}% confident
    </span>
  ) : null;

  const skillBadge = skill ? (
    <span style={makeStyles(badge.base, badge.muted)}>
      via {skill}
    </span>
  ) : null;

  return (
    <div style={wrapperStyle}>
      <AgentAvatar agentId={agentId} size={32} showStatus={false} />
      <div style={bubbleStyle}>
        <div style={headerStyle}>
          <span style={nameStyle}>{agent.displayName || agent.name}</span>
          {confidenceBadge}
          {skillBadge}
          {timestamp && <span style={timeStyle}>{timestamp}</span>}
        </div>
        {renderContent(content)}
      </div>
    </div>
  );
}
