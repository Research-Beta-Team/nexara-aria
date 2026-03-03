import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { C, F, R, S, btn, Z } from '../tokens';
import useStore from '../store/useStore';
import useToast from '../hooks/useToast';
import { getRoleAccess } from '../config/roleConfig';
import { getRoleDisplayName, ROLE_IDS } from '../config/roleConfig';

function MemberRow({ member, isYou, onEditRole, onRemove, canManage }) {
  const [showRoleSelect, setShowRoleSelect] = useState(false);
  const [roleId, setRoleId] = useState(member.roleId);

  const handleSaveRole = () => {
    onEditRole(member.id, { roleId });
    setShowRoleSelect(false);
  };

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 140px 90px minmax(100px, auto)',
        alignItems: 'center',
        gap: S[3],
        padding: `${S[3]} ${S[4]}`,
        borderBottom: `1px solid ${C.border}`,
        backgroundColor: C.surface,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: S[2] }}>
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: R.full,
            backgroundColor: C.surface3,
            border: `1px solid ${C.border}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: F.mono,
            fontSize: '12px',
            fontWeight: 700,
            color: C.primary,
          }}
        >
          {member.name.slice(0, 2).toUpperCase()}
        </div>
        <div>
          <div style={{ fontFamily: F.body, fontSize: '13px', fontWeight: 600, color: C.textPrimary, display: 'flex', alignItems: 'center', gap: S[2] }}>
            {member.name}
            {isYou && (
              <span style={{ fontFamily: F.mono, fontSize: '10px', fontWeight: 700, color: C.primary, backgroundColor: C.primaryGlow, padding: '2px 6px', borderRadius: R.pill }}>
                You
              </span>
            )}
          </div>
        </div>
      </div>
      <div style={{ fontFamily: F.body, fontSize: '12px', color: C.textMuted }}>{member.email}</div>
      <div>
        {showRoleSelect && canManage ? (
          <div style={{ display: 'flex', gap: S[1], alignItems: 'center' }}>
            <select
              value={roleId}
              onChange={(e) => setRoleId(e.target.value)}
              style={{
                backgroundColor: C.surface2,
                color: C.textPrimary,
                border: `1px solid ${C.border}`,
                borderRadius: R.input,
                padding: `${S[1]} ${S[2]}`,
                fontFamily: F.body,
                fontSize: '12px',
                outline: 'none',
              }}
            >
              {ROLE_IDS.map((id) => (
                <option key={id} value={id}>{getRoleDisplayName(id)}</option>
              ))}
            </select>
            <button type="button" onClick={handleSaveRole} style={{ ...btn.primary, fontSize: '11px', padding: '4px 8px' }}>Save</button>
            <button type="button" onClick={() => { setShowRoleSelect(false); setRoleId(member.roleId); }} style={{ ...btn.ghost, fontSize: '11px' }}>Cancel</button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => canManage && setShowRoleSelect(true)}
            style={{
              ...btn.ghost,
              fontSize: '12px',
              padding: '2px 8px',
              color: C.textSecondary,
              textAlign: 'left',
            }}
          >
            {getRoleDisplayName(member.roleId)}
            {canManage && ' ▼'}
          </button>
        )}
      </div>
      <div>
        <span
          style={{
            fontFamily: F.mono,
            fontSize: '10px',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            color: member.status === 'active' ? C.primary : C.amber,
          }}
        >
          {member.status}
        </span>
      </div>
      {canManage && !isYou && (
        <div>
          <button
            type="button"
            onClick={() => onRemove(member.id)}
            style={{ ...btn.ghost, fontSize: '12px', color: C.red }}
          >
            Remove
          </button>
        </div>
      )}
    </div>
  );
}

export default function Team() {
  const navigate = useNavigate();
  const toast = useToast();
  const currentRole = useStore((s) => s.currentRole);
  const segment = useStore((s) => s.segment);
  const currentUserId = useStore((s) => s.currentUserId);
  const teamMembers = useStore((s) => s.teamMembers);
  const addTeamMember = useStore((s) => s.addTeamMember);
  const updateTeamMember = useStore((s) => s.updateTeamMember);
  const removeTeamMember = useStore((s) => s.removeTeamMember);

  const isStartup = segment === 'startup';
  const pageTitle = isStartup ? 'Founders' : 'Team & Workspace';
  const pageSubtitle = isStartup
    ? `${teamMembers.length} founder${teamMembers.length !== 1 ? 's' : ''} · Add co-founders to monitor and guide the campaign. You guide, AI executes.`
    : `${teamMembers.length} member${teamMembers.length !== 1 ? 's' : ''} · Manage roles and invitations`;

  const access = getRoleAccess(currentRole);
  const canManage = access.team === true;

  const [showAddModal, setShowAddModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newRoleId, setNewRoleId] = useState('sdr');

  const handleAdd = () => {
    if (!newName.trim() || !newEmail.trim()) {
      toast.info('Name and email required');
      return;
    }
    addTeamMember({ name: newName.trim(), email: newEmail.trim(), roleId: newRoleId, status: 'invited' });
    toast.success('Invitation sent');
    setNewName('');
    setNewEmail('');
    setNewRoleId('sdr');
    setShowAddModal(false);
  };

  const handleRemove = (id) => {
    if (window.confirm('Remove this team member? They will lose access.')) {
      removeTeamMember(id);
      toast.info('Member removed');
    }
  };

  if (!canManage) {
    return (
      <div style={{ padding: S[6], display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: S[5], minHeight: '60vh' }}>
        <h1 style={{ fontFamily: F.display, fontSize: '22px', fontWeight: 800, color: C.textPrimary, margin: 0 }}>
          {segment === 'startup' ? 'Founders' : 'Team & Workspace'}
        </h1>
        <p style={{ fontFamily: F.body, fontSize: '14px', color: C.textSecondary }}>
          {segment === 'startup'
            ? 'Founder management is restricted to owners and admins.'
            : 'Team management is restricted to owners and admins.'}
        </p>
        <button style={{ ...btn.primary }} onClick={() => navigate('/')}>Go to Dashboard</button>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: C.bg, padding: `${S[6]} ${S[6]} ${S[8]}` }}>
      <div style={{ marginBottom: S[6], display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: S[4] }}>
        <div>
          <h1 style={{ fontFamily: F.display, fontSize: '24px', fontWeight: 800, color: C.textPrimary, margin: 0, letterSpacing: '-0.03em' }}>
            {pageTitle}
          </h1>
          <p style={{ fontFamily: F.body, fontSize: '13px', color: C.textSecondary, margin: `${S[1]} 0 0` }}>
            {pageSubtitle}
          </p>
        </div>
        <button type="button" onClick={() => setShowAddModal(true)} style={{ ...btn.primary }}>
          {isStartup ? 'Add founder' : 'Add member'}
        </button>
      </div>

      <div style={{ backgroundColor: C.surface, border: `1px solid ${C.border}`, borderRadius: R.card, overflow: 'hidden' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 140px 90px minmax(100px, auto)',
            gap: S[3],
            padding: `${S[2]} ${S[4]}`,
            borderBottom: `1px solid ${C.border}`,
            backgroundColor: C.surface2,
            fontFamily: F.mono,
            fontSize: '10px',
            fontWeight: 700,
            color: C.textMuted,
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
          }}
        >
          <div>Member</div>
          <div>Email</div>
          <div>Role</div>
          <div>Status</div>
          <div />
        </div>
        {teamMembers.map((m) => (
          <MemberRow
            key={m.id}
            member={m}
            isYou={m.id === currentUserId}
            onEditRole={updateTeamMember}
            onRemove={handleRemove}
            canManage={canManage}
          />
        ))}
      </div>

      {showAddModal && (
        <>
          <div
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: C.overlay,
              zIndex: Z.overlay,
            }}
            onClick={() => setShowAddModal(false)}
            aria-hidden
          />
          <div
            style={{
              position: 'fixed',
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
              width: '100%',
              maxWidth: 400,
              backgroundColor: C.surface,
              border: `1px solid ${C.border}`,
              borderRadius: R.card,
              padding: S[6],
              boxShadow: 'var(--shadow-modal)',
              zIndex: Z.modal,
            }}
          >
            <h2 style={{ fontFamily: F.display, fontSize: '18px', fontWeight: 700, color: C.textPrimary, margin: `0 0 ${S[4]} 0` }}>
              {isStartup ? 'Invite co-founder' : 'Invite team member'}
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: S[4], marginBottom: S[5] }}>
              <div>
                <label style={{ display: 'block', fontFamily: F.body, fontSize: '12px', fontWeight: 600, color: C.textSecondary, marginBottom: S[1] }}>Name</label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Full name"
                  style={{
                    width: '100%',
                    backgroundColor: C.surface2,
                    color: C.textPrimary,
                    border: `1px solid ${C.border}`,
                    borderRadius: R.input,
                    padding: `${S[2]} ${S[3]}`,
                    fontFamily: F.body,
                    fontSize: '13px',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontFamily: F.body, fontSize: '12px', fontWeight: 600, color: C.textSecondary, marginBottom: S[1] }}>Email</label>
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="email@company.com"
                  style={{
                    width: '100%',
                    backgroundColor: C.surface2,
                    color: C.textPrimary,
                    border: `1px solid ${C.border}`,
                    borderRadius: R.input,
                    padding: `${S[2]} ${S[3]}`,
                    fontFamily: F.body,
                    fontSize: '13px',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontFamily: F.body, fontSize: '12px', fontWeight: 600, color: C.textSecondary, marginBottom: S[1] }}>Role</label>
                <select
                  value={newRoleId}
                  onChange={(e) => setNewRoleId(e.target.value)}
                  style={{
                    width: '100%',
                    backgroundColor: C.surface2,
                    color: C.textPrimary,
                    border: `1px solid ${C.border}`,
                    borderRadius: R.input,
                    padding: `${S[2]} ${S[3]}`,
                    fontFamily: F.body,
                    fontSize: '13px',
                    outline: 'none',
                  }}
                >
                  {ROLE_IDS.map((id) => (
                    <option key={id} value={id}>{getRoleDisplayName(id)}</option>
                  ))}
                </select>
              </div>
            </div>
            <div style={{ display: 'flex', gap: S[3], justifyContent: 'flex-end' }}>
              <button type="button" onClick={() => setShowAddModal(false)} style={{ ...btn.secondary }}>Cancel</button>
              <button type="button" onClick={handleAdd} style={{ ...btn.primary }}>Send invite</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
