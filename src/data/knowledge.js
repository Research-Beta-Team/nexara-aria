// ─────────────────────────────────────────────
//  Antarious — Knowledge Base (client-aware)
// ─────────────────────────────────────────────

const docsByClient = {
  'medglobal': [
    { id: 'kb1', name: 'Medglobal Brand Guidelines 2025', category: 'Brand', updatedAt: '2025-02-01', status: 'extracted' },
    { id: 'kb2', name: 'Vietnam CFO ICP Profile', category: 'ICP', updatedAt: '2025-01-28', status: 'extracted' },
    { id: 'kb3', name: 'Competitive Battle Card — SAP', category: 'Competitor', updatedAt: '2025-01-15', status: 'extracted' },
  ],
  'glowup-cosmetics': [
    { id: 'kb4', name: 'GlowUp Tone of Voice', category: 'Brand', updatedAt: '2025-02-10', status: 'extracted' },
  ],
  'techbridge-consulting': [],
  'grameen-impact-fund': [
    { id: 'kb5', name: 'Donor Messaging Guide', category: 'Campaign Data', updatedAt: '2025-01-20', status: 'extracted' },
  ],
};

export function getKnowledgeDocsForClient(clientId) {
  return docsByClient[clientId] || [];
}
