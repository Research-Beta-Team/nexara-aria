import { useState, useMemo, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useStore from '../store/useStore';
import useToast from '../hooks/useToast';
import { C, F, S, btn, flex } from '../tokens';
import {
  getProspectsForClient,
  getCampaignsForOutreach,
  DEFAULT_OUTREACH_CAMPAIGN_ID,
} from '../data/outreach';
import OutreachStats from '../components/outreach/OutreachStats';
import OutreachFilters from '../components/outreach/OutreachFilters';
import OutreachTable from '../components/outreach/OutreachTable';
import OutreachEmptyState from '../components/outreach/OutreachEmptyState';
import OutreachTileView from '../components/outreach/OutreachTileView';

const VIEW_STORAGE_KEY = 'nexara_outreach_view';
const DEFAULT_COLUMNS = ['icp', 'prospect', 'campaign', 'channel', 'intent', 'sequence', 'lastTouch', 'replied', 'actions'];

function filterByDate(prospects, dateRange) {
  if (!dateRange || dateRange === 'all') return prospects;
  const days = parseInt(dateRange, 10);
  if (!Number.isFinite(days)) return prospects;
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
  return prospects.filter((p) => p.addedDate && new Date(p.addedDate) >= since);
}

function sortProspects(list, sortKey, sortDir) {
  const dir = sortDir === 'asc' ? 1 : -1;
  return [...list].sort((a, b) => {
    let va = a[sortKey];
    let vb = b[sortKey];
    if (sortKey === 'replied') {
      va = va ? 1 : 0;
      vb = vb ? 1 : 0;
    }
    if (typeof va === 'string') return dir * (va.localeCompare(vb));
    if (va == null && vb == null) return 0;
    if (va == null) return dir;
    if (vb == null) return -dir;
    return dir * (va < vb ? -1 : va > vb ? 1 : 0);
  });
}

export default function Outreach() {
  const navigate = useNavigate();
  const toast = useToast();
  const activeClientId = useStore((s) => s.activeClientId);
  const currentRole = useStore((s) => s.currentRole);
  const toggleAria = useStore((s) => s.toggleAria);

  const [viewMode, setViewModeState] = useState(() => {
    try {
      return localStorage.getItem(VIEW_STORAGE_KEY) || 'list';
    } catch {
      return 'list';
    }
  });
  const setViewMode = useCallback((mode) => {
    setViewModeState(mode);
    try {
      localStorage.setItem(VIEW_STORAGE_KEY, mode);
    } catch (_) {}
  }, []);

  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [dateRange, setDateRange] = useState('all');
  const [campaignId, setCampaignId] = useState('');
  const [savedViewId, setSavedViewId] = useState('');
  const [sortKey, setSortKey] = useState('icpScore');
  const [sortDir, setSortDir] = useState('desc');
  const [visibleColumns] = useState(DEFAULT_COLUMNS);
  const [page, setPage] = useState(1);
  const pageSize = 25;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const canEdit = currentRole !== 'analyst';

  const prospects = useMemo(() => {
    let list = getProspectsForClient(activeClientId ?? 'medglobal');
    list = filterByDate(list, dateRange);
    if (campaignId) list = list.filter((p) => p.campaignId === campaignId);
    if (filter === 'replied') list = list.filter((p) => p.replied);
    else if (filter === 'high') list = list.filter((p) => p.intent === 'high');
    else if (filter === 'active') list = list.filter((p) => (p.sequenceStep ?? 0) > 0);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) =>
          (p.name || '').toLowerCase().includes(q) ||
          (p.company || '').toLowerCase().includes(q) ||
          (p.title || '').toLowerCase().includes(q)
      );
    }
    return list;
  }, [activeClientId, dateRange, campaignId, filter, search]);

  const sorted = useMemo(() => sortProspects(prospects, sortKey, sortDir), [prospects, sortKey, sortDir]);

  const paginated = useMemo(() => {
    const start = (page - 1) * pageSize;
    return sorted.slice(start, start + pageSize);
  }, [sorted, page]);

  const campaigns = useMemo(() => getCampaignsForOutreach(activeClientId ?? 'medglobal'), [activeClientId]);

  useEffect(() => setPage(1), [filter, search, dateRange, campaignId]);

  const handleSort = useCallback((key) => {
    setSortKey(key);
    setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
  }, []);

  const exportCsv = useCallback(() => {
    const headers = ['Name', 'Title', 'Company', 'ICP', 'Intent', 'Channel', 'Sequence', 'Last touch', 'Replied'];
    const rows = sorted.map((p) => [p.name, p.title, p.company, p.icpScore, p.intent, p.channel, p.sequenceStep, p.lastTouch, p.replied ? 'Yes' : 'No']);
    const csv = [headers.join(','), ...rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `outreach-prospects-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Export started');
  }, [sorted, toast]);

  const rowActions = {
    onViewTimeline: (id) => navigate(`/campaigns/${DEFAULT_OUTREACH_CAMPAIGN_ID}/prospect/${id}`),
    onPause: () => toast.info('Pause sequence (mock)'),
    onMarkReplied: () => toast.info('Mark replied (mock)'),
    onHandoff: () => navigate('/crm/handoff'),
  };

  return (
    <div style={{ padding: S[6], display: 'flex', flexDirection: 'column', gap: S[5], minHeight: '100%' }}>
      <div style={{ ...flex.rowBetween, flexWrap: 'wrap', gap: S[3] }}>
        <div>
          <h1 style={{ fontFamily: F.display, fontSize: '22px', fontWeight: 800, color: C.textPrimary, margin: '0 0 4px' }}>
            Outreach
          </h1>
          <p style={{ fontFamily: F.body, fontSize: '13px', color: C.textSecondary }}>
            Prospects and sequences across campaigns. Click a prospect to view timeline and take action.
            {currentRole === 'sdr' && ' You can pause sequences and mark replies.'}
            {currentRole === 'analyst' && ' View-only: export and filters available.'}
          </p>
        </div>
        <div style={{ display: 'flex', gap: S[2] }}>
          <button type="button" style={{ ...btn.secondary, fontSize: '13px' }} onClick={() => toast.info('Add prospects flow coming soon')}>
            Add prospects
          </button>
          <button type="button" style={{ ...btn.secondary, fontSize: '13px' }} onClick={() => { toggleAria(); toast.info('Ask Freya: "Who should I follow up with?"'); }}>
            Ask Freya
          </button>
          <button type="button" style={{ ...btn.primary, fontSize: '13px' }} onClick={() => navigate('/campaigns/new')}>
            New campaign
          </button>
        </div>
      </div>

      {loading && (
        <div style={{ padding: S[4], textAlign: 'center', fontFamily: F.body, color: C.textMuted }}>
          Loading prospects…
        </div>
      )}
      {error && (
        <div style={{ padding: S[4], backgroundColor: C.redDim, border: `1px solid ${C.red}`, borderRadius: '10px', color: C.red }}>
          {error}
        </div>
      )}

      <OutreachStats prospects={prospects} replyRateTrend={5} />

      <OutreachFilters
        filter={filter}
        setFilter={setFilter}
        search={search}
        setSearch={setSearch}
        dateRange={dateRange}
        setDateRange={setDateRange}
        campaignId={campaignId}
        setCampaignId={setCampaignId}
        savedViewId={savedViewId}
        setSavedViewId={setSavedViewId}
        campaigns={campaigns}
        viewMode={viewMode}
        setViewMode={setViewMode}
        onExportCsv={exportCsv}
      />

      {sorted.length === 0 ? (
        <OutreachEmptyState
          hasProspects={prospects.length > 0}
          onAddProspects={() => toast.info('Add prospects flow coming soon')}
          onImport={() => toast.info('Import from CRM coming soon')}
        />
      ) : viewMode === 'tile' ? (
        <OutreachTileView prospects={paginated} />
      ) : (
        <OutreachTable
          prospects={paginated}
          visibleColumns={visibleColumns}
          sortKey={sortKey}
          sortDir={sortDir}
          onSort={handleSort}
          onRowActions={rowActions}
          canEdit={canEdit}
        />
      )}

      {sorted.length > pageSize && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: S[2] }}>
          <button type="button" style={{ ...btn.ghost, fontSize: '12px' }} disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
            Previous
          </button>
          <span style={{ fontFamily: F.body, fontSize: '13px', color: C.textSecondary }}>
            Page {page} of {Math.ceil(sorted.length / pageSize)}
          </span>
          <button type="button" style={{ ...btn.ghost, fontSize: '12px' }} disabled={page >= Math.ceil(sorted.length / pageSize)} onClick={() => setPage((p) => p + 1)}>
            Next
          </button>
        </div>
      )}
    </div>
  );
}
