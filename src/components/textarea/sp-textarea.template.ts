import { html, nothing, type TemplateResult } from "lit";
import { classMap } from "lit/directives/class-map.js";
import type { SpTextareaComponent } from "./sp-textarea.js";

/**
 * HTML template for sp-textarea.
 *
 * Call as: textareaTemplate.call(this) inside render()
 */
export function textareaTemplate(this: SpTextareaComponent): TemplateResult {
  return html`
    <div class="sp-textarea-wrapper">
      ${this.label
        ? html`<label class="sp-textarea-label"
            >${this.label}${this.required
              ? html`<span class="sp-required"> *</span>`
              : nothing}</label
          >`
        : nothing}
      <textarea
        part="textarea"
        class=${classMap({
          "sp-textarea--error": !!this.error,
        })}
        rows=${this.rows}
        placeholder=${this.placeholder || nothing}
        ?disabled=${this.disabled}
        ?readonly=${this.readonly}
        ?required=${this.required}
        name=${this.name || nothing}
        maxlength=${this.maxlength > 0 ? this.maxlength : nothing}
        .value=${this.value}
        @input=${this._handleInput}
        @change=${this._handleChange}
        @focus=${this._handleFocus}
        @blur=${this._handleBlur}
      ></textarea>
      <div class="sp-textarea-footer">
        ${this.error
          ? html`<span class="sp-textarea-error">${this.error}</span>`
          : this.hint
            ? html`<span class="sp-textarea-hint">${this.hint}</span>`
            : html`<span></span>`}
        ${this.maxlength > 0
          ? html`<span class="sp-textarea-count">${this.value.length} / ${this.maxlength}</span>`
          : nothing}
      </div>
    </div>
  `;
}
