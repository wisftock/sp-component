import { describe, it, expect, beforeEach, vi } from "vitest";
import "./sp-checkbox.js";
import type { SpCheckboxComponent } from "./sp-checkbox.js";

function createElement(): SpCheckboxComponent {
  const el = document.createElement("sp-checkbox") as SpCheckboxComponent;
  document.body.appendChild(el);
  return el;
}

describe("sp-checkbox", () => {
  let el: SpCheckboxComponent;

  beforeEach(() => {
    document.body.innerHTML = "";
    el = createElement();
  });

  // ---- Rendering ----

  it("renders a label element in shadow DOM", async () => {
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector("label")).not.toBeNull();
  });

  it("renders an input[type=checkbox] in shadow DOM", async () => {
    await el.updateComplete;
    const input = el.shadowRoot?.querySelector("input[type='checkbox']");
    expect(input).not.toBeNull();
  });

  // ---- Default props ----

  it("is not checked by default", async () => {
    await el.updateComplete;
    expect(el.checked).toBe(false);
    expect(el.hasAttribute("checked")).toBe(false);
  });

  it("is not indeterminate by default", async () => {
    await el.updateComplete;
    expect(el.indeterminate).toBe(false);
    expect(el.hasAttribute("indeterminate")).toBe(false);
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

  it("reflects indeterminate attribute when set", async () => {
    el.indeterminate = true;
    await el.updateComplete;
    expect(el.hasAttribute("indeterminate")).toBe(true);
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

  it("adds sp-checkbox-control--checked class when checked", async () => {
    el.checked = true;
    await el.updateComplete;
    const control = el.shadowRoot?.querySelector(".sp-checkbox-control");
    expect(control?.classList.contains("sp-checkbox-control--checked")).toBe(true);
  });

  it("adds sp-checkbox-control--indeterminate class when indeterminate", async () => {
    el.indeterminate = true;
    await el.updateComplete;
    const control = el.shadowRoot?.querySelector(".sp-checkbox-control");
    expect(control?.classList.contains("sp-checkbox-control--indeterminate")).toBe(true);
  });

  it("adds sp-checkbox-label--disabled class when disabled", async () => {
    el.disabled = true;
    await el.updateComplete;
    const label = el.shadowRoot?.querySelector(".sp-checkbox-label");
    expect(label?.classList.contains("sp-checkbox-label--disabled")).toBe(true);
  });

  // ---- SVG icons ----

  it("shows checkmark SVG when checked and not indeterminate", async () => {
    el.checked = true;
    el.indeterminate = false;
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector("svg")).not.toBeNull();
  });

  it("does not show SVG when unchecked and not indeterminate", async () => {
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector("svg")).toBeNull();
  });

  it("shows minus SVG when indeterminate", async () => {
    el.indeterminate = true;
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector("svg")).not.toBeNull();
  });

  // ---- Label / slot ----

  it("shows sp-checkbox-text span when label prop is set", async () => {
    el.label = "Accept terms";
    await el.updateComplete;
    const text = el.shadowRoot?.querySelector(".sp-checkbox-text");
    expect(text?.textContent).toBe("Accept terms");
  });

  it("shows slot when label prop is empty", async () => {
    el.label = "";
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector("slot")).not.toBeNull();
  });

  // ---- Error / hint ----

  it("shows error message when error prop is set", async () => {
    el.error = "This field is required";
    await el.updateComplete;
    const err = el.shadowRoot?.querySelector(".sp-checkbox-error");
    expect(err?.textContent).toBe("This field is required");
  });

  it("shows hint message when hint prop is set and no error", async () => {
    el.hint = "Select at least one option";
    await el.updateComplete;
    const hint = el.shadowRoot?.querySelector(".sp-checkbox-hint");
    expect(hint?.textContent).toBe("Select at least one option");
  });

  it("does not show hint when error is also set", async () => {
    el.error = "Error!";
    el.hint = "Some hint";
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-checkbox-hint")).toBeNull();
  });

  // ---- sp-change event ----

  it("emits sp-change with checked detail when input changes", async () => {
    await el.updateComplete;
    const listener = vi.fn();
    el.addEventListener("sp-change", listener);

    const input = el.shadowRoot?.querySelector("input") as HTMLInputElement;
    input.checked = true;
    input.dispatchEvent(new Event("change", { bubbles: true }));

    expect(listener).toHaveBeenCalledOnce();
    const event = listener.mock.calls[0][0] as CustomEvent<{ checked: boolean; indeterminate: boolean }>;
    expect(event.detail.checked).toBe(true);
    expect(event.detail.indeterminate).toBe(false);
  });

  it("updates checked property on sp-change", async () => {
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
