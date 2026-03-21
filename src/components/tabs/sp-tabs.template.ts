import { html, type TemplateResult } from "lit";
import type { SpTabsComponent } from "./sp-tabs.js";

export function tabsTemplate(this: SpTabsComponent): TemplateResult {
  return html`
    <div class="sp-tabs">
      <div class="sp-tabs-nav" role="tablist">
        <slot name="nav"></slot>
      </div>
      <div class="sp-tabs-content">
        <slot></slot>
      </div>
    </div>
  `;
}
