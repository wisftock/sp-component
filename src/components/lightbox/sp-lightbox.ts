import { LitElement, html, unsafeCSS, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import styles from "./sp-lightbox.css?inline";

export interface LightboxImage {
  src: string;
  thumb?: string;
  alt?: string;
  caption?: string;
}

/**
 * Lightbox — visor de imágenes fullscreen con zoom, pan y navegación de galería.
 *
 * @element sp-lightbox
 *
 * @prop {LightboxImage[]} images    - Array de imágenes
 * @prop {number}          index     - Índice inicial al abrir
 * @prop {boolean}         open      - Estado de apertura
 * @prop {boolean}         show-thumbs - Muestra tira de miniaturas
 *
 * @fires sp-close
 * @fires sp-change - { index }
 */
@customElement("sp-lightbox")
export class SpLightboxComponent extends LitElement {
  static override styles = unsafeCSS(styles);

  @property({ type: Array }) images: LightboxImage[] = [];
  @property({ type: Number }) index = 0;
  @property({ type: Boolean }) open = false;
  @property({ type: Boolean, attribute: "show-thumbs" }) showThumbs = true;

  @state() private _index = 0;
  @state() private _open = false;
  @state() private _zoom = 1;
  @state() private _panX = 0;
  @state() private _panY = 0;
  @state() private _dragging = false;

  private _dragStartX = 0;
  private _dragStartY = 0;
  private _panStartX = 0;
  private _panStartY = 0;

  override connectedCallback() {
    super.connectedCallback();
    this._index = this.index;
    this._open = this.open;
    document.addEventListener("keydown", this.#onKey);
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    document.removeEventListener("keydown", this.#onKey);
  }

  override updated(changed: Map<string, unknown>) {
    if (changed.has("open")) this._open = this.open;
    if (changed.has("index")) this._index = this.index;
  }

  openAt(i: number) {
    this._index = i;
    this._open = true;
    this._zoom = 1;
    this._panX = 0;
    this._panY = 0;
  }

  #close() {
    this._open = false;
    this._zoom = 1;
    this._panX = 0;
    this._panY = 0;
    this.dispatchEvent(new CustomEvent("sp-close", { bubbles: true, composed: true }));
  }

  #goto(i: number) {
    this._index = ((i % this.images.length) + this.images.length) % this.images.length;
    this._zoom = 1;
    this._panX = 0;
    this._panY = 0;
    this.dispatchEvent(new CustomEvent("sp-change", {
      detail: { index: this._index }, bubbles: true, composed: true,
    }));
  }

  #onKey = (e: KeyboardEvent) => {
    if (!this._open) return;
    if (e.key === "Escape") this.#close();
    if (e.key === "ArrowLeft") this.#goto(this._index - 1);
    if (e.key === "ArrowRight") this.#goto(this._index + 1);
    if (e.key === "+") this._zoom = Math.min(4, this._zoom + 0.5);
    if (e.key === "-") this._zoom = Math.max(1, this._zoom - 0.5);
  };

  #onWheel(e: WheelEvent) {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.2 : 0.2;
    this._zoom = Math.max(1, Math.min(4, this._zoom + delta));
    if (this._zoom === 1) { this._panX = 0; this._panY = 0; }
  }

  #startDrag(e: PointerEvent) {
    if (this._zoom <= 1) return;
    this._dragging = true;
    this._dragStartX = e.clientX;
    this._dragStartY = e.clientY;
    this._panStartX = this._panX;
    this._panStartY = this._panY;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  }

  #moveDrag(e: PointerEvent) {
    if (!this._dragging) return;
    this._panX = this._panStartX + (e.clientX - this._dragStartX);
    this._panY = this._panStartY + (e.clientY - this._dragStartY);
  }

  #endDrag() {
    this._dragging = false;
  }

  override render() {
    const current = this.images[this._index];

    return html`
      <!-- Gallery thumbnails -->
      <div class="sp-lb-gallery">
        ${this.images.map((img, i) => html`
          <div class="sp-lb-thumb" @click=${() => this.openAt(i)}>
            <img src=${img.thumb ?? img.src} alt=${img.alt ?? ""} loading="lazy"/>
            <div class="sp-lb-thumb-overlay">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                <line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/>
              </svg>
            </div>
          </div>
        `)}
      </div>

      <!-- Lightbox overlay -->
      ${this._open && current ? html`
        <div class="sp-lb-overlay" @click=${(e: MouseEvent) => { if (e.target === e.currentTarget) this.#close(); }}>
          <div class="sp-lb-content">

            <!-- Close -->
            <button class="sp-lb-close" @click=${() => this.#close()}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>

            <!-- Prev -->
            ${this.images.length > 1 ? html`
              <button class="sp-lb-arrow sp-lb-arrow--prev" @click=${() => this.#goto(this._index - 1)}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <polyline points="15,18 9,12 15,6"/>
                </svg>
              </button>
            ` : nothing}

            <!-- Image -->
            <div
              class=${classMap({ "sp-lb-img-wrap": true, "dragging": this._dragging })}
              @wheel=${(e: WheelEvent) => this.#onWheel(e)}
              @pointerdown=${(e: PointerEvent) => this.#startDrag(e)}
              @pointermove=${(e: PointerEvent) => this.#moveDrag(e)}
              @pointerup=${() => this.#endDrag()}
              @pointercancel=${() => this.#endDrag()}
            >
              <img
                class="sp-lb-img"
                src=${current.src}
                alt=${current.alt ?? ""}
                style="transform: scale(${this._zoom}) translate(${this._panX / this._zoom}px, ${this._panY / this._zoom}px)"
                draggable="false"
              />
            </div>

            <!-- Next -->
            ${this.images.length > 1 ? html`
              <button class="sp-lb-arrow sp-lb-arrow--next" @click=${() => this.#goto(this._index + 1)}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <polyline points="9,18 15,12 9,6"/>
                </svg>
              </button>
            ` : nothing}

            <!-- Bottom bar -->
            <div class="sp-lb-bottom">
              <button class="sp-lb-zoom-btn" @click=${() => { this._zoom = Math.max(1, this._zoom - 0.5); if (this._zoom === 1) { this._panX = 0; this._panY = 0; } }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="8" y1="11" x2="14" y2="11"/></svg>
              </button>
              <span class="sp-lb-counter">${this._index + 1} / ${this.images.length}</span>
              <button class="sp-lb-zoom-btn" @click=${() => { this._zoom = Math.min(4, this._zoom + 0.5); }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>
              </button>
              ${current.caption ? html`<span class="sp-lb-caption">${current.caption}</span>` : nothing}
            </div>

            <!-- Thumbnails strip -->
            ${this.showThumbs && this.images.length > 1 ? html`
              <div style="position:absolute;bottom:60px;left:0;right:0;display:flex;justify-content:center">
                <div class="sp-lb-strip">
                  ${this.images.map((img, i) => html`
                    <div
                      class=${classMap({ "sp-lb-strip-thumb": true, "active": i === this._index })}
                      @click=${() => this.#goto(i)}
                    >
                      <img src=${img.thumb ?? img.src} alt=${img.alt ?? ""}/>
                    </div>
                  `)}
                </div>
              </div>
            ` : nothing}
          </div>
        </div>
      ` : nothing}
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap { "sp-lightbox": SpLightboxComponent; }
}
