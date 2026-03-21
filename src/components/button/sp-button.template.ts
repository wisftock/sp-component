import { html, type TemplateResult } from "lit";
import type { SpButtonComponent } from "./sp-button.js";

/**
 * HTML template for sp-button.
 * Separated from the component class to keep structure, styles and logic in distinct files.
 *
 * Call as: buttonTemplate.call(this) inside render()
 */
export function buttonTemplate(this: SpButtonComponent): TemplateResult {
  return html`
    <button
      part="button"
      type=${this.type}
      ?disabled=${this.disabled}
      aria-label=${this.label || undefined}
    >
      <slot></slot>
    </button>
  `;
}
