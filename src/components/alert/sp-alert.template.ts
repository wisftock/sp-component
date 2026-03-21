import { html, nothing, type TemplateResult } from "lit";
import type { SpAlertComponent } from "./sp-alert.js";

/**
 * HTML template for sp-alert.
 *
 * Call as: alertTemplate.call(this) inside render()
 */
export function alertTemplate(this: SpAlertComponent): TemplateResult {
  return html`
    ${this.open
      ? html`
          <div class="sp-alert" role="alert">
            <span class="sp-alert-icon" aria-hidden="true">${this._getIcon()}</span>
            <div class="sp-alert-body">
              ${this.title
                ? html`<strong class="sp-alert-title">${this.title}</strong>`
                : nothing}
              <div class="sp-alert-message"><slot></slot></div>
            </div>
            ${this.dismissible
              ? html`
                  <button
                    class="sp-alert-close"
                    type="button"
                    aria-label="Close"
                    @click=${this._handleClose}
                  >✕</button>
                `
              : nothing}
          </div>
        `
      : nothing}
  `;
}
