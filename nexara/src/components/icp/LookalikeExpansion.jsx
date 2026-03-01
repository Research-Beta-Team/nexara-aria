import { useState } from 'react';
import { TOP_LOOKALIKES } from '../../data/icp';
import useToast from '../../hooks/useToast';
import { C, F, R, S, T, btn, badge } from '../../tokens';

// ── Weight slider (reuses nexara-range class) ──
function WeightSlider({ label, value, onChange }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: S[2], flex: 1 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontFamily: F.body, fontSize: '12px', color: C.textSecondary, fontWeight: 600 }}>
          {label}
        </span>
        <span style={{ fontFamily: F.mono, fontSize: '13px', fontWeight: 700, color: C.primary }}>
          {value}%
        </span>
      </div>
      <input
        type="range"
        min="0" max="100"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="nexara-range"
      />
    </div>
  );
}

// ── Match score chip ───────────────────────────
function MatchScore({ score }) {
  const color = score >= 90 ? '#3DDC84' : score >= 80 ? '#5EEAD4' : score >= 70 ? '#F5C842' : '#6B9478';
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
      <span style={{ fontFamily: F.mono, fontSize: '15px', fontWeight: 700, color }}>{score}</span>
      <div style={{ width: '32px', height: '4px', backgroundColor: C.surface3, borderRadius: R.pill, overflow: 'hidden' }}>
        <div style={{ width: `${score}%`, height: '100%', backgroundColor: color, borderRadius: R.pill }} />
      </div>
    </div>
  );
}

// ── Status badge ───────────────────────────────
function StatusBadge({ status }) {
  const meta = {
    not_contacted: { label: 'Not contacted', color: '#6B9478', bg: 'rgba(107,148,120,0.1)', border: 'rgba(107,148,120,0.2)' },
    in_sequence:   { label: 'In sequence',   color: '#5EEAD4', bg: 'rgba(94,234,212,0.1)', border: 'rgba(94,234,212,0.25)' },
  };
  const m = meta[status] ?? meta.not_contacted;
  return (
    <span style={{
      ...badge.base,
      backgroundColor: m.bg, color: m.color,
      border: `1px solid ${m.border}`,
    }}>
      {m.label}
    </span>
  );
}

// ── Main ───────────────────────────────────────
export default function LookalikeExpansion() {
  const toast = useToast();

  const [weights, setWeights] = useState({ industry: 40, size: 35, tech: 25 });
  const [searching, setSearching] = useState(false);
  const [lookalikes, setLookalikes] = useState(TOP_LOOKALIKES);

  const total = weights.industry + weights.size + weights.tech;

  const setW = (key, val) => {
    setWeights((prev) => ({ ...prev, [key]: val }));
  };

  const handleFind = () => {
    if (total !== 100) { toast.error(`Weights must sum to 100 (currently ${total})`); return; }
    setSearching(true);
    toast.info('ARIA is searching Apollo + LinkedIn for lookalike companies…');
    setTimeout(() => {
      setSearching(false);
      toast.success(`Found ${lookalikes.length} lookalike companies matching your ICP`);
    }, 2200);
  };

  const handleAddOne = (company) => {
    toast.success(`${company.name} added to outreach queue`);
    setLookalikes((prev) =>
      prev.map((l) => l.id === company.id ? { ...l, status: 'in_sequence' } : l)
    );
  };

  const handleAddAll = () => {
    const notContacted = lookalikes.filter((l) => l.status === 'not_contacted');
    toast.success(`${notContacted.length} companies added to outreach queue`);
    setLookalikes((prev) => prev.map((l) => ({ ...l, status: 'in_sequence' })));
  };

  const ARIA_ICON = (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M7 1.5L13.2 12.8H.8L7 1.5z" stroke={C.primary} strokeWidth="1.3" strokeLinejoin="round"/>
      <path d="M3.6 9.2h6.8" stroke={C.primary} strokeWidth="1.3" strokeLinecap="round"/>
      <circle cx="7" cy="1.5" r="1.1" fill={C.primary}/>
      <circle cx=".8" cy="12.8" r="1.1" fill={C.primary}/>
      <circle cx="13.2" cy="12.8" r="1.1" fill={C.primary}/>
    </svg>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: S[5] }}>
      {/* Range input styles */}
      <style>{`
        .nexara-range { -webkit-appearance: none; appearance: none; width: 100%; height: 4px; background: var(--c-border); border-radius: 2px; outline: none; cursor: pointer; }
        .nexara-range::-webkit-slider-thumb { -webkit-appearance: none; width: 14px; height: 14px; border-radius: 50%; background: var(--c-primary); cursor: pointer; }
        .nexara-range::-moz-range-thumb { width: 14px; height: 14px; border-radius: 50%; background: var(--c-primary); border: none; cursor: pointer; }
      `}</style>

      {/* Header */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <span style={{ fontFamily: F.display, fontSize: '15px', fontWeight: 700, color: C.textPrimary }}>
          Lookalike Expansion
        </span>
        <span style={{ fontFamily: F.body, fontSize: '13px', color: C.textSecondary }}>
          Find companies that resemble your top 10 closed-won customers. ARIA searches Apollo, LinkedIn, and BuiltWith.
        </span>
      </div>

      {/* Parameters card */}
      <div style={{
        backgroundColor: C.surface,
        border:          `1px solid ${C.border}`,
        borderRadius:    R.card,
        padding:         S[5],
        display:         'flex',
        flexDirection:   'column',
        gap:             S[4],
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontFamily: F.body, fontSize: '13px', fontWeight: 700, color: C.textPrimary }}>
            Lookalike Parameters
          </span>
          <span style={{
            fontFamily:      F.mono,
            fontSize:        '11px',
            fontWeight:      700,
            color:           total === 100 ? C.primary : '#FF6E7A',
            backgroundColor: total === 100 ? 'rgba(61,220,132,0.1)' : 'rgba(255,110,122,0.1)',
            border:          `1px solid ${total === 100 ? 'rgba(61,220,132,0.3)' : 'rgba(255,110,122,0.3)'}`,
            borderRadius:    R.pill,
            padding:         `2px ${S[2]}`,
          }}>
            {total}/100
          </span>
        </div>

        <div style={{ display: 'flex', gap: S[5], alignItems: 'flex-start' }}>
          <WeightSlider label="Industry weight" value={weights.industry} onChange={(v) => setW('industry', v)} />
          <WeightSlider label="Company size weight" value={weights.size} onChange={(v) => setW('size', v)} />
          <WeightSlider label="Tech signals weight" value={weights.tech} onChange={(v) => setW('tech', v)} />
        </div>

        <button
          style={{
            ...btn.primary,
            fontSize:        '13px',
            gap:             S[2],
            alignSelf:       'flex-start',
            opacity:         searching ? 0.7 : 1,
          }}
          onClick={handleFind}
          disabled={searching}
        >
          {ARIA_ICON}
          {searching ? 'Searching…' : 'Find Lookalikes'}
        </button>
      </div>

      {/* Results table */}
      <div style={{
        backgroundColor: C.surface,
        border:          `1px solid ${C.border}`,
        borderRadius:    '12px',
        overflow:        'hidden',
      }}>
        {/* Table header */}
        <div style={{
          display:             'grid',
          gridTemplateColumns: '1fr 140px 120px 90px 1fr 120px',
          gap:                 S[3],
          padding:             `${S[2]} ${S[5]}`,
          borderBottom:        `1px solid ${C.border}`,
          backgroundColor:     C.surface2,
        }}>
          {['Company','Industry','Size','Match','Why it matches','Status'].map((h) => (
            <span key={h} style={{ fontFamily: F.mono, fontSize: '10px', fontWeight: 700, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              {h}
            </span>
          ))}
        </div>

        {lookalikes.map((company, idx) => (
          <div
            key={company.id}
            style={{
              display:         'grid',
              gridTemplateColumns: '1fr 140px 120px 90px 1fr 120px',
              gap:             S[3],
              padding:         `${S[3]} ${S[5]}`,
              borderBottom:    idx < lookalikes.length - 1 ? `1px solid ${C.border}` : 'none',
              alignItems:      'center',
              transition:      T.color,
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <span style={{ fontFamily: F.body, fontSize: '13px', fontWeight: 600, color: C.textPrimary }}>
                {company.name}
              </span>
            </div>
            <span style={{ fontFamily: F.body, fontSize: '12px', color: C.textSecondary }}>
              {company.industry}
            </span>
            <span style={{ fontFamily: F.mono, fontSize: '11px', color: C.textSecondary }}>
              {company.size}
            </span>
            <MatchScore score={company.score} />
            <span style={{
              fontFamily:        F.body,
              fontSize:          '11px',
              color:             C.textSecondary,
              display:           '-webkit-box',
              WebkitLineClamp:   2,
              WebkitBoxOrient:   'vertical',
              overflow:          'hidden',
              lineHeight:        '1.5',
            }}>
              {company.reason}
            </span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <StatusBadge status={company.status} />
              {company.status === 'not_contacted' && (
                <button
                  style={{ ...btn.ghost, fontSize: '11px', padding: '2px 0', color: C.primary, justifyContent: 'flex-start' }}
                  onClick={() => handleAddOne(company)}
                >
                  Add to outreach →
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add all CTA */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontFamily: F.body, fontSize: '13px', color: C.textSecondary }}>
          {lookalikes.filter((l) => l.status === 'not_contacted').length} companies not yet in outreach
        </span>
        <div style={{ display: 'flex', gap: S[2] }}>
          <button
            style={{ ...btn.secondary, fontSize: '13px' }}
            onClick={() => toast.info('Exporting lookalike list to CSV…')}
          >
            Export list
          </button>
          <button
            style={{ ...btn.primary, fontSize: '13px' }}
            onClick={handleAddAll}
          >
            Add all to outreach
          </button>
        </div>
      </div>
    </div>
  );
}
