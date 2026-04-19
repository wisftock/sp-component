import { LitElement, html, unsafeCSS, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import styles from "./sp-drawer.css?inline";
import { SpConfig } from "../../config.js";

export type SpDrawerPlacement = "left" | "right" | "top" | "bottom";
export type SpDrawerSize = "sm" | "md" | "lg" | "xl" | "full";

/**
 * Drawer — panel lateral deslizable anclado a un borde de la pantalla.
 *
 * @element sp-drawer
 *
 * @prop {boolean}           open             - Controla visibilidad
 * @prop {string}            label            - Título del drawer
 * @prop {string}            subtitle         - Subtítulo bajo el label
 * @prop {SpDrawerPlacement} placement        - Lado de apertura: left | right | top | bottom (default right)
 * @prop {SpDrawerSize}      size             - Tamaño preset: sm | md | lg | xl | full
 * @prop {boolean}           closable         - Muestra botón de cierre (default true)
 * @prop {boolean}           close-on-overlay - Cierra al hacer click en el overlay (default true)
 * @prop {boolean}           loading          - Muestra overlay de carga sobre el body
 * @prop {boolean}           no-overlay       - Sin backdrop ni bloqueo de scroll (modo panel)
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
  @property({ type: String }) subtitle = "";
  @property({ type: String, reflect: true }) placement: SpDrawerPlacement = "right";
  @property({ type: String, reflect: true }) size: SpDrawerSize = "md";
  @property({ type: Boolean, reflect: true }) closable = true;
  @property({ type: Boolean, attribute: "close-on-overlay" }) closeOnOverlay = true;
  @property({ type: Boolean, reflect: true }) loading = false;
  @property({ type: Boolean, reflect: true, attribute: "no-overlay" }) noOverlay = false;

  #previousFocus: Element | null = null;
  #closingTimer: ReturnType<typeof setTimeout> | null = null;
  #afterHideTimer: ReturnType<typeof setTimeout> | null = null;
  #touchStartX = 0;
  #touchStartY = 0;
  #touchActive = false;

  readonly #handleKeydown = (e: KeyboardEvent) => {
    if (!this.open) return;
    if (e.key === "Escape") { e.preventDefault(); this.#close(); return; }
    if (e.key === "Tab") this.#trapFocus(e);
  };

  #getFocusable(): HTMLElement[] {
    const sel = [
      "a[href]",
      "button:not([disabled])",
      "input:not([disabled])",
      "select:not([disabled])",
      "textarea:not([disabled])",
      '[tabindex]:not([tabindex="-1"])',
    ].join(",");
    return [
      ...Array.from(this.shadowRoot?.querySelectorAll<HTMLElement>(sel) ?? []),
      ...Array.from(this.querySelectorAll<HTMLElement>(sel)),
    ];
  }

  #trapFocus(e: KeyboardEvent) {
    const focusable = this.#getFocusable();
    if (!focusable.length) return;
    const first = focusable[0]!;
    const last = focusable[focusable.length - 1]!;
    const shadowActive = this.shadowRoot?.activeElement as HTMLElement | null;
    const docActive = document.activeElement as HTMLElement | null;
    if (e.shiftKey) {
      if (shadowActive === first || docActive === first) {
        e.preventDefault();
        last.focus();
      }
    } else {
      if (shadowActive === last || docActive === last) {
        e.preventDefault();
        first.focus();
      }
    }
  }

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
      if (!this.noOverlay) document.body.style.overflow = "hidden";
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

  #onTouchStart(e: TouchEvent) {
    this.#touchStartX = e.touches[0]!.clientX;
    this.#touchStartY = e.touches[0]!.clientY;
    this.#touchActive = true;
    const panel = this.shadowRoot?.querySelector<HTMLElement>(".sp-drawer");
    if (panel) panel.style.transition = "none";
  }

  #onTouchMove(e: TouchEvent) {
    if (!this.#touchActive) return;
    const dx = e.touches[0]!.clientX - this.#touchStartX;
    const dy = e.touches[0]!.clientY - this.#touchStartY;
    const panel = this.shadowRoot?.querySelector<HTMLElement>(".sp-drawer");
    if (!panel) return;
    let transform = "";
    if (this.placement === "bottom" && dy > 0) transform = `translateY(${dy}px)`;
    else if (this.placement === "right" && dx > 0) transform = `translateX(${dx}px)`;
    else if (this.placement === "left" && dx < 0) transform = `translateX(${dx}px)`;
    else if (this.placement === "top" && dy < 0) transform = `translateY(${dy}px)`;
    if (transform) { e.preventDefault(); panel.style.transform = transform; }
  }

  #onTouchEnd(e: TouchEvent) {
    if (!this.#touchActive) return;
    this.#touchActive = false;
    const panel = this.shadowRoot?.querySelector<HTMLElement>(".sp-drawer");
    if (panel) { panel.style.transition = ""; panel.style.transform = ""; }
    const dx = e.changedTouches[0]!.clientX - this.#touchStartX;
    const dy = e.changedTouches[0]!.clientY - this.#touchStartY;
    const threshold = 80;
    const shouldClose =
      (this.placement === "bottom" && dy > threshold) ||
      (this.placement === "right" && dx > threshold) ||
      (this.placement === "left" && dx < -threshold) ||
      (this.placement === "top" && dy < -threshold);
    if (shouldClose) this.#close();
  }

  override render() {
    if (!this.open && !this.hasAttribute("closing")) return nothing;

    return html`
      ${!this.noOverlay ? html`
        <div
          class="sp-drawer-overlay"
          @click=${() => { if (this.closeOnOverlay) this.#close(); }}
        ></div>
      ` : nothing}

      <div
        class="sp-drawer"
        role="dialog"
        aria-modal="true"
        aria-label=${this.label || "sp-drawer"}
        @touchstart=${this.#onTouchStart}
        @touchmove=${this.#onTouchMove}
        @touchend=${this.#onTouchEnd}
      >
        <div class="sp-drawer-header">
          <slot name="header">
            ${this.label || this.subtitle ? html`
              <div class="sp-drawer-title-group">
                ${this.label ? html`<p class="sp-drawer-title">${this.label}</p>` : nothing}
                ${this.subtitle ? html`<p class="sp-drawer-subtitle">${this.subtitle}</p>` : nothing}
              </div>
            ` : nothing}
          </slot>
          ${this.closable ? html`
            <button class="sp-drawer-close" aria-label=${SpConfig.locale.drawer.closeLabel} @click=${() => this.#close()}>
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                <path d="M3 3l10 10M13 3L3 13"/>
              </svg>
            </button>
          ` : nothing}
        </div>

        <div class="sp-drawer-body">
          ${this.loading ? html`
            <div class="sp-drawer-loading" aria-live="polite" aria-label=${SpConfig.locale.drawer.loadingLabel}>
              <svg class="sp-drawer-spinner" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2.5" stroke-opacity=".2"/>
                <path d="M22 12a10 10 0 0 0-10-10" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
              </svg>
            </div>
          ` : nothing}
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
