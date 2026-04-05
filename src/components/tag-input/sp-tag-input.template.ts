import { html, nothing, type TemplateResult } from "lit";
import { classMap } from "lit/directives/class-map.js";
import { SpConfig } from "../../config.js";
import type { SpTagInputComponent } from "./sp-tag-input.js";

/**
 * HTML template for sp-tag-input.
 * Call as: tagInputTemplate.call(this) inside render()
 */
export function tagInputTemplate(this: SpTagInputComponent): TemplateResult {
  return html`
    <div
      class=${classMap({
        "sp-tag-input": true,
        [`sp-tag-input--${this.size}`]: true,
        "sp-tag-input--focused": this._focused,
        "sp-tag-input--disabled": this.disabled,
        "sp-tag-input--error": !!this.error,
      })}
    >
      ${this.label
        ? html`<label class="sp-tag-input-label">${this.label}</label>`
        : nothing}
      <div class="sp-tag-input-field" @click=${this._focusInput}>
        ${this._tags.map(
          (tag) => html`
            <span class="sp-tag-input-chip">
              <span class="sp-tag-input-chip-label">${tag}</span>
              ${!this.disabled && !this.readonly
                ? html`<button
                    class="sp-tag-input-chip-remove"
                    type="button"
                    aria-label=${SpConfig.locale.tagInput.removeTagLabel.replace("{tag}", tag)}
                    @click=${(e: MouseEvent) => {
                      e.stopPropagation();
                      this._removeTag(tag);
                    }}
                  >
                    ×
                  </button>`
                : nothing}
            </span>
          `,
        )}
        <input
          class="sp-tag-input-input"
          type="text"
          .value=${this._inputValue}
          placeholder=${this._tags.length === 0 ? this.placeholder : ""}
          ?disabled=${this.disabled}
          ?readonly=${this.readonly}
          @input=${this._handleTextInput}
          @keydown=${this._handleKeydown}
          @focus=${() => {
            this._focused = true;
          }}
          @blur=${this._handleBlur}
        />
      </div>
      ${this.error
        ? html`<span class="sp-tag-input-error" role="alert">${this.error}</span>`
        : this.hint
          ? html`<span class="sp-tag-input-hint">${this.hint}</span>`
          : nothing}
    </div>
  `;
}
