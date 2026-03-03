// ─────────────────────────────────────────────
//  Central Calendar — events across all campaigns (enterprise)
//  Each event has campaignId for filtering.
// ─────────────────────────────────────────────

import { CALENDAR_EVENTS } from './calendar';
import { campaigns } from './campaigns';

const CAMPAIGN_IDS = campaigns.filter((c) => c.status === 'active' || c.status === 'paused').map((c) => c.id);

/**
 * Events with campaignId attached. Spreads events across campaigns for demo.
 * @returns {Array<{ ...event, campaignId: string }>}
 */
export function getCentralCalendarEvents() {
  if (CAMPAIGN_IDS.length === 0) return CALENDAR_EVENTS.map((e) => ({ ...e, campaignId: 'c1' }));
  const campaignById = Object.fromEntries(campaigns.map((c) => [c.id, c]));
  return CALENDAR_EVENTS.map((ev, i) => {
    const cid = CAMPAIGN_IDS[i % CAMPAIGN_IDS.length];
    return {
      ...ev,
      id: `central-${ev.id}`,
      campaignId: cid,
      campaignName: campaignById[cid]?.name ?? '',
    };
  });
}

/**
 * Campaign options for the central calendar filter.
 * @returns {Array<{ id: string, name: string }>}
 */
export function getCampaignOptionsForCalendar() {
  return campaigns
    .filter((c) => c.status === 'active' || c.status === 'paused')
    .map((c) => ({ id: c.id, name: c.name }));
}
