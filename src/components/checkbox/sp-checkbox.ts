import { LitElement, unsafeCSS } from "lit";
import { customElement, property } from "lit/decorators.js";
import styles from "./sp-checkbox.css?inline";
import { checkboxTemplate } from "./sp-checkbox.template.js";
import type { SpCheckboxSize } from "./sp-checkbox.types.js";

/**
 * Checkbox component with support for indeterminate state.
 *
 * @element sp-checkbox
 *
 * @prop {boolean}         checked       - Whether the checkbox is checked
 * @prop {boolean}         indeterminate - Whether the checkbox is in indeterminate state
 * @prop {boolean}         disabled      - Disables the checkbox
 * @prop {boolean}         required      - Marks the checkbox as required
 * @prop {string}          name          - Native input name
 * @prop {string}          value         - Native input value
 * @prop {SpCheckboxSize}  size          - Size: sm | md | lg
 * @prop {string}          label         - Label text (uses slot if not provided)
 * @prop {string}          error         - Error message shown below the checkbox
 * @prop {string}          hint          - Hint text shown below the checkbox (hidden when error is set)
 *
 * @fires {CustomEvent<{ checked: boolean, indeterminate: boolean }>} sp-change - Emitted when the checkbox state changes
 *
 * @slot - Label content (used when label prop is not set)
 */
@customElement("sp-checkbox")
export class SpCheckboxComponent extends LitElement {
  static override styles = unsafeCSS(styles);

  @property({ type: Boolean, reflect: true })
  checked = false;

  @property({ type: Boolean, reflect: true })
  indeterminate = false;

  @property({ type: Boolean, reflect: true })
  disabled = false;

  @property({ type: Boolean })
  required = false;

  @property({ type: String })
  name = "";

  @property({ type: String })
  value = "";

  @property({ type: String, reflect: true })
  size: SpCheckboxSize = "md";

  @property({ type: String })
  label = "";

  @property({ type: String })
  error = "";

  @property({ type: String })
  hint = "";

  override render() {
    return checkboxTemplate.call(this);
  }

  readonly _handleChange = (e: Event): void => {
    const input = e.target as HTMLInputElement;
    this.checked = input.checked;
    this.indeterminate = input.indeterminate;
    this.dispatchEvent(
      new CustomEvent("sp-change", {
        detail: { checked: this.checked, indeterminate: this.indeterminate },
        bubbles: true,
        composed: true,
      }),
    );
  };
}

declare global {
  interface HTMLElementTagNameMap {
    "sp-checkbox": SpCheckboxComponent;
  }
}
