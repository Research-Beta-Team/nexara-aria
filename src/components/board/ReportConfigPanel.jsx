/**
 * Period, audience, section checkboxes, branding (logo, color), "Generate Report".
 */
import { C, F, R, S, btn, labelStyle, inputStyle } from '../../tokens';
import { SLIDE_TYPES } from '../../data/boardReportMock';

export default function ReportConfigPanel({ config, onChange, onGenerate }) {
  const { period, audience, sections = [], branding = {} } = config || {};
  const toggleSection = (id) => {
    const next = sections.includes(id) ? sections.filter((s) => s !== id) : [...sections, id];
    onChange?.({ ...config, sections: next });
  };
  return (
    <div
      style={{
        padding: S[6],
        backgroundColor: C.surface,
        border: `1px solid ${C.border}`,
        borderRadius: R.card,
      }}
    >
      <h2 style={{ fontFamily: F.display, fontSize: '16px', fontWeight: 700, color: C.textPrimary, margin: `0 0 ${S[4]} 0` }}>
        Report configuration
      </h2>
      <div style={{ marginBottom: S[4] }}>
        <label style={labelStyle}>Period</label>
        <select
          value={period}
          onChange={(e) => onChange?.({ ...config, period: e.target.value })}
          style={{ ...inputStyle, width: '100%' }}
        >
          <option value="Q2 2025">Q2 2025</option>
          <option value="Q1 2025">Q1 2025</option>
          <option value="Q4 2024">Q4 2024</option>
        </select>
      </div>
      <div style={{ marginBottom: S[4] }}>
        <label style={labelStyle}>Audience</label>
        <select
          value={audience}
          onChange={(e) => onChange?.({ ...config, audience: e.target.value })}
          style={{ ...inputStyle, width: '100%' }}
        >
          <option value="Board">Board</option>
          <option value="Executive">Executive</option>
          <option value="Investors">Investors</option>
        </select>
      </div>
      <div style={{ marginBottom: S[4] }}>
        <label style={labelStyle}>Sections</label>
        <div style={{ display: 'flex', flexDirection: 'column', gap: S[2] }}>
          {SLIDE_TYPES.map((slide) => (
            <label key={slide.id} style={{ display: 'flex', alignItems: 'center', gap: S[2], fontFamily: F.body, fontSize: '13px', color: C.textPrimary, cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={sections.includes(slide.id)}
                onChange={() => toggleSection(slide.id)}
              />
              {slide.label}
            </label>
          ))}
        </div>
      </div>
      <div style={{ marginBottom: S[4] }}>
        <label style={labelStyle}>Primary color</label>
        <input
          type="text"
          value={branding.primaryColor || '#1A5C35'}
          onChange={(e) => onChange?.({ ...config, branding: { ...branding, primaryColor: e.target.value } })}
          placeholder="#1A5C35"
          style={{ ...inputStyle, width: '100%' }}
        />
      </div>
      <button type="button" onClick={() => onGenerate?.()} style={btn.primary}>
        Generate Report
      </button>
    </div>
  );
}
