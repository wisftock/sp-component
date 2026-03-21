import { describe, it, expect, beforeEach, vi } from "vitest";
import "./sp-menu.js";
import "./sp-menu-item.js";
import type { SpMenuComponent } from "./sp-menu.js";
import type { SpMenuItemComponent } from "./sp-menu-item.js";

function createMenu(): SpMenuComponent {
  const el = document.createElement("sp-menu") as SpMenuComponent;
  document.body.appendChild(el);
  return el;
}

function createMenuItem(): SpMenuItemComponent {
  const el = document.createElement("sp-menu-item") as SpMenuItemComponent;
  document.body.appendChild(el);
  return el;
}

describe("sp-menu", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  it("renders the menu wrapper", async () => {
    const el = createMenu();
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-menu-wrapper")).not.toBeNull();
  });

  it("renders the trigger wrapper", async () => {
    const el = createMenu();
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-menu-trigger")).not.toBeNull();
  });

  it("hides the menu panel when open=false by default", async () => {
    const el = createMenu();
    await el.updateComplete;
    expect(el.open).toBe(false);
    expect(el.shadowRoot?.querySelector(".sp-menu-panel")).toBeNull();
  });

  it("shows the menu panel when open=true", async () => {
    const el = createMenu();
    el.open = true;
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-menu-panel")).not.toBeNull();
  });

  it("toggles open on trigger click", async () => {
    const el = createMenu();
    await el.updateComplete;
    const trigger = el.shadowRoot?.querySelector(".sp-menu-trigger") as HTMLElement;
    trigger.click();
    await el.updateComplete;
    expect(el.open).toBe(true);
    trigger.click();
    await el.updateComplete;
    expect(el.open).toBe(false);
  });

  it("reflects default placement attribute", async () => {
    const el = createMenu();
    await el.updateComplete;
    expect(el.getAttribute("placement")).toBe("bottom-start");
  });

  it("reflects custom placement attribute", async () => {
    const el = createMenu();
    el.placement = "top-end";
    await el.updateComplete;
    expect(el.getAttribute("placement")).toBe("top-end");
  });

  it("emits sp-show event when opened", async () => {
    const el = createMenu();
    await el.updateComplete;
    const listener = vi.fn();
    el.addEventListener("sp-show", listener);
    el.open = true;
    await el.updateComplete;
    expect(listener).toHaveBeenCalledOnce();
  });

  it("emits sp-hide event when closed", async () => {
    const el = createMenu();
    el.open = true;
    await el.updateComplete;
    const listener = vi.fn();
    el.addEventListener("sp-hide", listener);
    el.open = false;
    await el.updateComplete;
    expect(listener).toHaveBeenCalledOnce();
  });

  it("closes menu when item is clicked", async () => {
    const el = createMenu();
    el.open = true;
    await el.updateComplete;
    el._handleItemClick();
    await new Promise((r) => setTimeout(r, 10));
    await el.updateComplete;
    expect(el.open).toBe(false);
  });

  it("menu panel has role=menu", async () => {
    const el = createMenu();
    el.open = true;
    await el.updateComplete;
    const panel = el.shadowRoot?.querySelector(".sp-menu-panel");
    expect(panel?.getAttribute("role")).toBe("menu");
  });
});

describe("sp-menu-item", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  it("renders the menu item element", async () => {
    const el = createMenuItem();
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-menu-item")).not.toBeNull();
  });

  it("has role=menuitem", async () => {
    const el = createMenuItem();
    await el.updateComplete;
    const item = el.shadowRoot?.querySelector(".sp-menu-item");
    expect(item?.getAttribute("role")).toBe("menuitem");
  });

  it("reflects disabled attribute", async () => {
    const el = createMenuItem();
    el.disabled = true;
    await el.updateComplete;
    expect(el.hasAttribute("disabled")).toBe(true);
  });

  it("reflects danger attribute", async () => {
    const el = createMenuItem();
    el.danger = true;
    await el.updateComplete;
    expect(el.hasAttribute("danger")).toBe(true);
  });

  it("applies sp-menu-item--danger class when danger=true", async () => {
    const el = createMenuItem();
    el.danger = true;
    await el.updateComplete;
    const item = el.shadowRoot?.querySelector(".sp-menu-item");
    expect(item?.classList.contains("sp-menu-item--danger")).toBe(true);
  });

  it("applies sp-menu-item--disabled class when disabled=true", async () => {
    const el = createMenuItem();
    el.disabled = true;
    await el.updateComplete;
    const item = el.shadowRoot?.querySelector(".sp-menu-item");
    expect(item?.classList.contains("sp-menu-item--disabled")).toBe(true);
  });

  it("emits sp-select with value when clicked", async () => {
    const el = createMenuItem();
    el.value = "action-1";
    await el.updateComplete;
    let detail: { value: string } | null = null;
    el.addEventListener("sp-select", (e) => {
      detail = (e as CustomEvent<{ value: string }>).detail;
    });
    el._handleClick();
    expect(detail).toEqual({ value: "action-1" });
  });

  it("does not emit sp-select when disabled", async () => {
    const el = createMenuItem();
    el.disabled = true;
    await el.updateComplete;
    const listener = vi.fn();
    el.addEventListener("sp-select", listener);
    el._handleClick();
    expect(listener).not.toHaveBeenCalled();
  });

  it("emits sp-select on Enter keydown", async () => {
    const el = createMenuItem();
    el.value = "key-action";
    await el.updateComplete;
    const listener = vi.fn();
    el.addEventListener("sp-select", listener);
    el._handleKeydown(new KeyboardEvent("keydown", { key: "Enter" }));
    expect(listener).toHaveBeenCalledOnce();
  });

  it("emits sp-select on Space keydown", async () => {
    const el = createMenuItem();
    el.value = "key-action";
    await el.updateComplete;
    const listener = vi.fn();
    el.addEventListener("sp-select", listener);
    el._handleKeydown(new KeyboardEvent("keydown", { key: " " }));
    expect(listener).toHaveBeenCalledOnce();
  });

  it("has no tabindex when disabled", async () => {
    const el = createMenuItem();
    el.disabled = true;
    await el.updateComplete;
    const item = el.shadowRoot?.querySelector(".sp-menu-item");
    expect(item?.hasAttribute("tabindex")).toBe(false);
  });
});
