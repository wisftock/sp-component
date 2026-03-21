import { LitElement, unsafeCSS } from "lit";
import { customElement, property } from "lit/decorators.js";
import styles from "./sp-select.css?inline";
import { selectTemplate } from "./sp-select.template.js";
import type { SpSelectSize, SpSelectOption } from "./sp-select.types.js";

/**
 * Reusable select component compatible with any web framework.
 *
 * @element sp-select
 *
 * @prop {string}            value       - Currently selected value
 * @prop {string}            placeholder - Placeholder option text (disabled, selected by default when no value)
 * @prop {boolean}           disabled    - Disables the select
 * @prop {boolean}           required    - Marks the select as required
 * @prop {string}            name        - Native select name
 * @prop {SpSelectSize}      size        - Size: sm | md | lg
 * @prop {boolean}           multiple    - Allows multiple selections
 * @prop {SpSelectOption[]}  options     - Array of option objects with value, label and optional disabled
 * @prop {string}            error       - Error message shown below the select
 * @prop {string}            hint        - Hint text shown below the select (when no error)
 * @prop {string}            label       - Label text shown above the select
 *
 * @fires {CustomEvent<{ value: string }>} sp-change - Emitted on selection change
 * @fires {CustomEvent}                    sp-focus  - Emitted on focus
 * @fires {CustomEvent}                    sp-blur   - Emitted on blur
 *
 * @csspart select - The inner <select> element
 */
@customElement("sp-select")
export class SpSelectComponent extends LitElement {
  static override styles = unsafeCSS(styles);

  @property({ type: String })
  value = "";

  @property({ type: String })
  placeholder = "";

  @property({ type: Boolean, reflect: true })
  disabled = false;

  @property({ type: Boolean, reflect: true })
  required = false;

  @property({ type: String })
  name = "";

  @property({ type: String, reflect: true })
  size: SpSelectSize = "md";

  @property({ type: Boolean })
  multiple = false;

  @property({ type: Array })
  options: SpSelectOption[] = [];

  @property({ type: String })
  error = "";

  @property({ type: String })
  hint = "";

  @property({ type: String })
  label = "";

  override render() {
    return selectTemplate.call(this);
  }

  readonly _handleChange = (e: Event) => {
    const select = e.target as HTMLSelectElement;
    this.value = select.value;
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
}

declare global {
  interface HTMLElementTagNameMap {
    "sp-select": SpSelectComponent;
  }
}
