import { describe, it, expect, beforeEach, vi } from "vitest";
import "./sp-slider.js";
import type { SpSliderComponent } from "./sp-slider.js";

function createElement(): SpSliderComponent {
  const el = document.createElement("sp-slider") as SpSliderComponent;
  document.body.appendChild(el);
  return el;
}

describe("sp-slider", () => {
  let el: SpSliderComponent;

  beforeEach(() => {
    document.body.innerHTML = "";
    el = createElement();
  });

  it("renders an input[type=range] in shadow DOM", async () => {
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector("input[type=range]")).not.toBeNull();
  });

  it("has default value of 0", async () => {
    await el.updateComplete;
    expect(el.value).toBe(0);
  });

  it("reflects disabled attribute when set", async () => {
    el.disabled = true;
    await el.updateComplete;
    expect(el.hasAttribute("disabled")).toBe(true);
  });

  it("reflects size attribute when set", async () => {
    el.size = "lg";
    await el.updateComplete;
    expect(el.getAttribute("size")).toBe("lg");
  });

  it("has default size of md", async () => {
    await el.updateComplete;
    expect(el.getAttribute("size")).toBe("md");
  });

  it("computes percentage correctly", async () => {
    el.min = 0;
    el.max = 100;
    el.value = 50;
    await el.updateComplete;
    expect(el.percentage).toBe(50);
  });

  it("computes percentage at min boundary", async () => {
    el.min = 0;
    el.max = 100;
    el.value = 0;
    await el.updateComplete;
    expect(el.percentage).toBe(0);
  });

  it("computes percentage at max boundary", async () => {
    el.min = 0;
    el.max = 100;
    el.value = 100;
    await el.updateComplete;
    expect(el.percentage).toBe(100);
  });

  it("fill width matches percentage", async () => {
    el.min = 0;
    el.max = 200;
    el.value = 100;
    await el.updateComplete;
    const fill = el.shadowRoot?.querySelector<HTMLElement>(".sp-slider-fill");
    expect(fill?.style.width).toBe("50%");
  });

  it("emits sp-input event with value on input", async () => {
    await el.updateComplete;
    const listener = vi.fn();
    el.addEventListener("sp-input", listener);
    const input = el.shadowRoot?.querySelector<HTMLInputElement>("input[type=range]")!;
    input.value = "42";
    input.dispatchEvent(new Event("input", { bubbles: true, composed: true }));
    expect(listener).toHaveBeenCalledOnce();
    expect((listener.mock.calls[0]![0] as CustomEvent).detail).toEqual({ value: 42 });
  });

  it("emits sp-change event with value on change", async () => {
    await el.updateComplete;
    const listener = vi.fn();
    el.addEventListener("sp-change", listener);
    const input = el.shadowRoot?.querySelector<HTMLInputElement>("input[type=range]")!;
    input.value = "75";
    input.dispatchEvent(new Event("change", { bubbles: true, composed: true }));
    expect(listener).toHaveBeenCalledOnce();
    expect((listener.mock.calls[0]![0] as CustomEvent).detail).toEqual({ value: 75 });
  });

  it("shows label when label prop is set", async () => {
    el.label = "Volume";
    await el.updateComplete;
    const label = el.shadowRoot?.querySelector(".sp-slider-label");
    expect(label?.textContent?.trim()).toBe("Volume");
  });

  it("shows value when showValue is true", async () => {
    el.showValue = true;
    el.value = 33;
    await el.updateComplete;
    const valueEl = el.shadowRoot?.querySelector(".sp-slider-value");
    expect(valueEl).not.toBeNull();
    expect(valueEl?.textContent?.trim()).toBe("33");
  });

  it("does not show value display when showValue is false", async () => {
    el.showValue = false;
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-slider-value")).toBeNull();
  });

  it("shows error message", async () => {
    el.error = "Value out of range";
    await el.updateComplete;
    const errorEl = el.shadowRoot?.querySelector(".sp-slider-error");
    expect(errorEl?.textContent?.trim()).toBe("Value out of range");
  });

  it("shows hint message", async () => {
    el.hint = "Drag to adjust";
    await el.updateComplete;
    const hintEl = el.shadowRoot?.querySelector(".sp-slider-hint");
    expect(hintEl?.textContent?.trim()).toBe("Drag to adjust");
  });

  it("does not show hint when error is also set", async () => {
    el.error = "Error";
    el.hint = "Hint";
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-slider-hint")).toBeNull();
    expect(el.shadowRoot?.querySelector(".sp-slider-error")).not.toBeNull();
  });

  it("input is disabled when disabled prop is set", async () => {
    el.disabled = true;
    await el.updateComplete;
    const input = el.shadowRoot?.querySelector<HTMLInputElement>("input[type=range]");
    expect(input?.disabled).toBe(true);
  });
});
