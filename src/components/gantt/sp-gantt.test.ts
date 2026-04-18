import { describe, it, expect, beforeEach } from "vitest";
import "./sp-gantt.js";
import type { SpGanttComponent } from "./sp-gantt.js";

function createElement(): SpGanttComponent {
  const el = document.createElement("sp-gantt") as SpGanttComponent;
  document.body.appendChild(el);
  return el;
}

describe("sp-gantt", () => {
  let el: SpGanttComponent;

  beforeEach(() => {
    document.body.innerHTML = "";
    el = createElement();
  });

  it("renders the gantt container in shadow DOM", async () => {
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-gantt")).not.toBeNull();
  });

  it("has default zoom of week", async () => {
    await el.updateComplete;
    expect(el.zoom).toBe("week");
  });

  it("renders toolbar with zoom buttons", async () => {
    await el.updateComplete;
    const buttons = el.shadowRoot?.querySelectorAll(".sp-gantt-zoom button");
    expect(buttons?.length).toBe(3);
  });

  it("renders task list panel", async () => {
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-gantt-tasks")).not.toBeNull();
  });

  it("renders chart area", async () => {
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-gantt-chart")).not.toBeNull();
  });

  it("renders task rows for each task", async () => {
    el.tasks = [
      { id: "1", name: "Task A", start: "2025-01-01", end: "2025-01-10" },
      { id: "2", name: "Task B", start: "2025-01-05", end: "2025-01-15" },
    ];
    await el.updateComplete;
    const rows = el.shadowRoot?.querySelectorAll(".sp-gantt-task-row");
    expect(rows?.length).toBe(2);
  });

  it("shows task name in task list", async () => {
    el.tasks = [{ id: "1", name: "Mi Tarea", start: "2025-01-01", end: "2025-01-10" }];
    await el.updateComplete;
    const taskNames = el.shadowRoot?.querySelectorAll(".sp-gantt-task-name");
    expect(taskNames?.[0]?.textContent?.trim()).toBe("Mi Tarea");
  });

  it("renders gantt bars for tasks", async () => {
    el.tasks = [{ id: "1", name: "Task", start: "2025-01-01", end: "2025-01-10" }];
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-gantt-bar")).not.toBeNull();
  });

  it("changes zoom when day button is clicked", async () => {
    await el.updateComplete;
    const dayBtn = el.shadowRoot?.querySelector<HTMLButtonElement>(".sp-gantt-zoom button:first-child");
    dayBtn?.click();
    await el.updateComplete;
    expect(dayBtn?.classList.contains("active")).toBe(true);
  });

  it("shows title in toolbar", async () => {
    el.title = "Mi Proyecto";
    await el.updateComplete;
    const toolbar = el.shadowRoot?.querySelector(".sp-gantt-toolbar");
    expect(toolbar?.textContent).toContain("Mi Proyecto");
  });
});
