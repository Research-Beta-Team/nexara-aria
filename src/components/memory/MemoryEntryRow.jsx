/**
 * Single memory entry row: colored dot, truncated text (80 chars), source badge.
 * Source badge colors: Manual=muted | Freya-Detected=mint | Campaign Import=teal | CRM Sync=amber
 */
import { useState } from 'react';
import { C, F, R, S } from '../../tokens';

const MAX_CHARS = 80;
const SOURCE_STYLES = {
  Manual: { bg: C.surface3, color: C.textSecondary, border: C.border },
  'Freya-Detected': { bg: 'rgba(61,220,132,0.15)', color: C.primary, border: 'rgba(61,220,132,0.35)' },
  'Campaign Import': { bg: 'rgba(94,234,212,0.15)', color: C.secondary, border: 'rgba(94,234,212,0.35)' },
  'CRM Sync': { bg: C.amberDim, color: C.amber, border: C.amber },
};

export default function MemoryEntryRow({ entry, dotColor, onEdit, onDelete }) {
  const [hover, setHover] = useState(false);
  const text = entry?.content || '';
  const truncated = text.length > MAX_CHARS ? text.slice(0, MAX_CHARS) + '…' : text;
  const source = entry?.source || 'Manual';
  const sourceStyle = SOURCE_STYLES[source] || SOURCE_STYLES.Manual;

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: S[2],
        padding: `${S[1]} 0`,
        borderBottom: `1px solid ${C.border}`,
        minHeight: 36,
      }}
    >
      <div
        style={{
          width: 8,
          height: 8,
          borderRadius: '50%',
          backgroundColor: dotColor,
          flexShrink: 0,
          marginTop: 6,
        }}
      />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          title={text}
          style={{
            fontFamily: F.body,
            fontSize: '13px',
            color: C.textPrimary,
            lineHeight: 1.4,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {truncated}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: S[2], marginTop: S[1], flexWrap: 'wrap' }}>
          <span
            style={{
              fontFamily: F.mono,
              fontSize: '10px',
              fontWeight: 600,
              padding: '2px 6px',
              borderRadius: R.pill,
              backgroundColor: sourceStyle.bg,
              color: sourceStyle.color,
              border: `1px solid ${sourceStyle.border}`,
            }}
          >
            {source}
          </span>
          {hover && (
            <>
              {onEdit && (
                <button
                  type="button"
                  onClick={() => onEdit(entry)}
                  style={{
                    padding: 0,
                    border: 'none',
                    background: 'none',
                    color: C.textMuted,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                  }}
                  title="Edit"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                  </svg>
                </button>
              )}
              {onDelete && (
                <button
                  type="button"
                  onClick={() => onDelete(entry.id)}
                  style={{
                    padding: 0,
                    border: 'none',
                    background: 'none',
                    color: C.textMuted,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = C.red; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = C.textMuted; }}
                  title="Delete"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                    <line x1="10" y1="11" x2="10" y2="17" />
                    <line x1="14" y1="11" x2="14" y2="17" />
                  </svg>
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
