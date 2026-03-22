import { describe, it, expect, beforeEach, vi } from "vitest";
import "./sp-command-palette.js";
import type { SpCommandPaletteComponent } from "./sp-command-palette.js";
import type { CommandItem } from "./sp-command-palette.types.js";

function createElement(): SpCommandPaletteComponent {
  const el = document.createElement(
    "sp-command-palette",
  ) as SpCommandPaletteComponent;
  document.body.appendChild(el);
  return el;
}

const sampleItems: CommandItem[] = [
  {
    id: "1",
    label: "New File",
    description: "Create a new file",
    group: "File",
    keywords: ["create", "file"],
    action: vi.fn(),
  },
  {
    id: "2",
    label: "Open Settings",
    description: "Open application settings",
    group: "Application",
    action: vi.fn(),
  },
  {
    id: "3",
    label: "Toggle Theme",
    description: "Switch between light and dark",
    group: "Application",
    action: vi.fn(),
  },
  {
    id: "4",
    label: "Disabled Action",
    description: "This is disabled",
    disabled: true,
    action: vi.fn(),
  },
];

describe("sp-command-palette", () => {
  let el: SpCommandPaletteComponent;

  beforeEach(() => {
    document.body.innerHTML = "";
    el = createElement();
  });

  it("renders nothing when closed", async () => {
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-command-palette")).toBeNull();
    expect(el.shadowRoot?.querySelector(".sp-command-palette-backdrop")).toBeNull();
  });

  it("renders dialog when open", async () => {
    el.open = true;
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-command-palette")).not.toBeNull();
    expect(el.shadowRoot?.querySelector(".sp-command-palette-backdrop")).not.toBeNull();
  });

  it("setItems populates items list", async () => {
    el.setItems(sampleItems);
    el.open = true;
    await el.updateComplete;
    const items = el.shadowRoot?.querySelectorAll(".sp-command-item");
    expect(items?.length).toBe(sampleItems.length);
  });

  it("input filters items by label", async () => {
    el.setItems(sampleItems);
    el.open = true;
    await el.updateComplete;
    el._query = "settings";
    el._activeIndex = 0;
    await el.updateComplete;
    const filtered = el._getFilteredItems();
    expect(filtered.length).toBe(1);
    expect(filtered[0]?.label).toBe("Open Settings");
  });

  it("ArrowDown moves active index down", async () => {
    el.setItems(sampleItems);
    el.open = true;
    await el.updateComplete;
    el._activeIndex = 0;
    const event = new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true });
    el._handleKeydown(event);
    expect(el._activeIndex).toBe(1);
  });

  it("ArrowUp moves active index up", async () => {
    el.setItems(sampleItems);
    el.open = true;
    await el.updateComplete;
    el._activeIndex = 2;
    const event = new KeyboardEvent("keydown", { key: "ArrowUp", bubbles: true });
    el._handleKeydown(event);
    expect(el._activeIndex).toBe(1);
  });

  it("ArrowDown wraps from last to first", async () => {
    el.setItems(sampleItems);
    el.open = true;
    await el.updateComplete;
    el._activeIndex = sampleItems.length - 1;
    const event = new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true });
    el._handleKeydown(event);
    expect(el._activeIndex).toBe(0);
  });

  it("Enter executes action and closes", async () => {
    const actionFn = vi.fn();
    el.setItems([{ id: "a", label: "Action", action: actionFn }]);
    el.open = true;
    await el.updateComplete;
    el._activeIndex = 0;
    const event = new KeyboardEvent("keydown", { key: "Enter", bubbles: true });
    el._handleKeydown(event);
    expect(actionFn).toHaveBeenCalledOnce();
    expect(el.open).toBe(false);
  });

  it("Escape closes the palette", async () => {
    el.open = true;
    await el.updateComplete;
    const event = new KeyboardEvent("keydown", { key: "Escape", bubbles: true });
    el._handleKeydown(event);
    expect(el.open).toBe(false);
  });

  it("emits sp-select when item is activated", async () => {
    const listener = vi.fn();
    el.addEventListener("sp-select", listener);
    el.setItems([{ id: "x", label: "Test", action: vi.fn() }]);
    el.open = true;
    await el.updateComplete;
    el._activeIndex = 0;
    const event = new KeyboardEvent("keydown", { key: "Enter", bubbles: true });
    el._handleKeydown(event);
    expect(listener).toHaveBeenCalledOnce();
    expect(listener.mock.calls[0][0].detail.item.id).toBe("x");
  });

  it("emits sp-close when closing", async () => {
    const listener = vi.fn();
    el.addEventListener("sp-close", listener);
    el.open = true;
    await el.updateComplete;
    el._close();
    expect(listener).toHaveBeenCalledOnce();
  });

  it("open prop reflects attribute", async () => {
    el.open = true;
    await el.updateComplete;
    expect(el.hasAttribute("open")).toBe(true);
    el.open = false;
    await el.updateComplete;
    expect(el.hasAttribute("open")).toBe(false);
  });

  it("renders empty message when no items match query", async () => {
    el.setItems(sampleItems);
    el.open = true;
    el._query = "xyzzy123notfound";
    await el.updateComplete;
    // Force a re-render by requesting update
    el.requestUpdate();
    await el.updateComplete;
    const empty = el.shadowRoot?.querySelector(".sp-command-empty");
    expect(empty).not.toBeNull();
  });

  it("renders loading state", async () => {
    el.loading = true;
    el.open = true;
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-command-loading")).not.toBeNull();
  });
});
