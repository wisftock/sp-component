import { describe, it, expect, beforeEach } from "vitest";
import "./sp-virtual-list.js";
import type { SpVirtualListComponent } from "./sp-virtual-list.js";

function createElement(): SpVirtualListComponent {
  const el = document.createElement("sp-virtual-list") as SpVirtualListComponent;
  document.body.appendChild(el);
  return el;
}

describe("sp-virtual-list", () => {
  let el: SpVirtualListComponent;
  beforeEach(() => { document.body.innerHTML = ""; el = createElement(); });

  it("renders scroll container in shadow DOM", async () => {
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-vl-scroll")).not.toBeNull();
  });

  it("defaults to item-height 48", async () => {
    await el.updateComplete;
    expect(el.itemHeight).toBe(48);
  });

  it("defaults to height 400px", async () => {
    await el.updateComplete;
    expect(el.height).toBe("400px");
  });

  it("renders visible items", async () => {
    el.items = Array.from({ length: 100 }, (_, i) => `Item ${i}`);
    await el.updateComplete;
    const items = el.shadowRoot?.querySelectorAll(".sp-vl-item");
    expect(items?.length).toBeGreaterThan(0);
  });

  it("does not render all items at once", async () => {
    el.items = Array.from({ length: 1000 }, (_, i) => i);
    el.itemHeight = 48;
    await el.updateComplete;
    const items = el.shadowRoot?.querySelectorAll(".sp-vl-item");
    expect(items!.length).toBeLessThan(1000);
  });

  it("renders spacer with total height", async () => {
    el.items = Array.from({ length: 100 }, (_, i) => i);
    el.itemHeight = 50;
    await el.updateComplete;
    const spacer = el.shadowRoot?.querySelector<HTMLElement>(".sp-vl-spacer");
    expect(spacer?.style.height).toBe("5000px");
  });

  it("fires sp-item-click on item click", async () => {
    el.items = ["a", "b", "c"];
    el.renderItem = (item) => item as string;
    await el.updateComplete;
    const received: CustomEvent[] = [];
    el.addEventListener("sp-item-click", (e) => received.push(e as CustomEvent));
    const item = el.shadowRoot?.querySelector<HTMLElement>(".sp-vl-item");
    item?.click();
    expect(received.length).toBe(1);
    expect(received[0].detail.item).toBe("a");
  });

  it("accepts custom renderItem function", async () => {
    el.items = [{ name: "Test" }];
    el.renderItem = (item: unknown) => (item as { name: string }).name;
    await el.updateComplete;
    const item = el.shadowRoot?.querySelector(".sp-vl-item");
    expect(item).not.toBeNull();
  });

  it("handles empty items array", async () => {
    el.items = [];
    await el.updateComplete;
    const items = el.shadowRoot?.querySelectorAll(".sp-vl-item");
    expect(items?.length).toBe(0);
  });
});
