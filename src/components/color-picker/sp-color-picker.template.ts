import { html, nothing, type TemplateResult } from "lit";
import { classMap } from "lit/directives/class-map.js";
import { SpConfig } from "../../config.js";
import type { SpColorPickerComponent } from "./sp-color-picker.js";

/**
 * HTML template for sp-color-picker.
 * Call as: colorPickerTemplate.call(this) inside render()
 */
export function colorPickerTemplate(this: SpColorPickerComponent): TemplateResult {
  const swatchList = this.swatches
    ? this.swatches
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
    : [];

  return html`
    <div
      class=${classMap({
        "sp-color-picker": true,
        "sp-color-picker--disabled": this.disabled,
        "sp-color-picker--error": !!this.error,
      })}
    >
      ${this.label
        ? html`<label class="sp-color-picker-label">${this.label}</label>`
        : nothing}

      <button
        class="sp-color-picker-trigger"
        type="button"
        ?disabled=${this.disabled}
        aria-expanded=${this._open ? "true" : "false"}
        aria-haspopup="dialog"
        @click=${this._toggle}
      >
        <span
          class="sp-color-picker-trigger-preview"
          style="background: ${this.value}"
        ></span>
        <span class="sp-color-picker-trigger-value">${this.value}</span>
      </button>

      ${this._open
        ? html`
            <div
              class="sp-color-picker-panel"
              role="dialog"
              aria-label=${SpConfig.locale.colorPicker.pickerLabel}
            >
              <!-- Gradient canvas (accessible via hue/alpha sliders and hex input) -->
              <div
                class="sp-color-picker-canvas"
                aria-hidden="true"
                style="background: linear-gradient(to bottom, transparent, black),
                       linear-gradient(to right, white, hsl(${this._h},100%,50%))"
                @pointerdown=${this._startCanvasDrag}
                @pointermove=${this._onPointerMove}
                @pointerup=${this._onPointerUp}
              >
                <div
                  class="sp-color-picker-thumb"
                  style="left:${this._s}%;top:${100 - this._l * 2}%"
                ></div>
              </div>

              <!-- Sliders -->
              <div class="sp-color-picker-sliders">
                <input
                  type="range"
                  class="sp-color-picker-hue"
                  min="0"
                  max="360"
                  .value=${String(this._h)}
                  aria-label=${SpConfig.locale.colorPicker.hueLabel}
                  @input=${this._handleHueInput}
                />
                ${this.showAlpha
                  ? html`
                      <input
                        type="range"
                        class="sp-color-picker-alpha"
                        min="0"
                        max="100"
                        .value=${String(Math.round(this._a * 100))}
                        aria-label=${SpConfig.locale.colorPicker.alphaLabel}
                        @input=${this._handleAlphaInput}
                      />
                    `
                  : nothing}
              </div>

              <!-- Hex / text input -->
              <div class="sp-color-picker-inputs">
                <input
                  type="text"
                  class="sp-color-picker-hex-input"
                  .value=${this._formatValue()}
                  aria-label=${SpConfig.locale.colorPicker.valueLabel}
                  @change=${this._handleHexInput}
                />
              </div>

              <!-- Swatches -->
              ${swatchList.length
                ? html`
                    <div class="sp-color-picker-swatches">
                      ${swatchList.map(
                        (s) => html`
                          <button
                            class="sp-color-picker-swatch"
                            type="button"
                            style="background: ${s}"
                            aria-label=${s}
                            @click=${() => this._selectSwatch(s)}
                          ></button>
                        `,
                      )}
                    </div>
                  `
                : nothing}
            </div>
          `
        : nothing}

      ${this.error
        ? html`<span class="sp-color-picker-error" role="alert">${this.error}</span>`
        : this.hint
          ? html`<span class="sp-color-picker-hint">${this.hint}</span>`
          : nothing}
    </div>
  `;
}
