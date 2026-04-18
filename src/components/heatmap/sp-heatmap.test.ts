import { describe, it, expect, beforeEach } from "vitest";
import "./sp-heatmap.js";
import type { SpHeatmapComponent } from "./sp-heatmap.js";

function createElement(): SpHeatmapComponent {
  const el = document.createElement("sp-heatmap") as SpHeatmapComponent;
  document.body.appendChild(el);
  return el;
}

describe("sp-heatmap", () => {
  let el: SpHeatmapComponent;
  beforeEach(() => { document.body.innerHTML = ""; el = createElement(); });

  it("renders heatmap container in shadow DOM", async () => {
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-hm")).not.toBeNull();
  });

  it("has default weeks of 52", async () => {
    await el.updateComplete;
    expect(el.weeks).toBe(52);
  });

  it("renders grid cells", async () => {
    await el.updateComplete;
    const cells = el.shadowRoot?.querySelectorAll(".sp-hm-cell");
    expect(cells?.length).toBeGreaterThan(0);
  });

  it("renders day-of-week labels", async () => {
    await el.updateComplete;
    const daysContainer = el.shadowRoot?.querySelector(".sp-hm-days");
    expect(daysContainer).not.toBeNull();
    expect(daysContainer?.querySelectorAll("span").length).toBeGreaterThan(0);
  });

  it("accepts data prop", async () => {
    el.data = [{ date: "2025-01-01", value: 5 }];
    await el.updateComplete;
    expect(el.data.length).toBe(1);
  });

  it("renders legend", async () => {
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-hm-legend")).not.toBeNull();
  });

  it("applies color scheme", async () => {
    el.color = "blue";
    await el.updateComplete;
    expect(el.color).toBe("blue");
  });

  it("renders month labels", async () => {
    await el.updateComplete;
    const monthRow = el.shadowRoot?.querySelector(".sp-hm-months");
    expect(monthRow).not.toBeNull();
  });
});
