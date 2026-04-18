import { describe, it, expect, beforeEach } from "vitest";
import "./sp-menu-root.js";
import "./sp-menu-trigger.js";
import "./sp-menu-content.js";
import "./sp-menu-item.js";
import "./sp-menu-separator.js";
import type { SpMenuRootElement } from "./sp-menu-root.js";

function createMenu(): SpMenuRootElement {
  const root = document.createElement("sp-menu-root") as SpMenuRootElement;
  root.innerHTML = `
    <sp-menu-trigger>Acciones</sp-menu-trigger>
    <sp-menu-content>
      <sp-menu-option value="edit">Editar</sp-menu-option>
      <sp-menu-separator></sp-menu-separator>
      <sp-menu-option value="delete">Eliminar</sp-menu-option>
    </sp-menu-content>
  `;
  document.body.appendChild(root);
  return root;
}

describe("sp-menu-root", () => {
  beforeEach(() => { document.body.innerHTML = ""; });

  it("renders root element", async () => {
    const el = createMenu();
    await el.updateComplete;
    expect(el.tagName.toLowerCase()).toBe("sp-menu-root");
  });

  it("renders trigger child", async () => {
    const el = createMenu();
    await el.updateComplete;
    expect(el.querySelector("sp-menu-trigger")).not.toBeNull();
  });

  it("renders content child", async () => {
    const el = createMenu();
    await el.updateComplete;
    expect(el.querySelector("sp-menu-content")).not.toBeNull();
  });

  it("content is closed by default", async () => {
    const el = createMenu();
    await el.updateComplete;
    expect(el.querySelector("sp-menu-content")?.hasAttribute("open")).toBe(false);
  });

  it("opens content on trigger click", async () => {
    const el = createMenu();
    await el.updateComplete;
    // sp-menu-trigger renders <slot>, no button — dispatch the trigger event directly
    const trigger = el.querySelector("sp-menu-trigger");
    trigger?.dispatchEvent(new CustomEvent("sp-menu-trigger-click", { bubbles: true, composed: true }));
    await el.updateComplete;
    expect(el.querySelector("sp-menu-content")?.hasAttribute("open")).toBe(true);
  });

  it("fires sp-select on item click", async () => {
    const el = createMenu();
    await el.updateComplete;
    const received: CustomEvent[] = [];
    el.addEventListener("sp-select", (e) => received.push(e as CustomEvent));
    // Open via trigger event
    const trigger = el.querySelector("sp-menu-trigger");
    trigger?.dispatchEvent(new CustomEvent("sp-menu-trigger-click", { bubbles: true, composed: true }));
    await el.updateComplete;
    // Click first item (sp-menu-option renders a <button>)
    const item = el.querySelector<HTMLElement>("sp-menu-option");
    item?.shadowRoot?.querySelector<HTMLElement>("button")?.click();
    expect(received.length).toBe(1);
    expect(received[0].detail.value).toBe("edit");
  });

  it("is not disabled by default", async () => {
    const el = createMenu();
    await el.updateComplete;
    expect(el.disabled).toBe(false);
  });
});
