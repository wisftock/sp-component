import { html, type TemplateResult } from "lit";
import type { SpBreadcrumbComponent } from "./sp-breadcrumb.js";

export function breadcrumbTemplate(this: SpBreadcrumbComponent): TemplateResult {
  return html`
    <nav aria-label="breadcrumb">
      <ol class="sp-breadcrumb">
        <slot @slotchange=${this._handleSlotChange}></slot>
      </ol>
    </nav>
  `;
}
