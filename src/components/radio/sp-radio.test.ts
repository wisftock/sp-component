import { describe, it, expect, beforeEach, vi } from "vitest";
import "./sp-radio.js";
import type { SpRadioComponent } from "./sp-radio.js";

function createElement(): SpRadioComponent {
  const el = document.createElement("sp-radio") as SpRadioComponent;
  document.body.appendChild(el);
  return el;
}

describe("sp-radio", () => {
  let el: SpRadioComponent;

  beforeEach(() => {
    document.body.innerHTML = "";
    el = createElement();
  });

  // ---- Rendering ----

  it("renders a label element in shadow DOM", async () => {
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector("label")).not.toBeNull();
  });

  it("renders an input[type=radio] in shadow DOM", async () => {
    await el.updateComplete;
    const input = el.shadowRoot?.querySelector("input[type='radio']");
    expect(input).not.toBeNull();
  });

  // ---- Default props ----

  it("is not checked by default", async () => {
    await el.updateComplete;
    expect(el.checked).toBe(false);
    expect(el.hasAttribute("checked")).toBe(false);
  });

  it("is not disabled by default", async () => {
    await el.updateComplete;
    expect(el.disabled).toBe(false);
    expect(el.hasAttribute("disabled")).toBe(false);
  });

  it("reflects default size attribute as md", async () => {
    await el.updateComplete;
    expect(el.getAttribute("size")).toBe("md");
  });

  // ---- Reflection ----

  it("reflects checked attribute when set", async () => {
    el.checked = true;
    await el.updateComplete;
    expect(el.hasAttribute("checked")).toBe(true);
  });

  it("reflects disabled attribute when set", async () => {
    el.disabled = true;
    await el.updateComplete;
    expect(el.hasAttribute("disabled")).toBe(true);
  });

  it("reflects size attribute", async () => {
    el.size = "lg";
    await el.updateComplete;
    expect(el.getAttribute("size")).toBe("lg");
  });

  // ---- Classes ----

  it("adds sp-radio-control--checked class when checked", async () => {
    el.checked = true;
    await el.updateComplete;
    const control = el.shadowRoot?.querySelector(".sp-radio-control");
    expect(control?.classList.contains("sp-radio-control--checked")).toBe(true);
  });

  it("adds sp-radio-label--disabled class when disabled", async () => {
    el.disabled = true;
    await el.updateComplete;
    const label = el.shadowRoot?.querySelector(".sp-radio-label");
    expect(label?.classList.contains("sp-radio-label--disabled")).toBe(true);
  });

  // ---- Dot ----

  it("shows dot when checked", async () => {
    el.checked = true;
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-radio-dot")).not.toBeNull();
  });

  it("does not show dot when unchecked", async () => {
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-radio-dot")).toBeNull();
  });

  // ---- Label / slot ----

  it("shows sp-radio-text span when label prop is set", async () => {
    el.label = "Option A";
    await el.updateComplete;
    const text = el.shadowRoot?.querySelector(".sp-radio-text");
    expect(text?.textContent).toBe("Option A");
  });

  it("shows slot when label prop is empty", async () => {
    el.label = "";
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector("slot")).not.toBeNull();
  });

  // ---- sp-change event ----

  it("emits sp-change with value detail when input changes", async () => {
    el.value = "option-a";
    await el.updateComplete;

    const listener = vi.fn();
    el.addEventListener("sp-change", listener);

    const input = el.shadowRoot?.querySelector("input") as HTMLInputElement;
    input.checked = true;
    input.dispatchEvent(new Event("change", { bubbles: true }));

    expect(listener).toHaveBeenCalledOnce();
    const event = listener.mock.calls[0][0] as CustomEvent<{ value: string }>;
    expect(event.detail.value).toBe("option-a");
  });

  it("updates checked property when input changes", async () => {
    await el.updateComplete;
    const input = el.shadowRoot?.querySelector("input") as HTMLInputElement;
    input.checked = true;
    input.dispatchEvent(new Event("change", { bubbles: true }));
    expect(el.checked).toBe(true);
  });

  // ---- Sizes ----

  it("reflects size sm", async () => {
    el.size = "sm";
    await el.updateComplete;
    expect(el.getAttribute("size")).toBe("sm");
  });

  it("reflects size lg", async () => {
    el.size = "lg";
    await el.updateComplete;
    expect(el.getAttribute("size")).toBe("lg");
  });
});
