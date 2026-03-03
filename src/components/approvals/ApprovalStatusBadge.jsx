import { C, F, R, S } from '../../tokens';

const STATUS_CONFIG = {
  draft: {
    label: 'Draft',
    bg: C.surface3,
    text: C.textSecondary,
    icon: 'pencil',
  },
  in_review: {
    label: 'In review',
    bg: C.amberDim,
    text: C.amber,
    icon: 'eye',
    pulse: true,
  },
  revision_requested: {
    label: 'Revision requested',
    bg: C.redDim,
    text: C.red,
    icon: 'redo',
  },
  approved: {
    label: 'Approved',
    bg: C.primaryGlow,
    text: C.primary,
    icon: 'check',
  },
  published: {
    label: 'Published',
    bg: 'rgba(94,234,212,0.15)',
    text: C.secondary,
    icon: 'send',
  },
};

const ICONS = {
  pencil: (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 3l4 4-10 10H7v-4L17 3z" />
      <path d="M14 6l4 4" />
    </svg>
  ),
  eye: (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ),
  redo: (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 2v6h-6" />
      <path d="M3 12a9 9 0 0115-6.7L21 8" />
      <path d="M3 22v-6h6" />
      <path d="M21 12a9 9 0 01-15 6.7L3 16" />
    </svg>
  ),
  check: (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 6L9 17l-5-5" />
    </svg>
  ),
  send: (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 2L11 13" />
      <path d="M22 2L15 22L11 13L2 9L22 2z" />
    </svg>
  ),
};

export default function ApprovalStatusBadge({ status, compact, sinceDate }) {
  const config = STATUS_CONFIG[status] ?? STATUS_CONFIG.draft;
  const Icon = ICONS[config.icon] ?? ICONS.pencil;

  return (
    <>
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: S[1],
          padding: compact ? `2px ${S[2]}` : `${S[1]} ${S[2]}`,
          borderRadius: R.pill,
          backgroundColor: config.bg,
          color: config.text,
          border: `1px solid ${config.text}33`,
          fontFamily: F.mono,
          fontSize: compact ? '10px' : '11px',
          fontWeight: 600,
          letterSpacing: '0.02em',
          animation: config.pulse ? 'approvalPulse 1.5s ease-in-out infinite' : undefined,
        }}
      >
        <span style={{ display: 'flex', opacity: 0.9 }}>{Icon}</span>
        <span>{config.label}</span>
      </span>
      {!compact && sinceDate && (
        <div style={{ fontFamily: F.body, fontSize: '11px', color: C.textMuted, marginTop: '2px' }}>
          since {sinceDate}
        </div>
      )}
      {config.pulse && (
        <style>{`
          @keyframes approvalPulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.85; } }
        `}</style>
      )}
    </>
  );
}
