import { useState, useRef, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import CONVERSATIONS from '../data/inbox';
import { C, F, R, S, T, btn, shadows, scrollbarStyle } from '../tokens';
import useToast from '../hooks/useToast';
import { useAgent } from '../hooks/useAgent';
import AgentThinking from '../components/agents/AgentThinking';
import AgentResultPanel from '../components/agents/AgentResultPanel';
import { useRoleView } from '../hooks/useRoleView';
import { filterConversations } from '../utils/roleViews';
import useStore from '../store/useStore';
import ConnectAccountModal from '../components/social/ConnectAccountModal';
import { IconLinkedIn, IconFacebook, IconWhatsApp, IconInstagram } from '../components/ui/Icons';

// Auto-categorization labels from Analyst agent
const ANALYST_CATEGORIES = {
  'Meeting Request': 'High Priority',
  'Interested': 'Warm Lead',
  'Hot Lead': 'Hot Lead',
  'Not Interested': 'Cold',
  'Out of Office': 'OOO',
  'Question': 'Support',
  'Reschedule': 'Follow-up',
  'Competitor Comparison': 'Competitive',
  'Content Request': 'Content',
};

// ── Channel filter → full-page theme (Product UI or WhatsApp) ───
const PRODUCT_UI = {
  bg: '#0A1628',
  surface: 'rgba(255,255,255,0.04)',
  surface2: 'rgba(255,255,255,0.06)',
  surface3: 'rgba(255,255,255,0.08)',
  border: 'rgba(255,255,255,0.08)',
  textPrimary: '#E2E8F0',
  textSecondary: 'rgba(255,255,255,0.75)',
  textMuted: 'rgba(255,255,255,0.5)',
  primary: '#38BDF8',
  primaryGlow: 'rgba(56,189,248,0.15)',
  selectedBorder: 'rgba(56,189,248,0.25)',
  textInverse: '#0A1628',
  amber: C.amber,
  amberDim: C.amberDim,
  red: C.red,
  redDim: C.redDim,
  greenDim: C.greenDim,
};

const WHATSAPP_THEME = {
  // WhatsApp-style dark green: distinct bg so the whole page reads as WhatsApp
  bg: '#075E54',
  surface: 'rgba(0,0,0,0.22)',
  surface2: 'rgba(0,0,0,0.15)',
  surface3: 'rgba(255,255,255,0.08)',
  border: 'rgba(255,255,255,0.18)',
  textPrimary: '#FFFFFF',
  textSecondary: 'rgba(255,255,255,0.9)',
  textMuted: 'rgba(255,255,255,0.6)',
  primary: '#25D366',
  primaryGlow: 'rgba(37,211,102,0.35)',
  selectedBorder: 'rgba(37,211,102,0.5)',
  textInverse: '#075E54',
  amber: C.amber,
  amberDim: C.amberDim,
  red: C.red,
  redDim: C.redDim,
  greenDim: 'rgba(37,211,102,0.28)',
};

// Instagram brand: gradient purple → pink → orange → yellow (#833AB4, #C13584, #E1306C, #F77737, #FCAF45)
const INSTAGRAM_THEME = {
  bg: '#1A0A14',
  surface: 'rgba(131,58,180,0.12)',
  surface2: 'rgba(193,53,132,0.15)',
  surface3: 'rgba(225,48,108,0.18)',
  border: 'rgba(225,48,108,0.35)',
  textPrimary: '#F5E6F0',
  textSecondary: 'rgba(245,230,240,0.9)',
  textMuted: 'rgba(245,230,240,0.6)',
  primary: '#E1306C',
  primaryGlow: 'rgba(225,48,108,0.3)',
  selectedBorder: 'rgba(225,48,108,0.5)',
  textInverse: '#1A0A14',
  amber: C.amber,
  amberDim: C.amberDim,
  red: C.red,
  redDim: C.redDim,
  greenDim: C.greenDim,
};

function getInboxTheme(filter) {
  if (filter === 'Facebook' || filter === 'LinkedIn') return PRODUCT_UI;
  if (filter === 'Instagram') return INSTAGRAM_THEME;
  if (filter === 'WhatsApp') return WHATSAPP_THEME;
  return null; // use C (default app theme)
}

// ── Channel config ────────────────────────────
const CH = {
  LinkedIn:  { color: '#0A66C2', bg: 'rgba(10,102,194,0.15)'  },
  Facebook:  { color: '#1877F2', bg: 'rgba(24,119,242,0.15)'  },
  Instagram: { color: '#E4405F', bg: 'rgba(228,64,95,0.15)'   },
  WhatsApp:  { color: '#25D366', bg: 'rgba(37,211,102,0.15)'  },
  Email:     { color: C.secondary, bg: 'rgba(94,234,212,0.12)' },
};

const CHANNEL_TABS = ['All', 'LinkedIn', 'Facebook', 'Instagram', 'WhatsApp', 'Email'];

function ConnectedAccountLogo({ platform, size = 16 }) {
  const s = size;
  if (platform === 'LinkedIn') return <IconLinkedIn color="#0A66C2" width={s} height={s} />;
  if (platform === 'Meta' || platform === 'Facebook') return <IconFacebook color="#1877F2" width={s} height={s} />;
  if (platform === 'WhatsApp') return <IconWhatsApp color="#25D366" width={s} height={s} />;
  if (platform === 'Instagram') return <IconInstagram color="#E4405F" width={s} height={s} />;
  return null;
}

// Platform-specific Freya draft tips (personalized for each channel)
const FREYA_DRAFT_TIPS = {
  LinkedIn: 'Professional tone, connection-focused. Keep it concise and value-led.',
  Facebook: 'Conversational and friendly. Match the community tone of the platform.',
  Instagram: 'Visual and concise. Hashtags and emojis work; keep copy punchy.',
  WhatsApp: 'Short and direct. Use natural language; avoid long paragraphs.',
  Email: 'Clear subject line and structure. Formal but approachable; include a clear CTA.',
};

function ChannelIcon({ channel, size = 12 }) {
  const cfg = CH[channel];
  if (!cfg) return null;
  if (channel === 'LinkedIn') return <IconLinkedIn color={cfg.color} width={size} height={size} />;
  if (channel === 'Facebook') return <IconFacebook color={cfg.color} width={size} height={size} />;
  if (channel === 'Instagram') return <IconInstagram color={cfg.color} width={size} height={size} />;
  if (channel === 'WhatsApp') return <IconWhatsApp color={cfg.color} width={size} height={size} />;
  if (channel === 'Email') return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <rect width="16" height="16" rx="3" fill={cfg.bg} stroke={cfg.color} strokeWidth="1"/>
      <path d="M3 5l5 3.5L13 5M3 5h10v7H3V5z" stroke={cfg.color} strokeWidth="1.2" strokeLinejoin="round" strokeLinecap="round"/>
    </svg>
  );
  return null;
}

// ── Stage / classification helpers ────────────
function getStageCfg(stage, t) {
  const map = {
    IQL:         { bg: t.surface3,    text: t.textMuted,  border: t.border },
    MQL:         { bg: t.amberDim,   text: t.amber,      border: 'rgba(245,200,66,0.3)' },
    SQL:         { bg: t.greenDim,   text: t.primary,    border: 'rgba(61,220,132,0.3)' },
    Opportunity: { bg: t.primaryGlow, text: t.primary,   border: 'rgba(61,220,132,0.4)' },
  };
  return map[stage] ?? map.IQL;
}

function getIntentCfg(label, t) {
  const map = {
    'Meeting Request':       { bg: t.greenDim,    text: t.primary },
    'Interested':            { bg: t.greenDim,    text: t.primary },
    'Hot Lead':              { bg: t.amberDim,   text: t.amber   },
    'Not Interested':        { bg: t.redDim,     text: t.red     },
    'Out of Office':         { bg: t.surface3,   text: t.textMuted },
    'Question':              { bg: t.amberDim,   text: t.amber   },
    'Reschedule':            { bg: t.amberDim,   text: t.amber   },
    'Competitor Comparison': { bg: t.amberDim,   text: t.amber   },
    'Content Request':       { bg: t.primaryGlow, text: t.primary },
  };
  return map[label] ?? { bg: t.surface3, text: t.textSecondary };
}

function StageBadge({ stage, theme }) {
  const t = theme || C;
  const cfg = getStageCfg(stage, t);
  return (
    <span style={{ padding: '2px 8px', backgroundColor: cfg.bg, color: cfg.text, border: `1px solid ${cfg.border}`, borderRadius: R.pill, fontFamily: F.mono, fontSize: '10px', fontWeight: 700, letterSpacing: '0.04em' }}>
      {stage}
    </span>
  );
}

function IntentBadge({ label, size = 'sm', theme }) {
  const t = theme || C;
  const cfg = getIntentCfg(label, t);
  return (
    <span style={{ padding: size === 'lg' ? '3px 10px' : '2px 8px', backgroundColor: cfg.bg, color: cfg.text, borderRadius: R.pill, fontFamily: F.mono, fontSize: size === 'lg' ? '11px' : '10px', fontWeight: 700, letterSpacing: '0.04em', whiteSpace: 'nowrap' }}>
      {label}
    </span>
  );
}

// ── LEFT PANEL ────────────────────────────────
function ConvItem({ conv, selected, onClick, theme, channelForIcon }) {
  const t = theme || C;
  const unread = conv.status === 'unread';
  const channel = channelForIcon ?? conv.channel;
  const analystCategory = ANALYST_CATEGORIES[conv.classification] || null;
  return (
    <div
      onClick={onClick}
      style={{ padding: `${S[2]} ${S[3]}`, backgroundColor: selected ? t.primaryGlow : 'transparent', border: `1px solid ${selected ? (t.selectedBorder || t.border) : 'transparent'}`, borderRadius: R.md, cursor: 'pointer', transition: T.base, marginBottom: '2px' }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: S[2] }}>
        <div style={{ width: '34px', height: '34px', borderRadius: '50%', backgroundColor: t.surface3, border: `1.5px solid ${t.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: F.mono, fontSize: '10px', fontWeight: 700, color: t.primary, flexShrink: 0 }}>
          {conv.avatar}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '4px' }}>
            <span style={{ fontFamily: F.body, fontSize: '13px', fontWeight: unread ? 700 : 500, color: t.textPrimary, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {conv.contact}
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0 }}>
              <ChannelIcon channel={channel} size={12}/>
              <span style={{ fontFamily: F.mono, fontSize: '10px', color: t.textMuted }}>{conv.time}</span>
            </div>
          </div>
          <div style={{ fontFamily: F.body, fontSize: '11px', color: t.textSecondary, marginTop: '1px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '6px' }}>
            {conv.company}
            {/* Auto-categorization by Analyst agent */}
            {analystCategory && (
              <span style={{
                fontFamily: F.mono, fontSize: '8px', fontWeight: 700, color: t.primary,
                backgroundColor: t.primaryGlow, padding: '1px 5px', borderRadius: '3px',
                letterSpacing: '0.03em', flexShrink: 0,
              }}>
                {analystCategory}
              </span>
            )}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '3px' }}>
            <span style={{ fontFamily: F.body, fontSize: '12px', color: unread ? t.textPrimary : t.textMuted, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1, fontWeight: unread ? 500 : 400 }}>
              {conv.lastMessage}
            </span>
            {unread && <div style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: t.primary, flexShrink: 0, marginLeft: '6px' }}/>}
          </div>
        </div>
      </div>
    </div>
  );
}

function LeftPanel({ convs, selected, onSelect, filter, onFilter, search, onSearch, leftPanelWidth = 280, theme }) {
  const t = theme || C;
  return (
    <div style={{ width: leftPanelWidth, flexShrink: 0, borderRight: `1px solid ${t.border}`, display: 'flex', flexDirection: 'column', backgroundColor: t.surface, overflow: 'hidden' }}>
      {/* Channel tabs */}
      <div style={{ padding: `${S[2]} ${S[3]}`, borderBottom: `1px solid ${t.border}`, display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
        {CHANNEL_TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => onFilter(tab)}
            style={{ padding: '3px 9px', backgroundColor: filter === tab ? t.primary : t.surface3, color: filter === tab ? t.textInverse : t.textSecondary, border: 'none', borderRadius: R.pill, fontFamily: F.mono, fontSize: '10px', fontWeight: 700, cursor: 'pointer', transition: T.base }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Search */}
      <div style={{ padding: `${S[2]} ${S[3]}`, borderBottom: `1px solid ${t.border}` }}>
        <div style={{ position: 'relative' }}>
          <svg style={{ position: 'absolute', left: '9px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} width="12" height="12" viewBox="0 0 12 12" fill="none">
            <circle cx="5" cy="5" r="3.5" stroke={t.textMuted} strokeWidth="1.2"/>
            <path d="M8 8l2.5 2.5" stroke={t.textMuted} strokeWidth="1.2" strokeLinecap="round"/>
          </svg>
          <input
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            placeholder="Search conversations..."
            style={{ width: '100%', backgroundColor: t.surface2, color: t.textPrimary, border: `1px solid ${t.border}`, borderRadius: R.input, padding: '6px 10px 6px 28px', fontFamily: F.body, fontSize: '12px', outline: 'none', boxSizing: 'border-box' }}
          />
        </div>
      </div>

      {/* List */}
      <div style={{ flex: 1, overflowY: 'auto', padding: `${S[2]} ${S[2]}`, ...scrollbarStyle }}>
        {convs.length === 0 ? (
          <div style={{ padding: S[8], textAlign: 'center', fontFamily: F.body, fontSize: '13px', color: t.textMuted }}>No conversations found</div>
        ) : convs.map((c) => (
          <ConvItem key={c.id} conv={c} selected={selected?.id === c.id} onClick={() => onSelect(c)} theme={theme} channelForIcon={filter !== 'All' ? filter : undefined}/>
        ))}
      </div>
    </div>
  );
}

// ── CENTER PANEL ──────────────────────────────
function TouchpointPills({ touchpoints, theme }) {
  const t = theme || C;
  if (!touchpoints?.length) return null;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: `${S[2]} ${S[4]}`, borderBottom: `1px solid ${t.border}`, flexWrap: 'wrap', flexShrink: 0 }}>
      <span style={{ fontFamily: F.mono, fontSize: '9px', color: t.textMuted, textTransform: 'uppercase', letterSpacing: '0.07em', marginRight: '2px' }}>Sequence</span>
      {touchpoints.map((tp, i) => (
        <div key={tp.id} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          {i > 0 && <div style={{ width: '10px', height: '1px', backgroundColor: t.border }}/>}
          <div
            title={`${tp.type} · ${tp.sent}${tp.opened ? ' · Opened' : ' · Not opened'}`}
            style={{ padding: '2px 8px', backgroundColor: tp.opened ? t.primaryGlow : t.surface3, color: tp.opened ? t.primary : t.textMuted, border: `1px solid ${tp.opened ? (t.selectedBorder || t.border) : t.border}`, borderRadius: R.pill, fontFamily: F.mono, fontSize: '10px', fontWeight: 700, cursor: 'default', whiteSpace: 'nowrap' }}
          >
            {tp.label}
          </div>
        </div>
      ))}
    </div>
  );
}

function MsgBubble({ msg, theme, channelForIcon }) {
  const t = theme || C;
  const out = msg.from === 'outbound';
  const auto = msg.author?.includes('Freya') || msg.author === 'Auto-Reply';
  const channel = channelForIcon ?? msg.channel;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: out ? 'flex-end' : 'flex-start', marginBottom: S[4] }}>
      {/* Meta row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
        {!out && (
          <div style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: t.surface3, border: `1px solid ${t.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '8px', fontFamily: F.mono, fontWeight: 700, color: t.textSecondary, flexShrink: 0 }}>
            {msg.author?.split(' ').map((w) => w[0]).slice(0, 2).join('')}
          </div>
        )}
        <span style={{ fontFamily: F.body, fontSize: '11px', fontWeight: 600, color: auto ? t.primary : t.textSecondary }}>{msg.author}</span>
        <span style={{ fontFamily: F.mono, fontSize: '10px', color: t.textMuted }}>{msg.time}</span>
        <ChannelIcon channel={channel} size={10}/>
      </div>
      {/* Bubble */}
      <div style={{
        maxWidth: '76%',
        padding: `${S[2]} ${S[3]}`,
        backgroundColor: out ? (auto ? t.primaryGlow : t.surface2) : t.surface3,
        border: `1px solid ${out ? (auto ? (t.selectedBorder || t.border) : t.border) : t.border}`,
        borderRadius: out ? `${R.card} ${R.sm} ${R.card} ${R.card}` : `${R.sm} ${R.card} ${R.card} ${R.card}`,
        fontFamily: F.body,
        fontSize: '13px',
        color: t.textPrimary,
        lineHeight: 1.65,
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-word',
      }}>
        {msg.body}
        {auto && out && (
          <div style={{ marginTop: '5px', fontFamily: F.mono, fontSize: '10px', color: t.primary, display: 'flex', alignItems: 'center', gap: '4px' }}>
            <svg width="8" height="8" viewBox="0 0 8 8" fill="none"><circle cx="4" cy="4" r="3.5" stroke={t.primary} strokeWidth="1"/><circle cx="4" cy="4" r="1.2" fill={t.primary}/></svg>
            Freya drafted
          </div>
        )}
      </div>
    </div>
  );
}

function ReplyBox({ value, onChange, onSend, onUseDraft, hasDraft, theme }) {
  const t = theme || C;
  return (
    <div style={{ padding: S[4], borderTop: `1px solid ${t.border}`, backgroundColor: t.surface2, flexShrink: 0 }}>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => { if (e.key === 'Enter' && e.ctrlKey) { e.preventDefault(); onSend(); } }}
        placeholder="Write a reply... (Ctrl+Enter to send)"
        rows={3}
        style={{ width: '100%', backgroundColor: t.bg, color: t.textPrimary, border: `1px solid ${t.border}`, borderRadius: R.md, padding: `${S[2]} ${S[3]}`, fontFamily: F.body, fontSize: '13px', resize: 'none', outline: 'none', lineHeight: 1.6, boxSizing: 'border-box', ...scrollbarStyle }}
      />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: S[2] }}>
        <button
          onClick={onUseDraft}
          disabled={!hasDraft}
          style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: `5px ${S[3]}`, backgroundColor: hasDraft ? t.primaryGlow : t.surface3, color: hasDraft ? t.primary : t.textMuted, border: `1px solid ${hasDraft ? (t.selectedBorder || t.border) : t.border}`, borderRadius: R.button, fontFamily: F.body, fontSize: '12px', fontWeight: 600, cursor: hasDraft ? 'pointer' : 'default', transition: T.base }}
        >
          <svg width="11" height="11" viewBox="0 0 11 11" fill="none"><circle cx="5.5" cy="5.5" r="4.5" stroke="currentColor" strokeWidth="1.1"/><circle cx="5.5" cy="5.5" r="1.8" stroke="currentColor" strokeWidth="1.1"/><path d="M5.5 1v1.3M5.5 8.7V10M1 5.5h1.3M8.7 5.5H10" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"/></svg>
          Use Freya Draft
        </button>
        <div style={{ display: 'flex', gap: S[2] }}>
          <button
            onClick={() => onChange('')}
            style={{ padding: `5px ${S[3]}`, backgroundColor: 'transparent', color: t.textMuted, border: `1px solid ${t.border}`, borderRadius: R.button, fontFamily: F.body, fontSize: '12px', cursor: 'pointer' }}
          >
            Clear
          </button>
          <button
            onClick={onSend}
            disabled={!value.trim()}
            style={{ padding: `5px ${S[4]}`, backgroundColor: value.trim() ? t.primary : t.surface3, color: value.trim() ? t.textInverse : t.textMuted, border: 'none', borderRadius: R.button, fontFamily: F.body, fontSize: '12px', fontWeight: 700, cursor: value.trim() ? 'pointer' : 'default', transition: T.base }}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

function CenterPanel({ conv, reply, onReplyChange, onSend, onUseDraft, theme, filter, onFreyaDraft, agentActive, agentDraftResult, agentDraftForConvId }) {
  const t = theme || C;
  const bottomRef = useRef(null);
  const channelForIcon = filter && filter !== 'All' ? filter : undefined;
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conv?.id]);

  if (!conv) {
    return (
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', borderRight: `1px solid ${t.border}`, alignItems: 'center', justifyContent: 'center', gap: S[3] }}>
        <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
          <circle cx="22" cy="22" r="18" stroke={t.border} strokeWidth="1.5"/>
          <path d="M12 18h20M12 26h12" stroke={t.border} strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
        <span style={{ fontFamily: F.body, fontSize: '13px', color: t.textMuted }}>Select a conversation to begin</span>
      </div>
    );
  }

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', borderRight: `1px solid ${t.border}`, overflow: 'hidden' }}>
      {/* Conversation header */}
      <div style={{ padding: `${S[3]} ${S[4]}`, borderBottom: `1px solid ${t.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0, backgroundColor: t.surface2 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: S[3] }}>
          <div style={{ width: '38px', height: '38px', borderRadius: '50%', backgroundColor: t.surface3, border: `2px solid ${t.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: F.mono, fontSize: '12px', fontWeight: 700, color: t.primary, flexShrink: 0 }}>
            {conv.avatar}
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: S[2] }}>
              <span style={{ fontFamily: F.display, fontSize: '15px', fontWeight: 700, color: t.textPrimary }}>{conv.contact}</span>
              <ChannelIcon channel={channelForIcon ?? conv.channel} size={14}/>
            </div>
            <div style={{ fontFamily: F.body, fontSize: '12px', color: t.textSecondary, marginTop: '1px' }}>
              {conv.role} at {conv.company}
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: S[2] }}>
          {/* ICP score pill */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '3px 9px', backgroundColor: t.primaryGlow, border: `1px solid ${t.selectedBorder || t.border}`, borderRadius: R.pill }}>
            <svg width="9" height="9" viewBox="0 0 9 9" fill="none"><circle cx="4.5" cy="4.5" r="4" stroke={t.primary} strokeWidth="1"/><path d="M4.5 2v2.5l1.5 1" stroke={t.primary} strokeWidth="1" strokeLinecap="round"/></svg>
            <span style={{ fontFamily: F.mono, fontSize: '10px', fontWeight: 700, color: t.primary }}>ICP {conv.icpScore}</span>
          </div>
          <StageBadge stage={conv.stage} theme={theme}/>
          <IntentBadge label={conv.classification} theme={theme}/>
        </div>
      </div>

      {/* Touchpoint pills */}
      <TouchpointPills touchpoints={conv.touchpoints} theme={theme}/>

      {/* Freya, draft response button + agent thinking/result */}
      <div style={{ padding: `${S[2]} ${S[4]}`, borderBottom: `1px solid ${t.border}`, display: 'flex', alignItems: 'center', gap: S[2], flexShrink: 0 }}>
        <button
          onClick={() => onFreyaDraft?.(conv)}
          disabled={agentActive}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            padding: `5px ${S[3]}`, backgroundColor: t.primaryGlow,
            color: t.primary, border: `1px solid ${t.selectedBorder || t.border}`,
            borderRadius: R.button, fontFamily: F.body, fontSize: '12px',
            fontWeight: 600, cursor: agentActive ? 'default' : 'pointer',
            opacity: agentActive ? 0.6 : 1, transition: T.base,
          }}
        >
          <svg width="11" height="11" viewBox="0 0 11 11" fill="none"><circle cx="5.5" cy="5.5" r="4.5" stroke="currentColor" strokeWidth="1.1"/><circle cx="5.5" cy="5.5" r="1.8" fill="currentColor"/></svg>
          Freya, draft response
        </button>
        {agentActive && (
          <span style={{ fontFamily: F.mono, fontSize: '10px', color: t.primary, animation: 'inboxPulse 1.5s ease-in-out infinite' }}>
            Drafting...
          </span>
        )}
      </div>
      <style>{`@keyframes inboxPulse{0%,100%{opacity:.4}50%{opacity:1}}`}</style>

      {/* Agent draft result inline */}
      {agentDraftResult && agentDraftForConvId === conv.id && !agentActive && (
        <div style={{ padding: `${S[2]} ${S[4]}`, borderBottom: `1px solid ${t.border}`, flexShrink: 0 }}>
          <div style={{
            backgroundColor: t.primaryGlow, border: `1px solid ${t.selectedBorder || t.border}`,
            borderRadius: R.md, padding: `${S[2]} ${S[3]}`,
          }}>
            <div style={{ fontFamily: F.mono, fontSize: '9px', fontWeight: 700, color: t.primary, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: S[1] }}>
              Freya suggested response
            </div>
            <div style={{ fontFamily: F.body, fontSize: '12px', color: t.textSecondary, lineHeight: 1.5, whiteSpace: 'pre-wrap' }}>
              {typeof agentDraftResult?.output === 'string' ? agentDraftResult.output : agentDraftResult?.output?.content?.text || 'Draft generated. Click "Use Freya Draft" to apply.'}
            </div>
          </div>
        </div>
      )}

      {/* Message thread */}
      <div style={{ flex: 1, overflowY: 'auto', padding: S[4], ...scrollbarStyle }}>
        {conv.messages.map((msg) => <MsgBubble key={msg.id} msg={msg} theme={theme} channelForIcon={channelForIcon}/>)}
        <div ref={bottomRef}/>
      </div>

      {/* Reply box */}
      <ReplyBox
        value={reply}
        onChange={onReplyChange}
        onSend={onSend}
        onUseDraft={() => onUseDraft(conv.ariaSuggestion)}
        hasDraft={!!conv.ariaSuggestion}
        theme={theme}
      />
    </div>
  );
}

// ── RIGHT PANEL ───────────────────────────────
function ModeToggle({ ariaMode, onChange, theme }) {
  const t = theme || C;
  return (
    <div style={{ padding: `${S[2]} ${S[3]}`, borderBottom: `1px solid ${t.border}`, display: 'flex', alignItems: 'center', gap: '6px' }}>
      <svg width="11" height="11" viewBox="0 0 11 11" fill="none"><circle cx="5.5" cy="5.5" r="4.5" stroke={t.primary} strokeWidth="1"/><circle cx="5.5" cy="5.5" r="1.8" stroke={t.primary} strokeWidth="1"/><path d="M5.5 1v1M5.5 9v1M1 5.5h1M9 5.5h1" stroke={t.primary} strokeWidth="1" strokeLinecap="round"/></svg>
      <span style={{ fontFamily: F.mono, fontSize: '10px', fontWeight: 700, color: t.primary, textTransform: 'uppercase', letterSpacing: '0.06em', flex: 1 }}>Freya Mode</span>
      <div style={{ display: 'flex', backgroundColor: t.surface3, border: `1px solid ${t.border}`, borderRadius: R.pill, overflow: 'hidden' }}>
        {[['suggest', 'Suggest'], ['auto', 'Auto']].map(([mode, label]) => (
          <button
            key={mode}
            onClick={() => onChange(mode)}
            style={{ padding: '3px 9px', backgroundColor: ariaMode === mode ? t.primary : 'transparent', color: ariaMode === mode ? t.textInverse : t.textMuted, border: 'none', borderRadius: R.pill, fontFamily: F.mono, fontSize: '10px', fontWeight: 700, cursor: 'pointer', transition: T.base }}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}

function RightPanel({ conv, ariaMode, onAriaMode, onSendDraft, onEscalate, theme, filter }) {
  const t = theme || C;
  const connectedAccounts = useStore((s) => s.connectedAccounts);
  const channelForIcon = filter && filter !== 'All' ? filter : undefined;
  const channel = channelForIcon ?? conv?.channel; // display channel (current filter or conversation's)
  // Resolve connected account name for this channel (store uses Meta for Facebook pages)
  const accountForChannel = channel && connectedAccounts?.find(
    (a) => a.platform === channel || (channel === 'Facebook' && a.platform === 'Meta')
  );
  const accountName = accountForChannel?.name;
  const channelLabel = channel || conv?.channel; // e.g. "WhatsApp", "LinkedIn"
  const [editDraft, setEditDraft]   = useState('');
  const [isEditing, setIsEditing]   = useState(false);
  const toast = useToast();

  useEffect(() => {
    setEditDraft(conv?.ariaSuggestion ?? '');
    setIsEditing(false);
  }, [conv?.id]);

  const wrap = (children) => (
    <div style={{ width: '260px', flexShrink: 0, backgroundColor: t.surface, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <ModeToggle ariaMode={ariaMode} onChange={onAriaMode} theme={theme}/>
      {children}
    </div>
  );

  if (!conv) return wrap(
    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <span style={{ fontFamily: F.body, fontSize: '12px', color: t.textMuted }}>No conversation selected</span>
    </div>
  );

  const intCfg = getIntentCfg(conv.ariaClassification?.intent, t);

  return wrap(
    <div style={{ flex: 1, overflowY: 'auto', ...scrollbarStyle }}>

      {/* Freya Classification */}
      <section style={{ padding: S[3], borderBottom: `1px solid ${t.border}` }}>
        <div style={{ fontFamily: F.mono, fontSize: '9px', fontWeight: 700, color: t.textMuted, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: S[2] }}>Freya Classification</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: S[2], marginBottom: S[2] }}>
          <span style={{ padding: '3px 10px', backgroundColor: intCfg.bg, color: intCfg.text, borderRadius: R.pill, fontFamily: F.mono, fontSize: '11px', fontWeight: 700 }}>
            {conv.ariaClassification?.intent}
          </span>
          <span style={{ fontFamily: F.mono, fontSize: '11px', color: t.primary, fontWeight: 700 }}>
            {conv.ariaClassification?.confidence}%
          </span>
        </div>
        <div style={{ fontFamily: F.body, fontSize: '11px', color: t.textSecondary, lineHeight: 1.5, backgroundColor: t.surface2, padding: `${S[2]} ${S[2]}`, borderRadius: R.sm, border: `1px solid ${t.border}` }}>
          {conv.ariaClassification?.reasoning}
        </div>
      </section>

      {/* Freya Draft — adapted to social media account and platform name */}
      <section style={{ padding: S[3], borderBottom: `1px solid ${t.border}` }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: S[2] }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontFamily: F.mono, fontSize: '9px', fontWeight: 700, color: t.textMuted, textTransform: 'uppercase', letterSpacing: '0.07em' }}>
              <ChannelIcon channel={channel ?? conv.channel} size={12}/>
              Freya Draft for {channelLabel}
            </div>
            {accountName && (
              <span style={{ fontFamily: F.body, fontSize: '11px', color: t.textSecondary, marginLeft: '18px' }}>
                Account: {accountName}
              </span>
            )}
          </div>
          {ariaMode === 'auto' && (
            <span style={{ fontFamily: F.mono, fontSize: '9px', backgroundColor: t.amberDim, color: t.amber, borderRadius: R.pill, padding: '2px 6px', fontWeight: 700 }}>AUTO</span>
          )}
        </div>
        {FREYA_DRAFT_TIPS[conv.channel] && (
          <div style={{ fontFamily: F.body, fontSize: '10px', color: t.textMuted, marginBottom: S[2], fontStyle: 'italic' }}>
            {FREYA_DRAFT_TIPS[conv.channel]}
          </div>
        )}

        {isEditing ? (
          <textarea
            value={editDraft}
            onChange={(e) => setEditDraft(e.target.value)}
            rows={8}
            placeholder={`Edit draft for ${channelLabel}${accountName ? ` · ${accountName}` : ''}…`}
            style={{ width: '100%', backgroundColor: t.bg, color: t.textPrimary, border: `1px solid ${t.primary}`, borderRadius: R.sm, padding: `${S[2]} ${S[2]}`, fontFamily: F.body, fontSize: '12px', resize: 'vertical', outline: 'none', lineHeight: 1.6, boxSizing: 'border-box', ...scrollbarStyle }}
          />
        ) : (
          <div style={{ fontFamily: F.body, fontSize: '12px', color: t.textSecondary, lineHeight: 1.6, backgroundColor: t.surface2, padding: `${S[2]} ${S[2]}`, borderRadius: R.sm, border: `1px solid ${t.border}`, whiteSpace: 'pre-wrap', maxHeight: '170px', overflowY: 'auto', ...scrollbarStyle }}>
            {editDraft}
          </div>
        )}

        {/* Action buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: S[2] }}>
          <button
            onClick={() => { onSendDraft(editDraft); toast.success('Draft sent!'); }}
            style={{ width: '100%', padding: '7px', backgroundColor: t.primary, color: t.textInverse, border: 'none', borderRadius: R.button, fontFamily: F.body, fontSize: '12px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
          >
            <svg width="11" height="11" viewBox="0 0 11 11" fill="none"><path d="M1 5.5h9M6.5 2l3.5 3.5L6.5 9" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>
            Send Draft
          </button>
          <div style={{ display: 'flex', gap: '6px' }}>
            <button
              onClick={() => setIsEditing((e) => !e)}
              style={{ flex: 1, padding: '6px', backgroundColor: t.surface2, color: t.textSecondary, border: `1px solid ${t.border}`, borderRadius: R.button, fontFamily: F.body, fontSize: '11px', cursor: 'pointer' }}
            >
              {isEditing ? 'Preview' : 'Edit'}
            </button>
            <button
              onClick={() => { onEscalate(); toast.info('Escalated to review queue'); }}
              style={{ flex: 1, padding: '6px', backgroundColor: t.redDim, color: t.red, border: `1px solid rgba(255,110,122,0.2)`, borderRadius: R.button, fontFamily: F.body, fontSize: '11px', cursor: 'pointer' }}
            >
              Escalate
            </button>
          </div>
        </div>
      </section>

      {/* Contact Info */}
      <section style={{ padding: S[3], borderBottom: `1px solid ${t.border}` }}>
        <div style={{ fontFamily: F.mono, fontSize: '9px', fontWeight: 700, color: t.textMuted, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: S[2] }}>Contact</div>
        {[
          ['Company',   conv.company],
          ['Role',      conv.role],
          ['Channel',   conv.channel],
          ['ICP Score', `${conv.icpScore} / 100`],
          ['Stage',     conv.stage],
          ['Status',    conv.status],
        ].map(([label, value]) => (
          <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '4px 0', borderBottom: `1px solid ${t.border}` }}>
            <span style={{ fontFamily: F.body, fontSize: '11px', color: t.textMuted }}>{label}</span>
            <span style={{ fontFamily: F.body, fontSize: '11px', color: t.textPrimary, fontWeight: 500 }}>{value}</span>
          </div>
        ))}
      </section>

      {/* Quick Actions */}
      <section style={{ padding: S[3] }}>
        <div style={{ fontFamily: F.mono, fontSize: '9px', fontWeight: 700, color: t.textMuted, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: S[2] }}>Quick Actions</div>
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
              style={{ width: '100%', padding: '7px 10px', backgroundColor: t.surface2, color: t.textSecondary, border: `1px solid ${t.border}`, borderRadius: R.button, fontFamily: F.body, fontSize: '12px', cursor: 'pointer', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '8px', transition: T.base }}
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
  const navigate = useNavigate();
  const toast = useToast();
  const outreachAgent = useAgent('outreach');
  const [agentDraftResult, setAgentDraftResult] = useState(null);
  const [agentDraftForConvId, setAgentDraftForConvId] = useState(null);
  const currentRole = useStore((s) => s.currentRole);
  const connectedAccounts = useStore((s) => s.connectedAccounts);
  const setInboxUnreadCount = useStore((s) => s.setInboxUnreadCount);
  const inboxPlatformAssignments = useStore((s) => s.inboxPlatformAssignments);
  const setInboxPlatformAssignment = useStore((s) => s.setInboxPlatformAssignment);
  const teamMembers = useStore((s) => s.teamMembers);
  const { access, filter: roleFilter, layout } = useRoleView('inbox');

  const handleFreyaDraftResponse = async (conv) => {
    if (!conv) return;
    setAgentDraftForConvId(conv.id);
    toast.info(`Outreach agent drafting response for ${conv.contact}...`);
    const result = await outreachAgent.activate('cold-email', {
      task: `Draft a contextual response for ${conv.contact} at ${conv.company} on ${conv.channel}`,
      contact: { name: conv.contact, company: conv.company, channel: conv.channel, stage: conv.stage },
    });
    setAgentDraftResult(result);
    toast.success('Draft response ready.');
  };

  const [convs,         setConvs]         = useState(CONVERSATIONS);
  const [selected,      setSelected]      = useState(CONVERSATIONS[0] ?? null);
  const [filter,        setFilter]        = useState('All');
  const [search,        setSearch]        = useState('');
  const [reply,         setReply]         = useState('');
  const [ariaMode,      setAriaMode]      = useState('suggest');
  const [socialInviteDismissed, setSocialInviteDismissed] = useState(false);
  const [socialConnectedDismissed, setSocialConnectedDismissed] = useState(false);
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [showAssignments, setShowAssignments] = useState(false);

  const roleConfig = useMemo(() => ({ filter: roleFilter }), [roleFilter]);
  const convsForRole = useMemo(() => filterConversations(convs, currentRole, roleConfig), [convs, currentRole, roleConfig]);

  const filtered = convsForRole.filter((c) => {
    const matchCh = filter === 'All' || c.channel === filter;
    const q = search.toLowerCase();
    const matchQ = !q || c.contact.toLowerCase().includes(q) || c.company.toLowerCase().includes(q) || c.lastMessage.toLowerCase().includes(q);
    return matchCh && matchQ;
  });

  const unreadCount = convsForRole.filter((c) => c.status === 'unread').length;

  useEffect(() => {
    setInboxUnreadCount(unreadCount);
  }, [unreadCount, setInboxUnreadCount]);

  if (access === false) {
    return (
      <div style={{ padding: S[6], display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: S[5], minHeight: '60vh' }}>
        <h1 style={{ fontFamily: F.display, fontSize: '22px', fontWeight: 800, color: C.textPrimary, margin: 0 }}>Company Social Inbox</h1>
        <p style={{ fontFamily: F.body, fontSize: '14px', color: C.textSecondary }}>Company Social Inbox is not available for your role.</p>
        <button style={{ ...btn.primary }} onClick={() => navigate('/')}>Go to Dashboard</button>
      </div>
    );
  }

  const leftPanelWidth = layout === 'sdr' ? 350 : 280;
  const hotCount = convsForRole.filter((c) => c.classification === 'Hot Lead' || (c.ariaClassification?.intent === 'Meeting Request')).length;

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
    toast.info('Freya draft loaded into reply box');
  };

  const handleSendDraft = (draft) => {
    if (!selected) return;
    const newMsg = { id: `d${Date.now()}`, from: 'outbound', author: 'James D. (via Freya)', time: 'Just now', body: draft, channel: selected.channel };
    setConvs((prev) => prev.map((c) => c.id === selected.id ? { ...c, status: 'replied', lastMessage: draft.slice(0, 60) + '...', time: 'Just now' } : c));
    setSelected((s) => s ? { ...s, status: 'replied', messages: [...s.messages, newMsg] } : s);
    toast.success('Freya draft sent!');
  };

  const handleSync = () => {
    setSyncing(true);
    setTimeout(() => {
      setSyncing(false);
      toast.success('Inbox synced with connected accounts.');
    }, 1500);
  };

  const hasSocialConnected = connectedAccounts.length > 0;
  const theme = getInboxTheme(filter);
  const t = theme || C;

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <style>{`@keyframes pulse{0%,100%{opacity:.5}50%{opacity:1}}`}</style>

      {/* Not connected: empty state + connection method */}
      {!hasSocialConnected && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: S[8], gap: S[5] }}>
          <div style={{ textAlign: 'center', maxWidth: 420 }}>
            <h1 style={{ fontFamily: F.display, fontSize: '22px', fontWeight: 800, color: C.textPrimary, margin: '0 0 8px', letterSpacing: '-0.02em' }}>
              Company Social Inbox
            </h1>
            <p style={{ fontFamily: F.body, fontSize: '14px', color: C.textSecondary, margin: '0 0 24px', lineHeight: 1.5 }}>
              Connect your social and messaging accounts to see conversations here. Without a connection, the inbox is empty.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: S[3], justifyContent: 'center' }}>
              <button type="button" style={{ ...btn.primary, fontSize: '14px', padding: `${S[3]} ${S[5]}` }} onClick={() => setShowConnectModal(true)}>
                Connect accounts
              </button>
              <button type="button" style={{ ...btn.ghost, fontSize: '14px', border: `1px solid ${C.border}` }} onClick={() => navigate('/social')}>
                Open Social Media page
              </button>
            </div>
          </div>
          {showConnectModal && <ConnectAccountModal onClose={() => setShowConnectModal(false)} />}
        </div>
      )}

      {/* Connected: full inbox with sync */}
      {hasSocialConnected && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', backgroundColor: theme ? theme.bg : undefined }}>
      {layout === 'sdr' && (
        <div style={{ padding: `${S[2]} ${S[5]}`, backgroundColor: t.surface2, borderBottom: `1px solid ${t.border}`, fontFamily: F.body, fontSize: '12px', color: t.textSecondary }}>
          TODAY: {hotCount} hot replies · {unreadCount} unread · Your outreach conversations
        </div>
      )}

      {/* Connected: connection + sync bar */}
      {hasSocialConnected && (
        <div style={{ padding: `${S[2]} ${S[4]}`, backgroundColor: t.surface2, borderBottom: `1px solid ${t.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: S[3], flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: S[3], flexWrap: 'wrap' }}>
            <span style={{ fontFamily: F.body, fontSize: '12px', color: t.textSecondary }}>Connected:</span>
            {connectedAccounts.map((a) => (
              <div key={a.id} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '2px 8px', backgroundColor: t.surface3, borderRadius: R.button, border: `1px solid ${t.border}` }}>
                <ConnectedAccountLogo platform={a.platform} size={16} />
                <span style={{ fontFamily: F.body, fontSize: '12px', color: t.textPrimary }}>{a.platform}</span>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: S[2] }}>
            <button
              type="button"
              style={{ ...btn.ghost, fontSize: '12px', padding: `${S[1]} ${S[3]}`, border: `1px solid ${t.border}`, borderRadius: R.button, color: t.textSecondary }}
              onClick={() => setShowAssignments((a) => !a)}
            >
              {showAssignments ? 'Hide assignments' : 'Who handles what'}
            </button>
            <button
              type="button"
              style={{ ...btn.ghost, fontSize: '12px', padding: `${S[1]} ${S[3]}`, border: `1px solid ${t.border}`, borderRadius: R.button, color: t.textSecondary }}
              onClick={() => setShowConnectModal(true)}
            >
              Add account
            </button>
            <button
              type="button"
              style={{ ...btn.primary, fontSize: '12px', padding: `${S[1]} ${S[3]}`, opacity: syncing ? 0.8 : 1 }}
              onClick={handleSync}
              disabled={syncing}
            >
              {syncing ? 'Syncing…' : 'Sync inbox'}
            </button>
          </div>
        </div>
      )}
      {showAssignments && hasSocialConnected && inboxPlatformAssignments && (
        <div style={{ padding: `${S[2]} ${S[4]}`, backgroundColor: t.surface3, borderBottom: `1px solid ${t.border}`, display: 'flex', flexWrap: 'wrap', gap: S[3], alignItems: 'center' }}>
          <span style={{ fontFamily: F.mono, fontSize: '10px', fontWeight: 700, color: t.textMuted, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Inbox assignments</span>
          {['LinkedIn', 'Facebook', 'WhatsApp', 'Email'].map((platform) => {
            const a = inboxPlatformAssignments[platform];
            if (!a) return null;
            const options = [{ value: 'freya', label: 'Freya' }, ...(teamMembers || []).filter((m) => m.status === 'active').map((m) => ({ value: m.id, label: m.name }))];
            return (
              <div key={platform} style={{ display: 'flex', alignItems: 'center', gap: S[2] }}>
                <span style={{ fontFamily: F.body, fontSize: '12px', color: t.textMuted }}>{platform}:</span>
                <select
                  value={a.assignedTo}
                  onChange={(e) => setInboxPlatformAssignment(platform, { ...a, assignedTo: e.target.value })}
                  style={{ padding: '2px 8px', backgroundColor: t.bg, border: `1px solid ${t.border}`, borderRadius: R.input, color: t.textPrimary, fontFamily: F.body, fontSize: '12px' }}
                >
                  {options.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
                <label style={{ display: 'flex', alignItems: 'center', gap: '4px', fontFamily: F.body, fontSize: '11px', color: t.textSecondary, cursor: 'pointer' }}>
                  <input type="checkbox" checked={a.freyaHandles} onChange={(e) => setInboxPlatformAssignment(platform, { ...a, freyaHandles: e.target.checked })} />
                  Freya assists
                </label>
              </div>
            );
          })}
        </div>
      )}
      {showConnectModal && hasSocialConnected && <ConnectAccountModal onClose={() => setShowConnectModal(false)} />}

      {/* Page header */}
      <div style={{ padding: `${S[3]} ${S[5]}`, borderBottom: `1px solid ${t.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0, backgroundColor: t.surface }}>
        <div>
          <h1 style={{ fontFamily: F.display, fontSize: '18px', fontWeight: 700, color: t.textPrimary, margin: 0 }}>Company Social Inbox</h1>
          <p style={{ fontFamily: F.body, fontSize: '12px', color: t.textSecondary, margin: 0, marginTop: '2px' }}>
            {unreadCount} unread across LinkedIn · Facebook · WhatsApp · Email
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: S[3] }}>
          {ariaMode === 'auto' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '4px 12px', backgroundColor: t.amberDim, borderRadius: R.pill, border: `1px solid rgba(245,200,66,0.3)` }}>
              <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: t.amber, animation: 'pulse 1.5s infinite' }}/>
              <span style={{ fontFamily: F.mono, fontSize: '10px', fontWeight: 700, color: t.amber, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Auto-approve ON</span>
            </div>
          )}
          <span style={{ fontFamily: F.mono, fontSize: '11px', color: t.textMuted }}>{convsForRole.length} conversations</span>
        </div>
      </div>

      {/* 3-panel body */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden', backgroundColor: theme ? theme.bg : undefined }}>
        <LeftPanel
          convs={filtered}
          selected={selected}
          onSelect={handleSelect}
          filter={filter}
          onFilter={setFilter}
          search={search}
          onSearch={setSearch}
          leftPanelWidth={leftPanelWidth}
          theme={theme}
        />
        <CenterPanel
          conv={selected}
          reply={reply}
          onReplyChange={setReply}
          onSend={handleSend}
          onUseDraft={handleUseDraft}
          theme={theme}
          filter={filter}
          onFreyaDraft={handleFreyaDraftResponse}
          agentActive={outreachAgent.isActive}
          agentDraftResult={agentDraftResult}
          agentDraftForConvId={agentDraftForConvId}
        />
        <RightPanel
          conv={selected}
          ariaMode={ariaMode}
          onAriaMode={setAriaMode}
          onSendDraft={handleSendDraft}
          onEscalate={() => {}}
          theme={theme}
          filter={filter}
        />
      </div>
      </div>
      )}
    </div>
  );
}
