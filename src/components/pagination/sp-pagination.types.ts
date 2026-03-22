export interface SpPaginationProps {
  page: number;
  total: number;
  pageSize: number;
  pageSizeOptions: number[];
  siblingCount: number;
  disabled: boolean;
  showJumpTo: boolean;
}
