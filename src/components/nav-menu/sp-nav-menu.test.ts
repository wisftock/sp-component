import { describe, it, expect, beforeEach } from "vitest";
import "./sp-nav-menu.js";
import type { SpNavMenuComponent, SpNavMenuItem } from "./sp-nav-menu.js";

function createElement(): SpNavMenuComponent {
  const el = document.createElement("sp-nav-menu") as SpNavMenuComponent;
  document.body.appendChild(el);
  return el;
}

const ITEMS: SpNavMenuItem[] = [
  { label: "Inicio", href: "/" },
  {
    label: "Productos",
    items: [{ label: "Web", href: "/web" }, { label: "Mobile", href: "/mobile" }],
  },
  { label: "Contacto", href: "/contacto" },
];

describe("sp-nav-menu", () => {
  let el: SpNavMenuComponent;
  beforeEach(() => { document.body.innerHTML = ""; el = createElement(); });

  it("renders nav container in shadow DOM", async () => {
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-nav")).not.toBeNull();
  });

  it("renders items as nav triggers", async () => {
    el.items = ITEMS;
    await el.updateComplete;
    const triggers = el.shadowRoot?.querySelectorAll(".sp-nav-trigger");
    expect(triggers?.length).toBe(3);
  });

  it("renders links for items without children", async () => {
    el.items = ITEMS;
    await el.updateComplete;
    const links = el.shadowRoot?.querySelectorAll("a.sp-nav-trigger");
    expect(links?.length).toBe(2); // Inicio and Contacto
  });

  it("opens dropdown on button click", async () => {
    el.items = ITEMS;
    await el.updateComplete;
    const btn = el.shadowRoot?.querySelector<HTMLButtonElement>("button.sp-nav-trigger");
    btn?.click();
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-nav-dropdown")).not.toBeNull();
  });

  it("renders sub-items in dropdown", async () => {
    el.items = ITEMS;
    await el.updateComplete;
    const btn = el.shadowRoot?.querySelector<HTMLButtonElement>("button.sp-nav-trigger");
    btn?.click();
    await el.updateComplete;
    const subItems = el.shadowRoot?.querySelectorAll(".sp-nav-sub-item");
    expect(subItems?.length).toBe(2);
  });

  it("closes dropdown when button clicked again", async () => {
    el.items = ITEMS;
    await el.updateComplete;
    const btn = el.shadowRoot?.querySelector<HTMLButtonElement>("button.sp-nav-trigger");
    btn?.click();
    await el.updateComplete;
    btn?.click();
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-nav-dropdown")).toBeNull();
  });

  it("fires sp-select on sub-item click", async () => {
    el.items = ITEMS;
    await el.updateComplete;
    const received: CustomEvent[] = [];
    el.addEventListener("sp-select", (e) => received.push(e as CustomEvent));
    const btn = el.shadowRoot?.querySelector<HTMLButtonElement>("button.sp-nav-trigger");
    btn?.click();
    await el.updateComplete;
    const subItem = el.shadowRoot?.querySelector<HTMLElement>(".sp-nav-sub-item");
    subItem?.click();
    expect(received.length).toBe(1);
    expect(received[0].detail.item.label).toBe("Web");
  });

  it("renders mega menu with sections", async () => {
    el.items = [{
      label: "Mega",
      sections: [
        { title: "Sección A", items: [{ label: "Item 1" }] },
      ],
    }];
    await el.updateComplete;
    const btn = el.shadowRoot?.querySelector<HTMLButtonElement>("button.sp-nav-trigger");
    btn?.click();
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-nav-dropdown--mega")).not.toBeNull();
    expect(el.shadowRoot?.querySelector(".sp-nav-section-title")?.textContent?.trim()).toBe("Sección A");
  });
});
