import { LitElement, html, unsafeCSS } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { styleMap } from "lit/directives/style-map.js";
import styles from "./sp-watermark.css?inline";

/**
 * Watermark — marca de agua generada con canvas sobre el contenido.
 *
 * @element sp-watermark
 *
 * @prop {string}   text     - Texto de la marca de agua
 * @prop {string}   image    - URL de imagen alternativa al texto
 * @prop {number}   opacity  - Opacidad 0–1 (default 0.15)
 * @prop {number}   rotate   - Rotación en grados (default -22)
 * @prop {number}   gap-x    - Espacio horizontal entre repeticiones (default 200)
 * @prop {number}   gap-y    - Espacio vertical entre repeticiones (default 140)
 * @prop {string}   font     - Fuente del texto (default "14px sans-serif")
 * @prop {string}   color    - Color del texto (default "#000")
 *
 * @slot - Contenido sobre el que se aplica la marca
 */
@customElement("sp-watermark")
export class SpWatermarkComponent extends LitElement {
  static override styles = unsafeCSS(styles);

  @property({ type: String }) text = "CONFIDENCIAL";
  @property({ type: String }) image = "";
  @property({ type: Number }) opacity = 0.15;
  @property({ type: Number }) rotate = -22;
  @property({ type: Number, attribute: "gap-x" }) gapX = 200;
  @property({ type: Number, attribute: "gap-y" }) gapY = 140;
  @property({ type: String }) font = "14px sans-serif";
  @property({ type: String }) color = "#000";

  @state() private _dataUrl = "";

  override async updated(changed: Map<string, unknown>) {
    const watched = ["text","image","opacity","rotate","gapX","gapY","font","color"];
    if ([...changed.keys()].some(k => watched.includes(k as string))) {
      this._dataUrl = await this.#generatePattern();
    }
  }

  override async connectedCallback() {
    super.connectedCallback();
    this._dataUrl = await this.#generatePattern();
  }

  async #generatePattern(): Promise<string> {
    const canvas = document.createElement("canvas");
    const dpr = window.devicePixelRatio || 1;
    const w = this.gapX * dpr;
    const h = this.gapY * dpr;
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d")!;
    ctx.scale(dpr, dpr);

    if (this.image) {
      const img = new Image();
      img.crossOrigin = "anonymous";
      await new Promise<void>(res => { img.onload = () => res(); img.onerror = () => res(); img.src = this.image; });
      ctx.save();
      ctx.translate(this.gapX / 2, this.gapY / 2);
      ctx.rotate((this.rotate * Math.PI) / 180);
      ctx.globalAlpha = this.opacity;
      const size = Math.min(this.gapX, this.gapY) * 0.6;
      ctx.drawImage(img, -size / 2, -size / 2, size, size);
      ctx.restore();
    } else {
      ctx.save();
      ctx.translate(this.gapX / 2, this.gapY / 2);
      ctx.rotate((this.rotate * Math.PI) / 180);
      ctx.globalAlpha = this.opacity;
      ctx.font = this.font;
      ctx.fillStyle = this.color;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(this.text, 0, 0);
      ctx.restore();
    }

    return canvas.toDataURL();
  }

  override render() {
    return html`
      <div class="sp-wm">
        <div class="sp-wm-content"><slot></slot></div>
        ${this._dataUrl ? html`
          <div
            class="sp-wm-layer"
            style=${styleMap({
              backgroundImage: `url(${this._dataUrl})`,
              backgroundSize: `${this.gapX}px ${this.gapY}px`,
            })}
          ></div>
        ` : ""}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap { "sp-watermark": SpWatermarkComponent; }
}
