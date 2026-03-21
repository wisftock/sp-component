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

  @property({ type: String })
  label = "";

  @property({ type: String })
  hint = "";

  override render() {
    return switchTemplate.call(this);
  }

  override updated(): void {
    this.#internals.setFormValue(this.checked ? (this.value || "on") : null);
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
