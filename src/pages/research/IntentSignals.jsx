import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import useToast from '../../hooks/useToast';
import usePlan from '../../hooks/usePlan';
import PlanGate from '../../components/plan/PlanGate';
import LimitWarning from '../../components/plan/LimitWarning';
import { C, F, R, S, btn, cardStyle, statNumber, statLabel, sectionHeading, scrollbarStyle } from '../../tokens';
import {
  INTENT_SIGNALS,
  ACCOUNT_INTENT_SCORES,
  SIGNAL_TREND_CHART_DATA,
  ARIA_RECOMMENDATION,
} from '../../data/intentSignals';
import SignalFeed from '../../components/intent/SignalFeed';
import AccountIntentCard from '../../components/intent/AccountIntentCard';
import SignalTypeBreakdown from '../../components/intent/SignalTypeBreakdown';

const STATS = {
  newToday: 20,
  highIntentAccounts: 8,
  actionedToday: 12,
  avgScore: 67,
};

// Mock usage for prototype (replace with store or API)
const MOCK_ACCOUNTS_TRACKED = 420;
const MOCK_ACCOUNTS_LIMIT = 500;

export default function IntentSignals() {
  const toast = useToast();
  const { getLimit, isLimitReached } = usePlan();
  const limit = getLimit('intentSignalAccounts');
  const usage = MOCK_ACCOUNTS_TRACKED;
  const atLimit = limit !== -1 && isLimitReached('intentSignalAccounts', usage);
  const showUsage = limit !== -1 && limit > 0;

  return (
    <PlanGate feature="intentSignals" requiredPlan="growth">
      <div
        style={{
          padding: S[6],
          display: 'flex',
          flexDirection: 'column',
          gap: S[5],
          minHeight: '100%',
          backgroundColor: C.bg,
        }}
      >
        <style>{`@keyframes intentLivePulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }`}</style>

        {/* ── Header: purpose + workflow hint ───────────────── */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: S[3] }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: S[2], marginBottom: 4 }}>
              <h1 style={{ ...sectionHeading, fontSize: '22px', letterSpacing: '-0.02em', margin: 0 }}>
                Intent Signals
              </h1>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: `2px ${S[2]}`,
                  backgroundColor: C.primaryGlow,
                  border: `1px solid ${C.border}`,
                  borderRadius: R.pill,
                  fontFamily: F.mono,
                  fontSize: '10px',
                  fontWeight: 700,
                  color: C.primary,
                  letterSpacing: '0.06em',
                }}
              >
                <span
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    backgroundColor: C.primary,
                    animation: 'intentLivePulse 1.5s ease-in-out infinite',
                  }}
                />
                LIVE
              </span>
            </div>
            <p style={{ fontFamily: F.body, fontSize: '13px', color: C.textSecondary, margin: 0, maxWidth: 520 }}>
              See which accounts are researching solutions like yours. Monitor → filter by type and score → add to sequence or start outreach. ARIA suggests next-best actions.
            </p>
          </div>
          <div style={{ display: 'flex', gap: S[2], flexShrink: 0 }}>
            <button type="button" style={{ ...btn.secondary, fontSize: '13px' }} onClick={() => toast.info('Configure signal sources')}>
              Configure signals
            </button>
            <button type="button" style={{ ...btn.secondary, fontSize: '13px' }} onClick={() => toast.info('Alert settings')}>
              Alert settings
            </button>
          </div>
        </div>

        {/* ── Usage / limit (when plan has cap) ───────────────── */}
        {showUsage && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: S[2],
              padding: S[3],
              backgroundColor: atLimit ? C.amberDim : C.surface2,
              border: `1px solid ${atLimit ? C.amber : C.border}`,
              borderRadius: R.card,
            }}
          >
            <span style={{ fontFamily: F.body, fontSize: '13px', color: C.textPrimary }}>
              Tracking <strong style={{ fontFamily: F.mono, color: C.primary }}>{usage}</strong>
              {limit !== -1 && ` / ${limit}`} accounts
            </span>
            {atLimit && <LimitWarning limitKey="intentSignalAccounts" currentUsage={usage} />}
          </div>
        )}

        {/* ── Stats: Monitor at a glance ─────────────────────── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: S[4] }}>
          {[
            { value: STATS.newToday, label: 'New signals today', hint: 'Last 24h' },
            { value: STATS.highIntentAccounts, label: 'High intent accounts', hint: 'Score ≥80' },
            { value: STATS.actionedToday, label: 'Actioned today', hint: 'Added or outreach' },
            { value: STATS.avgScore, label: 'Avg intent score', hint: 'Across feed' },
          ].map((s) => (
            <div key={s.label} style={{ ...cardStyle, padding: S[4] }}>
              <span style={{ ...statNumber, fontSize: '24px' }}>{s.value}</span>
              <span style={{ ...statLabel, display: 'block', marginTop: 4 }}>{s.label}</span>
              {s.hint && (
                <span style={{ fontFamily: F.mono, fontSize: '10px', color: C.textMuted, marginTop: 2, display: 'block' }}>{s.hint}</span>
              )}
            </div>
          ))}
        </div>

        {/* ── Main: Triage (feed + highest intent) ───────────── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: S[3], flex: 1, minHeight: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: S[2] }}>
            <h2 style={{ ...sectionHeading, fontSize: '14px', margin: 0 }}>
              Signal feed — filter, sort, act
            </h2>
            <span style={{ fontFamily: F.body, fontSize: '12px', color: C.textMuted }}>
              Add to sequence · Outreach · View account · Dismiss · Ask ARIA
            </span>
          </div>
          <div style={{ display: 'flex', gap: S[5], flex: 1, minHeight: 0 }}>
            <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: S[3] }}>
              <SignalTypeBreakdown signals={INTENT_SIGNALS} />
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 200, ...scrollbarStyle }}>
                <SignalFeed
                  signals={INTENT_SIGNALS}
                  onAddToSequence={() => toast.info('Add to sequence')}
                  onViewAccount={() => toast.info('View account')}
                  onDismiss={() => toast.info('Signal dismissed')}
                  onAskAria={() => toast.info('Ask ARIA')}
                  toast={toast}
                />
              </div>
            </div>
            <div style={{ width: 320, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: S[3], ...scrollbarStyle }}>
              <h3 style={{ fontFamily: F.mono, fontSize: '11px', fontWeight: 700, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.06em', margin: 0 }}>
                Highest intent right now
              </h3>
              <p style={{ fontFamily: F.body, fontSize: '12px', color: C.textSecondary, margin: 0, marginBottom: S[1] }}>
                Prioritize these accounts for outreach or add to sequence.
              </p>
              {ACCOUNT_INTENT_SCORES.map((acc) => (
                <AccountIntentCard
                  key={acc.account}
                  account={acc}
                  onOutreach={() => toast.info(`Starting outreach to ${acc.account}`)}
                  onViewInCrm={() => toast.info('Opening in CRM')}
                  toast={toast}
                />
              ))}
            </div>
          </div>
        </div>

        {/* ── Trend: Review & tune ────────────────────────────── */}
        <div style={{ ...cardStyle, padding: S[5] }}>
          <h3 style={{ fontFamily: F.mono, fontSize: '11px', fontWeight: 700, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.08em', margin: `0 0 ${S[2]}` }}>
            Signal trend — last 14 days
          </h3>
          <p style={{ fontFamily: F.body, fontSize: '12px', color: C.textSecondary, margin: `0 0 ${S[4]}` }}>
            Total signals, high intent (score &gt;80), and actioned. Use this to tune filters and sequences.
          </p>
          <div style={{ width: '100%', height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={SIGNAL_TREND_CHART_DATA} margin={{ top: 8, right: 16, left: 0, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
                <XAxis dataKey="date" tick={{ fontFamily: F.mono, fontSize: 11, fill: C.textMuted }} stroke={C.border} />
                <YAxis tick={{ fontFamily: F.mono, fontSize: 11, fill: C.textMuted }} stroke={C.border} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: C.surface2,
                    border: `1px solid ${C.border}`,
                    borderRadius: R.sm,
                    fontFamily: F.body,
                    fontSize: 12,
                  }}
                  labelStyle={{ color: C.textPrimary }}
                />
                <Legend
                  wrapperStyle={{ fontFamily: F.body, fontSize: 11 }}
                  formatter={(value) => <span style={{ color: C.textSecondary }}>{value}</span>}
                />
                <Line type="monotone" dataKey="total" name="Total signals" stroke={C.primary} strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="highIntent" name="High intent (>80)" stroke={C.amber} strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="actioned" name="Actioned" stroke={C.secondary} strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ── ARIA: Act on recommendation ──────────────────── */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: S[3],
            padding: S[4],
            backgroundColor: C.primaryGlow,
            border: `1px solid rgba(61,220,132,0.25)`,
            borderRadius: R.card,
            borderLeft: `4px solid ${C.primary}`,
          }}
        >
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: F.mono, fontSize: '10px', fontWeight: 700, color: C.primary, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>
              ARIA recommends
            </div>
            <p style={{ fontFamily: F.body, fontSize: '14px', color: C.textPrimary, margin: 0 }}>
              {ARIA_RECOMMENDATION.summary}
            </p>
          </div>
          <button
            type="button"
            style={{ ...btn.primary, fontSize: '13px', flexShrink: 0 }}
            onClick={() => toast.info(ARIA_RECOMMENDATION.ctaLabel)}
          >
            {ARIA_RECOMMENDATION.ctaLabel}
          </button>
        </div>
      </div>
    </PlanGate>
  );
}
