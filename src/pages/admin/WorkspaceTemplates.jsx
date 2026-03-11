import { useState } from 'react';
import useToast from '../../hooks/useToast';
import useStore from '../../store/useStore';
import { workspaceTemplates } from '../../data/workspaceTemplates';
import { getAllClientIds, getProfileByClientId } from '../../data/clientWorkspaceProfiles';
import { C, F, R, S, Z, cardStyle, btn } from '../../tokens';
import { TemplateIcon } from '../../components/ui/Icons';

const PERSONA_LABELS = {
  cro: 'CRO',
  growth_marketer: 'Growth Marketer',
  bd_lead: 'BD Lead',
  campaign_coordinator: 'Campaign Coordinator',
};

function TemplateCard({ template, onPreview, onAssign }) {
  const modules = template.layout?.visibleModules ?? [];
  const agents = template.agents?.active ?? [];
  const kpis = template.kpis;
  const persona = template.freya?.persona;
  const personaLabel = persona ? PERSONA_LABELS[persona] ?? persona : '—';

  return (
    <div
      style={{
        ...cardStyle,
        display: 'flex',
        flexDirection: 'column',
        gap: S[4],
        padding: S[5],
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: S[3] }}>
        <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 28, height: 28, color: template.color }}>
          <TemplateIcon iconKey={template.iconKey} color={template.color} width={28} height={28} />
        </span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <h3 style={{ fontFamily: F.display, fontSize: '16px', fontWeight: 700, color: C.textPrimary, margin: '0 0 4px' }}>
            {template.name}
          </h3>
          <p style={{ fontFamily: F.body, fontSize: '13px', color: C.textSecondary, lineHeight: 1.45, margin: 0 }}>
            {template.description}
          </p>
        </div>
      </div>

      <div>
        <div style={{ fontFamily: F.mono, fontSize: '10px', fontWeight: 700, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: S[2] }}>
          Modules
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
          {modules.slice(0, 8).map((m) => (
            <span
              key={m}
              style={{
                fontFamily: F.body,
                fontSize: '11px',
                color: C.textSecondary,
                backgroundColor: C.surface2,
                border: `1px solid ${C.border}`,
                borderRadius: R.pill,
                padding: '2px 8px',
              }}
            >
              {m}
            </span>
          ))}
          {modules.length > 8 && (
            <span style={{ fontFamily: F.body, fontSize: '11px', color: C.textMuted }}>+{modules.length - 8}</span>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', gap: S[4], flexWrap: 'wrap' }}>
        <div>
          <span style={{ fontFamily: F.mono, fontSize: '10px', color: C.textMuted, textTransform: 'uppercase' }}>Agents </span>
          <span style={{ fontFamily: F.mono, fontSize: '13px', fontWeight: 700, color: C.textPrimary }}>{agents.length}</span>
        </div>
        <div>
          <span style={{ fontFamily: F.mono, fontSize: '10px', color: C.textMuted, textTransform: 'uppercase' }}>KPIs </span>
          <span style={{ fontFamily: F.mono, fontSize: '13px', fontWeight: 700, color: C.textPrimary }}>
            {kpis?.dashboardKPIOrder?.length ?? 0}
          </span>
        </div>
        <div>
          <span style={{ fontFamily: F.mono, fontSize: '10px', color: C.textMuted, textTransform: 'uppercase' }}>Persona </span>
          <span style={{ fontFamily: F.body, fontSize: '12px', fontWeight: 600, color: C.textPrimary }}>{personaLabel}</span>
        </div>
      </div>

      <div style={{ display: 'flex', gap: S[2], marginTop: 'auto' }}>
        <button style={{ ...btn.secondary, flex: 1, fontSize: '12px' }} onClick={() => onPreview(template)}>
          Preview Full Template
        </button>
        <button style={{ ...btn.primary, flex: 1, fontSize: '12px' }} onClick={() => onAssign(template)}>
          Assign to Client
        </button>
      </div>
    </div>
  );
}

function PreviewModal({ template, onClose }) {
  if (!template) return null;
  const layout = template.layout ?? {};
  const modules = layout.visibleModules ?? [];
  const agents = template.agents ?? {};
  const kpis = template.kpis ?? {};
  const freya = template.freya ?? {};
  const workflows = template.workflows ?? {};

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: C.overlayHeavy,
        zIndex: Z.modal,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: S[4],
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: C.surface,
          border: `1px solid ${C.border}`,
          borderRadius: R.card,
          maxWidth: '560px',
          width: '100%',
          maxHeight: '90vh',
          overflow: 'auto',
          padding: S[6],
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: S[5] }}>
          <h2 style={{ fontFamily: F.display, fontSize: '18px', fontWeight: 700, color: C.textPrimary, margin: 0, display: 'flex', alignItems: 'center', gap: S[2] }}>
            <span style={{ display: 'flex', color: template.color }}>
              <TemplateIcon iconKey={template.iconKey} color={template.color} width={24} height={24} />
            </span>
            {template.name}
          </h2>
          <button style={{ ...btn.icon, padding: S[2] }} onClick={onClose} aria-label="Close">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M2 2l12 12M14 2L2 14" />
            </svg>
          </button>
        </div>
        <p style={{ fontFamily: F.body, fontSize: '13px', color: C.textSecondary, marginBottom: S[4] }}>{template.description}</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: S[4] }}>
          <section>
            <h4 style={{ fontFamily: F.mono, fontSize: '11px', fontWeight: 700, color: C.textMuted, textTransform: 'uppercase', marginBottom: S[2] }}>Visible modules</h4>
            <div style={{ fontFamily: F.body, fontSize: '13px', color: C.textPrimary }}>{modules.join(', ')}</div>
          </section>
          <section>
            <h4 style={{ fontFamily: F.mono, fontSize: '11px', fontWeight: 700, color: C.textMuted, textTransform: 'uppercase', marginBottom: S[2] }}>Agents</h4>
            <div style={{ fontFamily: F.body, fontSize: '13px', color: C.textPrimary }}>
              Active: {(agents.active ?? []).join(', ')}. Primary: {agents.primaryAgent ?? '—'}
            </div>
          </section>
          <section>
            <h4 style={{ fontFamily: F.mono, fontSize: '11px', fontWeight: 700, color: C.textMuted, textTransform: 'uppercase', marginBottom: S[2] }}>KPIs</h4>
            <div style={{ fontFamily: F.body, fontSize: '13px', color: C.textPrimary }}>
              {(kpis.dashboardKPIOrder ?? []).map((id) => kpis.primary?.metric === id ? `${kpis.primary.label} (${kpis.primary.target}${kpis.primary.unit})` : kpis.secondary?.metric === id ? `${kpis.secondary.label}` : kpis.tertiary?.metric === id ? `${kpis.tertiary.label}` : id).join(' · ')}
            </div>
          </section>
          <section>
            <h4 style={{ fontFamily: F.mono, fontSize: '11px', fontWeight: 700, color: C.textMuted, textTransform: 'uppercase', marginBottom: S[2] }}>Freya</h4>
            <div style={{ fontFamily: F.body, fontSize: '13px', color: C.textPrimary }}>Persona: {freya.persona ?? '—'}. Language: {freya.language ?? 'en'}</div>
            <div style={{ fontFamily: F.body, fontSize: '12px', color: C.textSecondary, marginTop: S[1] }}>{freya.greeting}</div>
          </section>
          <section>
            <h4 style={{ fontFamily: F.mono, fontSize: '11px', fontWeight: 700, color: C.textMuted, textTransform: 'uppercase', marginBottom: S[2] }}>Workflow</h4>
            <div style={{ fontFamily: F.body, fontSize: '13px', color: C.textPrimary }}>
              Approval: {(workflows.approvalChain ?? []).join(' → ')}. Escalation &gt; ${(workflows.escalationThreshold ?? 0).toLocaleString()}. Auto-approve below ${(workflows.autoApproveBelow ?? 0).toLocaleString()}.
            </div>
          </section>
        </div>
        <div style={{ marginTop: S[5] }}>
          <button style={{ ...btn.primary, width: '100%' }} onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}

function AssignModal({ template, onClose, onSelect }) {
  const clientIds = getAllClientIds();
  const toast = useToast();

  const handleSelect = (clientId) => {
    onSelect(clientId, template);
    onClose();
    toast.success(`"${template.name}" assigned to ${getProfileByClientId(clientId)?.clientName ?? clientId}`);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: C.overlayHeavy,
        zIndex: Z.modal,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: S[4],
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: C.surface,
          border: `1px solid ${C.border}`,
          borderRadius: R.card,
          maxWidth: '400px',
          width: '100%',
          padding: S[5],
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h3 style={{ fontFamily: F.display, fontSize: '16px', fontWeight: 700, color: C.textPrimary, margin: '0 0 8px' }}>
          Assign to client
        </h3>
        <p style={{ fontFamily: F.body, fontSize: '13px', color: C.textSecondary, marginBottom: S[4] }}>
          Choose a client to apply template “{template?.name}”.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: S[2] }}>
          {clientIds.map((id) => {
            const profile = getProfileByClientId(id);
            return (
              <button
                key={id}
                style={{
                  ...btn.secondary,
                  justifyContent: 'flex-start',
                  textAlign: 'left',
                  padding: S[3],
                }}
                onClick={() => handleSelect(id)}
              >
                {profile?.clientName ?? id} {profile?.templateBase ? `(${profile.templateBase})` : ''}
              </button>
            );
          })}
        </div>
        <button style={{ ...btn.ghost, marginTop: S[3], width: '100%' }} onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
}

export default function WorkspaceTemplates() {
  const toast = useToast();
  const [previewTemplate, setPreviewTemplate] = useState(null);
  const [assignTemplate, setAssignTemplate] = useState(null);

  const handleAssign = (clientId, template) => {
    useStore.getState().updateWorkspaceConfig(clientId, {
      templateBase: template.id,
      layout: template.layout,
      agents: template.agents,
      freya: template.freya,
      workflows: template.workflows,
      kpis: template.kpis,
    });
  };

  return (
    <div style={{ padding: S[6], maxWidth: '1400px', margin: '0 auto' }}>
      <h1 style={{ fontFamily: F.display, fontSize: '22px', fontWeight: 800, color: C.textPrimary, margin: '0 0 8px' }}>
        Templates
      </h1>
      <p style={{ fontFamily: F.body, fontSize: '14px', color: C.textSecondary, marginBottom: S[6] }}>
        Industry starting points. Preview a template or assign it to a client.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: S[5] }}>
        {workspaceTemplates.map((t) => (
          <TemplateCard
            key={t.id}
            template={t}
            onPreview={setPreviewTemplate}
            onAssign={() => setAssignTemplate(t)}
          />
        ))}
      </div>

      {previewTemplate && (
        <PreviewModal template={previewTemplate} onClose={() => setPreviewTemplate(null)} />
      )}
      {assignTemplate && (
        <AssignModal
          template={assignTemplate}
          onClose={() => setAssignTemplate(null)}
          onSelect={handleAssign}
        />
      )}
    </div>
  );
}
