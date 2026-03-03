import { C, F, R, S, btn } from '../../tokens';

// Feature keys → display names (for loss chips)
const FEAT_NAMES = {
  unifiedInbox: 'Company Social Inbox',
  linkedinOutreach: 'LinkedIn Outreach',
  abmEngine: 'ABM Engine',
  intentSignals: 'Intent Signals',
  googleAdsManagement: 'Google Ads',
  linkedinAdsManagement: 'LinkedIn Ads',
  advancedAnalytics: 'Analytics (advanced)',
  clientPortal: 'Client Portals',
  competitiveIntel: 'Competitive Intel',
  pipelineManager: 'Pipeline Manager',
  predictiveForecasting: 'Predictive Forecasting',
  customerSuccess: 'Customer Success',
  whiteLabel: 'White-Label',
  apiAccess: 'API Access',
  customAgents: 'Custom Agents',
  ganttPlan: 'Gantt Timeline',
  outcomeBilling: 'Outcome-Based Billing',
  roleBasedAccess: 'Role-Based Access',
  queryManager: 'Team Query',
  icpScoring: 'ICP Scoring',
  metaAdsManagement: 'Meta Ads Management',
  whatsappOutreach: 'WhatsApp Outreach',
  dataWarehouseSync: 'Data Warehouse Sync',
  crossClientAnalytics: 'Cross-Client Analytics',
  subBilling: 'Sub-Billing',
};
function featLabel(key) {
  return FEAT_NAMES[key] ?? key.replace(/([A-Z])/g, ' $1').replace(/^./, (s) => s.toUpperCase());
}

// Agent IDs → display names
const AGENT_NAMES = {
  linkedin_agent: 'LinkedIn Agent',
  google_ads: 'Google Ads Agent',
  meta_ads: 'Meta Ads Agent',
  linkedin_ads: 'LinkedIn Ads Agent',
  intent_monitor: 'Intent Monitor',
  icp_researcher: 'ICP Researcher',
  competitor_intel: 'Competitive Intel',
  market_analyst: 'Market Analyst',
  abm_agent: 'ABM Agent',
  revops: 'RevOps Agent',
  forecasting: 'Forecasting Agent',
  cs_success: 'Customer Success Agent',
  meeting_intel: 'Meeting Intel',
  aria_cs: 'ARIA CS',
  copywriter: 'Copywriter',
  sdr: 'SDR Agent',
  analytics: 'Analytics Agent',
  meta_monitor: 'Meta Monitor',
  seo: 'SEO Agent',
  social_media: 'Social Media Agent',
  brand_guardian: 'Brand Guardian',
  whatsapp_agent: 'WhatsApp Agent',
  creative_intel: 'Creative Intel',
  geo: 'Geo Agent',
  video_script: 'Video Script',
  aria_voice: 'ARIA Voice',
};
function agentLabel(id) {
  return AGENT_NAMES[id] ?? id.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
}

const cardBase = {
  padding: S[4],
  borderRadius: R.card,
  border: `1px solid ${C.border}`,
  backgroundColor: C.surface2,
  textAlign: 'left',
};

const RedIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
    <circle cx="12" cy="12" r="10" stroke={C.red} strokeWidth="2" />
    <path d="M12 8v4M12 16h.01" stroke={C.red} strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const WarningIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
    <path d="M12 2L2 22h20L12 2z" stroke={C.amber} strokeWidth="2" strokeLinejoin="round" />
    <path d="M12 9v4M12 17h.01" stroke={C.amber} strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export default function DowngradeImpactCard({
  variant,
  data,
  newPlanDisplayName,
  linkLabel,
  onLinkClick,
  rolloverBalance,
}) {
  if (!data) return null;

  const commonTitle = {
    fontFamily: F.body,
    fontSize: 13,
    fontWeight: 600,
    color: C.textPrimary,
    marginBottom: S[2],
  };

  if (variant === 'campaigns') {
    const { current, newLimit, difference } = data;
    return (
      <div style={cardBase}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: S[3] }}>
          <RedIcon />
          <div style={{ flex: 1 }}>
            <div style={commonTitle}>
              You have {current} active campaigns. {newPlanDisplayName} allows {newLimit}.
            </div>
            <div style={{ fontFamily: F.body, fontSize: 13, color: C.textSecondary, marginBottom: S[2] }}>
              {difference} campaigns will be paused immediately on downgrade.
            </div>
            <div style={{ fontFamily: F.body, fontSize: 13, color: C.textSecondary, marginBottom: linkLabel ? S[2] : 0 }}>
              You&apos;ll need to manually choose which {newLimit} to keep active.
            </div>
            {linkLabel && (
              <button
                type="button"
                onClick={onLinkClick}
                style={{
                  ...btn.ghost,
                  padding: 0,
                  fontSize: 13,
                  color: C.primary,
                  textDecoration: 'underline',
                }}
              >
                {linkLabel}
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'seats') {
    const { current, newLimit, difference } = data;
    const mockMembers = ['Jane Cooper (SDR)', 'Alex Rivera (Analyst)', 'Sam Chen (Content)', 'Jordan Lee (Ops)'];
    const shown = mockMembers.slice(0, Math.min(difference, 4));
    return (
      <div style={cardBase}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: S[3] }}>
          <RedIcon />
          <div style={{ flex: 1 }}>
            <div style={commonTitle}>
              {current} team members are active. {newPlanDisplayName} allows {newLimit}.
            </div>
            <div style={{ fontFamily: F.body, fontSize: 13, color: C.textSecondary, marginBottom: S[2] }}>
              {difference} team members will lose access.
            </div>
            {shown.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: S[1], marginBottom: S[2] }}>
                {shown.map((name, i) => (
                  <span
                    key={i}
                    style={{
                      fontFamily: F.body,
                      fontSize: 12,
                      color: C.textSecondary,
                      backgroundColor: C.surface3,
                      padding: `${S[1]} ${S[2]}`,
                      borderRadius: R.sm,
                    }}
                  >
                    {name}
                  </span>
                ))}
              </div>
            )}
            {linkLabel && (
              <button
                type="button"
                onClick={onLinkClick}
                style={{
                  ...btn.ghost,
                  padding: 0,
                  fontSize: 13,
                  color: C.primary,
                  textDecoration: 'underline',
                }}
              >
                {linkLabel}
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'features') {
    const keys = Array.isArray(data) ? data : [];
    if (keys.length === 0) return null;
    return (
      <div style={cardBase}>
        <div style={{ ...commonTitle, marginBottom: S[3] }}>Features being lost</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: S[2] }}>
          {keys.map((key) => (
            <span
              key={key}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: S[1],
                fontFamily: F.body,
                fontSize: 12,
                color: C.red,
                backgroundColor: C.redDim,
                border: `1px solid ${C.red}`,
                padding: `${S[1]} ${S[3]}`,
                borderRadius: R.pill,
              }}
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M2 2l8 8M10 2L2 10" stroke={C.red} strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              {featLabel(key)}
            </span>
          ))}
        </div>
      </div>
    );
  }

  if (variant === 'agents') {
    const ids = Array.isArray(data) ? data : [];
    if (ids.length === 0) return null;
    return (
      <div style={cardBase}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: S[3] }}>
          <RedIcon />
          <div style={{ flex: 1 }}>
            <div style={commonTitle}>
              {ids.length} agents will be deactivated:
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: S[2], marginBottom: S[2] }}>
              {ids.map((id) => (
                <span
                  key={id}
                  style={{
                    fontFamily: F.body,
                    fontSize: 12,
                    color: C.red,
                    backgroundColor: C.redDim,
                    padding: `${S[1]} ${S[3]}`,
                    borderRadius: R.pill,
                  }}
                >
                  {agentLabel(id)}
                </span>
              ))}
            </div>
            <div style={{ fontFamily: F.body, fontSize: 12, color: C.textSecondary }}>
              Any sequences or automations run by these agents will pause.
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'credits') {
    const { from, to } = data;
    const max = Math.max(from, to, 1);
    const fromPct = Math.round((from / max) * 100);
    const toPct = Math.round((to / max) * 100);
    const format = (n) => (n >= 1000 ? `${(n / 1000).toLocaleString()}K` : String(n));
    return (
      <div style={cardBase}>
        <div style={commonTitle}>Credit reduction</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: S[4], marginBottom: S[3] }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: F.mono, fontSize: 11, color: C.textMuted, marginBottom: S[1] }}>
              Current {format(from)} → New {format(to)}
            </div>
            <div style={{ height: 8, borderRadius: R.pill, backgroundColor: C.surface3, overflow: 'hidden' }}>
              <div
                style={{
                  width: `${fromPct}%`,
                  height: '100%',
                  backgroundColor: C.textMuted,
                  borderRadius: R.pill,
                }}
              />
            </div>
            <div style={{ height: 8, borderRadius: R.pill, backgroundColor: C.surface3, marginTop: S[1], overflow: 'hidden' }}>
              <div
                style={{
                  width: `${toPct}%`,
                  height: '100%',
                  backgroundColor: C.primary,
                  borderRadius: R.pill,
                }}
              />
            </div>
          </div>
        </div>
        {rolloverBalance != null && rolloverBalance > 0 && (
          <div style={{ fontFamily: F.body, fontSize: 12, color: C.textSecondary, marginBottom: S[2] }}>
            You&apos;ll lose {rolloverBalance.toLocaleString()} rollover credits accumulated.
          </div>
        )}
        <div style={{ fontFamily: F.body, fontSize: 12, color: C.textSecondary }}>
          Any scheduled actions requiring more than {format(to)} credits will fail.
        </div>
      </div>
    );
  }

  if (variant === 'addons') {
    const addons = Array.isArray(data) ? data : [];
    if (addons.length === 0) return null;
    const labels = addons.map((id) => id.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase()));
    return (
      <div style={cardBase}>
        <div style={commonTitle}>Add-ons no longer available</div>
        <div style={{ fontFamily: F.body, fontSize: 13, color: C.textSecondary }}>
          {labels.join(', ')}
        </div>
      </div>
    );
  }

  if (variant === 'dataLoss') {
    const { abmAccounts, intentDataStops } = data;
    return (
      <div style={cardBase}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: S[3] }}>
          <WarningIcon />
          <div style={{ flex: 1 }}>
            <div style={commonTitle}>Active data impact</div>
            {abmAccounts != null && abmAccounts > 0 && (
              <div style={{ fontFamily: F.body, fontSize: 13, color: C.textSecondary, marginBottom: S[2] }}>
                Your ABM account data ({abmAccounts} accounts) will be archived.
              </div>
            )}
            {intentDataStops && (
              <div style={{ fontFamily: F.body, fontSize: 13, color: C.textSecondary, marginBottom: S[2] }}>
                Intent signal data will stop updating.
              </div>
            )}
            <div style={{ fontFamily: F.body, fontSize: 12, color: C.textMuted }}>
              Archived data is kept for 90 days in case you upgrade again.
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
