import { C, F, S } from '../tokens';

export default function ClientPortal() {
  return (
    <div style={{ padding: S[8], color: C.textPrimary, fontFamily: F.display }}>
      <h1 style={{ fontSize: '24px', margin: 0 }}>ClientPortal</h1>
      <p style={{ color: C.textSecondary, fontFamily: F.body, marginTop: S[2] }}>Coming soon.</p>
    </div>
  );
}
