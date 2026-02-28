import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import { C, F, R, S, T, badge, shadows, scrollbarStyle } from '../tokens';
import useToast from '../hooks/useToast';
import AgentIcon from '../components/agent/AgentIcon';
import { getAgent, AGENT_TYPE_LABELS } from '../data/agents';

// ── Helpers ───────────────────────────────────
const STATUS_BADGE = {
  approved: badge.green,
  pending:  badge.amber,
  flagged:  badge.red,
};

function ScoreRing({ score, size = 48 }) {
  const r = (size - 6) / 2;
  const circ = 2 * Math.PI * r;
  const fill = (score / 100) * circ;
  const color = score >= 85 ? C.primary : score >= 70 ? C.amber : C.red;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ flexShrink: 0 }}>
      <circle cx={size / 2} cy={size / 2} r={r} stroke={C.surface3} strokeWidth="4" fill="none"/>
      <circle cx={size / 2} cy={size / 2} r={r} stroke={color} strokeWidth="4" fill="none"
        strokeDasharray={`${fill} ${circ}`}
        strokeLinecap="round"
        transform={`rotate(-90 ${size / 2} ${size / 2})`}/>
      <text x="50%" y="50%" dominantBaseline="central" textAnchor="middle"
        fill={color} fontFamily="'JetBrains Mono', monospace" fontSize={size < 40 ? '9' : '11'} fontWeight="700">
        {score}
      </text>
    </svg>
  );
}

// ── Output Preview Panel (right slide-in) ─────
function OutputPreviewPanel({ output, onClose, onApprove, onReject }) {
  const toast = useToast();
  if (!output) return null;

  return (
    <>
      {/* Backdrop */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 300, backgroundColor: 'rgba(7,13,9,0.5)' }} onClick={onClose}/>

      {/* Panel */}
      <div style={{
        position: 'fixed', top: 0, right: 0, bottom: 0, zIndex: 350,
        width: '460px', maxWidth: '90vw',
        backgroundColor: C.surface, borderLeft: `1px solid ${C.border}`,
        boxShadow: '-8px 0 32px rgba(0,0,0,0.5)',
        display: 'flex', flexDirection: 'column',
        animation: 'panelSlideIn 0.22s ease-out',
      }}>
        {/* Panel header */}
        <div style={{
          padding: `${S[4]} ${S[5]}`,
          borderBottom: `1px solid ${C.border}`,
          display: 'flex', alignItems: 'flex-start', gap: S[3],
          flexShrink: 0,
        }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: S[2], marginBottom: S[1], flexWrap: 'wrap' }}>
              <span style={{ ...badge.base, ...badge.muted, fontSize: '10px' }}>{output.version}</span>
              <span style={{ ...badge.base, ...badge.muted, fontSize: '10px' }}>{output.type}</span>
              <span style={{ ...badge.base, ...(STATUS_BADGE[output.status] ?? badge.muted), fontSize: '10px' }}>
                {output.status}
              </span>
            </div>
            <div style={{ fontFamily: F.display, fontSize: '15px', fontWeight: 700, color: C.textPrimary, lineHeight: '1.3' }}>
              {output.title}
            </div>
            <div style={{ fontFamily: F.body, fontSize: '12px', color: C.textMuted, marginTop: '3px' }}>
              {output.createdAt}
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: S[2], flexShrink: 0 }}>
            <ScoreRing score={output.brandScore} size={44} />
            <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.textMuted, padding: S[1] }} onClick={onClose}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflow: 'auto', padding: S[5], ...scrollbarStyle }}>
          <div style={{ fontFamily: F.body, fontSize: '11px', fontWeight: 600, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: S[2] }}>
            Output
          </div>
          <pre style={{
            fontFamily: F.mono, fontSize: '12px', color: C.textSecondary,
            whiteSpace: 'pre-wrap', lineHeight: '1.7', margin: 0,
            backgroundColor: C.surface2, border: `1px solid ${C.border}`,
            borderRadius: R.md, padding: S[4],
          }}>
            {output.body}
          </pre>
        </div>

        {/* Panel actions */}
        <div style={{
          padding: `${S[3]} ${S[5]}`,
          borderTop: `1px solid ${C.border}`,
          display: 'flex', gap: S[2],
          flexShrink: 0, backgroundColor: C.surface2,
        }}>
          {output.status === 'pending' && (
            <>
              <button
                style={{
                  flex: 1, padding: `${S[2]} 0`, fontFamily: F.body, fontSize: '13px', fontWeight: 600,
                  color: C.bg, backgroundColor: C.primary, border: 'none', borderRadius: R.button, cursor: 'pointer',
                }}
                onClick={() => { onApprove(output); toast.success('Output approved.'); }}
              >
                Approve
              </button>
              <button
                style={{
                  flex: 1, padding: `${S[2]} 0`, fontFamily: F.body, fontSize: '13px', fontWeight: 600,
                  color: C.red, backgroundColor: C.redDim, border: `1px solid rgba(255,110,122,0.25)`, borderRadius: R.button, cursor: 'pointer',
                }}
                onClick={() => { onReject(output); toast.warning('Output rejected.'); }}
              >
                Reject
              </button>
            </>
          )}
          <button
            style={{
              flex: output.status === 'pending' ? 0 : 1,
              padding: `${S[2]} ${S[4]}`, fontFamily: F.body, fontSize: '13px', fontWeight: 600,
              color: C.textSecondary, backgroundColor: C.surface3,
              border: `1px solid ${C.border}`, borderRadius: R.button, cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
            onClick={() => toast.info('Export coming soon.')}
          >
            Export
          </button>
        </div>
      </div>

      <style>{`@keyframes panelSlideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }`}</style>
    </>
  );
}

// ── Output History Tab ────────────────────────
function OutputHistoryTab({ agent }) {
  const [outputs, setOutputs] = useState(agent.outputHistory);
  const [selected, setSelected] = useState(null);

  const handleApprove = (output) => {
    setOutputs((prev) => prev.map((o) => o.id === output.id ? { ...o, status: 'approved' } : o));
    setSelected(null);
  };
  const handleReject = (output) => {
    setOutputs((prev) => prev.map((o) => o.id === output.id ? { ...o, status: 'flagged' } : o));
    setSelected(null);
  };

  return (
    <>
      <OutputPreviewPanel
        output={selected}
        onClose={() => setSelected(null)}
        onApprove={handleApprove}
        onReject={handleReject}
      />

      <div style={{ backgroundColor: C.surface2, border: `1px solid ${C.border}`, borderRadius: R.card, overflow: 'hidden' }}>
        {/* Table header */}
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 100px 90px 80px 110px',
          gap: S[3], padding: `${S[2]} ${S[4]}`,
          borderBottom: `1px solid ${C.border}`, backgroundColor: C.surface3,
        }}>
          {['Output', 'Version', 'Brand Score', 'Status', 'Date'].map((h) => (
            <span key={h} style={{ fontFamily: F.body, fontSize: '11px', fontWeight: 600, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {h}
            </span>
          ))}
        </div>

        {/* Rows */}
        {outputs.map((output, i) => (
          <div
            key={output.id}
            style={{
              display: 'grid', gridTemplateColumns: '1fr 100px 90px 80px 110px',
              gap: S[3], padding: `${S[3]} ${S[4]}`,
              borderBottom: i < outputs.length - 1 ? `1px solid ${C.border}` : 'none',
              cursor: 'pointer', transition: T.base,
              backgroundColor: selected?.id === output.id ? C.primaryGlow : 'transparent',
            }}
            onClick={() => setSelected(output)}
            onMouseEnter={(e) => { if (selected?.id !== output.id) e.currentTarget.style.backgroundColor = C.surface3; }}
            onMouseLeave={(e) => { if (selected?.id !== output.id) e.currentTarget.style.backgroundColor = 'transparent'; }}
          >
            <div style={{ minWidth: 0 }}>
              <div style={{ fontFamily: F.body, fontSize: '13px', fontWeight: 600, color: C.textPrimary, marginBottom: '2px',
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {output.title}
              </div>
              <div style={{ fontFamily: F.body, fontSize: '11px', color: C.textMuted,
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {output.preview}
              </div>
            </div>
            <span style={{ fontFamily: F.mono, fontSize: '12px', color: C.textSecondary, alignSelf: 'center' }}>{output.version}</span>
            <div style={{ alignSelf: 'center' }}>
              <ScoreRing score={output.brandScore} size={36} />
            </div>
            <div style={{ alignSelf: 'center' }}>
              <span style={{ ...badge.base, ...(STATUS_BADGE[output.status] ?? badge.muted) }}>
                {output.status}
              </span>
            </div>
            <span style={{ fontFamily: F.mono, fontSize: '11px', color: C.textMuted, alignSelf: 'center' }}>{output.createdAt}</span>
          </div>
        ))}
      </div>
    </>
  );
}

// ── Configuration Tab sub-components ─────────

function TempBar({ value }) {
  const pct = Math.min(1, Math.max(0, value ?? 0)) * 100;
  const color = value > 0.7 ? C.amber : C.primary;
  return (
    <div>
      <div style={{ fontFamily: F.mono, fontSize: '22px', fontWeight: 700, color: C.textPrimary, lineHeight: 1 }}>{value}</div>
      <div style={{ marginTop: '8px', height: '5px', borderRadius: '3px', backgroundColor: C.surface3 }}>
        <div style={{ height: '100%', width: `${pct}%`, backgroundColor: color, borderRadius: '3px' }}/>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
        <span style={{ fontFamily: F.mono, fontSize: '9px', color: C.textMuted, letterSpacing: '0.04em' }}>FOCUSED</span>
        <span style={{ fontFamily: F.mono, fontSize: '9px', color: C.textMuted, letterSpacing: '0.04em' }}>CREATIVE</span>
      </div>
    </div>
  );
}

function TagList({ value }) {
  const tags = String(value ?? '').split(/[,/]/).map((t) => t.trim()).filter(Boolean);
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '2px' }}>
      {tags.map((t) => (
        <span key={t} style={{ fontFamily: F.mono, fontSize: '11px', fontWeight: 600, color: C.secondary, backgroundColor: C.surface3, border: `1px solid rgba(94,234,212,0.2)`, borderRadius: R.pill, padding: `2px ${S[2]}` }}>{t}</span>
      ))}
    </div>
  );
}

function ModelBadge({ value }) {
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: S[2], backgroundColor: C.primaryGlow, border: `1px solid ${C.primary}`, borderRadius: R.md, padding: `${S[1]} ${S[3]}` }}>
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
        <path d="M6 1L11 10H1L6 1z" stroke={C.primary} strokeWidth="1.2" strokeLinejoin="round"/>
        <path d="M3 7.5h6" stroke={C.primary} strokeWidth="1.2" strokeLinecap="round"/>
      </svg>
      <span style={{ fontFamily: F.mono, fontSize: '11px', fontWeight: 700, color: C.primary }}>{value ?? '—'}</span>
    </div>
  );
}

function ConfigCell({ label, children }) {
  return (
    <div style={{ padding: `${S[4]} ${S[5]}` }}>
      <div style={{ fontFamily: F.mono, fontSize: '10px', fontWeight: 700, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: S[2] }}>{label}</div>
      {children}
    </div>
  );
}

function CfgSection({ title, description, icon, items }) {
  return (
    <div style={{ backgroundColor: C.surface2, border: `1px solid ${C.border}`, borderRadius: R.card, overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: S[3], padding: `${S[3]} ${S[5]}`, borderBottom: `1px solid ${C.border}`, backgroundColor: C.surface3 }}>
        <span style={{ color: C.primary, display: 'flex' }}>{icon}</span>
        <div>
          <div style={{ fontFamily: F.body, fontSize: '13px', fontWeight: 600, color: C.textPrimary }}>{title}</div>
          <div style={{ fontFamily: F.body, fontSize: '11px', color: C.textMuted }}>{description}</div>
        </div>
      </div>
      {/* Items — 2-column grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
        {items.map(({ label, value, type }, idx) => {
          const isLastRow = idx >= items.length - (items.length % 2 === 0 ? 2 : 1);
          const isOdd = idx % 2 === 0;
          return (
            <div key={label} style={{
              borderRight: isOdd ? `1px solid ${C.border}` : 'none',
              borderBottom: isLastRow ? 'none' : `1px solid ${C.border}`,
            }}>
              <ConfigCell label={label}>
                {type === 'model'       && <ModelBadge value={value} />}
                {type === 'temperature' && <TempBar value={value} />}
                {type === 'tags'        && <TagList value={value} />}
                {type === 'number'      && <span style={{ fontFamily: F.mono, fontSize: '22px', fontWeight: 700, color: C.textPrimary }}>{Number(value ?? 0).toLocaleString()}</span>}
                {(type === 'text' || type === 'date') && (
                  <span style={{ fontFamily: F.body, fontSize: '13px', color: C.textPrimary, lineHeight: '1.6' }}>{value ?? '—'}</span>
                )}
              </ConfigCell>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Configuration Tab ─────────────────────────
function ConfigurationTab({ agent }) {
  const toast = useToast();
  const cfg = agent.config ?? {};

  const CONFIG_SECTIONS = [
    {
      title: 'Model Settings',
      description: 'AI model and generation parameters',
      icon: <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 1L12 10H2L7 1z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/><path d="M4 7.5h6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>,
      items: [
        { label: 'Model',       value: cfg.model,       type: 'model'       },
        { label: 'Temperature', value: cfg.temperature, type: 'temperature' },
        { label: 'Max Tokens',  value: cfg.maxTokens,   type: 'number'      },
      ],
    },
    {
      title: 'Quality Controls',
      description: 'Approval gates and escalation thresholds',
      icon: <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 1L1.5 3.5V7c0 3 2 4.5 5.5 5.5C10 11.5 12 10 12 7V3.5L7 1z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/><path d="M4.5 7l2 2 3-3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>,
      items: [
        { label: 'Approval Gate',        value: cfg.approvalGate,        type: 'text' },
        { label: 'Escalation Threshold', value: cfg.escalationThreshold, type: 'text' },
      ],
    },
    {
      title: 'Output Settings',
      description: 'Languages, retry behaviour and rate limits',
      icon: <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="1.5" y="2.5" width="11" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.3"/><path d="M4 6h6M4 8.5h4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>,
      items: [
        { label: 'Languages',   value: cfg.outputLanguages, type: 'tags' },
        { label: 'Retry Logic', value: cfg.retryLogic,      type: 'text' },
        { label: 'Rate Limit',  value: cfg.rateLimit,       type: 'text' },
      ],
    },
    {
      title: 'Metadata',
      description: 'Configuration history and ownership',
      icon: <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.3"/><path d="M7 4v3.5l2 1.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>,
      items: [
        { label: 'Created By',   value: cfg.createdBy,   type: 'text' },
        { label: 'Last Updated', value: cfg.lastUpdated, type: 'date' },
      ],
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: S[4] }}>
      {/* Tab header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: S[4] }}>
        <div>
          <div style={{ fontFamily: F.display, fontSize: '15px', fontWeight: 700, color: C.textPrimary }}>Agent Configuration</div>
          <div style={{ fontFamily: F.body, fontSize: '12px', color: C.textSecondary, marginTop: '3px' }}>Live parameters governing this agent's behaviour. Read-only.</div>
        </div>
        <button
          style={{
            display: 'flex', alignItems: 'center', gap: S[2], flexShrink: 0,
            padding: `${S[2]} ${S[4]}`,
            fontFamily: F.body, fontSize: '13px', fontWeight: 600,
            color: C.primary, backgroundColor: C.primaryGlow,
            border: `1px solid ${C.primary}`, borderRadius: R.button, cursor: 'pointer', transition: T.color,
          }}
          onClick={() => toast.info('Configuration change request sent to Campaign Owner.')}
        >
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
            <path d="M9 1.5L11.5 4 5 10.5H2.5V8L9 1.5z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
          </svg>
          Request Change
        </button>
      </div>

      {/* Read-only notice */}
      <div style={{ backgroundColor: C.amberDim, border: `1px solid rgba(245,200,66,0.2)`, borderRadius: R.md, padding: `${S[2]} ${S[4]}`, display: 'flex', alignItems: 'center', gap: S[2] }}>
        <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
          <path d="M6.5 1.5L1 11.5h11L6.5 1.5z" stroke={C.amber} strokeWidth="1.3" strokeLinejoin="round"/>
          <path d="M6.5 5.5v2.5M6.5 9.5v.5" stroke={C.amber} strokeWidth="1.3" strokeLinecap="round"/>
        </svg>
        <span style={{ fontFamily: F.body, fontSize: '12px', color: C.amber }}>
          Changes require Campaign Owner approval. Use <strong>Request Change</strong> to submit a modification.
        </span>
      </div>

      {/* Section cards */}
      {CONFIG_SECTIONS.map((section) => (
        <CfgSection key={section.title} {...section} />
      ))}
    </div>
  );
}

// ── Custom Recharts tooltip ───────────────────
function PerfTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      backgroundColor: C.surface, border: `1px solid ${C.border}`, borderRadius: R.md,
      padding: `${S[2]} ${S[3]}`, boxShadow: shadows.dropdown,
    }}>
      <div style={{ fontFamily: F.mono, fontSize: '11px', color: C.textMuted, marginBottom: '4px' }}>{label}</div>
      {payload.map((p) => (
        <div key={p.name} style={{ fontFamily: F.mono, fontSize: '12px', color: p.color }}>
          {p.name}: {p.value}
        </div>
      ))}
    </div>
  );
}

// ── Performance Tab ───────────────────────────
function PerformanceTab({ agent }) {
  const toast = useToast();
  const data  = agent.performanceData ?? [];

  const avg = (key) => data.length
    ? Math.round(data.reduce((s, d) => s + d[key], 0) / data.length)
    : 0;

  const stats = [
    { label: 'Avg Brand Score', value: avg('brandScore'), color: C.primary },
    { label: 'Avg Accuracy',    value: avg('accuracy'),   color: C.secondary },
    { label: 'Total Outputs',   value: agent.outputHistory.length,   color: C.textPrimary },
    { label: 'Approved',        value: agent.outputHistory.filter((o) => o.status === 'approved').length, color: C.primary },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: S[5] }}>
      {/* Stat row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: S[4] }}>
        {stats.map(({ label, value, color }) => (
          <div key={label} style={{
            backgroundColor: C.surface2, border: `1px solid ${C.border}`,
            borderRadius: R.card, padding: S[4],
          }}>
            <div style={{ fontFamily: F.mono, fontSize: '26px', fontWeight: 700, color, lineHeight: 1, marginBottom: S[1] }}>
              {value}
            </div>
            <div style={{ fontFamily: F.body, fontSize: '12px', color: C.textMuted }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div style={{
        backgroundColor: C.surface2, border: `1px solid ${C.border}`, borderRadius: R.card, padding: S[5],
      }}>
        <div style={{ fontFamily: F.body, fontSize: '12px', fontWeight: 600, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: S[4] }}>
          14-Day Quality Score
        </div>
        <div style={{ height: '220px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 4, right: 8, bottom: 4, left: 0 }}>
              <CartesianGrid stroke={C.border} strokeDasharray="3 3" vertical={false}/>
              <XAxis dataKey="day" tick={{ fill: C.textMuted, fontSize: 10, fontFamily: "'JetBrains Mono'" }} axisLine={false} tickLine={false}/>
              <YAxis domain={[50, 100]} tick={{ fill: C.textMuted, fontSize: 10, fontFamily: "'JetBrains Mono'" }} axisLine={false} tickLine={false} width={28}/>
              <Tooltip content={<PerfTooltip />}/>
              <Legend wrapperStyle={{ fontFamily: "'DM Sans'", fontSize: '12px', color: C.textSecondary }}/>
              <Line type="monotone" dataKey="brandScore" name="Brand Score" stroke={C.primary} strokeWidth={2} dot={false} activeDot={{ r: 4, fill: C.primary }}/>
              <Line type="monotone" dataKey="accuracy"   name="Accuracy"    stroke={C.secondary} strokeWidth={2} dot={false} activeDot={{ r: 4, fill: C.secondary }}/>
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <button
        style={{
          alignSelf: 'flex-start', padding: `${S[2]} ${S[4]}`,
          fontFamily: F.body, fontSize: '13px', fontWeight: 600,
          color: C.textSecondary, backgroundColor: C.surface2,
          border: `1px solid ${C.border}`, borderRadius: R.button, cursor: 'pointer',
        }}
        onClick={() => toast.info('Full performance report export coming soon.')}
      >
        Export Performance Report
      </button>
    </div>
  );
}

// ── Agent Header ──────────────────────────────
function AgentHeader({ agent }) {
  const toast   = useToast();
  const isActive = agent.status === 'active';
  const typeLabel = AGENT_TYPE_LABELS[agent.type] ?? agent.type;

  return (
    <div style={{
      backgroundColor: C.surface, border: `1px solid ${C.border}`,
      borderRadius: R.card, padding: S[5], marginBottom: S[5],
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: S[4] }}>
        {/* Icon */}
        <div style={{
          width: '56px', height: '56px', borderRadius: R.md, flexShrink: 0,
          backgroundColor: isActive ? C.primaryGlow : C.surface2,
          border: `1px solid ${isActive ? 'rgba(61,220,132,0.25)' : C.border}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: isActive ? `0 0 20px ${C.primaryGlow}` : 'none',
        }}>
          <AgentIcon type={agent.iconType} size={28} color={isActive ? C.primary : C.textSecondary} />
        </div>

        {/* Name + meta */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: S[3], flexWrap: 'wrap', marginBottom: S[2] }}>
            <h1 style={{ fontFamily: F.display, fontSize: '22px', fontWeight: 800, color: C.textPrimary, margin: 0, letterSpacing: '-0.02em' }}>
              {agent.name}
            </h1>
            <span style={{ ...badge.base, ...(isActive ? badge.green : badge.muted) }}>
              {isActive ? '● Active' : '○ Idle'}
            </span>
            <span style={{ ...badge.base, ...badge.muted, fontSize: '11px' }}>{typeLabel}</span>
          </div>

          {agent.currentTask ? (
            <div style={{ fontFamily: F.body, fontSize: '13px', color: C.textSecondary, marginBottom: S[3], lineHeight: '1.4' }}>
              <span style={{ color: C.textMuted, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>Current task: </span>
              {agent.currentTask}
            </div>
          ) : (
            <div style={{ fontFamily: F.body, fontSize: '13px', color: C.textMuted, fontStyle: 'italic', marginBottom: S[3] }}>
              No active task
            </div>
          )}

          {/* Skills */}
          <div style={{ marginBottom: S[2] }}>
            <div style={{ fontFamily: F.body, fontSize: '10px', fontWeight: 600, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: S[1] }}>Skills</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: S[1] }}>
              {agent.skills.map((sk) => <span key={sk} style={{ ...badge.base, ...badge.muted, fontSize: '10px' }}>{sk}</span>)}
            </div>
          </div>

          {/* Tools */}
          <div>
            <div style={{ fontFamily: F.body, fontSize: '10px', fontWeight: 600, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: S[1] }}>Tools</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: S[1] }}>
              {agent.tools.map((t) => (
                <span key={t} style={{ ...badge.base, backgroundColor: C.surface3, color: C.secondary, border: `1px solid rgba(94,234,212,0.2)`, fontSize: '10px' }}>{t}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: S[2], flexShrink: 0 }}>
          <button
            style={{
              padding: `${S[2]} ${S[4]}`, fontFamily: F.body, fontSize: '13px', fontWeight: 600,
              color: C.bg, backgroundColor: C.primary, border: 'none', borderRadius: R.button, cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
            onClick={() => toast.info('Test agent modal coming soon from detail view.')}
          >
            Test Agent
          </button>
          <button
            style={{
              padding: `${S[2]} ${S[4]}`, fontFamily: F.body, fontSize: '13px', fontWeight: 500,
              color: C.textSecondary, backgroundColor: 'transparent',
              border: `1px solid ${C.border}`, borderRadius: R.button, cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
            onClick={() => toast.info(isActive ? 'Agent paused.' : 'Agent resumed.')}
          >
            {isActive ? 'Pause Agent' : 'Resume Agent'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Tabs ──────────────────────────────────────
const TABS = [
  { id: 'outputs',       label: 'Output History' },
  { id: 'configuration', label: 'Configuration'  },
  { id: 'performance',   label: 'Performance'    },
];

// ── Page ──────────────────────────────────────
export default function AgentDetail() {
  const { id }     = useParams();
  const navigate   = useNavigate();
  const [tab, setTab] = useState('outputs');

  const agent = getAgent(id);

  if (!agent) {
    return (
      <div style={{ padding: S[8], textAlign: 'center', color: C.textMuted, fontFamily: F.body, fontSize: '14px' }}>
        Agent not found.{' '}
        <button style={{ background: 'none', border: 'none', color: C.primary, cursor: 'pointer', fontFamily: F.body, fontSize: '14px' }} onClick={() => navigate('/agents')}>
          Back to roster
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: `${S[6]} ${S[6]} ${S[8]}`, minHeight: '100vh', backgroundColor: C.bg }}>

      {/* Back breadcrumb */}
      <button
        style={{
          background: 'none', border: 'none', cursor: 'pointer', padding: 0,
          fontFamily: F.body, fontSize: '12px', color: C.textMuted,
          display: 'flex', alignItems: 'center', gap: S[1], marginBottom: S[4],
        }}
        onClick={() => navigate('/agents')}
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M9 2L4 7l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        Agent Roster
      </button>

      {/* Agent header */}
      <AgentHeader agent={agent} />

      {/* Tab bar */}
      <div style={{ display: 'flex', gap: 0, borderBottom: `1px solid ${C.border}`, marginBottom: S[5] }}>
        {TABS.map((t) => {
          const active = tab === t.id;
          return (
            <button
              key={t.id}
              style={{
                padding: `${S[2]} ${S[4]}`, fontFamily: F.body, fontSize: '13px', fontWeight: active ? 600 : 400,
                color: active ? C.primary : C.textSecondary,
                backgroundColor: 'transparent', border: 'none',
                borderBottom: `2px solid ${active ? C.primary : 'transparent'}`,
                cursor: 'pointer', transition: T.color,
                marginBottom: '-1px',
              }}
              onClick={() => setTab(t.id)}
            >
              {t.label}
              {t.id === 'outputs' && (
                <span style={{
                  marginLeft: S[1], fontFamily: F.mono, fontSize: '10px',
                  color: active ? C.primary : C.textMuted,
                  backgroundColor: active ? 'rgba(61,220,132,0.12)' : C.surface3,
                  borderRadius: R.pill, padding: `0 5px`,
                }}>
                  {agent.outputHistory.length}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      {tab === 'outputs'       && <OutputHistoryTab   agent={agent} />}
      {tab === 'configuration' && <ConfigurationTab   agent={agent} />}
      {tab === 'performance'   && <PerformanceTab     agent={agent} />}
    </div>
  );
}
