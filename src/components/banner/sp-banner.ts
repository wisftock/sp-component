import { LitElement, html, unsafeCSS, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import styles from "./sp-banner.css?inline";

export type SpBannerVariant = "info" | "success" | "warning" | "error";

const ICONS: Record<SpBannerVariant, string> = {
  info:    `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`,
  success: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>`,
  warning: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
  error:   `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>`,
};

/**
 * Banner — barra de anuncio global (cookie notice, mantenimiento, promos, alertas).
 *
 * @element sp-banner
 *
 * @prop {SpBannerVariant} variant    - info | success | warning | error (default info)
 * @prop {string}          title      - Texto en negrita
 * @prop {string}          message    - Descripción
 * @prop {boolean}         dismissable - Muestra botón de cierre (default true)
 * @prop {boolean}         sticky     - Posición sticky al top de la pantalla
 * @prop {boolean}         icon       - Muestra icono del tipo (default true)
 *
 * @fires {CustomEvent} sp-dismiss - Al cerrar
 *
 * @slot actions - Botones de acción (link "Más info", botón CTA, etc.)
 */
@customElement("sp-banner")
export class SpBannerComponent extends LitElement {
  static override styles = unsafeCSS(styles);

  @property({ type: String, reflect: true }) variant: SpBannerVariant = "info";
  @property({ type: String }) title = "";
  @property({ type: String }) message = "";
  @property({ type: Boolean }) dismissable = true;
  @property({ type: Boolean, reflect: true }) sticky = false;
  @property({ type: Boolean }) icon = true;

  #dismiss() {
    this.dispatchEvent(new CustomEvent("sp-dismiss", { bubbles: true, composed: true }));
    this.setAttribute("hidden", "");
  }

  override render() {
    return html`
      <div class=${classMap({ "sp-banner": true, [`sp-banner--${this.variant}`]: true })} role="status" aria-live="polite">
        ${this.icon ? html`<span class="sp-banner-icon" .innerHTML=${ICONS[this.variant]}></span>` : nothing}

        <div class="sp-banner-content">
          ${this.title ? html`<div class="sp-banner-title">${this.title}</div>` : nothing}
          ${this.message ? html`<div class="sp-banner-desc">${this.message}</div>` : nothing}
          <slot></slot>
        </div>

        <div class="sp-banner-actions"><slot name="actions"></slot></div>

        ${this.dismissable ? html`
          <button class="sp-banner-close" aria-label="Cerrar" @click=${() => this.#dismiss()}>
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
              <path d="M3 3l10 10M13 3L3 13"/>
            </svg>
          </button>
        ` : nothing}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap { "sp-banner": SpBannerComponent; }
}
