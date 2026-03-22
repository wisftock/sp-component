import { LitElement, unsafeCSS } from "lit";
import { customElement, property } from "lit/decorators.js";
import styles from "./sp-button-group.css?inline";
import { buttonGroupTemplate } from "./sp-button-group.template.js";
import type { SpButtonGroupOrientation, SpButtonGroupSize } from "./sp-button-group.types.js";

/**
 * Button group component that groups a set of sp-button children.
 *
 * @element sp-button-group
 *
 * @prop {SpButtonGroupOrientation} orientation - Layout direction: horizontal | vertical
 * @prop {SpButtonGroupSize}        size        - Size propagated to child buttons: sm | md | lg
 * @prop {string}                   variant     - Variant propagated to all child sp-button elements
 * @prop {boolean}                  attached    - When true, buttons share borders (no gap, flat inner borders)
 *
 * @slot - sp-button elements
 */
@customElement("sp-button-group")
export class SpButtonGroupComponent extends LitElement {
  static override styles = unsafeCSS(styles);

  @property({ type: String, reflect: true })
  orientation: SpButtonGroupOrientation = "horizontal";

  @property({ type: String, reflect: true })
  size: SpButtonGroupSize = "md";

  @property({ type: String, reflect: true })
  variant = "";

  @property({ type: Boolean, reflect: true })
  attached = false;

  override render() {
    return buttonGroupTemplate.call(this);
  }

  override updated(changed: Map<string, unknown>): void {
    if (changed.has("size") || changed.has("variant")) {
      this._syncButtons();
    }
  }

  private _syncButtons(): void {
    const buttons = this.querySelectorAll("sp-button") as NodeListOf<any>;
    buttons.forEach((btn) => {
      if (this.size) btn.size = this.size;
      if (this.variant) btn.variant = this.variant;
    });
  }

  readonly _handleSlotChange = (): void => {
    this._syncButtons();
  };
}

declare global {
  interface HTMLElementTagNameMap {
    "sp-button-group": SpButtonGroupComponent;
  }
}
