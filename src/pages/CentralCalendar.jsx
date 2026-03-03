import { useState, useMemo } from 'react';
import SharedCalendar from '../components/calendar/SharedCalendar';
import { getCentralCalendarEvents, getCampaignOptionsForCalendar } from '../data/centralCalendar';
import { C, F, R, S, Z, btn, shadows } from '../tokens';

/**
 * Central Calendar: all campaigns in one view, filterable by campaign.
 * For enterprise: one calendar across multiple campaigns.
 */
export default function CentralCalendar() {
  const centralEvents = useMemo(() => getCentralCalendarEvents(), []);
  const campaignOptions = useMemo(() => getCampaignOptionsForCalendar(), []);

  const [selectedCampaignIds, setSelectedCampaignIds] = useState(
    () => campaignOptions.map((c) => c.id)
  );
  const [filterOpen, setFilterOpen] = useState(false);

  const eventsFilteredByCampaign = useMemo(
    () =>
      centralEvents.filter((e) =>
        e.campaignId ? selectedCampaignIds.includes(e.campaignId) : true
      ),
    [centralEvents, selectedCampaignIds]
  );

  const toggleCampaign = (id) => {
    setSelectedCampaignIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const selectAll = () => setSelectedCampaignIds(campaignOptions.map((c) => c.id));
  const clearAll = () => setSelectedCampaignIds([]);

  const campaignFilterSlot = (
    <div style={{ position: 'relative' }}>
      <button
        style={{
          ...btn.secondary,
          fontSize: '12px',
          gap: S[2],
        }}
        onClick={() => setFilterOpen((o) => !o)}
      >
        Campaigns
        <span
          style={{
            fontFamily: F.mono,
            fontSize: '10px',
            color: C.textMuted,
          }}
        >
          {selectedCampaignIds.length}/{campaignOptions.length}
        </span>
        <svg
          width="11"
          height="11"
          viewBox="0 0 11 11"
          fill="none"
          style={{
            transform: filterOpen ? 'rotate(180deg)' : 'none',
            transition: 'transform 0.2s ease',
          }}
        >
          <path
            d="M2 4l3.5 3.5L9 4"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {filterOpen && (
        <>
          <div
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: Z.dropdown - 1,
            }}
            onClick={() => setFilterOpen(false)}
            aria-hidden
          />
          <div
            style={{
              position: 'absolute',
              top: 'calc(100% + 4px)',
              left: 0,
              backgroundColor: C.surface2,
              border: `1px solid ${C.border}`,
              borderRadius: R.card,
              padding: S[3],
              zIndex: Z.dropdown,
              boxShadow: shadows.dropdown,
              minWidth: '220px',
            }}
          >
            <div
              style={{
                fontFamily: F.body,
                fontSize: '10px',
                fontWeight: 700,
                color: C.textMuted,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                marginBottom: S[2],
              }}
            >
              Show campaigns
            </div>
            <div style={{ display: 'flex', gap: S[1], marginBottom: S[2] }}>
              <button
                type="button"
                style={{
                  ...btn.ghost,
                  fontSize: '11px',
                  padding: '2px 8px',
                }}
                onClick={selectAll}
              >
                All
              </button>
              <button
                type="button"
                style={{
                  ...btn.ghost,
                  fontSize: '11px',
                  padding: '2px 8px',
                }}
                onClick={clearAll}
              >
                None
              </button>
            </div>
            {campaignOptions.map((c) => (
              <label
                key={c.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: S[2],
                  padding: `${S[1]} 0`,
                  cursor: 'pointer',
                  fontFamily: F.body,
                  fontSize: '13px',
                  color: C.textSecondary,
                }}
              >
                <input
                  type="checkbox"
                  checked={selectedCampaignIds.includes(c.id)}
                  onChange={() => toggleCampaign(c.id)}
                  style={{ accentColor: C.primary }}
                />
                {c.name}
              </label>
            ))}
          </div>
        </>
      )}
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div
        style={{
          padding: `${S[4]} ${S[5]} ${S[2]}`,
          borderBottom: `1px solid ${C.border}`,
          backgroundColor: C.surface,
        }}
      >
        <h1
          style={{
            fontFamily: F.display,
            fontSize: '20px',
            fontWeight: 800,
            color: C.textPrimary,
            margin: 0,
            letterSpacing: '-0.02em',
          }}
        >
          Central Calendar
        </h1>
        <p
          style={{
            fontFamily: F.body,
            fontSize: '13px',
            color: C.textSecondary,
            margin: `${S[1]} 0 0`,
          }}
        >
          All campaign events in one place. Filter by campaign above.
        </p>
      </div>
      <SharedCalendar events={eventsFilteredByCampaign} extraFilterSlot={campaignFilterSlot} />
    </div>
  );
}
