import { LitElement, unsafeCSS } from "lit";
import { customElement, property } from "lit/decorators.js";
import styles from "./sp-input.css?inline";
import { inputTemplate } from "./sp-input.template.js";
import type { SpInputType, SpInputSize } from "./sp-input.types.js";

/**
 * Reusable input component compatible with any web framework.
 *
 * @element sp-input
 *
 * @prop {SpInputType}  type        - Input type: text | email | password | number | search | tel | url
 * @prop {string}       value       - Current value
 * @prop {string}       placeholder - Placeholder text
 * @prop {boolean}      disabled    - Disables the input
 * @prop {boolean}      readonly    - Makes the input read-only
 * @prop {boolean}      required    - Marks the input as required
 * @prop {string}       name        - Native input name
 * @prop {SpInputSize}  size        - Size: sm | md | lg
 * @prop {boolean}      clearable   - Shows clear button when value is set
 * @prop {number}       maxlength   - Maximum character length (0 = no limit)
 * @prop {number}       minlength   - Minimum character length (0 = no limit)
 * @prop {string}       error       - Error message shown below the input
 * @prop {string}       hint        - Hint text shown below the input (when no error)
 * @prop {string}       label       - Label text shown above the input
 *
 * @fires {CustomEvent<{ value: string }>} sp-input  - Emitted on every keystroke
 * @fires {CustomEvent<{ value: string }>} sp-change - Emitted on change
 * @fires {CustomEvent}                    sp-focus  - Emitted on focus
 * @fires {CustomEvent}                    sp-blur   - Emitted on blur
 * @fires {CustomEvent}                    sp-clear  - Emitted when clear button is clicked
 *
 * @slot prefix - Content before the input (e.g. icon)
 * @slot suffix - Content after the input (e.g. icon)
 *
 * @csspart input - The inner <input> element
 */
@customElement("sp-input")
export class SpInputComponent extends LitElement {
  static override styles = unsafeCSS(styles);

  @property({ type: String, reflect: true })
  type: SpInputType = "text";

  @property({ type: String })
  value = "";

  @property({ type: String })
  placeholder = "";

  @property({ type: Boolean, reflect: true })
  disabled = false;

  @property({ type: Boolean, reflect: true })
  readonly = false;

  @property({ type: Boolean, reflect: true })
  required = false;

  @property({ type: String })
  name = "";

  @property({ type: String, reflect: true })
  size: SpInputSize = "md";

  @property({ type: Boolean, reflect: true })
  clearable = false;

  @property({ type: Number })
  maxlength = 0;

  @property({ type: Number })
  minlength = 0;

  @property({ type: String })
  error = "";

  @property({ type: String })
  hint = "";

  @property({ type: String })
  label = "";

  override render() {
    return inputTemplate.call(this);
  }

  readonly _handleInput = (e: Event) => {
    const input = e.target as HTMLInputElement;
    this.value = input.value;
    this.dispatchEvent(
      new CustomEvent("sp-input", {
        detail: { value: this.value },
        bubbles: true,
        composed: true,
      }),
    );
  };

  readonly _handleChange = (e: Event) => {
    const input = e.target as HTMLInputElement;
    this.value = input.value;
    this.dispatchEvent(
      new CustomEvent("sp-change", {
        detail: { value: this.value },
        bubbles: true,
        composed: true,
      }),
    );
  };

  readonly _handleFocus = () =>
    this.dispatchEvent(
      new CustomEvent("sp-focus", { bubbles: true, composed: true }),
    );

  readonly _handleBlur = () =>
    this.dispatchEvent(
      new CustomEvent("sp-blur", { bubbles: true, composed: true }),
    );

  readonly _handleClear = () => {
    this.value = "";
    this.dispatchEvent(
      new CustomEvent("sp-clear", { bubbles: true, composed: true }),
    );
    this.dispatchEvent(
      new CustomEvent("sp-input", {
        detail: { value: "" },
        bubbles: true,
        composed: true,
      }),
    );
  };
}

declare global {
  interface HTMLElementTagNameMap {
    "sp-input": SpInputComponent;
  }
}
