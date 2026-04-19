import { LitElement, html, unsafeCSS, nothing } from "lit";
import { customElement, property, state, query } from "lit/decorators.js";
import styles from "./sp-signature.css?inline";
import { SpConfig } from "../../config.js";

export interface SpSignatureResult {
  dataUrl: string;
  isEmpty: boolean;
}

/**
 * Freehand signature pad using canvas with Bézier smoothing.
 *
 * @element sp-signature
 *
 * @prop {number}  width       - Canvas width in px (default 400)
 * @prop {number}  height      - Canvas height in px (default 200)
 * @prop {string}  penColor    - Stroke color (default "#000000")
 * @prop {number}  penWidth    - Stroke width in px (default 2)
 * @prop {string}  label       - Label text
 * @prop {boolean} disabled    - Disables drawing
 * @prop {boolean} showControls - Show color/width controls (default true)
 * @prop {boolean} showColors  - Show color palette within controls (default true)
 * @prop {number}  maxUndo     - Max undo steps (default 20)
 *
 * @fires {CustomEvent<SpSignatureResult>} sp-change - Fired after each stroke ends
 * @fires {CustomEvent} sp-clear - Fired when canvas is cleared
 */
@customElement("sp-signature")
export class SpSignatureComponent extends LitElement {
  static override styles = unsafeCSS(styles);

  @property({ type: Number }) width = 400;
  @property({ type: Number }) height = 200;
  @property({ type: String, attribute: "pen-color" }) penColor = "#000000";
  @property({ type: Number, attribute: "pen-width" }) penWidth = 2;
  @property({ type: String }) label = "";
  @property({ type: Boolean, reflect: true }) disabled = false;
  @property({ type: Boolean, attribute: "show-controls" }) showControls = true;
  @property({ type: Boolean, attribute: "show-colors" }) showColors = true;
  @property({ type: Number, attribute: "max-undo" }) maxUndo = 20;

  @query("canvas") private _canvas!: HTMLCanvasElement;
  @state() private _drawing = false;
  @state() private _empty = true;
  @state() private _undoStack: ImageData[] = [];

  private _ctx: CanvasRenderingContext2D | null = null;
  private _pts: Array<{ x: number; y: number }> = [];

  override firstUpdated() {
    this._ctx = this._canvas.getContext("2d")!;
    this._ctx.lineCap = "round";
    this._ctx.lineJoin = "round";
  }

  #getPos(e: PointerEvent): { x: number; y: number } {
    const rect = this._canvas.getBoundingClientRect();
    return {
      x: (e.clientX - rect.left) * (this._canvas.width / rect.width),
      y: (e.clientY - rect.top) * (this._canvas.height / rect.height),
    };
  }

  #startDraw(e: PointerEvent) {
    if (this.disabled) return;
    e.preventDefault();
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    // Save snapshot for undo
    const snap = this._ctx!.getImageData(0, 0, this._canvas.width, this._canvas.height);
    this._undoStack = [...this._undoStack.slice(-(this.maxUndo - 1)), snap];
    this._drawing = true;
    this._pts = [];
    const pos = this.#getPos(e);
    this._pts.push(pos);
    this._ctx!.beginPath();
    this._ctx!.moveTo(pos.x, pos.y);
  }

  #draw(e: PointerEvent) {
    if (!this._drawing || this.disabled) return;
    e.preventDefault();
    const pos = this.#getPos(e);
    this._pts.push(pos);
    const len = this._pts.length;

    this._ctx!.strokeStyle = this.penColor;
    this._ctx!.lineWidth = this.penWidth;

    if (len === 2) {
      const p0 = this._pts[0]!;
      const p1 = this._pts[1]!;
      this._ctx!.beginPath();
      this._ctx!.moveTo(p0.x, p0.y);
      this._ctx!.lineTo(p1.x, p1.y);
      this._ctx!.stroke();
    } else if (len >= 3) {
      const p0 = this._pts[len - 3]!;
      const p1 = this._pts[len - 2]!;
      const p2 = this._pts[len - 1]!;
      const mx1 = (p0.x + p1.x) / 2;
      const my1 = (p0.y + p1.y) / 2;
      const mx2 = (p1.x + p2.x) / 2;
      const my2 = (p1.y + p2.y) / 2;
      this._ctx!.beginPath();
      this._ctx!.moveTo(mx1, my1);
      this._ctx!.quadraticCurveTo(p1.x, p1.y, mx2, my2);
      this._ctx!.stroke();
    }
    this._empty = false;
  }

  #endDraw() {
    if (!this._drawing) return;
    this._drawing = false;
    this._pts = [];
    this.dispatchEvent(new CustomEvent<SpSignatureResult>("sp-change", {
      detail: { dataUrl: this._canvas.toDataURL(), isEmpty: this._empty },
      bubbles: true, composed: true,
    }));
    this.requestUpdate(); // refresh _empty state in template
  }

  undo() {
    if (this._undoStack.length === 0) return;
    const stack = [...this._undoStack];
    const last = stack.pop()!;
    this._undoStack = stack;
    this._ctx!.putImageData(last, 0, 0);
    this._empty = stack.length === 0;
    this.requestUpdate();
  }

  clear() {
    this._ctx?.clearRect(0, 0, this._canvas.width, this._canvas.height);
    this._undoStack = [];
    this._empty = true;
    this.dispatchEvent(new CustomEvent("sp-clear", { bubbles: true, composed: true }));
  }

  toDataURL(type = "image/png"): string {
    return this._canvas?.toDataURL(type) ?? "";
  }

  get isEmpty(): boolean {
    return this._empty;
  }

  override render() {
    const COLORS = ["#000000", "#1d4ed8", "#15803d", "#b91c1c", "#7c3aed", "#92400e"];

    return html`
      <div class="sp-signature">
        ${this.label ? html`<label class="sp-signature__label">${this.label}</label>` : nothing}

        <div class="sp-signature__canvas-wrap">
          <canvas
            width=${this.width}
            height=${this.height}
            @pointerdown=${(e: PointerEvent) => this.#startDraw(e)}
            @pointermove=${(e: PointerEvent) => this.#draw(e)}
            @pointerup=${() => this.#endDraw()}
            @pointerleave=${() => this.#endDraw()}
            style="touch-action:none;cursor:${this.disabled ? "not-allowed" : "crosshair"}"
          ></canvas>
          ${this._empty ? html`<span class="sp-signature__placeholder">Sign here</span>` : nothing}
        </div>

        <div class="sp-signature__footer">
          ${this.showControls ? html`
            <div class="sp-signature__controls">
              ${this.showColors ? html`
                <div class="sp-signature__colors">
                  ${COLORS.map(c => html`
                    <button
                      class="sp-signature__color-btn${this.penColor === c ? " sp-signature__color-btn--active" : ""}"
                      style="background:${c}"
                      title="${c}"
                      @click=${() => { this.penColor = c; }}
                    ></button>
                  `)}
                </div>
              ` : nothing}
              <input
                class="sp-signature__width-input"
                type="range"
                min="1" max="12" step="0.5"
                .value=${String(this.penWidth)}
                title=${SpConfig.locale.signature.penWidthLabel.replace("{n}", String(this.penWidth))}
                @input=${(e: Event) => { this.penWidth = Number((e.target as HTMLInputElement).value); }}
              />
            </div>
          ` : nothing}

          <div class="sp-signature__actions">
            <button
              type="button"
              class="sp-signature__btn"
              ?disabled=${this.disabled || this._undoStack.length === 0}
              title=${SpConfig.locale.signature.undoLabel}
              @click=${() => this.undo()}
            >
              <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
                <path d="M3 7H10a4 4 0 010 8H7M3 7l3-3M3 7l3 3"/>
              </svg>
              ${SpConfig.locale.signature.undoLabel}
            </button>
            <button
              type="button"
              class="sp-signature__btn sp-signature__btn--clear"
              ?disabled=${this.disabled || this._empty}
              @click=${() => this.clear()}
            >${SpConfig.locale.signature.clearLabel}</button>
          </div>
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "sp-signature": SpSignatureComponent;
  }
}
