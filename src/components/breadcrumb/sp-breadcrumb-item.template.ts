import { html, nothing, type TemplateResult } from "lit";
import type { SpBreadcrumbItemComponent } from "./sp-breadcrumb-item.js";

export function breadcrumbItemTemplate(this: SpBreadcrumbItemComponent): TemplateResult {
  return html`
    <li class="sp-breadcrumb-item">
      ${!this.active
        ? html`
            <a
              class="sp-breadcrumb-link"
              href=${this.href || nothing}
              target=${this.target || nothing}
              rel=${this.rel || nothing}
            >
              <slot></slot>
            </a>
            <span class="sp-breadcrumb-separator" aria-hidden="true">${this.separator}</span>
          `
        : html`
            <span class="sp-breadcrumb-current" aria-current="page"><slot></slot></span>
          `}
    </li>
  `;
}
