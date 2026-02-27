import { useState } from 'react';
import { C, F, R, S, T } from '../../tokens';

/* ─── TagEditor ──────────────────────────────────────────────
   Props:
     tags     string[]        current tags
     onChange (tags) => void  called when tags change
     readOnly boolean         show tags without editing UI
─────────────────────────────────────────────────────────────── */
export default function TagEditor({ tags = [], onChange, readOnly = false }) {
  const [input, setInput]   = useState('');
  const [focused, setFocused] = useState(false);

  const addTag = (raw) => {
    const val = raw.trim().toLowerCase().replace(/\s+/g, '-');
    if (!val || tags.includes(val)) return;
    onChange([...tags, val]);
    setInput('');
  };

  const removeTag = (t) => onChange(tags.filter((x) => x !== t));

  const handleKey = (e) => {
    if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); addTag(input); }
    if (e.key === 'Backspace' && !input && tags.length) removeTag(tags[tags.length - 1]);
  };

  return (
    <div
      style={{
        display: 'flex', flexWrap: 'wrap', gap: '5px', alignItems: 'center',
        minHeight: '32px',
        ...(!readOnly && {
          backgroundColor: C.surface2,
          border: `1px solid ${focused ? C.primary : C.border}`,
          borderRadius: R.input,
          padding: '5px 8px',
          transition: T.color,
          boxShadow: focused ? `0 0 0 2px rgba(61,220,132,0.15)` : 'none',
          cursor: 'text',
        }),
      }}
      onClick={() => !readOnly && document.getElementById('te-input')?.focus()}
    >
      {tags.map((t) => (
        <span
          key={t}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '3px',
            fontFamily: F.mono, fontSize: '10px', fontWeight: 600,
            color: C.primary, backgroundColor: C.primaryGlow,
            border: `1px solid rgba(61,220,132,0.2)`,
            borderRadius: R.pill, padding: `1px 7px`,
          }}
        >
          {t}
          {!readOnly && (
            <button
              onClick={(e) => { e.stopPropagation(); removeTag(t); }}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                color: C.primary, padding: 0, lineHeight: 1,
                display: 'flex', alignItems: 'center',
                opacity: 0.6,
              }}
            >
              <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
                <path d="M1.5 1.5l6 6M7.5 1.5l-6 6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
              </svg>
            </button>
          )}
        </span>
      ))}

      {!readOnly && (
        <input
          id="te-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKey}
          onFocus={() => setFocused(true)}
          onBlur={() => { setFocused(false); if (input.trim()) addTag(input); }}
          placeholder={tags.length === 0 ? 'Add tag…' : ''}
          style={{
            background: 'none', border: 'none', outline: 'none',
            fontFamily: F.mono, fontSize: '11px', color: C.textPrimary,
            minWidth: '64px', flex: 1,
          }}
        />
      )}
    </div>
  );
}
