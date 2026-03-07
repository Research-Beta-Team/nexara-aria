import { C, F, R, S, T, btn, inputStyle } from '../../tokens';
import { IconTrash } from '../ui/Icons';

const CATEGORIES = ['TONE', 'STRATEGY', 'FORMAT'];

export default function RulesOfEngagement({ rules, onToggle, onUpdate, onRemove, onAdd }) {
  return (
    <div>
      <p style={{ fontFamily: F.body, fontSize: '13px', color: C.textSecondary, margin: `0 0 ${S[4]} 0` }}>
        Think of these as standing orders Freya never forgets.
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: S[2] }}>
        {rules.map((rule) => (
          <div
            key={rule.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: S[3],
              padding: S[3],
              borderRadius: R.md,
              backgroundColor: C.surface2,
              border: `1px solid ${C.border}`,
            }}
          >
            <button
              type="button"
              aria-label={rule.enabled ? 'Disable rule' : 'Enable rule'}
              onClick={() => onToggle?.(rule.id)}
              style={{
                width: 36,
                height: 22,
                borderRadius: 11,
                border: 'none',
                backgroundColor: rule.enabled ? C.primary : C.surface3,
                cursor: 'pointer',
                flexShrink: 0,
                position: 'relative',
                transition: T.base,
              }}
            >
              <span
                style={{
                  position: 'absolute',
                  top: 2,
                  left: rule.enabled ? 18 : 2,
                  width: 18,
                  height: 18,
                  borderRadius: '50%',
                  backgroundColor: C.textInverse,
                  transition: T.base,
                }}
              />
            </button>
            <input
              type="text"
              value={rule.text}
              onChange={(e) => onUpdate?.(rule.id, { text: e.target.value })}
              style={{
                ...inputStyle,
                flex: 1,
                border: 'none',
                backgroundColor: 'transparent',
                padding: `${S[1]} 0`,
              }}
              placeholder="Rule text..."
            />
            <select
              value={rule.category}
              onChange={(e) => onUpdate?.(rule.id, { category: e.target.value })}
              style={{
                ...inputStyle,
                width: 'auto',
                minWidth: 100,
                padding: `${S[1]} ${S[2]}`,
                fontSize: '11px',
                textTransform: 'uppercase',
              }}
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <button
              type="button"
              aria-label="Delete rule"
              onClick={() => onRemove?.(rule.id)}
              style={{
                ...btn.ghost,
                color: C.textMuted,
                padding: S[2],
              }}
            >
              <IconTrash color={C.textMuted} width={18} height={18} />
            </button>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={onAdd}
        style={{
          ...btn.ghost,
          color: C.secondary,
          fontSize: '13px',
          marginTop: S[3],
        }}
      >
        + Add your own rule
      </button>
    </div>
  );
}
