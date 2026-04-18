import { describe, it, expect, beforeEach, vi } from "vitest";
import "./sp-switch.js";
import type { SpSwitchComponent } from "./sp-switch.js";

function createElement(): SpSwitchComponent {
  const el = document.createElement("sp-switch") as SpSwitchComponent;
  document.body.appendChild(el);
  return el;
}

describe("sp-switch", () => {
  let el: SpSwitchComponent;

  beforeEach(() => {
    document.body.innerHTML = "";
    el = createElement();
  });

  // ---- Rendering ----

  it("renders a label element in shadow DOM", async () => {
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector("label")).not.toBeNull();
  });

  it("renders an input[type=checkbox] with role=switch", async () => {
    await el.updateComplete;
    const input = el.shadowRoot?.querySelector("input[type='checkbox'][role='switch']");
    expect(input).not.toBeNull();
  });

  it("renders the thumb element", async () => {
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-switch-thumb")).not.toBeNull();
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

  it("has default value of on", async () => {
    await el.updateComplete;
    expect(el.value).toBe("on");
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

  it("adds sp-switch-track--checked class when checked", async () => {
    el.checked = true;
    await el.updateComplete;
    const track = el.shadowRoot?.querySelector(".sp-switch-track");
    expect(track?.classList.contains("sp-switch-track--checked")).toBe(true);
  });

  it("does not add sp-switch-track--checked class when unchecked", async () => {
    await el.updateComplete;
    const track = el.shadowRoot?.querySelector(".sp-switch-track");
    expect(track?.classList.contains("sp-switch-track--checked")).toBe(false);
  });

  it("adds sp-switch-label--disabled class when disabled", async () => {
    el.disabled = true;
    await el.updateComplete;
    const label = el.shadowRoot?.querySelector(".sp-switch-label");
    expect(label?.classList.contains("sp-switch-label--disabled")).toBe(true);
  });

  // ---- Label / slot ----

  it("shows sp-switch-text span when label prop is set", async () => {
    el.label = "Enable notifications";
    await el.updateComplete;
    const text = el.shadowRoot?.querySelector(".sp-switch-text");
    expect(text?.textContent).toBe("Enable notifications");
  });

  it("shows slot when label prop is empty", async () => {
    el.label = "";
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector("slot")).not.toBeNull();
  });

  // ---- Hint ----

  it("shows hint when hint prop is set", async () => {
    el.hint = "This will send you emails";
    await el.updateComplete;
    const hint = el.shadowRoot?.querySelector(".sp-switch-hint");
    expect(hint?.textContent).toBe("This will send you emails");
  });

  it("does not show hint when hint prop is empty", async () => {
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-switch-hint")).toBeNull();
  });

  // ---- sp-change event ----

  it("emits sp-change with checked detail when toggled on", async () => {
    await el.updateComplete;
    const listener = vi.fn();
    el.addEventListener("sp-change", listener);

    const input = el.shadowRoot?.querySelector("input") as HTMLInputElement;
    input.checked = true;
    input.dispatchEvent(new Event("change", { bubbles: true }));

    expect(listener).toHaveBeenCalledOnce();
    const event = listener.mock.calls[0]![0] as CustomEvent<{ checked: boolean }>;
    expect(event.detail.checked).toBe(true);
  });

  it("emits sp-change with checked=false when toggled off", async () => {
    el.checked = true;
    await el.updateComplete;

    const listener = vi.fn();
    el.addEventListener("sp-change", listener);

    const input = el.shadowRoot?.querySelector("input") as HTMLInputElement;
    input.checked = false;
    input.dispatchEvent(new Event("change", { bubbles: true }));

    const event = listener.mock.calls[0]![0] as CustomEvent<{ checked: boolean }>;
    expect(event.detail.checked).toBe(false);
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
