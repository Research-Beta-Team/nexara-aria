import { useState, useRef, useEffect } from 'react';
import { C, F, R, S, Z, btn, inputStyle, scrollbarStyle } from '../../tokens';
import { TYPE_COLORS } from '../../config/channelBrands';
import { IconClose, IconCheck, IconCircleEmpty, IconSend, IconLinkedIn, IconFacebook, IconWhatsApp } from '../ui/Icons';
import ApprovalStatusBadge from './ApprovalStatusBadge';
import ApprovalComment from './ApprovalComment';
import ReviewerAvatarRow from './ReviewerAvatarRow';

const TYPE_ICONS = {
  Email: (color) => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="M2 8l10 6 10-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  LinkedIn: (color) => <IconLinkedIn color={color} width={18} height={18} />,
  'LinkedIn Ad': (color) => <IconLinkedIn color={color} width={18} height={18} />,
  'Meta Ad': (color) => <IconFacebook color={color} width={18} height={18} />,
  Strategy: (color) => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5">
      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  Script: (color) => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5">
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
      <path d="M14 2v6h6M10 13H8M16 13h-2M10 17H8M16 17h-2" strokeLinecap="round" />
    </svg>
  ),
  WhatsApp: (color) => <IconWhatsApp color={color} width={18} height={18} />,
};

const defaultTypeIcon = (color) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5">
    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
    <path d="M14 2v6h6M8 13h8M8 17h4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default function ApprovalThreadPanel({ contentItem, reviewers: reviewerList, onClose, onStatusChange, onAddComment, toast }) {
  const [commentDraft, setCommentDraft] = useState('');
  const [showAriaPrompt, setShowAriaPrompt] = useState(false);
  const [ariaPromptText, setAriaPromptText] = useState('');
  const [expandedPreview, setExpandedPreview] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (contentItem && scrollRef.current) scrollRef.current.scrollTop = 0;
  }, [contentItem?.contentId]);

  if (!contentItem) return null;

  const { contentId, type, title, body, status, reviewers, comments = [], statusUpdatedAt, generatedBy, generatedAt, campaignName } = contentItem;
  const typeColor = TYPE_COLORS[type] || C.textSecondary;
  const TypeIcon = TYPE_ICONS[type] ?? defaultTypeIcon;
  const previewLength = 200;
  const showExpand = body && body.length > previewLength && !expandedPreview;

  const getReviewer = (id) => reviewerList?.find((r) => r.id === id) ?? { name: id, initials: '?' };

  const handleApprove = () => {
    onStatusChange?.(contentId, 'approved');
    onAddComment?.(contentId, { authorId: 'current', body: 'Approved ✓', actionTag: 'approved' });
    toast?.success('Content approved');
    setCommentDraft('');
  };

  const handleRequestChanges = () => {
    onStatusChange?.(contentId, 'revision_requested');
    if (commentDraft.trim()) {
      onAddComment?.(contentId, { authorId: 'current', body: commentDraft.trim(), actionTag: 'changes_requested' });
      setCommentDraft('');
    }
    toast?.info('Revision requested');
  };

  const handleAskAria = () => {
    if (!ariaPromptText.trim()) return;
    onAddComment?.(contentId, {
      authorId: 'aria',
      body: `Revised based on feedback: "${ariaPromptText.trim()}". Here is the updated version: [Revised content would appear here.]`,
      actionTag: 'replied_to_aria',
      ariaReply: true,
    });
    setAriaPromptText('');
    setShowAriaPrompt(false);
    toast?.success('Sent to Freya for revision');
  };

  const handlePublish = () => {
    onStatusChange?.(contentId, 'published');
    toast?.success('Content published');
  };

  const handleAddReviewer = () => {
    toast?.success('Reviewer added');
  };

  const timelineSteps = [
    { done: true, label: 'Draft created by Freya Copywriter', date: contentItem.createdAt },
    { done: true, label: 'Submitted for review by Asif', date: contentItem.submittedAt },
    { done: status !== 'in_review', label: 'Badhon requested changes', date: status === 'revision_requested' ? statusUpdatedAt : null },
    { done: status === 'approved' || status === 'published', label: 'Final approval' },
  ];

  return (
    <>
      <style>{`
        @keyframes panelSlideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
      `}</style>
      <div
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          width: 440,
          maxWidth: '100%',
          height: '100vh',
          backgroundColor: C.surface,
          borderLeft: `1px solid ${C.border}`,
          zIndex: Z.modal,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          animation: 'panelSlideIn 0.22s ease-out',
          boxShadow: '-4px 0 24px rgba(0,0,0,0.3)',
        }}
      >
        {/* Header */}
        <div style={{ padding: S[4], borderBottom: `1px solid ${C.border}`, flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: S[2] }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: S[2], flexWrap: 'wrap' }}>
              <span style={{ color: typeColor }}>{TypeIcon(typeColor)}</span>
              <span style={{ fontFamily: F.mono, fontSize: '11px', color: C.textMuted, backgroundColor: C.surface2, padding: `2px ${S[2]}`, borderRadius: R.sm }}>
                {contentId}
              </span>
            </div>
            <button type="button" style={{ ...btn.icon }} onClick={onClose} aria-label="Close"><IconClose color={C.textSecondary} width={18} height={18} /></button>
          </div>
          <h2 style={{ fontFamily: F.body, fontSize: '16px', fontWeight: 700, color: C.textPrimary, margin: `${S[2]} 0 ${S[2]} 0` }}>
            {title}
          </h2>
          <ApprovalStatusBadge status={status} sinceDate={statusUpdatedAt} />
        </div>

        {/* Scrollable body */}
        <div ref={scrollRef} style={{ flex: 1, overflowY: 'auto', ...scrollbarStyle }}>
          {/* Content preview */}
          {body && (
            <div style={{ padding: S[4], borderBottom: `1px solid ${C.border}` }}>
              <div
                style={{
                  backgroundColor: C.surface2,
                  border: `1px solid ${C.border}`,
                  borderRadius: R.md,
                  padding: S[3],
                  fontFamily: F.mono,
                  fontSize: '12px',
                  color: C.textPrimary,
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                  maxHeight: expandedPreview ? 'none' : 120,
                  overflow: 'hidden',
                }}
              >
                {expandedPreview ? body : body.slice(0, previewLength)}
                {showExpand && '…'}
              </div>
              {showExpand && (
                <button type="button" style={{ ...btn.ghost, fontSize: '12px', marginTop: S[2] }} onClick={() => setExpandedPreview(true)}>
                  View full content
                </button>
              )}
              {generatedBy && (
                <div style={{ fontFamily: F.body, fontSize: '11px', color: C.textMuted, marginTop: S[2] }}>
                  Generated by {generatedBy} · {generatedAt || contentItem.createdAt}
                </div>
              )}
            </div>
          )}

          {/* Reviewer row */}
          <div style={{ padding: S[4], borderBottom: `1px solid ${C.border}` }}>
            <div style={{ fontFamily: F.mono, fontSize: '10px', fontWeight: 700, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: S[2] }}>
              Reviewers
            </div>
            <ReviewerAvatarRow reviewers={reviewers} reviewerList={reviewerList} onAddReviewer={handleAddReviewer} />
          </div>

          {/* Status timeline */}
          <div style={{ padding: S[4], borderBottom: `1px solid ${C.border}` }}>
            <div style={{ fontFamily: F.mono, fontSize: '10px', fontWeight: 700, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: S[2] }}>
              Status
            </div>
            <div style={{ borderLeft: `2px solid ${C.border}`, paddingLeft: S[4] }}>
              {timelineSteps.filter((s) => s.date || s.done).map((step, i) => (
                <div key={i} style={{ position: 'relative', paddingBottom: S[3] }}>
                  <span
                    style={{
                      position: 'absolute',
                      left: -S[4],
                      width: 10,
                      height: 10,
                      borderRadius: '50%',
                      backgroundColor: step.done ? C.primary : C.surface3,
                      border: `2px solid ${step.done ? C.primary : C.border}`,
                      transform: 'translate(-50%, 2px)',
                    }}
                  />
                  <div style={{ fontFamily: F.body, fontSize: '12px', color: step.done ? C.textPrimary : C.textMuted, display: 'flex', alignItems: 'center', gap: S[1] }}>
                    {step.done ? <IconCheck color={C.primary} width={14} height={14} /> : <IconCircleEmpty color={C.border} width={14} height={14} />}
                    {step.label}
                    {step.date && <span style={{ color: C.textMuted }}> · {step.date}</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Comment thread */}
          <div style={{ padding: S[4] }}>
            <div style={{ fontFamily: F.mono, fontSize: '10px', fontWeight: 700, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: S[2] }}>
              Comments
            </div>
            {comments.length === 0 ? (
              <p style={{ fontFamily: F.body, fontSize: '13px', color: C.textMuted, margin: 0 }}>No comments yet.</p>
            ) : (
              comments.map((c) => (
                <ApprovalComment
                  key={c.id}
                  comment={c}
                  reviewer={getReviewer(c.authorId)}
                  onReply={() => setCommentDraft(`@${getReviewer(c.authorId)?.name} `)}
                />
              ))
            )}
          </div>
        </div>

        {/* Add comment — sticky bottom */}
        <div style={{ padding: S[4], borderTop: `1px solid ${C.border}`, backgroundColor: C.surface, flexShrink: 0 }}>
          {showAriaPrompt ? (
            <div style={{ marginBottom: S[3] }}>
              <label style={{ fontFamily: F.body, fontSize: '12px', fontWeight: 600, color: C.textSecondary, display: 'block', marginBottom: S[1] }}>
                Tell Freya what to change:
              </label>
              <textarea
                value={ariaPromptText}
                onChange={(e) => setAriaPromptText(e.target.value)}
                placeholder="e.g. Make the opening line more specific to Vietnam textile industry"
                style={{ ...inputStyle, minHeight: 60, resize: 'vertical', marginBottom: S[2] }}
              />
              <div style={{ display: 'flex', gap: S[2] }}>
                <button type="button" style={{ ...btn.primary, fontSize: '12px' }} onClick={handleAskAria}>
                  Send to Freya
                </button>
                <button type="button" style={{ ...btn.ghost, fontSize: '12px' }} onClick={() => { setShowAriaPrompt(false); setAriaPromptText(''); }}>
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              <textarea
                value={commentDraft}
                onChange={(e) => setCommentDraft(e.target.value)}
                placeholder="Add a comment or feedback..."
                style={{ ...inputStyle, minHeight: 56, resize: 'vertical', marginBottom: S[2] }}
              />
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: S[2] }}>
                <button type="button" style={{ ...btn.primary, fontSize: '12px' }} onClick={handleApprove}>
                  <IconCheck color="currentColor" width={14} height={14} />
                  Approve
                </button>
                <button type="button" style={{ ...btn.danger, fontSize: '12px' }} onClick={handleRequestChanges}>
                  <IconClose color="currentColor" width={14} height={14} />
                  Request changes
                </button>
                <button type="button" style={{ ...btn.secondary, fontSize: '12px' }} onClick={() => setShowAriaPrompt(true)}>
                  ↩ Ask Freya to revise
                </button>
                <button type="button" style={{ ...btn.secondary, fontSize: '12px' }} onClick={handlePublish}>
                  <IconSend color="currentColor" width={14} height={14} />
                  Publish now
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
