import { useState } from 'react';
import { C, F, R, S, btn, badge } from '../../tokens';

const ROLE_LABEL = {
  champion: 'Champion',
  economic_buyer: 'Economic buyer',
  technical: 'Technical',
  legal: 'Legal',
};

function sentimentColor(sentiment) {
  switch (sentiment) {
    case 'positive': return C.primary;
    case 'negative': return C.red;
    case 'neutral': return C.textSecondary;
    default: return C.textMuted;
  }
}

function sentimentBorder(sentiment) {
  switch (sentiment) {
    case 'positive': return 'rgba(61,220,132,0.4)';
    case 'negative': return 'rgba(255,110,122,0.4)';
    case 'neutral': return C.border;
    default: return C.border;
  }
}

export default function AccountHeatMap({ account, onSelectStakeholder, toast }) {
  const [selectedStakeholder, setSelectedStakeholder] = useState(null);
  const stakeholders = account?.stakeholders || [];
  const touchpoints = account?.touchpoints || [];

  const handleNodeClick = (s) => {
    setSelectedStakeholder(s);
    onSelectStakeholder?.(s);
  };

  // Node size scale: engagement 0-100 -> ~36px to ~56px
  const nodeSize = (engagement) => Math.max(36, Math.min(56, 36 + (engagement / 100) * 20));

  return (
    <div style={{ display: 'flex', gap: S[6], minHeight: 360 }}>
      <div style={{ flex: 1, display: 'flex', flexWrap: 'wrap', gap: S[5], alignContent: 'flex-start', alignItems: 'flex-start' }}>
        {stakeholders.map((s) => {
          const size = nodeSize(s.engagement);
          const borderColor = sentimentBorder(s.sentiment);
          const fillColor = sentimentColor(s.sentiment);
          return (
            <div
              key={s.id}
              style={{
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: S[1],
              }}
            >
              {/* Connector line placeholder (visual only) */}
              {stakeholders.indexOf(s) > 0 && (
                <div
                  style={{
                    position: 'absolute',
                    left: -S[5],
                    top: size / 2,
                    width: S[3],
                    height: 1,
                    backgroundColor: C.border,
                  }}
                />
              )}
              <button
                onClick={() => handleNodeClick(s)}
                style={{
                  width: size,
                  height: size,
                  borderRadius: '50%',
                  border: `2px solid ${borderColor}`,
                  backgroundColor: `${fillColor}20`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  flexShrink: 0,
                }}
              >
                <span style={{ fontFamily: F.mono, fontSize: 10, fontWeight: 700, color: fillColor }}>
                  {s.name.split(' ').map((n) => n[0]).join('')}
                </span>
              </button>
              <div style={{ textAlign: 'center', maxWidth: 90 }}>
                <div style={{ fontFamily: F.body, fontSize: '11px', fontWeight: 600, color: C.textPrimary }}>{s.name}</div>
                <div style={{ fontFamily: F.body, fontSize: '10px', color: C.textSecondary }}>{s.title}</div>
                <span style={{ ...badge.base, ...badge.muted, fontSize: '9px', marginTop: 2 }}>{ROLE_LABEL[s.role] || s.role}</span>
                <div style={{ fontFamily: F.mono, fontSize: '9px', color: C.textMuted }}>Touched {s.lastTouched}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Slide-in stakeholder detail panel */}
      {selectedStakeholder && (
        <div
          style={{
            width: 320,
            flexShrink: 0,
            backgroundColor: C.surface2,
            border: `1px solid ${C.border}`,
            borderRadius: R.card,
            padding: S[5],
            display: 'flex',
            flexDirection: 'column',
            gap: S[4],
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h3 style={{ fontFamily: F.display, fontSize: '16px', fontWeight: 700, color: C.textPrimary, margin: 0 }}>
              {selectedStakeholder.name}
            </h3>
            <button
              style={{ ...btn.ghost, padding: S[1] }}
              onClick={() => setSelectedStakeholder(null)}
            >
              ✕
            </button>
          </div>
          <div style={{ fontFamily: F.body, fontSize: '13px', color: C.textSecondary }}>{selectedStakeholder.title}</div>
          <span style={{ ...badge.base, ...badge.muted }}>{ROLE_LABEL[selectedStakeholder.role]}</span>
          <div>
            <span style={{ fontFamily: F.mono, fontSize: '10px', color: C.textMuted, textTransform: 'uppercase' }}>Preferred channel</span>
            <div style={{ fontFamily: F.body, fontSize: '13px', color: C.textPrimary }}>{selectedStakeholder.channel}</div>
          </div>
          <div>
            <span style={{ fontFamily: F.mono, fontSize: '10px', color: C.textMuted, textTransform: 'uppercase' }}>Touchpoint history</span>
            <div style={{ marginTop: S[2], display: 'flex', flexDirection: 'column', gap: S[1] }}>
              {touchpoints
                .filter((t) => t.stakeholderName === selectedStakeholder.name)
                .map((t, i) => (
                  <div
                    key={i}
                    style={{
                      padding: S[2],
                      backgroundColor: C.surface3,
                      borderRadius: R.sm,
                      fontFamily: F.body,
                      fontSize: '12px',
                      color: C.textPrimary,
                    }}
                  >
                    {t.date} · {t.type} ({t.direction}) — {t.outcome}
                  </div>
                ))}
            </div>
          </div>
          <div>
            <span style={{ fontFamily: F.mono, fontSize: '10px', color: C.textMuted, textTransform: 'uppercase' }}>ARIA notes</span>
            <p style={{ fontFamily: F.body, fontSize: '12px', color: C.textSecondary, margin: '4px 0 0' }}>
              High engagement. Best reached via {selectedStakeholder.channel}. Send ROI content next.
            </p>
          </div>
          <button
            style={{ ...btn.secondary, fontSize: '12px' }}
            onClick={() => toast?.success(`Content sent to ${selectedStakeholder.name}`)}
          >
            Send content
          </button>
        </div>
      )}
    </div>
  );
}
