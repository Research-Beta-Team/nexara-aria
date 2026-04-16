/**
 * DashboardManual — Workbench mode: Guide one agent at a time, see output, edit, post manually.
 * UX: Select agent → Give instruction → See draft → Edit → Execute manually
 */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useToast from '../../hooks/useToast';
import useCommandModeDesign from '../../hooks/useCommandModeDesign';
import { C, F, R, S } from '../../tokens';
import AgentRoleIcon from '../../components/ui/AgentRoleIcon';
import { getAgent } from '../../agents/AgentRegistry';

const AGENTS = [
  { id: 'copywriter', name: 'Copywriter', desc: 'Draft emails, ads, social posts' },
  { id: 'strategist', name: 'Strategist', desc: 'Campaign briefs, positioning' },
  { id: 'analyst', name: 'Analyst', desc: 'Reports, insights, audits' },
  { id: 'prospector', name: 'Prospector', desc: 'Lead research, enrichment' },
  { id: 'optimizer', name: 'Optimizer', desc: 'A/B tests, CRO suggestions' },
  { id: 'outreach', name: 'Outreach', desc: 'Email sequences, follow-ups' },
  { id: 'revenue', name: 'Revenue', desc: 'Pipeline analysis, forecasts' },
  { id: 'guardian', name: 'Guardian', desc: 'Compliance review, brand check' },
];

const RECENT_OUTPUTS = [
  { id: 1, agent: 'copywriter', task: 'Email subject lines for Q2 campaign', time: '12m ago', status: 'posted' },
  { id: 2, agent: 'analyst', task: 'CTR analysis for Meta ads', time: '45m ago', status: 'draft' },
  { id: 3, agent: 'strategist', task: 'MENA positioning brief', time: '2h ago', status: 'posted' },
];

export default function DashboardManual() {
  const nav = useNavigate();
  const toast = useToast();
  const design = useCommandModeDesign();

  const [selectedAgent, setSelectedAgent] = useState('copywriter');
  const [instruction, setInstruction] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [output, setOutput] = useState(null);
  const [editedOutput, setEditedOutput] = useState('');

  const handleRunAgent = () => {
    if (!instruction.trim()) {
      toast.warning('Enter an instruction first');
      return;
    }
    setIsProcessing(true);
    setOutput(null);

    // Simulate agent processing
    setTimeout(() => {
      const agent = AGENTS.find(a => a.id === selectedAgent);
      const mockOutput = getMockOutput(selectedAgent, instruction);
      setOutput({
        agent: agent.name,
        agentId: selectedAgent,
        instruction,
        content: mockOutput,
        timestamp: new Date().toLocaleTimeString(),
      });
      setEditedOutput(mockOutput);
      setIsProcessing(false);
      toast.success(`${agent.name} completed task`);
    }, 2000);
  };

  const handlePost = () => {
    toast.success('Content posted manually');
    setOutput(null);
    setEditedOutput('');
    setInstruction('');
  };

  const handleSaveDraft = () => {
    toast.info('Saved to drafts');
  };

  const handleDiscard = () => {
    setOutput(null);
    setEditedOutput('');
  };

  const selected = AGENTS.find(a => a.id === selectedAgent);

  return (
    <div style={{
      display: 'flex',
      height: 'calc(100vh - 120px)',
      gap: 0,
      backgroundColor: C.bg,
    }}>
      {/* LEFT: Agent Selector */}
      <div style={{
        width: '220px',
        borderRight: `1px solid ${C.border}`,
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
      }}>
        <div style={{
          padding: S[4],
          borderBottom: `1px solid ${C.border}`,
        }}>
          <div style={{
            fontFamily: F.mono,
            fontSize: '10px',
            fontWeight: 700,
            color: C.red,
            letterSpacing: '0.1em',
            marginBottom: S[2],
          }}>
            MANUAL MODE
          </div>
          <div style={{
            fontFamily: F.mono,
            fontSize: '11px',
            color: C.textMuted,
          }}>
            SELECT AGENT
          </div>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: S[2] }}>
          {AGENTS.map((agent) => {
            const isActive = selectedAgent === agent.id;
            return (
              <button
                key={agent.id}
                onClick={() => setSelectedAgent(agent.id)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: S[2],
                  padding: S[3],
                  marginBottom: '2px',
                  backgroundColor: isActive ? C.redDim : 'transparent',
                  border: isActive ? `1px solid ${C.red}` : `1px dashed transparent`,
                  borderRadius: '3px',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'none',
                }}
              >
                <div style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '3px',
                  backgroundColor: isActive ? C.red : C.surface2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: `1px solid ${isActive ? C.red : C.border}`,
                }}>
                  <AgentRoleIcon agentId={agent.id} size={14} color={isActive ? '#fff' : C.textMuted} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontFamily: F.mono,
                    fontSize: '11px',
                    fontWeight: 600,
                    color: isActive ? C.red : C.textPrimary,
                    textTransform: 'uppercase',
                  }}>{agent.name}</div>
                  <div style={{
                    fontFamily: F.body,
                    fontSize: '10px',
                    color: C.textMuted,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}>{agent.desc}</div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Recent outputs */}
        <div style={{
          borderTop: `1px solid ${C.border}`,
          padding: S[3],
        }}>
          <div style={{
            fontFamily: F.mono,
            fontSize: '9px',
            fontWeight: 700,
            color: C.textMuted,
            letterSpacing: '0.08em',
            marginBottom: S[2],
          }}>
            RECENT OUTPUTS
          </div>
          {RECENT_OUTPUTS.slice(0, 3).map((item) => (
            <div key={item.id} style={{
              display: 'flex',
              alignItems: 'center',
              gap: S[2],
              padding: `${S[1]} 0`,
              borderBottom: `1px dashed ${C.border}`,
            }}>
              <AgentRoleIcon agentId={item.agent} size={12} color={C.textMuted} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  fontFamily: F.body,
                  fontSize: '10px',
                  color: C.textSecondary,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}>{item.task}</div>
              </div>
              <span style={{
                fontFamily: F.mono,
                fontSize: '8px',
                color: item.status === 'posted' ? C.green : C.amber,
                textTransform: 'uppercase',
              }}>{item.status}</span>
            </div>
          ))}
        </div>
      </div>

      {/* CENTER: Workbench */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        minWidth: 0,
      }}>
        {/* Agent header */}
        <div style={{
          padding: S[4],
          borderBottom: `1px solid ${C.border}`,
          backgroundColor: C.surface,
          display: 'flex',
          alignItems: 'center',
          gap: S[3],
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '4px',
            backgroundColor: C.redDim,
            border: `2px solid ${C.red}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <AgentRoleIcon agentId={selectedAgent} size={20} color={C.red} />
          </div>
          <div>
            <div style={{
              fontFamily: F.mono,
              fontSize: '14px',
              fontWeight: 700,
              color: C.textPrimary,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}>
              {selected?.name}
            </div>
            <div style={{
              fontFamily: F.body,
              fontSize: '12px',
              color: C.textMuted,
            }}>
              {selected?.desc}
            </div>
          </div>
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: S[2] }}>
            <span style={{
              fontFamily: F.mono,
              fontSize: '9px',
              color: C.textMuted,
              letterSpacing: '0.05em',
            }}>STATUS:</span>
            <span style={{
              fontFamily: F.mono,
              fontSize: '10px',
              fontWeight: 700,
              color: isProcessing ? C.amber : C.green,
              padding: '2px 8px',
              border: `1px solid ${isProcessing ? C.amber : C.green}`,
              borderRadius: '2px',
            }}>
              {isProcessing ? 'PROCESSING' : 'IDLE'}
            </span>
          </div>
        </div>

        {/* Input area */}
        <div style={{
          padding: S[4],
          borderBottom: `1px solid ${C.border}`,
          backgroundColor: C.surface2,
        }}>
          <div style={{
            fontFamily: F.mono,
            fontSize: '9px',
            fontWeight: 700,
            color: C.textMuted,
            letterSpacing: '0.08em',
            marginBottom: S[2],
          }}>
            INSTRUCTION
          </div>
          <div style={{ display: 'flex', gap: S[2] }}>
            <textarea
              value={instruction}
              onChange={(e) => setInstruction(e.target.value)}
              placeholder={`Tell ${selected?.name} what to do...`}
              disabled={isProcessing}
              style={{
                flex: 1,
                minHeight: '80px',
                padding: S[3],
                backgroundColor: C.ink,
                border: `1px solid ${C.border}`,
                borderRadius: '3px',
                fontFamily: F.mono,
                fontSize: '12px',
                color: C.textPrimary,
                resize: 'vertical',
                outline: 'none',
              }}
            />
            <button
              onClick={handleRunAgent}
              disabled={isProcessing || !instruction.trim()}
              style={{
                padding: `${S[3]} ${S[4]}`,
                backgroundColor: isProcessing ? C.surface3 : C.red,
                border: `1px solid ${isProcessing ? C.border : C.red}`,
                borderRadius: '3px',
                color: isProcessing ? C.textMuted : '#fff',
                fontFamily: F.mono,
                fontSize: '11px',
                fontWeight: 700,
                cursor: isProcessing ? 'not-allowed' : 'pointer',
                whiteSpace: 'nowrap',
                alignSelf: 'flex-end',
              }}
            >
              {isProcessing ? '▶ RUNNING...' : '▶ RUN'}
            </button>
          </div>
        </div>

        {/* Output area */}
        <div style={{
          flex: 1,
          padding: S[4],
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
        }}>
          {!output && !isProcessing && (
            <div style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              color: C.textMuted,
            }}>
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '4px',
                border: `2px dashed ${C.border}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: S[3],
              }}>
                <AgentRoleIcon agentId={selectedAgent} size={28} color={C.border} />
              </div>
              <div style={{
                fontFamily: F.mono,
                fontSize: '11px',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
              }}>
                AWAITING INSTRUCTION
              </div>
              <div style={{
                fontFamily: F.body,
                fontSize: '12px',
                marginTop: S[2],
              }}>
                Enter a task above and click RUN
              </div>
            </div>
          )}

          {isProcessing && (
            <div style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <div style={{
                width: '48px',
                height: '48px',
                border: `3px solid ${C.red}`,
                borderTopColor: 'transparent',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
                marginBottom: S[3],
              }} />
              <div style={{
                fontFamily: F.mono,
                fontSize: '11px',
                color: C.red,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
              }}>
                {selected?.name} PROCESSING...
              </div>
              <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
          )}

          {output && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: S[3], flex: 1 }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
                <div style={{
                  fontFamily: F.mono,
                  fontSize: '9px',
                  fontWeight: 700,
                  color: C.green,
                  letterSpacing: '0.08em',
                }}>
                  OUTPUT — {output.timestamp}
                </div>
                <div style={{ display: 'flex', gap: S[2] }}>
                  <button
                    onClick={handleDiscard}
                    style={{
                      padding: `${S[1]} ${S[3]}`,
                      backgroundColor: 'transparent',
                      border: `1px dashed ${C.border}`,
                      borderRadius: '2px',
                      color: C.textMuted,
                      fontFamily: F.mono,
                      fontSize: '10px',
                      cursor: 'pointer',
                    }}
                  >
                    DISCARD
                  </button>
                  <button
                    onClick={handleSaveDraft}
                    style={{
                      padding: `${S[1]} ${S[3]}`,
                      backgroundColor: 'transparent',
                      border: `1px solid ${C.amber}`,
                      borderRadius: '2px',
                      color: C.amber,
                      fontFamily: F.mono,
                      fontSize: '10px',
                      cursor: 'pointer',
                    }}
                  >
                    SAVE DRAFT
                  </button>
                  <button
                    onClick={handlePost}
                    style={{
                      padding: `${S[1]} ${S[3]}`,
                      backgroundColor: C.green,
                      border: `1px solid ${C.green}`,
                      borderRadius: '2px',
                      color: '#fff',
                      fontFamily: F.mono,
                      fontSize: '10px',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    POST / EXECUTE
                  </button>
                </div>
              </div>

              <textarea
                value={editedOutput}
                onChange={(e) => setEditedOutput(e.target.value)}
                style={{
                  flex: 1,
                  minHeight: '200px',
                  padding: S[4],
                  backgroundColor: C.surface,
                  border: `1px solid ${C.green}`,
                  borderLeft: `3px solid ${C.green}`,
                  borderRadius: '3px',
                  fontFamily: F.body,
                  fontSize: '13px',
                  color: C.textPrimary,
                  lineHeight: 1.6,
                  resize: 'none',
                  outline: 'none',
                }}
              />

              <div style={{
                fontFamily: F.mono,
                fontSize: '10px',
                color: C.textMuted,
                display: 'flex',
                gap: S[3],
              }}>
                <span>AGENT: {output.agent}</span>
                <span>•</span>
                <span>CHARS: {editedOutput.length}</span>
                <span>•</span>
                <span style={{ color: editedOutput !== output.content ? C.amber : C.textMuted }}>
                  {editedOutput !== output.content ? 'EDITED' : 'ORIGINAL'}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* RIGHT: Quick Actions */}
      <div style={{
        width: '200px',
        borderLeft: `1px solid ${C.border}`,
        padding: S[4],
        display: 'flex',
        flexDirection: 'column',
        gap: S[4],
        flexShrink: 0,
      }}>
        <div style={{
          fontFamily: F.mono,
          fontSize: '9px',
          fontWeight: 700,
          color: C.textMuted,
          letterSpacing: '0.08em',
        }}>
          QUICK TASKS
        </div>

        {getQuickTasks(selectedAgent).map((task, i) => (
          <button
            key={i}
            onClick={() => setInstruction(task)}
            style={{
              padding: S[3],
              backgroundColor: 'transparent',
              border: `1px dashed ${C.border}`,
              borderRadius: '3px',
              textAlign: 'left',
              cursor: 'pointer',
            }}
          >
            <div style={{
              fontFamily: F.body,
              fontSize: '11px',
              color: C.textSecondary,
              lineHeight: 1.4,
            }}>
              {task}
            </div>
          </button>
        ))}

        <div style={{ marginTop: 'auto', paddingTop: S[4], borderTop: `1px dashed ${C.border}` }}>
          <div style={{
            fontFamily: F.mono,
            fontSize: '9px',
            fontWeight: 700,
            color: C.textMuted,
            letterSpacing: '0.08em',
            marginBottom: S[2],
          }}>
            MANUAL MODE
          </div>
          <div style={{
            fontFamily: F.body,
            fontSize: '10px',
            color: C.textMuted,
            lineHeight: 1.5,
          }}>
            You control execution. Agents only run when you click RUN. Edit outputs before posting.
          </div>
        </div>
      </div>
    </div>
  );
}

function getQuickTasks(agentId) {
  const tasks = {
    copywriter: [
      'Write 3 email subject lines for Q2 donor campaign',
      'Draft a LinkedIn post about our Yemen work',
      'Create ad copy for Meta retargeting',
    ],
    strategist: [
      'Create a campaign brief for MENA healthcare',
      'Analyze our positioning vs competitors',
      'Suggest Q3 campaign themes',
    ],
    analyst: [
      'Run CTR analysis on Meta ads',
      'Generate weekly performance report',
      'Identify underperforming channels',
    ],
    prospector: [
      'Research 20 MENA healthcare leads',
      'Enrich existing lead list with intent data',
      'Find decision makers at target accounts',
    ],
    optimizer: [
      'Suggest A/B test for landing page CTA',
      'Analyze form abandonment',
      'Recommend page speed improvements',
    ],
    outreach: [
      'Create 5-email nurture sequence',
      'Write follow-up templates',
      'Schedule LinkedIn outreach cadence',
    ],
    revenue: [
      'Generate Q2 pipeline forecast',
      'Identify at-risk accounts',
      'Create renewal playbook',
    ],
    guardian: [
      'Review email for compliance',
      'Check brand consistency',
      'Audit recent content for guidelines',
    ],
  };
  return tasks[agentId] || tasks.copywriter;
}

function getMockOutput(agentId, instruction) {
  const outputs = {
    copywriter: `Subject Line Options:

1. "Your Impact in Action: Q2 Healthcare Update"
2. "Inside the Field: Stories from Our Medical Teams"
3. "Together, We're Reaching More Communities Than Ever"

Each subject line emphasizes donor impact and connection to our mission. Option 1 focuses on tangible results, Option 2 creates emotional connection through storytelling, and Option 3 highlights collective achievement.

Recommended: Option 2 for highest open rates based on past performance.`,
    strategist: `Campaign Brief: MENA Healthcare Initiative Q2

OBJECTIVE: Increase donor acquisition by 15% in MENA-focused healthcare programs

TARGET AUDIENCE:
- High-net-worth individuals with healthcare/humanitarian interests
- Corporate CSR managers in pharmaceutical/healthcare sectors
- Foundation program officers

KEY MESSAGES:
1. Direct impact: Every dollar reaches patients in crisis zones
2. Expertise: 7 years of emergency healthcare delivery
3. Transparency: Real-time reporting on fund allocation

CHANNELS: Email (primary), LinkedIn, Meta retargeting
BUDGET: $30,000 | TIMELINE: 8 weeks`,
    analyst: `CTR Analysis Summary — Meta Ads

OVERALL CTR: 2.4% (↑0.3% vs last month)

TOP PERFORMERS:
• "Emergency Response" creative: 3.8% CTR
• Healthcare worker imagery: 3.2% CTR
• Video testimonials: 3.1% CTR

UNDERPERFORMERS:
• Generic donation asks: 1.1% CTR
• Text-heavy ads: 1.4% CTR

RECOMMENDATION: Shift 40% of budget from underperformers to top creatives. Estimated +12% in overall campaign performance.`,
    default: `Task completed successfully.

Based on your instruction: "${instruction}"

I've analyzed the relevant data and prepared this output. Please review and edit as needed before posting.`,
  };
  return outputs[agentId] || outputs.default;
}
