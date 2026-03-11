import { useParams, useNavigate } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import useToast from '../hooks/useToast';
import useStore from '../store/useStore';
import { C, F, R, S, btn, badge, flex, shadows, Z } from '../tokens';
import { IconSend, IconEye, IconLink, IconMessage, IconCalendar, IconCompass, IconPhone, IconPen, IconLinkedIn, IconMail, IconMic, IconDocument } from '../components/ui/Icons';
import { prospects } from '../data/campaigns';

const TOUCHPOINT_ICONS = {
  email_sent:    { Icon: IconSend,    color: C.textSecondary, label: 'Email Sent'     },
  email_opened:  { Icon: IconEye,     color: C.primary,       label: 'Email Opened'   },
  email_clicked: { Icon: IconLink,    color: C.secondary,     label: 'Link Clicked'   },
  email_replied: { Icon: IconMessage, color: C.primary,       label: 'Replied'        },
  linkedin_view: { Icon: IconCompass, color: '#0A66C2',       label: 'LinkedIn View'  },
  demo_booked:   { Icon: IconCalendar, color: C.amber,        label: 'Demo Booked'    },
  note:          { Icon: IconPen,     color: C.textMuted,     label: 'Note'           },
  call:          { Icon: IconPhone,   color: C.secondary,     label: 'Call'           },
  meeting:       { Icon: IconCalendar, color: C.primary,       label: 'Meeting'        },
};

const INTENT_BADGE = {
  high:   { ...badge.base, ...badge.green  },
  medium: { ...badge.base, ...badge.amber  },
  low:    { ...badge.base, ...badge.muted  },
};

const ARIA_RECS = [
  { color: C.primary,   text: 'Prospect opened email twice — ideal time to send a LinkedIn connection request now.' },
  { color: C.secondary, text: 'Company recently posted about ERP modernization on LinkedIn. Use as personalization hook.' },
  { color: C.amber,     text: 'Reply indicates interest but no specific time given. Send calendar invite directly to reduce friction.' },
];

// ── Log Activity modal ───────────────────────
function LogActivityModal({ prospect, onClose, onSaved }) {
  const toast = useToast();
  const [type, setType] = useState('note');
  const [note, setNote] = useState('');
  const [attachments, setAttachments] = useState([]);
  const [recording, setRecording] = useState(false);
  const ref = useRef(null);
  const fileInputRef = useRef(null);
  const recognitionRef = useRef(null);

  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) onClose(); };
    document.addEventListener('click', h);
    return () => document.removeEventListener('click', h);
  }, [onClose]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;
    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.continuous = true;
    recognitionRef.current.interimResults = false;
    recognitionRef.current.lang = 'en-US';
    recognitionRef.current.onresult = (e) => {
      const t = e.results[e.results.length - 1];
      const transcript = t[0]?.transcript ?? '';
      if (transcript.trim()) setNote((prev) => (prev ? `${prev} ${transcript}` : transcript).trim());
    };
    recognitionRef.current.onend = () => setRecording(false);
    recognitionRef.current.onerror = () => { setRecording(false); toast.info('Recording stopped'); };
    return () => { if (recognitionRef.current) recognitionRef.current.abort(); };
  }, [toast]);

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setAttachments((prev) => [
      ...prev,
      ...files.map((file) => ({ id: `${file.name}-${Date.now()}`, name: file.name, size: file.size })),
    ]);
    toast.success(`${files.length} file(s) added`);
    e.target.value = '';
  };

  const removeAttachment = (id) => {
    setAttachments((prev) => prev.filter((a) => a.id !== id));
  };

  const toggleRecord = () => {
    if (!recognitionRef.current) {
      toast.info('Voice input is not supported in this browser. Try Chrome or Edge.');
      return;
    }
    if (recording) {
      recognitionRef.current.stop();
      setRecording(false);
    } else {
      recognitionRef.current.start();
      setRecording(true);
      toast.info('Listening… speak now. Click again to stop.');
    }
  };

  const handleSave = () => {
    const label = type === 'note' ? 'Note' : type === 'call' ? 'Call' : type === 'email_sent' ? 'Email sent' : 'Meeting';
    let detail = note.trim() || (type === 'call' ? 'Call logged' : type === 'meeting' ? 'Meeting logged' : 'Note added');
    if (attachments.length) detail += ` (${attachments.length} attachment${attachments.length > 1 ? 's' : ''}: ${attachments.map((a) => a.name).join(', ')})`;
    onSaved?.({ type, note: note.trim(), label, detail, attachmentNames: attachments.map((a) => a.name) });
    toast.success(`Activity logged: ${label}`);
    onClose();
  };

  return (
    <div style={{ position: 'fixed', inset: 0, backgroundColor: C.overlayHeavy, zIndex: Z.modal, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: S[4] }} onClick={onClose}>
      <div ref={ref} style={{ backgroundColor: C.surface, border: `1px solid ${C.border}`, borderRadius: R.card, boxShadow: shadows.modal, width: '100%', maxWidth: '420px', maxHeight: '90vh', padding: S[5], overflowY: 'auto' }} onClick={(e) => e.stopPropagation()}>
        <h3 style={{ fontFamily: F.display, fontSize: '16px', fontWeight: 700, color: C.textPrimary, margin: `0 0 ${S[4]}` }}>Log Activity</h3>
        <p style={{ fontFamily: F.body, fontSize: '13px', color: C.textSecondary, margin: `0 0 ${S[4]}` }}>Log an activity for {prospect.name}</p>
        <div style={{ marginBottom: S[4] }}>
          <label style={{ fontFamily: F.body, fontSize: '12px', fontWeight: 600, color: C.textSecondary, display: 'block', marginBottom: S[2] }}>Type</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            style={{ width: '100%', padding: `${S[2]} ${S[3]}`, fontFamily: F.body, fontSize: '13px', backgroundColor: C.surface2, border: `1px solid ${C.border}`, borderRadius: R.input, color: C.textPrimary }}
          >
            <option value="note">Note</option>
            <option value="call">Call</option>
            <option value="email_sent">Email sent</option>
            <option value="meeting">Meeting</option>
          </select>
        </div>
        <div style={{ marginBottom: S[4] }}>
          <label style={{ fontFamily: F.body, fontSize: '12px', fontWeight: 600, color: C.textSecondary, display: 'block', marginBottom: S[2] }}>Note (optional)</label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="e.g. Left voicemail, will follow up Thursday"
            rows={2}
            style={{ width: '100%', minHeight: '56px', maxHeight: '80px', padding: S[3], fontFamily: F.body, fontSize: '13px', backgroundColor: C.surface2, border: `1px solid ${C.border}`, borderRadius: R.input, color: C.textPrimary, resize: 'vertical', boxSizing: 'border-box' }}
          />
        </div>
        <div style={{ marginBottom: S[4] }}>
          <label style={{ fontFamily: F.body, fontSize: '12px', fontWeight: 600, color: C.textSecondary, display: 'block', marginBottom: S[2] }}>Attach or record</label>
          <div style={{ display: 'flex', gap: S[2], flexWrap: 'wrap' }}>
            <input
              ref={fileInputRef}
              type="file"
              accept="audio/*,image/*,.pdf,.doc,.docx,.txt"
              multiple
              style={{ display: 'none' }}
              onChange={handleFileSelect}
            />
            <button
              type="button"
              style={{ ...btn.secondary, fontSize: '12px', display: 'inline-flex', alignItems: 'center', gap: 6 }}
              onClick={() => fileInputRef.current?.click()}
            >
              <IconDocument width={14} height={14} color={C.textSecondary} />
              Upload recording, image, or file
            </button>
            <button
              type="button"
              style={{
                ...btn.secondary,
                fontSize: '12px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                borderColor: recording ? C.red : undefined,
                backgroundColor: recording ? `${C.red}18` : undefined,
                color: recording ? C.red : undefined,
              }}
              onClick={toggleRecord}
            >
              <IconMic w={14} color={recording ? C.red : C.textSecondary} />
              {recording ? 'Stop recording' : 'Record your words'}
            </button>
          </div>
          {attachments.length > 0 && (
            <div style={{ marginTop: S[2], display: 'flex', flexDirection: 'column', gap: S[1] }}>
              {attachments.map((a) => (
                <div key={a.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '12px', color: C.textSecondary, backgroundColor: C.surface2, padding: `${S[1]} ${S[2]}`, borderRadius: R.sm }}>
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={a.name}>{a.name}</span>
                  <button type="button" style={{ ...btn.ghost, padding: '2px 6px', fontSize: '11px', minWidth: 0 }} onClick={() => removeAttachment(a.id)} aria-label="Remove">×</button>
                </div>
              ))}
            </div>
          )}
        </div>
        <div style={{ display: 'flex', gap: S[2], justifyContent: 'flex-end' }}>
          <button type="button" style={{ ...btn.secondary, fontSize: '13px' }} onClick={onClose}>Cancel</button>
          <button type="button" style={{ ...btn.primary, fontSize: '13px' }} onClick={handleSave}>Save</button>
        </div>
      </div>
    </div>
  );
}

// ── Update Stage modal ────────────────────────
const STAGE_LABELS = { 1: 'Step 1', 2: 'Step 2', 3: 'Step 3', 4: 'Step 4', 5: 'Replied / Meeting' };

function UpdateStageModal({ prospect, currentStep, onClose, onSaved }) {
  const toast = useToast();
  const [step, setStep] = useState(currentStep ?? prospect.sequenceStep ?? 1);
  const ref = useRef(null);

  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) onClose(); };
    document.addEventListener('click', h);
    return () => document.removeEventListener('click', h);
  }, [onClose]);

  const handleSave = () => {
    onSaved?.(step);
    toast.success(`Stage updated to ${STAGE_LABELS[step] || `Step ${step}`}`);
    onClose();
  };

  return (
    <div style={{ position: 'fixed', inset: 0, backgroundColor: C.overlayHeavy, zIndex: Z.modal, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: S[4] }} onClick={onClose}>
      <div ref={ref} style={{ backgroundColor: C.surface, border: `1px solid ${C.border}`, borderRadius: R.card, boxShadow: shadows.modal, width: '100%', maxWidth: '360px', padding: S[5] }} onClick={(e) => e.stopPropagation()}>
        <h3 style={{ fontFamily: F.display, fontSize: '16px', fontWeight: 700, color: C.textPrimary, margin: `0 0 ${S[4]}` }}>Update Stage</h3>
        <p style={{ fontFamily: F.body, fontSize: '13px', color: C.textSecondary, margin: `0 0 ${S[4]}` }}>Move {prospect.name} to a different sequence step.</p>
        <div style={{ marginBottom: S[5] }}>
          <label style={{ fontFamily: F.body, fontSize: '12px', fontWeight: 600, color: C.textSecondary, display: 'block', marginBottom: S[2] }}>Sequence step</label>
          <select
            value={step}
            onChange={(e) => setStep(Number(e.target.value))}
            style={{ width: '100%', padding: `${S[2]} ${S[3]}`, fontFamily: F.body, fontSize: '13px', backgroundColor: C.surface2, border: `1px solid ${C.border}`, borderRadius: R.input, color: C.textPrimary }}
          >
            {[1, 2, 3, 4, 5].map((n) => (
              <option key={n} value={n}>{STAGE_LABELS[n]}</option>
            ))}
          </select>
        </div>
        <div style={{ display: 'flex', gap: S[2], justifyContent: 'flex-end' }}>
          <button type="button" style={{ ...btn.secondary, fontSize: '13px' }} onClick={onClose}>Cancel</button>
          <button type="button" style={{ ...btn.primary, fontSize: '13px' }} onClick={handleSave}>Update</button>
        </div>
      </div>
    </div>
  );
}

// ── Book Demo modal ───────────────────────────
const CALENDAR_LINK_BASE = 'https://calendly.com/antarious-demo/30min';

function BookDemoModal({ prospect, onClose, onSent }) {
  const toast = useToast();
  const ref = useRef(null);
  const calendarLink = `${CALENDAR_LINK_BASE}?email=${encodeURIComponent(prospect.email || '')}&name=${encodeURIComponent(prospect.name || '')}`;

  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) onClose(); };
    document.addEventListener('click', h);
    return () => document.removeEventListener('click', h);
  }, [onClose]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(calendarLink).then(() => toast.success('Calendar link copied')).catch(() => toast.info('Copy failed'));
  };

  const handleOpenScheduling = () => {
    window.open(calendarLink, '_blank', 'noopener,noreferrer');
  };

  const handleSend = () => {
    onSent?.();
    toast.success(`Calendar invite sent to ${prospect.email}`);
    onClose();
  };

  return (
    <div style={{ position: 'fixed', inset: 0, backgroundColor: C.overlayHeavy, zIndex: Z.modal, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: S[4] }} onClick={onClose}>
      <div ref={ref} style={{ backgroundColor: C.surface, border: `1px solid ${C.border}`, borderRadius: R.card, boxShadow: shadows.modal, width: '100%', maxWidth: '400px', padding: S[5] }} onClick={(e) => e.stopPropagation()}>
        <h3 style={{ fontFamily: F.display, fontSize: '16px', fontWeight: 700, color: C.textPrimary, margin: `0 0 ${S[2]}` }}>Book Demo</h3>
        <p style={{ fontFamily: F.body, fontSize: '13px', color: C.textSecondary, margin: `0 0 ${S[4]}` }}>
          Send a calendar invite to <strong style={{ color: C.textPrimary }}>{prospect.email}</strong> so they can pick a time for a demo.
        </p>
        <div style={{ display: 'flex', gap: S[2], marginTop: S[4], flexWrap: 'wrap' }}>
          <button type="button" style={{ ...btn.secondary, fontSize: '12px' }} onClick={handleCopyLink}>Copy calendar link</button>
          <button type="button" style={{ ...btn.secondary, fontSize: '12px' }} onClick={handleOpenScheduling}>Open scheduling page</button>
        </div>
        <div style={{ display: 'flex', gap: S[2], justifyContent: 'flex-end', marginTop: S[5] }}>
          <button type="button" style={{ ...btn.secondary, fontSize: '13px' }} onClick={onClose}>Cancel</button>
          <button type="button" style={{ ...btn.primary, fontSize: '13px' }} onClick={handleSend}>Send calendar invite</button>
        </div>
      </div>
    </div>
  );
}

// ── ICP score ring ─────────────────────────────
function IcpRing({ score }) {
  const color = score >= 90 ? C.primary : score >= 75 ? C.amber : C.red;
  return (
    <div style={{
      width: '52px', height: '52px', borderRadius: '50%',
      border: `3px solid ${color}`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      backgroundColor: `${color}18`, boxShadow: `0 0 12px ${color}40`,
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontFamily: F.mono, fontSize: '16px', fontWeight: 700, color, lineHeight: 1 }}>{score}</div>
        <div style={{ fontFamily: F.body, fontSize: '9px', color, textTransform: 'uppercase', letterSpacing: '0.05em' }}>ICP</div>
      </div>
    </div>
  );
}

// ── Timeline node ─────────────────────────────
function TimelineNode({ touchpoint, isLast }) {
  const meta = TOUCHPOINT_ICONS[touchpoint.type] ?? { Icon: null, color: C.textMuted, label: touchpoint.type };

  return (
    <div style={{ display: 'flex', gap: S[4], alignItems: 'flex-start' }}>
      {/* Spine */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
        <div style={{
          width: '32px', height: '32px', borderRadius: '50%',
          backgroundColor: `${meta.color}18`,
          border: `2px solid ${meta.color}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: `0 0 8px ${meta.color}30`,
          flexShrink: 0,
        }}>
          {meta.Icon ? <meta.Icon color={meta.color} width={16} height={16} /> : <span style={{ fontSize: '14px', color: meta.color }}>·</span>}
        </div>
        {!isLast && (
          <div style={{ width: '2px', flex: 1, minHeight: '24px', backgroundColor: C.border, margin: `${S[1]} 0` }}/>
        )}
      </div>

      {/* Content */}
      <div style={{ paddingBottom: isLast ? 0 : S[4], flex: 1 }}>
        <div style={{ ...flex.rowBetween, marginBottom: '2px' }}>
          <span style={{ fontFamily: F.body, fontSize: '13px', fontWeight: 600, color: meta.color }}>{meta.label}</span>
          <span style={{ fontFamily: F.mono, fontSize: '11px', color: C.textMuted }}>{touchpoint.date}</span>
        </div>
        <span style={{ fontFamily: F.body, fontSize: '12px', color: C.textSecondary }}>{touchpoint.detail}</span>
      </div>
    </div>
  );
}

// ── ARIA panel ────────────────────────────────
function AriaSidebar() {
  const toast = useToast();
  return (
    <div style={{
      backgroundColor: C.surface2,
      border: `1px solid ${C.border}`,
      borderLeft: `3px solid ${C.primary}`,
      borderRadius: R.card,
      overflow: 'hidden',
      position: 'sticky',
      top: S[6],
    }}>
      <div style={{
        ...flex.rowBetween,
        padding: `${S[3]} ${S[4]}`,
        borderBottom: `1px solid ${C.border}`,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: S[2] }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: C.primary, boxShadow: `0 0 6px ${C.primary}`, animation: 'ariaPulse2 2s ease-in-out infinite' }}/>
          <span style={{ fontFamily: F.display, fontSize: '13px', fontWeight: 700, color: C.textPrimary }}>Freya Recommendations</span>
        </div>
      </div>
      <style>{`@keyframes ariaPulse2 { 0%,100%{opacity:1} 50%{opacity:0.4} }`}</style>
      <div style={{ padding: S[4], display: 'flex', flexDirection: 'column', gap: S[3] }}>
        {ARIA_RECS.map((rec, i) => (
          <div key={i} style={{
            borderLeft: `3px solid ${rec.color}`,
            paddingLeft: S[3],
          }}>
            <p style={{ fontFamily: F.body, fontSize: '12px', color: C.textSecondary, lineHeight: '1.5', margin: `0 0 ${S[2]}` }}>{rec.text}</p>
            <button
              style={{
                fontFamily: F.body, fontSize: '11px', fontWeight: 600,
                color: rec.color, backgroundColor: `${rec.color}12`,
                border: `1px solid ${rec.color}30`, borderRadius: '5px',
                padding: `2px ${S[2]}`, cursor: 'pointer',
              }}
              onClick={() => toast.success('Action queued')}
            >
              Take Action →
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────
function formatTouchpointDate() {
  const d = new Date();
  const month = d.toLocaleString('en-US', { month: 'short' });
  const day = d.getDate();
  const time = d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
  return `${month} ${day}, ${time}`;
}

export default function OutreachDetail() {
  const { id, pid } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const toggleFreya = useStore((s) => s.toggleFreya);
  const addFreyaChat = useStore((s) => s.addFreyaChat);
  const [logActivityOpen, setLogActivityOpen] = useState(false);
  const [updateStageOpen, setUpdateStageOpen] = useState(false);
  const [bookDemoOpen, setBookDemoOpen] = useState(false);

  const prospectFromData = prospects.find((p) => p.id === pid) ?? prospects[0];
  const [touchpoints, setTouchpoints] = useState(() => [...(prospectFromData.touchpoints || [])]);
  const [sequenceStep, setSequenceStep] = useState(() => prospectFromData.sequenceStep ?? 1);

  useEffect(() => {
    const p = prospects.find((x) => x.id === pid) ?? prospects[0];
    setTouchpoints([...(p.touchpoints || [])]);
    setSequenceStep(p.sequenceStep ?? 1);
  }, [pid]);

  const prospect = { ...prospectFromData, touchpoints, sequenceStep };

  const handleLogActivitySaved = (payload) => {
    const newTp = {
      id: `log-${Date.now()}`,
      type: payload.type,
      date: formatTouchpointDate(),
      detail: payload.detail || payload.note || (payload.type === 'call' ? 'Call logged' : payload.type === 'meeting' ? 'Meeting logged' : 'Note added'),
    };
    setTouchpoints((prev) => [...prev, newTp]);
  };

  const handleUpdateStageSaved = (step) => {
    setSequenceStep(step);
  };

  const handleBookDemoSent = () => {
    const newTp = {
      id: `demo-${Date.now()}`,
      type: 'demo_booked',
      date: formatTouchpointDate(),
      detail: `Calendar invite sent to ${prospect.email}. Demo booking link shared.`,
    };
    setTouchpoints((prev) => [...prev, newTp]);
  };

  const handleSendFollowUp = () => {
    const welcomeMessage = { role: 'freya', id: 'welcome', text: "Hi, I'm Freya — your AI co-pilot. What would you like to do?", type: 'text' };
    const userPrompt = `Draft a follow-up for ${prospect.name} at ${prospect.company}. They are ${prospect.title}.`;
    const userMsg = { role: 'user', id: Date.now(), text: userPrompt };
    const freyaReply = {
      role: 'freya',
      id: Date.now() + 1,
      text: `Here’s a concise follow-up you can send to **${prospect.name}**:\n\n**Subject:** Re: Quick follow-up – ${prospect.company}\n\nHi ${prospect.name},\n\nI wanted to circle back on my previous note. I’d love to show you how we’re helping finance leaders like you streamline planning and reporting.\n\nWould a 15-minute call this week work to share a short demo?\n\nBest,\n[Your name]`,
      type: 'text',
    };
    addFreyaChat({ title: `Follow-up: ${prospect.name}`, messages: [welcomeMessage, userMsg, freyaReply] });
    toggleFreya();
    toast.success('Freya opened with a draft follow-up. Review and edit in the panel.');
  };

  return (
    <div style={{ padding: S[6], display: 'flex', flexDirection: 'column', gap: S[5] }}>
      {/* Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: S[2] }}>
        <button style={{ ...btn.ghost, fontSize: '12px', color: C.textMuted, padding: 0 }} onClick={() => navigate('/campaigns')}>
          Campaigns
        </button>
        <span style={{ color: C.textMuted }}>›</span>
        <button style={{ ...btn.ghost, fontSize: '12px', color: C.textMuted, padding: 0 }} onClick={() => navigate(`/campaigns/${id}?tab=outreach`)}>
          Outreach
        </button>
        <span style={{ color: C.textMuted }}>›</span>
        <span style={{ fontFamily: F.body, fontSize: '12px', color: C.textSecondary }}>{prospect.name}</span>
      </div>

      {/* Prospect header card */}
      <div style={{
        backgroundColor: C.surface,
        border: `1px solid ${C.border}`,
        borderRadius: R.card,
        padding: S[5],
        display: 'flex',
        alignItems: 'flex-start',
        gap: S[5],
      }}>
        <IcpRing score={prospect.icpScore} />

        <div style={{ flex: 1 }}>
          <div style={{ ...flex.rowBetween, marginBottom: S[2] }}>
            <div>
              <h1 style={{ fontFamily: F.display, fontSize: '20px', fontWeight: 800, color: C.textPrimary, margin: 0, letterSpacing: '-0.02em' }}>
                {prospect.name}
              </h1>
              <div style={{ fontFamily: F.body, fontSize: '13px', color: C.textSecondary, marginTop: '2px' }}>
                {prospect.title} · {prospect.company}
              </div>
            </div>
            <span style={INTENT_BADGE[prospect.intent]}>{prospect.intent} intent</span>
          </div>

          <div style={{ display: 'flex', gap: S[4], flexWrap: 'wrap', alignItems: 'center' }}>
            <a
              href={prospect.email ? `mailto:${prospect.email}` : '#'}
              style={{ fontFamily: F.body, fontSize: '12px', color: C.textMuted, display: 'inline-flex', alignItems: 'center', gap: 6, textDecoration: 'none' }}
              title={prospect.email}
              onMouseEnter={(e) => { e.currentTarget.style.color = C.primary; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = C.textMuted; }}
            >
              <IconMail color="currentColor" width={14} height={14} />
              <span>Email</span>
            </a>
            <a
              href={prospect.linkedin && !prospect.linkedin.startsWith('http') ? `https://${prospect.linkedin}` : prospect.linkedin || '#'}
              target="_blank"
              rel="noopener noreferrer"
              style={{ fontFamily: F.body, fontSize: '12px', color: C.textMuted, display: 'inline-flex', alignItems: 'center', gap: 6, textDecoration: 'none' }}
              title={prospect.linkedin}
              onMouseEnter={(e) => { e.currentTarget.style.color = C.primary; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = C.textMuted; }}
            >
              <IconLinkedIn color="currentColor" width={14} height={14} />
              <span>LinkedIn</span>
            </a>
            <span style={{ fontFamily: F.body, fontSize: '12px', color: C.textMuted }}>
              Step {prospect.sequenceStep}/5 · Last touch {prospect.lastTouch}
            </span>
            {prospect.replied && (
              <span style={{ ...badge.base, ...badge.green }}>Replied</span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: S[2], flexShrink: 0 }}>
          <button
            type="button"
            style={{ ...btn.ghost, fontSize: '12px', display: 'inline-flex', alignItems: 'center', gap: 8 }}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setLogActivityOpen(true);
            }}
            aria-label="Log activity for this prospect"
            title="Log a call, email, meeting, or note"
          >
            <IconPen width={14} height={14} color={C.textSecondary} />
            Log Activity
          </button>
          <button
            type="button"
            style={{ ...btn.secondary, fontSize: '12px' }}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleSendFollowUp();
            }}
            title="Open Freya to draft a follow-up for this prospect"
          >
            Send Follow-up
          </button>
          <button
            type="button"
            style={{ ...btn.secondary, fontSize: '12px' }}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setUpdateStageOpen(true);
            }}
            title="Move this prospect to a different sequence step"
          >
            Update Stage
          </button>
          <button
            type="button"
            style={{ ...btn.primary, fontSize: '12px' }}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setBookDemoOpen(true);
            }}
            title="Send calendar invite so they can book a demo"
          >
            Book Demo
          </button>
        </div>
      </div>

      {logActivityOpen && createPortal(
        <LogActivityModal
          key={`log-activity-${prospect.id}`}
          prospect={prospect}
          onClose={() => setLogActivityOpen(false)}
          onSaved={handleLogActivitySaved}
        />,
        document.body
      )}
      {updateStageOpen && createPortal(
        <UpdateStageModal
          prospect={prospect}
          currentStep={sequenceStep}
          onClose={() => setUpdateStageOpen(false)}
          onSaved={handleUpdateStageSaved}
        />,
        document.body
      )}
      {bookDemoOpen && createPortal(
        <BookDemoModal
          prospect={prospect}
          onClose={() => setBookDemoOpen(false)}
          onSent={handleBookDemoSent}
        />,
        document.body
      )}

      {/* Two-column: timeline + ARIA */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: S[5], alignItems: 'start' }}>
        {/* Timeline */}
        <div style={{ backgroundColor: C.surface, border: `1px solid ${C.border}`, borderRadius: R.card, padding: S[5] }}>
          <h2 style={{ fontFamily: F.display, fontSize: '13px', fontWeight: 700, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.08em', margin: `0 0 ${S[5]}` }}>
            Activity Timeline
          </h2>
          {prospect.touchpoints.map((tp, i) => (
            <TimelineNode
              key={tp.id}
              touchpoint={tp}
              isLast={i === prospect.touchpoints.length - 1}
            />
          ))}
        </div>

        {/* ARIA sidebar */}
        <AriaSidebar />
      </div>
    </div>
  );
}
