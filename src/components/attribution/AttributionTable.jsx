/**
 * Sortable table: Campaign, Channel, Touches, Pipeline, Revenue, ROI, CAC.
 */
import { useState, useMemo } from 'react';
import { C, F, R, S } from '../../tokens';
import { IconTrendUp, IconTrendDown } from '../ui/Icons';

const COLUMNS = [
  { key: 'campaign', label: 'Campaign', sortable: true },
  { key: 'channel', label: 'Channel', sortable: true },
  { key: 'touches', label: 'Touches', sortable: true },
  { key: 'pipeline', label: 'Pipeline', sortable: true },
  { key: 'revenue', label: 'Revenue', sortable: true },
  { key: 'roi', label: 'ROI', sortable: true },
  { key: 'cac', label: 'CAC', sortable: true },
];

function formatMoney(v) {
  if (v >= 1000000) return `$${(v / 1000000).toFixed(1)}M`;
  if (v >= 1000) return `$${(v / 1000).toFixed(0)}K`;
  return `$${v}`;
}

export default function AttributionTable({ data = [] }) {
  const [sortKey, setSortKey] = useState('pipeline');
  const [sortDir, setSortDir] = useState('desc');
  const sorted = useMemo(() => {
    const arr = [...data];
    arr.sort((a, b) => {
      const va = a[sortKey];
      const vb = b[sortKey];
      if (typeof va === 'number' && typeof vb === 'number') return sortDir === 'asc' ? va - vb : vb - va;
      const sa = String(va);
      const sb = String(vb);
      return sortDir === 'asc' ? sa.localeCompare(sb) : sb.localeCompare(sa);
    });
    return arr;
  }, [data, sortKey, sortDir]);

  const handleSort = (key) => {
    if (sortKey === key) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else setSortKey(key);
  };

  return (
    <div
      style={{
        backgroundColor: C.surface,
        border: `1px solid ${C.border}`,
        borderRadius: R.card,
        padding: S[4],
        overflowX: 'auto',
      }}
    >
      <div style={{ fontFamily: F.display, fontSize: '14px', fontWeight: 700, color: C.textPrimary, marginBottom: S[4] }}>
        Attribution by campaign
      </div>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: F.body, fontSize: '13px' }}>
        <thead>
          <tr>
            {COLUMNS.map((col) => (
              <th
                key={col.key}
                onClick={() => col.sortable && handleSort(col.key)}
                style={{
                  textAlign: col.key === 'campaign' || col.key === 'channel' ? 'left' : 'right',
                  padding: `${S[2]} ${S[3]}`,
                  fontWeight: 600,
                  color: C.textSecondary,
                  borderBottom: `1px solid ${C.border}`,
                  cursor: col.sortable ? 'pointer' : 'default',
                  whiteSpace: 'nowrap',
                }}
              >
                {col.label}
                {col.sortable && sortKey === col.key && (sortDir === 'asc' ? <IconTrendUp w={14} color={C.primary} style={{ marginLeft: 4 }} /> : <IconTrendDown w={14} color={C.primary} style={{ marginLeft: 4 }} />)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sorted.slice(0, 16).map((row) => (
            <tr key={row.id} style={{ borderBottom: `1px solid ${C.border}` }}>
              <td style={{ padding: `${S[2]} ${S[3]}`, color: C.textPrimary }}>{row.campaign}</td>
              <td style={{ padding: `${S[2]} ${S[3]}`, color: C.textPrimary }}>{row.channel}</td>
              <td style={{ padding: `${S[2]} ${S[3]}`, color: C.textPrimary, textAlign: 'right' }}>{row.touches}</td>
              <td style={{ padding: `${S[2]} ${S[3]}`, color: C.textPrimary, textAlign: 'right', fontFamily: F.mono }}>{formatMoney(row.pipeline)}</td>
              <td style={{ padding: `${S[2]} ${S[3]}`, color: C.textPrimary, textAlign: 'right', fontFamily: F.mono }}>{formatMoney(row.revenue)}</td>
              <td style={{ padding: `${S[2]} ${S[3]}`, color: C.primary, textAlign: 'right', fontFamily: F.mono }}>{row.roi}x</td>
              <td style={{ padding: `${S[2]} ${S[3]}`, color: C.textSecondary, textAlign: 'right', fontFamily: F.mono }}>${row.cac}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
