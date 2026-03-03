import { C, F } from '../tokens';

export default function WorkflowCenter() {
  return (
    <div style={{ padding: '64px 48px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
      <div style={{
        width: '56px', height: '56px', borderRadius: '14px',
        backgroundColor: 'rgba(61,220,132,0.1)', border: '1px solid rgba(61,220,132,0.25)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M6 3v6M6 15v6M18 9v6M18 3v6M3 6h6M9 18h6M15 6h6M3 18h6" stroke={C.primary} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          <circle cx="6" cy="9" r="2" stroke={C.primary} strokeWidth="1.8"/>
          <circle cx="6" cy="15" r="2" stroke={C.primary} strokeWidth="1.8"/>
          <circle cx="18" cy="9" r="2" stroke={C.primary} strokeWidth="1.8"/>
          <circle cx="18" cy="15" r="2" stroke={C.primary} strokeWidth="1.8"/>
        </svg>
      </div>
      <div style={{ fontFamily: F.display, fontSize: '22px', fontWeight: 700, color: C.textPrimary }}>
        Workflow Center
      </div>
      <div style={{ fontFamily: F.body, fontSize: '14px', color: C.textSecondary, textAlign: 'center', maxWidth: '360px' }}>
        Manage ARIA workflows and automation. Coming soon.
      </div>
    </div>
  );
}
