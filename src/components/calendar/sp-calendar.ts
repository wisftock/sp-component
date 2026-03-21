import { LitElement, unsafeCSS } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import styles from "./sp-calendar.css?inline";
import { calendarTemplate } from "./sp-calendar.template.js";
import type { SpCalendarMode, SpCalendarSlideDir, SpCalendarView } from "./sp-calendar.types.js";

/**
 * Calendar component for selecting a date.
 *
 * @element sp-calendar
 *
 * @prop {string}  value               - Selected date in ISO format (YYYY-MM-DD)
 * @prop {string}  value-start         - Range start date (range mode)
 * @prop {string}  value-end           - Range end date (range mode)
 * @prop {string}  values              - Comma-separated selected dates (multiple mode)
 * @prop {string}  min                 - Minimum selectable date (YYYY-MM-DD)
 * @prop {string}  max                 - Maximum selectable date (YYYY-MM-DD)
 * @prop {string}  locale              - BCP 47 locale for day/month names (default: browser locale)
 * @prop {number}  firstDayOfWeek      - First day of week: 0=Sunday, 1=Monday (default: 1)
 * @prop {boolean} disabled            - Disables all interaction
 * @prop {boolean} readonly            - Prevents date selection but allows navigation
 * @prop {string}  mode                - Selection mode: "single" | "range" | "multiple"
 * @prop {string}  events              - Comma-separated ISO dates to mark with event dot
 * @prop {string}  disabled-dates      - Comma-separated ISO dates to disable individually
 * @prop {string}  disabled-days-of-week - Comma-separated day numbers (0=Sun...6=Sat) to disable
 * @prop {number}  months              - Number of months to display side by side (1-3)
 * @prop {boolean} show-presets        - Show preset quick-select buttons
 *
 * @fires {CustomEvent<{ value: string }>} sp-change - Emitted when a date is selected (single mode)
 * @fires {CustomEvent<{ value: string, valueStart: string, valueEnd: string }>} sp-change - Range mode
 * @fires {CustomEvent<{ values: string[] }>} sp-change - Multiple mode
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

  @property({ type: String, attribute: "value-start" })
  valueStart = "";

  @property({ type: String, attribute: "value-end" })
  valueEnd = "";

  @property({ type: String })
  values = "";

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

  @property({ type: String })
  mode: SpCalendarMode = "single";

  @property({ type: String })
  events = "";

  @property({ type: String, attribute: "disabled-dates" })
  disabledDates = "";

  @property({ type: String, attribute: "disabled-days-of-week" })
  disabledDaysOfWeek = "";

  @property({ type: Number })
  months = 1;

  @property({ type: Boolean, attribute: "show-presets" })
  showPresets = false;

  /** Currently displayed month/year (does not affect value) */
  @state()
  _viewDate: Date = new Date();

  /** Active view: days | months | years */
  @state()
  _view: SpCalendarView = "days";

  /** Focused day index for keyboard navigation */
  @state()
  _focusedDate: Date | null = null;

  /** Range mode: start of selected range */
  @state()
  _rangeStart: Date | null = null;

  /** Range mode: end of selected range */
  @state()
  _rangeEnd: Date | null = null;

  /** Hover preview date for range mode */
  @state()
  _hoverDate: Date | null = null;

  /** Multiple mode: set of selected dates as ISO strings */
  @state()
  _multipleValues: Set<string> = new Set();

  /** Slide animation direction */
  @state()
  _slideDir: SpCalendarSlideDir = "";

  private _navigating = false;

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
    } else if (this.valueStart) {
      const d = this._parseDate(this.valueStart);
      if (d) this._viewDate = d;
    }
    // Initialize internal state from props
    this._syncPropsToState();
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.removeEventListener("keydown", this._handleKeydown);
  }

  override updated(changedProperties: Map<string, unknown>): void {
    super.updated(changedProperties);
    if (
      changedProperties.has("valueStart") ||
      changedProperties.has("valueEnd") ||
      changedProperties.has("values")
    ) {
      this._syncPropsToState();
    }
  }

  _syncPropsToState(): void {
    if (this.mode === "range") {
      const start = this._parseDate(this.valueStart);
      const end = this._parseDate(this.valueEnd);
      this._rangeStart = start;
      this._rangeEnd = end;
    } else if (this.mode === "multiple") {
      const parsed = this.values
        ? this.values
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
        : [];
      this._multipleValues = new Set(parsed);
    }
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

  _isDisabledDate(date: Date): boolean {
    if (this.disabledDates) {
      const iso = this._toISO(date);
      const disabled = this.disabledDates
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      if (disabled.includes(iso)) return true;
    }
    if (this.disabledDaysOfWeek) {
      const disabledDays = this.disabledDaysOfWeek
        .split(",")
        .map((s) => parseInt(s.trim(), 10))
        .filter((n) => !isNaN(n));
      if (disabledDays.includes(date.getDay())) return true;
    }
    return false;
  }

  _isEventDate(date: Date): boolean {
    if (!this.events) return false;
    const iso = this._toISO(date);
    const eventDates = this.events
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    return eventDates.includes(iso);
  }

  _getEventDatesSet(): Set<string> {
    if (!this.events) return new Set();
    return new Set(
      this.events
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    );
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
  _getDaysInGrid(viewDate?: Date): Array<{ date: Date; isCurrentMonth: boolean }> {
    const vd = viewDate ?? this._viewDate;
    const year = vd.getFullYear();
    const month = vd.getMonth();
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

  /** Returns the view date for a given month offset (for multi-month view) */
  _getViewDateForOffset(offset: number): Date {
    return new Date(this._viewDate.getFullYear(), this._viewDate.getMonth() + offset, 1);
  }

  /** Get CSS classes for a day cell */
  _getDayClasses(date: Date, isCurrentMonth: boolean): string {
    const classes: string[] = ["sp-calendar-day"];

    if (!isCurrentMonth) classes.push("sp-calendar-day--outside");

    const today = new Date();
    if (this._isSameDay(date, today)) classes.push("sp-calendar-day--today");

    const isDisabled =
      this.disabled || this._isOutOfRange(date) || this._isDisabledDate(date);
    if (isDisabled) classes.push("sp-calendar-day--disabled");

    if (this._isEventDate(date)) classes.push("sp-calendar-day--has-event");

    if (this.mode === "single") {
      const selected = this._parseDate(this.value);
      if (selected && this._isSameDay(date, selected)) {
        classes.push("sp-calendar-day--selected");
      }
    } else if (this.mode === "multiple") {
      const iso = this._toISO(date);
      if (this._multipleValues.has(iso)) classes.push("sp-calendar-day--selected");
    } else if (this.mode === "range") {
      const rs = this._rangeStart;
      const re = this._rangeEnd;
      const hov = this._hoverDate;

      if (rs && this._isSameDay(date, rs)) {
        classes.push("sp-calendar-day--range-start");
        classes.push("sp-calendar-day--selected");
      }
      if (re && this._isSameDay(date, re)) {
        classes.push("sp-calendar-day--range-end");
        classes.push("sp-calendar-day--selected");
      }
      if (rs && re) {
        const t = date.getTime();
        if (t > rs.getTime() && t < re.getTime()) {
          classes.push("sp-calendar-day--in-range");
        }
      } else if (rs && !re && hov) {
        const t = date.getTime();
        const rsT = rs.getTime();
        const hovT = hov.getTime();
        if (hovT > rsT) {
          if (t > rsT && t < hovT) classes.push("sp-calendar-day--in-range-preview");
        } else if (hovT < rsT) {
          if (t < rsT && t > hovT) classes.push("sp-calendar-day--in-range-preview");
        }
      }
    }

    return classes.join(" ");
  }

  // ---- Navigation ----

  _prevMonth(): void {
    if (this._navigating) return;
    this._navigating = true;
    this._slideDir = "right";
    this._viewDate = new Date(this._viewDate.getFullYear(), this._viewDate.getMonth() - 1, 1);
    this._resetSlideDir();
  }

  _nextMonth(): void {
    if (this._navigating) return;
    this._navigating = true;
    this._slideDir = "left";
    this._viewDate = new Date(this._viewDate.getFullYear(), this._viewDate.getMonth() + 1, 1);
    this._resetSlideDir();
  }

  _resetSlideDir(): void {
    requestAnimationFrame(() => {
      setTimeout(() => {
        this._slideDir = "";
        this._navigating = false;
      }, 300);
    });
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
    if (this.disabled || this.readonly || this._isOutOfRange(date) || this._isDisabledDate(date))
      return;

    if (this.mode === "single") {
      this.value = this._toISO(date);
      this._focusedDate = date;
      this.dispatchEvent(
        new CustomEvent("sp-change", {
          detail: { value: this.value },
          bubbles: true,
          composed: true,
        }),
      );
    } else if (this.mode === "range") {
      const iso = this._toISO(date);
      if (!this._rangeStart || this._rangeEnd) {
        // Start new range
        this._rangeStart = date;
        this._rangeEnd = null;
        this._hoverDate = null;
        this.valueStart = iso;
        this.valueEnd = "";
      } else {
        // Check if clicking same date as start — reset
        if (this._isSameDay(date, this._rangeStart)) {
          this._rangeStart = null;
          this._rangeEnd = null;
          this.valueStart = "";
          this.valueEnd = "";
          return;
        }
        // Set end, ensure start < end
        let start = this._rangeStart;
        let end = date;
        if (end.getTime() < start.getTime()) {
          [start, end] = [end, start];
        }
        this._rangeStart = start;
        this._rangeEnd = end;
        this._hoverDate = null;
        this.valueStart = this._toISO(start);
        this.valueEnd = this._toISO(end);
        this.value = this.valueStart;
        this.dispatchEvent(
          new CustomEvent("sp-change", {
            detail: {
              value: this.valueStart,
              valueStart: this.valueStart,
              valueEnd: this.valueEnd,
            },
            bubbles: true,
            composed: true,
          }),
        );
      }
    } else if (this.mode === "multiple") {
      const iso = this._toISO(date);
      if (this._multipleValues.has(iso)) {
        this._multipleValues = new Set([...this._multipleValues].filter(d => d !== iso));
      } else {
        this._multipleValues = new Set([...this._multipleValues, iso]);
      }
      const valuesArr = Array.from(this._multipleValues).sort();
      this.values = valuesArr.join(",");
      this.dispatchEvent(
        new CustomEvent("sp-change", {
          detail: { values: valuesArr },
          bubbles: true,
          composed: true,
        }),
      );
    }
  }

  _setHoverDate(date: Date | null): void {
    if (this.mode === "range" && this._rangeStart && !this._rangeEnd) {
      this._hoverDate = date;
    }
  }

  // ---- Presets ----

  _selectToday(): void {
    const today = new Date();
    this._viewDate = new Date(today.getFullYear(), today.getMonth(), 1);
    this._selectDate(today);
  }

  _selectYesterday(): void {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    this._viewDate = new Date(yesterday.getFullYear(), yesterday.getMonth(), 1);
    this._selectDate(yesterday);
  }

  _selectThisWeek(): void {
    if (this.mode !== "range") return;
    const today = new Date();
    const day = today.getDay(); // 0=Sun
    // Monday = firstDayOfWeek=1
    const diffToMonday = (day + 6) % 7; // days since Monday
    const monday = new Date(today);
    monday.setDate(today.getDate() - diffToMonday);
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);

    this._rangeStart = monday;
    this._rangeEnd = sunday;
    this._hoverDate = null;
    this.valueStart = this._toISO(monday);
    this.valueEnd = this._toISO(sunday);
    this.value = this.valueStart;
    this._viewDate = new Date(monday.getFullYear(), monday.getMonth(), 1);
    this.dispatchEvent(
      new CustomEvent("sp-change", {
        detail: {
          value: this.valueStart,
          valueStart: this.valueStart,
          valueEnd: this.valueEnd,
        },
        bubbles: true,
        composed: true,
      }),
    );
  }

  _selectLast7Days(): void {
    if (this.mode !== "range") return;
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - 6);

    this._rangeStart = start;
    this._rangeEnd = end;
    this._hoverDate = null;
    this.valueStart = this._toISO(start);
    this.valueEnd = this._toISO(end);
    this.value = this.valueStart;
    this._viewDate = new Date(start.getFullYear(), start.getMonth(), 1);
    this.dispatchEvent(
      new CustomEvent("sp-change", {
        detail: {
          value: this.valueStart,
          valueStart: this.valueStart,
          valueEnd: this.valueEnd,
        },
        bubbles: true,
        composed: true,
      }),
    );
  }

  _selectThisMonth(): void {
    if (this.mode !== "range") return;
    const today = new Date();
    const start = new Date(today.getFullYear(), today.getMonth(), 1);
    const end = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    this._rangeStart = start;
    this._rangeEnd = end;
    this._hoverDate = null;
    this.valueStart = this._toISO(start);
    this.valueEnd = this._toISO(end);
    this.value = this.valueStart;
    this._viewDate = new Date(start.getFullYear(), start.getMonth(), 1);
    this.dispatchEvent(
      new CustomEvent("sp-change", {
        detail: {
          value: this.valueStart,
          valueStart: this.valueStart,
          valueEnd: this.valueEnd,
        },
        bubbles: true,
        composed: true,
      }),
    );
  }

  _selectLast30Days(): void {
    if (this.mode !== "range") return;
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - 29);

    this._rangeStart = start;
    this._rangeEnd = end;
    this._hoverDate = null;
    this.valueStart = this._toISO(start);
    this.valueEnd = this._toISO(end);
    this.value = this.valueStart;
    this._viewDate = new Date(start.getFullYear(), start.getMonth(), 1);
    this.dispatchEvent(
      new CustomEvent("sp-change", {
        detail: {
          value: this.valueStart,
          valueStart: this.valueStart,
          valueEnd: this.valueEnd,
        },
        bubbles: true,
        composed: true,
      }),
    );
  }

  // ---- Keyboard navigation ----

  private readonly _handleKeydown = (e: KeyboardEvent): void => {
    if (this.disabled) return;
    if (this._view !== "days") return;

    const fallback = new Date(
      this._viewDate.getFullYear(),
      this._viewDate.getMonth(),
      Math.min(15, new Date(this._viewDate.getFullYear(), this._viewDate.getMonth() + 1, 0).getDate())
    );
    const focused = this._focusedDate ?? this._parseDate(this.value) ?? fallback;

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
        move(-((focused.getDay() - this.firstDayOfWeek + 7) % 7));
        break;
      case "End":
        e.preventDefault();
        move(((6 - focused.getDay() + this.firstDayOfWeek + 7) % 7));
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
