import { useNavigate } from 'react-router-dom';
import useToast from '../../hooks/useToast';
import usePlan from '../../hooks/usePlan';
import { C, F, R, S, btn, cardStyle } from '../../tokens';
import MetaPerformanceWidget from '../../components/dashboard/MetaPerformanceWidget';
import { metaStats, ctrChartData } from '../../data/dashboard';
import { IconCheck, IconWarning, IconArrowRight } from '../../components/ui/Icons';

const AD_ACCOUNTS_MOCK = [
  { name: 'META — ACME CORP (CFO VN)', budget: '840/2,000', pct: 42, cpl: 14.24, ctr: '3.1%', alert: 'Budget nearly exhausted' },
  { name: 'META — BGMEA CAMPAIGN', budget: '1,200/1,500', pct: 80, cpl: 28.7, ctr: '1.2%', alert: 'Audience burnout detected' },
];

export default function DashboardMediaBuyer() {
  const navigate = useNavigate();
  const toast = useToast();
  const { hasFeature } = usePlan();

  return (
    <div style={{ padding: S[6], display: 'flex', flexDirection: 'column', gap: S[5], minHeight: '100%' }}>
      <div>
        <h1 style={{ fontFamily: F.display, fontSize: '22px', fontWeight: 800, color: C.textPrimary, margin: 0 }}>Paid Media Overview</h1>
        <span style={{ fontFamily: F.body, fontSize: '13px', color: C.textSecondary }}>Today · 2:30pm UTC</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: S[4] }}>
        {[
          { label: 'Total Spend', value: '$847 today', sub: '$2,140/mo' },
          { label: 'Total Leads', value: '59 today', sub: '312/mo' },
          { label: 'Avg CPL', value: '$14.24', sub: '▼ vs $18 target' },
          { label: 'Avg CTR', value: '3.1%', sub: '▲ vs 1.8% avg' },
        ].map((s, i) => (
          <div key={i} style={{ ...cardStyle, padding: S[4], textAlign: 'center' }}>
            <div style={{ fontFamily: F.mono, fontSize: '11px', color: C.textMuted, textTransform: 'uppercase' }}>{s.label}</div>
            <div style={{ fontFamily: F.mono, fontSize: '20px', fontWeight: 700, color: C.textPrimary }}>{s.value}</div>
            <div style={{ fontFamily: F.body, fontSize: '11px', color: C.textSecondary }}>{s.sub}</div>
          </div>
        ))}
      </div>
      <div>
        <h2 style={{ fontFamily: F.display, fontSize: '13px', fontWeight: 700, color: C.textMuted, textTransform: 'uppercase', margin: `0 0 ${S[3]}` }}>Active Ad Accounts</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: S[4] }}>
          {AD_ACCOUNTS_MOCK.map((acc, i) => (
            <div key={i} style={{ ...cardStyle, padding: S[5] }}>
              <div style={{ fontFamily: F.display, fontSize: '14px', fontWeight: 700, color: C.textPrimary }}>{acc.name}</div>
              <div style={{ marginTop: S[2], fontFamily: F.body, fontSize: '12px', color: C.textSecondary, display: 'flex', alignItems: 'center', gap: S[1] }}>
                Budget: ${acc.budget} · CPL: ${acc.cpl} <IconCheck color={C.green} width={14} height={14} /> CTR: {acc.ctr} <IconCheck color={C.green} width={14} height={14} />
              </div>
              {acc.alert && (
                <div style={{ marginTop: S[2], fontFamily: F.body, fontSize: '12px', color: C.amber, display: 'flex', alignItems: 'center', gap: S[1] }}>
                  <IconWarning width={14} height={14} /> ALERT: {acc.alert}. <button style={{ ...btn.ghost, fontSize: '12px', padding: 0 }} onClick={() => toast.info('Action')}>Top up / Refresh</button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      {hasFeature('metaAdsMonitoring') && (
        <MetaPerformanceWidget stats={metaStats} chartData={ctrChartData} />
      )}
      <div style={{ ...cardStyle, padding: S[4], border: `1px solid ${C.border}` }}>
        <div style={{ fontFamily: F.body, fontSize: '13px', color: C.textPrimary }}>Freya Optimization Queue — "Reallocate $800 from Meta Set 3 → LinkedIn [87% confidence]"</div>
        <div style={{ display: 'flex', gap: S[2], marginTop: S[3] }}>
          <button style={{ ...btn.primary, fontSize: '12px' }} onClick={() => toast.info('Execute')}>Execute top recommendation</button>
          <button style={{ ...btn.secondary, fontSize: '12px', display: 'inline-flex', alignItems: 'center', gap: S[1] }} onClick={() => toast.info('Review all')}>Review all <IconArrowRight width={14} height={14} /></button>
        </div>
      </div>
    </div>
  );
}
