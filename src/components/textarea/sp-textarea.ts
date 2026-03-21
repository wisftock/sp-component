import { LitElement, unsafeCSS } from "lit";
import { customElement, property } from "lit/decorators.js";
import styles from "./sp-textarea.css?inline";
import { textareaTemplate } from "./sp-textarea.template.js";
import type { SpTextareaResize } from "./sp-textarea.types.js";

/**
 * Reusable textarea component compatible with any web framework.
 *
 * @element sp-textarea
 *
 * @prop {string}            value       - Current value
 * @prop {string}            placeholder - Placeholder text
 * @prop {boolean}           disabled    - Disables the textarea
 * @prop {boolean}           readonly    - Makes the textarea read-only
 * @prop {boolean}           required    - Marks the textarea as required
 * @prop {string}            name        - Native textarea name
 * @prop {number}            rows        - Number of visible rows (default 3)
 * @prop {number}            maxlength   - Maximum character length (0 = no limit)
 * @prop {SpTextareaResize}  resize      - Resize behavior: none | vertical | horizontal | both
 * @prop {string}            error       - Error message shown below the textarea
 * @prop {string}            hint        - Hint text shown below the textarea (when no error)
 * @prop {string}            label       - Label text shown above the textarea
 *
 * @fires {CustomEvent<{ value: string }>} sp-input  - Emitted on every keystroke
 * @fires {CustomEvent<{ value: string }>} sp-change - Emitted on change
 * @fires {CustomEvent}                    sp-focus  - Emitted on focus
 * @fires {CustomEvent}                    sp-blur   - Emitted on blur
 *
 * @csspart textarea - The inner <textarea> element
 */
@customElement("sp-textarea")
export class SpTextareaComponent extends LitElement {
  static override styles = unsafeCSS(styles);
  static formAssociated = true;

  readonly #internals: ElementInternals;

  constructor() {
    super();
    this.#internals = this.attachInternals();
  }

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

  @property({ type: Number })
  rows = 3;

  @property({ type: Number })
  maxlength = 0;

  @property({ type: String, reflect: true })
  resize: SpTextareaResize = "vertical";

  @property({ type: String })
  error = "";

  @property({ type: String })
  hint = "";

  @property({ type: String })
  label = "";

  override render() {
    return textareaTemplate.call(this);
  }

  readonly _handleInput = (e: Event) => {
    const textarea = e.target as HTMLTextAreaElement;
    this.value = textarea.value;
    this.dispatchEvent(
      new CustomEvent("sp-input", {
        detail: { value: this.value },
        bubbles: true,
        composed: true,
      }),
    );
  };

  readonly _handleChange = (e: Event) => {
    const textarea = e.target as HTMLTextAreaElement;
    this.value = textarea.value;
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

  override updated(changedProperties: Map<string, unknown>) {
    if (changedProperties.has("value")) {
      this.#internals.setFormValue(this.value);
    }
    if (changedProperties.has("value") || changedProperties.has("required")) {
      if (this.required && !this.value) {
        this.#internals.setValidity({ valueMissing: true }, "This field is required");
      } else {
        this.#internals.setValidity({});
      }
    }
  }

  formResetCallback(): void {
    this.value = "";
    this.#internals.setFormValue("");
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "sp-textarea": SpTextareaComponent;
  }
}
