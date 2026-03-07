/**
 * Table: Channel, Budget, %, Target CPL, Projected MQLs, Rationale; "ARIA Recalculate".
 */
import { C, F, R, S, btn } from '../../tokens';

export default function ChannelBudgetModel({ channels = [], onRecalculate }) {
  const totalBudget = channels.reduce((s, r) => s + (r.budget || 0), 0);
  return (
    <div
      style={{
        padding: S[4],
        backgroundColor: C.surface,
        border: `1px solid ${C.border}`,
        borderRadius: R.card,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: S[4] }}>
        <span style={{ fontFamily: F.display, fontSize: '14px', fontWeight: 700, color: C.textPrimary }}>
          Channel & budget
        </span>
        <button
          type="button"
          onClick={onRecalculate}
          style={{ ...btn.secondary, color: C.secondary, borderColor: C.secondary, fontSize: '12px' }}
        >
          Freya Recalculate
        </button>
      </div>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: F.body, fontSize: '13px' }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'left', padding: `${S[2]} ${S[3]}`, fontWeight: 600, color: C.textSecondary, borderBottom: `1px solid ${C.border}` }}>Channel</th>
              <th style={{ textAlign: 'right', padding: `${S[2]} ${S[3]}`, fontWeight: 600, color: C.textSecondary, borderBottom: `1px solid ${C.border}` }}>Budget</th>
              <th style={{ textAlign: 'right', padding: `${S[2]} ${S[3]}`, fontWeight: 600, color: C.textSecondary, borderBottom: `1px solid ${C.border}` }}>%</th>
              <th style={{ textAlign: 'right', padding: `${S[2]} ${S[3]}`, fontWeight: 600, color: C.textSecondary, borderBottom: `1px solid ${C.border}` }}>Target CPL</th>
              <th style={{ textAlign: 'right', padding: `${S[2]} ${S[3]}`, fontWeight: 600, color: C.textSecondary, borderBottom: `1px solid ${C.border}` }}>Projected MQLs</th>
              <th style={{ textAlign: 'left', padding: `${S[2]} ${S[3]}`, fontWeight: 600, color: C.textSecondary, borderBottom: `1px solid ${C.border}` }}>Rationale</th>
            </tr>
          </thead>
          <tbody>
            {channels.map((row) => (
              <tr key={row.id} style={{ borderBottom: `1px solid ${C.border}` }}>
                <td style={{ padding: `${S[2]} ${S[3]}`, color: C.textPrimary }}>{row.name}</td>
                <td style={{ padding: `${S[2]} ${S[3]}`, color: C.textPrimary, textAlign: 'right', fontFamily: F.mono }}>${(row.budget || 0).toLocaleString()}</td>
                <td style={{ padding: `${S[2]} ${S[3]}`, color: C.textPrimary, textAlign: 'right', fontFamily: F.mono }}>{row.pct}%</td>
                <td style={{ padding: `${S[2]} ${S[3]}`, color: C.textPrimary, textAlign: 'right', fontFamily: F.mono }}>${row.targetCpl}</td>
                <td style={{ padding: `${S[2]} ${S[3]}`, color: C.primary, textAlign: 'right', fontFamily: F.mono }}>{row.projectedMqls}</td>
                <td style={{ padding: `${S[2]} ${S[3]}`, color: C.textSecondary, fontSize: '12px' }}>{row.rationale}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {totalBudget > 0 && (
        <div style={{ fontFamily: F.mono, fontSize: '12px', color: C.textMuted, marginTop: S[3] }}>
          Total budget: ${totalBudget.toLocaleString()}
        </div>
      )}
    </div>
  );
}
