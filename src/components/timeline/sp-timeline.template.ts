import { html, nothing, type TemplateResult } from "lit";
import { classMap } from "lit/directives/class-map.js";
import { unsafeHTML } from "lit/directives/unsafe-html.js";
import type { SpTimelineComponent } from "./sp-timeline.js";

export function timelineTemplate(this: SpTimelineComponent): TemplateResult {
  const displayItems = this.reverse ? [...this.items].reverse() : this.items;
  return html`
    <div class=${classMap({ "sp-timeline": true, "sp-timeline--alternate": this.alternate })}>
      ${displayItems.map(
        (item, index) => html`
          <div
            class=${classMap({
              "sp-timeline-item": true,
              [`sp-timeline-item--${item.variant ?? "default"}`]: true,
              "sp-timeline-item--right": this.alternate && index % 2 === 1,
              "sp-timeline-item--left": this.alternate && index % 2 === 0,
            })}
          >
            ${this.alternate && index % 2 === 1
              ? html`<div class="sp-timeline-content sp-timeline-content--alt">
                  <div class="sp-timeline-header">
                    <span class="sp-timeline-label">${item.label}</span>
                    ${item.time ? html`<span class="sp-timeline-time">${item.time}</span>` : nothing}
                  </div>
                  ${item.description ? html`<p class="sp-timeline-description">${item.description}</p>` : nothing}
                </div>`
              : nothing}
            <div class="sp-timeline-indicator">
              ${item.icon
                ? html`<div class="sp-timeline-dot sp-timeline-dot--icon">${unsafeHTML(item.icon)}</div>`
                : html`<div class="sp-timeline-dot"></div>`}
              ${index < displayItems.length - 1
                ? html`<div class="sp-timeline-line"></div>`
                : nothing}
            </div>
            ${!this.alternate || index % 2 === 0
              ? html`<div class="sp-timeline-content">
                  <div class="sp-timeline-header">
                    <span class="sp-timeline-label">${item.label}</span>
                    ${item.time ? html`<span class="sp-timeline-time">${item.time}</span>` : nothing}
                  </div>
                  ${item.description ? html`<p class="sp-timeline-description">${item.description}</p>` : nothing}
                </div>`
              : nothing}
          </div>
        `,
      )}
    </div>
  `;
}
