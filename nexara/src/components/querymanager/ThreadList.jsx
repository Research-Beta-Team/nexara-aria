import { useState } from 'react';
import { C, F, R, S, T, btn } from '../../tokens';

const TYPE_ORDER = ['Campaigns', 'Tasks', 'Clients', 'Agents', 'Announcements'];

const TYPE_ICONS = {
  Campaigns:     (color) => (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
      <circle cx="6.5" cy="6.5" r="5.5" stroke={color} strokeWidth="1.2"/>
      <path d="M4 6.5l1.5 1.5 3-3" stroke={color} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  Tasks: (color) => (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
      <rect x="1.5" y="1.5" width="10" height="10" rx="2" stroke={color} strokeWidth="1.2"/>
      <path d="M4 6.5l1.5 1.5 3-3" stroke={color} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  Clients: (color) => (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
      <circle cx="6.5" cy="4.5" r="2.5" stroke={color} strokeWidth="1.2"/>
      <path d="M1.5 11.5c0-2.76 2.24-4.5 5-4.5s5 1.74 5 4.5" stroke={color} strokeWidth="1.2" strokeLinecap="round"/>
    </svg>
  ),
  Agents: (color) => (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
      <circle cx="6.5" cy="6.5" r="3.5" stroke={color} strokeWidth="1.2"/>
      <circle cx="6.5" cy="6.5" r="1.5" stroke={color} strokeWidth="1.2"/>
      <path d="M6.5 1v2M6.5 10v2M1 6.5h2M10 6.5h2" stroke={color} strokeWidth="1.2" strokeLinecap="round"/>
    </svg>
  ),
  Announcements: (color) => (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
      <path d="M2 5h9l-1 6H3L2 5z" stroke={color} strokeWidth="1.2" strokeLinejoin="round"/>
      <path d="M4.5 5V3.5a2 2 0 114 0V5" stroke={color} strokeWidth="1.2" strokeLinecap="round"/>
    </svg>
  ),
};

const TYPE_COLORS = {
  Campaigns:     C.primary,
  Tasks:         C.amber,
  Clients:       '#A78BFA',
  Agents:        '#60A5FA',
  Announcements: C.textSecondary,
};

function Avatar({ initials, color, size = 22 }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%', flexShrink: 0,
      backgroundColor: color ?? C.surface3,
      border: `1px solid ${C.border}`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: F.mono, fontSize: Math.round(size * 0.38) + 'px', fontWeight: 700, color: C.textSecondary,
    }}>
      {initials}
    </div>
  );
}

function ThreadItem({ thread, selected, onClick }) {
  const [hov, setHov] = useState(false);
  const typeColor = TYPE_COLORS[thread.type] ?? C.textSecondary;

  return (
    <div
      style={{
        display: 'flex', gap: S[2], alignItems: 'flex-start',
        padding: `${S[3]} ${S[3]}`,
        borderRadius: R.md,
        cursor: 'pointer',
        backgroundColor: selected ? C.primaryGlow : hov ? C.surface2 : 'transparent',
        borderLeft: `2px solid ${selected ? C.primary : 'transparent'}`,
        transition: T.color,
      }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      onClick={onClick}
    >
      {/* Type icon */}
      <div style={{
        width: '28px', height: '28px', borderRadius: R.sm, flexShrink: 0,
        backgroundColor: `${typeColor}14`,
        border: `1px solid ${typeColor}22`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {TYPE_ICONS[thread.type]?.(typeColor)}
      </div>

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2px' }}>
          <span style={{ fontFamily: F.body, fontSize: '12px', fontWeight: thread.unread > 0 ? 700 : 600, color: selected ? C.primary : C.textPrimary, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1, marginRight: S[2] }}>
            {thread.name}
          </span>
          <span style={{ fontFamily: F.mono, fontSize: '10px', color: C.textMuted, flexShrink: 0 }}>{thread.time}</span>
        </div>
        <div style={{ fontFamily: F.body, fontSize: '11px', color: C.textMuted, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span>{thread.lastMsg}</span>
          {thread.unread > 0 && (
            <span style={{
              minWidth: '16px', height: '16px', borderRadius: R.pill,
              backgroundColor: C.primary, color: C.bg,
              fontFamily: F.mono, fontSize: '9px', fontWeight: 800,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              padding: '0 4px', flexShrink: 0, marginLeft: '4px',
            }}>{thread.unread}</span>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ThreadList({ threads, selectedId, onSelect, onNewThread }) {
  const [search, setSearch] = useState('');
  const [collapsed, setCollapsed] = useState({});

  const filtered = search.trim()
    ? threads.filter((t) => t.name.toLowerCase().includes(search.toLowerCase()) || t.lastMsg.toLowerCase().includes(search.toLowerCase()))
    : threads;

  const grouped = TYPE_ORDER.reduce((acc, type) => {
    const items = filtered.filter((t) => t.type === type);
    if (items.length) acc[type] = items;
    return acc;
  }, {});

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>

      {/* New Thread button */}
      <div style={{ padding: `${S[3]} ${S[3]} ${S[2]}`, flexShrink: 0 }}>
        <button
          style={{ ...btn.primary, width: '100%', justifyContent: 'center', fontSize: '13px' }}
          onClick={onNewThread}
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          New Thread
        </button>
      </div>

      {/* Search */}
      <div style={{ padding: `0 ${S[3]} ${S[2]}`, flexShrink: 0 }}>
        <div style={{ position: 'relative' }}>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ position: 'absolute', left: '8px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
            <circle cx="5" cy="5" r="3.5" stroke={C.textMuted} strokeWidth="1.2"/>
            <path d="M8 8l2.5 2.5" stroke={C.textMuted} strokeWidth="1.2" strokeLinecap="round"/>
          </svg>
          <input
            type="text"
            placeholder="Search threads…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: '100%', boxSizing: 'border-box',
              backgroundColor: C.surface2, color: C.textPrimary,
              border: `1px solid ${C.border}`, borderRadius: R.input,
              padding: `${S[2]} ${S[3]} ${S[2]} 26px`,
              fontFamily: F.body, fontSize: '12px', outline: 'none',
            }}
          />
        </div>
      </div>

      {/* Thread groups */}
      <div style={{ flex: 1, overflowY: 'auto', scrollbarWidth: 'thin', scrollbarColor: `${C.border} transparent`, padding: `0 ${S[2]} ${S[4]}` }}>
        {Object.entries(grouped).map(([type, items]) => {
          const isCollapsed = collapsed[type];
          const typeColor = TYPE_COLORS[type] ?? C.textSecondary;
          return (
            <div key={type} style={{ marginBottom: S[2] }}>
              <button
                onClick={() => setCollapsed((c) => ({ ...c, [type]: !c[type] }))}
                style={{
                  display: 'flex', alignItems: 'center', gap: S[1], width: '100%',
                  background: 'none', border: 'none', cursor: 'pointer',
                  padding: `${S[1]} ${S[1]}`,
                  marginBottom: '2px',
                }}
              >
                <svg width="9" height="9" viewBox="0 0 9 9" fill="none" style={{ transform: isCollapsed ? 'rotate(-90deg)' : 'none', transition: T.base }}>
                  <path d="M1 2.5l3.5 3.5 3.5-3.5" stroke={C.textMuted} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span style={{ fontFamily: F.mono, fontSize: '10px', fontWeight: 700, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.06em', flex: 1, textAlign: 'left' }}>
                  {type}
                </span>
                <span style={{ fontFamily: F.mono, fontSize: '10px', color: C.textMuted }}>{items.length}</span>
              </button>
              {!isCollapsed && items.map((thread) => (
                <ThreadItem key={thread.id} thread={thread} selected={selectedId === thread.id} onClick={() => onSelect(thread.id)} />
              ))}
            </div>
          );
        })}
        {Object.keys(grouped).length === 0 && (
          <div style={{ fontFamily: F.body, fontSize: '12px', color: C.textMuted, textAlign: 'center', padding: S[8] }}>
            No threads found
          </div>
        )}
      </div>
    </div>
  );
}
