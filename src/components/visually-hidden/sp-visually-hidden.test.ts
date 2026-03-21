import { describe, it, expect, beforeEach } from "vitest";
import "./sp-visually-hidden.js";
import type { SpVisuallyHiddenComponent } from "./sp-visually-hidden.js";

function createElement(): SpVisuallyHiddenComponent {
  const el = document.createElement("sp-visually-hidden") as SpVisuallyHiddenComponent;
  document.body.appendChild(el);
  return el;
}

describe("sp-visually-hidden", () => {
  let el: SpVisuallyHiddenComponent;

  beforeEach(() => {
    document.body.innerHTML = "";
    el = createElement();
  });

  it("renders slot content", async () => {
    el.innerHTML = "Hidden text";
    await el.updateComplete;
    const slot = el.shadowRoot?.querySelector("slot");
    expect(slot).not.toBeNull();
    expect(el.textContent).toBe("Hidden text");
  });

  it("reflects focusable attribute", async () => {
    el.focusable = true;
    await el.updateComplete;
    expect(el.hasAttribute("focusable")).toBe(true);
  });

  it("is focusable false by default", async () => {
    await el.updateComplete;
    expect(el.focusable).toBe(false);
    expect(el.hasAttribute("focusable")).toBe(false);
  });

  it("renders a slot in shadow DOM", async () => {
    await el.updateComplete;
    const slot = el.shadowRoot?.querySelector("slot");
    expect(slot).not.toBeNull();
  });
});
