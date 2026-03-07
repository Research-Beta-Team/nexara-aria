import { C, F, R, S, btn, badge } from '../../tokens';
import {
  T2_CLUSTERS,
  T2_EXECUTION_SUMMARY,
  T2_ATTENTION_ACCOUNTS,
  T2_PROMOTION_CANDIDATES,
} from '../../data/abmControl';

function formatDeal(value) {
  if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
  return `$${value}`;
}

export default function ABMT2View({ onBack, onSelectAccount, toast }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: S[6], padding: S[6], height: '100%', overflow: 'auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: S[3] }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: S[4] }}>
          <button style={{ ...btn.ghost, fontSize: '13px' }} onClick={onBack}>
            ← Control dashboard
          </button>
          <h1 style={{ fontFamily: F.display, fontSize: '22px', fontWeight: 700, color: C.textPrimary, margin: 0 }}>
            T2 — Human Supervised, AI Semi-Automated
          </h1>
        </div>
      </div>
      <p style={{ fontFamily: F.body, fontSize: '14px', color: C.textSecondary, margin: '-16px 0 0' }}>
        Cluster view, exception-based. AI executes sequences; human approves C-suite outreach and promotion to T1.
      </p>

      {/* Execution summary this week */}
      <div
        style={{
          padding: S[5],
          backgroundColor: C.surface,
          border: `1px solid ${C.border}`,
          borderRadius: R.card,
        }}
      >
        <h2 style={{ fontFamily: F.display, fontSize: '14px', fontWeight: 700, color: C.textPrimary, margin: '0 0 12px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          AI execution this week
        </h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: S[6] }}>
          <div><span style={{ fontFamily: F.mono, color: C.primary }}>{T2_EXECUTION_SUMMARY.emailsSent}</span> <span style={{ color: C.textSecondary }}>emails sent</span></div>
          <div><span style={{ fontFamily: F.mono, color: C.primary }}>{T2_EXECUTION_SUMMARY.linkedInTouches}</span> <span style={{ color: C.textSecondary }}>LinkedIn touches</span></div>
          <div><span style={{ fontFamily: F.mono, color: C.primary }}>{T2_EXECUTION_SUMMARY.contentDelivered}</span> <span style={{ color: C.textSecondary }}>content delivered</span></div>
          <div><span style={{ fontFamily: F.mono, color: C.primary }}>{T2_EXECUTION_SUMMARY.accountsMoved}</span> <span style={{ color: C.textSecondary }}>accounts moved</span></div>
          <div><span style={{ fontFamily: F.mono, color: C.amber }}>{T2_EXECUTION_SUMMARY.awaitingApproval}</span> <span style={{ color: C.textSecondary }}>C-suite outreach pending approval</span></div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: S[6] }}>
        {/* Accounts needing attention */}
        <div
          style={{
            padding: S[5],
            backgroundColor: C.surface,
            border: `1px solid ${C.border}`,
            borderRadius: R.card,
          }}
        >
          <h2 style={{ fontFamily: F.display, fontSize: '14px', fontWeight: 700, color: C.textPrimary, margin: '0 0 12px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Accounts needing attention
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: S[2] }}>
            {T2_ATTENTION_ACCOUNTS.map((acc) => (
              <button
                key={acc.id}
                onClick={() => { onSelectAccount?.(acc.id); toast?.info(`Opening ${acc.name}`); }}
                style={{
                  textAlign: 'left',
                  padding: S[4],
                  backgroundColor: C.surface2,
                  border: `1px solid ${C.border}`,
                  borderRadius: R.sm,
                  cursor: 'pointer',
                }}
              >
                <div style={{ fontFamily: F.body, fontWeight: 600, color: C.textPrimary }}>{acc.name}</div>
                <div style={{ fontFamily: F.body, fontSize: '12px', color: C.textSecondary }}>{acc.reason}</div>
                <span style={{ ...badge.base, ...badge.muted, fontSize: '10px', marginTop: 4 }}>{acc.cluster}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Promotion candidates to T1 */}
        <div
          style={{
            padding: S[5],
            backgroundColor: 'rgba(94,234,212,0.06)',
            border: '1px solid rgba(94,234,212,0.25)',
            borderRadius: R.card,
          }}
        >
          <h2 style={{ fontFamily: F.display, fontSize: '14px', fontWeight: 700, color: C.secondary, margin: '0 0 12px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Promotion candidates → T1
          </h2>
          <p style={{ fontFamily: F.body, fontSize: '12px', color: C.textSecondary, marginBottom: S[4] }}>
            AI recommends; VP approves move to T1.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: S[3] }}>
            {T2_PROMOTION_CANDIDATES.map((c) => (
              <div
                key={c.id}
                style={{
                  padding: S[4],
                  backgroundColor: C.surface2,
                  border: `1px solid ${C.border}`,
                  borderRadius: R.sm,
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ fontFamily: F.body, fontWeight: 600, color: C.textPrimary }}>{c.name}</div>
                    <div style={{ fontFamily: F.body, fontSize: '12px', color: C.textSecondary }}>{c.signals}</div>
                  </div>
                  <span style={{ fontFamily: F.mono, fontSize: '12px', color: C.primary }}>{formatDeal(c.estimatedDeal)}</span>
                </div>
                <button
                  style={{ ...btn.secondary, fontSize: '12px', marginTop: S[2] }}
                  onClick={() => toast?.success(`Promotion to T1 requested for ${c.name}`)}
                >
                  Approve promotion to T1
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Clusters */}
      <div
        style={{
          padding: S[5],
          backgroundColor: C.surface,
          border: `1px solid ${C.border}`,
          borderRadius: R.card,
        }}
      >
        <h2 style={{ fontFamily: F.display, fontSize: '14px', fontWeight: 700, color: C.textPrimary, margin: '0 0 12px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          Clusters (segment view)
        </h2>
        <p style={{ fontFamily: F.body, fontSize: '13px', color: C.textSecondary, marginBottom: S[4] }}>
          Supervisor spends 2–3 hours/week on T2 oversight. Review execution and attention flags per cluster.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: S[2] }}>
          {T2_CLUSTERS.map((cl) => (
            <div
              key={cl.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: S[5],
                padding: S[4],
                backgroundColor: C.surface2,
                border: `1px solid ${C.border}`,
                borderRadius: R.sm,
              }}
            >
              <div style={{ flex: 1, fontFamily: F.body, fontWeight: 600, color: C.textPrimary }}>{cl.name}</div>
              <div style={{ fontFamily: F.mono, fontSize: '12px', color: C.textSecondary }}>{cl.accountCount} accounts</div>
              <div style={{ fontFamily: F.body, fontSize: '12px', color: C.textSecondary }}>{cl.supervisor}</div>
              <div style={{ fontFamily: F.body, fontSize: '12px', color: C.textSecondary }}>{cl.playbook}</div>
              <div style={{ fontFamily: F.mono, fontSize: '12px', color: C.primary }}>{cl.executionThisWeek} touches this week</div>
              {cl.attentionCount > 0 && (
                <span style={{ ...badge.base, ...badge.amber, fontSize: '11px' }}>{cl.attentionCount} need attention</span>
              )}
              <button style={{ ...btn.ghost, fontSize: '12px' }} onClick={() => toast?.info(`Cluster ${cl.name} detail`)}>
                View
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
