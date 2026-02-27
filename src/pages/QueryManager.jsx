import { useState } from 'react';
import { C, F, S } from '../tokens';
import useToast from '../hooks/useToast';
import ThreadList from '../components/querymanager/ThreadList';
import MessageThread from '../components/querymanager/MessageThread';
import MessageComposer from '../components/querymanager/MessageComposer';
import NewThreadModal from '../components/querymanager/NewThreadModal';

/* ─── Mock data ───────────────────────────────────────────── */
const INIT_THREADS = [
  { id: 't1', type: 'Campaigns', name: 'Acme VN CFO Q2 — Campaign Review', lastMsg: 'ARIA: Campaign hitting 160% of MQL target...', time: '2:34 PM', unread: 3, tags: ['acme', 'cfq2', 'q2-2025'], participants: ['JD', 'LN', 'ARIA'] },
  { id: 't2', type: 'Campaigns', name: 'SEA Demand Gen — Budget Discussion', lastMsg: 'Sarah: I think we should reallocate to email...', time: 'Yesterday', unread: 0, tags: ['sea-corp', 'budget'], participants: ['SK', 'JD'] },
  { id: 't3', type: 'Campaigns', name: 'APAC Brand Awareness — Q1 Review', lastMsg: 'ARIA: Branded search up 34% vs 40% target', time: 'Feb 20', unread: 0, tags: ['apac', 'brand'], participants: ['LN', 'ARIA'] },
  { id: 't4', type: 'Tasks', name: 'Update ICP scoring model for Vietnam', lastMsg: 'Assigned to Linh N. · Due Feb 28', time: '11:22 AM', unread: 1, tags: ['icp', 'vietnam'], participants: ['LN', 'JD'] },
  { id: 't5', type: 'Tasks', name: 'Review Q2 proposal for SEA Corp', lastMsg: 'James: Draft is in the shared drive', time: 'Feb 18', unread: 0, tags: ['sea-corp', 'proposal'], participants: ['JD', 'SK'] },
  { id: 't6', type: 'Clients', name: 'Acme VN — Onboarding Checklist', lastMsg: 'ARIA: KB docs uploaded and indexed', time: 'Feb 15', unread: 2, tags: ['acme', 'onboarding'], participants: ['JD', 'LN', 'ARIA'] },
  { id: 't7', type: 'Clients', name: 'SEA Corp — Kickoff Notes', lastMsg: 'Sarah: Follow-up call booked for March 5', time: 'Feb 12', unread: 0, tags: ['sea-corp'], participants: ['SK', 'JD'] },
  { id: 't8', type: 'Agents', name: 'Email Sequencer — Config Update Request', lastMsg: 'ARIA: Config change pending approval', time: '9:01 AM', unread: 0, tags: ['email-sequencer', 'config'], participants: ['ARIA', 'LN'] },
  { id: 't9', type: 'Announcements', name: 'Platform Update — February 2025', lastMsg: 'NEXARA: New agent capabilities released', time: 'Feb 1', unread: 1, tags: ['platform', 'update'], participants: ['ARIA'] },
];

const INIT_MESSAGES = {
  t1: [
    { id: 'm1', threadId: 't1', type: 'human', author: 'James D.', avatar: 'JD', time: '9:00 AM', date: 'Feb 19, 2025', body: 'Quick check-in on the Acme CFO campaign. Where are we vs targets?' },
    { id: 'm2', threadId: 't1', type: 'aria', author: 'ARIA', time: '9:01 AM', date: 'Feb 19, 2025', body: 'Campaign Update — Acme VN CFO Q2 as of Feb 19:\n\n• MQLs: 24 / 15 target (160% ✓)\n• Budget consumed: $7,820 / $8,500 (92%)\n• Top performing channel: Email (CPL $225 vs LinkedIn $267)\n• Pipeline value: $1.4M\n\nAction needed: Budget Guardian has escalated a spend warning.' },
    { id: 'm3', threadId: 't1', type: 'escalation', author: 'ARIA', avatar: 'ARIA', time: '9:02 AM', date: 'Feb 19, 2025', body: 'Budget running low — decision needed.', escalationRef: { id: 'e1', title: 'Campaign budget 92% consumed — 19 days remaining', severity: 'High' } },
    { id: 'm4', threadId: 't1', type: 'human', author: 'Linh N.', avatar: 'LN', time: '10:15 AM', date: 'Feb 19, 2025', body: 'I say we approve the top-up. The MQL quality is great — 11 of 24 are stage 2 SQL.' },
    { id: 'm5', threadId: 't1', type: 'task', author: 'James D.', avatar: 'JD', time: '10:20 AM', date: 'Feb 19, 2025', task: { title: 'Get client approval for $2,000 budget top-up', assignee: 'James D.', dueDate: 'Feb 21', done: false } },
    { id: 'm6', threadId: 't1', type: 'content', author: 'Linh N.', avatar: 'LN', time: '2:30 PM', date: 'Feb 19, 2025', body: 'Attaching touch-4 for review before we approve:', contentRef: { id: 'cl4', name: 'CFO Q2 — Touch 4: CFO Case Study', type: 'Email' } },
    { id: 'm7', threadId: 't1', type: 'aria', author: 'ARIA', time: '2:34 PM', date: 'Feb 19, 2025', body: "Campaign hitting 160% of MQL target. Email CPL trending down — sequence is outperforming forecast.\n\nToday's stats: 3 new replies, 1 demo booked (Helen Tan, Dragon Capital). Next touch due for 12 prospects tomorrow." },
  ],
  t4: [
    { id: 'm10', threadId: 't4', type: 'human', author: 'James D.', avatar: 'JD', time: '10:00 AM', date: 'Feb 21, 2025', body: 'Linh, can you own the ICP model update? Focus on the Vietnam manufacturing signal ARIA identified.' },
    { id: 'm11', threadId: 't4', type: 'task', author: 'James D.', avatar: 'JD', time: '10:01 AM', date: 'Feb 21, 2025', task: { title: 'Update ICP scoring model — add Vietnam ERP RFP signal', assignee: 'Linh N.', dueDate: 'Feb 28', done: false } },
    { id: 'm12', threadId: 't4', type: 'human', author: 'Linh N.', avatar: 'LN', time: '11:22 AM', date: 'Feb 21, 2025', body: "On it. I'll also check if we can pull the \"recent funding\" signal from LinkedIn data. Should have a draft config by EOW." },
  ],
  t6: [
    { id: 'm20', threadId: 't6', type: 'aria', author: 'ARIA', time: '3:00 PM', date: 'Feb 14, 2025', body: 'Acme VN onboarding initiated. KB docs have been uploaded and indexed:\n\n✓ Acme VN Company Brief\n✓ CFO Persona Card\n✓ Competitor Analysis\n\nCampaign agents are briefed and ready to launch once the campaign brief is approved.' },
    { id: 'm21', threadId: 't6', type: 'human', author: 'James D.', avatar: 'JD', time: '3:15 PM', date: 'Feb 14, 2025', body: 'Great. Also need to get the CFO Pain Point Research into the KB — Linh do you have that doc?' },
    { id: 'm22', threadId: 't6', type: 'human', author: 'Linh N.', avatar: 'LN', time: '9:30 AM', date: 'Feb 15, 2025', body: 'Uploaded — ARIA should have it now.' },
    { id: 'm23', threadId: 't6', type: 'aria', author: 'ARIA', time: '9:31 AM', date: 'Feb 15, 2025', body: 'CFO Pain Point Research indexed. ✓\n\nNew insight: 63% of surveyed CFOs report close cycle >7 days. Adding to ICP scoring — companies with manual close cycle now score +15 points.' },
  ],
  t9: [
    { id: 'm30', threadId: 't9', type: 'aria', author: 'ARIA', time: '9:00 AM', date: 'Feb 1, 2025', body: 'NEXARA Platform Update — February 2025\n\nNew capabilities now live:\n\n1. Insight Engine v2 — now surfaces competitive signals from LinkedIn activity\n2. Budget Guardian — real-time spend tracking with configurable alerts\n3. Content Library — multi-type preview with brand scoring\n4. Knowledge Base — drag-and-drop upload with ARIA auto-tagging\n\nAll agents have been updated. No action required from your team.' },
  ],
};

export default function QueryManager() {
  const toast = useToast();

  const [threads, setThreads]       = useState(INIT_THREADS);
  const [messages, setMessages]     = useState(INIT_MESSAGES);
  const [selectedId, setSelectedId] = useState('t1');
  const [showNew, setShowNew]       = useState(false);

  const selectedThread = threads.find((t) => t.id === selectedId) ?? null;
  const threadMessages = messages[selectedId] ?? [];

  const handleSelectThread = (id) => {
    setSelectedId(id);
    setThreads((prev) => prev.map((t) => t.id === id ? { ...t, unread: 0 } : t));
  };

  const handleSend = ({ body, task, contentRef }) => {
    if (!selectedId) return;
    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    const dateStr = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

    const newMsgs = [];
    if (body || (!task && !contentRef)) {
      newMsgs.push({ id: `m${Date.now()}`, threadId: selectedId, type: 'human', author: 'James D.', avatar: 'JD', time: timeStr, date: dateStr, body: body || '' });
    }
    if (task?.title?.trim()) {
      newMsgs.push({ id: `m${Date.now() + 1}`, threadId: selectedId, type: 'task', author: 'James D.', avatar: 'JD', time: timeStr, date: dateStr, task: { ...task, done: false } });
    }
    if (contentRef) {
      newMsgs.push({ id: `m${Date.now() + 2}`, threadId: selectedId, type: 'content', author: 'James D.', avatar: 'JD', time: timeStr, date: dateStr, body: body || null, contentRef });
    }
    if (!newMsgs.length) return;

    setMessages((prev) => ({ ...prev, [selectedId]: [...(prev[selectedId] ?? []), ...newMsgs] }));
    setThreads((prev) => prev.map((t) => t.id === selectedId
      ? { ...t, lastMsg: `James D.: ${newMsgs[0].body || newMsgs[0].task?.title || 'Attached content'}`, time: 'Just now' }
      : t
    ));
  };

  const handleTaskToggle = (msgId) => {
    setMessages((prev) => ({
      ...prev,
      [selectedId]: (prev[selectedId] ?? []).map((m) =>
        m.id === msgId && m.type === 'task' ? { ...m, task: { ...m.task, done: !m.task.done } } : m
      ),
    }));
  };

  const handleCreateThread = ({ name, type, tags }) => {
    const newThread = { id: `t${Date.now()}`, type, name, tags, lastMsg: 'Thread created', time: 'Just now', unread: 0, participants: ['JD'] };
    setThreads((prev) => [newThread, ...prev]);
    setSelectedId(newThread.id);
    toast.success(`Thread "${name}" created`);
  };

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: C.bg, overflow: 'hidden' }}>

      {/* Header */}
      <div style={{ padding: `${S[5]} ${S[6]} ${S[4]}`, flexShrink: 0, borderBottom: `1px solid #1C2E22` }}>
        <h1 style={{ fontFamily: 'Syne, sans-serif', fontSize: '22px', fontWeight: 800, color: C.textPrimary, margin: 0, letterSpacing: '-0.03em' }}>
          Query Manager
        </h1>
        <p style={{ fontFamily: F.body, fontSize: '12px', color: C.textSecondary, margin: `${S[1]} 0 0` }}>
          {threads.filter((t) => t.unread > 0).length > 0
            ? `${threads.reduce((s, t) => s + t.unread, 0)} unread messages`
            : 'All caught up'}
        </p>
      </div>

      {/* 2-panel */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

        {/* Thread list */}
        <div style={{ width: '300px', flexShrink: 0, borderRight: `1px solid #1C2E22`, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <ThreadList threads={threads} selectedId={selectedId} onSelect={handleSelectThread} onNewThread={() => setShowNew(true)} />
        </div>

        {/* Message area */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative' }}>
          <MessageThread thread={selectedThread} messages={threadMessages} onTaskToggle={handleTaskToggle} />
          {selectedThread && <MessageComposer onSend={handleSend} />}
        </div>
      </div>

      {showNew && <NewThreadModal onClose={() => setShowNew(false)} onCreate={handleCreateThread} />}
    </div>
  );
}
