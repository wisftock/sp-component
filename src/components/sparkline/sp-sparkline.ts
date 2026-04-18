import { LitElement, html, svg, unsafeCSS, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import styles from "./sp-sparkline.css?inline";

type SparkType = "line" | "bar" | "area";

/**
 * Sparkline — mini gráfico inline SVG para tablas y cards.
 *
 * @element sp-sparkline
 *
 * @prop {number[]}  values   - Array de valores a graficar
 * @prop {string}    type     - "line" | "bar" | "area" (default: "line")
 * @prop {number}    width    - Ancho en px (default: 80)
 * @prop {number}    height   - Alto en px (default: 28)
 * @prop {string}    color    - Color de la línea/barras
 * @prop {boolean}   fill     - Relleno bajo la línea (solo type=line)
 * @prop {number}    stroke-width - Grosor de línea (default: 1.5)
 */
@customElement("sp-sparkline")
export class SpSparklineComponent extends LitElement {
  static override styles = unsafeCSS(styles);

  @property({ type: Array }) values: number[] = [];
  @property({ type: String }) type: SparkType = "line";
  @property({ type: Number }) width = 80;
  @property({ type: Number }) height = 28;
  @property({ type: String }) color = "var(--sp-primary, #6366f1)";
  @property({ type: Boolean }) fill = false;
  @property({ type: Number, attribute: "stroke-width" }) strokeWidth = 1.5;

  @state() private _tipText = "";
  @state() private _tipX = 0;
  @state() private _tipY = 0;
  @state() private _tipVisible = false;

  #pts(vals: number[]): [number, number][] {
    const min = Math.min(...vals);
    const max = Math.max(...vals);
    const range = max - min || 1;
    const pad = 2;
    const w = this.width;
    const h = this.height;
    const step = vals.length > 1 ? (w - pad * 2) / (vals.length - 1) : 0;
    return vals.map((v, i) => [
      pad + i * step,
      pad + ((1 - (v - min) / range) * (h - pad * 2)),
    ]);
  }

  #showTip(e: MouseEvent, val: number) {
    this._tipText = String(val);
    this._tipX = e.clientX + 8;
    this._tipY = e.clientY - 22;
    this._tipVisible = true;
  }

  #hideTip() {
    this._tipVisible = false;
  }

  #renderLine() {
    const pts = this.#pts(this.values);
    if (pts.length < 2) return nothing;
    const pathD = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p[0]},${p[1]}`).join(" ");
    const last = pts[pts.length - 1]!;
    const first = pts[0]!;
    const areaD = pathD + ` L${last[0]},${this.height - 2} L${first[0]},${this.height - 2} Z`;
    return svg`
      ${this.fill ? svg`<path d=${areaD} fill=${this.color} opacity="0.15" stroke="none"/>` : nothing}
      <path d=${pathD} fill="none" stroke=${this.color} stroke-width=${this.strokeWidth}
            stroke-linecap="round" stroke-linejoin="round"/>
      ${pts.map((p, i) => svg`
        <circle cx=${p[0]} cy=${p[1]} r="3" fill=${this.color} opacity="0"
          @mousemove=${(e: MouseEvent) => this.#showTip(e, this.values[i] ?? 0)}
          @mouseleave=${() => this.#hideTip()}
          style="pointer-events:all; cursor:default;"
        />
      `)}
    `;
  }

  #renderArea() {
    const pts = this.#pts(this.values);
    if (pts.length < 2) return nothing;
    const pathD = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p[0]},${p[1]}`).join(" ");
    const areaD = pathD + ` L${pts[pts.length - 1]![0]},${this.height - 2} L${pts[0]![0]},${this.height - 2} Z`;
    return svg`
      <path d=${areaD} fill=${this.color} opacity="0.25" stroke="none"/>
      <path d=${pathD} fill="none" stroke=${this.color} stroke-width=${this.strokeWidth}
            stroke-linecap="round" stroke-linejoin="round"/>
    `;
  }

  #renderBar() {
    const vals = this.values;
    if (!vals.length) return nothing;
    const min = Math.min(0, ...vals);
    const max = Math.max(...vals);
    const range = max - min || 1;
    const pad = 1;
    const barW = (this.width - pad * 2) / vals.length - 2;
    const h = this.height;
    return vals.map((v, i) => {
      const barH = Math.max(2, ((v - min) / range) * (h - pad * 4));
      const x = pad + i * ((this.width - pad * 2) / vals.length) + 1;
      const y = h - pad - barH;
      return svg`
        <rect x=${x} y=${y} width=${barW} height=${barH}
              fill=${this.color} rx="1"
              @mousemove=${(e: MouseEvent) => this.#showTip(e, v)}
              @mouseleave=${() => this.#hideTip()}
        />
      `;
    });
  }

  override render() {
    return html`
      <div class="sp-sparkline">
        <svg
          width=${this.width}
          height=${this.height}
          viewBox="0 0 ${this.width} ${this.height}"
          xmlns="http://www.w3.org/2000/svg"
        >
          ${this.type === "bar" ? this.#renderBar()
            : this.type === "area" ? this.#renderArea()
            : this.#renderLine()}
        </svg>
        <div
          class="sp-sparkline-tooltip ${this._tipVisible ? "visible" : ""}"
          style="left:${this._tipX}px;top:${this._tipY}px"
        >${this._tipText}</div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap { "sp-sparkline": SpSparklineComponent; }
}
