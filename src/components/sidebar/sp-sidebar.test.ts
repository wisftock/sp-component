import { describe, it, expect, beforeEach, vi } from "vitest";
import "./sp-sidebar.js";
import type { SpSidebarComponent } from "./sp-sidebar.js";

function createElement(): SpSidebarComponent {
  const el = document.createElement("sp-sidebar") as SpSidebarComponent;
  document.body.appendChild(el);
  return el;
}

describe("sp-sidebar", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  it("renders an aside element in shadow DOM", async () => {
    const el = createElement();
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector("aside.sp-sidebar")).not.toBeNull();
  });

  it("is open by default", async () => {
    const el = createElement();
    await el.updateComplete;
    expect(el.open).toBe(true);
    expect(el.hasAttribute("open")).toBe(true);
  });

  it("reflects open attribute", async () => {
    const el = createElement();
    el.open = false;
    await el.updateComplete;
    expect(el.hasAttribute("open")).toBe(false);
  });

  it("reflects default placement as left", async () => {
    const el = createElement();
    await el.updateComplete;
    expect(el.getAttribute("placement")).toBe("left");
  });

  it("reflects custom placement attribute", async () => {
    const el = createElement();
    el.placement = "right";
    await el.updateComplete;
    expect(el.getAttribute("placement")).toBe("right");
  });

  it("reflects bordered attribute when set", async () => {
    const el = createElement();
    el.bordered = true;
    await el.updateComplete;
    expect(el.hasAttribute("bordered")).toBe(true);
  });

  it("does not show toggle button when collapsible=false by default", async () => {
    const el = createElement();
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-sidebar-toggle")).toBeNull();
  });

  it("shows toggle button when collapsible=true", async () => {
    const el = createElement();
    el.collapsible = true;
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-sidebar-toggle")).not.toBeNull();
  });

  it("applies collapsed width when collapsed=true", async () => {
    const el = createElement();
    el.collapsed = true;
    await el.updateComplete;
    const aside = el.shadowRoot?.querySelector(".sp-sidebar") as HTMLElement;
    expect(aside?.style.width).toBe("60px");
  });

  it("applies full width when not collapsed", async () => {
    const el = createElement();
    el.width = "240px";
    await el.updateComplete;
    const aside = el.shadowRoot?.querySelector(".sp-sidebar") as HTMLElement;
    expect(aside?.style.width).toBe("240px");
  });

  it("emits sp-collapse event on toggle click", async () => {
    const el = createElement();
    el.collapsible = true;
    await el.updateComplete;
    const listener = vi.fn();
    el.addEventListener("sp-collapse", listener);
    const toggle = el.shadowRoot?.querySelector(".sp-sidebar-toggle") as HTMLElement;
    toggle.click();
    expect(listener).toHaveBeenCalledOnce();
  });

  it("sp-collapse detail contains correct collapsed value", async () => {
    const el = createElement();
    el.collapsible = true;
    await el.updateComplete;
    let detail: { collapsed: boolean } | null = null;
    el.addEventListener("sp-collapse", (e) => {
      detail = (e as CustomEvent<{ collapsed: boolean }>).detail;
    });
    el._handleCollapse();
    expect(detail).toEqual({ collapsed: true });
  });

  it("reflects collapsed attribute when set", async () => {
    const el = createElement();
    el.collapsed = true;
    await el.updateComplete;
    expect(el.hasAttribute("collapsed")).toBe(true);
  });

  it("renders sidebar content slot", async () => {
    const el = createElement();
    const content = document.createElement("div");
    content.textContent = "Sidebar content";
    el.appendChild(content);
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-sidebar-content")).not.toBeNull();
  });

  it("renders header and footer slots", async () => {
    const el = createElement();
    await el.updateComplete;
    const slots = el.shadowRoot?.querySelectorAll("slot");
    const slotNames = Array.from(slots ?? []).map((s) => s.getAttribute("name"));
    expect(slotNames).toContain("header");
    expect(slotNames).toContain("footer");
  });
});
