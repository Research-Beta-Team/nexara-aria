/**
 * Content Approval Workflow — multi-role review chain.
 * Session 2: Two-column queue + review panel, tabs, filter, bulk actions, compliance score, comments, history.
 */
import { useState, useMemo } from 'react';
import useStore from '../store/useStore';
import useToast from '../hooks/useToast';
import { C, F, R, S } from '../tokens';
import ApprovalQueueCard from '../components/approvals/ApprovalQueueCard';
import BulkApproveBar from '../components/approvals/BulkApproveBar';
import ContentReviewPanel from '../components/approvals/ContentReviewPanel';

const TABS = [
  { id: 'needs_review', label: 'Needs Review', filter: (item) => item.stage === 'legal' && !item.rejected },
  { id: 'in_progress', label: 'In Progress', filter: (item) => (item.stage === 'brand' || item.stage === 'cmo') && !item.rejected },
  { id: 'approved', label: 'Approved', filter: (item) => item.stage === 'published' },
  { id: 'all', label: 'All', filter: () => true },
];

const CONTENT_FILTER_OPTIONS = [
  { value: 'all', label: 'All Content' },
  { value: 'ad', label: 'Ads' },
  { value: 'email', label: 'Email' },
  { value: 'social', label: 'Social' },
  { value: 'landing_page', label: 'Landing Page' },
];

export default function ContentApprovalWorkflow() {
  const toast = useToast();
  const approvalQueue = useStore((s) => s.approvalQueue) || [];
  const [activeTab, setActiveTab] = useState('needs_review');
  const [contentFilter, setContentFilter] = useState('all');
  const [selectedId, setSelectedId] = useState(null);
  const [selectedIds, setSelectedIds] = useState(new Set());

  const tab = TABS.find((t) => t.id === activeTab) || TABS[0];
  const filtered = useMemo(() => {
    let list = approvalQueue.filter(tab.filter);
    if (contentFilter !== 'all') list = list.filter((item) => item.contentType === contentFilter);
    list = [...list].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    return list;
  }, [approvalQueue, activeTab, contentFilter]);

  const selectedItem = useMemo(() => approvalQueue.find((i) => i.id === selectedId), [approvalQueue, selectedId]);

  const counts = useMemo(() => {
    const needsReview = approvalQueue.filter(TABS[0].filter).length;
    const inProgress = approvalQueue.filter(TABS[1].filter).length;
    const approved = approvalQueue.filter(TABS[2].filter).length;
    return { needsReview, inProgress, approved };
  }, [approvalQueue]);

  const handleSelect = (item) => {
    setSelectedId(item?.id ?? null);
  };

  const handleToggleSelect = (e, item) => {
    e.stopPropagation();
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(item.id)) next.delete(item.id);
      else next.add(item.id);
      return next;
    });
  };

  const handleApproveAll = () => {
    toast.success(`Approved ${selectedIds.size} items (mock).`);
    setSelectedIds(new Set());
  };

  const handleRequestRevision = () => {
    toast.info('Revision requested for selected items (mock).');
    setSelectedIds(new Set());
  };

  return (
    <div
      style={{
        minHeight: '100%',
        display: 'flex',
        flexDirection: 'row',
        backgroundColor: C.bg,
      }}
    >
      {/* Left column — queue */}
      <div
        style={{
          width: 380,
          minWidth: 380,
          borderRight: `1px solid ${C.border}`,
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: C.surface,
          overflow: 'hidden',
        }}
      >
        <div style={{ padding: S[4], borderBottom: `1px solid ${C.border}` }}>
          <h1 style={{ fontFamily: F.display, fontSize: '20px', fontWeight: 700, color: C.textPrimary, margin: `0 0 ${S[4]} 0` }}>
            Approvals
          </h1>
          <div style={{ display: 'flex', gap: S[2], flexWrap: 'wrap' }}>
            {TABS.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setActiveTab(t.id)}
                style={{
                  padding: `${S[1]} ${S[3]}`,
                  fontFamily: F.body,
                  fontSize: '12px',
                  fontWeight: 600,
                  color: activeTab === t.id ? C.primary : C.textSecondary,
                  backgroundColor: activeTab === t.id ? C.primaryGlow : 'transparent',
                  border: `1px solid ${activeTab === t.id ? C.primary : C.border}`,
                  borderRadius: R.button,
                  cursor: 'pointer',
                }}
              >
                {t.label} ({t.id === 'needs_review' ? counts.needsReview : t.id === 'in_progress' ? counts.inProgress : t.id === 'approved' ? counts.approved : approvalQueue.length})
              </button>
            ))}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: S[3], marginTop: S[3] }}>
            <select
              value={contentFilter}
              onChange={(e) => setContentFilter(e.target.value)}
              style={{
                padding: `${S[1]} ${S[2]}`,
                fontFamily: F.body,
                fontSize: '12px',
                color: C.textPrimary,
                backgroundColor: C.surface2,
                border: `1px solid ${C.border}`,
                borderRadius: R.input,
                outline: 'none',
              }}
            >
              {CONTENT_FILTER_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <span style={{ fontFamily: F.body, fontSize: '11px', color: C.textMuted }}>
              Oldest first
            </span>
          </div>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: S[3] }}>
          <BulkApproveBar
            selectedCount={selectedIds.size}
            onApproveAll={handleApproveAll}
            onRequestRevision={handleRequestRevision}
          />
          {activeTab === 'approved' && filtered.length === 0 && (
            <div style={{ padding: S[6], textAlign: 'center' }}>
              <div style={{ fontFamily: F.body, fontSize: '14px', color: C.primary, marginBottom: S[2] }}>
                All content approved
              </div>
              <p style={{ fontFamily: F.body, fontSize: '12px', color: C.textMuted, margin: 0 }}>
                No items in this tab.
              </p>
            </div>
          )}
          {filtered.map((item) => (
            <div key={item.id} style={{ marginBottom: S[2] }}>
              <ApprovalQueueCard
                item={item}
                selected={selectedId === item.id}
                onSelect={handleSelect}
                selectedIds={selectedIds}
                onToggleSelect={handleToggleSelect}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Right column — review panel */}
      <ContentReviewPanel item={selectedItem} />
    </div>
  );
}
