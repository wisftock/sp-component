import { LitElement, html, unsafeCSS, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import styles from "./sp-nav-menu.css?inline";

export interface SpNavSubItem {
  label: string;
  description?: string;
  icon?: string;
  href?: string;
  active?: boolean;
  onClick?: () => void;
}

export interface SpNavSection {
  title?: string;
  items: SpNavSubItem[];
}

export interface SpNavMenuItem {
  label: string;
  href?: string;
  active?: boolean;
  sections?: SpNavSection[];  // Con secciones = mega menu
  items?: SpNavSubItem[];     // Sin secciones = dropdown simple
  onClick?: () => void;
}

/**
 * Navigation Menu — barra de navegación horizontal con submenús desplegables.
 *
 * @element sp-nav-menu
 *
 * @prop {SpNavMenuItem[]} items   - Items de navegación
 * @prop {number}          columns - Columnas para el mega menu (default auto)
 *
 * @fires {CustomEvent<{item:SpNavSubItem}>} sp-select
 */
@customElement("sp-nav-menu")
export class SpNavMenuComponent extends LitElement {
  static override styles = unsafeCSS(styles);

  @property({ type: Array }) items: SpNavMenuItem[] = [];
  @property({ type: Number }) columns = 0;

  @state() private _openIndex = -1;

  readonly #onOutside = (e: MouseEvent) => {
    if (!this.shadowRoot?.contains(e.target as Node)) this._openIndex = -1;
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
    if (e.key === "Escape") this._openIndex = -1;
  };

  #toggle(idx: number) {
    this._openIndex = this._openIndex === idx ? -1 : idx;
  }

  #selectSub(sub: SpNavSubItem) {
    this._openIndex = -1;
    sub.onClick?.();
    this.dispatchEvent(new CustomEvent("sp-select", { detail: { item: sub }, bubbles: true, composed: true }));
  }

  #renderDropdown(item: SpNavMenuItem) {
    if (item.sections) {
      const cols = this.columns || item.sections.length;
      return html`
        <div class="sp-nav-dropdown sp-nav-dropdown--mega" style="grid-template-columns:repeat(${cols},1fr)">
          ${item.sections.map(sec => html`
            <div class="sp-nav-section">
              ${sec.title ? html`<div class="sp-nav-section-title">${sec.title}</div>` : nothing}
              ${sec.items.map(sub => html`
                <a
                  class=${classMap({ "sp-nav-sub-item": true, "sp-nav-sub-item--active": !!sub.active })}
                  href=${sub.href || "#"}
                  @click=${(e: Event) => { if (!sub.href || sub.href === "#") e.preventDefault(); this.#selectSub(sub); }}
                >
                  ${sub.icon ? html`<span class="sp-nav-sub-icon">${sub.icon}</span>` : nothing}
                  <span class="sp-nav-sub-text">
                    <div class="sp-nav-sub-label">${sub.label}</div>
                    ${sub.description ? html`<div class="sp-nav-sub-desc">${sub.description}</div>` : nothing}
                  </span>
                </a>
              `)}
            </div>
          `)}
        </div>
      `;
    }

    if (item.items) {
      return html`
        <div class="sp-nav-dropdown">
          ${item.items.map((sub, i) => html`
            <a
              class=${classMap({ "sp-nav-sub-item": true, "sp-nav-sub-item--active": !!sub.active })}
              href=${sub.href || "#"}
              @click=${(e: Event) => { if (!sub.href || sub.href === "#") e.preventDefault(); this.#selectSub(sub); }}
            >
              ${sub.icon ? html`<span class="sp-nav-sub-icon">${sub.icon}</span>` : nothing}
              <span class="sp-nav-sub-label">${sub.label}</span>
            </a>
          `)}
        </div>
      `;
    }

    return nothing;
  }

  override render() {
    return html`
      <nav>
        <ul class="sp-nav" role="menubar">
          ${this.items.map((item, idx) => {
            const hasChildren = !!(item.sections || item.items);
            const isOpen = this._openIndex === idx;

            return html`
              <li class="sp-nav-item" role="none">
                ${hasChildren
                  ? html`
                    <button
                      class=${classMap({ "sp-nav-trigger": true, "sp-nav-trigger--active": !!item.active })}
                      role="menuitem"
                      aria-haspopup="true"
                      aria-expanded=${isOpen}
                      @click=${(e: Event) => { e.stopPropagation(); this.#toggle(idx); }}
                    >
                      ${item.label}
                      <span class="sp-nav-arrow">
                        <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 6l4 4 4-4"/></svg>
                      </span>
                    </button>
                    ${isOpen ? this.#renderDropdown(item) : nothing}
                  `
                  : html`
                    <a
                      class=${classMap({ "sp-nav-trigger": true, "sp-nav-trigger--active": !!item.active })}
                      href=${item.href || "#"}
                      role="menuitem"
                      @click=${(e: Event) => { if (item.onClick) { if (!item.href || item.href === "#") e.preventDefault(); item.onClick(); }}}
                    >${item.label}</a>
                  `
                }
              </li>
            `;
          })}
        </ul>
      </nav>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap { "sp-nav-menu": SpNavMenuComponent; }
}
