import { LitElement, unsafeCSS } from "lit";
import { customElement, property } from "lit/decorators.js";
import styles from "./sp-radio-group.css?inline";
import { radioGroupTemplate } from "./sp-radio-group.template.js";
import type { SpRadioGroupOrientation } from "./sp-radio-group.types.js";

/**
 * Radio group component that manages a set of sp-radio children.
 *
 * @element sp-radio-group
 *
 * @prop {string}                     name        - Name shared across child radios
 * @prop {string}                     value       - Currently selected value
 * @prop {boolean}                    disabled    - Disables all child radios
 * @prop {SpRadioGroupOrientation}    orientation - Layout direction: vertical | horizontal
 * @prop {string}                     label       - Group label rendered as a legend
 * @prop {string}                     error       - Error message shown below the group
 * @prop {string}                     hint        - Hint text (hidden when error is set)
 *
 * @fires {CustomEvent<{ value: string }>} sp-change - Emitted when the selected value changes
 *
 * @slot - sp-radio elements
 */
@customElement("sp-radio-group")
export class SpRadioGroupComponent extends LitElement {
  static override styles = unsafeCSS(styles);

  @property({ type: String })
  name = "";

  @property({ type: String })
  value = "";

  @property({ type: Boolean, reflect: true })
  disabled = false;

  @property({ type: String, reflect: true })
  orientation: SpRadioGroupOrientation = "vertical";

  @property({ type: String })
  label = "";

  @property({ type: String })
  error = "";

  @property({ type: String })
  hint = "";

  override render() {
    return radioGroupTemplate.call(this);
  }

  override connectedCallback(): void {
    super.connectedCallback();
    this.addEventListener("sp-change", this._handleRadioChange as EventListener);
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.removeEventListener("sp-change", this._handleRadioChange as EventListener);
  }

  override updated(changed: Map<string, unknown>): void {
    if (changed.has("value") || changed.has("name") || changed.has("disabled")) {
      this._syncRadios();
    }
  }

  private _syncRadios(): void {
    const radios = this.querySelectorAll("sp-radio") as NodeListOf<any>;
    radios.forEach((radio) => {
      radio.name = this.name;
      radio.checked = radio.value === this.value;
      if (this.disabled) radio.disabled = true;
    });
  }

  readonly _handleSlotChange = (): void => {
    this._syncRadios();
  };

  private readonly _handleRadioChange = (e: CustomEvent<{ value: string }>): void => {
    // Only handle events from child radios, not our own re-dispatched event
    if (e.target === this) return;
    // Consume the child event entirely so other listeners on this element don't see it
    e.stopImmediatePropagation();
    this.value = e.detail.value;
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
    "sp-radio-group": SpRadioGroupComponent;
  }
}
