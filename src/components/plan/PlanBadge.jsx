import { C, F, R, S } from '../../tokens';

// Per-plan badge styles (hardcoded to match plan brand colors)
const BADGE_STYLES = {
  starter: {
    backgroundColor: C.surface3,
    color: C.textSecondary,
    borderColor: C.border,
  },
  growth: {
    backgroundColor: '#1a4d35',
    color: '#3DDC84',
    borderColor: '#2a6b4a',
  },
  scale: {
    backgroundColor: '#0e3535',
    color: '#5EEAD4',
    borderColor: '#1a5252',
  },
  agency: {
    backgroundColor: '#2d1f4a',
    color: '#A78BFA',
    borderColor: '#4a3070',
  },
};

const PLAN_LABELS = {
  starter: 'STARTER',
  growth:  'GROWTH',
  scale:   'SCALE',
  agency:  'AGENCY',
};

const SIZE = {
  sm: { fontSize: '10px', padding: `2px ${S[2]}`, gap: S[1] },
  md: { fontSize: '12px', padding: `4px ${S[3]}`, gap: S[1] },
};

// Small diamond icon to denote plan tier
function DiamondIcon({ color }) {
  return (
    <svg width="6" height="6" viewBox="0 0 6 6" fill="none">
      <path d="M3 0L6 3L3 6L0 3L3 0Z" fill={color} />
    </svg>
  );
}

export default function PlanBadge({ planId, size = 'sm', showIcon = false }) {
  const variantStyle = BADGE_STYLES[planId] ?? BADGE_STYLES.starter;
  const sizeStyle    = SIZE[size] ?? SIZE.sm;

  const style = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: sizeStyle.gap,
    borderRadius: R.pill,
    padding: sizeStyle.padding,
    fontFamily: F.mono,
    fontSize: sizeStyle.fontSize,
    fontWeight: 700,
    letterSpacing: '0.05em',
    whiteSpace: 'nowrap',
    border: `1px solid ${variantStyle.borderColor}`,
    backgroundColor: variantStyle.backgroundColor,
    color: variantStyle.color,
  };

  return (
    <span style={style}>
      {showIcon && <DiamondIcon color={variantStyle.color} />}
      {PLAN_LABELS[planId] ?? planId?.toUpperCase() ?? '—'}
    </span>
  );
}
