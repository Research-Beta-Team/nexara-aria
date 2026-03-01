import { useState, useMemo } from 'react';
import { C, F, R, S, btn, badge } from '../../tokens';
import { SIGNAL_TYPE_LABELS } from '../../data/intentSignals';

const FILTER_OPTIONS = [
  { value: 'all', label: 'All' },
  { value: 'website_visit', label: 'Website' },
  { value: 'g2_research', label: 'G2' },
  { value: 'linkedin_post', label: 'LinkedIn' },
  { value: 'job_posting', label: 'Job Posting' },
  { value: 'news', label: 'News' },
];

const SORT_OPTIONS = [
  { value: 'recent', label: 'Most recent' },
  { value: 'intent', label: 'Highest intent' },
  { value: 'actioned', label: 'Actioned last' },
];

// Type to color for the circle icon
const TYPE_COLOR = {
  website_visit: C.primary,
  g2_research: C.amber,
  job_posting: C.secondary,
  linkedin_post: '#0A66C2',
  competitor_check: C.textMuted,
  funding_news: C.amber,
  tech_signal: C.primary,
  email_open: C.secondary,
  content_engage: C.primary,
  leadership_change: C.textMuted,
};

function scoreBadgeStyle(score) {
  if (score >= 80) return { ...badge.base, ...badge.green };
  if (score >= 60) return { ...badge.base, ...badge.amber };
  return { ...badge.base, ...badge.muted };
}

function matchesNews(type) {
  return type === 'funding_news' || type === 'leadership_change';
}

export default function SignalFeed({ signals = [], onAddToSequence, onViewAccount, onDismiss, onAskAria, toast }) {
  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState('recent');
  const [minScore, setMinScore] = useState(50);

  const filtered = useMemo(() => {
    let list = signals.filter((s) => s.intentScore >= minScore);
    if (filterType !== 'all') {
      if (filterType === 'news') {
        list = list.filter((s) => matchesNews(s.signalType));
      } else {
        list = list.filter((s) => s.signalType === filterType);
      }
    }
    return list;
  }, [signals, filterType, minScore]);

  const sorted = useMemo(() => {
    const arr = [...filtered];
    if (sortBy === 'recent') {
      arr.sort((a, b) => {
        const order = { new: 0, actioned: 1, dismissed: 2 };
        return (order[a.status] ?? 2) - (order[b.status] ?? 2) || 0;
      });
    } else if (sortBy === 'intent') {
      arr.sort((a, b) => (b.intentScore || 0) - (a.intentScore || 0));
    } else if (sortBy === 'actioned') {
      arr.sort((a, b) => {
        const aa = a.status === 'actioned' ? 1 : 0;
        const bb = b.status === 'actioned' ? 1 : 0;
        return bb - aa;
      });
    }
    return arr;
  }, [filtered, sortBy]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: S[4], flex: 1, minWidth: 0 }}>
      {/* Filter bar */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: S[2] }}>
        {FILTER_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            style={{
              ...btn.secondary,
              fontSize: '12px',
              padding: `${S[1]} ${S[3]}`,
              backgroundColor: filterType === opt.value ? `${C.primary}18` : 'transparent',
              borderColor: filterType === opt.value ? C.primary : undefined,
              color: filterType === opt.value ? C.primary : C.textSecondary,
            }}
            onClick={() => setFilterType(opt.value)}
          >
            {opt.label}
          </button>
        ))}
        <span style={{ fontFamily: F.body, fontSize: '12px', color: C.textMuted, marginLeft: S[2] }}>
          Min score:
        </span>
        <input
          type="range"
          min={50}
          max={100}
          value={minScore}
          onChange={(e) => setMinScore(Number(e.target.value))}
          style={{ width: 80, accentColor: C.primary }}
        />
        <span style={{ fontFamily: F.mono, fontSize: '11px', color: C.textMuted }}>{minScore}</span>
      </div>

      {/* Sort */}
      <div style={{ display: 'flex', alignItems: 'center', gap: S[2] }}>
        <span style={{ fontFamily: F.mono, fontSize: '11px', color: C.textMuted }}>Sort:</span>
        {SORT_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            style={{
              ...btn.ghost,
              fontSize: '12px',
              padding: `${S[1]} ${S[2]}`,
              color: sortBy === opt.value ? C.primary : C.textSecondary,
              fontWeight: sortBy === opt.value ? 600 : 400,
            }}
            onClick={() => setSortBy(opt.value)}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Signal list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: S[2], overflowY: 'auto', flex: 1, minHeight: 0 }}>
        {sorted.length === 0 ? (
          <div style={{ fontFamily: F.body, fontSize: '13px', color: C.textMuted, padding: S[6], textAlign: 'center' }}>
            No signals match the current filters.
          </div>
        ) : (
          sorted.map((signal) => {
            const typeColor = TYPE_COLOR[signal.signalType] || C.textMuted;
            const contactLine = signal.contact
              ? `${signal.contact.name}${signal.contact.title ? `, ${signal.contact.title}` : ''}`
              : null;
            return (
              <div
                key={signal.id}
                style={{
                  backgroundColor: C.surface,
                  border: `1px solid ${C.border}`,
                  borderRadius: R.card,
                  padding: S[4],
                  display: 'flex',
                  flexDirection: 'column',
                  gap: S[3],
                  position: 'relative',
                }}
              >
                {signal.status === 'new' && (
                  <span
                    style={{
                      position: 'absolute',
                      top: S[2],
                      right: S[2],
                      ...badge.base,
                      ...badge.green,
                      fontSize: '10px',
                    }}
                  >
                    New
                  </span>
                )}
                <div style={{ display: 'flex', gap: S[3], alignItems: 'flex-start' }}>
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: '50%',
                      backgroundColor: `${typeColor}22`,
                      border: `2px solid ${typeColor}`,
                      flexShrink: 0,
                    }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: F.mono, fontSize: '10px', color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 2 }}>
                      {SIGNAL_TYPE_LABELS[signal.signalType] || signal.signalType}
                    </div>
                    <div style={{ fontFamily: F.body, fontSize: '14px', fontWeight: 700, color: C.textPrimary }}>
                      {signal.account}
                    </div>
                    {contactLine && (
                      <div style={{ fontFamily: F.body, fontSize: '12px', color: C.textSecondary }}>{contactLine}</div>
                    )}
                    <div style={{ fontFamily: F.body, fontSize: '13px', color: C.textSecondary, marginTop: 2 }}>
                      {signal.signalDetail}
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: S[1], flexShrink: 0 }}>
                    <span style={{ ...scoreBadgeStyle(signal.intentScore), fontSize: '12px' }}>{signal.intentScore}</span>
                    <span style={{ fontFamily: F.mono, fontSize: '11px', color: C.textMuted }}>{signal.detectedAt}</span>
                    <span style={{ ...badge.base, ...badge.muted, fontSize: '10px' }}>{signal.channel}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: S[2] }}>
                  <button
                    style={{ ...btn.ghost, fontSize: '12px' }}
                    onClick={() => {
                      onAddToSequence?.(signal);
                      toast?.info(`Add ${signal.account} to sequence`);
                    }}
                  >
                    Add to Sequence
                  </button>
                  <button
                    style={{ ...btn.ghost, fontSize: '12px' }}
                    onClick={() => {
                      onViewAccount?.(signal);
                      toast?.info(`View ${signal.account}`);
                    }}
                  >
                    View Account
                  </button>
                  <button
                    style={{ ...btn.ghost, fontSize: '12px' }}
                    onClick={() => {
                      onDismiss?.(signal);
                      toast?.info('Signal dismissed');
                    }}
                  >
                    Dismiss
                  </button>
                  <button
                    style={{ ...btn.ghost, fontSize: '12px', color: C.primary }}
                    onClick={() => {
                      onAskAria?.(signal);
                      toast?.info('Ask ARIA');
                    }}
                  >
                    Ask ARIA
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
