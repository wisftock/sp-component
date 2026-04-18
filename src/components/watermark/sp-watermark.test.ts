import { describe, it, expect, beforeEach } from "vitest";
import "./sp-watermark.js";
import type { SpWatermarkComponent } from "./sp-watermark.js";

function createElement(): SpWatermarkComponent {
  const el = document.createElement("sp-watermark") as SpWatermarkComponent;
  document.body.appendChild(el);
  return el;
}

describe("sp-watermark", () => {
  let el: SpWatermarkComponent;
  beforeEach(() => { document.body.innerHTML = ""; el = createElement(); });

  it("renders watermark container in shadow DOM", async () => {
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-wm")).not.toBeNull();
  });

  it("renders content slot wrapper", async () => {
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-wm-content")).not.toBeNull();
  });

  it("defaults text to CONFIDENCIAL", async () => {
    await el.updateComplete;
    expect(el.text).toBe("CONFIDENCIAL");
  });

  it("defaults opacity to 0.15", async () => {
    await el.updateComplete;
    expect(el.opacity).toBe(0.15);
  });

  it("defaults rotate to -22", async () => {
    await el.updateComplete;
    expect(el.rotate).toBe(-22);
  });

  it("renders watermark layer after connectedCallback", async () => {
    // Allow async pattern generation to complete
    await new Promise(r => setTimeout(r, 50));
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-wm-layer")).not.toBeNull();
  });

  it("accepts slot content", async () => {
    el.innerHTML = "<p>Contenido protegido</p>";
    await el.updateComplete;
    expect(el.querySelector("p")).not.toBeNull();
  });

  it("accepts custom text", async () => {
    el.text = "BORRADOR";
    await el.updateComplete;
    expect(el.text).toBe("BORRADOR");
  });
});
