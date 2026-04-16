/**
 * ModeTable — Table component that adapts to current command mode.
 * Manual: dense, grid, monospace | Semi: comfortable | Agentic: spacious, rounded rows
 */
import { useState } from 'react';
import useCommandModeDesign from '../../hooks/useCommandModeDesign';
import { C, scrollbarStyle } from '../../tokens';

export default function ModeTable({
  columns, // [{ key, label, width?, align?, render? }]
  data,    // array of row objects
  onRowClick,
  striped = true,
  hoverable = true,
  emptyMessage = 'No data',
  style,
}) {
  const d = useCommandModeDesign();
  const isAgentic = d.id === 'fully_agentic';
  const isManual = d.id === 'manual';

  const tableStyle = {
    width: '100%',
    borderCollapse: isAgentic ? 'separate' : 'collapse',
    borderSpacing: isAgentic ? '0 4px' : '0',
    fontFamily: d.table.cellFont,
    fontSize: d.table.cellSize,
    ...style,
  };

  const thStyle = (col) => ({
    padding: d.table.cellPadding,
    backgroundColor: d.table.headerBg,
    fontFamily: d.table.headerFont,
    fontSize: d.table.headerSize,
    fontWeight: d.table.headerWeight,
    letterSpacing: d.table.headerSpacing,
    textTransform: d.table.headerTransform,
    textAlign: col.align || 'left',
    color: C.textMuted,
    borderBottom: isAgentic ? 'none' : d.table.rowBorder,
    whiteSpace: 'nowrap',
    width: col.width,
  });

  const trStyle = (index, hovered) => {
    const isStriped = striped && index % 2 === 1;
    return {
      backgroundColor: hovered && hoverable
        ? d.table.hoverBg
        : isStriped
        ? d.table.stripedBg
        : 'transparent',
      cursor: onRowClick ? 'pointer' : 'default',
      transition: isManual ? 'none' : 'background-color 0.12s ease',
      borderRadius: isAgentic ? d.table.rowRadius : '0',
    };
  };

  const tdStyle = (col, isFirst, isLast) => ({
    padding: d.table.cellPadding,
    textAlign: col.align || 'left',
    color: C.textPrimary,
    borderBottom: isAgentic ? 'none' : d.table.rowBorder,
    borderTopLeftRadius: isAgentic && isFirst ? d.table.rowRadius : '0',
    borderBottomLeftRadius: isAgentic && isFirst ? d.table.rowRadius : '0',
    borderTopRightRadius: isAgentic && isLast ? d.table.rowRadius : '0',
    borderBottomRightRadius: isAgentic && isLast ? d.table.rowRadius : '0',
    verticalAlign: 'middle',
  });

  if (!data || data.length === 0) {
    return (
      <div
        style={{
          padding: d.spacing.cardPadding,
          textAlign: 'center',
          color: C.textMuted,
          fontFamily: d.typography.bodyFont,
          fontSize: '13px',
        }}
      >
        {emptyMessage}
      </div>
    );
  }

  return (
    <div style={{ overflowX: 'auto', ...scrollbarStyle }}>
      <table style={tableStyle}>
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key} style={thStyle(col)}>
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <TableRow
              key={row.id || rowIndex}
              row={row}
              rowIndex={rowIndex}
              columns={columns}
              trStyle={trStyle}
              tdStyle={tdStyle}
              onRowClick={onRowClick}
              hoverable={hoverable}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

function TableRow({ row, rowIndex, columns, trStyle, tdStyle, onRowClick, hoverable }) {
  const [hovered, setHovered] = useState(false);
  return (
    <tr
      style={trStyle(rowIndex, hovered)}
      onClick={() => onRowClick?.(row)}
      onMouseEnter={() => hoverable && setHovered(true)}
      onMouseLeave={() => hoverable && setHovered(false)}
    >
      {columns.map((col, colIndex) => (
        <td
          key={col.key}
          style={tdStyle(col, colIndex === 0, colIndex === columns.length - 1)}
        >
          {col.render ? col.render(row[col.key], row) : row[col.key]}
        </td>
      ))}
    </tr>
  );
}
