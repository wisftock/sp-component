import { LitElement, html, unsafeCSS, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { styleMap } from "lit/directives/style-map.js";
import styles from "./sp-progress-circle.css?inline";

export type SpProgressCircleStatus = "default" | "success" | "warning" | "error";

/**
 * Progress Circle — indicador de progreso circular SVG.
 *
 * @element sp-progress-circle
 *
 * @prop {number}                  value         - Porcentaje 0–100
 * @prop {number}                  size          - Tamaño en px (default 80)
 * @prop {number}                  stroke-width  - Grosor del trazo (default 8)
 * @prop {string}                  color         - Color CSS del trazo (default usa --sp-primary)
 * @prop {string}                  track-color   - Color de la pista de fondo
 * @prop {SpProgressCircleStatus}  status        - default | success | warning | error
 * @prop {boolean}                 show-value    - Muestra el porcentaje en el centro
 * @prop {string}                  label         - Texto secundario debajo del porcentaje
 * @prop {boolean}                 indeterminate - Animación infinita de carga
 *
 * @slot - Contenido personalizado en el centro (reemplaza show-value)
 */
@customElement("sp-progress-circle")
export class SpProgressCircleComponent extends LitElement {
  static override styles = unsafeCSS(styles);

  @property({ type: Number }) value = 0;
  @property({ type: Number }) size = 80;
  @property({ type: Number, attribute: "stroke-width" }) strokeWidth = 8;
  @property({ type: String }) color = "";
  @property({ type: String, attribute: "track-color" }) trackColor = "";
  @property({ type: String, reflect: true }) status: SpProgressCircleStatus = "default";
  @property({ type: Boolean, attribute: "show-value" }) showValue = true;
  @property({ type: String }) label = "";
  @property({ type: Boolean, reflect: true }) indeterminate = false;

  override render() {
    const r = (this.size - this.strokeWidth) / 2;
    const cx = this.size / 2;
    const circumference = 2 * Math.PI * r;
    const clampedValue = Math.min(100, Math.max(0, this.value));
    const offset = circumference - (clampedValue / 100) * circumference;

    const strokeColor = this.color || (
      this.status === "success" ? "var(--sp-success, #22c55e)" :
      this.status === "warning" ? "var(--sp-warning, #f59e0b)" :
      this.status === "error"   ? "var(--sp-error, #ef4444)" :
      "var(--sp-primary, #6366f1)"
    );

    return html`
      <div class="sp-pc" style="width:${this.size}px;height:${this.size}px;font-size:${this.size * 0.2}px">
        <svg class="sp-pc-svg" width=${this.size} height=${this.size} viewBox="0 0 ${this.size} ${this.size}">
          <circle
            class="sp-pc-track"
            cx=${cx} cy=${cx} r=${r}
            stroke-width=${this.strokeWidth}
            style=${this.trackColor ? styleMap({ stroke: this.trackColor }) : ""}
          />
          <circle
            class="sp-pc-fill"
            cx=${cx} cy=${cx} r=${r}
            stroke-width=${this.strokeWidth}
            stroke=${strokeColor}
            stroke-dasharray=${circumference}
            stroke-dashoffset=${this.indeterminate ? circumference * 0.75 : offset}
          />
        </svg>

        <div class="sp-pc-label">
          <slot>
            ${this.showValue && !this.indeterminate ? html`
              <span class="sp-pc-percent">${clampedValue}%</span>
              ${this.label ? html`<span class="sp-pc-sub">${this.label}</span>` : nothing}
            ` : nothing}
          </slot>
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap { "sp-progress-circle": SpProgressCircleComponent; }
}
