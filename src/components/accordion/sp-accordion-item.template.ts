import { html, type TemplateResult } from "lit";
import type { SpAccordionItemComponent } from "./sp-accordion-item.js";

export function accordionItemTemplate(this: SpAccordionItemComponent): TemplateResult {
  return html`
    <div class="sp-accordion-item">
      <button
        class="sp-accordion-trigger"
        type="button"
        id="acc-trigger-${this._id}"
        ?disabled=${this.disabled}
        aria-expanded=${this.open ? "true" : "false"}
        aria-controls="acc-content-${this._id}"
        @click=${this._handleClick}
      >
        <span class="sp-accordion-label"><slot name="label">${this.label}</slot></span>
        <span class="sp-accordion-icon" aria-hidden="true">${this.open ? "▲" : "▼"}</span>
      </button>
      <div
        class="sp-accordion-content"
        id="acc-content-${this._id}"
        role="region"
        aria-labelledby="acc-trigger-${this._id}"
        aria-hidden=${this.open ? "false" : "true"}
      >
        <div class="sp-accordion-body"><slot></slot></div>
      </div>
    </div>
  `;
}
