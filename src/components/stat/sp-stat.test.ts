import { describe, it, expect, beforeEach } from "vitest";
import "./sp-stat.js";
import type { SpStatComponent } from "./sp-stat.js";

function createElement(): SpStatComponent {
  const el = document.createElement("sp-stat") as SpStatComponent;
  document.body.appendChild(el);
  return el;
}

describe("sp-stat", () => {
  let el: SpStatComponent;

  beforeEach(() => {
    document.body.innerHTML = "";
    el = createElement();
  });

  it("renders the stat container", async () => {
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-stat")).not.toBeNull();
  });

  it("renders the value row", async () => {
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-stat-value-row")).not.toBeNull();
  });

  it("shows label when provided", async () => {
    el.label = "Revenue";
    await el.updateComplete;
    const label = el.shadowRoot?.querySelector(".sp-stat-label");
    expect(label?.textContent?.trim()).toBe("Revenue");
  });

  it("does not render label element when label is empty", async () => {
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-stat-label")).toBeNull();
  });

  it("shows value", async () => {
    el.value = "42,000";
    await el.updateComplete;
    const value = el.shadowRoot?.querySelector(".sp-stat-value");
    expect(value?.textContent?.trim()).toBe("42,000");
  });

  it("shows prefix when provided", async () => {
    el.prefix = "$";
    await el.updateComplete;
    const prefix = el.shadowRoot?.querySelector(".sp-stat-prefix");
    expect(prefix?.textContent?.trim()).toBe("$");
  });

  it("does not render prefix when empty", async () => {
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-stat-prefix")).toBeNull();
  });

  it("shows suffix when provided", async () => {
    el.suffix = "%";
    await el.updateComplete;
    const suffix = el.shadowRoot?.querySelector(".sp-stat-suffix");
    expect(suffix?.textContent?.trim()).toBe("%");
  });

  it("does not render suffix when empty", async () => {
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-stat-suffix")).toBeNull();
  });

  it("shows trend section when trendValue is provided", async () => {
    el.trendValue = "+12%";
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-stat-trend")).not.toBeNull();
  });

  it("does not render trend when trendValue is empty", async () => {
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-stat-trend")).toBeNull();
  });

  it("trend up applies correct class", async () => {
    el.trend = "up";
    el.trendValue = "+5%";
    await el.updateComplete;
    const trend = el.shadowRoot?.querySelector(".sp-stat-trend");
    expect(trend?.classList.contains("sp-stat-trend--up")).toBe(true);
  });

  it("trend down applies correct class", async () => {
    el.trend = "down";
    el.trendValue = "-3%";
    await el.updateComplete;
    const trend = el.shadowRoot?.querySelector(".sp-stat-trend");
    expect(trend?.classList.contains("sp-stat-trend--down")).toBe(true);
  });

  it("trend neutral applies correct class", async () => {
    el.trend = "neutral";
    el.trendValue = "0%";
    await el.updateComplete;
    const trend = el.shadowRoot?.querySelector(".sp-stat-trend");
    expect(trend?.classList.contains("sp-stat-trend--neutral")).toBe(true);
  });

  it("shows trendValue text", async () => {
    el.trendValue = "+18% vs last month";
    await el.updateComplete;
    const trendVal = el.shadowRoot?.querySelector(".sp-stat-trend-value");
    expect(trendVal?.textContent?.trim()).toBe("+18% vs last month");
  });

  it("shows description when provided", async () => {
    el.description = "Compared to last quarter";
    await el.updateComplete;
    const desc = el.shadowRoot?.querySelector(".sp-stat-description");
    expect(desc?.textContent?.trim()).toBe("Compared to last quarter");
  });

  it("does not render description when empty", async () => {
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-stat-description")).toBeNull();
  });

  it("reflects trend attribute", async () => {
    el.trend = "up";
    await el.updateComplete;
    expect(el.getAttribute("trend")).toBe("up");
  });
});
