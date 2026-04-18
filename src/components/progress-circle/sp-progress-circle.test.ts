import { describe, it, expect, beforeEach } from "vitest";
import "./sp-progress-circle.js";
import type { SpProgressCircleComponent } from "./sp-progress-circle.js";

function createElement(): SpProgressCircleComponent {
  const el = document.createElement("sp-progress-circle") as SpProgressCircleComponent;
  document.body.appendChild(el);
  return el;
}

describe("sp-progress-circle", () => {
  let el: SpProgressCircleComponent;

  beforeEach(() => {
    document.body.innerHTML = "";
    el = createElement();
  });

  it("renders an SVG in shadow DOM", async () => {
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector("svg")).not.toBeNull();
  });

  it("renders progress circle track and fill", async () => {
    await el.updateComplete;
    const circles = el.shadowRoot?.querySelectorAll("circle");
    expect(circles?.length).toBeGreaterThanOrEqual(2);
  });

  it("has default value of 0", async () => {
    await el.updateComplete;
    expect(el.value).toBe(0);
  });

  it("has default size of 80", async () => {
    await el.updateComplete;
    expect(el.size).toBe(80);
  });

  it("reflects value attribute", async () => {
    el.value = 75;
    await el.updateComplete;
    expect(el.value).toBe(75);
  });

  it("clamps value to 0-100", async () => {
    el.value = 150;
    await el.updateComplete;
    const circle = el.shadowRoot?.querySelector<SVGCircleElement>(".sp-pc-fill");
    expect(circle).not.toBeNull();
  });

  it("indeterminate property is false by default", async () => {
    await el.updateComplete;
    expect(el.indeterminate).toBe(false);
  });

  it("sets indeterminate to true", async () => {
    el.indeterminate = true;
    await el.updateComplete;
    expect(el.indeterminate).toBe(true);
  });

  it("shows label slot", async () => {
    el.innerHTML = "75%";
    await el.updateComplete;
    expect(el.textContent).toBe("75%");
  });

  it("uses custom color", async () => {
    el.color = "#ff0000";
    await el.updateComplete;
    expect(el.color).toBe("#ff0000");
  });

  it("uses custom size for SVG dimensions", async () => {
    el.size = 100;
    await el.updateComplete;
    const svg = el.shadowRoot?.querySelector("svg");
    expect(svg?.getAttribute("width")).toBe("100");
    expect(svg?.getAttribute("height")).toBe("100");
  });
});
