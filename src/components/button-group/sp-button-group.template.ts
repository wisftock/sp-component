import { html, type TemplateResult } from "lit";
import type { SpButtonGroupComponent } from "./sp-button-group.js";

export function buttonGroupTemplate(this: SpButtonGroupComponent): TemplateResult {
  const classes = [
    "sp-button-group",
    `sp-button-group--${this.orientation}`,
    this.attached ? "sp-button-group--attached" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return html`
    <div class=${classes} role="group">
      <slot @slotchange=${this._handleSlotChange}></slot>
    </div>
  `;
}
