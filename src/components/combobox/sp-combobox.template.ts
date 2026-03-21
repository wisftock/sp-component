import { html, nothing, type TemplateResult } from "lit";
import { classMap } from "lit/directives/class-map.js";
import type { SpComboboxComponent } from "./sp-combobox.js";

export function comboboxTemplate(this: SpComboboxComponent): TemplateResult {
  return html`
    <div class="sp-combobox-wrapper">
      ${this.label ? html`
        <label class="sp-combobox-label">
          ${this.label}${this.required ? html`<span class="sp-required"> *</span>` : nothing}
        </label>
      ` : nothing}
      <div class=${classMap({ "sp-combobox-container": true, "sp-combobox-container--open": this._open, "sp-combobox-container--error": !!this.error })}>
        <input
          class="sp-combobox-input"
          part="input"
          type="text"
          role="combobox"
          aria-autocomplete="list"
          aria-expanded=${this._open ? "true" : "false"}
          aria-controls="sp-combobox-listbox"
          aria-activedescendant=${this._highlightedIndex !== null ? `sp-combo-opt-${this._highlightedIndex}` : nothing}
          aria-invalid=${this.error ? "true" : nothing}
          aria-describedby=${(this.error || this.hint) ? "sp-combo-desc" : nothing}
          aria-required=${this.required ? "true" : nothing}
          .value=${this._open ? this._searchText : this._selectedLabel}
          placeholder=${this.placeholder}
          ?disabled=${this.disabled}
          ?required=${this.required}
          autocomplete="off"
          @focus=${this._handleInputFocus}
          @input=${this._handleInputInput}
          @keydown=${this._handleKeydown}
        />
        ${this.clearable && this.value ? html`<button class="sp-combobox-clear" type="button" @click=${this._handleClear} aria-label="Clear">✕</button>` : nothing}
        <span class="sp-combobox-arrow" aria-hidden="true">▾</span>
      </div>
      ${this._open ? html`
        <div
          class="sp-combobox-dropdown"
          id="sp-combobox-listbox"
          role="listbox"
        >
          ${this._filteredOptions.length > 0
            ? this._filteredOptions.map((option, index) => html`
                <div
                  id="sp-combo-opt-${index}"
                  class=${classMap({
                    "sp-combobox-option": true,
                    "sp-combobox-option--selected": option.value === this.value,
                    "sp-combobox-option--disabled": !!option.disabled,
                    "sp-combobox-option--highlighted": this._highlightedIndex === index,
                  })}
                  role="option"
                  aria-selected=${option.value === this.value ? "true" : "false"}
                  aria-disabled=${option.disabled ? "true" : nothing}
                  @mousedown=${() => this._handleSelect(option)}
                >
                  ${option.label}
                </div>
              `)
            : html`<div class="sp-combobox-no-results">${this.noResultsText}</div>`
          }
        </div>
      ` : nothing}
      ${this.error ? html`<span id="sp-combo-desc" class="sp-combobox-error" role="alert">${this.error}</span>` : nothing}
      ${!this.error && this.hint ? html`<span id="sp-combo-desc" class="sp-combobox-hint">${this.hint}</span>` : nothing}
    </div>
  `;
}
