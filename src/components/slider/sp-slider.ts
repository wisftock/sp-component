import { LitElement, unsafeCSS } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import styles from "./sp-slider.css?inline";
import { sliderTemplate } from "./sp-slider.template.js";
import type { SpSliderMark, SpSliderSize } from "./sp-slider.types.js";

/**
 * Reusable slider (range input) component.
 *
 * @element sp-slider
 *
 * @prop {number}         value     - Current value (single mode)
 * @prop {number}         min       - Minimum value
 * @prop {number}         max       - Maximum value
 * @prop {number}         step      - Step increment
 * @prop {boolean}        disabled  - Disables the slider
 * @prop {SpSliderSize}   size      - Size: sm | md | lg
 * @prop {string}         label     - Label text
 * @prop {boolean}        showValue - Shows the current value next to the label
 * @prop {string}         error     - Error message
 * @prop {string}         hint      - Hint message
 * @prop {boolean}        range     - Enables range mode with two thumbs
 * @prop {SpSliderMark[]} marks     - Tick marks on the track
 *
 * @fires {CustomEvent<{ value: number }>}            sp-input  - Emitted on every input change (single mode)
 * @fires {CustomEvent<{ value: number }>}            sp-change - Emitted when the value is committed (single mode)
 * @fires {CustomEvent<{ value: [number, number] }>}  sp-change - Emitted when value is committed (range mode)
 */
@customElement("sp-slider")
export class SpSliderComponent extends LitElement {
  static override styles = unsafeCSS(styles);
  static formAssociated = true;

  readonly #internals: ElementInternals;

  constructor() {
    super();
    this.#internals = this.attachInternals();
  }

  @property({ type: String })
  name = "";

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

  @property({ type: Boolean, reflect: true })
  range = false;

  @property({ type: Array })
  marks: SpSliderMark[] = [];

  /** Range low value (start thumb) */
  @state()
  rangeStart = 0;

  /** Range high value (end thumb) */
  @state()
  rangeEnd = 100;

  get percentage(): number {
    return ((this.value - this.min) / (this.max - this.min)) * 100;
  }

  get rangeStartPercentage(): number {
    return ((this.rangeStart - this.min) / (this.max - this.min)) * 100;
  }

  get rangeEndPercentage(): number {
    return ((this.rangeEnd - this.min) / (this.max - this.min)) * 100;
  }

  readonly _handleInput = (e: Event) => {
    this.value = Number((e.target as HTMLInputElement).value);
    this.dispatchEvent(new CustomEvent("sp-input", { detail: { value: this.value }, bubbles: true, composed: true }));
  };

  readonly _handleChange = (e: Event) => {
    this.value = Number((e.target as HTMLInputElement).value);
    this.#internals.setFormValue(String(this.value));
    this.dispatchEvent(new CustomEvent("sp-change", { detail: { value: this.value }, bubbles: true, composed: true }));
  };

  readonly _handleRangeStartInput = (e: Event) => {
    const v = Number((e.target as HTMLInputElement).value);
    this.rangeStart = Math.min(v, this.rangeEnd);
    this.dispatchEvent(new CustomEvent("sp-input", { detail: { value: [this.rangeStart, this.rangeEnd] as [number, number] }, bubbles: true, composed: true }));
  };

  readonly _handleRangeEndInput = (e: Event) => {
    const v = Number((e.target as HTMLInputElement).value);
    this.rangeEnd = Math.max(v, this.rangeStart);
    this.dispatchEvent(new CustomEvent("sp-input", { detail: { value: [this.rangeStart, this.rangeEnd] as [number, number] }, bubbles: true, composed: true }));
  };

  readonly _handleRangeStartChange = (e: Event) => {
    const v = Number((e.target as HTMLInputElement).value);
    this.rangeStart = Math.min(v, this.rangeEnd);
    this.#internals.setFormValue(`${this.rangeStart},${this.rangeEnd}`);
    this.dispatchEvent(new CustomEvent("sp-change", { detail: { value: [this.rangeStart, this.rangeEnd] as [number, number] }, bubbles: true, composed: true }));
  };

  readonly _handleRangeEndChange = (e: Event) => {
    const v = Number((e.target as HTMLInputElement).value);
    this.rangeEnd = Math.max(v, this.rangeStart);
    this.#internals.setFormValue(`${this.rangeStart},${this.rangeEnd}`);
    this.dispatchEvent(new CustomEvent("sp-change", { detail: { value: [this.rangeStart, this.rangeEnd] as [number, number] }, bubbles: true, composed: true }));
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
