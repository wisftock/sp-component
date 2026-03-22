import { html, type TemplateResult } from "lit";
import { classMap } from "lit/directives/class-map.js";
import { repeat } from "lit/directives/repeat.js";
import type { SpSkeletonComponent } from "./sp-skeleton.js";

/**
 * HTML template for sp-skeleton.
 *
 * Call as: skeletonTemplate.call(this) inside render()
 */
export function skeletonTemplate(this: SpSkeletonComponent): TemplateResult {
  const isAnimated = this.animated && this.shimmer;
  const classes = {
    "sp-skeleton": true,
    "sp-skeleton--animated": isAnimated,
  };

  if (this.variant === "text") {
    const count = Math.max(1, this.lines);
    return html`
      <div class=${classMap({ ...classes, "sp-skeleton-text-lines": true })} aria-hidden="true" style=${this._buildStyle()}>
        ${repeat(
          Array.from({ length: count }, (_, i) => i),
          (i) => i,
          (i) => html`
            <div
              class=${classMap({
                ...classes,
                "sp-skeleton--text-line": true,
                "sp-skeleton--text-line-last": i === count - 1,
              })}
            ></div>
          `,
        )}
      </div>
    `;
  }

  if (this.variant === "title") {
    return html`
      <div
        class=${classMap({ ...classes, "sp-skeleton--title": true })}
        style=${this._buildStyle()}
        aria-hidden="true"
      ></div>
    `;
  }

  return html`
    <div
      class=${classMap(classes)}
      style=${this._buildStyle()}
      aria-hidden="true"
    ></div>
  `;
}
