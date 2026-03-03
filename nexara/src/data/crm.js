// ─────────────────────────────────────────────
//  CRM — clients, teams, relationship managers
//  Used by CRM page for import, assignment, and external CRM connections.
// ─────────────────────────────────────────────

export const CRM_PROVIDERS = [
  { id: 'hubspot', name: 'HubSpot', description: 'Sync contacts and companies' },
  { id: 'salesforce', name: 'Salesforce', description: 'Sync leads and accounts' },
  { id: 'pipedrive', name: 'Pipedrive', description: 'Sync deals and people' },
];

export const TEAMS = [
  { id: 't1', name: 'Enterprise', description: 'Strategic accounts' },
  { id: 't2', name: 'Mid-Market', description: 'Growth segment' },
  { id: 't3', name: 'SMB', description: 'Small business' },
  { id: 't4', name: 'Inbound', description: 'Inbound leads' },
];

export const RELATIONSHIP_MANAGERS = [
  { id: 'rm1', name: 'Alex', email: 'alex@nexara.io', teamIds: ['t1', 't2'] },
  { id: 'rm2', name: 'Jordan', email: 'jordan@nexara.io', teamIds: ['t1', 't3'] },
  { id: 'rm3', name: 'Sam', email: 'sam@nexara.io', teamIds: ['t2', 't4'] },
];

// Client records: can be extended by import (Excel/CSV) or individual add
export const DEFAULT_CRM_CLIENTS = [
  { id: 'cl1', name: 'James Wu', company: 'TechCorp Global', email: 'james@techcorp.io', phone: '', teamId: 't1', relationshipManagerId: 'rm1', source: 'manual', importedAt: null },
  { id: 'cl2', name: 'Dr. Lisa Wong', company: 'MedScale Solutions', email: 'lisa@medscale.io', phone: '', teamId: 't2', relationshipManagerId: 'rm2', source: 'manual', importedAt: null },
  { id: 'cl3', name: 'Rachel Kim', company: 'FinServe Inc', email: 'rachel@finserve.com', phone: '', teamId: 't2', relationshipManagerId: 'rm3', source: 'manual', importedAt: null },
  { id: 'cl4', name: 'Sarah Chen', company: 'Apex Corp', email: 's.chen@apexcorp.com', phone: '', teamId: 't1', relationshipManagerId: 'rm1', source: 'manual', importedAt: null },
  { id: 'cl5', name: 'Mike Torres', company: 'Delta Textiles', email: 'm.torres@deltatextiles.com', phone: '', teamId: 't3', relationshipManagerId: 'rm2', source: 'manual', importedAt: null },
];

// Field keys supported for CSV/Excel column mapping
export const CRM_CLIENT_FIELDS = [
  { key: 'name', label: 'Contact name', required: true },
  { key: 'company', label: 'Company', required: true },
  { key: 'email', label: 'Email', required: true },
  { key: 'phone', label: 'Phone', required: false },
];

export function getTeamById(id) {
  return TEAMS.find((t) => t.id === id) ?? null;
}

export function getRelationshipManagerById(id) {
  return RELATIONSHIP_MANAGERS.find((r) => r.id === id) ?? null;
}
