import { useState } from 'react';
import { C, F, R, S, badge } from '../../tokens';
import { IconWarning } from '../ui/Icons';

function formatCurrency(value) {
  if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
  return `$${value}`;
}

function daysInStageColor(days) {
  if (days < 7) return C.primary;
  if (days <= 14) return C.amber;
  return C.red;
}

function healthColor(health) {
  switch (health) {
    case 'healthy': return C.primary;
    case 'at_risk': return C.amber;
    case 'stalled': return C.red;
    default: return C.textMuted;
  }
}

export default function DealCard({ deal, onClick, draggable, dragType }) {
  if (!deal) return null;
  const {
    id,
    company,
    contact,
    value,
    probability,
    daysInStage,
    lastActivity,
    health,
    aiRiskFlags = [],
    ariaNextAction,
  } = deal;

  const riskFlag = aiRiskFlags[0];
  const daysColor = daysInStageColor(daysInStage);
  const healthDot = healthColor(health);

  const [isDragging, setIsDragging] = useState(false);

  const handleDragStart = (e) => {
    if (!draggable || !dragType) return;
    e.dataTransfer.setData(dragType, id);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', company);
    setIsDragging(true);
    try {
      e.dataTransfer.setDragImage(e.currentTarget, 0, 0);
    } catch (_) {}
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  return (
    <div
      role="button"
      tabIndex={0}
      draggable={!!draggable}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onClick={() => onClick?.(deal)}
      onKeyDown={(e) => e.key === 'Enter' && onClick?.(deal)}
      style={{
        padding: S[4],
        backgroundColor: C.surface,
        border: `1px solid ${isDragging ? C.primary : C.border}`,
        borderRadius: R.card,
        cursor: draggable ? (isDragging ? 'grabbing' : 'grab') : 'pointer',
        opacity: isDragging ? 0.85 : 1,
        transition: 'border-color 0.15s ease, box-shadow 0.15s ease, opacity 0.15s ease',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: S[2], marginBottom: S[2] }}>
        <span style={{ color: C.textMuted, cursor: draggable ? 'grab' : 'default', flexShrink: 0 }} title={draggable ? 'Drag to move stage' : undefined}>⋮⋮</span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: F.display, fontSize: '14px', fontWeight: 700, color: C.textPrimary }}>
            {company}
          </div>
          <div style={{ fontFamily: F.body, fontSize: '12px', color: C.textSecondary }}>{contact}</div>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: S[2], marginBottom: S[2] }}>
        <span style={{ fontFamily: F.mono, fontSize: '18px', fontWeight: 700, color: C.primary }}>
          {formatCurrency(value)}
        </span>
        {probability != null && (
          <span style={{ ...badge.base, ...badge.muted, fontSize: '10px' }}>{probability}%</span>
        )}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: S[2], flexWrap: 'wrap', marginBottom: riskFlag ? S[2] : 0 }}>
        <span style={{ fontFamily: F.mono, fontSize: '11px', color: daysColor }}>
          {daysInStage}d in stage
        </span>
        <span
          style={{
            width: 6,
            height: 6,
            borderRadius: '50%',
            backgroundColor: healthDot,
          }}
        />
        <span style={{ fontFamily: F.body, fontSize: '11px', color: C.textMuted }}>{lastActivity}</span>
      </div>
      {riskFlag && (
        <div
          style={{
            padding: `${S[1]} ${S[2]}`,
            backgroundColor: 'rgba(245,200,66,0.12)',
            border: `1px solid rgba(245,200,66,0.25)`,
            borderRadius: R.sm,
            fontFamily: F.body,
            fontSize: '11px',
            color: C.amber,
            marginBottom: S[2],
          }}
        >
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
          <IconWarning color={C.amber} width={12} height={12} /> {riskFlag}
        </span>
        </div>
      )}
      {ariaNextAction && (
        <p style={{ fontFamily: F.body, fontSize: '11px', color: C.textSecondary, fontStyle: 'italic', margin: 0 }}>
          {ariaNextAction}
        </p>
      )}
    </div>
  );
}
