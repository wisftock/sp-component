import { html, nothing, type TemplateResult } from "lit";
import { SpConfig } from "../../config.js";
import type { SpModalComponent } from "./sp-modal.js";

/**
 * HTML template for sp-modal.
 * Call as: modalTemplate.call(this) inside render()
 */
export function modalTemplate(this: SpModalComponent): TemplateResult {
  return html`
    <dialog
      aria-label=${this.label || nothing}
      aria-modal="true"
      @click=${this._handleOverlayClick}
    >
      <div class="sp-modal-panel">
        ${this.closable
          ? html`<button
              class="sp-modal-close"
              type="button"
              aria-label=${SpConfig.locale.modal.closeLabel}
              @click=${this._handleClose}
            >✕</button>`
          : nothing}
        <slot name="header"></slot>
        <div class="sp-modal-body"><slot></slot></div>
        <slot name="footer"></slot>
      </div>
    </dialog>
  `;
}
