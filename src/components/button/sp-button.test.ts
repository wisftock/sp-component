import { describe, it, expect, beforeEach, vi } from "vitest";
import "./sp-button.js";
import type { SpButtonComponent } from "./sp-button.js";

function createElement(): SpButtonComponent {
  const el = document.createElement("sp-button") as SpButtonComponent;
  document.body.appendChild(el);
  return el;
}

describe("sp-button", () => {
  let el: SpButtonComponent;

  beforeEach(() => {
    document.body.innerHTML = "";
    el = createElement();
  });

  it("renders a button element in shadow DOM", async () => {
    await el.updateComplete;
    const btn = el.shadowRoot?.querySelector("button");
    expect(btn).not.toBeNull();
  });

  it("reflects default variant attribute", async () => {
    await el.updateComplete;
    expect(el.getAttribute("variant")).toBe("primary");
  });

  it("reflects custom variant attribute", async () => {
    el.variant = "destructive";
    await el.updateComplete;
    expect(el.getAttribute("variant")).toBe("destructive");
  });

  it("reflects default size attribute", async () => {
    await el.updateComplete;
    expect(el.getAttribute("size")).toBe("md");
  });

  it("is not disabled by default", async () => {
    await el.updateComplete;
    expect(el.disabled).toBe(false);
    expect(el.hasAttribute("disabled")).toBe(false);
  });

  it("reflects disabled attribute when set", async () => {
    el.disabled = true;
    await el.updateComplete;
    expect(el.hasAttribute("disabled")).toBe(true);
  });

  it("emits sp-click event when clicked", async () => {
    await el.updateComplete;
    const listener = vi.fn();
    el.addEventListener("sp-click", listener);
    el.click();
    expect(listener).toHaveBeenCalledOnce();
  });

  it("emits sp-click detail with source", async () => {
    await el.updateComplete;
    let detail: { source: string } | null = null;
    el.addEventListener("sp-click", (e) => {
      detail = (e as CustomEvent<{ source: string }>).detail;
    });
    el.click();
    expect(detail).toEqual({ source: "sp-button" });
  });

  it("does NOT emit sp-click when disabled", async () => {
    el.disabled = true;
    await el.updateComplete;
    const listener = vi.fn();
    el.addEventListener("sp-click", listener);
    el.click();
    expect(listener).not.toHaveBeenCalled();
  });

  it("renders slot content", async () => {
    el.innerHTML = "Guardar";
    await el.updateComplete;
    expect(el.textContent).toBe("Guardar");
  });
});
