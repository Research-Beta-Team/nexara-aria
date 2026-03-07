/**
 * Lead Enrichment Center — Session 7.
 * Top EnrichmentHealthDash; tabs: Enrichment Queue, Duplicates, Incomplete; left list, right detail or IntentSignalFeed.
 */
import { useState } from 'react';
import useToast from '../hooks/useToast';
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
import { C, F, R, S } from '../tokens';

const TABS = [
  { id: 'queue', label: 'Enrichment Queue' },
  { id: 'duplicates', label: 'Duplicates' },
  { id: 'incomplete', label: 'Incomplete' },
];

export default function LeadEnrichmentCenter() {
  const toast = useToast();
  const [activeTab, setActiveTab] = useState('queue');
  const [selectedLeadId, setSelectedLeadId] = useState(null);
  const [modalLeadId, setModalLeadId] = useState(null);

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
      </div>

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
            <IntentSignalFeed items={INTENT_FEED} surgeDetected={INTENT_SURGE} />
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
