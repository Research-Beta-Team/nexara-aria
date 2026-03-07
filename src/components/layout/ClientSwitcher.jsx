// ─────────────────────────────────────────────
//  Antarious — Client Switcher (owner/csm only)
//  Dropdown: client initial + name + template badge + status dot
// ─────────────────────────────────────────────

import { useState } from 'react';
import useStore from '../../store/useStore';
import { getAllClientIds } from '../../data/clientWorkspaceProfiles';
import { getTemplateById } from '../../data/workspaceTemplates';
import { C, F, R, S, T, shadows } from '../../tokens';

export default function ClientSwitcher() {
  const [open, setOpen] = useState(false);
  const activeClientId = useStore((s) => s.activeClientId);
  const workspaceProfiles = useStore((s) => s.workspaceProfiles);
  const setActiveClient = useStore((s) => s.setActiveClient);

  const clientIds = getAllClientIds();
  const activeProfile = workspaceProfiles[activeClientId] || null;
  const templateName = activeProfile
    ? (getTemplateById(activeProfile.templateBase)?.name ?? activeProfile.templateBase)
    : '';

  const buttonStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: S[2],
    backgroundColor: C.surface2,
    border: `1px solid ${C.border}`,
    borderRadius: R.button,
    padding: `${S[1]} ${S[3]}`,
    cursor: 'pointer',
    transition: T.base,
    color: C.textPrimary,
    fontFamily: F.body,
    fontSize: '13px',
    fontWeight: 500,
    minWidth: '160px',
  };

  const dropdownStyle = {
    position: 'absolute',
    top: 'calc(100% + 8px)',
    left: 0,
    minWidth: '260px',
    backgroundColor: C.surface2,
    border: `1px solid ${C.border}`,
    borderRadius: R.card,
    boxShadow: shadows.dropdown,
    zIndex: 100,
    overflow: 'hidden',
    padding: S[2],
  };

  const itemStyle = (active) => ({
    display: 'flex',
    alignItems: 'center',
    gap: S[3],
    padding: `${S[2]} ${S[3]}`,
    cursor: 'pointer',
    fontFamily: F.body,
    fontSize: '13px',
    color: active ? C.primary : C.textPrimary,
    backgroundColor: active ? C.primaryGlow : 'transparent',
    borderRadius: R.md,
    transition: T.color,
  });

  const initialStyle = (profile) => ({
    width: '28px',
    height: '28px',
    borderRadius: '50%',
    backgroundColor: C.surface3,
    border: `1px solid ${C.border}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: F.mono,
    fontSize: '11px',
    fontWeight: 700,
    color: C.textSecondary,
    flexShrink: 0,
  });

  const statusDotStyle = (status) => ({
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    backgroundColor: status === 'active' ? C.primary : C.textMuted,
    flexShrink: 0,
  });

  const templateBadgeStyle = {
    fontFamily: F.mono,
    fontSize: '9px',
    fontWeight: 600,
    color: C.textMuted,
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
    marginLeft: 'auto',
  };

  return (
    <div style={{ position: 'relative' }}>
      <button style={buttonStyle} onClick={() => setOpen((o) => !o)} type="button">
        {activeProfile && (
          <>
            <span style={initialStyle(activeProfile)}>
              {activeProfile.clientName.slice(0, 2).toUpperCase()}
            </span>
            <span style={{ flex: 1, textAlign: 'left', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {activeProfile.clientName}
            </span>
            <span style={templateBadgeStyle}>{templateName}</span>
          </>
        )}
        {!activeProfile && <span style={{ flex: 1, textAlign: 'left' }}>Select client</span>}
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ color: C.textMuted, transform: open ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.15s ease', flexShrink: 0 }}>
          <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      {open && (
        <>
          <div style={{ position: 'fixed', inset: 0, zIndex: 99 }} onClick={() => setOpen(false)} aria-hidden="true" />
          <div style={dropdownStyle}>
            {clientIds.map((clientId) => {
              const profile = workspaceProfiles[clientId];
              if (!profile) return null;
              const template = getTemplateById(profile.templateBase);
              const isActive = clientId === activeClientId;
              return (
                <div
                  key={clientId}
                  style={itemStyle(isActive)}
                  onClick={() => {
                    setActiveClient(clientId);
                    setOpen(false);
                  }}
                >
                  <span style={statusDotStyle(profile.status)} />
                  <span style={initialStyle(profile)}>
                    {profile.clientName.slice(0, 2).toUpperCase()}
                  </span>
                  <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {profile.clientName}
                  </span>
                  <span style={templateBadgeStyle}>{template?.name ?? profile.templateBase}</span>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
