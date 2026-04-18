import { describe, it, expect, beforeEach } from "vitest";
import "./sp-select-root.js";
import "./sp-select-trigger.js";
import "./sp-select-content.js";
import "./sp-select-item.js";
import type { SpSelectRootElement } from "./sp-select-root.js";

function createSelect(): SpSelectRootElement {
  const root = document.createElement("sp-select-root") as SpSelectRootElement;
  root.innerHTML = `
    <sp-select-trigger placeholder="Elegir..."></sp-select-trigger>
    <sp-select-content>
      <sp-select-item value="a">Opción A</sp-select-item>
      <sp-select-item value="b">Opción B</sp-select-item>
    </sp-select-content>
  `;
  document.body.appendChild(root);
  return root;
}

describe("sp-select-root", () => {
  beforeEach(() => { document.body.innerHTML = ""; });

  it("renders root element", async () => {
    const el = createSelect();
    await el.updateComplete;
    expect(el.tagName.toLowerCase()).toBe("sp-select-root");
  });

  it("renders trigger child", async () => {
    const el = createSelect();
    await el.updateComplete;
    expect(el.querySelector("sp-select-trigger")).not.toBeNull();
  });

  it("renders content child", async () => {
    const el = createSelect();
    await el.updateComplete;
    expect(el.querySelector("sp-select-content")).not.toBeNull();
  });

  it("opens content on trigger click", async () => {
    const el = createSelect();
    await el.updateComplete;
    const trigger = el.querySelector("sp-select-trigger");
    const btn = trigger?.shadowRoot?.querySelector<HTMLButtonElement>("button");
    btn?.click();
    await el.updateComplete;
    expect(el.querySelector("sp-select-content")?.hasAttribute("open")).toBe(true);
  });

  it("fires sp-change on item selection", async () => {
    const el = createSelect();
    await el.updateComplete;
    const received: CustomEvent[] = [];
    el.addEventListener("sp-change", (e) => received.push(e as CustomEvent));
    // Open first
    const trigger = el.querySelector("sp-select-trigger");
    const btn = trigger?.shadowRoot?.querySelector<HTMLButtonElement>("button");
    btn?.click();
    await el.updateComplete;
    // Click first item
    const item = el.querySelector<HTMLElement>("sp-select-item");
    item?.shadowRoot?.querySelector<HTMLElement>("[role='option']")?.click();
    expect(received.length).toBe(1);
    expect(received[0].detail.value).toBe("a");
  });

  it("starts with empty value", async () => {
    const el = createSelect();
    await el.updateComplete;
    expect(el.value).toBe("");
  });

  it("is not disabled by default", async () => {
    const el = createSelect();
    await el.updateComplete;
    expect(el.disabled).toBe(false);
  });
});
