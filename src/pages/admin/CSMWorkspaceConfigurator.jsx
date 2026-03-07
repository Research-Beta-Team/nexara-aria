import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useStore from '../../store/useStore';
import useToast from '../../hooks/useToast';
import { getProfileByClientId } from '../../data/clientWorkspaceProfiles';
import { workspaceTemplates, getTemplateById } from '../../data/workspaceTemplates';
import { C, F, R, S, cardStyle, btn, labelStyle, inputStyle } from '../../tokens';

const ALL_MODULES = [
  'dashboard', 'campaigns', 'outreach', 'content', 'analytics', 'inbox', 'pipeline', 'social',
  'research/icp', 'research/intent', 'research/competitive', 'abm', 'playbooks', 'forecast',
  'customer-success', 'meta-monitoring', 'escalations', 'knowledge', 'querymanager',
];

const AGENT_IDS = [
  'gtm_strategist', 'icp_researcher', 'copywriter', 'sdr', 'meta_ads', 'meta_monitor',
  'analytics', 'seo', 'competitor_intel', 'social_media', 'growth_marketer', 'bd_lead',
  'campaign_coordinator', 'content_strategist',
];

const PERSONA_OPTIONS = [
  { value: 'cro', label: 'CRO' },
  { value: 'growth_marketer', label: 'Growth Marketer' },
  { value: 'bd_lead', label: 'BD Lead' },
  { value: 'campaign_coordinator', label: 'Campaign Coordinator' },
];

export default function CSMWorkspaceConfigurator() {
  const { clientId } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const workspaceProfiles = useStore((s) => s.workspaceProfiles);
  const updateWorkspaceConfig = useStore((s) => s.updateWorkspaceConfig);
  const profile = workspaceProfiles[clientId] ?? getProfileByClientId(clientId);

  const [templateId, setTemplateId] = useState(profile?.templateBase ?? 'b2b-saas');
  const [visibleModules, setVisibleModules] = useState(() => new Set(profile?.layout?.visibleModules ?? []));
  const [activeAgents, setActiveAgents] = useState(() => new Set(profile?.agents?.active ?? []));
  const [primaryAgent, setPrimaryAgent] = useState(profile?.agents?.primaryAgent ?? 'gtm_strategist');
  const [persona, setPersona] = useState(profile?.aria?.persona ?? 'cro');
  const [greeting, setGreeting] = useState(profile?.aria?.greeting ?? '');
  const [escalationThreshold, setEscalationThreshold] = useState(profile?.workflows?.escalationThreshold ?? 3000);
  const [autoApproveBelow, setAutoApproveBelow] = useState(profile?.workflows?.autoApproveBelow ?? 500);

  const template = getTemplateById(templateId);
  const clientName = profile?.clientName ?? clientId;

  const applyTemplate = (id) => {
    const t = getTemplateById(id);
    if (!t) return;
    setTemplateId(id);
    setVisibleModules(new Set(t.layout?.visibleModules ?? []));
    setActiveAgents(new Set(t.agents?.active ?? []));
    setPrimaryAgent(t.agents?.primaryAgent ?? 'gtm_strategist');
    setPersona(t.aria?.persona ?? 'cro');
    setGreeting(t.aria?.greeting ?? '');
    setEscalationThreshold(t.workflows?.escalationThreshold ?? 3000);
    setAutoApproveBelow(t.workflows?.autoApproveBelow ?? 500);
  };

  const toggleModule = (mod) => {
    setVisibleModules((prev) => {
      const next = new Set(prev);
      if (next.has(mod)) next.delete(mod);
      else next.add(mod);
      return next;
    });
  };

  const toggleAgent = (agent) => {
    setActiveAgents((prev) => {
      const next = new Set(prev);
      if (next.has(agent)) next.delete(agent);
      else next.add(agent);
      return next;
    });
  };

  const summary = useMemo(() => {
    const t = getTemplateById(templateId);
    return {
      templateName: t?.name ?? templateId,
      moduleCount: visibleModules.size,
      activeAgentCount: activeAgents.size,
      primaryAgent,
      persona: PERSONA_OPTIONS.find((p) => p.value === persona)?.label ?? persona,
    };
  }, [templateId, visibleModules.size, activeAgents.size, primaryAgent, persona]);

  const handleSave = () => {
    const disabledAgents = AGENT_IDS.filter((a) => !activeAgents.has(a));
    updateWorkspaceConfig(clientId, {
      templateBase: templateId,
      layout: {
        ...profile?.layout,
        visibleModules: Array.from(visibleModules),
        sidebarOrder: Array.from(visibleModules),
        hiddenModules: ALL_MODULES.filter((m) => !visibleModules.has(m)),
      },
      agents: {
        active: Array.from(activeAgents),
        disabled: disabledAgents,
        primaryAgent,
      },
      aria: {
        ...profile?.aria,
        persona,
        greeting: greeting || template?.aria?.greeting,
      },
      workflows: {
        ...profile?.workflows,
        escalationThreshold: Number(escalationThreshold) || 0,
        autoApproveBelow: Number(autoApproveBelow) || 0,
      },
    });
    toast.success(`Config saved for ${clientName}`);
  };

  if (!clientId) {
    return (
      <div style={{ padding: S[6] }}>
        <p style={{ fontFamily: F.body, color: C.textSecondary }}>No client selected.</p>
        <button style={{ ...btn.secondary, marginTop: S[3] }} onClick={() => navigate('/admin/clients')}>Back to clients</button>
      </div>
    );
  }

  return (
    <div style={{ padding: S[6], display: 'flex', gap: S[6], maxWidth: '1200px', margin: '0 auto' }}>
      {/* Form — 65% */}
      <div style={{ flex: '0 0 65%', minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: S[5] }}>
          <div>
            <h1 style={{ fontFamily: F.display, fontSize: '22px', fontWeight: 800, color: C.textPrimary, margin: '0 0 4px' }}>
              Configure client
            </h1>
            <p style={{ fontFamily: F.body, fontSize: '14px', color: C.textSecondary }}>{clientName}</p>
          </div>
          <button style={{ ...btn.ghost, fontSize: '13px' }} onClick={() => navigate('/admin/clients')}>← Back to clients</button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: S[5] }}>
          {/* Template */}
          <div style={cardStyle}>
            <label style={labelStyle}>Template</label>
            <select
              style={{ ...inputStyle, maxWidth: '320px' }}
              value={templateId}
              onChange={(e) => applyTemplate(e.target.value)}
            >
              {workspaceTemplates.map((t) => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
          </div>

          {/* Modules — 4-col */}
          <div style={cardStyle}>
            <label style={labelStyle}>Visible modules</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: S[2] }}>
              {ALL_MODULES.map((mod) => (
                <label
                  key={mod}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: S[2],
                    fontFamily: F.body,
                    fontSize: '13px',
                    color: C.textPrimary,
                    cursor: 'pointer',
                  }}
                >
                  <input
                    type="checkbox"
                    checked={visibleModules.has(mod)}
                    onChange={() => toggleModule(mod)}
                    style={{ width: '16px', height: '16px' }}
                  />
                  {mod}
                </label>
              ))}
            </div>
          </div>

          {/* Agents */}
          <div style={cardStyle}>
            <label style={labelStyle}>Agents — Active / Primary</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: S[2] }}>
              {AGENT_IDS.map((agent) => (
                <div key={agent} style={{ display: 'flex', alignItems: 'center', gap: S[3] }}>
                  <input
                    type="checkbox"
                    checked={activeAgents.has(agent)}
                    onChange={() => toggleAgent(agent)}
                    style={{ width: '16px', height: '16px' }}
                  />
                  <input
                    type="radio"
                    name="primaryAgent"
                    checked={primaryAgent === agent}
                    onChange={() => setPrimaryAgent(agent)}
                    disabled={!activeAgents.has(agent)}
                    style={{ width: '16px', height: '16px' }}
                  />
                  <span style={{ fontFamily: F.body, fontSize: '13px', color: C.textPrimary }}>{agent}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ARIA */}
          <div style={cardStyle}>
            <label style={labelStyle}>Freya persona</label>
            <select
              style={{ ...inputStyle, maxWidth: '240px' }}
              value={persona}
              onChange={(e) => setPersona(e.target.value)}
            >
              {PERSONA_OPTIONS.map((p) => (
                <option key={p.value} value={p.value}>{p.label}</option>
              ))}
            </select>
            <label style={{ ...labelStyle, marginTop: S[3] }}>Greeting</label>
            <textarea
              style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }}
              value={greeting}
              onChange={(e) => setGreeting(e.target.value)}
              placeholder="e.g. Focus on pipeline and demos this week…"
            />
          </div>

          {/* Workflow */}
          <div style={cardStyle}>
            <label style={labelStyle}>Escalation threshold ($)</label>
            <input
              type="number"
              style={{ ...inputStyle, maxWidth: '160px' }}
              value={escalationThreshold}
              onChange={(e) => setEscalationThreshold(e.target.value)}
            />
            <label style={{ ...labelStyle, marginTop: S[3] }}>Auto-approve below ($)</label>
            <input
              type="number"
              style={{ ...inputStyle, maxWidth: '160px' }}
              value={autoApproveBelow}
              onChange={(e) => setAutoApproveBelow(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Summary — 35% sticky */}
      <div style={{ flex: '0 0 35%', position: 'sticky', top: S[4], height: 'fit-content' }}>
        <div style={{ ...cardStyle, padding: S[5] }}>
          <h3 style={{ fontFamily: F.display, fontSize: '14px', fontWeight: 700, color: C.textMuted, textTransform: 'uppercase', marginBottom: S[4] }}>
            Summary
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: S[3] }}>
            <div><span style={{ color: C.textMuted, fontSize: '12px' }}>Template </span><span style={{ fontWeight: 600 }}>{summary.templateName}</span></div>
            <div><span style={{ color: C.textMuted, fontSize: '12px' }}>Modules </span><span style={{ fontWeight: 600 }}>{summary.moduleCount}</span></div>
            <div><span style={{ color: C.textMuted, fontSize: '12px' }}>Active agents </span><span style={{ fontWeight: 600 }}>{summary.activeAgentCount}</span></div>
            <div><span style={{ color: C.textMuted, fontSize: '12px' }}>Primary agent </span><span style={{ fontWeight: 600 }}>{summary.primaryAgent}</span></div>
            <div><span style={{ color: C.textMuted, fontSize: '12px' }}>Freya persona </span><span style={{ fontWeight: 600 }}>{summary.persona}</span></div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: S[2], marginTop: S[5] }}>
            <button style={{ ...btn.primary, width: '100%' }} onClick={handleSave}>
              Save & Apply
            </button>
            <button
              style={{ ...btn.secondary, width: '100%' }}
              onClick={() => navigate(`/admin/clients/${clientId}/preview`)}
            >
              Preview as Client
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
