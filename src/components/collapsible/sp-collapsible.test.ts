import { describe, it, expect, beforeEach } from "vitest";
import "./sp-collapsible.js";
import type { SpCollapsibleComponent } from "./sp-collapsible.js";

function createElement(): SpCollapsibleComponent {
  const el = document.createElement("sp-collapsible") as SpCollapsibleComponent;
  document.body.appendChild(el);
  return el;
}

describe("sp-collapsible", () => {
  let el: SpCollapsibleComponent;
  beforeEach(() => { document.body.innerHTML = ""; el = createElement(); });

  it("renders trigger button in shadow DOM", async () => {
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-col-trigger")).not.toBeNull();
  });

  it("renders content region", async () => {
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-col-content")).not.toBeNull();
  });

  it("is closed by default", async () => {
    await el.updateComplete;
    expect(el.open).toBe(false);
  });

  it("opens on trigger click", async () => {
    await el.updateComplete;
    const btn = el.shadowRoot?.querySelector<HTMLButtonElement>(".sp-col-trigger");
    btn?.click();
    await el.updateComplete;
    expect(el.open).toBe(true);
  });

  it("closes on second click", async () => {
    await el.updateComplete;
    const btn = el.shadowRoot?.querySelector<HTMLButtonElement>(".sp-col-trigger");
    btn?.click();
    await el.updateComplete;
    btn?.click();
    await el.updateComplete;
    expect(el.open).toBe(false);
  });

  it("fires sp-open event when opened", async () => {
    await el.updateComplete;
    const received: CustomEvent[] = [];
    el.addEventListener("sp-open", (e) => received.push(e as CustomEvent));
    const btn = el.shadowRoot?.querySelector<HTMLButtonElement>(".sp-col-trigger");
    btn?.click();
    expect(received.length).toBe(1);
  });

  it("fires sp-close event when closed", async () => {
    el.open = true;
    await el.updateComplete;
    const received: CustomEvent[] = [];
    el.addEventListener("sp-close", (e) => received.push(e as CustomEvent));
    const btn = el.shadowRoot?.querySelector<HTMLButtonElement>(".sp-col-trigger");
    btn?.click();
    expect(received.length).toBe(1);
  });

  it("does not toggle when disabled", async () => {
    el.disabled = true;
    await el.updateComplete;
    const btn = el.shadowRoot?.querySelector<HTMLButtonElement>(".sp-col-trigger");
    btn?.click();
    await el.updateComplete;
    expect(el.open).toBe(false);
  });

  it("content aria-hidden is true when closed", async () => {
    await el.updateComplete;
    const content = el.shadowRoot?.querySelector(".sp-col-content");
    expect(content?.getAttribute("aria-hidden")).toBe("true");
  });

  it("content aria-hidden is false when open", async () => {
    el.open = true;
    await el.updateComplete;
    const content = el.shadowRoot?.querySelector(".sp-col-content");
    expect(content?.getAttribute("aria-hidden")).toBe("false");
  });
});
