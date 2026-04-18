import { LitElement, html, unsafeCSS, nothing } from "lit";
import { customElement, property, query } from "lit/decorators.js";
import styles from "./sp-infinite-scroll.css?inline";

/**
 * Infinite Scroll — emite `sp-load-more` cuando el centinela entra en el viewport.
 *
 * @element sp-infinite-scroll
 *
 * @prop {boolean} loading       - Muestra spinner de carga
 * @prop {boolean} has-more      - Si hay más datos por cargar
 * @prop {number}  threshold     - Margen en px antes del final para disparar (default 200)
 * @prop {string}  loading-text  - Texto junto al spinner (default "Cargando...")
 * @prop {string}  end-text      - Texto al no haber más datos (default "No hay más resultados")
 *
 * @fires {CustomEvent} sp-load-more - Se emite cuando el usuario llega al final
 *
 * @slot - Contenido de la lista
 */
@customElement("sp-infinite-scroll")
export class SpInfiniteScrollComponent extends LitElement {
  static override styles = unsafeCSS(styles);

  @property({ type: Boolean }) loading = false;
  @property({ type: Boolean, attribute: "has-more" }) hasMore = true;
  @property({ type: Number }) threshold = 200;
  @property({ type: String, attribute: "loading-text" }) loadingText = "Cargando...";
  @property({ type: String, attribute: "end-text" }) endText = "No hay más resultados";

  @query(".sp-is-sentinel") private _sentinel!: HTMLElement;

  #observer: IntersectionObserver | null = null;

  override firstUpdated() {
    this.#setupObserver();
  }

  override updated(changed: Map<string, unknown>) {
    if (changed.has("loading") || changed.has("hasMore")) {
      this.#setupObserver();
    }
  }

  #setupObserver() {
    this.#observer?.disconnect();
    if (!this._sentinel || !this.hasMore || this.loading) return;

    this.#observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry?.isIntersecting && this.hasMore && !this.loading) {
          this.dispatchEvent(new CustomEvent("sp-load-more", { bubbles: true, composed: true }));
        }
      },
      { rootMargin: `${this.threshold}px` }
    );
    this.#observer.observe(this._sentinel);
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    this.#observer?.disconnect();
  }

  override render() {
    return html`
      <div class="sp-is-content">
        <slot></slot>
      </div>

      <div class="sp-is-sentinel"></div>

      ${this.loading ? html`
        <div class="sp-is-loader" role="status" aria-live="polite">
          <span class="sp-is-spinner"></span>
          <span>${this.loadingText}</span>
        </div>
      ` : nothing}

      ${!this.hasMore && !this.loading ? html`
        <div class="sp-is-end">${this.endText}</div>
      ` : nothing}
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap { "sp-infinite-scroll": SpInfiniteScrollComponent; }
}
