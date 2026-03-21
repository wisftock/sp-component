import { html, nothing, type TemplateResult } from "lit";
import { classMap } from "lit/directives/class-map.js";
import type { SpStatComponent } from "./sp-stat.js";

export function statTemplate(this: SpStatComponent): TemplateResult {
  return html`
    <div class="sp-stat">
      ${this.label ? html`<span class="sp-stat-label">${this.label}</span>` : nothing}
      <div class="sp-stat-value-row">
        ${this.prefix ? html`<span class="sp-stat-prefix">${this.prefix}</span>` : nothing}
        <span class="sp-stat-value"><slot>${this.value}</slot></span>
        ${this.suffix ? html`<span class="sp-stat-suffix">${this.suffix}</span>` : nothing}
      </div>
      ${this.trendValue
        ? html`
            <div
              class=${classMap({
                "sp-stat-trend": true,
                [`sp-stat-trend--${this.trend}`]: true,
              })}
            >
              <span class="sp-stat-trend-icon">${this.trend === "up" ? "↑" : this.trend === "down" ? "↓" : "→"}</span>
              <span class="sp-stat-trend-value">${this.trendValue}</span>
            </div>
          `
        : nothing}
      ${this.description ? html`<span class="sp-stat-description">${this.description}</span>` : nothing}
    </div>
  `;
}
