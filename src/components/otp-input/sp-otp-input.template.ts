import { html, nothing, type TemplateResult } from "lit";
import { repeat } from "lit/directives/repeat.js";
import type { SpOtpInputComponent } from "./sp-otp-input.js";

export function otpInputTemplate(this: SpOtpInputComponent): TemplateResult {
  const cells = Array.from({ length: this.length }, (_, i) => i);

  return html`
    ${this.label
      ? html`<label class="sp-otp-label" id="sp-otp-label">${this.label}</label>`
      : nothing}
    <div
      class="sp-otp-container"
      role="group"
      aria-label=${this.label}
    >
      ${repeat(
        cells,
        (i) => i,
        (i) => html`
          ${this.separator && this.separatorIndex >= 0 && i === this.separatorIndex
            ? html`<span class="sp-otp-separator">${this.separator}</span>`
            : nothing}
          <input
            class="sp-otp-cell"
            type=${this.inputType === "number" ? "tel" : this.inputType}
            inputmode=${this.inputType === "number" ? "numeric" : nothing}
            maxlength="1"
            .value=${this._values[i] ?? ""}
            placeholder=${this.placeholder}
            ?disabled=${this.disabled}
            aria-label=${`Digit ${i + 1} of ${this.length}`}
            aria-invalid=${this.invalid ? "true" : nothing}
            data-index=${i}
            @input=${(e: Event) => this._handleInput(e, i)}
            @keydown=${(e: KeyboardEvent) => this._handleKeydown(e, i)}
            @paste=${(e: ClipboardEvent) => this._handlePaste(e, i)}
            @focus=${(e: FocusEvent) => this._handleFocus(e, i)}
          />
        `,
      )}
    </div>
  `;
}
