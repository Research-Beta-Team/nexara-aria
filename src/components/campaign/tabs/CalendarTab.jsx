import { useState } from 'react';
import useToast from '../../../hooks/useToast';
import { C, F, R, S, T, btn, flex } from '../../../tokens';
import { calendarEvents } from '../../../data/campaigns';

const MONTH = 'February 2025';
// Feb 2025: starts Saturday (day 6), 28 days
const DAYS_IN_MONTH = 28;
const FIRST_DAY_OF_WEEK = 6; // 0=Sun, 6=Sat
const DOW = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const TYPE_ICON = {
  email:    '✉',
  ad:       '◈',
  blog:     '✎',
  review:   '◉',
  demo:     '⬡',
  deadline: '⚑',
};

// Group events by date
function groupByDate(events) {
  return events.reduce((acc, ev) => {
    const day = parseInt(ev.date.split('-')[2], 10);
    if (!acc[day]) acc[day] = [];
    acc[day].push(ev);
    return acc;
  }, {});
}

function EventPill({ event, onClick }) {
  return (
    <div
      style={{
        backgroundColor: `${event.color}22`,
        border: `1px solid ${event.color}44`,
        borderLeft: `3px solid ${event.color}`,
        borderRadius: '4px',
        padding: `1px 4px`,
        cursor: 'pointer',
        marginBottom: '2px',
        overflow: 'hidden',
      }}
      onClick={(e) => { e.stopPropagation(); onClick(event); }}
    >
      <span style={{ fontFamily: F.body, fontSize: '10px', color: C.textPrimary, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', display: 'block' }}>
        {TYPE_ICON[event.type] ?? '•'} {event.label}
      </span>
    </div>
  );
}

function EventPopover({ event, onClose }) {
  if (!event) return null;
  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(7,13,9,0.6)', zIndex: 300,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }} onClick={onClose}>
      <div style={{
        backgroundColor: C.surface2,
        border: `1px solid ${event.color}`,
        borderRadius: R.card,
        padding: S[5],
        maxWidth: '360px',
        width: '90%',
        boxShadow: '0 24px 48px rgba(0,0,0,0.6)',
      }} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', alignItems: 'center', gap: S[3], marginBottom: S[4] }}>
          <div style={{ width: '36px', height: '36px', borderRadius: R.md, backgroundColor: `${event.color}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>
            {TYPE_ICON[event.type] ?? '•'}
          </div>
          <div>
            <div style={{ fontFamily: F.display, fontSize: '14px', fontWeight: 700, color: C.textPrimary }}>{event.label}</div>
            <div style={{ fontFamily: F.mono, fontSize: '11px', color: C.textMuted }}>{event.date} · {event.type}</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: S[2], justifyContent: 'flex-end' }}>
          <button style={{ ...btn.ghost, fontSize: '12px' }} onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}

export default function CalendarTab() {
  const toast = useToast();
  const [view, setView] = useState('month');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const eventsByDay = groupByDate(calendarEvents);

  // Build calendar grid: blanks + days
  const cells = [];
  for (let i = 0; i < FIRST_DAY_OF_WEEK; i++) cells.push(null);
  for (let d = 1; d <= DAYS_IN_MONTH; d++) cells.push(d);

  const viewBtnStyle = (active) => ({
    ...btn.secondary,
    fontSize: '12px',
    padding: `3px ${S[3]}`,
    backgroundColor: active ? C.primaryGlow : 'transparent',
    color: active ? C.primary : C.textSecondary,
    borderColor: active ? 'rgba(61,220,132,0.3)' : C.border,
  });

  return (
    <>
      {selectedEvent && <EventPopover event={selectedEvent} onClose={() => setSelectedEvent(null)} />}
      <div style={{ padding: S[5], display: 'flex', flexDirection: 'column', gap: S[4] }}>
        {/* Header */}
        <div style={flex.rowBetween}>
          <div style={{ display: 'flex', alignItems: 'center', gap: S[3] }}>
            <button style={{ ...btn.ghost, padding: S[1] }} onClick={() => toast.info('Navigate months coming soon')}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10 4L6 8l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
            <span style={{ fontFamily: F.display, fontSize: '15px', fontWeight: 700, color: C.textPrimary }}>{MONTH}</span>
            <button style={{ ...btn.ghost, padding: S[1] }} onClick={() => toast.info('Navigate months coming soon')}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
          </div>
          <div style={{ display: 'flex', gap: S[1] }}>
            {['month', 'week', 'day'].map((v) => (
              <button key={v} style={viewBtnStyle(view === v)} onClick={() => setView(v)}>
                {v.charAt(0).toUpperCase() + v.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Calendar grid */}
        <div style={{
          border: `1px solid ${C.border}`,
          borderRadius: R.card,
          overflow: 'hidden',
          backgroundColor: C.surface2,
        }}>
          {/* Day-of-week headers */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', borderBottom: `1px solid ${C.border}` }}>
            {DOW.map((d) => (
              <div key={d} style={{
                padding: `${S[2]} ${S[1]}`,
                textAlign: 'center',
                fontFamily: F.mono,
                fontSize: '11px',
                fontWeight: 700,
                color: C.textMuted,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                borderRight: `1px solid ${C.border}`,
              }}>{d}</div>
            ))}
          </div>

          {/* Cells */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)' }}>
            {cells.map((day, idx) => {
              const dayEvents = day ? (eventsByDay[day] ?? []) : [];
              return (
                <div
                  key={idx}
                  style={{
                    minHeight: '90px',
                    padding: '6px',
                    borderRight: `1px solid ${C.border}`,
                    borderBottom: idx < cells.length - 7 ? `1px solid ${C.border}` : 'none',
                    backgroundColor: day ? 'transparent' : C.surface3,
                    verticalAlign: 'top',
                  }}
                >
                  {day && (
                    <>
                      <div style={{
                        fontFamily: F.mono,
                        fontSize: '12px',
                        fontWeight: dayEvents.length > 0 ? 700 : 400,
                        color: dayEvents.length > 0 ? C.textPrimary : C.textMuted,
                        marginBottom: '4px',
                        width: '22px', height: '22px', borderRadius: '50%',
                        backgroundColor: dayEvents.length > 0 ? C.surface3 : 'transparent',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        {day}
                      </div>
                      {dayEvents.map((ev) => (
                        <EventPill key={ev.id} event={ev} onClick={setSelectedEvent} />
                      ))}
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Legend */}
        <div style={{ display: 'flex', gap: S[4], flexWrap: 'wrap' }}>
          {Object.entries(TYPE_ICON).map(([type, icon]) => {
            const ev = calendarEvents.find((e) => e.type === type);
            if (!ev) return null;
            return (
              <div key={type} style={{ display: 'flex', alignItems: 'center', gap: S[1] }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '2px', backgroundColor: ev.color }}/>
                <span style={{ fontFamily: F.body, fontSize: '11px', color: C.textMuted, textTransform: 'capitalize' }}>{type}</span>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
