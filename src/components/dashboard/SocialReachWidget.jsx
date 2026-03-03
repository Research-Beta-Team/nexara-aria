import { C, F, R, S, cardStyle } from '../../tokens';

export default function SocialReachWidget() {
  return (
    <div style={{ ...cardStyle, padding: S[5], display: 'flex', flexDirection: 'column', gap: S[3], alignItems: 'center', textAlign: 'center' }}>
      <div style={{ fontFamily: F.display, fontSize: '13px', fontWeight: 700, color: C.textPrimary }}>
        Social Reach
      </div>
      <div style={{ fontFamily: F.body, fontSize: '12px', color: C.textMuted }}>
        Impressions, engagement, and top posts by channel. Connect accounts in Settings to populate.
      </div>
    </div>
  );
}
