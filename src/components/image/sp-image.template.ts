import { html, nothing, type TemplateResult } from "lit";
import type { SpImageComponent } from "./sp-image.js";

/**
 * HTML template for sp-image.
 * Call as: imageTemplate.call(this) inside render()
 */
export function imageTemplate(this: SpImageComponent): TemplateResult {
  const wrapperClasses = [
    "sp-image-wrapper",
    this.rounded ? "sp-image--rounded" : "",
  ]
    .filter(Boolean)
    .join(" ");

  const imgClasses = [
    "sp-image",
    this._loaded ? "sp-image--loaded" : "",
    this._error ? "sp-image--error" : "",
  ]
    .filter(Boolean)
    .join(" ");

  const wrapperStyle = [
    this.ratio ? `aspect-ratio: ${this.ratio}` : "",
  ]
    .filter(Boolean)
    .join("; ");

  const imgStyle = [
    `object-fit: ${this.fit}`,
    `width: ${this.width || "100%"}`,
    `height: ${this.height || "100%"}`,
  ].join("; ");

  return html`
    <div
      class=${wrapperClasses}
      style=${wrapperStyle || nothing}
    >
      <img
        class=${imgClasses}
        src=${this.src || nothing}
        alt=${this.alt}
        loading=${this.lazy ? "lazy" : "eager"}
        style=${imgStyle}
        @error=${() => this._handleError()}
        @load=${() => this._handleLoad()}
      />

      <div
        class="sp-image-skeleton"
        ?hidden=${this._loaded || this._error}
      ></div>

      ${this._error
        ? html`
            <slot name="fallback">
              <div class="sp-image-fallback">&#9888;</div>
            </slot>
          `
        : nothing}
    </div>
  `;
}
