/**
 * One namespace card: header (icon + name + count), last updated, entries (max 4 + "show all"), "+ Add to Memory".
 */
import { useState } from 'react';
import { C, F, R, S } from '../../tokens';
import MemoryEntryRow from './MemoryEntryRow';

const NAMESPACE_META = {
  brand: { label: 'Brand Memory', color: '#3DDC84', icon: 'building-2' },
  audience: { label: 'Audience & ICP', color: '#5EEAD4', icon: 'users' },
  campaigns: { label: 'Campaign Memory', color: '#F5C842', icon: 'zap' },
  performance: { label: 'Performance Memory', color: '#A78BFA', icon: 'bar-chart-3' },
};

const VISIBLE_ENTRIES = 4;

function formatLastUpdated(entries) {
  if (!entries?.length) return null;
  const dates = entries.map((e) => e.updatedAt).filter(Boolean);
  if (!dates.length) return null;
  const latest = new Date(Math.max(...dates.map((d) => new Date(d).getTime())));
  const diffMs = Date.now() - latest.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  if (diffMins < 60) return `${diffMins} min ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
  return latest.toLocaleDateString();
}

export default function MemoryNamespaceCard({ namespaceKey, entries, onAdd, onEdit, onDelete }) {
  const [expanded, setExpanded] = useState(false);
  const meta = NAMESPACE_META[namespaceKey] || { label: namespaceKey, color: C.primary };
  const list = Array.isArray(entries) ? entries : [];
  const visible = expanded ? list : list.slice(0, VISIBLE_ENTRIES);
  const hasMore = list.length > VISIBLE_ENTRIES;
  const lastUpdated = formatLastUpdated(list);

  return (
    <div
      style={{
        backgroundColor: C.surface,
        border: `1px solid ${C.border}`,
        borderRadius: R.card,
        padding: S[5],
        display: 'flex',
        flexDirection: 'column',
        gap: S[3],
        transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'rgba(61,220,132,0.3)';
        e.currentTarget.style.boxShadow = '0 0 0 1px rgba(61,220,132,0.2)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = C.border;
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: S[2] }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: S[2] }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: R.md,
              backgroundColor: meta.color + '22',
              border: `1px solid ${meta.color}44`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: meta.color,
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              {namespaceKey === 'brand' && <path d="M3 21h18M3 10h18M5 6l7-3 7 3M4 10v11M20 10v11M8 14v3M12 14v3M16 14v3" />}
              {namespaceKey === 'audience' && <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />}
              {namespaceKey === 'campaigns' && <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />}
              {namespaceKey === 'performance' && <path d="M3 17v-4h4v4H3zM10 17V9h4v8h-4zM17 17V3h4v14h-4z" />}
            </svg>
          </div>
          <span style={{ fontFamily: F.body, fontSize: '14px', fontWeight: 600, color: C.textPrimary }}>
            {meta.label}
          </span>
          <span
            style={{
              fontFamily: F.mono,
              fontSize: '11px',
              fontWeight: 700,
              color: C.textMuted,
              backgroundColor: C.surface3,
              padding: '2px 8px',
              borderRadius: R.pill,
            }}
          >
            {list.length}
          </span>
        </div>
        {lastUpdated && (
          <span style={{ fontFamily: F.body, fontSize: '11px', color: C.textMuted }}>
            Updated {lastUpdated}
          </span>
        )}
      </div>

      {list.length === 0 ? (
        <div
          style={{
            padding: S[6],
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: S[3],
            backgroundColor: C.surface2,
            borderRadius: R.md,
            border: `1px dashed ${C.border}`,
          }}
        >
          <div style={{ width: 40, height: 40, color: C.textMuted }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 6v6l4 2" />
            </svg>
          </div>
          <span style={{ fontFamily: F.body, fontSize: '13px', color: C.textMuted, textAlign: 'center' }}>
            Freya doesn't know this yet. Add your first memory.
          </span>
          <button
            type="button"
            onClick={() => onAdd(namespaceKey)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: S[2],
              padding: `${S[2]} ${S[4]}`,
              fontFamily: F.body,
              fontSize: '13px',
              fontWeight: 600,
              color: C.primary,
              backgroundColor: C.primaryDim,
              border: `1px solid ${C.primaryGlow}`,
              borderRadius: R.button,
              cursor: 'pointer',
            }}
          >
            + Add
          </button>
        </div>
      ) : (
        <>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {visible.map((entry) => (
              <MemoryEntryRow
                key={entry.id}
                entry={entry}
                dotColor={meta.color}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </div>
          {hasMore && (
            <button
              type="button"
              onClick={() => setExpanded(!expanded)}
              style={{
                fontFamily: F.body,
                fontSize: '12px',
                fontWeight: 500,
                color: C.primary,
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: S[1],
                alignSelf: 'flex-start',
              }}
            >
              {expanded ? 'Show less' : `Show all (${list.length})`}
            </button>
          )}
          <button
            type="button"
            onClick={() => onAdd(namespaceKey)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: S[2],
              padding: `${S[2]} ${S[3]}`,
              fontFamily: F.body,
              fontSize: '12px',
              fontWeight: 500,
              color: C.textSecondary,
              backgroundColor: 'transparent',
              border: `1px solid ${C.border}`,
              borderRadius: R.button,
              cursor: 'pointer',
              marginTop: S[2],
            }}
          >
            + Add to Memory
          </button>
        </>
      )}
    </div>
  );
}
