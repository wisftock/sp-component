import { describe, it, expect, beforeEach, vi } from "vitest";
import "./sp-textarea.js";
import type { SpTextareaComponent } from "./sp-textarea.js";

function createElement(): SpTextareaComponent {
  const el = document.createElement("sp-textarea") as SpTextareaComponent;
  document.body.appendChild(el);
  return el;
}

describe("sp-textarea", () => {
  let el: SpTextareaComponent;

  beforeEach(() => {
    document.body.innerHTML = "";
    el = createElement();
  });

  // ---- Rendering ----

  it("renders textarea element in shadow DOM", async () => {
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector("textarea")).not.toBeNull();
  });

  // ---- Attribute reflection ----

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

  it("reflects resize attribute (default vertical)", async () => {
    await el.updateComplete;
    expect(el.getAttribute("resize")).toBe("vertical");
  });

  // ---- Events ----

  it("emits sp-input on keystroke", async () => {
    await el.updateComplete;
    const listener = vi.fn();
    el.addEventListener("sp-input", listener);
    const textarea = el.shadowRoot?.querySelector("textarea") as HTMLTextAreaElement;
    textarea.value = "hello";
    textarea.dispatchEvent(new Event("input", { bubbles: true, composed: true }));
    expect(listener).toHaveBeenCalledOnce();
    expect((listener.mock.calls[0]?.[0] as CustomEvent<{ value: string }>).detail).toEqual({ value: "hello" });
  });

  it("emits sp-change on change", async () => {
    await el.updateComplete;
    const listener = vi.fn();
    el.addEventListener("sp-change", listener);
    const textarea = el.shadowRoot?.querySelector("textarea") as HTMLTextAreaElement;
    textarea.value = "world";
    textarea.dispatchEvent(new Event("change", { bubbles: true, composed: true }));
    expect(listener).toHaveBeenCalledOnce();
    expect((listener.mock.calls[0]?.[0] as CustomEvent<{ value: string }>).detail).toEqual({ value: "world" });
  });

  it("emits sp-focus", async () => {
    await el.updateComplete;
    const listener = vi.fn();
    el.addEventListener("sp-focus", listener);
    const textarea = el.shadowRoot?.querySelector("textarea") as HTMLTextAreaElement;
    textarea.dispatchEvent(new Event("focus", { bubbles: true, composed: true }));
    expect(listener).toHaveBeenCalledOnce();
  });

  it("emits sp-blur", async () => {
    await el.updateComplete;
    const listener = vi.fn();
    el.addEventListener("sp-blur", listener);
    const textarea = el.shadowRoot?.querySelector("textarea") as HTMLTextAreaElement;
    textarea.dispatchEvent(new Event("blur", { bubbles: true, composed: true }));
    expect(listener).toHaveBeenCalledOnce();
  });

  // ---- Character count ----

  it("shows character count when maxlength > 0", async () => {
    el.maxlength = 200;
    el.value = "hello";
    await el.updateComplete;
    const countEl = el.shadowRoot?.querySelector(".sp-textarea-count");
    expect(countEl).not.toBeNull();
    expect(countEl?.textContent).toContain("5");
    expect(countEl?.textContent).toContain("200");
  });

  it("does NOT show char count when maxlength = 0", async () => {
    el.maxlength = 0;
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-textarea-count")).toBeNull();
  });

  // ---- Error & hint ----

  it("shows error when error prop is set", async () => {
    el.error = "This field is required";
    await el.updateComplete;
    const errorEl = el.shadowRoot?.querySelector(".sp-textarea-error");
    expect(errorEl).not.toBeNull();
    expect(errorEl?.textContent).toBe("This field is required");
  });

  it("shows hint when hint is set and no error", async () => {
    el.hint = "Maximum 500 characters";
    await el.updateComplete;
    const hintEl = el.shadowRoot?.querySelector(".sp-textarea-hint");
    expect(hintEl).not.toBeNull();
    expect(hintEl?.textContent).toBe("Maximum 500 characters");
  });

  it("does not show hint when error is also set", async () => {
    el.hint = "Some hint";
    el.error = "Some error";
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-textarea-hint")).toBeNull();
    expect(el.shadowRoot?.querySelector(".sp-textarea-error")).not.toBeNull();
  });

  // ---- Form participation ----

  it("participates in form — value appears in FormData", async () => {
    const form = document.createElement("form");
    document.body.appendChild(form);
    const input = document.createElement("sp-textarea") as SpTextareaComponent;
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
    (el as unknown as { formResetCallback(): void }).formResetCallback();
    await el.updateComplete;
    expect(el.value).toBe("");
  });
});
