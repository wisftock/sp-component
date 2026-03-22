import { LitElement, unsafeCSS } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import styles from "./sp-context-menu.css?inline";
import { contextMenuTemplate } from "./sp-context-menu.template.js";
import type { SpContextMenuTrigger } from "./sp-context-menu.types.js";

/**
 * Context menu component that renders a fixed-position menu at the cursor.
 *
 * @element sp-context-menu
 *
 * @prop {boolean}                disabled - Disables the context menu
 * @prop {SpContextMenuTrigger}   trigger  - Event that opens menu: contextmenu | click
 *
 * @slot         - The target element that receives the right-click or click
 * @slot menu    - sp-menu-item elements rendered inside the context menu
 *
 * @fires {CustomEvent<{ x: number; y: number }>} sp-open  - Emitted when menu opens
 * @fires {CustomEvent}                            sp-close - Emitted when menu closes
 */
@customElement("sp-context-menu")
export class SpContextMenuComponent extends LitElement {
  static override styles = unsafeCSS(styles);

  @property({ type: Boolean, reflect: true })
  disabled = false;

  @property({ type: String })
  trigger: SpContextMenuTrigger = "contextmenu";

  @state()
  _open = false;

  @state()
  _x = 0;

  @state()
  _y = 0;

  override render() {
    return contextMenuTemplate.call(this);
  }

  override connectedCallback() {
    super.connectedCallback();
    document.addEventListener("keydown", this._handleEscape);
    document.addEventListener("pointerdown", this._handleDocumentPointerDown);
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    document.removeEventListener("keydown", this._handleEscape);
    document.removeEventListener("pointerdown", this._handleDocumentPointerDown);
  }

  readonly _handleContextMenu = (e: MouseEvent) => {
    if (this.disabled) return;
    if (this.trigger !== "contextmenu") return;
    e.preventDefault();
    this._openAt(e.clientX, e.clientY);
  };

  readonly _handleClick = (e: MouseEvent) => {
    if (this.disabled) return;
    if (this.trigger !== "click") return;
    e.stopPropagation();
    if (this._open) {
      this._close();
    } else {
      this._openAt(e.clientX, e.clientY);
    }
  };

  _openAt(x: number, y: number) {
    // Clamp position to viewport
    const menuWidth = 200;
    const menuHeight = 200;
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    this._x = Math.min(x, vw - menuWidth);
    this._y = Math.min(y, vh - menuHeight);
    this._open = true;

    this.dispatchEvent(
      new CustomEvent("sp-open", {
        detail: { x: this._x, y: this._y },
        bubbles: true,
        composed: true,
      }),
    );
  }

  _close() {
    if (!this._open) return;
    this._open = false;
    this.dispatchEvent(
      new CustomEvent("sp-close", { bubbles: true, composed: true }),
    );
  }

  readonly _handleMenuItemClick = () => {
    this._close();
  };

  private readonly _handleEscape = (e: KeyboardEvent) => {
    if (e.key === "Escape" && this._open) {
      e.stopPropagation();
      this._close();
    }
  };

  private readonly _handleDocumentPointerDown = (e: PointerEvent) => {
    if (!e.composedPath().includes(this) && this._open) {
      this._close();
    }
  };
}

declare global {
  interface HTMLElementTagNameMap {
    "sp-context-menu": SpContextMenuComponent;
  }
}
