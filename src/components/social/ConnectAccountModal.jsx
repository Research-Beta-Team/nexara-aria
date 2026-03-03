import { useState } from 'react';
import useStore from '../../store/useStore';
import useToast from '../../hooks/useToast';
import { C, F, R, S, Z, cardStyle, btn } from '../../tokens';
import { AVAILABLE_PLATFORMS } from '../../data/social';

const PLACEHOLDER_FOLLOWERS = { LinkedIn: 12400, Meta: 28500, Instagram: 18200 };

export default function ConnectAccountModal({ onClose }) {
  const toast = useToast();
  const addConnectedAccount = useStore((s) => s.addConnectedAccount);
  const connectedAccounts = useStore((s) => s.connectedAccounts);
  const [selectedPlatform, setSelectedPlatform] = useState(null);
  const [connecting, setConnecting] = useState(false);

  const alreadyConnected = (platformId) =>
    connectedAccounts.some((a) => a.platform === platformId);

  const handleConnect = () => {
    if (!selectedPlatform) return;
    setConnecting(true);
    // Simulate OAuth / API call
    setTimeout(() => {
      const id = `${selectedPlatform.id.toLowerCase()}-${Date.now()}`;
      addConnectedAccount({
        id,
        name: 'Medglobal',
        platform: selectedPlatform.id,
        type: selectedPlatform.id === 'Instagram' ? 'Business' : selectedPlatform.id === 'Meta' ? 'Page' : 'Company',
        followers: PLACEHOLDER_FOLLOWERS[selectedPlatform.id] ?? 10000,
      });
      setConnecting(false);
      toast.success(`${selectedPlatform.name} connected successfully`);
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
          Choose a platform to connect. You’ll be redirected to authorize NEXARA to manage your social presence.
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
                  backgroundColor: C.surface3,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: F.mono,
                  fontSize: '16px',
                  fontWeight: 700,
                  color: C.primary,
                }}>
                  {platform.id.charAt(0)}
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
