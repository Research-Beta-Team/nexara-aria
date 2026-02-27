import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { C, F, R, S, T, badge, shadows, scrollbarStyle } from '../tokens';
import useToast from '../hooks/useToast';
import AgentIcon from '../components/agent/AgentIcon';
import { agents, AGENT_TYPE_LABELS } from '../data/agents';

// ── Status dot ────────────────────────────────
function StatusDot({ status }) {
  const active = status === 'active';
  return (
    <span style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '10px', height: '10px', flexShrink: 0 }}>
      {active && (
        <span style={{
          position: 'absolute', width: '16px', height: '16px', borderRadius: '50%',
          backgroundColor: C.primary, opacity: 0.25,
          animation: 'rosterPulse 2s ease-in-out infinite',
        }}/>
      )}
      <span style={{
        width: '8px', height: '8px', borderRadius: '50%',
        backgroundColor: active ? C.primary : C.textMuted,
        boxShadow: active ? `0 0 6px ${C.primary}` : 'none',
      }}/>
    </span>
  );
}

// ── Test Agent Modal ──────────────────────────
function TestAgentModal({ agent, onClose }) {
  const toast = useToast();
  const [prompt, setPrompt] = useState('');
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState(null);

  const handleRun = () => {
    if (!prompt.trim()) { toast.warning('Enter a test prompt first.'); return; }
    setRunning(true);
    setResult(null);
    setTimeout(() => {
      setRunning(false);
      setResult({
        score: 88 + Math.floor(Math.random() * 10),
        text: `[ARIA Test Output — ${agent.name}]\n\nBased on your prompt: "${prompt.slice(0, 60)}${prompt.length > 60 ? '…' : ''}"\n\nThis is a simulated response from the ${agent.name} agent. In production, the agent would execute your prompt using its configured tools (${agent.tools.slice(0, 2).join(', ')}) and return a full output with brand scoring, accuracy metrics, and approval routing.\n\nAgent tools active: ${agent.tools.join(', ')}\nApproval gate: ${agent.config?.approvalGate ?? 'N/A'}`,
      });
    }, 2000);
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 400,
      backgroundColor: C.overlay,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: S[4],
    }} onClick={onClose}>
      <div style={{
        backgroundColor: C.surface, border: `1px solid ${C.border}`,
        borderRadius: R.card, padding: S[6], width: '520px', maxWidth: '100%',
        boxShadow: shadows.modal,
      }} onClick={(e) => e.stopPropagation()}>

        <div style={{ display: 'flex', alignItems: 'center', gap: S[3], marginBottom: S[5] }}>
          <div style={{
            width: '40px', height: '40px', borderRadius: R.md, flexShrink: 0,
            backgroundColor: C.surface3, border: `1px solid ${C.border}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <AgentIcon type={agent.iconType} size={20} color={C.primary} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: F.display, fontSize: '16px', fontWeight: 700, color: C.textPrimary }}>
              Test {agent.name}
            </div>
            <div style={{ fontFamily: F.body, fontSize: '12px', color: C.textSecondary }}>
              Run a test prompt against this agent
            </div>
          </div>
          <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.textMuted, padding: S[1] }} onClick={onClose}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        <div style={{ marginBottom: S[3] }}>
          <div style={{ fontFamily: F.body, fontSize: '11px', fontWeight: 600, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: S[2] }}>
            Test Prompt
          </div>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder={`e.g. Generate a ${agent.skills[0].toLowerCase()} for a CFO at a 500-person SaaS company in Vietnam`}
            rows={4}
            style={{
              width: '100%', boxSizing: 'border-box',
              backgroundColor: C.surface2, color: C.textPrimary,
              border: `1px solid ${C.border}`, borderRadius: R.input,
              padding: `${S[2]} ${S[3]}`, fontFamily: F.body, fontSize: '13px',
              resize: 'vertical', outline: 'none', lineHeight: '1.5',
            }}
          />
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: S[1], marginBottom: S[4] }}>
          {agent.skills.slice(0, 3).map((sk) => (
            <span key={sk} style={{ ...badge.base, ...badge.muted, fontSize: '10px' }}>{sk}</span>
          ))}
        </div>

        <button
          style={{
            width: '100%', padding: `${S[3]} 0`, fontFamily: F.body, fontSize: '14px',
            fontWeight: 600,
            color: running || !prompt.trim() ? C.textMuted : C.bg,
            backgroundColor: running || !prompt.trim() ? C.surface3 : C.primary,
            border: `1px solid ${running || !prompt.trim() ? C.border : C.primary}`,
            borderRadius: R.button, cursor: running || !prompt.trim() ? 'not-allowed' : 'pointer',
            transition: T.base, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: S[2],
          }}
          onClick={handleRun}
          disabled={running}
        >
          {running ? (
            <>
              <div style={{ width: '14px', height: '14px', borderRadius: '50%', border: `2px solid ${C.primary}`, borderTopColor: 'transparent', animation: 'modalSpin 0.8s linear infinite' }}/>
              Running…
            </>
          ) : (
            <>
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                <path d="M2.5 1.5l9 5-9 5v-10z" fill="currentColor"/>
              </svg>
              Run Test
            </>
          )}
        </button>

        {result && (
          <div style={{ marginTop: S[4], backgroundColor: C.surface2, border: `1px solid ${C.border}`, borderRadius: R.md, padding: S[3] }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: S[2] }}>
              <span style={{ fontFamily: F.mono, fontSize: '11px', color: C.primary, fontWeight: 700 }}>AGENT OUTPUT</span>
              <span style={{ ...badge.base, ...badge.green }}>Brand {result.score}/100</span>
            </div>
            <pre style={{ fontFamily: F.mono, fontSize: '11px', color: C.textSecondary, whiteSpace: 'pre-wrap', lineHeight: '1.6', margin: 0 }}>
              {result.text}
            </pre>
          </div>
        )}
      </div>
      <style>{`
        @keyframes modalSpin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}

// ── Agent Card ────────────────────────────────
function AgentCard({ agent, onTest }) {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const isActive = agent.status === 'active';
  const typeLabel = AGENT_TYPE_LABELS[agent.type] ?? agent.type;

  return (
    <div
      style={{
        backgroundColor: C.surface,
        border: `1px solid ${hovered ? C.borderHover : C.border}`,
        borderRadius: R.card,
        overflow: 'hidden',
        transition: T.base,
        boxShadow: hovered ? shadows.cardHover : 'none',
        display: 'flex',
        flexDirection: 'column',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {isActive && (
        <div style={{ height: '2px', backgroundColor: C.primary, boxShadow: `0 0 8px ${C.primary}`, flexShrink: 0 }}/>
      )}

      <div style={{ padding: S[4], flex: 1, display: 'flex', flexDirection: 'column', gap: S[3] }}>
        {/* Header row */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: S[3] }}>
          <div style={{
            width: '44px', height: '44px', borderRadius: R.md, flexShrink: 0,
            backgroundColor: isActive ? C.primaryGlow : C.surface2,
            border: `1px solid ${isActive ? 'rgba(61,220,132,0.2)' : C.border}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <AgentIcon type={agent.iconType} size={22} color={isActive ? C.primary : C.textSecondary} />
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: S[2], marginBottom: '3px' }}>
              <StatusDot status={agent.status} />
              <span style={{ fontFamily: F.display, fontSize: '14px', fontWeight: 700, color: C.textPrimary }}>{agent.name}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: S[2] }}>
              <span style={{ fontFamily: F.mono, fontSize: '10px', color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{typeLabel}</span>
              <span style={{ fontFamily: F.mono, fontSize: '10px', color: isActive ? C.primary : C.textMuted, fontWeight: 600 }}>
                {isActive ? '● ACTIVE' : '○ IDLE'}
              </span>
            </div>
          </div>

          <button
            style={{
              background: 'none', border: `1px solid ${C.border}`, borderRadius: R.sm,
              color: C.textMuted, cursor: 'pointer', padding: '3px 6px',
              fontSize: '13px', fontFamily: F.mono, lineHeight: 1,
              transition: T.color, flexShrink: 0,
            }}
            onClick={() => setExpanded((x) => !x)}
          >
            {expanded ? '−' : '+'}
          </button>
        </div>

        {/* Current task */}
        {agent.currentTask ? (
          <div style={{
            fontFamily: F.body, fontSize: '12px', color: C.textSecondary, lineHeight: '1.4',
            display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
          }}>
            {agent.currentTask}
          </div>
        ) : (
          <div style={{ fontFamily: F.body, fontSize: '12px', color: C.textMuted, fontStyle: 'italic' }}>No active task</div>
        )}

        {/* Collapsed: counts */}
        {!expanded && (
          <div style={{ display: 'flex', gap: S[4] }}>
            {[['skills', agent.skills.length], ['tools', agent.tools.length], ['outputs', agent.outputHistory.length]].map(([label, count]) => (
              <span key={label} style={{ fontFamily: F.mono, fontSize: '11px', color: C.textMuted }}>
                <span style={{ color: C.textSecondary, fontWeight: 600 }}>{count}</span> {label}
              </span>
            ))}
          </div>
        )}

        {/* Expanded: skills + tools */}
        {expanded && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: S[3], borderTop: `1px solid ${C.border}`, paddingTop: S[3] }}>
            <div>
              <div style={{ fontFamily: F.body, fontSize: '10px', fontWeight: 600, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: S[1] }}>Skills</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: S[1] }}>
                {agent.skills.map((sk) => <span key={sk} style={{ ...badge.base, ...badge.muted, fontSize: '10px' }}>{sk}</span>)}
              </div>
            </div>
            <div>
              <div style={{ fontFamily: F.body, fontSize: '10px', fontWeight: 600, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: S[1] }}>Tools</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: S[1] }}>
                {agent.tools.map((t) => (
                  <span key={t} style={{ ...badge.base, backgroundColor: C.surface3, color: C.secondary, border: `1px solid rgba(94,234,212,0.2)`, fontSize: '10px' }}>{t}</span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div style={{
        borderTop: `1px solid ${C.border}`, padding: `${S[2]} ${S[4]}`,
        display: 'flex', gap: S[2], backgroundColor: C.surface2,
      }}>
        <button
          style={{
            flex: 1, padding: `${S[1]} 0`, fontFamily: F.body, fontSize: '12px', fontWeight: 600,
            color: hovered ? C.primary : C.textSecondary,
            backgroundColor: 'transparent', border: 'none',
            cursor: 'pointer', transition: T.color, textAlign: 'left',
          }}
          onClick={() => navigate(`/agents/${agent.id}`)}
        >
          {hovered ? 'View output →' : 'View detail'}
        </button>
        <button
          style={{
            padding: `${S[1]} ${S[3]}`, fontFamily: F.body, fontSize: '12px', fontWeight: 600,
            color: C.textSecondary, backgroundColor: C.surface3,
            border: `1px solid ${C.border}`, borderRadius: R.button,
            cursor: 'pointer', transition: T.color, whiteSpace: 'nowrap',
          }}
          onClick={(e) => { e.stopPropagation(); onTest(agent); }}
        >
          Test Agent
        </button>
      </div>
    </div>
  );
}

// ── Filter bar ────────────────────────────────
const FILTERS = [
  { id: 'all',          label: 'All'          },
  { id: 'active',       label: 'Active'       },
  { id: 'idle',         label: 'Idle'         },
  { id: 'outreach',     label: 'Outreach'     },
  { id: 'creative',     label: 'Creative'     },
  { id: 'paid',         label: 'Paid Media'   },
  { id: 'intelligence', label: 'Intelligence' },
  { id: 'ops',          label: 'Ops'          },
  { id: 'qa',           label: 'QA'           },
];

function filterCount(id) {
  if (id === 'all')    return agents.length;
  if (id === 'active') return agents.filter((a) => a.status === 'active').length;
  if (id === 'idle')   return agents.filter((a) => a.status === 'idle').length;
  return agents.filter((a) => a.type === id).length;
}

function applyFilter(list, id) {
  if (id === 'all')    return list;
  if (id === 'active') return list.filter((a) => a.status === 'active');
  if (id === 'idle')   return list.filter((a) => a.status === 'idle');
  return list.filter((a) => a.type === id);
}

// ── Page ──────────────────────────────────────
export default function AgentRoster() {
  const [filter, setFilter]     = useState('all');
  const [testAgent, setTestAgent] = useState(null);

  const filtered     = applyFilter(agents, filter);
  const activeCount  = agents.filter((a) => a.status === 'active').length;

  return (
    <>
      {testAgent && <TestAgentModal agent={testAgent} onClose={() => setTestAgent(null)} />}

      <div style={{ padding: `${S[6]} ${S[6]} ${S[8]}`, minHeight: '100vh', backgroundColor: C.bg }}>

        {/* Page header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: S[6] }}>
          <div>
            <h1 style={{ fontFamily: F.display, fontSize: '24px', fontWeight: 800, color: C.textPrimary, margin: 0, letterSpacing: '-0.03em' }}>
              Agent Roster
            </h1>
            <p style={{ fontFamily: F.body, fontSize: '13px', color: C.textSecondary, margin: `${S[1]} 0 0` }}>
              {activeCount} of {agents.length} agents currently active
            </p>
          </div>

          <div style={{
            display: 'flex', alignItems: 'center', gap: S[2],
            backgroundColor: C.primaryGlow, border: `1px solid rgba(61,220,132,0.2)`,
            borderRadius: R.pill, padding: `${S[1]} ${S[3]}`,
          }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: C.primary, animation: 'rosterPulse 2s ease-in-out infinite' }}/>
            <span style={{ fontFamily: F.mono, fontSize: '11px', fontWeight: 700, color: C.primary, letterSpacing: '0.04em' }}>ARIA LIVE</span>
          </div>
        </div>

        {/* Filter bar */}
        <div style={{ display: 'flex', gap: S[1], flexWrap: 'wrap', marginBottom: S[5] }}>
          {FILTERS.map((f) => {
            const isActive = filter === f.id;
            return (
              <button
                key={f.id}
                style={{
                  fontFamily: F.body, fontSize: '13px', fontWeight: isActive ? 600 : 400,
                  color: isActive ? C.primary : C.textSecondary,
                  backgroundColor: isActive ? C.primaryGlow : C.surface2,
                  border: `1px solid ${isActive ? 'rgba(61,220,132,0.3)' : C.border}`,
                  borderRadius: R.pill, padding: `${S[1]} ${S[3]}`,
                  cursor: 'pointer', transition: T.color,
                  display: 'flex', alignItems: 'center', gap: S[1],
                }}
                onClick={() => setFilter(f.id)}
              >
                {f.label}
                <span style={{
                  fontFamily: F.mono, fontSize: '10px',
                  color: isActive ? C.primary : C.textMuted,
                  backgroundColor: isActive ? 'rgba(61,220,132,0.12)' : C.surface3,
                  borderRadius: R.pill, padding: `0 5px`,
                }}>
                  {filterCount(f.id)}
                </span>
              </button>
            );
          })}
        </div>

        {/* Card grid */}
        {filtered.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: S[4] }}>
            {filtered.map((agent) => (
              <AgentCard key={agent.id} agent={agent} onTest={setTestAgent} />
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: `${S[16]} 0`, color: C.textMuted, fontFamily: F.body, fontSize: '14px' }}>
            No agents match this filter.
          </div>
        )}
      </div>

      <style>{`
        @keyframes rosterPulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.4;transform:scale(0.75)} }
      `}</style>
    </>
  );
}
