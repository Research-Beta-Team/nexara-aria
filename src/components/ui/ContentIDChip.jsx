import { useState } from 'react';
import useToast from '../../hooks/useToast';
import { C, F, R, S, T } from '../../tokens';

/**
 * Content ID badge — CAMP-001-EMAIL-003 style.
 * Optional onClick (e.g. view in Content Library / open approval).
 * Copy icon on hover; copies ID and shows toast.
 */
export default function ContentIDChip({ contentId, onClick, size = 'md' }) {
  const toast = useToast();
  const [hovered, setHovered] = useState(false);

  if (!contentId) return null;

  const isSmall = size === 'sm';
  const baseStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: isSmall ? '4px' : S[1],
    fontFamily: F.mono,
    fontSize: '11px',
    fontWeight: 600,
    letterSpacing: '0.04em',
    color: C.textSecondary,
    backgroundColor: C.surface3,
    border: `1px solid ${C.border}`,
    borderRadius: '4px',
    padding: isSmall ? '2px 6px' : `3px ${S[2]}`,
    whiteSpace: 'nowrap',
    transition: T.color,
    cursor: onClick ? 'pointer' : 'default',
  };

  const hoverStyle = onClick && hovered
    ? { backgroundColor: 'rgba(94,234,212,0.12)', borderColor: 'rgba(94,234,212,0.35)', color: C.secondary }
    : {};

  const handleCopy = (e) => {
    e?.stopPropagation();
    try {
      navigator.clipboard.writeText(contentId);
      toast.success('Content ID copied');
    } catch (_) {
      toast.error('Copy failed');
    }
  };

  const handleKeyDown = (e) => {
    if (onClick && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      onClick();
    }
  };

  const title = onClick ? "View in Content Library →" : undefined;

  return (
    <span
      role={onClick ? 'button' : undefined}
      title={title}
      style={{ ...baseStyle, ...hoverStyle }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      tabIndex={onClick ? 0 : undefined}
    >
      <span style={{ color: 'inherit' }}>{contentId}</span>
      {(hovered || !onClick) && (
        <button
          type="button"
          aria-label="Copy Content ID"
          onClick={handleCopy}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 0,
            margin: 0,
            width: isSmall ? 14 : 16,
            height: isSmall ? 14 : 16,
            border: 'none',
            background: 'transparent',
            color: C.textMuted,
            cursor: 'pointer',
            borderRadius: '2px',
            flexShrink: 0,
          }}
          onMouseEnter={(e) => { e.stopPropagation(); e.currentTarget.style.color = C.primary; }}
          onMouseLeave={(e) => { e.stopPropagation(); e.currentTarget.style.color = C.textMuted; }}
        >
          <svg width={isSmall ? 10 : 12} height={isSmall ? 10 : 12} viewBox="0 0 12 12" fill="none">
            <rect x="3.5" y="3.5" width="5" height="5" rx="0.5" stroke="currentColor" strokeWidth="1.2"/>
            <path d="M1.5 6.5V9a1 1 0 001 1h2.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
            <path d="M6.5 1.5H9a1 1 0 011 1v2.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
          </svg>
        </button>
      )}
    </span>
  );
}
