import { useState, useMemo } from 'react';
import useToast from '../../../hooks/useToast';
import { C, F, R, S, T, Z, btn, shadows } from '../../../tokens';
import { CALENDAR_EVENTS, TYPE_COLORS } from '../../../data/calendar';

// ── Constants ─────────────────────────────────
const DOW_SHORT  = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTH_NAMES = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December',
];
const HOURS = Array.from({ length: 13 }, (_, i) => i + 8); // 8 → 20

const TYPE_LABELS = {
  email_step:   'Email Step',
  ad_launch:    'Ad Launch',
  ad_pause:     'Ad Pause',
  blog_publish: 'Blog',
  social_post:  'Social',
  demo_booked:  'Demo',
  review:       'Review',
  budget_reset: 'Budget',
  client_call:  'Client Call',
};

const FILTER_OPTIONS = [
  { value: 'all',     label: 'All Types' },
  { value: 'email',   label: 'Email' },
  { value: 'ads',     label: 'Ads' },
  { value: 'content', label: 'Content' },
  { value: 'demos',   label: 'Demos' },
];

const STATUS_PALETTE = {
  scheduled:   { bg: 'rgba(61,220,132,0.1)',  text: '#3DDC84', border: 'rgba(61,220,132,0.25)'  },
  completed:   { bg: 'rgba(94,234,212,0.1)',  text: '#5EEAD4', border: 'rgba(94,234,212,0.25)'  },
  in_progress: { bg: 'rgba(245,200,66,0.1)',  text: '#F5C842', border: 'rgba(245,200,66,0.25)'  },
  cancelled:   { bg: 'rgba(255,110,122,0.1)', text: '#FF6E7A', border: 'rgba(255,110,122,0.25)' },
};

// ── Date helpers ──────────────────────────────
function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}
function getFirstDOW(year, month) {
  return new Date(year, month, 1).getDay(); // 0 = Sun
}
function getWeekStart(date) {
  const d = new Date(date);
  d.setDate(d.getDate() - d.getDay());
  d.setHours(0, 0, 0, 0);
  return d;
}
function addDays(date, n) {
  const d = new Date(date);
  d.setDate(d.getDate() + n);
  return d;
}
function toDateStr(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}
function todayStr() {
  return toDateStr(new Date());
}
function getHour(timeStr) {
  return parseInt(timeStr.split(':')[0], 10);
}
function fmtHour(h) {
  if (h === 12) return '12pm';
  return h > 12 ? `${h - 12}pm` : `${h}am`;
}
function formatPeriod(view, date) {
  const y = date.getFullYear();
  const m = date.getMonth();
  if (view === 'month') return `${MONTH_NAMES[m]} ${y}`;
  if (view === 'week') {
    const ws = getWeekStart(date);
    const we = addDays(ws, 6);
    const sm = MONTH_NAMES[ws.getMonth()].slice(0, 3);
    const em = MONTH_NAMES[we.getMonth()].slice(0, 3);
    if (ws.getMonth() === we.getMonth()) {
      return `${sm} ${ws.getDate()}–${we.getDate()}, ${y}`;
    }
    return `${sm} ${ws.getDate()} – ${em} ${we.getDate()}, ${y}`;
  }
  return `${DOW_SHORT[date.getDay()]}, ${MONTH_NAMES[m].slice(0, 3)} ${date.getDate()}, ${y}`;
}
function filterEvents(events, filterType) {
  if (filterType === 'all')     return events;
  if (filterType === 'email')   return events.filter(e => e.type === 'email_step');
  if (filterType === 'ads')     return events.filter(e => e.type === 'ad_launch' || e.type === 'ad_pause');
  if (filterType === 'content') return events.filter(e => ['blog_publish', 'social_post', 'content_due'].includes(e.type));
  if (filterType === 'demos')   return events.filter(e => e.type === 'demo_booked');
  return events;
}

// ── TypeBadge ─────────────────────────────────
function TypeBadge({ type }) {
  const color = TYPE_COLORS[type] ?? '#6B9478';
  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '4px',
      backgroundColor: `${color}22`,
      border: `1px solid ${color}44`,
      color,
      borderRadius: R.pill,
      padding: `2px ${S[2]}`,
      fontFamily: F.mono,
      fontSize: '10px',
      fontWeight: 700,
      letterSpacing: '0.07em',
      textTransform: 'uppercase',
      whiteSpace: 'nowrap',
    }}>
      <span style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: color, flexShrink: 0 }} />
      {TYPE_LABELS[type] ?? type}
    </span>
  );
}

// ── EventPill (month view) ────────────────────
function EventPill({ event, onSelect }) {
  const color = TYPE_COLORS[event.type] ?? '#6B9478';
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onClick={(e) => { e.stopPropagation(); onSelect(event); }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '3px',
        backgroundColor: hovered ? `${color}28` : `${color}16`,
        borderLeft: `3px solid ${color}`,
        borderRadius: '3px',
        padding: '2px 5px',
        marginBottom: '2px',
        cursor: 'pointer',
        overflow: 'hidden',
        transition: T.color,
      }}
    >
      <span style={{ width: '4px', height: '4px', borderRadius: '50%', backgroundColor: color, flexShrink: 0 }} />
      <span style={{
        fontFamily: F.body,
        fontSize: '11px',
        fontWeight: 500,
        color: C.textPrimary,
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        flex: 1,
      }}>
        {event.title}
      </span>
    </div>
  );
}

// ── EventBlock (week / day view) ──────────────
function EventBlock({ event, onSelect, wide = false }) {
  const color = TYPE_COLORS[event.type] ?? '#6B9478';
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onClick={() => onSelect(event)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        backgroundColor: hovered ? `${color}28` : `${color}16`,
        borderTop: `3px solid ${color}`,
        borderRadius: R.sm,
        padding: wide ? `${S[2]} ${S[3]}` : `3px ${S[2]}`,
        cursor: 'pointer',
        marginBottom: '3px',
        overflow: 'hidden',
        transition: T.color,
      }}
    >
      <div style={{
        fontFamily: F.body,
        fontSize: wide ? '13px' : '11px',
        fontWeight: 600,
        color: C.textPrimary,
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        lineHeight: 1.3,
      }}>
        {event.title}
      </div>
      {wide ? (
        <div style={{ fontFamily: F.body, fontSize: '12px', color: C.textSecondary, marginTop: '2px', lineHeight: 1.4, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
          {event.description}
        </div>
      ) : null}
      <div style={{ display: 'flex', alignItems: 'center', gap: S[2], marginTop: '3px' }}>
        <span style={{ fontFamily: F.mono, fontSize: '10px', color }}>
          {event.time}
        </span>
        {wide && (
          <span style={{ fontFamily: F.mono, fontSize: '10px', color: C.textMuted }}>
            {event.channel}
          </span>
        )}
      </div>
    </div>
  );
}

// ── MonthView ─────────────────────────────────
function MonthView({ events, currentDate, onSelect }) {
  const year  = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDOW    = getFirstDOW(year, month);
  const today       = todayStr();

  // Build cell array: null = blank padding
  const cells = [];
  for (let i = 0; i < firstDOW; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);

  // Group events by day number for this month
  const byDay = {};
  events.forEach(ev => {
    const [ey, em, ed] = ev.date.split('-').map(Number);
    if (ey === year && em === month + 1) {
      if (!byDay[ed]) byDay[ed] = [];
      byDay[ed].push(ev);
    }
  });

  const totalCells = cells.length;

  return (
    <div style={{
      border: `1px solid ${C.border}`,
      borderRadius: R.card,
      overflow: 'hidden',
      backgroundColor: C.surface,
    }}>
      {/* DOW header */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(7, 1fr)',
        borderBottom: `1px solid ${C.border}`,
        backgroundColor: C.surface2,
      }}>
        {DOW_SHORT.map((d, i) => (
          <div key={d} style={{
            padding: `${S[2]} ${S[1]}`,
            textAlign: 'center',
            fontFamily: F.mono,
            fontSize: '10px',
            fontWeight: 700,
            color: C.textMuted,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            borderRight: i < 6 ? `1px solid ${C.border}` : 'none',
          }}>
            {d}
          </div>
        ))}
      </div>

      {/* Day cells */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)' }}>
        {cells.map((day, idx) => {
          const col     = idx % 7;
          const row     = Math.floor(idx / 7);
          const rows    = totalCells / 7;
          const isBlank = !day;
          const dayEvents = day ? (byDay[day] ?? []) : [];
          const dateStr = day
            ? `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
            : null;
          const isToday      = dateStr === today;
          const showPills    = dayEvents.slice(0, 2);
          const moreCount    = dayEvents.length - 2;
          const borderRight  = col < 6 ? `1px solid ${C.border}` : 'none';
          const borderBottom = row < rows - 1 ? `1px solid ${C.border}` : 'none';

          return (
            <div
              key={idx}
              style={{
                minHeight: '100px',
                padding: '6px',
                borderRight,
                borderBottom,
                backgroundColor: isBlank ? C.surface3 : isToday ? 'rgba(61,220,132,0.05)' : 'transparent',
                outline: isToday ? `2px solid ${C.primary}` : 'none',
                outlineOffset: '-2px',
                verticalAlign: 'top',
                boxSizing: 'border-box',
              }}
            >
              {day && (
                <>
                  {/* Date number */}
                  <div style={{
                    width: '22px',
                    height: '22px',
                    borderRadius: '50%',
                    backgroundColor: isToday ? C.primary : dayEvents.length > 0 ? C.surface3 : 'transparent',
                    color: isToday ? '#070D09' : dayEvents.length > 0 ? C.textPrimary : C.textMuted,
                    fontFamily: F.mono,
                    fontSize: '11px',
                    fontWeight: isToday ? 700 : dayEvents.length > 0 ? 600 : 400,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '4px',
                    flexShrink: 0,
                  }}>
                    {day}
                  </div>

                  {/* Event pills */}
                  {showPills.map(ev => (
                    <EventPill key={ev.id} event={ev} onSelect={onSelect} />
                  ))}

                  {/* +N more */}
                  {moreCount > 0 && (
                    <div
                      onClick={() => onSelect(dayEvents[2])}
                      style={{
                        fontSize: '10px',
                        fontFamily: F.body,
                        color: C.textMuted,
                        cursor: 'pointer',
                        padding: '1px 5px',
                        backgroundColor: C.surface3,
                        border: `1px solid ${C.border}`,
                        borderRadius: '3px',
                        display: 'inline-block',
                        marginTop: '1px',
                      }}
                    >
                      +{moreCount} more
                    </div>
                  )}
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── WeekView ──────────────────────────────────
function WeekView({ events, currentDate, onSelect }) {
  const weekStart = getWeekStart(currentDate);
  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  const today = todayStr();

  // Index events by "YYYY-MM-DD-HH"
  const bySlot = {};
  events.forEach(ev => {
    const key = `${ev.date}-${getHour(ev.time)}`;
    if (!bySlot[key]) bySlot[key] = [];
    bySlot[key].push(ev);
  });

  return (
    <div style={{
      border: `1px solid ${C.border}`,
      borderRadius: R.card,
      overflow: 'hidden',
    }}>
      <div style={{ maxHeight: '560px', overflowY: 'auto', scrollbarWidth: 'thin', scrollbarColor: `${C.border} transparent` }}>
        {/* Sticky day-header row */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '52px repeat(7, 1fr)',
          position: 'sticky',
          top: 0,
          zIndex: Z.raised,
          backgroundColor: C.surface2,
          borderBottom: `1px solid ${C.border}`,
        }}>
          <div style={{ padding: S[2], borderRight: `1px solid ${C.border}` }} />
          {days.map((d, i) => {
            const ds = toDateStr(d);
            const isTd = ds === today;
            return (
              <div key={i} style={{
                padding: `${S[2]} ${S[1]}`,
                textAlign: 'center',
                borderLeft: `1px solid ${C.border}`,
                fontFamily: F.body,
                fontSize: '12px',
                fontWeight: isTd ? 700 : 400,
                color: isTd ? C.primary : C.textSecondary,
                backgroundColor: isTd ? 'rgba(61,220,132,0.05)' : 'transparent',
              }}>
                <span style={{ display: 'block', fontFamily: F.mono, fontSize: '10px', color: isTd ? C.primary : C.textMuted, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  {DOW_SHORT[d.getDay()]}
                </span>
                <span style={{ fontFamily: F.mono, fontSize: '14px', fontWeight: isTd ? 700 : 500 }}>
                  {d.getDate()}
                </span>
              </div>
            );
          })}
        </div>

        {/* Hour rows */}
        {HOURS.map(hour => (
          <div key={hour} style={{
            display: 'grid',
            gridTemplateColumns: '52px repeat(7, 1fr)',
            minHeight: '52px',
            borderBottom: `1px solid ${C.border}`,
          }}>
            {/* Time label */}
            <div style={{
              padding: '6px 8px 0 0',
              fontFamily: F.mono,
              fontSize: '10px',
              color: C.textMuted,
              textAlign: 'right',
              borderRight: `1px solid ${C.border}`,
              flexShrink: 0,
            }}>
              {fmtHour(hour)}
            </div>

            {/* Day columns */}
            {days.map((d, di) => {
              const key = `${toDateStr(d)}-${hour}`;
              const slotEvents = bySlot[key] ?? [];
              const isTd = toDateStr(d) === today;
              return (
                <div key={di} style={{
                  borderLeft: `1px solid ${C.border}`,
                  padding: '3px',
                  backgroundColor: isTd ? 'rgba(61,220,132,0.02)' : 'transparent',
                }}>
                  {slotEvents.map(ev => (
                    <EventBlock key={ev.id} event={ev} onSelect={onSelect} wide={false} />
                  ))}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── DayView ───────────────────────────────────
function DayView({ events, currentDate, onSelect }) {
  const dateStr = toDateStr(currentDate);
  const dayEvents = events.filter(ev => ev.date === dateStr);

  // Group by hour
  const byHour = {};
  dayEvents.forEach(ev => {
    const h = getHour(ev.time);
    if (!byHour[h]) byHour[h] = [];
    byHour[h].push(ev);
  });

  return (
    <div style={{
      border: `1px solid ${C.border}`,
      borderRadius: R.card,
      overflow: 'hidden',
    }}>
      <div style={{ maxHeight: '560px', overflowY: 'auto', scrollbarWidth: 'thin', scrollbarColor: `${C.border} transparent` }}>
        {HOURS.map(hour => {
          const slotEvents = byHour[hour] ?? [];
          const isActive = slotEvents.length > 0;
          return (
            <div key={hour} style={{
              display: 'grid',
              gridTemplateColumns: '64px 1fr',
              minHeight: '64px',
              borderBottom: `1px solid ${C.border}`,
              backgroundColor: isActive ? 'rgba(61,220,132,0.02)' : 'transparent',
            }}>
              {/* Time label */}
              <div style={{
                padding: '12px 10px 0 0',
                fontFamily: F.mono,
                fontSize: '11px',
                color: C.textMuted,
                textAlign: 'right',
                borderRight: `1px solid ${C.border}`,
                flexShrink: 0,
              }}>
                {fmtHour(hour)}
              </div>

              {/* Event area */}
              <div style={{ padding: `${S[2]} ${S[3]}` }}>
                {slotEvents.map(ev => (
                  <EventBlock key={ev.id} event={ev} onSelect={onSelect} wide={true} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── EventDetailPanel ──────────────────────────
function EventDetailPanel({ event, onClose }) {
  const toast = useToast();
  const color = event ? (TYPE_COLORS[event.type] ?? '#6B9478') : '#6B9478';
  const sc    = event ? (STATUS_PALETTE[event.status] ?? STATUS_PALETTE.scheduled) : STATUS_PALETTE.scheduled;

  return (
    <>
      {/* Dim overlay — click to close */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(7,13,9,0.55)',
          zIndex: Z.overlay,
          opacity: event ? 1 : 0,
          pointerEvents: event ? 'auto' : 'none',
          transition: 'opacity 0.25s ease',
        }}
      />

      {/* Slide-in panel */}
      <div style={{
        position: 'fixed',
        top: 0,
        right: 0,
        bottom: 0,
        width: '360px',
        backgroundColor: C.surface,
        borderLeft: `1px solid ${event ? color + '55' : C.border}`,
        zIndex: Z.modal,
        display: 'flex',
        flexDirection: 'column',
        transform: event ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform 0.25s ease, border-color 0.25s ease',
        boxShadow: event ? '-16px 0 48px rgba(0,0,0,0.45)' : 'none',
      }}>
        {event && (
          <>
            {/* Panel header */}
            <div style={{
              padding: `${S[5]} ${S[5]} ${S[4]}`,
              borderBottom: `1px solid ${C.border}`,
              display: 'flex',
              flexDirection: 'column',
              gap: S[3],
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <TypeBadge type={event.type} />
                <button
                  style={{ ...btn.icon, color: C.textMuted, padding: '4px' }}
                  onClick={onClose}
                >
                  <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                    <path d="M11.5 3.5l-8 8M3.5 3.5l8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </button>
              </div>

              <h2 style={{
                fontFamily: F.display,
                fontSize: '17px',
                fontWeight: 800,
                color: C.textPrimary,
                margin: 0,
                lineHeight: 1.3,
                letterSpacing: '-0.01em',
              }}>
                {event.title}
              </h2>

              {/* Date + time + status */}
              <div style={{ display: 'flex', alignItems: 'center', gap: S[2], flexWrap: 'wrap' }}>
                <span style={{
                  fontFamily: F.mono,
                  fontSize: '11px',
                  color: C.textMuted,
                }}>
                  {event.date} · {event.time}
                </span>
                <span style={{
                  backgroundColor: sc.bg,
                  color: sc.text,
                  border: `1px solid ${sc.border}`,
                  borderRadius: R.pill,
                  padding: '1px 7px',
                  fontFamily: F.mono,
                  fontSize: '10px',
                  fontWeight: 700,
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                }}>
                  {event.status}
                </span>
              </div>
            </div>

            {/* Panel body */}
            <div style={{
              flex: 1,
              overflowY: 'auto',
              padding: S[5],
              display: 'flex',
              flexDirection: 'column',
              gap: S[5],
              scrollbarWidth: 'thin',
              scrollbarColor: `${C.border} transparent`,
            }}>
              {/* Description */}
              <div>
                <div style={{
                  fontFamily: F.body,
                  fontSize: '10px',
                  fontWeight: 700,
                  color: C.textMuted,
                  textTransform: 'uppercase',
                  letterSpacing: '0.09em',
                  marginBottom: S[2],
                }}>
                  Description
                </div>
                <p style={{
                  fontFamily: F.body,
                  fontSize: '13px',
                  color: C.textSecondary,
                  margin: 0,
                  lineHeight: 1.65,
                }}>
                  {event.description}
                </p>
              </div>

              {/* Channel */}
              <div>
                <div style={{
                  fontFamily: F.body,
                  fontSize: '10px',
                  fontWeight: 700,
                  color: C.textMuted,
                  textTransform: 'uppercase',
                  letterSpacing: '0.09em',
                  marginBottom: S[2],
                }}>
                  Channel
                </div>
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  backgroundColor: `${color}18`,
                  color,
                  border: `1px solid ${color}33`,
                  borderRadius: R.pill,
                  padding: `3px ${S[3]}`,
                  fontFamily: F.mono,
                  fontSize: '12px',
                  fontWeight: 600,
                }}>
                  {event.channel}
                </span>
              </div>
            </div>

            {/* Panel actions */}
            <div style={{
              padding: S[5],
              borderTop: `1px solid ${C.border}`,
              display: 'flex',
              flexDirection: 'column',
              gap: S[2],
            }}>
              <div style={{ display: 'flex', gap: S[2] }}>
                <button
                  style={{ ...btn.secondary, flex: 1, fontSize: '13px', justifyContent: 'center' }}
                  onClick={() => toast.info(`Editing: ${event.title}`)}
                >
                  Edit
                </button>
                <button
                  style={{ ...btn.danger, flex: 1, fontSize: '13px', justifyContent: 'center' }}
                  onClick={() => { toast.error('Event deleted'); onClose(); }}
                >
                  Delete
                </button>
              </div>
              <button
                style={{
                  ...btn.ghost,
                  fontSize: '13px',
                  border: `1px solid ${C.border}`,
                  borderRadius: '7px',
                  width: '100%',
                  justifyContent: 'center',
                  gap: S[2],
                }}
                onClick={() => toast.success('Added to Google Calendar')}
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <rect x="1" y="2.5" width="12" height="10.5" rx="1.5" stroke="currentColor" strokeWidth="1.2"/>
                  <path d="M1 5.5h12" stroke="currentColor" strokeWidth="1.2"/>
                  <path d="M4.5 1v3M9.5 1v3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                </svg>
                + Google Calendar
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}

// ── CalendarTab ───────────────────────────────
export default function CalendarTab() {
  const toast = useToast();

  const [view,          setView]          = useState('month');
  const [currentDate,   setCurrentDate]   = useState(new Date(2026, 2, 1)); // Mar 1 2026
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [filterType,    setFilterType]    = useState('all');
  const [filterOpen,    setFilterOpen]    = useState(false);

  const filteredEvents = useMemo(
    () => filterEvents(CALENDAR_EVENTS, filterType),
    [filterType],
  );

  // ── Navigation ────────────────────────────
  const navigate = (dir) => {
    const d = new Date(currentDate);
    if      (view === 'month') d.setMonth(d.getMonth() + dir);
    else if (view === 'week')  d.setDate(d.getDate() + dir * 7);
    else                       d.setDate(d.getDate() + dir);
    setCurrentDate(d);
  };

  const goToToday = () => {
    setCurrentDate(new Date());
    toast.info('Jumped to today');
  };

  // ── Styles ────────────────────────────────
  const viewBtnStyle = (active) => ({
    ...btn.secondary,
    fontSize: '12px',
    padding: `3px ${S[3]}`,
    backgroundColor: active ? C.primaryGlow : 'transparent',
    color:           active ? C.primary     : C.textSecondary,
    borderColor:     active ? 'rgba(61,220,132,0.25)' : C.border,
    borderRadius:    '6px',
  });

  const activeFilter = FILTER_OPTIONS.find(f => f.value === filterType) ?? FILTER_OPTIONS[0];

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {/* Slide-in panel (rendered in document flow but fixed) */}
      <EventDetailPanel event={selectedEvent} onClose={() => setSelectedEvent(null)} />

      <div style={{ padding: S[5], display: 'flex', flexDirection: 'column', gap: S[4] }}>

        {/* ── Top bar ─────────────────────────── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: S[3], flexWrap: 'wrap' }}>

          {/* Prev / Today / Next + period label */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <button
              style={{ ...btn.icon, border: `1px solid ${C.border}`, borderRadius: '6px' }}
              onClick={() => navigate(-1)}
              title="Previous"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M9 2.5L5 7l4 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>

            <button
              style={{ ...btn.ghost, fontSize: '12px', padding: `3px ${S[3]}`, border: `1px solid ${C.border}`, borderRadius: '6px' }}
              onClick={goToToday}
            >
              Today
            </button>

            <button
              style={{ ...btn.icon, border: `1px solid ${C.border}`, borderRadius: '6px' }}
              onClick={() => navigate(1)}
              title="Next"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M5 2.5L9 7l-4 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>

            <span style={{
              fontFamily: F.display,
              fontSize: '15px',
              fontWeight: 700,
              color: C.textPrimary,
              marginLeft: S[2],
              minWidth: '148px',
              letterSpacing: '-0.01em',
            }}>
              {formatPeriod(view, currentDate)}
            </span>
          </div>

          <div style={{ flex: 1 }} />

          {/* View toggles */}
          <div style={{
            display: 'flex',
            gap: '2px',
            backgroundColor: C.surface2,
            borderRadius: R.md,
            padding: '2px',
            border: `1px solid ${C.border}`,
          }}>
            {['month', 'week', 'day'].map(v => (
              <button key={v} style={viewBtnStyle(view === v)} onClick={() => setView(v)}>
                {v.charAt(0).toUpperCase() + v.slice(1)}
              </button>
            ))}
          </div>

          {/* Filter dropdown */}
          <div style={{ position: 'relative' }}>
            <button
              style={{ ...btn.secondary, fontSize: '12px', gap: S[2] }}
              onClick={() => setFilterOpen(o => !o)}
            >
              {activeFilter.label}
              <svg
                width="11" height="11" viewBox="0 0 11 11" fill="none"
                style={{ transform: filterOpen ? 'rotate(180deg)' : 'none', transition: T.fast }}
              >
                <path d="M2 4l3.5 3.5L9 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>

            {filterOpen && (
              <div style={{
                position: 'absolute',
                top: 'calc(100% + 4px)',
                right: 0,
                backgroundColor: C.surface2,
                border: `1px solid ${C.border}`,
                borderRadius: R.card,
                padding: '4px',
                zIndex: Z.dropdown,
                boxShadow: shadows.dropdown,
                minWidth: '140px',
              }}>
                {FILTER_OPTIONS.map(opt => (
                  <button
                    key={opt.value}
                    style={{
                      display: 'block',
                      width: '100%',
                      textAlign: 'left',
                      padding: `${S[2]} ${S[3]}`,
                      fontFamily: F.body,
                      fontSize: '13px',
                      color:           filterType === opt.value ? C.primary      : C.textSecondary,
                      backgroundColor: filterType === opt.value ? C.primaryGlow  : 'transparent',
                      border: 'none',
                      borderRadius: R.md,
                      cursor: 'pointer',
                    }}
                    onClick={() => { setFilterType(opt.value); setFilterOpen(false); }}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Add Event */}
          <button
            style={{ ...btn.primary, fontSize: '12px', gap: S[1] }}
            onClick={() => toast.info('Add event coming soon')}
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            Add Event
          </button>
        </div>

        {/* ── View content ────────────────────── */}
        {view === 'month' && (
          <MonthView
            events={filteredEvents}
            currentDate={currentDate}
            onSelect={setSelectedEvent}
          />
        )}
        {view === 'week' && (
          <WeekView
            events={filteredEvents}
            currentDate={currentDate}
            onSelect={setSelectedEvent}
          />
        )}
        {view === 'day' && (
          <DayView
            events={filteredEvents}
            currentDate={currentDate}
            onSelect={setSelectedEvent}
          />
        )}

        {/* ── Legend ──────────────────────────── */}
        <div style={{ display: 'flex', gap: S[4], flexWrap: 'wrap', paddingTop: S[1] }}>
          {Object.entries(TYPE_COLORS).map(([type, color]) => (
            <div key={type} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '2px', backgroundColor: color, flexShrink: 0 }} />
              <span style={{ fontFamily: F.body, fontSize: '11px', color: C.textMuted }}>
                {TYPE_LABELS[type] ?? type}
              </span>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
