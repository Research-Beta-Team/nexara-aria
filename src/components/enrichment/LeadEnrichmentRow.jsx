/**
 * Lead name, company, status (Fully Enriched / Enriching / Partial), source chips, completeness bar (mint/amber/red), "View Profile".
 */
import { C, F, R, S, btn } from '../../tokens';

const STATUS_LABELS = {
  fully_enriched: 'Fully Enriched',
  enriching: 'Enriching',
  partial: 'Partial',
};

function completenessColor(pct) {
  if (pct >= 80) return C.primary;
  if (pct >= 50) return C.amber;
  return C.red;
}

export default function LeadEnrichmentRow({ lead, selected, onSelect, onViewProfile }) {
  const color = completenessColor(lead.completeness || 0);
  const statusLabel = STATUS_LABELS[lead.status] || lead.status;
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onSelect?.(lead)}
      onKeyDown={(e) => e.key === 'Enter' && onSelect?.(lead)}
      style={{
        padding: S[4],
        backgroundColor: selected ? C.surface2 : C.surface,
        border: `1px solid ${selected ? C.primary : C.border}`,
        borderRadius: R.card,
        cursor: onSelect ? 'pointer' : 'default',
        marginBottom: S[2],
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: S[2] }}>
        <div>
          <div style={{ fontFamily: F.display, fontSize: '14px', fontWeight: 700, color: C.textPrimary }}>
            {lead.leadName}
          </div>
          <div style={{ fontFamily: F.body, fontSize: '12px', color: C.textSecondary }}>
            {lead.company}
          </div>
        </div>
        <span
          style={{
            fontFamily: F.mono,
            fontSize: '10px',
            fontWeight: 700,
            padding: '2px 8px',
            borderRadius: R.pill,
            backgroundColor: lead.status === 'fully_enriched' ? C.greenDim : lead.status === 'enriching' ? C.amberDim : C.surface3,
            color: lead.status === 'fully_enriched' ? C.primary : lead.status === 'enriching' ? C.amber : C.textMuted,
          }}
        >
          {statusLabel}
        </span>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: S[1], marginBottom: S[2] }}>
        {(lead.sources || []).map((src) => (
          <span
            key={src}
            style={{
              fontFamily: F.body,
              fontSize: '10px',
              color: C.textMuted,
              backgroundColor: C.surface3,
              padding: '2px 6px',
              borderRadius: R.pill,
            }}
          >
            {src}
          </span>
        ))}
      </div>
      <div style={{ marginBottom: S[2] }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: C.textMuted, marginBottom: S[1] }}>
          <span>Completeness</span>
          <span>{lead.completeness}%</span>
        </div>
        <div
          style={{
            height: 6,
            backgroundColor: C.surface3,
            borderRadius: R.pill,
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              width: `${lead.completeness || 0}%`,
              height: '100%',
              backgroundColor: color,
              borderRadius: R.pill,
            }}
          />
        </div>
      </div>
      <button type="button" onClick={(e) => { e.stopPropagation(); onViewProfile?.(lead); }} style={btn.ghost}>
        View Profile
      </button>
    </div>
  );
}
