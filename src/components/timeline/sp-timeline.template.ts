import { html, nothing, type TemplateResult } from "lit";
import { classMap } from "lit/directives/class-map.js";
import type { SpTimelineComponent } from "./sp-timeline.js";

export function timelineTemplate(this: SpTimelineComponent): TemplateResult {
  const displayItems = this.reverse ? [...this.items].reverse() : this.items;
  return html`
    <div class="sp-timeline">
      ${displayItems.map(
        (item, index) => html`
          <div
            class=${classMap({
              "sp-timeline-item": true,
              [`sp-timeline-item--${item.variant ?? "default"}`]: true,
            })}
          >
            <div class="sp-timeline-indicator">
              <div class="sp-timeline-dot"></div>
              ${index < this.items.length - 1
                ? html`<div class="sp-timeline-line"></div>`
                : nothing}
            </div>
            <div class="sp-timeline-content">
              <div class="sp-timeline-header">
                <span class="sp-timeline-label">${item.label}</span>
                ${item.time
                  ? html`<span class="sp-timeline-time">${item.time}</span>`
                  : nothing}
              </div>
              ${item.description
                ? html`<p class="sp-timeline-description">${item.description}</p>`
                : nothing}
            </div>
          </div>
        `,
      )}
    </div>
  `;
}
