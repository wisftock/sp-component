import { html, type TemplateResult } from "lit";
import { classMap } from "lit/directives/class-map.js";
import type { SpTooltipComponent } from "./sp-tooltip.js";

/**
 * HTML template for sp-tooltip.
 * Call as: tooltipTemplate.call(this) inside render()
 */
export function tooltipTemplate(this: SpTooltipComponent): TemplateResult {
  return html`
    <div
      class="sp-tooltip-wrapper"
      @mouseenter=${this._handleMouseEnter}
      @mouseleave=${this._handleMouseLeave}
      @focusin=${this._handleFocusIn}
      @focusout=${this._handleFocusOut}
      @click=${this._handleClick}
    >
      <slot></slot>
      <div
        class=${classMap({
          "sp-tooltip": true,
          "sp-tooltip--visible": this.open && !this.disabled,
        })}
        role="tooltip"
        style=${this._getTooltipStyle()}
      >
        ${this.content}
      </div>
    </div>
  `;
}
