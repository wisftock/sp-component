import { LitElement, unsafeCSS } from "lit";
import { customElement, property } from "lit/decorators.js";
import styles from "./sp-menu.css?inline";
import { menuTemplate } from "./sp-menu.template.js";
import type { SpMenuPlacement } from "./sp-menu.types.js";

/**
 * Dropdown menu component with a trigger slot and item slot.
 *
 * @element sp-menu
 *
 * @prop {SpMenuPlacement} placement - Position of the menu panel relative to trigger
 * @prop {boolean}         open      - Whether the menu panel is visible
 *
 * @fires {CustomEvent} sp-show - Emitted when the menu opens
 * @fires {CustomEvent} sp-hide - Emitted when the menu closes
 *
 * @slot trigger - The element that triggers the menu
 * @slot         - Menu items (sp-menu-item elements)
 */
@customElement("sp-menu")
export class SpMenuComponent extends LitElement {
  static override styles = unsafeCSS(styles);

  @property({ type: String, reflect: true })
  placement: SpMenuPlacement = "bottom-start";

  @property({ type: Boolean, reflect: true })
  open = false;

  private _prevOpen = false;

  override render() {
    return menuTemplate.call(this);
  }

  override updated(changedProperties: Map<string, unknown>): void {
    if (changedProperties.has("open")) {
      if (this.open) {
        this.dispatchEvent(new CustomEvent("sp-show", { bubbles: true, composed: true }));
        this.updateComplete.then(() => {
          const first = this.querySelector<HTMLElement>("sp-menu-item:not([disabled])");
          first?.focus();
        });
      } else {
        this.dispatchEvent(new CustomEvent("sp-hide", { bubbles: true, composed: true }));
      }
    }
    this._prevOpen = this.open;
  }

  override connectedCallback(): void {
    super.connectedCallback();
    document.addEventListener("click", this._handleOutsideClick);
    this.addEventListener("keydown", this._handleKeydown);
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    document.removeEventListener("click", this._handleOutsideClick);
    this.removeEventListener("keydown", this._handleKeydown);
  }

  private readonly _handleKeydown = (e: KeyboardEvent): void => {
    if (!this.open) return;

    if (e.key === "Escape") {
      e.preventDefault();
      this.open = false;
      this.dispatchEvent(new CustomEvent("sp-hide", { bubbles: true, composed: true }));
      this.shadowRoot?.querySelector<HTMLElement>(".sp-menu-trigger")?.focus();
      return;
    }

    const items = Array.from(
      this.querySelectorAll<HTMLElement>("sp-menu-item:not([disabled])")
    );
    if (items.length === 0) return;
    const focused = items.findIndex(item => item === document.activeElement || item.shadowRoot?.activeElement !== null);

    if (e.key === "ArrowDown") {
      e.preventDefault();
      const next = focused < items.length - 1 ? focused + 1 : 0;
      items[next]?.focus();
      return;
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      const prev = focused > 0 ? focused - 1 : items.length - 1;
      items[prev]?.focus();
      return;
    }
    if (e.key === "Home") {
      e.preventDefault();
      items[0]?.focus();
      return;
    }
    if (e.key === "End") {
      e.preventDefault();
      items[items.length - 1]?.focus();
      return;
    }
  };

  readonly _handleTriggerClick = (): void => {
    this.open = !this.open;
  };

  readonly _handleItemClick = (): void => {
    setTimeout(() => {
      this.open = false;
    }, 0);
  };

  private readonly _handleOutsideClick = (e: MouseEvent): void => {
    if (!this.contains(e.target as Node) && !this.shadowRoot?.contains(e.target as Node)) {
      if (this.open) {
        this.open = false;
      }
    }
  };
}

declare global {
  interface HTMLElementTagNameMap {
    "sp-menu": SpMenuComponent;
  }
}
