import { html, nothing, type TemplateResult } from "lit";
import { SpConfig } from "../../config.js";
import type { SpSliderComponent } from "./sp-slider.js";

export function sliderTemplate(this: SpSliderComponent): TemplateResult {
  const displayValue = this.range
    ? `${this.rangeStart} – ${this.rangeEnd}`
    : String(this.value);

  return html`
    <div class="sp-slider-wrapper">
      ${this.label || this.showValue ? html`
        <div class="sp-slider-header">
          ${this.label ? html`<label class="sp-slider-label">${this.label}</label>` : nothing}
          ${this.showValue ? html`<span class="sp-slider-value">${displayValue}</span>` : nothing}
        </div>
      ` : nothing}
      <div class="sp-slider-track-wrapper">
        <div class="sp-slider-track">
          ${this.range
            ? html`<div
                class="sp-slider-fill"
                style="left: ${this.rangeStartPercentage}%; width: ${this.rangeEndPercentage - this.rangeStartPercentage}%"
              ></div>`
            : html`<div class="sp-slider-fill" style="width: ${this.percentage}%"></div>`}
        </div>
        ${this.marks.length > 0
          ? html`
              <div class="sp-slider-marks" aria-hidden="true">
                ${this.marks.map((mark) => {
                  const pct = ((mark.value - this.min) / (this.max - this.min)) * 100;
                  return html`
                    <span
                      class="sp-slider-mark"
                      style="left: ${pct}%"
                    >
                      <span class="sp-slider-mark-tick"></span>
                      ${mark.label ? html`<span class="sp-slider-mark-label">${mark.label}</span>` : nothing}
                    </span>
                  `;
                })}
              </div>
            `
          : nothing}
        ${this.range
          ? html`
              <input
                type="range"
                class="sp-slider-input sp-slider-input--range-start"
                role="slider"
                .value=${String(this.rangeStart)}
                min=${this.min}
                max=${this.max}
                step=${this.step}
                ?disabled=${this.disabled}
                aria-valuemin=${this.min}
                aria-valuemax=${this.max}
                aria-valuenow=${this.rangeStart}
                aria-label="${this.label ? this.label + ' start' : SpConfig.locale.slider.rangeStartLabel}"
                @input=${this._handleRangeStartInput}
                @change=${this._handleRangeStartChange}
              />
              <input
                type="range"
                class="sp-slider-input sp-slider-input--range-end"
                role="slider"
                .value=${String(this.rangeEnd)}
                min=${this.min}
                max=${this.max}
                step=${this.step}
                ?disabled=${this.disabled}
                aria-valuemin=${this.min}
                aria-valuemax=${this.max}
                aria-valuenow=${this.rangeEnd}
                aria-label="${this.label ? this.label + ' end' : SpConfig.locale.slider.rangeEndLabel}"
                @input=${this._handleRangeEndInput}
                @change=${this._handleRangeEndChange}
              />
            `
          : html`
              <input
                type="range"
                class="sp-slider-input"
                role="slider"
                .value=${String(this.value)}
                min=${this.min}
                max=${this.max}
                step=${this.step}
                ?disabled=${this.disabled}
                aria-valuemin=${this.min}
                aria-valuemax=${this.max}
                aria-valuenow=${this.value}
                aria-label=${this.label || nothing}
                @input=${this._handleInput}
                @change=${this._handleChange}
              />
            `}
      </div>
      ${this.error ? html`<span class="sp-slider-error">${this.error}</span>` : nothing}
      ${!this.error && this.hint ? html`<span class="sp-slider-hint">${this.hint}</span>` : nothing}
    </div>
  `;
}
