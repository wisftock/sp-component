import { describe, it, expect, beforeEach, vi } from "vitest";
import "./sp-time-picker.js";
import type { SpTimePickerComponent } from "./sp-time-picker.js";

function createElement(): SpTimePickerComponent {
  const el = document.createElement("sp-time-picker") as SpTimePickerComponent;
  document.body.appendChild(el);
  return el;
}

describe("sp-time-picker", () => {
  let el: SpTimePickerComponent;

  beforeEach(() => {
    document.body.innerHTML = "";
    el = createElement();
  });

  // ---- Rendering ----

  it("renders in shadow DOM with field element", async () => {
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-time-picker-field")).not.toBeNull();
  });

  it("default value is empty string", async () => {
    await el.updateComplete;
    expect(el.value).toBe("");
  });

  it("renders label when label prop is set", async () => {
    el.label = "Select time";
    await el.updateComplete;
    const labelEl = el.shadowRoot?.querySelector(".sp-time-picker-label");
    expect(labelEl).not.toBeNull();
    expect(labelEl?.textContent?.trim()).toContain("Select time");
  });

  // ---- _formatDisplay ----

  it("_formatDisplay returns empty when no value", async () => {
    await el.updateComplete;
    expect(el._formatDisplay()).toBe("");
  });

  it("_formatDisplay returns value when set", async () => {
    el.value = "14:30";
    await el.updateComplete;
    expect(el._formatDisplay()).toBe("14:30");
  });

  // ---- _getTimeOptions ----

  it("_getTimeOptions returns 24 options for step=60", async () => {
    el.step = 60;
    await el.updateComplete;
    const options = el._getTimeOptions();
    expect(options.length).toBe(24);
  });

  it("_getTimeOptions returns 48 options for step=30", async () => {
    el.step = 30;
    await el.updateComplete;
    const options = el._getTimeOptions();
    expect(options.length).toBe(48);
  });

  it("_getTimeOptions returns 96 options for step=15", async () => {
    el.step = 15;
    await el.updateComplete;
    const options = el._getTimeOptions();
    expect(options.length).toBe(96);
  });

  // ---- _changeHours ----

  it("_changeHours wraps correctly at 24h boundary", async () => {
    el.format = "24";
    el._hours = 23;
    el._changeHours(1);
    expect(el._hours).toBe(0);
  });

  it("_changeHours wraps correctly at 0 boundary", async () => {
    el.format = "24";
    el._hours = 0;
    el._changeHours(-1);
    expect(el._hours).toBe(23);
  });

  it("_changeHours wraps in 12h format from 12 to 1", async () => {
    el.format = "12";
    el._hours = 12;
    el._changeHours(1);
    expect(el._hours).toBe(1);
  });

  // ---- _changeMinutes ----

  it("_changeMinutes wraps by step at 59 boundary", async () => {
    el.step = 15;
    el._minutes = 45;
    el._changeMinutes(1);
    expect(el._minutes).toBe(0);
  });

  it("_changeMinutes wraps correctly at 0", async () => {
    el.step = 15;
    el._minutes = 0;
    el._changeMinutes(-1);
    expect(el._minutes).toBe(45);
  });

  // ---- _togglePeriod ----

  it("_togglePeriod switches AM to PM", async () => {
    el.format = "12";
    el._period = "AM";
    el._togglePeriod();
    expect(el._period).toBe("PM");
  });

  it("_togglePeriod switches PM to AM", async () => {
    el.format = "12";
    el._period = "PM";
    el._togglePeriod();
    expect(el._period).toBe("AM");
  });

  // ---- _setNow ----

  it("_setNow sets hours and minutes to current time", async () => {
    el.format = "24";
    const now = new Date();
    el._setNow();
    expect(el._hours).toBe(now.getHours());
    expect(el._minutes).toBe(now.getMinutes());
  });

  // ---- _clear ----

  it("_clear clears value and emits sp-clear", async () => {
    el.value = "10:00";
    await el.updateComplete;
    const clearListener = vi.fn();
    el.addEventListener("sp-clear", clearListener);
    const clearEvent = new Event("click", { bubbles: true });
    el._clear(clearEvent);
    expect(el.value).toBe("");
    expect(clearListener).toHaveBeenCalledOnce();
  });

  // ---- sp-change event ----

  it("emits sp-change on confirm", async () => {
    el._hours = 10;
    el._minutes = 30;
    el._open = true;
    await el.updateComplete;
    const listener = vi.fn();
    el.addEventListener("sp-change", listener);
    el._confirm();
    expect(listener).toHaveBeenCalledOnce();
    const detail = (listener.mock.calls[0]?.[0] as CustomEvent<{ value: string }>).detail;
    expect(detail.value).toBe("10:30");
  });

  // ---- Disabled ----

  it("disabled prevents opening panel", async () => {
    el.disabled = true;
    await el.updateComplete;
    el._toggle();
    await el.updateComplete;
    expect(el._open).toBe(false);
  });

  // ---- Form participation ----

  it("participates in form — value appears in FormData", async () => {
    const form = document.createElement("form");
    document.body.appendChild(form);
    const picker = document.createElement("sp-time-picker") as SpTimePickerComponent;
    picker.setAttribute("name", "meeting-time");
    form.appendChild(picker);
    await picker.updateComplete;
    picker.value = "09:00";
    await picker.updateComplete;
    const data = new FormData(form);
    expect(data.get("meeting-time")).toBe("09:00");
  });

  it("formResetCallback resets value to empty string", async () => {
    el.value = "14:30";
    await el.updateComplete;
    (el as unknown as { formResetCallback(): void }).formResetCallback();
    await el.updateComplete;
    expect(el.value).toBe("");
  });
});
