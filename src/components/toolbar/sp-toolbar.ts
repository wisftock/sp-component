import { LitElement, html, unsafeCSS } from "lit";
import { customElement, property } from "lit/decorators.js";
import styles from "./sp-toolbar.css?inline";

/**
 * Toolbar — agrupador de botones de acción con separadores.
 * Los botones se pasan directamente via slot; el componente gestiona el layout
 * y añade `<sp-toolbar-sep>` para separadores.
 *
 * @element sp-toolbar
 *
 * @prop {"horizontal"|"vertical"} orientation - Dirección del toolbar (default horizontal)
 * @prop {string}                  label       - Aria-label accesible
 * @prop {boolean}                 flush       - Sin borde ni fondo (modo inline)
 *
 * @slot - Botones y separadores
 *
 * @example
 * <sp-toolbar label="Formato de texto">
 *   <button aria-pressed="true">B</button>
 *   <button>I</button>
 *   <sp-toolbar-sep></sp-toolbar-sep>
 *   <button>Link</button>
 * </sp-toolbar>
 */
@customElement("sp-toolbar")
export class SpToolbarComponent extends LitElement {
  static override styles = unsafeCSS(styles);

  @property({ type: String, reflect: true }) orientation: "horizontal" | "vertical" = "horizontal";
  @property({ type: String }) label = "Toolbar";
  @property({ type: Boolean, reflect: true }) flush = false;

  override render() {
    return html`
      <div
        class="sp-tb"
        role="toolbar"
        aria-label=${this.label}
        aria-orientation=${this.orientation}
      >
        <slot></slot>
      </div>
    `;
  }
}

/**
 * Toolbar Separator — divisor visual entre grupos de botones.
 * @element sp-toolbar-sep
 */
@customElement("sp-toolbar-sep")
export class SpToolbarSepComponent extends LitElement {
  static override styles = unsafeCSS(`
    *, *::before, *::after { box-sizing: border-box; }
    :host { display: contents; }
    .sp-tb-sep { width: 1px; height: 20px; background: var(--sp-border, #e5e7eb); margin: 0 4px; flex-shrink: 0; }
  `);

  override render() {
    return html`<div class="sp-tb-sep" role="separator" aria-orientation="vertical"></div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "sp-toolbar": SpToolbarComponent;
    "sp-toolbar-sep": SpToolbarSepComponent;
  }
}
