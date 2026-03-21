import { html, type TemplateResult } from "lit";
import type { SpCopyButtonComponent } from "./sp-copy-button.js";

function copyIcon(): TemplateResult {
  return html`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
      <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/>
    </svg>
  `;
}

function checkIcon(): TemplateResult {
  return html`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
      <path d="M20 6L9 17l-5-5"/>
    </svg>
  `;
}

export function copyButtonTemplate(this: SpCopyButtonComponent): TemplateResult {
  const icon = this._copied ? checkIcon() : copyIcon();
  const label = this._copied ? this.successLabel : this.label;

  return html`
    <button
      class="sp-copy-button${this._copied ? " sp-copy-button--success" : ""}"
      ?disabled=${this.disabled}
      aria-label=${label}
      @click=${this._handleClick}
    >
      ${icon}
      ${label}
    </button>
  `;
}
