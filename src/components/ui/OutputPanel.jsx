/**
 * OutputPanel — displays structured agent output inline on pages.
 *
 * Props:
 *   output: { type, title, agentId, agentName, content, metadata, timestamp, status }
 *   onApprove, onReject, onEdit
 *   collapsed (default false)
 */
import { useState, useEffect } from 'react';
import useToast from '../../hooks/useToast';
import { C, F, R, S, T, shadows } from '../../tokens';
import AgentRoleIcon from './AgentRoleIcon';

const STATUS_COLORS = {
  running: C.amber,
  done: C.primary,
  error: C.red,
  pending: C.textMuted,
};

function StatusBadge({ status }) {
  const color = STATUS_COLORS[status] || C.textMuted;
  const labels = { running: 'Running', done: 'Done', error: 'Error', pending: 'Pending' };
  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '4px',
      padding: '2px 8px',
      borderRadius: '999px',
      backgroundColor: `${color}20`,
      border: `1px solid ${color}`,
      fontFamily: F.mono,
      fontSize: '10px',
      fontWeight: 700,
      color,
      letterSpacing: '0.04em',
    }}>
      {status === 'running' && <span style={{ animation: 'spin 1s linear infinite' }}>⟳</span>}
      {labels[status] || status}
    </span>
  );
}

function formatTimestamp(ts) {
  if (!ts) return '';
  const d = typeof ts === 'number' ? new Date(ts) : new Date(ts);
  if (isNaN(d)) return '';
  const diff = Date.now() - d.getTime();
  if (diff < 60000) return 'just now';
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

// ── Content renderers by type ──────────────────────────────────

function StrategyContent({ content }) {
  if (!content) return <p style={{ color: C.textMuted, fontStyle: 'italic' }}>No content</p>;
  const lines = String(content).split('\n');
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: S[2] }}>
      {lines.map((line, i) => {
        if (line.startsWith('##') || line.startsWith('**')) {
          return (
            <p key={i} style={{ fontFamily: F.display, fontSize: '14px', fontWeight: 700, color: C.textPrimary, margin: 0, marginTop: i > 0 ? S[2] : 0 }}>
              {line.replace(/^#{1,3}\s*/, '').replace(/\*\*/g, '')}
            </p>
          );
        }
        if (line.startsWith('- ') || line.startsWith('• ')) {
          return (
            <div key={i} style={{ display: 'flex', gap: S[2], alignItems: 'flex-start' }}>
              <span style={{ color: C.primary, marginTop: '2px', flexShrink: 0 }}>▸</span>
              <span style={{ fontFamily: F.body, fontSize: '13px', color: C.textSecondary, lineHeight: 1.6 }}>
                {line.replace(/^[-•]\s*/, '')}
              </span>
            </div>
          );
        }
        if (!line.trim()) return null;
        return (
          <p key={i} style={{ fontFamily: F.body, fontSize: '13px', color: C.textSecondary, margin: 0, lineHeight: 1.6 }}>
            {line}
          </p>
        );
      }).filter(Boolean)}
    </div>
  );
}

function ContentOutput({ content, metadata }) {
  const toast = useToast();
  const handleCopy = () => {
    navigator.clipboard?.writeText(String(content || '')).catch(() => {});
    toast.success('Copied to clipboard');
  };
  return (
    <div>
      <div style={{
        backgroundColor: C.surface2,
        border: `1px solid ${C.border}`,
        borderRadius: R.md,
        padding: S[3],
        fontFamily: F.body,
        fontSize: '13px',
        color: C.textSecondary,
        lineHeight: 1.7,
        whiteSpace: 'pre-wrap',
        position: 'relative',
      }}>
        {String(content || '')}
        <button
          type="button"
          onClick={handleCopy}
          style={{
            position: 'absolute',
            top: S[2],
            right: S[2],
            padding: `2px ${S[2]}`,
            backgroundColor: C.surface3,
            border: `1px solid ${C.border}`,
            borderRadius: R.sm,
            fontFamily: F.mono,
            fontSize: '10px',
            color: C.textMuted,
            cursor: 'pointer',
          }}
        >
          Copy
        </button>
      </div>
      {metadata && (
        <div style={{ display: 'flex', gap: S[2], marginTop: S[2], flexWrap: 'wrap' }}>
          {metadata.wordCount && (
            <span style={{ fontFamily: F.mono, fontSize: '11px', color: C.textMuted }}>
              {metadata.wordCount} words
            </span>
          )}
          {metadata.ctrPrediction && (
            <span style={{ fontFamily: F.mono, fontSize: '11px', color: C.green }}>
              Predicted CTR: {metadata.ctrPrediction}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

function LeadsOutput({ content }) {
  const rows = Array.isArray(content) ? content : [];
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: F.body, fontSize: '12px' }}>
        <thead>
          <tr>
            {['Name', 'Company', 'Score'].map((h) => (
              <th key={h} style={{ textAlign: 'left', padding: `${S[1]} ${S[3]}`, color: C.textMuted, fontWeight: 600, borderBottom: `1px solid ${C.border}`, textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '11px' }}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} style={{ borderBottom: `1px solid ${C.border}` }}>
              <td style={{ padding: `${S[2]} ${S[3]}`, color: C.textPrimary }}>{row.name || '—'}</td>
              <td style={{ padding: `${S[2]} ${S[3]}`, color: C.textSecondary }}>{row.company || '—'}</td>
              <td style={{ padding: `${S[2]} ${S[3]}` }}>
                <span style={{
                  fontFamily: F.mono,
                  fontSize: '12px',
                  fontWeight: 700,
                  color: (row.score || 0) >= 70 ? C.green : (row.score || 0) >= 50 ? C.amber : C.red,
                }}>
                  {row.score ?? '—'}
                </span>
              </td>
            </tr>
          ))}
          {rows.length === 0 && (
            <tr>
              <td colSpan={3} style={{ padding: S[4], textAlign: 'center', color: C.textMuted }}>No leads data</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

function InsightsOutput({ content }) {
  const cards = Array.isArray(content) ? content : Object.entries(content || {}).map(([k, v]) => ({ label: k, value: v }));
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: S[3] }}>
      {cards.map((card, i) => (
        <div key={i} style={{
          backgroundColor: C.surface2,
          border: `1px solid ${C.border}`,
          borderRadius: R.md,
          padding: S[3],
          display: 'flex',
          flexDirection: 'column',
          gap: S[1],
        }}>
          <span style={{ fontFamily: F.body, fontSize: '11px', color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {card.label}
          </span>
          <span style={{ fontFamily: F.mono, fontSize: '20px', fontWeight: 700, color: C.textPrimary }}>
            {card.value}
          </span>
          {card.trend && (
            <span style={{ fontFamily: F.mono, fontSize: '11px', color: card.trend > 0 ? C.green : C.red }}>
              {card.trend > 0 ? '▲' : '▼'} {Math.abs(card.trend)}%
            </span>
          )}
        </div>
      ))}
    </div>
  );
}

function SequenceOutput({ content }) {
  const steps = Array.isArray(content) ? content : [];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: S[3] }}>
      {steps.map((step, i) => (
        <div key={i} style={{ display: 'flex', gap: S[3] }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              backgroundColor: C.primaryGlow,
              border: `2px solid ${C.primary}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: F.mono,
              fontSize: '11px',
              fontWeight: 700,
              color: C.primary,
              flexShrink: 0,
            }}>
              {i + 1}
            </div>
            {i < steps.length - 1 && (
              <div style={{ width: '2px', flex: 1, backgroundColor: C.border, marginTop: S[1] }} />
            )}
          </div>
          <div style={{ flex: 1, paddingBottom: i < steps.length - 1 ? S[3] : 0 }}>
            <p style={{ fontFamily: F.body, fontSize: '13px', fontWeight: 600, color: C.textPrimary, margin: 0 }}>
              {step.subject || step.title || `Step ${i + 1}`}
            </p>
            <p style={{ fontFamily: F.body, fontSize: '12px', color: C.textSecondary, margin: `${S[1]} 0 0` }}>
              {step.body || step.description || ''}
            </p>
            {step.delay && (
              <span style={{ fontFamily: F.mono, fontSize: '11px', color: C.textMuted }}>
                Delay: {step.delay}
              </span>
            )}
          </div>
        </div>
      ))}
      {steps.length === 0 && <p style={{ color: C.textMuted }}>No sequence steps</p>}
    </div>
  );
}

function ReportOutput({ content }) {
  const data = typeof content === 'object' && content !== null ? content : { summary: String(content || '') };
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: S[3] }}>
      {data.summary && (
        <div>
          <p style={{ fontFamily: F.body, fontSize: '12px', fontWeight: 700, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.06em', margin: `0 0 ${S[1]}` }}>Summary</p>
          <p style={{ fontFamily: F.body, fontSize: '13px', color: C.textSecondary, lineHeight: 1.6, margin: 0 }}>{data.summary}</p>
        </div>
      )}
      {data.findings && (
        <div>
          <p style={{ fontFamily: F.body, fontSize: '12px', fontWeight: 700, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.06em', margin: `0 0 ${S[1]}` }}>Key Findings</p>
          {(Array.isArray(data.findings) ? data.findings : [data.findings]).map((f, i) => (
            <div key={i} style={{ display: 'flex', gap: S[2], marginBottom: S[1] }}>
              <span style={{ color: C.primary }}>▸</span>
              <span style={{ fontFamily: F.body, fontSize: '13px', color: C.textSecondary }}>{f}</span>
            </div>
          ))}
        </div>
      )}
      {data.recommendations && (
        <div>
          <p style={{ fontFamily: F.body, fontSize: '12px', fontWeight: 700, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.06em', margin: `0 0 ${S[1]}` }}>Recommendations</p>
          {(Array.isArray(data.recommendations) ? data.recommendations : [data.recommendations]).map((r, i) => (
            <div key={i} style={{ display: 'flex', gap: S[2], marginBottom: S[1] }}>
              <span style={{ color: C.amber }}>→</span>
              <span style={{ fontFamily: F.body, fontSize: '13px', color: C.textSecondary }}>{r}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function DefaultOutput({ content }) {
  return (
    <p style={{
      fontFamily: F.body,
      fontSize: '13px',
      color: C.textSecondary,
      lineHeight: 1.7,
      margin: 0,
      whiteSpace: 'pre-wrap',
    }}>
      {typeof content === 'string' ? content : JSON.stringify(content, null, 2)}
    </p>
  );
}

function OutputBody({ type, content, metadata }) {
  switch (type) {
    case 'strategy': return <StrategyContent content={content} />;
    case 'content': return <ContentOutput content={content} metadata={metadata} />;
    case 'leads': return <LeadsOutput content={content} />;
    case 'insights': return <InsightsOutput content={content} />;
    case 'sequence': return <SequenceOutput content={content} />;
    case 'report': return <ReportOutput content={content} />;
    default: return <DefaultOutput content={content} />;
  }
}

export default function OutputPanel({ output, onApprove, onReject, onEdit, collapsed: collapsedProp = false }) {
  const toast = useToast();
  const [collapsed, setCollapsed] = useState(collapsedProp);

  if (!output) return null;

  const { type = 'default', title, agentId, agentName, content, metadata, timestamp, status = 'done' } = output;

  const borderColor = status === 'running' ? C.amber : status === 'error' ? C.red : C.primary;

  const handleCopyAll = () => {
    const text = typeof content === 'string' ? content : JSON.stringify(content, null, 2);
    navigator.clipboard?.writeText(text).catch(() => {});
    toast.success('Output copied');
  };
  const handleApprove = () => {
    toast.success('Output approved');
    onApprove?.(output);
  };
  const handleReject = () => {
    toast.error('Output rejected');
    onReject?.(output);
  };
  const handleEdit = () => {
    toast.info('Edit output (mock)');
    onEdit?.(output);
  };

  return (
    <div style={{
      backgroundColor: C.surface,
      border: `1px solid ${C.border}`,
      borderRadius: R.card,
      overflow: 'hidden',
      boxShadow: shadows.card,
      borderTop: `3px solid ${borderColor}`,
      transition: `border-top-color 0.3s ease`,
    }}>
      {/* Collapsible header */}
      <button
        type="button"
        onClick={() => setCollapsed((c) => !c)}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
          padding: `${S[3]} ${S[4]}`,
          background: 'none',
          border: 'none',
          borderBottom: collapsed ? 'none' : `1px solid ${C.border}`,
          cursor: 'pointer',
          gap: S[3],
          textAlign: 'left',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: S[3] }}>
          <span style={{ lineHeight: 0 }}><AgentRoleIcon agentId={agentId || 'freya'} size={18} color={C.primary} /></span>
          <div>
            <div style={{ fontFamily: F.display, fontSize: '14px', fontWeight: 700, color: C.textPrimary }}>
              {title || type}
            </div>
            <div style={{ fontFamily: F.body, fontSize: '12px', color: C.textMuted }}>
              {agentName || agentId} · {formatTimestamp(timestamp)}
            </div>
          </div>
          <StatusBadge status={status} />
        </div>
        <span style={{
          color: C.textMuted,
          transform: collapsed ? 'rotate(0deg)' : 'rotate(180deg)',
          transition: T.base,
          display: 'inline-block',
          flexShrink: 0,
        }}>
          ▾
        </span>
      </button>

      {!collapsed && (
        <>
          {/* Body */}
          <div style={{ padding: `${S[4]} ${S[4]}` }}>
            <OutputBody type={type} content={content} metadata={metadata} />
          </div>

          {/* Footer actions */}
          <div style={{
            padding: `${S[2]} ${S[4]}`,
            borderTop: `1px solid ${C.border}`,
            display: 'flex',
            alignItems: 'center',
            gap: S[2],
            flexWrap: 'wrap',
          }}>
            <button
              type="button"
              onClick={handleApprove}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: S[1],
                padding: `${S[2]} ${S[3]}`,
                backgroundColor: C.primary,
                color: C.textInverse,
                border: 'none',
                borderRadius: R.button,
                fontFamily: F.body,
                fontSize: '12px',
                fontWeight: 700,
                cursor: 'pointer',
                transition: T.color,
              }}
            >
              ✓ Approve output
            </button>
            <button
              type="button"
              onClick={handleReject}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: S[1],
                padding: `${S[2]} ${S[3]}`,
                backgroundColor: 'transparent',
                color: C.red,
                border: `1px solid ${C.red}`,
                borderRadius: R.button,
                fontFamily: F.body,
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: T.color,
              }}
            >
              ✕ Reject
            </button>
            <button
              type="button"
              onClick={handleEdit}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: S[1],
                padding: `${S[2]} ${S[3]}`,
                backgroundColor: 'transparent',
                color: C.textSecondary,
                border: `1px solid ${C.border}`,
                borderRadius: R.button,
                fontFamily: F.body,
                fontSize: '12px',
                cursor: 'pointer',
                transition: T.color,
              }}
            >
              ✏ Edit
            </button>
            <button
              type="button"
              onClick={handleCopyAll}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: S[1],
                padding: `${S[2]} ${S[3]}`,
                backgroundColor: 'transparent',
                color: C.textMuted,
                border: 'none',
                borderRadius: R.button,
                fontFamily: F.body,
                fontSize: '12px',
                cursor: 'pointer',
                transition: T.color,
                marginLeft: 'auto',
              }}
            >
              Copy all
            </button>
          </div>
        </>
      )}
    </div>
  );
}
