import { html, nothing, type TemplateResult } from "lit";
import { classMap } from "lit/directives/class-map.js";
import { SpConfig } from "../../config.js";
import type { SpTabComponent } from "./sp-tab.js";

export function tabTemplate(this: SpTabComponent): TemplateResult {
  return html`
    <button
      part="button"
      class=${classMap({
        "sp-tab-button": true,
        "sp-tab-button--active": this.active,
      })}
      role="tab"
      ?disabled=${this.disabled}
      aria-selected=${this.active ? "true" : "false"}
      aria-controls="panel-${this.panel}"
      tabindex=${this.active ? "0" : "-1"}
      @click=${this._handleClick}
    >
      ${this.icon ? html`<span class="sp-tab-icon">${this.icon}</span>` : nothing}
      <slot></slot>
      ${this.badge !== undefined && this.badge !== null && this.badge !== ""
        ? html`<span class="sp-tab-badge">${this.badge}</span>`
        : nothing}
      ${this.closable
        ? html`<span
            class="sp-tab-close"
            role="button"
            tabindex="0"
            aria-label=${SpConfig.locale.tabs.closeTabLabel}
            @click=${this._handleClose}
            @keydown=${(e: KeyboardEvent) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                this._handleClose(e);
              }
            }}
          >×</span>`
        : nothing}
    </button>
  `;
}
