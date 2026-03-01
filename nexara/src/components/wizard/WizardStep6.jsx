import { C, F, R, S } from '../../tokens';

const APPROVAL_GATES = [
  { id: 'contentApproval',   label: 'Content Approval Gate',       desc: 'All ARIA-generated emails, ads, and copy require human approval before sending.' },
  { id: 'budgetChanges',     label: 'Budget Change Alerts',         desc: 'Notify owner when AI agents propose bid changes exceeding 15%.' },
  { id: 'escalationAlerts',  label: 'Escalation Alerts',            desc: 'Notify owner when CPL exceeds target threshold or anomalies are detected.' },
  { id: 'weeklyReport',      label: 'Weekly Performance Report',    desc: 'Auto-generate a weekly summary report for all assigned team members.' },
  { id: 'prospectReplies',   label: 'Reply Notifications',          desc: 'Alert the SDR immediately when a prospect replies to an outreach email.' },
];

const ESCALATION_ROUTES = [
  { id: 'owner',  label: 'Campaign Owner',  desc: 'Escalations go directly to the assigned campaign owner.' },
  { id: 'team',   label: 'Full Team',        desc: 'All team members are notified simultaneously.' },
  { id: 'slack',  label: 'Slack Channel',    desc: 'Post escalation alerts to a dedicated Slack channel.' },
];

const REPORTING_CADENCES = [
  { id: 'daily',     label: 'Daily'    },
  { id: 'weekly',    label: 'Weekly'   },
  { id: 'biweekly',  label: 'Bi-weekly'},
];

function Toggle({ checked, onChange }) {
  return (
    <div
      style={{
        width: '40px', height: '22px', borderRadius: R.pill,
        backgroundColor: checked ? C.primary : C.surface3,
        border: `1px solid ${checked ? C.primary : C.border}`,
        cursor: 'pointer', position: 'relative',
        transition: 'background-color 0.2s ease, border-color 0.2s ease',
        flexShrink: 0,
      }}
      onClick={onChange}
    >
      <div style={{
        position: 'absolute',
        top: '2px',
        left: checked ? '20px' : '2px',
        width: '16px', height: '16px', borderRadius: '50%',
        backgroundColor: checked ? C.textInverse : C.textMuted,
        transition: 'left 0.2s ease',
        boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
      }}/>
    </div>
  );
}

export default function WizardStep6({ data, onChange }) {
  const gates       = data.approvalGates      ?? { contentApproval: false, budgetChanges: true, escalationAlerts: true, weeklyReport: true, prospectReplies: true };
  const escRoute    = data.escalationRouting  ?? 'owner';
  const cadence     = data.reportingCadence   ?? 'weekly';

  const toggleGate = (id) => {
    onChange('approvalGates', { ...gates, [id]: !gates[id] });
  };

  const optionStyle = (active) => ({
    padding: `${S[2]} ${S[4]}`,
    backgroundColor: active ? C.primaryGlow : C.surface2,
    border: `1px solid ${active ? 'rgba(61,220,132,0.35)' : C.border}`,
    borderRadius: R.md,
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
    transition: 'all 0.15s ease',
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: S[5] }}>
      <div>
        <h2 style={{ fontFamily: F.display, fontSize: '20px', fontWeight: 800, color: C.textPrimary, margin: `0 0 ${S[1]}`, letterSpacing: '-0.02em' }}>
          Workflow Settings
        </h2>
        <p style={{ fontFamily: F.body, fontSize: '13px', color: C.textSecondary, margin: 0 }}>
          Configure approval gates, escalation routing, and reporting cadence.
        </p>
      </div>

      {/* Approval gates */}
      <div>
        <div style={{ fontFamily: F.body, fontSize: '12px', fontWeight: 600, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: S[3] }}>
          Approval Gates & Notifications
        </div>
        <div style={{ backgroundColor: C.surface2, border: `1px solid ${C.border}`, borderRadius: R.card, overflow: 'hidden' }}>
          {APPROVAL_GATES.map((gate, i) => (
            <div
              key={gate.id}
              style={{
                display: 'flex', alignItems: 'center', gap: S[4],
                padding: `${S[3]} ${S[4]}`,
                borderBottom: i < APPROVAL_GATES.length - 1 ? `1px solid ${C.border}` : 'none',
                cursor: 'pointer',
              }}
              onClick={() => toggleGate(gate.id)}
            >
              <Toggle checked={!!gates[gate.id]} onChange={() => toggleGate(gate.id)} />
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: F.body, fontSize: '13px', fontWeight: 600, color: C.textPrimary }}>{gate.label}</div>
                <div style={{ fontFamily: F.body, fontSize: '12px', color: C.textMuted }}>{gate.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Escalation routing */}
      <div>
        <div style={{ fontFamily: F.body, fontSize: '12px', fontWeight: 600, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: S[3] }}>
          Escalation Routing
        </div>
        <div style={{ display: 'flex', gap: S[3] }}>
          {ESCALATION_ROUTES.map((r) => (
            <div key={r.id} style={optionStyle(escRoute === r.id)} onClick={() => onChange('escalationRouting', r.id)}>
              <div style={{ display: 'flex', alignItems: 'center', gap: S[2] }}>
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', border: `2px solid ${escRoute === r.id ? C.primary : C.border}`, backgroundColor: escRoute === r.id ? C.primary : 'transparent', flexShrink: 0 }}/>
                <span style={{ fontFamily: F.body, fontSize: '13px', fontWeight: 600, color: escRoute === r.id ? C.primary : C.textPrimary }}>{r.label}</span>
              </div>
              <span style={{ fontFamily: F.body, fontSize: '11px', color: C.textMuted }}>{r.desc}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Reporting cadence */}
      <div>
        <div style={{ fontFamily: F.body, fontSize: '12px', fontWeight: 600, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: S[3] }}>
          Reporting Cadence
        </div>
        <div style={{ display: 'flex', gap: S[2] }}>
          {REPORTING_CADENCES.map((rc) => (
            <button
              key={rc.id}
              style={{
                fontFamily: F.body, fontSize: '13px', fontWeight: cadence === rc.id ? 600 : 400,
                color: cadence === rc.id ? C.primary : C.textSecondary,
                backgroundColor: cadence === rc.id ? C.primaryGlow : C.surface2,
                border: `1px solid ${cadence === rc.id ? 'rgba(61,220,132,0.35)' : C.border}`,
                borderRadius: R.pill, padding: `${S[1]} ${S[5]}`,
                cursor: 'pointer', transition: 'all 0.15s ease',
              }}
              onClick={() => onChange('reportingCadence', rc.id)}
            >
              {rc.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
