import { C, F, R, S, T, inputStyle, labelStyle, flex } from '../../tokens';

const CAMPAIGN_TYPES = [
  { id: 'demand_gen',        label: 'Demand Gen',        desc: 'Generate qualified leads from cold audiences' },
  { id: 'brand_awareness',   label: 'Brand Awareness',   desc: 'Increase brand recognition and reach'         },
  { id: 'abm',               label: 'ABM',               desc: 'Target named accounts with personalized plays' },
  { id: 'retargeting',       label: 'Retargeting',        desc: 'Re-engage warm or website audiences'          },
];

const GOAL_METRICS = ['Leads', 'MQLs', 'SQLs', 'Demo Bookings', 'Pipeline Value'];

function Field({ label, children, error }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: S[1] }}>
      <label style={labelStyle}>{label}</label>
      {children}
      {error && (
        <span style={{ fontFamily: F.body, fontSize: '11px', color: C.red }}>{error}</span>
      )}
    </div>
  );
}

function TextInput({ value, onChange, placeholder, type = 'text' }) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      style={inputStyle}
    />
  );
}

export default function WizardStep1({ data, onChange, errors }) {
  const typeCardStyle = (selected) => ({
    padding: S[3],
    backgroundColor: selected ? C.primaryGlow : C.surface2,
    border: `1px solid ${selected ? 'rgba(61,220,132,0.4)' : C.border}`,
    borderRadius: R.md,
    cursor: 'pointer',
    transition: T.base,
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '3px',
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: S[5] }}>
      <div>
        <h2 style={{ fontFamily: F.display, fontSize: '20px', fontWeight: 800, color: C.textPrimary, margin: `0 0 ${S[1]}`, letterSpacing: '-0.02em' }}>
          Campaign Basics
        </h2>
        <p style={{ fontFamily: F.body, fontSize: '13px', color: C.textSecondary, margin: 0 }}>
          Set the foundation — name, objective, and budget.
        </p>
      </div>

      {/* Campaign name */}
      <Field label="Campaign Name" error={errors?.name}>
        <TextInput
          value={data.name}
          onChange={(v) => onChange('name', v)}
          placeholder="e.g. CFO Vietnam Q2 2025"
        />
      </Field>

      {/* Campaign type */}
      <Field label="Campaign Type" error={errors?.type}>
        <div style={{ display: 'flex', gap: S[2] }}>
          {CAMPAIGN_TYPES.map((t) => (
            <div key={t.id} style={typeCardStyle(data.type === t.id)} onClick={() => onChange('type', t.id)}>
              <div style={{ display: 'flex', alignItems: 'center', gap: S[1] }}>
                {data.type === t.id && (
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: C.primary, flexShrink: 0 }}/>
                )}
                <span style={{ fontFamily: F.body, fontSize: '12px', fontWeight: 600, color: data.type === t.id ? C.primary : C.textPrimary }}>
                  {t.label}
                </span>
              </div>
              <span style={{ fontFamily: F.body, fontSize: '11px', color: C.textMuted, lineHeight: '1.3' }}>{t.desc}</span>
            </div>
          ))}
        </div>
      </Field>

      {/* Goal metric + target — 2 col */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: S[4] }}>
        <Field label="Goal Metric" error={errors?.goalMetric}>
          <select
            value={data.goalMetric}
            onChange={(e) => onChange('goalMetric', e.target.value)}
            style={{ ...inputStyle, cursor: 'pointer' }}
          >
            {GOAL_METRICS.map((g) => <option key={g} value={g.toLowerCase().replace(' ', '_')}>{g}</option>)}
          </select>
        </Field>
        <Field label="Target Number" error={errors?.target}>
          <TextInput
            value={data.target}
            onChange={(v) => onChange('target', v)}
            placeholder="e.g. 120"
            type="number"
          />
        </Field>
      </div>

      {/* Budget + deadline — 2 col */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: S[4] }}>
        <Field label="Total Budget (USD)" error={errors?.budget}>
          <div style={{ position: 'relative' }}>
            <span style={{
              position: 'absolute', left: S[3], top: '50%', transform: 'translateY(-50%)',
              fontFamily: F.mono, fontSize: '13px', color: C.textMuted, pointerEvents: 'none',
            }}>$</span>
            <input
              type="number"
              value={data.budget}
              onChange={(e) => onChange('budget', e.target.value)}
              placeholder="25000"
              style={{ ...inputStyle, paddingLeft: S[6] }}
            />
          </div>
        </Field>
        <Field label="Campaign Deadline" error={errors?.deadline}>
          <input
            type="date"
            value={data.deadline}
            onChange={(e) => onChange('deadline', e.target.value)}
            style={{ ...inputStyle, colorScheme: 'dark' }}
          />
        </Field>
      </div>

      {/* Client */}
      <Field label="Client" error={errors?.client}>
        <TextInput
          value={data.client}
          onChange={(v) => onChange('client', v)}
          placeholder="e.g. Acme Corp"
        />
      </Field>
    </div>
  );
}
