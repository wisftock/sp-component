import { LitElement, html, unsafeCSS, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import { styleMap } from "lit/directives/style-map.js";
import styles from "./sp-color-swatch.css?inline";

export interface SpSwatchColor {
  color: string;    // Valor CSS del color
  label?: string;   // Nombre (ej: "Azul primario")
  disabled?: boolean;
}

export type SpSwatchShape = "circle" | "square";
export type SpSwatchSize  = "xs" | "sm" | "md" | "lg" | "xl";

/**
 * Color Swatch — display visual de una paleta de colores.
 * Click para seleccionar; hover para ver el valor; doble-click para copiar.
 *
 * @element sp-color-swatch
 *
 * @prop {SpSwatchColor[]} colors   - Array de colores
 * @prop {string}          value    - Color actualmente seleccionado
 * @prop {SpSwatchShape}   shape    - circle | square (default circle)
 * @prop {SpSwatchSize}    size     - xs | sm | md | lg | xl (default md)
 * @prop {boolean}         show-label - Muestra el nombre debajo de cada swatch
 * @prop {boolean}         copyable - Click copia el valor al portapapeles
 * @prop {boolean}         multiple - Permite selección múltiple
 *
 * @fires {CustomEvent<{color:SpSwatchColor}>}     sp-select - Al seleccionar un color
 * @fires {CustomEvent<{color:string}>}            sp-copy   - Al copiar un color
 */
@customElement("sp-color-swatch")
export class SpColorSwatchComponent extends LitElement {
  static override styles = unsafeCSS(styles);

  @property({ type: Array }) colors: SpSwatchColor[] = [];
  @property({ type: String }) value = "";
  @property({ type: String, reflect: true }) shape: SpSwatchShape = "circle";
  @property({ type: String, reflect: true }) size: SpSwatchSize = "md";
  @property({ type: Boolean, attribute: "show-label" }) showLabel = false;
  @property({ type: Boolean }) copyable = true;
  @property({ type: Boolean }) multiple = false;

  @state() private _selected: Set<string> = new Set();
  @state() private _hovered = "";
  @state() private _copied = "";

  override updated(changed: Map<string, unknown>) {
    if (changed.has("value") && this.value) {
      this._selected = new Set([this.value]);
    }
  }

  async #handleClick(swatch: SpSwatchColor) {
    if (swatch.disabled) return;

    if (this.multiple) {
      const next = new Set(this._selected);
      if (next.has(swatch.color)) next.delete(swatch.color);
      else next.add(swatch.color);
      this._selected = next;
    } else {
      this._selected = new Set([swatch.color]);
      this.value = swatch.color;
    }

    this.dispatchEvent(new CustomEvent("sp-select", {
      detail: { color: swatch },
      bubbles: true, composed: true,
    }));

    if (this.copyable) {
      try {
        await navigator.clipboard.writeText(swatch.color);
        this._copied = swatch.color;
        setTimeout(() => { this._copied = ""; }, 1500);
        this.dispatchEvent(new CustomEvent("sp-copy", {
          detail: { color: swatch.color },
          bubbles: true, composed: true,
        }));
      } catch {}
    }
  }

  #isLight(color: string): boolean {
    const canvas = document.createElement("canvas");
    canvas.width = 1; canvas.height = 1;
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, 1, 1);
    const [r = 0, g = 0, b = 0] = ctx.getImageData(0, 0, 1, 1).data;
    return (r * 299 + g * 587 + b * 114) / 1000 > 128;
  }

  override render() {
    return html`
      <div class="sp-sw" role="group" aria-label="Paleta de colores">
        ${this.colors.map(swatch => {
          const isSelected = this._selected.has(swatch.color) || this.value === swatch.color;
          const isHovered = this._hovered === swatch.color;
          const isCopied = this._copied === swatch.color;
          const checkColor = this.#isLight(swatch.color) ? "#000" : "#fff";

          return html`
            <div class="sp-sw-item">
              ${isHovered && !this.showLabel ? html`
                <span class="sp-sw-tooltip">
                  ${isCopied ? "¡Copiado!" : (swatch.label || swatch.color)}
                </span>
              ` : nothing}
              <button
                class=${classMap({
                  "sp-sw-color": true,
                  "sp-sw-color--selected": isSelected,
                  "sp-sw-color--disabled": !!swatch.disabled,
                })}
                style=${styleMap({ background: swatch.color })}
                aria-label=${swatch.label || swatch.color}
                aria-pressed=${isSelected}
                title=${swatch.label || swatch.color}
                @click=${() => this.#handleClick(swatch)}
                @mouseenter=${() => { this._hovered = swatch.color; }}
                @mouseleave=${() => { this._hovered = ""; }}
              >
                ${isSelected ? html`
                  <span class="sp-sw-check">
                    <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke=${checkColor} stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M3 8l4 4 6-7"/>
                    </svg>
                  </span>
                ` : nothing}
              </button>
              ${this.showLabel ? html`
                <span class="sp-sw-label">${swatch.label || swatch.color}</span>
              ` : nothing}
            </div>
          `;
        })}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap { "sp-color-swatch": SpColorSwatchComponent; }
}
