import { C, F, R, S } from '../../../tokens';

export default function AnalyticsTab() {
  return (
    <div style={{ padding: S[5], display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '300px', flexDirection: 'column', gap: S[3] }}>
      <div style={{ fontFamily: F.display, fontSize: '24px', fontWeight: 700, color: C.textMuted }}>Analytics</div>
      <div style={{ fontFamily: F.body, fontSize: '13px', color: C.textMuted }}>Deep analytics module — coming in Session 5</div>
    </div>
  );
}
