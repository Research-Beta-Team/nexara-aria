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

export default function IntentSignals() {
  const toast = useToast();

  return (
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
      {/* Page header */}
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
                backgroundColor: `${C.primary}18`,
                border: `1px solid ${C.primary}`,
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
          <p style={{ fontFamily: F.body, fontSize: '13px', color: C.textSecondary, margin: 0 }}>
            Monitoring 847 accounts · 20 new signals in last 24h
          </p>
        </div>
        <div style={{ display: 'flex', gap: S[2] }}>
          <button style={{ ...btn.secondary, fontSize: '13px' }} onClick={() => toast.info('Configure signals')}>
            Configure signals
          </button>
          <button style={{ ...btn.secondary, fontSize: '13px' }} onClick={() => toast.info('Alert settings')}>
            Alert settings
          </button>
        </div>
      </div>

      {/* Top stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: S[4] }}>
        {[
          { value: STATS.newToday, label: 'New signals today' },
          { value: STATS.highIntentAccounts, label: 'High intent accounts' },
          { value: STATS.actionedToday, label: 'Actioned today' },
          { value: STATS.avgScore, label: 'Avg score' },
        ].map((s) => (
          <div key={s.label} style={{ ...cardStyle, padding: S[4] }}>
            <span style={{ ...statNumber, fontSize: '24px' }}>{s.value}</span>
            <span style={{ ...statLabel, display: 'block', marginTop: 4 }}>{s.label}</span>
          </div>
        ))}
      </div>

      {/* Main: two columns */}
      <div style={{ display: 'flex', gap: S[5], flex: 1, minHeight: 0 }}>
        <div style={{ width: 680, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          <SignalTypeBreakdown signals={INTENT_SIGNALS} />
          <div style={{ marginTop: S[3], flex: 1, display: 'flex', flexDirection: 'column', minHeight: 200, ...scrollbarStyle }}>
            <SignalFeed
              signals={INTENT_SIGNALS}
              onAddToSequence={() => {}}
              onViewAccount={() => {}}
              onDismiss={() => {}}
              onAskAria={() => {}}
              toast={toast}
            />
          </div>
        </div>
        <div style={{ width: 340, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: S[3], ...scrollbarStyle }}>
          <h2 style={{ ...sectionHeading, fontSize: '14px', marginBottom: 0 }}>Highest Intent Right Now</h2>
          {ACCOUNT_INTENT_SCORES.map((acc) => (
            <AccountIntentCard
              key={acc.account}
              account={acc}
              onOutreach={() => {}}
              onViewInCrm={() => {}}
              toast={toast}
            />
          ))}
        </div>
      </div>

      {/* Signal trend chart */}
      <div style={{ ...cardStyle, padding: S[5] }}>
        <h3 style={{ fontFamily: F.mono, fontSize: '11px', fontWeight: 700, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.08em', margin: `0 0 ${S[4]}` }}>
          Signal trend (last 14 days)
        </h3>
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
              <Line type="monotone" dataKey="total" name="Total signals" stroke="#3DDC84" strokeWidth={2} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="highIntent" name="High intent (>80)" stroke="#F5C842" strokeWidth={2} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="actioned" name="Actioned" stroke="#5EEAD4" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ARIA recommendation strip */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: S[3],
          padding: S[4],
          backgroundColor: `${C.primary}12`,
          border: `1px solid ${C.primary}40`,
          borderRadius: R.card,
        }}
      >
        <p style={{ fontFamily: F.body, fontSize: '14px', color: C.textPrimary, margin: 0, flex: 1, minWidth: 0 }}>
          <strong style={{ color: C.primary }}>ARIA recommends:</strong> {ARIA_RECOMMENDATION.summary}
        </p>
        <button
          style={{ ...btn.primary, fontSize: '13px', flexShrink: 0 }}
          onClick={() => toast.info(ARIA_RECOMMENDATION.ctaLabel)}
        >
          {ARIA_RECOMMENDATION.ctaLabel}
        </button>
      </div>
    </div>
  );
}
