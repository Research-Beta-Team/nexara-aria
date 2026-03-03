import { C, F, R, S, T, inputStyle } from '../../../tokens';
import { daysBetween } from '../../../data/campaignPhases';

const CHANNEL_OPTIONS = {
  email: {
    label: 'Sequence steps active',
    options: [
      { label: 'All', value: 'all' },
      { label: 'Steps 1-3 only', value: 'steps_1_3_only' },
      { label: 'New sequence', value: 'new_sequence' },
    ],
    key: 'emailSequence',
  },
  linkedin: {
    label: 'Cadence',
    options: [
      { label: '2x/week', value: '2x/week' },
      { label: 'Daily', value: 'daily' },
      { label: 'Custom', value: 'custom' },
    ],
    key: 'linkedinCadence',
  },
  meta_ads: {
    label: 'Ad sets',
    options: [
      { label: 'All active', value: 'all' },
      { label: 'Only retargeting', value: 'retargeting' },
      { label: 'Warmup set', value: 'warmup' },
    ],
    key: 'metaAdSets',
  },
  whatsapp: {
    label: 'Frequency',
    options: [
      { label: 'Weekly', value: 'weekly' },
      { label: 'Bi-weekly', value: 'bi_weekly' },
    ],
    key: 'whatsappFrequency',
  },
};

export default function PhaseChannelConfig({ phase, onChange, phaseStartDate, readOnly }) {
  const channels = phase.channels || [];
  const totalPerMonth = channels.filter((c) => c.active).reduce((sum, c) => sum + (Number(c.budgetPerMonth) || 0), 0);
  const days = daysBetween(phase.startDate, phase.endDate) || 1;
  const phaseTotal = Math.round((totalPerMonth / 30) * days);

  const handleChannelToggle = (channelId, active) => {
    const next = channels.map((c) => (c.id === channelId ? { ...c, active } : c));
    onChange({ ...phase, channels: next });
  };

  const handleBudgetChange = (channelId, value) => {
    const next = channels.map((c) => (c.id === channelId ? { ...c, budgetPerMonth: Number(value) || 0 } : c));
    onChange({ ...phase, channels: next });
  };

  const handleOptionChange = (channelId, key, value) => {
    const next = channels.map((c) => (c.id === channelId ? { ...c, [key]: value } : c));
    onChange({ ...phase, channels: next });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: S[3] }}>
      <div style={{ fontFamily: F.body, fontSize: '12px', fontWeight: 600, color: C.textSecondary, marginBottom: S[1] }}>
        Channel configuration
      </div>
      {channels.map((ch) => {
        const opts = CHANNEL_OPTIONS[ch.id];
        return (
          <div
            key={ch.id}
            style={{
              padding: S[3],
              backgroundColor: ch.active ? C.surface2 : C.surface3,
              border: `1px solid ${C.border}`,
              borderRadius: R.md,
              opacity: ch.active ? 1 : 0.75,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: S[3], flexWrap: 'wrap' }}>
              <button
                type="button"
                aria-label={ch.active ? 'Pause channel' : 'Activate channel'}
                onClick={() => !readOnly && handleChannelToggle(ch.id, !ch.active)}
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: '50%',
                  border: `2px solid ${ch.active ? C.primary : C.border}`,
                  backgroundColor: ch.active ? C.primary : 'transparent',
                  cursor: readOnly ? 'default' : 'pointer',
                  flexShrink: 0,
                }}
              />
              <span style={{ fontFamily: F.body, fontSize: '13px', fontWeight: 600, color: C.textPrimary, minWidth: 100 }}>
                {ch.name}
              </span>
              <span
                style={{
                  fontFamily: F.mono,
                  fontSize: '11px',
                  color: ch.active ? C.primary : C.textMuted,
                  textTransform: 'uppercase',
                }}
              >
                {ch.active ? 'Active' : 'Paused'}
              </span>
              {!ch.active && phaseStartDate && (
                <span style={{ fontFamily: F.body, fontSize: '11px', color: C.textMuted }}>
                  Will pause on {phaseStartDate}
                </span>
              )}
              <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: S[2] }}>
                <span style={{ fontFamily: F.body, fontSize: '12px', color: C.textMuted }}>$</span>
                <input
                  type="number"
                  min={0}
                  value={ch.budgetPerMonth || ''}
                  onChange={(e) => !readOnly && handleBudgetChange(ch.id, e.target.value)}
                  placeholder="0"
                  disabled={readOnly || !ch.active}
                  style={{
                    ...inputStyle,
                    width: 80,
                    padding: `${S[1]} ${S[2]}`,
                    fontSize: '12px',
                    opacity: ch.active ? 1 : 0.6,
                  }}
                />
                <span style={{ fontFamily: F.body, fontSize: '11px', color: C.textMuted }}>/mo</span>
              </div>
            </div>
            {ch.active && opts && (
              <div style={{ marginTop: S[2], paddingTop: S[2], borderTop: `1px solid ${C.border}` }}>
                <label style={{ fontFamily: F.body, fontSize: '11px', color: C.textMuted, display: 'block', marginBottom: S[1] }}>
                  {opts.label}
                </label>
                <select
                  value={ch[opts.key] ?? opts.options[0].value}
                  onChange={(e) => !readOnly && handleOptionChange(ch.id, opts.key, e.target.value)}
                  disabled={readOnly}
                  style={{
                    ...inputStyle,
                    fontSize: '12px',
                    padding: `${S[1]} ${S[2]}`,
                    width: '100%',
                    maxWidth: 200,
                    cursor: readOnly ? 'default' : 'pointer',
                  }}
                >
                  {opts.options.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        );
      })}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: `${S[2]} ${S[3]}`,
          backgroundColor: C.surface3,
          borderRadius: R.md,
          fontFamily: F.mono,
          fontSize: '12px',
          color: C.textSecondary,
        }}
      >
        <span>Total channels budget = ${totalPerMonth.toLocaleString()}/month</span>
        <span>Phase total cost = ${phaseTotal.toLocaleString()} (over {days} days)</span>
      </div>
    </div>
  );
}
