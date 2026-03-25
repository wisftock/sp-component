import { html, nothing, type TemplateResult } from "lit";
import { classMap } from "lit/directives/class-map.js";
import type { SpComboboxComponent } from "./sp-combobox.js";

export function comboboxTemplate(this: SpComboboxComponent): TemplateResult {
  const hasValue = this.multiple ? this.values.length > 0 : !!this.value;
  const showClear = this.clearable && hasValue;

  return html`
    <div class="sp-combobox-wrapper">
      ${this.label ? html`
        <label class="sp-combobox-label">
          ${this.label}${this.required ? html`<span class="sp-required"> *</span>` : nothing}
        </label>
      ` : nothing}

      <div class=${classMap({
        "sp-combobox-container": true,
        "sp-combobox-container--open": this._open,
        "sp-combobox-container--error": !!this.error,
        "sp-combobox-container--multiple": this.multiple,
      })}>

        ${this.multiple ? html`
          <div class="sp-combobox-multi-wrap">
            ${this.values.map(v => {
              const opt = this.options.find(o => o.value === v);
              return html`
                <span class="sp-combobox-tag">
                  <span class="sp-combobox-tag-label">${opt?.label ?? v}</span>
                  <button
                    class="sp-combobox-tag-remove"
                    type="button"
                    aria-label="Remove ${opt?.label ?? v}"
                    @mousedown=${(e: Event) => this._handleRemoveValue(v, e)}
                  >×</button>
                </span>
              `;
            })}
            <input
              class="sp-combobox-input sp-combobox-input--multi"
              part="input"
              type="text"
              role="combobox"
              aria-autocomplete="list"
              aria-expanded=${this._open ? "true" : "false"}
              aria-controls="sp-combobox-listbox"
              aria-activedescendant=${this._highlightedIndex !== null ? `sp-combo-opt-${this._highlightedIndex}` : nothing}
              aria-invalid=${this.error ? "true" : nothing}
              aria-required=${this.required ? "true" : nothing}
              .value=${this._searchText}
              placeholder=${this.values.length === 0 ? this.placeholder : ""}
              ?disabled=${this.disabled}
              autocomplete="off"
              @focus=${this._handleInputFocus}
              @input=${this._handleInputInput}
              @keydown=${this._handleKeydown}
            />
          </div>
        ` : html`
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
        `}

        ${showClear ? html`
          <button class="sp-combobox-clear" type="button" @click=${this._handleClear} aria-label="Clear">✕</button>
        ` : nothing}

        <button
          class="sp-combobox-arrow-btn"
          type="button"
          tabindex="-1"
          aria-label=${this._open ? "Close dropdown" : "Open dropdown"}
          aria-expanded=${this._open ? "true" : "false"}
          ?disabled=${this.disabled}
          @click=${this._handleToggleDropdown}
        ><span class="sp-combobox-arrow" aria-hidden="true">▾</span></button>
      </div>

      ${this._open ? html`
        <div
          class="sp-combobox-dropdown"
          id="sp-combobox-listbox"
          role="listbox"
          aria-multiselectable=${this.multiple ? "true" : nothing}
        >
          ${this._filteredOptions.length > 0
            ? this._filteredOptions.map((option, index) => html`
                <div
                  id="sp-combo-opt-${index}"
                  class=${classMap({
                    "sp-combobox-option": true,
                    "sp-combobox-option--selected": this.multiple
                      ? this.values.includes(option.value)
                      : option.value === this.value,
                    "sp-combobox-option--disabled": !!option.disabled,
                    "sp-combobox-option--highlighted": this._highlightedIndex === index,
                  })}
                  role="option"
                  aria-selected=${(this.multiple ? this.values.includes(option.value) : option.value === this.value) ? "true" : "false"}
                  aria-disabled=${option.disabled ? "true" : nothing}
                  @mousedown=${() => this._handleSelect(option)}
                >
                  ${this.multiple ? html`
                    <span class="sp-combobox-option-check" aria-hidden="true">
                      ${this.values.includes(option.value) ? "✓" : ""}
                    </span>
                  ` : nothing}
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
