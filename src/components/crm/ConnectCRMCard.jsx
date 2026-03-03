import { useState } from 'react';
import useStore from '../../store/useStore';
import useToast from '../../hooks/useToast';
import { C, F, R, S, btn } from '../../tokens';
import { CRM_PROVIDERS } from '../../data/crm';

export default function ConnectCRMCard() {
  const connections = useStore((s) => s.connections);
  const setConnectionCrm = useStore((s) => s.setConnectionCrm);
  const toast = useToast();
  const [connecting, setConnecting] = useState(null);
  const [syncing, setSyncing] = useState(false);

  const connected = connections?.crm ?? null;

  const handleConnect = (provider) => {
    setConnecting(provider.id);
    setTimeout(() => {
      setConnectionCrm(provider.name);
      setConnecting(null);
      toast.success(`Connected to ${provider.name}`);
    }, 800);
  };

  const handleDisconnect = () => {
    setConnectionCrm(null);
    toast.success('CRM disconnected.');
  };

  const handleSync = () => {
    setSyncing(true);
    setTimeout(() => {
      setSyncing(false);
      toast.success(`Contacts synced from ${connected}.`);
    }, 1500);
  };

  return (
    <div
      style={{
        backgroundColor: C.surface,
        border: `1px solid ${C.border}`,
        borderRadius: R.card,
        padding: S[5],
      }}
    >
      <div style={{ fontFamily: F.body, fontSize: '13px', fontWeight: 600, color: C.textPrimary, marginBottom: S[3] }}>
        Connect external CRM
      </div>
      <div style={{ fontFamily: F.body, fontSize: '12px', color: C.textSecondary, marginBottom: S[4] }}>
        Sync contacts from HubSpot, Salesforce, or Pipedrive. One connection at a time.
      </div>
      {connected ? (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: S[3] }}>
          <span style={{ fontFamily: F.body, fontSize: '13px', color: C.primary, fontWeight: 600 }}>
            Connected: {connected}
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: S[2], flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={handleSync}
              disabled={syncing}
              style={{
                ...btn.primary,
                fontSize: '12px',
                padding: `${S[2]} ${S[4]}`,
                opacity: syncing ? 0.8 : 1,
              }}
            >
              {syncing ? 'Syncing…' : 'Sync contacts'}
            </button>
            <button
              type="button"
              onClick={handleDisconnect}
              style={{
                ...btn.ghost,
                fontSize: '12px',
                padding: `${S[1]} ${S[3]}`,
                color: C.red,
                border: `1px solid ${C.red}`,
                borderRadius: R.button,
              }}
            >
              Disconnect
            </button>
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: S[2] }}>
          {CRM_PROVIDERS.map((p) => (
            <button
              key={p.id}
              type="button"
              disabled={!!connecting}
              onClick={() => handleConnect(p)}
              style={{
                ...btn.primary,
                fontSize: '12px',
                padding: `${S[2]} ${S[4]}`,
                opacity: connecting && connecting !== p.id ? 0.6 : 1,
              }}
            >
              {connecting === p.id ? 'Connecting…' : `Connect ${p.name}`}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
