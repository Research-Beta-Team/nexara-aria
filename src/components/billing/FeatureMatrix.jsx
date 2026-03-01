import { useState } from 'react';
import { PLANS, PLAN_ORDER } from '../../config/plans';
import { C, F, R, S } from '../../tokens';

// ── Row group definitions ─────────────────────
const GROUPS = [
  {
    label: 'Campaigns',
    rows: [
      { key: 'activeCampaigns',  label: 'Active campaigns',    source: 'limit' },
      { key: 'campaignWizard',   label: 'Campaign wizard',     source: 'feature' },
      { key: 'calendarView',     label: 'Calendar view',       source: 'feature' },
      { key: 'ganttPlan',        label: 'Gantt timeline',      source: 'feature' },
    ],
  },
  {
    label: 'Agents & AI',
    rows: [
      { key: 'credits',          label: 'Agent credits / month',  source: 'credits' },
      { key: 'customAgents',     label: 'Custom agents',          source: 'feature' },
      { key: 'ariaVoiceMinutes', label: 'ARIA Voice minutes',     source: 'limit' },
      { key: 'verticalPlaybooks',label: 'Vertical playbooks',     source: 'feature' },
    ],
  },
  {
    label: 'Outreach',
    rows: [
      { key: 'emailOutreach',    label: 'Email outreach',      source: 'feature' },
      { key: 'linkedinOutreach', label: 'LinkedIn outreach',   source: 'feature' },
      { key: 'whatsappOutreach', label: 'WhatsApp outreach',   source: 'feature' },
      { key: 'unifiedInbox',     label: 'Unified inbox',       source: 'feature' },
      { key: 'queryManager',     label: 'Query manager',       source: 'feature' },
    ],
  },
  {
    label: 'Paid Media',
    rows: [
      { key: 'metaAdsManagement',    label: 'Meta Ads management',    source: 'feature' },
      { key: 'googleAdsManagement',  label: 'Google Ads management',  source: 'feature' },
      { key: 'linkedinAdsManagement',label: 'LinkedIn Ads management',source: 'feature' },
      { key: 'metaAdsMonitoring',    label: 'Meta Ads monitoring',    source: 'feature' },
    ],
  },
  {
    label: 'Research & ABM',
    rows: [
      { key: 'icpBuilder',            label: 'ICP builder',                source: 'feature' },
      { key: 'icpScoring',            label: 'ICP scoring',                source: 'feature' },
      { key: 'intentSignals',         label: 'Intent signals',             source: 'feature' },
      { key: 'intentSignalAccounts',  label: 'Intent accounts tracked',    source: 'limit' },
      { key: 'competitiveIntel',      label: 'Competitive intelligence',   source: 'feature' },
      { key: 'abmEngine',             label: 'ABM Engine',                 source: 'feature' },
      { key: 'namedAccountsABM',      label: 'Named accounts (ABM)',       source: 'limit' },
    ],
  },
  {
    label: 'RevOps & Analytics',
    rows: [
      { key: 'basicAnalytics',       label: 'Analytics dashboard',        source: 'feature' },
      { key: 'advancedAnalytics',    label: 'Advanced analytics',         source: 'feature' },
      { key: 'pipelineManager',      label: 'Pipeline manager',           source: 'feature' },
      { key: 'predictiveForecasting',label: 'Predictive forecasting',     source: 'feature' },
      { key: 'customerSuccess',      label: 'Customer success module',    source: 'feature' },
      { key: 'crossClientAnalytics', label: 'Cross-client analytics',     source: 'feature' },
    ],
  },
  {
    label: 'Platform',
    rows: [
      { key: 'clientPortal',     label: 'Client portal',           source: 'feature' },
      { key: 'clientPortals',    label: 'Client portal slots',     source: 'limit' },
      { key: 'whiteLabel',       label: 'White-labeling',          source: 'feature' },
      { key: 'apiAccess',        label: 'API access',              source: 'feature' },
      { key: 'roleBasedAccess',  label: 'Role-based access',       source: 'feature' },
      { key: 'dataWarehouseSync',label: 'Data warehouse sync',     source: 'feature' },
      { key: 'subBilling',       label: 'Sub-billing for clients', source: 'feature' },
      { key: 'outcomeBilling',   label: 'Outcome-based billing',   source: 'feature' },
    ],
  },
  {
    label: 'Support',
    rows: [
      { key: 'support_type',     label: 'Support channel',   source: 'support', field: 'type' },
      { key: 'support_sla',      label: 'Response SLA',      source: 'support', field: 'sla' },
      { key: 'support_strategy', label: 'Strategy call',     source: 'support', field: 'strategyCall' },
      { key: 'support_slack',    label: 'Dedicated Slack',   source: 'support', field: 'dedicatedSlack' },
      { key: 'support_csm',      label: 'Named CSM',         source: 'support', field: 'csm' },
    ],
  },
];

const SUPPORT_TYPE_LABELS = {
  community:     'Community',
  email:         'Email',
  slack:         'Dedicated Slack',
  dedicated_csm: 'Named CSM',
};

const SLA_LABELS = { '4h': '4 hrs', '1h': '1 hr', '30min': '30 min' };

// ── Limit formatter ───────────────────────────
function formatLimit(val, key) {
  if (val === -1) return { variant: 'unlimited' };
  if (val === 0)  return { variant: 'none' };
  const labelMap = {
    ariaVoiceMinutes:       `${val} min/mo`,
    intentSignalAccounts:   `${val.toLocaleString()} accts`,
    namedAccountsABM:       `${val} accounts`,
    clientPortals:          `${val} portals`,
    activeCampaigns:        `${val}`,
  };
  return { variant: 'value', text: labelMap[key] ?? val.toLocaleString() };
}

function formatCredits(planId) {
  const n = PLANS[planId].credits.included;
  if (n >= 1_000_000) return `${n / 1_000_000}M`;
  if (n >= 1_000)     return `${(n / 1_000).toLocaleString()}K`;
  return n.toLocaleString();
}

// ── Cell value renderer ───────────────────────
function CellValue({ planId, row }) {
  const plan = PLANS[planId];

  const Check = () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="7" fill="rgba(61,220,132,0.15)"/>
      <path d="M5 8l2 2 4-4" stroke="#3DDC84" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
  const Dash = () => (
    <span style={{ color: C.textMuted, fontFamily: F.mono, fontSize: '14px' }}>—</span>
  );

  if (row.source === 'feature') {
    return plan.features[row.key] ? <Check /> : <Dash />;
  }

  if (row.source === 'limit') {
    const fmt = formatLimit(plan.limits[row.key], row.key);
    if (fmt.variant === 'unlimited') return (
      <span style={{ color: '#3DDC84', fontFamily: F.mono, fontSize: '11px', fontWeight: 700 }}>Unlimited</span>
    );
    if (fmt.variant === 'none') return <Dash />;
    return <span style={{ color: C.textSecondary, fontFamily: F.mono, fontSize: '12px' }}>{fmt.text}</span>;
  }

  if (row.source === 'credits') {
    return (
      <span style={{ color: '#3DDC84', fontFamily: F.mono, fontSize: '12px', fontWeight: 700 }}>
        {formatCredits(planId)}
      </span>
    );
  }

  if (row.source === 'support') {
    const val = plan.support[row.field];
    if (typeof val === 'boolean') return val ? <Check /> : <Dash />;
    if (row.field === 'type') return (
      <span style={{ color: C.textSecondary, fontFamily: F.body, fontSize: '12px' }}>
        {SUPPORT_TYPE_LABELS[val] ?? val}
      </span>
    );
    if (row.field === 'sla') {
      const label = SLA_LABELS[val] ?? val;
      return label
        ? <span style={{ color: C.textSecondary, fontFamily: F.mono, fontSize: '12px' }}>{label}</span>
        : <Dash />;
    }
  }

  return <span style={{ color: C.textMuted, fontFamily: F.mono, fontSize: '14px' }}>—</span>;
}

// ── Column background per plan ─────────────────
const COL_BG = {
  starter: 'rgba(107,148,120,0.05)',
  growth:  'rgba(61,220,132,0.05)',
  scale:   'rgba(94,234,212,0.05)',
  agency:  'rgba(167,139,250,0.05)',
};

const GRID_COLS = '220px 1fr 1fr 1fr 1fr';

// ── FeatureMatrix ─────────────────────────────
export default function FeatureMatrix() {
  const [expanded, setExpanded] = useState(false);

  return (
    <div style={{
      backgroundColor: C.surface,
      border: `1px solid ${C.border}`,
      borderRadius: R.card,
      overflow: 'hidden',
    }}>
      {/* ── Expand toggle ── */}
      <button
        onClick={() => setExpanded(e => !e)}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: S[2],
          padding: `${S[4]} ${S[6]}`,
          backgroundColor: 'transparent',
          border: 'none',
          cursor: 'pointer',
          fontFamily: F.body,
          fontSize: '14px',
          fontWeight: 600,
          color: C.textSecondary,
          borderBottom: expanded ? `1px solid ${C.border}` : 'none',
        }}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ transform: expanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s ease' }}>
          <path d="M3 6l5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        {expanded ? 'Collapse comparison' : 'See full feature comparison'}
      </button>

      {/* ── Full table ── */}
      {expanded && (
        <div style={{ overflowX: 'auto' }}>
          {/* Column header row */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: GRID_COLS,
            backgroundColor: C.surface2,
            borderBottom: `1px solid ${C.border}`,
            position: 'sticky',
            top: 0,
            zIndex: 1,
          }}>
            <div style={{ padding: `${S[3]} ${S[4]}` }} />
            {PLAN_ORDER.map(planId => (
              <div key={planId} style={{
                padding: `${S[3]} ${S[2]}`,
                textAlign: 'center',
                borderLeft: `1px solid ${C.border}`,
                backgroundColor: COL_BG[planId],
              }}>
                <div style={{
                  fontFamily: F.mono, fontSize: '11px', fontWeight: 700,
                  color: PLANS[planId].color, letterSpacing: '0.07em',
                }}>
                  {PLANS[planId].name}
                </div>
              </div>
            ))}
          </div>

          {/* Groups */}
          {GROUPS.map((group) => (
            <div key={group.label}>
              {/* Group header */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: GRID_COLS,
                backgroundColor: C.surface2,
                borderTop: `1px solid ${C.border}`,
              }}>
                <div style={{
                  gridColumn: '1 / -1',
                  padding: `${S[2]} ${S[4]}`,
                  fontFamily: F.mono,
                  fontSize: '10px',
                  fontWeight: 700,
                  color: C.textMuted,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                }}>
                  {group.label}
                </div>
              </div>

              {/* Data rows */}
              {group.rows.map((row, rowIdx) => (
                <div key={row.key} style={{
                  display: 'grid',
                  gridTemplateColumns: GRID_COLS,
                  backgroundColor: rowIdx % 2 === 1 ? C.surface2 : 'transparent',
                  borderTop: `1px solid ${C.border}`,
                }}>
                  {/* Row label */}
                  <div style={{
                    padding: `${S[2]} ${S[4]}`,
                    fontFamily: F.body,
                    fontSize: '13px',
                    color: C.textSecondary,
                    display: 'flex',
                    alignItems: 'center',
                  }}>
                    {row.label}
                  </div>
                  {/* Plan cells */}
                  {PLAN_ORDER.map(planId => (
                    <div key={planId} style={{
                      padding: `${S[2]} ${S[2]}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderLeft: `1px solid ${C.border}`,
                      backgroundColor: COL_BG[planId],
                    }}>
                      <CellValue planId={planId} row={row} />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
