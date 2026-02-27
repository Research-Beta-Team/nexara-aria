import { C, F, R, S, badge } from '../../tokens';

const CHANNEL_LABELS = { linkedin: 'LinkedIn', meta: 'Meta', google: 'Google Ads', email: 'Email Outreach', content: 'Content / SEO', display: 'Display' };
const CAMPAIGN_TYPE_LABELS = { demand_gen: 'Demand Gen', brand_awareness: 'Brand Awareness', abm: 'ABM', retargeting: 'Retargeting' };

function ReviewSection({ title, children }) {
  return (
    <div style={{
      backgroundColor: C.surface2,
      border: `1px solid ${C.border}`,
      borderRadius: R.card,
      overflow: 'hidden',
    }}>
      <div style={{
        padding: `${S[2]} ${S[4]}`,
        borderBottom: `1px solid ${C.border}`,
        backgroundColor: C.surface3,
        fontFamily: F.display,
        fontSize: '12px',
        fontWeight: 700,
        color: C.textMuted,
        textTransform: 'uppercase',
        letterSpacing: '0.08em',
      }}>
        {title}
      </div>
      <div style={{ padding: S[4] }}>
        {children}
      </div>
    </div>
  );
}

function ReviewRow({ label, value, valueColor }) {
  if (!value) return null;
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: S[4], padding: `${S[1]} 0`, borderBottom: `1px solid ${C.border}` }}>
      <span style={{ fontFamily: F.body, fontSize: '12px', color: C.textMuted, width: '140px', flexShrink: 0 }}>{label}</span>
      <span style={{ fontFamily: F.body, fontSize: '13px', color: valueColor ?? C.textPrimary, flex: 1 }}>{value}</span>
    </div>
  );
}

function TagList({ items }) {
  if (!items?.length) return <span style={{ fontFamily: F.body, fontSize: '12px', color: C.textMuted }}>—</span>;
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: S[1] }}>
      {items.map((item) => (
        <span key={item} style={{
          fontFamily: F.body, fontSize: '11px', color: C.textSecondary,
          backgroundColor: C.surface3, border: `1px solid ${C.border}`,
          borderRadius: R.pill, padding: `2px ${S[2]}`,
        }}>
          {item}
        </span>
      ))}
    </div>
  );
}

export default function WizardStep7({ data }) {
  const team = data.team ?? {};
  const gates = data.approvalGates ?? {};

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: S[5] }}>
      <div>
        <h2 style={{ fontFamily: F.display, fontSize: '20px', fontWeight: 800, color: C.textPrimary, margin: `0 0 ${S[1]}`, letterSpacing: '-0.02em' }}>
          Review & Launch
        </h2>
        <p style={{ fontFamily: F.body, fontSize: '13px', color: C.textSecondary, margin: 0 }}>
          Everything looks good? Hit launch and ARIA will deploy your agents.
        </p>
      </div>

      {/* Basics */}
      <ReviewSection title="Campaign Basics">
        <ReviewRow label="Name"       value={data.name    || '—'} />
        <ReviewRow label="Client"     value={data.client  || '—'} />
        <ReviewRow label="Type"       value={CAMPAIGN_TYPE_LABELS[data.type] || data.type || '—'} />
        <ReviewRow label="Goal"       value={data.target ? `${data.target} ${data.goalMetric || 'leads'}` : '—'} valueColor={C.primary} />
        <ReviewRow label="Budget"     value={data.budget  ? `$${Number(data.budget).toLocaleString()}` : '—'} />
        <ReviewRow label="Deadline"   value={data.deadline || '—'} />
      </ReviewSection>

      {/* ICP */}
      <ReviewSection title="Ideal Customer Profile">
        <div style={{ display: 'flex', flexDirection: 'column', gap: S[3] }}>
          <div>
            <div style={{ fontFamily: F.body, fontSize: '11px', color: C.textMuted, marginBottom: S[1] }}>Job Titles</div>
            <TagList items={data.jobTitles} />
          </div>
          <div>
            <div style={{ fontFamily: F.body, fontSize: '11px', color: C.textMuted, marginBottom: S[1] }}>Geographies</div>
            <TagList items={data.geographies} />
          </div>
          <div>
            <div style={{ fontFamily: F.body, fontSize: '11px', color: C.textMuted, marginBottom: S[1] }}>Industries</div>
            <TagList items={data.industries} />
          </div>
          <div>
            <div style={{ fontFamily: F.body, fontSize: '11px', color: C.textMuted, marginBottom: S[1] }}>Company Size</div>
            <TagList items={data.companySize} />
          </div>
        </div>
      </ReviewSection>

      {/* Channels */}
      <ReviewSection title="Channels">
        <TagList items={(data.channels ?? []).map((id) => CHANNEL_LABELS[id] ?? id)} />
      </ReviewSection>

      {/* Team */}
      <ReviewSection title="Team">
        <div style={{ display: 'flex', flexDirection: 'column', gap: S[2] }}>
          {['owner', 'mediaBuyer', 'contentStrategist', 'sdr', 'analyst'].map((role) => {
            const labels = { owner: 'Campaign Owner', mediaBuyer: 'Media Buyer', contentStrategist: 'Content Strategist', sdr: 'SDR', analyst: 'Analyst' };
            return (
              <div key={role} style={{ display: 'flex', gap: S[3] }}>
                <span style={{ fontFamily: F.body, fontSize: '12px', color: C.textMuted, width: '140px', flexShrink: 0 }}>{labels[role]}</span>
                <span style={{ fontFamily: F.body, fontSize: '12px', color: team[role] ? C.textPrimary : C.textMuted }}>
                  {team[role] || 'ARIA Agent (auto)'}
                </span>
              </div>
            );
          })}
        </div>
      </ReviewSection>

      {/* Workflow */}
      <ReviewSection title="Workflow">
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: S[2] }}>
          {Object.entries(gates).filter(([, v]) => v).map(([key]) => {
            const labels = { contentApproval: 'Content Approval', budgetChanges: 'Budget Alerts', escalationAlerts: 'Escalation Alerts', weeklyReport: 'Weekly Report', prospectReplies: 'Reply Notifications' };
            return (
              <span key={key} style={{ ...badge.base, ...badge.green }}>{labels[key] ?? key}</span>
            );
          })}
        </div>
        <div style={{ marginTop: S[3], fontFamily: F.body, fontSize: '12px', color: C.textSecondary }}>
          Reporting: <span style={{ color: C.textPrimary }}>{data.reportingCadence || 'Weekly'}</span>
          {' · '} Escalation: <span style={{ color: C.textPrimary }}>{data.escalationRouting || 'Owner'}</span>
        </div>
      </ReviewSection>

      {/* Launch readiness indicator */}
      <div style={{
        backgroundColor: C.primaryGlow,
        border: `1px solid rgba(61,220,132,0.25)`,
        borderLeft: `3px solid ${C.primary}`,
        borderRadius: R.card,
        padding: S[4],
        display: 'flex',
        alignItems: 'center',
        gap: S[3],
      }}>
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <circle cx="10" cy="10" r="8.5" stroke={C.primary} strokeWidth="1.5"/>
          <path d="M6 10l3 3 5-5" stroke={C.primary} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <div>
          <div style={{ fontFamily: F.display, fontSize: '13px', fontWeight: 700, color: C.primary }}>Ready to Launch</div>
          <div style={{ fontFamily: F.body, fontSize: '12px', color: C.textSecondary }}>
            ARIA will brief all agents and activate channels within 2–5 minutes of launch.
          </div>
        </div>
      </div>
    </div>
  );
}
