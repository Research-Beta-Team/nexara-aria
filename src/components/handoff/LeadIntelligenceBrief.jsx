/**
 * Lead brief: Company Snapshot (mint), Contact Profile (teal), Why They're Hot (amber), Recommended Approach (violet).
 */
import { C, F, R, S } from '../../tokens';

const SECTION_STYLES = {
  company: { label: 'Company Snapshot', borderLeft: C.primary, bg: C.greenDim },
  contact: { label: 'Contact Profile', borderLeft: C.secondary, bg: C.secondaryDim },
  whyHot: { label: "Why They're Hot", borderLeft: C.amber, bg: C.amberDim },
  approach: { label: 'Recommended Approach', borderLeft: '#A78BFA', bg: 'rgba(167,139,250,0.15)' },
};

function Section({ id, label, borderLeft, bg, children }) {
  return (
    <div
      style={{
        marginBottom: S[4],
        padding: S[3],
        backgroundColor: bg,
        borderLeft: `4px solid ${borderLeft}`,
        borderRadius: R.card,
      }}
    >
      <div style={{ fontFamily: F.body, fontSize: '11px', fontWeight: 700, color: C.textSecondary, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: S[2] }}>
        {label}
      </div>
      <div style={{ fontFamily: F.body, fontSize: '13px', color: C.textPrimary, lineHeight: 1.5, whiteSpace: 'pre-wrap' }}>
        {children}
      </div>
    </div>
  );
}

export default function LeadIntelligenceBrief({ lead }) {
  if (!lead || !lead.brief) {
    return (
      <div
        style={{
          padding: S[8],
          textAlign: 'center',
          fontFamily: F.body,
          fontSize: '14px',
          color: C.textMuted,
          backgroundColor: C.surface,
          border: `1px solid ${C.border}`,
          borderRadius: R.card,
        }}
      >
        Select an MQL to view the lead brief.
      </div>
    );
  }
  const b = lead.brief;
  return (
    <div style={{ marginBottom: S[6] }}>
      <h3 style={{ fontFamily: F.display, fontSize: '16px', fontWeight: 700, color: C.textPrimary, margin: `0 0 ${S[4]} 0` }}>
        Lead Intelligence Brief
      </h3>
      <Section id="company" label={SECTION_STYLES.company.label} borderLeft={SECTION_STYLES.company.borderLeft} bg={SECTION_STYLES.company.bg}>
        {b.companySnapshot}
      </Section>
      <Section id="contact" label={SECTION_STYLES.contact.label} borderLeft={SECTION_STYLES.contact.borderLeft} bg={SECTION_STYLES.contact.bg}>
        {b.contactProfile}
      </Section>
      <Section id="whyHot" label={SECTION_STYLES.whyHot.label} borderLeft={SECTION_STYLES.whyHot.borderLeft} bg={SECTION_STYLES.whyHot.bg}>
        {b.whyHot}
      </Section>
      <Section id="approach" label={SECTION_STYLES.approach.label} borderLeft={SECTION_STYLES.approach.borderLeft} bg={SECTION_STYLES.approach.bg}>
        {b.recommendedApproach}
      </Section>
    </div>
  );
}
