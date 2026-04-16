import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useStore from '../../store/useStore';
import useToast from '../../hooks/useToast';
import useCommandModeDesign from '../../hooks/useCommandModeDesign';
import { C, F, R, S, T, shadows } from '../../tokens';
import CommandModeToggle from '../../components/ui/CommandModeToggle';
import AgentRoleIcon from '../../components/ui/AgentRoleIcon';
import FreyaLogo from '../../components/ui/FreyaLogo';
import { getAgent } from '../../agents/AgentRegistry';
import {
  ModeCard,
  ModeButton,
  ModeBadge,
  ModeInput,
  ModeStatusDot,
  ModeProgress,
  ModeSection,
} from '../../components/mode';

// ── Pulse animation keyframes ───
const PULSE_CSS = `
@keyframes pulse2s { 0%,100%{opacity:1} 50%{opacity:0.4} }
@keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
@keyframes fadeInUp { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
`;

// ── Mode-aware Sparkline ─────────────────────────────────
function Sparkline({ data, color, mode }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const w = 64; const h = 24;
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / range) * h}`).join(' ');
  const strokeWidth = mode === 'manual' ? 1.5 : mode === 'fully_agentic' ? 2.5 : 2;
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} fill="none">
      <polyline
        points={pts}
        stroke={color || C.primary}
        strokeWidth={strokeWidth}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={mode === 'fully_agentic' ? 1 : 0.85}
        style={{ filter: mode === 'fully_agentic' ? `drop-shadow(0 0 4px ${color})` : 'none' }}
      />
    </svg>
  );
}

// ── Mode-aware KPI Card ──────────────────────────────────
function KPICard({ label, value, change, sub, spark, accent, design }) {
  const up = change?.startsWith('+');
  const isManual = design.id === 'manual';
  const isAgentic = design.id === 'fully_agentic';

  return (
    <div style={{
      background: design.card.bg,
      border: design.card.border,
      borderRadius: design.card.radius,
      padding: design.card.padding,
      position: 'relative',
      overflow: 'hidden',
      flex: 1,
      minWidth: '160px',
      boxShadow: design.card.shadow,
      transition: design.motion.transition,
    }}>
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: isManual ? '2px' : '3px',
        backgroundColor: accent || (isAgentic ? C.green : isManual ? C.red : C.amber),
      }} />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{
            fontFamily: design.typography.bodyFont,
            fontSize: design.typography.labelSize,
            fontWeight: design.typography.labelWeight,
            letterSpacing: design.typography.labelSpacing,
            textTransform: isManual ? 'uppercase' : 'none',
            color: C.textMuted,
            marginBottom: S[2],
          }}>{label}</div>
          <div style={{
            fontFamily: isManual ? design.typography.dataFont : design.typography.headingFont,
            fontSize: isAgentic ? '30px' : isManual ? '22px' : '26px',
            fontWeight: isAgentic ? 800 : 700,
            color: C.textPrimary,
            lineHeight: 1,
          }}>{value}</div>
          {change && (
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              marginTop: S[2],
              fontFamily: design.typography.bodyFont,
              fontSize: '11px',
              fontWeight: 600,
              color: up ? C.green : C.red,
            }}>
              {up ? '↑' : '↓'}{change}
            </div>
          )}
          {sub && <div style={{ fontFamily: design.typography.bodyFont, fontSize: '11px', color: C.textMuted, marginTop: '2px' }}>{sub}</div>}
        </div>
        {spark && <Sparkline data={spark} color={accent || C.primary} mode={design.id} />}
      </div>
    </div>
  );
}

// ── Agent status dot color ─────────────────────
function agentDotColor(status, design) {
  if (status === 'thinking')  return design.id === 'manual' ? C.red : C.amber;
  if (status === 'executing') return design.id === 'fully_agentic' ? C.green : C.primary;
  if (status === 'done')      return C.green;
  if (status === 'error')     return C.red;
  return C.textMuted;
}

// ── Mode-aware Agent Fleet Row ───────────────────────────
function AgentRow({ agent, status, currentTask, onTrigger, design }) {
  const dotColor = agentDotColor(status, design);
  const isActive = status === 'thinking' || status === 'executing';
  const isManual = design.id === 'manual';
  const isAgentic = design.id === 'fully_agentic';

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      padding: isManual ? '6px 0' : '8px 0',
      borderBottom: `1px solid ${C.border}`,
    }}>
      <div style={{
        width: isAgentic ? '32px' : '28px',
        height: isAgentic ? '32px' : '28px',
        borderRadius: isAgentic ? '10px' : '50%',
        backgroundColor: isAgentic ? `${dotColor}15` : 'rgba(74,124,111,0.18)',
        border: `1.5px solid ${dotColor}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        lineHeight: 0,
        flexShrink: 0,
        position: 'relative',
        boxShadow: isAgentic && isActive ? `0 0 12px ${dotColor}40` : 'none',
      }}>
        <AgentRoleIcon agentId={agent.id} size={isAgentic ? 16 : 14} color={getAgent(agent.id)?.color || C.primary} />
        {isActive && !isManual && (
          <div style={{
            position: 'absolute',
            inset: '-3px',
            borderRadius: 'inherit',
            border: `1.5px solid ${dotColor}`,
            animation: 'pulse2s 1.5s infinite',
            opacity: 0.5,
          }} />
        )}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontFamily: design.typography.bodyFont,
          fontSize: isManual ? '11px' : '12px',
          fontWeight: 700,
          color: C.textPrimary,
          lineHeight: 1.2,
        }}>{agent.displayName}</div>
        {isActive && currentTask ? (
          <div style={{
            fontFamily: design.typography.bodyFont,
            fontSize: isManual ? '10px' : '11px',
            color: dotColor,
            marginTop: '1px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}>{currentTask}</div>
        ) : (
          <div style={{
            fontFamily: isManual ? design.typography.dataFont : design.typography.bodyFont,
            fontSize: isManual ? '9px' : '11px',
            color: C.textMuted,
            marginTop: '1px',
            textTransform: isManual ? 'uppercase' : 'none',
            letterSpacing: isManual ? '0.05em' : '0',
          }}>{status || 'idle'}</div>
        )}
      </div>
      <button
        onClick={onTrigger}
        style={{
          padding: isManual ? '2px 6px' : '3px 8px',
          fontFamily: isManual ? design.typography.dataFont : design.typography.bodyFont,
          fontSize: isManual ? '9px' : '10px',
          fontWeight: 600,
          textTransform: isManual ? 'uppercase' : 'none',
          color: isAgentic ? C.green : isManual ? C.red : C.primary,
          backgroundColor: isAgentic ? C.greenDim : 'rgba(74,124,111,0.12)',
          border: isManual ? `1px dashed ${C.red}` : `1px solid rgba(74,124,111,0.3)`,
          borderRadius: design.button.radius,
          cursor: 'pointer',
          flexShrink: 0,
          transition: design.motion.transition,
        }}
      >
        {isManual ? 'RUN' : '▶ Run'}
      </button>
    </div>
  );
}

// ── Mode-aware Intel Card ───────────────────────
function IntelCard({ severity, agentId, finding, recommendation, actionLabel, onAction, design }) {
  const borderColor = severity === 'green' ? C.green : severity === 'amber' ? C.amber : C.red;
  const isManual = design.id === 'manual';
  const isAgentic = design.id === 'fully_agentic';

  return (
    <div style={{
      flex: '1 1 260px',
      minWidth: '240px',
      background: isAgentic
        ? `linear-gradient(135deg, ${borderColor}08 0%, ${borderColor}15 100%)`
        : `${borderColor}12`,
      border: isManual ? `1px solid ${borderColor}` : `1px solid ${borderColor}40`,
      borderLeft: `${isManual ? '2px' : '3px'} solid ${borderColor}`,
      borderRadius: design.card.radius,
      padding: design.card.padding,
      display: 'flex',
      flexDirection: 'column',
      gap: '6px',
      boxShadow: isAgentic ? `0 4px 16px ${borderColor}15` : 'none',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <AgentRoleIcon agentId={agentId} size={isAgentic ? 20 : 18} color={getAgent(agentId)?.color || C.primary} />
        <div style={{
          fontFamily: design.typography.bodyFont,
          fontSize: isManual ? '11px' : '12px',
          fontWeight: 700,
          color: C.textPrimary,
          lineHeight: 1.3,
        }}>{finding}</div>
      </div>
      <div style={{
        fontFamily: design.typography.bodyFont,
        fontSize: isManual ? '10px' : '11px',
        color: C.textSecondary,
        lineHeight: 1.5,
      }}>{recommendation}</div>
      <button
        onClick={onAction}
        style={{
          alignSelf: 'flex-start',
          padding: isManual ? '3px 8px' : '4px 10px',
          fontFamily: isManual ? design.typography.dataFont : design.typography.bodyFont,
          fontSize: isManual ? '10px' : '11px',
          fontWeight: 600,
          textTransform: isManual ? 'uppercase' : 'none',
          color: borderColor,
          backgroundColor: 'transparent',
          border: isManual ? `1px dashed ${borderColor}` : `1px solid ${borderColor}`,
          borderRadius: design.button.radius,
          cursor: 'pointer',
          marginTop: 'auto',
          transition: design.motion.transition,
        }}
      >
        {actionLabel}
      </button>
    </div>
  );
}

// ── Mode-aware Live Feed Item ────────────────────────────
function LiveFeedItem({ agentId, agent, desc, status, actionLabel, onAction, design }) {
  const isManual = design.id === 'manual';
  const isAgentic = design.id === 'fully_agentic';

  const statusConfig = {
    running:        { color: isManual ? C.red : C.amber, label: isManual ? 'EXEC' : 'Running…', showSpinner: !isManual },
    done:           { color: C.green, label: isManual ? 'DONE' : null, showSpinner: false },
    needs_approval: { color: C.amber, label: isManual ? 'AWAIT' : null, showSpinner: false },
    urgent:         { color: C.red, label: isManual ? 'URGENT' : null, showSpinner: false },
  };
  const sc = statusConfig[status] || statusConfig.running;

  return (
    <div style={{
      display: 'flex',
      alignItems: 'flex-start',
      gap: '10px',
      padding: `${isManual ? S[2] : S[3]} 0`,
      borderBottom: `1px solid ${C.border}`,
    }}>
      <div style={{
        width: isAgentic ? '34px' : '30px',
        height: isAgentic ? '34px' : '30px',
        borderRadius: isAgentic ? '10px' : R.md,
        backgroundColor: isAgentic ? `${sc.color}15` : 'rgba(74,124,111,0.12)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        lineHeight: 0,
        flexShrink: 0,
        boxShadow: isAgentic && status === 'running' ? `0 0 12px ${sc.color}30` : 'none',
      }}>
        <AgentRoleIcon agentId={agentId} size={isAgentic ? 18 : 16} color={getAgent(agentId)?.color || C.secondary} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
          <span style={{
            fontFamily: design.typography.bodyFont,
            fontSize: isManual ? '11px' : '12px',
            fontWeight: 700,
            color: C.secondary,
          }}>{agent}</span>
          {sc.showSpinner && (
            <div style={{
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              border: `2px solid ${sc.color}`,
              borderTopColor: 'transparent',
              animation: 'spin 0.8s linear infinite',
              flexShrink: 0,
            }} />
          )}
          {sc.label && (
            <span style={{
              fontFamily: design.typography.dataFont,
              fontSize: isManual ? '8px' : '10px',
              fontWeight: 700,
              color: sc.color,
              letterSpacing: isManual ? '0.08em' : '0',
            }}>{sc.label}</span>
          )}
        </div>
        <div style={{
          fontFamily: design.typography.bodyFont,
          fontSize: isManual ? '10px' : '12px',
          color: C.textSecondary,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}>{desc}</div>
      </div>
      {actionLabel && (
        <button
          onClick={onAction}
          style={{
            padding: isManual ? '2px 6px' : '3px 10px',
            fontFamily: isManual ? design.typography.dataFont : design.typography.bodyFont,
            fontSize: isManual ? '9px' : '11px',
            fontWeight: 600,
            textTransform: isManual ? 'uppercase' : 'none',
            color: sc.color,
            backgroundColor: 'transparent',
            border: isManual ? `1px dashed ${sc.color}` : `1px solid ${sc.color}`,
            borderRadius: design.button.radius,
            cursor: 'pointer',
            flexShrink: 0,
            whiteSpace: 'nowrap',
            transition: design.motion.transition,
          }}
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}

// ── Mode-aware Approval Queue Card ───────────────────────
function ApprovalQueueCard({ type, title, agentId, agentName, confidence, pendingHours, onApprove, onReview, urgent, design }) {
  const isManual = design.id === 'manual';
  const isAgentic = design.id === 'fully_agentic';

  const TYPE_COLORS = {
    CONTENT:  { color: '#6BA396', bg: 'rgba(107,163,150,0.12)' },
    STRATEGY: { color: C.primary, bg: 'rgba(74,124,111,0.12)' },
    OUTREACH: { color: '#8B9E98', bg: 'rgba(139,158,152,0.12)' },
    BUDGET:   { color: C.amber, bg: 'rgba(251,191,36,0.12)' },
    ICP:      { color: C.secondary, bg: 'rgba(107,163,150,0.12)' },
  };

  const tc = TYPE_COLORS[type] || TYPE_COLORS.CONTENT;
  const timeColor = pendingHours < 1 ? C.green : pendingHours < 4 ? C.amber : C.red;

  return (
    <div style={{
      background: design.card.bg,
      border: urgent ? `1px solid ${C.red}` : design.card.border,
      borderRadius: design.card.radius,
      padding: design.card.padding,
      marginBottom: S[3],
      position: 'relative',
      overflow: 'hidden',
      boxShadow: isAgentic && urgent ? `0 4px 16px ${C.red}20` : 'none',
    }}>
      {urgent && <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: isManual ? '1px' : '2px', backgroundColor: C.red }} />}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
        <span style={{
          fontFamily: design.typography.dataFont,
          fontSize: isManual ? '8px' : '9px',
          fontWeight: 700,
          letterSpacing: '0.06em',
          padding: '2px 6px',
          borderRadius: isAgentic ? '12px' : isManual ? '2px' : R.pill,
          backgroundColor: isManual ? 'transparent' : tc.bg,
          color: tc.color,
          border: isManual ? `1px solid ${tc.color}` : `1px solid ${tc.color}40`,
        }}>{type}</span>
        <span style={{
          marginLeft: 'auto',
          fontFamily: design.typography.dataFont,
          fontSize: isManual ? '9px' : '10px',
          fontWeight: 700,
          color: timeColor,
        }}>{pendingHours}h</span>
      </div>
      <div style={{
        fontFamily: design.typography.headingFont,
        fontSize: isManual ? '11px' : '13px',
        fontWeight: 700,
        color: C.textPrimary,
        marginBottom: '6px',
        lineHeight: 1.4,
      }}>{title}</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: S[3] }}>
        <AgentRoleIcon agentId={agentId} size={14} color={getAgent(agentId)?.color || C.textSecondary} />
        <span style={{ fontFamily: design.typography.bodyFont, fontSize: '11px', color: C.textSecondary }}>{agentName}</span>
        <span style={{
          marginLeft: 'auto',
          fontFamily: design.typography.dataFont,
          fontSize: '10px',
          fontWeight: 700,
          color: confidence >= 90 ? C.green : confidence >= 80 ? C.primary : C.amber,
        }}>{confidence}%</span>
      </div>
      <ModeButton variant="primary" onClick={onApprove} style={{ width: '100%', marginBottom: '6px' }}>
        {isManual ? '✓ APPROVE' : '✓ Approve'}
      </ModeButton>
      <ModeButton variant="secondary" onClick={onReview} style={{ width: '100%' }}>
        {isManual ? '⟳ REVIEW' : '⟳ Review'}
      </ModeButton>
    </div>
  );
}

// ── AGENTS DATA ──
const AGENT_LIST = [
  { id: 'freya', displayName: 'Freya', description: 'Orchestrator' },
  { id: 'strategist', displayName: 'Strategist', description: 'GTM Strategy' },
  { id: 'copywriter', displayName: 'Copywriter', description: 'Content & Copy' },
  { id: 'analyst', displayName: 'Analyst', description: 'Analytics & SEO' },
  { id: 'prospector', displayName: 'Prospector', description: 'Lead Research' },
  { id: 'optimizer', displayName: 'Optimizer', description: 'CRO & A/B Tests' },
  { id: 'outreach', displayName: 'Outreach', description: 'Sequences' },
  { id: 'revenue', displayName: 'Revenue', description: 'Pipeline & CS' },
  { id: 'guardian', displayName: 'Guardian', description: 'Compliance' },
];

const AGENT_MOCK_STATES = {
  freya: { status: 'idle', task: null },
  strategist: { status: 'done', task: null },
  copywriter: { status: 'executing', task: 'Drafting email variant 4 for Q2 Campaign' },
  analyst: { status: 'done', task: null },
  prospector: { status: 'idle', task: null },
  optimizer: { status: 'executing', task: 'Running A/B test (1,240 sessions, 68h left)' },
  outreach: { status: 'thinking', task: 'Building 47 MENA lead sequences...' },
  revenue: { status: 'done', task: null },
  guardian: { status: 'idle', task: null },
};

const APPROVALS = [
  { id: 1, type: 'CONTENT', title: 'Email #3: The Operating Table in Rafah', agentId: 'copywriter', agentName: 'Copywriter', confidence: 94, pendingHours: 2, urgent: false },
  { id: 2, type: 'OUTREACH', title: '47 MENA Lead Sequences', agentId: 'outreach', agentName: 'Outreach', confidence: 87, pendingHours: 1, urgent: false },
  { id: 3, type: 'STRATEGY', title: 'Q2 Donor ICP Update — MENA Healthcare', agentId: 'analyst', agentName: 'Analyst', confidence: 91, pendingHours: 3, urgent: false },
  { id: 4, type: 'CONTENT', title: 'Yemen Campaign LinkedIn Post', agentId: 'copywriter', agentName: 'Copywriter + Guardian', confidence: 89, pendingHours: 4, urgent: true },
  { id: 5, type: 'BUDGET', title: 'ANZ Retargeting Pause — $4,200 reallocate', agentId: 'optimizer', agentName: 'Optimizer', confidence: 78, pendingHours: 5, urgent: true },
];

// ── MAIN DASHBOARD ────────────────────────────
export default function DashboardOwner() {
  const nav = useNavigate();
  const toast = useToast();
  const design = useCommandModeDesign();
  const commandMode = useStore((s) => s.commandMode);
  const agentStatuses = useStore((s) => s.agents?.statuses || {});
  const activeWorkflow = useStore((s) => s.agents?.activeWorkflow || null);

  const [freyaInput, setFreyaInput] = useState('');
  const [approvals, setApprovals] = useState(APPROVALS);

  const isManual = design.id === 'manual';
  const isAgentic = design.id === 'fully_agentic';

  const handleAskFreya = () => {
    if (!freyaInput.trim()) return;
    toast.info(`Freya: analyzing "${freyaInput.slice(0, 50)}…"`);
    setFreyaInput('');
  };

  const handleApprove = (id, title) => {
    setApprovals((prev) => prev.filter((a) => a.id !== id));
    toast.success(`Approved: ${title}`);
  };

  const handleReview = (title) => {
    nav('/campaigns/approvals');
    toast.info(`Opening review for: ${title}`);
  };

  const handleBulkApproveSafe = () => {
    const safe = approvals.filter((a) => a.confidence >= 85);
    setApprovals((prev) => prev.filter((a) => a.confidence < 85));
    toast.success(`Approved ${safe.length} safe item${safe.length !== 1 ? 's' : ''}`);
  };

  const handleTriggerAgent = (agent) => {
    toast.info(`Activating ${agent.displayName}…`);
  };

  const modeSubtitle = {
    manual: 'Awaiting operator commands',
    semi_auto: '3 recommendations ready for review',
    fully_agentic: 'Operating autonomously — 6 tasks in progress',
  }[commandMode] || 'Ready';

  const accentColor = isAgentic ? C.green : isManual ? C.red : C.amber;

  return (
    <div style={{
      padding: design.layout.contentPadding,
      display: 'flex',
      flexDirection: 'column',
      gap: design.spacing.sectionGap,
      maxWidth: design.layout.maxWidth,
      margin: '0 auto',
      animation: isAgentic ? 'fadeInUp 0.3s ease' : 'none',
    }}>
      <style>{PULSE_CSS}</style>

      {/* ── HEADER ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: S[3] }}>
        <div>
          <h1 style={{
            fontFamily: design.typography.headingFont,
            fontSize: isManual ? '16px' : isAgentic ? '28px' : '24px',
            fontWeight: design.typography.headingWeight,
            letterSpacing: design.typography.headingLetterSpacing,
            textTransform: design.typography.headingTransform,
            color: C.textPrimary,
            margin: 0,
            lineHeight: 1.1,
          }}>
            {isManual ? 'COMMAND CENTER' : 'Command Center'}
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
            <span style={{
              fontFamily: isManual ? design.typography.dataFont : design.typography.bodyFont,
              fontSize: isManual ? '10px' : '12px',
              color: C.textMuted,
            }}>Thu, Apr 2, 2026</span>
            <ModeBadge color={isAgentic ? 'success' : isManual ? 'error' : 'warning'}>MEDGLOBAL</ModeBadge>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: S[3] }}>
          <CommandModeToggle size="sm" showLabels={true} />
          <ModeButton variant="primary" onClick={() => nav('/campaigns/new')}>
            {isManual ? '+ NEW' : '+ New Campaign'}
          </ModeButton>
        </div>
      </div>

      {/* ── KPI ROW ── */}
      <div style={{ display: 'flex', gap: design.spacing.itemGap, flexWrap: 'wrap' }}>
        <KPICard design={design} label="Pipeline Value" value="$2.4M" change="+18%" sub="vs last month" spark={[12,18,15,22,19,28,24]} accent={accentColor} />
        <KPICard design={design} label="Leads This Week" value="247" change="+34" sub="new today" spark={[40,55,45,62,58,71,68]} accent="#6BA396" />
        <KPICard design={design} label="Active Campaigns" value="8" sub="3 launching soon" spark={[5,6,7,7,8,8,8]} accent={C.amber} />
        <KPICard design={design} label="Tasks Done Today" value="142" sub="across 9 agents" spark={[80,95,110,98,125,138,142]} accent={C.green} />
      </div>

      {/* ── MAIN 3-COLUMN GRID ── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: isManual ? '240px 1fr 260px' : '260px 1fr 280px',
        gap: design.spacing.sectionGap,
        alignItems: 'start',
      }}>

        {/* ══ COL 1: MISSION CONTROL SIDEBAR ══ */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: design.spacing.itemGap }}>

          {/* Agent Fleet */}
          <ModeCard title={isManual ? 'AGENT FLEET' : 'Agent Fleet'} headerRight={
            <button onClick={() => nav('/agents')} style={{
              fontFamily: design.typography.bodyFont,
              fontSize: '10px',
              color: accentColor,
              background: 'none',
              border: 'none',
              cursor: 'pointer',
            }}>View all →</button>
          }>
            {AGENT_LIST.map((agent) => {
              const storeStatus = agentStatuses[agent.id] || {};
              const mockState = AGENT_MOCK_STATES[agent.id] || {};
              const status = storeStatus.status || mockState.status || 'idle';
              const currentTask = storeStatus.currentTask || mockState.task || null;
              return (
                <AgentRow
                  key={agent.id}
                  agent={agent}
                  status={status}
                  currentTask={currentTask}
                  onTrigger={() => handleTriggerAgent(agent)}
                  design={design}
                />
              );
            })}
          </ModeCard>

          {/* System Health */}
          <ModeCard title={isManual ? 'SYSTEM HEALTH' : 'System Health'}>
            <ModeProgress value={94} label="Brand Memory" color={C.green} size="sm" />
            <ModeProgress value={87} label="Audience Memory" color={accentColor} size="sm" />
            <ModeProgress value={91} label="Campaign Memory" color={accentColor} size="sm" />
            <div style={{ borderTop: `1px solid ${C.border}`, marginTop: S[3], paddingTop: S[3] }}>
              <ModeProgress value={72.4} max={100} label="Credits" showValue />
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontFamily: design.typography.dataFont,
                fontSize: '10px',
                color: C.textMuted,
                marginTop: S[2],
              }}>
                <span>10,860 / 15,000</span>
                <span>Last sync: 4m ago</span>
              </div>
            </div>
          </ModeCard>
        </div>

        {/* ══ COL 2: MAIN COMMAND AREA ══ */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: design.spacing.sectionGap }}>

          {/* Freya Situation Report */}
          <ModeCard
            title={isManual ? 'FREYA · SITREP' : 'Freya · Situation Report'}
            subtitle={modeSubtitle}
            icon={<FreyaLogo size={20} accentColor={accentColor} />}
          >
            <div style={{ display: 'flex', gap: S[3], flexWrap: 'wrap', marginBottom: S[4] }}>
              <IntelCard design={design} severity="green" agentId="copywriter" finding="↑ Donor Acquisition Q2 pacing +12%" recommendation="Copywriter drafted 3 variants overnight." actionLabel={isManual ? 'REVIEW →' : 'Review Content →'} onAction={() => nav('/campaigns/approvals')} />
              <IntelCard design={design} severity="amber" agentId="prospector" finding="47 new MENA leads in ICP queue" recommendation="Prospector ready to enrich. 12 in active research." actionLabel={isManual ? 'RUN →' : 'Run Prospector →'} onAction={() => toast.info('Activating Prospector…')} />
              <IntelCard design={design} severity="red" agentId="revenue" finding="2 at-risk accounts (Sudan, Gaza)" recommendation="Revenue flagged churn risk >65%." actionLabel={isManual ? 'VIEW →' : 'View Accounts →'} onAction={() => nav('/customer-success')} />
            </div>

            <div style={{ display: 'flex', gap: S[2] }}>
              <ModeInput
                value={freyaInput}
                onChange={(e) => setFreyaInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAskFreya()}
                placeholder={isManual ? 'Enter command...' : 'Ask Freya anything about your GTM status…'}
                style={{ flex: 1 }}
              />
              <ModeButton variant="primary" onClick={handleAskFreya}>
                {isManual ? 'EXEC' : 'Ask Freya'}
              </ModeButton>
            </div>
          </ModeCard>

          {/* Live Agent Activity */}
          <ModeCard
            title={isManual ? 'AGENT ACTIVITY' : 'Agent Activity'}
            headerRight={
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ModeStatusDot status="active" pulse />
                <span style={{
                  fontFamily: design.typography.dataFont,
                  fontSize: '10px',
                  fontWeight: 700,
                  color: C.green,
                }}>LIVE</span>
              </div>
            }
          >
            <LiveFeedItem design={design} agentId="copywriter" agent="Copywriter" desc="Drafting email variant 4 for Q2 Donor Campaign" status="running" actionLabel={null} onAction={() => {}} />
            <LiveFeedItem design={design} agentId="analyst" agent="Analyst" desc="CTR anomaly detected on ANZ ads — report ready" status="done" actionLabel={isManual ? 'VIEW' : 'View Report'} onAction={() => nav('/analytics')} />
            <LiveFeedItem design={design} agentId="outreach" agent="Outreach" desc="47 lead sequences queued, waiting approval" status="needs_approval" actionLabel={isManual ? 'REVIEW' : 'Review Sequences'} onAction={() => nav('/campaigns/approvals')} />
            <LiveFeedItem design={design} agentId="optimizer" agent="Optimizer" desc="A/B test running: donation landing page CTA" status="running" actionLabel={null} onAction={() => {}} />
            <LiveFeedItem design={design} agentId="revenue" agent="Revenue" desc="Q2 forecast updated: $1.8M → $2.1M pipeline" status="done" actionLabel={isManual ? 'VIEW' : 'View Forecast'} onAction={() => nav('/forecast')} />
          </ModeCard>
        </div>

        {/* ══ COL 3: APPROVAL QUEUE ══ */}
        <ModeCard
          title={isManual ? 'APPROVALS' : 'Approvals'}
          headerRight={approvals.length > 0 && (
            <ModeBadge color="error">{approvals.length}</ModeBadge>
          )}
        >
          {approvals.some((a) => a.confidence >= 85) && (
            <ModeButton
              variant="secondary"
              onClick={handleBulkApproveSafe}
              style={{ width: '100%', marginBottom: S[4] }}
            >
              {isManual ? '✓ APPROVE SAFE (≥85%)' : '✓ Approve All Safe (≥85%)'}
            </ModeButton>
          )}

          {approvals.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: `${S[8]} 0`,
              color: C.textMuted,
              fontFamily: design.typography.bodyFont,
              fontSize: '13px',
            }}>
              <div style={{ fontSize: '24px', marginBottom: S[2] }}>✓</div>
              {isManual ? 'QUEUE EMPTY' : 'All clear — no pending approvals'}
            </div>
          ) : (
            approvals.map((item) => (
              <ApprovalQueueCard
                key={item.id}
                design={design}
                type={item.type}
                title={item.title}
                agentId={item.agentId}
                agentName={item.agentName}
                confidence={item.confidence}
                pendingHours={item.pendingHours}
                urgent={item.urgent}
                onApprove={() => handleApprove(item.id, item.title)}
                onReview={() => handleReview(item.title)}
              />
            ))
          )}

          <ModeButton
            variant="ghost"
            onClick={() => nav('/campaigns/approvals')}
            style={{ width: '100%', marginTop: S[2] }}
          >
            {isManual ? 'VIEW ALL →' : 'View all approvals →'}
          </ModeButton>
        </ModeCard>
      </div>
    </div>
  );
}
