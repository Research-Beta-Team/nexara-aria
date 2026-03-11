import { useState } from 'react';
import { C, F, R, S, T, inputStyle } from '../../../tokens';
import { daysBetween } from '../../../data/campaignPhases';
import PhaseChannelConfig from './PhaseChannelConfig';
import { IconArrowRight } from '../../../components/ui/Icons';

const GOAL_CHIPS = ['Build awareness', 'Generate leads', 'Convert demos', 'Nurture'];
const CONTENT_SET_OPTIONS = [
  { value: 'all', label: 'All campaign content' },
  { value: 'phase_specific', label: 'Phase-specific content (define below)' },
  { value: 'warmup_only', label: 'Warmup content only' },
];

export default function PhaseCard({ phase, index, onChange, onDelete, readOnly, canDelete }) {
  const [expanded, setExpanded] = useState(true);
  const duration = daysBetween(phase.startDate, phase.endDate);

  const handleNameChange = (e) => {
    if (!readOnly) onChange({ ...phase, name: e.target.value });
  };
  const handleStartChange = (e) => {
    if (!readOnly) onChange({ ...phase, startDate: e.target.value });
  };
  const handleEndChange = (e) => {
    if (!readOnly) onChange({ ...phase, endDate: e.target.value });
  };
  const handleGoalChip = (goal) => {
    if (!readOnly) onChange({ ...phase, goal });
  };
  const handleGoalInput = (e) => {
    if (!readOnly) onChange({ ...phase, goal: e.target.value });
  };
  const handleContentSet = (value) => {
    if (!readOnly) onChange({ ...phase, contentSet: value });
  };
  const handleContentIdsChange = (e) => {
    if (!readOnly) {
      const raw = e.target.value || '';
      const contentIds = raw.split(/[\s,]+/).filter(Boolean);
      onChange({ ...phase, contentIds });
    }
  };

  const phaseStartFormatted = phase.startDate ? new Date(phase.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '';

  return (
    <div
      style={{
        backgroundColor: C.surface,
        border: `1px solid ${C.border}`,
        borderRadius: R.card,
        overflow: 'hidden',
        borderLeft: `4px solid ${C.primary}`,
      }}
    >
      {/* Header row */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: S[3],
          padding: `${S[3]} ${S[4]}`,
          backgroundColor: C.surface2,
          borderBottom: expanded ? `1px solid ${C.border}` : 'none',
        }}
      >
        <div
          style={{
            width: 28,
            height: 28,
            borderRadius: '50%',
            backgroundColor: C.primary,
            color: C.bg,
            fontFamily: F.mono,
            fontSize: '13px',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          {index + 1}
        </div>
        <input
          type="text"
          value={phase.name}
          onChange={handleNameChange}
          disabled={readOnly}
          placeholder="Phase name"
          style={{
            ...inputStyle,
            flex: 1,
            minWidth: 100,
            maxWidth: 180,
            padding: `${S[1]} ${S[2]}`,
            fontSize: '14px',
            fontWeight: 600,
          }}
        />
        <input
          type="date"
          value={phase.startDate || ''}
          onChange={handleStartChange}
          disabled={readOnly}
          style={{ ...inputStyle, width: 130, padding: `${S[1]} ${S[2]}`, fontSize: '12px' }}
        />
        <span style={{ fontFamily: F.body, fontSize: '12px', color: C.textMuted, display: 'inline-flex', alignItems: 'center' }}><IconArrowRight color={C.textMuted} w={14} /></span>
        <input
          type="date"
          value={phase.endDate || ''}
          onChange={handleEndChange}
          disabled={readOnly}
          style={{ ...inputStyle, width: 130, padding: `${S[1]} ${S[2]}`, fontSize: '12px' }}
        />
        <span style={{ fontFamily: F.mono, fontSize: '12px', color: C.textMuted }}>
          {duration > 0 ? `${duration} days` : '—'}
        </span>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: S[1] }}>
          <button
            type="button"
            aria-label={expanded ? 'Collapse' : 'Expand'}
            onClick={() => setExpanded((e) => !e)}
            style={{
              padding: S[2],
              background: 'none',
              border: 'none',
              color: C.textMuted,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              style={{ transform: expanded ? 'rotate(180deg)' : 'none', transition: T.base }}
            >
              <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          {canDelete && (
            <button
              type="button"
              aria-label="Delete phase"
              onClick={() => onDelete(phase)}
              style={{
                padding: S[2],
                background: 'none',
                border: 'none',
                color: C.textMuted,
                cursor: readOnly ? 'default' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3 4h10M5 4V3a1 1 0 011-1h4a1 1 0 011 1v1M6 7v4M10 7v4M4 4l.5 9a1 1 0 001 1h5a1 1 0 001-1L12 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {expanded && (
        <div style={{ padding: S[4] }}>
          {/* Goal */}
          <div style={{ marginBottom: S[4] }}>
            <div style={{ fontFamily: F.body, fontSize: '12px', fontWeight: 600, color: C.textSecondary, marginBottom: S[2] }}>
              Goal for this phase
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: S[2], marginBottom: S[2] }}>
              {GOAL_CHIPS.map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => handleGoalChip(g)}
                  disabled={readOnly}
                  style={{
                    padding: `${S[1]} ${S[3]}`,
                    fontFamily: F.body,
                    fontSize: '12px',
                    fontWeight: 500,
                    color: phase.goal === g ? C.bg : C.textSecondary,
                    backgroundColor: phase.goal === g ? C.primary : C.surface3,
                    border: `1px solid ${phase.goal === g ? C.primary : C.border}`,
                    borderRadius: R.pill,
                    cursor: readOnly ? 'default' : 'pointer',
                  }}
                >
                  {g}
                </button>
              ))}
            </div>
            <input
              type="text"
              value={phase.goal}
              onChange={handleGoalInput}
              disabled={readOnly}
              placeholder="What's the goal of this phase?"
              style={{ ...inputStyle, width: '100%', maxWidth: 400 }}
            />
          </div>

          {/* Channel config */}
          <div style={{ marginBottom: S[4] }}>
            <PhaseChannelConfig
              phase={phase}
              onChange={onChange}
              phaseStartDate={phaseStartFormatted}
              readOnly={readOnly}
            />
          </div>

          {/* Content set */}
          <div>
            <div style={{ fontFamily: F.body, fontSize: '12px', fontWeight: 600, color: C.textSecondary, marginBottom: S[2] }}>
              Content set for this phase
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: S[2] }}>
              {CONTENT_SET_OPTIONS.map((opt) => (
                <label
                  key={opt.value}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: S[2],
                    fontFamily: F.body,
                    fontSize: '13px',
                    color: C.textPrimary,
                    cursor: readOnly ? 'default' : 'pointer',
                  }}
                >
                  <input
                    type="radio"
                    name={`content-set-${phase.id}`}
                    checked={phase.contentSet === opt.value}
                    onChange={() => handleContentSet(opt.value)}
                    disabled={readOnly}
                    style={{ accentColor: C.primary }}
                  />
                  {opt.label}
                </label>
              ))}
            </div>
            {phase.contentSet === 'phase_specific' && (
              <input
                type="text"
                value={(phase.contentIds || []).join(', ')}
                onChange={handleContentIdsChange}
                disabled={readOnly}
                placeholder="Content IDs, e.g. CAMP-001-EMAIL-001"
                style={{ ...inputStyle, marginTop: S[2], width: '100%', maxWidth: 400, fontSize: '12px' }}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
