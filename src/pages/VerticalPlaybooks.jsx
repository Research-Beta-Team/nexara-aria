import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { C, F, R, S, sectionHeading, inputStyle } from '../tokens';
import { PLAYBOOKS } from '../data/playbooks';
import PlaybookCard from '../components/playbooks/PlaybookCard';
import PlaybookDetailModal from '../components/playbooks/PlaybookDetailModal';

const CHANNEL_FILTERS = ['All', 'Email', 'LinkedIn', 'Meta Ads', 'WhatsApp'];

export default function VerticalPlaybooks() {
  const [searchQuery, setSearchQuery] = useState('');
  const [channelFilter, setChannelFilter] = useState('All');
  const [selectedPlaybook, setSelectedPlaybook] = useState(null);
  const navigate = useNavigate();

  const filtered = useMemo(() => {
    return PLAYBOOKS.filter((p) => {
      const matchChannel = channelFilter === 'All' || (p.channels && p.channels.includes(channelFilter));
      const q = searchQuery.trim().toLowerCase();
      const matchSearch = !q || (p.name && p.name.toLowerCase().includes(q)) ||
        (p.target && p.target.toLowerCase().includes(q)) ||
        (p.icp && p.icp.toLowerCase().includes(q));
      return matchChannel && matchSearch;
    });
  }, [searchQuery, channelFilter]);

  const handleLaunch = (playbook) => {
    setSelectedPlaybook(null);
    navigate(`/campaigns/new?playbook=${playbook.slug || playbook.id}`);
  };

  return (
    <div style={{ padding: S[6], display: 'flex', flexDirection: 'column', gap: S[5] }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: S[2] }}>
        <h1 style={{ ...sectionHeading, fontSize: '22px', letterSpacing: '-0.02em', margin: 0 }}>
          Vertical Playbooks
        </h1>
        <p style={{ fontFamily: F.body, fontSize: '14px', color: C.textSecondary }}>
          Pre-built GTM campaigns. Pick one, ARIA customises it for your context. Launch in hours.
        </p>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: S[4], alignItems: 'center' }}>
        <input
          type="search"
          placeholder="Search playbooks…"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            ...inputStyle,
            width: 260,
            flexShrink: 0,
          }}
        />
        <div style={{ display: 'flex', gap: S[2], flexWrap: 'wrap' }}>
          {CHANNEL_FILTERS.map((ch) => (
            <button
              key={ch}
              style={{
                padding: `${S[2]} ${S[4]}`,
                borderRadius: R.button,
                border: `1px solid ${channelFilter === ch ? C.primary : C.border}`,
                backgroundColor: channelFilter === ch ? 'rgba(61,220,132,0.1)' : C.surface2,
                color: channelFilter === ch ? C.primary : C.textSecondary,
                fontFamily: F.body,
                fontSize: '13px',
                cursor: 'pointer',
              }}
              onClick={() => setChannelFilter(ch)}
            >
              {ch}
            </button>
          ))}
        </div>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
          gap: S[5],
        }}
      >
        {filtered.map((playbook) => (
          <PlaybookCard
            key={playbook.id}
            playbook={playbook}
            onPreview={() => setSelectedPlaybook(playbook)}
            onLaunch={handleLaunch}
          />
        ))}
      </div>

      {filtered.length === 0 && (
        <div style={{ fontFamily: F.body, fontSize: '14px', color: C.textMuted, textAlign: 'center', padding: S[8] }}>
          No playbooks match your search or filter.
        </div>
      )}

      <PlaybookDetailModal
        playbook={selectedPlaybook}
        onClose={() => setSelectedPlaybook(null)}
        onLaunch={handleLaunch}
      />
    </div>
  );
}
