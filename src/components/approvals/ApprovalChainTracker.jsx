/**
 * Approval chain: 5 stages (Draft → Legal → Brand → CMO → Published).
 * States: completed (mint check), active (pulsing amber), pending (grey), rejected (red X).
 * Variants: mini (24px, dots only) and full (40px + labels).
 */
import { C, F, S } from '../../tokens';

const STAGES = [
  { id: 'draft', label: 'Draft' },
  { id: 'legal', label: 'Legal' },
  { id: 'brand', label: 'Brand' },
  { id: 'cmo', label: 'CMO' },
  { id: 'published', label: 'Published' },
];

const STAGE_ORDER = ['draft', 'legal', 'brand', 'cmo', 'published'];

function getStageStatus(stageId, currentStage, rejected) {
  const idx = STAGE_ORDER.indexOf(stageId);
  const currentIdx = STAGE_ORDER.indexOf(currentStage);
  if (rejected && stageId === currentStage) return 'rejected';
  if (idx < currentIdx) return 'completed';
  if (idx === currentIdx) return 'active';
  return 'pending';
}

const statusStyles = {
  completed: { border: C.primary, bg: C.primaryGlow },
  active: { border: C.amber, bg: C.amberDim },
  pending: { border: C.border, bg: C.surface3 },
  rejected: { border: '#FF6E7A', bg: C.redDim },
};

export default function ApprovalChainTracker({ currentStage, rejected = false, variant = 'mini' }) {
  const isFull = variant === 'full';

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: isFull ? S[3] : S[2],
        height: isFull ? 40 : 24,
      }}
    >
      {STAGES.map((stage, i) => {
        const status = getStageStatus(stage.id, currentStage, rejected);
        const style = statusStyles[status];
        const isRejected = status === 'rejected';
        return (
          <div key={stage.id} style={{ display: 'flex', alignItems: 'center' }}>
            {i > 0 && (
              <div
                style={{
                  width: isFull ? 24 : 12,
                  height: 2,
                  backgroundColor: STAGE_ORDER.indexOf(currentStage) > i ? C.primary : C.border,
                  marginRight: isFull ? S[1] : 4,
                }}
              />
            )}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 2,
              }}
            >
              <div
                style={{
                  width: isFull ? 24 : 16,
                  height: isFull ? 24 : 16,
                  borderRadius: '50%',
                  backgroundColor: style.bg,
                  border: `2px solid ${style.border}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  animation: status === 'active' ? 'approvalPulse 1.5s ease-in-out infinite' : undefined,
                }}
              >
                {status === 'completed' && (
                  <svg width={isFull ? 12 : 8} height={isFull ? 12 : 8} viewBox="0 0 24 24" fill="none" stroke={C.primary} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
                {isRejected && (
                  <svg width={isFull ? 12 : 8} height={isFull ? 12 : 8} viewBox="0 0 24 24" fill="none" stroke={style.border} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                )}
              </div>
              {isFull && (
                <span style={{ fontFamily: F.mono, fontSize: '9px', fontWeight: 600, color: status === 'pending' ? C.textMuted : C.textSecondary, whiteSpace: 'nowrap' }}>
                  {stage.label}
                </span>
              )}
            </div>
          </div>
        );
      })}
      <style>{`
        @keyframes approvalPulse {
          0%, 100% { opacity: 1; box-shadow: 0 0 0 0 rgba(245,200,66,0.4); }
          50% { opacity: 0.9; box-shadow: 0 0 0 6px rgba(245,200,66,0); }
        }
      `}</style>
    </div>
  );
}
