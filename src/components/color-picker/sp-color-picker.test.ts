import { describe, it, expect, beforeEach, vi } from "vitest";
import "./sp-color-picker.js";
import { hexToHsl, hslToHex, hslToRgb, hslToHslString } from "./sp-color-picker.js";
import type { SpColorPickerComponent } from "./sp-color-picker.js";

function createElement(): SpColorPickerComponent {
  const el = document.createElement("sp-color-picker") as SpColorPickerComponent;
  document.body.appendChild(el);
  return el;
}

describe("sp-color-picker", () => {
  let el: SpColorPickerComponent;

  beforeEach(() => {
    document.body.innerHTML = "";
    el = createElement();
  });

  // ---- Rendering ----

  it("renders trigger button in shadow DOM", async () => {
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-color-picker-trigger")).not.toBeNull();
  });

  it("default value is #000000", async () => {
    await el.updateComplete;
    expect(el.value).toBe("#000000");
  });

  it("trigger shows current value text", async () => {
    el.value = "#ff0000";
    await el.updateComplete;
    const valueEl = el.shadowRoot?.querySelector(".sp-color-picker-trigger-value");
    expect(valueEl?.textContent?.trim()).toBe("#ff0000");
  });

  // ---- Panel open/close ----

  it("clicking trigger opens panel", async () => {
    await el.updateComplete;
    expect(el._open).toBe(false);
    const trigger = el.shadowRoot?.querySelector(".sp-color-picker-trigger") as HTMLButtonElement;
    trigger.click();
    await el.updateComplete;
    expect(el._open).toBe(true);
    expect(el.shadowRoot?.querySelector(".sp-color-picker-panel")).not.toBeNull();
  });

  it("clicking trigger again closes panel", async () => {
    await el.updateComplete;
    const trigger = el.shadowRoot?.querySelector(".sp-color-picker-trigger") as HTMLButtonElement;
    trigger.click();
    await el.updateComplete;
    trigger.click();
    await el.updateComplete;
    expect(el._open).toBe(false);
  });

  // ---- hexToHsl helper ----

  it("hexToHsl correctly converts #ff0000 to red hue", () => {
    const result = hexToHsl("#ff0000");
    expect(result).not.toBeNull();
    expect(result!.h).toBe(0);
    expect(result!.s).toBe(100);
    expect(result!.l).toBe(50);
  });

  it("hexToHsl correctly converts #000000 to black", () => {
    const result = hexToHsl("#000000");
    expect(result).not.toBeNull();
    expect(result!.l).toBe(0);
  });

  it("hexToHsl returns null for invalid hex", () => {
    const result = hexToHsl("invalid");
    expect(result).toBeNull();
  });

  // ---- Format helpers ----

  it("hslToHex converts hsl to hex string starting with #", () => {
    const hex = hslToHex(0, 100, 50);
    expect(hex).toMatch(/^#[0-9a-f]{6}$/i);
    expect(hex.toLowerCase()).toBe("#ff0000");
  });

  it("hslToRgb converts hsl to rgb string", () => {
    const rgb = hslToRgb(0, 100, 50);
    expect(rgb).toBe("rgb(255, 0, 0)");
  });

  it("hslToHslString converts hsl to hsl css string", () => {
    const hsl = hslToHslString(120, 50, 50);
    expect(hsl).toBe("hsl(120, 50%, 50%)");
  });

  it("_formatValue returns hex by default", async () => {
    await el.updateComplete;
    el._h = 0;
    el._s = 100;
    el._l = 50;
    el.format = "hex";
    const val = el._formatValue();
    expect(val).toMatch(/^#/);
  });

  it("_formatValue returns rgb string when format=rgb", async () => {
    await el.updateComplete;
    el._h = 0;
    el._s = 100;
    el._l = 50;
    el.format = "rgb";
    const val = el._formatValue();
    expect(val).toMatch(/^rgb\(/);
  });

  it("_formatValue returns hsl string when format=hsl", async () => {
    await el.updateComplete;
    el._h = 120;
    el._s = 50;
    el._l = 50;
    el.format = "hsl";
    const val = el._formatValue();
    expect(val).toMatch(/^hsl\(/);
  });

  // ---- Swatches ----

  it("swatches prop renders swatch buttons", async () => {
    el.swatches = "#ff0000,#00ff00,#0000ff";
    el._open = true;
    await el.updateComplete;
    const swatches = el.shadowRoot?.querySelectorAll(".sp-color-picker-swatch");
    expect(swatches?.length).toBe(3);
  });

  it("swatch click selects color and emits sp-change", async () => {
    el.swatches = "#ff0000,#00ff00";
    el._open = true;
    await el.updateComplete;
    const listener = vi.fn();
    el.addEventListener("sp-change", listener);
    const swatch = el.shadowRoot?.querySelector(".sp-color-picker-swatch") as HTMLButtonElement;
    swatch.click();
    expect(listener).toHaveBeenCalledOnce();
    expect((listener.mock.calls[0]?.[0] as CustomEvent<{ value: string }>).detail.value).toBe("#ff0000");
  });

  // ---- Disabled ----

  it("disabled prevents opening panel", async () => {
    el.disabled = true;
    await el.updateComplete;
    el._toggle();
    await el.updateComplete;
    expect(el._open).toBe(false);
  });

  // ---- Hue slider ----

  it("hue slider input updates _h value", async () => {
    el._open = true;
    await el.updateComplete;
    const slider = el.shadowRoot?.querySelector(".sp-color-picker-hue") as HTMLInputElement;
    expect(slider).not.toBeNull();
    slider.value = "180";
    slider.dispatchEvent(new Event("input", { bubbles: true }));
    expect(el._h).toBe(180);
  });

  // ---- Form participation ----

  it("participates in form — value appears in FormData", async () => {
    const form = document.createElement("form");
    document.body.appendChild(form);
    const picker = document.createElement("sp-color-picker") as SpColorPickerComponent;
    picker.setAttribute("name", "color");
    form.appendChild(picker);
    await picker.updateComplete;
    picker.value = "#ff0000";
    await picker.updateComplete;
    const data = new FormData(form);
    expect(data.get("color")).toBe("#ff0000");
  });

  it("formResetCallback resets value to #000000", async () => {
    el.value = "#ff0000";
    await el.updateComplete;
    (el as unknown as { formResetCallback(): void }).formResetCallback();
    await el.updateComplete;
    expect(el.value).toBe("#000000");
  });

  // ---- Show alpha ----

  it("showAlpha=true renders alpha slider when panel is open", async () => {
    el.showAlpha = true;
    el._open = true;
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-color-picker-alpha")).not.toBeNull();
  });

  it("showAlpha=false does not render alpha slider", async () => {
    el.showAlpha = false;
    el._open = true;
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-color-picker-alpha")).toBeNull();
  });
});
