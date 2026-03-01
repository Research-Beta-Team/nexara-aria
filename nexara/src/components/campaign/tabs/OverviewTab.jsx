import { C, F, R, S, badge, flex } from '../../../tokens';

// ── Funnel bar ────────────────────────────────
function FunnelBar({ stage, count, color, max }) {
  const pct = Math.round((count / max) * 100);
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: S[3] }}>
      <span style={{ fontFamily: F.body, fontSize: '12px', color: C.textSecondary, width: '90px', flexShrink: 0 }}>{stage}</span>
      <div style={{ flex: 1, height: '20px', backgroundColor: C.surface3, borderRadius: R.md, overflow: 'hidden' }}>
        <div style={{
          height: '100%',
          width: `${pct}%`,
          backgroundColor: color,
          borderRadius: R.md,
          display: 'flex',
          alignItems: 'center',
          paddingLeft: S[2],
          transition: 'width 0.5s ease',
          minWidth: '40px',
        }}>
          <span style={{ fontFamily: F.mono, fontSize: '11px', fontWeight: 700, color: pct > 15 ? C.textInverse : C.textPrimary, whiteSpace: 'nowrap' }}>
            {count.toLocaleString()}
          </span>
        </div>
      </div>
      <span style={{ fontFamily: F.mono, fontSize: '11px', color: C.textMuted, width: '38px', flexShrink: 0, textAlign: 'right' }}>{pct}%</span>
    </div>
  );
}

// ── Channel row ───────────────────────────────
function ChannelRow({ channel, spend, leads, cpl, ctr, share, isLast }) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '110px 1fr 60px 60px 60px 60px',
      gap: S[3],
      alignItems: 'center',
      padding: `${S[2]} ${S[4]}`,
      borderBottom: isLast ? 'none' : `1px solid ${C.border}`,
    }}>
      <span style={{ fontFamily: F.mono, fontSize: '12px', fontWeight: 700, color: C.textPrimary }}>{channel}</span>
      <div style={{ height: '5px', borderRadius: R.pill, backgroundColor: C.surface3 }}>
        <div style={{ height: '100%', width: `${share}%`, borderRadius: R.pill, backgroundColor: C.primary }}/>
      </div>
      <span style={{ fontFamily: F.mono, fontSize: '12px', color: C.textPrimary }}>${spend.toLocaleString()}</span>
      <span style={{ fontFamily: F.mono, fontSize: '12px', color: C.textPrimary }}>{leads}</span>
      <span style={{ fontFamily: F.mono, fontSize: '12px', color: C.textPrimary }}>${cpl}</span>
      <span style={{ fontFamily: F.mono, fontSize: '12px', color: C.textPrimary }}>{ctr}</span>
    </div>
  );
}

// ── Milestone ─────────────────────────────────
function Milestone({ date, label, done, isLast }) {
  return (
    <div style={{ display: 'flex', gap: S[3], alignItems: 'flex-start' }}>
      {/* Spine */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
        <div style={{
          width: '14px', height: '14px', borderRadius: '50%',
          backgroundColor: done ? C.primary : C.surface3,
          border: `2px solid ${done ? C.primary : C.border}`,
          boxShadow: done ? `0 0 6px ${C.primary}` : 'none',
          flexShrink: 0,
        }}/>
        {!isLast && <div style={{ width: '2px', flex: 1, minHeight: '24px', backgroundColor: C.border, marginTop: '2px' }}/>}
      </div>
      <div style={{ paddingBottom: S[3] }}>
        <span style={{ fontFamily: F.body, fontSize: '13px', color: done ? C.textPrimary : C.textSecondary }}>{label}</span>
        <div style={{ fontFamily: F.mono, fontSize: '11px', color: C.textMuted, marginTop: '2px' }}>{date}</div>
      </div>
    </div>
  );
}

export default function OverviewTab({ detail }) {
  const funnel     = detail?.funnel ?? [];
  const channels   = detail?.channelBreakdown ?? [];
  const milestones = detail?.milestones ?? [];
  const maxCount   = funnel[0]?.count ?? 1;

  const sectionHead = (title) => (
    <div style={{ fontFamily: F.display, fontSize: '13px', fontWeight: 700, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: S[3] }}>
      {title}
    </div>
  );

  const cardWrap = {
    backgroundColor: C.surface2,
    border: `1px solid ${C.border}`,
    borderRadius: R.card,
    overflow: 'hidden',
  };

  return (
    <div style={{ padding: S[5], display: 'flex', flexDirection: 'column', gap: S[6] }}>

      {/* Funnel */}
      <div>
        {sectionHead('Conversion Funnel')}
        <div style={{ ...cardWrap, padding: S[5], display: 'flex', flexDirection: 'column', gap: S[3] }}>
          {funnel.map((f) => (
            <FunnelBar key={f.stage} {...f} max={maxCount} />
          ))}
        </div>
      </div>

      {/* Channel breakdown */}
      <div>
        {sectionHead('Channel Breakdown')}
        <div style={cardWrap}>
          {/* Header */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '110px 1fr 60px 60px 60px 60px',
            gap: S[3],
            padding: `${S[2]} ${S[4]}`,
            borderBottom: `1px solid ${C.border}`,
          }}>
            {['Channel', 'Share', 'Spend', 'Leads', 'CPL', 'CTR'].map((h) => (
              <span key={h} style={{ fontFamily: F.body, fontSize: '11px', fontWeight: 600, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</span>
            ))}
          </div>
          {channels.map((ch, i) => (
            <ChannelRow key={ch.channel} {...ch} isLast={i === channels.length - 1} />
          ))}
        </div>
      </div>

      {/* Milestones */}
      <div>
        {sectionHead('Milestones')}
        <div style={{ paddingLeft: S[2] }}>
          {milestones.map((m, i) => (
            <Milestone key={m.date} {...m} isLast={i === milestones.length - 1} />
          ))}
        </div>
      </div>
    </div>
  );
}
