import { LitElement, unsafeCSS } from "lit";
import { customElement, property } from "lit/decorators.js";
import styles from "./sp-radio.css?inline";
import { radioTemplate } from "./sp-radio.template.js";
import type { SpRadioSize } from "./sp-radio.types.js";

/**
 * Radio button component. Use inside sp-radio-group for grouped behavior.
 *
 * @element sp-radio
 *
 * @prop {string}        value    - The value of this radio option
 * @prop {boolean}       checked  - Whether this radio is selected
 * @prop {boolean}       disabled - Disables the radio
 * @prop {SpRadioSize}   size     - Size: sm | md | lg
 * @prop {string}        label    - Label text (uses slot if not provided)
 * @prop {string}        name        - Native input name (set by sp-radio-group)
 * @prop {string}        description - Small description text rendered below the label
 * @prop {string}        hint        - Hint text shown below the radio (hidden when error is set)
 *
 * @fires {CustomEvent<{ value: string }>} sp-change - Emitted when this radio is selected
 *
 * @slot - Label content (used when label prop is not set)
 */
@customElement("sp-radio")
export class SpRadioComponent extends LitElement {
  static override styles = unsafeCSS(styles);
  static formAssociated = true;

  readonly #internals: ElementInternals;

  constructor() {
    super();
    this.#internals = this.attachInternals();
  }

  @property({ type: String })
  value = "";

  @property({ type: Boolean, reflect: true })
  checked = false;

  @property({ type: Boolean, reflect: true })
  disabled = false;

  @property({ type: String, reflect: true })
  size: SpRadioSize = "md";

  @property({ type: String })
  label = "";

  @property({ type: String })
  name = "";

  @property({ type: String })
  error = "";

  @property({ type: String })
  hint = "";

  @property({ type: String })
  description = "";

  override render() {
    return radioTemplate.call(this);
  }

  override updated(): void {
    this.#internals.setFormValue(this.checked ? this.value : null);
  }

  readonly _handleChange = (e: Event): void => {
    const input = e.target as HTMLInputElement;
    if (input.checked) {
      this.checked = true;
      this.dispatchEvent(
        new CustomEvent("sp-change", {
          detail: { value: this.value },
          bubbles: true,
          composed: true,
        }),
      );
    }
  };
}

declare global {
  interface HTMLElementTagNameMap {
    "sp-radio": SpRadioComponent;
  }
}
