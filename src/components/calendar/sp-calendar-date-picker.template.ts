import { html, nothing, type TemplateResult } from "lit";
import { SpConfig } from "../../config.js";
import type { SpCalendarDatePickerComponent } from "./sp-calendar-date-picker.js";

function calendarIcon(): TemplateResult {
  return html`<svg
    class="sp-date-picker__icon"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    aria-hidden="true"
  >
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
    <line x1="16" y1="2" x2="16" y2="6"></line>
    <line x1="8" y1="2" x2="8" y2="6"></line>
    <line x1="3" y1="10" x2="21" y2="10"></line>
  </svg>`;
}

export function datePickerTemplate(this: SpCalendarDatePickerComponent): TemplateResult {
  const fieldClasses = [
    "sp-date-picker__field",
    this._open ? "sp-date-picker__field--open" : "",
    this.disabled ? "sp-date-picker__field--disabled" : "",
    this.error ? "sp-date-picker__field--error" : "",
  ]
    .filter(Boolean)
    .join(" ");

  const popoverClasses = [
    "sp-date-picker__popover",
    this._open ? "sp-date-picker__popover--open" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return html`
    <div class="sp-date-picker">
      ${this.label ? html`<label class="sp-date-picker__label">${this.label}</label>` : nothing}

      <div
        class=${fieldClasses}
        @click=${this._handleFieldClick}
      >
        ${calendarIcon()}
        <input
          class="sp-date-picker__input"
          type="text"
          .value=${this._displayValue}
          placeholder=${this.placeholder || SpConfig.locale.calendar.selectDatePlaceholder}
          ?disabled=${this.disabled}
          ?readonly=${true}
          tabindex="0"
          aria-label=${this.label || "Date picker"}
          aria-expanded=${this._open ? "true" : "false"}
          aria-haspopup="dialog"
          aria-invalid=${this.error ? "true" : "false"}
          aria-describedby=${this.error ? "dp-error" : this.hint ? "dp-hint" : nothing}
          @keydown=${(e: KeyboardEvent) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              this._toggleOpen();
            }
          }}
        />
      </div>

      <div
        class=${popoverClasses}
        role="dialog"
        aria-modal="true"
        aria-label="Calendar"
      >
        <sp-calendar
          .value=${this._internalValue}
          .mode=${this.mode}
          .min=${this.min}
          .max=${this.max}
          .locale=${this.locale}
          .firstDayOfWeek=${this.firstDayOfWeek}
          ?disabled=${this.disabled}
          @sp-change=${this._handleCalendarChange}
        ></sp-calendar>
      </div>

      ${this.error
        ? html`<span id="dp-error" class="sp-date-picker__error">${this.error}</span>`
        : this.hint
          ? html`<span id="dp-hint" class="sp-date-picker__hint">${this.hint}</span>`
          : nothing}
    </div>
  `;
}
