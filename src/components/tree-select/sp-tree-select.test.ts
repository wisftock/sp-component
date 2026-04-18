import { describe, it, expect, beforeEach } from "vitest";
import "./sp-tree-select.js";
import type { SpTreeSelectComponent, SpTreeSelectNode } from "./sp-tree-select.js";

function createElement(): SpTreeSelectComponent {
  const el = document.createElement("sp-tree-select") as SpTreeSelectComponent;
  document.body.appendChild(el);
  return el;
}

const OPTIONS: SpTreeSelectNode[] = [
  {
    value: "fruits", label: "Frutas",
    children: [
      { value: "apple", label: "Manzana" },
      { value: "banana", label: "Plátano" },
    ],
  },
  { value: "vegetables", label: "Verduras" },
];

describe("sp-tree-select", () => {
  let el: SpTreeSelectComponent;
  beforeEach(() => { document.body.innerHTML = ""; el = createElement(); });

  it("renders trigger in shadow DOM", async () => {
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-trs-trigger")).not.toBeNull();
  });

  it("shows placeholder when no value", async () => {
    await el.updateComplete;
    const trigger = el.shadowRoot?.querySelector(".sp-trs-trigger");
    expect(trigger?.textContent).toContain("Seleccionar");
  });

  it("opens dropdown on trigger click", async () => {
    el.options = OPTIONS;
    await el.updateComplete;
    const trigger = el.shadowRoot?.querySelector<HTMLElement>(".sp-trs-trigger");
    trigger?.click();
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-trs-panel")).not.toBeNull();
  });

  it("renders root nodes in dropdown", async () => {
    el.options = OPTIONS;
    el.open = true;
    await el.updateComplete;
    const nodes = el.shadowRoot?.querySelectorAll(".sp-trs-node");
    expect(nodes?.length).toBe(2);
  });

  it("renders search input when searchable is true", async () => {
    el.options = OPTIONS;
    el.open = true;
    el.searchable = true;
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-trs-search")).not.toBeNull();
  });

  it("fires sp-change on leaf node click", async () => {
    el.options = [{ value: "leaf", label: "Hoja" }];
    el.open = true;
    await el.updateComplete;
    const received: CustomEvent[] = [];
    el.addEventListener("sp-change", (e) => received.push(e as CustomEvent));
    const node = el.shadowRoot?.querySelector<HTMLElement>(".sp-trs-node");
    node?.click();
    expect(received.length).toBe(1);
    expect(received[0].detail.value).toBe("leaf");
  });

  it("closes panel after single selection", async () => {
    el.options = [{ value: "v", label: "V" }];
    el.open = true;
    await el.updateComplete;
    const node = el.shadowRoot?.querySelector<HTMLElement>(".sp-trs-node");
    node?.click();
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-trs-panel")).toBeNull();
  });

  it("does not open when disabled", async () => {
    el.options = OPTIONS;
    el.disabled = true;
    await el.updateComplete;
    const trigger = el.shadowRoot?.querySelector<HTMLElement>(".sp-trs-trigger");
    trigger?.click();
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-trs-panel")).toBeNull();
  });

  it("expands children on expand button click", async () => {
    el.options = OPTIONS;
    el.open = true;
    await el.updateComplete;
    const expandBtn = el.shadowRoot?.querySelector<HTMLButtonElement>(".sp-trs-expand:not(.sp-trs-expand--leaf)");
    expandBtn?.click();
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-trs-children")).not.toBeNull();
  });
});
