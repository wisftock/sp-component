import { describe, it, expect, beforeEach } from "vitest";
import "./sp-date-range-picker.js";
import type { SpDateRangePickerComponent } from "./sp-date-range-picker.js";

function createElement(): SpDateRangePickerComponent {
  const el = document.createElement("sp-date-range-picker") as SpDateRangePickerComponent;
  document.body.appendChild(el);
  return el;
}

describe("sp-date-range-picker", () => {
  let el: SpDateRangePickerComponent;
  beforeEach(() => { document.body.innerHTML = ""; el = createElement(); });

  it("renders trigger in shadow DOM", async () => {
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-drp-trigger")).not.toBeNull();
  });

  it("shows placeholder when no range selected", async () => {
    await el.updateComplete;
    const text = el.shadowRoot?.querySelector(".sp-drp-trigger-text--placeholder");
    expect(text).not.toBeNull();
  });

  it("opens panel on trigger click", async () => {
    await el.updateComplete;
    const trigger = el.shadowRoot?.querySelector<HTMLElement>(".sp-drp-trigger");
    trigger?.click();
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-drp-panel")).not.toBeNull();
  });

  it("renders two calendars when open", async () => {
    el.open = true;
    await el.updateComplete;
    const cals = el.shadowRoot?.querySelectorAll(".sp-drp-calendar");
    expect(cals?.length).toBe(2);
  });

  it("renders day buttons in calendar", async () => {
    el.open = true;
    await el.updateComplete;
    const days = el.shadowRoot?.querySelectorAll(".sp-drp-day");
    expect(days!.length).toBeGreaterThan(28);
  });

  it("renders day-of-week headers", async () => {
    el.open = true;
    await el.updateComplete;
    const dows = el.shadowRoot?.querySelectorAll(".sp-drp-cal-dow");
    expect(dows?.length).toBeGreaterThan(0);
  });

  it("does not open when disabled", async () => {
    el.disabled = true;
    await el.updateComplete;
    const trigger = el.shadowRoot?.querySelector<HTMLElement>(".sp-drp-trigger");
    trigger?.click();
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-drp-panel")).toBeNull();
  });

  it("fires sp-clear when clear button clicked", async () => {
    el.start = "2025-01-01";
    el.end = "2025-01-31";
    el.open = true;
    await el.updateComplete;
    const received: CustomEvent[] = [];
    el.addEventListener("sp-clear", (e) => received.push(e as CustomEvent));
    const clearBtn = el.shadowRoot?.querySelector<HTMLButtonElement>(".sp-drp-btn");
    clearBtn?.click();
    expect(received.length).toBe(1);
  });

  it("fires sp-change when range is confirmed", async () => {
    el.open = true;
    await el.updateComplete;
    const received: CustomEvent[] = [];
    el.addEventListener("sp-change", (e) => received.push(e as CustomEvent));
    // Select start date
    const days = el.shadowRoot?.querySelectorAll<HTMLButtonElement>(".sp-drp-day:not(.sp-drp-day--other-month)");
    days?.[0]?.click();
    days?.[5]?.click();
    await el.updateComplete;
    // Confirm
    const confirmBtn = el.shadowRoot?.querySelector<HTMLButtonElement>(".sp-drp-btn--primary");
    confirmBtn?.click();
    expect(received.length).toBe(1);
    expect(received[0].detail.start).toBeTruthy();
  });
});
