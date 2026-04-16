import { useState } from 'react';
import { C, F, R, S, btn } from '../../tokens';
import useStore from '../../store/useStore';
import useToast from '../../hooks/useToast';
import { FREYA_PRIORITY_SUGGESTIONS } from '../../data/weeklyBrief';
import { IconTarget, IconMegaphone, IconSettings } from '../ui/Icons';

const PRIORITY_ICON_MAP = { target: IconTarget, megaphone: IconMegaphone, settings: IconSettings };

/**
 * Weekly priority input for Freya: chips + free text + Set button.
 * When already set, shows teal chip with [Edit].
 */
export default function WeeklyPriorityInput() {
  const toast = useToast();
  const freyaWeeklyPriority = useStore((s) => s.freyaWeeklyPriority);
  const setFreyaWeeklyPriority = useStore((s) => s.setFreyaWeeklyPriority);

  const [inputValue, setInputValue] = useState('');
  const [selectedChipId, setSelectedChipId] = useState(null);
  const [editing, setEditing] = useState(false);

  const hasPriority = Boolean(freyaWeeklyPriority && !editing);

  const handleSetPriority = () => {
    const value = selectedChipId
      ? FREYA_PRIORITY_SUGGESTIONS.find((p) => p.id === selectedChipId)?.label ?? inputValue.trim()
      : inputValue.trim();
    if (!value) {
      toast.info('Enter or select a priority first');
      return;
    }
    setFreyaWeeklyPriority(value);
    setInputValue('');
    setSelectedChipId(null);
    setEditing(false);
    toast.success('Freya will prioritize this in all recommendations this week');
  };

  const handleEdit = () => {
    setEditing(true);
    setInputValue(freyaWeeklyPriority);
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
          What should Freya focus on this week?
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
            {freyaWeeklyPriority}
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
        What should Freya focus on this week?
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: S[2], marginBottom: S[3] }}>
        {FREYA_PRIORITY_SUGGESTIONS.map((p) => {
          const Icon = PRIORITY_ICON_MAP[p.iconKey];
          return (
            <button
              key={p.id}
              type="button"
              style={chipStyle(selectedChipId === p.id)}
              onClick={() => setSelectedChipId(selectedChipId === p.id ? null : p.id)}
            >
              {Icon && <Icon color={C.textSecondary} w={16} />}
              <span>{p.label}</span>
            </button>
          );
        })}
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
