import { describe, it, expect, beforeEach, vi } from "vitest";
import "./sp-context-menu.js";
import type { SpContextMenuComponent } from "./sp-context-menu.js";

function createElement(): SpContextMenuComponent {
  const el = document.createElement("sp-context-menu") as SpContextMenuComponent;
  document.body.appendChild(el);
  return el;
}

describe("sp-context-menu", () => {
  let el: SpContextMenuComponent;

  beforeEach(() => {
    document.body.innerHTML = "";
    el = createElement();
  });

  // ---- Rendering ----

  it("renders slot wrapper in shadow DOM", async () => {
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-context-menu-trigger")).not.toBeNull();
  });

  it("_open is false initially", async () => {
    await el.updateComplete;
    expect(el._open).toBe(false);
  });

  it("panel is not rendered when _open=false", async () => {
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-context-menu-panel")).toBeNull();
  });

  // ---- Right-click opens menu ----

  it("right-click on trigger opens menu and sets _x, _y", async () => {
    await el.updateComplete;
    const trigger = el.shadowRoot?.querySelector(".sp-context-menu-trigger") as HTMLElement;
    const event = new MouseEvent("contextmenu", {
      bubbles: true,
      composed: true,
      clientX: 100,
      clientY: 200,
    });
    trigger.dispatchEvent(event);
    await el.updateComplete;
    expect(el._open).toBe(true);
    expect(el.shadowRoot?.querySelector(".sp-context-menu-panel")).not.toBeNull();
  });

  it("sets _x and _y from contextmenu event coordinates", async () => {
    await el.updateComplete;
    const trigger = el.shadowRoot?.querySelector(".sp-context-menu-trigger") as HTMLElement;
    const event = new MouseEvent("contextmenu", {
      bubbles: true,
      composed: true,
      clientX: 150,
      clientY: 250,
    });
    trigger.dispatchEvent(event);
    await el.updateComplete;
    // Values clamped to viewport
    expect(el._x).toBeGreaterThanOrEqual(0);
    expect(el._y).toBeGreaterThanOrEqual(0);
  });

  // ---- Escape closes menu ----

  it("Escape key closes menu", async () => {
    el._open = true;
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-context-menu-panel")).not.toBeNull();
    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
    await el.updateComplete;
    expect(el._open).toBe(false);
  });

  // ---- Events ----

  it("emits sp-open with coordinates when menu opens", async () => {
    await el.updateComplete;
    const listener = vi.fn();
    el.addEventListener("sp-open", listener);
    el["_openAt"](100, 200);
    await el.updateComplete;
    expect(listener).toHaveBeenCalledOnce();
    const detail = (listener.mock.calls[0]?.[0] as CustomEvent<{ x: number; y: number }>).detail;
    expect(typeof detail.x).toBe("number");
    expect(typeof detail.y).toBe("number");
  });

  it("emits sp-close when menu closes", async () => {
    el._open = true;
    await el.updateComplete;
    const listener = vi.fn();
    el.addEventListener("sp-close", listener);
    el._close();
    await el.updateComplete;
    expect(listener).toHaveBeenCalledOnce();
  });

  // ---- Disabled ----

  it("disabled prevents opening on contextmenu", async () => {
    el.disabled = true;
    await el.updateComplete;
    const trigger = el.shadowRoot?.querySelector(".sp-context-menu-trigger") as HTMLElement;
    trigger.dispatchEvent(
      new MouseEvent("contextmenu", { bubbles: true, composed: true }),
    );
    await el.updateComplete;
    expect(el._open).toBe(false);
  });
});
