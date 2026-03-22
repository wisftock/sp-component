import { LitElement, unsafeCSS } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import styles from "./sp-otp-input.css?inline";
import { otpInputTemplate } from "./sp-otp-input.template.js";
import type { SpOtpInputProps, SpOtpInputType } from "./sp-otp-input.types.js";

/**
 * One-time password (OTP) input component with individual digit cells.
 *
 * @element sp-otp-input
 *
 * @prop {number}          length      - Number of OTP digits (default 6)
 * @prop {string}          value       - Current value
 * @prop {boolean}         disabled    - Disables all inputs
 * @prop {boolean}         invalid     - Marks inputs as invalid
 * @prop {boolean}         required    - Marks the field as required
 * @prop {SpOtpInputType}  inputType   - Input type: text | number | password
 * @prop {string}          placeholder - Placeholder for each cell
 * @prop {string}          label       - Accessible label
 * @prop {string}          size        - Size: sm | md | lg
 *
 * @fires {CustomEvent<{ value: string }>} sp-change   - Emitted when any digit changes
 * @fires {CustomEvent<{ value: string }>} sp-complete - Emitted when all digits are filled
 */
@customElement("sp-otp-input")
export class SpOtpInputComponent extends LitElement implements SpOtpInputProps {
  static override styles = unsafeCSS(styles);
  static formAssociated = true;

  readonly #internals: ElementInternals;

  constructor() {
    super();
    this.#internals = this.attachInternals();
  }

  @property({ type: Number })
  length: number = 6;

  @property({ type: String, reflect: true })
  value: string = "";

  @property({ type: Boolean, reflect: true })
  disabled: boolean = false;

  @property({ type: Boolean, reflect: true })
  invalid: boolean = false;

  @property({ type: Boolean, reflect: true })
  required: boolean = false;

  @property({ type: String, attribute: "input-type" })
  inputType: SpOtpInputType = "text";

  @property({ type: String })
  placeholder: string = "·";

  @property({ type: String })
  label: string = "One-time password";

  @property({ type: String, reflect: true })
  size: SpOtpInputProps["size"] = "md";

  @property({ type: Boolean, attribute: "auto-submit" })
  autoSubmit: boolean = false;

  @property({ type: String })
  separator: string = "";

  @property({ type: Number, attribute: "separator-index" })
  separatorIndex: number = -1;

  @state()
  _values: string[] = [];

  override willUpdate(changedProperties: Map<string, unknown>): void {
    if (changedProperties.has("value") || changedProperties.has("length")) {
      this._values = Array.from({ length: this.length }, (_, i) => this.value[i] ?? "");
    }
  }

  override updated(changedProperties: Map<string, unknown>): void {
    super.updated(changedProperties);
    if (changedProperties.has("value") || changedProperties.has("required") || changedProperties.has("length")) {
      this.#internals.setFormValue(this.value);
      const isComplete = this.value.length === this.length && this._values.every(v => v !== "");
      if (isComplete) {
        this.#internals.setValidity({});
      } else if (this.required) {
        this.#internals.setValidity({ valueMissing: true }, "Please complete the code");
      } else {
        this.#internals.setValidity({});
      }
    }
  }

  private _getInputs(): NodeListOf<HTMLInputElement> {
    return this.shadowRoot!.querySelectorAll<HTMLInputElement>(".sp-otp-cell");
  }

  private _focusInput(index: number): void {
    const inputs = this._getInputs();
    const target = inputs[index];
    if (target) {
      target.focus();
      // Select any existing value to allow overwriting
      target.select();
    }
  }

  private _emitChange(values: string[]): void {
    const current = values.join("");
    this.value = current;
    this.#internals.setFormValue(current);
    const isComplete = current.length === this.length && values.every((v) => v !== "");
    if (isComplete) {
      this.#internals.setValidity({});
    } else if (this.required) {
      this.#internals.setValidity({ valueMissing: true }, "Please complete the code");
    } else {
      this.#internals.setValidity({});
    }

    this.dispatchEvent(
      new CustomEvent("sp-change", {
        bubbles: true,
        composed: true,
        detail: { value: current },
      }),
    );

    if (isComplete) {
      this.dispatchEvent(
        new CustomEvent("sp-complete", {
          bubbles: true,
          composed: true,
          detail: { value: current },
        }),
      );
    }
  }

  _handleInput(e: Event, index: number): void {
    if (this.disabled) return;

    const input = e.target as HTMLInputElement;
    // Take only the last character in case browser allowed more
    const char = input.value.slice(-1);
    input.value = char;

    const newValues = [...this._values];
    newValues[index] = char;
    this._values = newValues;

    if (char && index < this.length - 1) {
      this._focusInput(index + 1);
    }

    this._emitChange(newValues);
  }

  _handleKeydown(e: KeyboardEvent, index: number): void {
    if (this.disabled) return;

    if (e.key === "Backspace") {
      const input = e.target as HTMLInputElement;
      if (!input.value && index > 0) {
        // Focus previous and clear it
        const newValues = [...this._values];
        newValues[index - 1] = "";
        this._values = newValues;
        this._focusInput(index - 1);
        e.preventDefault();
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      this._focusInput(index - 1);
      e.preventDefault();
    } else if (e.key === "ArrowRight" && index < this.length - 1) {
      this._focusInput(index + 1);
      e.preventDefault();
    }
  }

  _handlePaste(e: ClipboardEvent, startIndex: number): void {
    if (this.disabled) return;
    e.preventDefault();

    const pasted = (e.clipboardData?.getData("text") ?? "")
      .replace(/\s/g, "")
      .slice(0, this.length - startIndex);

    if (!pasted) return;

    const newValues = [...this._values];
    for (let i = 0; i < pasted.length; i++) {
      if (startIndex + i < this.length) {
        newValues[startIndex + i] = pasted[i] ?? "";
      }
    }
    this._values = newValues;

    // Update the actual input values and focus the next empty or last cell
    this.updateComplete.then(() => {
      const nextEmpty = newValues.findIndex((v, i) => i >= startIndex && !v);
      const focusIdx = nextEmpty === -1 ? this.length - 1 : nextEmpty;
      this._focusInput(focusIdx);
    });

    this._emitChange(newValues);
  }

  _handleFocus(_e: FocusEvent, _index: number): void {
    // Select existing content so it can be overwritten
    (_e.target as HTMLInputElement).select();
  }

  override render() {
    return otpInputTemplate.call(this);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "sp-otp-input": SpOtpInputComponent;
  }
}
