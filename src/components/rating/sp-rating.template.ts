import { html, type TemplateResult } from "lit";
import { classMap } from "lit/directives/class-map.js";
import type { SpRatingComponent } from "./sp-rating.js";

export function ratingTemplate(this: SpRatingComponent): TemplateResult {
  return html`
    <div class="sp-rating" role="radiogroup" aria-label=${this.label} @mouseleave=${this._handleLeave}>
      ${this._getStars().map(({ index, fill }) => html`
        <button
          class=${classMap({ "sp-rating-star": true, "sp-rating-star--active": fill > 0 })}
          type="button"
          ?disabled=${this.disabled}
          aria-label=${"Rate " + index + " out of " + this.max}
          @click=${() => this._handleClick(index)}
          @mouseenter=${() => this._handleHover(index)}
        >
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            ${fill >= 1
              ? html`<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="currentColor"/>`
              : fill > 0
                ? html`<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77V2z" fill="currentColor"/><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="none" stroke="currentColor" stroke-width="1.5"/>`
                : html`<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="none" stroke="currentColor" stroke-width="1.5"/>`
            }
          </svg>
        </button>
      `)}
    </div>
  `;
}
