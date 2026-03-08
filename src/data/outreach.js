// ─────────────────────────────────────────────
//  Antarious — Outreach / Prospects (client-aware)
//  Enriched with campaignId, channel, dates, replyPreview, inHandoff
// ─────────────────────────────────────────────

import { prospects as baseProspects, getCampaignsForClient } from './campaigns';

const CAMPAIGN_IDS = ['c1', 'c1', 'c2', 'c1', 'c1'];
const CHANNELS = ['Email', 'Email', 'LinkedIn', 'Email', 'Email'];
const ADDED_DAYS_AGO = [12, 18, 5, 20, 14];

function enrichProspect(p, i) {
  const campaignId = CAMPAIGN_IDS[i] ?? 'c1';
  const replyEvent = p.touchpoints?.find((t) => t.type === 'email_replied');
  return {
    ...p,
    campaignId,
    campaignName: campaignId === 'c1' ? 'CFO Vietnam Q1' : campaignId === 'c2' ? 'APAC Brand Awareness' : 'CFO Vietnam Q1',
    channel: CHANNELS[i] ?? 'Email',
    addedDate: new Date(Date.now() - ADDED_DAYS_AGO[i] * 24 * 60 * 60 * 1000),
    replyPreview: replyEvent?.detail ? String(replyEvent.detail).replace(/^["']|["']$/g, '').slice(0, 50) : null,
    inHandoff: p.replied && p.intent === 'high',
  };
}

const enrichedDefault = baseProspects.map(enrichProspect);

const prospectsByClient = {
  medglobal: enrichedDefault,
  'techbridge-consulting': enrichedDefault.slice(0, 3).map((p, i) => enrichProspect({ ...p, id: `tb-${p.id}` }, i)),
  'glowup-cosmetics': [],
  'grameen-impact-fund': [],
};

export const prospects = enrichedDefault;

export function getProspectsForClient(clientId) {
  return prospectsByClient[clientId] || [];
}

export function getCampaignsForOutreach(clientId) {
  return getCampaignsForClient(clientId);
}

/** Default campaign id used when linking from Outreach list to prospect detail */
export const DEFAULT_OUTREACH_CAMPAIGN_ID = 'c1';

/** Saved filter presets (saved views) */
export const OUTREACH_SAVED_VIEWS = [
  { id: 'high_intent', label: 'High intent, not replied', filter: { filter: 'high', replied: false } },
  { id: 'needs_follow', label: 'In sequence, no reply', filter: { filter: 'active', replied: false } },
  { id: 'replied', label: 'Replied', filter: { filter: 'replied' } },
];
