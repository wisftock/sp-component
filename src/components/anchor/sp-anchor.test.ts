import { describe, it, expect, beforeEach } from "vitest";
import "./sp-anchor.js";
import type { SpAnchorComponent, SpAnchorItem } from "./sp-anchor.js";

function createElement(): SpAnchorComponent {
  const el = document.createElement("sp-anchor") as SpAnchorComponent;
  document.body.appendChild(el);
  return el;
}

const ITEMS: SpAnchorItem[] = [
  { id: "sec-1", title: "Introducción" },
  { id: "sec-2", title: "Instalación", children: [{ id: "sec-2-1", title: "Requisitos" }] },
  { id: "sec-3", title: "Uso" },
];

describe("sp-anchor", () => {
  let el: SpAnchorComponent;
  beforeEach(() => { document.body.innerHTML = ""; el = createElement(); });

  it("renders anchor list in shadow DOM", async () => {
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-anchor")).not.toBeNull();
  });

  it("renders links for each item", async () => {
    el.items = ITEMS;
    await el.updateComplete;
    const links = el.shadowRoot?.querySelectorAll(".sp-anchor-link");
    // 3 items + 1 child = 4 links
    expect(links?.length).toBe(4);
  });

  it("shows item titles as link text", async () => {
    el.items = ITEMS;
    await el.updateComplete;
    const links = el.shadowRoot?.querySelectorAll(".sp-anchor-link");
    expect(links?.[0]?.textContent?.trim()).toBe("Introducción");
  });

  it("renders nested children", async () => {
    el.items = ITEMS;
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-anchor-children")).not.toBeNull();
  });

  it("fires sp-click on link click", async () => {
    // Add target elements to DOM
    const sec = document.createElement("div");
    sec.id = "sec-1";
    document.body.appendChild(sec);
    el.items = ITEMS;
    await el.updateComplete;
    const received: CustomEvent[] = [];
    el.addEventListener("sp-click", (e) => received.push(e as CustomEvent));
    const link = el.shadowRoot?.querySelector<HTMLAnchorElement>(".sp-anchor-link");
    link?.click();
    expect(received.length).toBe(1);
    expect(received[0].detail.id).toBe("sec-1");
  });

  it("defaults offset to 80", async () => {
    await el.updateComplete;
    expect(el.offset).toBe(80);
  });

  it("links have href pointing to id", async () => {
    el.items = [{ id: "my-section", title: "My Section" }];
    await el.updateComplete;
    const link = el.shadowRoot?.querySelector<HTMLAnchorElement>(".sp-anchor-link");
    expect(link?.getAttribute("href")).toBe("#my-section");
  });
});
