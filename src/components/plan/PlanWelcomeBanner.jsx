import { X, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PLANS } from '../../config/plans';
import { C, F, R, S, btn } from '../../tokens';

// Plan-specific feature highlights: [label, route]
const PLAN_FEATURES = {
  growth: [
    { label: 'Company Social Inbox', path: '/inbox' },
    { label: 'ABM Engine', path: '/abm' },
    { label: 'LinkedIn Outreach', path: '/campaigns' },
  ],
  scale: [
    { label: 'Competitive Intel', path: '/research/competitive' },
    { label: 'Predictive Forecasting', path: '/forecast' },
    { label: 'Customer Success', path: '/customer-success' },
  ],
  agency: [
    { label: 'White-Label', path: '/workspace/whitelabel' },
    { label: 'Unlimited teams', path: '/team' },
    { label: 'ARIA Voice', path: '/aria-brain' },
  ],
};

/**
 * PlanWelcomeBanner — full-width mint banner shown once after upgrade.
 * Replaces ARIA insight strip on Dashboard when visible. Dismissible via localStorage.
 */
export default function PlanWelcomeBanner({ planId, onDismiss }) {
  const navigate = useNavigate();
  const plan = PLANS[planId];
  const features = PLAN_FEATURES[planId] ?? PLAN_FEATURES.growth;
  const displayName = plan?.displayName ?? planId;

  const wrap = {
    backgroundColor: 'rgba(61,220,132,0.08)',
    border: `1px solid rgba(61,220,132,0.25)`,
    borderRadius: R.card,
    padding: S[5],
    display: 'flex',
    flexDirection: 'column',
    gap: S[4],
  };

  const header = {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: S[3],
  };

  const titleStyle = {
    fontFamily: F.display,
    fontSize: '18px',
    fontWeight: 700,
    color: C.textPrimary,
    margin: 0,
  };

  const subStyle = {
    fontFamily: F.body,
    fontSize: '13px',
    color: C.textSecondary,
    marginTop: '4px',
  };

  const cardsRow = {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
    gap: S[3],
  };

  const cardStyle = {
    backgroundColor: C.surface2,
    border: `1px solid ${C.border}`,
    borderRadius: R.md,
    padding: S[4],
    display: 'flex',
    flexDirection: 'column',
    gap: S[2],
  };

  const tryLinkStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: S[1],
    background: 'none',
    border: 'none',
    padding: 0,
    fontFamily: F.body,
    fontSize: '13px',
    fontWeight: 600,
    color: C.primary,
    cursor: 'pointer',
    transition: 'opacity 0.15s ease',
  };

  return (
    <div style={wrap}>
      <div style={header}>
        <div>
          <h2 style={titleStyle}>You're now on {displayName}</h2>
          <p style={subStyle}>Here's what just unlocked:</p>
        </div>
        <button
          style={{ ...btn.icon, flexShrink: 0 }}
          onClick={onDismiss}
          aria-label="Dismiss"
        >
          <X size={18} />
        </button>
      </div>
      <div style={cardsRow}>
        {features.map(({ label, path }) => (
          <div key={label} style={cardStyle}>
            <span style={{ fontFamily: F.body, fontSize: '14px', fontWeight: 600, color: C.textPrimary }}>
              {label}
            </span>
            <button
              style={tryLinkStyle}
              onClick={() => {
                onDismiss?.();
                navigate(path);
              }}
            >
              Try it now
              <ArrowRight size={14} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
