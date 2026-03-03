import { C, F, R, S, btn } from '../../tokens';
import { TEAMS, RELATIONSHIP_MANAGERS, getTeamById, getRelationshipManagerById } from '../../data/crm';

export default function ClientTable({ clients, onAssignTeam, onAssignRm }) {
  if (!clients?.length) {
    return (
      <div style={{ padding: S[8], textAlign: 'center', fontFamily: F.body, fontSize: '14px', color: C.textMuted }}>
        No clients yet. Import from CSV or add individually.
      </div>
    );
  }

  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: F.body, fontSize: '13px' }}>
        <thead>
          <tr style={{ borderBottom: `2px solid ${C.border}`, textAlign: 'left' }}>
            <th style={{ padding: `${S[3]} ${S[4]}`, color: C.textMuted, fontWeight: 600 }}>Name</th>
            <th style={{ padding: `${S[3]} ${S[4]}`, color: C.textMuted, fontWeight: 600 }}>Company</th>
            <th style={{ padding: `${S[3]} ${S[4]}`, color: C.textMuted, fontWeight: 600 }}>Email</th>
            <th style={{ padding: `${S[3]} ${S[4]}`, color: C.textMuted, fontWeight: 600 }}>Team</th>
            <th style={{ padding: `${S[3]} ${S[4]}`, color: C.textMuted, fontWeight: 600 }}>Relationship manager</th>
          </tr>
        </thead>
        <tbody>
          {clients.map((client) => {
            const team = getTeamById(client.teamId);
            const rm = getRelationshipManagerById(client.relationshipManagerId);
            return (
              <tr key={client.id} style={{ borderBottom: `1px solid ${C.border}`, backgroundColor: C.surface }}>
                <td style={{ padding: `${S[3]} ${S[4]}`, color: C.textPrimary, fontWeight: 500 }}>{client.name}</td>
                <td style={{ padding: `${S[3]} ${S[4]}`, color: C.textSecondary }}>{client.company}</td>
                <td style={{ padding: `${S[3]} ${S[4]}`, color: C.textSecondary }}>{client.email}</td>
                <td style={{ padding: `${S[3]} ${S[4]}` }}>
                  <select
                    value={client.teamId ?? ''}
                    onChange={(e) => onAssignTeam(client.id, e.target.value || null)}
                    style={{
                      padding: `${S[1]} ${S[2]}`,
                      border: `1px solid ${C.border}`,
                      borderRadius: R.input,
                      backgroundColor: C.surface2,
                      color: C.textPrimary,
                      fontSize: '12px',
                      minWidth: 120,
                    }}
                  >
                    <option value="">—</option>
                    {TEAMS.map((t) => (
                      <option key={t.id} value={t.id}>{t.name}</option>
                    ))}
                  </select>
                </td>
                <td style={{ padding: `${S[3]} ${S[4]}` }}>
                  <select
                    value={client.relationshipManagerId ?? ''}
                    onChange={(e) => onAssignRm(client.id, e.target.value || null)}
                    style={{
                      padding: `${S[1]} ${S[2]}`,
                      border: `1px solid ${C.border}`,
                      borderRadius: R.input,
                      backgroundColor: C.surface2,
                      color: C.textPrimary,
                      fontSize: '12px',
                      minWidth: 120,
                    }}
                  >
                    <option value="">—</option>
                    {RELATIONSHIP_MANAGERS.map((r) => (
                      <option key={r.id} value={r.id}>{r.name}</option>
                    ))}
                  </select>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
