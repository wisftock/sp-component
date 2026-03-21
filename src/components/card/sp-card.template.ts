import { html, type TemplateResult } from "lit";
import type { SpCardComponent } from "./sp-card.js";

/**
 * HTML template for sp-card.
 *
 * Call as: cardTemplate.call(this) inside render()
 */
export function cardTemplate(this: SpCardComponent): TemplateResult {
  return html`
    <div class="sp-card" style="padding: ${this.padding}">
      <slot name="image"></slot>
      <slot name="header"></slot>
      <slot></slot>
      <slot name="footer"></slot>
    </div>
  `;
}
