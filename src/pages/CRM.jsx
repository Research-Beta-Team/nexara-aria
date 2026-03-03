import { useState, useCallback } from 'react';
import { C, F, R, S, btn } from '../tokens';
import useToast from '../hooks/useToast';
import ConnectCRMCard from '../components/crm/ConnectCRMCard';
import ClientUploadModal from '../components/crm/ClientUploadModal';
import ClientTable from '../components/crm/ClientTable';
import { DEFAULT_CRM_CLIENTS } from '../data/crm';

function generateId() {
  return 'cl_' + Math.random().toString(36).slice(2, 11);
}

export default function CRM() {
  const [clients, setClients] = useState(DEFAULT_CRM_CLIENTS);
  const [uploadOpen, setUploadOpen] = useState(false);
  const toast = useToast();

  const handleBulkImport = useCallback((rows, { defaultTeamId, defaultRmId }) => {
    const newClients = rows.map((row) => ({
      id: generateId(),
      name: row.name || '—',
      company: row.company || '—',
      email: row.email || '',
      phone: row.phone || '',
      teamId: defaultTeamId || null,
      relationshipManagerId: defaultRmId || null,
      source: 'import',
      importedAt: new Date().toISOString(),
    }));
    setClients((prev) => [...prev, ...newClients]);
    toast.success(`Imported ${newClients.length} client(s).`);
  }, [toast]);

  const handleAddIndividual = useCallback((row) => {
    setClients((prev) => [
      ...prev,
      {
        id: generateId(),
        name: row.name || '—',
        company: row.company || '—',
        email: row.email || '',
        phone: row.phone || '',
        teamId: row.teamId || null,
        relationshipManagerId: row.relationshipManagerId || null,
        source: 'manual',
        importedAt: null,
      },
    ]);
    toast.success('Client added.');
  }, [toast]);

  const handleAssignTeam = useCallback((clientId, teamId) => {
    setClients((prev) =>
      prev.map((c) => (c.id === clientId ? { ...c, teamId } : c))
    );
  }, []);

  const handleAssignRm = useCallback((clientId, relationshipManagerId) => {
    setClients((prev) =>
      prev.map((c) => (c.id === clientId ? { ...c, relationshipManagerId } : c))
    );
  }, []);

  return (
    <div
      style={{
        padding: S[6],
        display: 'flex',
        flexDirection: 'column',
        gap: S[5],
        height: '100%',
        minHeight: 0,
        backgroundColor: C.bg,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: S[4] }}>
        <h1 style={{ fontFamily: F.display, fontSize: '24px', fontWeight: 700, color: C.textPrimary, margin: 0 }}>
          CRM
        </h1>
        <button
          type="button"
          style={{ ...btn.primary }}
          onClick={() => setUploadOpen(true)}
        >
          Import clients
        </button>
      </div>

      <ConnectCRMCard />

      <div
        style={{
          flex: 1,
          minHeight: 0,
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: C.surface,
          border: `1px solid ${C.border}`,
          borderRadius: R.card,
          overflow: 'hidden',
        }}
      >
        <div style={{ padding: `${S[4]} ${S[5]}`, borderBottom: `1px solid ${C.border}`, fontFamily: F.body, fontSize: '14px', fontWeight: 600, color: C.textPrimary }}>
          Clients ({clients.length})
        </div>
        <div style={{ flex: 1, overflow: 'auto' }}>
          <ClientTable
            clients={clients}
            onAssignTeam={handleAssignTeam}
            onAssignRm={handleAssignRm}
          />
        </div>
      </div>

      {uploadOpen && (
        <ClientUploadModal
          onClose={() => setUploadOpen(false)}
          onBulkImport={handleBulkImport}
          onAddIndividual={handleAddIndividual}
        />
      )}
    </div>
  );
}
