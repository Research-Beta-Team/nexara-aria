import { useNavigate } from 'react-router-dom';
import { getAllClientIds, getProfileByClientId } from '../../data/clientWorkspaceProfiles';
import { getTemplateById } from '../../data/workspaceTemplates';
import { C, F, R, S, cardStyle, btn } from '../../tokens';

export default function ClientWorkspaces() {
  const navigate = useNavigate();
  const clientIds = getAllClientIds();

  return (
    <div style={{ padding: S[6], maxWidth: '1000px', margin: '0 auto' }}>
      <h1 style={{ fontFamily: F.display, fontSize: '22px', fontWeight: 800, color: C.textPrimary, margin: '0 0 8px' }}>
        Client Workspaces
      </h1>
      <p style={{ fontFamily: F.body, fontSize: '14px', color: C.textSecondary, marginBottom: S[6] }}>
        Configure template, modules, agents, and ARIA per client.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: S[3] }}>
        {clientIds.map((clientId) => {
          const profile = getProfileByClientId(clientId);
          const template = profile ? getTemplateById(profile.templateBase) : null;
          const templateName = template?.name ?? profile?.templateBase ?? '—';

          return (
            <div
              key={clientId}
              style={{
                ...cardStyle,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: S[4],
                padding: S[4],
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: S[4] }}>
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: R.full,
                    backgroundColor: C.surface3,
                    color: C.primary,
                    fontFamily: F.display,
                    fontSize: '16px',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {(profile?.clientName ?? clientId).charAt(0).toUpperCase()}
                </div>
                <div>
                  <div style={{ fontFamily: F.display, fontSize: '15px', fontWeight: 700, color: C.textPrimary }}>
                    {profile?.clientName ?? clientId}
                  </div>
                  <div style={{ fontFamily: F.body, fontSize: '12px', color: C.textSecondary }}>
                    Template: {templateName} · Configured by {profile?.configuredBy ?? '—'} · {profile?.status ?? 'active'}
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: S[2] }}>
                <button
                  style={{ ...btn.secondary, fontSize: '13px' }}
                  onClick={() => navigate(`/admin/clients/${clientId}/preview`)}
                >
                  Preview
                </button>
                <button
                  style={{ ...btn.primary, fontSize: '13px' }}
                  onClick={() => navigate(`/admin/clients/${clientId}/workspace`)}
                >
                  Configure
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
