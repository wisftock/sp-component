import { describe, it, expect, beforeEach } from "vitest";
import "./sp-tooltip.js";
import type { SpTooltipComponent } from "./sp-tooltip.js";

function createElement(trigger = "hover"): SpTooltipComponent {
  const el = document.createElement("sp-tooltip") as SpTooltipComponent;
  el.setAttribute("trigger", trigger);
  el.content = "Tooltip text";
  // Disable delays so tests don't need to wait for timers
  el.showDelay = 0;
  el.hideDelay = 0;
  document.body.appendChild(el);
  return el;
}

describe("sp-tooltip", () => {
  let el: SpTooltipComponent;

  beforeEach(() => {
    document.body.innerHTML = "";
    el = createElement();
  });

  // ---- Rendering ----

  it("renders the tooltip wrapper in shadow DOM", async () => {
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-tooltip-wrapper")).not.toBeNull();
  });

  it("renders the tooltip element with role=tooltip", async () => {
    await el.updateComplete;
    const tooltip = el.shadowRoot?.querySelector("[role='tooltip']");
    expect(tooltip).not.toBeNull();
  });

  // ---- Default state ----

  it("tooltip is not visible by default", async () => {
    await el.updateComplete;
    const tooltip = el.shadowRoot?.querySelector(".sp-tooltip");
    expect(tooltip?.classList.contains("sp-tooltip--visible")).toBe(false);
  });

  // ---- Hover trigger ----

  it("shows tooltip on mouseenter when trigger=hover", async () => {
    await el.updateComplete;
    const wrapper = el.shadowRoot?.querySelector(
      ".sp-tooltip-wrapper",
    ) as HTMLElement;
    wrapper.dispatchEvent(new MouseEvent("mouseenter", { bubbles: true }));
    await el.updateComplete;
    const tooltip = el.shadowRoot?.querySelector(".sp-tooltip");
    expect(tooltip?.classList.contains("sp-tooltip--visible")).toBe(true);
  });

  it("hides tooltip on mouseleave when trigger=hover", async () => {
    await el.updateComplete;
    const wrapper = el.shadowRoot?.querySelector(
      ".sp-tooltip-wrapper",
    ) as HTMLElement;
    wrapper.dispatchEvent(new MouseEvent("mouseenter", { bubbles: true }));
    await el.updateComplete;
    wrapper.dispatchEvent(new MouseEvent("mouseleave", { bubbles: true }));
    await el.updateComplete;
    const tooltip = el.shadowRoot?.querySelector(".sp-tooltip");
    expect(tooltip?.classList.contains("sp-tooltip--visible")).toBe(false);
  });

  // ---- Focus trigger ----

  it("shows tooltip on focusin when trigger=focus", async () => {
    el.trigger = "focus";
    await el.updateComplete;
    const wrapper = el.shadowRoot?.querySelector(
      ".sp-tooltip-wrapper",
    ) as HTMLElement;
    wrapper.dispatchEvent(new FocusEvent("focusin", { bubbles: true }));
    await el.updateComplete;
    const tooltip = el.shadowRoot?.querySelector(".sp-tooltip");
    expect(tooltip?.classList.contains("sp-tooltip--visible")).toBe(true);
  });

  it("hides tooltip on focusout when trigger=focus", async () => {
    el.trigger = "focus";
    await el.updateComplete;
    const wrapper = el.shadowRoot?.querySelector(
      ".sp-tooltip-wrapper",
    ) as HTMLElement;
    wrapper.dispatchEvent(new FocusEvent("focusin", { bubbles: true }));
    await el.updateComplete;
    wrapper.dispatchEvent(new FocusEvent("focusout", { bubbles: true }));
    await el.updateComplete;
    const tooltip = el.shadowRoot?.querySelector(".sp-tooltip");
    expect(tooltip?.classList.contains("sp-tooltip--visible")).toBe(false);
  });

  // ---- Click trigger ----

  it("toggles tooltip on click when trigger=click", async () => {
    el.trigger = "click";
    await el.updateComplete;
    const wrapper = el.shadowRoot?.querySelector(
      ".sp-tooltip-wrapper",
    ) as HTMLElement;
    wrapper.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-tooltip")?.classList.contains("sp-tooltip--visible")).toBe(true);
    wrapper.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-tooltip")?.classList.contains("sp-tooltip--visible")).toBe(false);
  });

  // ---- Disabled ----

  it("does not show tooltip when disabled, even with open=true", async () => {
    el.disabled = true;
    el.open = true;
    await el.updateComplete;
    const tooltip = el.shadowRoot?.querySelector(".sp-tooltip");
    expect(tooltip?.classList.contains("sp-tooltip--visible")).toBe(false);
  });

  it("reflects disabled attribute", async () => {
    el.disabled = true;
    await el.updateComplete;
    expect(el.hasAttribute("disabled")).toBe(true);
  });

  // ---- Reflection ----

  it("reflects default placement attribute as 'top'", async () => {
    await el.updateComplete;
    expect(el.getAttribute("placement")).toBe("top");
  });

  it("reflects custom placement attribute", async () => {
    el.placement = "bottom";
    await el.updateComplete;
    expect(el.getAttribute("placement")).toBe("bottom");
  });

  // ---- Content ----

  it("renders content text in tooltip element", async () => {
    el.content = "Hello world";
    await el.updateComplete;
    const tooltip = el.shadowRoot?.querySelector(".sp-tooltip");
    expect(tooltip?.textContent?.trim()).toBe("Hello world");
  });

  // ---- Distance ----

  it("stores distance property for floating positioning", async () => {
    el.distance = 16;
    await el.updateComplete;
    // Positioning is now handled by floating-ui; verify property is stored
    expect(el.distance).toBe(16);
  });

  // ---- Manual open ----

  it("shows tooltip when open=true", async () => {
    el.open = true;
    await el.updateComplete;
    const tooltip = el.shadowRoot?.querySelector(".sp-tooltip");
    expect(tooltip?.classList.contains("sp-tooltip--visible")).toBe(true);
  });
});
