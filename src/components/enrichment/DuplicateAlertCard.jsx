/**
 * Two lead cards, match confidence, Merge / Keep Separate.
 */
import { C, F, R, S, btn } from '../../tokens';

function MiniLeadCard({ lead, highlightFields = [] }) {
  return (
    <div
      style={{
        padding: S[3],
        backgroundColor: C.surface2,
        border: `1px solid ${C.border}`,
        borderRadius: R.card,
        flex: 1,
        minWidth: 0,
      }}
    >
      <div style={{ fontFamily: F.body, fontSize: '13px', fontWeight: 600, color: C.textPrimary }}>{lead.name}</div>
      <div style={{ fontFamily: F.body, fontSize: '12px', color: highlightFields.includes('company') ? C.primary : C.textSecondary }}>
        {lead.company}
      </div>
      <div style={{ fontFamily: F.mono, fontSize: '11px', color: highlightFields.includes('email') ? C.primary : C.textMuted }}>
        {lead.email || '—'}
      </div>
      {lead.title != null && (
        <div style={{ fontFamily: F.body, fontSize: '11px', color: highlightFields.includes('title') ? C.primary : C.textMuted }}>
          {lead.title}
        </div>
      )}
      <div style={{ fontFamily: F.body, fontSize: '10px', color: C.textMuted }}>Source: {lead.source}</div>
    </div>
  );
}

export default function DuplicateAlertCard({ duplicate, onMerge, onKeepSeparate }) {
  return (
    <div
      style={{
        padding: S[4],
        backgroundColor: C.surface,
        border: `1px solid ${C.amber}`,
        borderRadius: R.card,
        marginBottom: S[3],
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: S[3] }}>
        <span style={{ fontFamily: F.mono, fontSize: '12px', fontWeight: 700, color: C.amber }}>
          {duplicate.confidence}% match
        </span>
      </div>
      <div style={{ display: 'flex', gap: S[4], marginBottom: S[4] }}>
        <MiniLeadCard lead={duplicate.leadA} highlightFields={duplicate.matchFields || []} />
        <div style={{ display: 'flex', alignItems: 'center', color: C.textMuted }}>≈</div>
        <MiniLeadCard lead={duplicate.leadB} highlightFields={duplicate.matchFields || []} />
      </div>
      <div style={{ display: 'flex', gap: S[2] }}>
        <button type="button" onClick={() => onMerge?.(duplicate)} style={btn.primary}>
          Merge
        </button>
        <button type="button" onClick={() => onKeepSeparate?.(duplicate)} style={btn.secondary}>
          Keep Separate
        </button>
      </div>
    </div>
  );
}
