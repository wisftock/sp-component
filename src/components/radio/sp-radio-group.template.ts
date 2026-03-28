import { html, nothing, type TemplateResult } from "lit";
import type { SpRadioGroupComponent } from "./sp-radio-group.js";

export function radioGroupTemplate(this: SpRadioGroupComponent): TemplateResult {
  return html`
    <fieldset class="sp-radio-group">
      ${this.label
        ? html`<legend class="sp-radio-group-legend">${this.label}</legend>`
        : nothing}
      <div class="sp-radio-group-options">
        <slot @slotchange=${this._handleSlotChange}></slot>
      </div>
      ${this.error
        ? html`<span class="sp-radio-group-error" role="alert">${this.error}</span>`
        : nothing}
      ${!this.error && this.hint
        ? html`<span class="sp-radio-group-hint">${this.hint}</span>`
        : nothing}
    </fieldset>
  `;
}
