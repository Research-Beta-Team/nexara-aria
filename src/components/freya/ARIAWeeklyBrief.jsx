import { C, F, R, S, btn, shadows, Z } from '../../tokens';
import WeeklyPriorityInput from './WeeklyPriorityInput';
import { IconCircleFilled, IconLightbulb } from '../ui/Icons';

const DISMISS_STORAGE_KEY = 'freya_brief_dismissed_week';
const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

function getISOWeekInternal(d) {
  const date = new Date(d);
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() + 4 - (date.getDay() || 7));
  const yearStart = new Date(date.getFullYear(), 0, 1);
  const weekNo = Math.ceil((((date - yearStart) / 86400000) + 1) / 7);
  return `${date.getFullYear()}-W${String(weekNo).padStart(2, '0')}`;
}

export function getISOWeek(d) {
  return getISOWeekInternal(d);
}

export function getBriefDismissedWeek() {
  try {
    return localStorage.getItem(DISMISS_STORAGE_KEY) || null;
  } catch {
    return null;
  }
}

export function setBriefDismissedWeek(week) {
  try {
    if (week) localStorage.setItem(DISMISS_STORAGE_KEY, week);
    else localStorage.removeItem(DISMISS_STORAGE_KEY);
  } catch (_) {}
}

export function shouldShowWeeklyBrief() {
  const current = getISOWeek(new Date());
  const dismissed = getBriefDismissedWeek();
  return dismissed !== current;
}

function FreyaOrb() {
  return (
    <>
      <style>{`
        @keyframes freyaOrbPulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.05); }
        }
      `}</style>
      <div
        style={{
          width: '12px',
          height: '12px',
          borderRadius: '50%',
          backgroundColor: C.primary,
          boxShadow: `0 0 8px ${C.primary}`,
          flexShrink: 0,
          animation: 'freyaOrbPulse 2s ease-in-out infinite',
        }}
      />
    </>
  );
}

/**
 * Full Monday Morning Briefing: 4 sections (Action Required, Watch, Wins, Freya Recommends)
 * + Weekly Priority Input. Dismissible until next week via localStorage.
 */
export default function ARIAWeeklyBrief({
  brief,
  onDismiss,
  onActionRequired,
  onExecuteRecommendation,
  variant = 'inline',
}) {
  const now = new Date();
  const dateStr = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const dayStr = DAYS[now.getDay()];

  const handleDismiss = () => {
    setBriefDismissedWeek(getISOWeek(now));
    onDismiss?.();
  };

  const handleAction = (item) => {
    if (item.actionPath) onActionRequired?.(item);
    else onActionRequired?.(item);
  };

  const cardWrap = {
    backgroundColor: C.surface,
    border: `1px solid ${C.border}`,
    borderRadius: R.card,
    overflow: 'hidden',
    boxShadow: variant === 'modal' ? shadows.modal : undefined,
  };

  const headerRow = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: S[3],
    padding: `${S[4]} ${S[5]}`,
    borderBottom: `1px solid ${C.border}`,
    backgroundColor: C.surface2,
  };

  const sectionBase = {
    padding: S[4],
    borderRadius: R.md,
    height: '100%',
  };

  const actionBg = '#1C0E0E';
  const watchBg = 'rgba(245,200,66,0.06)';
  const winsBg = 'rgba(61,220,132,0.06)';
  const recBg = 'rgba(94,234,212,0.06)';

  const sectionHeader = (iconNode, title, count) => ({
    fontFamily: F.display,
    fontSize: '13px',
    fontWeight: 700,
    color: C.textPrimary,
    marginBottom: S[3],
    display: 'flex',
    alignItems: 'center',
    gap: S[2],
  });

  return (
    <div style={cardWrap}>
      {/* Header */}
      <div style={headerRow}>
        <div style={{ display: 'flex', alignItems: 'center', gap: S[3] }}>
          <FreyaOrb />
          <span style={{ fontFamily: F.display, fontSize: '16px', fontWeight: 700, color: C.textPrimary }}>
            Freya Weekly Brief
          </span>
          <span style={{ fontFamily: F.body, fontSize: '13px', color: C.textMuted }}>
            {dateStr} · {dayStr}
          </span>
        </div>
        <div style={{ fontFamily: F.body, fontSize: '12px', color: C.textSecondary }}>
          {brief?.compiled_at ?? 'Compiled at 8:00 AM'} · Based on {brief?.campaigns_analyzed ?? 6} active campaigns
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: S[2] }}>
          <button
            type="button"
            style={{ ...btn.ghost, fontSize: '12px' }}
            onClick={handleDismiss}
          >
            Dismiss until next Monday
          </button>
          {variant === 'modal' && (
            <button
              type="button"
              style={{ ...btn.icon, color: C.textMuted }}
              onClick={handleDismiss}
              aria-label="Close"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M2 2l12 12M14 2L2 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* 2x2 grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: S[4],
        padding: S[5],
      }}>
        {/* Action Required */}
        <div style={{ ...sectionBase, backgroundColor: actionBg, border: `1px solid rgba(255,110,122,0.2)` }}>
          <div style={sectionHeader(null, 'Action Required', brief?.action_required?.length)}>
            <IconCircleFilled color={C.red} width={10} height={10} />
            Action Required ({brief?.action_required?.length ?? 0})
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: S[3] }}>
            {(brief?.action_required ?? []).map((item) => (
              <div
                key={item.id}
                style={{
                  backgroundColor: 'rgba(0,0,0,0.2)',
                  borderRadius: R.sm,
                  padding: S[3],
                  borderLeft: `3px solid ${C.red}`,
                }}
              >
                <p style={{ fontFamily: F.body, fontSize: '12px', color: C.textSecondary, margin: `0 0 ${S[2]}`, lineHeight: 1.4 }}>
                  {item.text}
                </p>
                <button
                  type="button"
                  style={{ ...btn.secondary, fontSize: '11px', padding: `${S[1]} ${S[2]}`, color: C.red, borderColor: `${C.red}40` }}
                  onClick={() => handleAction(item)}
                >
                  {item.actionLabel ?? 'Act Now'}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Watch */}
        <div style={{ ...sectionBase, backgroundColor: watchBg, border: `1px solid rgba(245,200,66,0.2)` }}>
          <div style={sectionHeader(null, 'Watch', brief?.watch?.length)}>
            <IconCircleFilled color={C.amber} width={10} height={10} />
            Watch ({brief?.watch?.length ?? 0})
          </div>
          <ul style={{ margin: 0, paddingLeft: S[4], display: 'flex', flexDirection: 'column', gap: S[2] }}>
            {(brief?.watch ?? []).map((item) => (
              <li key={item.id} style={{ fontFamily: F.body, fontSize: '12px', color: C.textSecondary, lineHeight: 1.5 }}>
                {item.text}
              </li>
            ))}
          </ul>
        </div>

        {/* Wins */}
        <div style={{ ...sectionBase, backgroundColor: winsBg, border: `1px solid rgba(61,220,132,0.2)` }}>
          <div style={sectionHeader(null, 'Wins This Week', brief?.wins?.length)}>
            <IconCircleFilled color={C.green} width={10} height={10} />
            Wins This Week ({brief?.wins?.length ?? 0})
          </div>
          <ul style={{ margin: 0, paddingLeft: S[4], display: 'flex', flexDirection: 'column', gap: S[2] }}>
            {(brief?.wins ?? []).map((item) => (
              <li key={item.id} style={{ fontFamily: F.body, fontSize: '12px', color: C.textSecondary, lineHeight: 1.5 }}>
                {item.text}
              </li>
            ))}
          </ul>
        </div>

        {/* Freya Recommends */}
        <div style={{ ...sectionBase, backgroundColor: recBg, border: `1px solid rgba(94,234,212,0.2)` }}>
          <div style={sectionHeader(null, 'Freya Recommends', brief?.recommendations?.length)}>
            <IconLightbulb color={C.secondary} width={14} height={14} />
            Freya Recommends ({brief?.recommendations?.length ?? 0})
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: S[3] }}>
            {(brief?.recommendations ?? []).map((rec) => (
              <div
                key={rec.id}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  gap: S[2],
                  flexWrap: 'wrap',
                }}
              >
                <div>
                  <span style={{ fontFamily: F.body, fontSize: '12px', color: C.textPrimary }}>{rec.text}</span>
                  {rec.confidence != null && (
                    <span style={{ fontFamily: F.mono, fontSize: '11px', color: C.textMuted, marginLeft: S[1] }}>
                      · {rec.confidence}% confidence
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  style={{ ...btn.primary, fontSize: '11px', padding: `${S[1]} ${S[2]}`, flexShrink: 0 }}
                  onClick={() => onExecuteRecommendation?.(rec)}
                >
                  {rec.executionType === 'dual_approval' ? 'Execute' : rec.executionType === 'generate_variant' ? 'Generate variant' : 'Build sequence'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <WeeklyPriorityInput />
    </div>
  );
}
