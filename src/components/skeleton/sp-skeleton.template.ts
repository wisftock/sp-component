import { html, type TemplateResult } from "lit";
import { classMap } from "lit/directives/class-map.js";
import type { SpSkeletonComponent } from "./sp-skeleton.js";

/**
 * HTML template for sp-skeleton.
 *
 * Call as: skeletonTemplate.call(this) inside render()
 */
export function skeletonTemplate(this: SpSkeletonComponent): TemplateResult {
  return html`
    <div
      class=${classMap({
        "sp-skeleton": true,
        "sp-skeleton--animated": this.animated,
      })}
      style=${this._buildStyle()}
      aria-hidden="true"
    ></div>
  `;
}
