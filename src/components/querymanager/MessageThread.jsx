import { useEffect, useRef } from 'react';
import { C, F, R, S, shadows } from '../../tokens';

/* ─── Avatars ─────────────────────────────────────────────── */
function Avatar({ initials, isAria = false, size = 28 }) {
  if (isAria) return (
    <div style={{ width: size, height: size, borderRadius: '50%', flexShrink: 0, backgroundColor: C.primaryGlow, border: `1.5px solid rgba(61,220,132,0.4)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg width={size * 0.55} height={size * 0.55} viewBox="0 0 14 14" fill="none">
        <circle cx="7" cy="7" r="6" stroke={C.primary} strokeWidth="1" strokeDasharray="2 1.5"/>
        <circle cx="7" cy="7" r="3" stroke={C.primary} strokeWidth="1"/>
        <circle cx="7" cy="7" r="1.2" fill={C.primary}/>
      </svg>
    </div>
  );
  return (
    <div style={{ width: size, height: size, borderRadius: '50%', flexShrink: 0, backgroundColor: C.surface3, border: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: F.mono, fontSize: Math.round(size * 0.35) + 'px', fontWeight: 700, color: C.textSecondary }}>
      {initials}
    </div>
  );
}

/* ─── Message components ──────────────────────────────────── */
function HumanMessage({ msg }) {
  return (
    <div style={{ display: 'flex', gap: S[3], alignItems: 'flex-start' }}>
      <Avatar initials={msg.avatar} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', gap: S[2], alignItems: 'baseline', marginBottom: '4px' }}>
          <span style={{ fontFamily: F.body, fontSize: '13px', fontWeight: 700, color: C.textPrimary }}>{msg.author}</span>
          <span style={{ fontFamily: F.mono, fontSize: '10px', color: C.textMuted }}>{msg.time}</span>
        </div>
        <p style={{ fontFamily: F.body, fontSize: '13px', color: C.textSecondary, margin: 0, lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>{msg.body}</p>
      </div>
    </div>
  );
}

function AriaMessage({ msg }) {
  return (
    <div style={{ display: 'flex', gap: S[3], alignItems: 'flex-start', borderLeft: `2px solid ${C.primary}`, paddingLeft: S[3] }}>
      <Avatar isAria={true} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', gap: S[2], alignItems: 'baseline', marginBottom: '4px' }}>
          <span style={{ fontFamily: F.mono, fontSize: '12px', fontWeight: 700, color: C.primary }}>ARIA</span>
          <span style={{ fontFamily: F.mono, fontSize: '10px', color: C.textMuted }}>{msg.time}</span>
        </div>
        <div style={{ fontFamily: F.body, fontSize: '13px', color: C.textSecondary, lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>{msg.body}</div>
      </div>
    </div>
  );
}

function TaskCard({ msg, onToggle }) {
  const { task } = msg;
  return (
    <div style={{ display: 'flex', gap: S[3], alignItems: 'flex-start' }}>
      <Avatar initials={msg.avatar ?? 'SY'} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', gap: S[2], alignItems: 'baseline', marginBottom: '4px' }}>
          <span style={{ fontFamily: F.body, fontSize: '13px', fontWeight: 700, color: C.textPrimary }}>{msg.author}</span>
          <span style={{ fontFamily: F.mono, fontSize: '10px', color: C.textMuted }}>created a task · {msg.time}</span>
        </div>
        <div style={{
          backgroundColor: C.surface2, border: `1px solid ${C.border}`,
          borderRadius: R.md, padding: S[3],
          display: 'flex', gap: S[3], alignItems: 'flex-start',
        }}>
          <div
            style={{
              width: '16px', height: '16px', borderRadius: '4px', flexShrink: 0, marginTop: '1px',
              border: `1.5px solid ${task.done ? C.primary : C.border}`,
              backgroundColor: task.done ? C.primary : 'transparent',
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
            onClick={() => onToggle(msg.id)}
          >
            {task.done && (
              <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
                <path d="M1.5 4.5l2.5 2.5 3.5-4" stroke={C.bg} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
          </div>
          <div>
            <div style={{ fontFamily: F.body, fontSize: '13px', fontWeight: 600, color: task.done ? C.textMuted : C.textPrimary, textDecoration: task.done ? 'line-through' : 'none' }}>
              {task.title}
            </div>
            <div style={{ display: 'flex', gap: S[3], marginTop: '4px' }}>
              {task.assignee && <span style={{ fontFamily: F.body, fontSize: '11px', color: C.textMuted }}>→ {task.assignee}</span>}
              {task.dueDate  && <span style={{ fontFamily: F.mono, fontSize: '10px', color: C.amber }}>Due {task.dueDate}</span>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function EscalationCard({ msg }) {
  const { escalationRef: esc } = msg;
  const sevColor = { High: '#EF4444', Medium: C.amber, Low: C.primary }[esc.severity] ?? C.textMuted;
  return (
    <div style={{ display: 'flex', gap: S[3], alignItems: 'flex-start' }}>
      <Avatar isAria={true} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', gap: S[2], alignItems: 'baseline', marginBottom: '4px' }}>
          <span style={{ fontFamily: F.mono, fontSize: '12px', fontWeight: 700, color: C.primary }}>ARIA</span>
          <span style={{ fontFamily: F.mono, fontSize: '10px', color: C.textMuted }}>escalation reference · {msg.time}</span>
        </div>
        <div style={{
          backgroundColor: C.surface2, border: `1px solid ${sevColor}33`,
          borderRadius: R.md, padding: S[3],
          borderLeft: `3px solid ${sevColor}`,
        }}>
          <div style={{ display: 'flex', gap: S[2], alignItems: 'center', marginBottom: '4px' }}>
            <span style={{ fontFamily: F.mono, fontSize: '10px', fontWeight: 700, color: sevColor, backgroundColor: `${sevColor}18`, border: `1px solid ${sevColor}30`, borderRadius: R.pill, padding: '1px 7px' }}>
              {esc.severity}
            </span>
            <span style={{ fontFamily: F.mono, fontSize: '10px', color: C.textMuted }}>Escalation</span>
          </div>
          <div style={{ fontFamily: F.body, fontSize: '12px', fontWeight: 600, color: C.textPrimary }}>{esc.title}</div>
          {msg.body && <div style={{ fontFamily: F.body, fontSize: '12px', color: C.textMuted, marginTop: '4px' }}>{msg.body}</div>}
        </div>
      </div>
    </div>
  );
}

function ContentCard({ msg }) {
  const { contentRef } = msg;
  const TYPE_COLORS = {
    'Email': C.primary, 'LinkedIn Ad': '#0A66C2', 'Meta Ad': '#1877F2',
    'SEO Article': C.amber, 'Blog': '#A78BFA', 'Landing Page': '#F472B6',
  };
  const color = TYPE_COLORS[contentRef.type] ?? C.textSecondary;
  return (
    <div style={{ display: 'flex', gap: S[3], alignItems: 'flex-start' }}>
      <Avatar initials={msg.avatar ?? 'SY'} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', gap: S[2], alignItems: 'baseline', marginBottom: '4px' }}>
          <span style={{ fontFamily: F.body, fontSize: '13px', fontWeight: 700, color: C.textPrimary }}>{msg.author}</span>
          <span style={{ fontFamily: F.mono, fontSize: '10px', color: C.textMuted }}>attached content · {msg.time}</span>
        </div>
        {msg.body && <p style={{ fontFamily: F.body, fontSize: '13px', color: C.textSecondary, margin: `0 0 ${S[2]}`, lineHeight: '1.6' }}>{msg.body}</p>}
        <div style={{
          backgroundColor: C.surface2, border: `1px solid ${color}33`,
          borderRadius: R.md, padding: S[3], display: 'flex', gap: S[3], alignItems: 'center',
        }}>
          <div style={{ width: '28px', height: '28px', borderRadius: R.sm, backgroundColor: `${color}18`, border: `1px solid ${color}28`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
              <path d="M2 1h6l3 3v8a1 1 0 01-1 1H2a1 1 0 01-1-1V2a1 1 0 011-1z" stroke={color} strokeWidth="1.2"/>
              <path d="M8 1v3h3" stroke={color} strokeWidth="1.2"/>
            </svg>
          </div>
          <div>
            <div style={{ fontFamily: F.mono, fontSize: '10px', color, marginBottom: '2px' }}>{contentRef.type}</div>
            <div style={{ fontFamily: F.body, fontSize: '12px', fontWeight: 600, color: C.textPrimary }}>{contentRef.name}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Date divider ────────────────────────────────────────── */
function DateDivider({ date }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: S[3], margin: `${S[2]} 0` }}>
      <div style={{ flex: 1, height: '1px', backgroundColor: C.border }} />
      <span style={{ fontFamily: F.mono, fontSize: '10px', color: C.textMuted, whiteSpace: 'nowrap' }}>{date}</span>
      <div style={{ flex: 1, height: '1px', backgroundColor: C.border }} />
    </div>
  );
}

/* ─── MessageThread ───────────────────────────────────────── */
export default function MessageThread({ thread, messages, onTaskToggle }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!thread) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', flexDirection: 'column', gap: S[4] }}>
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
        <rect x="4" y="8" width="40" height="32" rx="6" stroke={C.textMuted} strokeWidth="1.5"/>
        <path d="M12 20h24M12 27h16" stroke={C.textMuted} strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
      <div style={{ fontFamily: F.body, fontSize: '14px', color: C.textMuted }}>Select a thread to start reading</div>
    </div>
  );

  const TYPE_COLORS_THREAD = { Campaigns: C.primary, Tasks: C.amber, Clients: '#A78BFA', Agents: '#60A5FA', Announcements: C.textSecondary };
  const typeColor = TYPE_COLORS_THREAD[thread.type] ?? C.textSecondary;

  let lastDate = null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>

      {/* Thread header */}
      <div style={{ padding: `${S[4]} ${S[5]}`, borderBottom: `1px solid ${C.border}`, flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: S[2] }}>
              <span style={{ fontFamily: F.mono, fontSize: '10px', fontWeight: 700, color: typeColor, backgroundColor: `${typeColor}14`, border: `1px solid ${typeColor}25`, borderRadius: R.pill, padding: '1px 7px' }}>
                {thread.type}
              </span>
              <h2 style={{ fontFamily: F.display, fontSize: '15px', fontWeight: 700, color: C.textPrimary, margin: 0 }}>
                {thread.name}
              </h2>
            </div>
            {thread.tags?.length > 0 && (
              <div style={{ display: 'flex', gap: '5px', marginTop: S[2], flexWrap: 'wrap' }}>
                {thread.tags.map((t) => (
                  <span key={t} style={{ fontFamily: F.mono, fontSize: '10px', color: C.textMuted, backgroundColor: C.surface2, border: `1px solid ${C.border}`, borderRadius: R.pill, padding: '1px 6px' }}>{t}</span>
                ))}
              </div>
            )}
          </div>

          {/* Participant avatar stack */}
          {thread.participants?.length > 0 && (
            <div style={{ display: 'flex' }}>
              {thread.participants.map((p, i) => (
                <div key={p} style={{ marginLeft: i > 0 ? '-6px' : 0, zIndex: thread.participants.length - i }}>
                  {p === 'ARIA' ? (
                    <div style={{ width: 26, height: 26, borderRadius: '50%', backgroundColor: C.primaryGlow, border: `2px solid ${C.surface}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <circle cx="6" cy="6" r="5" stroke={C.primary} strokeWidth="1" strokeDasharray="2 1.5"/>
                        <circle cx="6" cy="6" r="2.5" stroke={C.primary} strokeWidth="1"/>
                        <circle cx="6" cy="6" r="1" fill={C.primary}/>
                      </svg>
                    </div>
                  ) : (
                    <div style={{ width: 26, height: 26, borderRadius: '50%', backgroundColor: C.surface3, border: `2px solid ${C.surface}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: F.mono, fontSize: '9px', fontWeight: 700, color: C.textSecondary }}>
                      {p}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: `${S[4]} ${S[5]}`, display: 'flex', flexDirection: 'column', gap: S[4], scrollbarWidth: 'thin', scrollbarColor: `${C.border} transparent` }}>
        {messages.map((msg) => {
          const showDate = msg.date !== lastDate;
          lastDate = msg.date;
          return (
            <div key={msg.id}>
              {showDate && <DateDivider date={msg.date} />}
              {msg.type === 'human'      && <HumanMessage msg={msg} />}
              {msg.type === 'aria'       && <AriaMessage msg={msg} />}
              {msg.type === 'task'       && <TaskCard msg={msg} onToggle={onTaskToggle} />}
              {msg.type === 'escalation' && <EscalationCard msg={msg} />}
              {msg.type === 'content'    && <ContentCard msg={msg} />}
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
