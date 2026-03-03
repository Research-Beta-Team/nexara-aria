import { useState } from 'react';
import { C, F, R, S } from '../../../tokens';
import { daysBetween } from '../../../data/campaignPhases';

const PHASE_COLORS = ['#4B5563', C.primary, 'rgba(61,220,132,0.85)'];
const CHANNEL_COLOR = C.primary;

export default function PhaseTimeline({ phases = [], campaignStart, campaignEnd, todayDate, channelIds = ['email', 'linkedin', 'meta_ads'] }) {
  const [hoveredPhase, setHoveredPhase] = useState(null);

  if (!phases.length) return null;

  const startStr = campaignStart || phases[0]?.startDate;
  const endStr = campaignEnd || phases[phases.length - 1]?.endDate;
  if (!startStr || !endStr) return null;

  const totalDays = Math.max(1, daysBetween(startStr, endStr));
  const startDate = new Date(startStr);
  const today = todayDate ? new Date(todayDate) : new Date();
  const todayOffset = Math.round((today - startDate) / 86400000);

  const getPhaseLeft = (phase) => {
    const d = daysBetween(startStr, phase.startDate);
    return totalDays > 0 ? (d / totalDays) * 100 : 0;
  };
  const getPhaseWidth = (phase) => {
    const days = daysBetween(phase.startDate, phase.endDate);
    return totalDays > 0 ? (days / totalDays) * 100 : 0;
  };

  const channelLabels = { email: 'Email', linkedin: 'LinkedIn', meta_ads: 'Meta' };

  return (
    <div style={{ marginTop: S[6], padding: S[4], backgroundColor: C.surface2, border: `1px solid ${C.border}`, borderRadius: R.card }}>
      <div style={{ fontFamily: F.body, fontSize: '12px', fontWeight: 600, color: C.textSecondary, marginBottom: S[3] }}>
        Phase timeline
      </div>
      <div style={{ position: 'relative', width: '100%' }}>
        {/* Phase blocks */}
        <div style={{ display: 'flex', height: 36, marginBottom: S[2], position: 'relative' }}>
          {phases.map((phase, i) => {
            const left = getPhaseLeft(phase);
            const width = Math.max(2, getPhaseWidth(phase));
            const isHovered = hoveredPhase === phase.id;
            return (
              <div
                key={phase.id}
                onMouseEnter={() => setHoveredPhase(phase.id)}
                onMouseLeave={() => setHoveredPhase(null)}
                title={`${phase.name}: ${phase.startDate} – ${phase.endDate}`}
                style={{
                  position: 'absolute',
                  left: `${left}%`,
                  width: `${width}%`,
                  height: '100%',
                  backgroundColor: PHASE_COLORS[i % PHASE_COLORS.length],
                  borderRadius: R.sm,
                  opacity: isHovered ? 1 : 0.85,
                  cursor: 'default',
                  border: isHovered ? `2px solid ${C.textPrimary}` : 'none',
                  boxSizing: 'border-box',
                  transition: 'opacity 0.15s ease, border 0.15s ease',
                }}
              />
            );
          })}
          {/* Today marker */}
          {todayOffset >= 0 && todayOffset <= totalDays && (
            <div
              style={{
                position: 'absolute',
                left: `${(todayOffset / totalDays) * 100}%`,
                top: 0,
                bottom: 0,
                width: 2,
                backgroundColor: C.red,
                zIndex: 2,
              }}
            />
          )}
        </div>
        {/* Channel activity bars */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {channelIds.map((chId) => (
            <div key={chId} style={{ display: 'flex', alignItems: 'center', gap: S[2] }}>
              <span style={{ fontFamily: F.body, fontSize: '11px', color: C.textMuted, width: 72, flexShrink: 0 }}>
                {channelLabels[chId] || chId}
              </span>
              <div style={{ flex: 1, height: 12, backgroundColor: C.surface3, borderRadius: 4, overflow: 'hidden', position: 'relative', display: 'flex' }}>
                {phases.map((phase, i) => {
                  const ch = phase.channels?.find((c) => c.id === chId);
                  const active = ch?.active;
                  const left = getPhaseLeft(phase);
                  const width = getPhaseWidth(phase);
                  return (
                    <div
                      key={`${phase.id}-${chId}`}
                      style={{
                        position: 'absolute',
                        left: `${left}%`,
                        width: `${width}%`,
                        height: '100%',
                        backgroundColor: active ? CHANNEL_COLOR : 'transparent',
                        opacity: active ? 0.6 : 0.15,
                        borderRadius: 2,
                      }}
                    />
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
      {hoveredPhase && (() => {
        const p = phases.find((x) => x.id === hoveredPhase);
        if (!p) return null;
        const totalBudget = (p.channels || []).filter((c) => c.active).reduce((s, c) => s + (Number(c.budgetPerMonth) || 0), 0);
        const activeChannels = (p.channels || []).filter((c) => c.active).map((c) => c.name).join(', ');
        return (
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: -8,
              transform: 'translateY(-100%)',
              padding: S[2],
              backgroundColor: C.surface,
              border: `1px solid ${C.border}`,
              borderRadius: R.md,
              fontFamily: F.body,
              fontSize: '11px',
              color: C.textPrimary,
              zIndex: 10,
              boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
              pointerEvents: 'none',
            }}
          >
            <div style={{ fontWeight: 600 }}>{p.name}</div>
            <div style={{ color: C.textMuted }}>{p.startDate} – {p.endDate}</div>
            <div>Budget: ${totalBudget.toLocaleString()}/mo</div>
            <div>Channels: {activeChannels || '—'}</div>
          </div>
        );
      })()}
    </div>
  );
}
