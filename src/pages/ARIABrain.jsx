import { C, F, R, S, sectionHeading } from '../tokens';
import {
  ARIA_STATS,
  LEARNING_ENTRIES,
  CONTENT_PERFORMANCE,
  BENCHMARK_DATA,
  ACCURACY_TREND_DATA,
} from '../data/ariaBrain';
import LearningFeed from '../components/aria/LearningFeed';
import PerformanceTrendChart from '../components/aria/PerformanceTrendChart';
import CrossCampaignInsights from '../components/aria/CrossCampaignInsights';

export default function ARIABrain() {
  const { campaignsAnalysed, datasetsLearned, accuracyImprovement, confidenceLevel } = ARIA_STATS;

  return (
    <div
      style={{
        padding: S[6],
        display: 'flex',
        flexDirection: 'column',
        gap: S[6],
        height: '100%',
        minHeight: 0,
        backgroundColor: C.bg,
        overflowY: 'auto',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: S[4], flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: S[3] }}>
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: R.card,
              backgroundColor: C.primary,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 20px rgba(61,220,132,0.35)',
              animation: 'ariaPulse 2s ease-in-out infinite',
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M12 2a4 4 0 0 1 4 4v2a4 4 0 0 1-4 4 4 4 0 0 1-4-4V6a4 4 0 0 1 4-4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 14v6M8 18l4 2 4-2M12 14a4 4 0 0 0 4-4h2a6 6 0 0 1-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div>
            <h1 style={{ ...sectionHeading, fontSize: '22px', letterSpacing: '-0.02em', margin: 0 }}>
              ARIA Intelligence
            </h1>
            <span style={{ fontFamily: F.body, fontSize: '13px', color: C.textSecondary }}>
              ARIA has analysed {campaignsAnalysed} campaigns and is continuously improving your results
            </span>
          </div>
        </div>
        <style>{`@keyframes ariaPulse { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.85; transform: scale(0.98); } }`}</style>
      </div>

      <div style={{ display: 'flex', gap: S[4], flexWrap: 'wrap' }}>
        <div style={{ flex: '1 1 140px', padding: S[5], backgroundColor: 'rgba(61,220,132,0.08)', border: `1px solid rgba(61,220,132,0.25)`, borderRadius: R.card }}>
          <div style={{ fontFamily: F.mono, fontSize: '22px', fontWeight: 700, color: C.primary }}>{campaignsAnalysed}</div>
          <div style={{ fontFamily: F.body, fontSize: '11px', color: C.textMuted, textTransform: 'uppercase' }}>Campaigns analysed</div>
        </div>
        <div style={{ flex: '1 1 140px', padding: S[5], backgroundColor: 'rgba(61,220,132,0.08)', border: `1px solid rgba(61,220,132,0.25)`, borderRadius: R.card }}>
          <div style={{ fontFamily: F.mono, fontSize: '22px', fontWeight: 700, color: C.primary }}>{datasetsLearned}</div>
          <div style={{ fontFamily: F.body, fontSize: '11px', color: C.textMuted, textTransform: 'uppercase' }}>Insights applied</div>
        </div>
        <div style={{ flex: '1 1 140px', padding: S[5], backgroundColor: 'rgba(61,220,132,0.08)', border: `1px solid rgba(61,220,132,0.25)`, borderRadius: R.card }}>
          <div style={{ fontFamily: F.mono, fontSize: '22px', fontWeight: 700, color: C.primary }}>{accuracyImprovement}</div>
          <div style={{ fontFamily: F.body, fontSize: '11px', color: C.textMuted, textTransform: 'uppercase' }}>Accuracy improvement</div>
        </div>
        <div style={{ flex: '1 1 140px', padding: S[5], backgroundColor: 'rgba(61,220,132,0.08)', border: `1px solid rgba(61,220,132,0.25)`, borderRadius: R.card }}>
          <div style={{ fontFamily: F.mono, fontSize: '22px', fontWeight: 700, color: C.primary }}>{confidenceLevel}%</div>
          <div style={{ fontFamily: F.body, fontSize: '11px', color: C.textMuted, textTransform: 'uppercase' }}>Confidence level</div>
        </div>
      </div>

      <section>
        <LearningFeed entries={LEARNING_ENTRIES} />
      </section>

      <section>
        <h3 style={{ fontFamily: F.display, fontSize: '16px', fontWeight: 700, color: C.textPrimary, margin: '0 0 16px' }}>
          Content performance intelligence
        </h3>
        <div style={{ display: 'flex', gap: S[4], flexWrap: 'wrap' }}>
          <div style={{ flex: '1 1 200px', padding: S[5], backgroundColor: C.surface, border: `1px solid ${C.border}`, borderRadius: R.card }}>
            <div style={{ fontFamily: F.mono, fontSize: '10px', color: C.textMuted, textTransform: 'uppercase', marginBottom: S[2] }}>Best performing angle</div>
            <div style={{ fontFamily: F.body, fontSize: '14px', fontWeight: 600, color: C.textPrimary }}>{CONTENT_PERFORMANCE.topPerformingAngle.label}</div>
            <div style={{ fontFamily: F.mono, fontSize: '13px', color: C.primary }}>{CONTENT_PERFORMANCE.topPerformingAngle.stat}</div>
            <div style={{ fontFamily: F.body, fontSize: '11px', color: C.textMuted, marginTop: S[2] }}>{CONTENT_PERFORMANCE.topPerformingAngle.vsPrevious}</div>
          </div>
          <div style={{ flex: '1 1 200px', padding: S[5], backgroundColor: C.surface, border: `1px solid ${C.border}`, borderRadius: R.card }}>
            <div style={{ fontFamily: F.mono, fontSize: '10px', color: C.textMuted, textTransform: 'uppercase', marginBottom: S[2] }}>Best subject line pattern</div>
            <div style={{ fontFamily: F.body, fontSize: '14px', fontWeight: 600, color: C.textPrimary }}>{CONTENT_PERFORMANCE.topSubjectLine.label}</div>
            <div style={{ fontFamily: F.mono, fontSize: '13px', color: C.primary }}>{CONTENT_PERFORMANCE.topSubjectLine.stat}</div>
            <div style={{ fontFamily: F.body, fontSize: '11px', color: C.textMuted, marginTop: S[2] }}>{CONTENT_PERFORMANCE.topSubjectLine.vsPrevious}</div>
          </div>
          <div style={{ flex: '1 1 200px', padding: S[5], backgroundColor: C.surface, border: `1px solid ${C.border}`, borderRadius: R.card }}>
            <div style={{ fontFamily: F.mono, fontSize: '10px', color: C.textMuted, textTransform: 'uppercase', marginBottom: S[2] }}>Best CTA</div>
            <div style={{ fontFamily: F.body, fontSize: '14px', fontWeight: 600, color: C.textPrimary }}>{CONTENT_PERFORMANCE.topCTA.label}</div>
            <div style={{ fontFamily: F.mono, fontSize: '13px', color: C.primary }}>{CONTENT_PERFORMANCE.topCTA.stat}</div>
            <div style={{ fontFamily: F.body, fontSize: '11px', color: C.textMuted, marginTop: S[2] }}>{CONTENT_PERFORMANCE.topCTA.vsPrevious}</div>
          </div>
        </div>
        <div style={{ marginTop: S[4], padding: S[4], backgroundColor: 'rgba(245,200,66,0.08)', border: `1px solid rgba(245,200,66,0.25)`, borderRadius: R.card }}>
          <div style={{ fontFamily: F.mono, fontSize: '10px', color: C.amber, textTransform: 'uppercase', marginBottom: S[1] }}>Worst performing</div>
          <div style={{ fontFamily: F.body, fontSize: '13px', color: C.textPrimary }}>{CONTENT_PERFORMANCE.worstPerforming.label} · {CONTENT_PERFORMANCE.worstPerforming.stat}</div>
          <div style={{ fontFamily: F.body, fontSize: '12px', color: C.textSecondary }}>{CONTENT_PERFORMANCE.worstPerforming.note}</div>
        </div>
      </section>

      <section>
        <CrossCampaignInsights benchmarks={BENCHMARK_DATA} />
      </section>

      <section>
        <PerformanceTrendChart data={ACCURACY_TREND_DATA} />
      </section>
    </div>
  );
}
