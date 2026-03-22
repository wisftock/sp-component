import { html, type TemplateResult } from "lit";
import type { SpTabsComponent } from "./sp-tabs.js";

export function tabsTemplate(this: SpTabsComponent): TemplateResult {
  return html`
    <div class="sp-tabs">
      <div class="sp-tabs-nav-wrapper">
        <button
          class="sp-tabs-scroll-btn sp-tabs-scroll-btn--left"
          type="button"
          aria-label="Scroll tabs left"
          @click=${() => this._scrollNav(-120)}
        >&#8249;</button>
        <div class="sp-tabs-nav" role="tablist">
          <slot name="nav"></slot>
        </div>
        <button
          class="sp-tabs-scroll-btn sp-tabs-scroll-btn--right"
          type="button"
          aria-label="Scroll tabs right"
          @click=${() => this._scrollNav(120)}
        >&#8250;</button>
      </div>
      <div class="sp-tabs-content">
        <slot></slot>
      </div>
    </div>
  `;
}
