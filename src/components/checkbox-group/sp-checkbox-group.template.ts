import { html, nothing, type TemplateResult } from "lit";
import type { SpCheckboxGroupComponent } from "./sp-checkbox-group.js";

export function checkboxGroupTemplate(this: SpCheckboxGroupComponent): TemplateResult {
  return html`
    <fieldset class="sp-checkbox-group">
      ${this.label
        ? html`<legend class="sp-checkbox-group-legend">${this.label}</legend>`
        : nothing}
      <div class="sp-checkbox-group-options">
        <slot @slotchange=${this._handleSlotChange}></slot>
      </div>
      ${this.error
        ? html`<span class="sp-checkbox-group-error" role="alert">${this.error}</span>`
        : nothing}
      ${!this.error && this.hint
        ? html`<span class="sp-checkbox-group-hint">${this.hint}</span>`
        : nothing}
    </fieldset>
  `;
}
