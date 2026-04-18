import { describe, it, expect, beforeEach, vi } from "vitest";
import "./sp-org-chart.js";
import type { SpOrgChartComponent } from "./sp-org-chart.js";

function createElement(): SpOrgChartComponent {
  const el = document.createElement("sp-org-chart") as SpOrgChartComponent;
  document.body.appendChild(el);
  return el;
}

describe("sp-org-chart", () => {
  let el: SpOrgChartComponent;

  beforeEach(() => {
    document.body.innerHTML = "";
    el = createElement();
  });

  it("renders the org container in shadow DOM when data is set", async () => {
    el.data = { id: "1", name: "CEO" };
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-org")).not.toBeNull();
  });

  it("shows empty state when data is null", async () => {
    await el.updateComplete;
    const text = el.shadowRoot?.textContent;
    expect(text).toContain("Sin datos");
  });

  it("renders root node card when data is set", async () => {
    el.data = { id: "1", name: "CEO", role: "Director" };
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-org-card")).not.toBeNull();
  });

  it("shows node name", async () => {
    el.data = { id: "1", name: "Ana García", role: "CTO" };
    await el.updateComplete;
    const name = el.shadowRoot?.querySelector(".sp-org-name");
    expect(name?.textContent?.trim()).toBe("Ana García");
  });

  it("shows node role", async () => {
    el.data = { id: "1", name: "Ana García", role: "CTO" };
    await el.updateComplete;
    const role = el.shadowRoot?.querySelector(".sp-org-role");
    expect(role?.textContent?.trim()).toBe("CTO");
  });

  it("renders children nodes", async () => {
    el.data = {
      id: "1", name: "CEO",
      children: [
        { id: "2", name: "CTO" },
        { id: "3", name: "CFO" },
      ],
    };
    await el.updateComplete;
    const names = el.shadowRoot?.querySelectorAll(".sp-org-name");
    expect(names?.length).toBe(3);
  });

  it("renders collapse button for nodes with children", async () => {
    el.data = { id: "1", name: "CEO", children: [{ id: "2", name: "CTO" }] };
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-org-collapse-btn")).not.toBeNull();
  });

  it("collapses children when collapse button is clicked", async () => {
    el.data = { id: "1", name: "CEO", children: [{ id: "2", name: "CTO" }] };
    await el.updateComplete;
    const collapseBtn = el.shadowRoot?.querySelector<HTMLButtonElement>(".sp-org-collapse-btn");
    collapseBtn?.click();
    await el.updateComplete;
    expect(collapseBtn?.textContent?.trim()).toBe("+");
  });

  it("emits sp-select event when card is clicked", async () => {
    el.data = { id: "root", name: "CEO" };
    await el.updateComplete;
    const listener = vi.fn();
    el.addEventListener("sp-select", listener);
    el.shadowRoot?.querySelector<HTMLElement>(".sp-org-card")?.click();
    await el.updateComplete;
    expect(listener).toHaveBeenCalledOnce();
    expect((listener.mock.calls[0]![0] as CustomEvent).detail.id).toBe("root");
  });

  it("marks selected node with selected class", async () => {
    el.data = { id: "root", name: "CEO" };
    el.selectedId = "root";
    await el.updateComplete;
    const card = el.shadowRoot?.querySelector(".sp-org-card");
    expect(card?.classList.contains("selected")).toBe(true);
  });
});
