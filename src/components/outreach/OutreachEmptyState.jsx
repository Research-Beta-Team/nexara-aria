import { C, F, R, S, btn, cardStyle } from '../../tokens';

export default function OutreachEmptyState({ hasProspects, onAddProspects, onImport }) {
  return (
    <div style={{ padding: S[8], textAlign: 'center', ...cardStyle }}>
      <p style={{ fontFamily: F.body, fontSize: '14px', color: C.textMuted, margin: '0 0 12px' }}>
        {hasProspects
          ? 'No prospects match the current filters or search.'
          : 'No prospects yet. Add prospects to a campaign or import from your CRM.'}
      </p>
      <div style={{ display: 'flex', gap: S[2], justifyContent: 'center', flexWrap: 'wrap' }}>
        <button style={{ ...btn.primary, fontSize: '13px' }} onClick={onAddProspects}>
          Add prospects
        </button>
        <button style={{ ...btn.secondary, fontSize: '13px' }} onClick={onImport}>
          Import from CRM
        </button>
      </div>
    </div>
  );
}
