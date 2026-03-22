import { html, nothing, type TemplateResult } from "lit";
import type { SpSplitPanelComponent } from "./sp-split-panel.js";

export function splitPanelTemplate(
  this: SpSplitPanelComponent,
): TemplateResult {
  // On mobile (< 480px) auto-switch to vertical orientation
  const effectiveOrientation = this._isMobile ? "vertical" : this.orientation;

  return html`
    <div
      class="sp-split-panel sp-split-panel--${effectiveOrientation} ${this._dragging ? "sp-split-panel--dragging" : ""}"
      style="--position: ${this._currentPosition}%"
    >
      <div class="sp-split-panel-start">
        <slot name="start"></slot>
      </div>
      <div
        class="sp-split-panel-divider"
        role="separator"
        aria-label="Resize handle"
        aria-valuenow=${this._currentPosition}
        aria-valuemin=${this.min}
        aria-valuemax=${this.max}
        aria-orientation=${effectiveOrientation}
        tabindex=${this.disabled ? "-1" : "0"}
        @mousedown=${this._startDrag}
        @dblclick=${this._handleDividerDblClick}
        @touchstart=${this._startTouchDrag}
        @keydown=${this._handleDividerKeydown}
      >
        <slot name="divider">
          <div class="sp-split-panel-handle">
            <svg
              viewBox="0 0 10 14"
              fill="currentColor"
              aria-hidden="true"
            >
              ${effectiveOrientation === "horizontal"
                ? html`
                    <circle cx="3" cy="3" r="1.2"></circle>
                    <circle cx="7" cy="3" r="1.2"></circle>
                    <circle cx="3" cy="7" r="1.2"></circle>
                    <circle cx="7" cy="7" r="1.2"></circle>
                    <circle cx="3" cy="11" r="1.2"></circle>
                    <circle cx="7" cy="11" r="1.2"></circle>
                  `
                : html`
                    <circle cx="2" cy="5" r="1.2"></circle>
                    <circle cx="5" cy="5" r="1.2"></circle>
                    <circle cx="8" cy="5" r="1.2"></circle>
                    <circle cx="2" cy="9" r="1.2"></circle>
                    <circle cx="5" cy="9" r="1.2"></circle>
                    <circle cx="8" cy="9" r="1.2"></circle>
                  `}
            </svg>
          </div>
        </slot>
      </div>
      <div class="sp-split-panel-end">
        <slot name="end"></slot>
      </div>
    </div>
  `;
}
