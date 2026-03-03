import { C, F, R, S, T } from '../../tokens';

const SEVERITIES  = ['High', 'Medium', 'Low'];
const STATUSES    = ['Pending', 'Approved', 'Denied'];
const AGENT_TYPES = ['Budget Guardian', 'Reply Handler', 'Ad Composer', 'Prospector', 'Insight Engine', 'Email Sequencer', 'Brand Enforcer'];

function Pill({ label, active, color, onClick, count }) {
  const col = active ? (color ?? C.primary) : C.textMuted;
  return (
    <button
      onClick={onClick}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: '5px',
        fontFamily: F.body, fontSize: '12px', fontWeight: active ? 700 : 400,
        color: col,
        backgroundColor: active ? `${col}18` : 'transparent',
        border: `1px solid ${active ? `${col}40` : C.border}`,
        borderRadius: R.pill, padding: `3px 10px`,
        cursor: 'pointer', transition: T.color,
        whiteSpace: 'nowrap',
      }}
    >
      {label}
      {count != null && <span style={{ fontFamily: F.mono, fontSize: '10px', opacity: 0.7 }}>{count}</span>}
    </button>
  );
}

export default function EscalationFilterBar({ escalations, filters, onChange }) {
  const { severity, agentType, status, client } = filters;

  const countBy = (field, val) => escalations.filter((e) => e[field] === val).length;

  const sevColor = { High: '#EF4444', Medium: C.amber, Low: C.primary };

  return (
    <div style={{
      backgroundColor: C.surface,
      border: `1px solid ${C.border}`,
      borderRadius: R.card,
      padding: `${S[3]} ${S[4]}`,
      display: 'flex', flexDirection: 'column', gap: S[2],
    }}>
      {/* Row 1: severity + status */}
      <div style={{ display: 'flex', gap: S[2], flexWrap: 'wrap', alignItems: 'center' }}>
        <Pill label="All" active={!severity && !status} count={escalations.length} onClick={() => onChange({ severity: null, status: null })} />

        <div style={{ width: '1px', height: '14px', backgroundColor: C.border }} />

        {SEVERITIES.map((s) => (
          <Pill key={s} label={s} active={severity === s} color={sevColor[s]} count={countBy('severity', s)}
            onClick={() => onChange({ severity: severity === s ? null : s })} />
        ))}

        <div style={{ width: '1px', height: '14px', backgroundColor: C.border }} />

        {STATUSES.map((s) => (
          <Pill key={s} label={s} active={status === s} count={countBy('status', s.toLowerCase())}
            onClick={() => onChange({ status: status === s ? null : s })} />
        ))}
      </div>

      {/* Row 2: agent type */}
      <div style={{ display: 'flex', gap: S[2], flexWrap: 'wrap', alignItems: 'center' }}>
        <span style={{ fontFamily: F.mono, fontSize: '10px', color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>Agent</span>
        <Pill label="Any" active={!agentType} onClick={() => onChange({ agentType: null })} />
        {AGENT_TYPES.filter((a) => escalations.some((e) => e.agentType === a)).map((a) => (
          <Pill key={a} label={a} active={agentType === a} count={countBy('agentType', a)}
            onClick={() => onChange({ agentType: agentType === a ? null : a })} />
        ))}
      </div>
    </div>
  );
}
