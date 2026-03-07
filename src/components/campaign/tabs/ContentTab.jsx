import { useState, useMemo } from 'react';
import useToast from '../../../hooks/useToast';
import { C, F, R, S, badge, flex, btn, cardStyle } from '../../../tokens';
import { TYPE_COLORS } from '../../../config/channelBrands';
import { contentItems } from '../../../data/campaigns';
import ContentPreviewModal from '../ContentPreviewModal';

const STATUS_BADGE = {
  approved: { ...badge.base, ...badge.green },
  live:     { ...badge.base, backgroundColor: 'rgba(94,234,212,0.12)', color: '#5EEAD4', border: '1px solid rgba(94,234,212,0.2)' },
  draft:    { ...badge.base, ...badge.muted },
  paused:   { ...badge.base, ...badge.amber },
};

const TYPE_META = {
  Email:       { color: C.primary, label: 'Email' },
  'LinkedIn Ad': { color: TYPE_COLORS['LinkedIn Ad'], label: 'LinkedIn' },
  'Meta Ad':   { color: TYPE_COLORS['Meta Ad'], label: 'Meta' },
  Blog:        { color: C.amber, label: 'Blog' },
};

function getKeyMetric(item) {
  if (item.type === 'Email') return item.opens ? `Opens ${item.opens}` : null;
  if (item.type === 'LinkedIn Ad' || item.type === 'Meta Ad') return item.ctr ? `CTR ${item.ctr}` : item.impressions || null;
  if (item.type === 'Blog') return item.views && item.views !== '—' ? `${item.views} views` : 'Draft';
  return null;
}

function ContentCard({ item, onPreview, onEdit, toast }) {
  const meta = TYPE_META[item.type] ?? { color: C.textSecondary, label: item.type };
  const keyMetric = getKeyMetric(item);

  return (
    <div
      style={{
        ...cardStyle,
        padding: S[4],
        display: 'flex',
        flexDirection: 'column',
        gap: S[3],
        cursor: 'pointer',
        transition: 'box-shadow 0.2s, border-color 0.2s',
        borderLeft: `4px solid ${meta.color}`,
      }}
      onClick={() => onPreview(item)}
      onKeyDown={(e) => e.key === 'Enter' && onPreview(item)}
      role="button"
      tabIndex={0}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: S[2] }}>
        <span
          style={{
            fontFamily: F.mono,
            fontSize: '10px',
            fontWeight: 700,
            color: meta.color,
            backgroundColor: `${meta.color}18`,
            border: `1px solid ${meta.color}33`,
            borderRadius: R.pill,
            padding: `2px ${S[2]}`,
            whiteSpace: 'nowrap',
          }}
        >
          {meta.label}
        </span>
        <span style={STATUS_BADGE[item.status] ?? STATUS_BADGE.draft}>{item.status}</span>
      </div>
      <h3
        style={{
          fontFamily: F.body,
          fontSize: '14px',
          fontWeight: 600,
          color: C.textPrimary,
          margin: 0,
          lineHeight: 1.3,
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}
      >
        {item.name}
      </h3>
      {keyMetric && (
        <span style={{ fontFamily: F.mono, fontSize: '12px', color: C.textMuted }}>
          {keyMetric}
        </span>
      )}
      <div style={{ display: 'flex', gap: S[2], marginTop: 'auto', paddingTop: S[2] }} onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          style={{ ...btn.primary, fontSize: '12px', padding: `${S[1]} ${S[3]}` }}
          onClick={(e) => { e.stopPropagation(); onPreview(item); }}
        >
          Preview
        </button>
        <button
          type="button"
          style={{ ...btn.ghost, fontSize: '12px', padding: `${S[1]} ${S[3]}` }}
          onClick={(e) => { e.stopPropagation(); onEdit?.(); }}
        >
          Edit
        </button>
      </div>
    </div>
  );
}

export default function ContentTab() {
  const toast = useToast();
  const [previewItem, setPreviewItem] = useState(null);
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  const filtered = useMemo(() => {
    return contentItems.filter((item) => {
      const typeMatch = filterType === 'all' || item.type === filterType;
      const statusMatch = filterStatus === 'all' || item.status === filterStatus;
      return typeMatch && statusMatch;
    });
  }, [filterType, filterStatus]);

  const counts = useMemo(() => {
    const byStatus = { draft: 0, approved: 0, live: 0, paused: 0 };
    contentItems.forEach((item) => {
      if (byStatus[item.status] !== undefined) byStatus[item.status]++;
    });
    return byStatus;
  }, []);

  const typeOptions = useMemo(() => {
    const types = ['all', ...new Set(contentItems.map((i) => i.type))];
    return types.map((t) => ({ value: t, label: t === 'all' ? 'All types' : t }));
  }, []);

  const statusOptions = [
    { value: 'all', label: 'All statuses' },
    { value: 'draft', label: `Draft (${counts.draft})` },
    { value: 'approved', label: `Approved (${counts.approved})` },
    { value: 'live', label: `Live (${counts.live})` },
    { value: 'paused', label: `Paused (${counts.paused})` },
  ];

  return (
    <>
      {previewItem && (
        <ContentPreviewModal item={previewItem} onClose={() => setPreviewItem(null)} />
      )}
      <div style={{ padding: S[5], display: 'flex', flexDirection: 'column', gap: S[5] }}>
        {/* Header */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: S[2] }}>
          <div style={flex.rowBetween}>
            <div>
              <h1 style={{ fontFamily: F.display, fontSize: '20px', fontWeight: 700, color: C.textPrimary, margin: 0, letterSpacing: '-0.02em' }}>
                Campaign content
              </h1>
              <p style={{ fontFamily: F.body, fontSize: '13px', color: C.textSecondary, margin: `${S[1]} 0 0` }}>
                All copy, creatives, and assets for this campaign. Preview, edit, or generate new items with Freya.
              </p>
            </div>
            <div style={{ display: 'flex', gap: S[2], flexShrink: 0 }}>
              <button
                type="button"
                style={{ ...btn.secondary, fontSize: '13px' }}
                onClick={() => toast.info('Add content')}
              >
                Add content
              </button>
              <button
                type="button"
                style={{ ...btn.primary, fontSize: '13px' }}
                onClick={() => toast.success('Generating content with Freya…')}
              >
                Generate with Freya
              </button>
            </div>
          </div>
        </div>

        {/* Stats strip */}
        <div
          style={{
            display: 'flex',
            gap: S[4],
            padding: S[4],
            backgroundColor: C.surface2,
            border: `1px solid ${C.border}`,
            borderRadius: R.card,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: S[2] }}>
            <span style={{ fontFamily: F.mono, fontSize: '18px', fontWeight: 700, color: C.textPrimary }}>{contentItems.length}</span>
            <span style={{ fontFamily: F.body, fontSize: '13px', color: C.textSecondary }}>total items</span>
          </div>
          <div style={{ width: '1px', height: '20px', backgroundColor: C.border }} />
          {(['draft', 'approved', 'live', 'paused']).map((s) => (
            <div key={s} style={{ display: 'flex', alignItems: 'center', gap: S[1] }}>
              <span style={STATUS_BADGE[s]}>{s}</span>
              <span style={{ fontFamily: F.mono, fontSize: '13px', color: C.textSecondary }}>{counts[s] ?? 0}</span>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: S[3], alignItems: 'center' }}>
          <span style={{ fontFamily: F.body, fontSize: '12px', color: C.textMuted, marginRight: S[1] }}>Type:</span>
          {typeOptions.map((opt) => (
            <button
              key={opt.value}
              type="button"
              style={{
                fontFamily: F.body,
                fontSize: '12px',
                padding: `${S[1]} ${S[3]}`,
                borderRadius: R.pill,
                border: `1px solid ${filterType === opt.value ? C.primary : C.border}`,
                backgroundColor: filterType === opt.value ? C.primaryGlow : C.surface2,
                color: filterType === opt.value ? C.primary : C.textSecondary,
                cursor: 'pointer',
              }}
              onClick={() => setFilterType(opt.value)}
            >
              {opt.label}
            </button>
          ))}
          <span style={{ fontFamily: F.body, fontSize: '12px', color: C.textMuted, marginLeft: S[2], marginRight: S[1] }}>Status:</span>
          {statusOptions.map((opt) => (
            <button
              key={opt.value}
              type="button"
              style={{
                fontFamily: F.body,
                fontSize: '12px',
                padding: `${S[1]} ${S[3]}`,
                borderRadius: R.pill,
                border: `1px solid ${filterStatus === opt.value ? C.primary : C.border}`,
                backgroundColor: filterStatus === opt.value ? C.primaryGlow : C.surface2,
                color: filterStatus === opt.value ? C.primary : C.textSecondary,
                cursor: 'pointer',
              }}
              onClick={() => setFilterStatus(opt.value)}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* Content grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: S[4],
          }}
        >
          {filtered.length === 0 ? (
            <div
              style={{
                gridColumn: '1 / -1',
                padding: S[8],
                textAlign: 'center',
                backgroundColor: C.surface2,
                border: `1px dashed ${C.border}`,
                borderRadius: R.card,
              }}
            >
              <p style={{ fontFamily: F.body, fontSize: '14px', color: C.textMuted, margin: 0 }}>
                No content matches the current filters. Try changing type or status.
              </p>
            </div>
          ) : (
            filtered.map((item) => (
              <ContentCard
                key={item.id}
                item={item}
                onPreview={setPreviewItem}
                onEdit={() => toast.info('Edit coming soon')}
                toast={toast}
              />
            ))
          )}
        </div>
      </div>
    </>
  );
}
