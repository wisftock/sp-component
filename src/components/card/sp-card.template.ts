import { html, nothing, type TemplateResult } from "lit";
import { classMap } from "lit/directives/class-map.js";
import type { SpCardComponent } from "./sp-card.js";

/**
 * HTML template for sp-card.
 *
 * Call as: cardTemplate.call(this) inside render()
 */
export function cardTemplate(this: SpCardComponent): TemplateResult {
  const inner = html`
    <slot name="image"></slot>
    <slot name="header"></slot>
    <slot></slot>
    <slot name="footer"></slot>
    ${this.loading ? html`<div class="sp-card-loading-overlay" aria-hidden="true"></div>` : nothing}
  `;

  return html`
    <div
      class=${classMap({
        "sp-card": true,
        "sp-card--clickable": this.clickable,
        "sp-card--loading": this.loading,
      })}
      style="padding: ${this.padding}"
      role=${this.clickable && !this.href ? "button" : nothing}
      tabindex=${this.clickable && !this.href ? "0" : nothing}
      @click=${this.clickable ? this._handleClick : nothing}
      @keydown=${this.clickable ? this._handleKeydown : nothing}
    >
      ${this.href
        ? html`<a class="sp-card-link" href=${this.href}>${inner}</a>`
        : inner}
    </div>
  `;
}
