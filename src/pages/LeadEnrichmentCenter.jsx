/**
 * Lead Enrichment Center — Session 7.
 * Top EnrichmentHealthDash; tabs: Enrichment Queue, Duplicates, Incomplete; left list, right detail or IntentSignalFeed.
 */
import { useState } from 'react';
import useToast from '../hooks/useToast';
import { useAgent } from '../hooks/useAgent';
import AgentThinking from '../components/agents/AgentThinking';
import AgentResultPanel from '../components/agents/AgentResultPanel';
import {
  ENRICHMENT_HEALTH,
  ENRICHMENT_QUEUE,
  DUPLICATES,
  INCOMPLETE_LEADS,
  INTENT_FEED,
  INTENT_SURGE,
  getLeadDetail,
} from '../data/enrichmentMock';
import EnrichmentHealthDash from '../components/enrichment/EnrichmentHealthDash';
import LeadEnrichmentRow from '../components/enrichment/LeadEnrichmentRow';
import EnrichmentDetailModal from '../components/enrichment/EnrichmentDetailModal';
import DuplicateAlertCard from '../components/enrichment/DuplicateAlertCard';
import IntentSignalFeed from '../components/enrichment/IntentSignalFeed';
import { C, F, R, S, btn } from '../tokens';

const TABS = [
  { id: 'queue', label: 'Enrichment Queue' },
  { id: 'duplicates', label: 'Duplicates' },
  { id: 'incomplete', label: 'Incomplete' },
];

export default function LeadEnrichmentCenter() {
  const toast = useToast();
  const prospector = useAgent('prospector');
  const [agentResult, setAgentResult] = useState(null);
  const [activeTab, setActiveTab] = useState('queue');
  const [selectedLeadId, setSelectedLeadId] = useState(null);
  const [modalLeadId, setModalLeadId] = useState(null);

  const handleEnrichAll = async () => {
    toast.info('Prospector agent starting batch enrichment...');
    const result = await prospector.activate('customer-research', {
      task: 'Batch enrich all leads in queue with Clearbit, LinkedIn, Bombora, G2 data',
      leads: ENRICHMENT_QUEUE.map(l => ({ id: l.id, name: l.leadName, company: l.company })),
      storeInMemory: 'audience',
    });
    setAgentResult(result);
    toast.success('Batch enrichment complete. Results stored in audience memory.');
  };

  const handleDetectDuplicates = async () => {
    toast.info('Prospector agent scanning for duplicates...');
    const result = await prospector.activate('customer-research', {
      task: 'Detect duplicate leads across enrichment queue using fuzzy matching on name, email, company',
      leads: ENRICHMENT_QUEUE.length,
    });
    setAgentResult(result);
    toast.success('Duplicate detection complete.');
  };

  const selectedLead = ENRICHMENT_QUEUE.find((l) => l.id === selectedLeadId);
  const leadDetail = modalLeadId ? getLeadDetail(modalLeadId) : null;

  const handleViewProfile = (lead) => {
    setModalLeadId(lead?.id ?? null);
  };

  const handleMerge = (dup) => {
    toast.success('Duplicates merged.');
  };

  const handleKeepSeparate = (dup) => {
    toast.info('Kept as separate leads.');
  };

  return (
    <div style={{ minHeight: '100%', backgroundColor: C.bg, padding: S[6] }}>
      <div style={{ marginBottom: S[6] }}>
        <h1 style={{ fontFamily: F.display, fontSize: '22px', fontWeight: 700, color: C.textPrimary, margin: `0 0 ${S[2]} 0` }}>
          Lead Enrichment
        </h1>
        <p style={{ fontFamily: F.body, fontSize: '13px', color: C.textSecondary, margin: 0 }}>
          Auto-enrich leads with firmographic, technographic, and intent data. Data quality score, duplicate detection, and live intent feed.
        </p>
        <div style={{ display: 'flex', gap: S[2], marginTop: S[3] }}>
          <button
            type="button"
            style={{ ...btn.primary, fontSize: '13px', display: 'inline-flex', alignItems: 'center', gap: 6 }}
            onClick={handleEnrichAll}
            disabled={prospector.isActive}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 1v12M1 7h12" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>
            Enrich all
          </button>
          <button
            type="button"
            style={{ ...btn.secondary, fontSize: '13px', display: 'inline-flex', alignItems: 'center', gap: 6 }}
            onClick={handleDetectDuplicates}
            disabled={prospector.isActive}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="5" cy="7" r="3.5" stroke="currentColor" strokeWidth="1.1"/><circle cx="9" cy="7" r="3.5" stroke="currentColor" strokeWidth="1.1"/></svg>
            Detect duplicates
          </button>
          {prospector.isActive && (
            <div style={{ display: 'flex', alignItems: 'center', gap: S[1], padding: `${S[1]} ${S[3]}`, backgroundColor: C.primaryGlow, borderRadius: R.button, border: `1px solid ${C.primary}30` }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: C.primary, animation: 'enrichPulse 1.5s ease-in-out infinite' }} />
              <span style={{ fontFamily: F.mono, fontSize: '10px', fontWeight: 700, color: C.primary }}>Prospector active</span>
            </div>
          )}
        </div>
        <style>{`@keyframes enrichPulse{0%,100%{opacity:.5}50%{opacity:1}}`}</style>
      </div>

      {/* Agent thinking / result */}
      {prospector.isActive && (
        <div style={{ marginBottom: S[4] }}>
          <AgentThinking agentId="prospector" task="Enriching leads from Clearbit, LinkedIn, Bombora, G2..." />
        </div>
      )}
      {agentResult && !prospector.isActive && (
        <div style={{ marginBottom: S[4] }}>
          <AgentResultPanel result={agentResult} />
        </div>
      )}

      <EnrichmentHealthDash
        dataQualityScore={ENRICHMENT_HEALTH.dataQualityScore}
        autoEnrichedToday={ENRICHMENT_HEALTH.autoEnrichedToday}
        duplicatesPending={ENRICHMENT_HEALTH.duplicatesPending}
        missingDataAlerts={ENRICHMENT_HEALTH.missingDataAlerts}
      />

      <div style={{ display: 'flex', gap: S[2], marginBottom: S[4] }}>
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: `${S[2]} ${S[4]}`,
              fontFamily: F.body,
              fontSize: '13px',
              fontWeight: 600,
              color: activeTab === tab.id ? C.primary : C.textSecondary,
              backgroundColor: activeTab === tab.id ? C.primaryGlow : 'transparent',
              border: `1px solid ${activeTab === tab.id ? C.primary : C.border}`,
              borderRadius: R.button,
              cursor: 'pointer',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', gap: S[6], minHeight: 400 }}>
        <div
          style={{
            width: 380,
            minWidth: 380,
            flexShrink: 0,
            overflowY: 'auto',
            paddingRight: S[2],
          }}
        >
          {activeTab === 'queue' && (
            <>
              {ENRICHMENT_QUEUE.map((lead) => (
                <LeadEnrichmentRow
                  key={lead.id}
                  lead={lead}
                  selected={selectedLeadId === lead.id}
                  onSelect={(l) => setSelectedLeadId(l?.id ?? null)}
                  onViewProfile={handleViewProfile}
                />
              ))}
            </>
          )}
          {activeTab === 'duplicates' && (
            <>
              {DUPLICATES.map((dup) => (
                <DuplicateAlertCard
                  key={dup.id}
                  duplicate={dup}
                  onMerge={handleMerge}
                  onKeepSeparate={handleKeepSeparate}
                />
              ))}
              {DUPLICATES.length === 0 && (
                <div style={{ padding: S[6], fontFamily: F.body, fontSize: '14px', color: C.textMuted }}>
                  No duplicates pending.
                </div>
              )}
            </>
          )}
          {activeTab === 'incomplete' && (
            <>
              {INCOMPLETE_LEADS.map((lead) => (
                <div
                  key={lead.id}
                  style={{
                    padding: S[4],
                    backgroundColor: C.surface,
                    border: `1px solid ${C.border}`,
                    borderRadius: R.card,
                    marginBottom: S[2],
                  }}
                >
                  <div style={{ fontFamily: F.body, fontSize: '14px', fontWeight: 600, color: C.textPrimary }}>{lead.leadName}</div>
                  <div style={{ fontFamily: F.body, fontSize: '12px', color: C.textSecondary }}>{lead.company}</div>
                  <div style={{ fontFamily: F.body, fontSize: '11px', color: C.textMuted, marginTop: S[2] }}>
                    Missing: {(lead.missing || []).join(', ')}
                  </div>
                  <div style={{ marginTop: S[2], height: 6, backgroundColor: C.surface3, borderRadius: R.pill, overflow: 'hidden' }}>
                    <div style={{ width: `${lead.completeness}%`, height: '100%', backgroundColor: C.amber, borderRadius: R.pill }} />
                  </div>
                </div>
              ))}
            </>
          )}
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          {activeTab === 'queue' && (
            <>
              {/* Agent attribution banner */}
              <div style={{
                display: 'flex', alignItems: 'center', gap: S[2], padding: `${S[2]} ${S[3]}`,
                backgroundColor: C.primaryGlow, border: `1px solid ${C.primary}30`, borderRadius: R.sm,
                marginBottom: S[3],
              }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: C.primary }} />
                <span style={{ fontFamily: F.mono, fontSize: '10px', fontWeight: 700, color: C.primary }}>
                  Enriched by Lead Agent (Clearbit, LinkedIn)
                </span>
                <span style={{ fontFamily: F.body, fontSize: '10px', color: C.textMuted, marginLeft: 'auto' }}>
                  Memory: audience namespace
                </span>
              </div>
              <IntentSignalFeed items={INTENT_FEED} surgeDetected={INTENT_SURGE} />
            </>
          )}
          {activeTab === 'duplicates' && (
            <div style={{ fontFamily: F.body, fontSize: '13px', color: C.textMuted }}>
              Select a duplicate above to merge or keep separate.
            </div>
          )}
          {activeTab === 'incomplete' && (
            <div style={{ fontFamily: F.body, fontSize: '13px', color: C.textMuted }}>
              Leads with missing data. Enrichment will fill gaps from connected sources.
            </div>
          )}
        </div>
      </div>

      <EnrichmentDetailModal leadDetail={leadDetail} onClose={() => setModalLeadId(null)} />
    </div>
  );
}
