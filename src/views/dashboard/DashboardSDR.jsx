import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useToast from '../../hooks/useToast';
import { useAgent } from '../../hooks/useAgent';
import { C, F, R, S, btn, cardStyle } from '../../tokens';
import AgentFeed from '../../components/agents/AgentFeed';

const HOT_REPLIES = [
  { name: 'Md. Karim Rahman', message: 'Interested, send more info' },
  { name: 'Sarah Chen', message: "What's your pricing?" },
  { name: 'James Nguyen', message: 'Can we talk Thursday?' },
];

const PROSPECTOR_LEADS = [
  { name: 'Tanvir Hossain', title: 'CFO, RMG Export Ltd', score: 88, source: 'Prospector Agent', enriched: true },
  { name: 'Linh Tran', title: 'VP Finance, VietTex Group', score: 82, source: 'Prospector Agent', enriched: true },
  { name: 'Arif Chowdhury', title: 'Finance Director, Beximco', score: 79, source: 'Prospector Agent', enriched: false },
];

export default function DashboardSDR() {
  const navigate = useNavigate();
  const toast = useToast();
  const prospector = useAgent('prospector');
  const outreachAgent = useAgent('outreach');
  const [enrichingLead, setEnrichingLead] = useState(null);

  const handleEnrichNext = async () => {
    const nextUnenriched = PROSPECTOR_LEADS.find((l) => !l.enriched);
    if (!nextUnenriched) {
      toast.info('All leads are already enriched');
      return;
    }
    setEnrichingLead(nextUnenriched.name);
    toast.info(`Prospector enriching ${nextUnenriched.name}...`);
    try {
      await prospector.activate('enrich_lead', { leadName: nextUnenriched.name });
    } catch (_) { /* demo fallback */ }
    setTimeout(() => {
      setEnrichingLead(null);
      toast.success(`${nextUnenriched.name} enriched successfully`);
    }, 1500);
  };

  const handleDraftOutreach = async (leadName) => {
    toast.info(`Outreach agent drafting message for ${leadName}...`);
    try {
      await outreachAgent.activate('draft_outreach', { leadName });
    } catch (_) { /* demo fallback */ }
    setTimeout(() => toast.success('Draft ready in Inbox'), 1200);
  };

  return (
    <div style={{ padding: S[6], display: 'flex', flexDirection: 'column', gap: S[5], minHeight: '100%' }}>
      <div>
        <h1 style={{ fontFamily: F.display, fontSize: '22px', fontWeight: 800, color: C.textPrimary, margin: 0 }}>Your Outreach Day</h1>
        <span style={{ fontFamily: F.body, fontSize: '13px', color: C.textSecondary }}>SDR for: Medglobal (CFO Vietnam), BGMEA Campaign</span>
      </div>
      <div>
        <h2 style={{ fontFamily: F.display, fontSize: '13px', fontWeight: 700, color: C.red, textTransform: 'uppercase', margin: `0 0 ${S[3]}` }}>Hot — Replied, needs follow-up (3)</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: S[2] }}>
          {HOT_REPLIES.map((r, i) => (
            <div key={i} style={{ ...cardStyle, padding: S[3], display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ fontFamily: F.body, fontWeight: 600, color: C.textPrimary }}>{r.name}</span>
                <span style={{ marginLeft: S[2], fontFamily: F.body, fontSize: '12px', color: C.textSecondary }}>→ "{r.message}"</span>
              </div>
              <button style={{ ...btn.primary, fontSize: '12px' }} onClick={() => navigate('/inbox')}>Open inbox →</button>
            </div>
          ))}
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: S[5] }}>
        <div style={{ ...cardStyle, padding: S[4] }}>
          <h2 style={{ fontFamily: F.display, fontSize: '13px', fontWeight: 700, color: C.amber, textTransform: 'uppercase', margin: `0 0 ${S[3]}` }}>Follow-up Due Today (8)</h2>
          <div style={{ fontFamily: F.body, fontSize: '12px', color: C.textSecondary }}>Step 3 sends for 8 prospects (email queue ready)</div>
          <button style={{ ...btn.secondary, fontSize: '12px', marginTop: S[3] }} onClick={() => toast.info('Review + send')}>Review + send →</button>
        </div>
        <div style={{ ...cardStyle, padding: S[4] }}>
          <h2 style={{ fontFamily: F.display, fontSize: '13px', fontWeight: 700, color: C.primary, textTransform: 'uppercase', margin: `0 0 ${S[3]}` }}>New Prospects Enrolled (12)</h2>
          <div style={{ fontFamily: F.body, fontSize: '12px', color: C.textSecondary }}>Freya enrolled 12 new CFOs into Sequence A overnight</div>
          <button style={{ ...btn.secondary, fontSize: '12px', marginTop: S[3] }} onClick={() => toast.info('Review list')}>Review list →</button>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: S[5] }}>
        <div style={{ ...cardStyle, padding: S[4] }}>
          <h2 style={{ fontFamily: F.display, fontSize: '13px', fontWeight: 700, color: C.textMuted, textTransform: 'uppercase', margin: `0 0 ${S[3]}` }}>Your Stats This Week</h2>
          <div style={{ fontFamily: F.body, fontSize: '13px', color: C.textPrimary }}>Sent: 47 messages · Replies: 14 (29.7%) · Demos booked: 3 · Goal: 5 demos/week</div>
          <button style={{ ...btn.ghost, fontSize: '12px', marginTop: S[2] }} onClick={() => navigate('/campaigns')}>Check sequences →</button>
        </div>
        <div style={{ ...cardStyle, padding: S[4], border: `1px solid ${C.primary}` }}>
          <h2 style={{ fontFamily: F.display, fontSize: '13px', fontWeight: 700, color: C.primary, textTransform: 'uppercase', margin: `0 0 ${S[3]}` }}>Freya Suggested Next Action</h2>
          <div style={{ fontFamily: F.body, fontSize: '12px', color: C.textSecondary }}>"Follow up with James Nguyen — sent 3 emails, opened all 3, no reply yet. High intent."</div>
          <button style={{ ...btn.primary, fontSize: '12px', marginTop: S[3] }} onClick={() => toast.info('Draft message')}>Draft message →</button>
        </div>
      </div>

      {/* ── Agent-Powered Lead Section ── */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: S[3] }}>
          <h2 style={{ fontFamily: F.display, fontSize: '13px', fontWeight: 700, color: C.textMuted, textTransform: 'uppercase', margin: 0 }}>Prospector Agent — Leads</h2>
          <button
            style={{ ...btn.secondary, fontSize: '12px', opacity: enrichingLead ? 0.6 : 1 }}
            onClick={handleEnrichNext}
            disabled={!!enrichingLead}
          >
            {enrichingLead ? `Enriching ${enrichingLead}...` : 'Enrich next lead'}
          </button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: S[2] }}>
          {PROSPECTOR_LEADS.map((lead, i) => (
            <div key={i} style={{ ...cardStyle, padding: S[4], display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ fontFamily: F.body, fontWeight: 600, color: C.textPrimary }}>{lead.name}</span>
                <span style={{ marginLeft: S[2], fontFamily: F.body, fontSize: '12px', color: C.textSecondary }}>{lead.title}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: S[2], marginTop: '2px' }}>
                  <span style={{ fontFamily: F.mono, fontSize: '11px', color: C.primary }}>Score: {lead.score}</span>
                  <span style={{ fontFamily: F.mono, fontSize: '10px', color: lead.enriched ? C.green : C.amber }}>
                    {lead.enriched ? 'ENRICHED' : 'PENDING'}
                  </span>
                </div>
              </div>
              <button style={{ ...btn.primary, fontSize: '12px' }} onClick={() => handleDraftOutreach(lead.name)}>
                Draft outreach →
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Agent Activity Feed (SDR-relevant) */}
      <div>
        <h2 style={{ fontFamily: F.display, fontSize: '13px', fontWeight: 700, color: C.textMuted, textTransform: 'uppercase', margin: `0 0 ${S[3]}` }}>Agent Activity</h2>
        <AgentFeed limit={8} />
      </div>
    </div>
  );
}
