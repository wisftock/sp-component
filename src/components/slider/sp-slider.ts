import { LitElement, unsafeCSS } from "lit";
import { customElement, property } from "lit/decorators.js";
import styles from "./sp-slider.css?inline";
import { sliderTemplate } from "./sp-slider.template.js";
import type { SpSliderSize } from "./sp-slider.types.js";

/**
 * Reusable slider (range input) component.
 *
 * @element sp-slider
 *
 * @prop {number}       value     - Current value
 * @prop {number}       min       - Minimum value
 * @prop {number}       max       - Maximum value
 * @prop {number}       step      - Step increment
 * @prop {boolean}      disabled  - Disables the slider
 * @prop {SpSliderSize} size      - Size: sm | md | lg
 * @prop {string}       label     - Label text
 * @prop {boolean}      showValue - Shows the current value next to the label
 * @prop {string}       error     - Error message
 * @prop {string}       hint      - Hint message
 *
 * @fires {CustomEvent<{ value: number }>} sp-input  - Emitted on every input change
 * @fires {CustomEvent<{ value: number }>} sp-change - Emitted when the value is committed
 */
@customElement("sp-slider")
export class SpSliderComponent extends LitElement {
  static override styles = unsafeCSS(styles);

  @property({ type: Number })
  value = 0;

  @property({ type: Number })
  min = 0;

  @property({ type: Number })
  max = 100;

  @property({ type: Number })
  step = 1;

  @property({ type: Boolean, reflect: true })
  disabled = false;

  @property({ type: String, reflect: true })
  size: SpSliderSize = "md";

  @property({ type: String })
  label = "";

  @property({ type: Boolean, attribute: "show-value" })
  showValue = false;

  @property({ type: String })
  error = "";

  @property({ type: String })
  hint = "";

  get percentage(): number {
    return ((this.value - this.min) / (this.max - this.min)) * 100;
  }

  readonly _handleInput = (e: Event) => {
    this.value = Number((e.target as HTMLInputElement).value);
    this.dispatchEvent(new CustomEvent("sp-input", { detail: { value: this.value }, bubbles: true, composed: true }));
  };

  readonly _handleChange = (e: Event) => {
    this.value = Number((e.target as HTMLInputElement).value);
    this.dispatchEvent(new CustomEvent("sp-change", { detail: { value: this.value }, bubbles: true, composed: true }));
  };

  override render() {
    return sliderTemplate.call(this);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "sp-slider": SpSliderComponent;
  }
}
