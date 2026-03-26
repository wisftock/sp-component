import { html, nothing, type TemplateResult } from "lit";
import { classMap } from "lit/directives/class-map.js";
import type { SpCardComponent } from "./sp-card.js";

/**
 * HTML template for sp-card.
 *
 * Call as: cardTemplate.call(this) inside render()
 */
export function cardTemplate(this: SpCardComponent): TemplateResult {
  const skeleton = html`
    <div class="sp-card-skeleton" aria-hidden="true">
      <div class="sp-card-skeleton-line sp-card-skeleton-title"></div>
      <div class="sp-card-skeleton-body">
        <div class="sp-card-skeleton-line" style="width:100%"></div>
        <div class="sp-card-skeleton-line" style="width:80%"></div>
        <div class="sp-card-skeleton-line" style="width:60%"></div>
      </div>
      <div class="sp-card-skeleton-line sp-card-skeleton-footer" style="width:40%;margin-top:16px;"></div>
    </div>
  `;

  const inner = this.loading
    ? skeleton
    : html`
      <slot name="image"></slot>
      <slot name="header"></slot>
      <slot></slot>
      <slot name="footer"></slot>
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
