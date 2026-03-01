import { useState, useRef, useEffect } from 'react';
import { C, F, R, S, T, btn } from '../../tokens';

const MENTION_SUGGESTIONS = [
  { id: 'aria',   label: 'ARIA',              desc: 'AI system' },
  { id: 'jd',     label: 'James D.',           desc: 'Account Executive' },
  { id: 'ln',     label: 'Linh N.',            desc: 'Campaign Manager' },
  { id: 'sk',     label: 'Sarah K.',           desc: 'Strategist' },
  { id: 'budget', label: 'Budget Guardian',    desc: 'Agent' },
  { id: 'email',  label: 'Email Sequencer',    desc: 'Agent' },
];

const CONTENT_SAMPLES = [
  { id: 'cl1', name: 'CFO Q2 — Touch 1: Cold Intro', type: 'Email' },
  { id: 'cl3', name: 'Acme CFO LinkedIn Carousel',  type: 'LinkedIn Ad' },
  { id: 'cl7', name: 'Finance Automation Blog Post', type: 'Blog' },
];

export default function MessageComposer({ onSend }) {
  const [body, setBody]         = useState('');
  const [mentionOpen, setMentionOpen] = useState(false);
  const [mentionQ, setMentionQ]   = useState('');
  const [taskOpen, setTaskOpen]   = useState(false);
  const [contentOpen, setContentOpen] = useState(false);
  const [task, setTask]           = useState({ title: '', assignee: '', dueDate: '' });
  const textareaRef = useRef(null);

  // Detect "@" in body
  useEffect(() => {
    const match = body.match(/@(\w*)$/);
    if (match) {
      setMentionQ(match[1]);
      setMentionOpen(true);
    } else {
      setMentionOpen(false);
      setMentionQ('');
    }
  }, [body]);

  const filteredMentions = MENTION_SUGGESTIONS.filter((m) =>
    m.label.toLowerCase().includes(mentionQ.toLowerCase())
  );

  const insertMention = (m) => {
    setBody((prev) => prev.replace(/@\w*$/, `@${m.label} `));
    setMentionOpen(false);
    textareaRef.current?.focus();
  };

  const handleSend = () => {
    if (!body.trim() && !taskOpen) return;
    onSend({
      body: body.trim(),
      task: taskOpen && task.title.trim() ? { ...task } : null,
    });
    setBody('');
    setTask({ title: '', assignee: '', dueDate: '' });
    setTaskOpen(false);
    setContentOpen(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleSend();
    }
    if (e.key === 'Escape') {
      setMentionOpen(false);
      setContentOpen(false);
    }
  };

  const attachContent = (item) => {
    onSend({ body: body.trim() || null, contentRef: item });
    setBody('');
    setContentOpen(false);
  };

  return (
    <div style={{
      borderTop: `1px solid ${C.border}`,
      backgroundColor: C.surface,
      flexShrink: 0,
    }}>

      {/* Task form */}
      {taskOpen && (
        <div style={{ padding: `${S[3]} ${S[4]}`, borderBottom: `1px solid ${C.border}`, backgroundColor: C.surface2 }}>
          <div style={{ display: 'flex', gap: S[2], alignItems: 'center', marginBottom: S[2] }}>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <rect x="1.5" y="1.5" width="9" height="9" rx="1.5" stroke={C.amber} strokeWidth="1.2"/>
              <path d="M3.5 6l2 2 3-3" stroke={C.amber} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span style={{ fontFamily: F.mono, fontSize: '11px', fontWeight: 700, color: C.amber, textTransform: 'uppercase', letterSpacing: '0.05em' }}>New Task</span>
            <button onClick={() => setTaskOpen(false)} style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: C.textMuted, display: 'flex', padding: 0 }}>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 2l8 8M10 2L2 10" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>
            </button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto auto', gap: S[2] }}>
            <input
              autoFocus
              value={task.title}
              onChange={(e) => setTask((t) => ({ ...t, title: e.target.value }))}
              placeholder="Task description…"
              style={{ backgroundColor: C.surface, color: C.textPrimary, border: `1px solid ${C.border}`, borderRadius: R.input, padding: `${S[2]} ${S[3]}`, fontFamily: F.body, fontSize: '12px', outline: 'none' }}
            />
            <input
              value={task.assignee}
              onChange={(e) => setTask((t) => ({ ...t, assignee: e.target.value }))}
              placeholder="Assign to…"
              style={{ width: '110px', backgroundColor: C.surface, color: C.textPrimary, border: `1px solid ${C.border}`, borderRadius: R.input, padding: `${S[2]} ${S[3]}`, fontFamily: F.body, fontSize: '12px', outline: 'none' }}
            />
            <input
              type="date"
              value={task.dueDate}
              onChange={(e) => setTask((t) => ({ ...t, dueDate: e.target.value }))}
              style={{ width: '130px', backgroundColor: C.surface, color: C.textPrimary, border: `1px solid ${C.border}`, borderRadius: R.input, padding: `${S[2]} ${S[3]}`, fontFamily: F.body, fontSize: '12px', outline: 'none' }}
            />
          </div>
        </div>
      )}

      {/* Content picker */}
      {contentOpen && (
        <div style={{ padding: `${S[3]} ${S[4]}`, borderBottom: `1px solid ${C.border}`, backgroundColor: C.surface2 }}>
          <div style={{ fontFamily: F.mono, fontSize: '10px', fontWeight: 700, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: S[2] }}>
            Attach Content
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: S[2] }}>
            {CONTENT_SAMPLES.map((item) => (
              <div key={item.id}
                onClick={() => attachContent(item)}
                style={{ display: 'flex', gap: S[2], alignItems: 'center', padding: `${S[2]} ${S[3]}`, borderRadius: R.md, cursor: 'pointer', backgroundColor: C.surface, border: `1px solid ${C.border}`, transition: T.color }}>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 1h6l3 3v7a1 1 0 01-1 1H2a1 1 0 01-1-1V2a1 1 0 011-1z" stroke={C.primary} strokeWidth="1.2"/></svg>
                <span style={{ fontFamily: F.mono, fontSize: '10px', color: C.primary }}>{item.type}</span>
                <span style={{ fontFamily: F.body, fontSize: '12px', color: C.textPrimary }}>{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Mention dropdown */}
      {mentionOpen && filteredMentions.length > 0 && (
        <div style={{
          position: 'absolute', bottom: '100%', left: S[4],
          backgroundColor: C.surface, border: `1px solid ${C.border}`,
          borderRadius: R.md, boxShadow: '0 4px 16px rgba(0,0,0,0.5)',
          minWidth: '200px', zIndex: 100, overflow: 'hidden',
        }}>
          {filteredMentions.map((m) => (
            <div key={m.id}
              onMouseDown={(e) => { e.preventDefault(); insertMention(m); }}
              style={{ display: 'flex', gap: S[2], alignItems: 'center', padding: `${S[2]} ${S[3]}`, cursor: 'pointer', transition: T.color }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = C.surface2}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <span style={{ fontFamily: F.body, fontSize: '13px', fontWeight: 600, color: C.textPrimary }}>@{m.label}</span>
              <span style={{ fontFamily: F.body, fontSize: '11px', color: C.textMuted }}>{m.desc}</span>
            </div>
          ))}
        </div>
      )}

      {/* Composer input */}
      <div style={{ padding: S[4], position: 'relative' }}>
        <textarea
          ref={textareaRef}
          value={body}
          onChange={(e) => setBody(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Write a message… (Ctrl+Enter to send, @ to mention)"
          rows={3}
          style={{
            width: '100%', boxSizing: 'border-box', resize: 'none',
            backgroundColor: C.surface2, color: C.textPrimary,
            border: `1px solid ${C.border}`, borderRadius: R.md,
            padding: `${S[3]} ${S[3]}`, fontFamily: F.body, fontSize: '13px',
            outline: 'none', lineHeight: '1.6',
          }}
        />

        {/* Toolbar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: S[2] }}>
          <div style={{ display: 'flex', gap: S[2] }}>
            {/* Create task */}
            <button
              style={{
                ...btn.ghost, fontSize: '12px', padding: `${S[1]} ${S[2]}`,
                color: taskOpen ? C.amber : C.textMuted,
                backgroundColor: taskOpen ? C.amberDim : 'transparent',
              }}
              onClick={() => { setTaskOpen((o) => !o); setContentOpen(false); }}
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <rect x="1.5" y="1.5" width="9" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.2"/>
                <path d="M3.5 6l2 2 3-3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Task
            </button>

            {/* Attach content */}
            <button
              style={{
                ...btn.ghost, fontSize: '12px', padding: `${S[1]} ${S[2]}`,
                color: contentOpen ? C.primary : C.textMuted,
                backgroundColor: contentOpen ? C.primaryGlow : 'transparent',
              }}
              onClick={() => { setContentOpen((o) => !o); setTaskOpen(false); }}
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M2 1h5l3 3v7a1 1 0 01-1 1H2a1 1 0 01-1-1V2a1 1 0 011-1z" stroke="currentColor" strokeWidth="1.2"/>
                <path d="M7 1v3h3" stroke="currentColor" strokeWidth="1.2"/>
              </svg>
              Attach
            </button>
          </div>

          {/* Send */}
          <button
            style={{ ...btn.primary, fontSize: '12px', padding: `${S[1]} ${S[4]}` }}
            onClick={handleSend}
          >
            Send
            <svg width="11" height="11" viewBox="0 0 11 11" fill="none" style={{ marginLeft: '3px' }}>
              <path d="M1 5.5h8M6.5 2.5l3 3-3 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
