import { html, nothing, type TemplateResult } from "lit";
import { classMap } from "lit/directives/class-map.js";
import type { SpBadgeComponent } from "./sp-badge.js";

/**
 * HTML template for sp-badge.
 *
 * Call as: badgeTemplate.call(this) inside render()
 */
export function badgeTemplate(this: SpBadgeComponent): TemplateResult {
  const displayContent = this._getDisplayContent(this._prevContent);
  return html`
    <span
      class=${classMap({
        "sp-badge": true,
        "sp-badge--animating": this._animating,
      })}
    >
      <span class="sp-badge-content">
        <slot @slotchange=${this._handleSlotChange}>${displayContent !== this._prevContent ? displayContent : nothing}</slot>
      </span>
      ${this.removable
        ? html`<button class="sp-badge-remove" type="button" aria-label="Remove" @click=${this._handleRemove}>
            <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
              <path d="M1 1l6 6M7 1L1 7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
          </button>`
        : nothing}
    </span>
  `;
}
