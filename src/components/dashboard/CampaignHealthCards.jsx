import { useNavigate } from 'react-router-dom';
import { S } from '../../tokens';
import CampaignHealthCard from './CampaignHealthCard';

export default function CampaignHealthCards({ campaigns = [] }) {
  const navigate = useNavigate();

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: S[4] }}>
      {campaigns.map((c) => (
        <div
          key={c.id}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); navigate(`/campaigns/${c.id}`); } }}
          style={{
            display: 'flex',
            flexDirection: 'column',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
            cursor: 'pointer',
            borderRadius: '14px',
            outline: 'none',
          }}
          onClick={() => navigate(`/campaigns/${c.id}`)}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.12)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = '';
            e.currentTarget.style.boxShadow = '';
          }}
        >
          <CampaignHealthCard {...c} />
        </div>
      ))}
    </div>
  );
}
