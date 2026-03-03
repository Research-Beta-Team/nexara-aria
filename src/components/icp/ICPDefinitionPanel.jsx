import { useState, useEffect, useRef } from 'react';
import { ICP_DEFINITION } from '../../data/icp';
import useToast from '../../hooks/useToast';
import { C, F, R, S, T, btn, inputStyle } from '../../tokens';

// ── SVG Score Ring ─────────────────────────────
const CIRC = 2 * Math.PI * 50; // 314.16

function ScoreRing({ score }) {
  const [offset, setOffset] = useState(CIRC);

  useEffect(() => {
    const t = setTimeout(() => setOffset(CIRC * (1 - score / 100)), 300);
    return () => clearTimeout(t);
  }, [score]);

  return (
    <svg width="130" height="130" viewBox="0 0 120 120">
      <circle cx="60" cy="60" r="50" fill="none" stroke={C.surface3} strokeWidth="9" />
      <circle
        cx="60" cy="60" r="50"
        fill="none"
        stroke={C.primary}
        strokeWidth="9"
        strokeLinecap="round"
        strokeDasharray={CIRC}
        strokeDashoffset={offset}
        transform="rotate(-90 60 60)"
        style={{ transition: 'stroke-dashoffset 1.2s ease' }}
      />
      <text
        x="60" y="55" textAnchor="middle"
        style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '26px', fontWeight: 700, fill: 'var(--c-primary)' }}
      >
        {score}
      </text>
      <text
        x="60" y="74" textAnchor="middle"
        style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '11px', fill: 'var(--c-text-secondary)' }}
      >
        / 100 ICP Score
      </text>
    </svg>
  );
}

// ── Chip type metadata ─────────────────────────
const TYPE_META = {
  required:    { label: 'Required',    color: '#3DDC84', bg: 'rgba(61,220,132,0.12)',  border: 'rgba(61,220,132,0.3)'  },
  preferred:   { label: 'Preferred',   color: '#5EEAD4', bg: 'rgba(94,234,212,0.12)',  border: 'rgba(94,234,212,0.3)'  },
  dealBreaker: { label: 'Dealbreaker', color: '#FF6E7A', bg: 'rgba(255,110,122,0.12)', border: 'rgba(255,110,122,0.3)' },
};

const TAG_META = {
  mustHave:    { color: '#3DDC84', bg: 'rgba(61,220,132,0.12)',  border: 'rgba(61,220,132,0.3)'  },
  niceToHave:  { color: '#5EEAD4', bg: 'rgba(94,234,212,0.12)',  border: 'rgba(94,234,212,0.3)'  },
  dealBreaker: { color: '#FF6E7A', bg: 'rgba(255,110,122,0.12)', border: 'rgba(255,110,122,0.3)' },
  keywords:    { color: '#F5C842', bg: 'rgba(245,200,66,0.12)',  border: 'rgba(245,200,66,0.3)'  },
  painPoints:  { color: '#A78BFA', bg: 'rgba(167,139,250,0.12)', border: 'rgba(167,139,250,0.3)' },
  trigger:     { color: '#60A5FA', bg: 'rgba(96,165,250,0.12)',  border: 'rgba(96,165,250,0.3)'  },
  muted:       { color: '#6B9478', bg: 'rgba(107,148,120,0.1)',  border: 'rgba(107,148,120,0.2)' },
};

// ── Chip component ─────────────────────────────
function Chip({ value, colorMeta, onDelete, onCycleType, typeLabel }) {
  const { color, bg, border } = colorMeta;
  return (
    <div style={{
      display:         'inline-flex',
      alignItems:      'center',
      gap:             '4px',
      padding:         `3px ${S[2]} 3px ${S[2]}`,
      borderRadius:    R.pill,
      border:          `1px solid ${border}`,
      backgroundColor: bg,
      fontSize:        '12px',
      fontFamily:      F.body,
      color,
      flexShrink:      0,
    }}>
      {typeLabel && (
        <span
          style={{ fontSize: '9px', fontFamily: F.mono, fontWeight: 700, opacity: 0.7, cursor: onCycleType ? 'pointer' : 'default', textTransform: 'uppercase', letterSpacing: '0.04em' }}
          onClick={onCycleType}
          title={onCycleType ? 'Click to cycle type' : undefined}
        >
          {typeLabel}
        </span>
      )}
      <span>{value}</span>
      <button
        onClick={onDelete}
        style={{
          background: 'none', border: 'none', cursor: 'pointer',
          color, opacity: 0.7, fontSize: '12px', lineHeight: 1, padding: '0 1px',
          display: 'flex', alignItems: 'center',
        }}
      >×</button>
    </div>
  );
}

// ── Section (collapsible) ──────────────────────
function Section({ title, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div style={{
      backgroundColor: C.surface,
      border:          `1px solid ${C.border}`,
      borderRadius:    R.card,
      overflow:        'hidden',
    }}>
      <button
        style={{
          display:         'flex',
          alignItems:      'center',
          justifyContent:  'space-between',
          width:           '100%',
          padding:         `${S[3]} ${S[4]}`,
          background:      'none',
          border:          'none',
          cursor:          'pointer',
          borderBottom:    open ? `1px solid ${C.border}` : 'none',
        }}
        onClick={() => setOpen((o) => !o)}
      >
        <span style={{ fontFamily: F.body, fontSize: '13px', fontWeight: 700, color: C.textPrimary }}>
          {title}
        </span>
        <svg
          width="14" height="14" viewBox="0 0 14 14" fill="none"
          style={{ transform: open ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.15s ease', color: C.textMuted }}
        >
          <path d="M2.5 5l4.5 4 4.5-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
      {open && <div style={{ padding: S[4] }}>{children}</div>}
    </div>
  );
}

// ── ChipGroup: deletable + addable string array ──
function ChipGroup({ values, colorMeta, onDelete, onAdd, placeholder = 'Add value…' }) {
  const [adding, setAdding] = useState(false);
  const [val, setVal]       = useState('');
  const inputRef            = useRef(null);
  const toast               = useToast();

  useEffect(() => {
    if (adding) inputRef.current?.focus();
  }, [adding]);

  const commit = () => {
    if (val.trim()) { onAdd(val.trim()); toast.success(`Added "${val.trim()}"`); }
    setVal('');
    setAdding(false);
  };

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', alignItems: 'center' }}>
      {values.map((v, i) => (
        <Chip key={i} value={v} colorMeta={colorMeta} onDelete={() => onDelete(i)} />
      ))}
      {adding ? (
        <input
          ref={inputRef}
          value={val}
          onChange={(e) => setVal(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') commit(); if (e.key === 'Escape') { setAdding(false); setVal(''); } }}
          onBlur={commit}
          placeholder={placeholder}
          style={{ ...inputStyle, width: '140px', fontSize: '12px', padding: '3px 8px' }}
        />
      ) : (
        <button
          style={{ ...btn.ghost, fontSize: '11px', padding: '2px 8px', color: C.textMuted, border: `1px dashed ${C.border}`, borderRadius: R.pill }}
          onClick={() => setAdding(true)}
        >
          + Add
        </button>
      )}
    </div>
  );
}

// ── TypedChipGroup: {value, type} arrays (firmographic) ──
function TypedChipGroup({ items, onDelete, onCycleType, onAdd, placeholder }) {
  const TYPES = ['required', 'preferred'];
  const [adding, setAdding] = useState(false);
  const [val, setVal]       = useState('');
  const inputRef            = useRef(null);
  const toast               = useToast();

  useEffect(() => {
    if (adding) inputRef.current?.focus();
  }, [adding]);

  const commit = () => {
    if (val.trim()) { onAdd(val.trim()); toast.success(`Added "${val.trim()}"`); }
    setVal('');
    setAdding(false);
  };

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', alignItems: 'center' }}>
      {items.map((item, i) => (
        <Chip
          key={i}
          value={item.value}
          colorMeta={TYPE_META[item.type] ?? TYPE_META.preferred}
          typeLabel={TYPE_META[item.type]?.label}
          onDelete={() => onDelete(i)}
          onCycleType={() => {
            const nextType = TYPES[(TYPES.indexOf(item.type) + 1) % TYPES.length];
            onCycleType(i, nextType);
          }}
        />
      ))}
      {adding ? (
        <input
          ref={inputRef}
          value={val}
          onChange={(e) => setVal(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') commit(); if (e.key === 'Escape') { setAdding(false); setVal(''); } }}
          onBlur={commit}
          placeholder={placeholder ?? 'Add criterion…'}
          style={{ ...inputStyle, width: '160px', fontSize: '12px', padding: '3px 8px' }}
        />
      ) : (
        <button
          style={{ ...btn.ghost, fontSize: '11px', padding: '2px 8px', color: C.textMuted, border: `1px dashed ${C.border}`, borderRadius: R.pill }}
          onClick={() => setAdding(true)}
        >
          + Add
        </button>
      )}
    </div>
  );
}

// ── Dimension bar ──────────────────────────────
function DimBar({ label, score }) {
  const color = score >= 85 ? '#3DDC84' : score >= 70 ? '#5EEAD4' : score >= 50 ? '#F5C842' : '#FF6E7A';
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: S[2] }}>
      <span style={{ fontFamily: F.body, fontSize: '12px', color: C.textSecondary, width: '110px', flexShrink: 0 }}>
        {label}
      </span>
      <div style={{ flex: 1, height: '5px', backgroundColor: C.surface3, borderRadius: R.pill, overflow: 'hidden' }}>
        <div style={{ width: `${score}%`, height: '100%', backgroundColor: color, borderRadius: R.pill, transition: 'width 0.8s ease' }} />
      </div>
      <span style={{ fontFamily: F.mono, fontSize: '12px', fontWeight: 700, color, width: '28px', textAlign: 'right', flexShrink: 0 }}>
        {score}
      </span>
    </div>
  );
}

// ── Main component ─────────────────────────────
export default function ICPDefinitionPanel() {
  const toast = useToast();

  // Editable local state (deep copy of ICP_DEFINITION)
  const [def, setDef] = useState(() => ({
    firmographic: {
      industries:   ICP_DEFINITION.firmographic.industries.map((x) => ({ ...x })),
      companySizes: ICP_DEFINITION.firmographic.companySizes.map((x) => ({ ...x })),
      geographies:  ICP_DEFINITION.firmographic.geographies.map((x) => ({ ...x })),
      revenueRange:  ICP_DEFINITION.firmographic.revenueRange,
      employeeRange: ICP_DEFINITION.firmographic.employeeRange,
    },
    technographic: {
      mustHave:    [...ICP_DEFINITION.technographic.mustHave],
      niceToHave:  [...ICP_DEFINITION.technographic.niceToHave],
      dealBreaker: [...ICP_DEFINITION.technographic.dealBreaker],
    },
    psychographic: {
      keywords:      [...ICP_DEFINITION.psychographic.keywords],
      painPoints:    [...ICP_DEFINITION.psychographic.painPoints],
      triggerEvents: [...ICP_DEFINITION.psychographic.triggerEvents],
    },
    contactCriteria: {
      titles:      [...ICP_DEFINITION.contactCriteria.titles],
      seniority:   [...ICP_DEFINITION.contactCriteria.seniority],
      departments: [...ICP_DEFINITION.contactCriteria.departments],
    },
  }));

  // Helpers
  const delTyped = (section, key, idx) =>
    setDef((p) => ({ ...p, [section]: { ...p[section], [key]: p[section][key].filter((_, i) => i !== idx) } }));

  const addTyped = (section, key, value) =>
    setDef((p) => ({ ...p, [section]: { ...p[section], [key]: [...p[section][key], { value, type: 'preferred' }] } }));

  const cycleTyped = (section, key, idx, newType) =>
    setDef((p) => {
      const arr = p[section][key].map((x, i) => i === idx ? { ...x, type: newType } : x);
      return { ...p, [section]: { ...p[section], [key]: arr } };
    });

  const delStr = (section, key, idx) =>
    setDef((p) => ({ ...p, [section]: { ...p[section], [key]: p[section][key].filter((_, i) => i !== idx) } }));

  const addStr = (section, key, value) =>
    setDef((p) => ({ ...p, [section]: { ...p[section], [key]: [...p[section][key], value] } }));

  const { icpScore, dimensionScores, ariaCommentary } = ICP_DEFINITION;

  const subLabel = {
    fontFamily: F.mono, fontSize: '10px', fontWeight: 700,
    textTransform: 'uppercase', letterSpacing: '0.06em',
    color: C.textMuted, marginBottom: S[2], display: 'block',
  };

  const fieldRow = { display: 'flex', flexDirection: 'column', gap: S[1], marginBottom: S[3] };

  return (
    <div style={{ display: 'flex', gap: S[5], alignItems: 'flex-start' }}>

      {/* ── Left: ICP definition editor ──────────── */}
      <div style={{ flex: '1 1 0', minWidth: 0, display: 'flex', flexDirection: 'column', gap: S[3] }}>

        {/* Firmographic */}
        <Section title="Firmographic Criteria">
          <div style={{ display: 'flex', flexDirection: 'column', gap: S[4] }}>
            <div style={fieldRow}>
              <span style={subLabel}>Industries</span>
              <TypedChipGroup
                items={def.firmographic.industries}
                onDelete={(i) => delTyped('firmographic','industries',i)}
                onCycleType={(i, t) => cycleTyped('firmographic','industries',i,t)}
                onAdd={(v) => addTyped('firmographic','industries',v)}
                placeholder="Add industry…"
              />
            </div>
            <div style={fieldRow}>
              <span style={subLabel}>Company Sizes</span>
              <TypedChipGroup
                items={def.firmographic.companySizes}
                onDelete={(i) => delTyped('firmographic','companySizes',i)}
                onCycleType={(i, t) => cycleTyped('firmographic','companySizes',i,t)}
                onAdd={(v) => addTyped('firmographic','companySizes',v)}
                placeholder="e.g. 501–2000 employees"
              />
            </div>
            <div style={fieldRow}>
              <span style={subLabel}>Geographies</span>
              <TypedChipGroup
                items={def.firmographic.geographies}
                onDelete={(i) => delTyped('firmographic','geographies',i)}
                onCycleType={(i, t) => cycleTyped('firmographic','geographies',i,t)}
                onAdd={(v) => addTyped('firmographic','geographies',v)}
                placeholder="Add country/region…"
              />
            </div>
            <div style={{ display: 'flex', gap: S[4] }}>
              <div style={{ flex: 1, ...fieldRow, marginBottom: 0 }}>
                <span style={subLabel}>Revenue Range</span>
                <input
                  style={{ ...inputStyle, fontSize: '13px' }}
                  value={def.firmographic.revenueRange}
                  onChange={(e) => setDef((p) => ({ ...p, firmographic: { ...p.firmographic, revenueRange: e.target.value } }))}
                />
              </div>
              <div style={{ flex: 1, ...fieldRow, marginBottom: 0 }}>
                <span style={subLabel}>Employee Range</span>
                <input
                  style={{ ...inputStyle, fontSize: '13px' }}
                  value={def.firmographic.employeeRange}
                  onChange={(e) => setDef((p) => ({ ...p, firmographic: { ...p.firmographic, employeeRange: e.target.value } }))}
                />
              </div>
            </div>
          </div>
        </Section>

        {/* Technographic */}
        <Section title="Technographic Signals">
          <div style={{ display: 'flex', flexDirection: 'column', gap: S[4] }}>
            <div style={fieldRow}>
              <span style={subLabel}>Must Have</span>
              <ChipGroup
                values={def.technographic.mustHave}
                colorMeta={TAG_META.mustHave}
                onDelete={(i) => delStr('technographic','mustHave',i)}
                onAdd={(v) => addStr('technographic','mustHave',v)}
                placeholder="e.g. QuickBooks"
              />
            </div>
            <div style={fieldRow}>
              <span style={subLabel}>Nice to Have</span>
              <ChipGroup
                values={def.technographic.niceToHave}
                colorMeta={TAG_META.niceToHave}
                onDelete={(i) => delStr('technographic','niceToHave',i)}
                onAdd={(v) => addStr('technographic','niceToHave',v)}
                placeholder="e.g. HubSpot"
              />
            </div>
            <div style={fieldRow}>
              <span style={subLabel}>Deal Breakers</span>
              <ChipGroup
                values={def.technographic.dealBreaker}
                colorMeta={TAG_META.dealBreaker}
                onDelete={(i) => delStr('technographic','dealBreaker',i)}
                onAdd={(v) => addStr('technographic','dealBreaker',v)}
                placeholder="e.g. Oracle ERP"
              />
            </div>
          </div>
        </Section>

        {/* Psychographic */}
        <Section title="Psychographic Signals">
          <div style={{ display: 'flex', flexDirection: 'column', gap: S[4] }}>
            <div style={fieldRow}>
              <span style={subLabel}>Keywords</span>
              <ChipGroup
                values={def.psychographic.keywords}
                colorMeta={TAG_META.keywords}
                onDelete={(i) => delStr('psychographic','keywords',i)}
                onAdd={(v) => addStr('psychographic','keywords',v)}
                placeholder="e.g. cash flow"
              />
            </div>
            <div style={fieldRow}>
              <span style={subLabel}>Pain Points</span>
              <ChipGroup
                values={def.psychographic.painPoints}
                colorMeta={TAG_META.painPoints}
                onDelete={(i) => delStr('psychographic','painPoints',i)}
                onAdd={(v) => addStr('psychographic','painPoints',v)}
                placeholder="e.g. Manual reporting…"
              />
            </div>
            <div style={fieldRow}>
              <span style={subLabel}>Trigger Events</span>
              <ChipGroup
                values={def.psychographic.triggerEvents}
                colorMeta={TAG_META.trigger}
                onDelete={(i) => delStr('psychographic','triggerEvents',i)}
                onAdd={(v) => addStr('psychographic','triggerEvents',v)}
                placeholder="e.g. New CFO hire"
              />
            </div>
          </div>
        </Section>

        {/* Contact Criteria */}
        <Section title="Contact Criteria">
          <div style={{ display: 'flex', flexDirection: 'column', gap: S[4] }}>
            <div style={fieldRow}>
              <span style={subLabel}>Titles</span>
              <ChipGroup
                values={def.contactCriteria.titles}
                colorMeta={TAG_META.muted}
                onDelete={(i) => delStr('contactCriteria','titles',i)}
                onAdd={(v) => addStr('contactCriteria','titles',v)}
                placeholder="e.g. VP Finance"
              />
            </div>
            <div style={fieldRow}>
              <span style={subLabel}>Seniority</span>
              <ChipGroup
                values={def.contactCriteria.seniority}
                colorMeta={TAG_META.muted}
                onDelete={(i) => delStr('contactCriteria','seniority',i)}
                onAdd={(v) => addStr('contactCriteria','seniority',v)}
                placeholder="e.g. Director"
              />
            </div>
            <div style={fieldRow}>
              <span style={subLabel}>Departments</span>
              <ChipGroup
                values={def.contactCriteria.departments}
                colorMeta={TAG_META.muted}
                onDelete={(i) => delStr('contactCriteria','departments',i)}
                onAdd={(v) => addStr('contactCriteria','departments',v)}
                placeholder="e.g. Finance"
              />
            </div>
          </div>
        </Section>

        {/* Save button */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: S[2] }}>
          <button style={{ ...btn.secondary, fontSize: '13px' }} onClick={() => toast.info('Changes discarded')}>
            Discard
          </button>
          <button style={{ ...btn.primary, fontSize: '13px' }} onClick={() => toast.success('ICP definition saved')}>
            Save ICP
          </button>
        </div>
      </div>

      {/* ── Right: Score card ─────────────────────── */}
      <div style={{
        width:           '280px',
        flexShrink:      0,
        display:         'flex',
        flexDirection:   'column',
        gap:             S[4],
        position:        'sticky',
        top:             S[4],
      }}>
        {/* Score ring card */}
        <div style={{
          backgroundColor: C.surface,
          border:          `1px solid ${C.border}`,
          borderRadius:    '12px',
          padding:         S[5],
          display:         'flex',
          flexDirection:   'column',
          alignItems:      'center',
          gap:             S[4],
        }}>
          <div style={{ fontFamily: F.display, fontSize: '13px', fontWeight: 700, color: C.textSecondary, alignSelf: 'flex-start' }}>
            ICP Quality Score
          </div>

          <ScoreRing score={icpScore} />

          {/* Dimension bars */}
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: S[2] }}>
            {Object.entries(dimensionScores).map(([key, val]) => (
              <DimBar
                key={key}
                label={key.charAt(0).toUpperCase() + key.slice(1)}
                score={val}
              />
            ))}
          </div>
        </div>

        {/* ARIA commentary */}
        <div style={{
          backgroundColor: 'rgba(61,220,132,0.06)',
          border:          `1px solid rgba(61,220,132,0.18)`,
          borderRadius:    R.card,
          padding:         S[4],
          display:         'flex',
          flexDirection:   'column',
          gap:             S[2],
        }}>
          <span style={{ fontFamily: F.mono, fontSize: '10px', fontWeight: 700, color: C.primary, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            ARIA Commentary
          </span>
          <p style={{ fontFamily: F.body, fontSize: '12px', color: C.textSecondary, margin: 0, lineHeight: '1.6' }}>
            {ariaCommentary}
          </p>
          <button
            style={{ ...btn.ghost, fontSize: '11px', color: C.primary, padding: `${S[1]} 0`, justifyContent: 'flex-start' }}
            onClick={() => toast.info('Opening detailed ARIA analysis…')}
          >
            See detailed analysis →
          </button>
        </div>
      </div>
    </div>
  );
}
