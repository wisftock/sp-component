import { describe, it, expect, beforeEach, vi } from "vitest";
import "./sp-table.js";
import type { SpTableComponent } from "./sp-table.js";
import type { SpTableColumn } from "./sp-table.types.js";

const SAMPLE_COLUMNS: SpTableColumn[] = [
  { key: "name", label: "Name", sortable: true },
  { key: "age", label: "Age", sortable: true },
  { key: "city", label: "City" },
];

const SAMPLE_DATA = [
  { name: "Alice", age: 30, city: "Madrid" },
  { name: "Bob", age: 25, city: "Barcelona" },
  { name: "Carol", age: 35, city: "Seville" },
];

function createElement(): SpTableComponent {
  const el = document.createElement("sp-table") as SpTableComponent;
  document.body.appendChild(el);
  return el;
}

describe("sp-table", () => {
  let el: SpTableComponent;

  beforeEach(() => {
    document.body.innerHTML = "";
    el = createElement();
    el.columns = SAMPLE_COLUMNS;
    el.data = SAMPLE_DATA;
  });

  it("renders a table element", async () => {
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector("table")).not.toBeNull();
  });

  it("renders correct number of headers", async () => {
    await el.updateComplete;
    const headers = el.shadowRoot?.querySelectorAll("th");
    expect(headers?.length).toBe(3);
  });

  it("renders header labels correctly", async () => {
    await el.updateComplete;
    const headers = el.shadowRoot?.querySelectorAll("th");
    expect(headers?.[0]?.textContent?.trim()).toContain("Name");
    expect(headers?.[1]?.textContent?.trim()).toContain("Age");
    expect(headers?.[2]?.textContent?.trim()).toContain("City");
  });

  it("renders correct number of data rows", async () => {
    await el.updateComplete;
    const rows = el.shadowRoot?.querySelectorAll("tbody tr");
    expect(rows?.length).toBe(3);
  });

  it("renders cell data correctly", async () => {
    await el.updateComplete;
    const firstRowCells = el.shadowRoot?.querySelectorAll("tbody tr:first-child td");
    expect(firstRowCells?.[0]?.textContent?.trim()).toBe("Alice");
    expect(firstRowCells?.[1]?.textContent?.trim()).toBe("30");
    expect(firstRowCells?.[2]?.textContent?.trim()).toBe("Madrid");
  });

  it("shows empty state when data is empty", async () => {
    el.data = [];
    await el.updateComplete;
    const empty = el.shadowRoot?.querySelector(".sp-table-empty");
    expect(empty?.textContent?.trim()).toBe("No data available");
  });

  it("shows custom emptyText", async () => {
    el.data = [];
    el.emptyText = "Nothing here";
    await el.updateComplete;
    const empty = el.shadowRoot?.querySelector(".sp-table-empty");
    expect(empty?.textContent?.trim()).toBe("Nothing here");
  });

  it("shows loading state when loading is true", async () => {
    el.loading = true;
    await el.updateComplete;
    const loading = el.shadowRoot?.querySelector(".sp-table-loading");
    expect(loading).not.toBeNull();
    expect(loading?.textContent?.trim()).toBe("Loading…");
  });

  it("does not show data rows when loading", async () => {
    el.loading = true;
    await el.updateComplete;
    const rows = el.shadowRoot?.querySelectorAll(".sp-table-row");
    expect(rows?.length).toBe(0);
  });

  it("sortable header click emits sp-sort event", async () => {
    await el.updateComplete;
    const listener = vi.fn();
    el.addEventListener("sp-sort", listener);
    const sortableHeader = el.shadowRoot?.querySelector(".sp-table-th--sortable") as HTMLElement;
    sortableHeader?.click();
    expect(listener).toHaveBeenCalledOnce();
  });

  it("sort direction cycles asc -> desc -> none", async () => {
    await el.updateComplete;
    const details: { key: string; direction: string }[] = [];
    el.addEventListener("sp-sort", (e) => {
      details.push((e as CustomEvent).detail);
    });

    const nameCol = SAMPLE_COLUMNS[0]!;
    el._handleSort(nameCol);
    expect(details[0]).toEqual({ key: "name", direction: "asc" });

    el._handleSort(nameCol);
    expect(details[1]).toEqual({ key: "name", direction: "desc" });

    el._handleSort(nameCol);
    expect(details[2]).toEqual({ key: "", direction: "none" });
  });

  it("clicking different column resets sort to asc", async () => {
    await el.updateComplete;
    el.sortKey = "name";
    el.sortDirection = "desc";

    const details: { key: string; direction: string }[] = [];
    el.addEventListener("sp-sort", (e) => {
      details.push((e as CustomEvent).detail);
    });

    el._handleSort(SAMPLE_COLUMNS[1]!);
    expect(details[0]).toEqual({ key: "age", direction: "asc" });
  });

  it("striped applies class to odd rows", async () => {
    el.striped = true;
    await el.updateComplete;
    const rows = el.shadowRoot?.querySelectorAll("tbody tr");
    expect(rows?.[1]?.classList.contains("sp-table-row--striped")).toBe(true);
    expect(rows?.[0]?.classList.contains("sp-table-row--striped")).toBe(false);
  });

  it("bordered reflects attribute", async () => {
    el.bordered = true;
    await el.updateComplete;
    expect(el.hasAttribute("bordered")).toBe(true);
  });

  it("hoverable reflects attribute", async () => {
    await el.updateComplete;
    expect(el.hasAttribute("hoverable")).toBe(true);
  });

  it("compact reflects attribute", async () => {
    el.compact = true;
    await el.updateComplete;
    expect(el.hasAttribute("compact")).toBe(true);
  });

  it("non-sortable column click does not emit sp-sort", async () => {
    await el.updateComplete;
    const listener = vi.fn();
    el.addEventListener("sp-sort", listener);
    el._handleSort(SAMPLE_COLUMNS[2]!); // city is not sortable
    expect(listener).not.toHaveBeenCalled();
  });
});
