import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useStore from '../store/useStore';
import usePlan from '../hooks/usePlan';
import useToast from '../hooks/useToast';
import { C, F, R, S, T, btn, badge, flex, cardStyle, inputStyle, shadows } from '../tokens';
import { CHANNEL_COLORS as BRAND_CHANNEL_COLORS } from '../config/channelBrands';
import { campaigns } from '../data/campaigns';
import NewCampaignChoice from '../components/campaign/NewCampaignChoice';

// ── Status badge ──────────────────────────────
const STATUS_BADGE = {
  active:    { ...badge.base, ...badge.green },
  paused:    { ...badge.base, ...badge.amber },
  draft:     { ...badge.base, ...badge.muted },
  completed: { ...badge.base, backgroundColor: 'rgba(94,234,212,0.12)', color: '#5EEAD4', border: '1px solid rgba(94,234,212,0.2)' },
};

const HEALTH_COLOR = { on_track: C.primary, ahead: C.secondary, at_risk: C.red };
const CHANNEL_COLORS = { ...BRAND_CHANNEL_COLORS, Display: '#F5C842', Google: '#4285F4' };

// ── Campaign Card ─────────────────────────────
function CampaignCard({ campaign, onClick }) {
  const [hovered, setHovered] = useState(false);
  const { name, client, status, health, goal, current, spend, budget, cpl, ctr, channels } = campaign;
  const pct = Math.min(100, Math.round((current / goal) * 100));
  const barColor = HEALTH_COLOR[health] ?? C.primary;
  const spendPct = Math.min(100, Math.round((spend / budget) * 100));

  const cardWrap = {
    ...cardStyle,
    cursor: 'pointer',
    transition: T.base,
    display: 'flex',
    flexDirection: 'column',
    gap: S[4],
    boxShadow: hovered ? shadows.cardHover : 'none',
    borderColor: hovered ? C.borderHover : C.border,
    transform: hovered ? 'translateY(-1px)' : 'none',
  };

  const statPair = (label, value) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
      <span style={{ fontFamily: F.mono, fontSize: '14px', fontWeight: 700, color: C.textPrimary, lineHeight: 1 }}>{value}</span>
      <span style={{ fontFamily: F.body, fontSize: '11px', color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</span>
    </div>
  );

  return (
    <div
      style={cardWrap}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Header */}
      <div style={flex.rowBetween}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: F.display, fontSize: '15px', fontWeight: 700, color: C.textPrimary, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {name}
          </div>
          <div style={{ fontFamily: F.body, fontSize: '12px', color: C.textSecondary, marginTop: '2px' }}>{client}</div>
        </div>
        <span style={STATUS_BADGE[status] ?? STATUS_BADGE.draft}>{status}</span>
      </div>

      {/* Lead progress */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: S[1] }}>
        <div style={flex.rowBetween}>
          <span style={{ fontFamily: F.body, fontSize: '12px', color: C.textSecondary }}>Leads</span>
          <span style={{ fontFamily: F.mono, fontSize: '12px', color: C.textPrimary }}>{current} / {goal}</span>
        </div>
        <div style={{ height: '5px', borderRadius: R.pill, backgroundColor: C.surface3, overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${pct}%`, borderRadius: R.pill, backgroundColor: barColor, transition: 'width 0.4s ease' }}/>
        </div>
      </div>

      {/* Metrics row */}
      <div style={{ display: 'flex', gap: S[5] }}>
        {statPair('CPL', `$${cpl}`)}
        {statPair('CTR', `${ctr}%`)}
        {statPair('Spend', `$${(spend / 1000).toFixed(1)}k`)}
        {statPair('Budget', `$${(budget / 1000).toFixed(0)}k`)}
      </div>

      {/* Budget bar */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: S[1] }}>
        <div style={flex.rowBetween}>
          <span style={{ fontFamily: F.body, fontSize: '11px', color: C.textMuted }}>Budget used</span>
          <span style={{ fontFamily: F.mono, fontSize: '11px', color: spendPct > 85 ? C.amber : C.textMuted }}>{spendPct}%</span>
        </div>
        <div style={{ height: '3px', borderRadius: R.pill, backgroundColor: C.surface3, overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${spendPct}%`, borderRadius: R.pill, backgroundColor: spendPct > 85 ? C.amber : C.textMuted }}/>
        </div>
      </div>

      {/* Footer: channels */}
      <div style={{ display: 'flex', gap: S[1], flexWrap: 'wrap' }}>
        {channels.map((ch) => (
          <span key={ch} style={{
            fontFamily: F.mono,
            fontSize: '10px',
            fontWeight: 700,
            color: CHANNEL_COLORS[ch] ?? C.textSecondary,
            backgroundColor: C.surface2,
            border: `1px solid ${C.border}`,
            borderRadius: R.pill,
            padding: `1px ${S[2]}`,
          }}>
            {ch}
          </span>
        ))}
      </div>
    </div>
  );
}

// ── List row (compact row for list view) ──────
function CampaignListRow({ campaign, onClick }) {
  const [hovered, setHovered] = useState(false);
  const { name, client, status, health, goal, current, spend, budget, cpl, ctr, channels } = campaign;
  const pct = Math.min(100, Math.round((current / goal) * 100));
  const barColor = HEALTH_COLOR[health] ?? C.primary;

  return (
    <div
      role="button"
      tabIndex={0}
      style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(160px, 1fr) minmax(100px, 0.8fr) 72px 72px 80px 70px 80px minmax(0, 1fr)',
        gap: S[4],
        alignItems: 'center',
        padding: `${S[3]} ${S[4]}`,
        borderBottom: `1px solid ${C.border}`,
        backgroundColor: hovered ? C.surface2 : 'transparent',
        cursor: 'pointer',
        transition: T.color,
      }}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick(); } }}
    >
      <div style={{ minWidth: 0 }}>
        <div style={{ fontFamily: F.display, fontSize: '13px', fontWeight: 700, color: C.textPrimary, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{name}</div>
        <div style={{ fontFamily: F.body, fontSize: '11px', color: C.textSecondary }}>{client}</div>
      </div>
      <span style={STATUS_BADGE[status] ?? STATUS_BADGE.draft}>{status}</span>
      <span style={{ fontFamily: F.mono, fontSize: '12px', color: barColor }}>{current}/{goal}</span>
      <span style={{ fontFamily: F.mono, fontSize: '12px', color: C.textPrimary }}>${cpl}</span>
      <span style={{ fontFamily: F.mono, fontSize: '12px', color: C.textPrimary }}>{ctr}%</span>
      <span style={{ fontFamily: F.mono, fontSize: '12px', color: C.textPrimary }}>${(spend / 1000).toFixed(1)}k</span>
      <span style={{ fontFamily: F.mono, fontSize: '12px', color: C.textMuted }}>${(budget / 1000).toFixed(0)}k</span>
      <div style={{ display: 'flex', gap: S[1], flexWrap: 'wrap' }}>
        {channels.map((ch) => (
          <span key={ch} style={{ fontFamily: F.mono, fontSize: '10px', fontWeight: 600, color: CHANNEL_COLORS[ch] ?? C.textSecondary }}>{ch}</span>
        ))}
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────
const ALL_STATUSES = ['all', 'active', 'paused', 'draft', 'completed'];
const ALL_CHANNELS = ['all', 'LinkedIn', 'Meta', 'Display', 'Google'];

export default function CampaignList() {
  const navigate = useNavigate();
  const toast = useToast();
  const openCheckout = useStore((s) => s.openCheckout);
  const activeCampaignsCount = useStore((s) => s.activeCampaignsCount);
  const { getLimit, isLimitReached } = usePlan();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [channelFilter, setChannelFilter] = useState('all');
  const [viewMode, setViewMode] = useState('list'); // 'list' | 'tile'

  const campaignLimit = getLimit('activeCampaigns');
  const atCampaignLimit = campaignLimit !== -1 && isLimitReached('activeCampaigns', activeCampaignsCount);
  const countLabel = campaignLimit === -1
    ? `${campaigns.length} campaigns · ${campaigns.filter(c => c.status === 'active').length} active`
    : `${activeCampaignsCount} / ${campaignLimit} campaigns · ${campaigns.filter(c => c.status === 'active').length} active`;

  const filtered = campaigns.filter((c) => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) ||
                        c.client.toLowerCase().includes(search.toLowerCase());
    const matchStatus  = statusFilter  === 'all' || c.status   === statusFilter;
    const matchChannel = channelFilter === 'all' || c.channels.includes(channelFilter);
    return matchSearch && matchStatus && matchChannel;
  });

  const filterBtnStyle = (active) => ({
    fontFamily: F.body,
    fontSize: '12px',
    fontWeight: active ? 600 : 400,
    color: active ? C.primary : C.textSecondary,
    backgroundColor: active ? C.primaryGlow : 'transparent',
    border: `1px solid ${active ? 'rgba(61,220,132,0.3)' : C.border}`,
    borderRadius: R.pill,
    padding: `3px ${S[3]}`,
    cursor: 'pointer',
    transition: T.color,
  });

  return (
    <div style={{ padding: S[6], display: 'flex', flexDirection: 'column', gap: S[5] }}>
      {/* Page header */}
      <div style={flex.rowBetween}>
        <div>
          <h1 style={{ fontFamily: F.display, fontSize: '22px', fontWeight: 800, color: C.textPrimary, margin: 0, letterSpacing: '-0.02em' }}>
            Campaigns
          </h1>
          <span style={{ fontFamily: F.body, fontSize: '13px', color: C.textSecondary }}>
            {countLabel}
          </span>
        </div>
        <div style={{ display: 'flex', gap: S[2] }}>
          <button style={{ ...btn.secondary, fontSize: '13px' }} onClick={() => toast.info('Import campaign coming soon')}>
            Import
          </button>
          <NewCampaignChoice
            atLimit={atCampaignLimit}
            onUpgrade={() => openCheckout('growth', 'campaigns')}
          />
        </div>
      </div>

      {/* Search + filters */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: S[3] }}>
        {/* Search */}
        <div style={{ position: 'relative', maxWidth: '400px' }}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ position: 'absolute', left: S[3], top: '50%', transform: 'translateY(-50%)', color: C.textMuted, pointerEvents: 'none' }}>
            <circle cx="6" cy="6" r="4" stroke="currentColor" strokeWidth="1.5"/>
            <path d="M9.5 9.5L12.5 12.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          <input
            style={{ ...inputStyle, paddingLeft: '34px', fontSize: '13px' }}
            placeholder="Search campaigns or clients…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Filter row */}
        <div style={{ display: 'flex', gap: S[5], flexWrap: 'wrap', alignItems: 'center' }}>
          {/* Status filters */}
          <div style={{ display: 'flex', gap: S[1], alignItems: 'center' }}>
            <span style={{ fontFamily: F.body, fontSize: '11px', color: C.textMuted, marginRight: S[1] }}>STATUS</span>
            {ALL_STATUSES.map((s) => (
              <button key={s} style={filterBtnStyle(statusFilter === s)} onClick={() => setStatusFilter(s)}>
                {s === 'all' ? 'All' : s}
              </button>
            ))}
          </div>
          {/* Channel filters */}
          <div style={{ display: 'flex', gap: S[1], alignItems: 'center' }}>
            <span style={{ fontFamily: F.body, fontSize: '11px', color: C.textMuted, marginRight: S[1] }}>CHANNEL</span>
            {ALL_CHANNELS.map((ch) => (
              <button key={ch} style={filterBtnStyle(channelFilter === ch)} onClick={() => setChannelFilter(ch)}>
                {ch === 'all' ? 'All' : ch}
              </button>
            ))}
          </div>
          {/* View toggle: List | Tile */}
          <div style={{ display: 'flex', alignItems: 'center', marginLeft: 'auto', gap: 0 }}>
            <button
              type="button"
              title="List view"
              onClick={() => setViewMode('list')}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '32px',
                height: '32px',
                border: `1px solid ${viewMode === 'list' ? C.primary : C.border}`,
                borderRight: 'none',
                borderRadius: `${R.sm} 0 0 ${R.sm}`,
                backgroundColor: viewMode === 'list' ? C.primaryGlow : 'transparent',
                color: viewMode === 'list' ? C.primary : C.textMuted,
                cursor: 'pointer',
                transition: T.color,
              }}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M2 3h10M2 7h10M2 11h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </button>
            <button
              type="button"
              title="Tile view"
              onClick={() => setViewMode('tile')}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '32px',
                height: '32px',
                border: `1px solid ${viewMode === 'tile' ? C.primary : C.border}`,
                borderRadius: `0 ${R.sm} ${R.sm} 0`,
                backgroundColor: viewMode === 'tile' ? C.primaryGlow : 'transparent',
                color: viewMode === 'tile' ? C.primary : C.textMuted,
                cursor: 'pointer',
                transition: T.color,
              }}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <rect x="1" y="1" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.5"/>
                <rect x="8" y="1" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.5"/>
                <rect x="1" y="8" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.5"/>
                <rect x="8" y="8" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.5"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Campaign list or grid */}
      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: `${S[16]} 0`, color: C.textMuted, fontFamily: F.body, fontSize: '14px' }}>
          No campaigns match your filters.
        </div>
      ) : viewMode === 'list' ? (
        <div style={{ backgroundColor: C.surface, border: `1px solid ${C.border}`, borderRadius: R.card, overflow: 'hidden' }}>
          {/* List header */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(160px, 1fr) minmax(100px, 0.8fr) 72px 72px 80px 70px 80px minmax(0, 1fr)',
              gap: S[4],
              alignItems: 'center',
              padding: `${S[2]} ${S[4]}`,
              borderBottom: `1px solid ${C.border}`,
              fontFamily: F.mono,
              fontSize: '10px',
              fontWeight: 700,
              color: C.textMuted,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
            }}
          >
            <span>Name</span>
            <span>Status</span>
            <span>Leads</span>
            <span>CPL</span>
            <span>CTR</span>
            <span>Spend</span>
            <span>Budget</span>
            <span>Channels</span>
          </div>
          {filtered.map((c) => (
            <CampaignListRow
              key={c.id}
              campaign={c}
              onClick={() => navigate(`/campaigns/${c.id}`)}
            />
          ))}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: S[4] }}>
          {filtered.map((c) => (
            <CampaignCard
              key={c.id}
              campaign={c}
              onClick={() => navigate(`/campaigns/${c.id}`)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
