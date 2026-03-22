import { describe, it, expect, beforeEach, vi } from "vitest";
import "./sp-split-panel.js";
import type { SpSplitPanelComponent } from "./sp-split-panel.js";

function createElement(): SpSplitPanelComponent {
  const el = document.createElement("sp-split-panel") as SpSplitPanelComponent;
  document.body.appendChild(el);
  return el;
}

describe("sp-split-panel", () => {
  let el: SpSplitPanelComponent;

  beforeEach(() => {
    document.body.innerHTML = "";
    el = createElement();
  });

  it("renders both start and end panels", async () => {
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-split-panel-start")).not.toBeNull();
    expect(el.shadowRoot?.querySelector(".sp-split-panel-end")).not.toBeNull();
  });

  it("default position is 50", async () => {
    await el.updateComplete;
    expect(el.position).toBe(50);
    expect(el._currentPosition).toBe(50);
  });

  it("position prop updates --position CSS variable in style attribute", async () => {
    el.position = 30;
    await el.updateComplete;
    const panel = el.shadowRoot?.querySelector(".sp-split-panel") as HTMLElement;
    const styleAttr = panel?.getAttribute("style") ?? "";
    expect(styleAttr).toContain("30%");
  });

  it("sets _dragging to true on mousedown", async () => {
    await el.updateComplete;
    const divider = el.shadowRoot?.querySelector(".sp-split-panel-divider") as HTMLElement;
    const event = new MouseEvent("mousedown", { clientX: 100, clientY: 100, bubbles: true });
    el._startDrag(event);
    expect(el._dragging).toBe(true);
    // Cleanup
    window.dispatchEvent(new MouseEvent("mouseup"));
  });

  it("mouseup ends drag and emits sp-resize-end", async () => {
    await el.updateComplete;
    const listener = vi.fn();
    el.addEventListener("sp-resize-end", listener);
    const mousedown = new MouseEvent("mousedown", { clientX: 100, clientY: 100 });
    el._startDrag(mousedown);
    window.dispatchEvent(new MouseEvent("mouseup"));
    await el.updateComplete;
    expect(el._dragging).toBe(false);
    expect(listener).toHaveBeenCalledOnce();
  });

  it("position is clamped to min", async () => {
    el.min = 20;
    el.position = 5;
    // Simulate direct assignment
    el._currentPosition = 5;
    await el.updateComplete;
    // The position shouldn't go below min during keyboard drag
    el._currentPosition = 20;
    const event = new KeyboardEvent("keydown", { key: "ArrowLeft" });
    el._handleDividerKeydown(event);
    expect(el._currentPosition).toBeGreaterThanOrEqual(el.min);
  });

  it("position is clamped to max", async () => {
    el.max = 80;
    el._currentPosition = 80;
    await el.updateComplete;
    const event = new KeyboardEvent("keydown", { key: "ArrowRight" });
    el._handleDividerKeydown(event);
    expect(el._currentPosition).toBeLessThanOrEqual(el.max);
  });

  it("renders with horizontal orientation class", async () => {
    el.orientation = "horizontal";
    await el.updateComplete;
    const panel = el.shadowRoot?.querySelector(".sp-split-panel");
    expect(panel?.classList.contains("sp-split-panel--horizontal")).toBe(true);
  });

  it("renders with vertical orientation class", async () => {
    el.orientation = "vertical";
    await el.updateComplete;
    const panel = el.shadowRoot?.querySelector(".sp-split-panel");
    expect(panel?.classList.contains("sp-split-panel--vertical")).toBe(true);
  });

  it("disabled prevents dragging", async () => {
    el.disabled = true;
    await el.updateComplete;
    const event = new MouseEvent("mousedown", { clientX: 100, clientY: 100 });
    el._startDrag(event);
    expect(el._dragging).toBe(false);
  });

  it("emits sp-resize during keyboard drag", async () => {
    await el.updateComplete;
    const listener = vi.fn();
    el.addEventListener("sp-resize", listener);
    el._currentPosition = 50;
    const event = new KeyboardEvent("keydown", { key: "ArrowRight" });
    el._handleDividerKeydown(event);
    expect(listener).toHaveBeenCalledOnce();
    expect(listener.mock.calls[0][0].detail.position).toBe(51);
  });

  it("ArrowKey moves position by 1 percent", async () => {
    await el.updateComplete;
    el._currentPosition = 50;
    const event = new KeyboardEvent("keydown", { key: "ArrowRight" });
    el._handleDividerKeydown(event);
    expect(el._currentPosition).toBe(51);
  });
});
