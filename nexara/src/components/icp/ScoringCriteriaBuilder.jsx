import { useState, useMemo } from 'react';
import { SCORING_CRITERIA } from '../../data/icp';
import useToast from '../../hooks/useToast';
import { C, F, R, S, T, btn } from '../../tokens';

// ── Tooltip ────────────────────────────────────
function InfoTooltip({ text }) {
  const [visible, setVisible] = useState(false);
  return (
    <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}>
      <button
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
        style={{
          width:           '16px',
          height:          '16px',
          borderRadius:    '50%',
          border:          `1px solid ${C.border}`,
          backgroundColor: C.surface3,
          color:           C.textMuted,
          fontFamily:      F.mono,
          fontSize:        '10px',
          fontWeight:      700,
          cursor:          'help',
          display:         'flex',
          alignItems:      'center',
          justifyContent:  'center',
          flexShrink:      0,
        }}
      >
        ?
      </button>
      {visible && (
        <div style={{
          position:        'absolute',
          left:            '22px',
          top:             '50%',
          transform:       'translateY(-50%)',
          width:           '260px',
          backgroundColor: C.surface2,
          border:          `1px solid ${C.border}`,
          borderRadius:    R.card,
          padding:         `${S[2]} ${S[3]}`,
          fontSize:        '12px',
          fontFamily:      F.body,
          color:           C.textSecondary,
          lineHeight:      '1.5',
          zIndex:          200,
          boxShadow:       '0 8px 32px rgba(0,0,0,0.4)',
          pointerEvents:   'none',
        }}>
          {text}
        </div>
      )}
    </div>
  );
}

// ── Main ───────────────────────────────────────
export default function ScoringCriteriaBuilder() {
  const toast = useToast();

  const [weights, setWeights] = useState(() =>
    Object.fromEntries(SCORING_CRITERIA.map((c) => [c.id, c.weight]))
  );

  const total = useMemo(() => Object.values(weights).reduce((a, b) => a + b, 0), [weights]);
  const isValid = total === 100;

  const OPTIMAL = { sc1: 22, sc2: 18, sc3: 18, sc4: 16, sc5: 12, sc6: 10, sc7: 4 };

  const autoBalance = () => {
    setWeights(OPTIMAL);
    toast.success('Weights auto-balanced based on 12 closed-won deal correlations');
  };

  const setWeight = (id, val) => {
    const clamped = Math.max(0, Math.min(40, Number(val)));
    setWeights((prev) => ({ ...prev, [id]: clamped }));
  };

  // Mock impact preview — how many prospects move threshold
  const movedCount = useMemo(() => {
    // Simple heuristic: difference from default
    const diff = SCORING_CRITERIA.reduce((acc, c) => acc + Math.abs(weights[c.id] - c.weight), 0);
    return Math.round(diff * 1.1);
  }, [weights]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: S[5], maxWidth: '800px' }}>
      {/* Range input styles — injected once */}
      <style>{`
        .nexara-range { -webkit-appearance: none; appearance: none; width: 100%; height: 4px; background: var(--c-border); border-radius: 2px; outline: none; cursor: pointer; }
        .nexara-range::-webkit-slider-thumb { -webkit-appearance: none; width: 14px; height: 14px; border-radius: 50%; background: var(--c-primary); cursor: pointer; transition: transform 0.1s ease; }
        .nexara-range::-webkit-slider-thumb:hover { transform: scale(1.2); }
        .nexara-range::-moz-range-thumb { width: 14px; height: 14px; border-radius: 50%; background: var(--c-primary); border: none; cursor: pointer; }
        .nexara-range::-webkit-slider-runnable-track { height: 4px; background: var(--c-border); border-radius: 2px; }
      `}</style>

      {/* Header row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <span style={{ fontFamily: F.display, fontSize: '15px', fontWeight: 700, color: C.textPrimary }}>
            Scoring Weights
          </span>
          <span style={{ fontFamily: F.body, fontSize: '12px', color: C.textSecondary }}>
            Adjust how much each criterion contributes to a prospect's ICP score.
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: S[3] }}>
          {/* Total weight indicator */}
          <div style={{
            display:         'flex',
            alignItems:      'center',
            gap:             '4px',
            padding:         `${S[1]} ${S[3]}`,
            borderRadius:    R.pill,
            backgroundColor: isValid ? 'rgba(61,220,132,0.1)' : 'rgba(255,110,122,0.12)',
            border:          `1px solid ${isValid ? 'rgba(61,220,132,0.3)' : 'rgba(255,110,122,0.35)'}`,
          }}>
            <span style={{ fontFamily: F.mono, fontSize: '13px', fontWeight: 700, color: isValid ? C.primary : '#FF6E7A' }}>
              {total}
            </span>
            <span style={{ fontFamily: F.mono, fontSize: '11px', color: isValid ? C.primary : '#FF6E7A', opacity: 0.7 }}>
              / 100
            </span>
          </div>
          <button style={{ ...btn.secondary, fontSize: '12px' }} onClick={autoBalance}>
            Auto-balance
          </button>
        </div>
      </div>

      {/* Criteria list */}
      <div style={{
        backgroundColor: C.surface,
        border:          `1px solid ${C.border}`,
        borderRadius:    '12px',
        overflow:        'hidden',
      }}>
        {SCORING_CRITERIA.map((criterion, idx) => {
          const w = weights[criterion.id];
          const barColor = w >= 20 ? '#3DDC84' : w >= 10 ? '#5EEAD4' : '#6B9478';

          return (
            <div
              key={criterion.id}
              style={{
                display:      'flex',
                alignItems:   'center',
                gap:          S[4],
                padding:      `${S[4]} ${S[5]}`,
                borderBottom: idx < SCORING_CRITERIA.length - 1 ? `1px solid ${C.border}` : 'none',
              }}
            >
              {/* Rank */}
              <span style={{ fontFamily: F.mono, fontSize: '11px', color: C.textMuted, width: '18px', flexShrink: 0 }}>
                {String(idx + 1).padStart(2, '0')}
              </span>

              {/* Criterion name + tooltip */}
              <div style={{ display: 'flex', alignItems: 'center', gap: S[2], width: '200px', flexShrink: 0 }}>
                <span style={{ fontFamily: F.body, fontSize: '13px', fontWeight: 500, color: C.textPrimary }}>
                  {criterion.criterion}
                </span>
                <InfoTooltip text={criterion.description} />
              </div>

              {/* Slider */}
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: S[3] }}>
                <input
                  type="range"
                  min="0" max="40"
                  value={w}
                  onChange={(e) => setWeight(criterion.id, e.target.value)}
                  className="nexara-range"
                />
              </div>

              {/* Weight number (editable) */}
              <input
                type="number"
                min="0" max="40"
                value={w}
                onChange={(e) => setWeight(criterion.id, e.target.value)}
                style={{
                  width:           '48px',
                  backgroundColor: C.surface3,
                  border:          `1px solid ${C.border}`,
                  borderRadius:    R.sm,
                  padding:         '4px 6px',
                  fontFamily:      F.mono,
                  fontSize:        '13px',
                  fontWeight:      700,
                  color:           barColor,
                  outline:         'none',
                  textAlign:       'center',
                  flexShrink:      0,
                }}
              />

              {/* Weight bar (visual) */}
              <div style={{ width: '60px', flexShrink: 0 }}>
                <div style={{ height: '4px', backgroundColor: C.surface3, borderRadius: R.pill, overflow: 'hidden' }}>
                  <div style={{
                    width:           `${(w / 40) * 100}%`,
                    height:          '100%',
                    backgroundColor: barColor,
                    borderRadius:    R.pill,
                    transition:      T.base,
                  }} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Validation error */}
      {!isValid && (
        <div style={{
          padding:         `${S[3]} ${S[4]}`,
          backgroundColor: 'rgba(255,110,122,0.08)',
          border:          `1px solid rgba(255,110,122,0.25)`,
          borderRadius:    R.card,
          fontFamily:      F.body,
          fontSize:        '13px',
          color:           '#FF6E7A',
        }}>
          Total weight must equal 100. Currently: <strong>{total}</strong> ({total > 100 ? `${total - 100} over` : `${100 - total} under`}).
          Click "Auto-balance" to fix automatically.
        </div>
      )}

      {/* Impact preview */}
      {movedCount > 0 && (
        <div style={{
          padding:         `${S[3]} ${S[4]}`,
          backgroundColor: 'rgba(61,220,132,0.06)',
          border:          `1px solid rgba(61,220,132,0.2)`,
          borderRadius:    R.card,
          display:         'flex',
          alignItems:      'center',
          gap:             S[3],
        }}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle cx="8" cy="8" r="6.5" stroke={C.primary} strokeWidth="1.3"/>
            <path d="M8 5v4M8 10.5v.5" stroke={C.primary} strokeWidth="1.3" strokeLinecap="round"/>
          </svg>
          <span style={{ fontFamily: F.body, fontSize: '13px', color: C.textSecondary }}>
            With these weight changes,{' '}
            <strong style={{ color: C.primary }}>{movedCount} prospects</strong>
            {' '}would move from a score below 70 to above 70 (qualifying for outreach).
          </span>
        </div>
      )}

      {/* Save row */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: S[2] }}>
        <button
          style={{ ...btn.secondary, fontSize: '13px' }}
          onClick={() => {
            setWeights(Object.fromEntries(SCORING_CRITERIA.map((c) => [c.id, c.weight])));
            toast.info('Weights reset to defaults');
          }}
        >
          Reset defaults
        </button>
        <button
          style={{ ...btn.primary, fontSize: '13px', opacity: isValid ? 1 : 0.5, cursor: isValid ? 'pointer' : 'not-allowed' }}
          disabled={!isValid}
          onClick={() => toast.success('Scoring weights saved — rescoring 300 prospects…')}
        >
          Save & Rescore
        </button>
      </div>
    </div>
  );
}
