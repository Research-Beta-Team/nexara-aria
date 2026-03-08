import { useState, useEffect, useCallback, useRef } from 'react';
import { C, F, R, S, btn, inputStyle, shadows, Z } from '../../tokens';
import { OUTREACH_SAVED_VIEWS } from '../../data/outreach';

const FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'replied', label: 'Replied' },
  { id: 'high', label: 'High intent' },
  { id: 'active', label: 'In sequence' },
];

const DATE_RANGES = [
  { id: 'all', label: 'All time' },
  { id: '7', label: 'Last 7 days' },
  { id: '30', label: 'Last 30 days' },
  { id: '90', label: 'Last 90 days' },
];

export default function OutreachFilters({
  filter,
  setFilter,
  search,
  setSearch,
  dateRange,
  setDateRange,
  campaignId,
  setCampaignId,
  savedViewId,
  setSavedViewId,
  campaigns = [],
  viewMode,
  setViewMode,
  onExportCsv,
}) {
  const [searchInput, setSearchInput] = useState(search);
  const [filterOpen, setFilterOpen] = useState(false);
  const filterRef = useRef(null);

  useEffect(() => setSearchInput(search), [search]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (filterRef.current && !filterRef.current.contains(e.target)) setFilterOpen(false);
    };
    if (filterOpen) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [filterOpen]);

  const debouncedSetSearch = useCallback((value) => {
    const t = setTimeout(() => setSearch(value), 300);
    return () => clearTimeout(t);
  }, [setSearch]);

  useEffect(() => {
    const cancel = debouncedSetSearch(searchInput);
    return cancel;
  }, [searchInput, debouncedSetSearch]);

  const hasActiveFilters = dateRange !== 'all' || campaignId || savedViewId;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: S[3] }}>
      <div style={{ display: 'flex', gap: S[3], flexWrap: 'wrap', alignItems: 'center' }}>
        {FILTERS.map((f) => (
          <button
            key={f.id}
            type="button"
            style={{
              ...(filter === f.id ? btn.primary : btn.secondary),
              fontSize: '12px',
              padding: `${S[2]} ${S[3]}`,
            }}
            onClick={() => setFilter(f.id)}
          >
            {f.label}
          </button>
        ))}
        <div ref={filterRef} style={{ position: 'relative' }}>
          <button
            type="button"
            style={{
              ...btn.secondary,
              fontSize: '12px',
              padding: `${S[2]} ${S[3]}`,
              display: 'inline-flex',
              alignItems: 'center',
              gap: S[1],
              borderColor: filterOpen ? C.primary : undefined,
              color: filterOpen ? C.primary : undefined,
            }}
            onClick={() => setFilterOpen((o) => !o)}
          >
            Filters
            {hasActiveFilters && (
              <span style={{
                minWidth: '16px', height: '16px', borderRadius: '50%',
                backgroundColor: C.primary, color: C.textInverse,
                fontSize: '10px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {[dateRange !== 'all', !!campaignId, !!savedViewId].filter(Boolean).length}
              </span>
            )}
            <svg width="12" height="12" viewBox="0 0 12 12" style={{ transform: filterOpen ? 'rotate(180deg)' : 'none' }}>
              <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
            </svg>
          </button>
          {filterOpen && (
            <div
              style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                marginTop: S[1],
                backgroundColor: C.surface,
                border: `1px solid ${C.border}`,
                borderRadius: R.md,
                boxShadow: shadows.dropdown,
                zIndex: Z.overlay,
                padding: S[3],
                minWidth: '240px',
                display: 'flex',
                flexDirection: 'column',
                gap: S[3],
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div>
                <label style={{ fontFamily: F.body, fontSize: '11px', fontWeight: 600, color: C.textMuted, display: 'block', marginBottom: S[1] }}>Date</label>
                <select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  style={{ ...inputStyle, width: '100%', padding: `${S[2]} ${S[3]}`, fontSize: '12px' }}
                >
                  {DATE_RANGES.map((d) => (
                    <option key={d.id} value={d.id}>{d.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={{ fontFamily: F.body, fontSize: '11px', fontWeight: 600, color: C.textMuted, display: 'block', marginBottom: S[1] }}>Campaign</label>
                <select
                  value={campaignId}
                  onChange={(e) => setCampaignId(e.target.value)}
                  style={{ ...inputStyle, width: '100%', padding: `${S[2]} ${S[3]}`, fontSize: '12px' }}
                >
                  <option value="">All campaigns</option>
                  {campaigns.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={{ fontFamily: F.body, fontSize: '11px', fontWeight: 600, color: C.textMuted, display: 'block', marginBottom: S[1] }}>Saved view</label>
                <select
                  value={savedViewId}
                  onChange={(e) => {
                    const id = e.target.value;
                    setSavedViewId(id);
                    const sv = OUTREACH_SAVED_VIEWS.find((v) => v.id === id);
                    if (sv) setFilter(sv.filter.filter);
                  }}
                  style={{ ...inputStyle, width: '100%', padding: `${S[2]} ${S[3]}`, fontSize: '12px' }}
                >
                  <option value="">—</option>
                  {OUTREACH_SAVED_VIEWS.map((v) => (
                    <option key={v.id} value={v.id}>{v.label}</option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: S[2] }}>
        <input
          type="search"
          placeholder="Search by name, company, title…"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          style={{ ...inputStyle, minWidth: '220px', padding: `${S[2]} ${S[3]}`, fontSize: '13px' }}
        />
        <div style={{ display: 'flex', alignItems: 'center', gap: S[2] }}>
          <div style={{ display: 'flex', gap: 0 }}>
            <button
              type="button"
              title="List view"
              onClick={() => setViewMode('list')}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                width: '32px', height: '32px',
                border: `1px solid ${viewMode === 'list' ? C.primary : C.border}`,
                borderRight: 'none',
                borderRadius: `${R.sm} 0 0 ${R.sm}`,
                backgroundColor: viewMode === 'list' ? C.primaryGlow : 'transparent',
                color: viewMode === 'list' ? C.primary : C.textMuted,
                cursor: 'pointer',
              }}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M2 3h10M2 7h10M2 11h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </button>
            <button
              type="button"
              title="Tile view"
              onClick={() => setViewMode('tile')}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                width: '32px', height: '32px',
                border: `1px solid ${viewMode === 'tile' ? C.primary : C.border}`,
                borderRadius: `0 ${R.sm} ${R.sm} 0`,
                backgroundColor: viewMode === 'tile' ? C.primaryGlow : 'transparent',
                color: viewMode === 'tile' ? C.primary : C.textMuted,
                cursor: 'pointer',
              }}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <rect x="1" y="1" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.5"/>
                <rect x="8" y="1" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.5"/>
                <rect x="1" y="8" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.5"/>
                <rect x="8" y="8" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.5"/>
              </svg>
            </button>
          </div>
          <button type="button" style={{ ...btn.secondary, fontSize: '12px' }} onClick={onExportCsv}>
            Export CSV
          </button>
        </div>
      </div>
    </div>
  );
}
