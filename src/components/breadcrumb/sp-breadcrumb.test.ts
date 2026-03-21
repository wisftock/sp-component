import { describe, it, expect, beforeEach } from "vitest";
import "./sp-breadcrumb.js";
import "./sp-breadcrumb-item.js";
import type { SpBreadcrumbComponent } from "./sp-breadcrumb.js";
import type { SpBreadcrumbItemComponent } from "./sp-breadcrumb-item.js";

function createBreadcrumb(): SpBreadcrumbComponent {
  const el = document.createElement("sp-breadcrumb") as SpBreadcrumbComponent;
  el.innerHTML = `
    <sp-breadcrumb-item href="/">Home</sp-breadcrumb-item>
    <sp-breadcrumb-item href="/products">Products</sp-breadcrumb-item>
    <sp-breadcrumb-item>Current Page</sp-breadcrumb-item>
  `;
  document.body.appendChild(el);
  return el;
}

describe("sp-breadcrumb", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  it("renders a nav element with aria-label breadcrumb", async () => {
    const el = createBreadcrumb();
    await el.updateComplete;
    const nav = el.shadowRoot?.querySelector("nav");
    expect(nav).not.toBeNull();
    expect(nav?.getAttribute("aria-label")).toBe("breadcrumb");
  });

  it("renders an ol element inside nav", async () => {
    const el = createBreadcrumb();
    await el.updateComplete;
    const ol = el.shadowRoot?.querySelector("ol.sp-breadcrumb");
    expect(ol).not.toBeNull();
  });

  it("last item receives active=true automatically via slotchange", async () => {
    const el = createBreadcrumb();
    await el.updateComplete;
    // Trigger slotchange manually since jsdom may not fire it
    el._handleSlotChange();
    const items = [...el.querySelectorAll("sp-breadcrumb-item")] as SpBreadcrumbItemComponent[];
    await Promise.all(items.map((item) => item.updateComplete));
    expect(items[0].active).toBe(false);
    expect(items[1].active).toBe(false);
    expect(items[2].active).toBe(true);
  });

  it("href is set on link element of non-active item", async () => {
    const el = createBreadcrumb();
    el._handleSlotChange();
    await el.updateComplete;
    const items = [...el.querySelectorAll("sp-breadcrumb-item")] as SpBreadcrumbItemComponent[];
    await items[0].updateComplete;
    const link = items[0].shadowRoot?.querySelector("a");
    expect(link?.getAttribute("href")).toBe("/");
  });

  it("separator is shown between non-active items", async () => {
    const el = createBreadcrumb();
    el._handleSlotChange();
    await el.updateComplete;
    const items = [...el.querySelectorAll("sp-breadcrumb-item")] as SpBreadcrumbItemComponent[];
    await items[0].updateComplete;
    const sep = items[0].shadowRoot?.querySelector(".sp-breadcrumb-separator");
    expect(sep).not.toBeNull();
    expect(sep?.textContent).toBe("/");
  });

  it("custom separator is propagated to items", async () => {
    const el = createBreadcrumb();
    el.separator = "›";
    await el.updateComplete;
    el._handleSlotChange();
    const items = [...el.querySelectorAll("sp-breadcrumb-item")] as SpBreadcrumbItemComponent[];
    await items[0].updateComplete;
    const sep = items[0].shadowRoot?.querySelector(".sp-breadcrumb-separator");
    expect(sep?.textContent).toBe("›");
  });

  it("active item renders with aria-current=page", async () => {
    const el = createBreadcrumb();
    el._handleSlotChange();
    await el.updateComplete;
    const items = [...el.querySelectorAll("sp-breadcrumb-item")] as SpBreadcrumbItemComponent[];
    await items[2].updateComplete;
    const current = items[2].shadowRoot?.querySelector("[aria-current='page']");
    expect(current).not.toBeNull();
  });

  it("active item does not render an anchor element", async () => {
    const el = createBreadcrumb();
    el._handleSlotChange();
    await el.updateComplete;
    const items = [...el.querySelectorAll("sp-breadcrumb-item")] as SpBreadcrumbItemComponent[];
    await items[2].updateComplete;
    const link = items[2].shadowRoot?.querySelector("a");
    expect(link).toBeNull();
  });

  it("non-active item does not render aria-current", async () => {
    const el = createBreadcrumb();
    el._handleSlotChange();
    await el.updateComplete;
    const items = [...el.querySelectorAll("sp-breadcrumb-item")] as SpBreadcrumbItemComponent[];
    await items[0].updateComplete;
    const current = items[0].shadowRoot?.querySelector("[aria-current='page']");
    expect(current).toBeNull();
  });

  it("reflects active attribute on sp-breadcrumb-item", async () => {
    const item = document.createElement("sp-breadcrumb-item") as SpBreadcrumbItemComponent;
    document.body.appendChild(item);
    item.active = true;
    await item.updateComplete;
    expect(item.hasAttribute("active")).toBe(true);
  });
});
