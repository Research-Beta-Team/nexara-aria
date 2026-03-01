import useToast from '../../../hooks/useToast';
import { C, F, R, S, T, btn, badge, flex } from '../../../tokens';
import { metaCampaigns } from '../../../data/campaigns';

const STATUS_BADGE = {
  active: { ...badge.base, ...badge.green },
  paused: { ...badge.base, ...badge.amber },
};

function MetaCampaignCard({ camp }) {
  const toast = useToast();
  const { name, status, spend, budget, cpl, ctr, frequency, leads, anomaly } = camp;
  const spendPct = Math.min(100, Math.round((spend / budget) * 100));
  const freqWarning = frequency > 4;

  return (
    <div style={{
      backgroundColor: C.surface2,
      border: `1px solid ${anomaly ? C.amber : C.border}`,
      borderRadius: R.card,
      padding: S[4],
      display: 'flex',
      flexDirection: 'column',
      gap: S[3],
    }}>
      {/* Header */}
      <div style={flex.rowBetween}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          <span style={{ fontFamily: F.body, fontSize: '13px', fontWeight: 600, color: C.textPrimary }}>{name}</span>
        </div>
        <span style={STATUS_BADGE[status] ?? STATUS_BADGE.paused}>{status}</span>
      </div>

      {/* Anomaly alert */}
      {anomaly && (
        <div style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: S[2],
          backgroundColor: 'rgba(245,200,66,0.08)',
          border: `1px solid rgba(245,200,66,0.2)`,
          borderRadius: R.md,
          padding: `${S[1]} ${S[3]}`,
        }}>
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none" style={{ flexShrink: 0, marginTop: '1px' }}>
            <path d="M6.5 1.5L12 11H1L6.5 1.5Z" stroke={C.amber} strokeWidth="1.3" strokeLinejoin="round"/>
            <path d="M6.5 5v3M6.5 9.5v.3" stroke={C.amber} strokeWidth="1.3" strokeLinecap="round"/>
          </svg>
          <span style={{ fontFamily: F.body, fontSize: '12px', color: C.amber }}>{anomaly}</span>
        </div>
      )}

      {/* Spend / budget bar */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: S[1] }}>
        <div style={flex.rowBetween}>
          <span style={{ fontFamily: F.body, fontSize: '11px', color: C.textMuted }}>Spend / Budget</span>
          <span style={{ fontFamily: F.mono, fontSize: '11px', color: C.textPrimary }}>
            ${spend.toLocaleString()} / ${budget.toLocaleString()}
          </span>
        </div>
        <div style={{ height: '5px', borderRadius: R.pill, backgroundColor: C.surface3, overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${spendPct}%`, borderRadius: R.pill, backgroundColor: spendPct > 85 ? C.amber : C.primary }}/>
        </div>
      </div>

      {/* Metrics grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: S[3] }}>
        {[
          { l: 'CPL',       v: `$${cpl}` },
          { l: 'CTR',       v: `${ctr}%` },
          { l: 'Frequency', v: frequency.toFixed(1), warn: freqWarning },
          { l: 'Leads',     v: leads },
        ].map(({ l, v, warn }) => (
          <div key={l} style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <span style={{ fontFamily: F.body, fontSize: '10px', color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{l}</span>
            <span style={{ fontFamily: F.mono, fontSize: '14px', fontWeight: 700, color: warn ? C.amber : C.textPrimary, lineHeight: 1 }}>{v}</span>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: S[2], justifyContent: 'space-between', alignItems: 'center' }}>
        <button
          style={{ fontFamily: F.body, fontSize: '11px', color: C.secondary, backgroundColor: 'transparent', border: 'none', cursor: 'pointer', padding: 0 }}
          onClick={() => toast.info('Opening Meta Business Suite…')}
        >
          Open in Meta Business Suite ↗
        </button>
        <div style={{ display: 'flex', gap: S[2] }}>
          <button
            style={{ ...btn.secondary, fontSize: '12px', padding: `3px ${S[3]}` }}
            onClick={() => toast.warning(`"${name}" paused`)}
          >
            Pause
          </button>
          <button
            style={{ ...btn.primary, fontSize: '12px', padding: `3px ${S[3]}` }}
            onClick={() => toast.success(`Scaling "${name}" by 20%`)}
          >
            Scale
          </button>
        </div>
      </div>
    </div>
  );
}

export default function PaidAdsTab() {
  const toast = useToast();
  const totalSpend = metaCampaigns.reduce((s, c) => s + c.spend, 0);
  const totalLeads = metaCampaigns.reduce((s, c) => s + c.leads, 0);

  return (
    <div style={{ padding: S[5], display: 'flex', flexDirection: 'column', gap: S[5] }}>
      {/* Meta header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: S[3] }}>
          {/* Meta icon */}
          <div style={{
            width: '32px', height: '32px', borderRadius: R.md,
            backgroundColor: '#1877F2', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="white">
              <path d="M8 2C4.686 2 2 4.686 2 8s2.686 6 6 6 6-2.686 6-6-2.686-6-6-6zm0 2c1.104 0 2 .896 2 2s-.896 2-2 2-2-.896-2-2 .896-2 2-2zm0 9c-1.657 0-3.13-.846-4-2.13.02-1.322 2.667-2.054 4-2.054 1.326 0 3.976.732 4 2.054C11.13 12.154 9.657 13 8 13z"/>
            </svg>
          </div>
          <div>
            <div style={{ fontFamily: F.display, fontSize: '15px', fontWeight: 700, color: C.textPrimary }}>Meta Ads</div>
            <div style={{ fontFamily: F.body, fontSize: '12px', color: C.textSecondary }}>{metaCampaigns.length} campaigns · ${totalSpend.toLocaleString()} spend · {totalLeads} leads</div>
          </div>
        </div>
        <button style={{ ...btn.secondary, fontSize: '13px' }} onClick={() => toast.info('Syncing with Meta Business Suite…')}>
          Sync
        </button>
      </div>

      {/* Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: S[3] }}>
        {metaCampaigns.map((c) => (
          <MetaCampaignCard key={c.id} camp={c} />
        ))}
      </div>
    </div>
  );
}
