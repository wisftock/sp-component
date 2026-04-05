import { html, nothing, type TemplateResult } from "lit";
import { unsafeHTML } from "lit/directives/unsafe-html.js";
import { SpConfig } from "../../config.js";
import type { SpTreeItemComponent } from "./sp-tree-item.js";

export function treeItemTemplate(this: SpTreeItemComponent): TemplateResult {
  return html`
    <div
      class="sp-tree-item
        ${this.selected ? "sp-tree-item--selected" : ""}
        ${this.disabled ? "sp-tree-item--disabled" : ""}
        ${this.expanded ? "sp-tree-item--expanded" : ""}"
    >
      <div
        class="sp-tree-item-row"
        role="treeitem"
        aria-selected=${this.selected}
        aria-expanded=${this._hasChildren ? String(this.expanded) : nothing}
        aria-disabled=${this.disabled}
        aria-level=${this.level}
        tabindex=${this.disabled ? "-1" : "0"}
        @click=${this._handleClick}
        @keydown=${this._handleKeydown}
      >
        ${this._hasChildren
          ? html`
              <span
                class="sp-tree-item-toggle"
                @click=${this._toggleExpand}
              >
                <svg
                  viewBox="0 0 12 12"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="${this.expanded ? "rotated" : ""}"
                  aria-hidden="true"
                >
                  <polyline points="3,2 9,6 3,10"></polyline>
                </svg>
              </span>
            `
          : html`<span class="sp-tree-item-spacer"></span>`}

        ${this.icon
          ? html`<span class="sp-tree-item-icon">${unsafeHTML(this.icon)}</span>`
          : nothing}

        <slot name="icon"></slot>

        <span class="sp-tree-item-label">${this.label}</span>

        ${this.loading
          ? html`<span class="sp-tree-item-spinner" aria-label=${SpConfig.locale.tree.loadingLabel}></span>`
          : nothing}
      </div>

      <div class="sp-tree-item-children" ?hidden=${!this.expanded}>
        <slot @slotchange=${this._onSlotChange}></slot>
      </div>
    </div>
  `;
}
