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
 * @prop {string}              prefix      - Inline prefix text (e.g. "$")
 * @prop {string}              suffix      - Inline suffix text (e.g. "%")
 * @prop {boolean}             fullWidth   - Makes the control full-width
 * @prop {Function}            formatter   - Custom display formatter (value: number) => string
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
  #longPressTimer: ReturnType<typeof setTimeout> | null = null;
  #rapidInterval: ReturnType<typeof setInterval> | null = null;

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

  @property({ type: String })
  prefix = "";

  @property({ type: String })
  suffix = "";

  @property({ type: Boolean, reflect: true })
  fullWidth = false;

  /** Custom display formatter: (value: number) => string */
  formatter: ((value: number) => string) | null = null;

  /** Returns the display string for the current value, applying formatter if set. */
  _getDisplayValue(): string {
    if (this.formatter) {
      return this.formatter(this.value);
    }
    return String(this.value);
  }

  override connectedCallback(): void {
    super.connectedCallback();
    this.#initialValue = this.value;
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this._clearLongPress();
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

  /** Start long-press acceleration for increment button */
  _handleIncMouseDown(): void {
    if (this.disabled || this.readonly) return;
    this.#longPressTimer = setTimeout(() => {
      this.#rapidInterval = setInterval(() => {
        this._increment();
      }, 100);
    }, 500);
  }

  /** Start long-press acceleration for decrement button */
  _handleDecMouseDown(): void {
    if (this.disabled || this.readonly) return;
    this.#longPressTimer = setTimeout(() => {
      this.#rapidInterval = setInterval(() => {
        this._decrement();
      }, 100);
    }, 500);
  }

  /** Clear long-press timers */
  _clearLongPress(): void {
    if (this.#longPressTimer) {
      clearTimeout(this.#longPressTimer);
      this.#longPressTimer = null;
    }
    if (this.#rapidInterval) {
      clearInterval(this.#rapidInterval);
      this.#rapidInterval = null;
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "sp-number-input": SpNumberInputComponent;
  }
}
