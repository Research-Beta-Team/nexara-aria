import { useState, useCallback } from 'react';
import { C, F, R, S, btn } from '../tokens';
import useToast from '../hooks/useToast';
import { useAgent } from '../hooks/useAgent';
import AgentThinking from '../components/agents/AgentThinking';
import AgentResultPanel from '../components/agents/AgentResultPanel';
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
  const prospector = useAgent('prospector');
  const revenue = useAgent('revenue');
  const [agentResult, setAgentResult] = useState(null);

  const handleEnrichLeads = useCallback(async () => {
    toast.info('Prospector agent starting lead enrichment...');
    const result = await prospector.activate('customer-research', {
      task: 'Enrich selected leads with firmographic and technographic data',
      leads: clients.slice(0, 5).map(c => ({ name: c.name, company: c.company })),
    });
    setAgentResult(result);
    toast.success('Lead enrichment complete.');
  }, [prospector, clients, toast]);

  const handleOptimizeRouting = useCallback(async () => {
    toast.info('Revenue agent optimizing lead routing...');
    const result = await revenue.activate('revops', {
      task: 'Optimize lead routing based on SDR workload and lead characteristics',
      leads: clients.length,
    });
    setAgentResult(result);
    toast.success('Lead routing optimized.');
  }, [revenue, clients, toast]);

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
        <div style={{ display: 'flex', gap: S[2], alignItems: 'center' }}>
          {/* Prospector agent status indicator */}
          {prospector.isActive && (
            <div style={{ display: 'flex', alignItems: 'center', gap: S[1], padding: `${S[1]} ${S[3]}`, backgroundColor: C.primaryGlow, borderRadius: R.button, border: `1px solid ${C.primary}30` }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: C.primary, animation: 'pulse 1.5s ease-in-out infinite' }} />
              <span style={{ fontFamily: F.mono, fontSize: '10px', fontWeight: 700, color: C.primary }}>Prospector active</span>
            </div>
          )}
          <button
            type="button"
            style={{ ...btn.secondary, fontSize: '13px', display: 'inline-flex', alignItems: 'center', gap: 6 }}
            onClick={handleEnrichLeads}
            disabled={prospector.isActive}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.2"/><path d="M7 4.5v5M4.5 7h5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>
            Enrich leads
          </button>
          <button
            type="button"
            style={{ ...btn.secondary, fontSize: '13px', display: 'inline-flex', alignItems: 'center', gap: 6 }}
            onClick={handleOptimizeRouting}
            disabled={revenue.isActive}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 10l3-3 2 2 5-5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            Optimize lead routing
          </button>
          <button
            type="button"
            style={{ ...btn.primary }}
            onClick={() => setUploadOpen(true)}
          >
            Import clients
          </button>
        </div>
      </div>
      <style>{`@keyframes pulse{0%,100%{opacity:.5}50%{opacity:1}}`}</style>

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

      {/* Agent thinking / result panels */}
      {(prospector.isActive || revenue.isActive) && (
        <AgentThinking
          agentId={prospector.isActive ? 'prospector' : 'revenue'}
          task={prospector.isActive ? 'Enriching leads with firmographic data...' : 'Optimizing lead routing rules...'}
        />
      )}
      {agentResult && !prospector.isActive && !revenue.isActive && (
        <AgentResultPanel result={agentResult} />
      )}

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
