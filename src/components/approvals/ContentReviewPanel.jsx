/**
 * Right column: selected item header, content preview, Freya compliance score, review actions, comments, history.
 */
import { useState } from 'react';
import useStore from '../../store/useStore';
import useToast from '../../hooks/useToast';
import { C, F, R, S, btn } from '../../tokens';
import { CONTENT_TYPES } from '../../data/approvalsMock';
import ApprovalChainTracker from './ApprovalChainTracker';
import ReviewCommentThread from './ReviewCommentThread';
import ApprovalHistoryLog from './ApprovalHistoryLog';

const STAGE_NEXT_LABEL = {
  legal: 'Brand Review',
  brand: 'CMO',
  cmo: 'Publish',
  draft: 'Legal Review',
};

const STAGE_ORDER = ['draft', 'legal', 'brand', 'cmo', 'published'];

function getNextStage(current) {
  const i = STAGE_ORDER.indexOf(current);
  return i < STAGE_ORDER.length - 1 ? STAGE_ORDER[i + 1] : null;
}

export default function ContentReviewPanel({ item, onStageChange }) {
  const toast = useToast();
  const addApprovalItemComment = useStore((s) => s.addApprovalItemComment);
  const updateApprovalItem = useStore((s) => s.updateApprovalItem);

  const [comment, setComment] = useState('');
  const [historyOpen, setHistoryOpen] = useState(true);
  const [rejectConfirm, setRejectConfirm] = useState(false);

  if (!item) {
    return (
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: S[4],
          padding: S[6],
          backgroundColor: C.bg,
        }}
      >
        <div style={{ width: 48, height: 48, color: C.textMuted }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 6v6l4 2" />
          </svg>
        </div>
        <p style={{ fontFamily: F.body, fontSize: '14px', color: C.textMuted, margin: 0 }}>
          Select a content item to review
        </p>
      </div>
    );
  }

  const nextStage = getNextStage(item.stage);
  const nextLabel = nextStage ? STAGE_NEXT_LABEL[item.stage] : null;
  const complianceScore = item.complianceScore ?? 0;
  const complianceColor = complianceScore >= 70 ? C.primary : complianceScore >= 50 ? C.amber : C.red;

  const handleApprove = () => {
    if (!nextStage) {
      updateApprovalItem(item.id, { stage: 'published' });
      toast.success('Published. Content is live.');
    } else {
      updateApprovalItem(item.id, { stage: nextStage });
      const nextReviewer = nextStage === 'brand' ? 'Emma Chen' : nextStage === 'cmo' ? 'You' : 'Freya';
      toast.success(`Approved. Sent to ${nextLabel}. ${nextReviewer} notified.`);
    }
    onStageChange?.();
  };

  const handleRequestRevision = () => {
    if (!comment.trim()) {
      toast.info('Add revision notes before submitting.');
      return;
    }
    addApprovalItemComment(item.id, { author: 'You', role: 'Reviewer', text: comment });
    setComment('');
    toast.success('Revision requested. Author notified.');
  };

  const handleReject = () => {
    if (!rejectConfirm) {
      setRejectConfirm(true);
      return;
    }
    updateApprovalItem(item.id, { rejected: true });
    setRejectConfirm(false);
    toast.success('Content rejected.');
    onStageChange?.();
  };

  const typeLabel = CONTENT_TYPES[item.contentType]?.label || item.contentType;
  const preview = item.contentPreview || {};

  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        gap: S[5],
        padding: S[5],
        backgroundColor: C.bg,
        overflowY: 'auto',
      }}
    >
      {/* Header */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: S[2], flexWrap: 'wrap', marginBottom: S[2] }}>
          <h2 style={{ fontFamily: F.display, fontSize: '20px', fontWeight: 700, color: C.textPrimary, margin: 0 }}>
            {item.title}
          </h2>
          <span style={{ fontFamily: F.mono, fontSize: '11px', padding: '2px 8px', borderRadius: R.pill, backgroundColor: C.surface3, color: C.textSecondary }}>
            {item.campaignName}
          </span>
          <span style={{ fontFamily: F.mono, fontSize: '11px', padding: '2px 8px', borderRadius: R.pill, backgroundColor: C.surface3, color: C.textMuted }}>
            {typeLabel}
          </span>
        </div>
        <p style={{ fontFamily: F.body, fontSize: '12px', color: C.textMuted, margin: 0 }}>
          Created by {item.createdBy}
        </p>
        <div style={{ marginTop: S[3] }}>
          <ApprovalChainTracker currentStage={item.stage} rejected={item.rejected} variant="full" />
        </div>
      </div>

      {/* Content preview */}
      <div
        style={{
          padding: S[4],
          backgroundColor: C.surface,
          border: `1px solid ${C.border}`,
          borderRadius: R.card,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: S[3] }}>
          <span style={{ fontFamily: F.body, fontSize: '12px', fontWeight: 600, color: C.textSecondary }}>
            Content preview
          </span>
          <button type="button" style={{ ...btn.ghost, fontSize: '12px' }} onClick={() => toast.info('Edit content (mock)')}>
            Edit content
          </button>
        </div>
        {item.contentType === 'email' && (
          <div>
            {preview.subject && (
              <p style={{ fontFamily: F.body, fontSize: '13px', fontWeight: 600, color: C.textPrimary, margin: `0 0 ${S[2]} 0` }}>
                Subject: {preview.subject}
              </p>
            )}
            <p style={{ fontFamily: F.body, fontSize: '13px', color: C.textSecondary, lineHeight: 1.6, margin: 0, whiteSpace: 'pre-wrap' }}>
              {preview.body}
            </p>
          </div>
        )}
        {(item.contentType === 'ad' || item.contentType === 'landing_page') && (
          <div>
            {preview.headline && (
              <p style={{ fontFamily: F.body, fontSize: '14px', fontWeight: 600, color: C.textPrimary, margin: `0 0 ${S[2]} 0` }}>
                {preview.headline}
              </p>
            )}
            {preview.body && (
              <p style={{ fontFamily: F.body, fontSize: '13px', color: C.textSecondary, lineHeight: 1.5, margin: `0 0 ${S[2]} 0` }}>
                {preview.body}
              </p>
            )}
            {preview.cta && (
              <span
                style={{
                  display: 'inline-block',
                  padding: `${S[2]} ${S[4]}`,
                  fontFamily: F.body,
                  fontSize: '12px',
                  fontWeight: 600,
                  color: C.textInverse,
                  backgroundColor: C.primary,
                  borderRadius: R.button,
                }}
              >
                {preview.cta}
              </span>
            )}
          </div>
        )}
        {item.contentType === 'social' && (
          <p style={{ fontFamily: F.body, fontSize: '13px', color: C.textSecondary, lineHeight: 1.6, margin: 0, whiteSpace: 'pre-wrap' }}>
            {preview.body}
          </p>
        )}
      </div>

      {/* Freya compliance score */}
      <div>
        <span style={{ fontFamily: F.body, fontSize: '12px', fontWeight: 600, color: C.textSecondary }}>
          Freya compliance
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: S[3], marginTop: S[2] }}>
          <div
            style={{
              flex: 1,
              height: 8,
              borderRadius: R.pill,
              backgroundColor: C.surface3,
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                width: `${complianceScore}%`,
                height: '100%',
                backgroundColor: complianceColor,
                borderRadius: R.pill,
                transition: 'width 0.3s ease',
              }}
            />
          </div>
          <span style={{ fontFamily: F.mono, fontSize: '13px', fontWeight: 700, color: complianceColor }}>
            {complianceScore}/100
          </span>
        </div>
        {complianceScore < 70 && (
          <p style={{ fontFamily: F.body, fontSize: '12px', color: C.amber, margin: `${S[2]} 0 0`, marginTop: S[2] }}>
            Freya flagged items for review. Check tone and claims.
          </p>
        )}
      </div>

      {/* Review actions */}
      <div
        style={{
          padding: S[4],
          backgroundColor: C.surface2,
          border: `1px solid ${C.border}`,
          borderRadius: R.card,
        }}
      >
        <div style={{ fontFamily: F.body, fontSize: '12px', fontWeight: 600, color: C.textSecondary, marginBottom: S[3] }}>
          Your review
        </div>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Add review notes or revision requests..."
          rows={3}
          style={{
            width: '100%',
            padding: S[3],
            fontFamily: F.body,
            fontSize: '13px',
            color: C.textPrimary,
            backgroundColor: C.surface,
            border: `1px solid ${C.border}`,
            borderRadius: R.input,
            outline: 'none',
            resize: 'vertical',
            marginBottom: S[3],
          }}
        />
        <ReviewCommentThread comments={item.comments} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: S[2], marginTop: S[4] }}>
          <button type="button" onClick={handleApprove} disabled={item.stage === 'published'} style={btn.primary}>
            {nextLabel ? `Approve & Pass to ${nextLabel}` : 'Publish'}
          </button>
          <button type="button" onClick={handleRequestRevision} style={btn.secondary}>
            Request Revision
          </button>
          {rejectConfirm ? (
            <div style={{ display: 'flex', gap: S[2] }}>
              <button type="button" onClick={() => setRejectConfirm(false)} style={btn.ghost}>
                Cancel
              </button>
              <button type="button" onClick={handleReject} style={btn.danger}>
                Confirm reject
              </button>
            </div>
          ) : (
            <button type="button" onClick={handleReject} style={{ ...btn.ghost, color: C.red }}>
              Reject content
            </button>
          )}
        </div>
      </div>

      {/* Approval history (collapsible) */}
      <div>
        <button
          type="button"
          onClick={() => setHistoryOpen(!historyOpen)}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            padding: S[2],
            fontFamily: F.body,
            fontSize: '12px',
            fontWeight: 600,
            color: C.textSecondary,
            backgroundColor: 'transparent',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          Approval history
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ transform: historyOpen ? 'rotate(180deg)' : 'rotate(0)' }}>
            <path d="M6 9l6 6 6-6" />
          </svg>
        </button>
        {historyOpen && (
          <div style={{ padding: S[3], backgroundColor: C.surface, border: `1px solid ${C.border}`, borderRadius: R.md }}>
            <ApprovalHistoryLog history={item.history} />
          </div>
        )}
      </div>
    </div>
  );
}
