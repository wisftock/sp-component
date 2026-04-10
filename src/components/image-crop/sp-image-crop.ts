import { LitElement, html, unsafeCSS, nothing } from "lit";
import { customElement, property, state, query } from "lit/decorators.js";
import { styleMap } from "lit/directives/style-map.js";
import styles from "./sp-image-crop.css?inline";

interface Rect { x: number; y: number; w: number; h: number; }

/**
 * Image crop component with canvas. Drag to move, handles to resize.
 * After applying the crop the result fills the container with a Cancel button
 * that returns to the original crop view.
 *
 * @element sp-image-crop
 *
 * @prop {string}  src          - Image URL or data URL to crop
 * @prop {number}  aspectRatio  - Lock aspect ratio (0 = free, 1 = square, 1.77 = 16:9)
 * @prop {number}  outputWidth  - Output canvas width (0 = natural crop size)
 * @prop {number}  outputHeight - Output canvas height
 * @prop {"png"|"jpeg"|"webp"} format - Output format (default: "png")
 * @prop {number}  quality      - JPEG/WebP quality 0–1 (default: 0.92)
 * @prop {string}  label        - Optional label above the crop area
 *
 * @fires {CustomEvent<{ dataUrl: string, width: number, height: number }>} sp-crop
 * @fires {CustomEvent} sp-cancel - Fired when Cancel is clicked on the result view
 */
@customElement("sp-image-crop")
export class SpImageCropComponent extends LitElement {
  static override styles = unsafeCSS(styles);

  @property({ type: String }) src = "";
  @property({ type: Number, attribute: "aspect-ratio" }) aspectRatio = 0;
  @property({ type: Number, attribute: "output-width"  }) outputWidth  = 0;
  @property({ type: Number, attribute: "output-height" }) outputHeight = 0;
  @property({ type: String }) format: "png" | "jpeg" | "webp" = "png";
  @property({ type: Number }) quality = 0.92;
  @property({ type: String }) label = "";

  @query("canvas") private _canvas!: HTMLCanvasElement;

  @state() private _img: HTMLImageElement | null = null;
  @state() private _canvasW = 0;
  @state() private _canvasH = 0;
  @state() private _sel: Rect = { x: 0, y: 0, w: 0, h: 0 };
  @state() private _dragging: "move" | "tl" | "tr" | "bl" | "br" | null = null;
  /** DataURL of the cropped result — when set, shows result view */
  @state() private _result: string | null = null;
  @state() private _zoom = 1;
  @state() private _rotation = 0; // 0 | 90 | 180 | 270

  private _startMouse = { x: 0, y: 0 };
  private _startSel: Rect = { x: 0, y: 0, w: 0, h: 0 };

  override updated(changed: Map<string, unknown>) {
    if (changed.has("src") && this.src) {
      this._result = null;
      this._zoom = 1;
      this._rotation = 0;
      this.#loadImage();
    } else if (this._img && !this._result) {
      this.#drawCanvas();
    }
  }

  #loadImage() {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      this._img = img;
      this.#applyRotationAndZoom();
    };
    img.onerror = () => { this._img = null; };
    img.src = this.src;
  }

  #applyRotationAndZoom() {
    if (!this._img) return;
    const maxW = this.offsetWidth || 600;
    const isTransposed = this._rotation === 90 || this._rotation === 270;
    const natW = isTransposed ? this._img.naturalHeight : this._img.naturalWidth;
    const natH = isTransposed ? this._img.naturalWidth : this._img.naturalHeight;
    const scale = Math.min(1, maxW / natW) * this._zoom;
    this._canvasW = Math.round(natW * scale);
    this._canvasH = Math.round(natH * scale);
    this.#resetSelection();
    this.requestUpdate();
  }

  #onWheel(e: WheelEvent) {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    this._zoom = Math.max(0.2, Math.min(4, this._zoom + delta));
    this.#applyRotationAndZoom();
  }

  #rotateImage() {
    this._rotation = (this._rotation + 90) % 360;
    this.#applyRotationAndZoom();
  }

  #resetSelection() {
    const pad = 20;
    if (this.aspectRatio > 0 && this._canvasW && this._canvasH) {
      const w = this._canvasW - pad * 2;
      const h = w / this.aspectRatio;
      const clampedH = Math.min(h, this._canvasH - pad * 2);
      const clampedW = clampedH * this.aspectRatio;
      this._sel = {
        x: (this._canvasW - clampedW) / 2,
        y: (this._canvasH - clampedH) / 2,
        w: clampedW, h: clampedH,
      };
    } else {
      this._sel = { x: pad, y: pad, w: this._canvasW - pad * 2, h: this._canvasH - pad * 2 };
    }
  }

  #drawCanvas() {
    const canvas = this._canvas;
    if (!canvas || !this._img) return;
    const ctx = canvas.getContext("2d")!;
    ctx.clearRect(0, 0, this._canvasW, this._canvasH);
    ctx.save();
    ctx.translate(this._canvasW / 2, this._canvasH / 2);
    ctx.rotate((this._rotation * Math.PI) / 180);
    const isTransposed = this._rotation === 90 || this._rotation === 270;
    const dw = isTransposed ? this._canvasH : this._canvasW;
    const dh = isTransposed ? this._canvasW : this._canvasH;
    ctx.drawImage(this._img, -dw / 2, -dh / 2, dw, dh);
    ctx.restore();
  }

  override firstUpdated() {
    if (this._img) this.#drawCanvas();
  }

  protected override async scheduleUpdate() {
    await super.scheduleUpdate();
    if (this._img && !this._result) this.#drawCanvas();
  }

  #scale(): number {
    if (!this._img || !this._canvasW) return 1;
    return this._img.naturalWidth / this._canvasW;
  }

  #onPointerDown(e: PointerEvent, area: typeof this._dragging) {
    e.preventDefault();
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    this._dragging = area;
    this._startMouse = { x: e.clientX, y: e.clientY };
    this._startSel = { ...this._sel };
  }

  #onPointerMove(e: PointerEvent) {
    if (!this._dragging) return;
    const dx = e.clientX - this._startMouse.x;
    const dy = e.clientY - this._startMouse.y;
    const s = { ...this._startSel };
    const MIN = 20;

    let newSel: Rect;
    if (this._dragging === "move") {
      newSel = {
        x: Math.max(0, Math.min(this._canvasW - s.w, s.x + dx)),
        y: Math.max(0, Math.min(this._canvasH - s.h, s.y + dy)),
        w: s.w, h: s.h,
      };
    } else if (this._dragging === "br") {
      const newW = Math.max(MIN, s.w + dx);
      newSel = { ...s, w: newW, h: this.aspectRatio > 0 ? newW / this.aspectRatio : Math.max(MIN, s.h + dy) };
    } else if (this._dragging === "tr") {
      const newW = Math.max(MIN, s.w + dx);
      const newH = this.aspectRatio > 0 ? newW / this.aspectRatio : Math.max(MIN, s.h - dy);
      newSel = { ...s, y: s.y + s.h - newH, w: newW, h: newH };
    } else if (this._dragging === "tl") {
      const newW = Math.max(MIN, s.w - dx);
      const newH = this.aspectRatio > 0 ? newW / this.aspectRatio : Math.max(MIN, s.h - dy);
      newSel = { x: s.x + s.w - newW, y: s.y + s.h - newH, w: newW, h: newH };
    } else {
      const newW = Math.max(MIN, s.w - dx);
      newSel = { ...s, x: s.x + s.w - newW, w: newW, h: this.aspectRatio > 0 ? newW / this.aspectRatio : Math.max(MIN, s.h + dy) };
    }
    this._sel = newSel;
  }

  #onPointerUp() { this._dragging = null; }

  async #applyCrop() {
    if (!this._img) return;
    const scale = this.#scale();
    const srcX = this._sel.x * scale;
    const srcY = this._sel.y * scale;
    const srcW = this._sel.w * scale;
    const srcH = this._sel.h * scale;
    const outW = this.outputWidth  || Math.round(srcW);
    const outH = this.outputHeight || Math.round(srcH);

    const out = document.createElement("canvas");
    out.width = outW;
    out.height = outH;
    out.getContext("2d")!.drawImage(this._img, srcX, srcY, srcW, srcH, 0, 0, outW, outH);
    const mime = `image/${this.format}`;
    const dataUrl = out.toDataURL(mime, this.quality);

    // Show result view
    this._result = dataUrl;

    this.dispatchEvent(new CustomEvent("sp-crop", {
      detail: { dataUrl, width: outW, height: outH },
      bubbles: true, composed: true,
    }));
  }

  #cancelResult() {
    this._result = null;
    this.dispatchEvent(new CustomEvent("sp-cancel", { bubbles: true, composed: true }));
    // Redraw original image on next update
    this.requestUpdate();
  }

  override render() {
    if (!this._img) {
      return html`
        <div class="sp-crop sp-crop--empty">
          ${this.label ? html`<label class="sp-crop__label">${this.label}</label>` : nothing}
          <div class="sp-crop__placeholder">
            ${this.src ? "Loading image…" : "No image source provided"}
          </div>
        </div>
      `;
    }

    // ── Result view ───────────────────────────────────────────
    if (this._result) {
      return html`
        <div class="sp-crop">
          ${this.label ? html`<label class="sp-crop__label">${this.label}</label>` : nothing}
          <div class="sp-crop__result-wrap">
            <img
              class="sp-crop__result-img"
              src=${this._result}
              alt="Cropped result"
            />
          </div>
          <div class="sp-crop__footer">
            <span class="sp-crop__info">Crop applied</span>
            <div class="sp-crop__actions">
              <button class="sp-crop__btn" type="button" @click=${() => this.#cancelResult()}>
                Cancel — restore original
              </button>
            </div>
          </div>
        </div>
      `;
    }

    // ── Crop editor view ──────────────────────────────────────
    const { x, y, w, h } = this._sel;
    const scale = this.#scale();

    return html`
      <div class="sp-crop">
        ${this.label ? html`<label class="sp-crop__label">${this.label}</label>` : nothing}

        <div class="sp-crop__canvas-wrap"
          style=${styleMap({ width: this._canvasW + "px", height: this._canvasH + "px" })}
          @pointermove=${(e: PointerEvent) => this.#onPointerMove(e)}
          @pointerup=${() => this.#onPointerUp()}
          @pointerleave=${() => this.#onPointerUp()}
          @wheel=${(e: WheelEvent) => this.#onWheel(e)}
        >
          <canvas class="sp-crop__canvas" width=${this._canvasW} height=${this._canvasH} role="img" aria-label="Image crop area"></canvas>

          <svg class="sp-crop__overlay" viewBox="0 0 ${this._canvasW} ${this._canvasH}"
            xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
            <path fill="rgba(0,0,0,0.5)" fill-rule="evenodd"
              d="M0,0 H${this._canvasW} V${this._canvasH} H0 Z M${x},${y} H${x + w} V${y + h} H${x} Z"
            />
          </svg>

          <div class="sp-crop__sel"
            style=${styleMap({ left: x + "px", top: y + "px", width: w + "px", height: h + "px" })}
            @pointerdown=${(e: PointerEvent) => this.#onPointerDown(e, "move")}
          >
            <div class="sp-crop__grid"></div>
            <div class="sp-crop__handle sp-crop__handle--tl" @pointerdown=${(e: PointerEvent) => { e.stopPropagation(); this.#onPointerDown(e, "tl"); }}></div>
            <div class="sp-crop__handle sp-crop__handle--tr" @pointerdown=${(e: PointerEvent) => { e.stopPropagation(); this.#onPointerDown(e, "tr"); }}></div>
            <div class="sp-crop__handle sp-crop__handle--bl" @pointerdown=${(e: PointerEvent) => { e.stopPropagation(); this.#onPointerDown(e, "bl"); }}></div>
            <div class="sp-crop__handle sp-crop__handle--br" @pointerdown=${(e: PointerEvent) => { e.stopPropagation(); this.#onPointerDown(e, "br"); }}></div>
          </div>
        </div>

        <div class="sp-crop__footer">
          <span class="sp-crop__info">
            ${Math.round(w * scale)} × ${Math.round(h * scale)} px
            ${this.aspectRatio > 0 ? `· ${this.aspectRatio === 1 ? "1:1" : this.aspectRatio.toFixed(2)}` : ""}
            · ${Math.round(this._zoom * 100)}%
          </span>
          <div class="sp-crop__actions">
            <button class="sp-crop__btn" type="button" title="Rotate 90°" @click=${() => this.#rotateImage()}>
              <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
                <path d="M13 5H7a4 4 0 000 8M13 5l-2-2M13 5l-2 2"/>
              </svg>
              Rotate
            </button>
            <button class="sp-crop__btn" type="button" @click=${() => { this._zoom = 1; this.#applyRotationAndZoom(); }}>Reset zoom</button>
            <button class="sp-crop__btn" type="button" @click=${() => this.#resetSelection()}>Reset crop</button>
            <button class="sp-crop__btn sp-crop__btn--primary" type="button" @click=${() => this.#applyCrop()}>Apply crop</button>
          </div>
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap { "sp-image-crop": SpImageCropComponent; }
}
