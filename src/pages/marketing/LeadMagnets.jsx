/**
 * Lead Magnets — marketing page.
 * Grid of lead magnet types by buyer stage. Agent-powered creation via Copywriter agent.
 */
import { useState } from 'react';
import useToast from '../../hooks/useToast';
import { useAgent } from '../../hooks/useAgent';
import AgentThinking from '../../components/agents/AgentThinking';
import AgentResultPanel from '../../components/agents/AgentResultPanel';
import { C, F, R, S, btn, badge, shadows } from '../../tokens';

const BUYER_STAGES = ['Awareness', 'Consideration', 'Decision'];

const MOCK_LEAD_MAGNETS = [
  {
    id: 'lm-1',
    title: 'Healthcare GTM Benchmark Report',
    type: 'Report',
    stage: 'Awareness',
    downloads: 1243,
    conversionRate: 18.5,
    status: 'active',
    description: 'Industry benchmarks for healthcare marketing KPIs, channel performance, and budget allocation.',
  },
  {
    id: 'lm-2',
    title: 'ROI Calculator for NGO Campaigns',
    type: 'Interactive Tool',
    stage: 'Consideration',
    downloads: 876,
    conversionRate: 24.2,
    status: 'active',
    description: 'Interactive calculator showing projected ROI based on campaign budget, channels, and target audience.',
  },
  {
    id: 'lm-3',
    title: 'Donor Engagement Playbook',
    type: 'eBook',
    stage: 'Awareness',
    downloads: 2105,
    conversionRate: 15.8,
    status: 'active',
    description: 'Comprehensive guide to multi-channel donor engagement strategies for humanitarian organizations.',
  },
  {
    id: 'lm-4',
    title: 'Campaign Comparison Checklist',
    type: 'Checklist',
    stage: 'Decision',
    downloads: 534,
    conversionRate: 31.7,
    status: 'active',
    description: 'Side-by-side evaluation framework for comparing GTM platform capabilities and pricing.',
  },
  {
    id: 'lm-5',
    title: 'ABM Strategy Webinar Series',
    type: 'Webinar',
    stage: 'Consideration',
    downloads: 1567,
    conversionRate: 12.3,
    status: 'draft',
    description: 'Three-part webinar series covering account-based marketing strategy, execution, and measurement.',
  },
  {
    id: 'lm-6',
    title: 'Free Campaign Audit Template',
    type: 'Template',
    stage: 'Decision',
    downloads: 989,
    conversionRate: 28.4,
    status: 'active',
    description: 'Self-service audit template that prospects can use to evaluate their current campaign performance.',
  },
];

const STAGE_COLORS = {
  Awareness: { bg: 'rgba(59,130,246,0.15)', color: '#3B82F6', border: 'rgba(59,130,246,0.3)' },
  Consideration: { bg: C.amberDim, color: C.amber, border: 'rgba(251,191,36,0.3)' },
  Decision: { bg: C.greenDim, color: C.green, border: 'rgba(16,185,129,0.3)' },
};

function MagnetCard({ magnet }) {
  const toast = useToast();
  const stageCfg = STAGE_COLORS[magnet.stage] || STAGE_COLORS.Awareness;

  return (
    <div style={{
      backgroundColor: C.surface,
      border: `1px solid ${C.border}`,
      borderRadius: R.card,
      padding: S[5],
      display: 'flex',
      flexDirection: 'column',
      gap: S[3],
      boxShadow: shadows.card,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{
          padding: '2px 8px', backgroundColor: stageCfg.bg, color: stageCfg.color,
          border: `1px solid ${stageCfg.border}`, borderRadius: R.pill,
          fontFamily: F.mono, fontSize: '10px', fontWeight: 700,
        }}>
          {magnet.stage}
        </span>
        <span style={{
          padding: '2px 8px', backgroundColor: magnet.status === 'active' ? C.greenDim : C.amberDim,
          color: magnet.status === 'active' ? C.green : C.amber,
          borderRadius: R.pill, fontFamily: F.mono, fontSize: '10px', fontWeight: 700,
        }}>
          {magnet.status}
        </span>
      </div>

      <div>
        <h3 style={{ fontFamily: F.display, fontSize: '15px', fontWeight: 700, color: C.textPrimary, margin: `0 0 ${S[1]} 0` }}>
          {magnet.title}
        </h3>
        <span style={{ fontFamily: F.mono, fontSize: '11px', color: C.textMuted }}>{magnet.type}</span>
      </div>

      <p style={{ fontFamily: F.body, fontSize: '12px', color: C.textSecondary, lineHeight: 1.5, margin: 0 }}>
        {magnet.description}
      </p>

      <div style={{ display: 'flex', gap: S[4] }}>
        <div>
          <div style={{ fontFamily: F.mono, fontSize: '18px', fontWeight: 700, color: C.textPrimary }}>{magnet.downloads.toLocaleString()}</div>
          <div style={{ fontFamily: F.body, fontSize: '10px', color: C.textMuted, textTransform: 'uppercase' }}>Downloads</div>
        </div>
        <div>
          <div style={{ fontFamily: F.mono, fontSize: '18px', fontWeight: 700, color: C.primary }}>{magnet.conversionRate}%</div>
          <div style={{ fontFamily: F.body, fontSize: '10px', color: C.textMuted, textTransform: 'uppercase' }}>Conversion</div>
        </div>
      </div>

      <button
        type="button"
        style={{ ...btn.ghost, fontSize: '12px', alignSelf: 'flex-start' }}
        onClick={() => toast.info(`Viewing ${magnet.title}`)}
      >
        View details
      </button>
    </div>
  );
}

export default function LeadMagnets() {
  const toast = useToast();
  const copywriter = useAgent('copywriter');
  const [agentResult, setAgentResult] = useState(null);
  const [activeStageFilter, setActiveStageFilter] = useState('All');

  const handleCreateLeadMagnet = async () => {
    toast.info('Copywriter agent creating lead magnet specification...');
    const result = await copywriter.activate('lead-magnets', {
      task: 'Create a lead magnet specification with landing page outline for healthcare NGO audience',
      targetAudience: 'Healthcare NGO marketing directors',
      buyerStage: activeStageFilter !== 'All' ? activeStageFilter : 'Consideration',
    });
    setAgentResult(result);
    toast.success('Lead magnet specification ready.');
  };

  const filtered = activeStageFilter === 'All'
    ? MOCK_LEAD_MAGNETS
    : MOCK_LEAD_MAGNETS.filter(m => m.stage === activeStageFilter);

  return (
    <div style={{ minHeight: '100%', backgroundColor: C.bg, padding: S[6] }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: S[4], marginBottom: S[6] }}>
        <div>
          <h1 style={{ fontFamily: F.display, fontSize: '22px', fontWeight: 700, color: C.textPrimary, margin: `0 0 ${S[2]} 0` }}>
            Lead Magnets
          </h1>
          <p style={{ fontFamily: F.body, fontSize: '13px', color: C.textSecondary, margin: 0 }}>
            Manage lead magnets by buyer stage. Create new magnets with AI-powered content generation.
          </p>
        </div>
        <button
          type="button"
          style={{ ...btn.primary, fontSize: '13px', display: 'inline-flex', alignItems: 'center', gap: 6 }}
          onClick={handleCreateLeadMagnet}
          disabled={copywriter.isActive}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 1v12M1 7h12" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>
          Create lead magnet
        </button>
      </div>

      {/* Stage filter tabs */}
      <div style={{ display: 'flex', gap: S[2], marginBottom: S[5] }}>
        {['All', ...BUYER_STAGES].map(stage => (
          <button
            key={stage}
            type="button"
            onClick={() => setActiveStageFilter(stage)}
            style={{
              padding: `${S[2]} ${S[4]}`, fontFamily: F.body, fontSize: '13px', fontWeight: 600,
              color: activeStageFilter === stage ? C.primary : C.textSecondary,
              backgroundColor: activeStageFilter === stage ? C.primaryGlow : 'transparent',
              border: `1px solid ${activeStageFilter === stage ? C.primary : C.border}`,
              borderRadius: R.button, cursor: 'pointer',
            }}
          >
            {stage}
          </button>
        ))}
      </div>

      {/* Agent thinking / result */}
      {copywriter.isActive && (
        <div style={{ marginBottom: S[5] }}>
          <AgentThinking agentId="copywriter" task="Creating lead magnet specification and landing page outline..." />
        </div>
      )}
      {agentResult && !copywriter.isActive && (
        <div style={{ marginBottom: S[5] }}>
          <AgentResultPanel result={agentResult} />
        </div>
      )}

      {/* Lead magnet grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
        gap: S[5],
      }}>
        {filtered.map(magnet => (
          <MagnetCard key={magnet.id} magnet={magnet} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div style={{ padding: S[8], textAlign: 'center', fontFamily: F.body, fontSize: '14px', color: C.textMuted }}>
          No lead magnets for this stage. Click "Create lead magnet" to get started.
        </div>
      )}
    </div>
  );
}
