import { LitElement, html, unsafeCSS, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import { styleMap } from "lit/directives/style-map.js";
import styles from "./sp-menubar.css?inline";

export interface SpMenubarItem {
  label?: string;
  separator?: boolean;
  disabled?: boolean;
  danger?: boolean;
  checked?: boolean;
  kbd?: string;
  icon?: string;
  onClick?: () => void;
  items?: SpMenubarItem[];
}

export interface SpMenubarMenu {
  label: string;
  items: SpMenubarItem[];
}

/**
 * Menubar — barra de menú estilo aplicación de escritorio.
 *
 * @element sp-menubar
 *
 * @prop {SpMenubarMenu[]} menus - Menús con sus ítems
 *
 * @fires {CustomEvent<{item:SpMenubarItem}>} sp-select
 */
@customElement("sp-menubar")
export class SpMenubarComponent extends LitElement {
  static override styles = unsafeCSS(styles);

  @property({ type: Array }) menus: SpMenubarMenu[] = [];

  @state() private _openIdx = -1;
  @state() private _openSubIdx: Record<string, number> = {};

  #triggerRects: DOMRect[] = [];

  readonly #onOutside = (e: MouseEvent) => {
    if (!this.shadowRoot?.contains(e.target as Node)) {
      this._openIdx = -1;
      this._openSubIdx = {};
    }
  };

  override connectedCallback() {
    super.connectedCallback();
    document.addEventListener("click", this.#onOutside);
    document.addEventListener("keydown", this.#onKeydown);
  }
  override disconnectedCallback() {
    super.disconnectedCallback();
    document.removeEventListener("click", this.#onOutside);
    document.removeEventListener("keydown", this.#onKeydown);
  }

  readonly #onKeydown = (e: KeyboardEvent) => {
    if (e.key === "Escape") { this._openIdx = -1; this._openSubIdx = {}; }
  };

  #openMenu(idx: number, btn: HTMLElement) {
    this.#triggerRects[idx] = btn.getBoundingClientRect();
    this._openIdx = this._openIdx === idx ? -1 : idx;
    this._openSubIdx = {};
  }

  #selectItem(item: SpMenubarItem) {
    if (item.disabled || item.separator || item.items?.length) return;
    this._openIdx = -1;
    this._openSubIdx = {};
    item.onClick?.();
    this.dispatchEvent(new CustomEvent("sp-select", { detail: { item }, bubbles: true, composed: true }));
  }

  #renderItems(items: SpMenubarItem[], prefix = ""): unknown {
    return items.map((item, i) => {
      if (item.separator) return html`<div class="sp-mb-sep" role="separator"></div>`;
      const subKey = `${prefix}-${i}`;
      const hasSub = !!item.items?.length;
      const subOpen = this._openSubIdx[subKey] === 1;

      return html`
        <button
          class=${classMap({
            "sp-mb-item": true,
            "sp-mb-item--danger": !!item.danger,
            "sp-mb-item--checked": !!item.checked,
          })}
          ?disabled=${item.disabled}
          role=${hasSub ? "menuitem" : "menuitem"}
          aria-haspopup=${hasSub}
          @click=${(e: Event) => { e.stopPropagation(); this.#selectItem(item); }}
          @mouseenter=${() => {
            if (hasSub) { this._openSubIdx = { ...this._openSubIdx, [subKey]: 1 }; }
            else { const next = { ...this._openSubIdx }; Object.keys(next).forEach(k => { if (k.startsWith(prefix)) delete next[k]; }); this._openSubIdx = next; }
          }}
        >
          ${item.icon ? html`<span>${item.icon}</span>` : nothing}
          <span class="sp-mb-label">${item.label}</span>
          ${item.kbd ? html`<span class="sp-mb-kbd">${item.kbd}</span>` : nothing}
          ${hasSub ? html`<span class="sp-mb-arrow">›</span>` : nothing}
          ${hasSub && subOpen ? html`
            <div class="sp-mb-sub" role="menu" @click=${(e: Event) => e.stopPropagation()}>
              ${this.#renderItems(item.items!, subKey)}
            </div>
          ` : nothing}
        </button>
      `;
    });
  }

  override render() {
    return html`
      <div class="sp-mb" role="menubar">
        ${this.menus.map((menu, idx) => {
          const isOpen = this._openIdx === idx;
          const rect = this.#triggerRects[idx];

          return html`
            <button
              class=${classMap({ "sp-mb-trigger": true, "sp-mb-trigger--open": isOpen })}
              role="menuitem"
              aria-haspopup="true"
              aria-expanded=${isOpen}
              @click=${(e: Event) => { e.stopPropagation(); this.#openMenu(idx, e.currentTarget as HTMLElement); }}
              @mouseenter=${(e: Event) => { if (this._openIdx !== -1) this.#openMenu(idx, e.currentTarget as HTMLElement); }}
            >${menu.label}</button>

            ${isOpen && rect ? html`
              <div
                class="sp-mb-dropdown"
                role="menu"
                style=${styleMap({ top: `${rect.bottom + 2}px`, left: `${rect.left}px` })}
                @click=${(e: Event) => e.stopPropagation()}
              >
                ${this.#renderItems(menu.items, String(idx))}
              </div>
            ` : nothing}
          `;
        })}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap { "sp-menubar": SpMenubarComponent; }
}
