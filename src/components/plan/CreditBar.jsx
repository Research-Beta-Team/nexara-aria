import { useState } from 'react';
import { Zap } from 'lucide-react';
import useCredits from '../../hooks/useCredits';
import usePlan from '../../hooks/usePlan';
import useToast from '../../hooks/useToast';
import { C, F, R, S, T, flex } from '../../tokens';

/**
 * CreditBar — displays credit usage as a progress bar.
 *
 * size="compact"  → thin 4px bar with hover tooltip (for Sidebar / TopBar)
 * size="full"     → labelled 8px bar with rollover info and low-credit warning
 *
 * Usage:
 *   <CreditBar size="compact" />
 *   <CreditBar size="full" />
 */
export default function CreditBar({ size = 'compact' }) {
  const {
    creditsRemaining,
    creditsUsed,
    creditsIncluded,
    rolloverBalance,
    usagePercent,
    isLow,
    estimatedDaysRemaining,
  } = useCredits();

  const { upgradePlan, planId } = usePlan();
  const toast = useToast();

  const [hovered, setHovered] = useState(false);

  // Bar fill color based on usage
  const barColor =
    usagePercent > 85 ? C.red :
    usagePercent > 70 ? C.amber :
    C.primary;

  const fillWidth = `${Math.min(100, Math.max(0, usagePercent))}%`;

  const daysLabel = Number.isFinite(estimatedDaysRemaining)
    ? `${estimatedDaysRemaining}d remaining`
    : 'unlimited';

  // ── Compact mode ───────────────────────────────────────────────────────────
  if (size === 'compact') {
    return (
      <div
        style={{ width: '100%', position: 'relative', cursor: 'default' }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* Bar track */}
        <div style={{
          height: '4px', borderRadius: R.pill,
          backgroundColor: C.surface3,
          overflow: 'hidden',
        }}>
          <div style={{
            width: fillWidth,
            height: '100%',
            borderRadius: R.pill,
            backgroundColor: barColor,
            transition: T.slow,
          }} />
        </div>

        {/* Hover tooltip */}
        {hovered && (
          <div style={{
            position: 'absolute',
            bottom: 'calc(100% + 8px)',
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: C.surface3,
            border: `1px solid ${C.border}`,
            borderRadius: R.md,
            padding: `${S[1]} ${S[3]}`,
            fontFamily: F.mono,
            fontSize: '11px',
            color: C.textSecondary,
            whiteSpace: 'nowrap',
            zIndex: 200,
            pointerEvents: 'none',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
          }}>
            {creditsUsed.toLocaleString()} / {creditsIncluded.toLocaleString()} credits used
            {' · '}{daysLabel}
          </div>
        )}
      </div>
    );
  }

  // ── Full mode ──────────────────────────────────────────────────────────────
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: S[2] }}>
      {/* Label row */}
      <div style={flex.rowBetween}>
        <span style={{
          fontFamily: F.body, fontSize: '13px', fontWeight: 500,
          color: C.textSecondary,
        }}>
          Agent Credits
        </span>
        <span style={{
          fontFamily: F.mono, fontSize: '12px',
          color: C.textSecondary,
        }}>
          {creditsUsed.toLocaleString()} / {creditsIncluded.toLocaleString()} used
        </span>
      </div>

      {/* Bar */}
      <div style={{
        height: '8px', borderRadius: R.pill,
        backgroundColor: C.surface3,
        overflow: 'hidden',
      }}>
        <div style={{
          width: fillWidth,
          height: '100%',
          borderRadius: R.pill,
          backgroundColor: barColor,
          transition: T.slow,
        }} />
      </div>

      {/* Percentage + days */}
      <div style={flex.rowBetween}>
        <span style={{ fontFamily: F.mono, fontSize: '11px', color: C.textMuted }}>
          {Math.round(usagePercent)}% used
        </span>
        <span style={{ fontFamily: F.mono, fontSize: '11px', color: C.textMuted }}>
          {daysLabel}
        </span>
      </div>

      {/* Rollover note */}
      {rolloverBalance > 0 && (
        <span style={{
          fontFamily: F.body, fontSize: '11px',
          color: C.textMuted,
        }}>
          + {rolloverBalance.toLocaleString()} rollover balance available
        </span>
      )}

      {/* Low-credit warning */}
      {isLow && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: S[2],
          backgroundColor: C.amberDim,
          border: `1px solid ${C.amber}`,
          borderRadius: R.md,
          padding: `${S[2]} ${S[3]}`,
          marginTop: S[1],
        }}>
          <span style={{ fontFamily: F.body, fontSize: '12px', color: C.amber, flex: 1 }}>
            Running low
          </span>
          <button
            style={{
              fontFamily: F.body, fontSize: '12px', fontWeight: 600,
              color: C.amber, background: 'none', border: 'none', cursor: 'pointer', padding: 0,
            }}
            onClick={() => toast.info('Processing credits purchase... (mock)')}
          >
            Buy Credits
          </button>
          {upgradePlan && (
            <>
              <span style={{ fontFamily: F.body, fontSize: '12px', color: C.amberDim }}>·</span>
              <button
                style={{
                  fontFamily: F.body, fontSize: '12px', fontWeight: 600,
                  color: C.amber, background: 'none', border: 'none', cursor: 'pointer', padding: 0,
                }}
                onClick={() => toast.info('Opening upgrade flow... (mock)')}
              >
                Upgrade
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
