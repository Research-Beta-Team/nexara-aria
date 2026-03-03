import { useEffect } from 'react';
import { C, F, R, S } from '../../tokens';
import { getDefaultPhases } from '../../data/campaignPhases';
import CampaignPhasePlanner from '../campaign/phases/CampaignPhasePlanner';

export default function WizardStep5Phases({ data, onChange }) {
  const phases = data.phases;
  const hasPhases = Array.isArray(phases) && phases.length > 0;
  const campaignStart = data.deadline ? (() => {
    const d = new Date(data.deadline);
    d.setDate(d.getDate() - 60);
    return d.toISOString().slice(0, 10);
  })() : new Date().toISOString().slice(0, 10);
  const campaignEnd = data.deadline || (() => {
    const d = new Date();
    d.setDate(d.getDate() + 45);
    return d.toISOString().slice(0, 10);
  })();

  useEffect(() => {
    if (phases === null || phases === undefined) {
      const defaultPhases = getDefaultPhases(campaignStart, campaignEnd);
      onChange('phases', defaultPhases);
    }
  }, []);

  const handlePhasesChange = (nextPhases) => {
    onChange('phases', nextPhases);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: S[5] }}>
      <CampaignPhasePlanner
        phases={hasPhases ? phases : getDefaultPhases(campaignStart, campaignEnd)}
        onChange={handlePhasesChange}
        campaignStart={campaignStart}
        campaignEnd={campaignEnd}
        readOnly={false}
      />
    </div>
  );
}
