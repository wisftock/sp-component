import { LitElement, unsafeCSS } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import styles from "./sp-table.css?inline";
import { tableTemplate } from "./sp-table.template.js";
import type { SpTableAction, SpTableColumn, SpTableSortDirection } from "./sp-table.types.js";

/**
 * Data table component with sorting, filtering, column reordering,
 * column visibility, pagination, and row actions.
 *
 * @element sp-table
 *
 * @prop {SpTableColumn[]}              columns          - Column definitions
 * @prop {Record<string, unknown>[]}    data             - Row data
 * @prop {boolean}                      loading          - Shows loading state
 * @prop {boolean}                      bordered         - Adds borders to cells
 * @prop {boolean}                      striped          - Alternates row background
 * @prop {boolean}                      hoverable        - Highlights rows on hover
 * @prop {boolean}                      compact          - Reduces cell padding
 * @prop {string}                       emptyText        - Text shown when no data
 * @prop {string}                       sortKey          - Currently sorted column key
 * @prop {SpTableSortDirection}         sortDirection    - Current sort direction
 * @prop {boolean}                      stickyHeader     - Makes the header sticky
 * @prop {boolean}                      selectable       - Enables row selection with checkboxes
 * @prop {string}                       caption          - Table caption text
 * @prop {boolean}                      reorderable      - Allows drag-and-drop column reordering
 * @prop {boolean}                      searchable       - Shows a global search toolbar
 * @prop {number}                       pageSize         - Rows per page (0 = no pagination)
 * @prop {number[]}                     pageSizeOptions  - Page size options for the selector
 * @prop {SpTableAction[]}              actions          - Per-row action buttons
 * @prop {boolean}                      virtual          - Enables virtual scrolling (replaces pagination)
 * @prop {number}                       rowHeight        - Row height in px for virtual scroll calculations
 * @prop {string}                       maxHeight        - Container height for virtual scroll
 *
 * @fires {CustomEvent<{ key, direction }>}  sp-sort             - Sort column clicked
 * @fires {CustomEvent<{ indices }>}         sp-selection-change - Row selection changed
 * @fires {CustomEvent<{ order }>}           sp-column-reorder   - Columns were reordered
 * @fires {CustomEvent<{ row, index }>}      sp-row-action       - Row action clicked
 * @fires {CustomEvent<{ pageSize }>}        sp-page-size-change - Fires when page size selector changes
 */
@customElement("sp-table")
export class SpTableComponent extends LitElement {
  static override styles = unsafeCSS(styles);

  // ── Public props ──────────────────────────────────────────
  @property({ type: Array })
  columns: SpTableColumn[] = [];

  @property({ type: Array })
  data: Record<string, unknown>[] = [];

  @property({ type: Boolean, reflect: true })
  loading = false;

  @property({ type: Boolean, reflect: true })
  bordered = false;

  @property({ type: Boolean, reflect: true })
  striped = false;

  @property({ type: Boolean, reflect: true })
  hoverable = true;

  @property({ type: Boolean, reflect: true })
  compact = false;

  @property({ type: String })
  emptyText = "No data available";

  @property({ type: String })
  sortKey = "";

  @property({ type: String })
  sortDirection: SpTableSortDirection = "none";

  @property({ type: Boolean, reflect: true, attribute: "sticky-header" })
  stickyHeader = false;

  @property({ type: Boolean, reflect: true })
  selectable = false;

  @property({ type: String })
  caption = "";

  @property({ type: Boolean, reflect: true })
  reorderable = false;

  @property({ type: Boolean, reflect: true })
  searchable = false;

  @property({ type: Number, attribute: "page-size" })
  pageSize = 0;

  @property({ type: Array, attribute: "page-size-options" })
  pageSizeOptions: number[] = [10, 25, 50, 100];

  @property({ type: Array })
  actions: SpTableAction[] = [];

  @property({ type: Boolean, reflect: true })
  virtual = false;

  @property({ type: Number, attribute: "row-height" })
  rowHeight = 48;

  @property({ type: String, attribute: "max-height" })
  maxHeight = "400px";

  @property({ type: String })
  title = "";

  @property({ type: Boolean, reflect: true })
  exportable = false;

  // ── Internal state ────────────────────────────────────────
  @state() selectedRows: Set<number> = new Set();
  @state() _columnOrder: string[] = [];
  @state() _hiddenCols: Set<string> = new Set();
  @state() _filters: Record<string, string> = {};
  @state() _globalSearch = "";
  @state() _page = 1;
  @state() _showColPicker = false;
  @state() _dragOverIndex = -1;
  @state() _dragFromIndex = -1;
  @state() _openFilterCol: string | null = null;
  @state() _scrollTop = 0;
  @state() _containerH = 400;
  @state() _editCell: { row: Record<string, unknown>; key: string } | null = null;
  @state() _editValue = "";
  @state() _colWidths: Map<string, number> = new Map();

  private _resizeObs?: ResizeObserver;
  #colResizeState: { key: string; startX: number; startW: number } | null = null;

  // ── Lifecycle ─────────────────────────────────────────────
  override firstUpdated() {
    if (this.virtual) this._setupVirtualScroll();
  }

  override updated(changed: Map<string, unknown>) {
    if (changed.has("columns")) {
      // Initialise order preserving any existing order for keys still present
      const prevOrder = this._columnOrder;
      const keys = this.columns.map((c) => c.key);
      const kept = prevOrder.filter((k) => keys.includes(k));
      const added = keys.filter((k) => !kept.includes(k));
      this._columnOrder = [...kept, ...added];
      // Sync hidden state from column.hidden definitions
      const newHidden = new Set(this._hiddenCols);
      this.columns.forEach((c) => {
        if (c.hidden) newHidden.add(c.key);
      });
      this._hiddenCols = newHidden;
      // Reset page when data/columns change
      this._page = 1;
    }
    if (changed.has("data")) {
      this._page = 1;
      this.selectedRows = new Set();
    }
    if (changed.has("virtual") && this.virtual) {
      this._setupVirtualScroll();
    }
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    this._resizeObs?.disconnect();
    document.removeEventListener("pointermove", this._onColResize);
    document.removeEventListener("pointerup", this._stopColResize);
  }

  private _setupVirtualScroll() {
    const wrapper = this.renderRoot.querySelector(".sp-table-wrapper") as HTMLElement | null;
    if (!wrapper) return;
    this._containerH = wrapper.clientHeight || 400;
    this._resizeObs = new ResizeObserver((entries) => {
      const h = entries[0]?.contentRect.height;
      if (h && h > 0) { this._containerH = h; }
    });
    this._resizeObs.observe(wrapper);
  }

  // ── Derived getters ───────────────────────────────────────
  get _orderedColumns(): SpTableColumn[] {
    if (!this._columnOrder.length) return this.columns;
    const map = new Map(this.columns.map((c) => [c.key, c]));
    return this._columnOrder.map((k) => map.get(k)).filter(Boolean) as SpTableColumn[];
  }

  get _visibleColumns(): SpTableColumn[] {
    return this._orderedColumns.filter((c) => !this._hiddenCols.has(c.key));
  }

  get _filteredData(): Record<string, unknown>[] {
    let result = this.data;

    // Global search
    const q = this._globalSearch.trim().toLowerCase();
    if (q) {
      result = result.filter((row) =>
        Object.values(row).some((v) => String(v ?? "").toLowerCase().includes(q)),
      );
    }

    // Per-column filters
    for (const [key, val] of Object.entries(this._filters)) {
      const fq = val.trim().toLowerCase();
      if (!fq) continue;
      result = result.filter((row) =>
        String(row[key] ?? "").toLowerCase().includes(fq),
      );
    }

    // Sorting
    if (this.sortKey && this.sortDirection !== "none") {
      const dir = this.sortDirection === "asc" ? 1 : -1;
      result = [...result].sort((a, b) => {
        const av = String(a[this.sortKey] ?? "");
        const bv = String(b[this.sortKey] ?? "");
        return av.localeCompare(bv, undefined, { numeric: true, sensitivity: "base" }) * dir;
      });
    }

    return result;
  }

  get _pagedData(): Record<string, unknown>[] {
    if (this.virtual) return this._filteredData;
    if (!this.pageSize) return this._filteredData;
    const start = (this._page - 1) * this.pageSize;
    return this._filteredData.slice(start, start + this.pageSize);
  }

  get _totalPages(): number {
    if (!this.pageSize) return 1;
    return Math.max(1, Math.ceil(this._filteredData.length / this.pageSize));
  }

  get _virtualSlice(): { rows: Record<string, unknown>[]; startIndex: number; topPad: number; bottomPad: number } {
    const data = this._filteredData;
    const total = data.length;
    const rh = this.rowHeight;
    const overscan = 3;
    const startIdx = Math.max(0, Math.floor(this._scrollTop / rh) - overscan);
    const visible = Math.ceil((this._containerH || 400) / rh) + overscan * 2;
    const endIdx = Math.min(total, startIdx + visible);
    return {
      rows: data.slice(startIdx, endIdx),
      startIndex: startIdx,
      topPad: startIdx * rh,
      bottomPad: Math.max(0, (total - endIdx) * rh),
    };
  }

  // ── Scroll handler ────────────────────────────────────────
  readonly _onVirtualScroll = (e: Event) => {
    this._scrollTop = (e.target as HTMLElement).scrollTop;
  };

  // ── Page size change ──────────────────────────────────────
  readonly _handlePageSizeChange = (size: number) => {
    this.pageSize = size;
    this._page = 1;
    this.selectedRows = new Set();
    this._emit("sp-page-size-change", { pageSize: size });
  };

  // ── Selection ─────────────────────────────────────────────
  readonly _handleRowSelect = (rowIndex: number, checked: boolean) => {
    const next = new Set(this.selectedRows);
    checked ? next.add(rowIndex) : next.delete(rowIndex);
    this.selectedRows = next;
    this._emit("sp-selection-change", { indices: Array.from(next) });
  };

  readonly _handleSelectAll = (checked: boolean) => {
    const indices = checked ? this._pagedData.map((_, i) => i) : [];
    this.selectedRows = new Set(indices);
    this._emit("sp-selection-change", { indices });
  };

  // ── Sorting ───────────────────────────────────────────────
  readonly _handleSort = (column: SpTableColumn) => {
    if (!column.sortable) return;
    if (this.sortKey === column.key) {
      this.sortDirection =
        this.sortDirection === "asc" ? "desc" : this.sortDirection === "desc" ? "none" : "asc";
      if (this.sortDirection === "none") this.sortKey = "";
    } else {
      this.sortKey = column.key;
      this.sortDirection = "asc";
    }
    this._page = 1;
    this._emit("sp-sort", { key: this.sortKey, direction: this.sortDirection });
  };

  // ── Drag-and-drop column reorder ──────────────────────────
  readonly _handleDragStart = (e: DragEvent, index: number) => {
    this._dragFromIndex = index;
    if (e.dataTransfer) {
      e.dataTransfer.effectAllowed = "move";
      e.dataTransfer.setData("text/plain", String(index));
    }
  };

  readonly _handleDragOver = (e: DragEvent, index: number) => {
    e.preventDefault();
    if (e.dataTransfer) e.dataTransfer.dropEffect = "move";
    this._dragOverIndex = index;
  };

  readonly _handleDragLeave = () => {
    this._dragOverIndex = -1;
  };

  readonly _handleDrop = (e: DragEvent, toIndex: number) => {
    e.preventDefault();
    this._dragOverIndex = -1;
    if (this._dragFromIndex === -1 || this._dragFromIndex === toIndex) return;
    const newOrder = [...this._columnOrder];
    // Work with visible column indices mapped to full order
    const visible = this._orderedColumns;
    const fromKey = visible[this._dragFromIndex]?.key;
    const toKey = visible[toIndex]?.key;
    if (!fromKey || !toKey) return;
    const fromPos = newOrder.indexOf(fromKey);
    const toPos = newOrder.indexOf(toKey);
    if (fromPos === -1 || toPos === -1) return;
    newOrder.splice(fromPos, 1);
    newOrder.splice(toPos, 0, fromKey);
    this._columnOrder = newOrder;
    this._dragFromIndex = -1;
    this._emit("sp-column-reorder", { order: newOrder });
  };

  readonly _handleDragEnd = () => {
    this._dragFromIndex = -1;
    this._dragOverIndex = -1;
  };

  // ── Filter ────────────────────────────────────────────────
  readonly _toggleFilterCol = (key: string) => {
    this._openFilterCol = this._openFilterCol === key ? null : key;
  };

  readonly _handleFilter = (key: string, value: string) => {
    this._filters = { ...this._filters, [key]: value };
    this._page = 1;
    this.selectedRows = new Set();
  };

  readonly _handleGlobalSearch = (value: string) => {
    this._globalSearch = value;
    this._page = 1;
    this.selectedRows = new Set();
  };

  readonly _clearFilters = () => {
    this._filters = {};
    this._globalSearch = "";
    this._page = 1;
    this.selectedRows = new Set();
  };

  get _hasActiveFilters(): boolean {
    return (
      !!this._globalSearch.trim() ||
      Object.values(this._filters).some((v) => !!v.trim())
    );
  }

  // ── Column visibility ─────────────────────────────────────
  readonly _toggleColumn = (key: string) => {
    const next = new Set(this._hiddenCols);
    next.has(key) ? next.delete(key) : next.add(key);
    this._hiddenCols = next;
  };

  // ── Pagination ────────────────────────────────────────────
  readonly _goToPage = (page: number) => {
    this._page = Math.max(1, Math.min(page, this._totalPages));
    this.selectedRows = new Set();
  };

  // ── Row actions ───────────────────────────────────────────
  readonly _handleAction = (action: SpTableAction, row: Record<string, unknown>, index: number) => {
    action.onClick(row, index);
    this._emit("sp-row-action", { action: action.label, row, index });
  };

  // ── Column resize ─────────────────────────────────────────
  readonly _startColResize = (e: PointerEvent, key: string) => {
    e.preventDefault();
    e.stopPropagation();
    const startW = this._colWidths.get(key) ?? 150;
    this.#colResizeState = { key, startX: e.clientX, startW };
    document.addEventListener("pointermove", this._onColResize);
    document.addEventListener("pointerup", this._stopColResize);
  };

  readonly _onColResize = (e: PointerEvent) => {
    if (!this.#colResizeState) return;
    const diff = e.clientX - this.#colResizeState.startX;
    const newW = Math.max(60, this.#colResizeState.startW + diff);
    this._colWidths = new Map(this._colWidths).set(this.#colResizeState.key, newW);
  };

  readonly _stopColResize = () => {
    this.#colResizeState = null;
    document.removeEventListener("pointermove", this._onColResize);
    document.removeEventListener("pointerup", this._stopColResize);
  };

  // ── Inline editing ─────────────────────────────────────────
  readonly _startEdit = (row: Record<string, unknown>, key: string, value: unknown) => {
    this._editCell = { row, key };
    this._editValue = String(value ?? "");
  };

  readonly _commitEdit = () => {
    if (!this._editCell) return;
    const { row, key } = this._editCell;
    const dataIdx = this.data.indexOf(row);
    if (dataIdx >= 0) {
      const updated = { ...row, [key]: this._editValue };
      this.data = [...this.data.slice(0, dataIdx), updated, ...this.data.slice(dataIdx + 1)];
      this._emit("sp-cell-edit", { row: updated, key, value: this._editValue });
    }
    this._editCell = null;
  };

  // ── CSV export ────────────────────────────────────────────
  exportCSV() {
    const visible = this._visibleColumns;
    const headers = visible.map((c) => c.label).join(",");
    const rowsCSV = this._filteredData.map((r) =>
      visible.map((c) => JSON.stringify(r[c.key] ?? "")).join(","),
    );
    const csv = [headers, ...rowsCSV].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = (this.title || "data") + ".csv";
    a.click();
    URL.revokeObjectURL(a.href);
  }

  // ── Helpers ───────────────────────────────────────────────
  private _emit(event: string, detail: Record<string, unknown>) {
    this.dispatchEvent(new CustomEvent(event, { detail, bubbles: true, composed: true }));
  }

  override render() {
    return tableTemplate.call(this);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "sp-table": SpTableComponent;
  }
}
