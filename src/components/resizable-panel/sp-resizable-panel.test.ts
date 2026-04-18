import { describe, it, expect, beforeEach } from "vitest";
import "./sp-resizable-panel.js";
import type { SpResizablePanelComponent } from "./sp-resizable-panel.js";

function createElement(): SpResizablePanelComponent {
  const el = document.createElement("sp-resizable-panel") as SpResizablePanelComponent;
  document.body.appendChild(el);
  return el;
}

describe("sp-resizable-panel", () => {
  let el: SpResizablePanelComponent;
  beforeEach(() => { document.body.innerHTML = ""; el = createElement(); });

  it("renders panel container in shadow DOM", async () => {
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-rp")).not.toBeNull();
  });

  it("renders two panel slots", async () => {
    await el.updateComplete;
    const panels = el.shadowRoot?.querySelectorAll(".sp-rp-panel");
    expect(panels?.length).toBe(2);
  });

  it("renders divider/handle", async () => {
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-rp-divider")).not.toBeNull();
  });

  it("defaults to horizontal direction", async () => {
    await el.updateComplete;
    expect(el.direction).toBe("horizontal");
    expect(el.shadowRoot?.querySelector(".sp-rp--horizontal")).not.toBeNull();
  });

  it("applies vertical class for vertical direction", async () => {
    el.direction = "vertical";
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-rp--vertical")).not.toBeNull();
  });

  it("defaults to initialSize 50", async () => {
    await el.updateComplete;
    expect(el.initialSize).toBe(50);
  });

  it("accepts first slot content", async () => {
    el.innerHTML = "<div slot='first'>Panel A</div>";
    await el.updateComplete;
    expect(el.querySelector("[slot='first']")).not.toBeNull();
  });

  it("accepts second slot content", async () => {
    el.innerHTML = "<div slot='second'>Panel B</div>";
    await el.updateComplete;
    expect(el.querySelector("[slot='second']")).not.toBeNull();
  });
});
