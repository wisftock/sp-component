import { html, nothing, type TemplateResult } from "lit";
import { classMap } from "lit/directives/class-map.js";
import { SpConfig } from "../../config.js";
import type { SpToastComponent } from "./sp-toast.js";

/**
 * HTML template for sp-toast.
 *
 * Call as: toastTemplate.call(this) inside render()
 */
export function toastTemplate(this: SpToastComponent): TemplateResult {
  const showProgress = this.duration > 0 && this.open;
  return html`
    <div
      class=${classMap({
        "sp-toast": true,
        "sp-toast--open": this.open,
        "sp-toast--hidden": !this.open,
      })}
      role="status"
      aria-live="polite"
      @mouseenter=${this._handleMouseEnter}
      @mouseleave=${this._handleMouseLeave}
    >
      ${showProgress
        ? html`<div
            class="sp-toast-progress"
            style="animation-duration: ${this.duration}ms"
          ></div>`
        : nothing}
      <span class="sp-toast-icon" aria-hidden="true">${this._getIcon()}</span>
      <span class="sp-toast-message">${this.message}<slot></slot></span>
      ${this.action
        ? this.actionHref
          ? html`<a
              class="sp-toast-action"
              href=${this.actionHref}
              @click=${this._handleActionClick}
            >${this.action}</a>`
          : html`<button
              class="sp-toast-action"
              type="button"
              @click=${this._handleActionClick}
            >${this.action}</button>`
        : nothing}
      ${this.closable
        ? html`
            <button
              class="sp-toast-close"
              type="button"
              @click=${this._handleClose}
              aria-label=${SpConfig.locale.toast.closeLabel}
            >✕</button>
          `
        : nothing}
    </div>
  `;
}
