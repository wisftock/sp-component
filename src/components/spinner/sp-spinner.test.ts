import { describe, it, expect, beforeEach } from "vitest";
import "./sp-spinner.js";
import type { SpSpinnerComponent } from "./sp-spinner.js";

function createElement(): SpSpinnerComponent {
  const el = document.createElement("sp-spinner") as SpSpinnerComponent;
  document.body.appendChild(el);
  return el;
}

describe("sp-spinner", () => {
  let el: SpSpinnerComponent;

  beforeEach(() => {
    document.body.innerHTML = "";
    el = createElement();
  });

  // ---- Rendering ----

  it("renders the spinner div", async () => {
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-spinner")).not.toBeNull();
  });

  it("renders an SVG element", async () => {
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector("svg")).not.toBeNull();
  });

  it("renders the sr-only text span", async () => {
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-sr-only")).not.toBeNull();
  });

  it("sr-only text matches label prop", async () => {
    el.label = "Please wait";
    await el.updateComplete;
    const srOnly = el.shadowRoot?.querySelector(".sp-sr-only");
    expect(srOnly?.textContent).toBe("Please wait");
  });

  // ---- Accessibility ----

  it("has role=status on the spinner div", async () => {
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector("[role='status']")).not.toBeNull();
  });

  it("has aria-label matching the label prop", async () => {
    el.label = "Loading data";
    await el.updateComplete;
    const spinnerDiv = el.shadowRoot?.querySelector(".sp-spinner");
    expect(spinnerDiv?.getAttribute("aria-label")).toBe("Loading data");
  });

  // ---- Size ----

  it("reflects default size=md attribute", async () => {
    await el.updateComplete;
    expect(el.getAttribute("size")).toBe("md");
  });

  it("reflects size attribute when changed to sm", async () => {
    el.size = "sm";
    await el.updateComplete;
    expect(el.getAttribute("size")).toBe("sm");
  });

  it("reflects size attribute when changed to lg", async () => {
    el.size = "lg";
    await el.updateComplete;
    expect(el.getAttribute("size")).toBe("lg");
  });

  it("reflects size attribute when changed to xl", async () => {
    el.size = "xl";
    await el.updateComplete;
    expect(el.getAttribute("size")).toBe("xl");
  });

  // ---- Default label ----

  it("defaults label to Loading...", async () => {
    await el.updateComplete;
    expect(el.label).toBe("Loading...");
  });
});
