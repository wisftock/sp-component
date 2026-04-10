import { LitElement, html, unsafeCSS, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import styles from "./sp-bottom-sheet.css?inline";
import { SpConfig } from "../../config.js";

/**
 * Bottom sheet — slides up from the bottom. Mobile-friendly.
 *
 * @element sp-bottom-sheet
 *
 * @prop {boolean} open        - Controls visibility
 * @prop {string}  title       - Sheet header title
 * @prop {boolean} overlay     - Show backdrop overlay (default true)
 * @prop {string}  snapHeight  - CSS height at which sheet snaps (default "50vh")
 * @prop {boolean} draggable   - Allow dragging to close (default true)
 *
 * @fires {CustomEvent} sp-close - Fired when the sheet is closed
 *
 * @slot - Default content
 * @slot footer - Footer content (pinned at bottom)
 */
@customElement("sp-bottom-sheet")
export class SpBottomSheetComponent extends LitElement {
  static override styles = unsafeCSS(styles);

  @property({ type: Boolean, reflect: true }) open = false;
  @property({ type: String }) title = "";
  @property({ type: Boolean }) overlay = true;
  @property({ type: String, attribute: "snap-height" }) snapHeight = "50vh";
  @property({ type: Boolean }) draggable = true;

  @state() private _dragStartY = 0;
  @state() private _dragDeltaY = 0;
  @state() private _isDragging = false;

  #close() {
    this.open = false;
    this.dispatchEvent(new CustomEvent("sp-close", { bubbles: true, composed: true }));
  }

  #onDragStart(e: PointerEvent) {
    if (!this.draggable) return;
    this._isDragging = true;
    this._dragStartY = e.clientY;
    this._dragDeltaY = 0;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }

  #onDragMove(e: PointerEvent) {
    if (!this._isDragging) return;
    this._dragDeltaY = Math.max(0, e.clientY - this._dragStartY);
  }

  #onDragEnd() {
    if (!this._isDragging) return;
    this._isDragging = false;
    if (this._dragDeltaY > 100) {
      this.#close();
    }
    this._dragDeltaY = 0;
  }

  override render() {
    if (!this.open) return nothing;

    const translateY = this._isDragging ? `${this._dragDeltaY}px` : "0";
    const transition = this._isDragging ? "none" : undefined;

    return html`
      ${this.overlay ? html`
        <div class="sp-bs-overlay" @click=${() => this.#close()}></div>
      ` : nothing}

      <div
        class="sp-bs"
        role="dialog"
        aria-modal="true"
        aria-label=${this.title || "Bottom sheet"}
        style="max-height:${this.snapHeight};transform:translateY(${translateY});${transition ? `transition:${transition}` : ""}"
      >
        <!-- Drag handle -->
        ${this.draggable ? html`
          <div
            class="sp-bs-handle-area"
            @pointerdown=${(e: PointerEvent) => this.#onDragStart(e)}
            @pointermove=${(e: PointerEvent) => this.#onDragMove(e)}
            @pointerup=${() => this.#onDragEnd()}
          >
            <div class="sp-bs-handle"></div>
          </div>
        ` : nothing}

        <!-- Header -->
        ${this.title ? html`
          <div class="sp-bs-header">
            <span class="sp-bs-title">${this.title}</span>
            <button class="sp-bs-close" aria-label=${SpConfig.locale.bottomSheet.closeLabel} @click=${() => this.#close()}>
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                <path d="M3 3l10 10M13 3L3 13"/>
              </svg>
            </button>
          </div>
        ` : nothing}

        <!-- Content -->
        <div class="sp-bs-content">
          <slot></slot>
        </div>

        <!-- Footer slot -->
        <div class="sp-bs-footer">
          <slot name="footer"></slot>
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap { "sp-bottom-sheet": SpBottomSheetComponent; }
}
