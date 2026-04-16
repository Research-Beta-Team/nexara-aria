import { useState } from 'react';
import useToast from '../../../hooks/useToast';
import { useAgent } from '../../../hooks/useAgent';
import AgentThinking from '../../agents/AgentThinking';
import { C, F, R, S, T, btn, inputStyle } from '../../../tokens';
import { metaCampaigns } from '../../../data/campaigns';
import {
  IconChart,
  IconFacebook,
  IconFlask,
  IconLightbulb,
  IconLinkedIn,
  IconPen,
  IconSearch,
  IconSettings,
  IconShield,
  IconTrendUp,
  IconWarning,
} from '../../ui/Icons';
import { AgentNameWithIcon } from '../../ui/AgentRoleIcon';
import { CHANNEL_COLORS } from '../../../config/channelBrands';

/* ─── Ad creative mock data ────────────────────────────────── */
const AD_CREATIVES = {
  Meta: [
    { id: 'mc1', headline: 'Frontline healthcare, funded by donors like you', body: 'Medglobal deploys licensed healthcare workers within 72 hours of a crisis. Every dollar goes directly to patient care.', format: 'Single Image', ctr: '3.2%', cpc: '$1.40', impressions: '48.2k', status: 'active', agent: { agentId: 'copywriter' }, guardianApproved: true },
    { id: 'mc2', headline: 'See exactly where your donation goes', body: 'Real-time impact tracking. Real patients. Real outcomes. Join 12,000 donors making healthcare accessible everywhere.', format: 'Carousel', ctr: '4.1%', cpc: '$1.15', impressions: '61.4k', status: 'active', agent: { agentId: 'copywriter' }, guardianApproved: true },
    { id: 'mc3', headline: 'Healthcare without borders — your donation in action', body: 'Watch how a $50 donation translates to 210 minutes of frontline patient care in Yemen.', format: 'Video', ctr: '5.8%', cpc: '$0.92', impressions: '33.1k', status: 'ab_testing', agent: { agentId: 'copywriter' }, guardianApproved: true },
    { id: 'mc4', headline: 'Emergency response within 72 hours — help us get there', body: 'Draft version — pending Guardian review.', format: 'Single Image', ctr: null, cpc: null, impressions: null, status: 'in_review', agent: { agentId: 'copywriter' }, guardianApproved: false },
  ],
  LinkedIn: [
    { id: 'li1', headline: 'Medglobal expands to 3 new crisis zones in Q2', body: 'We\'re scaling operations across MENA, Southeast Asia, and Latin America. Partner with us to fund the next deployment.', format: 'Single Image', ctr: '2.8%', cpc: '$3.20', impressions: '22.8k', status: 'active', agent: { agentId: 'copywriter' }, guardianApproved: true },
    { id: 'li2', headline: 'Impact report: 2,800 patients treated this quarter', body: 'Download our Q1 2026 impact report. See the data behind every dollar donated.', format: 'Document', ctr: '3.1%', cpc: '$2.85', impressions: '18.4k', status: 'active', agent: { agentId: 'copywriter' }, guardianApproved: true },
    { id: 'li3', headline: 'Why healthcare professionals choose to partner with Medglobal', body: 'Not just aid — embedded healthcare infrastructure that outlasts the emergency.', format: 'Carousel', ctr: '2.4%', cpc: '$3.60', impressions: '14.2k', status: 'paused', agent: { agentId: 'copywriter' }, guardianApproved: true },
    { id: 'li4', headline: 'New: Medglobal Corporate Partnership Program', body: 'Draft — Strategist generating copy hook', format: 'Single Image', ctr: null, cpc: null, impressions: null, status: 'draft', agent: { agentId: 'strategist' }, guardianApproved: false },
  ],
  Google: [
    { id: 'gg1', headline: 'Donate to frontline healthcare today', body: 'Support Medglobal\'s emergency health programs. Tax-deductible. 100% of funds go to patient care.', format: 'Responsive Search', ctr: '6.2%', cpc: '$0.78', impressions: '94.3k', status: 'active', agent: { agentId: 'copywriter' }, guardianApproved: true },
    { id: 'gg2', headline: 'Healthcare NGO donation — see your impact', body: 'Real-time impact dashboard for every donor. See exactly how your donation is used.', format: 'Responsive Search', ctr: '5.4%', cpc: '$0.85', impressions: '78.1k', status: 'active', agent: { agentId: 'copywriter' }, guardianApproved: true },
    { id: 'gg3', headline: 'Emergency medical aid — donate now', body: 'Crisis response within 72 hours. Join Medglobal\'s network of impact donors.', format: 'Display', ctr: '1.8%', cpc: '$0.45', impressions: '210.5k', status: 'ab_testing', agent: { agentId: 'copywriter' }, guardianApproved: true },
    { id: 'gg4', headline: 'Healthcare in crisis zones — your support needed', body: 'Draft — pending keyword research from Analyst', format: 'Responsive Search', ctr: null, cpc: null, impressions: null, status: 'draft', agent: { agentId: 'analyst' }, guardianApproved: false },
  ],
};

const OPTIMIZER_INSIGHTS = [
  { id: 'oi1', type: 'ab_test', text: 'A/B test running: Meta video CTA variant (n=1,240, 68h remaining)', severity: 'info', action: 'View Results' },
  { id: 'oi2', type: 'recommendation', text: 'Recommendation: Increase LinkedIn budget 15% — CPL $27 lower than Meta for same ICP segment', severity: 'success', action: 'Apply +15%' },
  { id: 'oi3', type: 'warning', text: 'Warning: ANZ audience burnout 94% — rotate creative immediately to prevent CPL spike', severity: 'warning', action: 'Rotate Creative' },
  { id: 'oi4', type: 'info', text: 'Google Display CTR 1.8% — below benchmark 2.4%. Analyst flagged image creative quality as root cause.', severity: 'info', action: 'Run Analyst' },
];

const PLATFORMS = ['Meta', 'LinkedIn', 'Google'];

const PLATFORM_META = {
  Meta:     { color: '#1877F2', totalSpend: 18400, totalLeads: 94 },
  LinkedIn: { color: '#0A66C2', totalSpend: 12100, totalLeads: 47 },
  Google:   { color: '#4285F4', totalSpend: 9800,  totalLeads: 71 },
};

function PlatformGlyph({ platform, size = 18, onPrimary = false }) {
  const inv = onPrimary ? '#FFFFFF' : null;
  if (platform === 'Meta') return <IconFacebook width={size} height={size} color={inv || undefined} />;
  if (platform === 'LinkedIn') return <IconLinkedIn width={size} height={size} color={inv || undefined} />;
  return <IconSearch color={inv || '#4285F4'} w={size} />;
}

function InsightTypeIcon({ type, color, size = 14 }) {
  if (type === 'ab_test') return <IconFlask color={color} w={size} />;
  if (type === 'recommendation') return <IconTrendUp color={color} w={size} />;
  if (type === 'warning') return <IconWarning color={color} width={size} height={size} />;
  return <IconLightbulb color={color} width={size} height={size} />;
}

const STATUS_CONFIG = {
  active:     { color: C.green,   label: 'Active',      bg: 'rgba(16,185,129,0.12)',  border: 'rgba(16,185,129,0.3)' },
  paused:     { color: C.amber,   label: 'Paused',      bg: 'rgba(251,191,36,0.12)',  border: 'rgba(251,191,36,0.3)' },
  in_review:  { color: C.amber,   label: 'In Review',   bg: 'rgba(251,191,36,0.12)',  border: 'rgba(251,191,36,0.3)' },
  ab_testing: { color: '#60A5FA', label: 'A/B Testing', bg: 'rgba(96,165,250,0.12)',  border: 'rgba(96,165,250,0.3)' },
  draft:      { color: C.textMuted, label: 'Draft',     bg: C.surface3,               border: C.border },
};

/* ─── Sub-components ────────────────────────────────────────── */
function AgentActionBar({ copywriter, optimizer, analyst, onGenCreative, onRunOptimizer, onRunAnalyst }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: S[3], flexWrap: 'wrap',
      backgroundColor: C.surface2,
      border: `1px solid ${C.border}`,
      borderRadius: R.md,
      padding: `${S[3]} ${S[4]}`,
    }}>
      <span style={{ fontFamily: F.mono, fontSize: '11px', fontWeight: 700, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
        Ads Agents
      </span>
      <div style={{ width: '1px', height: '20px', backgroundColor: C.border }} />
      <button
        onClick={onGenCreative}
        disabled={copywriter.isActive}
        style={{
          ...btn.primary, fontSize: '12px', padding: `${S[1]} ${S[3]}`,
          opacity: copywriter.isActive ? 0.7 : 1,
          cursor: copywriter.isActive ? 'wait' : 'pointer',
        }}
      >
        <IconPen color={C.textInverse} width={14} height={14} />
        {copywriter.isActive ? 'Generating…' : '▶ Ad Creative'}
      </button>
      <button
        onClick={onRunOptimizer}
        disabled={optimizer.isActive}
        style={{
          ...btn.secondary, fontSize: '12px', padding: `${S[1]} ${S[3]}`,
          opacity: optimizer.isActive ? 0.7 : 1,
          cursor: optimizer.isActive ? 'wait' : 'pointer',
        }}
      >
        <IconSettings color={C.textPrimary} w={14} />
        {optimizer.isActive ? 'Optimizing…' : '▶ A/B Test'}
      </button>
      <button
        onClick={onRunAnalyst}
        disabled={analyst.isActive}
        style={{
          ...btn.secondary, fontSize: '12px', padding: `${S[1]} ${S[3]}`,
          opacity: analyst.isActive ? 0.7 : 1,
          cursor: analyst.isActive ? 'wait' : 'pointer',
        }}
      >
        <IconChart color={C.textPrimary} width={14} height={14} />
        {analyst.isActive ? 'Analyzing…' : '▶ Performance'}
      </button>
    </div>
  );
}

function CreativeCard({ creative, toast }) {
  const cfg = STATUS_CONFIG[creative.status] || STATUS_CONFIG.draft;
  return (
    <div style={{
      backgroundColor: C.surface2,
      border: `1px solid ${C.border}`,
      borderRadius: R.card,
      padding: S[4],
      display: 'flex', flexDirection: 'column', gap: S[3],
    }}>
      {/* Header row */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: S[2] }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontFamily: F.body, fontSize: '13px', fontWeight: 700, color: C.textPrimary,
            lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
            marginBottom: '4px',
          }}>
            {creative.headline}
          </div>
          <div style={{ fontFamily: F.body, fontSize: '11px', color: C.textSecondary, lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {creative.body}
          </div>
        </div>
        <span style={{
          fontFamily: F.mono, fontSize: '9px', fontWeight: 700,
          color: cfg.color, backgroundColor: cfg.bg, border: `1px solid ${cfg.border}`,
          borderRadius: R.pill, padding: '2px 8px', whiteSpace: 'nowrap', flexShrink: 0,
        }}>{cfg.label}</span>
      </div>

      {/* Format tag */}
      <span style={{
        alignSelf: 'flex-start',
        fontFamily: F.mono, fontSize: '9px', fontWeight: 700,
        color: C.textMuted, backgroundColor: C.surface3, border: `1px solid ${C.border}`,
        borderRadius: R.pill, padding: '1px 6px',
      }}>{creative.format}</span>

      {/* Metrics */}
      {creative.ctr && (
        <div style={{ display: 'flex', gap: S[3], flexWrap: 'wrap' }}>
          <div>
            <div style={{ fontFamily: F.body, fontSize: '10px', color: C.textMuted }}>CTR</div>
            <div style={{ fontFamily: F.mono, fontSize: '13px', fontWeight: 700, color: C.primary }}>{creative.ctr}</div>
          </div>
          <div>
            <div style={{ fontFamily: F.body, fontSize: '10px', color: C.textMuted }}>CPC</div>
            <div style={{ fontFamily: F.mono, fontSize: '13px', fontWeight: 700, color: C.textPrimary }}>{creative.cpc}</div>
          </div>
          <div>
            <div style={{ fontFamily: F.body, fontSize: '10px', color: C.textMuted }}>Impressions</div>
            <div style={{ fontFamily: F.mono, fontSize: '13px', fontWeight: 700, color: C.textPrimary }}>{creative.impressions}</div>
          </div>
        </div>
      )}

      {/* Agent + Guardian status */}
      <div style={{ display: 'flex', alignItems: 'center', gap: S[2], flexWrap: 'wrap' }}>
        <span style={{ fontFamily: F.mono, fontSize: '10px', color: C.textMuted, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
          <AgentNameWithIcon agentId={creative.agent.agentId} size={11} color={C.textMuted} />
        </span>
        {creative.guardianApproved
          ? <span style={{ fontFamily: F.mono, fontSize: '10px', color: C.green, backgroundColor: 'rgba(16,185,129,0.1)', borderRadius: R.pill, padding: '1px 6px', display: 'inline-flex', alignItems: 'center', gap: 4 }}><IconShield color={C.green} width={11} height={11} />Guardian ✓</span>
          : <span style={{ fontFamily: F.mono, fontSize: '10px', color: C.amber, backgroundColor: 'rgba(251,191,36,0.1)', borderRadius: R.pill, padding: '1px 6px', display: 'inline-flex', alignItems: 'center', gap: 4 }}><IconShield color={C.amber} width={11} height={11} />Pending</span>
        }
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: S[2], flexWrap: 'wrap' }}>
        <button onClick={() => toast.info(`Editing creative: ${creative.headline}`)} style={{ ...btn.ghost, fontSize: '11px', padding: `2px ${S[2]}` }}>Edit</button>
        <button onClick={() => toast.success(`Creative duplicated`)} style={{ ...btn.ghost, fontSize: '11px', padding: `2px ${S[2]}` }}>Duplicate</button>
        {creative.status === 'active' && (
          <button onClick={() => toast.warning(`Creative paused`)} style={{ ...btn.ghost, fontSize: '11px', padding: `2px ${S[2]}`, color: C.amber }}>Pause</button>
        )}
        {creative.status !== 'ab_testing' && creative.status !== 'draft' && (
          <button onClick={() => toast.info(`A/B test setup for: ${creative.headline}`)} style={{ ...btn.ghost, fontSize: '11px', padding: `2px ${S[2]}`, color: '#60A5FA' }}>A/B Test</button>
        )}
      </div>
    </div>
  );
}

function PerformancePanel({ platform, optimizer, analyst, onRunOptimizer, toast }) {
  const meta = PLATFORM_META[platform];
  const CHANNEL_BARS = [
    { label: 'CTR', value: platform === 'Meta' ? 4.1 : platform === 'LinkedIn' ? 2.8 : 5.4, max: 8, color: C.primary },
    { label: 'Conv Rate', value: platform === 'Meta' ? 2.3 : platform === 'LinkedIn' ? 3.1 : 1.9, max: 6, color: C.secondary },
    { label: 'Quality Score', value: platform === 'Meta' ? 7 : platform === 'LinkedIn' ? 6 : 8, max: 10, color: C.green },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: S[4], position: 'sticky', top: S[4] }}>
      {/* Platform summary */}
      <div style={{
        backgroundColor: C.surface2,
        border: `1px solid ${C.border}`,
        borderRadius: R.card,
        padding: S[4],
      }}>
        <div style={{ fontFamily: F.display, fontSize: '13px', fontWeight: 700, color: C.textPrimary, marginBottom: S[3], display: 'flex', alignItems: 'center', gap: 8 }}>
          <PlatformGlyph platform={platform} />
          {platform} Performance
        </div>
        <div style={{ display: 'flex', gap: S[4], marginBottom: S[4] }}>
          <div>
            <div style={{ fontFamily: F.body, fontSize: '10px', color: C.textMuted }}>Total Spend</div>
            <div style={{ fontFamily: F.mono, fontSize: '18px', fontWeight: 700, color: C.textPrimary }}>${(meta.totalSpend / 1000).toFixed(1)}k</div>
          </div>
          <div>
            <div style={{ fontFamily: F.body, fontSize: '10px', color: C.textMuted }}>Leads</div>
            <div style={{ fontFamily: F.mono, fontSize: '18px', fontWeight: 700, color: C.primary }}>{meta.totalLeads}</div>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: S[2] }}>
          {CHANNEL_BARS.map(bar => (
            <div key={bar.label} style={{ display: 'flex', alignItems: 'center', gap: S[2] }}>
              <span style={{ fontFamily: F.body, fontSize: '10px', color: C.textMuted, width: '70px', flexShrink: 0 }}>{bar.label}</span>
              <div style={{ flex: 1, height: '6px', borderRadius: R.pill, backgroundColor: C.surface3, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${(bar.value / bar.max) * 100}%`, backgroundColor: bar.color, borderRadius: R.pill }} />
              </div>
              <span style={{ fontFamily: F.mono, fontSize: '10px', fontWeight: 700, color: bar.color, width: '28px', textAlign: 'right' }}>{bar.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Optimizer Insights */}
      <div style={{
        backgroundColor: C.surface2,
        border: `1px solid ${C.border}`,
        borderRadius: R.card,
        overflow: 'hidden',
      }}>
        <div style={{ padding: `${S[3]} ${S[4]}`, borderBottom: `1px solid ${C.border}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: S[2] }}>
            <IconSettings color={C.primary} w={16} />
            <span style={{ fontFamily: F.display, fontSize: '13px', fontWeight: 700, color: C.textPrimary }}>Optimizer Insights</span>
          </div>
        </div>
        <div style={{ padding: S[3], display: 'flex', flexDirection: 'column', gap: S[2] }}>
          {OPTIMIZER_INSIGHTS.map(insight => {
            const borderColor = insight.severity === 'warning' ? 'rgba(251,191,36,0.4)' : insight.severity === 'success' ? 'rgba(16,185,129,0.4)' : C.border;
            const textColor = insight.severity === 'warning' ? C.amber : insight.severity === 'success' ? C.green : C.textSecondary;
            return (
              <div key={insight.id} style={{
                backgroundColor: C.surface3,
                border: `1px solid ${borderColor}`,
                borderRadius: R.md,
                padding: S[3],
              }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: S[2], marginBottom: S[2] }}>
                  <span style={{ flexShrink: 0, lineHeight: 0, marginTop: 2 }}><InsightTypeIcon type={insight.type} color={textColor} /></span>
                  <span style={{ fontFamily: F.body, fontSize: '11px', color: textColor, lineHeight: 1.5, flex: 1 }}>{insight.text}</span>
                </div>
                <div style={{ display: 'flex', gap: S[2] }}>
                  <button
                    onClick={() => toast.success(`Applied: ${insight.action}`)}
                    style={{ ...btn.primary, fontSize: '10px', padding: `1px ${S[2]}` }}
                  >
                    {insight.action}
                  </button>
                  <button
                    onClick={() => toast.info('Insight dismissed')}
                    style={{ ...btn.ghost, fontSize: '10px', padding: `1px ${S[2]}`, color: C.textMuted }}
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            );
          })}
          <button
            onClick={onRunOptimizer}
            disabled={optimizer.isActive}
            style={{
              ...btn.secondary, fontSize: '12px', marginTop: S[1], justifyContent: 'center',
              opacity: optimizer.isActive ? 0.7 : 1,
              cursor: optimizer.isActive ? 'wait' : 'pointer',
            }}
          >
            {optimizer.isActive ? 'Running Optimizer…' : (<><IconSettings color={C.textPrimary} w={14} /> Run Optimizer</>)}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Main component ────────────────────────────────────────── */
export default function PaidAdsTab() {
  const toast = useToast();
  const copywriter = useAgent('copywriter');
  const optimizer = useAgent('optimizer');
  const analyst = useAgent('analyst');
  const [platform, setPlatform] = useState('Meta');

  const handleGenCreative = async () => {
    toast.info(`Copywriter generating ${platform} ad creative…`);
    await copywriter.activate('Generate ad creative with ad-creative skill', { platform });
    toast.success(`Ad creative generated — sent to Guardian for review`);
  };

  const handleRunOptimizer = async () => {
    toast.info('Optimizer setting up A/B test…');
    await optimizer.activate('Setup A/B test with ab-test-setup skill', { platform });
    toast.success('A/B test configured by Optimizer');
  };

  const handleRunAnalyst = async () => {
    toast.info('Analyst running performance analysis…');
    await analyst.activate('Analyze paid ad performance with analytics-tracking skill', { platform });
    toast.success('Performance analysis complete — 4 recommendations ready');
  };

  const creatives = AD_CREATIVES[platform] || [];

  return (
    <div style={{ padding: S[5], display: 'flex', flexDirection: 'column', gap: S[4] }}>

      {/* Agent Action Bar */}
      <AgentActionBar
        copywriter={copywriter}
        optimizer={optimizer}
        analyst={analyst}
        onGenCreative={handleGenCreative}
        onRunOptimizer={handleRunOptimizer}
        onRunAnalyst={handleRunAnalyst}
      />

      {/* Agent thinking */}
      {copywriter.isActive && <AgentThinking agentId="copywriter" task={`Generating ${platform} ad creative with ad-creative skill…`} />}
      {optimizer.isActive && <AgentThinking agentId="optimizer" task="Setting up A/B test with ab-test-setup skill…" />}
      {analyst.isActive && <AgentThinking agentId="analyst" task="Analyzing paid ads performance with analytics-tracking skill…" />}

      {/* Platform tabs */}
      <div style={{ display: 'flex', gap: S[2] }}>
        {PLATFORMS.map(p => {
          const meta = PLATFORM_META[p];
          return (
            <button
              key={p}
              onClick={() => setPlatform(p)}
              style={{
                fontFamily: F.body, fontSize: '13px', fontWeight: platform === p ? 700 : 500,
                color: platform === p ? C.textInverse : C.textSecondary,
                backgroundColor: platform === p ? meta.color : 'transparent',
                border: `1px solid ${platform === p ? meta.color : C.border}`,
                borderRadius: R.button,
                padding: `${S[2]} ${S[4]}`,
                cursor: 'pointer',
                transition: T.color,
                display: 'flex', alignItems: 'center', gap: S[2],
              }}
            >
              <PlatformGlyph platform={p} size={16} onPrimary={platform === p} />
              {p}
            </button>
          );
        })}
      </div>

      {/* Two-column: Creative Gallery | Performance */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: S[5], alignItems: 'start' }}>

        {/* Ad Creative Gallery */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: S[3] }}>
            <span style={{ fontFamily: F.display, fontSize: '15px', fontWeight: 700, color: C.textPrimary }}>
              {platform} Creatives
            </span>
            <button
              onClick={handleGenCreative}
              disabled={copywriter.isActive}
              style={{
                ...btn.primary, fontSize: '12px', padding: `${S[1]} ${S[3]}`,
                opacity: copywriter.isActive ? 0.7 : 1,
                cursor: copywriter.isActive ? 'wait' : 'pointer',
              }}
            >
              + Generate creative
            </button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: S[3] }}>
            {creatives.map(creative => (
              <CreativeCard key={creative.id} creative={creative} toast={toast} />
            ))}
          </div>
        </div>

        {/* Performance + Optimizations */}
        <PerformancePanel
          platform={platform}
          optimizer={optimizer}
          analyst={analyst}
          onRunOptimizer={handleRunOptimizer}
          toast={toast}
        />
      </div>
    </div>
  );
}
