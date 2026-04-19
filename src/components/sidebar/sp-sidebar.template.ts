import { html, nothing, type TemplateResult } from "lit";
import type { SpSidebarComponent } from "./sp-sidebar.js";

export function sidebarTemplate(this: SpSidebarComponent): TemplateResult {
  return html`
    <nav class="sp-sidebar" style=${this._getSidebarStyle()} aria-label=${this.navLabel}>
      <div class="sp-sidebar-content">
        <slot name="header"></slot>
        <slot></slot>
        <slot name="footer"></slot>
      </div>
    </nav>

    ${this.collapsible
      ? html`
          <button
            class="sp-sidebar-toggle"
            type="button"
            @click=${this._handleCollapse}
            aria-label=${this.collapsed ? "Expand sidebar" : "Collapse sidebar"}
            aria-expanded=${!this.collapsed ? "true" : "false"}
          >
            ${this.collapsed ? "›" : "‹"}
          </button>
        `
      : nothing}
  `;
}
