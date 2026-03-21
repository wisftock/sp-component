import { LitElement, unsafeCSS } from "lit";
import { customElement, property } from "lit/decorators.js";
import styles from "./sp-skeleton.css?inline";
import { skeletonTemplate } from "./sp-skeleton.template.js";
import type { SpSkeletonVariant } from "./sp-skeleton.types.js";

/**
 * Skeleton loader component for content placeholders.
 *
 * @element sp-skeleton
 *
 * @prop {SpSkeletonVariant} variant  - Shape: text | circle | rect
 * @prop {string}            width    - CSS width value (e.g. "200px", "100%")
 * @prop {string}            height   - CSS height value (e.g. "16px", "48px")
 * @prop {boolean}           animated - Enables shimmer animation (default true)
 */
@customElement("sp-skeleton")
export class SpSkeletonComponent extends LitElement {
  static override styles = unsafeCSS(styles);

  @property({ type: String, reflect: true })
  variant: SpSkeletonVariant = "text";

  @property({ type: String })
  width = "";

  @property({ type: String })
  height = "";

  @property({ type: Boolean, reflect: true })
  animated = true;

  /** Builds the inline style string from width/height props. */
  _buildStyle(): string {
    const parts: string[] = [];
    if (this.width) parts.push(`width: ${this.width}`);
    if (this.height) parts.push(`height: ${this.height}`);
    return parts.join("; ");
  }

  override render() {
    return skeletonTemplate.call(this);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "sp-skeleton": SpSkeletonComponent;
  }
}
