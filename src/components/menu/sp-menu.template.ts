import { html, nothing, type TemplateResult } from "lit";
import type { SpMenuComponent } from "./sp-menu.js";

export function menuTemplate(this: SpMenuComponent): TemplateResult {
  return html`
    <div class="sp-menu-wrapper">
      <div
        class="sp-menu-trigger"
        aria-expanded=${this.open ? "true" : "false"}
        aria-haspopup="menu"
        tabindex="0"
        @click=${this._handleTriggerClick}
      >
        <slot name="trigger"></slot>
      </div>
      ${this.open
        ? html`
            <div class="sp-menu-panel" role="menu">
              <slot @click=${this._handleItemClick}></slot>
            </div>
          `
        : nothing}
    </div>
  `;
}
