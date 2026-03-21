import { html, nothing, type TemplateResult } from "lit";
import { classMap } from "lit/directives/class-map.js";
import type { SpProgressBarComponent } from "./sp-progress-bar.js";

/**
 * HTML template for sp-progress-bar.
 *
 * Call as: progressBarTemplate.call(this) inside render()
 */
export function progressBarTemplate(this: SpProgressBarComponent): TemplateResult {
  return html`
    <div class="sp-progress-wrapper">
      ${this.label || this.showValue
        ? html`
            <div class="sp-progress-header">
              ${this.label
                ? html`<span class="sp-progress-label">${this.label}</span>`
                : nothing}
              ${this.showValue && !this.indeterminate
                ? html`<span class="sp-progress-value">${Math.round((this.value / this.max) * 100)}%</span>`
                : nothing}
            </div>
          `
        : nothing}
      <div
        class="sp-progress-track"
        role="progressbar"
        aria-valuenow=${this.indeterminate ? nothing : this.value}
        aria-valuemin="0"
        aria-valuemax=${this.max}
        aria-label=${this.label || nothing}
      >
        <div
          class=${classMap({
            "sp-progress-fill": true,
            "sp-progress-fill--indeterminate": this.indeterminate,
          })}
          style=${this.indeterminate
            ? ""
            : `width: ${Math.min(100, Math.max(0, (this.value / this.max) * 100))}%`}
        ></div>
      </div>
    </div>
  `;
}
