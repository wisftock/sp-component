import { describe, it, expect, beforeEach, vi } from "vitest";
import "./sp-calendar.js";
import type { SpCalendarComponent } from "./sp-calendar.js";

function createElement(): SpCalendarComponent {
  const el = document.createElement("sp-calendar") as SpCalendarComponent;
  document.body.appendChild(el);
  return el;
}

describe("sp-calendar", () => {
  let el: SpCalendarComponent;

  beforeEach(() => {
    document.body.innerHTML = "";
    el = createElement();
  });

  // ---- Rendering ----

  it("renders calendar in shadow DOM", async () => {
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-calendar")).not.toBeNull();
  });

  it("renders 42 day cells by default", async () => {
    await el.updateComplete;
    expect(el.shadowRoot?.querySelectorAll(".sp-calendar-day").length).toBe(42);
  });

  it("renders 7 weekday headers", async () => {
    await el.updateComplete;
    expect(el.shadowRoot?.querySelectorAll(".sp-calendar-weekday").length).toBe(7);
  });

  // ---- Date helpers ----

  it("_parseDate returns a Date for valid ISO string", () => {
    const d = el._parseDate("2025-06-15");
    expect(d).not.toBeNull();
    expect(d?.getFullYear()).toBe(2025);
    expect(d?.getMonth()).toBe(5); // June = 5
    expect(d?.getDate()).toBe(15);
  });

  it("_parseDate returns null for empty string", () => {
    expect(el._parseDate("")).toBeNull();
  });

  it("_parseDate returns null for invalid string", () => {
    expect(el._parseDate("not-a-date")).toBeNull();
  });

  it("_toISO formats date correctly", () => {
    expect(el._toISO(new Date(2025, 5, 5))).toBe("2025-06-05");
    expect(el._toISO(new Date(2025, 11, 31))).toBe("2025-12-31");
  });

  it("_isSameDay returns true for same date", () => {
    expect(el._isSameDay(new Date(2025, 5, 15), new Date(2025, 5, 15))).toBe(true);
  });

  it("_isSameDay returns false for different dates", () => {
    expect(el._isSameDay(new Date(2025, 5, 15), new Date(2025, 5, 16))).toBe(false);
  });

  // ---- Range validation ----

  it("_isOutOfRange returns true for date before min", () => {
    el.min = "2025-06-10";
    expect(el._isOutOfRange(new Date(2025, 5, 5))).toBe(true);
  });

  it("_isOutOfRange returns false for date on min boundary", () => {
    el.min = "2025-06-10";
    expect(el._isOutOfRange(new Date(2025, 5, 10))).toBe(false);
  });

  it("_isOutOfRange returns true for date after max", () => {
    el.max = "2025-06-20";
    expect(el._isOutOfRange(new Date(2025, 5, 25))).toBe(true);
  });

  it("_isOutOfRange returns false when no min/max", () => {
    expect(el._isOutOfRange(new Date(2025, 5, 15))).toBe(false);
  });

  // ---- Date selection ----

  it("selects a date and updates value", () => {
    el._selectDate(new Date(2025, 5, 15));
    expect(el.value).toBe("2025-06-15");
  });

  it("emits sp-change when date selected", () => {
    const listener = vi.fn();
    el.addEventListener("sp-change", listener);
    el._selectDate(new Date(2025, 5, 15));
    expect(listener).toHaveBeenCalledOnce();
    expect((listener.mock.calls[0]?.[0] as CustomEvent<{ value: string }>).detail).toEqual({
      value: "2025-06-15",
    });
  });

  it("does not select date when disabled", () => {
    el.disabled = true;
    el._selectDate(new Date(2025, 5, 15));
    expect(el.value).toBe("");
  });

  it("does not select date when readonly", () => {
    el.readonly = true;
    el._selectDate(new Date(2025, 5, 15));
    expect(el.value).toBe("");
  });

  it("does not select date outside range", () => {
    el.min = "2025-06-10";
    el._selectDate(new Date(2025, 5, 5));
    expect(el.value).toBe("");
  });

  // ---- Navigation ----

  it("_prevMonth navigates to previous month", () => {
    el._viewDate = new Date(2025, 5, 1); // June 2025
    el._prevMonth();
    expect(el._viewDate.getMonth()).toBe(4); // May
    expect(el._viewDate.getFullYear()).toBe(2025);
  });

  it("_nextMonth navigates to next month", () => {
    el._viewDate = new Date(2025, 5, 1);
    el._nextMonth();
    expect(el._viewDate.getMonth()).toBe(6); // July
  });

  it("_prevMonth wraps from January to December of previous year", () => {
    el._viewDate = new Date(2025, 0, 1); // January 2025
    el._prevMonth();
    expect(el._viewDate.getMonth()).toBe(11); // December
    expect(el._viewDate.getFullYear()).toBe(2024);
  });

  it("_nextMonth wraps from December to January of next year", () => {
    el._viewDate = new Date(2025, 11, 1); // December 2025
    el._nextMonth();
    expect(el._viewDate.getMonth()).toBe(0); // January
    expect(el._viewDate.getFullYear()).toBe(2026);
  });

  it("_selectMonth changes month and switches to days view", () => {
    el._view = "months";
    el._viewDate = new Date(2025, 5, 1);
    el._selectMonth(9); // October
    expect(el._viewDate.getMonth()).toBe(9);
    expect(el._view).toBe("days");
  });

  it("_selectYear changes year and switches to months view", () => {
    el._view = "years";
    el._selectYear(2030);
    expect(el._viewDate.getFullYear()).toBe(2030);
    expect(el._view).toBe("months");
  });

  // ---- Views ----

  it("defaults to days view", async () => {
    await el.updateComplete;
    expect(el._view).toBe("days");
    expect(el.shadowRoot?.querySelector(".sp-calendar-grid")).not.toBeNull();
  });

  it("switches to months view", async () => {
    el._view = "months";
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-calendar-month-grid")).not.toBeNull();
  });

  it("switches to years view", async () => {
    el._view = "years";
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-calendar-year-grid")).not.toBeNull();
  });

  // ---- Weekday grid ----

  it("_getDaysInGrid returns 42 cells", () => {
    el._viewDate = new Date(2025, 5, 1);
    expect(el._getDaysInGrid().length).toBe(42);
  });

  it("_getYearRange returns 12 years", () => {
    expect(el._getYearRange().length).toBe(12);
  });

  // ---- Keyboard navigation ----

  it("ArrowRight moves focus forward one day", () => {
    el._viewDate = new Date(2025, 5, 1);
    el._focusedDate = new Date(2025, 5, 10);
    el.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true }));
    expect(el._focusedDate?.getDate()).toBe(11);
  });

  it("ArrowLeft moves focus back one day", () => {
    el._viewDate = new Date(2025, 5, 1);
    el._focusedDate = new Date(2025, 5, 10);
    el.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowLeft", bubbles: true }));
    expect(el._focusedDate?.getDate()).toBe(9);
  });

  it("ArrowDown moves focus forward one week", () => {
    el._viewDate = new Date(2025, 5, 1);
    el._focusedDate = new Date(2025, 5, 10);
    el.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true }));
    expect(el._focusedDate?.getDate()).toBe(17);
  });

  it("ArrowUp moves focus back one week", () => {
    el._viewDate = new Date(2025, 5, 1);
    el._focusedDate = new Date(2025, 5, 10);
    el.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowUp", bubbles: true }));
    expect(el._focusedDate?.getDate()).toBe(3);
  });

  it("Enter selects focused date", () => {
    el._focusedDate = new Date(2025, 5, 20);
    el._viewDate = new Date(2025, 5, 1);
    el.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true }));
    expect(el.value).toBe("2025-06-20");
  });

  it("PageUp navigates to previous month", () => {
    el._viewDate = new Date(2025, 5, 1);
    el.dispatchEvent(new KeyboardEvent("keydown", { key: "PageUp", bubbles: true }));
    expect(el._viewDate.getMonth()).toBe(4);
  });

  it("PageDown navigates to next month", () => {
    el._viewDate = new Date(2025, 5, 1);
    el.dispatchEvent(new KeyboardEvent("keydown", { key: "PageDown", bubbles: true }));
    expect(el._viewDate.getMonth()).toBe(6);
  });

  it("keyboard navigation ignored when disabled", () => {
    el.disabled = true;
    el._viewDate = new Date(2025, 5, 1);
    el._focusedDate = new Date(2025, 5, 10);
    el.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true }));
    expect(el._focusedDate?.getDate()).toBe(10);
  });

  // ---- firstDayOfWeek ----

  it("firstDayOfWeek=0 starts week on Sunday", () => {
    el.firstDayOfWeek = 0;
    const headers = el._getWeekdayHeaders();
    expect(headers.length).toBe(7);
  });

  it("firstDayOfWeek=1 starts week on Monday (default)", () => {
    const headers = el._getWeekdayHeaders();
    expect(headers.length).toBe(7);
  });

  // ---- Mode: range ----

  it("range mode: first click sets rangeStart", () => {
    el.mode = "range";
    el._selectDate(new Date(2025, 5, 10));
    expect(el._rangeStart).not.toBeNull();
    expect(el._toISO(el._rangeStart!)).toBe("2025-06-10");
    expect(el._rangeEnd).toBeNull();
  });

  it("range mode: second click sets rangeEnd and emits sp-change", () => {
    el.mode = "range";
    const listener = vi.fn();
    el.addEventListener("sp-change", listener);
    el._selectDate(new Date(2025, 5, 10));
    el._selectDate(new Date(2025, 5, 20));
    expect(el._rangeEnd).not.toBeNull();
    expect(el._toISO(el._rangeEnd!)).toBe("2025-06-20");
    expect(listener).toHaveBeenCalledOnce();
    const detail = (listener.mock.calls[0]?.[0] as CustomEvent).detail as {
      value: string;
      valueStart: string;
      valueEnd: string;
    };
    expect(detail.valueStart).toBe("2025-06-10");
    expect(detail.valueEnd).toBe("2025-06-20");
  });

  it("range mode: days between start and end get in-range class", () => {
    el.mode = "range";
    el._rangeStart = new Date(2025, 5, 10);
    el._rangeEnd = new Date(2025, 5, 20);
    const midDate = new Date(2025, 5, 15);
    const classes = el._getDayClasses(midDate, true);
    expect(classes).toContain("sp-calendar-day--in-range");
  });

  it("range mode: clicking same date as start resets range", () => {
    el.mode = "range";
    el._selectDate(new Date(2025, 5, 10));
    expect(el._rangeStart).not.toBeNull();
    el._selectDate(new Date(2025, 5, 10));
    expect(el._rangeStart).toBeNull();
    expect(el._rangeEnd).toBeNull();
  });

  // ---- Mode: multiple ----

  it("multiple mode: clicking a date adds it to values", () => {
    el.mode = "multiple";
    el._selectDate(new Date(2025, 5, 10));
    expect(el._multipleValues.has("2025-06-10")).toBe(true);
  });

  it("multiple mode: clicking selected date removes it", () => {
    el.mode = "multiple";
    el._selectDate(new Date(2025, 5, 10));
    expect(el._multipleValues.has("2025-06-10")).toBe(true);
    el._selectDate(new Date(2025, 5, 10));
    expect(el._multipleValues.has("2025-06-10")).toBe(false);
  });

  // ---- Events/markers ----

  it("days with events get has-event class", () => {
    el.events = "2025-06-10,2025-06-15";
    const classes10 = el._getDayClasses(new Date(2025, 5, 10), true);
    expect(classes10).toContain("sp-calendar-day--has-event");
    const classes11 = el._getDayClasses(new Date(2025, 5, 11), true);
    expect(classes11).not.toContain("sp-calendar-day--has-event");
  });

  // ---- Disabled specific days ----

  it("disabled-dates disables specific dates", () => {
    el.disabledDates = "2025-06-10,2025-06-15";
    expect(el._isDisabledDate(new Date(2025, 5, 10))).toBe(true);
    expect(el._isDisabledDate(new Date(2025, 5, 11))).toBe(false);
  });

  it("disabled-days-of-week disables weekends", () => {
    el.disabledDaysOfWeek = "0,6";
    // 2025-06-07 is a Saturday (day 6)
    expect(el._isDisabledDate(new Date(2025, 5, 7))).toBe(true);
    // 2025-06-08 is a Sunday (day 0)
    expect(el._isDisabledDate(new Date(2025, 5, 8))).toBe(true);
    // 2025-06-09 is a Monday (day 1)
    expect(el._isDisabledDate(new Date(2025, 5, 9))).toBe(false);
  });

  // ---- Presets ----

  it("today preset selects today's date", () => {
    const listener = vi.fn();
    el.addEventListener("sp-change", listener);
    el._selectToday();
    const today = new Date();
    const iso = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
    expect(el.value).toBe(iso);
    expect(listener).toHaveBeenCalledOnce();
  });

  // ---- months prop ----

  it("months=2 renders two month grids", async () => {
    el.months = 2;
    await el.updateComplete;
    const monthPanels = el.shadowRoot?.querySelectorAll(".sp-calendar-month-panel");
    expect(monthPanels?.length).toBe(2);
  });
});
