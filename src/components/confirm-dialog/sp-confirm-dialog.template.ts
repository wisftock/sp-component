import { html, nothing, type TemplateResult } from "lit";
import type { SpConfirmDialogComponent } from "./sp-confirm-dialog.js";

/**
 * HTML template for sp-confirm-dialog.
 * Call as: confirmDialogTemplate.call(this) inside render()
 */
export function confirmDialogTemplate(this: SpConfirmDialogComponent): TemplateResult {
  return html`
    <dialog
      class="sp-confirm-dialog"
      @click=${this._handleBackdropClick}
      @cancel=${this._handleNativeCancel}
    >
      <div class="sp-confirm-dialog-panel">
        <h2 class="sp-confirm-dialog-title">${this.title}</h2>
        <p class="sp-confirm-dialog-message">${this.message}</p>
        <div class="sp-confirm-dialog-actions">
          ${!this.hideCancel
            ? html`<button class="sp-confirm-cancel" type="button" @click=${this._cancel}>
                ${this.cancelLabel}
              </button>`
            : nothing}
          <button
            class="sp-confirm-ok sp-confirm-ok--${this.variant}"
            type="button"
            @click=${this._confirm}
          >
            ${this.confirmLabel}
          </button>
        </div>
      </div>
    </dialog>
  `;
}
