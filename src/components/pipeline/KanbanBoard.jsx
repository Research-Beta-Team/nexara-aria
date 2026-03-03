import { useState } from 'react';
import { C, F, R, S, scrollbarStyle } from '../../tokens';
import DealCard from './DealCard';

const DRAG_TYPE = 'application/x-pipeline-deal';

function formatCurrency(value) {
  if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
  return `$${value}`;
}

export default function KanbanBoard({ stages, deals, onDealClick, onDealStageChange }) {
  const [dragOverStage, setDragOverStage] = useState(null);

  const dealsByStage = stages.reduce((acc, stage) => {
    acc[stage] = deals.filter((d) => d.stage === stage);
    return acc;
  }, {});

  const handleDragOver = (e, stage) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverStage(stage);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOverStage(null);
  };

  const handleDrop = (e, stage) => {
    e.preventDefault();
    setDragOverStage(null);
    const dealId = e.dataTransfer.getData(DRAG_TYPE);
    if (dealId && onDealStageChange) {
      onDealStageChange(dealId, stage);
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        gap: S[4],
        overflowX: 'auto',
        paddingBottom: S[4],
        ...scrollbarStyle,
      }}
    >
      {stages.map((stage) => {
        const stageDeals = dealsByStage[stage] || [];
        const stageValue = stageDeals.reduce((s, d) => s + d.value, 0);
        const isDropTarget = dragOverStage === stage;
        return (
          <div
            key={stage}
            onDragOver={(e) => handleDragOver(e, stage)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, stage)}
            style={{
              width: 280,
              flexShrink: 0,
              display: 'flex',
              flexDirection: 'column',
              backgroundColor: isDropTarget ? C.primaryGlow : C.surface2,
              border: `1px solid ${isDropTarget ? C.primary : C.border}`,
              borderRadius: R.card,
              overflow: 'hidden',
              transition: 'background-color 0.15s ease, border-color 0.15s ease',
            }}
          >
            <div
              style={{
                padding: `${S[3]} ${S[4]}`,
                borderBottom: `1px solid ${C.border}`,
                backgroundColor: C.surface3,
              }}
            >
              <div style={{ fontFamily: F.body, fontSize: '13px', fontWeight: 700, color: C.textPrimary }}>
                {stage}
              </div>
              <div style={{ fontFamily: F.mono, fontSize: '11px', color: C.textMuted }}>
                {stageDeals.length} deals · {formatCurrency(stageValue)}
              </div>
            </div>
            <div
              style={{
                flex: 1,
                padding: S[3],
                display: 'flex',
                flexDirection: 'column',
                gap: S[2],
                minHeight: 120,
              }}
            >
              {stageDeals.map((deal) => (
                <DealCard
                  key={deal.id}
                  deal={deal}
                  onClick={onDealClick}
                  draggable
                  dragType={DRAG_TYPE}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
