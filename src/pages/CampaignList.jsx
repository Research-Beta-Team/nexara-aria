import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useStore from '../store/useStore';
import useToast from '../hooks/useToast';
import useCommandModeDesign from '../hooks/useCommandModeDesign';
import { C, F, R, S, T, btn, shadows, scrollbarStyle } from '../tokens';
import NewCampaignChoice from '../components/campaign/NewCampaignChoice';
import usePlan from '../hooks/usePlan';
import AgentRoleIcon from '../components/ui/AgentRoleIcon';
import { IconCircleEmpty, IconZap } from '../components/ui/Icons';
import { ModePageWrapper, ModeButton, ModeBadge } from '../components/mode';

/* ─── Campaign data ─────────────────────────────────────────── */
const CAMPAIGNS = [
  {
    id: 'donor-acq-q2',
    name: 'Donor Acquisition Q2',
    vertical: 'Healthcare NGO',
    status: 'active',
    spend: 18400,
    leads: 124,
    cac: 148,
    roas: 3.2,
    pacing: +12,
    goal: 200,
    channels: ['Email', 'LinkedIn', 'Meta'],
    agent: { agentId: 'copywriter', name: 'Copywriter', task: 'drafting email variant 4 of 5', status: 'running' },
  },
  {
    id: 'apac-brand',
    name: 'APAC Brand Awareness',
    vertical: 'Donor Engagement',
    status: 'active',
    spend: 12100,
    leads: 83,
    cac: 145,
    roas: 2.9,
    pacing: 0,
    goal: 120,
    channels: ['LinkedIn', 'Meta'],
    agent: { agentId: 'strategist', name: 'Strategist', task: 'completed positioning brief', status: 'done' },
  },
  {
    id: 'sea-demand',
    name: 'SEA Demand Generation',
    vertical: 'Emergency Health',
    status: 'active',
    spend: 9800,
    leads: 71,
    cac: 138,
    roas: 2.7,
    pacing: -8,
    goal: 110,
    channels: ['Email', 'Google'],
    agent: { agentId: 'analyst', name: 'Analyst', task: 'investigating CTR drop on keyword cluster', status: 'running' },
  },
  {
    id: 'anz-retarget',
    name: 'ANZ Retargeting',
    vertical: 'Donor Re-engagement',
    status: 'warning',
    spend: 6200,
    leads: 41,
    cac: 151,
    roas: 1.8,
    pacing: -3,
    goal: 80,
    channels: ['Meta', 'Display'],
    agent: { agentId: 'optimizer', name: 'Optimizer', task: 'A/B test paused — burnout detected', status: 'paused' },
    warning: 'Audience burnout at 94% — action required',
  },
  {
    id: 'yemen-emergency',
    name: 'Yemen Emergency Outreach',
    vertical: 'Crisis Response',
    status: 'launching',
    spend: 0,
    leads: 0,
    cac: null,
    roas: null,
    pacing: null,
    goal: 300,
    budget: 25000,
    icpMatch: 89,
    launchDays: 2,
    channels: ['Email', 'LinkedIn', 'Meta'],
    agent: { agentId: 'outreach', name: 'Outreach', task: 'scheduling email sequences for 3 segments', status: 'running' },
  },
  {
    id: 'mena-healthcare',
    name: 'MENA Healthcare Donor',
    vertical: 'Major Gifts',
    status: 'draft',
    spend: 0,
    leads: 0,
    cac: null,
    roas: null,
    pacing: null,
    goal: 150,
    budget: 30000,
    strategyPct: 67,
    channels: ['Email', 'LinkedIn'],
    agent: { agentId: 'strategist', name: 'Strategist', task: 'generating campaign brief from ICP data', status: 'running' },
  },
];

const WORKFLOW_QUEUE = [
  { id: 'wf1', name: 'Campaign Launch — Yemen Emergency', steps: 'Strategist → Copywriter → Guardian → Outreach', eta: '8–12m', credits: 120, status: 'queued' },
  { id: 'wf2', name: 'Content Creation — MENA Healthcare', steps: 'Strategist → Copywriter → Guardian', eta: '5–8m', credits: 80, status: 'approval' },
  { id: 'wf3', name: 'Performance Review — ANZ Retargeting', steps: 'Analyst → Strategist → Freya', eta: '5–7m', credits: 60, status: 'running' },
];

const STATUS_FILTERS = ['all', 'active', 'launching', 'draft', 'warning'];

const STATUS_CONFIG = {
  active:    { dot: C.green,    label: 'Active',    strip: C.green,    badgeBg: 'rgba(16,185,129,0.12)', badgeColor: C.green,   badgeBorder: 'rgba(16,185,129,0.3)' },
  warning:   { dot: C.amber,    label: 'Warning',   strip: C.amber,    badgeBg: 'rgba(251,191,36,0.12)', badgeColor: C.amber,   badgeBorder: 'rgba(251,191,36,0.3)' },
  launching: { dot: '#60A5FA',  label: 'Launching', strip: '#60A5FA',  badgeBg: 'rgba(96,165,250,0.12)', badgeColor: '#60A5FA', badgeBorder: 'rgba(96,165,250,0.3)' },
  draft:     { dot: C.textMuted,label: 'Draft',     strip: C.border,   badgeBg: C.surface3,              badgeColor: C.textMuted, badgeBorder: C.border },
};

const OVERVIEW_STATS = [
  { label: 'Active', value: '6', color: C.green },
  { label: 'Total Spend', value: '$46.5k', color: C.textSecondary },
  { label: 'Leads Generated', value: '319', color: C.secondary },
  { label: 'Agents Running', value: '4', color: C.primary },
];

/* ─── Sub-components ────────────────────────────────────────── */
function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.draft;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: '5px',
      backgroundColor: cfg.badgeBg, color: cfg.badgeColor,
      border: `1px solid ${cfg.badgeBorder}`,
      borderRadius: R.pill, padding: '2px 10px',
      fontFamily: F.mono, fontSize: '11px', fontWeight: 700, letterSpacing: '0.03em',
      whiteSpace: 'nowrap',
    }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: cfg.dot, display: 'inline-block', flexShrink: 0 }} />
      {cfg.label}
    </span>
  );
}

function KpiChip({ label, value, color }) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', gap: '2px',
      backgroundColor: C.surface3, borderRadius: R.sm,
      padding: `${S[1]} ${S[3]}`, minWidth: 0,
    }}>
      <span style={{ fontFamily: F.mono, fontSize: '13px', fontWeight: 700, color: color || C.textPrimary, lineHeight: 1 }}>{value}</span>
      <span style={{ fontFamily: F.body, fontSize: '10px', color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>{label}</span>
    </div>
  );
}

function GoalBar({ pct, status }) {
  const color = status === 'warning' ? C.amber : pct >= 80 ? C.green : C.primary;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: S[1] }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontFamily: F.body, fontSize: '10px', color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Q2 Goal</span>
        <span style={{ fontFamily: F.mono, fontSize: '11px', fontWeight: 700, color }}>{pct}% to goal</span>
      </div>
      <div style={{ height: '5px', borderRadius: R.pill, backgroundColor: C.surface3, overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${Math.min(100, pct)}%`, backgroundColor: color, borderRadius: R.pill, transition: 'width 0.4s ease' }} />
      </div>
    </div>
  );
}

function AgentStatusDot({ status }) {
  const color = status === 'running' ? C.green : status === 'done' ? C.primary : status === 'paused' ? C.amber : C.textMuted;
  return (
    <span style={{
      display: 'inline-block', width: 7, height: 7, borderRadius: '50%',
      backgroundColor: color,
      boxShadow: status === 'running' ? `0 0 6px ${color}` : 'none',
      flexShrink: 0,
    }} />
  );
}

function AgentActivityStrip({ agent, onActivate, toast }) {
  const isIdle = !agent || agent.status === 'idle';
  const bg = isIdle
    ? C.surface3
    : agent.status === 'running' ? 'rgba(74,124,111,0.12)' : agent.status === 'paused' ? 'rgba(251,191,36,0.08)' : 'rgba(74,124,111,0.08)';
  const border = isIdle
    ? C.border
    : agent.status === 'running' ? 'rgba(74,124,111,0.35)' : agent.status === 'paused' ? 'rgba(251,191,36,0.3)' : 'rgba(74,124,111,0.2)';

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: S[2],
      backgroundColor: bg,
      border: `1px solid ${border}`,
      borderRadius: R.md,
      padding: `${S[2]} ${S[3]}`,
    }}>
      {isIdle ? (
        <>
          <IconCircleEmpty color={C.textMuted} width={14} height={14} />
          <span style={{ fontFamily: F.body, fontSize: '11px', color: C.textMuted, flex: 1 }}>All agents idle — click to activate</span>
          <button
            onClick={(e) => { e.stopPropagation(); onActivate(); }}
            style={{ ...btn.primary, fontSize: '11px', padding: `2px ${S[2]}` }}
          >
            ▶ Activate
          </button>
        </>
      ) : (
        <>
          <AgentStatusDot status={agent.status} />
          <AgentRoleIcon agentId={agent.agentId} size={14} color={C.secondary} />
          <span style={{ fontFamily: F.mono, fontSize: '11px', fontWeight: 700, color: C.secondary, whiteSpace: 'nowrap' }}>{agent.name}</span>
          <span style={{ fontFamily: F.body, fontSize: '11px', color: C.textMuted }}>—</span>
          <span style={{
            fontFamily: F.body, fontSize: '11px', color: C.textSecondary,
            fontStyle: 'italic', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1,
          }}>{agent.task}</span>
          <button
            onClick={(e) => { e.stopPropagation(); toast.info(`${agent.name} agent task viewed`); }}
            style={{ ...btn.ghost, fontSize: '10px', padding: `1px ${S[2]}`, color: C.textMuted, whiteSpace: 'nowrap' }}
          >
            View →
          </button>
        </>
      )}
    </div>
  );
}

function CampaignCard({ campaign, onClick, toast }) {
  const [hovered, setHovered] = useState(false);
  const { name, vertical, status, spend, leads, cac, roas, pacing, goal,
    budget, icpMatch, launchDays, strategyPct, channels, agent, warning } = campaign;

  const goalPct = leads && goal ? Math.round((leads / goal) * 100) : 0;
  const pacingColor = pacing === null ? C.textMuted : pacing > 0 ? C.green : pacing < 0 ? C.red : C.textSecondary;
  const pacingLabel = pacing === null ? '—' : pacing > 0 ? `+${pacing}%` : pacing === 0 ? 'On track' : `${pacing}%`;
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.draft;

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        backgroundColor: C.surface,
        border: `1px solid ${status === 'warning' ? 'rgba(251,191,36,0.45)' : hovered ? C.borderHover : C.border}`,
        borderRadius: R.card,
        display: 'flex',
        flexDirection: 'column',
        cursor: 'pointer',
        transition: T.base,
        boxShadow: hovered ? shadows.cardHover : 'none',
        transform: hovered ? 'translateY(-2px)' : 'none',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Color strip top */}
      <div style={{ height: '4px', backgroundColor: cfg.strip, flexShrink: 0 }} />

      <div style={{ padding: `${S[4]} ${S[4]} 0`, display: 'flex', flexDirection: 'column', gap: S[3] }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: S[2] }}>
          <div style={{ minWidth: 0, flex: 1 }}>
            <div style={{ fontFamily: F.display, fontSize: '15px', fontWeight: 700, color: C.textPrimary, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {name}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: S[2], marginTop: '3px', flexWrap: 'wrap' }}>
              <span style={{ fontFamily: F.body, fontSize: '11px', color: C.textMuted, backgroundColor: C.surface2, borderRadius: R.sm, padding: '1px 6px' }}>{vertical}</span>
              <div style={{ display: 'flex', gap: '3px', flexWrap: 'wrap' }}>
                {channels.map((ch, i) => (
                  <span key={ch} style={{ fontFamily: F.mono, fontSize: '9px', fontWeight: 700, color: C.textMuted }}>
                    {i > 0 && <span style={{ color: C.border, marginRight: '3px' }}>·</span>}{ch}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <StatusBadge status={status} />
        </div>

        {/* Warning notice */}
        {warning && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: S[2],
            backgroundColor: 'rgba(251,191,36,0.1)', border: '1px solid rgba(251,191,36,0.3)',
            borderRadius: R.sm, padding: `${S[1]} ${S[3]}`,
          }}>
            <span style={{ fontSize: '12px' }}>⚠️</span>
            <span style={{ fontFamily: F.body, fontSize: '11px', color: C.amber, flex: 1 }}>{warning}</span>
            <button
              onClick={(e) => { e.stopPropagation(); toast.info('Optimizer agent dispatched to fix burnout'); }}
              style={{ ...btn.primary, fontSize: '10px', padding: `1px ${S[2]}`, whiteSpace: 'nowrap' }}
            >
              Fix →
            </button>
          </div>
        )}

        {/* KPI chips */}
        {(status === 'active' || status === 'warning') && (
          <div style={{ display: 'flex', gap: S[2], flexWrap: 'wrap' }}>
            <KpiChip label="Spend" value={`$${(spend / 1000).toFixed(1)}k`} />
            <KpiChip label="Leads" value={leads} color={C.primary} />
            {cac !== null && <KpiChip label="CAC" value={`$${cac}`} color={cac > 160 ? C.amber : C.textPrimary} />}
            {roas !== null && <KpiChip label="ROAS" value={`${roas}x`} color={C.secondary} />}
          </div>
        )}

        {status === 'launching' && (
          <div style={{ display: 'flex', gap: S[2], flexWrap: 'wrap' }}>
            <KpiChip label="Budget" value={`$${(budget / 1000).toFixed(0)}k`} />
            <KpiChip label="ICP Match" value={`${icpMatch}%`} color={C.green} />
            <KpiChip label="Launches" value={`in ${launchDays}d`} color={'#60A5FA'} />
            <KpiChip label="Goal" value={`${goal} leads`} />
          </div>
        )}

        {status === 'draft' && (
          <div style={{ display: 'flex', gap: S[2], flexWrap: 'wrap' }}>
            <KpiChip label="Budget" value={`$${(budget / 1000).toFixed(0)}k`} />
            <KpiChip label="Strategy" value={`${strategyPct}%`} color={C.amber} />
            <KpiChip label="Goal" value={`${goal} leads`} />
          </div>
        )}

        {/* Pacing label */}
        {pacing !== null && (status === 'active' || status === 'warning') && (
          <div style={{ display: 'flex', alignItems: 'center', gap: S[2] }}>
            <span style={{ fontFamily: F.mono, fontSize: '20px', fontWeight: 800, color: pacingColor, lineHeight: 1 }}>{pacingLabel}</span>
            <span style={{ fontFamily: F.body, fontSize: '11px', color: C.textMuted }}>
              {pacing > 0 ? 'ahead of pacing' : pacing < 0 ? 'behind pacing' : 'on track'}
            </span>
          </div>
        )}

        {/* Goal bar */}
        {(status === 'active' || status === 'warning') && (
          <GoalBar pct={goalPct} status={status} />
        )}

        {/* Draft strategy bar */}
        {status === 'draft' && strategyPct !== undefined && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: S[1] }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontFamily: F.body, fontSize: '10px', color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Strategy Progress</span>
              <span style={{ fontFamily: F.mono, fontSize: '11px', color: C.amber }}>{strategyPct}%</span>
            </div>
            <div style={{ height: '5px', borderRadius: R.pill, backgroundColor: C.surface3, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${strategyPct}%`, backgroundColor: C.amber, borderRadius: R.pill }} />
            </div>
          </div>
        )}
      </div>

      {/* Agent Activity Strip */}
      <div style={{ padding: S[3] }}>
        <AgentActivityStrip
          agent={agent}
          onActivate={() => toast.success(`Agents activated for ${name}`)}
          toast={toast}
        />
      </div>

      {/* Hover: Run Campaign Workflow button */}
      {hovered && (
        <div style={{ padding: `0 ${S[3]} ${S[3]}` }}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              toast.success(`Campaign workflow started for ${name} — 4 agents briefed`);
            }}
            style={{
              ...btn.primary,
              width: '100%',
              justifyContent: 'center',
              fontSize: '13px',
              padding: `${S[2]} 0`,
            }}
          >
            ▶ Run Campaign Workflow
          </button>
        </div>
      )}
    </div>
  );
}

function WorkflowQueuePanel({ toast }) {
  const STATUS_CHIP = {
    queued:   { color: C.textMuted,  bg: C.surface3, label: 'Queued' },
    running:  { color: C.primary,    bg: 'rgba(74,124,111,0.15)', label: '▶ Running' },
    approval: { color: C.amber,      bg: 'rgba(251,191,36,0.12)', label: 'Needs Approval' },
  };

  return (
    <div style={{
      backgroundColor: C.surface,
      border: `1px solid ${C.border}`,
      borderRadius: R.card,
      overflow: 'hidden',
      marginTop: S[6],
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: `${S[3]} ${S[5]}`,
        borderBottom: `1px solid ${C.border}`,
        backgroundColor: C.surface2,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: S[2] }}>
          <IconZap color={C.primary} w={16} />
          <span style={{ fontFamily: F.display, fontSize: '15px', fontWeight: 700, color: C.textPrimary }}>Workflow Queue</span>
          <span style={{
            fontFamily: F.mono, fontSize: '10px', fontWeight: 700,
            color: C.primary, backgroundColor: C.primaryGlow,
            borderRadius: R.pill, padding: '1px 8px',
          }}>{WORKFLOW_QUEUE.length} active</span>
        </div>
        <button
          onClick={() => toast.info('Viewing all workflows in Workflow Center')}
          style={{ ...btn.ghost, fontSize: '12px' }}
        >
          View All →
        </button>
      </div>
      {WORKFLOW_QUEUE.map((wf, i) => {
        const chip = STATUS_CHIP[wf.status] || STATUS_CHIP.queued;
        return (
          <div key={wf.id} style={{
            display: 'flex', alignItems: 'center', gap: S[4],
            padding: `${S[3]} ${S[5]}`,
            borderBottom: i < WORKFLOW_QUEUE.length - 1 ? `1px solid ${C.border}` : 'none',
          }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: F.body, fontSize: '13px', fontWeight: 600, color: C.textPrimary }}>{wf.name}</div>
              <div style={{ fontFamily: F.mono, fontSize: '10px', color: C.textMuted, marginTop: '2px' }}>{wf.steps}</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: S[3], flexShrink: 0 }}>
              <span style={{ fontFamily: F.mono, fontSize: '11px', color: C.textMuted }}>{wf.eta}</span>
              <span style={{ fontFamily: F.mono, fontSize: '10px', color: C.textMuted }}>{wf.credits} cr</span>
              <span style={{
                fontFamily: F.mono, fontSize: '10px', fontWeight: 700,
                color: chip.color, backgroundColor: chip.bg,
                borderRadius: R.pill, padding: '2px 8px',
              }}>{chip.label}</span>
              {wf.status === 'approval' && (
                <button
                  onClick={() => toast.success(`Workflow "${wf.name}" approved`)}
                  style={{ ...btn.primary, fontSize: '11px', padding: `2px ${S[3]}` }}
                >
                  Approve
                </button>
              )}
              {wf.status === 'queued' && (
                <button
                  onClick={() => toast.info(`Workflow "${wf.name}" started`)}
                  style={{ ...btn.secondary, fontSize: '11px', padding: `2px ${S[3]}` }}
                >
                  Run Now
                </button>
              )}
              {wf.status === 'running' && (
                <button
                  onClick={() => toast.warning(`Workflow "${wf.name}" paused`)}
                  style={{ ...btn.ghost, fontSize: '11px', padding: `2px ${S[3]}`, color: C.amber }}
                >
                  Pause
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ─── Page ──────────────────────────────────────────────────── */
export default function CampaignList() {
  const navigate = useNavigate();
  const toast = useToast();
  const design = useCommandModeDesign();
  const openCheckout = useStore((s) => s.openCheckout);
  const { getLimit, isLimitReached } = usePlan();
  const activeCampaignsCount = useStore((s) => s.activeCampaignsCount);

  const [statusFilter, setStatusFilter] = useState('all');
  const [freyaDismissed, setFreyaDismissed] = useState(false);

  const isManual = design.id === 'manual';
  const isAgentic = design.id === 'fully_agentic';
  const accentColor = isAgentic ? C.green : isManual ? C.red : C.primary;

  const campaignLimit = getLimit('activeCampaigns');
  const atCampaignLimit = campaignLimit !== -1 && isLimitReached('activeCampaigns', activeCampaignsCount);

  const filtered = CAMPAIGNS.filter((c) =>
    statusFilter === 'all' || c.status === statusFilter
  );

  const filterPillStyle = (active) => ({
    fontFamily: isManual ? design.typography.dataFont : F.body,
    fontSize: isManual ? '11px' : '13px',
    fontWeight: active ? 600 : 400,
    color: active ? C.textInverse : C.textSecondary,
    backgroundColor: active ? accentColor : 'transparent',
    border: active
      ? `1px solid ${accentColor}`
      : isManual
      ? `1px dashed ${C.border}`
      : `1px solid ${C.border}`,
    borderRadius: isAgentic ? '20px' : isManual ? '3px' : R.pill,
    padding: isManual ? `2px ${S[3]}` : `${S[1]} ${S[4]}`,
    cursor: 'pointer',
    transition: design.motion.transition,
    textTransform: isManual ? 'uppercase' : 'none',
    letterSpacing: isManual ? '0.05em' : '0',
  });

  return (
    <ModePageWrapper style={{ minHeight: '100vh', ...scrollbarStyle }}>

      {/* ── Page Header ─────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: design.spacing.sectionGap, flexWrap: 'wrap', gap: S[4] }}>
        <div>
          <h1 style={{
            fontFamily: design.typography.headingFont,
            fontSize: isManual ? '16px' : isAgentic ? '32px' : '28px',
            fontWeight: design.typography.headingWeight,
            letterSpacing: design.typography.headingLetterSpacing,
            textTransform: design.typography.headingTransform,
            color: C.textPrimary,
            margin: 0,
          }}>
            {isManual ? 'CAMPAIGN OPERATIONS' : 'Campaign Operations'}
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: S[3], marginTop: S[2], flexWrap: 'wrap' }}>
            {OVERVIEW_STATS.map(({ label, value, color }, i) => (
              <span key={i} style={{ display: 'flex', alignItems: 'center', gap: S[1], fontFamily: F.mono, fontSize: '12px', color }}>
                {i > 0 && <span style={{ color: C.border, marginRight: S[1] }}>·</span>}
                <span style={{ fontWeight: 700 }}>{value}</span>
                <span style={{ color: C.textMuted }}>{label}</span>
              </span>
            ))}
          </div>
        </div>
        <div style={{ display: 'flex', gap: S[2], flexWrap: 'wrap' }}>
          <button
            onClick={() => toast.success('All campaign workflows triggered — 4 agents activated')}
            style={{ ...btn.secondary, fontSize: '13px' }}
          >
            ⚡ Run All Campaigns
          </button>
          <NewCampaignChoice
            atLimit={atCampaignLimit}
            onUpgrade={() => openCheckout('growth', 'campaigns')}
          />
        </div>
      </div>

      {/* ── Freya Command Banner ─────────────────── */}
      {!freyaDismissed && (
        <div style={{
          display: 'flex', alignItems: 'flex-start', gap: S[4],
          backgroundColor: 'rgba(74,124,111,0.08)',
          border: `1px solid rgba(74,124,111,0.35)`,
          borderLeft: `4px solid ${C.primary}`,
          borderRadius: R.md,
          padding: `${S[4]} ${S[5]}`,
          marginBottom: S[5],
        }}>
          <span style={{ fontSize: '18px', flexShrink: 0, marginTop: '1px' }}>✦</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: F.body, fontSize: '13px', fontWeight: 700, color: C.primary, marginBottom: '3px' }}>
              Freya Insight — Action Required
            </div>
            <span style={{ fontFamily: F.body, fontSize: '13px', color: C.textSecondary }}>
              Pause <strong style={{ color: C.textPrimary }}>ANZ Retargeting</strong> — audience burnout at 94%.
              Reallocate $6.2k to <strong style={{ color: C.textPrimary }}>MENA Healthcare Donor</strong> which shows
              12% stronger ICP signal. Estimated +18 leads at current CPL.
            </span>
          </div>
          <div style={{ display: 'flex', gap: S[2], flexShrink: 0, flexWrap: 'wrap' }}>
            <button
              onClick={() => { toast.success('Reallocation executed — Optimizer briefed on ANZ pause, MENA scaling'); setFreyaDismissed(true); }}
              style={{ ...btn.primary, fontSize: '12px', padding: `${S[1]} ${S[3]}` }}
            >
              Apply Now
            </button>
            <button
              onClick={() => { toast.info('Reviewing impact analysis...'); }}
              style={{ ...btn.secondary, fontSize: '12px', padding: `${S[1]} ${S[3]}` }}
            >
              Review Impact
            </button>
            <button
              onClick={() => setFreyaDismissed(true)}
              style={{ ...btn.ghost, fontSize: '18px', padding: '0 6px', lineHeight: 1, color: C.textMuted }}
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* ── Command Bar: Filter Pills ─────────────── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: S[2], marginBottom: S[5], flexWrap: 'wrap' }}>
        <span style={{ fontFamily: F.mono, fontSize: '10px', fontWeight: 700, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.06em', marginRight: S[1] }}>
          Filter:
        </span>
        {STATUS_FILTERS.map((f) => (
          <button key={f} style={filterPillStyle(statusFilter === f)} onClick={() => setStatusFilter(f)}>
            {f === 'all' ? 'All Campaigns' : f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: S[3] }}>
          <span style={{ fontFamily: F.mono, fontSize: '11px', color: C.textMuted }}>
            {filtered.length} campaign{filtered.length !== 1 ? 's' : ''}
          </span>
          <button
            onClick={() => toast.info('Sorting by performance')}
            style={{ ...btn.ghost, fontSize: '12px', color: C.textMuted }}
          >
            Sort: Performance ↓
          </button>
        </div>
      </div>

      {/* ── Campaign Grid ────────────────────────── */}
      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: `${S[16]} 0`, color: C.textMuted, fontFamily: F.body, fontSize: '14px' }}>
          No campaigns match this filter.
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: S[4] }}>
          {filtered.map((c) => (
            <CampaignCard
              key={c.id}
              campaign={c}
              toast={toast}
              onClick={() => navigate(`/campaigns/${c.id}`)}
            />
          ))}
        </div>
      )}

      {/* ── Workflow Queue ───────────────────────── */}
      <WorkflowQueuePanel toast={toast} />
    </ModePageWrapper>
  );
}
