import { useState } from 'react';
import { C, F, R, S, T, btn, badge, makeStyles, shadows } from '../../tokens';
import { getAgent } from '../../agents/AgentRegistry';
import AgentAvatar from './AgentAvatar';

export default function AgentApprovalCard({ approval, onApprove, onReject }) {
  const [showRejectInput, setShowRejectInput] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [hovered, setHovered] = useState(false);

  if (!approval) return null;

  const agent = getAgent(approval.agentId);
  const isUrgent = approval.urgent || approval.priority === 'urgent';

  const cardStyle = {
    backgroundColor: C.surface2,
    border: `1px solid ${isUrgent ? C.amber : C.border}`,
    borderRadius: R.card,
    padding: S[5],
    display: 'flex',
    flexDirection: 'column',
    gap: S[3],
    boxShadow: isUrgent ? `0 0 12px rgba(251,191,36,0.15)` : shadows.card,
    transition: T.base,
  };

  const headerStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: S[3],
  };

  const nameStyle = {
    fontFamily: F.display,
    fontSize: '14px',
    fontWeight: 700,
    color: C.textPrimary,
  };

  const actionTextStyle = {
    fontFamily: F.body,
    fontSize: '13px',
    color: C.textPrimary,
    lineHeight: 1.5,
  };

  const contextStyle = {
    fontFamily: F.body,
    fontSize: '12px',
    color: C.textSecondary,
    lineHeight: 1.45,
    backgroundColor: C.surface3,
    borderRadius: R.sm,
    padding: `${S[2]} ${S[3]}`,
    border: `1px solid ${C.border}`,
  };

  const buttonRowStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: S[3],
    marginTop: S[1],
  };

  const approveBtn = {
    ...btn.primary,
    backgroundColor: C.green,
    color: '#FFFFFF',
    padding: `${S[2]} ${S[4]}`,
  };

  const rejectBtn = {
    ...btn.secondary,
    borderColor: C.red,
    color: C.red,
    padding: `${S[2]} ${S[4]}`,
  };

  const textareaStyle = {
    width: '100%',
    minHeight: '60px',
    backgroundColor: C.surface3,
    color: C.textPrimary,
    border: `1px solid ${C.border}`,
    borderRadius: R.input,
    padding: S[3],
    fontFamily: F.body,
    fontSize: '12px',
    resize: 'vertical',
    outline: 'none',
    transition: T.color,
  };

  const handleReject = () => {
    if (!showRejectInput) {
      setShowRejectInput(true);
      return;
    }
    onReject && onReject(approval.id, rejectReason);
    setShowRejectInput(false);
    setRejectReason('');
  };

  return (
    <div style={cardStyle}>
      {/* Header */}
      <div style={headerStyle}>
        <AgentAvatar agentId={approval.agentId} size={36} showStatus={false} />
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: S[2] }}>
            <span style={nameStyle}>
              {agent?.displayName || agent?.name || approval.agentId}
            </span>
            {isUrgent && (
              <span style={makeStyles(badge.base, badge.amber)}>URGENT</span>
            )}
            <span style={makeStyles(badge.base, badge.muted)}>Approval Needed</span>
          </div>
        </div>
      </div>

      {/* What action is pending */}
      <p style={actionTextStyle}>{approval.action || approval.description}</p>

      {/* Context / reasoning */}
      {approval.context && (
        <div style={contextStyle}>
          <span style={{ fontFamily: F.mono, fontSize: '10px', fontWeight: 700, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Reasoning
          </span>
          <p style={{ margin: `${S[1]} 0 0 0`, fontFamily: F.body, fontSize: '12px', color: C.textSecondary, lineHeight: 1.4 }}>
            {approval.context}
          </p>
        </div>
      )}

      {/* Reject reason textarea */}
      {showRejectInput && (
        <textarea
          style={textareaStyle}
          placeholder="Reason for rejection (optional)..."
          value={rejectReason}
          onChange={(e) => setRejectReason(e.target.value)}
          onFocus={(e) => { e.target.style.borderColor = C.primary; }}
          onBlur={(e) => { e.target.style.borderColor = C.border; }}
        />
      )}

      {/* Buttons */}
      <div style={buttonRowStyle}>
        <button
          style={approveBtn}
          onClick={() => onApprove && onApprove(approval.id)}
          onMouseEnter={(e) => { e.target.style.opacity = '0.85'; }}
          onMouseLeave={(e) => { e.target.style.opacity = '1'; }}
        >
          Approve
        </button>
        <button
          style={rejectBtn}
          onClick={handleReject}
          onMouseEnter={(e) => { e.target.style.backgroundColor = C.redDim; }}
          onMouseLeave={(e) => { e.target.style.backgroundColor = 'transparent'; }}
        >
          {showRejectInput ? 'Confirm Reject' : 'Reject'}
        </button>
        {showRejectInput && (
          <button
            style={btn.ghost}
            onClick={() => { setShowRejectInput(false); setRejectReason(''); }}
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  );
}
