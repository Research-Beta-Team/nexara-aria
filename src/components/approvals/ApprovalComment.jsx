import { C, F, R, S, btn } from '../../tokens';

const ACTION_TAG_STYLE = {
  approved: { bg: C.primaryGlow, color: C.primary },
  changes_requested: { bg: C.redDim, color: C.red },
  replied_to_aria: { bg: 'rgba(94,234,212,0.15)', color: C.secondary },
  replied_to_freya: { bg: 'rgba(94,234,212,0.15)', color: C.secondary },
};

export default function ApprovalComment({ comment, reviewer, onReply }) {
  const isFreya = comment.authorId === 'freya';
  const displayName = isFreya ? 'Freya' : (comment.authorId === 'current' ? 'You' : (reviewer?.name ?? 'Unknown'));
  const initials = isFreya ? 'F' : (comment.authorId === 'current' ? 'YU' : (reviewer?.initials ?? '?'));
  const tagStyle = comment.actionTag ? ACTION_TAG_STYLE[comment.actionTag] : null;

  return (
    <div
      style={{
        display: 'flex',
        gap: S[3],
        padding: S[3],
        borderRadius: R.md,
        backgroundColor: isFreya ? C.surface2 : C.surface,
        border: `1px solid ${C.border}`,
        marginBottom: S[2],
      }}
    >
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: '50%',
          backgroundColor: isFreya ? C.primaryGlow : C.surface3,
          border: `1px solid ${isFreya ? C.primary : C.border}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: F.mono,
          fontSize: '11px',
          fontWeight: 700,
          color: isFreya ? C.primary : C.textSecondary,
          flexShrink: 0,
        }}
      >
        {initials}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: S[2], marginBottom: S[1] }}>
          <span style={{ fontFamily: F.body, fontSize: '13px', fontWeight: 600, color: C.textPrimary }}>
            {displayName}
          </span>
          <span style={{ fontFamily: F.mono, fontSize: '11px', color: C.textMuted }}>
            {comment.timestamp ? new Date(comment.timestamp).toLocaleString(undefined, { dateStyle: 'short', timeStyle: 'short' }) : ''}
          </span>
        </div>
        <p style={{ fontFamily: F.body, fontSize: '14px', color: C.textPrimary, margin: 0, lineHeight: 1.5 }}>
          {comment.body}
        </p>
        {tagStyle && comment.actionTag && (
          <span
            style={{
              display: 'inline-block',
              marginTop: S[2],
              padding: `2px ${S[2]}`,
              borderRadius: R.pill,
              fontSize: '10px',
              fontWeight: 600,
              fontFamily: F.mono,
              backgroundColor: tagStyle.bg,
              color: tagStyle.color,
            }}
          >
            {comment.actionTag === 'approved' && 'Approved'}
            {comment.actionTag === 'changes_requested' && 'Changes requested'}
            {comment.actionTag === 'replied_to_aria' && 'Replied to Freya'}
            {comment.actionTag === 'replied_to_freya' && 'Replied to Freya'}
          </span>
        )}
        {(comment.freyaReply || comment.ariaReply) && (
          <div
            style={{
              marginTop: S[2],
              padding: S[2],
              backgroundColor: C.surface3,
              borderRadius: R.sm,
              borderLeft: `3px solid ${C.primary}`,
              fontFamily: F.body,
              fontSize: '12px',
              color: C.textSecondary,
            }}
          >
            Freya revised and suggests: {comment.body}
          </div>
        )}
        {!isFreya && onReply && (
          <button
            type="button"
            onClick={() => onReply?.(comment)}
            style={{ ...btn.ghost, fontSize: '12px', marginTop: S[2], padding: 0 }}
          >
            Reply
          </button>
        )}
      </div>
    </div>
  );
}
