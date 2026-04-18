import { LitElement, html, unsafeCSS, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import styles from "./sp-back-top.css?inline";

export type SpBackTopPosition = "bottom-right" | "bottom-left" | "bottom-center";

/**
 * Back Top — botón flotante para volver al inicio de la página.
 * Aparece automáticamente cuando el usuario hace scroll.
 *
 * @element sp-back-top
 *
 * @prop {number}            visibility-height - Scroll mínimo en px para aparecer (default 400)
 * @prop {SpBackTopPosition} position          - bottom-right | bottom-left | bottom-center
 * @prop {string}            duration          - Duración del scroll animado en ms (default 300)
 *
 * @fires {CustomEvent} sp-click - Al hacer click
 * @slot - Icono personalizado (por defecto una flecha hacia arriba)
 */
@customElement("sp-back-top")
export class SpBackTopComponent extends LitElement {
  static override styles = unsafeCSS(styles);

  @property({ type: Number, attribute: "visibility-height" }) visibilityHeight = 400;
  @property({ type: String, reflect: true }) position: SpBackTopPosition = "bottom-right";
  @property({ type: Number }) duration = 300;

  @state() private _visible = false;

  readonly #onScroll = () => {
    this._visible = window.scrollY >= this.visibilityHeight;
  };

  override connectedCallback() {
    super.connectedCallback();
    window.addEventListener("scroll", this.#onScroll, { passive: true });
    this._visible = window.scrollY >= this.visibilityHeight;
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener("scroll", this.#onScroll);
  }

  #scrollToTop() {
    const start = window.scrollY;
    const startTime = performance.now();
    const dur = this.duration;

    const step = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / dur, 1);
      // ease-out cubic
      const ease = 1 - Math.pow(1 - progress, 3);
      window.scrollTo(0, start * (1 - ease));
      if (progress < 1) requestAnimationFrame(step);
    };

    requestAnimationFrame(step);
    this.dispatchEvent(new CustomEvent("sp-click", { bubbles: true, composed: true }));
  }

  override render() {
    if (!this._visible) return nothing;

    return html`
      <button
        class="sp-bt-btn"
        aria-label="Volver al inicio"
        @click=${() => this.#scrollToTop()}
      >
        <slot>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 19V5M5 12l7-7 7 7"/>
          </svg>
        </slot>
      </button>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap { "sp-back-top": SpBackTopComponent; }
}
