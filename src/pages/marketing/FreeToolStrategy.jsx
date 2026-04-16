/**
 * Free Tool Strategy — marketing page.
 * Generate tool ideas with build-vs-buy analysis. Agent-powered via Outreach agent.
 */
import { useState } from 'react';
import useToast from '../../hooks/useToast';
import { useAgent } from '../../hooks/useAgent';
import AgentThinking from '../../components/agents/AgentThinking';
import AgentResultPanel from '../../components/agents/AgentResultPanel';
import { C, F, R, S, btn, badge, shadows } from '../../tokens';

const MOCK_TOOL_IDEAS = [
  {
    id: 'ft-1',
    name: 'Campaign ROI Calculator',
    category: 'Calculator',
    buildVsBuy: 'build',
    effort: 'Medium',
    leadCaptureMethod: 'Email gate after 3 uses',
    estimatedLeads: '120/mo',
    status: 'live',
    description: 'Interactive calculator that helps prospects estimate campaign ROI based on their industry, budget, and target metrics.',
  },
  {
    id: 'ft-2',
    name: 'ICP Scoring Template',
    category: 'Template',
    buildVsBuy: 'build',
    effort: 'Low',
    leadCaptureMethod: 'Download gate',
    estimatedLeads: '85/mo',
    status: 'live',
    description: 'Downloadable spreadsheet template with pre-built ICP scoring criteria and formulas for B2B companies.',
  },
  {
    id: 'ft-3',
    name: 'Email Subject Line Analyzer',
    category: 'Analyzer',
    buildVsBuy: 'build',
    effort: 'High',
    leadCaptureMethod: 'Freemium with email signup',
    estimatedLeads: '200/mo',
    status: 'development',
    description: 'AI-powered tool that analyzes email subject lines for open rate potential, spam triggers, and personalization opportunities.',
  },
  {
    id: 'ft-4',
    name: 'Competitive Positioning Mapper',
    category: 'Assessment',
    buildVsBuy: 'buy',
    effort: 'Low',
    leadCaptureMethod: 'Results gated',
    estimatedLeads: '60/mo',
    status: 'planned',
    description: 'Interactive assessment that maps a company against competitors on key positioning dimensions with visual output.',
  },
];

const STATUS_CFG = {
  live: { bg: C.greenDim, color: C.green, label: 'Live' },
  development: { bg: C.amberDim, color: C.amber, label: 'In Development' },
  planned: { bg: 'rgba(59,130,246,0.15)', color: '#3B82F6', label: 'Planned' },
};

const EFFORT_CFG = {
  Low: { color: C.green },
  Medium: { color: C.amber },
  High: { color: C.red },
};

function ToolCard({ tool }) {
  const toast = useToast();
  const statusCfg = STATUS_CFG[tool.status] || STATUS_CFG.planned;
  const effortCfg = EFFORT_CFG[tool.effort] || EFFORT_CFG.Medium;

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
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: S[2] }}>
        <span style={{
          padding: '2px 8px', backgroundColor: statusCfg.bg, color: statusCfg.color,
          borderRadius: R.pill, fontFamily: F.mono, fontSize: '10px', fontWeight: 700,
        }}>
          {statusCfg.label}
        </span>
        <div style={{ display: 'flex', gap: S[2] }}>
          <span style={{
            padding: '2px 8px', backgroundColor: C.surface3, color: C.textSecondary,
            borderRadius: R.pill, fontFamily: F.mono, fontSize: '10px', fontWeight: 700,
          }}>
            {tool.category}
          </span>
          <span style={{
            padding: '2px 8px', backgroundColor: tool.buildVsBuy === 'build' ? C.primaryGlow : C.amberDim,
            color: tool.buildVsBuy === 'build' ? C.primary : C.amber,
            borderRadius: R.pill, fontFamily: F.mono, fontSize: '10px', fontWeight: 700,
          }}>
            {tool.buildVsBuy === 'build' ? 'Build' : 'Buy'}
          </span>
        </div>
      </div>

      <div>
        <h3 style={{ fontFamily: F.display, fontSize: '15px', fontWeight: 700, color: C.textPrimary, margin: `0 0 ${S[1]} 0` }}>
          {tool.name}
        </h3>
      </div>

      <p style={{ fontFamily: F.body, fontSize: '12px', color: C.textSecondary, lineHeight: 1.5, margin: 0 }}>
        {tool.description}
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: S[3] }}>
        <div>
          <div style={{ fontFamily: F.body, fontSize: '10px', color: C.textMuted, textTransform: 'uppercase', marginBottom: '2px' }}>Effort</div>
          <div style={{ fontFamily: F.mono, fontSize: '13px', fontWeight: 700, color: effortCfg.color }}>{tool.effort}</div>
        </div>
        <div>
          <div style={{ fontFamily: F.body, fontSize: '10px', color: C.textMuted, textTransform: 'uppercase', marginBottom: '2px' }}>Lead Capture</div>
          <div style={{ fontFamily: F.body, fontSize: '11px', color: C.textSecondary }}>{tool.leadCaptureMethod}</div>
        </div>
        <div>
          <div style={{ fontFamily: F.body, fontSize: '10px', color: C.textMuted, textTransform: 'uppercase', marginBottom: '2px' }}>Est. Leads</div>
          <div style={{ fontFamily: F.mono, fontSize: '13px', fontWeight: 700, color: C.primary }}>{tool.estimatedLeads}</div>
        </div>
      </div>

      <button
        type="button"
        style={{ ...btn.ghost, fontSize: '12px', alignSelf: 'flex-start' }}
        onClick={() => toast.info(`Viewing ${tool.name} details`)}
      >
        View details
      </button>
    </div>
  );
}

export default function FreeToolStrategy() {
  const toast = useToast();
  const outreachAgent = useAgent('outreach');
  const [agentResult, setAgentResult] = useState(null);

  const handleGenerateIdeas = async () => {
    toast.info('Outreach agent generating free tool ideas...');
    const result = await outreachAgent.activate('free-tool-strategy', {
      task: 'Generate free tool ideas with build-vs-buy analysis and lead capture strategy for healthcare NGO market',
      existingTools: MOCK_TOOL_IDEAS.map(t => t.name),
      targetMarket: 'Healthcare NGOs and humanitarian organizations',
    });
    setAgentResult(result);
    toast.success('Tool ideas generated.');
  };

  return (
    <div style={{ minHeight: '100%', backgroundColor: C.bg, padding: S[6] }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: S[4], marginBottom: S[6] }}>
        <div>
          <h1 style={{ fontFamily: F.display, fontSize: '22px', fontWeight: 700, color: C.textPrimary, margin: `0 0 ${S[2]} 0` }}>
            Free Tool Strategy
          </h1>
          <p style={{ fontFamily: F.body, fontSize: '13px', color: C.textSecondary, margin: 0 }}>
            Plan and manage free tools that drive lead generation. AI-powered ideation with build-vs-buy analysis.
          </p>
        </div>
        <button
          type="button"
          style={{ ...btn.primary, fontSize: '13px', display: 'inline-flex', alignItems: 'center', gap: 6 }}
          onClick={handleGenerateIdeas}
          disabled={outreachAgent.isActive}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 1v12M1 7h12" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>
          Generate tool ideas
        </button>
      </div>

      {/* Summary stats */}
      <div style={{
        display: 'flex', gap: S[4], marginBottom: S[6], flexWrap: 'wrap',
      }}>
        {[
          { label: 'Live Tools', value: MOCK_TOOL_IDEAS.filter(t => t.status === 'live').length, color: C.green },
          { label: 'In Development', value: MOCK_TOOL_IDEAS.filter(t => t.status === 'development').length, color: C.amber },
          { label: 'Planned', value: MOCK_TOOL_IDEAS.filter(t => t.status === 'planned').length, color: '#3B82F6' },
          { label: 'Est. Monthly Leads', value: '465', color: C.primary },
        ].map(stat => (
          <div key={stat.label} style={{
            backgroundColor: C.surface, border: `1px solid ${C.border}`,
            borderRadius: R.card, padding: `${S[3]} ${S[5]}`, boxShadow: shadows.card,
            minWidth: 140,
          }}>
            <div style={{ fontFamily: F.mono, fontSize: '22px', fontWeight: 700, color: stat.color }}>{stat.value}</div>
            <div style={{ fontFamily: F.body, fontSize: '11px', color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* Agent thinking / result */}
      {outreachAgent.isActive && (
        <div style={{ marginBottom: S[5] }}>
          <AgentThinking agentId="outreach" task="Generating free tool ideas with build-vs-buy analysis..." />
        </div>
      )}
      {agentResult && !outreachAgent.isActive && (
        <div style={{ marginBottom: S[5] }}>
          <AgentResultPanel result={agentResult} />
        </div>
      )}

      {/* Tool ideas grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
        gap: S[5],
      }}>
        {MOCK_TOOL_IDEAS.map(tool => (
          <ToolCard key={tool.id} tool={tool} />
        ))}
      </div>
    </div>
  );
}
