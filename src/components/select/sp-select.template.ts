import { html, nothing, type TemplateResult } from "lit";
import { classMap } from "lit/directives/class-map.js";
import type { SpSelectComponent } from "./sp-select.js";

/**
 * HTML template for sp-select.
 *
 * Call as: selectTemplate.call(this) inside render()
 */
export function selectTemplate(this: SpSelectComponent): TemplateResult {
  return html`
    <div class="sp-select-wrapper">
      ${this.label
        ? html`<label class="sp-select-label"
            >${this.label}${this.required
              ? html`<span class="sp-required"> *</span>`
              : nothing}</label
          >`
        : nothing}
      <div
        class=${classMap({
          "sp-select-container": true,
          "sp-select-container--error": !!this.error,
        })}
      >
        <select
          part="select"
          ?disabled=${this.disabled}
          ?required=${this.required}
          ?multiple=${this.multiple}
          name=${this.name || nothing}
          @change=${this._handleChange}
          @focus=${this._handleFocus}
          @blur=${this._handleBlur}
        >
          ${this.placeholder
            ? html`<option value="" disabled ?selected=${!this.value}>${this.placeholder}</option>`
            : nothing}
          ${this.options.map(
            (opt) =>
              html`<option
                value=${opt.value}
                ?disabled=${opt.disabled ?? false}
                ?selected=${opt.value === this.value}
              >${opt.label}</option>`,
          )}
        </select>
        ${!this.multiple
          ? html`<span class="sp-select-arrow" aria-hidden="true">▾</span>`
          : nothing}
      </div>
      ${this.error
        ? html`<span class="sp-select-error">${this.error}</span>`
        : nothing}
      ${!this.error && this.hint
        ? html`<span class="sp-select-hint">${this.hint}</span>`
        : nothing}
    </div>
  `;
}
