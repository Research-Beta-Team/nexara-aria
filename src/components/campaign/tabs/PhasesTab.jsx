import { useState } from 'react';
import useToast from '../../../hooks/useToast';
import { C, F, R, S, btn } from '../../../tokens';
import { MOCK_ACTIVE_PHASES, daysBetween } from '../../../data/campaignPhases';
import CampaignPhasePlanner from '../phases/CampaignPhasePlanner';

function getActivePhaseIndex(phases, todayStr) {
  const today = todayStr || new Date().toISOString().slice(0, 10);
  return phases.findIndex((p) => p.startDate && p.endDate && p.startDate <= today && p.endDate >= today);
}

export default function PhasesTab({ campaign, detail }) {
  const toast = useToast();
  const [phases, setPhases] = useState(detail?.phases ?? MOCK_ACTIVE_PHASES);

  const todayStr = new Date().toISOString().slice(0, 10);
  const activeIndex = getActivePhaseIndex(phases, todayStr) >= 0
    ? getActivePhaseIndex(phases, todayStr)
    : phases.findIndex((p) => p.status === 'active');
  const activePhase = activeIndex >= 0 ? phases[activeIndex] : null;
  const daysRemaining = activePhase && activePhase.endDate
    ? daysBetween(todayStr, activePhase.endDate)
    : 0;
  const showAdvance = activePhase && daysRemaining >= 0 && daysRemaining <= 3;

  const handleAdvance = () => {
    toast.success('Advanced to next phase. Freya has updated channel activation.');
  };

  const handlePhasesChange = (nextPhases) => {
    setPhases(nextPhases);
  };

  const campaignStart = phases[0]?.startDate;
  const campaignEnd = phases[phases.length - 1]?.endDate;

  return (
    <div style={{ padding: S[6], display: 'flex', flexDirection: 'column', gap: S[5] }}>
      {/* Current phase banner */}
      {activePhase && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: S[3],
            padding: S[4],
            backgroundColor: C.primaryGlow,
            border: `1px solid rgba(61,220,132,0.3)`,
            borderRadius: R.card,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: S[3] }}>
            <span
              style={{
                fontFamily: F.mono,
                fontSize: '11px',
                fontWeight: 700,
                backgroundColor: C.primary,
                color: C.bg,
                padding: `2px ${S[2]}`,
                borderRadius: R.pill,
                textTransform: 'uppercase',
              }}
            >
              Active now
            </span>
            <span style={{ fontFamily: F.display, fontSize: '16px', fontWeight: 700, color: C.textPrimary }}>
              {activePhase.name}
            </span>
            <span style={{ fontFamily: F.body, fontSize: '13px', color: C.textSecondary }}>
              {daysRemaining} days remaining in this phase
            </span>
          </div>
          {showAdvance && (
            <button
              type="button"
              style={{ ...btn.primary, fontSize: '13px' }}
              onClick={handleAdvance}
            >
              Advance to next phase
            </button>
          )}
        </div>
      )}

      <CampaignPhasePlanner
        phases={phases}
        onChange={handlePhasesChange}
        campaignStart={campaignStart}
        campaignEnd={campaignEnd}
        readOnly={false}
        activePhaseIndex={activeIndex >= 0 ? activeIndex : null}
        onAdvancePhase={handleAdvance}
      />
    </div>
  );
}
