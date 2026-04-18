import { LitElement, html, unsafeCSS, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { styleMap } from "lit/directives/style-map.js";
import styles from "./sp-floating-panel.css?inline";

/**
 * Floating Panel — panel flotante draggable con colapso y resize.
 *
 * @element sp-floating-panel
 *
 * @prop {string}  title      - Título en la barra
 * @prop {number}  x          - Posición inicial X (px desde left)
 * @prop {number}  y          - Posición inicial Y (px desde top)
 * @prop {number}  width      - Ancho inicial (default 300)
 * @prop {number}  height     - Alto inicial (default 200)
 * @prop {boolean} collapsed  - Colapsa el cuerpo, solo muestra titlebar
 * @prop {boolean} closable   - Muestra botón de cerrar
 * @prop {boolean} resizable  - Permite resize desde esquina inferior derecha
 *
 * @fires {CustomEvent} sp-close    - Al cerrar
 * @fires {CustomEvent<{x,y}>} sp-move - Al mover
 * @slot - Contenido del panel
 */
@customElement("sp-floating-panel")
export class SpFloatingPanelComponent extends LitElement {
  static override styles = unsafeCSS(styles);

  @property({ type: String }) title = "Panel";
  @property({ type: Number }) x = 100;
  @property({ type: Number }) y = 100;
  @property({ type: Number }) width = 300;
  @property({ type: Number }) height = 200;
  @property({ type: Boolean, reflect: true }) collapsed = false;
  @property({ type: Boolean }) closable = true;
  @property({ type: Boolean }) resizable = true;
  @property({ type: Boolean }) open = true;

  @state() private _x = 0;
  @state() private _y = 0;
  @state() private _w = 0;
  @state() private _h = 0;

  #dragOffX = 0;
  #dragOffY = 0;
  #resizeStartX = 0;
  #resizeStartY = 0;
  #resizeStartW = 0;
  #resizeStartH = 0;
  #mode: "drag" | "resize" | null = null;

  override connectedCallback() {
    super.connectedCallback();
    this._x = this.x; this._y = this.y;
    this._w = this.width; this._h = this.height;
    document.addEventListener("pointermove", this.#onMove);
    document.addEventListener("pointerup", this.#onUp);
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    document.removeEventListener("pointermove", this.#onMove);
    document.removeEventListener("pointerup", this.#onUp);
  }

  #startDrag(e: PointerEvent) {
    if ((e.target as HTMLElement).closest(".sp-fp-btn")) return;
    this.#mode = "drag";
    this.#dragOffX = e.clientX - this._x;
    this.#dragOffY = e.clientY - this._y;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }

  #startResize(e: PointerEvent) {
    e.stopPropagation();
    this.#mode = "resize";
    this.#resizeStartX = e.clientX;
    this.#resizeStartY = e.clientY;
    this.#resizeStartW = this._w;
    this.#resizeStartH = this._h;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }

  readonly #onMove = (e: PointerEvent) => {
    if (this.#mode === "drag") {
      this._x = Math.max(0, e.clientX - this.#dragOffX);
      this._y = Math.max(0, e.clientY - this.#dragOffY);
      this.dispatchEvent(new CustomEvent("sp-move", { detail: { x: this._x, y: this._y }, bubbles: true, composed: true }));
    } else if (this.#mode === "resize") {
      this._w = Math.max(200, this.#resizeStartW + e.clientX - this.#resizeStartX);
      this._h = Math.max(80, this.#resizeStartH + e.clientY - this.#resizeStartY);
    }
  };

  readonly #onUp = () => { this.#mode = null; };

  #close() {
    this.open = false;
    this.dispatchEvent(new CustomEvent("sp-close", { bubbles: true, composed: true }));
  }

  override render() {
    if (!this.open) return nothing;

    return html`
      <div
        class="sp-fp"
        style=${styleMap({
          left: `${this._x}px`,
          top: `${this._y}px`,
          width: `${this._w}px`,
          height: this.collapsed ? "auto" : `${this._h}px`,
        })}
      >
        <div class="sp-fp-titlebar" @pointerdown=${(e: PointerEvent) => this.#startDrag(e)}>
          <span class="sp-fp-title">${this.title}</span>
          <div class="sp-fp-actions">
            <button class="sp-fp-btn" title=${this.collapsed ? "Expandir" : "Colapsar"}
              @click=${() => { this.collapsed = !this.collapsed; }}>
              ${this.collapsed
                ? html`<svg width="10" height="10" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 10l4-4 4 4"/></svg>`
                : html`<svg width="10" height="10" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 6l4 4 4-4"/></svg>`
              }
            </button>
            ${this.closable ? html`
              <button class="sp-fp-btn" title="Cerrar" @click=${() => this.#close()}>
                <svg width="10" height="10" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M3 3l10 10M13 3L3 13"/></svg>
              </button>
            ` : nothing}
          </div>
        </div>

        <div class="sp-fp-body"><slot></slot></div>

        ${this.resizable ? html`
          <div class="sp-fp-resize" @pointerdown=${(e: PointerEvent) => this.#startResize(e)}>
            <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor">
              <path d="M8 2L2 8M5 2L2 5M8 5L5 8"/>
            </svg>
          </div>
        ` : nothing}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap { "sp-floating-panel": SpFloatingPanelComponent; }
}
