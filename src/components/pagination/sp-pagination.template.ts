import { html, nothing, type TemplateResult } from "lit";
import { classMap } from "lit/directives/class-map.js";
import type { SpPaginationComponent } from "./sp-pagination.js";

export function paginationTemplate(this: SpPaginationComponent): TemplateResult {
  return html`
    <nav class="sp-pagination" aria-label="Pagination">
      <button
        class="sp-pagination-btn sp-pagination-prev"
        ?disabled=${this.disabled || this.page <= 1}
        @click=${() => this._goTo(this.page - 1)}
        aria-label="Previous page"
      >
        ‹
      </button>
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
      <button
        class="sp-pagination-btn sp-pagination-next"
        ?disabled=${this.disabled || this.page >= this.totalPages}
        @click=${() => this._goTo(this.page + 1)}
        aria-label="Next page"
      >
        ›
      </button>
    </nav>
  `;
}
