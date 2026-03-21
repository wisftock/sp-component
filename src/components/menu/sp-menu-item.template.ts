import { html, nothing, type TemplateResult } from "lit";
import { classMap } from "lit/directives/class-map.js";
import type { SpMenuItemComponent } from "./sp-menu-item.js";

export function menuItemTemplate(this: SpMenuItemComponent): TemplateResult {
  return html`
    <div
      class=${classMap({
        "sp-menu-item": true,
        "sp-menu-item--danger": this.danger,
        "sp-menu-item--disabled": this.disabled,
      })}
      role="menuitem"
      tabindex=${this.disabled ? nothing : "-1"}
      @click=${this._handleClick}
      @keydown=${this._handleKeydown}
    >
      <slot name="prefix"></slot>
      <span class="sp-menu-item-label"><slot></slot></span>
      <slot name="suffix"></slot>
    </div>
  `;
}
