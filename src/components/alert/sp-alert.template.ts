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
          <div class="sp-alert" role=${this._getRole()}>
            <span class="sp-alert-icon" aria-hidden="true">
              ${this.variant === "success"
                ? html`<svg viewBox="0 0 20 20" fill="currentColor" width="18" height="18"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/></svg>`
                : this.variant === "warning"
                  ? html`<svg viewBox="0 0 20 20" fill="currentColor" width="18" height="18"><path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/></svg>`
                  : this.variant === "error"
                    ? html`<svg viewBox="0 0 20 20" fill="currentColor" width="18" height="18"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/></svg>`
                    : html`<svg viewBox="0 0 20 20" fill="currentColor" width="18" height="18"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/></svg>`}
            </span>
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
