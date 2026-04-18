import { LitElement, html, unsafeCSS, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import styles from "./sp-date-time-picker.css?inline";

const DAYS_SHORT = ["Do","Lu","Ma","Mi","Ju","Vi","Sá"];
const MONTHS = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];

function pad(n: number) { return String(n).padStart(2,"0"); }
function isoDate(d: Date) { return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`; }

/**
 * Date Time Picker — selector combinado de fecha y hora.
 *
 * @element sp-date-time-picker
 *
 * @prop {string}  value       - ISO datetime "YYYY-MM-DDTHH:mm" o "YYYY-MM-DD HH:mm"
 * @prop {string}  placeholder - Texto sin valor
 * @prop {string}  min         - Fecha mínima ISO
 * @prop {string}  max         - Fecha máxima ISO
 * @prop {boolean} disabled    - Deshabilita
 * @prop {boolean} seconds     - Incluye selector de segundos
 *
 * @fires {CustomEvent<{value:string,date:string,time:string}>} sp-change
 */
@customElement("sp-date-time-picker")
export class SpDateTimePickerComponent extends LitElement {
  static override styles = unsafeCSS(styles);

  @property({ type: String }) value = "";
  @property({ type: String }) placeholder = "Fecha y hora";
  @property({ type: String }) min = "";
  @property({ type: String }) max = "";
  @property({ type: Boolean }) disabled = false;
  @property({ type: Boolean, reflect: true }) open = false;
  @property({ type: Boolean }) seconds = false;

  @state() private _year = new Date().getFullYear();
  @state() private _month = new Date().getMonth();
  @state() private _selDate = "";
  @state() private _hours = 0;
  @state() private _minutes = 0;
  @state() private _secs = 0;

  readonly #onOutside = (e: MouseEvent) => {
    if (!this.shadowRoot?.contains(e.target as Node) && !this.contains(e.target as Node)) this.open = false;
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
      const [datePart, timePart] = this.value.split(/[ T]/);
      if (datePart) {
        const d = new Date(datePart + "T00:00:00");
        this._year = d.getFullYear();
        this._month = d.getMonth();
        this._selDate = datePart;
      }
      if (timePart) {
        const [h, m, s] = timePart.split(":").map(Number);
        this._hours = h ?? 0;
        this._minutes = m ?? 0;
        this._secs = s ?? 0;
      }
    }
  }

  #navMonth(d: -1|1) {
    let m = this._month + d;
    let y = this._year;
    if (m < 0) { m = 11; y--; }
    if (m > 11) { m = 0; y++; }
    this._month = m; this._year = y;
  }

  #buildGrid() {
    const first = new Date(this._year, this._month, 1).getDay();
    const daysInMonth = new Date(this._year, this._month + 1, 0).getDate();
    const daysInPrev  = new Date(this._year, this._month, 0).getDate();
    const cells: { date: Date; iso: string; other: boolean }[] = [];
    for (let i = first - 1; i >= 0; i--) {
      const d = new Date(this._year, this._month - 1, daysInPrev - i);
      cells.push({ date: d, iso: isoDate(d), other: true });
    }
    for (let i = 1; i <= daysInMonth; i++) {
      const d = new Date(this._year, this._month, i);
      cells.push({ date: d, iso: isoDate(d), other: false });
    }
    while (cells.length < 42) {
      const d = new Date(this._year, this._month + 1, cells.length - daysInMonth - first + 1);
      cells.push({ date: d, iso: isoDate(d), other: true });
    }
    return cells;
  }

  #adjustTime(field: "h"|"m"|"s", d: -1|1) {
    if (field === "h") this._hours = (this._hours + d + 24) % 24;
    if (field === "m") this._minutes = (this._minutes + d + 60) % 60;
    if (field === "s") this._secs = (this._secs + d + 60) % 60;
  }

  #confirm() {
    if (!this._selDate) return;
    const time = this.seconds
      ? `${pad(this._hours)}:${pad(this._minutes)}:${pad(this._secs)}`
      : `${pad(this._hours)}:${pad(this._minutes)}`;
    this.value = `${this._selDate}T${time}`;
    this.open = false;
    this.dispatchEvent(new CustomEvent("sp-change", {
      detail: { value: this.value, date: this._selDate, time },
      bubbles: true, composed: true,
    }));
  }

  #formatDisplay() {
    if (!this.value) return "";
    const [d, t] = this.value.split(/[ T]/);
    if (!d) return "";
    const [y, m, day] = d.split("-");
    const dateStr = `${day}/${m}/${y}`;
    return t ? `${dateStr} ${t.slice(0,5)}` : dateStr;
  }

  override render() {
    const today = isoDate(new Date());
    const cells = this.open ? this.#buildGrid() : [];
    const display = this.#formatDisplay();

    return html`
      <div style="position:relative;display:inline-block">
        <div class="sp-dtp-trigger" @click=${() => this.#toggle()} tabindex="0" role="button"
          @keydown=${(e: KeyboardEvent) => { if (e.key==="Enter"||e.key===" ") { e.preventDefault(); this.#toggle(); }}}
        >
          <span class="sp-dtp-icon">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
          </span>
          ${display
            ? html`<span class="sp-dtp-value">${display}</span>`
            : html`<span class="sp-dtp-placeholder">${this.placeholder}</span>`
          }
        </div>

        ${this.open ? html`
          <div class="sp-dtp-panel">
            <!-- Calendar -->
            <div>
              <div class="sp-dtp-cal-header">
                <button class="sp-dtp-cal-nav" @click=${() => this.#navMonth(-1)}>
                  <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 3L5 8l5 5"/></svg>
                </button>
                <span class="sp-dtp-cal-title">${MONTHS[this._month]} ${this._year}</span>
                <button class="sp-dtp-cal-nav" @click=${() => this.#navMonth(1)}>
                  <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3l5 5-5 5"/></svg>
                </button>
              </div>
              <div class="sp-dtp-grid">
                ${DAYS_SHORT.map(d => html`<div class="sp-dtp-dow">${d}</div>`)}
                ${cells.map(({ iso, date, other }) => html`
                  <button
                    class=${classMap({
                      "sp-dtp-day": true,
                      "sp-dtp-day--other": other,
                      "sp-dtp-day--today": iso === today,
                      "sp-dtp-day--selected": iso === this._selDate,
                    })}
                    ?disabled=${(this.min && iso < this.min) || (this.max && iso > this.max)}
                    @click=${() => { this._selDate = iso; }}
                  >${date.getDate()}</button>
                `)}
              </div>
            </div>

            <div class="sp-dtp-time-sep"></div>

            <!-- Time -->
            <div class="sp-dtp-time">
              ${(this.seconds ? ["h","m","s"] as const : ["h","m"] as const).map((field, i) => html`
                ${i > 0 ? html`<span class="sp-dtp-time-sep-colon">:</span>` : nothing}
                <div class="sp-dtp-time-col">
                  <button class="sp-dtp-time-btn" @click=${() => this.#adjustTime(field, 1)}>▲</button>
                  <span class="sp-dtp-time-val">
                    ${pad(field === "h" ? this._hours : field === "m" ? this._minutes : this._secs)}
                  </span>
                  <button class="sp-dtp-time-btn" @click=${() => this.#adjustTime(field, -1)}>▼</button>
                </div>
              `)}
            </div>

            <div class="sp-dtp-footer">
              <button class="sp-dtp-btn" @click=${() => { this.open = false; }}>Cancelar</button>
              <button class="sp-dtp-btn sp-dtp-btn--primary" ?disabled=${!this._selDate} @click=${() => this.#confirm()}>Aplicar</button>
            </div>
          </div>
        ` : nothing}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap { "sp-date-time-picker": SpDateTimePickerComponent; }
}
