import { useState } from 'react';
import { C, F, R, S, T, btn, badge, makeStyles, shadows } from '../../tokens';
import { getAgent } from '../../agents/AgentRegistry';
import useToast from '../../hooks/useToast';
import AgentAvatar from './AgentAvatar';
import {
  IconBriefcase,
  IconClock,
  IconMail,
  IconMegaphone,
  IconMessage,
  IconPhone,
  IconTarget,
  IconUsers,
} from '../ui/Icons';

// ── Shared small utility styles ───────────────
const sectionLabel = {
  fontFamily: F.mono,
  fontSize: '10px',
  fontWeight: 700,
  color: C.textMuted,
  textTransform: 'uppercase',
  letterSpacing: '0.07em',
  marginBottom: S[2],
};

const sectionCard = {
  backgroundColor: 'rgba(0,0,0,0.15)',
  border: `1px solid rgba(74,124,111,0.12)`,
  borderRadius: R.sm,
  padding: S[3],
};

function StrategySectionGlyph({ section }) {
  const h = (section.heading || '').toLowerCase();
  const common = { color: C.primary, width: 14, height: 14 };
  if (section.svgKey === 'target' || h.includes('position')) return <IconTarget {...common} />;
  if (section.svgKey === 'users' || h.includes('audience') || h.includes('target aud')) return <IconUsers {...common} />;
  if (section.svgKey === 'message' || h.includes('message')) return <IconMessage color={C.primary} w={14} />;
  if (section.svgKey === 'channel' || h.includes('channel')) return <IconMegaphone color={C.primary} w={14} />;
  return <IconTarget {...common} />;
}

function SequenceStepGlyph({ type, color }) {
  const w = 14;
  switch (type) {
    case 'linkedin':
      return <IconBriefcase color={color} w={w} />;
    case 'call':
      return <IconPhone color={color} width={w} height={w} />;
    case 'wait':
      return <IconClock color={color} width={w} height={w} />;
    case 'email':
    default:
      return <IconMail color={color} width={w} height={w} />;
  }
}

// ── Type: strategy ─────────────────────────────
// Expects output.sections: Array<{ heading, body, icon? }>
function StrategyOutput({ output }) {
  const [expanded, setExpanded] = useState({});

  const sections = output.sections || [
    { heading: 'Positioning', body: output.positioning || output.strategy || 'Frame Medglobal as the leading operational expert for complex humanitarian health emergencies — speed, access, and clinical quality in the most dangerous environments.' },
    { heading: 'Target Audience', body: output.targetAudience || 'High-net-worth individuals with prior humanitarian giving history, institutional health foundations in MENA + EU, corporate CSR heads in healthcare sector. Annual giving capacity >$50K.' },
    { heading: 'Key Messages', body: output.keyMessages || '"Your donation reaches patients in 72 hours — not 72 days." Emphasis on operational speed, neutrality, and direct clinical impact. Avoid fatigue language; use specific patient stories.' },
    { heading: 'Channel Mix', body: output.channelMix || 'Primary: LinkedIn (thought leadership + direct outreach), Email (personalized sequences). Secondary: Meta (retargeting past donors), Google (branded + humanitarian keywords). Events: 2 virtual donor briefings in Q2.' },
  ];

  const toggleSection = (i) => setExpanded((prev) => ({ ...prev, [i]: !prev[i] }));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: S[3] }}>
      {output.summary && (
        <div style={{ ...sectionCard, borderLeft: `3px solid ${C.primary}` }}>
          <p style={{ fontFamily: F.body, fontSize: '13px', color: C.textPrimary, lineHeight: 1.6, margin: 0 }}>
            {output.summary}
          </p>
        </div>
      )}
      {sections.map((sec, i) => {
        const open = expanded[i] !== false; // default open
        return (
          <div key={i} style={{ border: `1px solid rgba(74,124,111,0.15)`, borderRadius: R.sm, overflow: 'hidden' }}>
            <button
              style={{
                width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: `${S[3]} ${S[4]}`,
                backgroundColor: open ? 'rgba(74,124,111,0.08)' : 'rgba(0,0,0,0.1)',
                border: 'none', cursor: 'pointer',
                transition: T.color,
              }}
              onClick={() => toggleSection(i)}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: S[2] }}>
                <span style={{ lineHeight: 0, display: 'inline-flex' }}><StrategySectionGlyph section={sec} /></span>
                <span style={{ fontFamily: F.display, fontSize: '13px', fontWeight: 700, color: C.textPrimary }}>
                  {sec.heading}
                </span>
              </div>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ transform: open ? 'rotate(180deg)' : 'rotate(0)', transition: T.base, flexShrink: 0 }}>
                <path d="M2 4l4 4 4-4" stroke={C.textMuted} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            {open && (
              <div style={{ padding: `${S[3]} ${S[4]}`, backgroundColor: 'rgba(0,0,0,0.08)' }}>
                <p style={{ fontFamily: F.body, fontSize: '13px', color: C.textSecondary, lineHeight: 1.6, margin: 0 }}>
                  {sec.body}
                </p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── Type: content ──────────────────────────────
// Expects output.text or output.body; optional output.subject, output.platform, output.predictedCTR
function ContentOutput({ output }) {
  const toast = useToast();
  const text  = typeof output === 'string' ? output
    : output.text || output.body || output.content || '';
  const words = text.split(/\s+/).filter(Boolean).length;

  const handleCopyText = () => {
    navigator.clipboard.writeText(text)
      .then(() => toast.success('Content copied'))
      .catch(() => toast.error('Copy failed'));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: S[3] }}>
      {/* Meta row */}
      <div style={{ display: 'flex', gap: S[3], flexWrap: 'wrap' }}>
        {output.subject && (
          <div style={{ ...sectionCard, flex: 1, minWidth: 180 }}>
            <div style={sectionLabel}>Subject Line</div>
            <p style={{ fontFamily: F.body, fontSize: '13px', fontWeight: 600, color: C.textPrimary, margin: 0, lineHeight: 1.4 }}>
              {output.subject}
            </p>
          </div>
        )}
        <div style={{ display: 'flex', gap: S[2], alignItems: 'flex-start', flexWrap: 'wrap' }}>
          {output.platform && (
            <div style={{ ...sectionCard, textAlign: 'center' }}>
              <div style={sectionLabel}>Platform</div>
              <div style={{ fontFamily: F.mono, fontSize: '13px', fontWeight: 700, color: C.primary }}>{output.platform}</div>
            </div>
          )}
          {output.predictedCTR != null && (
            <div style={{ ...sectionCard, textAlign: 'center' }}>
              <div style={sectionLabel}>Pred. CTR</div>
              <div style={{ fontFamily: F.mono, fontSize: '18px', fontWeight: 700, color: C.green, lineHeight: 1 }}>
                {output.predictedCTR}%
              </div>
            </div>
          )}
          {output.predictedOpenRate != null && (
            <div style={{ ...sectionCard, textAlign: 'center' }}>
              <div style={sectionLabel}>Est. Open Rate</div>
              <div style={{ fontFamily: F.mono, fontSize: '18px', fontWeight: 700, color: C.green, lineHeight: 1 }}>
                {output.predictedOpenRate}%
              </div>
            </div>
          )}
          <div style={{ ...sectionCard, textAlign: 'center' }}>
            <div style={sectionLabel}>Words</div>
            <div style={{ fontFamily: F.mono, fontSize: '18px', fontWeight: 700, color: C.textPrimary, lineHeight: 1 }}>{words}</div>
          </div>
        </div>
      </div>

      {/* Content body */}
      <div style={{ position: 'relative' }}>
        <div style={sectionLabel}>Content</div>
        <div style={{
          ...sectionCard,
          fontFamily: F.body, fontSize: '13px', color: C.textPrimary,
          lineHeight: 1.65, whiteSpace: 'pre-wrap',
        }}>
          {text}
        </div>
        <button
          style={{
            position: 'absolute', top: S[5], right: S[3],
            ...btn.ghost, fontSize: '11px', padding: `2px ${S[2]}`,
            color: C.primary, border: `1px solid rgba(74,124,111,0.25)`,
            borderRadius: R.sm,
          }}
          onClick={handleCopyText}
        >
          Copy
        </button>
      </div>
    </div>
  );
}

// ── Type: leads ────────────────────────────────
// Expects output.leads: Array<{ name, company, score, intentSignals?, title? }>
function LeadsOutput({ output }) {
  const navigate = typeof window !== 'undefined' ? null : null;
  const toast    = useToast();
  const leads    = output.leads || [];

  const scoreColor = (score) => {
    if (score >= 85) return C.green;
    if (score >= 70) return C.primary;
    return C.amber;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: S[3] }}>
      {/* Summary strip */}
      <div style={{ display: 'flex', gap: S[3], flexWrap: 'wrap' }}>
        {[
          { label: 'Total Leads', value: output.totalLeads ?? leads.length },
          { label: 'High Intent',  value: output.highIntent ?? leads.filter((l) => (l.score || 0) >= 85).length },
          { label: 'Avg Score',    value: leads.length ? `${Math.round(leads.reduce((a, l) => a + (l.score || 0), 0) / leads.length)}` : '—' },
          { label: 'Region',       value: output.region || 'MENA' },
        ].map(({ label, value }) => (
          <div key={label} style={{ ...sectionCard, textAlign: 'center', flex: 1, minWidth: 70 }}>
            <div style={sectionLabel}>{label}</div>
            <div style={{ fontFamily: F.mono, fontSize: '18px', fontWeight: 700, color: C.textPrimary, lineHeight: 1 }}>{value}</div>
          </div>
        ))}
      </div>

      {/* Lead rows */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: S[2] }}>
        <div style={sectionLabel}>Lead List</div>
        {leads.map((lead, i) => (
          <div key={i} style={{
            ...sectionCard,
            display: 'flex', alignItems: 'center', gap: S[3], padding: `${S[2]} ${S[3]}`,
          }}>
            {/* Avatar initials */}
            <div style={{
              width: '32px', height: '32px', borderRadius: '50%',
              backgroundColor: 'rgba(74,124,111,0.2)', border: `1px solid rgba(74,124,111,0.3)`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: F.mono, fontSize: '10px', fontWeight: 700, color: C.primary,
              flexShrink: 0,
            }}>
              {lead.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
            </div>
            {/* Name + company */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: F.body, fontSize: '12px', fontWeight: 700, color: C.textPrimary, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {lead.name}
                {lead.title && <span style={{ fontWeight: 400, color: C.textMuted, marginLeft: S[1] }}>· {lead.title}</span>}
              </div>
              <div style={{ fontFamily: F.body, fontSize: '11px', color: C.textMuted, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {lead.company}
              </div>
              {lead.intentSignals && (
                <div style={{ display: 'flex', gap: S[1], marginTop: '3px', flexWrap: 'wrap' }}>
                  {lead.intentSignals.map((sig) => (
                    <span key={sig} style={{
                      fontFamily: F.mono, fontSize: '9px', fontWeight: 600,
                      color: C.amber, backgroundColor: 'rgba(251,191,36,0.1)',
                      border: `1px solid rgba(251,191,36,0.2)`,
                      borderRadius: R.pill, padding: '1px 5px',
                    }}>
                      {sig}
                    </span>
                  ))}
                </div>
              )}
            </div>
            {/* Score + bar */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px', flexShrink: 0 }}>
              <div style={{
                fontFamily: F.mono, fontSize: '14px', fontWeight: 700,
                color: scoreColor(lead.score || 0),
              }}>
                {lead.score || 0}
              </div>
              <div style={{ width: '40px', height: '4px', backgroundColor: C.surface3, borderRadius: R.pill }}>
                <div style={{
                  height: '100%', width: `${lead.score || 0}%`,
                  backgroundColor: scoreColor(lead.score || 0),
                  borderRadius: R.pill,
                }} />
              </div>
              <div style={{ fontFamily: F.body, fontSize: '9px', color: C.textMuted }}>score</div>
            </div>
          </div>
        ))}
      </div>

      {output.totalLeads > leads.length && (
        <button
          style={{ ...btn.secondary, fontSize: '12px', alignSelf: 'flex-start' }}
          onClick={() => toast.info(`View all ${output.totalLeads} leads in CRM`)}
        >
          View all {output.totalLeads} leads →
        </button>
      )}
    </div>
  );
}

// ── Type: insights ─────────────────────────────
// Expects output.metrics: Array<{ label, value, trend, change, unit? }>
function InsightsOutput({ output }) {
  const metrics = output.metrics || [];
  const notes   = output.notes   || output.summary || null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: S[3] }}>
      {notes && (
        <div style={{ ...sectionCard, borderLeft: `3px solid ${C.primary}` }}>
          <p style={{ fontFamily: F.body, fontSize: '13px', color: C.textSecondary, lineHeight: 1.55, margin: 0 }}>
            {notes}
          </p>
        </div>
      )}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: S[3] }}>
        {metrics.map((m, i) => {
          const trendUp   = m.trend === 'up'   || (m.change && String(m.change).startsWith('+'));
          const trendDown = m.trend === 'down'  || (m.change && String(m.change).startsWith('-'));
          const trendColor = trendUp ? C.green : trendDown ? C.red : C.textMuted;
          return (
            <div key={i} style={{
              ...sectionCard,
              display: 'flex', flexDirection: 'column', gap: S[1],
            }}>
              <div style={{ fontFamily: F.body, fontSize: '10px', color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {m.label || m.name}
              </div>
              <div style={{ fontFamily: F.mono, fontSize: '22px', fontWeight: 700, color: C.textPrimary, lineHeight: 1 }}>
                {m.value}{m.unit || ''}
              </div>
              {m.change != null && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                    {trendUp ? (
                      <path d="M5 8V2M2 5l3-3 3 3" stroke={trendColor} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                    ) : trendDown ? (
                      <path d="M5 2v6M2 5l3 3 3-3" stroke={trendColor} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                    ) : (
                      <path d="M2 5h6" stroke={trendColor} strokeWidth="1.4" strokeLinecap="round"/>
                    )}
                  </svg>
                  <span style={{ fontFamily: F.mono, fontSize: '11px', fontWeight: 700, color: trendColor }}>
                    {m.change}
                  </span>
                </div>
              )}
              {m.sub && (
                <div style={{ fontFamily: F.body, fontSize: '10px', color: C.textMuted }}>{m.sub}</div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Type: sequence ─────────────────────────────
// Expects output.steps: Array<{ stepNum, subject?, type, description, delay?, notes? }>
function SequenceOutput({ output }) {
  const steps      = output.steps || [];
  const seqName    = output.name || output.title || 'Email Sequence';
  const totalSteps = output.totalSteps || steps.length;

  const typeColors = {
    email:    { bg: 'rgba(74,124,111,0.1)', color: C.primary },
    linkedin: { bg: 'rgba(59,130,246,0.1)', color: '#3B82F6' },
    call:     { bg: 'rgba(251,191,36,0.1)', color: C.amber },
    wait:     { bg: 'rgba(0,0,0,0.15)', color: C.textMuted },
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: S[3] }}>
      {/* Header strip */}
      <div style={{ display: 'flex', gap: S[3], flexWrap: 'wrap' }}>
        {[
          { label: 'Sequence',    value: seqName },
          { label: 'Total Steps', value: totalSteps },
          { label: 'Duration',    value: output.duration || `${(totalSteps - 1) * 3} days` },
        ].map(({ label, value }) => (
          <div key={label} style={{ ...sectionCard, flex: 1, minWidth: 80 }}>
            <div style={sectionLabel}>{label}</div>
            <div style={{ fontFamily: F.display, fontSize: '13px', fontWeight: 700, color: C.textPrimary }}>{value}</div>
          </div>
        ))}
      </div>

      {/* Timeline */}
      <div style={{ position: 'relative', paddingLeft: S[5] }}>
        {/* Vertical line */}
        <div style={{
          position: 'absolute', left: '10px', top: '12px',
          bottom: '12px', width: '2px',
          backgroundColor: 'rgba(74,124,111,0.2)',
        }} />

        {steps.map((step, i) => {
          const tConf = typeColors[step.type] || typeColors.email;
          const isLast = i === steps.length - 1;
          return (
            <div key={i} style={{ position: 'relative', marginBottom: isLast ? 0 : S[3] }}>
              {/* Dot */}
              <div style={{
                position: 'absolute', left: '-14px', top: '10px',
                width: '10px', height: '10px', borderRadius: '50%',
                backgroundColor: tConf.color,
                border: `2px solid ${C.surface}`,
                boxShadow: `0 0 0 2px ${tConf.color}40`,
              }} />
              <div style={{ ...sectionCard, marginLeft: S[2] }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '4px', gap: S[2] }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: S[2] }}>
                    <span style={{ lineHeight: 0, display: 'inline-flex' }}><SequenceStepGlyph type={step.type} color={tConf.color} /></span>
                    <span style={{ fontFamily: F.display, fontSize: '12px', fontWeight: 700, color: C.textPrimary }}>
                      Step {step.stepNum || i + 1}
                      {step.subject && ` — ${step.subject}`}
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: S[1], flexShrink: 0, flexWrap: 'wrap' }}>
                    <span style={{
                      fontFamily: F.mono, fontSize: '9px', fontWeight: 700,
                      color: tConf.color, backgroundColor: tConf.bg,
                      borderRadius: R.pill, padding: '2px 6px', textTransform: 'uppercase',
                    }}>
                      {step.type}
                    </span>
                    {step.delay && (
                      <span style={{
                        fontFamily: F.mono, fontSize: '9px', color: C.textMuted,
                        backgroundColor: C.surface3, borderRadius: R.pill, padding: '2px 6px',
                      }}>
                        +{step.delay}
                      </span>
                    )}
                  </div>
                </div>
                <p style={{ fontFamily: F.body, fontSize: '12px', color: C.textSecondary, lineHeight: 1.5, margin: 0 }}>
                  {step.description}
                </p>
                {step.notes && (
                  <p style={{ fontFamily: F.body, fontSize: '11px', color: C.textMuted, fontStyle: 'italic', margin: `${S[1]} 0 0` }}>
                    Note: {step.notes}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Default / fallback ─────────────────────────
function DefaultOutput({ output }) {
  const toast = useToast();
  const text  = typeof output === 'string' ? output : JSON.stringify(output, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(text)
      .then(() => toast.success('Copied to clipboard'))
      .catch(() => toast.error('Copy failed'));
  };

  return (
    <div style={{ position: 'relative' }}>
      <pre style={{
        fontFamily: F.mono, fontSize: '12px', color: C.textSecondary,
        margin: 0, whiteSpace: 'pre-wrap', overflowWrap: 'break-word',
        lineHeight: 1.6,
        backgroundColor: 'rgba(0,0,0,0.15)',
        border: `1px solid rgba(74,124,111,0.12)`,
        borderRadius: R.sm, padding: S[4],
      }}>
        {text}
      </pre>
      <button
        style={{
          position: 'absolute', top: S[3], right: S[3],
          ...btn.ghost, fontSize: '11px', padding: `2px ${S[2]}`,
          color: C.primary, border: `1px solid rgba(74,124,111,0.25)`,
          borderRadius: R.sm,
        }}
        onClick={handleCopy}
      >
        Copy
      </button>
    </div>
  );
}

// ── Router ─────────────────────────────────────
function renderOutput(type, output) {
  // Detect by explicit type field first
  const t = type || output?.type || '';
  if (t === 'strategy'  || output?.sections   || output?.positioning) return <StrategyOutput output={output} />;
  if (t === 'content'   || output?.text        || output?.body || output?.content) return <ContentOutput output={output} />;
  if (t === 'leads'     || output?.leads) return <LeadsOutput output={output} />;
  if (t === 'insights'  || output?.metrics) return <InsightsOutput output={output} />;
  if (t === 'sequence'  || output?.steps)  return <SequenceOutput output={output} />;
  return <DefaultOutput output={output} />;
}

// ── Main component ─────────────────────────────
export default function AgentResultPanel({ result }) {
  const toast = useToast();

  if (!result) return null;

  const { agentId, skill, output, type, confidence, actions, creditsUsed, timestamp } = result;
  const agent = getAgent(agentId);

  const handleCopyAll = () => {
    const text = typeof output === 'string' ? output : JSON.stringify(output, null, 2);
    navigator.clipboard.writeText(text)
      .then(() => toast.success('Copied to clipboard'))
      .catch(() => toast.error('Copy failed'));
  };

  const confidenceBadge = confidence != null ? (
    <span style={makeStyles(badge.base, {
      backgroundColor: confidence >= 80 ? 'rgba(16,185,129,0.12)' : confidence >= 50 ? 'rgba(251,191,36,0.12)' : 'rgba(239,68,68,0.12)',
      color: confidence >= 80 ? C.green : confidence >= 50 ? C.amber : C.red,
      border: 'none',
    })}>
      {confidence}% confidence
    </span>
  ) : null;

  return (
    <div style={{
      backgroundColor: C.surface,
      border: `1px solid rgba(74,124,111,0.2)`,
      borderRadius: R.card,
      overflow: 'hidden',
      boxShadow: shadows.card,
    }}>
      {/* Top accent line */}
      <div style={{ height: '2px', background: `linear-gradient(90deg, ${C.primary}, ${C.secondary})` }} />

      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: S[3],
        padding: `${S[4]} ${S[5]}`,
        borderBottom: `1px solid rgba(74,124,111,0.12)`,
        backgroundColor: 'rgba(0,0,0,0.1)',
      }}>
        <AgentAvatar agentId={agentId} size={36} showStatus={false} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: S[2], flexWrap: 'wrap' }}>
            <span style={{ fontFamily: F.display, fontSize: '14px', fontWeight: 700, color: C.textPrimary }}>
              {agent?.displayName || agentId}
            </span>
            {confidenceBadge}
            {type && (
              <span style={{
                fontFamily: F.mono, fontSize: '9px', fontWeight: 700,
                color: C.primary, backgroundColor: 'rgba(74,124,111,0.12)',
                border: `1px solid rgba(74,124,111,0.2)`,
                borderRadius: R.pill, padding: '2px 7px', textTransform: 'uppercase', letterSpacing: '0.06em',
              }}>
                {type}
              </span>
            )}
          </div>
          {skill && (
            <span style={{ fontFamily: F.body, fontSize: '11px', color: C.textMuted, marginTop: '1px', display: 'block' }}>
              via {skill}
            </span>
          )}
        </div>
        {timestamp && (
          <span style={{ fontFamily: F.mono, fontSize: '10px', color: C.textMuted, flexShrink: 0 }}>
            {new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        )}
      </div>

      {/* Body */}
      <div style={{ padding: S[5] }}>
        {renderOutput(type, output)}
      </div>

      {/* Footer */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: S[3],
        padding: `${S[3]} ${S[5]}`,
        borderTop: `1px solid rgba(74,124,111,0.12)`,
        backgroundColor: 'rgba(0,0,0,0.08)',
        flexWrap: 'wrap',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: S[3] }}>
          {creditsUsed != null && (
            <span style={makeStyles(badge.base, badge.muted)}>
              {creditsUsed} credits used
            </span>
          )}
          {!timestamp && (
            <span style={{ fontFamily: F.mono, fontSize: '10px', color: C.textMuted }}>
              {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          )}
        </div>

        <div style={{ display: 'flex', gap: S[2] }}>
          {/* Rendered action buttons */}
          {actions && actions.map((action) => (
            <button
              key={action.label}
              style={{
                ...btn[action.variant === 'primary' ? 'primary' : 'secondary'],
                fontSize: '12px', padding: `${S[1]} ${S[3]}`,
              }}
              onClick={() => action.onClick?.()}
            >
              {action.label}
            </button>
          ))}
          <button
            style={{
              ...btn.ghost, fontSize: '12px', padding: `${S[1]} ${S[3]}`,
              color: C.textSecondary, border: `1px solid ${C.border}`, borderRadius: R.sm,
            }}
            onClick={handleCopyAll}
          >
            Copy output
          </button>
        </div>
      </div>
    </div>
  );
}
