import { html, nothing, type TemplateResult } from "lit";
import { SpConfig } from "../../config.js";
import type { SpNumberInputComponent } from "./sp-number-input.js";

/**
 * HTML template for sp-number-input.
 * Call as: numberInputTemplate.call(this) inside render()
 */
export function numberInputTemplate(this: SpNumberInputComponent): TemplateResult {
  const hasError = Boolean(this.error);
  const wrapperClasses = [
    "sp-number-input",
    `sp-number-input--${this.size}`,
    this.disabled ? "sp-number-input--disabled" : "",
    hasError ? "sp-number-input--error" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return html`
    <div class=${wrapperClasses}>
      ${this.label
        ? html`<label class="sp-number-input-label">${this.label}</label>`
        : nothing}

      <div class="sp-number-input-control">
        <button
          class="sp-number-input-btn sp-number-input-btn--dec"
          aria-label=${SpConfig.locale.numberInput.decreaseLabel}
          type="button"
          ?disabled=${this.disabled}
          @click=${() => this._decrement()}
        >
          &minus;
        </button>

        <input
          type="number"
          class="sp-number-input-field"
          .value=${String(this.value)}
          min=${this.min === -Infinity ? nothing : this.min}
          max=${this.max === Infinity ? nothing : this.max}
          step=${this.step}
          placeholder=${this.placeholder || nothing}
          ?disabled=${this.disabled}
          ?readonly=${this.readonly}
          @input=${(e: Event) => this._handleInput(e)}
          @change=${(e: Event) => this._handleChange(e)}
        />

        <button
          class="sp-number-input-btn sp-number-input-btn--inc"
          aria-label=${SpConfig.locale.numberInput.increaseLabel}
          type="button"
          ?disabled=${this.disabled}
          @click=${() => this._increment()}
        >
          +
        </button>
      </div>

      ${hasError
        ? html`<span class="sp-number-input-error">${this.error}</span>`
        : this.hint
          ? html`<span class="sp-number-input-hint">${this.hint}</span>`
          : nothing}
    </div>
  `;
}
