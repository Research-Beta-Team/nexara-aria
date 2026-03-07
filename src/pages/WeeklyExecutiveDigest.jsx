/**
 * Weekly Executive Digest — Session 5.
 * DigestHeader; ARIA narrative; 6-block KPI strip; Anomalies; 3 priority actions; performance mini-charts; DigestScheduleConfig slide-over.
 */
import { useState } from 'react';
import useToast from '../hooks/useToast';
import {
  DIGEST_WEEK,
  DIGEST_KPIS,
  DIGEST_NARRATIVE,
  DIGEST_ANOMALIES,
  DIGEST_PRIORITY_ACTIONS,
  DIGEST_DELIVERY,
  DIGEST_MINI_CHARTS,
  DIGEST_SCHEDULE_DEFAULT,
} from '../data/digestMock';
import DigestHeader from '../components/digest/DigestHeader';
import DigestKPIBlock from '../components/digest/DigestKPIBlock';
import DigestNarrativeSection from '../components/digest/DigestNarrativeSection';
import AnomalyAlertRow from '../components/digest/AnomalyAlertRow';
import PriorityActionCard from '../components/digest/PriorityActionCard';
import DigestMiniChart from '../components/digest/DigestMiniChart';
import DigestScheduleConfig from '../components/digest/DigestScheduleConfig';
import { C, F, R, S } from '../tokens';

export default function WeeklyExecutiveDigest() {
  const toast = useToast();
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [weekOffset, setWeekOffset] = useState(0);

  const handlePrevWeek = () => setWeekOffset((o) => o - 1);
  const handleNextWeek = () => setWeekOffset((o) => o + 1);
  const handleForward = () => toast.info('Forward (mock).');
  const handleDownload = () => toast.success('Download started.');
  const handleConfigure = () => setScheduleOpen(true);
  const handleScheduleSave = (config) => {
    toast.success('Digest schedule saved.');
    setScheduleOpen(false);
  };
  const handleAnomalyView = (a) => toast.info(`View: ${a.title}`);
  const handlePriorityAction = (action) => toast.info(action.actionLabel);

  return (
    <div style={{ minHeight: '100%', backgroundColor: C.bg, padding: S[6] }}>
      <DigestHeader
        weekLabel={DIGEST_WEEK.label}
        onPrevWeek={handlePrevWeek}
        onNextWeek={handleNextWeek}
        deliveryStatus={DIGEST_DELIVERY.status}
        deliveredAt={DIGEST_DELIVERY.deliveredAt}
        onForward={handleForward}
        onDownload={handleDownload}
        onConfigure={handleConfigure}
      />

      <div style={{ marginTop: S[6] }}>
        <DigestNarrativeSection narrative={DIGEST_NARRATIVE} />
      </div>

      <div style={{ fontFamily: F.display, fontSize: '16px', fontWeight: 700, color: C.textPrimary, margin: `${S[6]} 0 ${S[4]} 0` }}>
        Key metrics
      </div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(6, 1fr)',
          gap: S[4],
          marginBottom: S[6],
        }}
      >
        {DIGEST_KPIS.map((kpi) => (
          <DigestKPIBlock
            key={kpi.id}
            name={kpi.name}
            value={kpi.value}
            vsLastWeek={kpi.vsLastWeek}
            vsTarget={kpi.vsTarget}
            trend={kpi.trend}
          />
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: S[4], marginBottom: S[6] }}>
        {DIGEST_MINI_CHARTS.map((chart) => (
          <div
            key={chart.metric}
            style={{
              padding: S[4],
              backgroundColor: C.surface,
              border: `1px solid ${C.border}`,
              borderRadius: R.card,
            }}
          >
            <div style={{ fontFamily: F.body, fontSize: '12px', fontWeight: 600, color: C.textSecondary, marginBottom: S[2] }}>
              {chart.metric} (7d)
            </div>
            <DigestMiniChart id={chart.metric} values={chart.values} />
          </div>
        ))}
      </div>

      <div style={{ fontFamily: F.display, fontSize: '16px', fontWeight: 700, color: C.textPrimary, margin: `0 0 ${S[4]} 0` }}>
        Anomalies
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: S[3], marginBottom: S[6] }}>
        {DIGEST_ANOMALIES.map((a) => (
          <AnomalyAlertRow key={a.id} anomaly={a} onView={handleAnomalyView} />
        ))}
      </div>

      <div style={{ fontFamily: F.display, fontSize: '16px', fontWeight: 700, color: C.textPrimary, margin: `0 0 ${S[4]} 0` }}>
        Priority actions
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: S[3], marginBottom: S[6] }}>
        {DIGEST_PRIORITY_ACTIONS.map((action) => (
          <PriorityActionCard
            key={action.id}
            number={action.number}
            description={action.description}
            actionLabel={action.actionLabel}
            hasDraft={action.hasDraft}
            onAction={() => handlePriorityAction(action)}
          />
        ))}
      </div>

      <DigestScheduleConfig
        initial={DIGEST_SCHEDULE_DEFAULT}
        open={scheduleOpen}
        onClose={() => setScheduleOpen(false)}
        onSave={handleScheduleSave}
      />
    </div>
  );
}
