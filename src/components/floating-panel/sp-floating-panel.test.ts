import { describe, it, expect, beforeEach } from "vitest";
import "./sp-floating-panel.js";
import type { SpFloatingPanelComponent } from "./sp-floating-panel.js";

function createElement(): SpFloatingPanelComponent {
  const el = document.createElement("sp-floating-panel") as SpFloatingPanelComponent;
  document.body.appendChild(el);
  return el;
}

describe("sp-floating-panel", () => {
  let el: SpFloatingPanelComponent;
  beforeEach(() => { document.body.innerHTML = ""; el = createElement(); });

  it("renders panel container in shadow DOM", async () => {
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-fp")).not.toBeNull();
  });

  it("has default title", async () => {
    await el.updateComplete;
    const title = el.shadowRoot?.querySelector(".sp-fp-title");
    expect(title?.textContent?.trim()).toBe("Panel");
  });

  it("renders header with drag area", async () => {
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-fp-titlebar")).not.toBeNull();
  });

  it("renders default slot for content", async () => {
    el.innerHTML = "<p>Content</p>";
    await el.updateComplete;
    expect(el.querySelector("p")).not.toBeNull();
  });

  it("collapses when collapse button is clicked", async () => {
    await el.updateComplete;
    const collapseBtn = el.shadowRoot?.querySelector<HTMLButtonElement>(".sp-fp-btn");
    collapseBtn?.click();
    await el.updateComplete;
    expect(el.collapsed).toBe(true);
  });

  it("expands again when collapse button is clicked twice", async () => {
    await el.updateComplete;
    const collapseBtn = el.shadowRoot?.querySelector<HTMLButtonElement>(".sp-fp-btn");
    collapseBtn?.click();
    await el.updateComplete;
    collapseBtn?.click();
    await el.updateComplete;
    expect(el.collapsed).toBe(false);
  });

  it("is not collapsed by default", async () => {
    await el.updateComplete;
    expect(el.collapsed).toBe(false);
  });

  it("renders resize handle", async () => {
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-fp-resize")).not.toBeNull();
  });

  it("renders body slot", async () => {
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-fp-body")).not.toBeNull();
  });
});
