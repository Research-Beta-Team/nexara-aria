import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import useStore from '../store/useStore';
import useToast from '../hooks/useToast';
import { C, F, R, S, T, btn, badge, flex, cardStyle } from '../tokens';
import { getProspectsForClient, DEFAULT_OUTREACH_CAMPAIGN_ID } from '../data/outreach';

const INTENT_BADGE = {
  high: { ...badge.base, ...badge.green },
  medium: { ...badge.base, ...badge.amber },
  low: { ...badge.base, ...badge.muted },
};

const FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'replied', label: 'Replied' },
  { id: 'high', label: 'High intent' },
  { id: 'active', label: 'In sequence' },
];

function IcpScore({ score }) {
  const color = score >= 90 ? C.primary : score >= 75 ? C.amber : C.red;
  return (
    <div style={{
      width: '36px', height: '36px', borderRadius: '50%',
      border: `2px solid ${color}`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexShrink: 0,
      backgroundColor: `${color}18`,
    }}>
      <span style={{ fontFamily: F.mono, fontSize: '11px', fontWeight: 700, color }}>{score}</span>
    </div>
  );
}

function SequenceSteps({ current, total = 5 }) {
  return (
    <div style={{ display: 'flex', gap: '3px', alignItems: 'center' }}>
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          style={{
            width: '8px', height: '8px', borderRadius: '50%',
            backgroundColor: i < current ? C.primary : C.surface3,
            border: `1px solid ${i < current ? C.primary : C.border}`,
          }}
        />
      ))}
    </div>
  );
}

function StatBox({ label, value, color }) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', gap: '2px',
      padding: `${S[3]} ${S[4]}`,
      backgroundColor: C.surface2,
      border: `1px solid ${C.border}`,
      borderRadius: R.md,
      flex: 1,
      minWidth: '100px',
    }}>
      <span style={{ fontFamily: F.body, fontSize: '11px', color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</span>
      <span style={{ fontFamily: F.mono, fontSize: '18px', fontWeight: 700, color: color ?? C.textPrimary, lineHeight: 1 }}>{value}</span>
    </div>
  );
}

export default function Outreach() {
  const navigate = useNavigate();
  const toast = useToast();
  const activeClientId = useStore((s) => s.activeClientId);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  const prospects = getProspectsForClient(activeClientId ?? 'medglobal');

  const filtered = useMemo(() => {
    let list = prospects;
    if (filter === 'replied') list = list.filter((p) => p.replied);
    else if (filter === 'high') list = list.filter((p) => p.intent === 'high');
    else if (filter === 'active') list = list.filter((p) => (p.sequenceStep ?? 0) > 0);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((p) =>
        (p.name || '').toLowerCase().includes(q) ||
        (p.company || '').toLowerCase().includes(q) ||
        (p.title || '').toLowerCase().includes(q)
      );
    }
    return list;
  }, [prospects, filter, search]);

  const replied = prospects.filter((p) => p.replied).length;
  const highIntent = prospects.filter((p) => p.intent === 'high').length;
  const replyRate = prospects.length ? Math.round((replied / prospects.length) * 100) : 0;

  const handleRowClick = (prospectId) => {
    navigate(`/campaigns/${DEFAULT_OUTREACH_CAMPAIGN_ID}/prospect/${prospectId}`);
  };

  return (
    <div style={{ padding: S[6], display: 'flex', flexDirection: 'column', gap: S[5], minHeight: '100%' }}>
      {/* Header */}
      <div style={{ ...flex.rowBetween, flexWrap: 'wrap', gap: S[3] }}>
        <div>
          <h1 style={{ fontFamily: F.display, fontSize: '22px', fontWeight: 800, color: C.textPrimary, margin: '0 0 4px' }}>
            Outreach
          </h1>
          <p style={{ fontFamily: F.body, fontSize: '13px', color: C.textSecondary }}>
            Prospects and sequences across campaigns. Click a prospect to view timeline and take action.
          </p>
        </div>
        <div style={{ display: 'flex', gap: S[2] }}>
          <button style={{ ...btn.secondary, fontSize: '13px' }} onClick={() => toast.info('Add prospects flow coming soon')}>
            Add prospects
          </button>
          <button style={{ ...btn.primary, fontSize: '13px' }} onClick={() => navigate('/campaigns/new')}>
            New campaign
          </button>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'flex', gap: S[3], flexWrap: 'wrap' }}>
        <StatBox label="Prospects" value={prospects.length} />
        <StatBox label="Replied" value={replied} color={C.primary} />
        <StatBox label="High intent" value={highIntent} color={C.secondary} />
        <StatBox label="Reply rate" value={`${replyRate}%`} color={C.primary} />
        <StatBox label="Sequence" value="5-step" />
      </div>

      {/* Filters + search */}
      <div style={{ ...flex.rowBetween, flexWrap: 'wrap', gap: S[3] }}>
        <div style={{ display: 'flex', gap: S[2], flexWrap: 'wrap' }}>
          {FILTERS.map((f) => (
            <button
              key={f.id}
              style={{
                ...(filter === f.id ? btn.primary : btn.secondary),
                fontSize: '12px',
                padding: `${S[2]} ${S[3]}`,
              }}
              onClick={() => setFilter(f.id)}
            >
              {f.label}
            </button>
          ))}
        </div>
        <input
          type="search"
          placeholder="Search by name, company, title…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            minWidth: '220px',
            padding: `${S[2]} ${S[3]}`,
            fontFamily: F.body,
            fontSize: '13px',
            color: C.textPrimary,
            backgroundColor: C.surface2,
            border: `1px solid ${C.border}`,
            borderRadius: R.input,
            outline: 'none',
          }}
        />
      </div>

      {/* Prospect list */}
      <div style={{ ...cardStyle, padding: 0, overflow: 'hidden' }}>
        {filtered.length === 0 ? (
          <div style={{ padding: S[8], textAlign: 'center' }}>
            <p style={{ fontFamily: F.body, fontSize: '14px', color: C.textMuted, margin: '0 0 12px' }}>
              {prospects.length === 0
                ? 'No prospects yet. Add prospects to a campaign or import from your CRM.'
                : 'No prospects match the current filters or search.'}
            </p>
            {prospects.length === 0 && (
              <button style={btn.primary} onClick={() => toast.info('Add prospects flow coming soon')}>
                Add prospects
              </button>
            )}
          </div>
        ) : (
          <>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '40px 1fr 88px 90px 88px 80px 32px',
              gap: S[3],
              padding: `${S[2]} ${S[4]}`,
              borderBottom: `1px solid ${C.border}`,
              backgroundColor: C.surface3,
            }}>
              {['ICP', 'Prospect', 'Intent', 'Sequence', 'Last touch', 'Replied', ''].map((h) => (
                <span key={h} style={{ fontFamily: F.body, fontSize: '11px', fontWeight: 600, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {h}
                </span>
              ))}
            </div>
            {filtered.map((p, i) => (
              <div
                key={p.id}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '40px 1fr 88px 90px 88px 80px 32px',
                  gap: S[3],
                  padding: `${S[3]} ${S[4]}`,
                  alignItems: 'center',
                  borderBottom: i < filtered.length - 1 ? `1px solid ${C.border}` : 'none',
                  cursor: 'pointer',
                  transition: T.color,
                }}
                onClick={() => handleRowClick(p.id)}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = C.surface3; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
              >
                <IcpScore score={p.icpScore} />
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', overflow: 'hidden' }}>
                  <span style={{ fontFamily: F.body, fontSize: '13px', fontWeight: 600, color: C.textPrimary, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {p.name}
                  </span>
                  <span style={{ fontFamily: F.body, fontSize: '11px', color: C.textMuted, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {p.title} · {p.company}
                  </span>
                </div>
                <span style={INTENT_BADGE[p.intent]}>{p.intent}</span>
                <SequenceSteps current={p.sequenceStep} total={5} />
                <span style={{ fontFamily: F.mono, fontSize: '11px', color: C.textMuted }}>{p.lastTouch}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: S[1] }}>
                  <div style={{
                    width: '8px', height: '8px', borderRadius: '50%',
                    backgroundColor: p.replied ? C.primary : C.surface3,
                    border: `1px solid ${p.replied ? C.primary : C.border}`,
                    boxShadow: p.replied ? `0 0 4px ${C.primary}` : 'none',
                  }} />
                  <span style={{ fontFamily: F.mono, fontSize: '11px', color: p.replied ? C.primary : C.textMuted }}>{p.replied ? 'Yes' : 'No'}</span>
                </div>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ color: C.textMuted }}>
                  <path d="M4 7h6M7 4l3 3-3 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
