import { useNavigate } from 'react-router-dom';
import { C, F, R, S, btn } from '../../tokens';

export default function ForecastInsights({ risks = [], toast }) {
  const navigate = useNavigate();

  const handleMitigate = (risk) => {
    if (risk.to) {
      navigate(risk.to);
    } else {
      toast?.info('Mitigation action opened');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: S[4] }}>
      <h3 style={{ fontFamily: F.display, fontSize: '16px', fontWeight: 700, color: C.textPrimary, margin: 0 }}>
        Forecast risk factors
      </h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: S[3] }}>
        {risks.map((risk) => (
          <div
            key={risk.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: S[4],
              padding: S[4],
              backgroundColor: C.surface,
              border: `1px solid ${C.border}`,
              borderLeft: `4px solid ${C.amber}`,
              borderRadius: R.card,
            }}
          >
            <span style={{ fontFamily: F.body, fontSize: '13px', color: C.textPrimary }}>{risk.description}</span>
            <button style={{ ...btn.secondary, fontSize: '12px', flexShrink: 0 }} onClick={() => handleMitigate(risk)}>
              Mitigate now
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
