/**
 * ARIA Knowledge Base — mock data.
 * KNOWLEDGE_DOCS: uploaded source-of-truth documents.
 * ARIA_BELIEFS: extracted/user facts ARIA holds (by category).
 * KNOWLEDGE_HEALTH: completeness per category + overall.
 */

export const KNOWLEDGE_CATEGORIES = [
  { id: 'brand', label: 'Brand & Positioning' },
  { id: 'icp', label: 'ICP Definition' },
  { id: 'competitor', label: 'Competitor Intel' },
  { id: 'campaign', label: 'Past Campaign Data' },
  { id: 'communication', label: 'Communication Rules' },
  { id: 'product', label: 'Product Knowledge' },
];

export const KNOWLEDGE_DOCS = [
  { id: 'd1', fileName: 'Brand_Voice_Guidelines_2026.pdf', category: 'brand', uploadDate: '2026-01-10', status: 'read', factsCount: 4, fileType: 'pdf' },
  { id: 'd2', fileName: 'ICP_Master_Doc_V3.docx', category: 'icp', uploadDate: '2025-12-01', status: 'read', factsCount: 6, fileType: 'docx' },
  { id: 'd3', fileName: 'Campaign_Results_Q4_2025.xlsx', category: 'campaign', uploadDate: '2026-01-05', status: 'read', factsCount: 8, fileType: 'xlsx' },
  { id: 'd4', fileName: 'Competitor_Matrix_Jan26.pdf', category: 'competitor', uploadDate: '2026-01-15', status: 'read', factsCount: 3, fileType: 'pdf' },
  { id: 'd5', fileName: 'CFO_Outreach_Scripts.docx', category: 'communication', uploadDate: '2025-11-20', status: 'read', factsCount: 5, fileType: 'docx' },
  { id: 'd6', fileName: 'Onboarding_Brief_Vietnam.pdf', category: 'campaign', uploadDate: '2025-10-08', status: 'read', factsCount: 4, fileType: 'pdf' },
];

export const ARIA_BELIEFS = {
  brand: [
    { id: 'b1', text: 'Our primary brand tone is: professional, data-driven, and founder-empathetic', source: 'Brand_Voice_Guidelines_2026.pdf', sourceType: 'extracted' },
    { id: 'b2', text: 'We never use corporate jargon. Write like a smart founder, not a consultant.', source: 'Brand_Voice_Guidelines_2026.pdf', sourceType: 'extracted' },
    { id: 'b3', text: "Primary CTA is always 'Book a demo' — never 'Contact us'", source: 'Brand_Voice_Guidelines_2026.pdf', sourceType: 'extracted' },
  ],
  icp: [
    { id: 'i1', text: 'Primary ICP: Manufacturing CFOs in textile factories, 100-500 employees', source: 'ICP_Master_Doc_V3.docx', sourceType: 'extracted' },
    { id: 'i2', text: 'Key pain point: cannot see which products are truly profitable vs revenue-generating', source: 'ICP_Master_Doc_V3.docx', sourceType: 'extracted' },
    { id: 'i3', text: 'Decision trigger: recent stockout event or failed audit', source: 'ICP_Master_Doc_V3.docx', sourceType: 'extracted' },
    { id: 'i4', text: 'Avoid targeting: startups under 2 years old, consumer brands', source: 'ICP_Master_Doc_V3.docx', sourceType: 'extracted' },
  ],
  communication: [
    { id: 'c1', text: 'Always lead with a specific, relevant data point in first outreach lines', source: 'CFO_Outreach_Scripts.docx', sourceType: 'extracted' },
    { id: 'c2', text: 'Subject line max 8 words, no emojis in email subjects', source: 'CFO_Outreach_Scripts.docx', sourceType: 'extracted' },
    { id: 'c3', text: "LinkedIn messages under 150 words — founders don't read long DMs", source: 'CFO_Outreach_Scripts.docx', sourceType: 'extracted' },
    { id: 'c4', text: 'Always include a specific reference to their industry in the first line', source: 'CFO_Outreach_Scripts.docx', sourceType: 'extracted' },
  ],
  campaign: [
    { id: 'p1', text: 'LinkedIn outreach to Supply Chain Managers gets 31% reply rate', source: 'Campaign_Results_Q4_2025.xlsx', sourceType: 'extracted' },
    { id: 'p2', text: 'Email sequences: 5 steps perform better than 7 — less is more', source: 'Campaign_Results_Q4_2025.xlsx', sourceType: 'extracted' },
    { id: 'p3', text: 'Best send time: Tuesday/Wednesday 9-11am local time', source: 'Campaign_Results_Q4_2025.xlsx', sourceType: 'extracted' },
  ],
  competitor: [],
  product: [],
};

export const KNOWLEDGE_HEALTH = {
  overallScore: 62,
  brand:    { score: 80, docCount: 3, status: 'ok' },
  icp:     { score: 60, docCount: 2, status: 'ok' },
  competitor: { score: 40, docCount: 0, status: 'missing' },
  campaign: { score: 100, docCount: 4, status: 'ok' },
  communication: { score: 60, docCount: 0, status: 'ok' },
  product: { score: 40, docCount: 0, status: 'missing' },
};

export function getCategoryLabel(id) {
  return KNOWLEDGE_CATEGORIES.find((c) => c.id === id)?.label ?? id;
}

export function getMissingCategories() {
  return KNOWLEDGE_CATEGORIES.filter((c) => KNOWLEDGE_HEALTH[c.id]?.status === 'missing').map((c) => c.label);
}
