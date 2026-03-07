import { useState, useMemo } from 'react';
import { C, F, R, S, btn } from '../../tokens';
import { TYPE_COLORS } from '../../config/channelBrands';
import { IconLinkedIn, IconFacebook, IconWhatsApp } from '../ui/Icons';
import { daysInStatus, isRecentlyApproved } from '../../data/approvals';
import ApprovalStatusBadge from './ApprovalStatusBadge';
import ReviewerAvatarRow from './ReviewerAvatarRow';
import ApprovalThreadPanel from './ApprovalThreadPanel';

const TYPE_ICONS = {
  Email: (color) => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="M2 8l10 6 10-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  LinkedIn: (color) => <IconLinkedIn color={color} width={14} height={14} />,
  'LinkedIn Ad': (color) => <IconLinkedIn color={color} width={14} height={14} />,
  'Meta Ad': (color) => <IconFacebook color={color} width={14} height={14} />,
  Strategy: (color) => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5">
      <path d="M12 2L2 7l10 5 10-5-10-5z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  Script: (color) => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5">
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
      <path d="M8 13h8M8 17h4" strokeLinecap="round" />
    </svg>
  ),
  WhatsApp: (color) => <IconWhatsApp color={color} width={14} height={14} />,
};

const defaultIcon = (color) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5">
    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
  </svg>
);

function QueueRow({ item, reviewers, onOpen }) {
  const typeColor = TYPE_COLORS[item.type] || C.textSecondary;
  const TypeIcon = TYPE_ICONS[item.type] ?? defaultIcon;
  const days = daysInStatus(item.statusUpdatedAt);

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: S[4],
        padding: S[4],
        borderBottom: `1px solid ${C.border}`,
        backgroundColor: C.surface,
        transition: 'background-color 0.15s ease',
      }}
    >
      <span style={{ fontFamily: F.mono, fontSize: '11px', color: C.textMuted, backgroundColor: C.surface2, padding: `2px ${S[2]}`, borderRadius: R.sm, flexShrink: 0 }}>
        {item.contentId}
      </span>
      <span style={{ color: typeColor, flexShrink: 0 }}>{TypeIcon(typeColor)}</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: F.body, fontSize: '13px', fontWeight: 600, color: C.textPrimary, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {item.title}
        </div>
        <div style={{ fontFamily: F.body, fontSize: '11px', color: C.textMuted }}>{item.campaignName}</div>
      </div>
      <div style={{ flexShrink: 0, maxWidth: 120 }}>
        <ReviewerAvatarRow reviewers={item.reviewers} reviewerList={reviewers} />
      </div>
      <ApprovalStatusBadge status={item.status} compact />
      <span style={{ fontFamily: F.mono, fontSize: '11px', color: C.textMuted, flexShrink: 0 }}>
        {days}d
      </span>
      <button type="button" style={{ ...btn.secondary, fontSize: '12px', flexShrink: 0 }} onClick={() => onOpen(item.contentId)}>
        Open
      </button>
    </div>
  );
}

export default function ContentApprovalQueue({
  items = [],
  reviewers,
  openApprovalId,
  onOpenThread,
  onCloseThread,
  onStatusChange,
  onAddComment,
  toast,
}) {
  const safeItems = Array.isArray(items) ? items : [];
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterCampaign, setFilterCampaign] = useState('All');
  const [recentApprovedCollapsed, setRecentApprovedCollapsed] = useState(false);

  const campaigns = useMemo(() => {
    const set = new Set(safeItems.map((i) => i.campaignName).filter(Boolean));
    return [...set].sort();
  }, [safeItems]);

  const filtered = useMemo(() => {
    let list = safeItems;
    if (filterStatus !== 'All') {
      if (filterStatus === 'Needs Review') list = list.filter((i) => i.status === 'in_review');
      else if (filterStatus === 'In Revision') list = list.filter((i) => i.status === 'revision_requested');
      else if (filterStatus === 'Approved') list = list.filter((i) => i.status === 'approved');
      else if (filterStatus === 'Published') list = list.filter((i) => i.status === 'published');
      else if (filterStatus === 'Draft') list = list.filter((i) => i.status === 'draft');
    }
    if (filterCampaign !== 'All') list = list.filter((i) => i.campaignName === filterCampaign);
    return list;
  }, [safeItems, filterStatus, filterCampaign]);

  const needsReview = useMemo(() => filtered.filter((i) => i.status === 'in_review').sort((a, b) => (a.statusUpdatedAt || '').localeCompare(b.statusUpdatedAt || '')), [filtered]);
  const revisionRequested = useMemo(() => filtered.filter((i) => i.status === 'revision_requested'), [filtered]);
  const recentlyApproved = useMemo(() => filtered.filter(isRecentlyApproved), [filtered]);
  const draftItems = useMemo(() => filtered.filter((i) => i.status === 'draft'), [filtered]);
  const publishedItems = useMemo(() => filtered.filter((i) => i.status === 'published'), [filtered]);
  const otherApproved = useMemo(() => filtered.filter((i) => i.status === 'approved' && !isRecentlyApproved(i)), [filtered]);

  const openItem = safeItems.find((i) => i.contentId === openApprovalId);

  return (
    <>
      {/* Filter bar */}
      <div style={{ display: 'flex', gap: S[2], flexWrap: 'wrap', marginBottom: S[4], alignItems: 'center' }}>
        {['All', 'Needs Review', 'In Revision', 'Approved', 'Published', 'Draft'].map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilterStatus(f)}
            style={{
              ...btn.ghost,
              fontSize: '12px',
              borderBottom: `2px solid ${filterStatus === f ? C.primary : 'transparent'}`,
              borderRadius: 0,
              color: filterStatus === f ? C.primary : C.textSecondary,
            }}
          >
            {f}
          </button>
        ))}
        <select
          value={filterCampaign}
          onChange={(e) => setFilterCampaign(e.target.value)}
          style={{
            marginLeft: S[2],
            backgroundColor: C.surface2,
            color: C.textPrimary,
            border: `1px solid ${C.border}`,
            borderRadius: R.input,
            padding: `${S[1]} ${S[3]}`,
            fontFamily: F.body,
            fontSize: '12px',
          }}
        >
          <option value="All">Filter by Campaign</option>
          {campaigns.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      {/* Needs your review */}
      {needsReview.length > 0 && (
        <section style={{ marginBottom: S[6] }}>
          <h3 style={{ fontFamily: F.body, fontSize: '13px', fontWeight: 700, color: C.textSecondary, marginBottom: S[3], textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Needs your review ({needsReview.length})
          </h3>
          <div style={{ border: `1px solid ${C.border}`, borderRadius: R.card, overflow: 'hidden' }}>
            {needsReview.map((item) => (
              <QueueRow key={item.contentId} item={item} reviewers={reviewers} onOpen={onOpenThread} />
            ))}
          </div>
        </section>
      )}

      {/* Revision requested */}
      {revisionRequested.length > 0 && (
        <section style={{ marginBottom: S[6] }}>
          <h3 style={{ fontFamily: F.body, fontSize: '13px', fontWeight: 700, color: C.textSecondary, marginBottom: S[3], textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Revision requested — waiting for Freya ({revisionRequested.length})
          </h3>
          <div style={{ border: `1px solid ${C.border}`, borderRadius: R.card, overflow: 'hidden' }}>
            {revisionRequested.map((item) => (
              <QueueRow key={item.contentId} item={item} reviewers={reviewers} onOpen={onOpenThread} />
            ))}
          </div>
        </section>
      )}

      {draftItems.length > 0 && (filterStatus === 'All' || filterStatus === 'Draft') && (
        <section style={{ marginBottom: S[6] }}>
          <h3 style={{ fontFamily: F.body, fontSize: '13px', fontWeight: 700, color: C.textSecondary, marginBottom: S[3], textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Draft ({draftItems.length})
          </h3>
          <div style={{ border: `1px solid ${C.border}`, borderRadius: R.card, overflow: 'hidden' }}>
            {draftItems.map((item) => (
              <QueueRow key={item.contentId} item={item} reviewers={reviewers} onOpen={onOpenThread} />
            ))}
          </div>
        </section>
      )}

      {/* Published */}
      {publishedItems.length > 0 && (filterStatus === 'All' || filterStatus === 'Published') && (
        <section style={{ marginBottom: S[6] }}>
          <h3 style={{ fontFamily: F.body, fontSize: '13px', fontWeight: 700, color: C.textSecondary, marginBottom: S[3], textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Published ({publishedItems.length})
          </h3>
          <div style={{ border: `1px solid ${C.border}`, borderRadius: R.card, overflow: 'hidden' }}>
            {publishedItems.map((item) => (
              <QueueRow key={item.contentId} item={item} reviewers={reviewers} onOpen={onOpenThread} />
            ))}
          </div>
        </section>
      )}

      {/* Recently approved */}
      {recentlyApproved.length > 0 && (
        <section style={{ marginBottom: S[6] }}>
          <button
            type="button"
            onClick={() => setRecentApprovedCollapsed((c) => !c)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: S[2],
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontFamily: F.body,
              fontSize: '13px',
              fontWeight: 700,
              color: C.textSecondary,
              marginBottom: S[3],
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            <span style={{ transform: recentApprovedCollapsed ? 'rotate(-90deg)' : 'none', transition: 'transform 0.2s' }}>▼</span>
            Recently approved ({recentlyApproved.length})
          </button>
          {!recentApprovedCollapsed && (
            <div style={{ border: `1px solid ${C.border}`, borderRadius: R.card, overflow: 'hidden' }}>
              {recentlyApproved.map((item) => (
                <QueueRow key={item.contentId} item={item} reviewers={reviewers} onOpen={onOpenThread} />
              ))}
            </div>
          )}
        </section>
      )}

      {/* Other approved (older than 7 days) — when filter All */}
      {otherApproved.length > 0 && (filterStatus === 'All' || filterStatus === 'Approved') && (
        <section style={{ marginBottom: S[6] }}>
          <h3 style={{ fontFamily: F.body, fontSize: '13px', fontWeight: 700, color: C.textSecondary, marginBottom: S[3], textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Approved ({otherApproved.length})
          </h3>
          <div style={{ border: `1px solid ${C.border}`, borderRadius: R.card, overflow: 'hidden' }}>
            {otherApproved.map((item) => (
              <QueueRow key={item.contentId} item={item} reviewers={reviewers} onOpen={onOpenThread} />
            ))}
          </div>
        </section>
      )}

      {filtered.length === 0 && (
        <div style={{ padding: S[8], textAlign: 'center', color: C.textMuted, fontFamily: F.body, fontSize: '14px' }}>
          No content in this filter.
        </div>
      )}

      {/* Slide-in panel */}
      <ApprovalThreadPanel
        contentItem={openItem}
        reviewers={reviewers}
        onClose={onCloseThread}
        onStatusChange={onStatusChange}
        onAddComment={onAddComment}
        toast={toast}
      />
    </>
  );
}
