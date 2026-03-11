/**
 * Modal: Company data (teal), Contact data (mint), Intent signals (amber), ICP fit (violet).
 */
import { C, F, R, S, btn } from '../../tokens';
import { Z } from '../../tokens';
import { IconClose } from '../ui/Icons';

const SECTION_STYLES = {
  company: { label: 'Company data', borderLeft: C.secondary, bg: C.secondaryDim },
  contact: { label: 'Contact data', borderLeft: C.primary, bg: C.greenDim },
  intent: { label: 'Intent signals', borderLeft: C.amber, bg: C.amberDim },
  icp: { label: 'ICP fit', borderLeft: '#A78BFA', bg: 'rgba(167,139,250,0.15)' },
};

function Section({ label, borderLeft, bg, children }) {
  return (
    <div style={{ marginBottom: S[4], padding: S[3], backgroundColor: bg, borderLeft: `4px solid ${borderLeft}`, borderRadius: R.card }}>
      <div style={{ fontFamily: F.body, fontSize: '11px', fontWeight: 700, color: C.textSecondary, textTransform: 'uppercase', marginBottom: S[2] }}>{label}</div>
      <div style={{ fontFamily: F.body, fontSize: '13px', color: C.textPrimary, lineHeight: 1.5 }}>{children}</div>
    </div>
  );
}

export default function EnrichmentDetailModal({ leadDetail, onClose }) {
  if (!leadDetail) return null;
  const cd = leadDetail.companyData || {};
  const contact = leadDetail.contactData || {};
  const intent = leadDetail.intentSignals || [];
  const icp = leadDetail.icpFit || {};

  return (
    <>
      <div role="presentation" onClick={onClose} style={{ position: 'fixed', inset: 0, backgroundColor: C.overlay, zIndex: Z.overlay }} />
      <div
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '100%',
          maxWidth: 480,
          maxHeight: '90vh',
          overflowY: 'auto',
          backgroundColor: C.surface,
          border: `1px solid ${C.border}`,
          borderRadius: R.card,
          boxShadow: 'var(--shadow-modal)',
          zIndex: Z.modal,
          padding: S[6],
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: S[4] }}>
          <h2 style={{ fontFamily: F.display, fontSize: '18px', fontWeight: 700, color: C.textPrimary, margin: 0 }}>
            {leadDetail.leadName} — {leadDetail.company}
          </h2>
          <button type="button" onClick={onClose} style={btn.icon} aria-label="Close"><IconClose color={C.textSecondary} width={18} height={18} /></button>
        </div>
        <Section label={SECTION_STYLES.company.label} borderLeft={SECTION_STYLES.company.borderLeft} bg={SECTION_STYLES.company.bg}>
          Industry: {cd.industry || '—'}<br />
          Size: {cd.size || '—'}<br />
          Revenue: {cd.revenue || '—'}<br />
          HQ: {cd.hq || '—'}<br />
          <span style={{ fontSize: '11px', color: C.textMuted }}>Source: {cd.source}</span>
        </Section>
        <Section label={SECTION_STYLES.contact.label} borderLeft={SECTION_STYLES.contact.borderLeft} bg={SECTION_STYLES.contact.bg}>
          Title: {contact.title || '—'}<br />
          Email: {contact.email || '—'}<br />
          LinkedIn: {contact.linkedIn || '—'}<br />
          <span style={{ fontSize: '11px', color: C.textMuted }}>Source: {contact.source}</span>
        </Section>
        <Section label={SECTION_STYLES.intent.label} borderLeft={SECTION_STYLES.intent.borderLeft} bg={SECTION_STYLES.intent.bg}>
          {intent.length ? intent.map((s, i) => (
            <div key={i} style={{ marginBottom: S[1] }}>{s.signal} — {s.score} ({(s.source)})</div>
          )) : 'No intent signals'}
        </Section>
        <Section label={SECTION_STYLES.icp.label} borderLeft={SECTION_STYLES.icp.borderLeft} bg={SECTION_STYLES.icp.bg}>
          Score: {icp.score}%<br />
          {icp.factors?.length ? icp.factors.join(', ') : ''}<br />
          <span style={{ fontSize: '11px', color: C.textMuted }}>Source: {icp.source}</span>
        </Section>
      </div>
    </>
  );
}
