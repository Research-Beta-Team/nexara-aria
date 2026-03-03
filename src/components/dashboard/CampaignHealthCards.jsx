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
          style={{
            display: 'flex',
            flexDirection: 'column',
            transition: 'all 0.2s ease',
            cursor: 'pointer',
          }}
          onClick={() => navigate(`/campaigns/${c.id}`)}
        >
          <CampaignHealthCard {...c} />
        </div>
      ))}
    </div>
  );
}
