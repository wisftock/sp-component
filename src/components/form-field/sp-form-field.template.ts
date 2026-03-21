import { html, nothing, type TemplateResult } from "lit";
import type { SpFormFieldComponent } from "./sp-form-field.js";

export function formFieldTemplate(this: SpFormFieldComponent): TemplateResult {
  const fieldClass = `sp-form-field${this.disabled ? " sp-form-field--disabled" : ""}`;

  return html`
    <div class=${fieldClass}>
      ${this.label
        ? html`
            <label class="sp-form-field-label" for=${this.labelFor || nothing}>
              ${this.label}
              ${this.required
                ? html`<span class="sp-required" aria-label="required"> *</span>`
                : nothing}
            </label>
          `
        : nothing}
      <div class="sp-form-field-control">
        <slot></slot>
      </div>
      ${this.error
        ? html`<span class="sp-form-field-error" role="alert">${this.error}</span>`
        : nothing}
      ${!this.error && this.hint
        ? html`<span class="sp-form-field-hint">${this.hint}</span>`
        : nothing}
    </div>
  `;
}
