import { html, nothing, type TemplateResult } from "lit";
import type { SpContextMenuComponent } from "./sp-context-menu.js";

/**
 * HTML template for sp-context-menu.
 * Call as: contextMenuTemplate.call(this) inside render()
 */
export function contextMenuTemplate(this: SpContextMenuComponent): TemplateResult {
  return html`
    <div
      class="sp-context-menu-trigger"
      @contextmenu=${this._handleContextMenu}
      @click=${this._handleClick}
    >
      <slot></slot>
    </div>

    ${this._open
      ? html`
          <div
            class="sp-context-menu-panel"
            role="menu"
            aria-label="Context menu"
            style="left: ${this._x}px; top: ${this._y}px"
            @click=${this._handleMenuItemClick}
          >
            <slot name="menu"></slot>
          </div>
        `
      : nothing}
  `;
}
