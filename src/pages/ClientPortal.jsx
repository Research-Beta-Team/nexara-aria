import {
  CAMPAIGN_OVERVIEW,
  PENDING_APPROVALS,
  REPORTS,
  MESSAGES,
  UPCOMING,
} from '../data/clientPortal';
import { CP } from '../data/clientPortal';
import ClientCampaignOverview from '../components/client/ClientCampaignOverview';
import ClientApprovals from '../components/client/ClientApprovals';
import ClientReports from '../components/client/ClientReports';
import ClientMessaging from '../components/client/ClientMessaging';
import { IconDocument, IconCalendar, IconTarget, IconCheck } from '../components/ui/Icons';

const fontBody = "'DM Sans', sans-serif";

export default function ClientPortal() {
  const latestReport = REPORTS[0];

  return (
    <>
      {/* Section 1 — Campaign progress */}
      <ClientCampaignOverview overview={CAMPAIGN_OVERVIEW} />

      {/* Section 2 — Two column: Key wins (left) | Pending approvals (right) */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 24, marginBottom: 24 }}>
        <section
          style={{
            backgroundColor: CP.surface,
            border: `1px solid ${CP.border}`,
            borderRadius: 12,
            padding: 24,
          }}
        >
          <h2 style={{ fontFamily: fontBody, fontSize: 16, fontWeight: 700, color: CP.text, margin: '0 0 16px' }}>
            Key wins this week
          </h2>
          <ul style={{ margin: 0, paddingLeft: 20, fontFamily: fontBody, fontSize: 14, color: CP.textSecondary, lineHeight: 1.8 }}>
            {(CAMPAIGN_OVERVIEW.keyWins || []).map((win, i) => (
              <li key={i} style={{ marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
                <IconCheck color={CP.success} width={16} height={16} />
                {win}
              </li>
            ))}
          </ul>
          <h3 style={{ fontFamily: fontBody, fontSize: 14, fontWeight: 600, color: CP.text, margin: '20px 0 8px' }}>
            What&apos;s happening next week
          </h3>
          <p style={{ fontFamily: fontBody, fontSize: 13, color: CP.textSecondary, margin: 0, lineHeight: 1.5 }}>
            {CAMPAIGN_OVERVIEW.nextMilestone}
          </p>
        </section>
        <ClientApprovals approvals={PENDING_APPROVALS} />
      </div>

      {/* Section 3 — Latest report */}
      <ClientReports report={latestReport} />

      {/* Section 4 — Two column: Upcoming (left) | Message CSM (right) */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: 24 }}>
        <section
          style={{
            backgroundColor: CP.surface,
            border: `1px solid ${CP.border}`,
            borderRadius: 12,
            padding: 24,
          }}
        >
          <h2 style={{ fontFamily: fontBody, fontSize: 16, fontWeight: 700, color: CP.text, margin: '0 0 16px' }}>
            Upcoming
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {(UPCOMING || []).map((item, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  gap: 12,
                  padding: 12,
                  backgroundColor: CP.bg,
                  borderRadius: 8,
                  border: `1px solid ${CP.border}`,
                }}
              >
                <span style={{ display: 'flex', alignItems: 'center', color: CP.primary }}>{item.type === 'Report' ? <IconDocument color={CP.primary} width={18} height={18} /> : item.type === 'Review' ? <IconCalendar color={CP.primary} width={18} height={18} /> : <IconTarget color={CP.primary} width={18} height={18} />}</span>
                <div>
                  <div style={{ fontFamily: fontBody, fontSize: 14, fontWeight: 600, color: CP.text }}>{item.title}</div>
                  <div style={{ fontFamily: fontBody, fontSize: 12, color: CP.textSecondary }}>{item.date}</div>
                  <div style={{ fontFamily: fontBody, fontSize: 12, color: CP.textMuted }}>{item.description}</div>
                </div>
              </div>
            ))}
          </div>
        </section>
        <ClientMessaging messages={MESSAGES} />
      </div>
    </>
  );
}
