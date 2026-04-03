import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useStore from '../../store/useStore';
import useToast from '../../hooks/useToast';
import { C, F, R, S, T, shadows, scrollbarStyle } from '../../tokens';
import CommandModeToggle from '../../components/ui/CommandModeToggle';
import AgentRoleIcon from '../../components/ui/AgentRoleIcon';
import FreyaLogo from '../../components/ui/FreyaLogo';
import { getAgent } from '../../agents/AgentRegistry';

// ── Pulse animation keyframes injected once ───
const PULSE_CSS = `
@keyframes pulse2s { 0%,100%{opacity:1} 50%{opacity:0.4} }
@keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
@keyframes fadeInUp { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
`;

// ── Sparkline ─────────────────────────────────
function Sparkline({ data, color }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const w = 64; const h = 24;
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / range) * h}`).join(' ');
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} fill="none">
      <polyline points={pts} stroke={color || C.primary} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" opacity="0.85" />
    </svg>
  );
}

// ── KPI Card ──────────────────────────────────
function KPICard({ label, value, change, sub, spark, accent }) {
  const up = change?.startsWith('+');
  return (
    <div style={{ backgroundColor: C.surface, border: `1px solid ${C.border}`, borderRadius: R.card, padding: S[5], position: 'relative', overflow: 'hidden', flex: 1, minWidth: '160px' }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', backgroundColor: accent || C.primary }} />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ fontFamily: F.body, fontSize: '11px', fontWeight: 600, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: S[2] }}>{label}</div>
          <div style={{ fontFamily: F.display, fontSize: '26px', fontWeight: 700, color: C.textPrimary, lineHeight: 1 }}>{value}</div>
          {change && (
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', marginTop: S[2], fontFamily: F.body, fontSize: '11px', fontWeight: 600, color: up ? C.green : C.red }}>
              {up ? '↑' : '↓'}{change}
            </div>
          )}
          {sub && <div style={{ fontFamily: F.body, fontSize: '11px', color: C.textMuted, marginTop: '2px' }}>{sub}</div>}
        </div>
        {spark && <Sparkline data={spark} color={accent || C.primary} />}
      </div>
    </div>
  );
}

// ── Agent status dot color ─────────────────────
function agentDotColor(status) {
  if (status === 'thinking')  return C.amber;
  if (status === 'executing') return C.primary;
  if (status === 'done')      return C.green;
  if (status === 'error')     return C.red;
  return C.textMuted;
}

// ── Agent Fleet Row ───────────────────────────
function AgentRow({ agent, status, currentTask, onTrigger }) {
  const dotColor = agentDotColor(status);
  const isActive = status === 'thinking' || status === 'executing';
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 0', borderBottom: `1px solid ${C.border}` }}>
      {/* Avatar */}
      <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: 'rgba(74,124,111,0.18)', border: `1.5px solid ${dotColor}`, display: 'flex', alignItems: 'center', justifyContent: 'center', lineHeight: 0, flexShrink: 0, position: 'relative' }}>
        <AgentRoleIcon agentId={agent.id} size={14} color={getAgent(agent.id)?.color || C.primary} />
        {/* Pulsing ring when active */}
        {isActive && (
          <div style={{ position: 'absolute', inset: '-3px', borderRadius: '50%', border: `1.5px solid ${dotColor}`, animation: 'pulse2s 1.5s infinite', opacity: 0.5 }} />
        )}
      </div>
      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: F.body, fontSize: '12px', fontWeight: 700, color: C.textPrimary, lineHeight: 1.2 }}>{agent.displayName}</div>
        {isActive && currentTask ? (
          <div style={{ fontFamily: F.body, fontSize: '11px', color: C.amber, marginTop: '1px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{currentTask}</div>
        ) : (
          <div style={{ fontFamily: F.body, fontSize: '11px', color: C.textMuted, marginTop: '1px' }}>{status || 'idle'}</div>
        )}
      </div>
      {/* Trigger button */}
      <button
        onClick={onTrigger}
        style={{ padding: '3px 8px', fontFamily: F.body, fontSize: '10px', fontWeight: 600, color: C.primary, backgroundColor: 'rgba(74,124,111,0.12)', border: `1px solid rgba(74,124,111,0.3)`, borderRadius: R.button, cursor: 'pointer', flexShrink: 0, transition: T.color }}
      >
        ▶ Run
      </button>
    </div>
  );
}

// ── Situation Intelligence Card ───────────────
function IntelCard({ severity, agentId, finding, recommendation, actionLabel, onAction }) {
  const borderColor = severity === 'green' ? C.green : severity === 'amber' ? C.amber : C.red;
  const bgColor = severity === 'green' ? 'rgba(16,185,129,0.08)' : severity === 'amber' ? 'rgba(251,191,36,0.08)' : 'rgba(239,68,68,0.08)';
  return (
    <div style={{ flex: '1 1 260px', minWidth: '240px', backgroundColor: bgColor, border: `1px solid ${borderColor}`, borderLeft: `3px solid ${borderColor}`, borderRadius: R.md, padding: S[4], display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <AgentRoleIcon agentId={agentId} size={18} color={getAgent(agentId)?.color || C.primary} />
        <div style={{ fontFamily: F.body, fontSize: '12px', fontWeight: 700, color: C.textPrimary, lineHeight: 1.3 }}>{finding}</div>
      </div>
      <div style={{ fontFamily: F.body, fontSize: '11px', color: C.textSecondary, lineHeight: 1.5 }}>{recommendation}</div>
      <button
        onClick={onAction}
        style={{ alignSelf: 'flex-start', padding: '4px 10px', fontFamily: F.body, fontSize: '11px', fontWeight: 600, color: borderColor, backgroundColor: 'transparent', border: `1px solid ${borderColor}`, borderRadius: R.button, cursor: 'pointer', marginTop: 'auto', transition: T.color }}
      >
        {actionLabel}
      </button>
    </div>
  );
}

// ── Live Feed Item ────────────────────────────
function LiveFeedItem({ agentId, agent, desc, status, actionLabel, onAction }) {
  // status: 'running' | 'done' | 'needs_approval' | 'urgent'
  const statusConfig = {
    running:        { color: C.amber, label: 'Running…', showSpinner: true },
    done:           { color: C.green, label: null, showSpinner: false },
    needs_approval: { color: C.amber, label: null, showSpinner: false },
    urgent:         { color: C.red,   label: null, showSpinner: false },
  };
  const sc = statusConfig[status] || statusConfig.running;

  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', padding: `${S[3]} 0`, borderBottom: `1px solid ${C.border}` }}>
      <div style={{ width: '30px', height: '30px', borderRadius: R.md, backgroundColor: 'rgba(74,124,111,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', lineHeight: 0, flexShrink: 0 }}><AgentRoleIcon agentId={agentId} size={16} color={getAgent(agentId)?.color || C.secondary} /></div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
          <span style={{ fontFamily: F.body, fontSize: '12px', fontWeight: 700, color: C.secondary }}>{agent}</span>
          {sc.showSpinner && (
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', border: `2px solid ${C.amber}`, borderTopColor: 'transparent', animation: 'spin 0.8s linear infinite', flexShrink: 0 }} />
          )}
          {sc.label && <span style={{ fontFamily: F.mono, fontSize: '10px', color: sc.color }}>{sc.label}</span>}
        </div>
        <div style={{ fontFamily: F.body, fontSize: '12px', color: C.textSecondary, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{desc}</div>
      </div>
      {actionLabel && (
        <button
          onClick={onAction}
          style={{ padding: '3px 10px', fontFamily: F.body, fontSize: '11px', fontWeight: 600, color: sc.color, backgroundColor: 'transparent', border: `1px solid ${sc.color}`, borderRadius: R.button, cursor: 'pointer', flexShrink: 0, whiteSpace: 'nowrap', transition: T.color }}
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}

// ── Campaign Pulse Card ───────────────────────
function CampaignPulseCard({ name, status, spend, leads, agent, pacing, onView }) {
  const statusColor = status === 'active' ? C.green : status === 'paused' ? C.amber : C.textMuted;
  const pacingColor = pacing === 'ahead' ? C.green : pacing === 'behind' ? C.red : C.amber;
  return (
    <div style={{ backgroundColor: C.surface2, border: `1px solid ${C.border}`, borderRadius: R.md, padding: S[4], display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ fontFamily: F.display, fontSize: '13px', fontWeight: 700, color: C.textPrimary, lineHeight: 1.3, flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{name}</div>
        <span style={{ fontFamily: F.mono, fontSize: '9px', fontWeight: 700, color: statusColor, backgroundColor: `${statusColor}20`, border: `1px solid ${statusColor}40`, borderRadius: R.pill, padding: '2px 6px', marginLeft: '8px', flexShrink: 0, textTransform: 'uppercase' }}>{status}</span>
      </div>
      <div style={{ display: 'flex', gap: S[4] }}>
        <div>
          <div style={{ fontFamily: F.mono, fontSize: '13px', fontWeight: 700, color: C.textPrimary }}>{spend}</div>
          <div style={{ fontFamily: F.body, fontSize: '10px', color: C.textMuted }}>Spend</div>
        </div>
        <div>
          <div style={{ fontFamily: F.mono, fontSize: '13px', fontWeight: 700, color: C.textPrimary }}>{leads}</div>
          <div style={{ fontFamily: F.body, fontSize: '10px', color: C.textMuted }}>Leads</div>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ fontFamily: F.body, fontSize: '10px', color: C.textMuted }}>{agent}</div>
        <span style={{ fontFamily: F.mono, fontSize: '9px', fontWeight: 700, color: pacingColor, backgroundColor: `${pacingColor}18`, border: `1px solid ${pacingColor}30`, borderRadius: R.pill, padding: '2px 6px', textTransform: 'uppercase' }}>{pacing}</span>
      </div>
      <button onClick={onView} style={{ width: '100%', padding: '5px 0', fontFamily: F.body, fontSize: '11px', fontWeight: 600, color: C.primary, backgroundColor: 'transparent', border: `1px solid ${C.border}`, borderRadius: R.button, cursor: 'pointer' }}>View →</button>
    </div>
  );
}

// ── Approval Queue Card ───────────────────────
const TYPE_COLORS = {
  CONTENT:  { color: '#6BA396', bg: 'rgba(107,163,150,0.12)' },
  STRATEGY: { color: C.primary, bg: 'rgba(74,124,111,0.12)' },
  OUTREACH: { color: '#8B9E98', bg: 'rgba(139,158,152,0.12)' },
  BUDGET:   { color: C.amber,   bg: 'rgba(251,191,36,0.12)' },
  ICP:      { color: C.secondary, bg: 'rgba(107,163,150,0.12)' },
};

function pendingTimeColor(hours) {
  if (hours < 1) return C.green;
  if (hours < 4) return C.amber;
  return C.red;
}

function ApprovalQueueCard({ type, title, agentId, agentName, confidence, pendingHours, onApprove, onReview, urgent }) {
  const tc = TYPE_COLORS[type] || TYPE_COLORS.CONTENT;
  const timeColor = pendingTimeColor(pendingHours);
  return (
    <div style={{ backgroundColor: C.surface2, border: `1px solid ${urgent ? C.red : C.border}`, borderRadius: R.md, padding: S[4], marginBottom: S[3], position: 'relative', overflow: 'hidden' }}>
      {urgent && <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', backgroundColor: C.red }} />}
      {/* Type badge */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
        <span style={{ fontFamily: F.mono, fontSize: '9px', fontWeight: 700, letterSpacing: '0.06em', padding: '2px 6px', borderRadius: R.pill, backgroundColor: tc.bg, color: tc.color, border: `1px solid ${tc.color}40` }}>{type}</span>
        <span style={{ marginLeft: 'auto', fontFamily: F.mono, fontSize: '10px', fontWeight: 700, color: timeColor }}>{pendingHours}h ago</span>
      </div>
      {/* Title */}
      <div style={{ fontFamily: F.display, fontSize: '13px', fontWeight: 700, color: C.textPrimary, marginBottom: '6px', lineHeight: 1.4 }}>{title}</div>
      {/* Agent + confidence */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: S[3] }}>
        <AgentRoleIcon agentId={agentId} size={14} color={getAgent(agentId)?.color || C.textSecondary} />
        <span style={{ fontFamily: F.body, fontSize: '11px', color: C.textSecondary }}>{agentName}</span>
        <span style={{ marginLeft: 'auto', fontFamily: F.mono, fontSize: '10px', fontWeight: 700, color: confidence >= 90 ? C.green : confidence >= 80 ? C.primary : C.amber }}>{confidence}% conf.</span>
      </div>
      {/* Buttons */}
      <button
        onClick={onApprove}
        style={{ width: '100%', padding: '7px 0', borderRadius: R.button, border: 'none', backgroundColor: C.primary, color: '#FAF8F3', fontFamily: F.body, fontSize: '12px', fontWeight: 700, cursor: 'pointer', marginBottom: '6px' }}
      >
        ✓ Approve
      </button>
      <button
        onClick={onReview}
        style={{ width: '100%', padding: '6px 0', borderRadius: R.button, border: `1px solid ${C.border}`, backgroundColor: 'transparent', color: C.textMuted, fontFamily: F.body, fontSize: '12px', cursor: 'pointer' }}
      >
        ⟳ Review
      </button>
    </div>
  );
}

// ── Health Bar ────────────────────────────────
function HealthBar({ label, pct, color }) {
  return (
    <div style={{ marginBottom: '8px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
        <span style={{ fontFamily: F.body, fontSize: '11px', color: C.textSecondary }}>{label}</span>
        <span style={{ fontFamily: F.mono, fontSize: '10px', fontWeight: 700, color: color || C.primary }}>{pct}%</span>
      </div>
      <div style={{ height: '4px', backgroundColor: C.surface3, borderRadius: R.pill, overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${pct}%`, backgroundColor: color || C.primary, borderRadius: R.pill, transition: T.slow }} />
      </div>
    </div>
  );
}

// ── Section Label ─────────────────────────────
function SectionLabel({ children }) {
  return (
    <div style={{ fontFamily: F.body, fontSize: '10px', fontWeight: 700, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: S[3], marginTop: S[4] }}>
      {children}
    </div>
  );
}

// ── AGENTS DATA (local mock matching AgentRegistry) ──
const AGENT_LIST = [
  { id: 'freya',      displayName: 'Freya',      description: 'Orchestrator' },
  { id: 'strategist', displayName: 'Strategist', description: 'GTM Strategy' },
  { id: 'copywriter', displayName: 'Copywriter', description: 'Content & Copy' },
  { id: 'analyst',    displayName: 'Analyst',    description: 'Analytics & SEO' },
  { id: 'prospector', displayName: 'Prospector', description: 'Lead Research' },
  { id: 'optimizer',  displayName: 'Optimizer',  description: 'CRO & A/B Tests' },
  { id: 'outreach',   displayName: 'Outreach',   description: 'Sequences' },
  { id: 'revenue',    displayName: 'Revenue',    description: 'Pipeline & CS' },
  { id: 'guardian',   displayName: 'Guardian',   description: 'Compliance' },
];

// Hardcoded mock agent activity states
const AGENT_MOCK_STATES = {
  freya:      { status: 'idle',      task: null },
  strategist: { status: 'done',      task: null },
  copywriter: { status: 'executing', task: 'Drafting email variant 4 for Q2 Campaign' },
  analyst:    { status: 'done',      task: null },
  prospector: { status: 'idle',      task: null },
  optimizer:  { status: 'executing', task: 'Running A/B test (1,240 sessions, 68h left)' },
  outreach:   { status: 'thinking',  task: 'Building 47 MENA lead sequences...' },
  revenue:    { status: 'done',      task: null },
  guardian:   { status: 'idle',      task: null },
};

// ── APPROVAL DATA ─────────────────────────────
const APPROVALS = [
  { id: 1, type: 'CONTENT',  title: 'Email #3: The Operating Table in Rafah', agentId: 'copywriter', agentName: 'Copywriter',          confidence: 94, pendingHours: 2, urgent: false },
  { id: 2, type: 'OUTREACH', title: '47 MENA Lead Sequences',                  agentId: 'outreach', agentName: 'Outreach',             confidence: 87, pendingHours: 1, urgent: false },
  { id: 3, type: 'STRATEGY', title: 'Q2 Donor ICP Update — MENA Healthcare',   agentId: 'analyst', agentName: 'Analyst',              confidence: 91, pendingHours: 3, urgent: false },
  { id: 4, type: 'CONTENT',  title: 'Yemen Campaign LinkedIn Post',             agentId: 'copywriter', agentName: 'Copywriter + Guardian', confidence: 89, pendingHours: 4, urgent: true },
  { id: 5, type: 'BUDGET',   title: 'ANZ Retargeting Pause — $4,200 reallocate', agentId: 'optimizer', agentName: 'Optimizer',          confidence: 78, pendingHours: 5, urgent: true },
];

// ── MAIN DASHBOARD ────────────────────────────
export default function DashboardOwner() {
  const nav = useNavigate();
  const toast = useToast();
  const commandMode = useStore((s) => s.commandMode);
  const agentStatuses = useStore((s) => s.agents?.statuses || {});
  const activeWorkflow = useStore((s) => s.agents?.activeWorkflow || null);

  const [freyaInput, setFreyaInput] = useState('');
  const [approvals, setApprovals] = useState(APPROVALS);

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
    toast.success(`Approved ${safe.length} safe item${safe.length !== 1 ? 's' : ''} (confidence ≥ 85%)`);
  };

  const handleTriggerAgent = (agent) => {
    toast.info(`Activating ${agent.displayName}…`);
  };

  // Mode-aware subtitle
  const modeSubtitle = {
    manual:        'Waiting for your instructions',
    semi_auto:     '3 recommendations ready for your review',
    fully_agentic: 'Operating autonomously — 6 tasks in progress',
  }[commandMode] || 'Ready';

  return (
    <div style={{ padding: S[6], display: 'flex', flexDirection: 'column', gap: S[5], maxWidth: '1600px', margin: '0 auto', animation: 'fadeInUp 0.3s ease' }}>
      <style>{PULSE_CSS}</style>

      {/* ── HEADER ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: S[3] }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: S[4] }}>
          <div>
            <h1 style={{ fontFamily: F.display, fontSize: '24px', fontWeight: 700, color: C.textPrimary, margin: 0, lineHeight: 1.1 }}>Command Center</h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
              <span style={{ fontFamily: F.body, fontSize: '12px', color: C.textMuted }}>Thu, Apr 2, 2026</span>
              <span style={{ fontFamily: F.mono, fontSize: '10px', fontWeight: 700, padding: '2px 8px', borderRadius: R.pill, backgroundColor: 'rgba(74,124,111,0.15)', color: C.primary, border: `1px solid rgba(74,124,111,0.3)` }}>MEDGLOBAL</span>
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: S[3] }}>
          <CommandModeToggle size="sm" showLabels={true} />
          <button onClick={() => nav('/campaigns/new')} style={{ padding: '8px 16px', borderRadius: R.button, backgroundColor: C.primary, border: 'none', color: '#FAF8F3', fontFamily: F.body, fontSize: '13px', fontWeight: 700, cursor: 'pointer' }}>
            + New Campaign
          </button>
        </div>
      </div>

      {/* ── KPI ROW ── */}
      <div style={{ display: 'flex', gap: S[4], flexWrap: 'wrap' }}>
        <KPICard label="Pipeline Value"   value="$2.4M"  change="+18%"  sub="vs last month"         spark={[12,18,15,22,19,28,24]}   accent={C.primary} />
        <KPICard label="Leads This Week"  value="247"    change="+34"   sub="new today"              spark={[40,55,45,62,58,71,68]}   accent="#6BA396" />
        <KPICard label="Active Campaigns" value="8"      sub="3 launching soon"                      spark={[5,6,7,7,8,8,8]}          accent="#FBBF24" />
        <KPICard label="Tasks Done Today" value="142"    sub="across 9 agents"                       spark={[80,95,110,98,125,138,142]} accent={C.green} />
      </div>

      {/* ── MAIN 3-COLUMN GRID ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr 280px', gap: S[5], alignItems: 'start' }}>

        {/* ══ COL 1: MISSION CONTROL SIDEBAR ══ */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>

          {/* Agent Fleet */}
          <div style={{ backgroundColor: C.surface, border: `1px solid ${C.border}`, borderRadius: R.card, padding: S[4], marginBottom: S[4] }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: S[3] }}>
              <div style={{ fontFamily: F.display, fontSize: '13px', fontWeight: 700, color: C.textPrimary }}>Agent Fleet</div>
              <button onClick={() => nav('/agents')} style={{ fontFamily: F.body, fontSize: '10px', color: C.primary, background: 'none', border: 'none', cursor: 'pointer' }}>View all →</button>
            </div>
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
                />
              );
            })}
          </div>

          {/* Active Workflows */}
          <div style={{ backgroundColor: C.surface, border: `1px solid ${C.border}`, borderRadius: R.card, padding: S[4], marginBottom: S[4] }}>
            <div style={{ fontFamily: F.display, fontSize: '13px', fontWeight: 700, color: C.textPrimary, marginBottom: S[3] }}>Active Workflows</div>
            {activeWorkflow ? (
              <div style={{ backgroundColor: C.surface2, borderRadius: R.md, padding: S[3] }}>
                <div style={{ fontFamily: F.body, fontSize: '12px', fontWeight: 700, color: C.primary, marginBottom: '4px' }}>{activeWorkflow}</div>
                <div style={{ fontFamily: F.body, fontSize: '11px', color: C.textMuted, marginBottom: S[2] }}>Step 2 / 4</div>
                <button onClick={() => toast.info('Workflow paused')} style={{ width: '100%', padding: '5px 0', fontFamily: F.body, fontSize: '11px', color: C.amber, backgroundColor: C.amberDim, border: `1px solid ${C.amber}40`, borderRadius: R.button, cursor: 'pointer' }}>Pause</button>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: `${S[3]} 0` }}>
                <div style={{ fontFamily: F.body, fontSize: '12px', color: C.textMuted, marginBottom: S[2] }}>No workflow running</div>
                <button onClick={() => nav('/aria/workflows')} style={{ fontFamily: F.body, fontSize: '11px', color: C.primary, background: 'none', border: 'none', cursor: 'pointer' }}>Start a workflow →</button>
              </div>
            )}
          </div>

          {/* System Health */}
          <div style={{ backgroundColor: C.surface, border: `1px solid ${C.border}`, borderRadius: R.card, padding: S[4] }}>
            <div style={{ fontFamily: F.display, fontSize: '13px', fontWeight: 700, color: C.textPrimary, marginBottom: S[3] }}>System Health</div>
            <HealthBar label="Brand Memory"    pct={94} color={C.green} />
            <HealthBar label="Audience Memory" pct={87} color={C.primary} />
            <HealthBar label="Campaign Memory" pct={91} color={C.primary} />
            <div style={{ borderTop: `1px solid ${C.border}`, marginTop: S[3], paddingTop: S[3] }}>
              {/* Credits */}
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ fontFamily: F.body, fontSize: '11px', color: C.textSecondary }}>Credits</span>
                <span style={{ fontFamily: F.mono, fontSize: '10px', fontWeight: 700, color: C.primary }}>10,860 / 15,000</span>
              </div>
              <div style={{ height: '4px', backgroundColor: C.surface3, borderRadius: R.pill, marginBottom: S[3] }}>
                <div style={{ height: '100%', width: `${(10860/15000)*100}%`, backgroundColor: C.primary, borderRadius: R.pill }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontFamily: F.body, fontSize: '11px', color: C.textMuted }}>Last sync</span>
                <span style={{ fontFamily: F.mono, fontSize: '10px', color: C.textMuted }}>4m ago</span>
              </div>
            </div>
          </div>
        </div>

        {/* ══ COL 2: MAIN COMMAND AREA ══ */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: S[5] }}>

          {/* Freya Situation Report */}
          <div style={{ background: `linear-gradient(135deg, ${C.surface} 0%, ${C.surface2} 100%)`, border: `1px solid ${C.border}`, borderRadius: R.card, padding: S[5], boxShadow: shadows.card }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: S[4] }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: S[3] }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'rgba(74,124,111,0.2)', border: `1.5px solid ${C.primary}`, display: 'flex', alignItems: 'center', justifyContent: 'center', lineHeight: 0 }}><FreyaLogo size={18} color={C.primary} /></div>
                <div>
                  <div style={{ fontFamily: F.display, fontSize: '15px', fontWeight: 700, color: C.textPrimary }}>Freya · Situation Report</div>
                  <div style={{ fontFamily: F.body, fontSize: '11px', color: C.primary, marginTop: '2px' }}>{modeSubtitle}</div>
                </div>
              </div>
              <div style={{ fontFamily: F.mono, fontSize: '10px', color: C.textMuted }}>Updated 7m ago</div>
            </div>

            {/* Intel cards */}
            <div style={{ display: 'flex', gap: S[3], flexWrap: 'wrap', marginBottom: S[4] }}>
              <IntelCard
                severity="green"
                agentId="copywriter"
                finding="↑ Donor Acquisition Q2 pacing +12%"
                recommendation="Copywriter drafted 3 variants overnight. Recommend approving for Thursday send."
                actionLabel="Review Content →"
                onAction={() => nav('/campaigns/approvals')}
              />
              <IntelCard
                severity="amber"
                agentId="prospector"
                finding="47 new MENA leads in ICP queue"
                recommendation="Prospector ready to enrich. 12 in active research phase — sequence now for best response."
                actionLabel="Run Prospector →"
                onAction={() => { toast.info('Activating Prospector…'); }}
              />
              <IntelCard
                severity="red"
                agentId="revenue"
                finding="2 at-risk accounts (Sudan, Gaza)"
                recommendation="Revenue flagged churn risk >65%. Intervention recommended within 48h."
                actionLabel="View Accounts →"
                onAction={() => nav('/customer-success')}
              />
            </div>

            {/* Ask Freya input */}
            <div style={{ display: 'flex', gap: S[2] }}>
              <input
                value={freyaInput}
                onChange={(e) => setFreyaInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAskFreya()}
                placeholder="Ask Freya anything about your GTM status…"
                style={{ flex: 1, padding: '9px 14px', borderRadius: R.input, border: `1px solid ${C.border}`, backgroundColor: C.bg, color: C.textPrimary, fontFamily: F.body, fontSize: '13px', outline: 'none' }}
              />
              <button
                onClick={handleAskFreya}
                style={{ padding: '9px 18px', borderRadius: R.button, backgroundColor: C.primary, border: 'none', color: '#FAF8F3', fontFamily: F.body, fontSize: '13px', fontWeight: 700, cursor: 'pointer' }}
              >
                Ask Freya
              </button>
            </div>
          </div>

          {/* Live Agent Activity */}
          <div style={{ backgroundColor: C.surface, border: `1px solid ${C.border}`, borderRadius: R.card, padding: S[5] }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: S[4] }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: S[2] }}>
                <div style={{ fontFamily: F.display, fontSize: '14px', fontWeight: 700, color: C.textPrimary }}>Agent Activity</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <div style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: C.green, animation: 'pulse2s 2s infinite' }} />
                  <span style={{ fontFamily: F.mono, fontSize: '10px', color: C.green, fontWeight: 700 }}>LIVE</span>
                </div>
              </div>
              <button onClick={() => nav('/agents')} style={{ fontFamily: F.body, fontSize: '11px', color: C.primary, background: 'none', border: 'none', cursor: 'pointer' }}>View all →</button>
            </div>

            <LiveFeedItem agentId="copywriter" agent="Copywriter"  desc="Drafting email variant 4 for Q2 Donor Campaign"                            status="running"        actionLabel={null}             onAction={() => {}} />
            <LiveFeedItem agentId="analyst" agent="Analyst"     desc="CTR anomaly detected on ANZ ads — report ready"                            status="done"           actionLabel="View Report"      onAction={() => nav('/analytics')} />
            <LiveFeedItem agentId="outreach" agent="Outreach"    desc="47 lead sequences queued, waiting approval"                                 status="needs_approval" actionLabel="Review Sequences" onAction={() => nav('/campaigns/approvals')} />
            <LiveFeedItem agentId="optimizer" agent="Optimizer"   desc="A/B test running: donation landing page CTA (n=1,240, 68h remaining)"       status="running"        actionLabel={null}             onAction={() => {}} />
            <LiveFeedItem agentId="revenue" agent="Revenue"     desc="Q2 forecast updated: $1.8M → $2.1M pipeline"                               status="done"           actionLabel="View Forecast"    onAction={() => nav('/forecast')} />
            <LiveFeedItem agentId="guardian" agent="Guardian"    desc="3 content pieces need compliance review"                                    status="urgent"         actionLabel="Review Now"       onAction={() => nav('/campaigns/approvals')} />
          </div>

          {/* Campaign Pulse */}
          <div>
            <div style={{ fontFamily: F.display, fontSize: '14px', fontWeight: 700, color: C.textPrimary, marginBottom: S[3] }}>Campaign Pulse</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: S[3] }}>
              <CampaignPulseCard name="Donor Acquisition Q2" status="active" spend="$22,400" leads="124" agent="Copywriter" pacing="ahead"  onView={() => nav('/campaigns/1')} />
              <CampaignPulseCard name="MENA Healthcare Push"  status="active" spend="$14,100" leads="83"  agent="Prospector" pacing="on track" onView={() => nav('/campaigns/2')} />
              <CampaignPulseCard name="ANZ Retargeting"       status="paused" spend="$6,200"  leads="41"  agent="Analyst"    pacing="behind" onView={() => nav('/campaigns/3')} />
            </div>
          </div>
        </div>

        {/* ══ COL 3: APPROVAL QUEUE ══ */}
        <div style={{ backgroundColor: C.surface, border: `1px solid ${C.border}`, borderRadius: R.card, padding: S[4] }}>
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: S[4] }}>
            <div style={{ fontFamily: F.display, fontSize: '14px', fontWeight: 700, color: C.textPrimary }}>Approvals</div>
            {approvals.length > 0 && (
              <span style={{ fontFamily: F.mono, fontSize: '10px', fontWeight: 700, padding: '2px 7px', borderRadius: R.pill, backgroundColor: 'rgba(239,68,68,0.15)', color: C.red, border: `1px solid rgba(239,68,68,0.3)` }}>{approvals.length}</span>
            )}
          </div>

          {/* Bulk approve */}
          {approvals.some((a) => a.confidence >= 85) && (
            <button
              onClick={handleBulkApproveSafe}
              style={{ width: '100%', padding: '8px 0', marginBottom: S[4], borderRadius: R.button, backgroundColor: 'rgba(16,185,129,0.12)', color: C.green, border: `1px solid rgba(16,185,129,0.3)`, fontFamily: F.body, fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}
            >
              ✓ Approve All Safe (confidence ≥85%)
            </button>
          )}

          {/* Approval cards */}
          {approvals.length === 0 ? (
            <div style={{ textAlign: 'center', padding: `${S[8]} 0`, color: C.textMuted, fontFamily: F.body, fontSize: '13px' }}>
              <div style={{ fontSize: '24px', marginBottom: S[2] }}>✓</div>
              All clear — no pending approvals
            </div>
          ) : (
            approvals.map((item) => (
              <ApprovalQueueCard
                key={item.id}
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

          <button
            onClick={() => nav('/campaigns/approvals')}
            style={{ width: '100%', padding: '8px 0', borderRadius: R.button, border: `1px solid ${C.border}`, backgroundColor: 'transparent', color: C.textMuted, fontFamily: F.body, fontSize: '12px', cursor: 'pointer', marginTop: S[2] }}
          >
            View all approvals →
          </button>
        </div>
      </div>
    </div>
  );
}
