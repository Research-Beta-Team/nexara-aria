import { Zap, Briefcase, Users, Eye, Cpu, Phone, Database, FileText, Rocket, Target } from 'lucide-react';
import useStore from '../../store/useStore';
import usePlan from '../../hooks/usePlan';
import useToast from '../../hooks/useToast';
import { ADDONS } from '../../config/addons';
import { PLAN_ORDER } from '../../config/plans';
import { C, F, R, S, T, shadows } from '../../tokens';
import { IconCheck } from '../ui/Icons';

// ── Icon map ──────────────────────────────────
const ICON_MAP = {
  zap:           Zap,
  briefcase:     Briefcase,
  users:         Users,
  eye:           Eye,
  cpu:           Cpu,
  phone:         Phone,
  database:      Database,
  'file-text':   FileText,
  rocket:        Rocket,
  target:        Target,
};

// ── Price type labels ─────────────────────────
const TYPE_LABELS = {
  monthly:           '/mo',
  one_time:          'one-time',
  monthly_per_client:'/mo per client',
};

// ── Min required plan for an addon ────────────
function getRequiredPlanName(addon) {
  for (const planId of PLAN_ORDER) {
    if (addon.availableOn.includes(planId)) {
      const name = planId.charAt(0).toUpperCase() + planId.slice(1);
      return name;
    }
  }
  return null;
}

// ── AddOnCard ─────────────────────────────────
function AddOnCard({ addon }) {
  const toast          = useToast();
  const { planId }     = usePlan();
  const addonsActive   = useStore(s => s.addonsActive);
  const activateAddon  = useStore(s => s.activateAddon);
  const deactivateAddon= useStore(s => s.deactivateAddon);

  const isAvailable = addon.availableOn.includes(planId);
  const isActive    = addonsActive.includes(addon.id);
  const requiredPlan= !isAvailable ? getRequiredPlanName(addon) : null;

  const IconComp = ICON_MAP[addon.icon] ?? Zap;

  const handleClick = () => {
    if (!isAvailable) {
      toast.warning(`${addon.name} requires the ${requiredPlan} plan or above.`);
      return;
    }
    if (isActive) {
      deactivateAddon(addon.id);
      toast.info(`${addon.name} deactivated.`);
    } else {
      activateAddon(addon.id);
      toast.success(`${addon.name} added to your plan!`);
    }
  };

  // ── Button style ───────────────────────────
  const btnBg = isActive
    ? 'rgba(61,220,132,0.15)'
    : isAvailable
    ? C.surface3
    : C.surface2;
  const btnColor = isActive
    ? '#3DDC84'
    : isAvailable
    ? C.textSecondary
    : C.textMuted;
  const btnBorder = isActive
    ? '1px solid rgba(61,220,132,0.4)'
    : isAvailable
    ? `1px solid ${C.border}`
    : `1px solid ${C.border}`;

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: S[3],
      backgroundColor: C.surface,
      border: `1px solid ${isActive ? 'rgba(61,220,132,0.3)' : C.border}`,
      borderRadius: R.card,
      padding: S[5],
      opacity: isAvailable ? 1 : 0.55,
      transition: T.base,
      boxShadow: isActive ? '0 0 16px rgba(61,220,132,0.1)' : 'none',
    }}>
      {/* Icon + name row */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: S[3] }}>
        <div style={{
          width: '38px', height: '38px', borderRadius: R.md,
          backgroundColor: C.surface2,
          border: `1px solid ${C.border}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
          color: isActive ? '#3DDC84' : C.textSecondary,
        }}>
          <IconComp size={18} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontFamily: F.body, fontSize: '14px', fontWeight: 600,
            color: C.textPrimary, lineHeight: 1.3,
          }}>
            {addon.name}
          </div>
          {/* Price badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: S[1], marginTop: '3px', flexWrap: 'wrap' }}>
            <span style={{
              fontFamily: F.mono, fontSize: '12px', fontWeight: 700,
              color: C.textSecondary,
            }}>
              ${addon.price.toLocaleString()}
              <span style={{ fontFamily: F.body, fontWeight: 400, color: C.textMuted, fontSize: '11px' }}>
                {' '}{TYPE_LABELS[addon.type] ?? ''}
              </span>
            </span>
            {addon.monthlyHosting && (
              <span style={{ fontFamily: F.body, fontSize: '11px', color: C.textMuted }}>
                + ${addon.monthlyHosting}/mo hosting
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Description */}
      <div style={{
        fontFamily: F.body, fontSize: '12px', color: C.textSecondary,
        lineHeight: 1.55, flex: 1,
      }}>
        {addon.description}
      </div>

      {/* CTA button */}
      <button
        onClick={handleClick}
        style={{
          width: '100%',
          padding: `${S[2]} ${S[3]}`,
          backgroundColor: btnBg,
          color: btnColor,
          border: btnBorder,
          borderRadius: R.button,
          fontFamily: F.body, fontSize: '13px', fontWeight: 600,
          cursor: 'pointer',
          transition: T.color,
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: S[2],
        }}
      >
        {isActive ? (
          <>
            <IconCheck color="#3DDC84" width={12} height={12} />
            Active
          </>
        ) : !isAvailable ? (
          `Requires ${requiredPlan}`
        ) : (
          'Add to Plan'
        )}
      </button>
    </div>
  );
}

// ── AddonsShop ────────────────────────────────
export default function AddonsShop() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: S[5] }}>
      {/* Section header */}
      <div>
        <div style={{
          fontFamily: F.display, fontSize: '20px', fontWeight: 700,
          color: C.textPrimary, letterSpacing: '-0.01em',
        }}>
          Enhance Your Plan with Add-Ons
        </div>
        <div style={{
          fontFamily: F.body, fontSize: '13px', color: C.textSecondary, marginTop: S[1],
        }}>
          Bolt on extra capacity or premium features without upgrading your base plan.
        </div>
      </div>

      {/* Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: S[4],
      }}>
        {ADDONS.map(addon => (
          <AddOnCard key={addon.id} addon={addon} />
        ))}
      </div>
    </div>
  );
}
