import { describe, it, expect, beforeEach } from "vitest";
import "./sp-icon.js";
import type { SpIconComponent } from "./sp-icon.js";

function createElement(): SpIconComponent {
  const el = document.createElement("sp-icon") as SpIconComponent;
  document.body.appendChild(el);
  return el;
}

describe("sp-icon", () => {
  let el: SpIconComponent;

  beforeEach(() => {
    document.body.innerHTML = "";
    el = createElement();
  });

  it("renders default size md", async () => {
    await el.updateComplete;
    expect(el.size).toBe("md");
  });

  it("reflects size attribute", async () => {
    el.size = "lg";
    await el.updateComplete;
    expect(el.getAttribute("size")).toBe("lg");
  });

  it("renders SVG element", async () => {
    el.name = "check";
    await el.updateComplete;
    const svgEl = el.shadowRoot?.querySelector("svg");
    expect(svgEl).not.toBeNull();
  });

  it("sets aria-label when label prop is set", async () => {
    el.name = "check";
    el.label = "Checkmark icon";
    await el.updateComplete;
    const svgEl = el.shadowRoot?.querySelector("svg");
    expect(svgEl?.getAttribute("aria-label")).toBe("Checkmark icon");
  });

  it("sets aria-hidden when label is empty", async () => {
    el.name = "check";
    el.label = "";
    await el.updateComplete;
    const svgEl = el.shadowRoot?.querySelector("svg");
    expect(svgEl?.getAttribute("aria-hidden")).toBe("true");
  });

  it("renders known icon check", async () => {
    el.name = "check";
    await el.updateComplete;
    const path = el.shadowRoot?.querySelector("svg path");
    expect(path).not.toBeNull();
  });

  it("renders empty SVG for unknown icon name", async () => {
    el.name = "nonexistent-icon-xyz";
    await el.updateComplete;
    const svgEl = el.shadowRoot?.querySelector("svg");
    expect(svgEl).not.toBeNull();
    // No paths rendered for unknown icon
    const path = el.shadowRoot?.querySelector("svg path");
    expect(path).toBeNull();
  });

  it("changes color via color property", async () => {
    el.name = "check";
    el.color = "red";
    await el.updateComplete;
    const svgEl = el.shadowRoot?.querySelector("svg") as SVGElement | null;
    expect(svgEl?.getAttribute("style")).toContain("color: red");
  });
});
