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
      aria-labelledby=${this.label ? "sp-otp-label" : nothing}
      aria-label=${this.label ? nothing : "One-time password"}
    >
      ${repeat(
        cells,
        (i) => i,
        (i) => html`
          <input
            class="sp-otp-cell"
            type=${this.inputType === "number" ? "tel" : this.inputType}
            inputmode=${this.inputType === "number" ? "numeric" : nothing}
            maxlength="1"
            .value=${this._values[i] ?? ""}
            placeholder=${this.placeholder}
            ?disabled=${this.disabled}
            aria-label=${`Digit ${i + 1} of ${this.length}`}
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
