/**
 * ApprovalGate — full approval workflow component for a single item needing human sign-off.
 */
import { useState } from 'react';
import useStore from '../../store/useStore';
import useToast from '../../hooks/useToast';
import { C, F, R, S, T, shadows, badge } from '../../tokens';
import AgentRoleIcon, { agentIdFromName } from './AgentRoleIcon';

const STAGES = ['draft', 'review', 'brand', 'legal', 'approved'];
const STAGE_LABELS = {
  draft: 'Draft',
  review: 'AI Review',
  brand: 'Brand',
  legal: 'Legal',
  approved: 'Approved',
  rejected: 'Rejected',
};

const TYPE_COLORS = {
  content: { bg: C.primaryGlow, color: C.primary },
  strategy: { bg: C.amberDim, color: C.amber },
  budget: { bg: C.greenDim, color: C.green },
  outreach: { bg: C.primaryGlow, color: C.secondary },
  icp: { bg: C.redDim, color: C.red },
};

// Which roles can approve which stages
const STAGE_APPROVERS = {
  draft: ['owner', 'founder', 'advisor', 'contentStrategist'],
  review: ['owner', 'founder', 'advisor', 'analyst'],
  brand: ['owner', 'founder', 'contentStrategist'],
  legal: ['owner', 'founder', 'advisor'],
  approved: [],
};

export default function ApprovalGate({
  item,
  requiredRoles = [],
  currentRole,
  onApprove,
  onReject,
  onRequestChanges,
  onEdit,
  stage = 'draft',
}) {
  const toast = useToast();
  const [contentExpanded, setContentExpanded] = useState(false);
  const [comment, setComment] = useState('');
  const [commentFocus, setCommentFocus] = useState(false);

  if (!item) return null;

  const typeStyle = TYPE_COLORS[item.type] || TYPE_COLORS.content;
  const currentStageIndex = STAGES.indexOf(stage);
  const isRejected = stage === 'rejected';

  // Can current role approve this stage?
  const canApprove = !isRejected &&
    stage !== 'approved' &&
    (STAGE_APPROVERS[stage] || []).includes(currentRole);

  const contentPreview = item.content
    ? item.content.slice(0, 200)
    : '(no content preview)';
  const hasMoreContent = item.content && item.content.length > 200;

  const handleApprove = () => {
    toast.success(`Approved: ${item.title}`);
    onApprove?.(item);
  };
  const handleReject = () => {
    toast.error(`Rejected: ${item.title}`);
    onReject?.(item);
  };
  const handleRequestChanges = () => {
    toast.warning(`Changes requested on: ${item.title}`);
    onRequestChanges?.(item);
  };
  const handleEdit = () => {
    toast.info(`Edit mode for: ${item.title} (mock inline editor)`);
    onEdit?.(item);
  };
  const handleForward = () => {
    toast.info(`Forwarded ${item.title} for approval`);
  };
  const handleAddComment = () => {
    if (!comment.trim()) return;
    toast.success('Comment added');
    setComment('');
  };

  return (
    <div style={{
      backgroundColor: C.surface,
      border: `1px solid ${C.border}`,
      borderRadius: R.card,
      overflow: 'hidden',
      boxShadow: shadows.card,
    }}>
      {/* 1. Header */}
      <div style={{
        padding: `${S[3]} ${S[4]}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: S[3],
        borderBottom: `1px solid ${C.border}`,
        flexWrap: 'wrap',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: S[3], flexWrap: 'wrap' }}>
          {/* Type badge */}
          <span style={{
            ...badge.base,
            backgroundColor: typeStyle.bg,
            color: typeStyle.color,
            border: `1px solid ${typeStyle.color}`,
          }}>
            {(item.type || 'content').toUpperCase()}
          </span>

          {/* Title */}
          <span style={{ fontFamily: F.display, fontSize: '15px', fontWeight: 700, color: C.textPrimary }}>
            {item.title}
          </span>

          {/* Produced by chip */}
          {item.producedBy && (
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: `1px ${S[2]}`,
              backgroundColor: C.surface2,
              border: `1px solid ${C.border}`,
              borderRadius: R.pill,
              fontFamily: F.mono,
              fontSize: '11px',
              color: C.textMuted,
            }}>
              {(() => {
                const aid = item.producedByAgentId || agentIdFromName(item.producedBy);
                return aid ? <AgentRoleIcon agentId={aid} size={12} color={C.textMuted} /> : null;
              })()}
              {item.producedBy}
            </span>
          )}
        </div>

        {/* Confidence score */}
        {item.metadata?.confidence !== undefined && (
          <div style={{ display: 'flex', alignItems: 'center', gap: S[1] }}>
            <span style={{ fontFamily: F.mono, fontSize: '11px', color: C.textMuted }}>Confidence</span>
            <span style={{
              fontFamily: F.mono,
              fontSize: '13px',
              fontWeight: 700,
              color: item.metadata.confidence >= 0.8 ? C.green : item.metadata.confidence >= 0.6 ? C.amber : C.red,
            }}>
              {Math.round((item.metadata.confidence || 0) * 100)}%
            </span>
          </div>
        )}
      </div>

      {/* 2. Stage progress bar */}
      <div style={{ padding: `${S[3]} ${S[4]}`, borderBottom: `1px solid ${C.border}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
          {STAGES.map((s, i) => {
            const isCurrent = s === stage && !isRejected;
            const isPast = currentStageIndex > i && !isRejected;
            const color = isPast ? C.green : isCurrent ? C.primary : C.textMuted;
            const bgColor = isPast ? C.greenDim : isCurrent ? C.primaryGlow : C.surface2;
            return (
              <div key={s} style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '3px',
                  flex: 1,
                }}>
                  <div style={{
                    width: '22px',
                    height: '22px',
                    borderRadius: '50%',
                    backgroundColor: bgColor,
                    border: `2px solid ${color}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: F.mono,
                    fontSize: '10px',
                    fontWeight: 700,
                    color,
                    transition: T.color,
                  }}>
                    {isPast ? '✓' : i + 1}
                  </div>
                  <span style={{
                    fontFamily: F.body,
                    fontSize: '10px',
                    color,
                    fontWeight: isCurrent ? 700 : 400,
                    whiteSpace: 'nowrap',
                  }}>
                    {STAGE_LABELS[s]}
                  </span>
                </div>
                {i < STAGES.length - 1 && (
                  <div style={{
                    height: '2px',
                    flex: 1,
                    backgroundColor: isPast ? C.green : C.border,
                    marginTop: '-14px',
                    transition: T.color,
                  }} />
                )}
              </div>
            );
          })}
          {isRejected && (
            <div style={{ marginLeft: S[3], display: 'flex', alignItems: 'center', gap: S[1] }}>
              <span style={{ ...badge.base, ...badge.red }}>REJECTED</span>
            </div>
          )}
        </div>
      </div>

      {/* 3. Content preview */}
      <div style={{ padding: `${S[3]} ${S[4]}`, borderBottom: `1px solid ${C.border}` }}>
        <div style={{
          backgroundColor: C.surface2,
          border: `1px solid ${C.border}`,
          borderRadius: R.md,
          padding: S[3],
          fontFamily: F.body,
          fontSize: '13px',
          color: C.textSecondary,
          lineHeight: 1.6,
        }}>
          {contentExpanded ? item.content : contentPreview}
          {hasMoreContent && !contentExpanded && '…'}
        </div>
        {hasMoreContent && (
          <button
            type="button"
            onClick={() => setContentExpanded((e) => !e)}
            style={{
              marginTop: S[2],
              background: 'none',
              border: 'none',
              color: C.primary,
              fontFamily: F.body,
              fontSize: '12px',
              cursor: 'pointer',
              padding: 0,
            }}
          >
            {contentExpanded ? 'Show less' : 'Show full content'}
          </button>
        )}
      </div>

      {/* 4. Metadata chips */}
      {item.metadata && (
        <div style={{
          padding: `${S[2]} ${S[4]}`,
          display: 'flex',
          alignItems: 'center',
          gap: S[2],
          flexWrap: 'wrap',
          borderBottom: `1px solid ${C.border}`,
        }}>
          {Object.entries(item.metadata).map(([key, val]) => (
            <span key={key} style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: S[1],
              padding: `2px ${S[2]}`,
              backgroundColor: C.surface2,
              border: `1px solid ${C.border}`,
              borderRadius: R.pill,
              fontFamily: F.mono,
              fontSize: '11px',
              color: C.textMuted,
            }}>
              <span style={{ textTransform: 'capitalize', color: C.textSecondary }}>
                {key.replace(/_/g, ' ')}:
              </span>
              <span style={{ color: C.textPrimary, fontWeight: 600 }}>
                {typeof val === 'number' && key.toLowerCase().includes('confidence')
                  ? `${Math.round(val * 100)}%`
                  : String(val)}
              </span>
            </span>
          ))}
        </div>
      )}

      {/* 5. Action buttons */}
      <div style={{
        padding: `${S[3]} ${S[4]}`,
        display: 'flex',
        alignItems: 'center',
        gap: S[2],
        flexWrap: 'wrap',
        borderBottom: `1px solid ${C.border}`,
      }}>
        {canApprove ? (
          <>
            <button
              type="button"
              onClick={handleApprove}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: S[1],
                padding: `${S[2]} ${S[4]}`,
                backgroundColor: C.primary,
                color: C.textInverse,
                border: 'none',
                borderRadius: R.button,
                fontFamily: F.body,
                fontSize: '13px',
                fontWeight: 700,
                cursor: 'pointer',
                transition: T.color,
              }}
            >
              ✓ Approve
            </button>
            <button
              type="button"
              onClick={handleReject}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: S[1],
                padding: `${S[2]} ${S[4]}`,
                backgroundColor: 'transparent',
                color: C.red,
                border: `1px solid ${C.red}`,
                borderRadius: R.button,
                fontFamily: F.body,
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: T.color,
              }}
            >
              ✕ Reject
            </button>
            <button
              type="button"
              onClick={handleRequestChanges}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: S[1],
                padding: `${S[2]} ${S[4]}`,
                backgroundColor: 'transparent',
                color: C.amber,
                border: `1px solid ${C.amber}`,
                borderRadius: R.button,
                fontFamily: F.body,
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: T.color,
              }}
            >
              ⟳ Request Changes
            </button>
          </>
        ) : (
          <>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: S[1],
              padding: `${S[2]} ${S[3]}`,
              backgroundColor: C.surface2,
              color: C.textMuted,
              border: `1px solid ${C.border}`,
              borderRadius: R.button,
              fontFamily: F.body,
              fontSize: '13px',
            }}>
              👁 View Only
            </span>
            <button
              type="button"
              onClick={handleForward}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: S[1],
                padding: `${S[2]} ${S[4]}`,
                backgroundColor: 'transparent',
                color: C.textSecondary,
                border: `1px solid ${C.border}`,
                borderRadius: R.button,
                fontFamily: F.body,
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: T.color,
              }}
            >
              Forward for approval
            </button>
          </>
        )}

        {/* Edit button (always visible) */}
        <button
          type="button"
          onClick={handleEdit}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: S[1],
            padding: `${S[2]} ${S[3]}`,
            backgroundColor: 'transparent',
            color: C.textMuted,
            border: 'none',
            borderRadius: R.button,
            fontFamily: F.body,
            fontSize: '13px',
            cursor: 'pointer',
            transition: T.color,
            marginLeft: 'auto',
          }}
        >
          ✏ Edit
        </button>
      </div>

      {/* 6. Comment thread */}
      <div style={{ padding: `${S[3]} ${S[4]}` }}>
        <div style={{
          fontFamily: F.body,
          fontSize: '12px',
          fontWeight: 600,
          color: C.textMuted,
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
          marginBottom: S[2],
        }}>
          Comments
        </div>
        <div style={{ display: 'flex', gap: S[2] }}>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            onFocus={() => setCommentFocus(true)}
            onBlur={() => setCommentFocus(false)}
            placeholder="Add a comment…"
            rows={2}
            style={{
              flex: 1,
              resize: 'vertical',
              backgroundColor: C.surface2,
              color: C.textPrimary,
              border: `1px solid ${commentFocus ? C.primary : C.border}`,
              borderRadius: R.input,
              padding: S[2],
              fontFamily: F.body,
              fontSize: '13px',
              outline: 'none',
              transition: T.color,
            }}
          />
          <button
            type="button"
            onClick={handleAddComment}
            disabled={!comment.trim()}
            style={{
              padding: `${S[2]} ${S[3]}`,
              backgroundColor: C.primary,
              color: C.textInverse,
              border: 'none',
              borderRadius: R.button,
              fontFamily: F.body,
              fontSize: '13px',
              fontWeight: 600,
              cursor: comment.trim() ? 'pointer' : 'not-allowed',
              opacity: comment.trim() ? 1 : 0.5,
              alignSelf: 'flex-end',
              transition: T.color,
              whiteSpace: 'nowrap',
            }}
          >
            Add comment
          </button>
        </div>
      </div>
    </div>
  );
}
