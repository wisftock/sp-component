export type SpTableSortDirection = "asc" | "desc" | "none";

export interface SpTableColumn {
  key: string;
  label: string;
  sortable?: boolean;
  width?: string;
  align?: "left" | "center" | "right";
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
}
