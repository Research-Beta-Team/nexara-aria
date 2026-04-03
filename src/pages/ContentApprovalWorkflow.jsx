/**
 * Content Approval Workflow — multi-role review chain.
 * Session 2: Two-column queue + review panel, tabs, filter, bulk actions, compliance score, comments, history.
 */
import { useState, useMemo } from 'react';
import useStore from '../store/useStore';
import useToast from '../hooks/useToast';
import { C, F, R, S, T, btn, badge } from '../tokens';
import ApprovalQueueCard from '../components/approvals/ApprovalQueueCard';
import BulkApproveBar from '../components/approvals/BulkApproveBar';
import ContentReviewPanel from '../components/approvals/ContentReviewPanel';
import { useAgent } from '../hooks/useAgent';
import AgentThinking from '../components/agents/AgentThinking';
import AgentAvatar from '../components/agents/AgentAvatar';

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

  /* ─── Guardian agent integration ─────────────────────────── */
  const guardian = useAgent('guardian');
  const [guardianThinking, setGuardianThinking] = useState(false);
  const [guardianReviewCount, setGuardianReviewCount] = useState(0);
  const [guardianResults, setGuardianResults] = useState([]); // [{id, verdict, confidence}]

  const needsReviewCount = approvalQueue.filter(TABS[0].filter).length;

  const handleAutoReview = async () => {
    setGuardianThinking(true);
    setGuardianResults([]);
    const itemsToReview = approvalQueue.filter(TABS[0].filter);
    setGuardianReviewCount(itemsToReview.length);
    try {
      await guardian.activate('auto-review', { skill: 'content-review', items: itemsToReview.map(i => i.id) });
      // Simulate results
      const results = itemsToReview.map((item) => {
        const confidence = 85 + Math.floor(Math.random() * 15);
        return {
          id: item.id,
          title: item.title || item.name || item.id,
          verdict: confidence > 95 ? 'auto-approved' : 'needs-human-review',
          confidence,
        };
      });
      setGuardianResults(results);
      const autoApproved = results.filter(r => r.verdict === 'auto-approved').length;
      const needsHuman = results.filter(r => r.verdict === 'needs-human-review').length;
      if (autoApproved > 0) toast.success(`Guardian auto-approved ${autoApproved} item${autoApproved !== 1 ? 's' : ''} (confidence > 95%)`);
      if (needsHuman > 0) toast.info(`${needsHuman} item${needsHuman !== 1 ? 's' : ''} flagged for human review`);
    } catch {
      toast.error('Guardian review failed');
    } finally {
      setGuardianThinking(false);
    }
  };

  const getGuardianVerdict = (itemId) => guardianResults.find(r => r.id === itemId);

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
          {/* Guardian agent status bar */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: S[2],
            backgroundColor: guardianThinking ? C.surface3 : C.surface2,
            border: `1px solid ${guardianThinking ? C.primary + '40' : C.border}`,
            borderRadius: R.sm, padding: `${S[2]} ${S[3]}`,
            marginBottom: S[3], transition: T.base,
          }}>
            <AgentAvatar agentId="guardian" size={22} showStatus />
            <span style={{ fontFamily: F.body, fontSize: '12px', color: C.textSecondary, flex: 1 }}>
              {guardianThinking
                ? `Guardian: Reviewing ${guardianReviewCount} item${guardianReviewCount !== 1 ? 's' : ''}...`
                : guardianResults.length > 0
                  ? `Guardian: ${guardianResults.filter(r => r.verdict === 'auto-approved').length} auto-approved, ${guardianResults.filter(r => r.verdict === 'needs-human-review').length} need review`
                  : `Guardian: ${needsReviewCount} item${needsReviewCount !== 1 ? 's' : ''} pending`
              }
            </span>
            <button
              style={{
                ...btn.primary,
                fontSize: '11px',
                padding: `${S[1]} ${S[3]}`,
                opacity: guardianThinking ? 0.6 : 1,
              }}
              onClick={handleAutoReview}
              disabled={guardianThinking || needsReviewCount === 0}
            >
              {guardianThinking ? 'Reviewing...' : 'Auto-review'}
            </button>
          </div>

          {/* Guardian thinking indicator */}
          {guardianThinking && (
            <div style={{ marginBottom: S[3] }}>
              <AgentThinking agentId="guardian" task="Analyzing content for compliance, brand alignment, and quality..." />
            </div>
          )}

          {/* Guardian results summary */}
          {guardianResults.length > 0 && !guardianThinking && (
            <div style={{
              display: 'flex', flexDirection: 'column', gap: S[1],
              backgroundColor: C.surface2, border: `1px solid ${C.border}`,
              borderRadius: R.sm, padding: S[3], marginBottom: S[3],
              maxHeight: '120px', overflowY: 'auto',
            }}>
              {guardianResults.map((r) => (
                <div key={r.id} style={{ display: 'flex', alignItems: 'center', gap: S[2], fontSize: '11px', fontFamily: F.body }}>
                  <span style={{
                    width: '6px', height: '6px', borderRadius: '50%', flexShrink: 0,
                    backgroundColor: r.verdict === 'auto-approved' ? C.green : C.amber,
                  }} />
                  <span style={{ color: C.textSecondary, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {r.title}
                  </span>
                  <span style={{
                    fontFamily: F.mono, fontSize: '10px', fontWeight: 600,
                    color: r.verdict === 'auto-approved' ? C.green : C.amber,
                  }}>
                    {r.verdict === 'auto-approved'
                      ? `Reviewed by Guardian (${r.confidence}% confidence)`
                      : `Needs human review (${r.confidence}%)`
                    }
                  </span>
                </div>
              ))}
            </div>
          )}

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
