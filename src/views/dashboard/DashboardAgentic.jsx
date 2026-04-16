/**
 * DashboardAgentic — Command Center: Freya plans, executes, verifies autonomously. User monitors.
 * UX: Overview KPIs → Agent fleet status → Live execution feed → Escalations only
 */
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useToast from '../../hooks/useToast';
import useCommandModeDesign from '../../hooks/useCommandModeDesign';
import { C, F, R, S } from '../../tokens';
import AgentRoleIcon from '../../components/ui/AgentRoleIcon';

const AGENT_FLEET = [
  { id: 'freya', name: 'Freya', role: 'Orchestrator', status: 'executing', task: 'Coordinating Q2 campaign launch', progress: 72 },
  { id: 'copywriter', name: 'Copywriter', status: 'executing', task: 'Drafting email sequence (4/6)', progress: 65 },
  { id: 'analyst', name: 'Analyst', status: 'idle', task: 'Standing by', progress: 0 },
  { id: 'outreach', name: 'Outreach', status: 'queued', task: 'LinkedIn posts (queued)', progress: 0 },
  { id: 'optimizer', name: 'Optimizer', status: 'executing', task: 'Running A/B test analysis', progress: 88 },
  { id: 'prospector', name: 'Prospector', status: 'idle', task: 'Standing by', progress: 0 },
  { id: 'revenue', name: 'Revenue', status: 'idle', task: 'Standing by', progress: 0 },
  { id: 'guardian', name: 'Guardian', status: 'verifying', task: 'Reviewing email compliance', progress: 45 },
];

const LIVE_FEED = [
  { id: 1, time: '2s ago', agent: 'freya', action: 'Delegated email review to Guardian', type: 'orchestrate' },
  { id: 2, time: '45s ago', agent: 'copywriter', action: 'Completed email draft #4 of 6', type: 'complete' },
  { id: 3, time: '1m ago', agent: 'optimizer', action: 'A/B test variant B winning (+12% CTR)', type: 'insight' },
  { id: 4, time: '2m ago', agent: 'guardian', action: 'Started compliance review', type: 'start' },
  { id: 5, time: '3m ago', agent: 'freya', action: 'Campaign plan approved, beginning execution', type: 'orchestrate' },
  { id: 6, time: '5m ago', agent: 'copywriter', action: 'Completed email draft #3 of 6', type: 'complete' },
  { id: 7, time: '8m ago', agent: 'analyst', action: 'Performance report generated', type: 'complete' },
  { id: 8, time: '12m ago', agent: 'freya', action: 'Analyzing Q2 campaign requirements', type: 'orchestrate' },
];

const ESCALATIONS = [
  {
    id: 1,
    severity: 'high',
    title: 'Budget approval needed',
    desc: 'Q2 Meta campaign requires $5,200 budget increase',
    agent: 'freya',
    time: '15m ago',
  },
];

const KPIS = [
  { label: 'Tasks Completed', value: '47', delta: '+12 today', positive: true },
  { label: 'Active Workflows', value: '3', delta: '2 on track', positive: true },
  { label: 'Avg Execution Time', value: '4.2m', delta: '-18% vs last week', positive: true },
  { label: 'Success Rate', value: '98.2%', delta: '+0.4%', positive: true },
];

const WORKFLOWS = [
  { id: 1, name: 'Q2 Campaign Launch', progress: 72, agents: ['freya', 'copywriter', 'guardian', 'outreach'], eta: '~25 min' },
  { id: 2, name: 'Weekly Performance Digest', progress: 100, agents: ['analyst', 'freya'], eta: 'Complete' },
  { id: 3, name: 'Lead Enrichment Batch', progress: 35, agents: ['prospector', 'analyst'], eta: '~40 min' },
];

export default function DashboardAgentic() {
  const nav = useNavigate();
  const toast = useToast();
  const design = useCommandModeDesign();

  const [feed, setFeed] = useState(LIVE_FEED);
  const [pulseKey, setPulseKey] = useState(0);

  // Simulate live updates
  useEffect(() => {
    const interval = setInterval(() => {
      setPulseKey((k) => k + 1);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const statusColor = (status) => {
    switch (status) {
      case 'executing': return C.cyan;
      case 'verifying': return C.amber;
      case 'queued': return C.sage;
      case 'idle': return C.textMuted;
      case 'error': return C.red;
      default: return C.textMuted;
    }
  };

  const feedTypeIcon = (type) => {
    switch (type) {
      case 'orchestrate': return '🎯';
      case 'complete': return '✓';
      case 'insight': return '💡';
      case 'start': return '▶';
      default: return '•';
    }
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: 'calc(100vh - 120px)',
      backgroundColor: C.bg,
    }}>
      {/* Top: Command Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        padding: `${S[3]} ${S[5]}`,
        backgroundColor: C.surface,
        borderBottom: `1px solid ${C.border}`,
        gap: S[4],
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: S[2],
        }}>
          <div style={{
            width: '10px',
            height: '10px',
            borderRadius: '50%',
            backgroundColor: C.cyan,
            boxShadow: `0 0 12px ${C.cyan}`,
            animation: 'pulse 2s infinite',
          }} />
          <span style={{
            fontFamily: F.mono,
            fontSize: '11px',
            fontWeight: 700,
            color: C.cyan,
            letterSpacing: '0.1em',
          }}>
            AGENTIC MODE — AUTONOMOUS
          </span>
        </div>

        <div style={{
          display: 'flex',
          gap: S[4],
          marginLeft: 'auto',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: S[2],
          }}>
            <span style={{
              fontFamily: F.mono,
              fontSize: '10px',
              color: C.textMuted,
            }}>AGENTS:</span>
            <span style={{
              fontFamily: F.mono,
              fontSize: '12px',
              fontWeight: 700,
              color: C.cyan,
            }}>
              {AGENT_FLEET.filter(a => a.status === 'executing').length} ACTIVE
            </span>
          </div>
          <div style={{ width: '1px', backgroundColor: C.border }} />
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: S[2],
          }}>
            <span style={{
              fontFamily: F.mono,
              fontSize: '10px',
              color: C.textMuted,
            }}>ESCALATIONS:</span>
            <span style={{
              fontFamily: F.mono,
              fontSize: '12px',
              fontWeight: 700,
              color: ESCALATIONS.length > 0 ? C.amber : C.green,
            }}>
              {ESCALATIONS.length}
            </span>
          </div>
        </div>
      </div>

      <div style={{
        flex: 1,
        display: 'flex',
        overflow: 'hidden',
      }}>
        {/* LEFT: Agent Fleet + KPIs */}
        <div style={{
          width: '380px',
          borderRight: `1px solid ${C.border}`,
          display: 'flex',
          flexDirection: 'column',
          flexShrink: 0,
        }}>
          {/* KPIs */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '1px',
            backgroundColor: C.border,
            borderBottom: `1px solid ${C.border}`,
          }}>
            {KPIS.map((kpi, i) => (
              <div key={i} style={{
                padding: S[4],
                backgroundColor: C.surface,
              }}>
                <div style={{
                  fontFamily: F.mono,
                  fontSize: '20px',
                  fontWeight: 700,
                  color: C.textPrimary,
                  marginBottom: '2px',
                }}>
                  {kpi.value}
                </div>
                <div style={{
                  fontFamily: F.mono,
                  fontSize: '9px',
                  color: C.textMuted,
                  letterSpacing: '0.05em',
                  marginBottom: '4px',
                }}>
                  {kpi.label.toUpperCase()}
                </div>
                <div style={{
                  fontFamily: F.mono,
                  fontSize: '10px',
                  color: kpi.positive ? C.green : C.red,
                }}>
                  {kpi.delta}
                </div>
              </div>
            ))}
          </div>

          {/* Agent Fleet */}
          <div style={{
            padding: `${S[3]} ${S[4]}`,
            borderBottom: `1px solid ${C.border}`,
          }}>
            <div style={{
              fontFamily: F.mono,
              fontSize: '9px',
              fontWeight: 700,
              color: C.textMuted,
              letterSpacing: '0.08em',
            }}>
              AGENT FLEET STATUS
            </div>
          </div>

          <div style={{ flex: 1, overflowY: 'auto' }}>
            {AGENT_FLEET.map((agent) => (
              <div key={agent.id} style={{
                padding: `${S[3]} ${S[4]}`,
                borderBottom: `1px solid ${C.border}`,
                backgroundColor: agent.status === 'executing' ? `${C.cyan}08` : 'transparent',
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: S[3],
                }}>
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    backgroundColor: agent.status === 'executing' ? `${C.cyan}20` : C.surface2,
                    border: `2px solid ${statusColor(agent.status)}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                  }}>
                    <AgentRoleIcon agentId={agent.id} size={18} color={statusColor(agent.status)} />
                    {agent.status === 'executing' && (
                      <div style={{
                        position: 'absolute',
                        inset: -4,
                        border: `2px solid ${C.cyan}`,
                        borderTopColor: 'transparent',
                        borderRadius: '50%',
                        animation: 'spin 1.5s linear infinite',
                      }} />
                    )}
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: S[2],
                      marginBottom: '2px',
                    }}>
                      <span style={{
                        fontFamily: F.mono,
                        fontSize: '11px',
                        fontWeight: 700,
                        color: C.textPrimary,
                        textTransform: 'uppercase',
                      }}>
                        {agent.name}
                      </span>
                      {agent.role && (
                        <span style={{
                          fontFamily: F.mono,
                          fontSize: '8px',
                          color: C.cyan,
                          padding: '1px 6px',
                          backgroundColor: `${C.cyan}20`,
                          borderRadius: R.sm,
                        }}>
                          {agent.role}
                        </span>
                      )}
                    </div>
                    <div style={{
                      fontFamily: F.body,
                      fontSize: '11px',
                      color: C.textMuted,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}>
                      {agent.task}
                    </div>
                    {agent.progress > 0 && (
                      <div style={{
                        marginTop: S[2],
                        height: '3px',
                        backgroundColor: C.surface3,
                        borderRadius: '2px',
                        overflow: 'hidden',
                      }}>
                        <div style={{
                          height: '100%',
                          width: `${agent.progress}%`,
                          backgroundColor: statusColor(agent.status),
                          transition: 'width 0.3s',
                        }} />
                      </div>
                    )}
                  </div>

                  <div style={{
                    fontFamily: F.mono,
                    fontSize: '9px',
                    fontWeight: 700,
                    color: statusColor(agent.status),
                    textTransform: 'uppercase',
                    padding: '2px 8px',
                    border: `1px solid ${statusColor(agent.status)}`,
                    borderRadius: '2px',
                    flexShrink: 0,
                  }}>
                    {agent.status}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CENTER: Live Feed */}
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          minWidth: 0,
        }}>
          <div style={{
            padding: `${S[3]} ${S[4]}`,
            borderBottom: `1px solid ${C.border}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: S[2],
            }}>
              <span style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                backgroundColor: C.green,
                animation: 'pulse 2s infinite',
              }} />
              <span style={{
                fontFamily: F.mono,
                fontSize: '9px',
                fontWeight: 700,
                color: C.textMuted,
                letterSpacing: '0.08em',
              }}>
                LIVE EXECUTION FEED
              </span>
            </div>
            <span style={{
              fontFamily: F.mono,
              fontSize: '10px',
              color: C.textMuted,
            }}>
              Auto-refresh
            </span>
          </div>

          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: S[4],
          }}>
            {feed.map((item, i) => (
              <div key={item.id} style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: S[3],
                padding: `${S[3]} 0`,
                borderBottom: i < feed.length - 1 ? `1px dashed ${C.border}` : 'none',
                animation: i === 0 ? 'slideUp 0.3s' : 'none',
              }}>
                <div style={{
                  fontFamily: F.mono,
                  fontSize: '10px',
                  color: C.textMuted,
                  width: '60px',
                  flexShrink: 0,
                }}>
                  {item.time}
                </div>
                <div style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  backgroundColor: C.surface2,
                  border: `1px solid ${C.border}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <AgentRoleIcon agentId={item.agent} size={12} color={C.sage} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <span style={{
                    fontFamily: F.mono,
                    fontSize: '10px',
                    color: C.cyan,
                    textTransform: 'capitalize',
                    marginRight: S[2],
                  }}>
                    {item.agent}
                  </span>
                  <span style={{
                    fontFamily: F.body,
                    fontSize: '12px',
                    color: C.textPrimary,
                  }}>
                    {item.action}
                  </span>
                </div>
                <span style={{
                  fontSize: '14px',
                  flexShrink: 0,
                }}>
                  {feedTypeIcon(item.type)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT: Workflows + Escalations */}
        <div style={{
          width: '300px',
          borderLeft: `1px solid ${C.border}`,
          display: 'flex',
          flexDirection: 'column',
          flexShrink: 0,
        }}>
          {/* Active Workflows */}
          <div style={{
            padding: `${S[3]} ${S[4]}`,
            borderBottom: `1px solid ${C.border}`,
          }}>
            <div style={{
              fontFamily: F.mono,
              fontSize: '9px',
              fontWeight: 700,
              color: C.textMuted,
              letterSpacing: '0.08em',
            }}>
              ACTIVE WORKFLOWS
            </div>
          </div>

          <div style={{ flex: 1, overflowY: 'auto' }}>
            {WORKFLOWS.map((wf) => (
              <div key={wf.id} style={{
                padding: S[4],
                borderBottom: `1px solid ${C.border}`,
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: S[2],
                }}>
                  <span style={{
                    fontFamily: F.body,
                    fontSize: '12px',
                    fontWeight: 600,
                    color: C.textPrimary,
                  }}>
                    {wf.name}
                  </span>
                  <span style={{
                    fontFamily: F.mono,
                    fontSize: '10px',
                    color: wf.progress === 100 ? C.green : C.cyan,
                    fontWeight: 600,
                  }}>
                    {wf.progress}%
                  </span>
                </div>

                <div style={{
                  height: '4px',
                  backgroundColor: C.surface3,
                  borderRadius: '2px',
                  marginBottom: S[2],
                  overflow: 'hidden',
                }}>
                  <div style={{
                    height: '100%',
                    width: `${wf.progress}%`,
                    backgroundColor: wf.progress === 100 ? C.green : C.cyan,
                    transition: 'width 0.3s',
                  }} />
                </div>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}>
                  <div style={{
                    display: 'flex',
                    gap: '-6px',
                  }}>
                    {wf.agents.map((agentId, i) => (
                      <div key={agentId} style={{
                        width: '22px',
                        height: '22px',
                        borderRadius: '50%',
                        backgroundColor: C.surface2,
                        border: `2px solid ${C.surface}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginLeft: i > 0 ? '-6px' : 0,
                        zIndex: wf.agents.length - i,
                      }}>
                        <AgentRoleIcon agentId={agentId} size={10} color={C.sage} />
                      </div>
                    ))}
                  </div>
                  <span style={{
                    fontFamily: F.mono,
                    fontSize: '10px',
                    color: C.textMuted,
                  }}>
                    ETA: {wf.eta}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Escalations */}
          <div style={{
            borderTop: `1px solid ${C.border}`,
          }}>
            <div style={{
              padding: `${S[3]} ${S[4]}`,
              borderBottom: `1px solid ${C.border}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
              <div style={{
                fontFamily: F.mono,
                fontSize: '9px',
                fontWeight: 700,
                color: ESCALATIONS.length > 0 ? C.amber : C.textMuted,
                letterSpacing: '0.08em',
              }}>
                ESCALATIONS
              </div>
              {ESCALATIONS.length > 0 && (
                <span style={{
                  fontFamily: F.mono,
                  fontSize: '10px',
                  fontWeight: 700,
                  color: '#fff',
                  backgroundColor: C.amber,
                  padding: '2px 8px',
                  borderRadius: R.full,
                }}>
                  {ESCALATIONS.length}
                </span>
              )}
            </div>

            {ESCALATIONS.length > 0 ? (
              ESCALATIONS.map((esc) => (
                <div key={esc.id} style={{
                  padding: S[4],
                  backgroundColor: `${C.amber}10`,
                  borderLeft: `3px solid ${C.amber}`,
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: S[2],
                    marginBottom: S[2],
                  }}>
                    <span style={{
                      fontFamily: F.mono,
                      fontSize: '8px',
                      fontWeight: 700,
                      color: C.amber,
                      textTransform: 'uppercase',
                      padding: '2px 6px',
                      border: `1px solid ${C.amber}`,
                      borderRadius: '2px',
                    }}>
                      {esc.severity}
                    </span>
                    <span style={{
                      fontFamily: F.mono,
                      fontSize: '10px',
                      color: C.textMuted,
                    }}>
                      {esc.time}
                    </span>
                  </div>
                  <div style={{
                    fontFamily: F.body,
                    fontSize: '12px',
                    fontWeight: 600,
                    color: C.textPrimary,
                    marginBottom: '4px',
                  }}>
                    {esc.title}
                  </div>
                  <div style={{
                    fontFamily: F.body,
                    fontSize: '11px',
                    color: C.textMuted,
                    marginBottom: S[3],
                  }}>
                    {esc.desc}
                  </div>
                  <button
                    onClick={() => toast.success('Escalation acknowledged')}
                    style={{
                      padding: `${S[2]} ${S[4]}`,
                      backgroundColor: C.amber,
                      border: 'none',
                      borderRadius: R.button,
                      color: '#000',
                      fontFamily: F.body,
                      fontSize: '11px',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    Review & Approve
                  </button>
                </div>
              ))
            ) : (
              <div style={{
                padding: S[4],
                textAlign: 'center',
              }}>
                <div style={{
                  fontFamily: F.mono,
                  fontSize: '11px',
                  color: C.green,
                }}>
                  ✓ No escalations
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}
