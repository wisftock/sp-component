import { html, nothing, type TemplateResult } from "lit";
import type { SpTagComponent } from "./sp-tag.js";

/**
 * HTML template for sp-tag.
 *
 * Call as: tagTemplate.call(this) inside render()
 */
export function tagTemplate(this: SpTagComponent): TemplateResult {
  return html`
    <span class="sp-tag">
      <slot></slot>
      ${this.removable && !this.disabled
        ? html`
            <button class="sp-tag-remove" type="button" aria-label="Remove" @click=${this._handleRemove}>
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <path d="M1 1l8 8M9 1L1 9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
              </svg>
            </button>
          `
        : nothing}
    </span>
  `;
}
