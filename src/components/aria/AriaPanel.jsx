import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { C, F, R, S, T, shadows, Z } from '../../tokens';

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
    type: 'confirm',
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
    actions: [{ label: 'Open Inbox', path: '/inbox' }],
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
    text: "I'm ARIA — your AI co-pilot. I can monitor campaign performance, flag anomalies, draft content, manage escalations, and answer questions about your data. Try asking me about any page you're on.",
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

function MiniContent({ variant }) {
  return (
    <div style={{ marginTop: '8px', padding: '10px 12px', backgroundColor: C.bg, borderRadius: R.md, border: `1px solid ${C.border}` }}>
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
function MessageBubble({ msg }) {
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
        <div style={{ fontFamily: F.mono, fontSize: '10px', fontWeight: 700, color: C.primary, marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>ARIA</div>
      )}
      <div>{formatText(msg.text)}</div>
      {msg.type === 'alerts'  && <MiniAlerts  data={msg.data}/>}
      {msg.type === 'table'   && <MiniTable   headers={msg.headers} rows={msg.rows}/>}
      {msg.type === 'stats'   && <MiniStats   data={msg.data}/>}
      {msg.type === 'funnel'  && <MiniFunnel  stages={msg.stages}/>}
      {msg.type === 'content' && <MiniContent variant={msg.variant}/>}
      {msg.type === 'confirm' && (
        <MiniConfirm
          confirmLabel={msg.confirmLabel}
          cancelLabel={msg.cancelLabel}
          confirmPath={msg.confirmPath}
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
function AriaFloatBtn({ open, onOpen, onSend, page }) {
  const [hovered, setHovered] = useState(false);
  const actions = getActions(page);
  if (open) return null;

  const fabStyle = {
    width: '52px',
    height: '52px',
    borderRadius: '50%',
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
      style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: Z.overlay + 10, display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {hovered && (
        <FloatChips
          actions={actions}
          onSend={(a) => { onOpen(); setTimeout(() => onSend(a), 150); }}
        />
      )}
      <button style={fabStyle} onClick={onOpen} title="Ask ARIA">
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
          <circle cx="11" cy="11" r="9"   stroke="currentColor" strokeWidth="1.5"/>
          <circle cx="11" cy="11" r="3.5" stroke="currentColor" strokeWidth="1.5"/>
          <path d="M11 2v3M11 17v3M2 11h3M17 11h3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      </button>
    </div>
  );
}

// ── ARIA Panel (slide-in drawer) ──────────────
const WELCOME = {
  role: 'aria',
  id: 'welcome',
  text: "Hi, I'm **ARIA** — your AI co-pilot. I monitor your campaigns, explain performance data, draft content, and take actions on your behalf. What would you like to do?",
  type: 'text',
};

export default function AriaPanel({ open, onOpen, onClose, page }) {
  const [messages, setMessages] = useState([WELCOME]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const actions = getActions(page ?? '/');

  // External send (from float chips)
  const sendMessage = (text) => {
    if (!text.trim()) return;
    setMessages((m) => [...m, { role: 'user', id: Date.now(), text }]);
    setInput('');
    setTyping(true);
    setTimeout(() => {
      const resp = getResponse(text);
      setTyping(false);
      setMessages((m) => [...m, { role: 'aria', id: Date.now() + 1, ...resp }]);
    }, 1100);
  };

  // Scroll to bottom whenever messages/typing changes
  useEffect(() => {
    if (open) messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing, open]);

  // Focus textarea when panel opens
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 320);
  }, [open]);

  const panelStyle = {
    position: 'fixed',
    top: 0,
    right: open ? 0 : '-410px',
    width: '390px',
    height: '100vh',
    backgroundColor: C.surface,
    borderLeft: `1px solid ${C.border}`,
    boxShadow: open ? '-8px 0 40px rgba(0,0,0,0.6)' : 'none',
    zIndex: Z.overlay + 5,
    display: 'flex',
    flexDirection: 'column',
    transition: 'right 0.28s cubic-bezier(0.4, 0, 0.2, 1)',
    overflow: 'hidden',
  };

  return (
    <>
      {/* Backdrop */}
      {open && (
        <div
          onClick={onClose}
          style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(7,13,9,0.55)', zIndex: Z.overlay + 4 }}
        />
      )}

      {/* Slide-in panel */}
      <div style={panelStyle}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: `0 ${S[4]}`, height: '52px', borderBottom: `1px solid ${C.border}`, flexShrink: 0, backgroundColor: C.surface2 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: S[2] }}>
            <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: C.primaryGlow, border: `1.5px solid ${C.primary}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <circle cx="7" cy="7" r="5.5" stroke={C.primary} strokeWidth="1.2"/>
                <circle cx="7" cy="7" r="2"   stroke={C.primary} strokeWidth="1.2"/>
                <path d="M7 1.5v2M7 10.5v2M1.5 7h2M10.5 7h2" stroke={C.primary} strokeWidth="1.2" strokeLinecap="round"/>
              </svg>
            </div>
            <div>
              <div style={{ fontFamily: F.display, fontSize: '14px', fontWeight: 700, color: C.textPrimary, lineHeight: 1 }}>ARIA</div>
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
            <MessageBubble key={msg.id} msg={msg}/>
          ))}
          {typing && <TypingIndicator/>}
          <div ref={messagesEndRef}/>
        </div>

        {/* Input area */}
        <div style={{ padding: `${S[3]} ${S[4]}`, borderTop: `1px solid ${C.border}`, backgroundColor: C.surface2, flexShrink: 0 }}>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-end' }}>
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(input); } }}
              placeholder="Ask ARIA anything..."
              rows={2}
              style={{ flex: 1, backgroundColor: C.bg, color: C.textPrimary, border: `1px solid ${C.border}`, borderRadius: R.md, padding: '8px 10px', fontFamily: F.body, fontSize: '13px', resize: 'none', outline: 'none', lineHeight: 1.5, scrollbarWidth: 'thin' }}
            />
            <button
              onClick={() => sendMessage(input)}
              disabled={!input.trim()}
              style={{ width: '36px', height: '36px', backgroundColor: input.trim() ? C.primary : C.surface3, color: input.trim() ? C.textInverse : C.textMuted, border: 'none', borderRadius: R.button, cursor: input.trim() ? 'pointer' : 'default', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: T.color }}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M1 7h12M8 2l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
          <div style={{ fontFamily: F.body, fontSize: '10px', color: C.textMuted, marginTop: '6px', textAlign: 'center' }}>
            Enter to send · Shift+Enter for new line · Responses are simulated
          </div>
        </div>
      </div>

      {/* Float button (only shown when panel is closed) */}
      <AriaFloatBtn open={open} onOpen={onOpen} onSend={sendMessage} page={page ?? '/'}/>
    </>
  );
}
