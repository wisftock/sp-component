import { LitElement, unsafeCSS } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import styles from "./sp-calendar.css?inline";
import { calendarTemplate } from "./sp-calendar.template.js";
import type { SpCalendarView } from "./sp-calendar.types.js";

/**
 * Calendar component for selecting a date.
 *
 * @element sp-calendar
 *
 * @prop {string}  value          - Selected date in ISO format (YYYY-MM-DD)
 * @prop {string}  min            - Minimum selectable date (YYYY-MM-DD)
 * @prop {string}  max            - Maximum selectable date (YYYY-MM-DD)
 * @prop {string}  locale         - BCP 47 locale for day/month names (default: browser locale)
 * @prop {number}  firstDayOfWeek - First day of week: 0=Sunday, 1=Monday (default: 1)
 * @prop {boolean} disabled       - Disables all interaction
 * @prop {boolean} readonly       - Prevents date selection but allows navigation
 *
 * @fires {CustomEvent<{ value: string }>} sp-change - Emitted when a date is selected
 *
 * @csspart calendar   - The root calendar element
 * @csspart header     - Month/year navigation header
 * @csspart day        - Individual day cell
 */
@customElement("sp-calendar")
export class SpCalendarComponent extends LitElement {
  static override styles = unsafeCSS(styles);

  @property({ type: String, reflect: true })
  value = "";

  @property({ type: String })
  min = "";

  @property({ type: String })
  max = "";

  @property({ type: String })
  locale = "";

  @property({ type: Number, attribute: "first-day-of-week" })
  firstDayOfWeek = 1;

  @property({ type: Boolean, reflect: true })
  disabled = false;

  @property({ type: Boolean, reflect: true })
  readonly = false;

  /** Currently displayed month/year (does not affect value) */
  @state()
  _viewDate: Date = new Date();

  /** Active view: days | months | years */
  @state()
  _view: SpCalendarView = "days";

  /** Focused day index for keyboard navigation */
  @state()
  _focusedDate: Date | null = null;

  override render() {
    return calendarTemplate.call(this);
  }

  override connectedCallback(): void {
    super.connectedCallback();
    this.addEventListener("keydown", this._handleKeydown);
    // Initialize viewDate from value if set
    if (this.value) {
      const d = this._parseDate(this.value);
      if (d) this._viewDate = d;
    }
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.removeEventListener("keydown", this._handleKeydown);
  }

  // ---- Public helpers used by template ----

  _getLocale(): string {
    return this.locale || navigator.language || "en";
  }

  _parseDate(iso: string): Date | null {
    if (!iso) return null;
    const [y, m, d] = iso.split("-").map(Number);
    if (!y || !m || !d) return null;
    const date = new Date(y, m - 1, d);
    return isNaN(date.getTime()) ? null : date;
  }

  _toISO(date: Date): string {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  }

  _isSameDay(a: Date, b: Date): boolean {
    return (
      a.getFullYear() === b.getFullYear() &&
      a.getMonth() === b.getMonth() &&
      a.getDate() === b.getDate()
    );
  }

  _isOutOfRange(date: Date): boolean {
    const iso = this._toISO(date);
    if (this.min && iso < this.min) return true;
    if (this.max && iso > this.max) return true;
    return false;
  }

  /** Returns ordered weekday headers based on firstDayOfWeek */
  _getWeekdayHeaders(): string[] {
    const fmt = new Intl.DateTimeFormat(this._getLocale(), { weekday: "short" });
    return Array.from({ length: 7 }, (_, i) => {
      const day = new Date(2017, 0, 1 + ((i + this.firstDayOfWeek) % 7)); // Jan 1 2017 = Sunday
      return fmt.format(day);
    });
  }

  /** Returns the days to render in the grid (including padding from prev/next month) */
  _getDaysInGrid(): Array<{ date: Date; isCurrentMonth: boolean }> {
    const year = this._viewDate.getFullYear();
    const month = this._viewDate.getMonth();
    const firstOfMonth = new Date(year, month, 1);
    const lastOfMonth = new Date(year, month + 1, 0);

    // Offset so grid starts on firstDayOfWeek
    let startOffset = firstOfMonth.getDay() - this.firstDayOfWeek;
    if (startOffset < 0) startOffset += 7;

    const days: Array<{ date: Date; isCurrentMonth: boolean }> = [];

    // Padding days from previous month
    for (let i = startOffset - 1; i >= 0; i--) {
      days.push({ date: new Date(year, month, -i), isCurrentMonth: false });
    }
    // Days of current month
    for (let d = 1; d <= lastOfMonth.getDate(); d++) {
      days.push({ date: new Date(year, month, d), isCurrentMonth: true });
    }
    // Padding days from next month to complete the grid (always 6 rows = 42 cells)
    const remaining = 42 - days.length;
    for (let d = 1; d <= remaining; d++) {
      days.push({ date: new Date(year, month + 1, d), isCurrentMonth: false });
    }

    return days;
  }

  _getMonthName(monthIndex: number): string {
    const fmt = new Intl.DateTimeFormat(this._getLocale(), { month: "long" });
    return fmt.format(new Date(2000, monthIndex, 1));
  }

  _getYearRange(): number[] {
    const current = this._viewDate.getFullYear();
    const start = Math.floor(current / 12) * 12;
    return Array.from({ length: 12 }, (_, i) => start + i);
  }

  // ---- Navigation ----

  _prevMonth(): void {
    this._viewDate = new Date(
      this._viewDate.getFullYear(),
      this._viewDate.getMonth() - 1,
      1,
    );
  }

  _nextMonth(): void {
    this._viewDate = new Date(
      this._viewDate.getFullYear(),
      this._viewDate.getMonth() + 1,
      1,
    );
  }

  _prevYear(): void {
    this._viewDate = new Date(this._viewDate.getFullYear() - 1, this._viewDate.getMonth(), 1);
  }

  _nextYear(): void {
    this._viewDate = new Date(this._viewDate.getFullYear() + 1, this._viewDate.getMonth(), 1);
  }

  _prevYearRange(): void {
    this._viewDate = new Date(this._viewDate.getFullYear() - 12, this._viewDate.getMonth(), 1);
  }

  _nextYearRange(): void {
    this._viewDate = new Date(this._viewDate.getFullYear() + 12, this._viewDate.getMonth(), 1);
  }

  _selectMonth(monthIndex: number): void {
    this._viewDate = new Date(this._viewDate.getFullYear(), monthIndex, 1);
    this._view = "days";
  }

  _selectYear(year: number): void {
    this._viewDate = new Date(year, this._viewDate.getMonth(), 1);
    this._view = "months";
  }

  _selectDate(date: Date): void {
    if (this.disabled || this.readonly || this._isOutOfRange(date)) return;
    this.value = this._toISO(date);
    this._focusedDate = date;
    this.dispatchEvent(
      new CustomEvent("sp-change", {
        detail: { value: this.value },
        bubbles: true,
        composed: true,
      }),
    );
  }

  // ---- Keyboard navigation ----

  private readonly _handleKeydown = (e: KeyboardEvent): void => {
    if (this.disabled) return;
    if (this._view !== "days") return;

    const focused = this._focusedDate ?? this._parseDate(this.value) ?? new Date(this._viewDate);

    const move = (days: number) => {
      const next = new Date(focused);
      next.setDate(next.getDate() + days);
      this._focusedDate = next;
      // Update viewDate if we navigated out of the current month
      if (
        next.getMonth() !== this._viewDate.getMonth() ||
        next.getFullYear() !== this._viewDate.getFullYear()
      ) {
        this._viewDate = new Date(next.getFullYear(), next.getMonth(), 1);
      }
    };

    switch (e.key) {
      case "ArrowLeft":
        e.preventDefault();
        move(-1);
        break;
      case "ArrowRight":
        e.preventDefault();
        move(1);
        break;
      case "ArrowUp":
        e.preventDefault();
        move(-7);
        break;
      case "ArrowDown":
        e.preventDefault();
        move(7);
        break;
      case "Home":
        e.preventDefault();
        move(-(focused.getDay() - this.firstDayOfWeek + 7) % 7);
        break;
      case "End":
        e.preventDefault();
        move((6 - focused.getDay() + this.firstDayOfWeek) % 7);
        break;
      case "PageUp":
        e.preventDefault();
        this._prevMonth();
        break;
      case "PageDown":
        e.preventDefault();
        this._nextMonth();
        break;
      case "Enter":
      case " ":
        e.preventDefault();
        if (this._focusedDate) this._selectDate(this._focusedDate);
        break;
    }
  };
}

declare global {
  interface HTMLElementTagNameMap {
    "sp-calendar": SpCalendarComponent;
  }
}
