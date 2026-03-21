import { html, nothing, type TemplateResult } from "lit";
import type { SpAccordionItemComponent } from "./sp-accordion-item.js";

export function accordionItemTemplate(this: SpAccordionItemComponent): TemplateResult {
  return html`
    <div class="sp-accordion-item">
      <button
        class="sp-accordion-trigger"
        type="button"
        ?disabled=${this.disabled}
        aria-expanded=${this.open}
        @click=${this._handleClick}
      >
        <span class="sp-accordion-label"><slot name="label">${this.label}</slot></span>
        <span class="sp-accordion-icon" aria-hidden="true">${this.open ? "▲" : "▼"}</span>
      </button>
      <div class="sp-accordion-content" ?hidden=${!this.open} role="region">
        <div class="sp-accordion-body"><slot></slot></div>
      </div>
    </div>
  `;
}
