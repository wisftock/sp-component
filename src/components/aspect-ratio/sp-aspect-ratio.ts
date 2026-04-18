import { LitElement, html, unsafeCSS } from "lit";
import { customElement, property } from "lit/decorators.js";
import { styleMap } from "lit/directives/style-map.js";
import styles from "./sp-aspect-ratio.css?inline";

/**
 * Aspect Ratio — contenedor que mantiene una relación de aspecto fija.
 *
 * @element sp-aspect-ratio
 *
 * @prop {string|number} ratio - Relación "16/9", "4/3", "1/1", o número decimal (default "16/9")
 *
 * @slot - Contenido (img, video, iframe, etc.)
 *
 * @example
 * <sp-aspect-ratio ratio="16/9">
 *   <img src="..." alt="...">
 * </sp-aspect-ratio>
 */
@customElement("sp-aspect-ratio")
export class SpAspectRatioComponent extends LitElement {
  static override styles = unsafeCSS(styles);

  @property() ratio: string | number = "16/9";

  #getPadding(): string {
    if (typeof this.ratio === "number") {
      return `${(1 / this.ratio) * 100}%`;
    }
    const str = String(this.ratio);
    if (str.includes("/")) {
      const [w, h] = str.split("/").map(Number);
      if (w && h) return `${(h / w) * 100}%`;
    }
    const n = parseFloat(str);
    if (!isNaN(n) && n > 0) return `${(1 / n) * 100}%`;
    return "56.25%"; // fallback 16:9
  }

  override render() {
    return html`
      <div class="sp-ar" style=${styleMap({ "--sp-ar-padding": this.#getPadding() })}>
        <div class="sp-ar-content">
          <slot></slot>
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap { "sp-aspect-ratio": SpAspectRatioComponent; }
}
