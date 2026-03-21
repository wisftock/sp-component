import { html, nothing, type TemplateResult } from "lit";
import { classMap } from "lit/directives/class-map.js";
import type { SpInputComponent } from "./sp-input.js";

/**
 * HTML template for sp-input.
 *
 * Call as: inputTemplate.call(this) inside render()
 */
export function inputTemplate(this: SpInputComponent): TemplateResult {
  return html`
    <div class="sp-input-wrapper">
      ${this.label
        ? html`<label class="sp-input-label"
            >${this.label}${this.required
              ? html`<span class="sp-required"> *</span>`
              : nothing}</label
          >`
        : nothing}
      <div
        class=${classMap({
          "sp-input-container": true,
          "sp-input-container--error": !!this.error,
        })}
      >
        <slot name="prefix"></slot>
        <input
          part="input"
          type=${this.type}
          .value=${this.value}
          placeholder=${this.placeholder || nothing}
          ?disabled=${this.disabled}
          ?readonly=${this.readonly}
          ?required=${this.required}
          name=${this.name || nothing}
          maxlength=${this.maxlength > 0 ? this.maxlength : nothing}
          minlength=${this.minlength > 0 ? this.minlength : nothing}
          @input=${this._handleInput}
          @change=${this._handleChange}
          @focus=${this._handleFocus}
          @blur=${this._handleBlur}
        />
        ${this.clearable && this.value
          ? html`<button
              class="sp-input-clear"
              type="button"
              @click=${this._handleClear}
              aria-label="Clear"
            >
              ✕
            </button>`
          : nothing}
        <slot name="suffix"></slot>
      </div>
      ${this.error
        ? html`<span class="sp-input-error">${this.error}</span>`
        : this.hint
          ? html`<span class="sp-input-hint">${this.hint}</span>`
          : nothing}
    </div>
  `;
}
