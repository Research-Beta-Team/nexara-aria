/**
 * Download PDF, Download PPTX; options; share link, email.
 */
import { C, F, R, S, btn } from '../../tokens';

export default function ExportPanel({ onExportPdf, onExportPptx, onShareLink, onEmail }) {
  return (
    <div
      style={{
        padding: S[4],
        backgroundColor: C.surface,
        border: `1px solid ${C.border}`,
        borderRadius: R.card,
      }}
    >
      <div style={{ fontFamily: F.display, fontSize: '14px', fontWeight: 700, color: C.textPrimary, marginBottom: S[4] }}>
        Export
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: S[3] }}>
        <button type="button" onClick={() => onExportPdf?.()} style={btn.primary}>
          Download PDF
        </button>
        <button type="button" onClick={() => onExportPptx?.()} style={btn.primary}>
          Download PPTX
        </button>
        <button type="button" onClick={() => onShareLink?.()} style={btn.secondary}>
          Share link
        </button>
        <button type="button" onClick={() => onEmail?.()} style={btn.ghost}>
          Email report
        </button>
      </div>
    </div>
  );
}
