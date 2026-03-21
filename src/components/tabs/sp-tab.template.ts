import { html, type TemplateResult } from "lit";
import { classMap } from "lit/directives/class-map.js";
import type { SpTabComponent } from "./sp-tab.js";

export function tabTemplate(this: SpTabComponent): TemplateResult {
  return html`
    <button
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
      <slot></slot>
    </button>
  `;
}
