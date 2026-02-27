import { useState, useRef, useEffect } from 'react';
import CONVERSATIONS from '../data/inbox';
import { C, F, R, S, T, shadows, scrollbarStyle } from '../tokens';
import useToast from '../hooks/useToast';

// ── Channel config ────────────────────────────
const CH = {
  LinkedIn:  { color: '#0A66C2', bg: 'rgba(10,102,194,0.15)'  },
  Facebook:  { color: '#1877F2', bg: 'rgba(24,119,242,0.15)'  },
  WhatsApp:  { color: '#25D366', bg: 'rgba(37,211,102,0.15)'  },
  Email:     { color: C.secondary, bg: 'rgba(94,234,212,0.12)' },
};

const CHANNEL_TABS = ['All', 'LinkedIn', 'Facebook', 'WhatsApp', 'Email'];

function ChannelIcon({ channel, size = 12 }) {
  const cfg = CH[channel];
  if (!cfg) return null;
  if (channel === 'LinkedIn') return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <rect width="16" height="16" rx="3" fill={cfg.color}/>
      <rect x="4" y="6" width="1.8" height="5.5" rx=".5" fill="white"/>
      <rect x="4" y="3.5" width="1.8" height="1.8" rx=".9" fill="white"/>
      <path d="M7.5 11.5V9a2 2 0 014 0v2.5" stroke="white" strokeWidth="1.4" strokeLinecap="round"/>
    </svg>
  );
  if (channel === 'Facebook') return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <rect width="16" height="16" rx="3" fill={cfg.color}/>
      <path d="M10 4H9a2.5 2.5 0 00-2.5 2.5V8H5v2h1.5v4H9V10h1.5l.5-2H9V6.5c0-.3.2-.5.5-.5H10V4z" fill="white"/>
    </svg>
  );
  if (channel === 'WhatsApp') return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <rect width="16" height="16" rx="3" fill={cfg.color}/>
      <path d="M8 3.2a4.8 4.8 0 00-4.14 7.2L3 13l2.68-.86A4.8 4.8 0 108 3.2z" fill="white"/>
      <path d="M6.2 6.5c.1.3.4.8.7 1.1.3.3.9.6 1.1.7l.4-.4c.1-.1.3-.1.4 0l.8.6c.2.1.2.3 0 .4-.4.5-1 .8-1.6.5A5.2 5.2 0 015.7 8c-.3-.6-.1-1.2.4-1.6.1-.1.4-.1.5 0l.6.8-.1.3z" fill={cfg.color}/>
    </svg>
  );
  if (channel === 'Email') return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <rect width="16" height="16" rx="3" fill={cfg.bg} stroke={cfg.color} strokeWidth="1"/>
      <path d="M3 5l5 3.5L13 5M3 5h10v7H3V5z" stroke={cfg.color} strokeWidth="1.2" strokeLinejoin="round" strokeLinecap="round"/>
    </svg>
  );
  return null;
}

// ── Stage / classification helpers ────────────
const STAGE_CFG = {
  IQL:         { bg: C.surface3,    text: C.textMuted,  border: C.border },
  MQL:         { bg: C.amberDim,   text: C.amber,      border: 'rgba(245,200,66,0.3)' },
  SQL:         { bg: C.greenDim,   text: C.primary,    border: 'rgba(61,220,132,0.3)' },
  Opportunity: { bg: C.primaryGlow, text: C.primary,   border: 'rgba(61,220,132,0.4)' },
};

const INTENT_CFG = {
  'Meeting Request':       { bg: C.greenDim,    text: C.primary },
  'Interested':            { bg: C.greenDim,    text: C.primary },
  'Hot Lead':              { bg: C.amberDim,   text: C.amber   },
  'Not Interested':        { bg: C.redDim,     text: C.red     },
  'Out of Office':         { bg: C.surface3,   text: C.textMuted },
  'Question':              { bg: C.amberDim,   text: C.amber   },
  'Reschedule':            { bg: C.amberDim,   text: C.amber   },
  'Competitor Comparison': { bg: C.amberDim,   text: C.amber   },
  'Content Request':       { bg: C.primaryGlow, text: C.primary },
};

function StageBadge({ stage }) {
  const cfg = STAGE_CFG[stage] ?? STAGE_CFG.IQL;
  return (
    <span style={{ padding: '2px 8px', backgroundColor: cfg.bg, color: cfg.text, border: `1px solid ${cfg.border}`, borderRadius: R.pill, fontFamily: F.mono, fontSize: '10px', fontWeight: 700, letterSpacing: '0.04em' }}>
      {stage}
    </span>
  );
}

function IntentBadge({ label, size = 'sm' }) {
  const cfg = INTENT_CFG[label] ?? { bg: C.surface3, text: C.textSecondary };
  return (
    <span style={{ padding: size === 'lg' ? '3px 10px' : '2px 8px', backgroundColor: cfg.bg, color: cfg.text, borderRadius: R.pill, fontFamily: F.mono, fontSize: size === 'lg' ? '11px' : '10px', fontWeight: 700, letterSpacing: '0.04em', whiteSpace: 'nowrap' }}>
      {label}
    </span>
  );
}

// ── LEFT PANEL ────────────────────────────────
function ConvItem({ conv, selected, onClick }) {
  const unread = conv.status === 'unread';
  return (
    <div
      onClick={onClick}
      style={{ padding: `${S[2]} ${S[3]}`, backgroundColor: selected ? C.primaryGlow : 'transparent', border: `1px solid ${selected ? 'rgba(61,220,132,0.2)' : 'transparent'}`, borderRadius: R.md, cursor: 'pointer', transition: T.base, marginBottom: '2px' }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: S[2] }}>
        {/* Avatar */}
        <div style={{ width: '34px', height: '34px', borderRadius: '50%', backgroundColor: C.surface3, border: `1.5px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: F.mono, fontSize: '10px', fontWeight: 700, color: C.primary, flexShrink: 0 }}>
          {conv.avatar}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Name + time row */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '4px' }}>
            <span style={{ fontFamily: F.body, fontSize: '13px', fontWeight: unread ? 700 : 500, color: C.textPrimary, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {conv.contact}
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0 }}>
              <ChannelIcon channel={conv.channel} size={12}/>
              <span style={{ fontFamily: F.mono, fontSize: '10px', color: C.textMuted }}>{conv.time}</span>
            </div>
          </div>
          {/* Company */}
          <div style={{ fontFamily: F.body, fontSize: '11px', color: C.textSecondary, marginTop: '1px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {conv.company}
          </div>
          {/* Last message + unread dot */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '3px' }}>
            <span style={{ fontFamily: F.body, fontSize: '12px', color: unread ? C.textPrimary : C.textMuted, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1, fontWeight: unread ? 500 : 400 }}>
              {conv.lastMessage}
            </span>
            {unread && <div style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: C.primary, flexShrink: 0, marginLeft: '6px' }}/>}
          </div>
        </div>
      </div>
    </div>
  );
}

function LeftPanel({ convs, selected, onSelect, filter, onFilter, search, onSearch }) {
  return (
    <div style={{ width: '280px', flexShrink: 0, borderRight: `1px solid ${C.border}`, display: 'flex', flexDirection: 'column', backgroundColor: C.surface, overflow: 'hidden' }}>
      {/* Channel tabs */}
      <div style={{ padding: `${S[2]} ${S[3]}`, borderBottom: `1px solid ${C.border}`, display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
        {CHANNEL_TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => onFilter(tab)}
            style={{ padding: '3px 9px', backgroundColor: filter === tab ? C.primary : C.surface3, color: filter === tab ? C.textInverse : C.textSecondary, border: 'none', borderRadius: R.pill, fontFamily: F.mono, fontSize: '10px', fontWeight: 700, cursor: 'pointer', transition: T.base }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Search */}
      <div style={{ padding: `${S[2]} ${S[3]}`, borderBottom: `1px solid ${C.border}` }}>
        <div style={{ position: 'relative' }}>
          <svg style={{ position: 'absolute', left: '9px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} width="12" height="12" viewBox="0 0 12 12" fill="none">
            <circle cx="5" cy="5" r="3.5" stroke={C.textMuted} strokeWidth="1.2"/>
            <path d="M8 8l2.5 2.5" stroke={C.textMuted} strokeWidth="1.2" strokeLinecap="round"/>
          </svg>
          <input
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            placeholder="Search conversations..."
            style={{ width: '100%', backgroundColor: C.surface2, color: C.textPrimary, border: `1px solid ${C.border}`, borderRadius: R.input, padding: '6px 10px 6px 28px', fontFamily: F.body, fontSize: '12px', outline: 'none', boxSizing: 'border-box' }}
          />
        </div>
      </div>

      {/* List */}
      <div style={{ flex: 1, overflowY: 'auto', padding: `${S[2]} ${S[2]}`, ...scrollbarStyle }}>
        {convs.length === 0 ? (
          <div style={{ padding: S[8], textAlign: 'center', fontFamily: F.body, fontSize: '13px', color: C.textMuted }}>No conversations found</div>
        ) : convs.map((c) => (
          <ConvItem key={c.id} conv={c} selected={selected?.id === c.id} onClick={() => onSelect(c)}/>
        ))}
      </div>
    </div>
  );
}

// ── CENTER PANEL ──────────────────────────────
function TouchpointPills({ touchpoints }) {
  if (!touchpoints?.length) return null;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: `${S[2]} ${S[4]}`, borderBottom: `1px solid ${C.border}`, flexWrap: 'wrap', flexShrink: 0 }}>
      <span style={{ fontFamily: F.mono, fontSize: '9px', color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.07em', marginRight: '2px' }}>Sequence</span>
      {touchpoints.map((tp, i) => (
        <div key={tp.id} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          {i > 0 && <div style={{ width: '10px', height: '1px', backgroundColor: C.border }}/>}
          <div
            title={`${tp.type} · ${tp.sent}${tp.opened ? ' · Opened' : ' · Not opened'}`}
            style={{ padding: '2px 8px', backgroundColor: tp.opened ? C.primaryGlow : C.surface3, color: tp.opened ? C.primary : C.textMuted, border: `1px solid ${tp.opened ? 'rgba(61,220,132,0.2)' : C.border}`, borderRadius: R.pill, fontFamily: F.mono, fontSize: '10px', fontWeight: 700, cursor: 'default', whiteSpace: 'nowrap' }}
          >
            {tp.label}
          </div>
        </div>
      ))}
    </div>
  );
}

function MsgBubble({ msg }) {
  const out = msg.from === 'outbound';
  const auto = msg.author?.includes('ARIA') || msg.author === 'Auto-Reply';
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: out ? 'flex-end' : 'flex-start', marginBottom: S[4] }}>
      {/* Meta row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
        {!out && (
          <div style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: C.surface3, border: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '8px', fontFamily: F.mono, fontWeight: 700, color: C.textSecondary, flexShrink: 0 }}>
            {msg.author?.split(' ').map((w) => w[0]).slice(0, 2).join('')}
          </div>
        )}
        <span style={{ fontFamily: F.body, fontSize: '11px', fontWeight: 600, color: auto ? C.primary : C.textSecondary }}>{msg.author}</span>
        <span style={{ fontFamily: F.mono, fontSize: '10px', color: C.textMuted }}>{msg.time}</span>
        <ChannelIcon channel={msg.channel} size={10}/>
      </div>
      {/* Bubble */}
      <div style={{
        maxWidth: '76%',
        padding: `${S[2]} ${S[3]}`,
        backgroundColor: out ? (auto ? C.primaryGlow : C.surface2) : C.surface3,
        border: `1px solid ${out ? (auto ? 'rgba(61,220,132,0.25)' : C.border) : C.border}`,
        borderRadius: out ? `${R.card} ${R.sm} ${R.card} ${R.card}` : `${R.sm} ${R.card} ${R.card} ${R.card}`,
        fontFamily: F.body,
        fontSize: '13px',
        color: C.textPrimary,
        lineHeight: 1.65,
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-word',
      }}>
        {msg.body}
        {auto && out && (
          <div style={{ marginTop: '5px', fontFamily: F.mono, fontSize: '10px', color: C.primary, display: 'flex', alignItems: 'center', gap: '4px' }}>
            <svg width="8" height="8" viewBox="0 0 8 8" fill="none"><circle cx="4" cy="4" r="3.5" stroke={C.primary} strokeWidth="1"/><circle cx="4" cy="4" r="1.2" fill={C.primary}/></svg>
            ARIA drafted
          </div>
        )}
      </div>
    </div>
  );
}

function ReplyBox({ value, onChange, onSend, onUseDraft, hasDraft }) {
  return (
    <div style={{ padding: S[4], borderTop: `1px solid ${C.border}`, backgroundColor: C.surface2, flexShrink: 0 }}>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => { if (e.key === 'Enter' && e.ctrlKey) { e.preventDefault(); onSend(); } }}
        placeholder="Write a reply... (Ctrl+Enter to send)"
        rows={3}
        style={{ width: '100%', backgroundColor: C.bg, color: C.textPrimary, border: `1px solid ${C.border}`, borderRadius: R.md, padding: `${S[2]} ${S[3]}`, fontFamily: F.body, fontSize: '13px', resize: 'none', outline: 'none', lineHeight: 1.6, boxSizing: 'border-box', ...scrollbarStyle }}
      />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: S[2] }}>
        <button
          onClick={onUseDraft}
          disabled={!hasDraft}
          style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: `5px ${S[3]}`, backgroundColor: hasDraft ? C.primaryGlow : C.surface3, color: hasDraft ? C.primary : C.textMuted, border: `1px solid ${hasDraft ? 'rgba(61,220,132,0.3)' : C.border}`, borderRadius: R.button, fontFamily: F.body, fontSize: '12px', fontWeight: 600, cursor: hasDraft ? 'pointer' : 'default', transition: T.base }}
        >
          <svg width="11" height="11" viewBox="0 0 11 11" fill="none"><circle cx="5.5" cy="5.5" r="4.5" stroke="currentColor" strokeWidth="1.1"/><circle cx="5.5" cy="5.5" r="1.8" stroke="currentColor" strokeWidth="1.1"/><path d="M5.5 1v1.3M5.5 8.7V10M1 5.5h1.3M8.7 5.5H10" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"/></svg>
          Use ARIA Draft
        </button>
        <div style={{ display: 'flex', gap: S[2] }}>
          <button
            onClick={() => onChange('')}
            style={{ padding: `5px ${S[3]}`, backgroundColor: 'transparent', color: C.textMuted, border: `1px solid ${C.border}`, borderRadius: R.button, fontFamily: F.body, fontSize: '12px', cursor: 'pointer' }}
          >
            Clear
          </button>
          <button
            onClick={onSend}
            disabled={!value.trim()}
            style={{ padding: `5px ${S[4]}`, backgroundColor: value.trim() ? C.primary : C.surface3, color: value.trim() ? C.textInverse : C.textMuted, border: 'none', borderRadius: R.button, fontFamily: F.body, fontSize: '12px', fontWeight: 700, cursor: value.trim() ? 'pointer' : 'default', transition: T.base }}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

function CenterPanel({ conv, reply, onReplyChange, onSend, onUseDraft }) {
  const bottomRef = useRef(null);
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conv?.id]);

  if (!conv) {
    return (
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', borderRight: `1px solid ${C.border}`, alignItems: 'center', justifyContent: 'center', gap: S[3] }}>
        <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
          <circle cx="22" cy="22" r="18" stroke={C.border} strokeWidth="1.5"/>
          <path d="M12 18h20M12 26h12" stroke={C.border} strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
        <span style={{ fontFamily: F.body, fontSize: '13px', color: C.textMuted }}>Select a conversation to begin</span>
      </div>
    );
  }

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', borderRight: `1px solid ${C.border}`, overflow: 'hidden' }}>
      {/* Conversation header */}
      <div style={{ padding: `${S[3]} ${S[4]}`, borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0, backgroundColor: C.surface2 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: S[3] }}>
          <div style={{ width: '38px', height: '38px', borderRadius: '50%', backgroundColor: C.surface3, border: `2px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: F.mono, fontSize: '12px', fontWeight: 700, color: C.primary, flexShrink: 0 }}>
            {conv.avatar}
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: S[2] }}>
              <span style={{ fontFamily: F.display, fontSize: '15px', fontWeight: 700, color: C.textPrimary }}>{conv.contact}</span>
              <ChannelIcon channel={conv.channel} size={14}/>
            </div>
            <div style={{ fontFamily: F.body, fontSize: '12px', color: C.textSecondary, marginTop: '1px' }}>
              {conv.role} at {conv.company}
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: S[2] }}>
          {/* ICP score pill */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '3px 9px', backgroundColor: C.primaryGlow, border: `1px solid rgba(61,220,132,0.2)`, borderRadius: R.pill }}>
            <svg width="9" height="9" viewBox="0 0 9 9" fill="none"><circle cx="4.5" cy="4.5" r="4" stroke={C.primary} strokeWidth="1"/><path d="M4.5 2v2.5l1.5 1" stroke={C.primary} strokeWidth="1" strokeLinecap="round"/></svg>
            <span style={{ fontFamily: F.mono, fontSize: '10px', fontWeight: 700, color: C.primary }}>ICP {conv.icpScore}</span>
          </div>
          <StageBadge stage={conv.stage}/>
          <IntentBadge label={conv.classification}/>
        </div>
      </div>

      {/* Touchpoint pills */}
      <TouchpointPills touchpoints={conv.touchpoints}/>

      {/* Message thread */}
      <div style={{ flex: 1, overflowY: 'auto', padding: S[4], ...scrollbarStyle }}>
        {conv.messages.map((msg) => <MsgBubble key={msg.id} msg={msg}/>)}
        <div ref={bottomRef}/>
      </div>

      {/* Reply box */}
      <ReplyBox
        value={reply}
        onChange={onReplyChange}
        onSend={onSend}
        onUseDraft={() => onUseDraft(conv.ariaSuggestion)}
        hasDraft={!!conv.ariaSuggestion}
      />
    </div>
  );
}

// ── RIGHT PANEL ───────────────────────────────
function ModeToggle({ ariaMode, onChange }) {
  return (
    <div style={{ padding: `${S[2]} ${S[3]}`, borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', gap: '6px' }}>
      <svg width="11" height="11" viewBox="0 0 11 11" fill="none"><circle cx="5.5" cy="5.5" r="4.5" stroke={C.primary} strokeWidth="1"/><circle cx="5.5" cy="5.5" r="1.8" stroke={C.primary} strokeWidth="1"/><path d="M5.5 1v1M5.5 9v1M1 5.5h1M9 5.5h1" stroke={C.primary} strokeWidth="1" strokeLinecap="round"/></svg>
      <span style={{ fontFamily: F.mono, fontSize: '10px', fontWeight: 700, color: C.primary, textTransform: 'uppercase', letterSpacing: '0.06em', flex: 1 }}>ARIA Mode</span>
      <div style={{ display: 'flex', backgroundColor: C.surface3, border: `1px solid ${C.border}`, borderRadius: R.pill, overflow: 'hidden' }}>
        {[['suggest', 'Suggest'], ['auto', 'Auto']].map(([mode, label]) => (
          <button
            key={mode}
            onClick={() => onChange(mode)}
            style={{ padding: '3px 9px', backgroundColor: ariaMode === mode ? C.primary : 'transparent', color: ariaMode === mode ? C.textInverse : C.textMuted, border: 'none', borderRadius: R.pill, fontFamily: F.mono, fontSize: '10px', fontWeight: 700, cursor: 'pointer', transition: T.base }}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}

function RightPanel({ conv, ariaMode, onAriaMode, onSendDraft, onEscalate }) {
  const [editDraft, setEditDraft]   = useState('');
  const [isEditing, setIsEditing]   = useState(false);
  const toast = useToast();

  useEffect(() => {
    setEditDraft(conv?.ariaSuggestion ?? '');
    setIsEditing(false);
  }, [conv?.id]);

  const wrap = (children) => (
    <div style={{ width: '260px', flexShrink: 0, backgroundColor: C.surface, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <ModeToggle ariaMode={ariaMode} onChange={onAriaMode}/>
      {children}
    </div>
  );

  if (!conv) return wrap(
    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <span style={{ fontFamily: F.body, fontSize: '12px', color: C.textMuted }}>No conversation selected</span>
    </div>
  );

  const intCfg = INTENT_CFG[conv.ariaClassification?.intent] ?? { bg: C.surface3, text: C.textMuted };

  return wrap(
    <div style={{ flex: 1, overflowY: 'auto', ...scrollbarStyle }}>

      {/* ARIA Classification */}
      <section style={{ padding: S[3], borderBottom: `1px solid ${C.border}` }}>
        <div style={{ fontFamily: F.mono, fontSize: '9px', fontWeight: 700, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: S[2] }}>ARIA Classification</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: S[2], marginBottom: S[2] }}>
          <span style={{ padding: '3px 10px', backgroundColor: intCfg.bg, color: intCfg.text, borderRadius: R.pill, fontFamily: F.mono, fontSize: '11px', fontWeight: 700 }}>
            {conv.ariaClassification?.intent}
          </span>
          <span style={{ fontFamily: F.mono, fontSize: '11px', color: C.primary, fontWeight: 700 }}>
            {conv.ariaClassification?.confidence}%
          </span>
        </div>
        <div style={{ fontFamily: F.body, fontSize: '11px', color: C.textSecondary, lineHeight: 1.5, backgroundColor: C.surface2, padding: `${S[2]} ${S[2]}`, borderRadius: R.sm, border: `1px solid ${C.border}` }}>
          {conv.ariaClassification?.reasoning}
        </div>
      </section>

      {/* ARIA Draft */}
      <section style={{ padding: S[3], borderBottom: `1px solid ${C.border}` }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: S[2] }}>
          <div style={{ fontFamily: F.mono, fontSize: '9px', fontWeight: 700, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.07em' }}>ARIA Draft</div>
          {ariaMode === 'auto' && (
            <span style={{ fontFamily: F.mono, fontSize: '9px', backgroundColor: C.amberDim, color: C.amber, borderRadius: R.pill, padding: '2px 6px', fontWeight: 700 }}>AUTO</span>
          )}
        </div>

        {isEditing ? (
          <textarea
            value={editDraft}
            onChange={(e) => setEditDraft(e.target.value)}
            rows={8}
            style={{ width: '100%', backgroundColor: C.bg, color: C.textPrimary, border: `1px solid ${C.primary}`, borderRadius: R.sm, padding: `${S[2]} ${S[2]}`, fontFamily: F.body, fontSize: '12px', resize: 'vertical', outline: 'none', lineHeight: 1.6, boxSizing: 'border-box', ...scrollbarStyle }}
          />
        ) : (
          <div style={{ fontFamily: F.body, fontSize: '12px', color: C.textSecondary, lineHeight: 1.6, backgroundColor: C.surface2, padding: `${S[2]} ${S[2]}`, borderRadius: R.sm, border: `1px solid ${C.border}`, whiteSpace: 'pre-wrap', maxHeight: '170px', overflowY: 'auto', ...scrollbarStyle }}>
            {editDraft}
          </div>
        )}

        {/* Action buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: S[2] }}>
          <button
            onClick={() => { onSendDraft(editDraft); toast.success('Draft sent!'); }}
            style={{ width: '100%', padding: '7px', backgroundColor: C.primary, color: C.textInverse, border: 'none', borderRadius: R.button, fontFamily: F.body, fontSize: '12px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
          >
            <svg width="11" height="11" viewBox="0 0 11 11" fill="none"><path d="M1 5.5h9M6.5 2l3.5 3.5L6.5 9" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>
            Send Draft
          </button>
          <div style={{ display: 'flex', gap: '6px' }}>
            <button
              onClick={() => setIsEditing((e) => !e)}
              style={{ flex: 1, padding: '6px', backgroundColor: C.surface2, color: C.textSecondary, border: `1px solid ${C.border}`, borderRadius: R.button, fontFamily: F.body, fontSize: '11px', cursor: 'pointer' }}
            >
              {isEditing ? 'Preview' : 'Edit'}
            </button>
            <button
              onClick={() => { onEscalate(); toast.info('Escalated to review queue'); }}
              style={{ flex: 1, padding: '6px', backgroundColor: C.redDim, color: C.red, border: `1px solid rgba(255,110,122,0.2)`, borderRadius: R.button, fontFamily: F.body, fontSize: '11px', cursor: 'pointer' }}
            >
              Escalate
            </button>
          </div>
        </div>
      </section>

      {/* Contact Info */}
      <section style={{ padding: S[3], borderBottom: `1px solid ${C.border}` }}>
        <div style={{ fontFamily: F.mono, fontSize: '9px', fontWeight: 700, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: S[2] }}>Contact</div>
        {[
          ['Company',   conv.company],
          ['Role',      conv.role],
          ['Channel',   conv.channel],
          ['ICP Score', `${conv.icpScore} / 100`],
          ['Stage',     conv.stage],
          ['Status',    conv.status],
        ].map(([label, value]) => (
          <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '4px 0', borderBottom: `1px solid rgba(28,46,34,0.5)` }}>
            <span style={{ fontFamily: F.body, fontSize: '11px', color: C.textMuted }}>{label}</span>
            <span style={{ fontFamily: F.body, fontSize: '11px', color: C.textPrimary, fontWeight: 500 }}>{value}</span>
          </div>
        ))}
      </section>

      {/* Quick Actions */}
      <section style={{ padding: S[3] }}>
        <div style={{ fontFamily: F.mono, fontSize: '9px', fontWeight: 700, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: S[2] }}>Quick Actions</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
          {[
            { label: 'Update Stage', icon: (
              <svg width="11" height="11" viewBox="0 0 11 11" fill="none"><path d="M5.5 9V2M2 5.5l3.5-3.5L9 5.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>
            )},
            { label: 'Book Demo', icon: (
              <svg width="11" height="11" viewBox="0 0 11 11" fill="none"><rect x="1" y="2" width="9" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.1"/><path d="M1 5h9M3.5 1v2M7.5 1v2" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"/></svg>
            )},
            { label: 'Add Note', icon: (
              <svg width="11" height="11" viewBox="0 0 11 11" fill="none"><path d="M7.5 1.5L9.5 3.5M2 9l1.5-.5 6-6L7.5 1.5l-6 6L2 9z" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round"/></svg>
            )},
            { label: 'Open in CRM', icon: (
              <svg width="11" height="11" viewBox="0 0 11 11" fill="none"><path d="M5 2H2a1 1 0 00-1 1v6a1 1 0 001 1h6a1 1 0 001-1V6M7 1h3v3M10 1L5.5 5.5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round"/></svg>
            )},
          ].map(({ label, icon }) => (
            <button
              key={label}
              onClick={() => toast.info(`${label} — coming soon`)}
              style={{ width: '100%', padding: '7px 10px', backgroundColor: C.surface2, color: C.textSecondary, border: `1px solid ${C.border}`, borderRadius: R.button, fontFamily: F.body, fontSize: '12px', cursor: 'pointer', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '8px', transition: T.base }}
            >
              {icon}
              {label}
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}

// ── Main ──────────────────────────────────────
export default function UnifiedInbox() {
  const [convs,         setConvs]         = useState(CONVERSATIONS);
  const [selected,      setSelected]      = useState(CONVERSATIONS[0] ?? null);
  const [filter,        setFilter]        = useState('All');
  const [search,        setSearch]        = useState('');
  const [reply,         setReply]         = useState('');
  const [ariaMode,      setAriaMode]      = useState('suggest');
  const toast = useToast();

  const filtered = convs.filter((c) => {
    const matchCh = filter === 'All' || c.channel === filter;
    const q = search.toLowerCase();
    const matchQ = !q || c.contact.toLowerCase().includes(q) || c.company.toLowerCase().includes(q) || c.lastMessage.toLowerCase().includes(q);
    return matchCh && matchQ;
  });

  const unreadCount = convs.filter((c) => c.status === 'unread').length;

  const handleSelect = (conv) => {
    setSelected(conv);
    setReply('');
    if (conv.status === 'unread') {
      setConvs((prev) => prev.map((c) => c.id === conv.id ? { ...c, status: 'read' } : c));
    }
  };

  const handleSend = () => {
    if (!reply.trim() || !selected) return;
    const newMsg = { id: `u${Date.now()}`, from: 'outbound', author: 'James D.', time: 'Just now', body: reply, channel: selected.channel };
    setConvs((prev) => prev.map((c) => c.id === selected.id ? { ...c, status: 'replied', lastMessage: reply, time: 'Just now' } : c));
    setSelected((s) => s ? { ...s, status: 'replied', messages: [...s.messages, newMsg] } : s);
    toast.success('Message sent!');
    setReply('');
  };

  const handleUseDraft = (draft) => {
    setReply(draft);
    toast.info('ARIA draft loaded into reply box');
  };

  const handleSendDraft = (draft) => {
    if (!selected) return;
    const newMsg = { id: `d${Date.now()}`, from: 'outbound', author: 'James D. (via ARIA)', time: 'Just now', body: draft, channel: selected.channel };
    setConvs((prev) => prev.map((c) => c.id === selected.id ? { ...c, status: 'replied', lastMessage: draft.slice(0, 60) + '...', time: 'Just now' } : c));
    setSelected((s) => s ? { ...s, status: 'replied', messages: [...s.messages, newMsg] } : s);
    toast.success('ARIA draft sent!');
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <style>{`@keyframes pulse{0%,100%{opacity:.5}50%{opacity:1}}`}</style>

      {/* Page header */}
      <div style={{ padding: `${S[3]} ${S[5]}`, borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0, backgroundColor: C.surface }}>
        <div>
          <h1 style={{ fontFamily: F.display, fontSize: '18px', fontWeight: 700, color: C.textPrimary, margin: 0 }}>Unified Inbox</h1>
          <p style={{ fontFamily: F.body, fontSize: '12px', color: C.textSecondary, margin: 0, marginTop: '2px' }}>
            {unreadCount} unread across LinkedIn · Facebook · WhatsApp · Email
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: S[3] }}>
          {ariaMode === 'auto' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '4px 12px', backgroundColor: C.amberDim, borderRadius: R.pill, border: `1px solid rgba(245,200,66,0.3)` }}>
              <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: C.amber, animation: 'pulse 1.5s infinite' }}/>
              <span style={{ fontFamily: F.mono, fontSize: '10px', fontWeight: 700, color: C.amber, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Auto-approve ON</span>
            </div>
          )}
          <span style={{ fontFamily: F.mono, fontSize: '11px', color: C.textMuted }}>{convs.length} conversations</span>
        </div>
      </div>

      {/* 3-panel body */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        <LeftPanel
          convs={filtered}
          selected={selected}
          onSelect={handleSelect}
          filter={filter}
          onFilter={setFilter}
          search={search}
          onSearch={setSearch}
        />
        <CenterPanel
          conv={selected}
          reply={reply}
          onReplyChange={setReply}
          onSend={handleSend}
          onUseDraft={handleUseDraft}
        />
        <RightPanel
          conv={selected}
          ariaMode={ariaMode}
          onAriaMode={setAriaMode}
          onSendDraft={handleSendDraft}
          onEscalate={() => {}}
        />
      </div>
    </div>
  );
}
