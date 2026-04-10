import { LitElement, html, unsafeCSS, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import styles from "./sp-context-menu.css?inline";

export interface SpContextMenuItem {
  label?: string;
  icon?: string;
  disabled?: boolean;
  danger?: boolean;
  separator?: boolean;
  onClick?: () => void;
}

/**
 * Context menu — right-click on the trigger slot to open.
 *
 * @element sp-context-menu
 *
 * @prop {SpContextMenuItem[]} items - Menu items
 *
 * @fires {CustomEvent<{ item: SpContextMenuItem }>} sp-select
 *
 * @example
 * <sp-context-menu .items=${[
 *   { label: "Edit", icon: "✏️", onClick: () => {} },
 *   { separator: true },
 *   { label: "Delete", danger: true, onClick: () => {} },
 * ]}>
 *   <div>Right-click me</div>
 * </sp-context-menu>
 */
@customElement("sp-context-menu")
export class SpContextMenuComponent extends LitElement {
  static override styles = unsafeCSS(styles);

  @property({ type: Array }) items: SpContextMenuItem[] = [];

  @state() private _open = false;
  @state() private _x = 0;
  @state() private _y = 0;
  @state() private _focusedIndex = -1;

  readonly #onContextMenu = (e: MouseEvent) => {
    e.preventDefault();
    this._x = e.clientX;
    this._y = e.clientY;
    this._open = true;
    this._focusedIndex = -1;
    // Defer to clamp position after render and focus first item
    this.updateComplete.then(() => {
      this.#clampPosition();
      this.#focusItem(0);
    });
  };

  #getMenuItems(): HTMLButtonElement[] {
    return Array.from(this.shadowRoot?.querySelectorAll<HTMLButtonElement>(".sp-ctx-item:not([disabled])") ?? []);
  }

  #focusItem(index: number) {
    const items = this.#getMenuItems();
    if (items.length === 0) return;
    this._focusedIndex = Math.max(0, Math.min(index, items.length - 1));
    items[this._focusedIndex]?.focus();
  }

  readonly #onOutsideClick = () => {
    if (this._open) this._open = false;
  };

  override connectedCallback() {
    super.connectedCallback();
    document.addEventListener("click", this.#onOutsideClick);
    document.addEventListener("keydown", this.#onKeyDown);
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    document.removeEventListener("click", this.#onOutsideClick);
    document.removeEventListener("keydown", this.#onKeyDown);
  }

  readonly #onKeyDown = (e: KeyboardEvent) => {
    if (!this._open) return;
    if (e.key === "Escape") { this._open = false; return; }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      const items = this.#getMenuItems();
      this.#focusItem(this._focusedIndex < items.length - 1 ? this._focusedIndex + 1 : 0);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const items = this.#getMenuItems();
      this.#focusItem(this._focusedIndex > 0 ? this._focusedIndex - 1 : items.length - 1);
    } else if (e.key === "Home") {
      e.preventDefault();
      this.#focusItem(0);
    } else if (e.key === "End") {
      e.preventDefault();
      const items = this.#getMenuItems();
      this.#focusItem(items.length - 1);
    }
  };

  #clampPosition() {
    const menu = this.shadowRoot?.querySelector(".sp-ctx-menu") as HTMLElement | null;
    if (!menu) return;
    const W = window.innerWidth, H = window.innerHeight;
    const mw = menu.offsetWidth, mh = menu.offsetHeight;
    this._x = Math.min(this._x, W - mw - 8);
    this._y = Math.min(this._y, H - mh - 8);
  }

  #select(item: SpContextMenuItem) {
    if (item.disabled || item.separator) return;
    this._open = false;
    item.onClick?.();
    this.dispatchEvent(new CustomEvent("sp-select", { detail: { item }, bubbles: true, composed: true }));
  }

  override render() {
    return html`
      <div class="sp-ctx-trigger" aria-haspopup="menu" @contextmenu=${this.#onContextMenu}>
        <slot></slot>
      </div>

      ${this._open ? html`
        <div
          class="sp-ctx-menu"
          role="menu"
          style="position:fixed;left:${this._x}px;top:${this._y}px"
          @click=${(e: Event) => e.stopPropagation()}
        >
          ${this.items.map(item => item.separator
            ? html`<div class="sp-ctx-sep" role="separator"></div>`
            : html`
              <button
                class=${classMap({ "sp-ctx-item": true, "sp-ctx-item--danger": !!item.danger, "sp-ctx-item--disabled": !!item.disabled })}
                role="menuitem"
                ?disabled=${item.disabled}
                @click=${() => this.#select(item)}
              >
                ${item.icon ? html`<span class="sp-ctx-icon">${item.icon}</span>` : nothing}
                ${item.label}
              </button>
            `
          )}
        </div>
      ` : nothing}
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap { "sp-context-menu": SpContextMenuComponent; }
}
