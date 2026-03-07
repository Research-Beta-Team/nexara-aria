// ─────────────────────────────────────────────
//  Antarious — Analytics (client-aware mock)
// ─────────────────────────────────────────────

const analyticsByClient = {
  'medglobal': {
    channelAttribution: [
      { channel: 'LinkedIn', leads: 62, share: 66 },
      { channel: 'Meta', leads: 32, share: 34 },
    ],
    funnel: [
      { stage: 'Impressions', count: 482000 },
      { stage: 'Clicks', count: 18300 },
      { stage: 'Leads', count: 94 },
      { stage: 'MQLs', count: 31 },
      { stage: 'SQLs', count: 11 },
    ],
    cac: 196,
    anomalyDetected: false,
  },
  'glowup-cosmetics': {
    channelAttribution: [
      { channel: 'Meta', leads: 62, share: 100 },
    ],
    funnel: [
      { stage: 'Impressions', count: 320000 },
      { stage: 'Clicks', count: 9600 },
      { stage: 'Leads', count: 62 },
    ],
    cac: 42,
    anomalyDetected: false,
  },
  'techbridge-consulting': { channelAttribution: [], funnel: [], cac: 0, anomalyDetected: false },
  'grameen-impact-fund': {
    channelAttribution: [
      { channel: 'Email', leads: 0, share: 50 },
      { channel: 'Meta', leads: 0, share: 50 },
    ],
    funnel: [],
    cac: 0,
    anomalyDetected: false,
  },
};

export function getAnalyticsForClient(clientId) {
  return analyticsByClient[clientId] || analyticsByClient['medglobal'];
}
