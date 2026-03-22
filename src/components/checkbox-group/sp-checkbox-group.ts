import { LitElement, unsafeCSS } from "lit";
import { customElement, property } from "lit/decorators.js";
import styles from "./sp-checkbox-group.css?inline";
import { checkboxGroupTemplate } from "./sp-checkbox-group.template.js";
import type { SpCheckboxGroupOrientation } from "./sp-checkbox-group.types.js";

/**
 * Checkbox group component that manages a set of sp-checkbox children.
 * Form-associated custom element.
 *
 * @element sp-checkbox-group
 *
 * @prop {string}                       values      - Comma-separated checked values
 * @prop {string}                       name        - Base name shared across child checkboxes
 * @prop {boolean}                      disabled    - Disables all child checkboxes
 * @prop {boolean}                      required    - Requires at least one selection
 * @prop {SpCheckboxGroupOrientation}   orientation - Layout direction: vertical | horizontal
 * @prop {string}                       label       - Group label rendered as a legend
 * @prop {string}                       hint        - Hint text (hidden when error is set)
 * @prop {string}                       error       - Error message shown below the group
 * @prop {number}                       min         - Minimum required selections (0 = none)
 * @prop {number}                       max         - Maximum allowed selections (0 = unlimited)
 *
 * @fires {CustomEvent<{ values: string[] }>} sp-change - Emitted when the selection changes
 *
 * @slot - sp-checkbox elements
 */
@customElement("sp-checkbox-group")
export class SpCheckboxGroupComponent extends LitElement {
  static override styles = unsafeCSS(styles);
  static formAssociated = true;

  readonly #internals: ElementInternals;

  constructor() {
    super();
    this.#internals = this.attachInternals();
  }

  @property({ type: String })
  values = "";

  @property({ type: String })
  name = "";

  @property({ type: Boolean, reflect: true })
  disabled = false;

  @property({ type: Boolean, reflect: true })
  required = false;

  @property({ type: String, reflect: true })
  orientation: SpCheckboxGroupOrientation = "vertical";

  @property({ type: String })
  label = "";

  @property({ type: String })
  hint = "";

  @property({ type: String, reflect: true })
  error = "";

  @property({ type: Number })
  min = 0;

  @property({ type: Number })
  max = 0;

  override render() {
    return checkboxGroupTemplate.call(this);
  }

  override connectedCallback(): void {
    super.connectedCallback();
    this.addEventListener("sp-change", this._handleCheckboxChange as EventListener);
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.removeEventListener("sp-change", this._handleCheckboxChange as EventListener);
  }

  override updated(changed: Map<string, unknown>): void {
    if (changed.has("values") || changed.has("name") || changed.has("disabled")) {
      this._syncCheckboxes();
    }
    this._updateFormValue();
  }

  formResetCallback(): void {
    this.values = "";
    this._syncCheckboxes();
  }

  private _getValuesArray(): string[] {
    return this.values
      ? this.values.split(",").map((v) => v.trim()).filter((v) => v.length > 0)
      : [];
  }

  private _updateFormValue(): void {
    const checkedValues = this._getValuesArray();
    if (checkedValues.length === 0) {
      this.#internals.setFormValue(null);
    } else {
      this.#internals.setFormValue(checkedValues.join(","));
    }
  }

  private _syncCheckboxes(): void {
    const checkedSet = new Set(this._getValuesArray());
    const checkboxes = this.querySelectorAll("sp-checkbox") as NodeListOf<any>;
    checkboxes.forEach((cb) => {
      cb.name = this.name;
      cb.checked = checkedSet.has(cb.value);
      if (this.disabled) cb.disabled = true;
    });
  }

  readonly _handleSlotChange = (): void => {
    this._syncCheckboxes();
  };

  private readonly _handleCheckboxChange = (e: CustomEvent<{ checked: boolean; indeterminate: boolean }>): void => {
    if (e.target === this) return;
    e.stopImmediatePropagation();

    const checkbox = e.target as any;
    const cbValue: string = checkbox.value ?? "";
    const currentValues = new Set(this._getValuesArray());

    if (e.detail.checked) {
      // Enforce max
      if (this.max > 0 && currentValues.size >= this.max) {
        // Revert — uncheck the checkbox
        checkbox.checked = false;
        return;
      }
      currentValues.add(cbValue);
    } else {
      currentValues.delete(cbValue);
    }

    this.values = Array.from(currentValues).join(",");

    this.dispatchEvent(
      new CustomEvent("sp-change", {
        detail: { values: Array.from(currentValues) },
        bubbles: true,
        composed: true,
      }),
    );
  };
}

declare global {
  interface HTMLElementTagNameMap {
    "sp-checkbox-group": SpCheckboxGroupComponent;
  }
}
