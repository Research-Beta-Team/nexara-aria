import { C, F, R, S, T, btn } from '../../tokens';

export default function BulkActionBar({ count, onApproveAll, onDenyAll, onSendAdvisor, onClear }) {
  if (!count) return null;

  return (
    <>
      <style>{`
        @keyframes baSlideUp { from { transform: translateY(100%); opacity: 0 } to { transform: translateY(0); opacity: 1 } }
      `}</style>
      <div style={{
        position: 'fixed', bottom: S[6], left: '50%', transform: 'translateX(-50%)',
        zIndex: 300,
        backgroundColor: C.surface,
        border: `1px solid ${C.borderHover}`,
        borderRadius: R.card,
        padding: `${S[3]} ${S[5]}`,
        display: 'flex', alignItems: 'center', gap: S[4],
        boxShadow: '0 8px 32px rgba(0,0,0,0.6), 0 0 0 1px rgba(61,220,132,0.15)',
        animation: 'baSlideUp 0.2s ease',
      }}>
        <div style={{ fontFamily: F.mono, fontSize: '12px', fontWeight: 700, color: C.textPrimary, whiteSpace: 'nowrap' }}>
          {count} selected
        </div>

        <div style={{ width: '1px', height: '16px', backgroundColor: C.border }} />

        <button
          style={{ ...btn.primary, fontSize: '12px', padding: `${S[1]} ${S[4]}` }}
          onClick={onApproveAll}
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Approve All
        </button>

        <button
          style={{
            ...btn.secondary, fontSize: '12px', padding: `${S[1]} ${S[4]}`,
            color: '#EF4444', borderColor: '#EF444440',
          }}
          onClick={onDenyAll}
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M2 2l8 8M10 2L2 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          Deny All
        </button>

        <button
          style={{ ...btn.secondary, fontSize: '12px', padding: `${S[1]} ${S[4]}` }}
          onClick={onSendAdvisor}
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="1.3"/>
            <path d="M6 4v3M6 8.5v.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
          </svg>
          Send to Advisor
        </button>

        <button
          onClick={onClear}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: C.textMuted, padding: `${S[1]} ${S[2]}`,
            fontFamily: F.body, fontSize: '12px',
          }}
        >
          Clear
        </button>
      </div>
    </>
  );
}
