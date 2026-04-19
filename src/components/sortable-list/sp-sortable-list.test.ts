import { describe, it, expect, beforeEach, vi } from "vitest";
import "./sp-sortable-list.js";
import type { SpSortableListComponent, SortableItem } from "./sp-sortable-list.js";

const ITEMS: SortableItem[] = [
  { id: "a", label: "Item A", description: "Desc A", icon: "🔴" },
  { id: "b", label: "Item B", description: "Desc B" },
  { id: "c", label: "Item C", disabled: true },
];

function createElement(): SpSortableListComponent {
  const el = document.createElement("sp-sortable-list") as SpSortableListComponent;
  document.body.appendChild(el);
  return el;
}

describe("sp-sortable-list", () => {
  let el: SpSortableListComponent;

  beforeEach(() => {
    document.body.innerHTML = "";
    el = createElement();
  });

  // ── Renderizado base ─────────────────────────────────────────────────────

  it("renderiza una lista vacía sin ítems", async () => {
    await el.updateComplete;
    const items = el.shadowRoot?.querySelectorAll("li");
    expect(items?.length).toBe(0);
  });

  it("renderiza el número correcto de ítems", async () => {
    el.items = ITEMS;
    await el.updateComplete;
    const items = el.shadowRoot?.querySelectorAll("li.sp-sl-item");
    expect(items?.length).toBe(3);
  });

  it("renderiza el label de cada ítem", async () => {
    el.items = ITEMS;
    await el.updateComplete;
    const labels = el.shadowRoot?.querySelectorAll(".sp-sl-label");
    expect(labels?.[0]?.textContent?.trim()).toBe("Item A");
    expect(labels?.[1]?.textContent?.trim()).toBe("Item B");
    expect(labels?.[2]?.textContent?.trim()).toBe("Item C");
  });

  it("renderiza la descripción cuando está disponible", async () => {
    el.items = ITEMS;
    await el.updateComplete;
    const descs = el.shadowRoot?.querySelectorAll(".sp-sl-desc");
    expect(descs?.length).toBe(2);
    expect(descs?.[0]?.textContent?.trim()).toBe("Desc A");
  });

  it("renderiza el ícono cuando está disponible", async () => {
    el.items = ITEMS;
    await el.updateComplete;
    const icons = el.shadowRoot?.querySelectorAll(".sp-sl-icon");
    expect(icons?.length).toBe(1);
  });

  // ── Prop: disabled ───────────────────────────────────────────────────────

  it("disabled=false por defecto", async () => {
    await el.updateComplete;
    expect(el.disabled).toBe(false);
  });

  it("ítems disabled tienen draggable=false", async () => {
    el.items = ITEMS;
    await el.updateComplete;
    const listItems = el.shadowRoot?.querySelectorAll<HTMLElement>("li");
    expect(listItems?.[2]?.getAttribute("draggable")).toBe("false");
  });

  it("todos los ítems tienen draggable=false cuando disabled=true en el componente", async () => {
    el.items = ITEMS;
    el.disabled = true;
    await el.updateComplete;
    const listItems = el.shadowRoot?.querySelectorAll<HTMLElement>("li");
    listItems?.forEach(li => {
      expect(li.getAttribute("draggable")).toBe("false");
    });
  });

  it("ítems habilitados tienen draggable=true", async () => {
    el.items = ITEMS;
    await el.updateComplete;
    const listItems = el.shadowRoot?.querySelectorAll<HTMLElement>("li");
    expect(listItems?.[0]?.getAttribute("draggable")).toBe("true");
    expect(listItems?.[1]?.getAttribute("draggable")).toBe("true");
  });

  // ── Prop: handles ────────────────────────────────────────────────────────

  it("handles=false por defecto (muestra grip al final)", async () => {
    el.items = ITEMS;
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-sl-grip")).not.toBeNull();
    expect(el.shadowRoot?.querySelector(".sp-sl-handle")).toBeNull();
  });

  it("handles=true muestra handle a la izquierda en lugar del grip", async () => {
    el.items = ITEMS;
    el.handles = true;
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-sl-handle")).not.toBeNull();
    expect(el.shadowRoot?.querySelector(".sp-sl-grip")).toBeNull();
  });

  // ── Ítems disabled ───────────────────────────────────────────────────────

  it("ítems con disabled=true tienen clase sp-sl-item--disabled", async () => {
    el.items = ITEMS;
    await el.updateComplete;
    const listItems = el.shadowRoot?.querySelectorAll("li");
    expect(listItems?.[2]?.classList.contains("sp-sl-item--disabled")).toBe(true);
  });

  it("ítems habilitados no tienen clase sp-sl-item--disabled", async () => {
    el.items = ITEMS;
    await el.updateComplete;
    const listItems = el.shadowRoot?.querySelectorAll("li");
    expect(listItems?.[0]?.classList.contains("sp-sl-item--disabled")).toBe(false);
  });

  // ── Evento sp-change ─────────────────────────────────────────────────────

  it("emite sp-change al soltar un ítem en otra posición", async () => {
    el.items = [...ITEMS];
    await el.updateComplete;

    const handler = vi.fn();
    el.addEventListener("sp-change", handler);

    const listItems = el.shadowRoot?.querySelectorAll<HTMLElement>("li")!;

    // Simula drag de A sobre B
    const dragStartEvent = new DragEvent("dragstart", { bubbles: true, composed: true });
    Object.defineProperty(dragStartEvent, "dataTransfer", {
      value: { effectAllowed: "", setData: vi.fn(), getData: () => "a" },
    });
    listItems[0]!.dispatchEvent(dragStartEvent);

    const dropEvent = new DragEvent("drop", { bubbles: true, composed: true });
    Object.defineProperty(dropEvent, "dataTransfer", {
      value: { dropEffect: "", getData: () => "a" },
    });
    listItems[1]!.dispatchEvent(dropEvent);

    expect(handler).toHaveBeenCalledTimes(1);
    const detail = (handler.mock.calls[0]![0] as CustomEvent).detail;
    expect(detail.items).toBeDefined();
    expect(Array.isArray(detail.items)).toBe(true);
  });

  it("no emite sp-change si se suelta en el mismo ítem", async () => {
    el.items = [...ITEMS];
    await el.updateComplete;

    const handler = vi.fn();
    el.addEventListener("sp-change", handler);

    const listItems = el.shadowRoot?.querySelectorAll<HTMLElement>("li")!;

    const dragStartEvent = new DragEvent("dragstart", { bubbles: true, composed: true });
    Object.defineProperty(dragStartEvent, "dataTransfer", {
      value: { effectAllowed: "", setData: vi.fn(), getData: () => "a" },
    });
    listItems[0]!.dispatchEvent(dragStartEvent);

    const dropEvent = new DragEvent("drop", { bubbles: true, composed: true });
    Object.defineProperty(dropEvent, "dataTransfer", {
      value: { dropEffect: "", getData: () => "a" },
    });
    listItems[0]!.dispatchEvent(dropEvent);

    expect(handler).not.toHaveBeenCalled();
  });

  it("no emite sp-change cuando disabled=true", async () => {
    el.items = [...ITEMS];
    el.disabled = true;
    await el.updateComplete;

    const handler = vi.fn();
    el.addEventListener("sp-change", handler);

    const listItems = el.shadowRoot?.querySelectorAll<HTMLElement>("li")!;
    const dragStartEvent = new DragEvent("dragstart", { bubbles: true, composed: true });
    Object.defineProperty(dragStartEvent, "dataTransfer", {
      value: { effectAllowed: "", setData: vi.fn() },
    });
    listItems[0]!.dispatchEvent(dragStartEvent);

    expect(handler).not.toHaveBeenCalled();
  });

  // ── Estructura accesible ─────────────────────────────────────────────────

  it("el listbox tiene role=listbox", async () => {
    await el.updateComplete;
    const list = el.shadowRoot?.querySelector("ul");
    expect(list?.getAttribute("role")).toBe("listbox");
  });

  it("los ítems tienen aria-grabbed", async () => {
    el.items = ITEMS;
    await el.updateComplete;
    const listItems = el.shadowRoot?.querySelectorAll("li");
    listItems?.forEach(li => {
      expect(li.hasAttribute("aria-grabbed")).toBe(true);
    });
  });
});
