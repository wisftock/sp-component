import { describe, it, expect, beforeEach } from "vitest";
import "./sp-date-time-picker.js";
import type { SpDateTimePickerComponent } from "./sp-date-time-picker.js";

function createElement(): SpDateTimePickerComponent {
  const el = document.createElement("sp-date-time-picker") as SpDateTimePickerComponent;
  document.body.appendChild(el);
  return el;
}

describe("sp-date-time-picker", () => {
  let el: SpDateTimePickerComponent;
  beforeEach(() => { document.body.innerHTML = ""; el = createElement(); });

  it("renders trigger in shadow DOM", async () => {
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-dtp-trigger")).not.toBeNull();
  });

  it("shows placeholder when no value", async () => {
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-dtp-placeholder")).not.toBeNull();
  });

  it("opens panel on trigger click", async () => {
    await el.updateComplete;
    const trigger = el.shadowRoot?.querySelector<HTMLElement>(".sp-dtp-trigger");
    trigger?.click();
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-dtp-panel")).not.toBeNull();
  });

  it("renders calendar when open", async () => {
    el.open = true;
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-dtp-grid")).not.toBeNull();
  });

  it("renders day buttons in calendar", async () => {
    el.open = true;
    await el.updateComplete;
    const days = el.shadowRoot?.querySelectorAll(".sp-dtp-day");
    expect(days!.length).toBeGreaterThan(28);
  });

  it("renders day-of-week headers", async () => {
    el.open = true;
    await el.updateComplete;
    const dows = el.shadowRoot?.querySelectorAll(".sp-dtp-dow");
    expect(dows?.length).toBe(7);
  });

  it("renders time selector", async () => {
    el.open = true;
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-dtp-time")).not.toBeNull();
  });

  it("shows confirm button when open", async () => {
    el.open = true;
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-dtp-btn--primary")).not.toBeNull();
  });

  it("does not open when disabled", async () => {
    el.disabled = true;
    await el.updateComplete;
    const trigger = el.shadowRoot?.querySelector<HTMLElement>(".sp-dtp-trigger");
    trigger?.click();
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-dtp-panel")).toBeNull();
  });

  it("fires sp-change after date selection and confirm", async () => {
    el.open = true;
    await el.updateComplete;
    const received: CustomEvent[] = [];
    el.addEventListener("sp-change", (e) => received.push(e as CustomEvent));
    // Click a non-other-month day
    const days = el.shadowRoot?.querySelectorAll<HTMLButtonElement>(".sp-dtp-day:not(.sp-dtp-day--other)");
    days?.[0]?.click();
    await el.updateComplete;
    const confirmBtn = el.shadowRoot?.querySelector<HTMLButtonElement>(".sp-dtp-btn--primary");
    confirmBtn?.click();
    expect(received.length).toBe(1);
    expect(received[0].detail.value).toContain("T");
  });

  it("shows value text when value is set", async () => {
    el.value = "2025-06-15T10:30";
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-dtp-value")).not.toBeNull();
  });
});
