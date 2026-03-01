import { useState, useMemo } from 'react';
import { C, F, R, S, T, btn, badge, shadows, scrollbarStyle } from '../tokens';
import useToast from '../hooks/useToast';
import ContentPreviewModal from '../components/campaign/ContentPreviewModal';
import { contentItems, CONTENT_TYPE_COLORS } from '../data/content';

/* ─── constants ──────────────────────────────────────────── */
const TYPES    = ['Email', 'LinkedIn Ad', 'Meta Ad', 'SEO Article', 'Blog', 'Landing Page'];
const STATUSES = ['approved', 'pending', 'draft', 'archived'];
const VIEWS    = ['List', 'Grid', 'By Type', 'By Campaign'];

const TYPE_COLORS = CONTENT_TYPE_COLORS ?? {
  'Email':        C.primary,
  'LinkedIn Ad':  '#0A66C2',
  'Meta Ad':      '#1877F2',
  'SEO Article':  C.amber,
  'Blog':         '#A78BFA',
  'Landing Page': '#F472B6',
};

const STATUS_COLORS = {
  approved: C.primary,
  pending:  C.amber,
  draft:    C.textMuted,
  archived: '#6B7280',
};

/* ─── TypeIcon ──────────────────────────────────────────── */
function TypeIcon({ type, size = 16 }) {
  const color = TYPE_COLORS[type] ?? C.textSecondary;
  if (type === 'Email') return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <rect x="1" y="3" width="14" height="10" rx="2" stroke={color} strokeWidth="1.3"/>
      <path d="M1 5.5l7 4 7-4" stroke={color} strokeWidth="1.3" strokeLinecap="round"/>
    </svg>
  );
  if (type === 'LinkedIn Ad' || type === 'Meta Ad') return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <rect x="1" y="1" width="14" height="10" rx="2" stroke={color} strokeWidth="1.3"/>
      <path d="M4 14h8" stroke={color} strokeWidth="1.3" strokeLinecap="round"/>
      <path d="M8 11v3" stroke={color} strokeWidth="1.3" strokeLinecap="round"/>
    </svg>
  );
  if (type === 'Blog' || type === 'SEO Article') return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <path d="M3 2h10a1 1 0 011 1v10a1 1 0 01-1 1H3a1 1 0 01-1-1V3a1 1 0 011-1z" stroke={color} strokeWidth="1.3"/>
      <path d="M4 5.5h8M4 8h6M4 10.5h4" stroke={color} strokeWidth="1.3" strokeLinecap="round"/>
    </svg>
  );
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <rect x="1" y="2" width="14" height="12" rx="2" stroke={color} strokeWidth="1.3"/>
      <path d="M1 5h14" stroke={color} strokeWidth="1.3"/>
      <path d="M4 8h8M5 11h6" stroke={color} strokeWidth="1.3" strokeLinecap="round"/>
    </svg>
  );
}

/* ─── ScoreBar ───────────────────────────────────────────── */
function ScoreBar({ score }) {
  if (score == null) return null;
  const color = score >= 85 ? C.primary : score >= 70 ? C.amber : '#EF4444';
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
      <div style={{ flex: 1, height: '3px', borderRadius: '2px', backgroundColor: C.border }}>
        <div style={{ width: `${score}%`, height: '100%', borderRadius: '2px', backgroundColor: color, transition: T.base }} />
      </div>
      <span style={{ fontFamily: F.mono, fontSize: '11px', fontWeight: 700, color, minWidth: '24px', textAlign: 'right' }}>{score}</span>
    </div>
  );
}

/* ─── StatusBadge ────────────────────────────────────────── */
function StatusBadge({ status }) {
  const color = STATUS_COLORS[status] ?? C.textMuted;
  return (
    <span style={{
      ...badge.base,
      color,
      backgroundColor: `${color}18`,
      border: `1px solid ${color}33`,
      textTransform: 'capitalize',
    }}>
      {status}
    </span>
  );
}

/* ─── TypeBadge ──────────────────────────────────────────── */
function TypeBadge({ type }) {
  const color = TYPE_COLORS[type] ?? C.textSecondary;
  return (
    <span style={{
      ...badge.base,
      color,
      backgroundColor: `${color}18`,
      border: `1px solid ${color}33`,
      fontSize: '10px',
    }}>
      {type}
    </span>
  );
}

/* ─── ContentListRow ─────────────────────────────────────── */
function ContentListRow({ item, onOpen }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '28px 1fr 160px 140px 90px 80px 80px',
        alignItems: 'center',
        gap: S[3],
        padding: `${S[3]} ${S[4]}`,
        borderBottom: `1px solid ${C.border}`,
        cursor: 'pointer',
        backgroundColor: hov ? C.surface2 : 'transparent',
        transition: T.color,
      }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      onClick={() => onOpen(item)}
    >
      <TypeIcon type={item.type} size={16} />
      <div style={{ minWidth: 0 }}>
        <div style={{ fontFamily: F.body, fontSize: '13px', fontWeight: 600, color: C.textPrimary, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {item.name}
        </div>
        {item.preview && (
          <div style={{ fontFamily: F.body, fontSize: '11px', color: C.textMuted, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginTop: '1px' }}>
            {item.preview}
          </div>
        )}
      </div>
      <div style={{ fontFamily: F.body, fontSize: '12px', color: C.textSecondary, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {item.campaignName ?? '—'}
      </div>
      <div style={{ fontFamily: F.body, fontSize: '12px', color: C.textMuted, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {item.agent ?? '—'}
      </div>
      <StatusBadge status={item.status} />
      <ScoreBar score={item.brandScore} />
      <div style={{ fontFamily: F.mono, fontSize: '11px', color: C.textMuted, textAlign: 'right' }}>
        {item.updatedAt}
      </div>
    </div>
  );
}

/* ─── ContentGridCard ────────────────────────────────────── */
function ContentGridCard({ item, onOpen }) {
  const [hov, setHov] = useState(false);
  const typeColor = TYPE_COLORS[item.type] ?? C.textSecondary;
  const perfKeys = item.performance ? Object.entries(item.performance).slice(0, 2) : [];

  return (
    <div
      style={{
        backgroundColor: C.surface,
        border: `1px solid ${hov ? C.borderHover : C.border}`,
        borderRadius: R.card,
        padding: S[4],
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        gap: S[3],
        transition: T.base,
        boxShadow: hov ? shadows.cardHover : 'none',
      }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      onClick={() => onOpen(item)}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <TypeBadge type={item.type} />
        <StatusBadge status={item.status} />
      </div>

      <div>
        <div style={{ fontFamily: F.body, fontSize: '13px', fontWeight: 700, color: C.textPrimary, lineHeight: '1.3', marginBottom: '4px' }}>
          {item.name}
        </div>
        {item.preview && (
          <div style={{ fontFamily: F.body, fontSize: '11px', color: C.textMuted, lineHeight: '1.4', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {item.preview}
          </div>
        )}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {item.campaignName && (
          <div style={{ display: 'flex', gap: S[2], alignItems: 'center' }}>
            <span style={{ fontFamily: F.mono, fontSize: '10px', color: C.textMuted, width: '52px', flexShrink: 0 }}>Campaign</span>
            <span style={{ fontFamily: F.body, fontSize: '11px', color: C.textSecondary, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.campaignName}</span>
          </div>
        )}
        {item.agent && (
          <div style={{ display: 'flex', gap: S[2], alignItems: 'center' }}>
            <span style={{ fontFamily: F.mono, fontSize: '10px', color: C.textMuted, width: '52px', flexShrink: 0 }}>Agent</span>
            <span style={{ fontFamily: F.body, fontSize: '11px', color: C.textSecondary }}>{item.agent}</span>
          </div>
        )}
      </div>

      {item.brandScore != null && (
        <div>
          <div style={{ fontFamily: F.mono, fontSize: '10px', color: C.textMuted, marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Brand Score</div>
          <ScoreBar score={item.brandScore} />
        </div>
      )}

      {perfKeys.length > 0 && (
        <div style={{ display: 'flex', gap: S[3] }}>
          {perfKeys.map(([k, v]) => (
            <div key={k} style={{ flex: 1 }}>
              <div style={{ fontFamily: F.mono, fontSize: '10px', color: C.textMuted, textTransform: 'capitalize', marginBottom: '2px' }}>{k}</div>
              <div style={{ fontFamily: F.mono, fontSize: '13px', fontWeight: 700, color: C.textPrimary }}>{v}</div>
            </div>
          ))}
        </div>
      )}

      {hov && (
        <div style={{ fontFamily: F.body, fontSize: '11px', color: typeColor, display: 'flex', alignItems: 'center', gap: '4px', marginTop: 'auto' }}>
          View content
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M2 5h6M5 2l3 3-3 3" stroke={typeColor} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      )}
    </div>
  );
}

/* ─── GroupSection ───────────────────────────────────────── */
function GroupSection({ title, items, onOpen, viewMode }) {
  const [collapsed, setCollapsed] = useState(false);
  const isGrid = viewMode === 'By Type' || viewMode === 'By Campaign';

  return (
    <div>
      <button
        onClick={() => setCollapsed((c) => !c)}
        style={{
          display: 'flex', alignItems: 'center', gap: S[2],
          background: 'none', border: 'none', cursor: 'pointer',
          padding: `${S[2]} 0`, marginBottom: S[3], width: '100%', textAlign: 'left',
        }}
      >
        <svg
          width="12" height="12" viewBox="0 0 12 12" fill="none"
          style={{ transition: T.base, transform: collapsed ? 'rotate(-90deg)' : 'none', flexShrink: 0 }}
        >
          <path d="M2 4l4 4 4-4" stroke={C.textMuted} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <span style={{ fontFamily: F.display, fontSize: '13px', fontWeight: 700, color: C.textSecondary, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          {title}
        </span>
        <span style={{ fontFamily: F.mono, fontSize: '11px', color: C.textMuted }}>({items.length})</span>
      </button>

      {!collapsed && (
        isGrid ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: S[4], marginBottom: S[6] }}>
            {items.map((item) => <ContentGridCard key={item.id} item={item} onOpen={onOpen} />)}
          </div>
        ) : (
          <div style={{ backgroundColor: C.surface, border: `1px solid ${C.border}`, borderRadius: R.card, overflow: 'hidden', marginBottom: S[6] }}>
            {items.map((item) => <ContentListRow key={item.id} item={item} onOpen={onOpen} />)}
          </div>
        )
      )}
    </div>
  );
}

/* ─── FilterPill ─────────────────────────────────────────── */
function FilterPill({ label, active, onClick, count }) {
  return (
    <button
      onClick={onClick}
      style={{
        fontFamily: F.body, fontSize: '12px', fontWeight: active ? 600 : 400,
        color: active ? C.textPrimary : C.textMuted,
        backgroundColor: active ? C.surface3 : 'transparent',
        border: `1px solid ${active ? C.borderHover : C.border}`,
        borderRadius: R.pill,
        padding: `3px ${S[3]}`,
        cursor: 'pointer',
        transition: T.color,
        display: 'inline-flex', alignItems: 'center', gap: '5px',
      }}
    >
      {label}
      {count != null && (
        <span style={{ fontFamily: F.mono, fontSize: '10px', color: active ? C.textSecondary : C.textMuted }}>{count}</span>
      )}
    </button>
  );
}

/* ─── Main Page ──────────────────────────────────────────── */
export default function ContentLibrary() {
  const toast = useToast();

  const [view, setView]                   = useState('List');
  const [search, setSearch]               = useState('');
  const [filterType, setFilterType]       = useState('All');
  const [filterStatus, setFilterStatus]   = useState('All');
  const [filterCampaign, setFilterCampaign] = useState('All');
  const [filterAgent, setFilterAgent]     = useState('All');
  const [preview, setPreview]             = useState(null);

  const campaigns = useMemo(() => {
    const map = {};
    contentItems.forEach((i) => { if (i.campaign) map[i.campaign] = i.campaignName; });
    return Object.entries(map).map(([id, name]) => ({ id, name }));
  }, []);

  const agents = useMemo(() => [...new Set(contentItems.map((i) => i.agent).filter(Boolean))], []);

  const filtered = useMemo(() => {
    let items = contentItems;
    if (search.trim()) {
      const q = search.toLowerCase();
      items = items.filter((i) =>
        i.name.toLowerCase().includes(q) ||
        (i.preview ?? '').toLowerCase().includes(q) ||
        (i.campaignName ?? '').toLowerCase().includes(q) ||
        (i.agent ?? '').toLowerCase().includes(q)
      );
    }
    if (filterType !== 'All')     items = items.filter((i) => i.type === filterType);
    if (filterStatus !== 'All')   items = items.filter((i) => i.status === filterStatus);
    if (filterCampaign !== 'All') items = items.filter((i) => i.campaign === filterCampaign);
    if (filterAgent !== 'All')    items = items.filter((i) => i.agent === filterAgent);
    return items;
  }, [search, filterType, filterStatus, filterCampaign, filterAgent]);

  const byType = useMemo(() => {
    const groups = {};
    filtered.forEach((i) => { groups[i.type] = [...(groups[i.type] ?? []), i]; });
    return Object.entries(groups);
  }, [filtered]);

  const byCampaign = useMemo(() => {
    const groups = {};
    filtered.forEach((i) => {
      const key = i.campaignName ?? 'Unassigned';
      groups[key] = [...(groups[key] ?? []), i];
    });
    return Object.entries(groups);
  }, [filtered]);

  const typeCounts = useMemo(() => {
    const c = {};
    contentItems.forEach((i) => { c[i.type] = (c[i.type] ?? 0) + 1; });
    return c;
  }, []);

  const statusCounts = useMemo(() => {
    const c = {};
    contentItems.forEach((i) => { c[i.status] = (c[i.status] ?? 0) + 1; });
    return c;
  }, []);

  const hasFilters = filterType !== 'All' || filterStatus !== 'All' || filterCampaign !== 'All' || filterAgent !== 'All' || search.trim();

  const clearFilters = () => { setSearch(''); setFilterType('All'); setFilterStatus('All'); setFilterCampaign('All'); setFilterAgent('All'); };

  return (
    <>
      <style>{`
        @keyframes clFade { from { opacity: 0; transform: translateY(4px) } to { opacity: 1; transform: translateY(0) } }
        select option { background: #0C1510; color: #DFF0E8; }
      `}</style>

      <div style={{ minHeight: '100vh', backgroundColor: C.bg, padding: `${S[6]} ${S[6]} ${S[8]}` }}>

        {/* Page header */}
        <div style={{ marginBottom: S[6] }}>
          <h1 style={{ fontFamily: 'Syne, sans-serif', fontSize: '24px', fontWeight: 800, color: C.textPrimary, margin: 0, letterSpacing: '-0.03em' }}>
            Content Library
          </h1>
          <p style={{ fontFamily: F.body, fontSize: '13px', color: C.textSecondary, margin: `${S[1]} 0 0` }}>
            {contentItems.length} assets across {campaigns.length} campaigns — review, approve, and export ARIA-generated content.
          </p>
        </div>

        {/* Filter bar */}
        <div style={{
          backgroundColor: C.surface,
          border: `1px solid ${C.border}`,
          borderRadius: R.card,
          padding: `${S[3]} ${S[4]}`,
          marginBottom: S[4],
          display: 'flex', flexDirection: 'column', gap: S[3],
        }}>

          {/* Row 1: search + dropdowns + view toggle */}
          <div style={{ display: 'flex', gap: S[3], alignItems: 'center', flexWrap: 'wrap' }}>

            {/* Search */}
            <div style={{ position: 'relative' }}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                <circle cx="6" cy="6" r="4.5" stroke={C.textMuted} strokeWidth="1.3"/>
                <path d="M9.5 9.5l2.5 2.5" stroke={C.textMuted} strokeWidth="1.3" strokeLinecap="round"/>
              </svg>
              <input
                type="text"
                placeholder="Search content…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                  backgroundColor: C.surface2, color: C.textPrimary,
                  border: `1px solid ${C.border}`, borderRadius: R.input,
                  padding: `${S[2]} ${S[3]} ${S[2]} 30px`,
                  fontFamily: F.body, fontSize: '13px',
                  outline: 'none', width: '200px',
                }}
              />
            </div>

            {/* Campaign */}
            <select
              value={filterCampaign}
              onChange={(e) => setFilterCampaign(e.target.value)}
              style={{
                backgroundColor: C.surface2,
                color: filterCampaign !== 'All' ? C.textPrimary : C.textMuted,
                border: `1px solid ${filterCampaign !== 'All' ? C.borderHover : C.border}`,
                borderRadius: R.input, padding: `${S[2]} ${S[3]}`,
                fontFamily: F.body, fontSize: '12px', outline: 'none', cursor: 'pointer',
              }}
            >
              <option value="All">All Campaigns</option>
              {campaigns.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>

            {/* Agent */}
            <select
              value={filterAgent}
              onChange={(e) => setFilterAgent(e.target.value)}
              style={{
                backgroundColor: C.surface2,
                color: filterAgent !== 'All' ? C.textPrimary : C.textMuted,
                border: `1px solid ${filterAgent !== 'All' ? C.borderHover : C.border}`,
                borderRadius: R.input, padding: `${S[2]} ${S[3]}`,
                fontFamily: F.body, fontSize: '12px', outline: 'none', cursor: 'pointer',
              }}
            >
              <option value="All">All Agents</option>
              {agents.map((a) => <option key={a} value={a}>{a}</option>)}
            </select>

            <div style={{ flex: 1 }} />

            {/* View toggle */}
            <div style={{ display: 'flex', gap: '2px', backgroundColor: C.surface2, borderRadius: R.button, padding: '2px' }}>
              {VIEWS.map((v) => (
                <button
                  key={v}
                  onClick={() => setView(v)}
                  style={{
                    fontFamily: F.body, fontSize: '12px', fontWeight: view === v ? 600 : 400,
                    color: view === v ? C.textPrimary : C.textMuted,
                    backgroundColor: view === v ? C.surface : 'transparent',
                    border: `1px solid ${view === v ? C.border : 'transparent'}`,
                    borderRadius: R.sm,
                    padding: `3px ${S[3]}`, cursor: 'pointer', transition: T.color,
                  }}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>

          {/* Row 2: type pills + status pills */}
          <div style={{ display: 'flex', gap: S[2], flexWrap: 'wrap', alignItems: 'center' }}>
            <FilterPill label="All Types" active={filterType === 'All'} count={contentItems.length} onClick={() => setFilterType('All')} />
            {TYPES.filter((t) => typeCounts[t]).map((t) => (
              <FilterPill key={t} label={t} active={filterType === t} count={typeCounts[t]} onClick={() => setFilterType(filterType === t ? 'All' : t)} />
            ))}

            <div style={{ width: '1px', height: '16px', backgroundColor: C.border, flexShrink: 0 }} />

            <FilterPill label="All Status" active={filterStatus === 'All'} onClick={() => setFilterStatus('All')} />
            {STATUSES.filter((s) => statusCounts[s]).map((s) => (
              <FilterPill key={s} label={s} active={filterStatus === s} count={statusCounts[s]} onClick={() => setFilterStatus(filterStatus === s ? 'All' : s)} />
            ))}
          </div>

          {/* Active filter summary */}
          {hasFilters && (
            <div style={{ display: 'flex', alignItems: 'center', gap: S[2] }}>
              <span style={{ fontFamily: F.mono, fontSize: '11px', color: C.textMuted }}>
                {filtered.length} result{filtered.length !== 1 ? 's' : ''}
              </span>
              <button
                onClick={clearFilters}
                style={{ ...btn.ghost, fontSize: '11px', padding: `1px ${S[2]}`, color: C.textMuted }}
              >
                Clear filters ×
              </button>
            </div>
          )}
        </div>

        {/* Content */}
        <div style={{ animation: 'clFade 0.2s ease' }}>
          {filtered.length === 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: `${S[16]} 0`, gap: S[3] }}>
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                <rect x="4" y="6" width="32" height="28" rx="4" stroke={C.textMuted} strokeWidth="1.5"/>
                <path d="M10 14h20M10 20h14M10 26h8" stroke={C.textMuted} strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              <div style={{ fontFamily: F.body, fontSize: '14px', color: C.textMuted }}>No content matches your filters</div>
              {hasFilters && <button onClick={clearFilters} style={{ ...btn.ghost, fontSize: '13px', color: C.primary }}>Clear filters</button>}
            </div>

          ) : view === 'List' ? (
            <div style={{ backgroundColor: C.surface, border: `1px solid ${C.border}`, borderRadius: R.card, overflow: 'hidden' }}>
              {/* Table header */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '28px 1fr 160px 140px 90px 80px 80px',
                gap: S[3], padding: `${S[2]} ${S[4]}`,
                borderBottom: `1px solid ${C.border}`,
                backgroundColor: C.surface2,
              }}>
                {['', 'Name', 'Campaign', 'Agent', 'Status', 'Score', 'Updated'].map((h) => (
                  <div key={h} style={{ fontFamily: F.mono, fontSize: '10px', fontWeight: 700, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</div>
                ))}
              </div>
              {filtered.map((item) => <ContentListRow key={item.id} item={item} onOpen={setPreview} />)}
            </div>

          ) : view === 'Grid' ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: S[4] }}>
              {filtered.map((item) => <ContentGridCard key={item.id} item={item} onOpen={setPreview} />)}
            </div>

          ) : view === 'By Type' ? (
            <div>{byType.map(([type, items]) => <GroupSection key={type} title={type} items={items} onOpen={setPreview} viewMode={view} />)}</div>

          ) : (
            <div>{byCampaign.map(([campaign, items]) => <GroupSection key={campaign} title={campaign} items={items} onOpen={setPreview} viewMode={view} />)}</div>
          )}
        </div>
      </div>

      {/* Preview modal */}
      {preview && <ContentPreviewModal item={preview} onClose={() => setPreview(null)} />}
    </>
  );
}
