import { html, nothing, type TemplateResult } from "lit";
import type { SpSwitchComponent } from "./sp-switch.js";

export function switchTemplate(this: SpSwitchComponent): TemplateResult {
  const labelClass = `sp-switch-label${this.disabled ? " sp-switch-label--disabled" : ""}`;
  const trackClass = `sp-switch-track${this.checked ? " sp-switch-track--checked" : ""}`;

  return html`
    <label class=${labelClass}>
      <span class=${trackClass}>
        <input
          type="checkbox"
          role="switch"
          .checked=${this.checked}
          ?disabled=${this.disabled}
          name=${this.name || nothing}
          value=${this.value}
          @change=${this._handleChange}
        />
        <span class="sp-switch-thumb"></span>
      </span>
      ${this.label
        ? html`<span class="sp-switch-text">${this.label}</span>`
        : html`<slot></slot>`}
    </label>
    ${this.hint
      ? html`<span class="sp-switch-hint">${this.hint}</span>`
      : nothing}
  `;
}
