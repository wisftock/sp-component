import { describe, it, expect, beforeEach } from "vitest";
import "./sp-badge.js";
import type { SpBadgeComponent } from "./sp-badge.js";

function createElement(): SpBadgeComponent {
  const el = document.createElement("sp-badge") as SpBadgeComponent;
  document.body.appendChild(el);
  return el;
}

describe("sp-badge", () => {
  let el: SpBadgeComponent;

  beforeEach(() => {
    document.body.innerHTML = "";
    el = createElement();
  });

  // ---- Rendering ----

  it("renders a .sp-badge span in shadow DOM", async () => {
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-badge")).not.toBeNull();
  });

  // ---- Default props ----

  it("has default variant of 'primary'", async () => {
    await el.updateComplete;
    expect(el.getAttribute("variant")).toBe("primary");
  });

  it("is not pill by default", async () => {
    await el.updateComplete;
    expect(el.hasAttribute("pill")).toBe(false);
  });

  it("is not pulsing by default", async () => {
    await el.updateComplete;
    expect(el.hasAttribute("pulsing")).toBe(false);
  });

  // ---- Variant reflection ----

  it("reflects variant attribute when changed", async () => {
    el.variant = "success";
    await el.updateComplete;
    expect(el.getAttribute("variant")).toBe("success");
  });

  it("reflects all 6 variant values", async () => {
    const variants = ["primary", "secondary", "success", "warning", "danger", "neutral"] as const;
    for (const v of variants) {
      el.variant = v;
      await el.updateComplete;
      expect(el.getAttribute("variant")).toBe(v);
    }
  });

  // ---- Pill reflection ----

  it("reflects pill attribute when set to true", async () => {
    el.pill = true;
    await el.updateComplete;
    expect(el.hasAttribute("pill")).toBe(true);
  });

  // ---- Pulsing reflection ----

  it("reflects pulsing attribute when set to true", async () => {
    el.pulsing = true;
    await el.updateComplete;
    expect(el.hasAttribute("pulsing")).toBe(true);
  });

  // ---- Slot ----

  it("renders slot content", async () => {
    el.textContent = "New";
    await el.updateComplete;
    expect(el.textContent).toBe("New");
  });
});
