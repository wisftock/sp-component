import { html, nothing, type TemplateResult } from "lit";
import { classMap } from "lit/directives/class-map.js";
import type { SpMenuItemComponent } from "./sp-menu-item.js";

export function menuItemTemplate(this: SpMenuItemComponent): TemplateResult {
  if (this.divider) {
    return html`<hr class="sp-menu-item-divider" role="separator" aria-hidden="true" />`;
  }

  const hasChildren = Array.isArray((this as any).slottedChildren) && (this as any).slottedChildren.length > 0;

  return html`
    <div
      class=${classMap({
        "sp-menu-item": true,
        "sp-menu-item--danger": this.danger,
        "sp-menu-item--disabled": this.disabled,
        "sp-menu-item--checked": this.checked,
        "sp-menu-item--has-submenu": this._submenuOpen,
      })}
      role="menuitem"
      tabindex=${this.disabled ? nothing : "-1"}
      @click=${this._handleClick}
      @keydown=${this._handleKeydown}
      @mouseenter=${this._handleMouseEnter}
      @mouseleave=${this._handleMouseLeave}
    >
      ${this.checked
        ? html`<span class="sp-menu-item-check" aria-hidden="true">✓</span>`
        : nothing}
      <slot name="prefix"></slot>
      <span class="sp-menu-item-label"><slot></slot></span>
      <slot name="suffix"></slot>
      <slot name="submenu-trigger"></slot>
    </div>
  `;
}
