import { describe, it, expect, beforeEach } from "vitest";
import "./sp-fab.js";
import type { SpFabComponent } from "./sp-fab.js";

function createElement(): SpFabComponent {
  const el = document.createElement("sp-fab") as SpFabComponent;
  document.body.appendChild(el);
  return el;
}

describe("sp-fab", () => {
  let el: SpFabComponent;
  beforeEach(() => { document.body.innerHTML = ""; el = createElement(); });

  it("renders fab root in shadow DOM", async () => {
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-fab-root")).not.toBeNull();
  });

  it("renders main button", async () => {
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-fab-btn")).not.toBeNull();
  });

  it("defaults to + icon", async () => {
    await el.updateComplete;
    const icon = el.shadowRoot?.querySelector(".sp-fab-icon");
    expect(icon?.textContent?.trim()).toBe("+");
  });

  it("fires sp-click on click when no actions", async () => {
    await el.updateComplete;
    const received: CustomEvent[] = [];
    el.addEventListener("sp-click", (e) => received.push(e as CustomEvent));
    const btn = el.shadowRoot?.querySelector<HTMLButtonElement>(".sp-fab-btn");
    btn?.click();
    expect(received.length).toBe(1);
  });

  it("opens speed dial on click when actions are set", async () => {
    el.actions = [{ icon: "✏️", label: "Editar" }, { icon: "🗑️", label: "Borrar" }];
    await el.updateComplete;
    const btn = el.shadowRoot?.querySelector<HTMLButtonElement>(".sp-fab-btn");
    btn?.click();
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-fab-actions")).not.toBeNull();
  });

  it("renders action buttons in speed dial", async () => {
    el.actions = [{ icon: "✏️", label: "Editar" }, { icon: "🗑️", label: "Borrar" }];
    await el.updateComplete;
    const btn = el.shadowRoot?.querySelector<HTMLButtonElement>(".sp-fab-btn");
    btn?.click();
    await el.updateComplete;
    const actionBtns = el.shadowRoot?.querySelectorAll(".sp-fab-action-btn");
    expect(actionBtns?.length).toBe(2);
  });

  it("closes speed dial when overlay clicked", async () => {
    el.actions = [{ icon: "✏️" }];
    await el.updateComplete;
    const btn = el.shadowRoot?.querySelector<HTMLButtonElement>(".sp-fab-btn");
    btn?.click();
    await el.updateComplete;
    const overlay = el.shadowRoot?.querySelector<HTMLElement>(".sp-fab-overlay");
    overlay?.click();
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-fab-actions")).toBeNull();
  });

  it("defaults to position bottom-right", async () => {
    await el.updateComplete;
    expect(el.position).toBe("bottom-right");
  });

  it("defaults to size md", async () => {
    await el.updateComplete;
    expect(el.size).toBe("md");
  });

  it("does not fire sp-click when actions are set", async () => {
    el.actions = [{ icon: "A" }];
    await el.updateComplete;
    const received: CustomEvent[] = [];
    el.addEventListener("sp-click", (e) => received.push(e as CustomEvent));
    const btn = el.shadowRoot?.querySelector<HTMLButtonElement>(".sp-fab-btn");
    btn?.click();
    expect(received.length).toBe(0);
  });
});
