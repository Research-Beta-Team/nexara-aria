import { useState } from 'react';
import useToast from '../../hooks/useToast';
import { C, F, R, S, btn, sectionHeading } from '../../tokens';
import { COMPETITORS } from '../../data/competitors';
import CompetitorCard from '../../components/competitive/CompetitorCard';
import BattleCard from '../../components/competitive/BattleCard';
import AdIntelGallery from '../../components/competitive/AdIntelGallery';
import PositioningRadar from '../../components/competitive/PositioningRadar';

const TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'battlecards', label: 'Battle Cards' },
  { id: 'adintel', label: 'Ad Intelligence' },
  { id: 'reviews', label: 'Review Analysis' },
  { id: 'positioning', label: 'Positioning Map' },
];

// ── ARIA Icon ──────────────────────────────────
function AriaIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 14 14" fill="none">
      <path d="M7 1.5L13.2 12.8H.8L7 1.5z" stroke={C.primary} strokeWidth="1.3" strokeLinejoin="round"/>
      <path d="M3.6 9.2h6.8" stroke={C.primary} strokeWidth="1.3" strokeLinecap="round"/>
      <circle cx="7" cy="1.5" r="1.1" fill={C.primary}/>
      <circle cx=".8" cy="12.8" r="1.1" fill={C.primary}/>
      <circle cx="13.2" cy="12.8" r="1.1" fill={C.primary}/>
    </svg>
  );
}

// ── Review Analysis tab content ─────────────────
function ReviewAnalysisTab({ competitors, selectedId, onSelect, toast }) {
  const selected = competitors.find((c) => c.id === selectedId) || competitors[0];
  const { name, g2Rating, reviewCount, reviewThemes, sampleReviews } = selected;
  const positive = reviewThemes?.positive || [];
  const negative = reviewThemes?.negative || [];

  return (
    <div style={{ display: 'flex', gap: S[6], minHeight: 400 }}>
      <div style={{ width: 160, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: S[1] }}>
        <span style={{ fontFamily: F.mono, fontSize: '10px', fontWeight: 700, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: S[2] }}>
          Competitor
        </span>
        {competitors.map((c) => {
          const active = c.id === selectedId;
          return (
            <button
              key={c.id}
              onClick={() => onSelect(c.id)}
              style={{
                textAlign: 'left',
                padding: `${S[2]} ${S[3]}`,
                borderRadius: R.button,
                border: `1px solid ${active ? C.primary : C.border}`,
                backgroundColor: active ? 'rgba(61,220,132,0.08)' : 'transparent',
                color: active ? C.primary : C.textPrimary,
                fontFamily: F.body,
                fontSize: '13px',
                fontWeight: active ? 600 : 500,
                cursor: 'pointer',
              }}
            >
              {c.name}
            </button>
          );
        })}
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: S[5] }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: S[3] }}>
          <span style={{ display: 'flex', gap: '2px' }}>
            {[1, 2, 3, 4, 5].map((i) => (
              <span key={i} style={{ color: i <= Math.floor(g2Rating) ? C.amber : C.border, fontSize: '18px' }}>★</span>
            ))}
          </span>
          <span style={{ fontFamily: F.mono, fontSize: '14px', color: C.textPrimary }}>{g2Rating}</span>
          <span style={{ fontFamily: F.body, fontSize: '13px', color: C.textSecondary }}>{reviewCount.toLocaleString()} reviews</span>
        </div>
        <div>
          <h3 style={{ fontFamily: F.body, fontSize: '12px', fontWeight: 700, color: C.primary, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: S[2] }}>
            Positive themes
          </h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: S[2] }}>
            {positive.map((t, i) => (
              <span
                key={i}
                style={{
                  ...{ display: 'inline-flex', alignItems: 'center', gap: S[1], padding: `${S[1]} ${S[2]}`, borderRadius: R.pill, fontFamily: F.body, fontSize: '12px' },
                  backgroundColor: 'rgba(61,220,132,0.12)',
                  color: C.primary,
                  border: `1px solid rgba(61,220,132,0.25)`,
                }}
              >
                {t.theme} <span style={{ fontFamily: F.mono, opacity: 0.9 }}>({t.count})</span>
              </span>
            ))}
          </div>
        </div>
        <div>
          <h3 style={{ fontFamily: F.body, fontSize: '12px', fontWeight: 700, color: C.red, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: S[2] }}>
            Negative themes — these are their weaknesses
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: S[2] }}>
            {negative.map((t, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: S[3],
                  flexWrap: 'wrap',
                  padding: `${S[2]} ${S[3]}`,
                  backgroundColor: 'rgba(255,110,122,0.08)',
                  border: '1px solid rgba(255,110,122,0.2)',
                  borderRadius: R.sm,
                }}
              >
                <span style={{ fontFamily: F.body, fontSize: '13px', color: C.red }}>
                  {t.theme} <span style={{ fontFamily: F.mono, fontSize: '11px', color: C.textMuted }}>({t.count})</span>
                </span>
                <button
                  style={{ ...btn.ghost, fontSize: '12px', color: C.primary }}
                  onClick={() => toast?.success(`Creating objection handler for "${t.theme}"`)}
                >
                  Create objection handler
                </button>
              </div>
            ))}
          </div>
        </div>
        <div
          style={{
            padding: S[4],
            backgroundColor: 'rgba(61,220,132,0.06)',
            border: '1px solid rgba(61,220,132,0.2)',
            borderLeft: `3px solid ${C.primary}`,
            borderRadius: R.card,
            fontFamily: F.body,
            fontSize: '13px',
            color: C.textPrimary,
          }}
        >
          <strong>ARIA extraction:</strong> Customers consistently complain about {negative[0]?.theme?.toLowerCase() || 'support and complexity'}. Our unified platform and dedicated success team directly address this.
        </div>
        <div>
          <h3 style={{ fontFamily: F.body, fontSize: '12px', fontWeight: 700, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: S[2] }}>
            Sample reviews
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: S[2] }}>
            {(sampleReviews || []).map((r, i) => (
              <div
                key={i}
                style={{
                  padding: S[3],
                  backgroundColor: C.surface2,
                  border: `1px solid ${C.border}`,
                  borderRadius: R.sm,
                  fontFamily: F.body,
                  fontSize: '13px',
                  color: C.textPrimary,
                  fontStyle: 'italic',
                }}
              >
                &quot;{r.quote}&quot; — {r.rating}/5
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Page ────────────────────────────────────────
export default function CompetitiveIntel() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedCompetitorId, setSelectedCompetitorId] = useState(COMPETITORS[0]?.id || null);
  const [adFilterCompetitorId, setAdFilterCompetitorId] = useState(null);
  const toast = useToast();

  const handleViewBattleCard = (id) => {
    setSelectedCompetitorId(id);
    setActiveTab('battlecards');
  };
  const handleViewAds = (id) => {
    setAdFilterCompetitorId(id);
    setActiveTab('adintel');
  };

  return (
    <div style={{ padding: S[6], display: 'flex', flexDirection: 'column', gap: S[5] }}>
      {/* Page header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: S[3] }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <h1 style={{ ...sectionHeading, fontSize: '22px', letterSpacing: '-0.02em', margin: 0 }}>
            Competitive Intelligence
          </h1>
          <span style={{ fontFamily: F.body, fontSize: '13px', color: C.textSecondary }}>
            Updated 2 hours ago by <span style={{ color: C.primary }}>ARIA</span>
          </span>
        </div>
        <div style={{ display: 'flex', gap: S[2] }}>
          <button
            style={{ ...btn.secondary, fontSize: '13px' }}
            onClick={() => toast.info('Refreshing competitive data…')}
          >
            Force refresh
          </button>
          <button
            style={{ ...btn.primary, fontSize: '13px' }}
            onClick={() => toast.success('Add competitor flow coming soon')}
          >
            Add competitor
          </button>
        </div>
      </div>

      {/* Tab bar */}
      <div style={{ display: 'flex', gap: 0, borderBottom: `1px solid ${C.border}`, overflowX: 'auto' }}>
        {TABS.map((tab) => {
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              style={{
                fontFamily: F.body,
                fontSize: '13px',
                fontWeight: active ? 600 : 400,
                color: active ? C.primary : C.textSecondary,
                backgroundColor: 'transparent',
                border: 'none',
                borderBottom: active ? `2px solid ${C.primary}` : '2px solid transparent',
                padding: `${S[3]} ${S[4]}`,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                flexShrink: 0,
              }}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      <div>
        {activeTab === 'overview' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: S[4] }}>
            {COMPETITORS.map((c) => (
              <CompetitorCard
                key={c.id}
                competitor={c}
                onViewBattleCard={handleViewBattleCard}
                onViewAds={handleViewAds}
              />
            ))}
          </div>
        )}
        {activeTab === 'battlecards' && (
          <BattleCard
            competitors={COMPETITORS}
            selectedId={selectedCompetitorId}
            onSelect={setSelectedCompetitorId}
            toast={toast}
          />
        )}
        {activeTab === 'adintel' && (
          <AdIntelGallery
            competitors={COMPETITORS}
            selectedCompetitorId={adFilterCompetitorId}
            onFilterChange={setAdFilterCompetitorId}
            toast={toast}
          />
        )}
        {activeTab === 'reviews' && (
          <ReviewAnalysisTab
            competitors={COMPETITORS}
            selectedId={selectedCompetitorId}
            onSelect={setSelectedCompetitorId}
            toast={toast}
          />
        )}
        {activeTab === 'positioning' && <PositioningRadar />}
      </div>
    </div>
  );
}
