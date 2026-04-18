import { LitElement, html, unsafeCSS } from "lit";
import { customElement, property, state, query } from "lit/decorators.js";
import { repeat } from "lit/directives/repeat.js";
import { styleMap } from "lit/directives/style-map.js";
import styles from "./sp-virtual-list.css?inline";

export type SpVirtualListRenderFn<T> = (item: T, index: number) => unknown;

/**
 * Virtual List — renderiza solo los ítems visibles para soportar listas de miles de elementos.
 *
 * @element sp-virtual-list
 *
 * @prop {unknown[]} items      - Array de datos
 * @prop {number}    item-height - Altura fija de cada ítem en px (default 48)
 * @prop {number}    buffer     - Ítems extra a renderizar fuera del viewport (default 3)
 * @prop {string}    height     - Altura del contenedor (default "400px")
 *
 * @fires {CustomEvent<{index:number,item:unknown}>} sp-item-click - Al hacer click en un ítem
 *
 * @slot - Template para cada ítem (usa .renderItem para control total)
 */
@customElement("sp-virtual-list")
export class SpVirtualListComponent<T = unknown> extends LitElement {
  static override styles = unsafeCSS(styles);

  @property({ type: Array }) items: T[] = [];
  @property({ type: Number, attribute: "item-height" }) itemHeight = 48;
  @property({ type: Number }) buffer = 3;
  @property({ type: String }) height = "400px";
  @property({ attribute: false }) renderItem?: SpVirtualListRenderFn<T>;

  @state() private _scrollTop = 0;

  @query(".sp-vl-scroll") private _scrollEl!: HTMLElement;

  readonly #onScroll = () => {
    this._scrollTop = this._scrollEl.scrollTop;
  };

  override connectedCallback() {
    super.connectedCallback();
    void this.updateComplete.then(() => {
      this._scrollEl?.addEventListener("scroll", this.#onScroll, { passive: true });
    });
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    this._scrollEl?.removeEventListener("scroll", this.#onScroll);
  }

  get #totalHeight() { return this.items.length * this.itemHeight; }

  get #visibleCount() {
    const containerH = this._scrollEl?.clientHeight ?? parseInt(this.height) ?? 400;
    return Math.ceil(containerH / this.itemHeight);
  }

  get #startIndex() {
    return Math.max(0, Math.floor(this._scrollTop / this.itemHeight) - this.buffer);
  }

  get #endIndex() {
    return Math.min(this.items.length - 1, this.#startIndex + this.#visibleCount + this.buffer * 2);
  }

  override render() {
    const start = this.#startIndex;
    const end   = this.#endIndex;
    const offsetY = start * this.itemHeight;

    const visibleItems = this.items.slice(start, end + 1);

    return html`
      <div class="sp-vl-scroll" style="height:${this.height}">
        <div class="sp-vl-spacer" style="height:${this.#totalHeight}px">
          <div class="sp-vl-items" style=${styleMap({ transform: `translateY(${offsetY}px)` })}>
            ${repeat(visibleItems, (_, i) => start + i, (item, i) => {
              const globalIdx = start + i;
              return html`
                <div
                  class="sp-vl-item"
                  style="height:${this.itemHeight}px"
                  @click=${() => this.dispatchEvent(new CustomEvent("sp-item-click", {
                    detail: { index: globalIdx, item },
                    bubbles: true, composed: true,
                  }))}
                >
                  ${this.renderItem
                    ? this.renderItem(item, globalIdx)
                    : html`<slot name="item-${globalIdx}"></slot>`
                  }
                </div>
              `;
            })}
          </div>
        </div>
      </div>
    `;
  }

  /** Hace scroll hasta el ítem en el índice dado */
  scrollToIndex(index: number) {
    if (this._scrollEl) {
      this._scrollEl.scrollTop = index * this.itemHeight;
    }
  }
}

declare global {
  interface HTMLElementTagNameMap { "sp-virtual-list": SpVirtualListComponent; }
}
