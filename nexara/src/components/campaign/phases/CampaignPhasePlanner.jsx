import { useState } from 'react';
import { C, F, R, S, btn } from '../../../tokens';
import { PHASE_TEMPLATES, applyTemplate, getDefaultPhases, getAriaSuggestedPhases, makePhase } from '../../../data/campaignPhases';
import PhaseCard from './PhaseCard';
import PhaseTimeline from './PhaseTimeline';

const MAX_PHASES = 5;
const TEMPLATE_IDS = ['ramadan_campaign', 'product_launch', 'abm_push', 'always_on'];

export default function CampaignPhasePlanner({
  phases = [],
  onChange,
  campaignStart,
  campaignEnd,
  readOnly = false,
  activePhaseIndex = null,
  onAdvancePhase,
}) {
  const [ariaGenerating, setAriaGenerating] = useState(false);

  const handlePhaseChange = (index, nextPhase) => {
    const next = phases.map((p, i) => (i === index ? nextPhase : p));
    onChange(next);
  };

  const handleDelete = (phase) => {
    const next = phases.filter((p) => p.id !== phase.id);
    onChange(next);
  };

  const handleAddPhase = () => {
    if (phases.length >= MAX_PHASES) return;
    const last = phases[phases.length - 1];
    const startDate = last?.endDate
      ? (() => {
          const d = new Date(last.endDate);
          d.setDate(d.getDate() + 1);
          return d.toISOString().slice(0, 10);
        })()
      : campaignStart || new Date().toISOString().slice(0, 10);
    const endDate = campaignEnd || (() => {
      const d = new Date(startDate);
      d.setDate(d.getDate() + 13);
      return d.toISOString().slice(0, 10);
    })();
    const newPhase = makePhase({
      name: 'New Phase',
      startDate,
      endDate,
      goal: '',
    });
    onChange([...phases, newPhase]);
  };

  const handleTemplateSelect = (templateId) => {
    if (templateId === 'custom') return;
    const totalDays = campaignStart && campaignEnd ? Math.max(1, Math.round((new Date(campaignEnd) - new Date(campaignStart)) / 86400000)) : 60;
    const next = applyTemplate(templateId, campaignStart, totalDays);
    if (next && next.length) onChange(next);
  };

  const handleAriaCreatePhases = () => {
    setAriaGenerating(true);
    setTimeout(() => {
      const start = campaignStart || phases[0]?.startDate || new Date().toISOString().slice(0, 10);
      const end = campaignEnd || phases[phases.length - 1]?.endDate || new Date(Date.now() + 45 * 86400000).toISOString().slice(0, 10);
      const next = getAriaSuggestedPhases(start, end);
      onChange(next);
      setAriaGenerating(false);
    }, 1400);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: S[5] }}>
      <div>
        <h2 style={{ fontFamily: F.display, fontSize: '20px', fontWeight: 800, color: C.textPrimary, margin: `0 0 ${S[1]}`, letterSpacing: '-0.02em' }}>
          Campaign Phases
        </h2>
        <p style={{ fontFamily: F.body, fontSize: '13px', color: C.textSecondary, margin: 0 }}>
          Create phases manually below, or let ARIA create them for you—especially if you’ve mainly generated content using ARIA Intelligence. ARIA will automatically activate and pause channels on phase transition dates.
        </p>
      </div>

      {/* ARIA create phases */}
      {!readOnly && (
        <div style={{ display: 'flex', alignItems: 'center', gap: S[3], flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={handleAriaCreatePhases}
            disabled={ariaGenerating}
            style={{
              ...btn.primary,
              fontSize: '13px',
              padding: `${S[2]} ${S[4]}`,
              display: 'flex',
              alignItems: 'center',
              gap: S[2],
              opacity: ariaGenerating ? 0.8 : 1,
            }}
          >
            {ariaGenerating ? (
              'ARIA is creating phases…'
            ) : (
              <>
                <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
                  <path d="M9 2a4 4 0 0 1 4 4v2a4 4 0 0 1-4 4 4 4 0 0 1-4-4V6a4 4 0 0 1 4-4Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M9 12v4M6 14l3 2 3-2M9 12a4 4 0 0 0 4-4h1.5a5.5 5.5 0 0 1-5.5 5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Let ARIA create phases
              </>
            )}
          </button>
          <span style={{ fontFamily: F.body, fontSize: '12px', color: C.textMuted }}>
            Best when you’ve generated content with ARIA Intelligence
          </span>
        </div>
      )}

      {/* Template selector */}
      <div>
        <div style={{ fontFamily: F.body, fontSize: '12px', fontWeight: 600, color: C.textSecondary, marginBottom: S[2] }}>
          Start from a template:
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: S[2] }}>
          {TEMPLATE_IDS.map((id) => (
            <button
              key={id}
              type="button"
              onClick={() => !readOnly && handleTemplateSelect(id)}
              disabled={readOnly}
              style={{
                padding: `${S[2]} ${S[4]}`,
                fontFamily: F.body,
                fontSize: '13px',
                fontWeight: 500,
                color: C.textPrimary,
                backgroundColor: C.surface3,
                border: `1px solid ${C.border}`,
                borderRadius: R.button,
                cursor: readOnly ? 'default' : 'pointer',
              }}
            >
              {PHASE_TEMPLATES[id]?.label || id}
            </button>
          ))}
          <span style={{ fontFamily: F.body, fontSize: '13px', color: C.textMuted, padding: `${S[2]} ${S[2]} 0` }}>
            Custom ↓
          </span>
        </div>
      </div>

      {/* Phase list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: S[4] }}>
        {phases.map((phase, i) => (
          <PhaseCard
            key={phase.id}
            phase={phase}
            index={i}
            onChange={(nextPhase) => handlePhaseChange(i, nextPhase)}
            onDelete={handleDelete}
            readOnly={readOnly}
            canDelete={phases.length > 1}
          />
        ))}
        {!readOnly && phases.length < MAX_PHASES && (
          <button
            type="button"
            style={{
              ...btn.secondary,
              alignSelf: 'flex-start',
              fontSize: '13px',
              display: 'flex',
              alignItems: 'center',
              gap: S[2],
            }}
            onClick={handleAddPhase}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M7 1v12M1 7h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            Add Phase
          </button>
        )}
      </div>

      {/* Timeline */}
      <PhaseTimeline
        phases={phases}
        campaignStart={campaignStart || phases[0]?.startDate}
        campaignEnd={campaignEnd || phases[phases.length - 1]?.endDate}
        todayDate={readOnly ? new Date().toISOString().slice(0, 10) : null}
        channelIds={['email', 'linkedin', 'meta_ads']}
      />
    </div>
  );
}
