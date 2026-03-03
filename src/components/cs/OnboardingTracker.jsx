import useToast from '../../hooks/useToast';
import { C, F, R, S, btn } from '../../tokens';

export default function OnboardingTracker({ customers, toast }) {
  const inOnboarding = (customers || []).filter((c) => c.onboarding && !c.onboarding.complete);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: S[5] }}>
      {inOnboarding.length === 0 ? (
        <div style={{ fontFamily: F.body, fontSize: '14px', color: C.textSecondary }}>
          No customers currently in onboarding.
        </div>
      ) : (
        inOnboarding.map((c) => {
          const ob = c.onboarding || {};
          const stepsDone = ob.completedSteps ?? 0;
          const total = ob.totalSteps ?? 8;
          const pct = total ? Math.round((stepsDone / total) * 100) : 0;
          return (
            <div
              key={c.id}
              style={{
                backgroundColor: C.surface,
                border: `1px solid ${C.border}`,
                borderRadius: R.card,
                padding: S[6],
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: S[4] }}>
                <h3 style={{ fontFamily: F.display, fontSize: '16px', fontWeight: 700, color: C.textPrimary, margin: 0 }}>
                  {c.name}
                </h3>
                <span style={{ fontFamily: F.mono, fontSize: '12px', color: C.textSecondary }}>
                  {stepsDone}/{total} steps · {ob.daysToValue ?? '—'} days to value
                </span>
              </div>
              <div style={{ marginBottom: S[4] }}>
                <div style={{ height: 8, borderRadius: 999, backgroundColor: C.surface3, overflow: 'hidden' }}>
                  <div
                    style={{
                      width: `${pct}%`,
                      height: '100%',
                      backgroundColor: C.primary,
                      borderRadius: 999,
                    }}
                  />
                </div>
              </div>
              {ob.blocker && (
                <div
                  style={{
                    padding: S[4],
                    backgroundColor: 'rgba(245,200,66,0.1)',
                    border: `1px solid rgba(245,200,66,0.25)`,
                    borderRadius: R.sm,
                    marginBottom: S[4],
                  }}
                >
                  <div style={{ fontFamily: F.mono, fontSize: '10px', color: C.amber, textTransform: 'uppercase', marginBottom: S[2] }}>
                    Blocker
                  </div>
                  <div style={{ fontFamily: F.body, fontSize: '13px', color: C.textPrimary }}>
                    {ob.blocker} <span style={{ color: C.textSecondary }}>({ob.blockerDays ?? 0} days)</span>
                  </div>
                </div>
              )}
              <div style={{ display: 'flex', gap: S[2] }}>
                <button style={{ ...btn.secondary, fontSize: '13px' }} onClick={() => toast?.success('Help article sent')}>
                  Send help article
                </button>
                <button style={{ ...btn.primary, fontSize: '13px' }} onClick={() => toast?.info('Onboarding call scheduled')}>
                  Schedule onboarding call
                </button>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
