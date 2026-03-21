import { describe, it, expect, beforeEach, vi } from "vitest";
import "./sp-input.js";
import type { SpInputComponent } from "./sp-input.js";

function createElement(): SpInputComponent {
  const el = document.createElement("sp-input") as SpInputComponent;
  document.body.appendChild(el);
  return el;
}

describe("sp-input", () => {
  let el: SpInputComponent;

  beforeEach(() => {
    document.body.innerHTML = "";
    el = createElement();
  });

  // ---- Rendering ----

  it("renders input element in shadow DOM", async () => {
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector("input")).not.toBeNull();
  });

  it("default type is text", async () => {
    await el.updateComplete;
    expect(el.type).toBe("text");
    const input = el.shadowRoot?.querySelector("input");
    expect(input?.getAttribute("type")).toBe("text");
  });

  // ---- Attribute reflection ----

  it("reflects size attribute (default md)", async () => {
    await el.updateComplete;
    expect(el.getAttribute("size")).toBe("md");
  });

  it("reflects disabled attribute", async () => {
    el.disabled = true;
    await el.updateComplete;
    expect(el.hasAttribute("disabled")).toBe(true);
  });

  it("reflects readonly attribute", async () => {
    el.readonly = true;
    await el.updateComplete;
    expect(el.hasAttribute("readonly")).toBe(true);
  });

  // ---- Events ----

  it("emits sp-input event with value on input", async () => {
    await el.updateComplete;
    const listener = vi.fn();
    el.addEventListener("sp-input", listener);
    const input = el.shadowRoot?.querySelector("input") as HTMLInputElement;
    input.value = "hello";
    input.dispatchEvent(new Event("input", { bubbles: true, composed: true }));
    expect(listener).toHaveBeenCalledOnce();
    expect((listener.mock.calls[0]?.[0] as CustomEvent<{ value: string }>).detail).toEqual({ value: "hello" });
  });

  it("emits sp-change event on change", async () => {
    await el.updateComplete;
    const listener = vi.fn();
    el.addEventListener("sp-change", listener);
    const input = el.shadowRoot?.querySelector("input") as HTMLInputElement;
    input.value = "world";
    input.dispatchEvent(new Event("change", { bubbles: true, composed: true }));
    expect(listener).toHaveBeenCalledOnce();
    expect((listener.mock.calls[0]?.[0] as CustomEvent<{ value: string }>).detail).toEqual({ value: "world" });
  });

  it("emits sp-focus on focus", async () => {
    await el.updateComplete;
    const listener = vi.fn();
    el.addEventListener("sp-focus", listener);
    const input = el.shadowRoot?.querySelector("input") as HTMLInputElement;
    input.dispatchEvent(new Event("focus", { bubbles: true, composed: true }));
    expect(listener).toHaveBeenCalledOnce();
  });

  it("emits sp-blur on blur", async () => {
    await el.updateComplete;
    const listener = vi.fn();
    el.addEventListener("sp-blur", listener);
    const input = el.shadowRoot?.querySelector("input") as HTMLInputElement;
    input.dispatchEvent(new Event("blur", { bubbles: true, composed: true }));
    expect(listener).toHaveBeenCalledOnce();
  });

  // ---- Clear button ----

  it("shows clear button when clearable=true and value is set", async () => {
    el.clearable = true;
    el.value = "some text";
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-input-clear")).not.toBeNull();
  });

  it("does NOT show clear button when clearable=true but value is empty", async () => {
    el.clearable = true;
    el.value = "";
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-input-clear")).toBeNull();
  });

  it("emits sp-clear when clear button clicked and clears value", async () => {
    el.clearable = true;
    el.value = "some text";
    await el.updateComplete;
    const clearListener = vi.fn();
    const inputListener = vi.fn();
    el.addEventListener("sp-clear", clearListener);
    el.addEventListener("sp-input", inputListener);
    const clearBtn = el.shadowRoot?.querySelector(".sp-input-clear") as HTMLButtonElement;
    clearBtn.click();
    expect(clearListener).toHaveBeenCalledOnce();
    expect(inputListener).toHaveBeenCalledOnce();
    expect(el.value).toBe("");
  });

  // ---- Error & hint ----

  it("shows error message when error prop is set", async () => {
    el.error = "This field is required";
    await el.updateComplete;
    const errorEl = el.shadowRoot?.querySelector(".sp-input-error");
    expect(errorEl).not.toBeNull();
    expect(errorEl?.textContent).toBe("This field is required");
  });

  it("shows hint when hint is set and no error", async () => {
    el.hint = "Enter your email address";
    await el.updateComplete;
    const hintEl = el.shadowRoot?.querySelector(".sp-input-hint");
    expect(hintEl).not.toBeNull();
    expect(hintEl?.textContent).toBe("Enter your email address");
  });

  it("does not show hint when error is also set", async () => {
    el.hint = "Some hint";
    el.error = "Some error";
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-input-hint")).toBeNull();
    expect(el.shadowRoot?.querySelector(".sp-input-error")).not.toBeNull();
  });

  // ---- Label ----

  it("shows label when label prop is set", async () => {
    el.label = "Email address";
    await el.updateComplete;
    const labelEl = el.shadowRoot?.querySelector(".sp-input-label");
    expect(labelEl).not.toBeNull();
    expect(labelEl?.textContent?.trim()).toContain("Email address");
  });

  // ---- Form participation ----

  it("participates in form — value appears in FormData", async () => {
    const form = document.createElement("form");
    document.body.appendChild(form);
    const input = document.createElement("sp-input") as SpInputComponent;
    input.setAttribute("name", "username");
    form.appendChild(input);
    await input.updateComplete;
    input.value = "hello";
    await input.updateComplete;
    const data = new FormData(form);
    expect(data.get("username")).toBe("hello");
  });

  it("participates in form — resets on form reset", async () => {
    el.value = "hello";
    await el.updateComplete;
    // Call formResetCallback directly (happy-dom doesn't fire form lifecycle callbacks)
    (el as unknown as { formResetCallback(): void }).formResetCallback();
    await el.updateComplete;
    expect(el.value).toBe("");
  });
});
