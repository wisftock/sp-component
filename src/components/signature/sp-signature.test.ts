import { describe, it, expect, beforeEach } from "vitest";
import "./sp-signature.js";
import type { SpSignatureComponent } from "./sp-signature.js";

function createElement(): SpSignatureComponent {
  const el = document.createElement("sp-signature") as SpSignatureComponent;
  document.body.appendChild(el);
  return el;
}

describe("sp-signature", () => {
  let el: SpSignatureComponent;
  beforeEach(() => { document.body.innerHTML = ""; el = createElement(); });

  it("renders signature container in shadow DOM", async () => {
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-signature")).not.toBeNull();
  });

  it("renders canvas element", async () => {
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector("canvas")).not.toBeNull();
  });

  it("canvas has correct default dimensions", async () => {
    await el.updateComplete;
    const canvas = el.shadowRoot?.querySelector<HTMLCanvasElement>("canvas");
    expect(canvas?.width).toBe(400);
    expect(canvas?.height).toBe(200);
  });

  it("defaults pen color to black", async () => {
    await el.updateComplete;
    expect(el.penColor).toBe("#000000");
  });

  it("defaults pen width to 2", async () => {
    await el.updateComplete;
    expect(el.penWidth).toBe(2);
  });

  it("shows placeholder when empty", async () => {
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-signature__placeholder")).not.toBeNull();
  });

  it("shows label when set", async () => {
    el.label = "Firma del cliente";
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-signature__label")?.textContent?.trim()).toBe("Firma del cliente");
  });

  it("shows color controls when showControls is true", async () => {
    el.showControls = true;
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-signature__controls")).not.toBeNull();
  });

  it("hides color controls when showControls is false", async () => {
    el.showControls = false;
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-signature__controls")).toBeNull();
  });

  it("isEmpty returns true by default", async () => {
    await el.updateComplete;
    expect(el.isEmpty).toBe(true);
  });

  it("fires sp-clear event when clear is called", async () => {
    await el.updateComplete;
    const received: CustomEvent[] = [];
    el.addEventListener("sp-clear", (e) => received.push(e as CustomEvent));
    el.clear();
    expect(received.length).toBe(1);
  });
});
