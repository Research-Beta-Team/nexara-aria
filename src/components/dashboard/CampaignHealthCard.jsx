import useToast from '../../hooks/useToast';
import { C, F, R, S, T, shadows, cardStyle, badge, flex, btn } from '../../tokens';

// health → badge variant + label
const HEALTH_MAP = {
  on_track: { variant: 'green',  label: 'On Track' },
  ahead:    { variant: 'green',  label: 'Ahead',   color: C.secondary },
  at_risk:  { variant: 'red',    label: 'At Risk'  },
};

// progress bar color by health
const PROGRESS_COLOR = {
  on_track: C.primary,
  ahead:    C.secondary,
  at_risk:  C.red,
};

function HealthBadge({ health }) {
  const map = HEALTH_MAP[health] ?? HEALTH_MAP.on_track;
  const colorOverride = map.color ? { color: map.color } : {};
  return (
    <span style={{ ...badge.base, ...badge[map.variant], ...colorOverride }}>
      {map.label}
    </span>
  );
}

export default function CampaignHealthCard({ name, goal, current, health, spend, cpl, channels }) {
  const toast = useToast();
  const pct = Math.min(100, Math.round((current / goal) * 100));
  const barColor = PROGRESS_COLOR[health] ?? C.primary;

  const cardWrap = {
    ...cardStyle,
    display: 'flex',
    flexDirection: 'column',
    gap: S[4],
    transition: T.base,
  };

  const statBox = {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  };

  const statVal = {
    fontFamily: F.mono,
    fontSize: '16px',
    fontWeight: 700,
    color: C.textPrimary,
    lineHeight: 1,
  };

  const statLbl = {
    fontFamily: F.body,
    fontSize: '11px',
    fontWeight: 500,
    color: C.textMuted,
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
  };

  return (
    <div style={cardWrap}>
      {/* Header row */}
      <div style={{ ...flex.rowBetween, gap: S[2] }}>
        <span style={{
          fontFamily: F.display,
          fontSize: '14px',
          fontWeight: 700,
          color: C.textPrimary,
          flex: 1,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}>
          {name}
        </span>
        <HealthBadge health={health} />
      </div>

      {/* Progress */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: S[1] }}>
        <div style={{ ...flex.rowBetween }}>
          <span style={{ fontFamily: F.body, fontSize: '12px', color: C.textSecondary }}>
            Leads
          </span>
          <span style={{ fontFamily: F.mono, fontSize: '12px', color: C.textPrimary }}>
            {current} / {goal}
          </span>
        </div>
        {/* Track */}
        <div style={{
          height: '6px',
          borderRadius: R.pill,
          backgroundColor: C.surface3,
          overflow: 'hidden',
        }}>
          <div style={{
            height: '100%',
            width: `${pct}%`,
            borderRadius: R.pill,
            backgroundColor: barColor,
            boxShadow: health === 'at_risk' ? `0 0 6px ${C.red}` : `0 0 6px ${barColor}`,
            transition: 'width 0.4s ease',
          }}/>
        </div>
        <span style={{ fontFamily: F.mono, fontSize: '11px', color: C.textMuted, alignSelf: 'flex-end' }}>
          {pct}% of goal
        </span>
      </div>

      {/* Stats row */}
      <div style={{ display: 'flex', gap: S[6] }}>
        <div style={statBox}>
          <span style={statVal}>${spend.toLocaleString()}</span>
          <span style={statLbl}>Spend</span>
        </div>
        <div style={statBox}>
          <span style={statVal}>${cpl}</span>
          <span style={statLbl}>CPL</span>
        </div>
      </div>

      {/* Footer row */}
      <div style={{ ...flex.rowBetween, marginTop: 'auto' }}>
        <span style={{
          fontFamily: F.body,
          fontSize: '12px',
          color: C.textMuted,
          backgroundColor: C.surface2,
          border: `1px solid ${C.border}`,
          borderRadius: R.pill,
          padding: `2px ${S[2]}`,
        }}>
          {channels}
        </span>
        <button
          style={{
            ...btn.secondary,
            padding: `4px ${S[3]}`,
            fontSize: '12px',
            color: health === 'at_risk' ? C.red : C.textSecondary,
            borderColor: health === 'at_risk' ? C.red : C.border,
          }}
          onClick={() => toast.warning(`Campaign "${name}" paused`)}
        >
          Pause
        </button>
      </div>
    </div>
  );
}
