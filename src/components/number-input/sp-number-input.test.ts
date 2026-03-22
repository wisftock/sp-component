import { describe, it, expect, beforeEach, vi } from "vitest";
import "./sp-number-input.js";
import type { SpNumberInputComponent } from "./sp-number-input.js";

function createElement(): SpNumberInputComponent {
  const el = document.createElement("sp-number-input") as SpNumberInputComponent;
  document.body.appendChild(el);
  return el;
}

describe("sp-number-input", () => {
  let el: SpNumberInputComponent;

  beforeEach(() => {
    document.body.innerHTML = "";
    el = createElement();
  });

  // ---- Rendering ----

  it("renders in shadow DOM", async () => {
    await el.updateComplete;
    expect(el.shadowRoot).not.toBeNull();
    expect(el.shadowRoot?.querySelector(".sp-number-input")).not.toBeNull();
  });

  it("renders the input field in shadow DOM", async () => {
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-number-input-field")).not.toBeNull();
  });

  it("renders increment and decrement buttons", async () => {
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-number-input-btn--dec")).not.toBeNull();
    expect(el.shadowRoot?.querySelector(".sp-number-input-btn--inc")).not.toBeNull();
  });

  // ---- Default values ----

  it("default value is 0", async () => {
    await el.updateComplete;
    expect(el.value).toBe(0);
  });

  it("reflects default size attribute as md", async () => {
    await el.updateComplete;
    expect(el.getAttribute("size")).toBe("md");
  });

  it("default step is 1", async () => {
    await el.updateComplete;
    expect(el.step).toBe(1);
  });

  // ---- Increment / decrement ----

  it("increment increases value by step", async () => {
    el.value = 5;
    await el.updateComplete;
    el._increment();
    await el.updateComplete;
    expect(el.value).toBe(6);
  });

  it("decrement decreases value by step", async () => {
    el.value = 5;
    await el.updateComplete;
    el._decrement();
    await el.updateComplete;
    expect(el.value).toBe(4);
  });

  it("increment clamps to max", async () => {
    el.value = 9;
    el.max = 10;
    await el.updateComplete;
    el._increment();
    el._increment();
    await el.updateComplete;
    expect(el.value).toBe(10);
  });

  it("decrement clamps to min", async () => {
    el.value = 1;
    el.min = 0;
    await el.updateComplete;
    el._decrement();
    el._decrement();
    await el.updateComplete;
    expect(el.value).toBe(0);
  });

  it("increment uses custom step", async () => {
    el.value = 0;
    el.step = 5;
    await el.updateComplete;
    el._increment();
    await el.updateComplete;
    expect(el.value).toBe(5);
  });

  // ---- Disabled ----

  it("disabled prevents increment", async () => {
    el.value = 5;
    el.disabled = true;
    await el.updateComplete;
    el._increment();
    await el.updateComplete;
    expect(el.value).toBe(5);
  });

  it("disabled prevents decrement", async () => {
    el.value = 5;
    el.disabled = true;
    await el.updateComplete;
    el._decrement();
    await el.updateComplete;
    expect(el.value).toBe(5);
  });

  // ---- Events ----

  it("emits sp-input on input event", async () => {
    await el.updateComplete;
    const listener = vi.fn();
    el.addEventListener("sp-input", listener);
    const input = el.shadowRoot?.querySelector(".sp-number-input-field") as HTMLInputElement;
    input.value = "7";
    input.dispatchEvent(new Event("input", { bubbles: true, composed: true }));
    expect(listener).toHaveBeenCalledOnce();
  });

  it("emits sp-change on change event", async () => {
    await el.updateComplete;
    const listener = vi.fn();
    el.addEventListener("sp-change", listener);
    const input = el.shadowRoot?.querySelector(".sp-number-input-field") as HTMLInputElement;
    input.value = "3";
    input.dispatchEvent(new Event("change", { bubbles: true, composed: true }));
    expect(listener).toHaveBeenCalledOnce();
  });

  it("emits sp-change with value detail when incrementing", async () => {
    el.value = 2;
    await el.updateComplete;
    let detail: { value: number } | null = null;
    el.addEventListener("sp-change", (e) => {
      detail = (e as CustomEvent<{ value: number }>).detail;
    });
    el._increment();
    expect(detail).toEqual({ value: 3 });
  });

  it("emits sp-change with value detail when decrementing", async () => {
    el.value = 5;
    await el.updateComplete;
    let detail: { value: number } | null = null;
    el.addEventListener("sp-change", (e) => {
      detail = (e as CustomEvent<{ value: number }>).detail;
    });
    el._decrement();
    expect(detail).toEqual({ value: 4 });
  });

  // ---- Label / error / hint ----

  it("shows label when set", async () => {
    el.label = "Quantity";
    await el.updateComplete;
    const label = el.shadowRoot?.querySelector(".sp-number-input-label");
    expect(label).not.toBeNull();
    expect(label?.textContent?.trim()).toBe("Quantity");
  });

  it("does not render label when not set", async () => {
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-number-input-label")).toBeNull();
  });

  it("shows error message when set", async () => {
    el.error = "Value too large";
    await el.updateComplete;
    const errorEl = el.shadowRoot?.querySelector(".sp-number-input-error");
    expect(errorEl).not.toBeNull();
    expect(errorEl?.textContent?.trim()).toBe("Value too large");
  });

  it("shows hint when set and no error", async () => {
    el.hint = "Enter a number between 1 and 100";
    await el.updateComplete;
    const hintEl = el.shadowRoot?.querySelector(".sp-number-input-hint");
    expect(hintEl).not.toBeNull();
    expect(hintEl?.textContent?.trim()).toBe("Enter a number between 1 and 100");
  });

  it("shows error instead of hint when both are set", async () => {
    el.hint = "Hint text";
    el.error = "Error text";
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-number-input-error")).not.toBeNull();
    expect(el.shadowRoot?.querySelector(".sp-number-input-hint")).toBeNull();
  });

  // ---- Form participation ----

  it("form participation — value in FormData", async () => {
    el.name = "qty";
    el.value = 42;
    await el.updateComplete;
    const form = document.createElement("form");
    form.appendChild(el);
    document.body.appendChild(form);
    const fd = new FormData(form);
    expect(fd.get("qty")).toBe("42");
  });

  it("formResetCallback resets value", async () => {
    el.value = 10;
    await el.updateComplete;
    (el as unknown as { formResetCallback: () => void }).formResetCallback();
    await el.updateComplete;
    expect(el.value).toBe(0);
  });
});
