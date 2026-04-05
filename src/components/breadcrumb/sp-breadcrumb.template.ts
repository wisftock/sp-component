import { html, nothing, type TemplateResult } from "lit";
import { SpConfig } from "../../config.js";
import type { SpBreadcrumbComponent } from "./sp-breadcrumb.js";

export function breadcrumbTemplate(this: SpBreadcrumbComponent): TemplateResult {
  const items = [...this.querySelectorAll("sp-breadcrumb-item")] as HTMLElement[];
  const showEllipsis =
    this.maxItems > 0 && !this._expanded && items.length > this.maxItems;

  return html`
    <nav aria-label=${SpConfig.locale.breadcrumb.navLabel}>
      <ol class="sp-breadcrumb">
        <slot @slotchange=${this._handleSlotChange}></slot>
        ${showEllipsis
          ? html`<li class="sp-breadcrumb-ellipsis-item">
              <button
                class="sp-breadcrumb-ellipsis"
                type="button"
                aria-label=${SpConfig.locale.breadcrumb.expandLabel}
                @click=${this._handleExpandClick}
              >…</button>
            </li>`
          : nothing}
      </ol>
    </nav>
  `;
}
