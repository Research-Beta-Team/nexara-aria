import { useState } from 'react';
import useStore from '../../store/useStore';
import useToast from '../../hooks/useToast';
import { C, F, R, S, Z, cardStyle, btn } from '../../tokens';
import { AVAILABLE_PLATFORMS } from '../../data/social';
import { CHANNEL_COLORS } from '../../config/channelBrands';
import { IconLinkedIn, IconFacebook, IconInstagram, IconWhatsApp } from '../ui/Icons';

const PLACEHOLDER_FOLLOWERS = { LinkedIn: 12400, Meta: 28500, Instagram: 18200, WhatsApp: null };

function PlatformIcon({ platformId, size = 20 }) {
  const isCircle = true; // used in connect modal with colored circle background
  const iconColor = isCircle ? '#fff' : null;
  if (platformId === 'LinkedIn') return <IconLinkedIn color={iconColor || CHANNEL_COLORS.LinkedIn} width={size} height={size} />;
  if (platformId === 'Meta') return <IconFacebook color={iconColor || CHANNEL_COLORS.Facebook} width={size} height={size} />;
  if (platformId === 'Instagram') return <IconInstagram color={iconColor || CHANNEL_COLORS.Instagram} width={size} height={size} />;
  if (platformId === 'WhatsApp') return <IconWhatsApp color={iconColor || CHANNEL_COLORS.WhatsApp} width={size} height={size} />;
  return null;
}

function platformBgColor(platformId) {
  return CHANNEL_COLORS[platformId] || C.surface3;
}

export default function ConnectAccountModal({ onClose }) {
  const toast = useToast();
  const addConnectedAccount = useStore((s) => s.addConnectedAccount);
  const setInboxPlatformAssignment = useStore((s) => s.setInboxPlatformAssignment);
  const connectedAccounts = useStore((s) => s.connectedAccounts);
  const teamMembers = useStore((s) => s.teamMembers);
  const [selectedPlatform, setSelectedPlatform] = useState(null);
  const [connecting, setConnecting] = useState(false);
  const [assignTo, setAssignTo] = useState('freya'); // userId or 'freya'
  const [freyaHandles, setFreyaHandles] = useState(true);

  const alreadyConnected = (platformId) =>
    connectedAccounts.some((a) => a.platform === platformId);

  const assignmentOptions = [
    { value: 'freya', label: 'Freya (AI)' },
    ...(teamMembers || []).filter((m) => m.status === 'active').map((m) => ({ value: m.id, label: m.name })),
  ];

  const handleConnect = () => {
    if (!selectedPlatform) return;
    setConnecting(true);
    const platformId = selectedPlatform.id;
    const inboxKey = platformId === 'Meta' ? 'Facebook' : platformId;
    setTimeout(() => {
      const id = `${platformId.toLowerCase()}-${Date.now()}`;
      addConnectedAccount({
        id,
        name: 'Medglobal',
        platform: platformId,
        type: platformId === 'Instagram' ? 'Business' : platformId === 'Meta' ? 'Page' : platformId === 'WhatsApp' ? 'Business' : 'Company',
        followers: platformId === 'WhatsApp' ? null : (PLACEHOLDER_FOLLOWERS[platformId] ?? 10000),
      });
      setInboxPlatformAssignment(inboxKey, { assignedTo: assignTo, freyaHandles });
      if (platformId === 'Meta') setInboxPlatformAssignment('Meta', { assignedTo: assignTo, freyaHandles });
      setConnecting(false);
      toast.success(`${selectedPlatform.name} connected. Inbox assignment saved.`);
      onClose();
    }, 800);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: C.overlayHeavy,
        zIndex: Z.modal,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: S[4],
      }}
      onClick={onClose}
    >
      <div
        style={{
          ...cardStyle,
          maxWidth: '420px',
          width: '100%',
          padding: S[6],
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: S[5] }}>
          <h2 style={{ fontFamily: F.display, fontSize: '18px', fontWeight: 700, color: C.textPrimary, margin: 0 }}>
            Connect account
          </h2>
          <button style={{ ...btn.icon }} onClick={onClose} aria-label="Close">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M2 2l12 12M14 2L2 14" />
            </svg>
          </button>
        </div>
        <p style={{ fontFamily: F.body, fontSize: '13px', color: C.textSecondary, marginBottom: S[4] }}>
          Choose a platform to connect. You’ll be redirected to authorize Antarious to manage your social presence.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: S[2], marginBottom: S[5] }}>
          {AVAILABLE_PLATFORMS.map((platform) => {
            const connected = alreadyConnected(platform.id);
            return (
              <button
                key={platform.id}
                type="button"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: S[3],
                  padding: S[4],
                  backgroundColor: selectedPlatform?.id === platform.id ? C.primaryDim : C.surface2,
                  border: `1px solid ${selectedPlatform?.id === platform.id ? C.primary : C.border}`,
                  borderRadius: R.md,
                  cursor: connected ? 'not-allowed' : 'pointer',
                  opacity: connected ? 0.7 : 1,
                  textAlign: 'left',
                }}
                onClick={() => !connected && setSelectedPlatform(platform)}
                disabled={connected}
              >
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: R.full,
                  backgroundColor: platformBgColor(platform.id),
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: C.textPrimary,
                }}>
                  <PlatformIcon platformId={platform.id} size={22} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: F.body, fontSize: '14px', fontWeight: 600, color: C.textPrimary }}>
                    {platform.name}
                    {connected && <span style={{ fontFamily: F.mono, fontSize: '11px', color: C.textMuted, marginLeft: S[2] }}>(connected)</span>}
                  </div>
                  <div style={{ fontFamily: F.body, fontSize: '12px', color: C.textMuted }}>{platform.description}</div>
                </div>
              </button>
            );
          })}
        </div>
        {selectedPlatform && !alreadyConnected(selectedPlatform.id) && (
          <div style={{
            padding: S[4],
            backgroundColor: C.surface2,
            border: `1px solid ${C.border}`,
            borderRadius: R.md,
            marginBottom: S[5],
          }}>
            <div style={{ fontFamily: F.mono, fontSize: '10px', fontWeight: 700, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: S[2] }}>
              Company Social Inbox — who handles messages?
            </div>
            <p style={{ fontFamily: F.body, fontSize: '12px', color: C.textSecondary, marginBottom: S[3] }}>
              Assign someone to handle messages for this account. Freya can draft and reply on their behalf.
            </p>
            <label style={{ display: 'block', fontFamily: F.body, fontSize: '12px', color: C.textPrimary, marginBottom: S[1] }}>Assigned to</label>
            <select
              value={assignTo}
              onChange={(e) => setAssignTo(e.target.value)}
              style={{
                width: '100%',
                padding: `${S[2]} ${S[3]}`,
                backgroundColor: C.bg,
                border: `1px solid ${C.border}`,
                borderRadius: R.input,
                color: C.textPrimary,
                fontFamily: F.body,
                fontSize: '13px',
                marginBottom: S[3],
              }}
            >
              {assignmentOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            <label style={{ display: 'flex', alignItems: 'center', gap: S[2], cursor: 'pointer', fontFamily: F.body, fontSize: '12px', color: C.textSecondary }}>
              <input type="checkbox" checked={freyaHandles} onChange={(e) => setFreyaHandles(e.target.checked)} />
              Freya can draft and reply for this platform
            </label>
          </div>
        )}
        <div style={{ display: 'flex', gap: S[2], justifyContent: 'flex-end' }}>
          <button style={btn.secondary} onClick={onClose}>Cancel</button>
          <button
            style={btn.primary}
            onClick={handleConnect}
            disabled={!selectedPlatform || alreadyConnected(selectedPlatform?.id) || connecting}
          >
            {connecting ? 'Connecting…' : 'Authorize & connect'}
          </button>
        </div>
      </div>
    </div>
  );
}
