import { C, F, R, S, badge, btn } from '../../tokens';
import useToast from '../../hooks/useToast';

const CHANNEL_LABELS = {
  linkedin: 'LinkedIn',
  meta: 'Meta',
  google: 'Google Ads',
  linkedin_ads: 'LinkedIn Ads',
  email: 'Email Outreach',
  content: 'Content / SEO',
  display: 'Display',
  whatsapp: 'WhatsApp',
};
const CAMPAIGN_TYPE_LABELS = { demand_gen: 'Demand Gen', brand_awareness: 'Brand Awareness', abm: 'ABM', retargeting: 'Retargeting' };

// Heuristic: credits per month for campaign (channels + agents)
function estimateCredits(data) {
  const channels = data.channels?.length ?? 0;
  const agents = data.selectedAgents?.length ?? 0;
  return Math.max(500, (channels * 800) + (agents * 400));
}

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

export default function WizardStep7({
  data,
  creditsRemaining = 0,
  getLimit,
  isLimitReached,
  activeCampaignsCount,
  planId,
  hasFeature,
  hasAgent,
  openCheckout,
  atCampaignLimit,
  campaignLimit,
}) {
  const toast = useToast();
  const team = data.team ?? {};
  const gates = data.approvalGates ?? {};

  const estimatedCredits = estimateCredits(data);
  const hasEnoughCredits = creditsRemaining >= estimatedCredits;
  const creditsShort = Math.max(0, estimatedCredits - creditsRemaining);

  // Locked features relevant to this campaign (channels they have + agents they could have had)
  const channels = data.channels ?? [];
  const selectedAgents = data.selectedAgents ?? [];
  const CHANNEL_FEATURES = { linkedin: 'linkedinOutreach', meta: 'metaAdsManagement', google: 'googleAdsManagement', linkedin_ads: 'linkedinAdsManagement', whatsapp: 'whatsappOutreach' };
  const lockedChannels = channels.filter((id) => CHANNEL_FEATURES[id] && !(hasFeature?.(CHANNEL_FEATURES[id]) ?? true));
  const CHANNEL_AGENTS = { email: ['sdr', 'copywriter'], linkedin: ['linkedin_agent'], meta: ['meta_ads'], google: ['google_ads'], linkedin_ads: ['linkedin_ads'], whatsapp: ['whatsapp_agent'], content: ['seo', 'copywriter'], display: ['analytics'] };
  const relevantAgentIds = [...new Set(channels.flatMap((ch) => CHANNEL_AGENTS[ch] ?? []))];
  const lockedAgents = relevantAgentIds.filter((id) => !(hasAgent?.(id) ?? true));
  const hasLockedFeatures = lockedChannels.length > 0 || lockedAgents.length > 0;
  const launchWithList = [
    ...(channels.map((id) => CHANNEL_LABELS[id] ?? id)),
    ...(selectedAgents.length ? [`${selectedAgents.length} agent(s)`] : []),
  ].filter(Boolean);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: S[5] }}>
      <div>
        <h2 style={{ fontFamily: F.display, fontSize: '20px', fontWeight: 800, color: C.textPrimary, margin: `0 0 ${S[1]}`, letterSpacing: '-0.02em' }}>
          Review & Launch
        </h2>
        <p style={{ fontFamily: F.body, fontSize: '13px', color: C.textSecondary, margin: 0 }}>
          Everything looks good? Hit launch and Freya will deploy your agents.
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
                  {team[role] || 'Freya Agent (auto)'}
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

      {/* Credit estimate */}
      <ReviewSection title="Credit estimate">
        <div style={{ display: 'flex', flexDirection: 'column', gap: S[2] }}>
          <div style={{ fontFamily: F.body, fontSize: '13px', color: C.textSecondary }}>
            Estimated credit usage for this campaign: <strong style={{ color: C.textPrimary }}>~{estimatedCredits.toLocaleString()} credits/month</strong>
          </div>
          {hasEnoughCredits ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: S[2], color: C.primary }}>
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <circle cx="9" cy="9" r="7" stroke={C.primary} strokeWidth="1.5"/>
                <path d="M5 9l3 3 5-5" stroke={C.primary} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span style={{ fontFamily: F.body, fontSize: '13px', fontWeight: 600 }}>You have enough credits</span>
            </div>
          ) : (
            <div style={{
              display: 'flex', flexDirection: 'column', gap: S[2],
              padding: S[3], backgroundColor: C.amberDim, border: `1px solid ${C.amber}`, borderRadius: R.md,
            }}>
              <span style={{ fontFamily: F.body, fontSize: '13px', color: C.amber }}>
                You'll need ~{creditsShort.toLocaleString()} more credits.
              </span>
              <div style={{ display: 'flex', gap: S[2], flexWrap: 'wrap' }}>
                <button type="button" style={{ ...btn.secondary, fontSize: '12px' }} onClick={() => toast.info('Buy credits — $99 (mock)')}>
                  Buy Credits — $99
                </button>
                <button type="button" style={{ ...btn.primary, fontSize: '12px' }} onClick={() => openCheckout?.('growth')}>
                  Upgrade Plan
                </button>
              </div>
            </div>
          )}
        </div>
      </ReviewSection>

      {/* Locked features summary */}
      {hasLockedFeatures && (
        <div style={{
          backgroundColor: C.surface3,
          border: `1px solid ${C.border}`,
          borderRadius: R.card,
          padding: S[4],
        }}>
          <div style={{ fontFamily: F.body, fontSize: '13px', fontWeight: 600, color: C.textPrimary, marginBottom: S[1] }}>
            Some features were locked
          </div>
          <div style={{ fontFamily: F.body, fontSize: '12px', color: C.textSecondary, marginBottom: S[2] }}>
            Your campaign will launch with: {launchWithList.length ? launchWithList.join(', ') : 'selected channels and agents'}.
          </div>
          <button type="button" style={{ ...btn.ghost, fontSize: '12px', color: C.primary, fontWeight: 600 }} onClick={() => openCheckout?.(lockedAgents.length ? 'scale' : 'growth')}>
            Upgrade now →
          </button>
        </div>
      )}

      {/* Launch readiness indicator — hide when at campaign limit (footer handles it) */}
      {!atCampaignLimit && (
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
            Freya will brief all agents and activate channels within 2–5 minutes of launch.
          </div>
        </div>
      </div>
      )}
    </div>
  );
}
