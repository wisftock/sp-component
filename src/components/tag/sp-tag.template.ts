import { html, nothing, type TemplateResult } from "lit";
import { SpConfig } from "../../config.js";
import type { SpTagComponent } from "./sp-tag.js";

/**
 * HTML template for sp-tag.
 *
 * Call as: tagTemplate.call(this) inside render()
 */
export function tagTemplate(this: SpTagComponent): TemplateResult {
  return html`
    <span
      class="sp-tag${this.clickable ? " sp-tag--clickable" : ""}"
      role=${this.clickable ? "button" : nothing}
      tabindex=${this.clickable && !this.disabled ? "0" : nothing}
      @click=${this._handleClick}
      @keydown=${(e: KeyboardEvent) => { if (this.clickable && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); this._handleClick(e); }}}
    >
      ${this.icon ? html`<span class="sp-tag-icon" aria-hidden="true">${this.icon}</span>` : nothing}
      <slot></slot>
      ${this.removable && !this.disabled
        ? html`
            <button class="sp-tag-remove" type="button" aria-label=${SpConfig.locale.tag.removeLabel} @click=${this._handleRemove}>
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <path d="M1 1l8 8M9 1L1 9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
              </svg>
            </button>
          `
        : nothing}
    </span>
  `;
}
