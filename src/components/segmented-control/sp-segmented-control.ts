import { LitElement, unsafeCSS } from "lit";
import { customElement, property } from "lit/decorators.js";
import styles from "./sp-segmented-control.css?inline";
import { segmentedControlTemplate } from "./sp-segmented-control.template.js";
import type {
  SpSegmentedControlSize,
  SpSegmentedControlOption,
} from "./sp-segmented-control.types.js";

/**
 * Segmented control component — a group of buttons with exclusive selection.
 *
 * @element sp-segmented-control
 *
 * @prop {string}                        value     - Currently selected value
 * @prop {SpSegmentedControlOption[]}    options   - Array of options with value, label, and optional disabled/icon
 * @prop {boolean}                       disabled  - Disables all options
 * @prop {boolean}                       required  - Marks the field as required
 * @prop {string}                        name      - Form field name
 * @prop {SpSegmentedControlSize}        size      - Size: sm | md | lg
 * @prop {boolean}                       fullWidth - Stretches to fill container width
 *
 * @fires {CustomEvent<{ value: string }>} sp-change - Emitted when the selected option changes
 */
@customElement("sp-segmented-control")
export class SpSegmentedControlComponent extends LitElement {
  static override styles = unsafeCSS(styles);
  static formAssociated = true;

  readonly #internals: ElementInternals;

  constructor() {
    super();
    this.#internals = this.attachInternals();
  }

  @property({ type: String })
  value = "";

  @property({ type: Array })
  options: SpSegmentedControlOption[] = [];

  @property({ type: Boolean, reflect: true })
  disabled = false;

  @property({ type: Boolean, reflect: true })
  required = false;

  @property({ type: String })
  name = "";

  @property({ type: String, reflect: true })
  size: SpSegmentedControlSize = "md";

  @property({ type: Boolean, reflect: true, attribute: "full-width" })
  fullWidth = false;

  override render() {
    return segmentedControlTemplate.call(this);
  }

  override updated(): void {
    this.#internals.setFormValue(this.value || null);
    if (this.required && !this.value) {
      this.#internals.setValidity({ valueMissing: true }, "Please select an option");
    } else {
      this.#internals.setValidity({});
    }
  }

  formResetCallback(): void {
    this.value = "";
    this.#internals.setFormValue(null);
    if (this.required) {
      this.#internals.setValidity({ valueMissing: true }, "Please select an option");
    }
  }

  readonly _handleSelect = (val: string): void => {
    if (val === this.value) return;
    this.value = val;
    this.dispatchEvent(
      new CustomEvent("sp-change", {
        detail: { value: this.value },
        bubbles: true,
        composed: true,
      }),
    );
  };
}

declare global {
  interface HTMLElementTagNameMap {
    "sp-segmented-control": SpSegmentedControlComponent;
  }
}
