import { describe, it, expect, beforeEach } from "vitest";
import "./sp-kanban.js";
import type { SpKanbanComponent, SpKanbanColumn } from "./sp-kanban.js";

function createElement(): SpKanbanComponent {
  const el = document.createElement("sp-kanban") as SpKanbanComponent;
  document.body.appendChild(el);
  return el;
}

const COLUMNS: SpKanbanColumn[] = [
  { id: "todo", title: "Por hacer", cards: [{ id: "c1", title: "Tarea 1" }, { id: "c2", title: "Tarea 2" }] },
  { id: "doing", title: "En progreso", cards: [{ id: "c3", title: "Tarea 3" }] },
  { id: "done", title: "Hecho", cards: [] },
];

describe("sp-kanban", () => {
  let el: SpKanbanComponent;
  beforeEach(() => { document.body.innerHTML = ""; el = createElement(); });

  it("renders kanban board in shadow DOM", async () => {
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-kanban")).not.toBeNull();
  });

  it("renders columns", async () => {
    el.columns = COLUMNS;
    await el.updateComplete;
    const cols = el.shadowRoot?.querySelectorAll(".sp-kanban-col");
    expect(cols?.length).toBe(3);
  });

  it("shows column titles", async () => {
    el.columns = COLUMNS;
    await el.updateComplete;
    const titles = el.shadowRoot?.querySelectorAll(".sp-kanban-col-title");
    expect(titles?.[0]?.textContent?.trim()).toBe("Por hacer");
  });

  it("renders cards in columns", async () => {
    el.columns = COLUMNS;
    await el.updateComplete;
    const cards = el.shadowRoot?.querySelectorAll(".sp-kanban-card");
    expect(cards?.length).toBe(3);
  });

  it("shows card titles", async () => {
    el.columns = COLUMNS;
    await el.updateComplete;
    const titles = el.shadowRoot?.querySelectorAll(".sp-kanban-card-title");
    expect(titles?.[0]?.textContent?.trim()).toBe("Tarea 1");
  });

  it("shows card count in column header", async () => {
    el.columns = COLUMNS;
    await el.updateComplete;
    const counts = el.shadowRoot?.querySelectorAll(".sp-kanban-col-count");
    expect(counts?.[0]?.textContent?.trim()).toBe("2");
  });

  it("renders add card button when addable", async () => {
    el.columns = COLUMNS;
    el.addable = true;
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-kanban-add-btn")).not.toBeNull();
  });

  it("renders description when card has one", async () => {
    el.columns = [{ id: "col", title: "Col", cards: [{ id: "c1", title: "T", description: "Descripción del ítem" }] }];
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-kanban-card-desc")?.textContent?.trim()).toBe("Descripción del ítem");
  });
});
