import { C, F, R, S, btn, badge } from '../../tokens';
import {
  T3_PROGRAM_METRICS,
  T3_QUALIFICATION_PIPELINE,
  T3_EXCEPTIONS,
} from '../../data/abmControl';

const SEVERITY_STYLE = {
  high: { ...badge.base, ...badge.red },
  medium: { ...badge.base, ...badge.amber },
  low: { ...badge.base, ...badge.muted },
};

export default function ABMT3View({ onBack, toast }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: S[6], padding: S[6], height: '100%', overflow: 'auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: S[4] }}>
        <button style={{ ...btn.ghost, fontSize: '13px' }} onClick={onBack}>
          ← Control dashboard
        </button>
        <h1 style={{ fontFamily: F.display, fontSize: '22px', fontWeight: 700, color: C.textPrimary, margin: 0 }}>
          T3 — AI Fully Automated
        </h1>
      </div>
      <p style={{ fontFamily: F.body, fontSize: '14px', color: C.textSecondary, margin: '-16px 0 0' }}>
        Program view. Set up quarterly; review exception reports weekly (~30 min). Human attention only when something unusual happens.
      </p>

      {/* Program metrics */}
      <div
        style={{
          padding: S[5],
          backgroundColor: C.surface,
          border: `1px solid ${C.border}`,
          borderRadius: R.card,
        }}
      >
        <h2 style={{ fontFamily: F.display, fontSize: '14px', fontWeight: 700, color: C.textPrimary, margin: '0 0 12px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          Sequence performance
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: S[5] }}>
          <div>
            <div style={{ fontFamily: F.mono, fontSize: '24px', fontWeight: 700, color: C.primary }}>{T3_PROGRAM_METRICS.totalAccounts}</div>
            <div style={{ fontFamily: F.body, fontSize: '12px', color: C.textSecondary }}>Total accounts</div>
          </div>
          <div>
            <div style={{ fontFamily: F.mono, fontSize: '24px', fontWeight: 700, color: C.primary }}>{T3_PROGRAM_METRICS.inSequence}</div>
            <div style={{ fontFamily: F.body, fontSize: '12px', color: C.textSecondary }}>In sequence</div>
          </div>
          <div>
            <div style={{ fontFamily: F.mono, fontSize: '24px', fontWeight: 700, color: C.primary }}>{(T3_PROGRAM_METRICS.openRate * 100).toFixed(0)}%</div>
            <div style={{ fontFamily: F.body, fontSize: '12px', color: C.textSecondary }}>Open rate</div>
          </div>
          <div>
            <div style={{ fontFamily: F.mono, fontSize: '24px', fontWeight: 700, color: C.primary }}>{(T3_PROGRAM_METRICS.replyRate * 100).toFixed(0)}%</div>
            <div style={{ fontFamily: F.body, fontSize: '12px', color: C.textSecondary }}>Reply rate</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: S[6], marginTop: S[4], flexWrap: 'wrap' }}>
          <span style={{ fontFamily: F.body, fontSize: '13px', color: C.textSecondary }}>Qualified this month: <strong style={{ color: C.primary }}>{T3_PROGRAM_METRICS.qualifiedThisMonth}</strong></span>
          <span style={{ fontFamily: F.body, fontSize: '13px', color: C.textSecondary }}>Meetings booked: <strong style={{ color: C.primary }}>{T3_PROGRAM_METRICS.meetingsBooked}</strong></span>
          <span style={{ fontFamily: F.body, fontSize: '13px', color: C.textSecondary }}>Avg sequence length: <strong style={{ color: C.primary }}>{T3_PROGRAM_METRICS.avgSequenceLength}</strong> touches</span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: S[6] }}>
        {/* Qualification pipeline */}
        <div
          style={{
            padding: S[5],
            backgroundColor: C.surface,
            border: `1px solid ${C.border}`,
            borderRadius: R.card,
          }}
        >
          <h2 style={{ fontFamily: F.display, fontSize: '14px', fontWeight: 700, color: C.textPrimary, margin: '0 0 12px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Qualification pipeline
          </h2>
          <p style={{ fontFamily: F.body, fontSize: '12px', color: C.textSecondary, marginBottom: S[4] }}>
            When T3 account reaches threshold, AI recommends T2 or T1 handoff.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: S[2] }}>
            {T3_QUALIFICATION_PIPELINE.map((q, i) => (
              <div
                key={i}
                style={{
                  padding: S[4],
                  backgroundColor: C.surface2,
                  border: `1px solid ${C.border}`,
                  borderRadius: R.sm,
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontFamily: F.body, fontWeight: 600, color: C.textPrimary }}>{q.company}</span>
                  <span style={{ fontFamily: F.mono, fontSize: '12px', color: C.primary }}>Score {q.score}</span>
                </div>
                <div style={{ fontFamily: F.body, fontSize: '12px', color: C.textSecondary }}>{q.stage}</div>
                <div style={{ fontFamily: F.body, fontSize: '12px', color: C.primary, marginTop: 4 }}>{q.recommendedAction}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Exceptions — human review */}
        <div
          style={{
            padding: S[5],
            backgroundColor: C.surface,
            border: `1px solid ${C.border}`,
            borderRadius: R.card,
          }}
        >
          <h2 style={{ fontFamily: F.display, fontSize: '14px', fontWeight: 700, color: C.textPrimary, margin: '0 0 12px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Exceptions requiring human review
          </h2>
          <p style={{ fontFamily: F.body, fontSize: '12px', color: C.textSecondary, marginBottom: S[4] }}>
            Qualification threshold, outside parameters, negative sentiment, high-value engagement, or playbook performance.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: S[2] }}>
            {T3_EXCEPTIONS.map((ex) => (
              <div
                key={ex.id}
                style={{
                  padding: S[4],
                  backgroundColor: ex.severity === 'high' ? 'rgba(255,110,122,0.08)' : C.surface2,
                  border: `1px solid ${ex.severity === 'high' ? 'rgba(255,110,122,0.3)' : C.border}`,
                  borderRadius: R.sm,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: S[2], marginBottom: 4 }}>
                  <span style={{ ...SEVERITY_STYLE[ex.severity], fontSize: '10px' }}>{ex.severity}</span>
                  {ex.company && <span style={{ fontFamily: F.body, fontWeight: 600, color: C.textPrimary }}>{ex.company}</span>}
                  <span style={{ fontFamily: F.mono, fontSize: '11px', color: C.textMuted }}>{ex.createdAt}</span>
                </div>
                <div style={{ fontFamily: F.body, fontSize: '13px', color: C.textPrimary }}>{ex.message}</div>
                <button
                  style={{ ...btn.secondary, fontSize: '11px', marginTop: S[2] }}
                  onClick={() => toast?.success('Exception reviewed')}
                >
                  Mark reviewed
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
