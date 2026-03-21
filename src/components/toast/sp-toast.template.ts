import { html, nothing, type TemplateResult } from "lit";
import { classMap } from "lit/directives/class-map.js";
import type { SpToastComponent } from "./sp-toast.js";

/**
 * HTML template for sp-toast.
 *
 * Call as: toastTemplate.call(this) inside render()
 */
export function toastTemplate(this: SpToastComponent): TemplateResult {
  return html`
    <div
      class=${classMap({
        "sp-toast": true,
        "sp-toast--open": this.open,
        "sp-toast--hidden": !this.open,
      })}
      role="status"
      aria-live="polite"
    >
      <span class="sp-toast-icon" aria-hidden="true">${this._getIcon()}</span>
      <span class="sp-toast-message">${this.message}<slot></slot></span>
      ${this.closable
        ? html`
            <button
              class="sp-toast-close"
              type="button"
              @click=${this._handleClose}
              aria-label="Close"
            >✕</button>
          `
        : nothing}
    </div>
  `;
}
