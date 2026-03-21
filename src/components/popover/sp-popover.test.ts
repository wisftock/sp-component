import { describe, it, expect, beforeEach, vi } from "vitest";
import "./sp-popover.js";
import type { SpPopoverComponent } from "./sp-popover.js";

function createElement(): SpPopoverComponent {
  const el = document.createElement("sp-popover") as SpPopoverComponent;
  document.body.appendChild(el);
  return el;
}

describe("sp-popover", () => {
  let el: SpPopoverComponent;

  beforeEach(() => {
    document.body.innerHTML = "";
    el = createElement();
  });

  // ---- Rendering ----

  it("renders the popover wrapper in shadow DOM", async () => {
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-popover-wrapper")).not.toBeNull();
  });

  it("renders the popover element", async () => {
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-popover")).not.toBeNull();
  });

  // ---- Default state ----

  it("popover is hidden by default (open=false)", async () => {
    await el.updateComplete;
    const popover = el.shadowRoot?.querySelector(".sp-popover");
    expect(popover?.classList.contains("sp-popover--open")).toBe(false);
  });

  // ---- Open / close via prop ----

  it("shows popover when open=true", async () => {
    el.open = true;
    await el.updateComplete;
    const popover = el.shadowRoot?.querySelector(".sp-popover");
    expect(popover?.classList.contains("sp-popover--open")).toBe(true);
  });

  it("hides popover when open=false after being open", async () => {
    el.open = true;
    await el.updateComplete;
    el.open = false;
    await el.updateComplete;
    const popover = el.shadowRoot?.querySelector(".sp-popover");
    expect(popover?.classList.contains("sp-popover--open")).toBe(false);
  });

  // ---- Trigger click ----

  it("toggles open on trigger click", async () => {
    await el.updateComplete;
    const trigger = el.shadowRoot?.querySelector(
      ".sp-popover-trigger",
    ) as HTMLElement;
    trigger.click();
    await el.updateComplete;
    expect(el.open).toBe(true);
    trigger.click();
    await el.updateComplete;
    expect(el.open).toBe(false);
  });

  // ---- Events ----

  it("emits sp-show when opened via trigger click", async () => {
    await el.updateComplete;
    const listener = vi.fn();
    el.addEventListener("sp-show", listener);
    const trigger = el.shadowRoot?.querySelector(
      ".sp-popover-trigger",
    ) as HTMLElement;
    trigger.click();
    await el.updateComplete;
    expect(listener).toHaveBeenCalledOnce();
  });

  it("emits sp-hide when closed via trigger click", async () => {
    el.open = true;
    await el.updateComplete;
    const listener = vi.fn();
    el.addEventListener("sp-hide", listener);
    const trigger = el.shadowRoot?.querySelector(
      ".sp-popover-trigger",
    ) as HTMLElement;
    trigger.click();
    await el.updateComplete;
    expect(listener).toHaveBeenCalledOnce();
  });

  // ---- Keyboard ----

  it("closes on ESC key", async () => {
    el._handleTriggerClick();
    await el.updateComplete;
    expect(el.open).toBe(true);
    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
    await el.updateComplete;
    expect(el.open).toBe(false);
  });

  // ---- Arrow ----

  it("renders arrow element when arrow=true (default)", async () => {
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-popover-arrow")).not.toBeNull();
  });

  it("does not render arrow when arrow=false", async () => {
    el.arrow = false;
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-popover-arrow")).toBeNull();
  });

  // ---- Placement reflection ----

  it("reflects default placement attribute as 'bottom'", async () => {
    await el.updateComplete;
    expect(el.getAttribute("placement")).toBe("bottom");
  });

  it("reflects custom placement attribute", async () => {
    el.placement = "top";
    await el.updateComplete;
    expect(el.getAttribute("placement")).toBe("top");
  });

  // ---- Style helper ----

  it("_getPopoverStyle accounts for arrow distance", async () => {
    el.placement = "bottom";
    el.distance = 8;
    el.arrow = true;
    await el.updateComplete;
    // distance(8) + arrow offset(6) = 14px
    expect(el._getPopoverStyle()).toContain("14px");
  });
});
