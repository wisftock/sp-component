import { LitElement, html, unsafeCSS, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import styles from "./sp-result.css?inline";

export type SpResultStatus = "success" | "error" | "warning" | "info" | "404" | "403" | "500";

const ICONS: Record<SpResultStatus, string> = {
  success: `<svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>`,
  error:   `<svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>`,
  warning: `<svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
  info:    `<svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`,
  "404":   `<svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>`,
  "403":   `<svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>`,
  "500":   `<svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`,
};

const HTTP_TITLES: Record<string, string> = {
  "404": "Página no encontrada",
  "403": "Sin permiso de acceso",
  "500": "Error del servidor",
};

/**
 * Result — página de resultado para estados de éxito, error y HTTP.
 *
 * @element sp-result
 *
 * @prop {SpResultStatus} status   - success | error | warning | info | 404 | 403 | 500
 * @prop {string}         title    - Título principal
 * @prop {string}         subtitle - Descripción
 *
 * @slot icon    - Icono personalizado
 * @slot actions - Botones de acción
 * @slot extra   - Contenido adicional debajo de las acciones
 */
@customElement("sp-result")
export class SpResultComponent extends LitElement {
  static override styles = unsafeCSS(styles);

  @property({ type: String }) status: SpResultStatus = "info";
  @property({ type: String }) title = "";
  @property({ type: String }) subtitle = "";

  override render() {
    const isHttp = ["404","403","500"].includes(this.status);
    const displayTitle = this.title || HTTP_TITLES[this.status] || "";

    return html`
      <div class="sp-result" role="status">
        <div class=${classMap({ "sp-result-icon": true, [`sp-result-icon--${this.status}`]: true })}>
          <slot name="icon">
            ${isHttp
              ? html`<span class="sp-result-status">${this.status}</span>`
              : html`<span .innerHTML=${ICONS[this.status] ?? ""}></span>`
            }
          </slot>
        </div>

        ${displayTitle ? html`<h3 class="sp-result-title">${displayTitle}</h3>` : nothing}
        ${this.subtitle ? html`<p class="sp-result-subtitle">${this.subtitle}</p>` : nothing}

        <div class="sp-result-actions"><slot name="actions"></slot></div>
        <div class="sp-result-extra"><slot name="extra"></slot></div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap { "sp-result": SpResultComponent; }
}
