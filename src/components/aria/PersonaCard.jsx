import { C, F, R, S, T, btn, inputStyle } from '../../tokens';
import { IconCheck } from '../ui/Icons';

const ICONS = {
  trophy: (color) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M8 21h8M12 17v4M7 4h10v4a4 4 0 01-4 4H11a4 4 0 01-4-4V4z" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M6 4H4a2 2 0 00-2 2v2a2 2 0 002 2h2M18 4h2a2 2 0 012 2v2a2 2 0 01-2 2h-2" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M12 8a4 4 0 004-4V4M8 4v0a4 4 0 004 4" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M12 12v3a3 3 0 003-3v-2a3 3 0 00-6 0v2a3 3 0 003 3zM9 21h6" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  map: (color) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M8 2v6l4 2 4-2V2M8 16v6l4-2 4 2v-6" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M2 8l4 2v6l-4 2V8zM18 8l4 2v6l-4 2V8zM8 8l4 2 4-2-4-2-4 2z" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  settings: (color) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="3" stroke={color} strokeWidth="1.8"/>
      <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" stroke={color} strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  ),
  'bar-chart': (color) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M4 18v-6M10 18v-4M16 18V8M22 18V4" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M2 20h20" stroke={color} strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  ),
  globe: (color) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" stroke={color} strokeWidth="1.8"/>
      <path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" stroke={color} strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  ),
  pencil: (color) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M17 3l4 4-10 10H7v-4L17 3z" stroke={color} strokeWidth="1.8" strokeLinejoin="round"/>
      <path d="M14 6l4 4" stroke={color} strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  ),
};

export default function PersonaCard({ persona, selected, onSelect, customRoleDescription, onCustomRoleChange }) {
  const isCustom = persona.id === 'custom';
  const color = persona.color || C.primary;
  const Icon = ICONS[persona.icon] || ICONS.pencil;

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onSelect?.(persona.id)}
      onKeyDown={(e) => e.key === 'Enter' && onSelect?.(persona.id)}
      style={{
        position: 'relative',
        padding: S[5],
        borderRadius: R.card,
        border: `2px solid ${selected ? C.primary : C.border}`,
        backgroundColor: selected ? C.surface2 : C.surface,
        cursor: 'pointer',
        transition: T.base,
        textAlign: 'left',
      }}
    >
      {selected && (
        <div style={{
          position: 'absolute',
          top: S[3],
          right: S[3],
          width: 22,
          height: 22,
          borderRadius: '50%',
          backgroundColor: C.primary,
          color: C.textInverse,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <IconCheck color={C.textInverse} width={14} height={14} />
        </div>
      )}
      <div style={{ color, marginBottom: S[2] }}>{Icon(color)}</div>
      <h3 style={{ fontFamily: F.body, fontSize: '16px', fontWeight: 700, color: C.textPrimary, margin: `0 0 ${S[2]} 0` }}>
        {persona.label}
      </h3>
      <p style={{ fontFamily: F.body, fontSize: '13px', color: C.textSecondary, lineHeight: 1.45, margin: `0 0 ${S[2]} 0` }}>
        {persona.description}
      </p>
      <p style={{ fontFamily: F.mono, fontSize: '11px', color: C.textMuted, margin: 0 }}>
        {persona.tag}
      </p>
      {isCustom && selected && (
        <div style={{ marginTop: S[4] }}>
          <textarea
            value={customRoleDescription}
            onChange={(e) => onCustomRoleChange?.(e.target.value)}
            placeholder="Describe ARIA's role..."
            style={{
              ...inputStyle,
              minHeight: 72,
              resize: 'vertical',
              width: '100%',
            }}
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}
