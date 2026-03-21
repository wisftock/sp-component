import { describe, it, expect, beforeEach, vi } from "vitest";
import "./sp-tag.js";
import type { SpTagComponent } from "./sp-tag.js";

function createElement(): SpTagComponent {
  const el = document.createElement("sp-tag") as SpTagComponent;
  document.body.appendChild(el);
  return el;
}

describe("sp-tag", () => {
  let el: SpTagComponent;

  beforeEach(() => {
    document.body.innerHTML = "";
    el = createElement();
  });

  // ---- Rendering ----

  it("renders a .sp-tag span in shadow DOM", async () => {
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-tag")).not.toBeNull();
  });

  // ---- Default props ----

  it("reflects default variant attribute as 'primary'", async () => {
    await el.updateComplete;
    expect(el.getAttribute("variant")).toBe("primary");
  });

  it("reflects default size attribute as 'md'", async () => {
    await el.updateComplete;
    expect(el.getAttribute("size")).toBe("md");
  });

  it("is not removable by default", async () => {
    await el.updateComplete;
    expect(el.hasAttribute("removable")).toBe(false);
  });

  it("is not disabled by default", async () => {
    await el.updateComplete;
    expect(el.hasAttribute("disabled")).toBe(false);
  });

  // ---- Variant reflection ----

  it("reflects variant attribute when changed", async () => {
    el.variant = "danger";
    await el.updateComplete;
    expect(el.getAttribute("variant")).toBe("danger");
  });

  // ---- Size reflection ----

  it("reflects size attribute when changed", async () => {
    el.size = "lg";
    await el.updateComplete;
    expect(el.getAttribute("size")).toBe("lg");
  });

  // ---- Disabled reflection ----

  it("reflects disabled attribute when set", async () => {
    el.disabled = true;
    await el.updateComplete;
    expect(el.hasAttribute("disabled")).toBe(true);
  });

  // ---- Removable ----

  it("shows remove button when removable is true and not disabled", async () => {
    el.removable = true;
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-tag-remove")).not.toBeNull();
  });

  it("does not show remove button when removable is false", async () => {
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-tag-remove")).toBeNull();
  });

  it("hides remove button when disabled even if removable is true", async () => {
    el.removable = true;
    el.disabled = true;
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-tag-remove")).toBeNull();
  });

  it("emits sp-remove event when remove button is clicked", async () => {
    el.removable = true;
    await el.updateComplete;
    const listener = vi.fn();
    el.addEventListener("sp-remove", listener);
    const btn = el.shadowRoot?.querySelector<HTMLButtonElement>(".sp-tag-remove");
    btn?.click();
    expect(listener).toHaveBeenCalledOnce();
  });

  // ---- Slot ----

  it("renders slot content", async () => {
    el.textContent = "JavaScript";
    await el.updateComplete;
    expect(el.textContent).toBe("JavaScript");
  });
});
