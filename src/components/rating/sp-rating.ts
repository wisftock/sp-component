import { LitElement, unsafeCSS } from "lit";
import { customElement, property } from "lit/decorators.js";
import styles from "./sp-rating.css?inline";
import { ratingTemplate } from "./sp-rating.template.js";
import type { SpRatingSize } from "./sp-rating.types.js";

/**
 * Reusable star rating component.
 *
 * @element sp-rating
 *
 * @prop {number}       value     - Current rating value
 * @prop {number}       max       - Maximum number of stars
 * @prop {number}       precision - 1 = whole stars, 0.5 = half stars
 * @prop {boolean}      disabled  - Disables the rating
 * @prop {boolean}      readonly  - Makes the rating read-only
 * @prop {SpRatingSize} size      - Size: sm | md | lg
 * @prop {string}       label     - Accessible aria-label for the group
 *
 * @fires {CustomEvent<{ value: number }>} sp-change - Emitted when a star is clicked
 */
@customElement("sp-rating")
export class SpRatingComponent extends LitElement {
  static override styles = unsafeCSS(styles);

  @property({ type: Number })
  value = 0;

  @property({ type: Number })
  max = 5;

  @property({ type: Number })
  precision = 1;

  @property({ type: Boolean, reflect: true })
  disabled = false;

  @property({ type: Boolean, reflect: true })
  readonly = false;

  @property({ type: String, reflect: true })
  size: SpRatingSize = "md";

  @property({ type: String })
  label = "Rating";

  private _hoverValue = 0;

  _getStars(): Array<{ index: number; fill: number }> {
    const displayValue = this._hoverValue || this.value;
    return Array.from({ length: this.max }, (_, i) => {
      const fill = Math.min(1, Math.max(0, displayValue - i));
      return { index: i + 1, fill };
    });
  }

  readonly _handleClick = (value: number) => {
    if (this.disabled || this.readonly) return;
    this.value = value;
    this.dispatchEvent(new CustomEvent("sp-change", { detail: { value }, bubbles: true, composed: true }));
  };

  readonly _handleHover = (value: number) => {
    if (!this.disabled && !this.readonly) {
      this._hoverValue = value;
      this.requestUpdate();
    }
  };

  readonly _handleLeave = () => {
    this._hoverValue = 0;
    this.requestUpdate();
  };

  override render() {
    return ratingTemplate.call(this);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "sp-rating": SpRatingComponent;
  }
}
