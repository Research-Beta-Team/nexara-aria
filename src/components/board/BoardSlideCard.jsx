/**
 * Single slide content block. Renders on light canvas (#F8F9FA).
 */
import { F } from '../../tokens';

const SLIDE_BG = '#F8F9FA';
const SLIDE_TEXT = '#1A2E22';
const SLIDE_MUTED = '#4A6B58';

export default function BoardSlideCard({ slide }) {
  if (!slide) return null;
  const { title, narrative, data, type } = slide;
  return (
    <div
      style={{
        backgroundColor: SLIDE_BG,
        color: SLIDE_TEXT,
        borderRadius: '8px',
        padding: 24,
        minHeight: 320,
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
      }}
    >
      <h2 style={{ fontFamily: F.display, fontSize: '20px', fontWeight: 700, margin: `0 0 16px 0`, color: SLIDE_TEXT }}>
        {title}
      </h2>
      {type === 'exec_summary' && data?.headline && (
        <div style={{ fontFamily: F.mono, fontSize: '28px', fontWeight: 700, color: '#1A5C35', marginBottom: 12 }}>
          {data.headline}
        </div>
      )}
      {type === 'exec_summary' && data?.subline && (
        <div style={{ fontFamily: F.body, fontSize: '14px', color: SLIDE_MUTED, marginBottom: 16 }}>{data.subline}</div>
      )}
      {type === 'cac_ltv' && data && (
        <div style={{ display: 'flex', gap: 24, marginBottom: 16 }}>
          <div><span style={{ fontFamily: F.mono, fontSize: '18px', color: SLIDE_MUTED }}>CAC</span> <span style={{ fontFamily: F.mono, fontSize: '22px', fontWeight: 700 }}>${data.cac}</span></div>
          <div><span style={{ fontFamily: F.mono, fontSize: '18px', color: SLIDE_MUTED }}>LTV</span> <span style={{ fontFamily: F.mono, fontSize: '22px', fontWeight: 700 }}>${data.ltv}</span></div>
          <div><span style={{ fontFamily: F.mono, fontSize: '18px', color: SLIDE_MUTED }}>Ratio</span> <span style={{ fontFamily: F.mono, fontSize: '22px', fontWeight: 700, color: '#1A5C35' }}>{data.ratio}</span></div>
        </div>
      )}
      {type === 'channel_roi' && data?.rows && (
        <ul style={{ margin: '0 0 16px 0', paddingLeft: 20 }}>
          {data.rows.map((row, i) => (
            <li key={i} style={{ fontFamily: F.body, fontSize: '14px', marginBottom: 4 }}>{row.channel}: {row.roi}</li>
          ))}
        </ul>
      )}
      {type === 'campaign_highlights' && data?.campaigns && (
        <ul style={{ margin: '0 0 16px 0', paddingLeft: 20 }}>
          {data.campaigns.map((c, i) => (
            <li key={i} style={{ fontFamily: F.body, fontSize: '14px', marginBottom: 4 }}>{c}</li>
          ))}
        </ul>
      )}
      {type === 'qoq' && data && (
        <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
          <span>Pipeline {data.pipelineChange}</span>
          <span>MQLs {data.mqlChange}</span>
          <span>CAC {data.cacChange}</span>
        </div>
      )}
      {type === 'next_quarter' && data?.priorities && (
        <ol style={{ margin: '0 0 16px 0', paddingLeft: 20 }}>
          {data.priorities.map((p, i) => (
            <li key={i} style={{ fontFamily: F.body, fontSize: '14px', marginBottom: 4 }}>{p}</li>
          ))}
        </ol>
      )}
      {type === 'appendix' && data && (
        <div style={{ fontFamily: F.body, fontSize: '12px', color: SLIDE_MUTED }}>
          {data.methodology}<br />{data.sources}
        </div>
      )}
      <p style={{ fontFamily: F.body, fontSize: '14px', lineHeight: 1.5, color: SLIDE_TEXT, margin: 0 }}>
        {narrative}
      </p>
    </div>
  );
}
