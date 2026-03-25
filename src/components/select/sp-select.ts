import { LitElement, unsafeCSS } from "lit";
import { customElement, property, state } from "lit/decorators.js";
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
  required = false;

  @property({ type: String })
  name = "";

  @property({ type: String, reflect: true })
  size: SpSelectSize = "md";

  @property({ type: Boolean })
  multiple = false;

  @property({ type: Number })
  maxSelections = 0;

  @state()
  _selectedValues: string[] = [];

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

  override updated(changedProperties: Map<string, unknown>) {
    if (changedProperties.has("value") || changedProperties.has("_selectedValues")) {
      this.#internals.setFormValue(this.value);
    }
    if (changedProperties.has("value") || changedProperties.has("required")) {
      if (this.required && !this.value) {
        this.#internals.setValidity({ valueMissing: true }, "Please select an option");
      } else {
        this.#internals.setValidity({});
      }
    }
  }

  formResetCallback(): void {
    this.value = "";
    this._selectedValues = [];
    this.#internals.setFormValue("");
  }

  readonly _handleChange = (e: Event) => {
    const select = e.target as HTMLSelectElement;
    if (this.multiple) {
      const selected = [...select.options]
        .filter(o => o.selected)
        .map(o => o.value);
      // Enforce maxSelections
      if (this.maxSelections > 0 && selected.length > this.maxSelections) {
        // Revert the change — deselect options that were just added beyond max
        const prev = this._selectedValues;
        [...select.options].forEach(o => {
          o.selected = prev.includes(o.value);
        });
        return;
      }
      this._selectedValues = selected;
      this.value = selected.join(",");
    } else {
      this.value = select.value;
    }
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
