import { C, F, R, S, inputStyle, labelStyle } from '../../tokens';

const ROLES = [
  { id: 'owner',             label: 'Campaign Owner',      desc: 'Oversees the entire campaign. Receives all alerts.',          required: true  },
  { id: 'mediaBuyer',        label: 'Media Buyer',         desc: 'Manages paid channel budgets and bid strategies.',            required: false },
  { id: 'contentStrategist', label: 'Content Strategist',  desc: 'Reviews and approves all ARIA-generated content.',            required: false },
  { id: 'sdr',               label: 'SDR / Outreach',      desc: 'Handles prospect replies and books demos.',                   required: false },
  { id: 'analyst',           label: 'Analyst',             desc: 'Receives weekly pacing reports and performance dashboards.',  required: false },
];

const TEAM_MEMBERS = [
  'Jamie L.',
  'Sara K.',
  'Chris M.',
  'Priya N.',
  'Alex T.',
  'Morgan R.',
  'Dana P.',
];

function RoleRow({ role, value, onChange }) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '1fr 200px',
      gap: S[4],
      alignItems: 'center',
      padding: `${S[3]} ${S[4]}`,
      borderBottom: `1px solid ${C.border}`,
    }}>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: S[2] }}>
          <span style={{ fontFamily: F.body, fontSize: '13px', fontWeight: 600, color: C.textPrimary }}>
            {role.label}
          </span>
          {role.required && (
            <span style={{
              fontFamily: F.mono, fontSize: '9px', fontWeight: 700, color: C.red,
              backgroundColor: C.redDim, border: `1px solid rgba(255,110,122,0.2)`,
              borderRadius: R.pill, padding: `1px ${S[1]}`,
            }}>
              Required
            </span>
          )}
        </div>
        <div style={{ fontFamily: F.body, fontSize: '12px', color: C.textMuted, marginTop: '2px' }}>
          {role.desc}
        </div>
      </div>

      <select
        value={value ?? ''}
        onChange={(e) => onChange(role.id, e.target.value)}
        style={{ ...inputStyle, fontSize: '13px', cursor: 'pointer' }}
      >
        <option value="">— Unassigned —</option>
        {TEAM_MEMBERS.map((m) => <option key={m} value={m}>{m}</option>)}
      </select>
    </div>
  );
}

export default function WizardStep5({ data, onChange, errors }) {
  const handleChange = (roleId, value) => {
    onChange('team', { ...(data.team ?? {}), [roleId]: value });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: S[5] }}>
      <div>
        <h2 style={{ fontFamily: F.display, fontSize: '20px', fontWeight: 800, color: C.textPrimary, margin: `0 0 ${S[1]}`, letterSpacing: '-0.02em' }}>
          Team Assignment
        </h2>
        <p style={{ fontFamily: F.body, fontSize: '13px', color: C.textSecondary, margin: 0 }}>
          Assign team members to each role. Unassigned roles will be handled autonomously by ARIA agents.
        </p>
      </div>

      {errors?.owner && (
        <div style={{ fontFamily: F.body, fontSize: '12px', color: C.red, backgroundColor: C.redDim, border: `1px solid rgba(255,110,122,0.2)`, borderRadius: R.md, padding: `${S[2]} ${S[3]}` }}>
          {errors.owner}
        </div>
      )}

      <div style={{ backgroundColor: C.surface2, border: `1px solid ${C.border}`, borderRadius: R.card, overflow: 'hidden' }}>
        {/* Header */}
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 200px', gap: S[4],
          padding: `${S[2]} ${S[4]}`, borderBottom: `1px solid ${C.border}`,
          backgroundColor: C.surface3,
        }}>
          <span style={{ fontFamily: F.body, fontSize: '11px', fontWeight: 600, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Role</span>
          <span style={{ fontFamily: F.body, fontSize: '11px', fontWeight: 600, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Assigned To</span>
        </div>

        {ROLES.map((role) => (
          <RoleRow
            key={role.id}
            role={role}
            value={(data.team ?? {})[role.id]}
            onChange={handleChange}
          />
        ))}
      </div>

      {/* ARIA autonomy note */}
      <div style={{
        backgroundColor: C.surface3,
        border: `1px solid ${C.border}`,
        borderRadius: R.md,
        padding: S[4],
        display: 'flex',
        gap: S[3],
        alignItems: 'flex-start',
      }}>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0, marginTop: '1px' }}>
          <circle cx="8" cy="8" r="6.5" stroke={C.secondary} strokeWidth="1.3"/>
          <path d="M8 7v4M8 5v.5" stroke={C.secondary} strokeWidth="1.3" strokeLinecap="round"/>
        </svg>
        <p style={{ fontFamily: F.body, fontSize: '12px', color: C.textSecondary, margin: 0, lineHeight: '1.5' }}>
          Roles left unassigned will be executed by ARIA AI agents with full autonomy. You can override agent decisions at any time from the campaign detail view.
        </p>
      </div>
    </div>
  );
}
