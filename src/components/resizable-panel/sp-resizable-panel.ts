import { LitElement, html, unsafeCSS } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import styles from "./sp-resizable-panel.css?inline";

/**
 * Two resizable panels separated by a draggable divider.
 *
 * @element sp-resizable-panel
 *
 * @prop {"horizontal"|"vertical"} direction - Split direction (default: "horizontal")
 * @prop {number}  initialSize - First panel size in % (default 50)
 * @prop {number}  minSize     - Minimum panel size in % (default 10)
 * @prop {number}  maxSize     - Maximum panel size in % (default 90)
 *
 * @fires {CustomEvent<{ size: number }>} sp-resize - Fired as user drags
 *
 * @slot first  - Content of the first (top/left) panel
 * @slot second - Content of the second (bottom/right) panel
 */
@customElement("sp-resizable-panel")
export class SpResizablePanelComponent extends LitElement {
  static override styles = unsafeCSS(styles);

  @property({ type: String }) direction: "horizontal" | "vertical" = "horizontal";
  @property({ type: Number, attribute: "initial-size" }) initialSize = 50;
  @property({ type: Number, attribute: "min-size" }) minSize = 10;
  @property({ type: Number, attribute: "max-size" }) maxSize = 90;

  @state() private _size = -1; // -1 = use initialSize
  @state() private _dragging = false;

  #startPos = 0;
  #startSize = 0;
  #containerSize = 0;

  #startDrag(e: PointerEvent) {
    e.preventDefault();
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    this._dragging = true;
    this.#startPos = this.direction === "horizontal" ? e.clientX : e.clientY;
    this.#startSize = this._size < 0 ? this.initialSize : this._size;
    const rect = this.getBoundingClientRect();
    this.#containerSize = this.direction === "horizontal" ? rect.width : rect.height;
  }

  #onDrag(e: PointerEvent) {
    if (!this._dragging) return;
    const pos = this.direction === "horizontal" ? e.clientX : e.clientY;
    const delta = ((pos - this.#startPos) / this.#containerSize) * 100;
    const newSize = Math.min(this.maxSize, Math.max(this.minSize, this.#startSize + delta));
    this._size = newSize;
    this.dispatchEvent(new CustomEvent("sp-resize", { detail: { size: newSize }, bubbles: true, composed: true }));
  }

  #stopDrag() { this._dragging = false; }

  override render() {
    const size = this._size < 0 ? this.initialSize : this._size;
    const isH = this.direction === "horizontal";
    const firstStyle = isH
      ? `width:${size}%;min-width:${this.minSize}%`
      : `height:${size}%;min-height:${this.minSize}%`;
    const secondStyle = isH
      ? `width:${100 - size}%;min-width:${this.minSize}%`
      : `height:${100 - size}%;min-height:${this.minSize}%`;

    return html`
      <div class="sp-rp sp-rp--${this.direction}${this._dragging ? " sp-rp--dragging" : ""}">
        <div class="sp-rp-panel" style=${firstStyle}>
          <slot name="first"></slot>
        </div>

        <div
          class="sp-rp-divider"
          @pointerdown=${(e: PointerEvent) => this.#startDrag(e)}
          @pointermove=${(e: PointerEvent) => this.#onDrag(e)}
          @pointerup=${() => this.#stopDrag()}
          @pointercancel=${() => this.#stopDrag()}
          aria-label="Resize"
          role="separator"
        >
          <div class="sp-rp-divider-handle">
            ${isH
              ? html`<svg width="4" height="20" viewBox="0 0 4 20" fill="currentColor"><circle cx="2" cy="4" r="1.5"/><circle cx="2" cy="10" r="1.5"/><circle cx="2" cy="16" r="1.5"/></svg>`
              : html`<svg width="20" height="4" viewBox="0 0 20 4" fill="currentColor"><circle cx="4" cy="2" r="1.5"/><circle cx="10" cy="2" r="1.5"/><circle cx="16" cy="2" r="1.5"/></svg>`
            }
          </div>
        </div>

        <div class="sp-rp-panel" style=${secondStyle}>
          <slot name="second"></slot>
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap { "sp-resizable-panel": SpResizablePanelComponent; }
}
