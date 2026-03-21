import { html, type TemplateResult } from "lit";
import type { SpSpinnerComponent } from "./sp-spinner.js";

/**
 * HTML template for sp-spinner.
 *
 * Call as: spinnerTemplate.call(this) inside render()
 */
export function spinnerTemplate(this: SpSpinnerComponent): TemplateResult {
  return html`
    <div class="sp-spinner" role="status" aria-label=${this.label}>
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          stroke-width="2.5"
          stroke-linecap="round"
          stroke-dasharray="31.416"
          stroke-dashoffset="10"
        />
      </svg>
      <span class="sp-sr-only">${this.label}</span>
    </div>
  `;
}
