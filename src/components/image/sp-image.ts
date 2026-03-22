import { LitElement, unsafeCSS } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import styles from "./sp-image.css?inline";
import { imageTemplate } from "./sp-image.template.js";
import type { SpImageFit } from "./sp-image.types.js";

/**
 * Image component with skeleton loading, fallback support and aspect ratio enforcement.
 *
 * @element sp-image
 *
 * @prop {string}      src      - Image source URL
 * @prop {string}      alt      - Alternative text (default "")
 * @prop {string}      width    - CSS width value (e.g. "300px", "100%")
 * @prop {string}      height   - CSS height value
 * @prop {SpImageFit}  fit      - Object-fit value: cover | contain | fill | none
 * @prop {string}      ratio    - Aspect ratio (e.g. "16/9", "1/1")
 * @prop {boolean}     lazy     - Use loading="lazy" (default true)
 * @prop {string}      fallback - Fallback src on load error
 * @prop {boolean}     rounded  - Apply 50% border-radius (for avatars)
 *
 * @fires {CustomEvent} sp-load  - Emitted when image loads successfully
 * @fires {CustomEvent} sp-error - Emitted when image fails to load
 *
 * @slot fallback - Content shown when image fails to load
 *
 * @csspart image   - The inner <img> element
 * @csspart wrapper - The wrapper <div>
 */
@customElement("sp-image")
export class SpImageComponent extends LitElement {
  static override styles = unsafeCSS(styles);

  @property({ type: String })
  src = "";

  @property({ type: String })
  alt = "";

  @property({ type: String })
  width = "";

  @property({ type: String })
  height = "";

  @property({ type: String, reflect: true })
  fit: SpImageFit = "cover";

  @property({ type: String })
  ratio = "";

  @property({ type: Boolean })
  lazy = true;

  @property({ type: String })
  fallback = "";

  @property({ type: Boolean, reflect: true })
  rounded = false;

  @state()
  _loaded = false;

  @state()
  _error = false;

  override updated(changedProperties: Map<string, unknown>): void {
    if (changedProperties.has("src")) {
      // Reset state when src changes
      this._loaded = false;
      this._error = false;
    }
  }

  override render() {
    return imageTemplate.call(this);
  }

  _handleLoad(): void {
    this._loaded = true;
    this._error = false;
    this.dispatchEvent(
      new CustomEvent("sp-load", {
        bubbles: true,
        composed: true,
      }),
    );
  }

  _handleError(): void {
    if (this.fallback && !this._error) {
      // Try fallback src
      const img = this.shadowRoot?.querySelector(".sp-image") as HTMLImageElement | null;
      if (img && img.src !== this.fallback) {
        img.src = this.fallback;
        return;
      }
    }
    this._error = true;
    this._loaded = false;
    this.dispatchEvent(
      new CustomEvent("sp-error", {
        bubbles: true,
        composed: true,
      }),
    );
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "sp-image": SpImageComponent;
  }
}
