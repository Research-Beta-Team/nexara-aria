import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { C, F, R, S, T, badge, cardStyle } from '../../tokens';
import { DEFAULT_OUTREACH_CAMPAIGN_ID } from '../../data/outreach';

const INTENT_BADGE = {
  high: { ...badge.base, ...badge.green },
  medium: { ...badge.base, ...badge.amber },
  low: { ...badge.base, ...badge.muted },
};

export default function OutreachTileView({ prospects, onSelectProspect, selectedIds, onToggleSelect }) {
  const navigate = useNavigate();

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: S[4] }}>
      {prospects.map((p) => {
        const selected = selectedIds && selectedIds.has(p.id);
        return (
          <div
            key={p.id}
            role="button"
            tabIndex={0}
            style={{
              ...cardStyle,
              padding: S[4],
              cursor: 'pointer',
              borderColor: selected ? C.primary : undefined,
              boxShadow: selected ? `0 0 0 2px ${C.primaryGlow}` : undefined,
              transition: T.base,
            }}
            onClick={() => (onSelectProspect ? onSelectProspect(p.id) : navigate(`/campaigns/${DEFAULT_OUTREACH_CAMPAIGN_ID}/prospect/${p.id}`))}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onSelectProspect ? onSelectProspect(p.id) : navigate(`/campaigns/${DEFAULT_OUTREACH_CAMPAIGN_ID}/prospect/${p.id}`);
              }
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: S[2], marginBottom: S[2] }}>
              {onToggleSelect && (
                <input
                  type="checkbox"
                  checked={!!selected}
                  onChange={(e) => { e.stopPropagation(); onToggleSelect(p.id); }}
                  onClick={(e) => e.stopPropagation()}
                  style={{ marginTop: '2px' }}
                />
              )}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: F.display, fontSize: '14px', fontWeight: 700, color: C.textPrimary }}>{p.name}</div>
                <div style={{ fontFamily: F.body, fontSize: '12px', color: C.textMuted }}>{p.title} · {p.company}</div>
              </div>
              <span style={INTENT_BADGE[p.intent]}>{p.intent}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: F.mono, fontSize: '11px', color: C.textMuted }}>
              <span>ICP {p.icpScore}</span>
              <span>{p.lastTouch}</span>
            </div>
            {p.replyPreview && (
              <div style={{ marginTop: S[2], fontFamily: F.body, fontSize: '12px', color: C.secondary, fontStyle: 'italic' }} title="Reply preview">
                "{p.replyPreview}…"
              </div>
            )}
            {p.inHandoff && (
              <span style={{ ...badge.base, ...badge.green, marginTop: S[2], display: 'inline-block' }}>In handoff</span>
            )}
          </div>
        );
      })}
    </div>
  );
}
