import { LitElement, unsafeCSS } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import styles from "./sp-pagination.css?inline";
import { paginationTemplate } from "./sp-pagination.template.js";

/**
 * Pagination component for navigating through pages of content.
 *
 * @element sp-pagination
 *
 * @prop {number}   page            - Current page number (1-based)
 * @prop {number}   total           - Total number of items
 * @prop {number}   pageSize        - Number of items per page
 * @prop {number[]} pageSizeOptions - Renders a page-size select when set
 * @prop {number}   siblingCount    - Number of page buttons shown on each side of current
 * @prop {boolean}  disabled        - Disables all pagination controls
 * @prop {boolean}  showJumpTo      - Show "Go to page" input field
 *
 * @fires {CustomEvent<{ page: number }>}     sp-change           - Emitted when the page changes
 * @fires {CustomEvent<{ pageSize: number }>} sp-page-size-change - Emitted when page size changes
 */
@customElement("sp-pagination")
export class SpPaginationComponent extends LitElement {
  static override styles = unsafeCSS(styles);

  @property({ type: Number, reflect: true })
  page = 1;

  @property({ type: Number })
  total = 0;

  @property({ type: Number })
  pageSize = 10;

  @property({ type: Array })
  pageSizeOptions: number[] = [];

  @property({ type: Number })
  siblingCount = 1;

  @property({ type: Boolean, reflect: true })
  disabled = false;

  @property({ type: Boolean })
  showJumpTo = false;

  @state()
  private _jumpValue = "";

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.total / this.pageSize));
  }

  _getPages(): Array<number | "..."> {
    const total = this.totalPages;
    const current = this.page;
    const siblings = this.siblingCount;

    if (total <= 5 + siblings * 2) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }

    const leftSibling = Math.max(2, current - siblings);
    const rightSibling = Math.min(total - 1, current + siblings);
    const showLeftDots = leftSibling > 2;
    const showRightDots = rightSibling < total - 1;

    const pages: Array<number | "..."> = [1];
    if (showLeftDots) pages.push("...");
    for (let i = leftSibling; i <= rightSibling; i++) pages.push(i);
    if (showRightDots) pages.push("...");
    pages.push(total);
    return pages;
  }

  _goTo(page: number) {
    if (page < 1 || page > this.totalPages || this.disabled) return;
    this.page = page;
    this.dispatchEvent(
      new CustomEvent("sp-change", {
        detail: { page: this.page },
        bubbles: true,
        composed: true,
      }),
    );
  }

  _handlePageSizeChange(e: Event) {
    const select = e.target as HTMLSelectElement;
    const newSize = Number(select.value);
    if (isNaN(newSize) || newSize <= 0) return;
    this.pageSize = newSize;
    this.page = 1;
    this.dispatchEvent(
      new CustomEvent("sp-page-size-change", {
        detail: { pageSize: newSize },
        bubbles: true,
        composed: true,
      }),
    );
  }

  _handleJumpInput(e: Event) {
    this._jumpValue = (e.target as HTMLInputElement).value;
  }

  _handleJumpSubmit(e: Event) {
    e.preventDefault();
    const num = parseInt(this._jumpValue, 10);
    if (!isNaN(num)) {
      this._goTo(num);
      this._jumpValue = "";
    }
  }

  override render() {
    return paginationTemplate.call(this);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "sp-pagination": SpPaginationComponent;
  }
}
