import { useState, useMemo, useEffect, useRef } from 'react';
import useStore from '../store/useStore';
import useToast from '../hooks/useToast';
import { NOTIFICATIONS, NOTIF_TYPES, NOTIF_SEVERITY_COLORS } from '../data/notifications';
import NotificationItem from '../components/notifications/NotificationItem';
import { C, F, R, S, T, Z, btn, shadows, flex, scrollbarStyle, sectionHeading } from '../tokens';
import { NOTIF_TYPE_ICON_MAP } from '../components/ui/Icons';

// ── Stat card ──────────────────────────────────
function StatCard({ label, value, color, sublabel }) {
  return (
    <div style={{
      display:         'flex',
      flexDirection:   'column',
      gap:             '4px',
      padding:         `${S[3]} ${S[5]}`,
      backgroundColor: C.surface2,
      border:          `1px solid ${C.border}`,
      borderRadius:    R.card,
      flex:            1,
    }}>
      <span style={{ fontFamily: F.mono, fontSize: '22px', fontWeight: 700, color: color ?? C.textPrimary, lineHeight: 1 }}>
        {value}
      </span>
      <span style={{ fontFamily: F.body, fontSize: '11px', fontWeight: 600, color: C.textSecondary, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
        {label}
      </span>
      {sublabel && (
        <span style={{ fontFamily: F.mono, fontSize: '11px', color: C.textMuted }}>
          {sublabel}
        </span>
      )}
    </div>
  );
}

// ── Group header (Today / Yesterday / This Week) ─
const GROUP_LABELS = {
  today:     'Today',
  yesterday: 'Yesterday',
  this_week: 'This Week',
};

function GroupHeader({ group, count, collapsed, onToggle, onMarkGroupRead }) {
  return (
    <div style={{
      display:         'flex',
      alignItems:      'center',
      gap:             S[3],
      padding:         `${S[2]} ${S[5]}`,
      backgroundColor: C.surface,
      borderBottom:    `1px solid ${C.border}`,
      position:        'sticky',
      top:             0,
      zIndex:          Z.raised,
    }}>
      <button
        style={{
          display:    'flex',
          alignItems: 'center',
          gap:        S[2],
          background: 'none',
          border:     'none',
          cursor:     'pointer',
          padding:    0,
          color:      C.textSecondary,
          transition: T.color,
        }}
        onClick={onToggle}
      >
        <svg
          width="12" height="12" viewBox="0 0 12 12" fill="none"
          style={{ transform: collapsed ? 'rotate(-90deg)' : 'rotate(0)', transition: 'transform 0.15s ease' }}
        >
          <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <span style={{ fontFamily: F.body, fontSize: '12px', fontWeight: 600, color: C.textSecondary, letterSpacing: '0.04em' }}>
          {GROUP_LABELS[group] ?? group}
        </span>
        <span style={{
          fontFamily:      F.mono,
          fontSize:        '10px',
          color:           C.textMuted,
          backgroundColor: C.surface3,
          border:          `1px solid ${C.border}`,
          borderRadius:    R.pill,
          padding:         `0 ${S[2]}`,
        }}>
          {count}
        </span>
      </button>
      <div style={{ flex: 1 }}/>
      <button
        style={{
          background:  'none',
          border:      'none',
          fontFamily:  F.body,
          fontSize:    '11px',
          color:       C.textMuted,
          cursor:      'pointer',
          padding:     `2px ${S[2]}`,
          borderRadius: R.sm,
          transition:  T.color,
        }}
        onClick={onMarkGroupRead}
      >
        Mark group read
      </button>
    </div>
  );
}

// ── Filter Sidebar ─────────────────────────────
function FilterSidebar({
  activeTypes,
  onToggleType,
  activeSeverities,
  onToggleSeverity,
  readFilter,
  onSetReadFilter,
  onSelectAll,
  onMarkAllRead,
  totalSelected,
  filteredCount,
}) {
  const allTypes = Object.entries(NOTIF_TYPES);
  const severities = ['critical', 'high', 'medium', 'low'];

  const pillStyle = (active, color) => ({
    display:         'flex',
    alignItems:      'center',
    gap:             S[2],
    padding:         `${S[1]} ${S[3]}`,
    borderRadius:    R.pill,
    border:          `1px solid ${active ? color ?? C.primary : C.border}`,
    backgroundColor: active ? `${color ?? C.primary}15` : 'transparent',
    cursor:          'pointer',
    transition:      T.color,
    fontFamily:      F.body,
    fontSize:        '12px',
    fontWeight:      active ? 600 : 400,
    color:           active ? color ?? C.primary : C.textSecondary,
    userSelect:      'none',
  });

  const sectionLabel = {
    fontFamily:      F.mono,
    fontSize:        '10px',
    fontWeight:      700,
    color:           C.textMuted,
    letterSpacing:   '0.08em',
    textTransform:   'uppercase',
    marginBottom:    S[2],
    display:         'block',
  };

  return (
    <div style={{
      width:           '220px',
      flexShrink:      0,
      display:         'flex',
      flexDirection:   'column',
      gap:             S[5],
      padding:         `${S[5]} 0`,
    }}>
      {/* Summary */}
      <div style={{
        padding:         `${S[3]} ${S[4]}`,
        backgroundColor: C.surface2,
        border:          `1px solid ${C.border}`,
        borderRadius:    R.card,
        display:         'flex',
        flexDirection:   'column',
        gap:             S[2],
      }}>
        <span style={{ fontFamily: F.mono, fontSize: '11px', color: C.textMuted }}>
          Showing {filteredCount} notifications
        </span>
        {totalSelected > 0 && (
          <span style={{ fontFamily: F.mono, fontSize: '11px', color: C.primary }}>
            {totalSelected} selected
          </span>
        )}
      </div>

      {/* Bulk actions */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: S[2] }}>
        <span style={sectionLabel}>Bulk Actions</span>
        <div style={{ display: 'flex', flexDirection: 'column', gap: S[1] }}>
          <button
            style={{ ...btn.secondary, fontSize: '12px', justifyContent: 'flex-start' }}
            onClick={onSelectAll}
          >
            Select all visible
          </button>
          <button
            style={{ ...btn.ghost, fontSize: '12px', justifyContent: 'flex-start', color: C.primary }}
            onClick={onMarkAllRead}
          >
            Mark all read
          </button>
        </div>
      </div>

      {/* Read/Unread filter */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: S[2] }}>
        <span style={sectionLabel}>Status</span>
        <div style={{ display: 'flex', flexDirection: 'column', gap: S[1] }}>
          {['all', 'unread', 'read'].map((opt) => (
            <div
              key={opt}
              style={{
                display:         'flex',
                alignItems:      'center',
                gap:             S[2],
                padding:         `${S[2]} ${S[3]}`,
                borderRadius:    R.md,
                cursor:          'pointer',
                backgroundColor: readFilter === opt ? C.primaryGlow : 'transparent',
                transition:      T.color,
              }}
              onClick={() => onSetReadFilter(opt)}
            >
              <div style={{
                width:           '14px',
                height:          '14px',
                borderRadius:    '3px',
                border:          `1.5px solid ${readFilter === opt ? C.primary : C.border}`,
                backgroundColor: readFilter === opt ? C.primary : 'transparent',
                display:         'flex',
                alignItems:      'center',
                justifyContent:  'center',
                flexShrink:      0,
                transition:      T.color,
              }}>
                {readFilter === opt && (
                  <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                    <path d="M1.5 4L3.5 6L6.5 2" stroke={C.textInverse} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </div>
              <span style={{
                fontFamily: F.body,
                fontSize:   '12px',
                fontWeight: readFilter === opt ? 600 : 400,
                color:      readFilter === opt ? C.textPrimary : C.textSecondary,
                textTransform: 'capitalize',
              }}>
                {opt === 'all' ? 'All notifications' : opt === 'unread' ? 'Unread only' : 'Read only'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Type filter */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: S[2] }}>
        <span style={sectionLabel}>Type</span>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {allTypes.map(([typeKey, { label, color }]) => {
            const active = activeTypes.includes(typeKey);
            const IconComp = NOTIF_TYPE_ICON_MAP[typeKey];
            return (
              <div
                key={typeKey}
                style={{
                  display:         'flex',
                  alignItems:      'center',
                  gap:             S[2],
                  padding:         `${S[1]} ${S[2]}`,
                  borderRadius:    R.md,
                  cursor:          'pointer',
                  backgroundColor: active ? `${color}10` : 'transparent',
                  border:          `1px solid ${active ? color + '30' : 'transparent'}`,
                  transition:      T.color,
                }}
                onClick={() => onToggleType(typeKey)}
              >
                <div style={{
                  width:           '14px',
                  height:          '14px',
                  borderRadius:    '3px',
                  border:          `1.5px solid ${active ? color : C.border}`,
                  backgroundColor: active ? color : 'transparent',
                  display:         'flex',
                  alignItems:      'center',
                  justifyContent:  'center',
                  flexShrink:      0,
                  transition:      T.color,
                }}>
                  {active && (
                    <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                      <path d="M1.5 4L3.5 6L6.5 2" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </div>
                {IconComp && (
                  <IconComp color={active ? color : C.textMuted} width={14} height={14} />
                )}
                <span style={{
                  fontFamily: F.body,
                  fontSize:   '12px',
                  color:      active ? color : C.textSecondary,
                  fontWeight: active ? 600 : 400,
                  transition: T.color,
                }}>
                  {label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Severity filter */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: S[2] }}>
        <span style={sectionLabel}>Severity</span>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
          {severities.map((sev) => {
            const color = NOTIF_SEVERITY_COLORS[sev];
            const active = activeSeverities.includes(sev);
            return (
              <button
                key={sev}
                style={pillStyle(active, color)}
                onClick={() => onToggleSeverity(sev)}
              >
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: color }}/>
                {sev.charAt(0).toUpperCase() + sev.slice(1)}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────
export default function NotificationCenter() {
  const toast = useToast();

  const notifications     = useStore((s) => s.notifications);
  const markAllRead       = useStore((s) => s.markAllNotificationsRead);
  const markRead          = useStore((s) => s.markNotificationRead);
  const seedNotifications = useStore((s) => s.seedNotifications);

  // Seed on mount if store is empty
  useEffect(() => {
    if (notifications.length === 0) {
      seedNotifications(NOTIFICATIONS);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Filter state ──────────────────────────────
  const [activeTypes,      setActiveTypes]      = useState([]); // empty = all types
  const [activeSeverities, setActiveSeverities] = useState([]); // empty = all severities
  const [readFilter,       setReadFilter]       = useState('all');
  const [selectedIds,      setSelectedIds]      = useState(new Set());
  const [collapsedGroups,  setCollapsedGroups]  = useState(new Set());

  const toggleType = (type) =>
    setActiveTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );

  const toggleSeverity = (sev) =>
    setActiveSeverities((prev) =>
      prev.includes(sev) ? prev.filter((s) => s !== sev) : [...prev, sev]
    );

  const toggleGroup = (group) =>
    setCollapsedGroups((prev) => {
      const next = new Set(prev);
      next.has(group) ? next.delete(group) : next.add(group);
      return next;
    });

  const markGroupRead = (group) => {
    notifications
      .filter((n) => n.group === group && !n.read)
      .forEach((n) => markRead(n.id));
    toast.success(`Marked "${GROUP_LABELS[group]}" notifications as read`);
  };

  // ── Derived ───────────────────────────────────
  const filtered = useMemo(() => {
    return notifications.filter((n) => {
      if (activeTypes.length      > 0 && !activeTypes.includes(n.type))         return false;
      if (activeSeverities.length > 0 && !activeSeverities.includes(n.severity)) return false;
      if (readFilter === 'unread'  && n.read)  return false;
      if (readFilter === 'read'   && !n.read)  return false;
      return true;
    });
  }, [notifications, activeTypes, activeSeverities, readFilter]);

  const grouped = useMemo(() => {
    const groups = { today: [], yesterday: [], this_week: [] };
    filtered.forEach((n) => {
      if (groups[n.group]) groups[n.group].push(n);
    });
    return groups;
  }, [filtered]);

  const unreadCount   = notifications.filter((n) => !n.read).length;
  const criticalCount = notifications.filter((n) => n.severity === 'critical').length;
  const todayCount    = notifications.filter((n) => n.group === 'today').length;

  const handleSelectAll = () => {
    if (selectedIds.size === filtered.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filtered.map((n) => n.id)));
    }
    toast.info(`${filtered.length} notifications selected`);
  };

  const handleMarkAllRead = () => {
    markAllRead();
    setSelectedIds(new Set());
    toast.success('All notifications marked as read');
  };

  return (
    <div style={{ padding: S[6], display: 'flex', flexDirection: 'column', gap: S[5], maxWidth: '1200px' }}>

      {/* ── Page header ─────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: S[1] }}>
          <h1 style={{ ...sectionHeading, fontSize: '22px', letterSpacing: '-0.02em', margin: 0 }}>
            Notification Centre
          </h1>
          <span style={{ fontFamily: F.body, fontSize: '13px', color: C.textSecondary }}>
            All alerts, updates, and ARIA insights in one place
          </span>
        </div>
        <div style={{ display: 'flex', gap: S[2] }}>
          {unreadCount > 0 && (
            <button
              style={{ ...btn.secondary, fontSize: '13px' }}
              onClick={handleMarkAllRead}
            >
              Mark all read ({unreadCount})
            </button>
          )}
        </div>
      </div>

      {/* ── Stats row ───────────────────────────── */}
      <div style={{ display: 'flex', gap: S[3] }}>
        <StatCard label="Total"    value={notifications.length} sublabel="all time"                                  />
        <StatCard label="Unread"   value={unreadCount}          color={unreadCount > 0 ? C.primary : C.textMuted}    sublabel={unreadCount > 0 ? 'needs attention' : 'all caught up'} />
        <StatCard label="Critical" value={criticalCount}        color={criticalCount > 0 ? C.red : C.textMuted}      sublabel={criticalCount > 0 ? 'require action' : 'none active'}  />
        <StatCard label="Today"    value={todayCount}           sublabel="since midnight"                             />
      </div>

      {/* ── Main layout: sidebar + list ─────────── */}
      <div style={{ display: 'flex', gap: S[6], alignItems: 'flex-start' }}>

        {/* Left filter sidebar */}
        <FilterSidebar
          activeTypes={activeTypes}
          onToggleType={toggleType}
          activeSeverities={activeSeverities}
          onToggleSeverity={toggleSeverity}
          readFilter={readFilter}
          onSetReadFilter={setReadFilter}
          onSelectAll={handleSelectAll}
          onMarkAllRead={handleMarkAllRead}
          totalSelected={selectedIds.size}
          filteredCount={filtered.length}
        />

        {/* Right notification list */}
        <div style={{
          flex:            1,
          minWidth:        0,
          backgroundColor: C.surface,
          border:          `1px solid ${C.border}`,
          borderRadius:    R.card,
          overflow:        'hidden',
        }}>
          {filtered.length === 0 ? (
            <div style={{
              padding:    `${S[16]} ${S[6]}`,
              textAlign:  'center',
              color:      C.textMuted,
              fontFamily: F.body,
              fontSize:   '14px',
            }}>
              <div style={{ fontSize: '32px', marginBottom: S[3] }}>🔔</div>
              <div style={{ fontWeight: 600, color: C.textSecondary, marginBottom: S[1] }}>No notifications match your filters</div>
              <div style={{ fontSize: '13px' }}>Try removing some filters to see more results</div>
              <button
                style={{ ...btn.secondary, fontSize: '13px', marginTop: S[4] }}
                onClick={() => {
                  setActiveTypes([]);
                  setActiveSeverities([]);
                  setReadFilter('all');
                }}
              >
                Clear all filters
              </button>
            </div>
          ) : (
            Object.entries(grouped).map(([group, items]) => {
              if (items.length === 0) return null;
              const collapsed = collapsedGroups.has(group);
              return (
                <div key={group}>
                  <GroupHeader
                    group={group}
                    count={items.length}
                    collapsed={collapsed}
                    onToggle={() => toggleGroup(group)}
                    onMarkGroupRead={() => markGroupRead(group)}
                  />
                  {!collapsed && items.map((n) => (
                    <NotificationItem
                      key={n.id}
                      notification={n}
                      compact={false}
                    />
                  ))}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
