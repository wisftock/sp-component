import { html, nothing, type TemplateResult } from "lit";
import { classMap } from "lit/directives/class-map.js";
import type { SpPopoverComponent } from "./sp-popover.js";

/**
 * HTML template for sp-popover.
 * Call as: popoverTemplate.call(this) inside render()
 */
export function popoverTemplate(this: SpPopoverComponent): TemplateResult {
  return html`
    <div class="sp-popover-wrapper">
      <div class="sp-popover-trigger" @click=${this._handleTriggerClick}>
        <slot name="trigger"></slot>
      </div>
      <div
        class=${classMap({
          "sp-popover": true,
          "sp-popover--open": this.open,
        })}
        style=${this._getPopoverStyle()}
        role="dialog"
        aria-modal="false"
      >
        ${this.arrow ? html`<div class="sp-popover-arrow"></div>` : nothing}
        <div class="sp-popover-content"><slot></slot></div>
      </div>
    </div>
  `;
}
