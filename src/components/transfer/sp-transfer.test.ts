import { describe, it, expect, beforeEach } from "vitest";
import "./sp-transfer.js";
import type { SpTransferComponent } from "./sp-transfer.js";

function createElement(): SpTransferComponent {
  const el = document.createElement("sp-transfer") as SpTransferComponent;
  document.body.appendChild(el);
  return el;
}

describe("sp-transfer", () => {
  let el: SpTransferComponent;
  beforeEach(() => { document.body.innerHTML = ""; el = createElement(); });

  it("renders transfer container in shadow DOM", async () => {
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-transfer")).not.toBeNull();
  });

  it("renders two panels", async () => {
    await el.updateComplete;
    const panels = el.shadowRoot?.querySelectorAll(".sp-transfer-panel");
    expect(panels?.length).toBe(2);
  });

  it("renders source items in left panel", async () => {
    el.source = [
      { value: "a", label: "Item A" },
      { value: "b", label: "Item B" },
    ];
    await el.updateComplete;
    const items = el.shadowRoot?.querySelectorAll(".sp-transfer-item");
    expect(items?.length).toBe(2);
  });

  it("items in value appear in right panel", async () => {
    el.source = [
      { value: "a", label: "Item A" },
      { value: "b", label: "Item B" },
    ];
    el.value = ["b"];
    await el.updateComplete;
    const panels = el.shadowRoot?.querySelectorAll(".sp-transfer-panel");
    const rightItems = panels?.[1]?.querySelectorAll(".sp-transfer-item");
    expect(rightItems?.length).toBe(1);
  });

  it("renders transfer action buttons", async () => {
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-transfer-actions")).not.toBeNull();
  });

  it("renders search inputs when searchable", async () => {
    el.searchable = true;
    await el.updateComplete;
    const searches = el.shadowRoot?.querySelectorAll(".sp-transfer-search");
    expect(searches?.length).toBe(2);
  });

  it("fires sp-change when items are moved right", async () => {
    el.source = [{ value: "a", label: "A" }];
    await el.updateComplete;
    const received: CustomEvent[] = [];
    el.addEventListener("sp-change", (e) => received.push(e as CustomEvent));
    // Select left item via checkbox
    const checkbox = el.shadowRoot?.querySelector<HTMLInputElement>(".sp-transfer-item input[type='checkbox']");
    if (checkbox) {
      checkbox.checked = true;
      checkbox.dispatchEvent(new Event("change", { bubbles: true }));
      await el.updateComplete;
    }
    // Click the single-move-right button (second .sp-transfer-btn)
    const moveBtns = el.shadowRoot?.querySelectorAll<HTMLButtonElement>(".sp-transfer-btn");
    // First btn = move all right (»), second btn = move selected right (›)
    moveBtns?.[1]?.click();
    expect(received.length).toBe(1);
    expect(received[0].detail.value).toContain("a");
  });
});
