import { html, nothing, type TemplateResult } from "lit";
import { classMap } from "lit/directives/class-map.js";
import type { SpAutocompleteComponent } from "./sp-autocomplete.js";

export function autocompleteTemplate(this: SpAutocompleteComponent): TemplateResult {
  const hasValue = this.multiple ? this.values.length > 0 : !!this.value;
  const showClear = this.clearable && hasValue;
  const groups = this._renderGroups;

  return html`
    <div class="sp-ac-wrapper">
      ${this.label ? html`
        <label class="sp-ac-label">
          ${this.label}${this.required ? html`<span class="sp-ac-required"> *</span>` : nothing}
        </label>
      ` : nothing}

      <div class=${classMap({
        "sp-ac-container": true,
        "sp-ac-container--open": this._open,
        "sp-ac-container--error": !!this.error,
        "sp-ac-container--multiple": this.multiple,
        "sp-ac-container--disabled": this.disabled,
      })}>

        ${this.multiple ? html`
          <!-- Multiple mode: tags + inline input -->
          <div class="sp-ac-multi-wrap">
            ${this.values.map(v => {
              const opt = this.options.find(o => o.value === v);
              return html`
                <span class="sp-ac-tag">
                  <span class="sp-ac-tag-label">${opt?.label ?? v}</span>
                  <button
                    class="sp-ac-tag-remove"
                    type="button"
                    aria-label="Remove ${opt?.label ?? v}"
                    @mousedown=${(e: Event) => this._handleRemoveValue(v, e)}
                  >×</button>
                </span>
              `;
            })}
            <input
              class="sp-ac-input sp-ac-input--multi"
              part="input"
              type="text"
              role="combobox"
              aria-autocomplete="list"
              aria-expanded=${this._open ? "true" : "false"}
              aria-controls="sp-ac-listbox"
              aria-activedescendant=${this._highlightedIndex !== null ? `sp-ac-opt-${this._highlightedIndex}` : nothing}
              aria-invalid=${this.error ? "true" : nothing}
              aria-required=${this.required ? "true" : nothing}
              .value=${this._query}
              placeholder=${this.values.length === 0 ? this.placeholder : ""}
              ?disabled=${this.disabled}
              autocomplete="off"
              @focus=${this._handleInputFocus}
              @input=${this._handleInputInput}
              @keydown=${this._handleKeydown}
            />
          </div>
        ` : html`
          <!-- Single mode: input shows selected label or query -->
          <input
            class="sp-ac-input"
            part="input"
            type="text"
            role="combobox"
            aria-autocomplete="list"
            aria-expanded=${this._open ? "true" : "false"}
            aria-controls="sp-ac-listbox"
            aria-activedescendant=${this._highlightedIndex !== null ? `sp-ac-opt-${this._highlightedIndex}` : nothing}
            aria-invalid=${this.error ? "true" : nothing}
            aria-describedby=${(this.error || this.hint) ? "sp-ac-desc" : nothing}
            aria-required=${this.required ? "true" : nothing}
            .value=${this._open ? this._query : this._selectedLabel}
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
          <button class="sp-ac-clear" type="button" @click=${this._handleClear} aria-label="Clear">✕</button>
        ` : nothing}

        <button
          class="sp-ac-arrow-btn"
          type="button"
          tabindex="-1"
          aria-label=${this._open ? "Close" : "Open"}
          aria-expanded=${this._open ? "true" : "false"}
          ?disabled=${this.disabled}
          @click=${this._handleToggleDropdown}
        ><span class="sp-ac-arrow" aria-hidden="true">▾</span></button>
      </div>

      ${this._open ? html`
        <div class="sp-ac-dropdown" id="sp-ac-listbox" role="listbox" aria-multiselectable=${this.multiple ? "true" : nothing}>

          ${this.loading ? html`
            <div class="sp-ac-loading" aria-live="polite">
              <span class="sp-ac-spinner" aria-hidden="true"></span>
              <span>Loading…</span>
            </div>
          ` : nothing}

          ${!this.loading && groups.every(g => g.options.length === 0) && !this._showCreate ? html`
            <div class="sp-ac-no-results">${this.noResultsText}</div>
          ` : nothing}

          ${!this.loading ? groups.map(group => html`
            ${group.label ? html`<div class="sp-ac-group-label" role="presentation">${group.label}</div>` : nothing}
            ${group.options.map(({ option, flatIndex }) => html`
              <div
                id="sp-ac-opt-${flatIndex}"
                class=${classMap({
                  "sp-ac-option": true,
                  "sp-ac-option--selected": this.multiple
                    ? this.values.includes(option.value)
                    : option.value === this.value,
                  "sp-ac-option--disabled": !!option.disabled,
                  "sp-ac-option--highlighted": this._highlightedIndex === flatIndex,
                })}
                role="option"
                aria-selected=${(this.multiple ? this.values.includes(option.value) : option.value === this.value) ? "true" : "false"}
                aria-disabled=${option.disabled ? "true" : nothing}
                @mousedown=${() => this._handleSelect(option)}
              >
                ${this.multiple ? html`
                  <span class="sp-ac-option-check" aria-hidden="true">
                    ${this.values.includes(option.value) ? html`<svg viewBox="0 0 12 12" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="1,6 4.5,9.5 11,2"/></svg>` : nothing}
                  </span>
                ` : nothing}
                <span class="sp-ac-option-content">
                  <span class="sp-ac-option-label">${option.label}</span>
                  ${option.description ? html`<span class="sp-ac-option-desc">${option.description}</span>` : nothing}
                </span>
              </div>
            `)}
          `) : nothing}

          ${this._showCreate ? html`
            <div
              id="sp-ac-opt-${this._flatOptions.length}"
              class=${classMap({
                "sp-ac-option": true,
                "sp-ac-option--create": true,
                "sp-ac-option--highlighted": this._highlightedIndex === this._flatOptions.length,
              })}
              role="option"
              aria-selected="false"
              @mousedown=${this._handleCreate}
            >
              <span class="sp-ac-option-create-icon" aria-hidden="true">+</span>
              <span>${this._createLabel}</span>
            </div>
          ` : nothing}
        </div>
      ` : nothing}

      ${this.error ? html`<span id="sp-ac-desc" class="sp-ac-error" role="alert">${this.error}</span>` : nothing}
      ${!this.error && this.hint ? html`<span id="sp-ac-desc" class="sp-ac-hint">${this.hint}</span>` : nothing}
    </div>
  `;
}
