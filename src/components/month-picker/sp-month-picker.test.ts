import { describe, it, expect, beforeEach } from "vitest";
import "./sp-month-picker.js";
import type { SpMonthPickerComponent } from "./sp-month-picker.js";

function createElement(): SpMonthPickerComponent {
  const el = document.createElement("sp-month-picker") as SpMonthPickerComponent;
  document.body.appendChild(el);
  return el;
}

describe("sp-month-picker", () => {
  let el: SpMonthPickerComponent;
  beforeEach(() => { document.body.innerHTML = ""; el = createElement(); });

  it("renders trigger in shadow DOM", async () => {
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-mp-trigger")).not.toBeNull();
  });

  it("shows placeholder when no value", async () => {
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-mp-placeholder")).not.toBeNull();
  });

  it("opens panel on trigger click", async () => {
    await el.updateComplete;
    const trigger = el.shadowRoot?.querySelector<HTMLElement>(".sp-mp-trigger");
    trigger?.click();
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-mp-panel")).not.toBeNull();
  });

  it("renders month grid when open", async () => {
    el.open = true;
    await el.updateComplete;
    const months = el.shadowRoot?.querySelectorAll(".sp-mp-month");
    expect(months?.length).toBe(12);
  });

  it("renders year display when open", async () => {
    el.open = true;
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-mp-year")).not.toBeNull();
  });

  it("fires sp-change on month selection", async () => {
    el.open = true;
    await el.updateComplete;
    const received: CustomEvent[] = [];
    el.addEventListener("sp-change", (e) => received.push(e as CustomEvent));
    const months = el.shadowRoot?.querySelectorAll<HTMLButtonElement>(".sp-mp-month");
    months?.[0]?.click();
    expect(received.length).toBe(1);
    expect(received[0].detail.month).toBe(0);
  });

  it("closes panel after selection", async () => {
    el.open = true;
    await el.updateComplete;
    const months = el.shadowRoot?.querySelectorAll<HTMLButtonElement>(".sp-mp-month");
    months?.[0]?.click();
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-mp-panel")).toBeNull();
  });

  it("shows value text when value is set", async () => {
    el.value = "2025-03";
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-mp-value")).not.toBeNull();
  });

  it("does not open when disabled", async () => {
    el.disabled = true;
    await el.updateComplete;
    const trigger = el.shadowRoot?.querySelector<HTMLElement>(".sp-mp-trigger");
    trigger?.click();
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-mp-panel")).toBeNull();
  });

  it("nav buttons change year", async () => {
    el.open = true;
    await el.updateComplete;
    const currentYear = new Date().getFullYear();
    const navBtns = el.shadowRoot?.querySelectorAll<HTMLButtonElement>(".sp-mp-nav");
    navBtns?.[0]?.click(); // prev year
    await el.updateComplete;
    const yearEl = el.shadowRoot?.querySelector(".sp-mp-year");
    expect(yearEl?.textContent?.trim()).toBe(String(currentYear - 1));
  });
});
