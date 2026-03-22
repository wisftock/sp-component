import { LitElement, unsafeCSS } from "lit";
import { customElement, property } from "lit/decorators.js";
import styles from "./sp-number-input.css?inline";
import { numberInputTemplate } from "./sp-number-input.template.js";
import type { SpNumberInputSize } from "./sp-number-input.types.js";

/**
 * Reusable number input component with increment/decrement buttons.
 *
 * @element sp-number-input
 *
 * @prop {number}              value       - Current numeric value
 * @prop {number}              min         - Minimum value (default -Infinity)
 * @prop {number}              max         - Maximum value (default Infinity)
 * @prop {number}              step        - Step increment (default 1)
 * @prop {boolean}             disabled    - Disables the component
 * @prop {boolean}             readonly    - Makes the input read-only
 * @prop {boolean}             required    - Marks as required
 * @prop {string}              name        - Native input name for form submission
 * @prop {SpNumberInputSize}   size        - Size: sm | md | lg
 * @prop {string}              label       - Label text
 * @prop {string}              hint        - Hint text (shown when no error)
 * @prop {string}              error       - Error message
 * @prop {string}              placeholder - Placeholder text
 *
 * @fires {CustomEvent<{ value: number }>} sp-input  - Emitted on every input change
 * @fires {CustomEvent<{ value: number }>} sp-change - Emitted on confirmed change
 */
@customElement("sp-number-input")
export class SpNumberInputComponent extends LitElement {
  static override styles = unsafeCSS(styles);
  static formAssociated = true;

  readonly #internals: ElementInternals;
  #initialValue = 0;

  constructor() {
    super();
    this.#internals = this.attachInternals();
  }

  @property({ type: Number })
  value = 0;

  @property({ type: Number, attribute: "min" })
  min: number = -Infinity;

  @property({ type: Number, attribute: "max" })
  max: number = Infinity;

  @property({ type: Number })
  step = 1;

  @property({ type: Boolean, reflect: true })
  disabled = false;

  @property({ type: Boolean, reflect: true })
  readonly = false;

  @property({ type: Boolean, reflect: true })
  required = false;

  @property({ type: String })
  name = "";

  @property({ type: String, reflect: true })
  size: SpNumberInputSize = "md";

  @property({ type: String })
  label = "";

  @property({ type: String })
  hint = "";

  @property({ type: String })
  error = "";

  @property({ type: String })
  placeholder = "";

  override connectedCallback(): void {
    super.connectedCallback();
    this.#initialValue = this.value;
  }

  override render() {
    return numberInputTemplate.call(this);
  }

  override updated(changedProperties: Map<string, unknown>): void {
    if (changedProperties.has("value") || changedProperties.has("required")) {
      this.#internals.setFormValue(String(this.value));
      if (this.required && this.value === null) {
        this.#internals.setValidity(
          { valueMissing: true },
          "This field is required",
        );
      } else {
        this.#internals.setValidity({});
      }
    }
  }

  formResetCallback(): void {
    this.value = this.#initialValue;
    this.#internals.setFormValue(String(this.value));
  }

  _increment(): void {
    if (this.disabled || this.readonly) return;
    this.value = Math.min(this.max, this.value + this.step);
    this.dispatchEvent(
      new CustomEvent("sp-change", {
        detail: { value: this.value },
        bubbles: true,
        composed: true,
      }),
    );
  }

  _decrement(): void {
    if (this.disabled || this.readonly) return;
    this.value = Math.max(this.min, this.value - this.step);
    this.dispatchEvent(
      new CustomEvent("sp-change", {
        detail: { value: this.value },
        bubbles: true,
        composed: true,
      }),
    );
  }

  _handleInput(e: Event): void {
    const input = e.target as HTMLInputElement;
    const parsed = parseFloat(input.value);
    if (!isNaN(parsed)) {
      this.value = Math.min(this.max, Math.max(this.min, parsed));
    }
    this.dispatchEvent(
      new CustomEvent("sp-input", {
        detail: { value: this.value },
        bubbles: true,
        composed: true,
      }),
    );
  }

  _handleChange(e: Event): void {
    const input = e.target as HTMLInputElement;
    const parsed = parseFloat(input.value);
    if (!isNaN(parsed)) {
      this.value = Math.min(this.max, Math.max(this.min, parsed));
    }
    this.dispatchEvent(
      new CustomEvent("sp-change", {
        detail: { value: this.value },
        bubbles: true,
        composed: true,
      }),
    );
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "sp-number-input": SpNumberInputComponent;
  }
}
