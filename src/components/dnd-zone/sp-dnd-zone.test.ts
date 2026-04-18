import { describe, it, expect, beforeEach, vi } from "vitest";
import "./sp-dnd-zone.js";
import type { SpDndZoneComponent } from "./sp-dnd-zone.js";

function createElement(items = [{ id: "1", label: "Item 1" }, { id: "2", label: "Item 2" }]): SpDndZoneComponent {
  const el = document.createElement("sp-dnd-zone") as SpDndZoneComponent;
  el.items = items;
  document.body.appendChild(el);
  return el;
}

describe("sp-dnd-zone", () => {
  let el: SpDndZoneComponent;

  beforeEach(() => {
    document.body.innerHTML = "";
    el = createElement();
  });

  it("renders the zone container in shadow DOM", async () => {
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-dnd-zone")).not.toBeNull();
  });

  it("renders items", async () => {
    await el.updateComplete;
    const items = el.shadowRoot?.querySelectorAll(".sp-dnd-item");
    expect(items?.length).toBe(2);
  });

  it("shows placeholder when items array is empty", async () => {
    el.items = [];
    await el.updateComplete;
    const label = el.shadowRoot?.querySelector(".sp-dnd-zone-label");
    expect(label).not.toBeNull();
  });

  it("shows custom placeholder text", async () => {
    el.items = [];
    el.placeholder = "Suelta aquí";
    await el.updateComplete;
    const label = el.shadowRoot?.querySelector(".sp-dnd-zone-label");
    expect(label?.textContent?.trim()).toBe("Suelta aquí");
  });

  it("renders item labels", async () => {
    el.items = [{ id: "a", label: "Mi Item" }];
    await el.updateComplete;
    const item = el.shadowRoot?.querySelector(".sp-dnd-item");
    expect(item?.textContent).toContain("Mi Item");
  });

  it("renders drag handles for each item", async () => {
    await el.updateComplete;
    const handles = el.shadowRoot?.querySelectorAll(".sp-dnd-handle");
    expect(handles?.length).toBe(2);
  });

  it("has default group of 'default'", async () => {
    await el.updateComplete;
    expect(el.group).toBe("default");
  });

  it("reflects group attribute", async () => {
    el.group = "my-group";
    await el.updateComplete;
    expect(el.group).toBe("my-group");
  });

  it("hides placeholder when items are present", async () => {
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-dnd-zone-label")).toBeNull();
  });

  it("items array is reactive", async () => {
    await el.updateComplete;
    el.items = [{ id: "new", label: "Nuevo" }];
    await el.updateComplete;
    const items = el.shadowRoot?.querySelectorAll(".sp-dnd-item");
    expect(items?.length).toBe(1);
    expect(items?.[0]?.textContent).toContain("Nuevo");
  });
});
