import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useStore from '../../store/useStore';
import useToast from '../../hooks/useToast';
import { C, F, R, S, btn, sectionHeading } from '../../tokens';
import { IconWarning } from '../../components/ui/Icons';
import RoleCard from '../../components/dev/RoleCard';

// Role definitions (store id → display config)
const ROLES = [
  {
    id: 'owner',
    name: 'Owner/CEO',
    description: 'Full platform access · All clients · All features · Billing',
    color: '#3DDC84',
    icon: 'crown',
    permissions: ['All features', 'Billing & team', 'Client assignment'],
    dashboardVariant: 'Full control',
  },
  {
    id: 'advisor',
    name: 'Strategic Advisor',
    description: 'Strategy approvals · Assigned clients · High-level oversight',
    color: '#5EEAD4',
    icon: 'compass',
    permissions: ['Strategy approvals', 'Assigned clients only', 'High-level reports'],
    dashboardVariant: 'Advisor overview',
  },
  {
    id: 'csm',
    name: 'Client Success Manager',
    description: 'Client relationships · Reporting · Approvals',
    color: '#9B7BBD',
    icon: 'handshake',
    permissions: ['Client reporting', 'Approvals', 'No billing'],
    dashboardVariant: 'CSM clients',
  },
  {
    id: 'mediaBuyer',
    name: 'Media Buyer',
    description: 'Paid media · Meta/Google/LinkedIn management · Budget decisions',
    color: '#5B9BD5',
    icon: 'target',
    permissions: ['Paid channels', 'Budget & creatives', 'Campaign performance'],
    dashboardVariant: 'Media dashboard',
  },
  {
    id: 'contentStrategist',
    name: 'Content Strategist',
    description: 'Content approval · Knowledge Base · SEO management',
    color: '#F5C842',
    icon: 'pen',
    permissions: ['Content & KB', 'SEO', 'No paid media'],
    dashboardVariant: 'Content hub',
  },
  {
    id: 'sdr',
    name: 'SDR / Outreach',
    description: 'Sequences · Prospect management · Unified Inbox (outreach)',
    color: '#5EEAD4',
    icon: 'send',
    permissions: ['Sequences', 'Prospects', 'Inbox outreach'],
    dashboardVariant: 'Outreach focus',
  },
  {
    id: 'analyst',
    name: 'Analyst',
    description: 'Analytics · Reporting · Data (read-only)',
    color: '#6B9478',
    icon: 'chart',
    permissions: ['Read-only analytics', 'Reports', 'No edits'],
    dashboardVariant: 'Analytics view',
  },
  {
    id: 'client',
    name: 'Client (Read-Only)',
    description: 'Their campaigns only · Approvals · Reports',
    color: 'rgba(61,220,132,0.5)',
    icon: 'eye',
    permissions: ['Own campaigns', 'Approvals', 'Reports only'],
    dashboardVariant: 'Client portal',
  },
];

export function getRoleDisplayName(roleId) {
  const r = ROLES.find((x) => x.id === roleId);
  return r ? r.name : roleId;
}

export default function RoleSwitcher() {
  const currentRole = useStore((s) => s.currentRole);
  const setRole = useStore((s) => s.setRole);
  const toast = useToast();
  const navigate = useNavigate();

  const handleSwitch = (roleId) => {
    setRole(roleId);
    toast.success(`Now viewing as ${getRoleDisplayName(roleId)}`);
    navigate('/');
  };

  const handleReset = () => {
    setRole('owner');
    toast.info('Reset to Owner (default)');
    navigate('/');
  };

  return (
    <div
      style={{
        padding: S[6],
        display: 'flex',
        flexDirection: 'column',
        gap: S[6],
        height: '100%',
        minHeight: 0,
        backgroundColor: C.bg,
        overflowY: 'auto',
      }}
    >
      <div
        style={{
          padding: S[4],
          backgroundColor: 'rgba(245,200,66,0.15)',
          border: `1px solid ${C.amber}`,
          borderRadius: R.card,
        }}
      >
        <div style={{ fontFamily: F.body, fontSize: '14px', fontWeight: 600, color: C.textPrimary, marginBottom: 4, display: 'flex', alignItems: 'center', gap: S[2] }}>
          <IconWarning color={C.amber} width={20} height={20} />
          Developer Mode — Role Switcher
        </div>
        <p style={{ fontFamily: F.body, fontSize: '13px', color: C.textSecondary, margin: 0 }}>
          This page is only for demo/development purposes. Change role to preview different dashboard views.
        </p>
      </div>

      <div>
        <div style={{ fontFamily: F.mono, fontSize: '11px', color: C.textMuted, textTransform: 'uppercase', marginBottom: S[2] }}>
          Currently viewing as
        </div>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            padding: `${S[2]} ${S[5]}`,
            backgroundColor: 'rgba(61,220,132,0.15)',
            border: `1px solid ${C.primary}`,
            borderRadius: R.pill,
            fontFamily: F.display,
            fontSize: '18px',
            fontWeight: 700,
            color: C.primary,
          }}
        >
          {getRoleDisplayName(currentRole)}
        </div>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: S[5],
        }}
      >
        {ROLES.map((role) => (
          <RoleCard
            key={role.id}
            role={role}
            isActive={currentRole === role.id}
            onSwitch={handleSwitch}
          />
        ))}
      </div>

      <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: S[5] }}>
        <button style={{ ...btn.secondary, fontSize: '13px' }} onClick={handleReset}>
          Reset to Owner (default)
        </button>
      </div>
    </div>
  );
}
