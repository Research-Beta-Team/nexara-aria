import { BUYING_COMMITTEE } from '../../data/icp';
import useToast from '../../hooks/useToast';
import { C, F, R, S, T, btn, badge } from '../../tokens';

// ── Coverage bar ───────────────────────────────
function CoverageBar({ pct }) {
  const color = pct >= 70 ? '#3DDC84' : pct >= 55 ? '#F5C842' : '#FF6E7A';
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontFamily: F.mono, fontSize: '10px', color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Coverage
        </span>
        <span style={{ fontFamily: F.mono, fontSize: '13px', fontWeight: 700, color }}>
          {pct}%
        </span>
      </div>
      <div style={{ height: '5px', backgroundColor: C.surface3, borderRadius: R.pill, overflow: 'hidden' }}>
        <div style={{
          width:           `${pct}%`,
          height:          '100%',
          backgroundColor: color,
          borderRadius:    R.pill,
          transition:      'width 0.8s ease',
        }} />
      </div>
    </div>
  );
}

// ── Role node card ─────────────────────────────
function RoleNode({ role, isLast }) {
  const toast  = useToast();
  const underReached = role.coverage < 70;

  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', flex: 1 }}>
      <div style={{
        flex:            1,
        backgroundColor: C.surface,
        border:          `1px solid ${underReached ? 'rgba(245,200,66,0.35)' : C.border}`,
        borderRadius:    R.card,
        padding:         S[4],
        display:         'flex',
        flexDirection:   'column',
        gap:             S[2],
        position:        'relative',
        minWidth:        0,
      }}>
        {/* Under-reached badge */}
        {underReached && (
          <div style={{
            position:        'absolute',
            top:             '-10px',
            right:           S[3],
            backgroundColor: 'rgba(245,200,66,0.15)',
            border:          '1px solid rgba(245,200,66,0.4)',
            borderRadius:    R.pill,
            padding:         `1px ${S[2]}`,
            fontFamily:      F.mono,
            fontSize:        '9px',
            fontWeight:      700,
            color:           '#F5C842',
            textTransform:   'uppercase',
            letterSpacing:   '0.06em',
            whiteSpace:      'nowrap',
          }}>
            Under-reached
          </div>
        )}

        {/* Order indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: S[2] }}>
          <div style={{
            width:           '20px',
            height:          '20px',
            borderRadius:    '50%',
            backgroundColor: underReached ? 'rgba(245,200,66,0.15)' : C.primaryGlow,
            border:          `1px solid ${underReached ? 'rgba(245,200,66,0.35)' : 'rgba(61,220,132,0.3)'}`,
            display:         'flex',
            alignItems:      'center',
            justifyContent:  'center',
            fontFamily:      F.mono,
            fontSize:        '10px',
            fontWeight:      700,
            color:           underReached ? '#F5C842' : C.primary,
            flexShrink:      0,
          }}>
            {role.reachOrder}
          </div>
          <span style={{ fontFamily: F.mono, fontSize: '10px', color: underReached ? '#F5C842' : C.secondary, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {role.role}
          </span>
        </div>

        {/* Title */}
        <span style={{ fontFamily: F.body, fontSize: '12px', fontWeight: 600, color: C.textPrimary, lineHeight: '1.4' }}>
          {role.title}
        </span>

        {/* Coverage bar */}
        <CoverageBar pct={role.coverage} />

        {/* Avg days */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
            <circle cx="6" cy="6" r="4.5" stroke={C.textMuted} strokeWidth="1.2"/>
            <path d="M6 3.5V6l1.5 1.5" stroke={C.textMuted} strokeWidth="1.2" strokeLinecap="round"/>
          </svg>
          <span style={{ fontFamily: F.mono, fontSize: '10px', color: C.textMuted }}>
            Avg {role.avgDaysToEngage}d to engage
          </span>
        </div>

        {/* Involvement */}
        <p style={{ fontFamily: F.body, fontSize: '11px', color: C.textSecondary, margin: 0, lineHeight: '1.5' }}>
          {role.involvement}
        </p>
      </div>

      {/* Arrow connector */}
      {!isLast && (
        <div style={{
          flexShrink:  0,
          display:     'flex',
          alignItems:  'flex-start',
          paddingTop:  '40px',
          color:       C.border,
          padding:     '38px 6px 0',
        }}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M4 10h12M12 6l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      )}
    </div>
  );
}

// ── Gap row ────────────────────────────────────
function GapRow({ role, onFix }) {
  const color = role.coverage >= 55 ? '#F5C842' : '#FF6E7A';
  const suggestion = role.coverage < 50
    ? `Add ${role.title} contacts to LinkedIn sequence and tag them in CRM`
    : `Schedule dedicated ${role.role} outreach — currently missing in most deals`;

  return (
    <div style={{
      display:         'flex',
      alignItems:      'flex-start',
      gap:             S[4],
      padding:         `${S[3]} ${S[4]}`,
      backgroundColor: C.surface,
      border:          `1px solid ${C.border}`,
      borderRadius:    R.card,
    }}>
      <div style={{
        width:  '36px', height: '36px', borderRadius: '50%', flexShrink: 0,
        backgroundColor: `${color}15`, border: `1px solid ${color}30`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M8 1.5L14.5 13H1.5L8 1.5z" stroke={color} strokeWidth="1.3" strokeLinejoin="round"/>
          <path d="M8 6v4" stroke={color} strokeWidth="1.3" strokeLinecap="round"/>
          <circle cx="8" cy="11.5" r="0.7" fill={color}/>
        </svg>
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '3px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: S[2] }}>
          <span style={{ fontFamily: F.body, fontSize: '13px', fontWeight: 700, color: C.textPrimary }}>
            {role.role}
          </span>
          <span style={{ ...badge.base, backgroundColor: `${color}15`, color, border: `1px solid ${color}30` }}>
            {role.coverage}% reached
          </span>
        </div>
        <span style={{ fontFamily: F.body, fontSize: '12px', color: C.textSecondary }}>
          {suggestion}
        </span>
      </div>
      <button
        style={{ ...btn.secondary, fontSize: '12px', flexShrink: 0 }}
        onClick={onFix}
      >
        Fix gap →
      </button>
    </div>
  );
}

// ── Main ───────────────────────────────────────
export default function BuyingCommitteeMap() {
  const toast  = useToast();
  const gaps   = BUYING_COMMITTEE.filter((r) => r.coverage < 70);
  const avgCov = Math.round(BUYING_COMMITTEE.reduce((a, r) => a + r.coverage, 0) / BUYING_COMMITTEE.length);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: S[5] }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <span style={{ fontFamily: F.display, fontSize: '15px', fontWeight: 700, color: C.textPrimary }}>
            Buying Committee Map
          </span>
          <span style={{ fontFamily: F.body, fontSize: '12px', color: C.textSecondary }}>
            Typical decision-making roles in your closed-won deals. Avg committee coverage: {' '}
            <strong style={{ color: avgCov >= 70 ? C.primary : '#F5C842' }}>{avgCov}%</strong>
          </span>
        </div>
        <button
          style={{ ...btn.secondary, fontSize: '12px' }}
          onClick={() => toast.info('ARIA is updating committee map from latest CRM data…')}
        >
          Refresh from CRM
        </button>
      </div>

      {/* Committee flow */}
      <div style={{
        display:         'flex',
        alignItems:      'flex-start',
        gap:             0,
        overflowX:       'auto',
        scrollbarWidth:  'thin',
        scrollbarColor:  `${C.border} transparent`,
        paddingBottom:   S[2],
        marginTop:       S[2],
      }}>
        {BUYING_COMMITTEE.map((role, idx) => (
          <RoleNode
            key={role.id}
            role={role}
            isLast={idx === BUYING_COMMITTEE.length - 1}
          />
        ))}
      </div>

      {/* Coverage summary */}
      <div style={{ display: 'flex', gap: S[3] }}>
        {BUYING_COMMITTEE.map((role) => {
          const color = role.coverage >= 70 ? '#3DDC84' : role.coverage >= 55 ? '#F5C842' : '#FF6E7A';
          return (
            <div key={role.id} style={{
              flex:            1,
              padding:         `${S[2]} ${S[3]}`,
              backgroundColor: C.surface,
              border:          `1px solid ${C.border}`,
              borderRadius:    R.card,
              display:         'flex',
              flexDirection:   'column',
              alignItems:      'center',
              gap:             '4px',
            }}>
              <span style={{ fontFamily: F.mono, fontSize: '18px', fontWeight: 700, color, lineHeight: 1 }}>
                {role.coverage}%
              </span>
              <span style={{ fontFamily: F.body, fontSize: '10px', color: C.textMuted, textAlign: 'center' }}>
                {role.role}
              </span>
            </div>
          );
        })}
      </div>

      {/* Coverage gaps */}
      {gaps.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: S[3] }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: S[2] }}>
            <span style={{ fontFamily: F.display, fontSize: '14px', fontWeight: 700, color: C.textPrimary }}>
              Coverage Gaps
            </span>
            <span style={{
              ...badge.base,
              backgroundColor: 'rgba(245,200,66,0.1)',
              color:           '#F5C842',
              border:          '1px solid rgba(245,200,66,0.25)',
            }}>
              {gaps.length} roles under-reached
            </span>
          </div>
          {gaps.map((role) => (
            <GapRow
              key={role.id}
              role={role}
              onFix={() => toast.info(`Opening outreach plan for ${role.role}…`)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
