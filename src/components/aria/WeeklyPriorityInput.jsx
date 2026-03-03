import { useState } from 'react';
import { C, F, R, S, btn } from '../../tokens';
import useStore from '../../store/useStore';
import useToast from '../../hooks/useToast';
import { ARIA_PRIORITY_SUGGESTIONS } from '../../data/weeklyBrief';

/**
 * Weekly priority input for ARIA: chips + free text + Set button.
 * When already set, shows teal chip with [Edit].
 */
export default function WeeklyPriorityInput() {
  const toast = useToast();
  const ariaWeeklyPriority = useStore((s) => s.ariaWeeklyPriority);
  const setAriaWeeklyPriority = useStore((s) => s.setAriaWeeklyPriority);

  const [inputValue, setInputValue] = useState('');
  const [selectedChipId, setSelectedChipId] = useState(null);
  const [editing, setEditing] = useState(false);

  const hasPriority = Boolean(ariaWeeklyPriority && !editing);

  const handleSetPriority = () => {
    const value = selectedChipId
      ? ARIA_PRIORITY_SUGGESTIONS.find((p) => p.id === selectedChipId)?.label ?? inputValue.trim()
      : inputValue.trim();
    if (!value) {
      toast.info('Enter or select a priority first');
      return;
    }
    setAriaWeeklyPriority(value);
    setInputValue('');
    setSelectedChipId(null);
    setEditing(false);
    toast.success('ARIA will prioritize this in all recommendations this week');
  };

  const handleEdit = () => {
    setEditing(true);
    setInputValue(ariaWeeklyPriority);
    setSelectedChipId(null);
  };

  const chipStyle = (selected) => ({
    display: 'inline-flex',
    alignItems: 'center',
    gap: S[1],
    padding: `${S[2]} ${S[4]}`,
    backgroundColor: selected ? 'rgba(94,234,212,0.15)' : C.surface3,
    border: `1px solid ${selected ? C.secondary : C.border}`,
    borderRadius: R.pill,
    fontFamily: F.body,
    fontSize: '13px',
    color: selected ? C.secondary : C.textPrimary,
    cursor: 'pointer',
    transition: 'background-color 0.15s ease, border-color 0.15s ease',
  });

  if (hasPriority) {
    return (
      <div style={{
        padding: S[4],
        backgroundColor: C.surface2,
        border: `1px solid ${C.border}`,
        borderRadius: R.card,
        marginTop: S[4],
      }}>
        <div style={{
          fontFamily: F.mono,
          fontSize: '10px',
          fontWeight: 700,
          color: C.textMuted,
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
          marginBottom: S[2],
        }}>
          What should ARIA focus on this week?
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: S[2], flexWrap: 'wrap' }}>
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            padding: `${S[2]} ${S[4]}`,
            backgroundColor: 'rgba(94,234,212,0.12)',
            border: `1px solid rgba(94,234,212,0.3)`,
            borderRadius: R.pill,
            fontFamily: F.body,
            fontSize: '13px',
            color: C.secondary,
          }}>
            {ariaWeeklyPriority}
          </span>
          <button
            type="button"
            style={{
              background: 'none',
              border: 'none',
              fontFamily: F.body,
              fontSize: '12px',
              fontWeight: 600,
              color: C.secondary,
              cursor: 'pointer',
              textDecoration: 'underline',
            }}
            onClick={handleEdit}
          >
            Edit
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      padding: S[4],
      backgroundColor: C.surface2,
      border: `1px solid ${C.border}`,
      borderRadius: R.card,
      marginTop: S[4],
    }}>
      <div style={{
        fontFamily: F.mono,
        fontSize: '10px',
        fontWeight: 700,
        color: C.textMuted,
        textTransform: 'uppercase',
        letterSpacing: '0.06em',
        marginBottom: S[3],
      }}>
        What should ARIA focus on this week?
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: S[2], marginBottom: S[3] }}>
        {ARIA_PRIORITY_SUGGESTIONS.map((p) => (
          <button
            key={p.id}
            type="button"
            style={chipStyle(selectedChipId === p.id)}
            onClick={() => setSelectedChipId(selectedChipId === p.id ? null : p.id)}
          >
            <span>{p.emoji}</span>
            <span>{p.label}</span>
          </button>
        ))}
      </div>

      <div style={{ marginBottom: S[3] }}>
        <input
          type="text"
          placeholder="e.g. 'Focus on the Vietnam CFO segment — we have 3 calls this week'"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onFocus={() => setSelectedChipId(null)}
          style={{
            width: '100%',
            backgroundColor: C.bg,
            color: C.textPrimary,
            border: `1px solid ${C.border}`,
            borderRadius: R.input,
            padding: `${S[2]} ${S[3]}`,
            fontFamily: F.body,
            fontSize: '13px',
            outline: 'none',
          }}
        />
      </div>

      <button
        type="button"
        style={{ ...btn.primary, fontSize: '13px' }}
        onClick={handleSetPriority}
      >
        Set Weekly Priority →
      </button>
    </div>
  );
}
