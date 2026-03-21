import { html, nothing, type TemplateResult } from "lit";
import type { SpEmptyStateComponent } from "./sp-empty-state.js";

export function emptyStateTemplate(this: SpEmptyStateComponent): TemplateResult {
  return html`
    <div class="sp-empty-state">
      <div class="sp-empty-state-icon">
        ${this.icon
          ? html`<img src=${this.icon} alt="" aria-hidden="true" />`
          : html`<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="8" y="16" width="48" height="36" rx="4" stroke="#d1d5db" stroke-width="2" />
              <path d="M8 24h48" stroke="#d1d5db" stroke-width="2" />
              <circle cx="32" cy="38" r="8" stroke="#d1d5db" stroke-width="2" />
              <path d="M32 34v4l2 2" stroke="#d1d5db" stroke-width="2" stroke-linecap="round" />
            </svg>`}
      </div>
      <h3 class="sp-empty-state-title">${this.title}</h3>
      ${this.description
        ? html`<p class="sp-empty-state-description">${this.description}</p>`
        : nothing}
      <div class="sp-empty-state-actions"><slot></slot></div>
    </div>
  `;
}
