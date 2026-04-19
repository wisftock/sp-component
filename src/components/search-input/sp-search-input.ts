import { LitElement, html, unsafeCSS, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import styles from "./sp-search-input.css?inline";
import { SpConfig } from "../../config.js";

/**
 * Search Input — campo de búsqueda con icono, clear, loading y debounce.
 *
 * @element sp-search-input
 *
 * @prop {string}  value       - Valor actual
 * @prop {string}  placeholder - Texto de ayuda (default "Buscar...")
 * @prop {number}  debounce    - Delay en ms antes de emitir sp-search (default 300)
 * @prop {boolean} loading     - Muestra spinner en lugar del icono de buscar
 * @prop {boolean} clearable   - Muestra botón clear cuando hay texto (default true)
 * @prop {boolean} disabled    - Deshabilita
 * @prop {string}  size        - sm | md | lg
 *
 * @fires {CustomEvent<{value:string}>} sp-search - Emite tras el debounce al escribir
 * @fires {CustomEvent<{value:string}>} sp-input  - En cada tecla (sin debounce)
 * @fires {CustomEvent}                sp-clear   - Al limpiar
 */
@customElement("sp-search-input")
export class SpSearchInputComponent extends LitElement {
  static override styles = unsafeCSS(styles);

  @property({ type: String }) value = "";
  @property({ type: String }) placeholder = "";
  @property({ type: Number }) debounce = 300;
  @property({ type: Boolean }) loading = false;
  @property({ type: Boolean }) clearable = true;
  @property({ type: Boolean }) disabled = false;
  @property({ type: String, reflect: true }) size: "sm" | "md" | "lg" = "md";

  @state() private _debounceTimer?: ReturnType<typeof setTimeout>;

  #onInput(e: Event) {
    this.value = (e.target as HTMLInputElement).value;
    this.dispatchEvent(new CustomEvent("sp-input", { detail: { value: this.value }, bubbles: true, composed: true }));

    clearTimeout(this._debounceTimer);
    this._debounceTimer = setTimeout(() => {
      this.dispatchEvent(new CustomEvent("sp-search", { detail: { value: this.value }, bubbles: true, composed: true }));
    }, this.debounce);
  }

  #onKeydown(e: KeyboardEvent) {
    if (e.key === "Enter") {
      clearTimeout(this._debounceTimer);
      this.dispatchEvent(new CustomEvent("sp-search", { detail: { value: this.value }, bubbles: true, composed: true }));
    }
    if (e.key === "Escape") this.#clear();
  }

  #clear() {
    this.value = "";
    clearTimeout(this._debounceTimer);
    this.dispatchEvent(new CustomEvent("sp-clear", { bubbles: true, composed: true }));
    this.dispatchEvent(new CustomEvent("sp-search", { detail: { value: "" }, bubbles: true, composed: true }));
    this.shadowRoot?.querySelector<HTMLInputElement>(".sp-si-input")?.focus();
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    clearTimeout(this._debounceTimer);
  }

  override render() {
    const hasValue = this.value.length > 0;

    return html`
      <div class="sp-si-wrapper">
        <span class="sp-si-icon">
          ${this.loading
            ? html`<span class="sp-si-spinner"></span>`
            : html`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>`
          }
        </span>

        <input
          class=${classMap({ "sp-si-input": true, "sp-si-input--no-right-pad": !hasValue && !this.loading })}
          type="search"
          .value=${this.value}
          placeholder=${this.placeholder || SpConfig.locale.searchInput.placeholder}
          ?disabled=${this.disabled}
          autocomplete="off"
          @input=${(e: Event) => this.#onInput(e)}
          @keydown=${(e: KeyboardEvent) => this.#onKeydown(e)}
        />

        ${hasValue ? html`
          <div class="sp-si-right">
            ${this.clearable ? html`
              <button class="sp-si-clear" type="button" aria-label=${SpConfig.locale.searchInput.clearLabel} @click=${() => this.#clear()}>
                <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M3 3l10 10M13 3L3 13"/></svg>
              </button>
            ` : nothing}
          </div>
        ` : nothing}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap { "sp-search-input": SpSearchInputComponent; }
}
