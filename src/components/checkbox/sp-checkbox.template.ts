import { html, nothing, type TemplateResult } from "lit";
import type { SpCheckboxComponent } from "./sp-checkbox.js";

export function checkboxTemplate(this: SpCheckboxComponent): TemplateResult {
  const labelClass = `sp-checkbox-label${this.disabled ? " sp-checkbox-label--disabled" : ""}`;
  const controlClass = `sp-checkbox-control${this.checked ? " sp-checkbox-control--checked" : ""}${this.indeterminate ? " sp-checkbox-control--indeterminate" : ""}`;

  return html`
    <label class=${labelClass}>
      <span class=${controlClass}>
        <input
          type="checkbox"
          .checked=${this.checked}
          .indeterminate=${this.indeterminate}
          ?disabled=${this.disabled}
          ?required=${this.required}
          name=${this.name || nothing}
          value=${this.value || nothing}
          @change=${this._handleChange}
        />
        ${this.checked && !this.indeterminate
          ? html`<svg width="10" height="8" viewBox="0 0 10 8" fill="none" aria-hidden="true">
              <path d="M1 4L3.5 6.5L9 1" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>`
          : nothing}
        ${this.indeterminate
          ? html`<svg width="10" height="2" viewBox="0 0 10 2" fill="none" aria-hidden="true">
              <path d="M1 1H9" stroke="white" stroke-width="2" stroke-linecap="round"/>
            </svg>`
          : nothing}
      </span>
      ${this.label
        ? html`<span class="sp-checkbox-text">${this.label}</span>`
        : html`<slot></slot>`}
    </label>
    ${this.error
      ? html`<span class="sp-checkbox-error">${this.error}</span>`
      : nothing}
    ${!this.error && this.hint
      ? html`<span class="sp-checkbox-hint">${this.hint}</span>`
      : nothing}
  `;
}
