/**
 * Mock data for Lead Enrichment Center (Session 7).
 * Queue, duplicates, incomplete leads; sources: Clearbit, LinkedIn, Bombora, G2.
 */

export const ENRICHMENT_SOURCES = [
  { id: 'clearbit', name: 'Clearbit', type: 'firmographic' },
  { id: 'linkedin', name: 'LinkedIn', type: 'contact' },
  { id: 'bombora', name: 'Bombora', type: 'intent' },
  { id: 'g2', name: 'G2', type: 'technographic' },
];

export const ENRICHMENT_QUEUE = [
  { id: 'eq1', leadName: 'Jennifer Park', company: 'HealthBridge Analytics', status: 'enriching', sources: ['Clearbit', 'LinkedIn'], completeness: 65 },
  { id: 'eq2', leadName: 'David Okonkwo', company: 'Nexus Logistics', status: 'partial', sources: ['Clearbit'], completeness: 42 },
  { id: 'eq3', leadName: 'Sarah Miller', company: 'FinServe Global', status: 'fully_enriched', sources: ['Clearbit', 'LinkedIn', 'Bombora', 'G2'], completeness: 98 },
  { id: 'eq4', leadName: 'Alex Rivera', company: 'CloudNine Software', status: 'enriching', sources: ['Clearbit', 'LinkedIn'], completeness: 78 },
  { id: 'eq5', leadName: 'Emma Foster', company: 'Medglobal', status: 'partial', sources: ['LinkedIn'], completeness: 35 },
  { id: 'eq6', leadName: 'James Chen', company: 'DataFlow Inc', status: 'enriching', sources: ['Clearbit', 'Bombora'], completeness: 55 },
];

export const DUPLICATES = [
  {
    id: 'dup1',
    confidence: 94,
    leadA: { id: 'l1', name: 'Jennifer Park', company: 'HealthBridge Analytics', email: 'j.park@healthbridge.io', title: 'VP Marketing', source: 'Clearbit' },
    leadB: { id: 'l2', name: 'J. Park', company: 'HealthBridge Analytics', email: 'jennifer.park@healthbridge.io', title: null, source: 'LinkedIn' },
    matchFields: ['company', 'email_domain'],
  },
  {
    id: 'dup2',
    confidence: 87,
    leadA: { id: 'l3', name: 'Alex Rivera', company: 'CloudNine Software', email: 'alex@cloudnine.dev', title: 'Demand Gen Manager', source: 'Clearbit' },
    leadB: { id: 'l4', name: 'A. Rivera', company: 'CloudNine', email: 'arivera@cloudnine.dev', title: 'Demand Gen', source: 'G2' },
    matchFields: ['email', 'title'],
  },
];

export const INCOMPLETE_LEADS = [
  { id: 'inc1', leadName: 'Emma Foster', company: 'Medglobal', missing: ['Company size', 'Intent score'], completeness: 35 },
  { id: 'inc2', leadName: 'David Okonkwo', company: 'Nexus Logistics', missing: ['LinkedIn URL', 'Technographic'], completeness: 42 },
  { id: 'inc3', leadName: 'Unknown Lead', company: '—', missing: ['Company', 'Title', 'Email'], completeness: 10 },
];

/** Health dash metrics */
export const ENRICHMENT_HEALTH = {
  dataQualityScore: 78,
  autoEnrichedToday: 24,
  duplicatesPending: 2,
  missingDataAlerts: 5,
};

/** Detail for a lead (company teal, contact mint, intent amber, ICP violet) */
export function getLeadDetail(leadId) {
  const lead = ENRICHMENT_QUEUE.find((l) => l.id === leadId) || ENRICHMENT_QUEUE[0];
  return {
    ...lead,
    companyData: { industry: 'Healthcare Tech', size: '51-200', revenue: '$20M–50M', hq: 'San Francisco', source: 'Clearbit' },
    contactData: { title: 'VP Marketing', email: 'j.park@healthbridge.io', linkedIn: 'linkedin.com/in/jenniferpark', phone: null, source: 'LinkedIn' },
    intentSignals: [{ signal: 'Pricing page 3x', score: 85, source: 'Bombora' }, { signal: 'Demo request', score: 92, source: 'Bombora' }],
    icpFit: { score: 88, factors: ['Industry match', 'Size band', 'Intent tier'], source: 'Freya' },
  };
}

/** Intent feed items for IntentSignalFeed */
export const INTENT_FEED = [
  { id: 'i1', leadName: 'Jennifer Park', company: 'HealthBridge', signal: 'Pricing page 3x', at: new Date(Date.now() - 120000).toISOString(), score: 85 },
  { id: 'i2', leadName: 'David Okonkwo', company: 'Nexus Logistics', signal: 'Whitepaper download', at: new Date(Date.now() - 300000).toISOString(), score: 72 },
  { id: 'i3', leadName: 'Sarah Miller', company: 'FinServe', signal: 'G2 review', at: new Date(Date.now() - 600000).toISOString(), score: 90 },
  { id: 'i4', leadName: 'Alex Rivera', company: 'CloudNine', signal: 'Webinar attended', at: new Date(Date.now() - 900000).toISOString(), score: 68 },
  { id: 'i5', leadName: 'Emma Foster', company: 'Medglobal', signal: 'Newsletter signup', at: new Date(Date.now() - 1200000).toISOString(), score: 55 },
];

export const INTENT_SURGE = false;
