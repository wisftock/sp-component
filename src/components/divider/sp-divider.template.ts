import { html, nothing, type TemplateResult } from "lit";
import type { SpDividerComponent } from "./sp-divider.js";

/**
 * HTML template for sp-divider.
 *
 * Call as: dividerTemplate.call(this) inside render()
 */
export function dividerTemplate(this: SpDividerComponent): TemplateResult {
  return html`
    <div class="sp-divider" role="separator" aria-orientation=${this.orientation} style=${this._getDividerStyle()}>
      <span class="sp-divider-line"></span>
      ${this.label
        ? html`<span class="sp-divider-label">${this.label}</span><span class="sp-divider-line"></span>`
        : nothing}
    </div>
  `;
}
