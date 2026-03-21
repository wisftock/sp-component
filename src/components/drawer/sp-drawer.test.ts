import { describe, it, expect, beforeEach, vi } from "vitest";
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
    HTMLDialogElement.prototype.showModal = vi.fn();
    HTMLDialogElement.prototype.close = vi.fn();
    document.body.innerHTML = "";
    el = createElement();
  });

  // ---- Rendering ----

  it("renders a dialog element in shadow DOM", async () => {
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector("dialog")).not.toBeNull();
  });

  it("dialog is not open by default", async () => {
    await el.updateComplete;
    expect(el.open).toBe(false);
    expect(el.hasAttribute("open")).toBe(false);
  });

  // ---- Open / close ----

  it("calls showModal when open is set to true", async () => {
    await el.updateComplete;
    el.open = true;
    await el.updateComplete;
    const dialog = el.shadowRoot?.querySelector("dialog") as HTMLDialogElement;
    expect(dialog.showModal).toHaveBeenCalledOnce();
  });

  it("calls close when open is set to false after being open", async () => {
    el.open = true;
    await el.updateComplete;
    el.open = false;
    await el.updateComplete;
    const dialog = el.shadowRoot?.querySelector("dialog") as HTMLDialogElement;
    expect(dialog.close).toHaveBeenCalledOnce();
  });

  // ---- Placement ----

  it("reflects default placement attribute as 'right'", async () => {
    await el.updateComplete;
    expect(el.getAttribute("placement")).toBe("right");
  });

  it("reflects custom placement attribute", async () => {
    el.placement = "left";
    await el.updateComplete;
    expect(el.getAttribute("placement")).toBe("left");
  });

  it("_getPanelStyle returns width style for left/right placement", async () => {
    el.placement = "right";
    el.size = "400px";
    await el.updateComplete;
    expect(el._getPanelStyle()).toContain("width: 400px");
  });

  it("_getPanelStyle returns height style for top/bottom placement", async () => {
    el.placement = "bottom";
    el.size = "250px";
    await el.updateComplete;
    expect(el._getPanelStyle()).toContain("height: 250px");
  });

  // ---- Close button ----

  it("renders close button when closable=true", async () => {
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-drawer-close")).not.toBeNull();
  });

  it("does not render close button when closable=false", async () => {
    el.closable = false;
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-drawer-close")).toBeNull();
  });

  it("close button click sets open=false", async () => {
    el.open = true;
    await el.updateComplete;
    const closeBtn = el.shadowRoot?.querySelector(
      ".sp-drawer-close",
    ) as HTMLButtonElement;
    closeBtn.click();
    await el.updateComplete;
    expect(el.open).toBe(false);
  });

  // ---- Events ----

  it("emits sp-show when drawer is opened", async () => {
    await el.updateComplete;
    const listener = vi.fn();
    el.addEventListener("sp-show", listener);
    el.open = true;
    await el.updateComplete;
    expect(listener).toHaveBeenCalledOnce();
  });

  it("emits sp-hide when drawer is closed", async () => {
    el.open = true;
    await el.updateComplete;
    const listener = vi.fn();
    el.addEventListener("sp-hide", listener);
    el.open = false;
    await el.updateComplete;
    expect(listener).toHaveBeenCalledOnce();
  });
});
