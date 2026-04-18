import { describe, it, expect, beforeEach } from "vitest";
import "./sp-cascader.js";
import type { SpCascaderComponent, SpCascaderOption } from "./sp-cascader.js";

function createElement(): SpCascaderComponent {
  const el = document.createElement("sp-cascader") as SpCascaderComponent;
  document.body.appendChild(el);
  return el;
}

const OPTIONS: SpCascaderOption[] = [
  {
    value: "mx", label: "México",
    children: [
      { value: "mx-cdmx", label: "CDMX" },
      { value: "mx-jal", label: "Jalisco" },
    ],
  },
  {
    value: "us", label: "USA",
    children: [
      { value: "us-ca", label: "California" },
    ],
  },
];

describe("sp-cascader", () => {
  let el: SpCascaderComponent;
  beforeEach(() => { document.body.innerHTML = ""; el = createElement(); });

  it("renders trigger in shadow DOM", async () => {
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-casc-trigger")).not.toBeNull();
  });

  it("shows placeholder when no value", async () => {
    await el.updateComplete;
    const text = el.shadowRoot?.querySelector(".sp-casc-trigger-text");
    expect(text?.textContent?.trim()).toBeTruthy();
  });

  it("opens panel on trigger click", async () => {
    el.options = OPTIONS;
    await el.updateComplete;
    const trigger = el.shadowRoot?.querySelector<HTMLElement>(".sp-casc-trigger");
    trigger?.click();
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-casc-panel")).not.toBeNull();
  });

  it("renders first level columns", async () => {
    el.options = OPTIONS;
    el.open = true;
    await el.updateComplete;
    const items = el.shadowRoot?.querySelectorAll(".sp-casc-item");
    expect(items?.length).toBe(2);
  });

  it("fires sp-change on leaf selection", async () => {
    el.options = [{ value: "a", label: "A", children: [{ value: "a1", label: "A1" }] }];
    el.open = true;
    await el.updateComplete;
    const received: CustomEvent[] = [];
    el.addEventListener("sp-change", (e) => received.push(e as CustomEvent));
    // click first column item (parent with children)
    const items = el.shadowRoot?.querySelectorAll<HTMLElement>(".sp-casc-item");
    items?.[0]?.click();
    await el.updateComplete;
    // click leaf in second column
    const items2 = el.shadowRoot?.querySelectorAll<HTMLElement>(".sp-casc-item");
    items2?.[1]?.click();
    expect(received.length).toBe(1);
    expect(received[0].detail.value).toEqual(["a", "a1"]);
  });

  it("shows clear button when value is set and clearable", async () => {
    el.options = OPTIONS;
    el.value = ["mx", "mx-cdmx"];
    el.clearable = true;
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-casc-clear")).not.toBeNull();
  });

  it("fires sp-clear on clear click", async () => {
    el.options = OPTIONS;
    el.value = ["mx", "mx-cdmx"];
    el.clearable = true;
    await el.updateComplete;
    const received: CustomEvent[] = [];
    el.addEventListener("sp-clear", (e) => received.push(e as CustomEvent));
    const clearBtn = el.shadowRoot?.querySelector<HTMLElement>(".sp-casc-clear");
    clearBtn?.click();
    expect(received.length).toBe(1);
    expect(el.value).toEqual([]);
  });

  it("does not open when disabled", async () => {
    el.options = OPTIONS;
    el.disabled = true;
    await el.updateComplete;
    const trigger = el.shadowRoot?.querySelector<HTMLElement>(".sp-casc-trigger");
    trigger?.click();
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-casc-panel")).toBeNull();
  });
});
