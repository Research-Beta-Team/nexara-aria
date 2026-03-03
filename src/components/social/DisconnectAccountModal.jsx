import { C, F, R, S, Z, btn } from '../../tokens';

export default function DisconnectAccountModal({ account, onConfirm, onClose }) {
  if (!account) return null;
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
          backgroundColor: C.surface,
          border: `1px solid ${C.border}`,
          borderRadius: R.card,
          maxWidth: '400px',
          width: '100%',
          padding: S[6],
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h3 style={{ fontFamily: F.display, fontSize: '16px', fontWeight: 700, color: C.textPrimary, margin: '0 0 8px' }}>
          Disconnect account?
        </h3>
        <p style={{ fontFamily: F.body, fontSize: '13px', color: C.textSecondary, marginBottom: S[5] }}>
          <strong>{account.name}</strong> ({account.platform}) will be disconnected. Scheduled posts for this account will not be published. You can reconnect anytime.
        </p>
        <div style={{ display: 'flex', gap: S[2], justifyContent: 'flex-end' }}>
          <button style={btn.secondary} onClick={onClose}>Cancel</button>
          <button
            style={{ ...btn.danger }}
            onClick={() => { onConfirm(account.id); onClose(); }}
          >
            Disconnect
          </button>
        </div>
      </div>
    </div>
  );
}
