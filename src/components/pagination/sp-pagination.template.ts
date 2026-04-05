import { html, nothing, type TemplateResult } from "lit";
import { classMap } from "lit/directives/class-map.js";
import { SpConfig } from "../../config.js";
import type { SpPaginationComponent } from "./sp-pagination.js";

export function paginationTemplate(this: SpPaginationComponent): TemplateResult {
  const showLabel = this.total > 0;
  const startItem = this.total === 0 ? 0 : (this.page - 1) * this.pageSize + 1;
  const endItem = Math.min(this.page * this.pageSize, this.total);

  return html`
    <div class="sp-pagination-wrapper">
      ${this.pageSizeOptions && this.pageSizeOptions.length > 0
        ? html`<div class="sp-pagination-size">
            <label class="sp-pagination-size-label">Rows per page:</label>
            <select
              class="sp-pagination-size-select"
              .value=${String(this.pageSize)}
              ?disabled=${this.disabled}
              @change=${(e: Event) => this._handlePageSizeChange(e)}
            >
              ${this.pageSizeOptions.map(
                (opt) => html`<option value=${opt} ?selected=${opt === this.pageSize}>${opt}</option>`
              )}
            </select>
          </div>`
        : nothing}
      ${showLabel
        ? html`<span class="sp-pagination-label">${startItem}–${endItem} of ${this.total}</span>`
        : nothing}
      <nav class="sp-pagination" aria-label=${SpConfig.locale.pagination.paginationLabel}>
        <button
          class="sp-pagination-btn sp-pagination-first"
          ?disabled=${this.disabled || this.page <= 1}
          @click=${() => this._goTo(1)}
          aria-label=${SpConfig.locale.pagination.firstPageLabel}
        >
          «
        </button>
        <button
          class="sp-pagination-btn sp-pagination-prev"
          ?disabled=${this.disabled || this.page <= 1}
          @click=${() => this._goTo(this.page - 1)}
          aria-label=${SpConfig.locale.pagination.prevPageLabel}
        >
          ‹
        </button>
        <span class="sp-pagination-mobile-label">${this.page} / ${this.totalPages}</span>
        <span class="sp-pagination-pages">
          ${this._getPages().map((p, i) =>
            p === "..."
              ? html`<span class="sp-pagination-dots" key=${i}>…</span>`
              : html`
                  <button
                    class=${classMap({
                      "sp-pagination-btn": true,
                      "sp-pagination-btn--active": p === this.page,
                    })}
                    ?disabled=${this.disabled}
                    aria-current=${p === this.page ? "page" : nothing}
                    aria-label=${"Page " + p}
                    @click=${() => this._goTo(p as number)}
                  >
                    ${p}
                  </button>
                `,
          )}
        </span>
        <button
          class="sp-pagination-btn sp-pagination-next"
          ?disabled=${this.disabled || this.page >= this.totalPages}
          @click=${() => this._goTo(this.page + 1)}
          aria-label=${SpConfig.locale.pagination.nextPageLabel}
        >
          ›
        </button>
        <button
          class="sp-pagination-btn sp-pagination-last"
          ?disabled=${this.disabled || this.page >= this.totalPages}
          @click=${() => this._goTo(this.totalPages)}
          aria-label=${SpConfig.locale.pagination.lastPageLabel}
        >
          »
        </button>
      </nav>
      ${this.showJumpTo
        ? html`<form class="sp-pagination-jump" @submit=${(e: Event) => this._handleJumpSubmit(e)}>
            <label class="sp-pagination-jump-label">Go to page</label>
            <input
              class="sp-pagination-jump-input"
              type="number"
              min="1"
              max=${this.totalPages}
              .value=${this._jumpValue}
              ?disabled=${this.disabled}
              @input=${(e: Event) => this._handleJumpInput(e)}
            />
            <button
              class="sp-pagination-jump-btn"
              type="submit"
              ?disabled=${this.disabled}
            >Go</button>
          </form>`
        : nothing}
    </div>
  `;
}
