import { describe, it, expect, beforeEach } from "vitest";
import "./sp-kbd.js";
import type { SpKbdComponent } from "./sp-kbd.js";

function createElement(content = ""): SpKbdComponent {
  const el = document.createElement("sp-kbd") as SpKbdComponent;
  if (content) el.textContent = content;
  document.body.appendChild(el);
  return el;
}

describe("sp-kbd", () => {
  let el: SpKbdComponent;

  beforeEach(() => {
    document.body.innerHTML = "";
    el = createElement("Ctrl");
  });

  // ---- Rendering ----

  it("renders kbd element in shadow DOM", async () => {
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector("kbd")).not.toBeNull();
  });

  it("renders a slot inside kbd", async () => {
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector("kbd slot")).not.toBeNull();
  });

  it("renders slotted content", async () => {
    await el.updateComplete;
    expect(el.textContent).toBe("Ctrl");
  });

  // ---- Default size ----

  it("default size is md", async () => {
    await el.updateComplete;
    expect(el.size).toBe("md");
  });

  it("reflects default size attribute as md", async () => {
    await el.updateComplete;
    expect(el.getAttribute("size")).toBe("md");
  });

  // ---- Size attribute ----

  it("reflects size attribute when set to sm", async () => {
    el.size = "sm";
    await el.updateComplete;
    expect(el.getAttribute("size")).toBe("sm");
  });

  it("reflects size attribute when set to lg", async () => {
    el.size = "lg";
    await el.updateComplete;
    expect(el.getAttribute("size")).toBe("lg");
  });

  // ---- Part ----

  it("kbd element has part=key", async () => {
    await el.updateComplete;
    const kbd = el.shadowRoot?.querySelector("kbd");
    expect(kbd?.getAttribute("part")).toBe("key");
  });
});
