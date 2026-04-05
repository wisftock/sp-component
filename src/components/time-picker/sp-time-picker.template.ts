import { html, nothing, type TemplateResult } from "lit";
import { classMap } from "lit/directives/class-map.js";
import { SpConfig } from "../../config.js";
import type { SpTimePickerComponent } from "./sp-time-picker.js";

/**
 * HTML template for sp-time-picker.
 * Call as: timePickerTemplate.call(this) inside render()
 */
export function timePickerTemplate(this: SpTimePickerComponent): TemplateResult {
  const options = this._open ? this._getTimeOptions() : [];

  return html`
    <div
      class=${classMap({
        "sp-time-picker": true,
        [`sp-time-picker--${this.size}`]: true,
        "sp-time-picker--disabled": this.disabled,
        "sp-time-picker--error": !!this.error,
        "sp-time-picker--open": this._open,
      })}
    >
      ${this.label
        ? html`<label class="sp-time-picker-label"
            >${this.label}${this.required
              ? html`<span class="sp-required"> *</span>`
              : nothing}</label
          >`
        : nothing}

      <!-- Trigger field -->
      <div
        class=${classMap({
          "sp-time-picker-field": true,
          "sp-time-picker-field--open": this._open,
          "sp-time-picker-field--disabled": this.disabled,
          "sp-time-picker-field--error": !!this.error,
        })}
        @click=${this._toggle}
        role="combobox"
        aria-expanded=${this._open ? "true" : "false"}
        aria-haspopup="listbox"
      >
        <!-- Clock icon -->
        <svg
          class="sp-time-picker-icon"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>

        <input
          type="text"
          class="sp-time-picker-input"
          readonly
          .value=${this._formatDisplay()}
          placeholder=${this.placeholder}
          ?disabled=${this.disabled}
          aria-label=${this.label || "Time picker"}
          tabindex="0"
        />

        ${this.value
          ? html`<button
              class="sp-time-picker-clear"
              type="button"
              aria-label=${SpConfig.locale.timePicker.clearLabel}
              @click=${this._clear}
            >
              ×
            </button>`
          : nothing}
      </div>

      <!-- Dropdown panel -->
      ${this._open
        ? html`
            <div class="sp-time-picker-panel" role="dialog" aria-label=${SpConfig.locale.timePicker.panelLabel}>
              <!-- Time columns -->
              <div class="sp-time-picker-columns">
                <!-- Hours column -->
                <div class="sp-time-picker-col">
                  <button
                    class="sp-time-picker-arrow"
                    type="button"
                    aria-label=${SpConfig.locale.timePicker.increaseHoursLabel}
                    @click=${() => this._changeHours(1)}
                  >▲</button>
                  <span class="sp-time-picker-value">
                    ${String(this._displayHours()).padStart(2, "0")}
                  </span>
                  <button
                    class="sp-time-picker-arrow"
                    type="button"
                    aria-label=${SpConfig.locale.timePicker.decreaseHoursLabel}
                    @click=${() => this._changeHours(-1)}
                  >▼</button>
                </div>

                <span class="sp-time-picker-sep">:</span>

                <!-- Minutes column -->
                <div class="sp-time-picker-col">
                  <button
                    class="sp-time-picker-arrow"
                    type="button"
                    aria-label=${SpConfig.locale.timePicker.increaseMinutesLabel}
                    @click=${() => this._changeMinutes(1)}
                  >▲</button>
                  <span class="sp-time-picker-value">
                    ${String(this._minutes).padStart(2, "0")}
                  </span>
                  <button
                    class="sp-time-picker-arrow"
                    type="button"
                    aria-label=${SpConfig.locale.timePicker.decreaseMinutesLabel}
                    @click=${() => this._changeMinutes(-1)}
                  >▼</button>
                </div>

                <!-- Seconds column -->
                ${this.showSeconds
                  ? html`
                      <span class="sp-time-picker-sep">:</span>
                      <div class="sp-time-picker-col">
                        <button
                          class="sp-time-picker-arrow"
                          type="button"
                          aria-label=${SpConfig.locale.timePicker.increaseSecondsLabel}
                          @click=${() => this._changeSeconds(1)}
                        >▲</button>
                        <span class="sp-time-picker-value">
                          ${String(this._seconds).padStart(2, "0")}
                        </span>
                        <button
                          class="sp-time-picker-arrow"
                          type="button"
                          aria-label=${SpConfig.locale.timePicker.decreaseSecondsLabel}
                          @click=${() => this._changeSeconds(-1)}
                        >▼</button>
                      </div>
                    `
                  : nothing}

                <!-- AM/PM column for 12h format -->
                ${this.format === "12"
                  ? html`
                      <div class="sp-time-picker-col sp-time-picker-col--period">
                        <button
                          class="sp-time-picker-arrow"
                          type="button"
                          aria-label=${SpConfig.locale.timePicker.toggleAmPmLabel}
                          @click=${this._togglePeriod}
                        >▲</button>
                        <span class="sp-time-picker-value">${this._period}</span>
                        <button
                          class="sp-time-picker-arrow"
                          type="button"
                          aria-label=${SpConfig.locale.timePicker.toggleAmPmLabel}
                          @click=${this._togglePeriod}
                        >▼</button>
                      </div>
                    `
                  : nothing}
              </div>

              <!-- Quick presets list -->
              <div class="sp-time-picker-presets" role="listbox" aria-label=${SpConfig.locale.timePicker.presetsLabel}>
                ${options.map(
                  (t) => html`
                    <button
                      class=${classMap({
                        "sp-time-picker-option": true,
                        "sp-time-picker-option--selected": t === this.value,
                      })}
                      type="button"
                      role="option"
                      aria-selected=${t === this.value ? "true" : "false"}
                      @click=${() => this._selectTime(t)}
                    >${t}</button>
                  `,
                )}
              </div>

              <!-- Actions -->
              <div class="sp-time-picker-actions">
                <button
                  class="sp-time-picker-now"
                  type="button"
                  @click=${this._setNow}
                >Now</button>
                <button
                  class="sp-time-picker-ok"
                  type="button"
                  @click=${this._confirm}
                >OK</button>
              </div>
            </div>
          `
        : nothing}

      <!-- Messages -->
      ${this.error
        ? html`<span class="sp-time-picker-error" role="alert">${this.error}</span>`
        : this.hint
          ? html`<span class="sp-time-picker-hint">${this.hint}</span>`
          : nothing}
    </div>
  `;
}
