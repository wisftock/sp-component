import { describe, it, expect, beforeEach } from "vitest";
import "./sp-sparkline.js";
import type { SpSparklineComponent } from "./sp-sparkline.js";

function createElement(): SpSparklineComponent {
  const el = document.createElement("sp-sparkline") as SpSparklineComponent;
  document.body.appendChild(el);
  return el;
}

describe("sp-sparkline", () => {
  let el: SpSparklineComponent;

  beforeEach(() => {
    document.body.innerHTML = "";
    el = createElement();
  });

  it("renders SVG in shadow DOM", async () => {
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector("svg")).not.toBeNull();
  });

  it("has default type of line", async () => {
    await el.updateComplete;
    expect(el.type).toBe("line");
  });

  it("has default width of 80", async () => {
    await el.updateComplete;
    expect(el.width).toBe(80);
  });

  it("has default height of 28", async () => {
    await el.updateComplete;
    expect(el.height).toBe(28);
  });

  it("sets SVG dimensions from width/height props", async () => {
    el.width = 120;
    el.height = 40;
    await el.updateComplete;
    const svg = el.shadowRoot?.querySelector("svg");
    expect(svg?.getAttribute("width")).toBe("120");
    expect(svg?.getAttribute("height")).toBe("40");
  });

  it("renders path element for line type with values", async () => {
    el.values = [1, 2, 3, 4, 5];
    el.type = "line";
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector("path")).not.toBeNull();
  });

  it("renders rect elements for bar type", async () => {
    el.values = [10, 20, 30];
    el.type = "bar";
    await el.updateComplete;
    const rects = el.shadowRoot?.querySelectorAll("rect");
    expect(rects?.length).toBe(3);
  });

  it("renders path for area type", async () => {
    el.values = [1, 3, 2, 5, 4];
    el.type = "area";
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector("path")).not.toBeNull();
  });

  it("renders nothing for empty values in line mode", async () => {
    el.values = [];
    el.type = "line";
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector("path")).toBeNull();
  });

  it("accepts custom color", async () => {
    el.color = "#ff0000";
    el.values = [1, 2, 3];
    await el.updateComplete;
    expect(el.color).toBe("#ff0000");
  });
});
