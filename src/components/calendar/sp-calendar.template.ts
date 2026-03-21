import { html, nothing, type TemplateResult } from "lit";
import { repeat } from "lit/directives/repeat.js";
import type { SpCalendarComponent } from "./sp-calendar.js";

function chevronLeft(): TemplateResult {
  return html`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true">
    <polyline points="15 18 9 12 15 6"></polyline>
  </svg>`;
}

function chevronRight(): TemplateResult {
  return html`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true">
    <polyline points="9 18 15 12 9 6"></polyline>
  </svg>`;
}

function renderDaysView(
  host: SpCalendarComponent,
  viewDate: Date,
  showPrev: boolean,
  showNext: boolean,
): TemplateResult {
  const today = new Date();
  const weekdays = host._getWeekdayHeaders();
  const days = host._getDaysInGrid(viewDate);
  const locale = host._getLocale();
  const monthName = new Intl.DateTimeFormat(locale, { month: "long", year: "numeric" }).format(
    viewDate,
  );

  const gridClasses = [
    "sp-calendar-grid",
    host._slideDir === "left" ? "sp-calendar-grid--slide-left" : "",
    host._slideDir === "right" ? "sp-calendar-grid--slide-right" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return html`
    <!-- Header -->
    <div class="sp-calendar-header" part="header">
      ${showPrev
        ? html`<button
            class="sp-calendar-nav-btn"
            aria-label="Previous month"
            ?disabled=${host.disabled}
            @click=${() => host._prevMonth()}
          >${chevronLeft()}</button>`
        : html`<span class="sp-calendar-nav-placeholder"></span>`}

      <button
        class="sp-calendar-title"
        aria-label="Select month and year"
        ?disabled=${host.disabled}
        @click=${() => (host._view = "months")}
      >
        ${monthName}
      </button>

      ${showNext
        ? html`<button
            class="sp-calendar-nav-btn"
            aria-label="Next month"
            ?disabled=${host.disabled}
            @click=${() => host._nextMonth()}
          >${chevronRight()}</button>`
        : html`<span class="sp-calendar-nav-placeholder"></span>`}
    </div>

    <!-- Weekday headers -->
    <div class="sp-calendar-weekdays" role="row">
      ${weekdays.map(
        (d) => html`<div class="sp-calendar-weekday" role="columnheader" aria-label=${d}>${d}</div>`,
      )}
    </div>

    <!-- Day grid -->
    <div
      class=${gridClasses}
      role="grid"
      aria-label=${monthName}
    >
      ${repeat(
        days,
        (d) => host._toISO(d.date),
        (d) => {
          const iso = host._toISO(d.date);
          const classes = host._getDayClasses(d.date, d.isCurrentMonth);
          const isSelected = classes.includes("sp-calendar-day--selected");
          const isToday = host._isSameDay(d.date, today);
          const isDisabled =
            host.disabled || host._isOutOfRange(d.date) || host._isDisabledDate(d.date);
          const isFocused = host._focusedDate ? host._isSameDay(d.date, host._focusedDate) : false;

          return html`
            <button
              class=${classes}
              part="day"
              role="gridcell"
              aria-label=${new Intl.DateTimeFormat(host._getLocale(), {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              }).format(d.date)}
              aria-selected=${isSelected ? "true" : "false"}
              aria-disabled=${isDisabled ? "true" : "false"}
              aria-current=${isToday ? "date" : nothing}
              tabindex=${isFocused || (isSelected && !host._focusedDate) ? "0" : "-1"}
              ?disabled=${isDisabled}
              @click=${() => host._selectDate(d.date)}
              @mouseover=${() => host._setHoverDate(d.date)}
              @mouseleave=${() => host._setHoverDate(null)}
            >
              ${d.date.getDate()}
            </button>
          `;
        },
      )}
    </div>
  `;
}

function renderMonthsView(host: SpCalendarComponent): TemplateResult {
  const year = host._viewDate.getFullYear();
  const currentMonth = host._viewDate.getMonth();

  return html`
    <!-- Header -->
    <div class="sp-calendar-header" part="header">
      <button
        class="sp-calendar-nav-btn"
        aria-label="Previous year"
        ?disabled=${host.disabled}
        @click=${() => host._prevYear()}
      >${chevronLeft()}</button>

      <button
        class="sp-calendar-title"
        aria-label="Select year"
        ?disabled=${host.disabled}
        @click=${() => (host._view = "years")}
      >${year}</button>

      <button
        class="sp-calendar-nav-btn"
        aria-label="Next year"
        ?disabled=${host.disabled}
        @click=${() => host._nextYear()}
      >${chevronRight()}</button>
    </div>

    <!-- Month grid -->
    <div class="sp-calendar-month-grid">
      ${Array.from({ length: 12 }, (_, i) => html`
        <button
          class="sp-calendar-month-btn ${i === currentMonth ? "sp-calendar-month-btn--active" : ""}"
          ?disabled=${host.disabled}
          @click=${() => host._selectMonth(i)}
        >
          ${host._getMonthName(i)}
        </button>
      `)}
    </div>
  `;
}

function renderYearsView(host: SpCalendarComponent): TemplateResult {
  const years = host._getYearRange();
  const currentYear = host._viewDate.getFullYear();

  return html`
    <!-- Header -->
    <div class="sp-calendar-header" part="header">
      <button
        class="sp-calendar-nav-btn"
        aria-label="Previous years"
        ?disabled=${host.disabled}
        @click=${() => host._prevYearRange()}
      >${chevronLeft()}</button>

      <span class="sp-calendar-title sp-calendar-title--static">
        ${years[0]} – ${years[years.length - 1]}
      </span>

      <button
        class="sp-calendar-nav-btn"
        aria-label="Next years"
        ?disabled=${host.disabled}
        @click=${() => host._nextYearRange()}
      >${chevronRight()}</button>
    </div>

    <!-- Year grid -->
    <div class="sp-calendar-year-grid">
      ${years.map(
        (y) => html`
          <button
            class="sp-calendar-year-btn ${y === currentYear ? "sp-calendar-year-btn--active" : ""}"
            ?disabled=${host.disabled}
            @click=${() => host._selectYear(y)}
          >${y}</button>
        `,
      )}
    </div>
  `;
}

function renderPresets(host: SpCalendarComponent): TemplateResult {
  const isRange = host.mode === "range";

  return html`
    <div class="sp-calendar-presets">
      <button class="sp-calendar-preset-btn" @click=${() => host._selectToday()}>Today</button>
      <button class="sp-calendar-preset-btn" @click=${() => host._selectYesterday()}>Yesterday</button>
      ${isRange
        ? html`
          <button class="sp-calendar-preset-btn" @click=${() => host._selectThisWeek()}>This week</button>
          <button class="sp-calendar-preset-btn" @click=${() => host._selectLast7Days()}>Last 7 days</button>
          <button class="sp-calendar-preset-btn" @click=${() => host._selectThisMonth()}>This month</button>
          <button class="sp-calendar-preset-btn" @click=${() => host._selectLast30Days()}>Last 30 days</button>
        `
        : nothing}
    </div>
  `;
}

export function calendarTemplate(this: SpCalendarComponent): TemplateResult {
  const numMonths = Math.min(Math.max(this.months ?? 1, 1), 3);

  return html`
    <div
      class="sp-calendar${this.showPresets ? " sp-calendar--with-presets" : ""}"
      part="calendar"
      role="application"
      aria-label="Calendar"
    >
      ${this.showPresets ? renderPresets(this) : nothing}
      <div class="sp-calendar-body">
        ${this._view === "days"
          ? numMonths > 1
            ? html`
                <div class="sp-calendar-months">
                  ${Array.from({ length: numMonths }, (_, i) => {
                    const vd = this._getViewDateForOffset(i);
                    return html`
                      <div class="sp-calendar-month-panel">
                        ${renderDaysView(this, vd, i === 0, i === numMonths - 1)}
                      </div>
                    `;
                  })}
                </div>
              `
            : renderDaysView(this, this._viewDate, true, true)
          : this._view === "months"
            ? renderMonthsView(this)
            : renderYearsView(this)}
      </div>
    </div>
  `;
}
