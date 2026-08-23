import { useEffect, useId, useMemo, useRef, useState, type ReactNode } from 'react';

import { Checkbox } from '../Checkbox';
import chevronDown from '../../assets/figma/select-chevron-down.svg';
import sortDefault from '../../assets/figma/table-sort.svg';
import sortAscending from '../../assets/figma/table-sort-ascending.svg';
import sortDescending from '../../assets/figma/table-sort-descending.svg';
import './DataTable.css';

export type TableAlign = 'start' | 'center' | 'end';
export type SortDirection = 'ascending' | 'descending';

export interface TableSort {
  columnKey: string;
  direction: SortDirection;
}

export interface DataTableColumn<Row> {
  key: string;
  header: ReactNode;
  cell: (row: Row) => ReactNode;
  width?: number | string;
  minWidth?: number | string;
  align?: TableAlign;
  sortable?: boolean;
}

export interface DataTableProps<Row> {
  columns: DataTableColumn<Row>[];
  data: Row[];
  getRowId: (row: Row) => string;
  caption?: string;
  ariaLabel?: string;
  className?: string;
  minWidth?: number | string;
  emptyState?: ReactNode;
  loading?: boolean;
  sort?: TableSort;
  onSortChange?: (sort: TableSort | undefined) => void;
  selectedRowIds?: readonly string[];
  onSelectionChange?: (rowIds: string[]) => void;
  isRowSelectable?: (row: Row) => boolean;
  expandedRowIds?: readonly string[];
  onExpandedChange?: (rowIds: string[]) => void;
  renderExpandedRow?: (row: Row) => ReactNode;
}

function getNextSort(current: TableSort | undefined, columnKey: string): TableSort | undefined {
  if (current?.columnKey !== columnKey) return { columnKey, direction: 'ascending' };
  if (current.direction === 'ascending') return { columnKey, direction: 'descending' };
  return undefined;
}

export function DataTable<Row>({
  columns,
  data,
  getRowId,
  caption,
  ariaLabel,
  className,
  minWidth = 680,
  emptyState = 'No data',
  loading = false,
  sort,
  onSortChange,
  selectedRowIds = [],
  onSelectionChange,
  isRowSelectable = () => true,
  expandedRowIds = [],
  onExpandedChange,
  renderExpandedRow,
}: DataTableProps<Row>) {
  const generatedId = useId();
  const scrollRef = useRef<HTMLDivElement>(null);
  const scrollTrackRef = useRef<HTMLDivElement>(null);
  const [scrollMetrics, setScrollMetrics] = useState({ visible: false, thumbWidth: 0, thumbOffset: 0 });
  const selectedIds = useMemo(() => new Set(selectedRowIds), [selectedRowIds]);
  const expandedIds = useMemo(() => new Set(expandedRowIds), [expandedRowIds]);
  const selectableRows = data.filter(isRowSelectable);
  const allSelected = selectableRows.length > 0 && selectableRows.every((row) => selectedIds.has(getRowId(row)));
  const someSelected = selectableRows.some((row) => selectedIds.has(getRowId(row)));
  const hasSelection = Boolean(onSelectionChange);
  const hasExpansion = Boolean(renderExpandedRow && onExpandedChange);
  const columnCount = columns.length + Number(hasSelection) + Number(hasExpansion);
  const tableName = caption ?? ariaLabel;

  const syncScrollMetrics = () => {
    const element = scrollRef.current;
    if (!element) return;
    const maxScroll = element.scrollWidth - element.clientWidth;
    const visible = maxScroll > 1;
    const thumbWidth = visible ? Math.max(40, (element.clientWidth / element.scrollWidth) * element.clientWidth) : 0;
    const thumbOffset = visible ? (element.scrollLeft / maxScroll) * (element.clientWidth - thumbWidth) : 0;
    setScrollMetrics({ visible, thumbWidth, thumbOffset });
  };

  useEffect(() => {
    syncScrollMetrics();
    const element = scrollRef.current;
    if (!element) return undefined;
    const observer = new ResizeObserver(syncScrollMetrics);
    observer.observe(element);
    return () => observer.disconnect();
  }, [columns.length, data.length, hasExpansion, hasSelection]);

  const moveScrollFromPointer = (clientX: number) => {
    const element = scrollRef.current;
    const track = scrollTrackRef.current;
    if (!element || !track || !scrollMetrics.visible) return;
    const bounds = track.getBoundingClientRect();
    const maxOffset = Math.max(1, bounds.width - scrollMetrics.thumbWidth);
    const offset = Math.min(maxOffset, Math.max(0, clientX - bounds.left - scrollMetrics.thumbWidth / 2));
    element.scrollLeft = (offset / maxOffset) * (element.scrollWidth - element.clientWidth);
  };

  const startScrollDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    moveScrollFromPointer(event.clientX);
  };

  const toggleAllRows = () => {
    if (!onSelectionChange) return;
    const selectableIds = selectableRows.map(getRowId);
    const next = allSelected
      ? selectedRowIds.filter((id) => !selectableIds.includes(id))
      : [...new Set([...selectedRowIds, ...selectableIds])];
    onSelectionChange(next);
  };

  const toggleRow = (row: Row) => {
    if (!onSelectionChange) return;
    const rowId = getRowId(row);
    onSelectionChange(selectedIds.has(rowId)
      ? selectedRowIds.filter((id) => id !== rowId)
      : [...selectedRowIds, rowId]);
  };

  const toggleExpanded = (row: Row) => {
    if (!onExpandedChange) return;
    const rowId = getRowId(row);
    onExpandedChange(expandedIds.has(rowId)
      ? expandedRowIds.filter((id) => id !== rowId)
      : [...expandedRowIds, rowId]);
  };

  return (
    <div className={['data-table', className].filter(Boolean).join(' ')}>
      <div ref={scrollRef} className="data-table__scroll" tabIndex={0} aria-label="Horizontal table scroll" onScroll={syncScrollMetrics}>
        <table aria-label={caption ? undefined : tableName} style={{ minInlineSize: minWidth }}>
          {caption && <caption className="data-table__caption">{caption}</caption>}
          <colgroup>
            {hasExpansion && <col className="data-table__expand-column" />}
            {hasSelection && <col className="data-table__selection-column" />}
            {columns.map((column) => <col key={column.key} style={{ width: column.width, minWidth: column.minWidth }} />)}
          </colgroup>
          <thead>
            <tr>
              {hasExpansion && <th aria-label="Row expansion" scope="col" />}
              {hasSelection && (
                <th className="data-table__selection-cell" scope="col">
                  <Checkbox
                    aria-label={allSelected ? 'Deselect all rows' : 'Select all rows'}
                    checked={allSelected}
                    indeterminate={!allSelected && someSelected}
                    disabled={selectableRows.length === 0}
                    onChange={toggleAllRows}
                  />
                </th>
              )}
              {columns.map((column) => {
                const isSorted = sort?.columnKey === column.key;
                return (
                  <th className={`data-table__cell data-table__cell--${column.align ?? 'start'}`} key={column.key} scope="col" aria-sort={column.sortable && onSortChange && isSorted ? sort?.direction : undefined}>
                    {column.sortable && onSortChange ? (
                      <button
                        className="data-table__sort-button"
                        type="button"
                        onClick={() => onSortChange?.(getNextSort(sort, column.key))}
                      >
                        <span>{column.header}</span>
                        <span className={['data-table__sort-icon', isSorted && 'data-table__sort-icon--active'].filter(Boolean).join(' ')} aria-hidden="true">
                          <img src={isSorted ? (sort?.direction === 'ascending' ? sortAscending : sortDescending) : sortDefault} alt="" />
                        </span>
                      </button>
                    ) : column.header}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody aria-busy={loading || undefined}>
            {loading && (
              <tr><td className="data-table__empty" colSpan={columnCount}>Loading data…</td></tr>
            )}
            {!loading && data.length === 0 && (
              <tr><td className="data-table__empty" colSpan={columnCount}>{emptyState}</td></tr>
            )}
            {!loading && data.map((row) => {
              const rowId = getRowId(row);
              const expanded = expandedIds.has(rowId);
              const selectable = isRowSelectable(row);
              return (
                <TableRow
                  key={rowId}
                  row={row}
                  rowId={rowId}
                  columns={columns}
                  selectable={selectable}
                  selected={selectedIds.has(rowId)}
                  expanded={expanded}
                  hasSelection={hasSelection}
                  hasExpansion={hasExpansion}
                  columnCount={columnCount}
                  onToggleRow={() => toggleRow(row)}
                  onToggleExpanded={() => toggleExpanded(row)}
                  expandedContent={renderExpandedRow?.(row)}
                  controlsId={`${generatedId}-${rowId}-details`}
                />
              );
            })}
          </tbody>
        </table>
      </div>
      {scrollMetrics.visible && (
        <div ref={scrollTrackRef} className="data-table__scrollbar" aria-hidden="true" onPointerDown={startScrollDrag} onPointerMove={(event) => { if (event.currentTarget.hasPointerCapture(event.pointerId)) moveScrollFromPointer(event.clientX); }}>
          <span style={{ inlineSize: scrollMetrics.thumbWidth, transform: `translateX(${scrollMetrics.thumbOffset}px)` }} />
        </div>
      )}
    </div>
  );
}

interface TableRowProps<Row> {
  row: Row;
  rowId: string;
  columns: DataTableColumn<Row>[];
  selectable: boolean;
  selected: boolean;
  expanded: boolean;
  hasSelection: boolean;
  hasExpansion: boolean;
  columnCount: number;
  controlsId: string;
  expandedContent?: ReactNode;
  onToggleRow: () => void;
  onToggleExpanded: () => void;
}

function TableRow<Row>({
  row, rowId, columns, selectable, selected, expanded, hasSelection, hasExpansion,
  columnCount, controlsId, expandedContent, onToggleRow, onToggleExpanded,
}: TableRowProps<Row>) {
  return (
    <>
      <tr className={[selected && 'data-table__row--selected'].filter(Boolean).join(' ')}>
        {hasExpansion && (
          <td className="data-table__expand-cell">
            <button className="data-table__expand-button" type="button" aria-label={expanded ? `Collapse row ${rowId}` : `Expand row ${rowId}`} aria-expanded={expanded} aria-controls={expanded ? controlsId : undefined} onClick={(event) => { event.stopPropagation(); onToggleExpanded(); }}>
              <img src={chevronDown} alt="" aria-hidden="true" />
            </button>
          </td>
        )}
        {hasSelection && (
          <td className="data-table__selection-cell" onClick={(event) => event.stopPropagation()}>
            <Checkbox aria-label={`Select row ${rowId}`} checked={selected} disabled={!selectable} onChange={onToggleRow} />
          </td>
        )}
        {columns.map((column) => <td className={`data-table__cell data-table__cell--${column.align ?? 'start'}`} key={column.key}>{column.cell(row)}</td>)}
      </tr>
      {hasExpansion && expanded && (
        <tr className="data-table__expanded-row" id={controlsId}>
          <td colSpan={columnCount}>{expandedContent}</td>
        </tr>
      )}
    </>
  );
}
