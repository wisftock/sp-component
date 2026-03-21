import { html, type TemplateResult } from "lit";
import type { SpBadgeComponent } from "./sp-badge.js";

/**
 * HTML template for sp-badge.
 *
 * Call as: badgeTemplate.call(this) inside render()
 */
export function badgeTemplate(this: SpBadgeComponent): TemplateResult {
  return html`
    <span class="sp-badge"><slot></slot></span>
  `;
}
