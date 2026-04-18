import { describe, it, expect, beforeEach } from "vitest";
import "./sp-menubar.js";
import type { SpMenubarComponent } from "./sp-menubar.js";
import type { SpMenubarMenu } from "./sp-menubar.js";

function createElement(): SpMenubarComponent {
  const el = document.createElement("sp-menubar") as SpMenubarComponent;
  document.body.appendChild(el);
  return el;
}

const SAMPLE_MENUS: SpMenubarMenu[] = [
  { label: "Archivo", items: [{ label: "Nuevo" }, { label: "Abrir" }, { separator: true }, { label: "Salir" }] },
  { label: "Editar", items: [{ label: "Copiar" }, { label: "Pegar", disabled: true }] },
];

describe("sp-menubar", () => {
  let el: SpMenubarComponent;
  beforeEach(() => { document.body.innerHTML = ""; el = createElement(); });

  it("renders menubar container in shadow DOM", async () => {
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-mb")).not.toBeNull();
  });

  it("renders trigger buttons for each menu", async () => {
    el.menus = SAMPLE_MENUS;
    await el.updateComplete;
    const triggers = el.shadowRoot?.querySelectorAll(".sp-mb-trigger");
    expect(triggers?.length).toBe(2);
  });

  it("shows menu labels in triggers", async () => {
    el.menus = SAMPLE_MENUS;
    await el.updateComplete;
    const triggers = el.shadowRoot?.querySelectorAll(".sp-mb-trigger");
    expect(triggers?.[0]?.textContent?.trim()).toBe("Archivo");
    expect(triggers?.[1]?.textContent?.trim()).toBe("Editar");
  });

  it("opens dropdown on trigger click", async () => {
    el.menus = SAMPLE_MENUS;
    await el.updateComplete;
    const trigger = el.shadowRoot?.querySelector<HTMLButtonElement>(".sp-mb-trigger");
    trigger?.click();
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-mb-dropdown")).not.toBeNull();
  });

  it("renders menu items in dropdown", async () => {
    el.menus = SAMPLE_MENUS;
    await el.updateComplete;
    const trigger = el.shadowRoot?.querySelector<HTMLButtonElement>(".sp-mb-trigger");
    trigger?.click();
    await el.updateComplete;
    const items = el.shadowRoot?.querySelectorAll(".sp-mb-item");
    expect(items?.length).toBeGreaterThan(0);
  });

  it("renders separator in dropdown", async () => {
    el.menus = SAMPLE_MENUS;
    await el.updateComplete;
    const trigger = el.shadowRoot?.querySelector<HTMLButtonElement>(".sp-mb-trigger");
    trigger?.click();
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-mb-sep")).not.toBeNull();
  });

  it("fires sp-select event on item click", async () => {
    el.menus = SAMPLE_MENUS;
    await el.updateComplete;
    const trigger = el.shadowRoot?.querySelector<HTMLButtonElement>(".sp-mb-trigger");
    trigger?.click();
    await el.updateComplete;
    const received: CustomEvent[] = [];
    el.addEventListener("sp-select", (e) => received.push(e as CustomEvent));
    const items = el.shadowRoot?.querySelectorAll<HTMLButtonElement>(".sp-mb-item");
    items?.[0]?.click();
    expect(received.length).toBe(1);
    expect(received[0].detail.item.label).toBe("Nuevo");
  });

  it("closes dropdown after item selection", async () => {
    el.menus = SAMPLE_MENUS;
    await el.updateComplete;
    const trigger = el.shadowRoot?.querySelector<HTMLButtonElement>(".sp-mb-trigger");
    trigger?.click();
    await el.updateComplete;
    const items = el.shadowRoot?.querySelectorAll<HTMLButtonElement>(".sp-mb-item");
    items?.[0]?.click();
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-mb-dropdown")).toBeNull();
  });

  it("toggles dropdown off when trigger clicked twice", async () => {
    el.menus = SAMPLE_MENUS;
    await el.updateComplete;
    const trigger = el.shadowRoot?.querySelector<HTMLButtonElement>(".sp-mb-trigger");
    trigger?.click();
    await el.updateComplete;
    trigger?.click();
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-mb-dropdown")).toBeNull();
  });
});
