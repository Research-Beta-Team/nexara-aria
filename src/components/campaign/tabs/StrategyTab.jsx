import { useState, useCallback } from 'react';
import useToast from '../../../hooks/useToast';
import useStore from '../../../store/useStore';
import { useAgent } from '../../../hooks/useAgent';
import AgentThinking from '../../agents/AgentThinking';
import { C, F, R, S, T, btn, flex, inputStyle, inputFocusStyle } from '../../../tokens';
import { strategyData } from '../../../data/campaigns';
import AgentRoleIcon from '../../ui/AgentRoleIcon';
import { IconChart, IconHeart, IconMegaphone, IconTarget } from '../../ui/Icons';

/* ─── Mock agent outputs ────────────────────────────────────── */
const STRATEGY_OUTPUTS = [
  {
    id: 'so-1',
    title: 'Q2 Donor Strategy Brief',
    agent: { agentId: 'strategist', name: 'Strategist' },
    status: 'approved',
    date: 'Apr 2',
    preview: 'Position Medglobal as the operational bridge for healthcare professionals in crisis zones. Focus on donors aged 45–60 who have previously given to international health programs.',
  },
  {
    id: 'so-2',
    title: 'Competitor Analysis: MENA NGOs',
    agent: { agentId: 'analyst', name: 'Analyst' },
    status: 'in_review',
    date: 'Apr 1',
    preview: 'IRC leads on brand recognition; Médecins Sans Frontières dominates emergency response framing. Gap: humanitarian-as-infrastructure narrative is underutilized.',
  },
  {
    id: 'so-3',
    title: 'Pricing Strategy: Donor Tiers',
    agent: { agentId: 'revenue', name: 'Revenue' },
    status: 'draft',
    date: 'Mar 31',
    preview: 'Recommended donor tiers: $50/mo (Community), $200/mo (Partner), $1k/mo (Champion). Champion tier unlocks quarterly impact reports.',
  },
];

const APPROVAL_STAGES = [
  { id: 'owner',   label: 'Owner',    done: true  },
  { id: 'analyst', label: 'Analyst',  done: true  },
  { id: 'cmo',     label: 'CMO',      done: false },
  { id: 'final',   label: 'Final',    done: false },
];

const TEMPLATES = [
  { id: 'awareness', label: 'Brand Awareness', Icon: IconMegaphone },
  { id: 'demand',    label: 'Demand Gen', Icon: IconTarget },
  { id: 'donor',     label: 'Donor Acquisition', Icon: IconHeart },
];

const CHANNEL_MIX = [
  { label: 'Email',    pct: 40, color: C.primary },
  { label: 'LinkedIn', pct: 35, color: '#0A66C2' },
  { label: 'Meta',     pct: 25, color: '#1877F2' },
];

const KEY_MESSAGES = [
  'Medglobal operates where other NGOs cannot — delivering last-mile health services in active crisis zones.',
  'Every dollar converts to 4.2 hours of direct patient care through our embedded healthcare model.',
  'Donors receive quarterly impact reports with real patient outcomes and program metrics.',
];

function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

/* ─── Sub-components ─────────────────────────────────────────── */
function AgentActionBar({ strategist, analyst, onRunStrategist, onRunAnalyst }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: S[3], flexWrap: 'wrap',
      backgroundColor: C.surface2,
      border: `1px solid ${C.border}`,
      borderRadius: R.md,
      padding: `${S[3]} ${S[4]}`,
    }}>
      <span style={{ fontFamily: F.mono, fontSize: '11px', fontWeight: 700, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
        Strategy Agents
      </span>
      <div style={{ width: '1px', height: '20px', backgroundColor: C.border }} />
      <button
        onClick={onRunStrategist}
        disabled={strategist.isActive}
        style={{
          ...btn.primary,
          fontSize: '12px',
          padding: `${S[1]} ${S[3]}`,
          opacity: strategist.isActive ? 0.7 : 1,
          cursor: strategist.isActive ? 'wait' : 'pointer',
        }}
      >
        <IconTarget color={C.textInverse} width={14} height={14} />
        {strategist.isActive ? 'Strategist Running…' : '▶ Strategist'}
      </button>
      <button
        onClick={onRunAnalyst}
        disabled={analyst.isActive}
        style={{
          ...btn.secondary,
          fontSize: '12px',
          padding: `${S[1]} ${S[3]}`,
          opacity: analyst.isActive ? 0.7 : 1,
          cursor: analyst.isActive ? 'wait' : 'pointer',
        }}
      >
        <IconChart color={C.textPrimary} width={14} height={14} />
        {analyst.isActive ? 'Analyst Running…' : '▶ Analyst'}
      </button>
      <div style={{ marginLeft: 'auto', fontFamily: F.mono, fontSize: '10px', color: C.textMuted }}>
        Last run: 2h ago
      </div>
    </div>
  );
}

function StrategyEmptyState({ onGenerate, strategist }) {
  const [brief, setBrief] = useState('');
  const [focused, setFocused] = useState(false);
  const toast = useToast();

  return (
    <div style={{
      backgroundColor: C.surface2,
      border: `1px dashed ${C.border}`,
      borderRadius: R.card,
      padding: S[8],
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: S[4],
      textAlign: 'center',
    }}>
      <IconTarget color={C.primary} width={48} height={48} />
      <div>
        <div style={{ fontFamily: F.display, fontSize: '18px', fontWeight: 700, color: C.textPrimary, marginBottom: S[1] }}>
          No strategy yet
        </div>
        <div style={{ fontFamily: F.body, fontSize: '13px', color: C.textSecondary }}>
          Describe your campaign goal and Freya will generate a full strategy
        </div>
      </div>
      <textarea
        value={brief}
        onChange={e => setBrief(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder="e.g. Acquire major donors ($1k+ annual) for Medglobal's MENA healthcare programs. Target high-income professionals who have given to international health NGOs before."
        rows={4}
        style={{
          ...inputStyle,
          ...(focused ? inputFocusStyle : {}),
          width: '100%',
          maxWidth: '480px',
          resize: 'vertical',
          lineHeight: 1.6,
        }}
      />
      <button
        onClick={() => onGenerate(brief)}
        disabled={strategist.isActive || !brief.trim()}
        style={{
          ...btn.primary,
          fontSize: '15px',
          padding: `${S[3]} ${S[6]}`,
          opacity: (strategist.isActive || !brief.trim()) ? 0.6 : 1,
          cursor: (strategist.isActive || !brief.trim()) ? 'not-allowed' : 'pointer',
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
        }}
      >
        <IconTarget color={C.textInverse} width={16} height={16} />
        {strategist.isActive ? 'Running Strategist…' : 'Run Strategist'}
      </button>
      <div style={{ display: 'flex', alignItems: 'center', gap: S[3] }}>
        <span style={{ fontFamily: F.body, fontSize: '12px', color: C.textMuted }}>Or start from a template:</span>
        {TEMPLATES.map(t => (
          <button
            key={t.id}
            onClick={() => toast.info(`Template "${t.label}" loaded`)}
            style={{
              ...btn.secondary,
              fontSize: '12px',
              padding: `${S[1]} ${S[3]}`,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <t.Icon color={C.textPrimary} w={14} />
            {t.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function StrategyDocument({ toast }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: S[4] }}>
      {/* Positioning */}
      <div style={{
        backgroundColor: C.surface2,
        border: `1px solid ${C.border}`,
        borderRadius: R.card,
        overflow: 'hidden',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: `${S[3]} ${S[4]}`, borderBottom: `1px solid ${C.border}` }}>
          <span style={{ fontFamily: F.display, fontSize: '13px', fontWeight: 700, color: C.textPrimary }}>Positioning</span>
          <div style={{ display: 'flex', gap: S[2] }}>
            <button onClick={() => toast.info('Regenerating positioning section...')} style={{ ...btn.ghost, fontSize: '11px', color: C.textMuted }}>↺ Regenerate</button>
            <button onClick={() => toast.info('Editing positioning')} style={{ ...btn.ghost, fontSize: '11px' }}>Edit</button>
          </div>
        </div>
        <div style={{ padding: S[4] }}>
          <p style={{ fontFamily: F.body, fontSize: '13px', color: C.textPrimary, margin: 0, lineHeight: 1.7 }}>
            <strong>Medglobal as the operational bridge for healthcare professionals in crisis zones.</strong>{' '}
            Unlike traditional NGOs that fund programs at a distance, Medglobal embeds licensed healthcare workers directly into crisis environments, enabling measurable patient outcomes that donors can track in real-time.
          </p>
        </div>
      </div>

      {/* Target Audience */}
      <div style={{
        backgroundColor: C.surface2,
        border: `1px solid ${C.border}`,
        borderRadius: R.card,
        overflow: 'hidden',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: `${S[3]} ${S[4]}`, borderBottom: `1px solid ${C.border}` }}>
          <span style={{ fontFamily: F.display, fontSize: '13px', fontWeight: 700, color: C.textPrimary }}>Target Audience</span>
          <div style={{ display: 'flex', gap: S[2] }}>
            <button onClick={() => toast.info('Regenerating audience section...')} style={{ ...btn.ghost, fontSize: '11px', color: C.textMuted }}>↺ Regenerate</button>
            <button onClick={() => toast.info('Editing audience')} style={{ ...btn.ghost, fontSize: '11px' }}>Edit</button>
          </div>
        </div>
        <div style={{ padding: S[4] }}>
          <p style={{ fontFamily: F.body, fontSize: '13px', color: C.textPrimary, margin: 0 }}>
            Healthcare donors aged <strong>45–60</strong>, household income <strong>$180k+</strong>, with prior donations to international health organizations. Prefer evidence-based impact reporting and direct program visibility.
          </p>
        </div>
      </div>

      {/* Key Messages */}
      <div style={{
        backgroundColor: C.surface2,
        border: `1px solid ${C.border}`,
        borderRadius: R.card,
        overflow: 'hidden',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: `${S[3]} ${S[4]}`, borderBottom: `1px solid ${C.border}` }}>
          <span style={{ fontFamily: F.display, fontSize: '13px', fontWeight: 700, color: C.textPrimary }}>Key Messages</span>
          <div style={{ display: 'flex', gap: S[2] }}>
            <button onClick={() => toast.info('Regenerating messages...')} style={{ ...btn.ghost, fontSize: '11px', color: C.textMuted }}>↺ Regenerate</button>
            <button onClick={() => toast.info('Editing messages')} style={{ ...btn.ghost, fontSize: '11px' }}>Edit</button>
          </div>
        </div>
        <div style={{ padding: S[4], display: 'flex', flexDirection: 'column', gap: S[2] }}>
          {KEY_MESSAGES.map((msg, i) => (
            <div key={i} style={{ display: 'flex', gap: S[2], alignItems: 'flex-start' }}>
              <span style={{ color: C.primary, flexShrink: 0, fontWeight: 700, marginTop: '2px' }}>›</span>
              <span style={{ fontFamily: F.body, fontSize: '13px', color: C.textSecondary, lineHeight: 1.6 }}>{msg}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Channel Mix */}
      <div style={{
        backgroundColor: C.surface2,
        border: `1px solid ${C.border}`,
        borderRadius: R.card,
        overflow: 'hidden',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: `${S[3]} ${S[4]}`, borderBottom: `1px solid ${C.border}` }}>
          <span style={{ fontFamily: F.display, fontSize: '13px', fontWeight: 700, color: C.textPrimary }}>Channel Mix</span>
          <button onClick={() => toast.info('Editing channel mix')} style={{ ...btn.ghost, fontSize: '11px' }}>Edit</button>
        </div>
        <div style={{ padding: S[4], display: 'flex', flexDirection: 'column', gap: S[3] }}>
          {CHANNEL_MIX.map(ch => (
            <div key={ch.label} style={{ display: 'flex', alignItems: 'center', gap: S[3] }}>
              <span style={{ fontFamily: F.body, fontSize: '12px', color: C.textSecondary, width: '60px', flexShrink: 0 }}>{ch.label}</span>
              <div style={{ flex: 1, height: '8px', borderRadius: R.pill, backgroundColor: C.surface3, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${ch.pct}%`, backgroundColor: ch.color, borderRadius: R.pill }} />
              </div>
              <span style={{ fontFamily: F.mono, fontSize: '12px', fontWeight: 700, color: C.textPrimary, width: '32px', textAlign: 'right' }}>{ch.pct}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Success Metrics */}
      <div style={{
        backgroundColor: C.surface2,
        border: `1px solid ${C.border}`,
        borderRadius: R.card,
        overflow: 'hidden',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: `${S[3]} ${S[4]}`, borderBottom: `1px solid ${C.border}` }}>
          <span style={{ fontFamily: F.display, fontSize: '13px', fontWeight: 700, color: C.textPrimary }}>Success Metrics</span>
          <button onClick={() => toast.info('Editing success metrics')} style={{ ...btn.ghost, fontSize: '11px' }}>Edit</button>
        </div>
        <div style={{ padding: S[4], display: 'flex', gap: S[4], flexWrap: 'wrap' }}>
          {[
            { label: 'Target CAC', value: '$140', color: C.primary },
            { label: 'Target Leads', value: '180', color: C.secondary },
            { label: 'Target ROAS', value: '3.5x', color: C.green },
          ].map(m => (
            <div key={m.label} style={{
              flex: 1, minWidth: '100px',
              backgroundColor: C.surface3, borderRadius: R.md,
              padding: `${S[3]} ${S[4]}`,
            }}>
              <div style={{ fontFamily: F.body, fontSize: '11px', color: C.textMuted, marginBottom: '4px' }}>{m.label}</div>
              <div style={{ fontFamily: F.mono, fontSize: '22px', fontWeight: 800, color: m.color }}>{m.value}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function OutputCard({ output, toast }) {
  const [expanded, setExpanded] = useState(false);
  const STATUS_CHIP = {
    approved:  { color: C.green,  bg: 'rgba(16,185,129,0.12)', label: '✓ Approved' },
    in_review: { color: C.amber,  bg: 'rgba(251,191,36,0.12)', label: 'In Review' },
    draft:     { color: C.textMuted, bg: C.surface3,             label: 'Draft' },
  };
  const chip = STATUS_CHIP[output.status] || STATUS_CHIP.draft;

  return (
    <div style={{
      backgroundColor: C.surface3,
      border: `1px solid ${C.border}`,
      borderRadius: R.md,
      overflow: 'hidden',
    }}>
      <div
        onClick={() => setExpanded(e => !e)}
        style={{ display: 'flex', alignItems: 'center', gap: S[2], padding: `${S[3]} ${S[3]}`, cursor: 'pointer' }}
      >
        <AgentRoleIcon agentId={output.agent.agentId} size={14} color={C.secondary} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: F.body, fontSize: '12px', fontWeight: 600, color: C.textPrimary, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{output.title}</div>
          <div style={{ fontFamily: F.mono, fontSize: '10px', color: C.textMuted }}>{output.agent.name} · {output.date}</div>
        </div>
        <span style={{ fontFamily: F.mono, fontSize: '10px', fontWeight: 700, color: chip.color, backgroundColor: chip.bg, borderRadius: R.pill, padding: '2px 8px', whiteSpace: 'nowrap' }}>
          {chip.label}
        </span>
      </div>
      {expanded && (
        <div style={{ borderTop: `1px solid ${C.border}`, padding: S[3] }}>
          <p style={{ fontFamily: F.body, fontSize: '12px', color: C.textSecondary, margin: `0 0 ${S[3]}`, lineHeight: 1.6 }}>{output.preview}</p>
          <div style={{ display: 'flex', gap: S[2] }}>
            <button onClick={() => toast.info(`Viewing ${output.title}`)} style={{ ...btn.primary, fontSize: '11px', padding: `2px ${S[3]}` }}>View</button>
            <button onClick={() => toast.success(`${output.title} copied to clipboard`)} style={{ ...btn.ghost, fontSize: '11px', padding: `2px ${S[3]}` }}>Copy</button>
            {output.status !== 'approved' && (
              <button onClick={() => toast.info(`Reviewing ${output.title}`)} style={{ ...btn.secondary, fontSize: '11px', padding: `2px ${S[3]}` }}>Review →</button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function ApprovalGate({ toast, currentRole }) {
  return (
    <div style={{
      backgroundColor: C.surface2,
      border: `1px solid ${C.border}`,
      borderRadius: R.card,
      overflow: 'hidden',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: `${S[3]} ${S[4]}`, borderBottom: `1px solid ${C.border}` }}>
        <span style={{ fontFamily: F.display, fontSize: '13px', fontWeight: 700, color: C.textPrimary }}>Strategy Approval</span>
        <span style={{ fontFamily: F.mono, fontSize: '10px', color: C.amber, backgroundColor: 'rgba(251,191,36,0.12)', borderRadius: R.pill, padding: '2px 8px' }}>Pending CMO</span>
      </div>
      <div style={{ padding: S[4] }}>
        <p style={{ fontFamily: F.body, fontSize: '12px', color: C.textSecondary, margin: `0 0 ${S[3]}` }}>
          Approved by Owner — awaiting CMO review before final sign-off.
        </p>
        {/* Stage stepper */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 0, marginBottom: S[4] }}>
          {APPROVAL_STAGES.map((stage, i) => (
            <div key={stage.id} style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                <div style={{
                  width: '28px', height: '28px', borderRadius: '50%',
                  backgroundColor: stage.done ? C.primary : C.surface3,
                  border: `2px solid ${stage.done ? C.primary : C.border}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  {stage.done
                    ? <span style={{ color: C.textInverse, fontSize: '12px', fontWeight: 700 }}>✓</span>
                    : <span style={{ fontFamily: F.mono, fontSize: '10px', color: C.textMuted }}>{i + 1}</span>
                  }
                </div>
                <span style={{ fontFamily: F.body, fontSize: '10px', color: stage.done ? C.primary : C.textMuted, whiteSpace: 'nowrap' }}>{stage.label}</span>
              </div>
              {i < APPROVAL_STAGES.length - 1 && (
                <div style={{ flex: 1, height: '2px', backgroundColor: stage.done ? C.primary : C.border, margin: '0 4px', marginBottom: '16px' }} />
              )}
            </div>
          ))}
        </div>
        {(currentRole === 'owner' || currentRole === 'founder') && (
          <button
            onClick={() => toast.success('Strategy sent to CMO for approval')}
            style={{ ...btn.primary, fontSize: '13px', width: '100%', justifyContent: 'center' }}
          >
            Approve for CMO →
          </button>
        )}
      </div>
    </div>
  );
}

/* ─── Main component ─────────────────────────────────────────── */
export default function StrategyTab({ setTab, fromFreya }) {
  const toast = useToast();
  const currentRole = useStore(s => s.currentRole);
  const strategist = useAgent('strategist');
  const analyst = useAgent('analyst');
  const [hasStrategy, setHasStrategy] = useState(true); // demo: true means strategy exists

  const handleRunStrategist = async (brief) => {
    toast.info('Strategist agent activated…');
    await strategist.activate('Generate campaign strategy with content-strategy and launch-strategy skills', {
      campaignName: 'Donor Acquisition Q2',
      brief: brief || 'Generate full campaign strategy for Medglobal donor acquisition Q2',
    });
    setHasStrategy(true);
    toast.success('Strategy generated by Strategist agent');
  };

  const handleRunAnalyst = async () => {
    toast.info('Analyst agent running competitive analysis…');
    await analyst.activate('Run competitor-alternatives and customer-research analysis', {
      market: 'MENA NGO Healthcare',
    });
    toast.success('Competitor analysis complete — added to Strategy Outputs');
  };

  return (
    <div style={{ padding: S[5], display: 'flex', flexDirection: 'column', gap: S[4] }}>

      {/* fromFreya banner */}
      {fromFreya && (
        <div style={{
          padding: S[4],
          backgroundColor: 'rgba(74,124,111,0.1)',
          border: `1px solid rgba(74,124,111,0.3)`,
          borderRadius: R.card,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: S[3],
        }}>
          <div>
            <div style={{ fontFamily: F.body, fontSize: '13px', fontWeight: 700, color: C.textPrimary, marginBottom: '2px' }}>Create campaign with Freya</div>
            <div style={{ fontFamily: F.body, fontSize: '12px', color: C.textSecondary }}>Add or confirm your strategy inputs. When ready, Freya will generate your campaign plan.</div>
          </div>
          {typeof setTab === 'function' && (
            <button type="button" style={{ ...btn.primary, fontSize: '13px', padding: `${S[2]} ${S[4]}` }} onClick={() => setTab('plan')}>
              Freya, generate plan →
            </button>
          )}
        </div>
      )}

      {/* Agent Action Bar */}
      <AgentActionBar
        strategist={strategist}
        analyst={analyst}
        onRunStrategist={() => handleRunStrategist('')}
        onRunAnalyst={handleRunAnalyst}
      />

      {/* Agent thinking states */}
      {strategist.isActive && <AgentThinking agentId="strategist" task="Generating campaign strategy with content-strategy and launch-strategy skills…" />}
      {analyst.isActive && <AgentThinking agentId="analyst" task="Running competitive analysis on MENA NGO landscape…" />}

      {/* Two-column layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: S[5], alignItems: 'start' }}>

        {/* Left: Strategy Brief */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: S[4] }}>
          {hasStrategy
            ? <StrategyDocument toast={toast} />
            : <StrategyEmptyState onGenerate={handleRunStrategist} strategist={strategist} />
          }
        </div>

        {/* Right: Agent Outputs + Approval Gate */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: S[4] }}>

          {/* Strategy Outputs Panel */}
          <div style={{
            backgroundColor: C.surface2,
            border: `1px solid ${C.border}`,
            borderRadius: R.card,
            overflow: 'hidden',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: `${S[3]} ${S[4]}`, borderBottom: `1px solid ${C.border}` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: S[2] }}>
                <span style={{ fontFamily: F.display, fontSize: '13px', fontWeight: 700, color: C.textPrimary }}>Strategy Outputs</span>
                <span style={{ fontFamily: F.mono, fontSize: '10px', fontWeight: 700, color: C.primary, backgroundColor: 'rgba(74,124,111,0.15)', borderRadius: R.pill, padding: '1px 8px' }}>
                  {STRATEGY_OUTPUTS.length}
                </span>
              </div>
            </div>
            <div style={{ padding: S[3], display: 'flex', flexDirection: 'column', gap: S[2] }}>
              {STRATEGY_OUTPUTS.map(output => (
                <OutputCard key={output.id} output={output} toast={toast} />
              ))}
              <button
                onClick={() => toast.info('Analyst agent running new analysis…')}
                style={{ ...btn.secondary, fontSize: '12px', marginTop: S[1], justifyContent: 'center' }}
              >
                + Generate new analysis
              </button>
            </div>
          </div>

          {/* Approval Gate */}
          <ApprovalGate toast={toast} currentRole={currentRole} />
        </div>
      </div>
    </div>
  );
}
