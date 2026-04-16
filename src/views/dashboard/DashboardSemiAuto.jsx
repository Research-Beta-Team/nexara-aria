/**
 * DashboardSemiAuto — Approval queue mode: Freya proposes actions, user approves before execution.
 * UX: Review queue → Approve/Edit/Reject → Track what's been approved
 */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useToast from '../../hooks/useToast';
import useCommandModeDesign from '../../hooks/useCommandModeDesign';
import { C, F, R, S } from '../../tokens';
import AgentRoleIcon from '../../components/ui/AgentRoleIcon';

const PENDING_PROPOSALS = [
  {
    id: 1,
    agent: 'copywriter',
    type: 'email',
    title: 'Q2 Campaign Email Draft',
    preview: 'Subject: Your Impact in Action\n\nDear Sarah,\n\nThis quarter, your support helped us reach over 12,000 patients across 5 crisis zones...',
    reason: 'Scheduled for Monday send. Based on successful Q1 template.',
    urgency: 'normal',
    createdAt: '2 min ago',
  },
  {
    id: 2,
    agent: 'outreach',
    type: 'linkedin',
    title: 'LinkedIn Post: Yemen Update',
    preview: "🏥 In the past 30 days, our mobile clinics in Yemen have provided care to 3,200 patients...",
    reason: 'Engagement spike detected. Optimal posting window in 4 hours.',
    urgency: 'high',
    createdAt: '15 min ago',
  },
  {
    id: 3,
    agent: 'analyst',
    type: 'report',
    title: 'Weekly Performance Report',
    preview: 'Summary: Email open rates up 12%, Meta CTR stable at 2.4%, LinkedIn engagement +28%...',
    reason: 'Weekly digest ready for stakeholder review.',
    urgency: 'normal',
    createdAt: '1 hr ago',
  },
  {
    id: 4,
    agent: 'optimizer',
    type: 'test',
    title: 'A/B Test: Landing Page CTA',
    preview: 'Proposed test: "Donate Now" vs "Make an Impact Today"\nAudience: 50/50 split\nDuration: 7 days',
    reason: 'CTR on current CTA below benchmark. High confidence in variant B.',
    urgency: 'low',
    createdAt: '3 hr ago',
  },
];

const FREYA_ACTIVITY = [
  { id: 1, action: 'Drafting email sequence for Q2 nurture', agent: 'copywriter', status: 'working' },
  { id: 2, action: 'Analyzing Meta ad performance', agent: 'analyst', status: 'working' },
  { id: 3, action: 'Monitoring campaign metrics', agent: 'freya', status: 'monitoring' },
];

const APPROVED_TODAY = [
  { id: 1, title: 'Meta Ad Creative Refresh', agent: 'copywriter', approvedAt: '9:15 AM', executed: true },
  { id: 2, title: 'Lead Enrichment Batch', agent: 'prospector', approvedAt: '8:45 AM', executed: true },
  { id: 3, title: 'Weekly Digest Email', agent: 'outreach', approvedAt: '8:00 AM', executed: true },
];

export default function DashboardSemiAuto() {
  const nav = useNavigate();
  const toast = useToast();
  const design = useCommandModeDesign();

  const [proposals, setProposals] = useState(PENDING_PROPOSALS);
  const [selectedProposal, setSelectedProposal] = useState(PENDING_PROPOSALS[0]);
  const [editMode, setEditMode] = useState(false);
  const [editedContent, setEditedContent] = useState('');

  const handleApprove = (id) => {
    setProposals((prev) => prev.filter((p) => p.id !== id));
    toast.success('Approved and executing...');
    if (selectedProposal?.id === id) {
      setSelectedProposal(proposals.find((p) => p.id !== id) || null);
    }
  };

  const handleReject = (id) => {
    setProposals((prev) => prev.filter((p) => p.id !== id));
    toast.info('Proposal rejected');
    if (selectedProposal?.id === id) {
      setSelectedProposal(proposals.find((p) => p.id !== id) || null);
    }
  };

  const handleEdit = () => {
    setEditedContent(selectedProposal?.preview || '');
    setEditMode(true);
  };

  const handleSaveEdit = () => {
    setProposals((prev) =>
      prev.map((p) =>
        p.id === selectedProposal.id ? { ...p, preview: editedContent } : p
      )
    );
    setSelectedProposal((prev) => ({ ...prev, preview: editedContent }));
    setEditMode(false);
    toast.success('Changes saved');
  };

  const urgencyColor = (u) => {
    if (u === 'high') return C.amber;
    if (u === 'low') return C.textMuted;
    return C.sage;
  };

  return (
    <div style={{
      display: 'flex',
      height: 'calc(100vh - 120px)',
      gap: 0,
      backgroundColor: C.bg,
    }}>
      {/* LEFT: Pending Queue */}
      <div style={{
        width: '340px',
        borderRight: `1px solid ${C.border}`,
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
      }}>
        <div style={{
          padding: S[4],
          borderBottom: `1px solid ${C.border}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div>
            <div style={{
              fontFamily: F.display,
              fontSize: '13px',
              fontWeight: 600,
              color: C.sage,
              display: 'flex',
              alignItems: 'center',
              gap: S[2],
            }}>
              <span style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: C.sage,
                animation: 'pulse 2s infinite',
              }} />
              SEMI-AUTO MODE
            </div>
            <div style={{
              fontFamily: F.body,
              fontSize: '11px',
              color: C.textMuted,
              marginTop: '2px',
            }}>
              Freya proposes, you decide
            </div>
          </div>
          <div style={{
            backgroundColor: C.sageDim,
            padding: `${S[1]} ${S[3]}`,
            borderRadius: R.full,
            fontFamily: F.mono,
            fontSize: '11px',
            fontWeight: 700,
            color: C.sage,
          }}>
            {proposals.length} pending
          </div>
        </div>

        <div style={{ flex: 1, overflowY: 'auto' }}>
          {proposals.map((proposal) => {
            const isSelected = selectedProposal?.id === proposal.id;
            return (
              <button
                key={proposal.id}
                onClick={() => {
                  setSelectedProposal(proposal);
                  setEditMode(false);
                }}
                style={{
                  width: '100%',
                  padding: S[4],
                  backgroundColor: isSelected ? C.sageDim : 'transparent',
                  borderLeft: isSelected ? `3px solid ${C.sage}` : '3px solid transparent',
                  borderBottom: `1px solid ${C.border}`,
                  borderTop: 'none',
                  borderRight: 'none',
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'background 0.15s',
                }}
              >
                <div style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: S[3],
                }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: R.md,
                    backgroundColor: C.surface2,
                    border: `1px solid ${C.border}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    <AgentRoleIcon agentId={proposal.agent} size={16} color={C.sage} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: S[2],
                      marginBottom: '4px',
                    }}>
                      <span style={{
                        fontFamily: F.body,
                        fontSize: '12px',
                        fontWeight: 600,
                        color: C.textPrimary,
                      }}>
                        {proposal.title}
                      </span>
                      <span style={{
                        fontFamily: F.mono,
                        fontSize: '8px',
                        fontWeight: 700,
                        color: urgencyColor(proposal.urgency),
                        textTransform: 'uppercase',
                        padding: '2px 6px',
                        backgroundColor: `${urgencyColor(proposal.urgency)}20`,
                        borderRadius: R.sm,
                      }}>
                        {proposal.urgency}
                      </span>
                    </div>
                    <div style={{
                      fontFamily: F.body,
                      fontSize: '11px',
                      color: C.textMuted,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}>
                      {proposal.preview.split('\n')[0]}
                    </div>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: S[2],
                      marginTop: S[2],
                    }}>
                      <span style={{
                        fontFamily: F.mono,
                        fontSize: '10px',
                        color: C.sage,
                        textTransform: 'capitalize',
                      }}>
                        {proposal.agent}
                      </span>
                      <span style={{ color: C.border }}>•</span>
                      <span style={{
                        fontFamily: F.mono,
                        fontSize: '10px',
                        color: C.textMuted,
                      }}>
                        {proposal.createdAt}
                      </span>
                    </div>
                  </div>
                </div>
              </button>
            );
          })}

          {proposals.length === 0 && (
            <div style={{
              padding: S[6],
              textAlign: 'center',
            }}>
              <div style={{
                width: '48px',
                height: '48px',
                margin: '0 auto',
                borderRadius: R.lg,
                backgroundColor: C.greenDim,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: S[3],
              }}>
                <span style={{ fontSize: '24px' }}>✓</span>
              </div>
              <div style={{
                fontFamily: F.body,
                fontSize: '13px',
                fontWeight: 600,
                color: C.green,
                marginBottom: S[1],
              }}>
                All caught up!
              </div>
              <div style={{
                fontFamily: F.body,
                fontSize: '12px',
                color: C.textMuted,
              }}>
                No pending proposals
              </div>
            </div>
          )}
        </div>

        {/* Freya Activity */}
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
            FREYA ACTIVITY
          </div>
          {FREYA_ACTIVITY.map((item) => (
            <div key={item.id} style={{
              display: 'flex',
              alignItems: 'center',
              gap: S[2],
              padding: `${S[2]} 0`,
            }}>
              <span style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                backgroundColor: item.status === 'working' ? C.sage : C.textMuted,
                animation: item.status === 'working' ? 'pulse 2s infinite' : 'none',
              }} />
              <AgentRoleIcon agentId={item.agent} size={12} color={C.textMuted} />
              <span style={{
                flex: 1,
                fontFamily: F.body,
                fontSize: '10px',
                color: C.textSecondary,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}>
                {item.action}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* CENTER: Proposal Detail */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        minWidth: 0,
      }}>
        {selectedProposal ? (
          <>
            {/* Header */}
            <div style={{
              padding: S[4],
              borderBottom: `1px solid ${C.border}`,
              backgroundColor: C.surface,
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: S[3],
              }}>
                <div style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: R.md,
                  backgroundColor: C.sageDim,
                  border: `2px solid ${C.sage}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <AgentRoleIcon agentId={selectedProposal.agent} size={22} color={C.sage} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{
                    fontFamily: F.display,
                    fontSize: '16px',
                    fontWeight: 600,
                    color: C.textPrimary,
                    marginBottom: '4px',
                  }}>
                    {selectedProposal.title}
                  </div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: S[3],
                    fontFamily: F.mono,
                    fontSize: '11px',
                    color: C.textMuted,
                  }}>
                    <span style={{ color: C.sage, textTransform: 'capitalize' }}>
                      {selectedProposal.agent}
                    </span>
                    <span>•</span>
                    <span style={{ textTransform: 'uppercase' }}>{selectedProposal.type}</span>
                    <span>•</span>
                    <span>{selectedProposal.createdAt}</span>
                  </div>
                </div>
                <div style={{
                  display: 'flex',
                  gap: S[2],
                }}>
                  <button
                    onClick={() => handleReject(selectedProposal.id)}
                    style={{
                      padding: `${S[2]} ${S[4]}`,
                      backgroundColor: 'transparent',
                      border: `1px solid ${C.red}`,
                      borderRadius: R.button,
                      color: C.red,
                      fontFamily: F.body,
                      fontSize: '12px',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    Reject
                  </button>
                  <button
                    onClick={handleEdit}
                    style={{
                      padding: `${S[2]} ${S[4]}`,
                      backgroundColor: 'transparent',
                      border: `1px solid ${C.sage}`,
                      borderRadius: R.button,
                      color: C.sage,
                      fontFamily: F.body,
                      fontSize: '12px',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleApprove(selectedProposal.id)}
                    style={{
                      padding: `${S[2]} ${S[4]}`,
                      backgroundColor: C.green,
                      border: `1px solid ${C.green}`,
                      borderRadius: R.button,
                      color: '#fff',
                      fontFamily: F.body,
                      fontSize: '12px',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    ✓ Approve
                  </button>
                </div>
              </div>
            </div>

            {/* Reason */}
            <div style={{
              padding: S[4],
              backgroundColor: C.sageDim,
              borderBottom: `1px solid ${C.border}`,
            }}>
              <div style={{
                fontFamily: F.mono,
                fontSize: '9px',
                fontWeight: 700,
                color: C.sage,
                letterSpacing: '0.08em',
                marginBottom: S[1],
              }}>
                WHY FREYA IS PROPOSING THIS
              </div>
              <div style={{
                fontFamily: F.body,
                fontSize: '13px',
                color: C.textPrimary,
              }}>
                {selectedProposal.reason}
              </div>
            </div>

            {/* Content */}
            <div style={{
              flex: 1,
              padding: S[5],
              overflowY: 'auto',
            }}>
              <div style={{
                fontFamily: F.mono,
                fontSize: '9px',
                fontWeight: 700,
                color: C.textMuted,
                letterSpacing: '0.08em',
                marginBottom: S[3],
              }}>
                {editMode ? 'EDITING CONTENT' : 'PROPOSED CONTENT'}
              </div>

              {editMode ? (
                <div>
                  <textarea
                    value={editedContent}
                    onChange={(e) => setEditedContent(e.target.value)}
                    style={{
                      width: '100%',
                      minHeight: '300px',
                      padding: S[4],
                      backgroundColor: C.surface,
                      border: `2px solid ${C.sage}`,
                      borderRadius: R.md,
                      fontFamily: F.body,
                      fontSize: '14px',
                      color: C.textPrimary,
                      lineHeight: 1.7,
                      resize: 'vertical',
                      outline: 'none',
                    }}
                  />
                  <div style={{
                    display: 'flex',
                    gap: S[2],
                    marginTop: S[3],
                  }}>
                    <button
                      onClick={() => setEditMode(false)}
                      style={{
                        padding: `${S[2]} ${S[4]}`,
                        backgroundColor: 'transparent',
                        border: `1px solid ${C.border}`,
                        borderRadius: R.button,
                        color: C.textMuted,
                        fontFamily: F.body,
                        fontSize: '12px',
                        cursor: 'pointer',
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveEdit}
                      style={{
                        padding: `${S[2]} ${S[4]}`,
                        backgroundColor: C.sage,
                        border: `1px solid ${C.sage}`,
                        borderRadius: R.button,
                        color: '#fff',
                        fontFamily: F.body,
                        fontSize: '12px',
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              ) : (
                <div style={{
                  padding: S[5],
                  backgroundColor: C.surface,
                  border: `1px solid ${C.border}`,
                  borderRadius: R.card,
                  fontFamily: F.body,
                  fontSize: '14px',
                  color: C.textPrimary,
                  lineHeight: 1.8,
                  whiteSpace: 'pre-wrap',
                }}>
                  {selectedProposal.preview}
                </div>
              )}
            </div>
          </>
        ) : (
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
              borderRadius: R.lg,
              backgroundColor: C.sageDim,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: S[3],
            }}>
              <span style={{ fontSize: '28px' }}>📋</span>
            </div>
            <div style={{
              fontFamily: F.body,
              fontSize: '14px',
            }}>
              Select a proposal to review
            </div>
          </div>
        )}
      </div>

      {/* RIGHT: Approved Today */}
      <div style={{
        width: '240px',
        borderLeft: `1px solid ${C.border}`,
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
            fontSize: '9px',
            fontWeight: 700,
            color: C.green,
            letterSpacing: '0.08em',
          }}>
            APPROVED TODAY
          </div>
        </div>

        <div style={{ flex: 1, overflowY: 'auto' }}>
          {APPROVED_TODAY.map((item) => (
            <div key={item.id} style={{
              padding: S[3],
              borderBottom: `1px solid ${C.border}`,
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: S[2],
                marginBottom: '4px',
              }}>
                <AgentRoleIcon agentId={item.agent} size={14} color={C.sage} />
                <span style={{
                  fontFamily: F.body,
                  fontSize: '12px',
                  fontWeight: 500,
                  color: C.textPrimary,
                  flex: 1,
                }}>
                  {item.title}
                </span>
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: S[2],
                fontFamily: F.mono,
                fontSize: '10px',
                color: C.textMuted,
              }}>
                <span>{item.approvedAt}</span>
                <span style={{
                  color: item.executed ? C.green : C.amber,
                }}>
                  {item.executed ? '✓ Executed' : 'Pending'}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div style={{
          padding: S[4],
          borderTop: `1px solid ${C.border}`,
          backgroundColor: C.surface,
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: S[3],
          }}>
            <div>
              <div style={{
                fontFamily: F.mono,
                fontSize: '18px',
                fontWeight: 700,
                color: C.green,
              }}>
                12
              </div>
              <div style={{
                fontFamily: F.mono,
                fontSize: '9px',
                color: C.textMuted,
              }}>
                APPROVED
              </div>
            </div>
            <div>
              <div style={{
                fontFamily: F.mono,
                fontSize: '18px',
                fontWeight: 700,
                color: C.red,
              }}>
                2
              </div>
              <div style={{
                fontFamily: F.mono,
                fontSize: '9px',
                color: C.textMuted,
              }}>
                REJECTED
              </div>
            </div>
          </div>

          <div style={{
            marginTop: S[3],
            paddingTop: S[3],
            borderTop: `1px dashed ${C.border}`,
          }}>
            <div style={{
              fontFamily: F.mono,
              fontSize: '9px',
              fontWeight: 700,
              color: C.textMuted,
              letterSpacing: '0.08em',
              marginBottom: S[1],
            }}>
              AVG REVIEW TIME
            </div>
            <div style={{
              fontFamily: F.mono,
              fontSize: '14px',
              fontWeight: 600,
              color: C.sage,
            }}>
              2.4 min
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
