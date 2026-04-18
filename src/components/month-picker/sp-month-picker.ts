import { LitElement, html, unsafeCSS, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import styles from "./sp-month-picker.css?inline";

const MONTHS = ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"];
const MONTHS_FULL = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];

/**
 * Month Picker — selector de mes y año.
 *
 * @element sp-month-picker
 *
 * @prop {string}  value       - Valor "YYYY-MM"
 * @prop {string}  placeholder - Texto sin selección
 * @prop {string}  min         - Mínimo "YYYY-MM"
 * @prop {string}  max         - Máximo "YYYY-MM"
 * @prop {boolean} disabled    - Deshabilita
 *
 * @fires {CustomEvent<{value:string,year:number,month:number}>} sp-change
 */
@customElement("sp-month-picker")
export class SpMonthPickerComponent extends LitElement {
  static override styles = unsafeCSS(styles);

  @property({ type: String }) value = "";
  @property({ type: String }) placeholder = "Seleccionar mes";
  @property({ type: String }) min = "";
  @property({ type: String }) max = "";
  @property({ type: Boolean }) disabled = false;
  @property({ type: Boolean, reflect: true }) open = false;

  @state() private _year = new Date().getFullYear();

  readonly #onOutside = (e: MouseEvent) => {
    if (!this.shadowRoot?.contains(e.target as Node)) this.open = false;
  };

  override connectedCallback() {
    super.connectedCallback();
    document.addEventListener("click", this.#onOutside);
  }
  override disconnectedCallback() {
    super.disconnectedCallback();
    document.removeEventListener("click", this.#onOutside);
  }

  #toggle() {
    if (this.disabled) return;
    this.open = !this.open;
    if (this.open && this.value) {
      this._year = parseInt(this.value.split("-")[0]!) || new Date().getFullYear();
    }
  }

  #select(month: number) {
    const val = `${this._year}-${String(month + 1).padStart(2, "0")}`;
    this.value = val;
    this.open = false;
    this.dispatchEvent(new CustomEvent("sp-change", {
      detail: { value: val, year: this._year, month },
      bubbles: true, composed: true,
    }));
  }

  #isDisabled(month: number): boolean {
    const val = `${this._year}-${String(month + 1).padStart(2, "0")}`;
    return (!!this.min && val < this.min) || (!!this.max && val > this.max);
  }

  #formatDisplay(): string {
    if (!this.value) return "";
    const [y, m] = this.value.split("-");
    const mIdx = parseInt(m!) - 1;
    return `${MONTHS_FULL[mIdx] ?? ""} ${y}`;
  }

  override render() {
    const now = new Date();
    const selYear = this.value ? parseInt(this.value.split("-")[0]!) : -1;
    const selMonth = this.value ? parseInt(this.value.split("-")[1]!) - 1 : -1;

    return html`
      <div style="position:relative;display:inline-block">
        <div class="sp-mp-trigger" @click=${() => this.#toggle()} tabindex="0" role="combobox"
          aria-expanded=${this.open}
          @keydown=${(e: KeyboardEvent) => { if (e.key==="Enter"||e.key===" ") { e.preventDefault(); this.#toggle(); }}}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0;color:var(--sp-text-muted,#9ca3af)"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
          ${this.value
            ? html`<span class="sp-mp-value">${this.#formatDisplay()}</span>`
            : html`<span class="sp-mp-placeholder">${this.placeholder}</span>`
          }
          <span class="sp-mp-arrow">
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 6l4 4 4-4"/></svg>
          </span>
        </div>

        ${this.open ? html`
          <div class="sp-mp-panel">
            <div class="sp-mp-header">
              <button class="sp-mp-nav" @click=${() => { this._year--; }}>
                <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 3L5 8l5 5"/></svg>
              </button>
              <span class="sp-mp-year">${this._year}</span>
              <button class="sp-mp-nav" @click=${() => { this._year++; }}>
                <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3l5 5-5 5"/></svg>
              </button>
            </div>
            <div class="sp-mp-grid">
              ${MONTHS.map((name, i) => html`
                <button
                  class=${classMap({
                    "sp-mp-month": true,
                    "sp-mp-month--current": this._year === now.getFullYear() && i === now.getMonth(),
                    "sp-mp-month--selected": this._year === selYear && i === selMonth,
                  })}
                  ?disabled=${this.#isDisabled(i)}
                  @click=${() => this.#select(i)}
                >${name}</button>
              `)}
            </div>
          </div>
        ` : nothing}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap { "sp-month-picker": SpMonthPickerComponent; }
}
