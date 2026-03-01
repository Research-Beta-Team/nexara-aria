import { useState } from 'react';
import useToast from '../../../hooks/useToast';
import { C, F, R, S, T, badge, flex } from '../../../tokens';
import { contentItems } from '../../../data/campaigns';
import ContentPreviewModal from '../ContentPreviewModal';

const STATUS_BADGE = {
  approved: { ...badge.base, ...badge.green },
  live:     { ...badge.base, backgroundColor: 'rgba(94,234,212,0.12)', color: '#5EEAD4', border: '1px solid rgba(94,234,212,0.2)' },
  draft:    { ...badge.base, ...badge.muted },
  paused:   { ...badge.base, ...badge.amber },
};

const TYPE_COLORS = {
  Email:       C.primary,
  'LinkedIn Ad': '#0A66C2',
  'Meta Ad':   '#1877F2',
  Blog:        C.amber,
};

function ContentRow({ item, onClick, isLast }) {
  const [hovered, setHovered] = useState(false);

  const metrics = {
    Email:        [{ l: 'Opens', v: item.opens }, { l: 'Clicks', v: item.clicks }, { l: 'Replies', v: item.replies }],
    'LinkedIn Ad':[{ l: 'Impressions', v: item.impressions }, { l: 'CTR', v: item.ctr }, { l: 'CPL', v: item.cpl }],
    'Meta Ad':    [{ l: 'Impressions', v: item.impressions }, { l: 'CTR', v: item.ctr }, { l: 'CPL', v: item.cpl }],
    Blog:         [{ l: 'Views', v: item.views ?? '—' }, { l: 'Reads', v: item.reads ?? '—' }],
  };

  const rowMetrics = metrics[item.type] ?? [];
  const typeColor = TYPE_COLORS[item.type] ?? C.textSecondary;

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: S[4],
        padding: `${S[3]} ${S[4]}`,
        borderBottom: isLast ? 'none' : `1px solid ${C.border}`,
        cursor: 'pointer',
        backgroundColor: hovered ? C.surface3 : 'transparent',
        transition: T.color,
        borderLeft: `3px solid ${typeColor}`,
      }}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Type tag */}
      <span style={{
        fontFamily: F.mono, fontSize: '10px', fontWeight: 700, color: typeColor,
        backgroundColor: `${typeColor}18`, border: `1px solid ${typeColor}33`,
        borderRadius: R.pill, padding: `2px ${S[2]}`, whiteSpace: 'nowrap', flexShrink: 0,
      }}>
        {item.type}
      </span>

      {/* Name */}
      <span style={{ fontFamily: F.body, fontSize: '13px', color: C.textPrimary, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {item.name}
      </span>

      {/* Metrics */}
      {rowMetrics.map(({ l, v }) => v && (
        <div key={l} style={{ display: 'flex', flexDirection: 'column', gap: '1px', alignItems: 'flex-end', minWidth: '50px' }}>
          <span style={{ fontFamily: F.mono, fontSize: '12px', fontWeight: 700, color: C.textPrimary }}>{v}</span>
          <span style={{ fontFamily: F.body, fontSize: '10px', color: C.textMuted }}>{l}</span>
        </div>
      ))}

      {/* Status */}
      <span style={STATUS_BADGE[item.status] ?? STATUS_BADGE.draft}>{item.status}</span>

      {/* Arrow */}
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ color: C.textMuted, flexShrink: 0 }}>
        <path d="M4 7h6M7 4l3 3-3 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </div>
  );
}

export default function ContentTab() {
  const toast = useToast();
  const [previewItem, setPreviewItem] = useState(null);

  return (
    <>
      {previewItem && (
        <ContentPreviewModal item={previewItem} onClose={() => setPreviewItem(null)} />
      )}
      <div style={{ padding: S[5], display: 'flex', flexDirection: 'column', gap: S[4] }}>
        {/* Header */}
        <div style={flex.rowBetween}>
          <span style={{ fontFamily: F.display, fontSize: '13px', fontWeight: 700, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            {contentItems.length} content items
          </span>
          <button
            style={{
              fontFamily: F.body, fontSize: '13px', fontWeight: 600,
              color: C.primary, backgroundColor: C.primaryGlow,
              border: `1px solid rgba(61,220,132,0.25)`, borderRadius: R.button,
              padding: `${S[1]} ${S[4]}`, cursor: 'pointer',
            }}
            onClick={() => toast.success('Generating content with ARIA…')}
          >
            Generate with ARIA
          </button>
        </div>

        {/* Content list */}
        <div style={{
          backgroundColor: C.surface2,
          border: `1px solid ${C.border}`,
          borderRadius: R.card,
          overflow: 'hidden',
        }}>
          {/* Table header */}
          <div style={{
            display: 'flex',
            gap: S[4],
            padding: `${S[2]} ${S[4]}`,
            borderBottom: `1px solid ${C.border}`,
            backgroundColor: C.surface3,
          }}>
            {['Type', 'Name', '', 'Metrics', '', '', 'Status', ''].map((h, i) => (
              <span key={i} style={{ fontFamily: F.body, fontSize: '11px', fontWeight: 600, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em', ...(i === 1 ? { flex: 1 } : {}) }}>
                {h}
              </span>
            ))}
          </div>

          {contentItems.map((item, i) => (
            <ContentRow
              key={item.id}
              item={item}
              onClick={() => setPreviewItem(item)}
              isLast={i === contentItems.length - 1}
            />
          ))}
        </div>
      </div>
    </>
  );
}
