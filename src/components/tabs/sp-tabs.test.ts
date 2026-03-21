import { describe, it, expect, beforeEach, vi } from "vitest";
import "./sp-tabs.js";
import "./sp-tab.js";
import "./sp-tab-panel.js";
import type { SpTabsComponent } from "./sp-tabs.js";
import type { SpTabComponent } from "./sp-tab.js";

function createTabs(active = "tab1"): SpTabsComponent {
  const el = document.createElement("sp-tabs") as SpTabsComponent;
  el.setAttribute("active", active);
  el.innerHTML = `
    <sp-tab slot="nav" panel="tab1">Tab 1</sp-tab>
    <sp-tab slot="nav" panel="tab2">Tab 2</sp-tab>
    <sp-tab slot="nav" panel="tab3" disabled>Tab 3</sp-tab>
    <sp-tab-panel name="tab1">Content 1</sp-tab-panel>
    <sp-tab-panel name="tab2">Content 2</sp-tab-panel>
    <sp-tab-panel name="tab3">Content 3</sp-tab-panel>
  `;
  document.body.appendChild(el);
  return el;
}

describe("sp-tabs", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  it("renders nav and content areas in shadow DOM", async () => {
    const el = createTabs();
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-tabs-nav")).not.toBeNull();
    expect(el.shadowRoot?.querySelector(".sp-tabs-content")).not.toBeNull();
  });

  it("has default placement of top", async () => {
    const el = document.createElement("sp-tabs") as SpTabsComponent;
    document.body.appendChild(el);
    await el.updateComplete;
    expect(el.placement).toBe("top");
    expect(el.getAttribute("placement")).toBe("top");
  });

  it("reflects placement attribute", async () => {
    const el = createTabs();
    el.placement = "left";
    await el.updateComplete;
    expect(el.getAttribute("placement")).toBe("left");
  });

  it("active prop syncs to sp-tab children", async () => {
    const el = createTabs("tab1");
    await el.updateComplete;
    el.active = "tab2";
    await el.updateComplete;
    const tabs = [...el.querySelectorAll("sp-tab")] as SpTabComponent[];
    expect(tabs[0].active).toBe(false);
    expect(tabs[1].active).toBe(true);
    expect(tabs[2].active).toBe(false);
  });

  it("sp-tab-panel is hidden when not active", async () => {
    const el = createTabs("tab1");
    await el.updateComplete;
    el.active = "tab1";
    await el.updateComplete;
    const panels = [...el.querySelectorAll("sp-tab-panel")] as any[];
    expect(panels[0].hidden).toBe(false);
    expect(panels[1].hidden).toBe(true);
    expect(panels[2].hidden).toBe(true);
  });

  it("clicking a tab changes the active panel", async () => {
    const el = createTabs("tab1");
    await el.updateComplete;
    const tabs = [...el.querySelectorAll("sp-tab")] as SpTabComponent[];
    tabs[1].dispatchEvent(
      new CustomEvent("sp-tab-click", {
        detail: { panel: "tab2" },
        bubbles: true,
        composed: true,
      }),
    );
    await el.updateComplete;
    expect(el.active).toBe("tab2");
  });

  it("emits sp-tab-show when tab is clicked", async () => {
    const el = createTabs("tab1");
    await el.updateComplete;
    const listener = vi.fn();
    el.addEventListener("sp-tab-show", listener);
    el.querySelector<SpTabComponent>("sp-tab[panel='tab2']")!.dispatchEvent(
      new CustomEvent("sp-tab-click", {
        detail: { panel: "tab2" },
        bubbles: true,
        composed: true,
      }),
    );
    await el.updateComplete;
    expect(listener).toHaveBeenCalledOnce();
    expect((listener.mock.calls[0][0] as CustomEvent).detail).toEqual({ panel: "tab2" });
  });

  it("disabled tab does not emit sp-tab-click when clicked", async () => {
    const el = createTabs("tab1");
    await el.updateComplete;
    const listener = vi.fn();
    el.addEventListener("sp-tab-click", listener);
    const disabledTab = el.querySelector<SpTabComponent>("sp-tab[disabled]")!;
    await disabledTab.updateComplete;
    const btn = disabledTab.shadowRoot?.querySelector("button");
    btn?.click();
    expect(listener).not.toHaveBeenCalled();
  });
});

describe("sp-tab", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  it("renders a button with role=tab", async () => {
    const el = document.createElement("sp-tab") as SpTabComponent;
    document.body.appendChild(el);
    await el.updateComplete;
    const btn = el.shadowRoot?.querySelector("button");
    expect(btn).not.toBeNull();
    expect(btn?.getAttribute("role")).toBe("tab");
  });

  it("reflects active attribute", async () => {
    const el = document.createElement("sp-tab") as SpTabComponent;
    document.body.appendChild(el);
    el.active = true;
    await el.updateComplete;
    expect(el.hasAttribute("active")).toBe(true);
  });

  it("reflects disabled attribute", async () => {
    const el = document.createElement("sp-tab") as SpTabComponent;
    document.body.appendChild(el);
    el.disabled = true;
    await el.updateComplete;
    expect(el.hasAttribute("disabled")).toBe(true);
    const btn = el.shadowRoot?.querySelector("button");
    expect(btn?.disabled).toBe(true);
  });

  it("emits sp-tab-click with panel detail when clicked", async () => {
    const el = document.createElement("sp-tab") as SpTabComponent;
    el.panel = "my-panel";
    document.body.appendChild(el);
    await el.updateComplete;
    const listener = vi.fn();
    el.addEventListener("sp-tab-click", listener);
    el.shadowRoot?.querySelector("button")?.click();
    expect(listener).toHaveBeenCalledOnce();
    expect((listener.mock.calls[0][0] as CustomEvent).detail).toEqual({ panel: "my-panel" });
  });

  it("does not emit sp-tab-click when disabled", async () => {
    const el = document.createElement("sp-tab") as SpTabComponent;
    el.panel = "my-panel";
    el.disabled = true;
    document.body.appendChild(el);
    await el.updateComplete;
    const listener = vi.fn();
    el.addEventListener("sp-tab-click", listener);
    el._handleClick();
    expect(listener).not.toHaveBeenCalled();
  });
});
