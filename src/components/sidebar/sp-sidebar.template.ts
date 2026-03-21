import { html, nothing, type TemplateResult } from "lit";
import type { SpSidebarComponent } from "./sp-sidebar.js";

export function sidebarTemplate(this: SpSidebarComponent): TemplateResult {
  return html`
    <aside class="sp-sidebar" style=${this._getSidebarStyle()}>
      ${this.collapsible
        ? html`
            <button
              class="sp-sidebar-toggle"
              type="button"
              @click=${this._handleCollapse}
              aria-label=${this.collapsed ? "Expand" : "Collapse"}
            >
              ${this.collapsed ? "›" : "‹"}
            </button>
          `
        : nothing}
      <div class="sp-sidebar-content">
        <slot name="header"></slot>
        <slot></slot>
        <slot name="footer"></slot>
      </div>
    </aside>
  `;
}
