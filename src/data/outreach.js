// ─────────────────────────────────────────────
//  Antarious — Outreach / Prospects (client-aware)
// ─────────────────────────────────────────────

import { prospects as defaultProspects } from './campaigns';

const prospectsByClient = {
  'medglobal': defaultProspects,
  'techbridge-consulting': defaultProspects.slice(0, 3),
  'glowup-cosmetics': [],
  'grameen-impact-fund': [],
};

export const prospects = defaultProspects;

export function getProspectsForClient(clientId) {
  return prospectsByClient[clientId] || [];
}

/** Default campaign id used when linking from Outreach list to prospect detail */
export const DEFAULT_OUTREACH_CAMPAIGN_ID = 'c1';
