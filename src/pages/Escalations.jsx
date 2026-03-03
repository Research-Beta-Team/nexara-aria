import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { C, F, R, S, btn } from '../tokens';
import useToast from '../hooks/useToast';
import useStore from '../store/useStore';
import { useRoleView } from '../hooks/useRoleView';
import { filterEscalations } from '../utils/roleViews';
import EscalationCard from '../components/escalation/EscalationCard';
import EscalationFilterBar from '../components/escalation/FilterBar';
import BulkActionBar from '../components/escalation/BulkActionBar';
import ContentApprovalQueue from '../components/approvals/ContentApprovalQueue';
import DualApprovalCard from '../components/approvals/DualApprovalCard';
import { APPROVABLE_CONTENT, MOCK_REVIEWERS } from '../data/approvals';
import { INIT_ACTIVE, INIT_RESOLVED } from '../data/escalations';

/* ─── Main page ───────────────────────────────────────────── */
export default function Escalations() {
  const navigate = useNavigate();
  const toast = useToast();
  const { access, filter, readOnly } = useRoleView('escalations');
  const currentRole = useStore((s) => s.currentRole);
  const approvals = useStore((s) => s.approvals);
  const openApprovalId = useStore((s) => s.openApprovalId);
  const seedApprovals = useStore((s) => s.seedApprovals);
  const setOpenApproval = useStore((s) => s.setOpenApproval);
  const updateApprovalStatus = useStore((s) => s.updateApprovalStatus);
  const addApprovalComment = useStore((s) => s.addApprovalComment);

  useEffect(() => {
    if (approvals.length === 0) seedApprovals(APPROVABLE_CONTENT);
  }, [approvals.length, seedApprovals]);

  const contentApprovalCount = useMemo(() => {
    const list = approvals.length > 0 ? approvals : APPROVABLE_CONTENT;
    return list.filter((i) => i.status === 'in_review' || i.status === 'revision_requested').length;
  }, [approvals]);

  const [active, setActive]       = useState(INIT_ACTIVE);
  const [resolved, setResolved]   = useState(INIT_RESOLVED);
  const [tab, setTab]             = useState('active');   // 'active' | 'history' | 'content'
  const [selected, setSelected]   = useState(new Set());
  const [filters, setFilters]     = useState({ severity: null, agentType: null, status: null, client: null });

  const roleConfig = useMemo(() => ({ filter }), [filter]);
  const activeFiltered = useMemo(() => filterEscalations(active, currentRole, roleConfig), [active, currentRole, roleConfig]);
  const resolvedFiltered = useMemo(() => filterEscalations(resolved, currentRole, roleConfig), [resolved, currentRole, roleConfig]);

  /* Filter logic */
  const allEscalations = tab === 'active' ? activeFiltered : resolvedFiltered;

  const filtered = useMemo(() => allEscalations.filter((e) => {
    if (filters.severity  && e.severity  !== filters.severity)  return false;
    if (filters.agentType && e.agentType !== filters.agentType) return false;
    if (filters.status    && e.status    !== filters.status.toLowerCase()) return false;
    return true;
  }), [allEscalations, filters]);

  /* Selection helpers */
  const toggleSelect = (id) => setSelected((prev) => {
    const next = new Set(prev);
    next.has(id) ? next.delete(id) : next.add(id);
    return next;
  });

  const clearSelection = () => setSelected(new Set());

  /* Single approve/deny */
  const handleApprove = (id) => {
    const item = active.find((e) => e.id === id);
    setActive((prev) => prev.filter((e) => e.id !== id));
    if (item) setResolved((prev) => [...prev, { ...item, status: 'approved', resolvedAt: 'Just now' }]);
    toast.success(`Escalation approved`);
    setSelected((prev) => { const n = new Set(prev); n.delete(id); return n; });
  };

  const handleDeny = (id) => {
    const item = active.find((e) => e.id === id);
    setActive((prev) => prev.filter((e) => e.id !== id));
    if (item) setResolved((prev) => [...prev, { ...item, status: 'denied', resolvedAt: 'Just now' }]);
    toast.info(`Escalation denied`);
    setSelected((prev) => { const n = new Set(prev); n.delete(id); return n; });
  };

  /* Dual-track approval (strategy + budget) */
  const handleStrategyApprove = (id) => {
    setActive((prev) => prev.map((e) =>
      e.id === id ? { ...e, strategyApprovalStatus: 'approved', strategyApprovedBy: { name: 'You (Strategy)', timestamp: 'Just now' } } : e
    ));
    toast.success('Strategy approved');
  };

  const handleBudgetApprove = (id) => {
    setActive((prev) => prev.map((e) =>
      e.id === id ? { ...e, budgetApprovalStatus: 'approved', budgetApprovedBy: { name: 'You (CFO)', timestamp: 'Just now' } } : e
    ));
    toast.success('Budget approved');
  };

  const handleDualDecline = (id, _track) => {
    const item = active.find((e) => e.id === id);
    setActive((prev) => prev.filter((e) => e.id !== id));
    if (item) setResolved((prev) => [...prev, { ...item, status: 'denied', resolvedAt: 'Just now' }]);
    toast.info('Escalation declined');
    setSelected((prev) => { const n = new Set(prev); n.delete(id); return n; });
  };

  const handleDualExecute = (id) => {
    const item = active.find((e) => e.id === id);
    setActive((prev) => prev.filter((e) => e.id !== id));
    if (item) setResolved((prev) => [...prev, { ...item, status: 'approved', resolvedAt: 'Just now' }]);
    toast.success('Action executed');
    setSelected((prev) => { const n = new Set(prev); n.delete(id); return n; });
  };

  const handleSendAdvisor = (esc) => {
    toast.success(`Thread created in Team Query: "${esc.title}"`);
  };

  /* Bulk actions */
  const handleApproveAll = () => {
    const ids = [...selected];
    ids.forEach((id) => {
      const item = active.find((e) => e.id === id);
      if (item) {
        setActive((prev) => prev.filter((e) => e.id !== id));
        setResolved((prev) => [...prev, { ...item, status: 'approved', resolvedAt: 'Just now' }]);
      }
    });
    toast.success(`${ids.length} escalation${ids.length > 1 ? 's' : ''} approved`);
    clearSelection();
  };

  const handleDenyAll = () => {
    const ids = [...selected];
    ids.forEach((id) => {
      const item = active.find((e) => e.id === id);
      if (item) {
        setActive((prev) => prev.filter((e) => e.id !== id));
        setResolved((prev) => [...prev, { ...item, status: 'denied', resolvedAt: 'Just now' }]);
      }
    });
    toast.info(`${ids.length} escalation${ids.length > 1 ? 's' : ''} denied`);
    clearSelection();
  };

  const handleBulkAdvisor = () => {
    toast.success(`${selected.size} escalation${selected.size > 1 ? 's' : ''} sent to Advisor`);
    clearSelection();
  };

  const updateFilters = (patch) => setFilters((prev) => ({ ...prev, ...patch }));

  const highCount   = activeFiltered.filter((e) => e.severity === 'High').length;
  const medCount    = activeFiltered.filter((e) => e.severity === 'Medium').length;

  if (access === false) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: C.bg, padding: S[6], display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: S[5] }}>
        <h1 style={{ fontFamily: F.display, fontSize: '22px', fontWeight: 800, color: C.textPrimary, margin: 0 }}>Escalation Queue</h1>
        <p style={{ fontFamily: F.body, fontSize: '14px', color: C.textSecondary, textAlign: 'center', maxWidth: '400px' }}>
          Escalations are managed by your team lead. You'll be notified if anything requires your action.
        </p>
        <button style={{ ...btn.primary }} onClick={() => navigate('/')}>Go to Dashboard</button>
      </div>
    );
  }

  return (
    <>
      <style>{`
        @keyframes escFade { from{opacity:0;transform:translateY(4px)}to{opacity:1;transform:translateY(0)} }
      `}</style>

      <div style={{ minHeight: '100vh', backgroundColor: C.bg, padding: `${S[6]} ${S[6]} ${S[8]}` }}>

        {/* Page header */}
        <div style={{ marginBottom: S[5] }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
            <div>
              <h1 style={{ fontFamily: 'Syne, sans-serif', fontSize: '24px', fontWeight: 800, color: C.textPrimary, margin: 0, letterSpacing: '-0.03em' }}>
                Escalation Queue
              </h1>
              <p style={{ fontFamily: F.body, fontSize: '13px', color: C.textSecondary, margin: `${S[1]} 0 0` }}>
                ARIA is requesting human decisions on {activeFiltered.length} item{activeFiltered.length !== 1 ? 's' : ''}.
                {highCount > 0 && <span style={{ color: '#EF4444' }}> {highCount} high severity.</span>}
                {medCount > 0 && <span style={{ color: C.amber }}> {medCount} medium.</span>}
              </p>
            </div>

            {/* Stats */}
            <div style={{ display: 'flex', gap: S[4] }}>
              {[
                { label: 'Pending',  value: activeFiltered.length,   color: C.amber },
                { label: 'Resolved', value: resolvedFiltered.length, color: C.primary },
              ].map(({ label, value, color }) => (
                <div key={label} style={{ textAlign: 'right' }}>
                  <div style={{ fontFamily: F.mono, fontSize: '22px', fontWeight: 800, color }}>{value}</div>
                  <div style={{ fontFamily: F.body, fontSize: '11px', color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</div>
                </div>
              ))}
              {readOnly && (
                <button style={{ ...btn.secondary, fontSize: '12px', alignSelf: 'flex-end' }} onClick={() => toast.info('Export escalation log (mock)')}>
                  Export escalation log
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 0, borderBottom: `1px solid ${C.border}`, marginBottom: S[5] }}>
          {[
            { id: 'active',  label: `Active (${activeFiltered.length})` },
            { id: 'history', label: `History (${resolvedFiltered.length})` },
            { id: 'content', label: `Content Approvals (${contentApprovalCount})` },
          ].map(({ id, label }) => (
            <button
              key={id}
              onClick={() => { setTab(id); clearSelection(); }}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                fontFamily: F.body, fontSize: '13px', fontWeight: tab === id ? 700 : 400,
                color: tab === id ? C.textPrimary : C.textMuted,
                padding: `${S[3]} ${S[5]}`,
                borderBottom: `2px solid ${tab === id ? C.primary : 'transparent'}`,
                transition: 'all 0.15s ease',
              }}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Filter bar (only for Active / History) */}
        {tab !== 'content' && (
        <div style={{ marginBottom: S[4] }}>
          <EscalationFilterBar
            escalations={allEscalations}
            filters={filters}
            onChange={updateFilters}
          />
        </div>
        )}

        {/* Content Approvals tab */}
        {tab === 'content' && (
          <ContentApprovalQueue
            items={approvals.length > 0 ? approvals : APPROVABLE_CONTENT}
            reviewers={MOCK_REVIEWERS}
            openApprovalId={openApprovalId}
            onOpenThread={setOpenApproval}
            onCloseThread={() => setOpenApproval(null)}
            onStatusChange={updateApprovalStatus}
            onAddComment={addApprovalComment}
            toast={toast}
          />
        )}

        {/* Card list (Active / History) */}
        {tab !== 'content' && (
        <>
        {filtered.length === 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: `${S[16]} 0`, gap: S[3] }}>
            <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
              <circle cx="22" cy="22" r="19" stroke={C.textMuted} strokeWidth="1.5"/>
              <path d="M22 14v8M22 25v2" stroke={C.textMuted} strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <div style={{ fontFamily: F.body, fontSize: '14px', color: C.textMuted }}>
              {tab === 'active' ? 'No pending escalations — ARIA is running autonomously' : 'No resolved escalations yet'}
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: S[4], animation: 'escFade 0.2s ease' }}>
            {filtered.map((esc) =>
              esc.budgetApprovalRequired ? (
                <DualApprovalCard
                  key={esc.id}
                  escalation={esc}
                  selected={selected.has(esc.id)}
                  onSelect={toggleSelect}
                  onStrategyApprove={readOnly ? undefined : handleStrategyApprove}
                  onBudgetApprove={readOnly ? undefined : handleBudgetApprove}
                  onDecline={readOnly ? undefined : handleDualDecline}
                  onExecute={readOnly ? undefined : handleDualExecute}
                  resolved={tab === 'history'}
                  readOnly={readOnly}
                />
              ) : (
                <EscalationCard
                  key={esc.id}
                  escalation={esc}
                  selected={selected.has(esc.id)}
                  onSelect={toggleSelect}
                  onApprove={readOnly ? undefined : handleApprove}
                  onDeny={readOnly ? undefined : handleDeny}
                  onSendAdvisor={readOnly ? undefined : handleSendAdvisor}
                  resolved={tab === 'history'}
                  readOnly={readOnly}
                />
              )
            )}
          </div>
        )}
        </>
        )}

      </div>

      {/* Bulk action bar — hidden when read-only */}
      {!readOnly && selected.size > 0 && (
        <BulkActionBar
          count={selected.size}
          onApproveAll={handleApproveAll}
          onDenyAll={handleDenyAll}
          onSendAdvisor={handleBulkAdvisor}
          onClear={clearSelection}
        />
      )}
    </>
  );
}
