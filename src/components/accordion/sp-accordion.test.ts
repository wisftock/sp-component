import { describe, it, expect, beforeEach } from "vitest";
import "./sp-accordion.js";
import "./sp-accordion-item.js";
import type { SpAccordionComponent } from "./sp-accordion.js";
import type { SpAccordionItemComponent } from "./sp-accordion-item.js";

function createItem(label = "Item", value = "item"): SpAccordionItemComponent {
  const el = document.createElement("sp-accordion-item") as SpAccordionItemComponent;
  el.label = label;
  el.value = value;
  document.body.appendChild(el);
  return el;
}

function createAccordion(): SpAccordionComponent {
  const el = document.createElement("sp-accordion") as SpAccordionComponent;
  document.body.appendChild(el);
  return el;
}

describe("sp-accordion-item", () => {
  let el: SpAccordionItemComponent;

  beforeEach(() => {
    document.body.innerHTML = "";
    el = createItem("Test Label", "test");
  });

  it("renders the accordion item", async () => {
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-accordion-item")).not.toBeNull();
  });

  it("renders the trigger button", async () => {
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-accordion-trigger")).not.toBeNull();
  });

  it("shows label in trigger", async () => {
    await el.updateComplete;
    const label = el.shadowRoot?.querySelector(".sp-accordion-label");
    expect(label).not.toBeNull();
  });

  it("is closed by default", async () => {
    await el.updateComplete;
    expect(el.open).toBe(false);
    const content = el.shadowRoot?.querySelector(".sp-accordion-content");
    expect(content?.hasAttribute("hidden")).toBe(true);
  });

  it("opens on click", async () => {
    await el.updateComplete;
    const btn = el.shadowRoot?.querySelector(".sp-accordion-trigger") as HTMLButtonElement;
    btn.click();
    await el.updateComplete;
    expect(el.open).toBe(true);
    const content = el.shadowRoot?.querySelector(".sp-accordion-content");
    expect(content?.hasAttribute("hidden")).toBe(false);
  });

  it("closes on second click when open", async () => {
    el.open = true;
    await el.updateComplete;
    const btn = el.shadowRoot?.querySelector(".sp-accordion-trigger") as HTMLButtonElement;
    btn.click();
    await el.updateComplete;
    expect(el.open).toBe(false);
  });

  it("emits sp-toggle event on click", async () => {
    await el.updateComplete;
    let detail: { open: boolean; value: string } | null = null;
    el.addEventListener("sp-toggle", (e) => {
      detail = (e as CustomEvent<{ open: boolean; value: string }>).detail;
    });
    const btn = el.shadowRoot?.querySelector(".sp-accordion-trigger") as HTMLButtonElement;
    btn.click();
    expect(detail).toEqual({ open: true, value: "test" });
  });

  it("disabled prevents toggle", async () => {
    el.disabled = true;
    await el.updateComplete;
    el._handleClick();
    await el.updateComplete;
    expect(el.open).toBe(false);
  });

  it("reflects open attribute", async () => {
    el.open = true;
    await el.updateComplete;
    expect(el.hasAttribute("open")).toBe(true);
  });

  it("reflects disabled attribute", async () => {
    el.disabled = true;
    await el.updateComplete;
    expect(el.hasAttribute("disabled")).toBe(true);
  });

  it("shows slot content in body", async () => {
    el.innerHTML = "<p>Content here</p>";
    await el.updateComplete;
    expect(el.querySelector("p")?.textContent).toBe("Content here");
  });
});

describe("sp-accordion", () => {
  let accordion: SpAccordionComponent;

  beforeEach(() => {
    document.body.innerHTML = "";
    accordion = createAccordion();
  });

  it("renders the accordion container", async () => {
    await accordion.updateComplete;
    expect(accordion.shadowRoot?.querySelector(".sp-accordion")).not.toBeNull();
  });

  it("reflects variant attribute", async () => {
    accordion.variant = "bordered";
    await accordion.updateComplete;
    expect(accordion.getAttribute("variant")).toBe("bordered");
  });

  it("default variant is default", async () => {
    await accordion.updateComplete;
    expect(accordion.getAttribute("variant")).toBe("default");
  });

  it("single mode closes other open items when one opens", async () => {
    const item1 = document.createElement("sp-accordion-item") as SpAccordionItemComponent;
    item1.label = "Item 1";
    item1.value = "one";
    item1.open = true;

    const item2 = document.createElement("sp-accordion-item") as SpAccordionItemComponent;
    item2.label = "Item 2";
    item2.value = "two";

    accordion.appendChild(item1);
    accordion.appendChild(item2);
    await accordion.updateComplete;
    await item1.updateComplete;
    await item2.updateComplete;

    // Trigger toggle on item2
    item2.dispatchEvent(
      new CustomEvent("sp-toggle", {
        detail: { open: true, value: "two" },
        bubbles: true,
        composed: true,
      }),
    );
    await item1.updateComplete;
    expect(item1.open).toBe(false);
  });

  it("multiple mode allows multiple open items", async () => {
    accordion.multiple = true;
    const item1 = document.createElement("sp-accordion-item") as SpAccordionItemComponent;
    item1.label = "Item 1";
    item1.value = "one";
    item1.open = true;

    const item2 = document.createElement("sp-accordion-item") as SpAccordionItemComponent;
    item2.label = "Item 2";
    item2.value = "two";

    accordion.appendChild(item1);
    accordion.appendChild(item2);
    await accordion.updateComplete;

    item2.dispatchEvent(
      new CustomEvent("sp-toggle", {
        detail: { open: true, value: "two" },
        bubbles: true,
        composed: true,
      }),
    );
    await item1.updateComplete;
    // item1 should remain open in multiple mode
    expect(item1.open).toBe(true);
  });

  it("ghost variant reflects correctly", async () => {
    accordion.variant = "ghost";
    await accordion.updateComplete;
    expect(accordion.getAttribute("variant")).toBe("ghost");
  });
});
