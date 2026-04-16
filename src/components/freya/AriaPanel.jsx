import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { C, F, R, S, T, shadows, Z, LAYOUT } from '../../tokens';
import ContentIDChip from '../ui/ContentIDChip';
import FreyaLogo from '../ui/FreyaLogo';
import AgentRoleIcon, { AgentNameWithIcon } from '../ui/AgentRoleIcon';
import CommandModeGlyph from '../ui/CommandModeGlyph';
import { IconClock } from '../ui/Icons';
import ARIAActionApproval from './ARIAActionApproval';
import AriaPanelHistory from './AriaPanelHistory';
import useToast from '../../hooks/useToast';
import useStore from '../../store/useStore';
import { getRoleConfig } from '../../config/roleConfig';
import { AGENTS, getAllAgentIds } from '../../agents/AgentRegistry';
import { WORKFLOWS } from '../../freya/workflows/registry';
import { AgentRuntime } from '../../agents/AgentRuntime';

// ── Panel Approvals mock data ─────────────────
const PANEL_APPROVALS_INITIAL = [
  { id: 1, type: 'CONTENT',  title: 'Email #3: The Operating Table in Rafah',       agentId: 'copywriter', agentNote: '', confidence: 94 },
  { id: 2, type: 'OUTREACH', title: '47 MENA Lead Sequences',                        agentId: 'outreach', agentNote: '', confidence: 87 },
  { id: 3, type: 'STRATEGY', title: 'Q2 Donor ICP Update — MENA Healthcare',         agentId: 'analyst', agentNote: '', confidence: 91 },
  { id: 4, type: 'CONTENT',  title: 'Yemen Campaign LinkedIn Post',                  agentId: 'copywriter', agentNote: '+ Guardian', confidence: 89 },
  { id: 5, type: 'BUDGET',   title: 'ANZ Retargeting Pause — $4,200 reallocate',    agentId: 'optimizer', agentNote: '', confidence: 78 },
];

const APPROVAL_TYPE_COLORS = {
  CONTENT:  { color: '#6BA396', bg: 'rgba(107,163,150,0.14)' },
  STRATEGY: { color: C.primary, bg: 'rgba(74,124,111,0.14)' },
  OUTREACH: { color: C.secondary, bg: 'rgba(107,163,150,0.12)' },
  BUDGET:   { color: C.amber,   bg: 'rgba(251,191,36,0.14)' },
  ICP:      { color: C.green,   bg: 'rgba(16,185,129,0.12)' },
};

// ── Contextual page actions ───────────────────
const PAGE_ACTIONS = {
  '/':             ['Check alerts', 'Generate report', "What's underperforming?"],
  '/campaigns':    ['Create campaign', 'Show pipeline', 'Export CSV'],
  '/escalations':  ['Approve all low priority', 'Brief me', 'Summarize queue'],
  '/analytics':    ['Explain CAC spike', 'Export report', 'Compare channels'],
  '/meta':         ['Flag anomalies', 'Boost budget', 'Pause underperformers'],
  '/agents':       ['Agent health check', 'Show activity', 'Reassign tasks'],
  '/inbox':        ['Triage urgent', 'Draft replies', 'Archive read'],
  '/content':      ['Generate variant', 'Top performers', 'Content gaps'],
  '/knowledge':    ['Search knowledge', 'Add document', "What's covered?"],
};

function getActions(page) {
  if (/^\/campaigns\/[^/]+/.test(page)) return ['Pause ads', 'Show funnel', 'Write new variant'];
  const exact = PAGE_ACTIONS[page];
  if (exact) return exact;
  for (const [k, v] of Object.entries(PAGE_ACTIONS)) {
    if (k !== '/' && page.startsWith(k)) return v;
  }
  return ["What can you do?", 'Show summary', 'Help me'];
}

// ── Canned responses ──────────────────────────
const CANNED = {
  'Check alerts': {
    text: 'I found **3 active alerts** requiring your attention.',
    type: 'alerts',
    data: [
      { sev: 'high', text: 'CTR dropped 42% on CFO Vietnam Q1 — Feb 22 anomaly confirmed', time: '2h ago' },
      { sev: 'med',  text: 'Budget pacing at 112% for APAC Brand Awareness', time: '4h ago' },
      { sev: 'low',  text: 'Audience burnout >90% on LinkedIn Lookalike segment', time: '6h ago' },
    ],
    actions: [{ label: 'View Escalations', path: '/escalations' }, { label: 'Meta Monitor', path: '/meta' }],
  },
  'Generate report': {
    text: "Here's your weekly performance summary across all active campaigns.",
    type: 'table',
    headers: ['Campaign', 'Spend', 'Leads', 'CAC'],
    rows: [
      ['CFO Vietnam Q1',   '$18,400', '124', '$148'],
      ['APAC Brand',       '$12,100', '83',  '$145'],
      ['SEA Demand Gen',   '$9,800',  '71',  '$138'],
      ['ANZ Retargeting',  '$6,200',  '41',  '$151'],
    ],
    actions: [{ label: 'Full Analytics', path: '/analytics' }],
  },
  "What's underperforming?": {
    text: 'Based on the last 7 days, two campaigns are underperforming vs targets.',
    type: 'stats',
    data: [
      { label: 'ANZ Retargeting',  value: '-34%', sub: 'vs CTR target',  color: C.red   },
      { label: 'SEA Demand Gen',   value: '-18%', sub: 'vs lead goal',   color: C.amber },
    ],
    actions: [{ label: 'View Campaigns', path: '/campaigns' }],
  },
  'Pause ads': {
    text: "I'll pause all active ad sets for this campaign. This will stop spend immediately.",
    type: 'confirm',
    confirmLabel: 'Confirm Pause',
    cancelLabel:  'Keep Running',
  },
  'Show funnel': {
    text: "Here's the current conversion funnel for this campaign.",
    type: 'funnel',
    stages: [
      { label: 'Impressions', value: 84200, pct: 1.00 },
      { label: 'Clicks',      value: 3100,  pct: 0.37 },
      { label: 'Leads',       value: 340,   pct: 0.11 },
      { label: 'MQLs',        value: 98,    pct: 0.04 },
      { label: 'Closed',      value: 12,    pct: 0.014 },
    ],
    actions: [{ label: 'Analytics Deep Dive', path: '/analytics' }],
  },
  'Write new variant': {
    text: "Here's a high-performing subject line variant based on your top emails.",
    type: 'content',
    contentId: 'CAMP-001-EMAIL-004',
    variant: {
      subject: 'Is your team leaving $2M on the table? [CFO Read]',
      preview: 'We analyzed 400+ finance leaders who reduced overhead by 34%...',
      score: '92',
    },
    actions: [{ label: 'Open Content Library', path: '/content' }],
  },
  'Approve all low priority': {
    text: 'There are **7 low-priority escalations** pending. I can approve all of them now.',
    type: 'confirm',
    confirmLabel: 'Approve 7 Items',
    cancelLabel:  'Review First',
  },
  'Brief me': {
    text: "Here's your escalation queue summary for today.",
    type: 'stats',
    data: [
      { label: 'High Priority', value: '2',  sub: 'requires manual review', color: C.red   },
      { label: 'Medium',        value: '5',  sub: 'auto-resolvable',        color: C.amber },
      { label: 'Low Priority',  value: '7',  sub: 'can approve all',        color: C.primary },
    ],
    actions: [{ label: 'Go to Escalations', path: '/escalations' }],
  },
  'Summarize queue': {
    text: 'Your escalation queue has **14 open items**. 2 critical require manual review.',
    type: 'stats',
    data: [
      { label: 'Critical', value: '2',  sub: 'response required',  color: C.red   },
      { label: 'Pending',  value: '12', sub: 'auto-resolvable',    color: C.amber },
    ],
    actions: [{ label: 'Escalations', path: '/escalations' }],
  },
  'Explain CAC spike': {
    text: 'The CAC spike in week 6 was driven by a 28% increase in LinkedIn CPM combined with lower landing page conversion. The CFO Vietnam segment showed the steepest rise.',
    type: 'text',
    actions: [{ label: 'View Analytics', path: '/analytics' }],
  },
  'Export report': {
    text: "I'll export your analytics report as a PDF with all charts and tables included.",
    type: 'confirm',
    confirmLabel: 'Export PDF',
    cancelLabel:  'Cancel',
  },
  'Compare channels': {
    text: "Here's a side-by-side channel performance breakdown for the last 30 days.",
    type: 'table',
    headers: ['Channel', 'Spend', 'CAC', 'ROAS'],
    rows: [
      ['Email',    '$4,200',  '$48',  '4.2x'],
      ['LinkedIn', '$18,400', '$164', '1.8x'],
      ['Meta',     '$9,800',  '$132', '2.1x'],
    ],
    actions: [{ label: 'Full Channel Table', path: '/analytics' }],
  },
  'Flag anomalies': {
    text: "I've identified **2 anomalies** in the last 14 days.",
    type: 'alerts',
    data: [
      { sev: 'high', text: 'CTR dropped 42% on Feb 22 — likely audience fatigue',  time: 'Feb 22' },
      { sev: 'med',  text: 'CPM spike +38% on LinkedIn for APAC segment',          time: 'Feb 24' },
    ],
    actions: [{ label: 'Meta Monitor', path: '/meta' }],
  },
  'Boost budget': {
    text: "I'll increase the daily budget by 20% for the top-performing ad sets.",
    type: 'actionApproval',
    action: {
      action: 'boost_budget',
      label: 'Boost +20%',
      payload: { budget: 600, monthly_budget: 2800 },
      budgetAmount: 600,
      description: "Increase daily budget by 20% for top-performing ad sets. Budget impact: $600. Requires strategy and budget approval.",
    },
    confirmLabel: 'Boost +20%',
    cancelLabel:  'Cancel',
  },
  'Pause underperformers': {
    text: "I'll pause the 2 ad sets with CTR below target threshold.",
    type: 'confirm',
    confirmLabel: 'Pause 2 Ad Sets',
    cancelLabel:  'Keep Running',
  },
  'Agent health check': {
    text: 'All agents checked. Here\'s the health summary.',
    type: 'stats',
    data: [
      { label: 'Email Sequencer', value: 'Healthy',  sub: '47 tasks/hr',      color: C.primary },
      { label: 'ICP Scorer',      value: 'Degraded', sub: 'API timeout x3',   color: C.amber   },
      { label: 'Budget Guardian', value: 'Healthy',  sub: 'monitoring',       color: C.primary },
    ],
    actions: [{ label: 'Agent Roster', path: '/agents' }],
  },
  'Show activity': {
    text: 'Agents completed **1,247 tasks** in the last 24 hours.',
    type: 'stats',
    data: [
      { label: 'Tasks Today',   value: '1,247', sub: '+12% vs yesterday', color: C.primary   },
      { label: 'Avg Response',  value: '1.2s',  sub: 'p95: 3.1s',        color: C.secondary },
    ],
  },
  'Reassign tasks': {
    text: "I'll reassign the 14 pending tasks from the degraded ICP Scorer to backup agents.",
    type: 'confirm',
    confirmLabel: 'Reassign 14 Tasks',
    cancelLabel:  'Cancel',
  },
  'Triage urgent': {
    text: 'You have **3 urgent messages** that need immediate attention.',
    type: 'alerts',
    data: [
      { sev: 'high', text: 'Sarah Chen: "Budget approval needed by EOD"',         time: '30m ago' },
      { sev: 'high', text: 'Marcus V: "CTR anomaly — should we pause?"',           time: '1h ago'  },
      { sev: 'med',  text: 'James O: "New prospect replied, warm lead"',           time: '2h ago'  },
    ],
    actions: [{ label: 'Open Company Social Inbox', path: '/inbox' }],
  },
  'Draft replies': {
    text: "I've drafted responses to your 3 most recent unanswered messages.",
    type: 'confirm',
    confirmLabel: 'Review Drafts',
    cancelLabel:  'Skip',
  },
  'Archive read': {
    text: "I'll archive 12 read messages older than 48 hours.",
    type: 'confirm',
    confirmLabel: 'Archive 12',
    cancelLabel:  'Cancel',
  },
  'Generate variant': {
    text: "Here's a new email subject variant optimized for open rate.",
    type: 'content',
    contentId: 'CAMP-001-EMAIL-005',
    variant: {
      subject: 'How CFOs at $10M+ companies cut SaaS spend by 41%',
      preview: 'A data-backed playbook from 300 finance leaders...',
      score: '88',
    },
    actions: [{ label: 'Content Library', path: '/content' }],
  },
  'Top performers': {
    text: "Your top 3 performing content pieces this month.",
    type: 'table',
    headers: ['Subject', 'Open Rate', 'Clicks'],
    rows: [
      ['CFO Vietnam Q1 — intro',   '38.4%', '6.1%'],
      ['Budget audit playbook',     '34.2%', '5.8%'],
      ['ROI calculator follow-up',  '31.7%', '4.9%'],
    ],
    actions: [{ label: 'Content Library', path: '/content' }],
  },
  'Content gaps': {
    text: "I identified gaps in your content for the bottom-of-funnel stage.",
    type: 'alerts',
    data: [
      { sev: 'med', text: 'No case studies targeting CFO decision stage', time: 'Gap' },
      { sev: 'low', text: 'Only 1 pricing objection handler in library',  time: 'Gap' },
    ],
    actions: [{ label: 'Content Library', path: '/content' }],
  },
  'Create campaign': {
    text: "Let's set up a new campaign. I'll guide you through the key parameters.",
    type: 'confirm',
    confirmLabel:  'Start Campaign Wizard',
    cancelLabel:   'Not now',
    confirmPath:   '/campaigns/new',
  },
  'Show pipeline': {
    text: "Here's the current campaign pipeline at a glance.",
    type: 'table',
    headers: ['Campaign', 'Status', 'Stage', 'Budget'],
    rows: [
      ['CFO Vietnam Q1',       'Active', 'Scale',    '$40K'],
      ['APAC Brand Awareness', 'Active', 'Optimize', '$28K'],
      ['SEA Demand Gen',       'Active', 'Test',     '$20K'],
      ['ANZ Retargeting',      'Paused', 'Review',   '$15K'],
    ],
    actions: [{ label: 'All Campaigns', path: '/campaigns' }],
  },
  'Export CSV': {
    text: "I'll export all campaign data as a CSV file.",
    type: 'confirm',
    confirmLabel: 'Export CSV',
    cancelLabel:  'Cancel',
  },
  "What can you do?": {
    text: "I'm Freya — your AI co-pilot. I can monitor campaign performance, flag anomalies, draft content, manage escalations, and answer questions about your data. Try asking me about any page you're on.",
    type: 'text',
  },
  'Show summary': {
    text: "Here's a platform snapshot for today.",
    type: 'stats',
    data: [
      { label: 'Active Campaigns', value: '4',   sub: '2 pacing ahead',   color: C.primary },
      { label: 'Open Escalations', value: '14',  sub: '2 high priority',  color: C.amber   },
      { label: 'Leads This Week',  value: '312', sub: '+8% vs last week', color: C.primary },
    ],
    actions: [{ label: 'Dashboard', path: '/' }],
  },
  'Help me': {
    text: "I'm here to help. You can ask me to check performance, explain data, draft content, or take actions like pausing campaigns. Just type your question or tap a quick action chip.",
    type: 'text',
  },
  'Search knowledge': {
    text: 'What topic would you like to search in the knowledge base? Type it below and I\'ll find the most relevant documents.',
    type: 'text',
  },
  'Add document': {
    text: "I'll take you to the knowledge base upload flow.",
    type: 'confirm',
    confirmLabel: 'Go to Knowledge Base',
    cancelLabel:  'Cancel',
    confirmPath:  '/knowledge',
  },
  "What's covered?": {
    text: "The knowledge base currently covers these topic areas.",
    type: 'table',
    headers: ['Topic', 'Docs', 'Last Updated'],
    rows: [
      ['Product Messaging',    '14', 'Feb 24'],
      ['ICP Profiles',         '8',  'Feb 20'],
      ['Email Playbooks',      '11', 'Feb 18'],
      ['Competitive Intel',    '6',  'Feb 15'],
    ],
    actions: [{ label: 'Knowledge Base', path: '/knowledge' }],
  },
};

function getResponse(text) {
  if (CANNED[text]) return CANNED[text];
  const t = text.toLowerCase();
  if (t.includes('alert') || t.includes('warn'))                       return CANNED['Check alerts'];
  if (t.includes('report') && !t.includes('analytics'))                return CANNED['Generate report'];
  if (t.includes('underperform') || t.includes('poor'))                return CANNED["What's underperforming?"];
  if (t.includes('funnel') || t.includes('conversion'))                return CANNED['Show funnel'];
  if (t.includes('pause') || t.includes('stop ads'))                   return CANNED['Pause ads'];
  if (t.includes('variant') || t.includes('subject line'))             return CANNED['Write new variant'];
  if (t.includes('cac') || t.includes('spike') || t.includes('cost'))  return CANNED['Explain CAC spike'];
  if (t.includes('channel') || t.includes('compare'))                  return CANNED['Compare channels'];
  if (t.includes('anomal'))                                             return CANNED['Flag anomalies'];
  if (t.includes('budget') || t.includes('spend'))                     return CANNED['Brief me'];
  if (t.includes('agent') || t.includes('health'))                     return CANNED['Agent health check'];
  if (t.includes('help') || t.includes('what can'))                    return CANNED['What can you do?'];
  if (t.includes('summar') || t.includes('summary'))                   return CANNED['Show summary'];
  if (t.includes('escalat'))                                            return CANNED['Brief me'];
  if (t.includes('inbox') || t.includes('message'))                    return CANNED['Triage urgent'];
  return {
    text: `Got it — I'm analyzing that. For a full demo, try one of the quick action chips above.`,
    type: 'text',
  };
}

// ── Mini renderers ────────────────────────────
function MiniAlerts({ data }) {
  const SEV = { high: C.red, med: C.amber, low: C.primary };
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '8px' }}>
      {data.map((a, i) => (
        <div key={i} style={{ display: 'flex', gap: '8px', padding: '8px 10px', backgroundColor: C.bg, borderRadius: R.md, borderLeft: `2px solid ${SEV[a.sev] ?? C.textMuted}`, alignItems: 'flex-start' }}>
          <div style={{ flex: 1, fontFamily: F.body, fontSize: '12px', color: C.textPrimary, lineHeight: 1.4 }}>{a.text}</div>
          <div style={{ fontFamily: F.mono, fontSize: '10px', color: C.textMuted, whiteSpace: 'nowrap', paddingTop: '2px' }}>{a.time}</div>
        </div>
      ))}
    </div>
  );
}

function MiniTable({ headers, rows }) {
  const th = { fontFamily: F.mono, fontSize: '10px', fontWeight: 700, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.06em', padding: '6px 8px', textAlign: 'left', borderBottom: `1px solid ${C.border}`, whiteSpace: 'nowrap' };
  const td = { fontFamily: F.body, fontSize: '12px', color: C.textPrimary, padding: '6px 8px', borderBottom: `1px solid rgba(28,46,34,0.5)` };
  return (
    <div style={{ marginTop: '8px', borderRadius: R.md, overflow: 'hidden', border: `1px solid ${C.border}` }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ backgroundColor: C.bg }}>
            {headers.map((h) => <th key={h} style={th}>{h}</th>)}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} style={{ backgroundColor: i % 2 === 1 ? C.bg : 'transparent' }}>
              {row.map((cell, j) => <td key={j} style={td}>{cell}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function MiniStats({ data }) {
  const cols = Math.min(data.length, 3);
  return (
    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: '6px', marginTop: '8px' }}>
      {data.map((s, i) => (
        <div key={i} style={{ padding: '8px 10px', backgroundColor: C.bg, borderRadius: R.md, border: `1px solid ${C.border}` }}>
          <div style={{ fontFamily: F.mono, fontSize: '16px', fontWeight: 700, color: s.color ?? C.textPrimary, lineHeight: 1 }}>{s.value}</div>
          <div style={{ fontFamily: F.body, fontSize: '11px', fontWeight: 600, color: C.textPrimary, marginTop: '4px' }}>{s.label}</div>
          {s.sub && <div style={{ fontFamily: F.body, fontSize: '10px', color: C.textMuted, marginTop: '2px' }}>{s.sub}</div>}
        </div>
      ))}
    </div>
  );
}

function MiniFunnel({ stages }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '8px' }}>
      {stages.map((s, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '70px', fontFamily: F.body, fontSize: '11px', color: C.textSecondary, flexShrink: 0, textAlign: 'right' }}>{s.label}</div>
          <div style={{ flex: 1, height: '16px', backgroundColor: C.bg, borderRadius: R.sm, overflow: 'hidden' }}>
            <div style={{ width: `${Math.round(s.pct * 100)}%`, height: '100%', backgroundColor: C.primary, opacity: 0.25 + s.pct * 0.75, borderRadius: R.sm }}/>
          </div>
          <div style={{ width: '52px', fontFamily: F.mono, fontSize: '11px', color: C.textPrimary, flexShrink: 0 }}>{s.value.toLocaleString()}</div>
        </div>
      ))}
    </div>
  );
}

function MiniContent({ variant, contentId }) {
  const navigate = useNavigate();
  return (
    <div style={{ marginTop: '8px', padding: '10px 12px', backgroundColor: C.bg, borderRadius: R.md, border: `1px solid ${C.border}` }}>
      {contentId && (
        <div style={{ marginBottom: '6px' }}>
          <ContentIDChip contentId={contentId} size="sm" onClick={() => navigate('/content')} />
        </div>
      )}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
        <div style={{ fontFamily: F.mono, fontSize: '10px', color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Subject Line</div>
        <div style={{ fontFamily: F.mono, fontSize: '11px', fontWeight: 700, color: C.primary }}>Score {variant.score}</div>
      </div>
      <div style={{ fontFamily: F.body, fontSize: '13px', fontWeight: 600, color: C.textPrimary, marginBottom: '4px' }}>{variant.subject}</div>
      <div style={{ fontFamily: F.body, fontSize: '12px', color: C.textSecondary, lineHeight: 1.4 }}>{variant.preview}</div>
    </div>
  );
}

function MiniConfirm({ confirmLabel, cancelLabel, confirmPath }) {
  const [done, setDone] = useState(false);
  const navigate = useNavigate();
  if (done) {
    return (
      <div style={{ marginTop: '8px', fontFamily: F.body, fontSize: '12px', color: C.primary, display: 'flex', alignItems: 'center', gap: '6px' }}>
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 7l4 4 6-6" stroke={C.primary} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
        Action confirmed
      </div>
    );
  }
  return (
    <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
      <button
        onClick={() => { setDone(true); if (confirmPath) navigate(confirmPath); }}
        style={{ flex: 1, padding: '7px 12px', backgroundColor: C.primary, color: C.textInverse, border: 'none', borderRadius: R.button, fontFamily: F.body, fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}
      >
        {confirmLabel ?? 'Confirm'}
      </button>
      <button
        onClick={() => setDone(true)}
        style={{ flex: 1, padding: '7px 12px', backgroundColor: 'transparent', color: C.textSecondary, border: `1px solid ${C.border}`, borderRadius: R.button, fontFamily: F.body, fontSize: '12px', fontWeight: 500, cursor: 'pointer' }}
      >
        {cancelLabel ?? 'Cancel'}
      </button>
    </div>
  );
}

function ActionButtons({ actions }) {
  const navigate = useNavigate();
  if (!actions?.length) return null;
  return (
    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '10px' }}>
      {actions.map((a, i) => (
        <button
          key={i}
          onClick={() => navigate(a.path)}
          style={{ padding: '5px 10px', backgroundColor: C.surface3, color: C.primary, border: `1px solid rgba(61,220,132,0.2)`, borderRadius: R.button, fontFamily: F.body, fontSize: '11px', fontWeight: 600, cursor: 'pointer', transition: T.color }}
        >
          {a.label} {'>'}
        </button>
      ))}
    </div>
  );
}

// ── Message bubble ────────────────────────────
function MessageBubble({ msg, toast }) {
  const isUser = msg.role === 'user';
  const bubbleStyle = {
    alignSelf: isUser ? 'flex-end' : 'flex-start',
    maxWidth: '92%',
    padding: isUser ? '8px 12px' : '10px 12px',
    backgroundColor: isUser ? C.primaryDim : C.surface2,
    border: `1px solid ${isUser ? 'rgba(61,220,132,0.3)' : C.border}`,
    borderRadius: isUser
      ? `${R.card} ${R.card} ${R.sm} ${R.card}`
      : `${R.card} ${R.card} ${R.card} ${R.sm}`,
    fontFamily: F.body,
    fontSize: '13px',
    color: C.textPrimary,
    lineHeight: 1.5,
  };

  const formatText = (text) => {
    if (!text) return null;
    const parts = text.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((p, i) =>
      p.startsWith('**') && p.endsWith('**')
        ? <strong key={i} style={{ color: C.primary, fontWeight: 700 }}>{p.slice(2, -2)}</strong>
        : p
    );
  };

  return (
    <div style={bubbleStyle}>
      {!isUser && (
        <div style={{ fontFamily: F.mono, fontSize: '10px', fontWeight: 700, color: C.primary, marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Freya</div>
      )}
      <div>{formatText(msg.text)}</div>
      {isUser && msg.attachments?.length > 0 && (
        <div style={{ marginTop: '6px', fontFamily: F.mono, fontSize: '10px', color: C.textMuted }}>
          Attached: {msg.attachments.join(', ')}
        </div>
      )}
      {msg.type === 'alerts'  && <MiniAlerts  data={msg.data}/>}
      {msg.type === 'table'   && <MiniTable   headers={msg.headers} rows={msg.rows}/>}
      {msg.type === 'stats'   && <MiniStats   data={msg.data}/>}
      {msg.type === 'funnel'  && <MiniFunnel  stages={msg.stages}/>}
      {msg.type === 'content' && <MiniContent variant={msg.variant} contentId={msg.contentId}/>}
      {msg.type === 'confirm' && (
        <MiniConfirm
          confirmLabel={msg.confirmLabel}
          cancelLabel={msg.cancelLabel}
          confirmPath={msg.confirmPath}
        />
      )}
      {msg.type === 'actionApproval' && msg.action && (
        <ARIAActionApproval
          action={msg.action}
          onStrategyApprove={() => {}}
          onBudgetApprove={() => {}}
          onDecline={() => {}}
          onExecute={() => toast?.success('Budget boost executed')}
        />
      )}
      <ActionButtons actions={msg.actions}/>
    </div>
  );
}

// ── Typing indicator ──────────────────────────
function TypingIndicator() {
  return (
    <div style={{ alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: '5px', padding: '10px 14px', backgroundColor: C.surface2, borderRadius: `${R.card} ${R.card} ${R.card} ${R.sm}`, border: `1px solid ${C.border}` }}>
      <style>{`@keyframes ariaTyping{0%,80%,100%{opacity:.3;transform:scale(.8)}40%{opacity:1;transform:scale(1)}}`}</style>
      {[0, 1, 2].map((i) => (
        <div key={i} style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: C.primary, animation: 'ariaTyping 1.2s ease-in-out infinite', animationDelay: `${i * 0.2}s` }}/>
      ))}
    </div>
  );
}

// ── Float action chips (shown on hover) ───────
function FloatChips({ actions, onSend }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', alignItems: 'flex-end', marginBottom: '6px' }}>
      {actions.map((a) => (
        <button
          key={a}
          onClick={() => onSend(a)}
          style={{ padding: '6px 14px', backgroundColor: C.surface2, color: C.textPrimary, border: `1px solid ${C.border}`, borderRadius: R.pill, fontFamily: F.body, fontSize: '12px', fontWeight: 500, cursor: 'pointer', whiteSpace: 'nowrap', boxShadow: shadows.dropdown, transition: T.base }}
        >
          {a}
        </button>
      ))}
    </div>
  );
}

// ── ARIA Float Button ─────────────────────────
function AriaFloatBtn({ open, onOpen, onSend, page, actions: actionsProp }) {
  const [hovered, setHovered] = useState(false);
  const actions = actionsProp ?? getActions(page);
  if (open) return null;

  const fabStyle = {
    width: '52px',
    height: '52px',
    borderRadius: R.card,
    backgroundColor: C.primary,
    color: C.textInverse,
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: `${shadows.glow}, 0 4px 20px rgba(0,0,0,0.5)`,
    transition: T.base,
    flexShrink: 0,
    transform: hovered ? 'scale(1.06)' : 'scale(1)',
  };

  return (
    <div
      style={{ position: 'fixed', bottom: `${24 + (LAYOUT?.footerHeightPx ?? 0)}px`, right: '24px', zIndex: Z.overlay + 10, display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {hovered && (
        <FloatChips
          actions={actions}
          onSend={(a) => { onOpen(); setTimeout(() => onSend(a), 150); }}
        />
      )}
      <button type="button" style={fabStyle} onClick={onOpen} title="Ask Freya">
        <FreyaLogo size={34} />
      </button>
    </div>
  );
}

// ── Agent status color helper ─────────────────
function statusColor(status) {
  if (status === 'thinking')  return C.amber;
  if (status === 'executing') return C.primary;
  if (status === 'done')      return C.green;
  if (status === 'error')     return C.red;
  return C.textMuted;
}

// ── Agents Tab (improved) ─────────────────────
function AgentsTab({ toast }) {
  const agentStatuses = useStore((s) => s.agents.statuses);
  const commandMode   = useStore((s) => s.commandMode);
  const setCommandMode = useStore((s) => s.setCommandMode);
  const navigate = useNavigate();

  const allAgents = Object.values(AGENTS);
  const idleAgents = allAgents.filter((a) => {
    const st = (agentStatuses[a.id] || {}).status || 'idle';
    return st === 'idle';
  });

  const MODES = [
    { id: 'manual',        label: 'Manual',    color: C.red,   dim: C.redDim   },
    { id: 'semi_auto',     label: 'Semi-Auto', color: C.amber, dim: C.amberDim },
    { id: 'fully_agentic', label: 'Agentic',   color: C.green, dim: C.greenDim },
  ];

  const handleRunAllIdle = () => {
    if (idleAgents.length === 0) { toast?.info('No idle agents to run'); return; }
    idleAgents.forEach((a) => {
      AgentRuntime.activateAgent(a.id, { description: 'Batch activation from Freya panel' }, {})
        .then(() => toast?.success(`${a.displayName} completed`))
        .catch(() => {});
    });
    toast?.info(`Activating ${idleAgents.length} idle agent${idleAgents.length !== 1 ? 's' : ''}…`);
  };

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: S[3], display: 'flex', flexDirection: 'column', gap: S[2], scrollbarWidth: 'thin', scrollbarColor: `${C.border} transparent` }}>
      {/* Command Mode toggle */}
      <div style={{ backgroundColor: C.surface2, border: `1px solid ${C.border}`, borderRadius: R.md, padding: S[3], marginBottom: S[1] }}>
        <div style={{ fontFamily: F.body, fontSize: '10px', fontWeight: 700, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: S[2] }}>Command Mode</div>
        <div style={{ display: 'flex', gap: '4px' }}>
          {MODES.map((mode) => {
            const active = commandMode === mode.id;
            return (
              <button
                key={mode.id}
                onClick={() => { setCommandMode(mode.id); toast?.info(`Mode: ${mode.label}`); }}
                style={{ flex: 1, padding: '5px 2px', fontFamily: F.body, fontSize: '10px', fontWeight: active ? 700 : 500, color: active ? mode.color : C.textMuted, backgroundColor: active ? mode.dim : 'transparent', border: `1px solid ${active ? mode.color : C.border}`, borderRadius: R.button, cursor: 'pointer', transition: T.color, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}
              >
                <CommandModeGlyph modeId={mode.id} size={14} color={active ? mode.color : C.textMuted} />
                <span>{mode.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Agent list */}
      {allAgents.map((agent) => {
        const statusObj  = agentStatuses[agent.id] || {};
        const status     = statusObj.status || 'idle';
        const currentTask = statusObj.currentTask || null;
        const dotColor   = statusColor(status);
        const isActive   = status === 'thinking' || status === 'executing';
        return (
          <div
            key={agent.id}
            style={{
              backgroundColor: C.surface2,
              border: `1px solid ${C.border}`,
              borderRadius: R.md,
              padding: `${S[3]} ${S[3]}`,
              display: 'flex',
              alignItems: 'center',
              gap: S[2],
            }}
          >
            {/* Avatar */}
            <div style={{
              width: '34px', height: '34px', borderRadius: '50%',
              backgroundColor: C.surface3,
              border: `1.5px solid ${dotColor}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0, lineHeight: 0,
            }}>
              <AgentRoleIcon agentId={agent.id} size={18} color={agent.color} />
            </div>

            {/* Info */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '2px' }}>
                <span style={{ fontFamily: F.display, fontSize: '12px', fontWeight: 700, color: C.textPrimary }}>{agent.displayName}</span>
                <span style={{ fontFamily: F.mono, fontSize: '9px', fontWeight: 700, color: dotColor, textTransform: 'uppercase' }}>{status}</span>
              </div>
              {isActive && currentTask ? (
                <div style={{ fontFamily: F.body, fontSize: '10px', color: C.amber, backgroundColor: C.amberDim, borderRadius: R.sm, padding: '2px 5px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{currentTask}</div>
              ) : (
                <div style={{ fontFamily: F.body, fontSize: '11px', color: C.textMuted, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{agent.description}</div>
              )}
            </div>

            {/* Run button */}
            <button
              style={{ padding: '4px 8px', fontFamily: F.body, fontSize: '10px', fontWeight: 600, color: C.primary, backgroundColor: C.primaryGlow, border: `1px solid rgba(74,124,111,0.35)`, borderRadius: R.button, cursor: 'pointer', flexShrink: 0, transition: T.color }}
              onClick={() => {
                AgentRuntime.activateAgent(agent.id, { description: 'Manual activation from Freya panel' }, {})
                  .then(() => toast?.success(`${agent.displayName} completed task`))
                  .catch(() => toast?.error(`${agent.displayName} encountered an error`));
                toast?.info(`Activating ${agent.displayName}...`);
              }}
            >
              ▶ Run
            </button>
          </div>
        );
      })}

      {/* Run all idle */}
      <button
        style={{ marginTop: S[2], padding: `${S[2]} 0`, fontFamily: F.body, fontSize: '12px', fontWeight: 600, color: C.amber, backgroundColor: C.amberDim, border: `1px solid rgba(251,191,36,0.3)`, borderRadius: R.button, cursor: 'pointer' }}
        onClick={handleRunAllIdle}
      >
        ▶▶ Run All Idle Agents ({idleAgents.length})
      </button>

      <button
        style={{ padding: `${S[2]} 0`, fontFamily: F.body, fontSize: '12px', fontWeight: 600, color: C.primary, backgroundColor: 'transparent', border: `1px solid ${C.border}`, borderRadius: R.button, cursor: 'pointer' }}
        onClick={() => navigate('/agents')}
      >
        View full Agent Roster →
      </button>
    </div>
  );
}

// ── Approvals Tab ─────────────────────────────
function ApprovalsTab({ toast }) {
  const navigate = useNavigate();
  const [approvals, setApprovals] = useState(PANEL_APPROVALS_INITIAL);
  const [filter, setFilter]       = useState('All');

  const FILTERS = ['All', 'Content', 'Strategy', 'Outreach', 'Budget'];

  const filtered = filter === 'All'
    ? approvals
    : approvals.filter((a) => a.type === filter.toUpperCase());

  const handleApprove = (id, title) => {
    setApprovals((prev) => prev.filter((a) => a.id !== id));
    toast?.success(`Approved: ${title.slice(0, 40)}`);
  };

  const handleReject = (id, title) => {
    setApprovals((prev) => prev.filter((a) => a.id !== id));
    toast?.warning(`Rejected: ${title.slice(0, 40)}`);
  };

  const handleChanges = (title) => {
    toast?.info(`Requested changes for: ${title.slice(0, 40)}`);
    navigate('/campaigns/approvals');
  };

  const handleBulkApprove = () => {
    const count = filtered.length;
    setApprovals((prev) => prev.filter((a) => !filtered.find((f) => f.id === a.id)));
    toast?.success(`Bulk approved ${count} item${count !== 1 ? 's' : ''}`);
  };

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: S[3], display: 'flex', flexDirection: 'column', gap: S[3], scrollbarWidth: 'thin', scrollbarColor: `${C.border} transparent` }}>
      {/* Bulk approve */}
      <button
        onClick={handleBulkApprove}
        style={{ width: '100%', padding: `${S[2]} 0`, fontFamily: F.body, fontSize: '12px', fontWeight: 700, color: C.green, backgroundColor: 'rgba(16,185,129,0.1)', border: `1px solid rgba(16,185,129,0.3)`, borderRadius: R.button, cursor: 'pointer' }}
      >
        ✓ Bulk Approve All ({filtered.length})
      </button>

      {/* Filter chips */}
      <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{ padding: '3px 8px', fontFamily: F.body, fontSize: '10px', fontWeight: filter === f ? 700 : 500, color: filter === f ? C.primary : C.textMuted, backgroundColor: filter === f ? C.primaryGlow : 'transparent', border: `1px solid ${filter === f ? C.primary : C.border}`, borderRadius: R.pill, cursor: 'pointer', transition: T.color }}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Items */}
      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: `${S[8]} 0`, color: C.textMuted, fontFamily: F.body, fontSize: '12px' }}>
          <div style={{ fontSize: '20px', marginBottom: S[2] }}>✓</div>
          All clear in this category
        </div>
      ) : (
        filtered.map((item) => {
          const tc = APPROVAL_TYPE_COLORS[item.type] || APPROVAL_TYPE_COLORS.CONTENT;
          return (
            <div key={item.id} style={{ backgroundColor: C.surface2, border: `1px solid ${C.border}`, borderRadius: R.md, padding: S[3] }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                <span style={{ fontFamily: F.mono, fontSize: '9px', fontWeight: 700, letterSpacing: '0.06em', padding: '2px 5px', borderRadius: R.pill, backgroundColor: tc.bg, color: tc.color }}>{item.type}</span>
                <span style={{ marginLeft: 'auto', fontFamily: F.mono, fontSize: '10px', fontWeight: 700, color: item.confidence >= 90 ? C.green : item.confidence >= 80 ? C.primary : C.amber }}>{item.confidence}%</span>
              </div>
              <div style={{ fontFamily: F.body, fontSize: '12px', fontWeight: 600, color: C.textPrimary, marginBottom: '4px', lineHeight: 1.4 }}>{item.title}</div>
              <div style={{ fontFamily: F.body, fontSize: '11px', color: C.textMuted, marginBottom: S[3], display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                <AgentNameWithIcon agentId={item.agentId} size={12} />
                {item.agentNote ? <span>{item.agentNote}</span> : null}
              </div>
              <div style={{ display: 'flex', gap: '5px' }}>
                <button onClick={() => handleApprove(item.id, item.title)} style={{ flex: 1, padding: '5px 0', fontFamily: F.body, fontSize: '11px', fontWeight: 700, color: C.textInverse, backgroundColor: C.primary, border: 'none', borderRadius: R.button, cursor: 'pointer' }}>Approve</button>
                <button onClick={() => handleReject(item.id, item.title)} style={{ flex: 1, padding: '5px 0', fontFamily: F.body, fontSize: '11px', fontWeight: 600, color: C.red, backgroundColor: 'rgba(239,68,68,0.1)', border: `1px solid rgba(239,68,68,0.3)`, borderRadius: R.button, cursor: 'pointer' }}>Reject</button>
                <button onClick={() => handleChanges(item.title)} style={{ flex: 1, padding: '5px 0', fontFamily: F.body, fontSize: '11px', fontWeight: 500, color: C.textMuted, backgroundColor: 'transparent', border: `1px solid ${C.border}`, borderRadius: R.button, cursor: 'pointer' }}>Changes</button>
              </div>
            </div>
          );
        })
      )}

      <button
        onClick={() => navigate('/campaigns/approvals')}
        style={{ padding: `${S[2]} 0`, fontFamily: F.body, fontSize: '12px', fontWeight: 600, color: C.primary, backgroundColor: 'transparent', border: `1px solid ${C.border}`, borderRadius: R.button, cursor: 'pointer' }}
      >
        View all approvals →
      </button>
    </div>
  );
}

// ── Workflows Tab ─────────────────────────────
function WorkflowsTab({ toast }) {
  const navigate = useNavigate();
  const allWorkflows = Object.values(WORKFLOWS);

  const parseSteps = (steps) => {
    return steps.map((s) => {
      const [agentId] = s.split(':');
      const agentDef = AGENTS[agentId];
      return {
        agentId,
        label: agentDef ? agentDef.displayName : agentId,
      };
    });
  };

  const handleRunWorkflow = (workflow) => {
    AgentRuntime.activateAgent('freya', { description: `${workflow.name} workflow` }, {})
      .catch(() => {});
    toast?.info(`Starting ${workflow.name} workflow...`);
  };

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: S[3], display: 'flex', flexDirection: 'column', gap: S[3], scrollbarWidth: 'thin', scrollbarColor: `${C.border} transparent` }}>
      {allWorkflows.map((wf) => {
        const steps = parseSteps(wf.steps);
        return (
          <div
            key={wf.id}
            style={{
              backgroundColor: C.surface2,
              border: `1px solid ${C.border}`,
              borderRadius: R.md,
              padding: S[3],
            }}
          >
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: S[2], marginBottom: S[2] }}>
              <div>
                <div style={{ fontFamily: F.display, fontSize: '13px', fontWeight: 700, color: C.textPrimary, marginBottom: '2px' }}>{wf.name}</div>
                <div style={{ fontFamily: F.body, fontSize: '11px', color: C.textMuted, lineHeight: '1.4' }}>{wf.description}</div>
              </div>
              <button
                style={{
                  padding: '4px 10px', fontFamily: F.body, fontSize: '11px', fontWeight: 600,
                  color: C.textInverse, backgroundColor: C.primary,
                  border: 'none', borderRadius: R.button, cursor: 'pointer', flexShrink: 0,
                }}
                onClick={() => handleRunWorkflow(wf)}
              >
                Run
              </button>
            </div>

            {/* Step chain */}
            <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '4px', marginBottom: S[2] }}>
              {steps.map((step, i) => (
                <span key={i} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{
                    display: 'inline-flex', alignItems: 'center', gap: 5,
                    padding: '2px 6px',
                    backgroundColor: C.surface3, border: `1px solid ${C.border}`,
                    borderRadius: R.pill, fontFamily: F.body, fontSize: '10px',
                    fontWeight: 600, color: C.textSecondary,
                  }}>
                    <AgentRoleIcon agentId={step.agentId} size={11} color={C.textSecondary} />
                    {step.label}
                  </span>
                  {i < steps.length - 1 && (
                    <span style={{ color: C.textMuted, fontSize: '10px' }}>→</span>
                  )}
                </span>
              ))}
            </div>

            {/* Meta */}
            <div style={{ display: 'flex', gap: S[2] }}>
              <span style={{
                fontFamily: F.mono, fontSize: '10px', color: C.textMuted,
                backgroundColor: C.bg, border: `1px solid ${C.border}`,
                borderRadius: R.pill, padding: '2px 6px',
                display: 'inline-flex', alignItems: 'center', gap: 4,
              }}>
                <IconClock color={C.textMuted} width={11} height={11} />
                {wf.estimatedTime}
              </span>
              <span style={{
                fontFamily: F.mono, fontSize: '10px', color: C.amber,
                backgroundColor: C.amberDim, border: `1px solid rgba(251,191,36,0.2)`,
                borderRadius: R.pill, padding: '2px 6px',
              }}>
                {wf.creditCost} credits
              </span>
            </div>
          </div>
        );
      })}

      <button
        style={{
          padding: `${S[2]} 0`,
          fontFamily: F.body, fontSize: '12px', fontWeight: 600,
          color: C.primary, backgroundColor: 'transparent',
          border: `1px solid ${C.border}`, borderRadius: R.button, cursor: 'pointer',
        }}
        onClick={() => navigate('/aria/workflows')}
      >
        Workflow Center →
      </button>
    </div>
  );
}

// ── ARIA Panel (slide-in drawer) ──────────────
const DEFAULT_WELCOME = {
  role: 'freya',
  id: 'welcome',
  text: "Hi, I'm **Freya** — your AI co-pilot. I monitor your campaigns, explain performance data, draft content, and take actions on your behalf. What would you like to do?",
  type: 'text',
};

// Tab bar labels
const PANEL_TABS = [
  { id: 'chat',      label: 'Chat'      },
  { id: 'agents',    label: 'Agents'    },
  { id: 'workflows', label: 'Workflows' },
  { id: 'approvals', label: 'Approvals', badgeCount: 5 },
];

export default function AriaPanel({ open, onOpen, onClose, page }) {
  const toast = useToast();
  const currentRole = useStore((s) => s.currentRole);
  const freyaChats = useStore((s) => s.freyaChats) || [];
  const freyaCurrentChatId = useStore((s) => s.freyaCurrentChatId);
  const addFreyaChat = useStore((s) => s.addFreyaChat);
  const updateFreyaChatMessages = useStore((s) => s.updateFreyaChatMessages);
  const setFreyaCurrentChatId = useStore((s) => s.setFreyaCurrentChatId);

  const roleConfig = getRoleConfig(currentRole);
  const welcomeMessage = {
    role: 'freya',
    id: 'welcome',
    text: roleConfig.freyaOpening ?? DEFAULT_WELCOME.text,
    type: 'text',
  };

  const currentChat = freyaCurrentChatId ? freyaChats.find((c) => c.id === freyaCurrentChatId) : null;
  const messages = currentChat?.messages?.length
    ? currentChat.messages
    : [welcomeMessage];

  const [panelTab, setPanelTab] = useState('chat');
  const [historyOpen, setHistoryOpen] = useState(false);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [attachments, setAttachments] = useState([]);
  const [listening, setListening] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const fileInputRef = useRef(null);
  const recognitionRef = useRef(null);

  const commandMode = useStore((s) => s.commandMode);
  const pageActions = getActions(page ?? '/');
  const roleActions = roleConfig.freyaQuickActions ?? [];

  // Mode-aware quick actions override page/role actions on the dashboard
  const modeActions = {
    manual:        ["What needs my attention?", "Show all outputs", "List approvals"],
    semi_auto:     ["Review latest outputs", "Approve safe items", "What's running?"],
    fully_agentic: ["Status report", "Pause all agents", "Weekly summary"],
  };
  const isModeAware = page === '/' || page === '';
  const actions = isModeAware
    ? (modeActions[commandMode] || pageActions)
    : (roleActions.length > 0 ? roleActions : pageActions);

  useEffect(() => {
    if (!open) return;
  }, [open, currentRole]);

  const handleNewChat = () => {
    setFreyaCurrentChatId(null);
    setInput('');
    setAttachments([]);
    setHistoryOpen(false);
  };

  const handleSelectChat = (chatId) => {
    setFreyaCurrentChatId(chatId);
    setInput('');
    setAttachments([]);
    setHistoryOpen(false);
  };

  const sendMessage = (textOrEmpty) => {
    const trimmed = (typeof textOrEmpty === 'string' ? textOrEmpty : input).trim();
    if (!trimmed && !attachments.length) return;

    const userMsg = { role: 'user', id: Date.now(), text: trimmed || '(Attachments only)' };
    if (attachments.length) userMsg.attachments = attachments.map((a) => a.name);

    let chatId = freyaCurrentChatId;
    let nextMessages;

    if (!chatId) {
      const title = trimmed ? trimmed.slice(0, 40) + (trimmed.length > 40 ? '…' : '') : `Attached: ${attachments.map((a) => a.name).join(', ').slice(0, 35)}…`;
      chatId = addFreyaChat({ title, messages: [welcomeMessage, userMsg] });
      nextMessages = [welcomeMessage, userMsg];
    } else {
      nextMessages = [...(currentChat?.messages || []), userMsg];
      updateFreyaChatMessages(chatId, nextMessages);
    }

    setInput('');
    setAttachments([]);
    setTyping(true);

    const replyPrompt = trimmed || `User attached ${attachments.length} file(s).`;
    setTimeout(() => {
      const resp = getResponse(replyPrompt);
      const freyaMsg = { role: 'freya', id: Date.now() + 1, ...resp };
      const withReply = [...nextMessages, freyaMsg];
      updateFreyaChatMessages(chatId, withReply);
      setTyping(false);
    }, 1100);
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;
    const rec = new SpeechRecognition();
    rec.continuous = false;
    rec.interimResults = false;
    rec.lang = 'en-US';
    rec.onresult = (e) => {
      const t = e.results[e.results.length - 1];
      const transcript = t[0]?.transcript ?? '';
      if (transcript.trim()) setInput((prev) => (prev ? `${prev} ${transcript}` : transcript));
    };
    rec.onerror = () => setListening(false);
    rec.onend = () => setListening(false);
    recognitionRef.current = rec;
    return () => { rec.abort(); };
  }, []);

  const toggleVoice = () => {
    if (!recognitionRef.current) {
      toast.info('Voice input is not supported in this browser. Try Chrome or Edge.');
      return;
    }
    if (listening) {
      recognitionRef.current.stop();
      setListening(false);
    } else {
      recognitionRef.current.start();
      setListening(true);
      toast.info('Listening... Speak now.');
    }
  };

  const handleFileSelect = (e) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    setAttachments((prev) => [...prev, ...files.map((f) => ({ id: `${f.name}-${Date.now()}`, name: f.name, file: f }))]);
    e.target.value = '';
  };

  const removeAttachment = (id) => setAttachments((prev) => prev.filter((a) => a.id !== id));

  // Scroll to bottom when messages/typing changes
  useEffect(() => {
    if (open && panelTab === 'chat') messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing, open, panelTab]);

  // Focus textarea when panel opens on chat tab
  useEffect(() => {
    if (open && panelTab === 'chat') setTimeout(() => inputRef.current?.focus(), 320);
  }, [open, panelTab]);

  const panelStyle = {
    position: 'fixed',
    top: 0,
    right: open ? 0 : (historyOpen ? '-730px' : '-510px'),
    width: historyOpen ? '730px' : '510px',
    height: `calc(100vh - ${LAYOUT.footerHeightPx}px)`,
    backgroundColor: C.surface,
    borderLeft: `1px solid ${C.border}`,
    boxShadow: open ? '-8px 0 40px rgba(0,0,0,0.6)' : 'none',
    zIndex: Z.overlay + 5,
    display: 'flex',
    flexDirection: 'column',
    transition: 'right 0.28s cubic-bezier(0.4, 0, 0.2, 1), width 0.2s ease',
    overflow: 'hidden',
    animation: open ? 'fadeIn 0.3s ease' : 'none',
  };

  return (
    <>
      {/* Backdrop */}
      {open && (
        <div
          onClick={onClose}
          style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: LAYOUT.footerHeightPx ? `${LAYOUT.footerHeightPx}px` : 0, backgroundColor: 'rgba(7,13,9,0.55)', zIndex: Z.overlay + 4 }}
        />
      )}

      {/* Slide-in panel */}
      <div style={panelStyle}>
        {/* Panel header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: `0 ${S[4]}`, height: '52px', borderBottom: `1px solid ${C.border}`, flexShrink: 0, backgroundColor: C.surface2 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: S[2] }}>
            <button
              type="button"
              onClick={() => setHistoryOpen((v) => !v)}
              title={historyOpen ? 'Close history' : 'History & projects'}
              style={{ width: '28px', height: '28px', backgroundColor: historyOpen ? C.primaryGlow : 'transparent', border: `1px solid ${historyOpen ? C.primary : C.border}`, borderRadius: R.button, color: historyOpen ? C.primary : C.textSecondary, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M2 2h10v2H2V2ZM2 6h10v2H2V6ZM2 10h6v2H2v-2Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
              </svg>
            </button>
            <FreyaLogo size={26} />
            <div>
              <div style={{ fontFamily: F.display, fontSize: '14px', fontWeight: 700, color: C.textPrimary, lineHeight: 1 }}>Freya</div>
              <div style={{ fontFamily: F.body, fontSize: '11px', color: C.primary, lineHeight: 1, marginTop: '2px' }}>AI Co-pilot · Online</div>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{ width: '28px', height: '28px', backgroundColor: 'transparent', border: 'none', color: C.textSecondary, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: R.button }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {/* Tab bar */}
        <div style={{
          display: 'flex', borderBottom: `1px solid ${C.border}`,
          flexShrink: 0, backgroundColor: C.surface2,
        }}>
          {PANEL_TABS.map((tab) => {
            const active = panelTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setPanelTab(tab.id)}
                style={{
                  flex: 1, padding: `${S[2]} 0`,
                  fontFamily: F.body, fontSize: '12px', fontWeight: active ? 700 : 500,
                  color: active ? C.primary : C.textMuted,
                  backgroundColor: 'transparent', border: 'none',
                  borderBottom: `2px solid ${active ? C.primary : 'transparent'}`,
                  cursor: 'pointer', transition: T.color,
                  marginBottom: '-1px',
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '4px',
                }}
              >
                {tab.label}
                {tab.badgeCount > 0 && (
                  <span style={{ fontFamily: F.mono, fontSize: '9px', fontWeight: 700, padding: '1px 5px', borderRadius: R.pill, backgroundColor: 'rgba(239,68,68,0.2)', color: C.red, border: '1px solid rgba(239,68,68,0.3)', lineHeight: 1.4 }}>{tab.badgeCount}</span>
                )}
              </button>
            );
          })}
        </div>

        <div style={{ flex: 1, display: 'flex', minHeight: 0, overflow: 'hidden' }}>
          {historyOpen && panelTab === 'chat' && (
            <div style={{ width: '180px', flexShrink: 0 }}>
              <AriaPanelHistory
                onSelectChat={handleSelectChat}
                onNewChat={handleNewChat}
                onClose={() => setHistoryOpen(false)}
              />
            </div>
          )}

          {/* Chat tab */}
          {panelTab === 'chat' && (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, overflow: 'hidden' }}>
              {/* Quick action chips */}
              <div style={{ padding: `${S[2]} ${S[4]}`, borderBottom: `1px solid ${C.border}`, display: 'flex', gap: '6px', flexWrap: 'wrap', flexShrink: 0, backgroundColor: C.surface }}>
                {actions.map((a) => (
                  <button
                    key={a}
                    onClick={() => sendMessage(a)}
                    style={{ padding: '4px 10px', backgroundColor: C.surface3, color: C.textSecondary, border: `1px solid ${C.border}`, borderRadius: R.pill, fontFamily: F.body, fontSize: '11px', fontWeight: 500, cursor: 'pointer', transition: T.color, whiteSpace: 'nowrap' }}
                  >
                    {a}
                  </button>
                ))}
              </div>

              {/* Messages */}
              <div style={{ flex: 1, overflowY: 'auto', padding: `${S[4]}`, display: 'flex', flexDirection: 'column', gap: '10px', scrollbarWidth: 'thin', scrollbarColor: `${C.border} transparent` }}>
                {messages.map((msg) => (
                  <MessageBubble key={msg.id} msg={msg} toast={toast}/>
                ))}
                {typing && <TypingIndicator/>}
                <div ref={messagesEndRef}/>
              </div>

              {/* Input area */}
              <div
                style={{
                  padding: `${S[3]} ${S[4]} ${Math.max(LAYOUT.footerHeightPx, 48)}px ${S[4]}`,
                  borderTop: `1px solid ${C.border}`,
                  backgroundColor: C.surface2,
                  flexShrink: 0,
                }}
              >
                {attachments.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '8px' }}>
                    {attachments.map((a) => (
                      <span
                        key={a.id}
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '4px 8px', backgroundColor: C.bg, border: `1px solid ${C.border}`, borderRadius: R.pill, fontFamily: F.body, fontSize: '11px', color: C.textSecondary }}
                      >
                        <svg width="12" height="12" viewBox="0 0 14 14"><path d="M4 2h7l4 4v10H4V2Z" fill="none" stroke="currentColor" strokeWidth="1.2"/></svg>
                        {a.name}
                        <button type="button" onClick={() => removeAttachment(a.id)} style={{ marginLeft: '2px', padding: 0, border: 'none', background: 'transparent', color: C.textMuted, cursor: 'pointer', display: 'flex' }} aria-label="Remove">
                          <svg width="12" height="12" viewBox="0 0 14 14"><path d="M3 3l8 8M11 3l-8 8" stroke="currentColor" strokeWidth="1.5"/></svg>
                        </button>
                      </span>
                    ))}
                  </div>
                )}
                <div style={{ display: 'flex', gap: '6px', alignItems: 'flex-end', minWidth: 0 }}>
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    onChange={handleFileSelect}
                    style={{ display: 'none' }}
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    title="Attach file"
                    style={{
                      width: '32px', height: '32px', minWidth: '32px',
                      backgroundColor: 'transparent', color: C.textMuted,
                      border: `1px solid ${C.border}`, borderRadius: R.button,
                      cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0, transition: T.color,
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = C.primary; e.currentTarget.style.borderColor = C.primary; }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = C.textMuted; e.currentTarget.style.borderColor = C.border; }}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/>
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={toggleVoice}
                    title={listening ? 'Stop listening' : 'Voice input'}
                    style={{
                      width: '32px', height: '32px', minWidth: '32px',
                      backgroundColor: listening ? C.red : 'transparent',
                      color: listening ? C.textInverse : C.textMuted,
                      border: `1px solid ${listening ? C.red : C.border}`,
                      borderRadius: R.button, cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0, transition: T.color,
                    }}
                    onMouseEnter={(e) => { if (!listening) { e.currentTarget.style.color = C.primary; e.currentTarget.style.borderColor = C.primary; } }}
                    onMouseLeave={(e) => { if (!listening) { e.currentTarget.style.color = C.textMuted; e.currentTarget.style.borderColor = C.border; } }}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 2a3 3 0 0 1 3 3v6a3 3 0 0 1-6 0V5a3 3 0 0 1 3-3z"/>
                      <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                      <line x1="12" y1="19" x2="12" y2="22"/>
                      <line x1="8" y1="22" x2="16" y2="22"/>
                    </svg>
                  </button>
                  <textarea
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(input); } }}
                    placeholder="Ask Freya anything..."
                    rows={2}
                    style={{
                      flex: 1, minWidth: 0,
                      backgroundColor: C.bg, color: C.textPrimary,
                      border: `1px solid ${C.border}`, borderRadius: R.input,
                      padding: `${S[2]} ${S[3]}`, fontFamily: F.body, fontSize: '13px',
                      resize: 'none', outline: 'none', lineHeight: '1.5',
                      scrollbarWidth: 'thin',
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => sendMessage(input)}
                    disabled={!input.trim() && !attachments.length}
                    style={{
                      width: '32px', height: '32px', minWidth: '32px',
                      backgroundColor: input.trim() || attachments.length ? C.primary : C.surface3,
                      color: input.trim() || attachments.length ? C.textInverse : C.textMuted,
                      border: 'none', borderRadius: R.button,
                      cursor: input.trim() || attachments.length ? 'pointer' : 'not-allowed',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0, transition: T.base,
                    }}
                  >
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M2 7h10M7 2l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Agents tab */}
          {panelTab === 'agents' && (
            <AgentsTab toast={toast} />
          )}

          {/* Workflows tab */}
          {panelTab === 'workflows' && (
            <WorkflowsTab toast={toast} />
          )}

          {/* Approvals tab */}
          {panelTab === 'approvals' && (
            <ApprovalsTab toast={toast} />
          )}
        </div>
      </div>

      {/* Float button (when panel is closed) */}
      <AriaFloatBtn open={open} onOpen={onOpen} onSend={sendMessage} page={page} />
    </>
  );
}
