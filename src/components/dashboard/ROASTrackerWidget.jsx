import { C, F, R, S, cardStyle } from '../../tokens';

export default function ROASTrackerWidget() {
  return (
    <div style={{ ...cardStyle, padding: S[5], display: 'flex', flexDirection: 'column', gap: S[3], alignItems: 'center', textAlign: 'center' }}>
      <div style={{ fontFamily: F.display, fontSize: '13px', fontWeight: 700, color: C.textPrimary }}>
        ROAS Tracker
      </div>
      <div style={{ fontFamily: F.body, fontSize: '12px', color: C.textMuted }}>
        Return on ad spend by campaign and channel. Link e‑commerce data to see ROAS.
      </div>
    </div>
  );
}
