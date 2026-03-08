import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { C, F, R, S, T, badge, cardStyle, btn, shadows, Z } from '../../tokens';
import { DEFAULT_OUTREACH_CAMPAIGN_ID } from '../../data/outreach';

const INTENT_BADGE = {
  high: { ...badge.base, ...badge.green },
  medium: { ...badge.base, ...badge.amber },
  low: { ...badge.base, ...badge.muted },
};

const COLUMNS = [
  { id: 'icp', label: 'ICP', sortKey: 'icpScore', width: '40px', tooltip: 'Ideal Customer Profile fit score (0–100)' },
  { id: 'prospect', label: 'Prospect', sortKey: 'name', width: '1fr', tooltip: 'Contact name and company' },
  { id: 'campaign', label: 'Campaign', sortKey: 'campaignName', width: '100px', tooltip: 'Source campaign' },
  { id: 'channel', label: 'Channel', sortKey: 'channel', width: '72px', tooltip: 'Primary outreach channel' },
  { id: 'intent', label: 'Intent', sortKey: 'intent', width: '88px', tooltip: 'Current intent signal' },
  { id: 'sequence', label: 'Sequence', sortKey: 'sequenceStep', width: '90px', tooltip: 'Step in sequence' },
  { id: 'lastTouch', label: 'Last touch', sortKey: 'lastTouch', width: '88px', tooltip: 'Time since last touch' },
  { id: 'replied', label: 'Replied', sortKey: 'replied', width: '80px', tooltip: 'Has replied' },
  { id: 'actions', label: '', width: '40px' },
];

function IcpScore({ score }) {
  const color = score >= 90 ? C.primary : score >= 75 ? C.amber : C.red;
  return (
    <div style={{ width: '36px', height: '36px', borderRadius: '50%', border: `2px solid ${color}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, backgroundColor: `${color}18` }} title="ICP fit score (0–100)">
      <span style={{ fontFamily: F.mono, fontSize: '11px', fontWeight: 700, color }}>{score}</span>
    </div>
  );
}

function SequenceSteps({ current, total = 5 }) {
  return (
    <div style={{ display: 'flex', gap: '3px', alignItems: 'center' }}>
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: i < current ? C.primary : C.surface3, border: `1px solid ${i < current ? C.primary : C.border}` }} />
      ))}
    </div>
  );
}

function RowActions({ prospect, onViewTimeline, onPause, onMarkReplied, onHandoff, canEdit }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    if (!open) return;
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('click', h);
    return () => document.removeEventListener('click', h);
  }, [open]);

  return (
    <div style={{ position: 'relative' }} ref={ref}>
      <button type="button" style={{ ...btn.icon, padding: S[1] }} onClick={(e) => { e.stopPropagation(); setOpen((o) => !o); }} aria-label="Row actions">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="3" r="1.2" fill="currentColor"/><circle cx="7" cy="7" r="1.2" fill="currentColor"/><circle cx="7" cy="11" r="1.2" fill="currentColor"/></svg>
      </button>
      {open && (
        <div style={{ position: 'absolute', right: 0, top: '100%', marginTop: S[1], minWidth: '160px', backgroundColor: C.surface2, border: `1px solid ${C.border}`, borderRadius: R.md, boxShadow: shadows.dropdown, zIndex: Z.dropdown, padding: S[1] }}>
          <button type="button" style={{ ...btn.ghost, width: '100%', justifyContent: 'flex-start', fontSize: '12px' }} onClick={() => { onViewTimeline(prospect.id); setOpen(false); }}>View timeline</button>
          {canEdit && (
            <>
              <button type="button" style={{ ...btn.ghost, width: '100%', justifyContent: 'flex-start', fontSize: '12px' }} onClick={() => { onPause(prospect.id); setOpen(false); }}>Pause sequence</button>
              <button type="button" style={{ ...btn.ghost, width: '100%', justifyContent: 'flex-start', fontSize: '12px' }} onClick={() => { onMarkReplied(prospect.id); setOpen(false); }}>Mark replied</button>
            </>
          )}
          {prospect.inHandoff && (
            <button type="button" style={{ ...btn.ghost, width: '100%', justifyContent: 'flex-start', fontSize: '12px' }} onClick={() => { onHandoff(prospect.id); setOpen(false); }}>Open handoff</button>
          )}
        </div>
      )}
    </div>
  );
}

export default function OutreachTable({
  prospects,
  visibleColumns,
  sortKey,
  sortDir,
  onSort,
  onRowClick,
  onRowActions,
  canEdit,
}) {
  const navigate = useNavigate();
  const gridCols = COLUMNS.filter((c) => visibleColumns.includes(c.id)).map((c) => c.width).join(' ');

  const handleRowClick = (id) => {
    if (onRowClick) onRowClick(id);
    else navigate(`/campaigns/${DEFAULT_OUTREACH_CAMPAIGN_ID}/prospect/${id}`);
  };

  return (
    <div style={{ ...cardStyle, padding: 0, overflow: 'hidden' }}>
      <div style={{ position: 'sticky', top: 0, zIndex: Z.sticky, display: 'grid', gridTemplateColumns: gridCols, gap: S[3], padding: `${S[2]} ${S[4]}`, borderBottom: `1px solid ${C.border}`, backgroundColor: C.surface3 }}>
        {COLUMNS.filter((c) => visibleColumns.includes(c.id)).map((col) => (
          <button
            key={col.id}
            type="button"
            style={{ display: 'flex', alignItems: 'center', gap: S[1], border: 'none', background: 'none', cursor: col.sortKey ? 'pointer' : 'default', fontFamily: F.body, fontSize: '11px', fontWeight: 600, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'left' }}
            onClick={() => col.sortKey && onSort(col.sortKey)}
            title={col.tooltip}
          >
            {col.label}
            {col.sortKey && sortKey === col.sortKey && <span style={{ color: C.primary }}>{sortDir === 'asc' ? '↑' : '↓'}</span>}
          </button>
        ))}
      </div>
      <div style={{ maxHeight: '60vh', overflowY: 'auto' }}>
        {prospects.map((p, i) => (
          <div
            key={p.id}
            role="button"
            tabIndex={0}
            style={{
              display: 'grid',
              gridTemplateColumns: gridCols,
              gap: S[3],
              padding: `${S[3]} ${S[4]}`,
              alignItems: 'center',
              borderBottom: i < prospects.length - 1 ? `1px solid ${C.border}` : 'none',
              backgroundColor: 'transparent',
              cursor: 'pointer',
              transition: T.color,
            }}
            onClick={() => handleRowClick(p.id)}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleRowClick(p.id); } }}
          >
            {visibleColumns.includes('icp') && (
              <div onClick={(e) => e.stopPropagation()}>
                <IcpScore score={p.icpScore} />
              </div>
            )}
              {visibleColumns.includes('prospect') && (
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontFamily: F.body, fontSize: '13px', fontWeight: 600, color: C.textPrimary, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {p.name}
                    {p.replyPreview && <span style={{ color: C.secondary, fontWeight: 400 }} title={p.replyPreview}> · New reply</span>}
                  </div>
                  <div style={{ fontFamily: F.body, fontSize: '11px', color: C.textMuted }}>{p.title} · {p.company}</div>
                </div>
              )}
              {visibleColumns.includes('campaign') && <span style={{ fontFamily: F.body, fontSize: '11px', color: C.textSecondary }}>{p.campaignName ?? '—'}</span>}
              {visibleColumns.includes('channel') && <span style={{ fontFamily: F.mono, fontSize: '11px', color: C.textSecondary }}>{p.channel ?? 'Email'}</span>}
              {visibleColumns.includes('intent') && <span style={INTENT_BADGE[p.intent]}>{p.intent}</span>}
              {visibleColumns.includes('sequence') && <SequenceSteps current={p.sequenceStep} total={5} />}
              {visibleColumns.includes('lastTouch') && <span style={{ fontFamily: F.mono, fontSize: '11px', color: C.textMuted }}>{p.lastTouch}</span>}
              {visibleColumns.includes('replied') && (
                <div style={{ display: 'flex', alignItems: 'center', gap: S[1] }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: p.replied ? C.primary : C.surface3, border: `1px solid ${p.replied ? C.primary : C.border}` }} />
                  <span style={{ fontFamily: F.mono, fontSize: '11px', color: p.replied ? C.primary : C.textMuted }}>{p.replied ? 'Yes' : 'No'}</span>
                </div>
              )}
              {visibleColumns.includes('actions') && onRowActions && (
                <div onClick={(e) => e.stopPropagation()}>
                  <RowActions prospect={p} onViewTimeline={onRowActions.onViewTimeline} onPause={onRowActions.onPause} onMarkReplied={onRowActions.onMarkReplied} onHandoff={onRowActions.onHandoff} canEdit={canEdit} />
                </div>
              )}
            </div>
        ))}
      </div>
    </div>
  );
}
