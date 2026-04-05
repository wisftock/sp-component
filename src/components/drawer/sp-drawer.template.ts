import { html, nothing, type TemplateResult } from "lit";
import { SpConfig } from "../../config.js";
import type { SpDrawerComponent } from "./sp-drawer.js";

/**
 * HTML template for sp-drawer.
 * Call as: drawerTemplate.call(this) inside render()
 */
export function drawerTemplate(this: SpDrawerComponent): TemplateResult {
  return html`
    <dialog
      aria-label=${this.label || nothing}
      aria-modal="true"
      @click=${this._handleOverlayClick}
    >
      <div class="sp-drawer-panel" style=${this._getPanelStyle()}>
        ${this.closable
          ? html`<button
              class="sp-drawer-close"
              type="button"
              aria-label=${SpConfig.locale.drawer.closeLabel}
              @click=${this._handleClose}
            >✕</button>`
          : nothing}
        <slot name="header"></slot>
        <div class="sp-drawer-body"><slot></slot></div>
        <slot name="footer"></slot>
      </div>
    </dialog>
  `;
}
