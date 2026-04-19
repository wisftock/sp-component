import { LitElement, html, unsafeCSS, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { styleMap } from "lit/directives/style-map.js";
import styles from "./sp-image-compare.css?inline";
import { SpConfig } from "../../config.js";

/**
 * Image Compare — slider antes/después para comparar dos imágenes.
 *
 * @element sp-image-compare
 *
 * @prop {string}  before       - URL imagen izquierda (antes)
 * @prop {string}  after        - URL imagen derecha (después)
 * @prop {string}  before-label - Etiqueta sobre imagen izquierda
 * @prop {string}  after-label  - Etiqueta sobre imagen derecha
 * @prop {string}  alt-before   - Alt text imagen antes
 * @prop {string}  alt-after    - Alt text imagen después
 * @prop {number}  initial      - Posición inicial del slider 0–100 (default 50)
 * @prop {string}  height       - Altura del contenedor (default "400px")
 *
 * @fires {CustomEvent<{position:number}>} sp-change - Al mover el handle
 */
@customElement("sp-image-compare")
export class SpImageCompareComponent extends LitElement {
  static override styles = unsafeCSS(styles);

  @property({ type: String, attribute: "before" }) beforeSrc = "";
  @property({ type: String, attribute: "after" }) afterSrc = "";
  @property({ type: String, attribute: "before-label" }) beforeLabel = "";
  @property({ type: String, attribute: "after-label" })  afterLabel  = "";
  @property({ type: String, attribute: "alt-before" })   altBefore   = "";
  @property({ type: String, attribute: "alt-after" })    altAfter    = "";
  @property({ type: Number }) initial = 50;
  @property({ type: String }) height = "400px";

  @state() private _pos = 50;
  #dragging = false;

  override connectedCallback() {
    super.connectedCallback();
    this._pos = this.initial;
    document.addEventListener("pointermove", this.#onMove);
    document.addEventListener("pointerup", this.#onUp);
  }
  override disconnectedCallback() {
    super.disconnectedCallback();
    document.removeEventListener("pointermove", this.#onMove);
    document.removeEventListener("pointerup", this.#onUp);
  }

  #onDown(e: PointerEvent) {
    this.#dragging = true;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    this.#updatePos(e);
  }

  readonly #onMove = (e: PointerEvent) => {
    if (!this.#dragging) return;
    this.#updatePos(e);
  };

  readonly #onUp = () => { this.#dragging = false; };

  #updatePos(e: PointerEvent) {
    const el = this.shadowRoot?.querySelector(".sp-ic") as HTMLElement;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const pos = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
    this._pos = pos;
    this.dispatchEvent(new CustomEvent("sp-change", { detail: { position: pos }, bubbles: true, composed: true }));
  }

  override render() {
    return html`
      <div
        class="sp-ic"
        style="height:${this.height}"
        @pointerdown=${(e: PointerEvent) => this.#onDown(e)}
      >
        <!-- After (full width underneath) -->
        <div class="sp-ic-after">
          <img src=${this.afterSrc} alt=${this.altAfter || SpConfig.locale.imageCompare.afterLabel} draggable="false" />
        </div>

        <!-- Before (clipped to left portion) -->
        <div
          class="sp-ic-before"
          style=${styleMap({ clipPath: `inset(0 ${100 - this._pos}% 0 0)` })}
        >
          <img src=${this.beforeSrc} alt=${this.altBefore || SpConfig.locale.imageCompare.beforeLabel} draggable="false" />
        </div>

        <!-- Handle -->
        <div class="sp-ic-handle" style=${styleMap({ left: `${this._pos}%` })}>
          <div class="sp-ic-knob">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M8 9l-4 3 4 3M16 9l4 3-4 3"/>
            </svg>
          </div>
        </div>

        ${(this.beforeLabel || SpConfig.locale.imageCompare.beforeLabel) ? html`<span class="sp-ic-label sp-ic-label--before">${this.beforeLabel || SpConfig.locale.imageCompare.beforeLabel}</span>` : nothing}
        ${(this.afterLabel  || SpConfig.locale.imageCompare.afterLabel)  ? html`<span class="sp-ic-label sp-ic-label--after">${this.afterLabel  || SpConfig.locale.imageCompare.afterLabel}</span>`  : nothing}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap { "sp-image-compare": SpImageCompareComponent; }
}
