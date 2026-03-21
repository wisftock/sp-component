import { describe, it, expect, beforeEach } from "vitest";
import "./sp-card.js";
import type { SpCardComponent } from "./sp-card.js";

function createElement(): SpCardComponent {
  const el = document.createElement("sp-card") as SpCardComponent;
  document.body.appendChild(el);
  return el;
}

describe("sp-card", () => {
  let el: SpCardComponent;

  beforeEach(() => {
    document.body.innerHTML = "";
    el = createElement();
  });

  // ---- Rendering ----

  it("renders a .sp-card div in shadow DOM", async () => {
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-card")).not.toBeNull();
  });

  // ---- Shadow reflection ----

  it("reflects default shadow attribute as 'sm'", async () => {
    await el.updateComplete;
    expect(el.getAttribute("shadow")).toBe("sm");
  });

  it("reflects shadow attribute when changed", async () => {
    el.shadow = "lg";
    await el.updateComplete;
    expect(el.getAttribute("shadow")).toBe("lg");
  });

  it("reflects shadow='none' attribute", async () => {
    el.shadow = "none";
    await el.updateComplete;
    expect(el.getAttribute("shadow")).toBe("none");
  });

  it("reflects shadow='md' attribute", async () => {
    el.shadow = "md";
    await el.updateComplete;
    expect(el.getAttribute("shadow")).toBe("md");
  });

  // ---- Bordered reflection ----

  it("does not have bordered attribute by default", async () => {
    await el.updateComplete;
    expect(el.hasAttribute("bordered")).toBe(false);
  });

  it("reflects bordered attribute when set to true", async () => {
    el.bordered = true;
    await el.updateComplete;
    expect(el.hasAttribute("bordered")).toBe(true);
  });

  // ---- Slots ----

  it("renders default slot content", async () => {
    el.innerHTML = "<p>Card body</p>";
    await el.updateComplete;
    expect(el.querySelector("p")?.textContent).toBe("Card body");
  });

  it("renders header slot", async () => {
    el.innerHTML = '<span slot="header">Title</span>';
    await el.updateComplete;
    expect(el.querySelector('[slot="header"]')?.textContent).toBe("Title");
  });

  it("renders footer slot", async () => {
    el.innerHTML = '<div slot="footer">Footer</div>';
    await el.updateComplete;
    expect(el.querySelector('[slot="footer"]')?.textContent).toBe("Footer");
  });

  it("renders image slot", async () => {
    el.innerHTML = '<img slot="image" src="test.jpg" alt="test" />';
    await el.updateComplete;
    expect(el.querySelector('[slot="image"]')).not.toBeNull();
  });

  // ---- Padding ----

  it("applies padding via inline style on .sp-card", async () => {
    el.padding = "24px";
    await el.updateComplete;
    const card = el.shadowRoot?.querySelector<HTMLElement>(".sp-card");
    expect(card?.getAttribute("style")).toContain("24px");
  });

  it("has default padding of 16px", async () => {
    await el.updateComplete;
    const card = el.shadowRoot?.querySelector<HTMLElement>(".sp-card");
    expect(card?.getAttribute("style")).toContain("16px");
  });
});
