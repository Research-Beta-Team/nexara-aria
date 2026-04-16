/**
 * CommandModeBanner — Mode-specific strip under the top bar.
 * Manual: technical terminal | Semi: balanced review | Agentic: living, autonomous
 */
import { C, F, R, S } from '../../tokens';
import { getCommandModeTheme } from '../../config/commandModeTheme';
export default function CommandModeBanner({ mode, isMobile = false }) {
  const t = getCommandModeTheme(mode);
  const isManual = mode === 'manual';
  const isAgentic = mode === 'fully_agentic';

  // Manual mode — terminal/operator aesthetic
  if (isManual) {
    return (
      <div style={t.bannerStyle} role="status" aria-live="polite">
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: S[3],
          flex: 1,
          minWidth: 0,
          width: '100%',
        }}>
          <TerminalIcon color={C.red} />
          <span style={{
            fontFamily: F.mono,
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '0.1em',
            color: C.red,
            textTransform: 'uppercase',
          }}>
            OPERATOR MODE
          </span>
          <span style={{
            width: '1px',
            height: '14px',
            backgroundColor: C.red,
            opacity: 0.4,
          }} />
          <span style={{
            fontFamily: F.mono,
            fontSize: '10px',
            color: C.textMuted,
            whiteSpace: isMobile ? 'normal' : 'nowrap',
          }}>
            Agents idle. You control all execution.
          </span>
        </div>
        <span style={{
          fontFamily: F.mono,
          fontSize: '9px',
          padding: '2px 6px',
          border: `1px dashed ${C.red}`,
          borderRadius: '2px',
          color: C.red,
          letterSpacing: '0.08em',
          flexShrink: 0,
        }}>
          MANUAL
        </span>
      </div>
    );
  }

  // Agentic mode — alive, autonomous, dynamic
  if (isAgentic) {
    return (
      <div style={{
        ...t.bannerStyle,
        position: 'relative',
        overflow: 'hidden',
      }} role="status" aria-live="polite">
        {/* Animated background gradient */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: `linear-gradient(90deg, transparent 0%, ${C.greenDim} 50%, transparent 100%)`,
          backgroundSize: '200% 100%',
          animation: 'shimmer 3s ease-in-out infinite',
          opacity: 0.5,
          pointerEvents: 'none',
        }} />
        
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: S[3],
          flex: 1,
          minWidth: 0,
          width: '100%',
          position: 'relative',
          zIndex: 1,
        }}>
          <AgentOrb />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', flex: 1, minWidth: 0 }}>
            <span style={{
              fontFamily: F.display,
              fontSize: isMobile ? '13px' : '14px',
              fontWeight: 800,
              color: C.green,
              letterSpacing: '-0.01em',
            }}>
              Freya is in control
            </span>
            {!isMobile && (
              <span style={{
                fontFamily: F.body,
                fontSize: '12px',
                color: C.textSecondary,
                lineHeight: 1.4,
              }}>
                Agents coordinating autonomously. You receive digests and escalations.
              </span>
            )}
          </div>
        </div>
        
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: S[2],
          position: 'relative',
          zIndex: 1,
        }}>
          <AgentActivityIndicator />
          <span style={{
            fontFamily: F.display,
            fontSize: '10px',
            fontWeight: 700,
            padding: '4px 12px',
            backgroundColor: C.green,
            borderRadius: '20px',
            color: '#fff',
            letterSpacing: '0.02em',
            boxShadow: `0 2px 8px ${C.greenDim}`,
            flexShrink: 0,
          }}>
            AUTOPILOT
          </span>
        </div>
      </div>
    );
  }

  // Semi-auto mode — balanced, collaborative
  return (
    <div style={t.bannerStyle} role="status" aria-live="polite">
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: S[3],
        flex: 1,
        minWidth: 0,
        width: '100%',
      }}>
        <ReviewIcon color={C.amber} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', flex: 1, minWidth: 0 }}>
          <span style={{
            fontFamily: F.display,
            fontSize: '12px',
            fontWeight: 700,
            color: C.amber,
          }}>
            Review Mode
          </span>
          {!isMobile && (
            <span style={{
              fontFamily: F.body,
              fontSize: '11px',
              color: C.textSecondary,
            }}>
              Freya drafts and proposes — you approve before sending.
            </span>
          )}
        </div>
      </div>
      
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: S[2],
      }}>
        <PendingCount count={3} />
        <span style={{
          fontFamily: F.body,
          fontSize: '10px',
          fontWeight: 600,
          padding: '3px 10px',
          backgroundColor: C.amberDim,
          border: `1px solid ${C.amber}`,
          borderRadius: R.sm,
          color: C.amber,
          flexShrink: 0,
        }}>
          SEMI-AUTO
        </span>
      </div>
    </div>
  );
}

// ─── Icons & Indicators ───────────────────────────────────────

function TerminalIcon({ color }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <rect x="1" y="2" width="14" height="12" rx="2" stroke={color} strokeWidth="1.5" />
      <path d="M4 6l2.5 2L4 10" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8 10h4" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function ReviewIcon({ color }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="6" stroke={color} strokeWidth="1.5" />
      <path d="M5.5 8l1.5 1.5 3.5-3.5" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function AgentOrb() {
  return (
    <div style={{
      width: '12px',
      height: '12px',
      borderRadius: '50%',
      backgroundColor: C.green,
      boxShadow: `0 0 8px ${C.green}, 0 0 20px ${C.greenDim}`,
      animation: 'orbPulse 2.5s ease-in-out infinite',
      flexShrink: 0,
    }} />
  );
}

function AgentActivityIndicator() {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '3px',
      padding: '4px 8px',
      backgroundColor: C.surface,
      borderRadius: '12px',
      border: `1px solid color-mix(in srgb, ${C.green} 30%, ${C.border})`,
    }}>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          style={{
            width: '3px',
            height: '12px',
            backgroundColor: C.green,
            borderRadius: '2px',
            animation: `audioWave 1s ease-in-out ${i * 0.15}s infinite`,
          }}
        />
      ))}
      <span style={{
        fontFamily: F.mono,
        fontSize: '9px',
        color: C.green,
        marginLeft: '4px',
        fontWeight: 600,
      }}>
        8 agents
      </span>
    </div>
  );
}

function PendingCount({ count }) {
  if (!count) return null;
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '4px',
      padding: '3px 8px',
      backgroundColor: C.surface,
      borderRadius: '12px',
      border: `1px solid ${C.border}`,
    }}>
      <span style={{
        width: '6px',
        height: '6px',
        borderRadius: '50%',
        backgroundColor: C.amber,
      }} />
      <span style={{
        fontFamily: F.mono,
        fontSize: '10px',
        color: C.amber,
        fontWeight: 600,
      }}>
        {count} pending
      </span>
    </div>
  );
}
