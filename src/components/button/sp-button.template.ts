import { html, nothing, type TemplateResult } from "lit";
import type { SpButtonComponent } from "./sp-button.js";

function innerContent(host: SpButtonComponent): TemplateResult {
  return html`
    ${host.loading
      ? html`<span class="sp-spinner" aria-hidden="true"></span>`
      : nothing}
    <slot name="prefix"></slot>
    <slot></slot>
    <slot name="suffix"></slot>
  `;
}

/**
 * HTML template for sp-button.
 * Renders as <a> when href is provided, otherwise as <button>.
 *
 * Call as: buttonTemplate.call(this) inside render()
 */
export function buttonTemplate(this: SpButtonComponent): TemplateResult {
  const isDisabled = this.disabled || this.loading;

  if (this.href) {
    return html`
      <a
        part="button"
        href=${isDisabled ? nothing : this.href}
        target=${this.target || nothing}
        aria-label=${this.label || nothing}
        aria-disabled=${isDisabled ? "true" : nothing}
        role="button"
        tabindex=${isDisabled ? "-1" : nothing}
      >
        ${innerContent(this)}
      </a>
    `;
  }

  return html`
    <button
      part="button"
      type=${this.type}
      ?disabled=${isDisabled}
      name=${this.name || nothing}
      value=${this.value || nothing}
      aria-label=${this.label || nothing}
    >
      ${innerContent(this)}
    </button>
  `;
}
