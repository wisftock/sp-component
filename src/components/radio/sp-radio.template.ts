import { html, nothing, type TemplateResult } from "lit";
import type { SpRadioComponent } from "./sp-radio.js";

export function radioTemplate(this: SpRadioComponent): TemplateResult {
  const labelClass = `sp-radio-label${this.disabled ? " sp-radio-label--disabled" : ""}`;
  const controlClass = `sp-radio-control${this.checked ? " sp-radio-control--checked" : ""}`;

  return html`
    <label class=${labelClass}>
      <span class=${controlClass}>
        <input
          type="radio"
          .checked=${this.checked}
          ?disabled=${this.disabled}
          name=${this.name || nothing}
          value=${this.value}
          @change=${this._handleChange}
        />
        ${this.checked ? html`<span class="sp-radio-dot"></span>` : nothing}
      </span>
      ${this.label
        ? html`<span class="sp-radio-text">${this.label}</span>`
        : html`<slot></slot>`}
    </label>
  `;
}
