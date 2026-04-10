export type SpTableSortDirection = "asc" | "desc" | "none";

export interface SpTableColumn {
  key: string;
  label: string;
  sortable?: boolean;
  filterable?: boolean;
  hidden?: boolean;
  width?: string;
  align?: "left" | "center" | "right";
  /** Allow inline double-click editing on this column's cells */
  editable?: boolean;
  /** Custom cell renderer — receives the cell value and full row */
  render?: (value: unknown, row: Record<string, unknown>) => string;
}

export interface SpTableAction {
  label: string;
  icon?: string;
  variant?: "primary" | "secondary" | "ghost" | "destructive";
  /** Called with the row data and row index */
  onClick: (row: Record<string, unknown>, index: number) => void;
}

export interface SpTableProps {
  columns: SpTableColumn[];
  data: Record<string, unknown>[];
  loading: boolean;
  bordered: boolean;
  striped: boolean;
  hoverable: boolean;
  compact: boolean;
  emptyText: string;
  sortKey: string;
  sortDirection: SpTableSortDirection;
  stickyHeader: boolean;
  selectable: boolean;
  caption: string;
  reorderable: boolean;
  searchable: boolean;
  pageSize: number;
  pageSizeOptions: number[];
  actions: SpTableAction[];
  /** Enables virtual scrolling (replaces pagination) */
  virtual: boolean;
  /** Row height in px for virtual scroll calculations */
  rowHeight: number;
  /** Container height for virtual scroll */
  maxHeight: string;
  /** Title shown in the toolbar */
  title: string;
  /** Show a CSV export button in the toolbar */
  exportable: boolean;
}
