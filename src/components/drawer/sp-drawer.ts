import { LitElement, html, unsafeCSS, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import styles from "./sp-drawer.css?inline";

export type SpDrawerPlacement = "left" | "right" | "top" | "bottom";
export type SpDrawerSize = "sm" | "md" | "lg" | "xl" | "full";

/**
 * Drawer — panel lateral deslizable anclado a un borde de la pantalla.
 *
 * @element sp-drawer
 *
 * @prop {boolean}           open             - Controla visibilidad
 * @prop {string}            label            - Título del drawer
 * @prop {SpDrawerPlacement} placement        - Lado de apertura: left | right | top | bottom (default right)
 * @prop {SpDrawerSize}      size             - Tamaño preset: sm | md | lg | xl | full
 * @prop {boolean}           closable         - Muestra botón de cierre (default true)
 * @prop {boolean}           close-on-overlay - Cierra al hacer click en el overlay (default true)
 *
 * @fires {CustomEvent} sp-show       - Al abrirse
 * @fires {CustomEvent} sp-hide       - Al cerrarse
 * @fires {CustomEvent} sp-after-hide - 300ms después de cerrar
 *
 * @slot         - Contenido principal
 * @slot header  - Cabecera personalizada (reemplaza el título por defecto)
 * @slot footer  - Pie del drawer (botones de acción)
 */
@customElement("sp-drawer")
export class SpDrawerComponent extends LitElement {
  static override styles = unsafeCSS(styles);

  @property({ type: Boolean, reflect: true }) open = false;
  @property({ type: String }) label = "";
  @property({ type: String, reflect: true }) placement: SpDrawerPlacement = "right";
  @property({ type: String, reflect: true }) size: SpDrawerSize = "md";
  @property({ type: Boolean, reflect: true }) closable = true;
  @property({ type: Boolean, attribute: "close-on-overlay" }) closeOnOverlay = true;

  #previousFocus: Element | null = null;
  #closingTimer: ReturnType<typeof setTimeout> | null = null;
  #afterHideTimer: ReturnType<typeof setTimeout> | null = null;

  readonly #handleKeydown = (e: KeyboardEvent) => {
    if (!this.open) return;
    if (e.key === "Escape") { e.preventDefault(); this.#close(); }
  };

  override connectedCallback() {
    super.connectedCallback();
    document.addEventListener("keydown", this.#handleKeydown);
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    document.removeEventListener("keydown", this.#handleKeydown);
    document.body.style.overflow = "";
    if (this.#closingTimer !== null) clearTimeout(this.#closingTimer);
    if (this.#afterHideTimer !== null) clearTimeout(this.#afterHideTimer);
  }

  #close() {
    this.open = false;
  }

  override updated(changed: Map<string, unknown>) {
    if (!changed.has("open")) return;
    if (this.open) {
      if (this.#closingTimer !== null) {
        clearTimeout(this.#closingTimer);
        this.#closingTimer = null;
        this.removeAttribute("closing");
      }
      document.body.style.overflow = "hidden";
      this.#previousFocus = document.activeElement;
      this.dispatchEvent(new CustomEvent("sp-show", { bubbles: true, composed: true }));
    } else {
      if (changed.get("open") === undefined) return;
      this.setAttribute("closing", "");
      const prev = this.#previousFocus;
      this.#previousFocus = null;

      const doClose = () => {
        this.removeAttribute("closing");
        document.body.style.overflow = "";
        this.dispatchEvent(new CustomEvent("sp-hide", { bubbles: true, composed: true }));
        (prev as HTMLElement)?.focus?.();
        this.#afterHideTimer = setTimeout(() => {
          this.#afterHideTimer = null;
          this.dispatchEvent(new CustomEvent("sp-after-hide", { bubbles: true, composed: true }));
        }, 50);
      };

      this.#closingTimer = setTimeout(() => {
        this.#closingTimer = null;
        doClose();
      }, 260);
    }
  }

  override render() {
    if (!this.open && !this.hasAttribute("closing")) return nothing;

    return html`
      <div
        class="sp-drawer-overlay"
        @click=${() => { if (this.closeOnOverlay) this.#close(); }}
      ></div>

      <div class="sp-drawer" role="dialog" aria-modal="true" aria-label=${this.label || "Drawer"}>
        <div class="sp-drawer-header">
          <slot name="header">
            ${this.label ? html`<p class="sp-drawer-title">${this.label}</p>` : nothing}
          </slot>
          ${this.closable ? html`
            <button class="sp-drawer-close" aria-label="Cerrar" @click=${() => this.#close()}>
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                <path d="M3 3l10 10M13 3L3 13"/>
              </svg>
            </button>
          ` : nothing}
        </div>

        <div class="sp-drawer-body">
          <slot></slot>
        </div>

        <div class="sp-drawer-footer">
          <slot name="footer"></slot>
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap { "sp-drawer": SpDrawerComponent; }
}
