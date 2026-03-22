import { LitElement, unsafeCSS } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import styles from "./sp-table.css?inline";
import { tableTemplate } from "./sp-table.template.js";
import type { SpTableColumn, SpTableSortDirection } from "./sp-table.types.js";

/**
 * Data table component with column definitions and row data array.
 *
 * @element sp-table
 *
 * @prop {SpTableColumn[]}              columns       - Column definitions
 * @prop {Record<string, unknown>[]}    data          - Row data
 * @prop {boolean}                      loading       - Shows loading state
 * @prop {boolean}                      bordered      - Adds borders to cells
 * @prop {boolean}                      striped       - Alternates row background
 * @prop {boolean}                      hoverable     - Highlights rows on hover
 * @prop {boolean}                      compact       - Reduces cell padding
 * @prop {string}                       emptyText     - Text shown when no data
 * @prop {string}                       sortKey       - Currently sorted column key
 * @prop {SpTableSortDirection}         sortDirection - Current sort direction
 * @prop {boolean}                      stickyHeader  - Makes the header sticky
 * @prop {boolean}                      selectable    - Enables row selection with checkboxes
 * @prop {string}                       caption       - Table caption text
 *
 * @fires {CustomEvent<{ key: string, direction: SpTableSortDirection }>} sp-sort - Emitted when a sortable column header is clicked
 * @fires {CustomEvent<{ indices: number[] }>} sp-selection-change - Emitted when row selection changes
 */
@customElement("sp-table")
export class SpTableComponent extends LitElement {
  static override styles = unsafeCSS(styles);

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

  @state()
  selectedRows: Set<number> = new Set();

  readonly _handleRowSelect = (rowIndex: number, checked: boolean) => {
    const next = new Set(this.selectedRows);
    if (checked) {
      next.add(rowIndex);
    } else {
      next.delete(rowIndex);
    }
    this.selectedRows = next;
    this.dispatchEvent(
      new CustomEvent("sp-selection-change", {
        detail: { indices: Array.from(next) },
        bubbles: true,
        composed: true,
      }),
    );
  };

  readonly _handleSelectAll = (checked: boolean) => {
    const next: Set<number> = checked
      ? new Set(this.data.map((_, i) => i))
      : new Set();
    this.selectedRows = next;
    this.dispatchEvent(
      new CustomEvent("sp-selection-change", {
        detail: { indices: Array.from(next) },
        bubbles: true,
        composed: true,
      }),
    );
  };

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
    this.dispatchEvent(
      new CustomEvent("sp-sort", {
        detail: { key: this.sortKey, direction: this.sortDirection },
        bubbles: true,
        composed: true,
      }),
    );
  };

  override render() {
    return tableTemplate.call(this);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "sp-table": SpTableComponent;
  }
}
