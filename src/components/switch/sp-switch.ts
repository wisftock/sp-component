import { LitElement, unsafeCSS } from "lit";
import { customElement, property } from "lit/decorators.js";
import styles from "./sp-switch.css?inline";
import { switchTemplate } from "./sp-switch.template.js";
import type { SpSwitchSize } from "./sp-switch.types.js";

/**
 * Toggle switch component.
 *
 * @element sp-switch
 *
 * @prop {boolean}       checked  - Whether the switch is on
 * @prop {boolean}       disabled - Disables the switch
 * @prop {string}        name     - Native input name
 * @prop {string}        value    - Native input value (default "on")
 * @prop {SpSwitchSize}  size     - Size: sm | md | lg
 * @prop {string}        label    - Label text (uses slot if not provided)
 * @prop {string}        hint     - Hint text shown below the switch
 *
 * @fires {CustomEvent<{ checked: boolean }>} sp-change - Emitted when the switch state changes
 *
 * @slot - Label content (used when label prop is not set)
 */
@customElement("sp-switch")
export class SpSwitchComponent extends LitElement {
  static override styles = unsafeCSS(styles);
  static formAssociated = true;

  readonly #internals: ElementInternals;

  constructor() {
    super();
    this.#internals = this.attachInternals();
  }

  @property({ type: Boolean, reflect: true })
  checked = false;

  @property({ type: Boolean, reflect: true })
  disabled = false;

  @property({ type: String })
  name = "";

  @property({ type: String })
  value = "on";

  @property({ type: String, reflect: true })
  size: SpSwitchSize = "md";

  /** Label shown inside the track when checked */
  @property({ type: String, attribute: "on-label" })
  onLabel = "";

  /** Label shown inside the track when unchecked */
  @property({ type: String, attribute: "off-label" })
  offLabel = "";

  @property({ type: String })
  label = "";

  @property({ type: String })
  hint = "";

  override render() {
    return switchTemplate.call(this);
  }

  @property({ type: Boolean, reflect: true })
  required = false;

  private _customError = "";

  private _updateValidity(): void {
    if (this._customError) {
      this.#internals.setValidity({ customError: true }, this._customError);
    } else if (this.required && !this.checked) {
      this.#internals.setValidity({ valueMissing: true }, "This field is required");
    } else {
      this.#internals.setValidity({});
    }
  }

  setCustomValidity(message: string): void {
    this._customError = message;
    this._updateValidity();
  }

  checkValidity(): boolean {
    return this.#internals.checkValidity();
  }

  reportValidity(): boolean {
    return this.#internals.reportValidity();
  }

  override updated(): void {
    this.#internals.setFormValue(this.checked ? (this.value || "on") : null);
    this._updateValidity();
  }

  formResetCallback(): void {
    this.checked = false;
    this._customError = "";
    this.#internals.setFormValue(null);
    this.#internals.setValidity({});
  }

  readonly _handleChange = (e: Event): void => {
    const input = e.target as HTMLInputElement;
    this.checked = input.checked;
    this.dispatchEvent(
      new CustomEvent("sp-change", {
        detail: { checked: this.checked },
        bubbles: true,
        composed: true,
      }),
    );
  };
}

declare global {
  interface HTMLElementTagNameMap {
    "sp-switch": SpSwitchComponent;
  }
}
