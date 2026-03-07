/**
 * Coming soon placeholder with page name and description.
 * Used for stub routes until full implementation (e.g. Gap Mitigation sessions).
 */
import { C, F } from '../../tokens';

export default function ComingSoonPage({ page, description }) {
  return (
    <div style={{ padding: '64px 48px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', maxWidth: '480px', margin: '0 auto' }}>
      <div style={{
        width: '56px', height: '56px', borderRadius: '14px',
        backgroundColor: C.primaryDim, border: `1px solid ${C.primaryGlow}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style={{ color: C.primary }}>
          <path d="M12 2L2 7l10 5 10-5-10-5ZM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
      <div style={{ fontFamily: F.mono, fontSize: '13px', fontWeight: 700, color: C.primary, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
        Coming Soon
      </div>
      <h1 style={{ fontFamily: F.display, fontSize: '22px', fontWeight: 700, color: C.textPrimary, margin: 0, textAlign: 'center' }}>
        {page}
      </h1>
      <p style={{ fontFamily: F.body, fontSize: '14px', color: C.textSecondary, textAlign: 'center', lineHeight: 1.6, margin: 0 }}>
        {description}
      </p>
      <p style={{ fontFamily: F.body, fontSize: '13px', color: C.textMuted, textAlign: 'center', margin: 0 }}>
        This page is under active development. Check back soon.
      </p>
    </div>
  );
}
