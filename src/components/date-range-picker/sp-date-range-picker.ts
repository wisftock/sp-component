import { LitElement, html, unsafeCSS, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import styles from "./sp-date-range-picker.css?inline";

const DAYS = ["Do", "Lu", "Ma", "Mi", "Ju", "Vi", "Sá"];
const MONTHS = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];

function isoDate(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
}
function sameDay(a: Date, b: Date) {
  return a.getFullYear()===b.getFullYear() && a.getMonth()===b.getMonth() && a.getDate()===b.getDate();
}

/**
 * Date Range Picker — selecciona un rango de fechas (inicio y fin).
 *
 * @element sp-date-range-picker
 *
 * @prop {string}  start       - Fecha inicio ISO (YYYY-MM-DD)
 * @prop {string}  end         - Fecha fin ISO (YYYY-MM-DD)
 * @prop {string}  placeholder - Texto cuando no hay selección
 * @prop {string}  min         - Fecha mínima ISO
 * @prop {string}  max         - Fecha máxima ISO
 * @prop {boolean} disabled    - Deshabilita el componente
 *
 * @fires {CustomEvent<{start:string,end:string}>} sp-change - Al confirmar selección
 * @fires {CustomEvent} sp-clear - Al limpiar
 */
@customElement("sp-date-range-picker")
export class SpDateRangePickerComponent extends LitElement {
  static override styles = unsafeCSS(styles);

  @property({ type: String }) start = "";
  @property({ type: String }) end = "";
  @property({ type: String }) placeholder = "Seleccionar rango";
  @property({ type: String }) min = "";
  @property({ type: String }) max = "";
  @property({ type: Boolean, reflect: true }) disabled = false;
  @property({ type: Boolean, reflect: true }) open = false;

  @state() private _leftYear = new Date().getFullYear();
  @state() private _leftMonth = new Date().getMonth();
  @state() private _hoverDate = "";
  @state() private _pendingStart = "";
  @state() private _pendingEnd = "";

  private get _rightYear()  { return this._leftMonth === 11 ? this._leftYear + 1 : this._leftYear; }
  private get _rightMonth() { return (this._leftMonth + 1) % 12; }

  readonly #onOutside = (e: MouseEvent) => {
    if (!this.contains(e.target as Node) && !this.shadowRoot?.contains(e.target as Node)) {
      this.open = false;
    }
  };

  override connectedCallback() {
    super.connectedCallback();
    document.addEventListener("click", this.#onOutside);
  }
  override disconnectedCallback() {
    super.disconnectedCallback();
    document.removeEventListener("click", this.#onOutside);
  }

  #togglePanel() {
    if (this.disabled) return;
    this.open = !this.open;
    if (this.open) {
      this._pendingStart = this.start;
      this._pendingEnd = this.end;
      if (this.start) {
        const d = new Date(this.start + "T00:00:00");
        this._leftYear = d.getFullYear();
        this._leftMonth = d.getMonth();
      }
    }
  }

  #selectDay(iso: string) {
    if (!this._pendingStart || (this._pendingStart && this._pendingEnd)) {
      this._pendingStart = iso;
      this._pendingEnd = "";
    } else {
      if (iso < this._pendingStart) {
        this._pendingEnd = this._pendingStart;
        this._pendingStart = iso;
      } else {
        this._pendingEnd = iso;
      }
    }
  }

  #confirm() {
    if (!this._pendingStart) return;
    this.start = this._pendingStart;
    this.end = this._pendingEnd;
    this.open = false;
    this.dispatchEvent(new CustomEvent("sp-change", {
      detail: { start: this.start, end: this.end },
      bubbles: true, composed: true,
    }));
  }

  #clear() {
    this.start = "";
    this.end = "";
    this._pendingStart = "";
    this._pendingEnd = "";
    this.open = false;
    this.dispatchEvent(new CustomEvent("sp-clear", { bubbles: true, composed: true }));
  }

  #navLeft(dir: -1|1) {
    let m = this._leftMonth + dir;
    let y = this._leftYear;
    if (m < 0) { m = 11; y--; }
    if (m > 11) { m = 0; y++; }
    this._leftMonth = m;
    this._leftYear = y;
  }

  #buildGrid(year: number, month: number) {
    const first = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrev  = new Date(year, month, 0).getDate();
    const cells: { date: Date; iso: string; otherMonth: boolean }[] = [];
    for (let i = first - 1; i >= 0; i--) {
      const d = new Date(year, month - 1, daysInPrev - i);
      cells.push({ date: d, iso: isoDate(d), otherMonth: true });
    }
    for (let i = 1; i <= daysInMonth; i++) {
      const d = new Date(year, month, i);
      cells.push({ date: d, iso: isoDate(d), otherMonth: false });
    }
    const remain = 42 - cells.length;
    for (let i = 1; i <= remain; i++) {
      const d = new Date(year, month + 1, i);
      cells.push({ date: d, iso: isoDate(d), otherMonth: true });
    }
    return cells;
  }

  #renderCalendar(year: number, month: number, showPrev: boolean, showNext: boolean) {
    const cells = this.#buildGrid(year, month);
    const today = isoDate(new Date());
    const ps = this._pendingStart;
    const pe = this._pendingEnd || this._hoverDate;
    const rangeStart = ps && pe ? (ps <= pe ? ps : pe) : ps;
    const rangeEnd   = ps && pe ? (ps <= pe ? pe : ps) : "";

    return html`
      <div class="sp-drp-calendar">
        <div class="sp-drp-cal-header">
          ${showPrev ? html`
            <button class="sp-drp-cal-nav" @click=${() => this.#navLeft(-1)} aria-label="Mes anterior">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 3L5 8l5 5"/></svg>
            </button>
          ` : html`<span style="width:28px"></span>`}
          <span class="sp-drp-cal-title">${MONTHS[month]} ${year}</span>
          ${showNext ? html`
            <button class="sp-drp-cal-nav" @click=${() => this.#navLeft(1)} aria-label="Mes siguiente">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3l5 5-5 5"/></svg>
            </button>
          ` : html`<span style="width:28px"></span>`}
        </div>

        <div class="sp-drp-cal-grid">
          ${DAYS.map(d => html`<div class="sp-drp-cal-dow">${d}</div>`)}
          ${cells.map(({ iso, date, otherMonth }) => {
            const isStart = iso === rangeStart;
            const isEnd   = iso === rangeEnd && rangeEnd !== rangeStart;
            const inRange = rangeStart && rangeEnd && iso > rangeStart && iso < rangeEnd;
            const isDisabled = (this.min && iso < this.min) || (this.max && iso > this.max);
            return html`
              <button
                class=${classMap({
                  "sp-drp-day": true,
                  "sp-drp-day--other-month": otherMonth,
                  "sp-drp-day--today": iso === today,
                  "sp-drp-day--range-start": isStart,
                  "sp-drp-day--range-end": isEnd,
                  "sp-drp-day--in-range": !!inRange,
                  "sp-drp-day--disabled": !!isDisabled,
                })}
                ?disabled=${isDisabled}
                @click=${() => this.#selectDay(iso)}
                @mouseenter=${() => { this._hoverDate = iso; }}
                @mouseleave=${() => { this._hoverDate = ""; }}
                aria-label=${date.toLocaleDateString("es")}
              >${date.getDate()}</button>
            `;
          })}
        </div>
      </div>
    `;
  }

  #formatDate(iso: string) {
    if (!iso) return "";
    const [y, m, d] = iso.split("-");
    return `${d}/${m}/${y}`;
  }

  override render() {
    const hasRange = this.start && this.end;
    const hasStart = this.start && !this.end;

    return html`
      <div style="position:relative;display:inline-block">
        <div class="sp-drp-trigger" @click=${() => this.#togglePanel()} role="button" tabindex="0"
          @keydown=${(e: KeyboardEvent) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); this.#togglePanel(); }}}
        >
          <span class="sp-drp-trigger-icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
          </span>
          <span class="sp-drp-trigger-text ${!hasRange && !hasStart ? "sp-drp-trigger-text--placeholder" : ""}">
            ${hasRange
              ? html`${this.#formatDate(this.start)} <span class="sp-drp-sep">→</span> ${this.#formatDate(this.end)}`
              : hasStart
                ? html`${this.#formatDate(this.start)} <span class="sp-drp-sep">→ ...</span>`
                : this.placeholder
            }
          </span>
        </div>

        ${this.open ? html`
          <div class="sp-drp-panel">
            ${this.#renderCalendar(this._leftYear, this._leftMonth, true, false)}
            <div class="sp-drp-divider"></div>
            ${this.#renderCalendar(this._rightYear, this._rightMonth, false, true)}
            <div style="position:absolute;bottom:0;left:0;right:0">
              <div class="sp-drp-footer" style="padding:10px 16px">
                <button class="sp-drp-btn" @click=${() => this.#clear()}>Limpiar</button>
                <button class="sp-drp-btn" @click=${() => { this.open = false; }}>Cancelar</button>
                <button class="sp-drp-btn sp-drp-btn--primary"
                  ?disabled=${!this._pendingStart}
                  @click=${() => this.#confirm()}
                >Aplicar</button>
              </div>
            </div>
          </div>
        ` : nothing}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap { "sp-date-range-picker": SpDateRangePickerComponent; }
}
