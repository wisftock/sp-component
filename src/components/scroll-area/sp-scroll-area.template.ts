import { html, nothing, type TemplateResult } from "lit";
import type { SpScrollAreaComponent } from "./sp-scroll-area.js";

export function scrollAreaTemplate(
  this: SpScrollAreaComponent,
): TemplateResult {
  const styleStr = [
    this.maxHeight ? `max-height:${this.maxHeight};` : "",
    this.maxWidth ? `max-width:${this.maxWidth};` : "",
  ]
    .filter(Boolean)
    .join("");

  return html`
    <div
      class="sp-scroll-area sp-scroll-area--${this.orientation} ${this._scrolling ? "sp-scroll-area--scrolling" : ""}"
      style=${styleStr || nothing}
    >
      <div class="sp-scroll-area-viewport" @scroll=${this._onScroll}>
        <slot></slot>
      </div>

      ${this.orientation !== "horizontal"
        ? html`
            <div class="sp-scroll-area-scrollbar sp-scroll-area-scrollbar--vertical">
              <div
                class="sp-scroll-area-thumb sp-scroll-area-thumb--vertical"
                style="height: ${this._thumbHeight}%; top: ${this._thumbTop}%"
                @pointerdown=${this._startThumbDrag}
              ></div>
            </div>
          `
        : nothing}
      ${this.orientation !== "vertical"
        ? html`
            <div class="sp-scroll-area-scrollbar sp-scroll-area-scrollbar--horizontal">
              <div
                class="sp-scroll-area-thumb sp-scroll-area-thumb--horizontal"
                style="width: ${this._thumbWidth}%; left: ${this._thumbLeft}%"
                @pointerdown=${this._startThumbDrag}
              ></div>
            </div>
          `
        : nothing}
    </div>
  `;
}
