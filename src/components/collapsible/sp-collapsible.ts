import { LitElement, html, unsafeCSS } from "lit";
import { customElement, property } from "lit/decorators.js";
import styles from "./sp-collapsible.css?inline";

/**
 * Collapsible — primitivo expandible/colapsable con animación de altura.
 * Más ligero que sp-accordion; ideal como bloque de construcción.
 *
 * @element sp-collapsible
 *
 * @prop {boolean} open     - Controla si está expandido
 * @prop {boolean} disabled - Deshabilita la interacción
 *
 * @fires {CustomEvent} sp-open  - Al expandirse
 * @fires {CustomEvent} sp-close - Al colapsarse
 *
 * @slot trigger - Contenido del botón de toggle (si no se usa, el contenido por defecto es un chevron)
 * @slot         - Contenido expandible
 */
@customElement("sp-collapsible")
export class SpCollapsibleComponent extends LitElement {
  static override styles = unsafeCSS(styles);

  @property({ type: Boolean, reflect: true }) open = false;
  @property({ type: Boolean }) disabled = false;

  #toggle() {
    if (this.disabled) return;
    this.open = !this.open;
    this.dispatchEvent(new CustomEvent(this.open ? "sp-open" : "sp-close", {
      bubbles: true, composed: true,
    }));
  }

  override render() {
    return html`
      <button
        class="sp-col-trigger"
        aria-expanded=${this.open}
        ?disabled=${this.disabled}
        @click=${() => this.#toggle()}
      >
        <slot name="trigger"></slot>
        <span class="sp-col-icon" aria-hidden="true">
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M4 6l4 4 4-4"/>
          </svg>
        </span>
      </button>

      <div class="sp-col-content" role="region" aria-hidden=${!this.open}>
        <slot></slot>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap { "sp-collapsible": SpCollapsibleComponent; }
}
