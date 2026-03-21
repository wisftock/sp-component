import { LitElement, unsafeCSS } from "lit";
import { customElement, property } from "lit/decorators.js";
import styles from "./sp-menu-item.css?inline";
import { menuItemTemplate } from "./sp-menu-item.template.js";

/**
 * Menu item component for use inside sp-menu.
 *
 * @element sp-menu-item
 *
 * @prop {string}  value    - Value associated with this item
 * @prop {boolean} disabled - Disables interaction with this item
 * @prop {boolean} danger   - Renders the item in a danger/destructive style
 *
 * @fires {CustomEvent<{ value: string }>} sp-select - Emitted when the item is selected
 *
 * @slot         - Item label content
 * @slot prefix  - Content before the label (e.g. icon)
 * @slot suffix  - Content after the label (e.g. badge)
 */
@customElement("sp-menu-item")
export class SpMenuItemComponent extends LitElement {
  static override styles = unsafeCSS(styles);

  @property({ type: String })
  value = "";

  @property({ type: Boolean, reflect: true })
  disabled = false;

  @property({ type: Boolean, reflect: true })
  danger = false;

  override connectedCallback(): void {
    super.connectedCallback();
    if (!this.disabled) {
      this.setAttribute("tabindex", "-1");
    }
  }

  override render() {
    return menuItemTemplate.call(this);
  }

  readonly _handleClick = (): void => {
    if (!this.disabled) {
      this.dispatchEvent(
        new CustomEvent("sp-select", {
          detail: { value: this.value },
          bubbles: true,
          composed: true,
        }),
      );
    }
  };

  readonly _handleKeydown = (e: KeyboardEvent): void => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      this._handleClick();
    }
  };
}

declare global {
  interface HTMLElementTagNameMap {
    "sp-menu-item": SpMenuItemComponent;
  }
}
