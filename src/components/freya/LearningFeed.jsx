import { useState, useMemo } from 'react';
import { C, F, R, S, badge } from '../../tokens';

const TYPE_CONFIG = {
  icp_refinement: { label: 'ICP Refinement', color: C.secondary, bg: 'rgba(94,234,212,0.12)' },
  content_learning: { label: 'Content Learning', color: '#9B7BBD', bg: 'rgba(155,123,189,0.15)' },
  channel_insight: { label: 'Channel Insight', color: '#5B9BD5', bg: 'rgba(91,155,213,0.15)' },
  timing_insight: { label: 'Timing Insight', color: C.amber, bg: C.amberDim },
};

export default function LearningFeed({ entries = [] }) {
  const [filter, setFilter] = useState('all'); // all | high_confidence | recently_applied

  const filtered = useMemo(() => {
    let list = [...entries].sort((a, b) => (b.date > a.date ? 1 : -1));
    if (filter === 'high_confidence') list = list.filter((e) => e.confidence >= 85);
    if (filter === 'recently_applied') list = list.filter((e) => e.recentlyApplied);
    return list;
  }, [entries, filter]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: S[4] }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: S[3] }}>
        <h3 style={{ fontFamily: F.display, fontSize: '16px', fontWeight: 700, color: C.textPrimary, margin: 0 }}>
          Recent learnings
        </h3>
        <div style={{ display: 'flex', gap: S[1] }}>
          {[
            { id: 'all', label: 'All learnings' },
            { id: 'high_confidence', label: 'High confidence >85%' },
            { id: 'recently_applied', label: 'Recently applied' },
          ].map((f) => (
            <button
              key={f.id}
              style={{
                fontFamily: F.body,
                fontSize: '12px',
                fontWeight: filter === f.id ? 600 : 400,
                color: filter === f.id ? C.primary : C.textSecondary,
                backgroundColor: filter === f.id ? 'rgba(61,220,132,0.12)' : 'transparent',
                border: `1px solid ${filter === f.id ? C.primary : C.border}`,
                borderRadius: R.button,
                padding: `${S[1]} ${S[3]}`,
                cursor: 'pointer',
              }}
              onClick={() => setFilter(f.id)}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: S[3] }}>
        {filtered.map((entry) => {
          const typeConf = TYPE_CONFIG[entry.type] || TYPE_CONFIG.icp_refinement;
          const dateStr = entry.date ? new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '';
          return (
            <div
              key={entry.id}
              style={{
                padding: S[4],
                backgroundColor: C.surface,
                border: `1px solid ${C.border}`,
                borderRadius: R.card,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: S[2], marginBottom: S[2], flexWrap: 'wrap' }}>
                <span style={{ fontFamily: F.mono, fontSize: '11px', color: C.textMuted }}>{dateStr}</span>
                <span
                  style={{
                    fontFamily: F.mono,
                    fontSize: '10px',
                    fontWeight: 700,
                    color: typeConf.color,
                    backgroundColor: typeConf.bg,
                    padding: '2px 8px',
                    borderRadius: R.pill,
                  }}
                >
                  {typeConf.label}
                </span>
                <span style={{ fontFamily: F.mono, fontSize: '11px', color: C.textSecondary }}>{entry.confidence}% confidence</span>
              </div>
              <p style={{ fontFamily: F.body, fontSize: '13px', fontWeight: 600, color: C.textPrimary, margin: '0 0 8px', lineHeight: 1.4 }}>
                {entry.insight}
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: S[2], flexWrap: 'wrap' }}>
                <span style={{ fontFamily: F.body, fontSize: '12px', color: C.textMuted }}>Source: {entry.source}</span>
                <span
                  style={{
                    fontFamily: F.body,
                    fontSize: '11px',
                    color: C.textSecondary,
                    backgroundColor: C.surface2,
                    padding: '2px 8px',
                    borderRadius: R.pill,
                  }}
                >
                  Applied to: {entry.appliedTo}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
