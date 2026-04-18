import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import "./sp-drawer.js";
import type { SpDrawerComponent } from "./sp-drawer.js";

function createElement(): SpDrawerComponent {
  const el = document.createElement("sp-drawer") as SpDrawerComponent;
  document.body.appendChild(el);
  return el;
}

describe("sp-drawer", () => {
  let el: SpDrawerComponent;

  beforeEach(() => {
    vi.useFakeTimers();
    document.body.innerHTML = "";
    el = createElement();
  });

  afterEach(() => vi.useRealTimers());

  // ---- Defaults ----

  it("is hidden by default (open=false)", async () => {
    await el.updateComplete;
    expect(el.open).toBe(false);
    expect(el.shadowRoot?.querySelector(".sp-drawer")).toBeNull();
  });

  it("has default placement right", async () => {
    await el.updateComplete;
    expect(el.getAttribute("placement")).toBe("right");
  });

  it("has default size md", async () => {
    await el.updateComplete;
    expect(el.getAttribute("size")).toBe("md");
  });

  it("closable defaults to true", async () => {
    await el.updateComplete;
    expect(el.closable).toBe(true);
  });

  // ---- open/close ----

  it("renders dialog when open is set to true", async () => {
    el.open = true;
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-drawer")).not.toBeNull();
  });

  it("renders overlay when open", async () => {
    el.open = true;
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-drawer-overlay")).not.toBeNull();
  });

  it("emits sp-show event when opened", async () => {
    const listener = vi.fn();
    el.addEventListener("sp-show", listener);
    el.open = true;
    await el.updateComplete;
    expect(listener).toHaveBeenCalledOnce();
  });

  it("emits sp-hide event after closing (after timer)", async () => {
    el.open = true;
    await el.updateComplete;

    const listener = vi.fn();
    el.addEventListener("sp-hide", listener);

    el.open = false;
    await el.updateComplete;

    // sp-hide fires after the 260ms closing timer
    vi.advanceTimersByTime(300);
    await el.updateComplete;

    expect(listener).toHaveBeenCalledOnce();
  });

  it("emits sp-after-hide after sp-hide", async () => {
    el.open = true;
    await el.updateComplete;

    const afterListener = vi.fn();
    el.addEventListener("sp-after-hide", afterListener);

    el.open = false;
    await el.updateComplete;

    vi.advanceTimersByTime(400);
    await el.updateComplete;

    expect(afterListener).toHaveBeenCalledOnce();
  });

  it("closes when Escape key is pressed while open", async () => {
    el.open = true;
    await el.updateComplete;

    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
    await el.updateComplete;

    expect(el.open).toBe(false);
  });

  it("does not close on Escape when already closed", async () => {
    // Just make sure no error is thrown and state remains false
    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
    await el.updateComplete;
    expect(el.open).toBe(false);
  });

  // ---- placement ----

  it("reflects placement=left attribute", async () => {
    el.placement = "left";
    await el.updateComplete;
    expect(el.getAttribute("placement")).toBe("left");
  });

  it("reflects placement=top attribute", async () => {
    el.placement = "top";
    await el.updateComplete;
    expect(el.getAttribute("placement")).toBe("top");
  });

  it("reflects placement=bottom attribute", async () => {
    el.placement = "bottom";
    await el.updateComplete;
    expect(el.getAttribute("placement")).toBe("bottom");
  });

  // ---- sizes ----

  it("reflects size=sm attribute", async () => {
    el.size = "sm";
    await el.updateComplete;
    expect(el.getAttribute("size")).toBe("sm");
  });

  it("reflects size=full attribute", async () => {
    el.size = "full";
    await el.updateComplete;
    expect(el.getAttribute("size")).toBe("full");
  });

  // ---- closable ----

  it("hides close button when closable=false", async () => {
    el.closable = false;
    el.open = true;
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-drawer-close")).toBeNull();
  });

  it("shows close button when closable=true", async () => {
    el.closable = true;
    el.open = true;
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-drawer-close")).not.toBeNull();
  });

  it("closes when close button is clicked", async () => {
    el.open = true;
    await el.updateComplete;

    const btn = el.shadowRoot?.querySelector<HTMLButtonElement>(".sp-drawer-close");
    btn?.click();
    await el.updateComplete;

    expect(el.open).toBe(false);
  });

  // ---- overlay click ----

  it("closes when overlay is clicked and closeOnOverlay=true", async () => {
    el.open = true;
    await el.updateComplete;

    const overlay = el.shadowRoot?.querySelector<HTMLElement>(".sp-drawer-overlay");
    overlay?.click();
    await el.updateComplete;

    expect(el.open).toBe(false);
  });

  it("does not close when overlay is clicked and closeOnOverlay=false", async () => {
    el.closeOnOverlay = false;
    el.open = true;
    await el.updateComplete;

    const overlay = el.shadowRoot?.querySelector<HTMLElement>(".sp-drawer-overlay");
    overlay?.click();
    await el.updateComplete;

    expect(el.open).toBe(true);
  });

  // ---- label / slots ----

  it("renders label as title when provided", async () => {
    el.label = "Mi Drawer";
    el.open = true;
    await el.updateComplete;
    const title = el.shadowRoot?.querySelector(".sp-drawer-title");
    expect(title?.textContent).toBe("Mi Drawer");
  });

  it("renders footer slot container", async () => {
    el.open = true;
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-drawer-footer")).not.toBeNull();
  });

  it("role=dialog is set on drawer panel", async () => {
    el.open = true;
    await el.updateComplete;
    const panel = el.shadowRoot?.querySelector(".sp-drawer");
    expect(panel?.getAttribute("role")).toBe("dialog");
  });
});
