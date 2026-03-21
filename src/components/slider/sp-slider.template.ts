import { html, nothing, type TemplateResult } from "lit";
import type { SpSliderComponent } from "./sp-slider.js";

export function sliderTemplate(this: SpSliderComponent): TemplateResult {
  return html`
    <div class="sp-slider-wrapper">
      ${this.label || this.showValue ? html`
        <div class="sp-slider-header">
          ${this.label ? html`<label class="sp-slider-label">${this.label}</label>` : nothing}
          ${this.showValue ? html`<span class="sp-slider-value">${this.value}</span>` : nothing}
        </div>
      ` : nothing}
      <div class="sp-slider-track-wrapper">
        <div class="sp-slider-track">
          <div class="sp-slider-fill" style="width: ${this.percentage}%"></div>
        </div>
        <input
          type="range"
          class="sp-slider-input"
          .value=${String(this.value)}
          min=${this.min}
          max=${this.max}
          step=${this.step}
          ?disabled=${this.disabled}
          @input=${this._handleInput}
          @change=${this._handleChange}
        />
      </div>
      ${this.error ? html`<span class="sp-slider-error">${this.error}</span>` : nothing}
      ${!this.error && this.hint ? html`<span class="sp-slider-hint">${this.hint}</span>` : nothing}
    </div>
  `;
}
