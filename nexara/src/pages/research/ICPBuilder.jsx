import { useState } from 'react';
import useToast from '../../hooks/useToast';
import { ICP_DEFINITION } from '../../data/icp';
import ICPDefinitionPanel       from '../../components/icp/ICPDefinitionPanel';
import ScoringCriteriaBuilder   from '../../components/icp/ScoringCriteriaBuilder';
import ProspectScoreDistribution from '../../components/icp/ProspectScoreDistribution';
import WinLossInsights          from '../../components/icp/WinLossInsights';
import BuyingCommitteeMap       from '../../components/icp/BuyingCommitteeMap';
import LookalikeExpansion       from '../../components/icp/LookalikeExpansion';
import { C, F, R, S, T, btn, shadows, sectionHeading } from '../../tokens';

const TABS = [
  { id: 'definition',   label: 'Definition'          },
  { id: 'scoring',      label: 'Scoring Criteria'    },
  { id: 'distribution', label: 'Score Distribution'  },
  { id: 'winloss',      label: 'Win/Loss Insights'   },
  { id: 'committee',    label: 'Buying Committee'    },
  { id: 'lookalike',    label: 'Lookalike Expansion' },
];

// ── ARIA Icon ──────────────────────────────────
function AriaIcon({ size = 16, color }) {
  return (
    <svg width={size} height={size} viewBox="0 0 14 14" fill="none">
      <path d="M7 1.5L13.2 12.8H.8L7 1.5z" stroke={color ?? C.primary} strokeWidth="1.3" strokeLinejoin="round"/>
      <path d="M3.6 9.2h6.8" stroke={color ?? C.primary} strokeWidth="1.3" strokeLinecap="round"/>
      <circle cx="7"    cy="1.5"  r="1.1" fill={color ?? C.primary}/>
      <circle cx=".8"   cy="12.8" r="1.1" fill={color ?? C.primary}/>
      <circle cx="13.2" cy="12.8" r="1.1" fill={color ?? C.primary}/>
    </svg>
  );
}

// ── ICP Builder page ───────────────────────────
export default function ICPBuilder() {
  const [activeTab, setActiveTab] = useState('definition');
  const toast = useToast();

  const { version, lastUpdated, updatedBy, icpScore } = ICP_DEFINITION;

  return (
    <div style={{ padding: S[6], display: 'flex', flexDirection: 'column', gap: S[5] }}>

      {/* ── Page header ─────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: S[3] }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <h1 style={{ ...sectionHeading, fontSize: '22px', letterSpacing: '-0.02em', margin: 0 }}>
            ICP Builder
          </h1>
          <span style={{ fontFamily: F.body, fontSize: '13px', color: C.textSecondary }}>
            <span style={{ fontFamily: F.mono, color: C.primary }}>{version}</span>
            {' · Last updated '}
            <strong style={{ color: C.textPrimary }}>{lastUpdated}</strong>
            {' by '}
            <span style={{ color: C.secondary }}>{updatedBy}</span>
          </span>
        </div>
        <div style={{ display: 'flex', gap: S[2] }}>
          <button
            style={{ ...btn.secondary, fontSize: '13px', gap: S[2] }}
            onClick={() => toast.info('ARIA is regenerating your ICP from 12 recent closed-won deals…')}
          >
            <AriaIcon size={14} />
            Regenerate from wins
          </button>
          <button
            style={{ ...btn.secondary, fontSize: '13px' }}
            onClick={() => toast.success('ICP exported as PDF')}
          >
            Export ICP
          </button>
        </div>
      </div>

      {/* ── ARIA Confidence Banner ───────────────── */}
      <div style={{
        display:         'flex',
        alignItems:      'center',
        gap:             S[3],
        padding:         `${S[3]} ${S[4]}`,
        backgroundColor: 'rgba(61,220,132,0.06)',
        border:          `1px solid rgba(61,220,132,0.2)`,
        borderLeft:      `3px solid ${C.primary}`,
        borderRadius:    R.card,
      }}>
        <AriaIcon size={18} />
        <div style={{ flex: 1 }}>
          <span style={{ fontFamily: F.body, fontSize: '13px', color: C.textPrimary, fontWeight: 600 }}>
            ARIA has high confidence ({icpScore}/100) in this ICP
          </span>
          <span style={{ fontFamily: F.body, fontSize: '13px', color: C.textSecondary, marginLeft: S[2] }}>
            — derived from 12 recent closed-won deals across Vietnam and Bangladesh.
          </span>
        </div>
        <button
          style={{ ...btn.ghost, fontSize: '12px', color: C.primary, padding: `${S[1]} ${S[2]}` }}
          onClick={() => toast.info('Opening ICP confidence breakdown…')}
        >
          How was this calculated? →
        </button>
      </div>

      {/* ── Tab bar ─────────────────────────────── */}
      <div style={{
        display:         'flex',
        gap:             0,
        borderBottom:    `1px solid ${C.border}`,
        overflowX:       'auto',
        scrollbarWidth:  'none',
      }}>
        {TABS.map((tab) => {
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              style={{
                fontFamily:      F.body,
                fontSize:        '13px',
                fontWeight:      active ? 600 : 400,
                color:           active ? C.primary : C.textSecondary,
                backgroundColor: 'transparent',
                border:          'none',
                borderBottom:    active ? `2px solid ${C.primary}` : '2px solid transparent',
                padding:         `${S[3]} ${S[4]}`,
                cursor:          'pointer',
                transition:      T.color,
                whiteSpace:      'nowrap',
                flexShrink:      0,
              }}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* ── Tab content ─────────────────────────── */}
      <div>
        {activeTab === 'definition'   && <ICPDefinitionPanel />}
        {activeTab === 'scoring'      && <ScoringCriteriaBuilder />}
        {activeTab === 'distribution' && <ProspectScoreDistribution />}
        {activeTab === 'winloss'      && <WinLossInsights />}
        {activeTab === 'committee'    && <BuyingCommitteeMap />}
        {activeTab === 'lookalike'    && <LookalikeExpansion />}
      </div>
    </div>
  );
}
