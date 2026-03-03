import { C, F, R, S, cardStyle } from '../../tokens';

export default function DonorPipelineWidget() {
  return (
    <div style={{ ...cardStyle, padding: S[5], display: 'flex', flexDirection: 'column', gap: S[3], alignItems: 'center', textAlign: 'center' }}>
      <div style={{ fontFamily: F.display, fontSize: '13px', fontWeight: 700, color: C.textPrimary }}>
        Donor Pipeline
      </div>
      <div style={{ fontFamily: F.body, fontSize: '12px', color: C.textMuted }}>
        Donor stages and gift forecasts. Configure in campaign settings.
      </div>
    </div>
  );
}
