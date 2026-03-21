import { describe, it, expect, beforeEach, vi } from "vitest";
import "./sp-select.js";
import type { SpSelectComponent } from "./sp-select.js";

const DEFAULT_OPTIONS = [
  { value: "a", label: "Option A" },
  { value: "b", label: "Option B" },
  { value: "c", label: "Option C" },
];

function createElement(): SpSelectComponent {
  const el = document.createElement("sp-select") as SpSelectComponent;
  document.body.appendChild(el);
  return el;
}

describe("sp-select", () => {
  let el: SpSelectComponent;

  beforeEach(() => {
    document.body.innerHTML = "";
    el = createElement();
  });

  // ---- Rendering ----

  it("renders select element in shadow DOM", async () => {
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector("select")).not.toBeNull();
  });

  // ---- Attribute reflection ----

  it("reflects disabled attribute", async () => {
    el.disabled = true;
    await el.updateComplete;
    expect(el.hasAttribute("disabled")).toBe(true);
  });

  it("reflects size attribute (default md)", async () => {
    await el.updateComplete;
    expect(el.getAttribute("size")).toBe("md");
  });

  // ---- Placeholder ----

  it("renders placeholder option when placeholder is set", async () => {
    el.placeholder = "Select an option";
    await el.updateComplete;
    const select = el.shadowRoot?.querySelector("select");
    const placeholderOption = select?.querySelector("option[value='']");
    expect(placeholderOption).not.toBeNull();
    expect(placeholderOption?.textContent).toBe("Select an option");
  });

  // ---- Options ----

  it("renders options from options property", async () => {
    el.options = DEFAULT_OPTIONS;
    await el.updateComplete;
    const select = el.shadowRoot?.querySelector("select");
    const options = select?.querySelectorAll("option:not([value=''])");
    expect(options?.length).toBe(3);
    expect(options?.[0]?.getAttribute("value")).toBe("a");
    expect(options?.[1]?.getAttribute("value")).toBe("b");
    expect(options?.[2]?.getAttribute("value")).toBe("c");
  });

  // ---- Events ----

  it("emits sp-change with value on change", async () => {
    el.options = DEFAULT_OPTIONS;
    await el.updateComplete;
    const listener = vi.fn();
    el.addEventListener("sp-change", listener);
    const select = el.shadowRoot?.querySelector("select") as HTMLSelectElement;
    select.value = "b";
    select.dispatchEvent(new Event("change", { bubbles: true, composed: true }));
    expect(listener).toHaveBeenCalledOnce();
    expect((listener.mock.calls[0]?.[0] as CustomEvent<{ value: string }>).detail).toEqual({ value: "b" });
  });

  it("emits sp-focus", async () => {
    await el.updateComplete;
    const listener = vi.fn();
    el.addEventListener("sp-focus", listener);
    const select = el.shadowRoot?.querySelector("select") as HTMLSelectElement;
    select.dispatchEvent(new Event("focus", { bubbles: true, composed: true }));
    expect(listener).toHaveBeenCalledOnce();
  });

  it("emits sp-blur", async () => {
    await el.updateComplete;
    const listener = vi.fn();
    el.addEventListener("sp-blur", listener);
    const select = el.shadowRoot?.querySelector("select") as HTMLSelectElement;
    select.dispatchEvent(new Event("blur", { bubbles: true, composed: true }));
    expect(listener).toHaveBeenCalledOnce();
  });

  // ---- Error & hint ----

  it("shows error when error prop is set", async () => {
    el.error = "Please select an option";
    await el.updateComplete;
    const errorEl = el.shadowRoot?.querySelector(".sp-select-error");
    expect(errorEl).not.toBeNull();
    expect(errorEl?.textContent).toBe("Please select an option");
  });

  it("shows hint when hint is set and no error", async () => {
    el.hint = "Choose the best option for you";
    await el.updateComplete;
    const hintEl = el.shadowRoot?.querySelector(".sp-select-hint");
    expect(hintEl).not.toBeNull();
    expect(hintEl?.textContent).toBe("Choose the best option for you");
  });

  it("does not show hint when error is also set", async () => {
    el.hint = "Some hint";
    el.error = "Some error";
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-select-hint")).toBeNull();
    expect(el.shadowRoot?.querySelector(".sp-select-error")).not.toBeNull();
  });

  // ---- Label ----

  it("shows label when label prop is set", async () => {
    el.label = "Country";
    await el.updateComplete;
    const labelEl = el.shadowRoot?.querySelector(".sp-select-label");
    expect(labelEl).not.toBeNull();
    expect(labelEl?.textContent?.trim()).toContain("Country");
  });
});
