import { LitElement, unsafeCSS } from "lit";
import { customElement, property, state } from "lit/decorators.js";
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
  static formAssociated = true;

  readonly #internals: ElementInternals;

  constructor() {
    super();
    this.#internals = this.attachInternals();
  }

  @property({ type: String })
  name = "";

  @property({ type: Boolean })
  required = false;

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

  /** Tooltip labels per star position, e.g. ["Poor","Fair","Good","Very good","Excellent"] */
  @property({ type: Array })
  labels: string[] = [];

  /** Show a clear button to reset to 0 */
  @property({ type: Boolean })
  clearable = false;

  @state() private _hoverValue = 0;

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
    this.#internals.setFormValue(String(value));
    if (this.required && value === 0) {
      this.#internals.setValidity({ valueMissing: true }, "Please select a rating.", undefined);
    } else {
      this.#internals.setValidity({});
    }
    this.dispatchEvent(new CustomEvent("sp-change", { detail: { value }, bubbles: true, composed: true }));
  };

  readonly _handleHover = (value: number) => {
    if (!this.disabled && !this.readonly) {
      this._hoverValue = value;
    }
  };

  readonly _handleLeave = () => {
    this._hoverValue = 0;
  };

  readonly _handleClear = () => {
    if (this.disabled || this.readonly) return;
    this.value = 0;
    this.#internals.setFormValue("0");
    this.dispatchEvent(new CustomEvent("sp-change", { detail: { value: 0 }, bubbles: true, composed: true }));
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
