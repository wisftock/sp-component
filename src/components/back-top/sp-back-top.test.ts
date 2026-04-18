import { describe, it, expect, beforeEach } from "vitest";
import "./sp-back-top.js";
import type { SpBackTopComponent } from "./sp-back-top.js";

function createElement(): SpBackTopComponent {
  const el = document.createElement("sp-back-top") as SpBackTopComponent;
  document.body.appendChild(el);
  return el;
}

describe("sp-back-top", () => {
  let el: SpBackTopComponent;
  beforeEach(() => { document.body.innerHTML = ""; el = createElement(); });

  it("renders nothing by default (scroll is 0)", async () => {
    await el.updateComplete;
    // When scrollY is 0, below visibilityHeight, button not shown
    expect(el.shadowRoot?.querySelector(".sp-bt-btn")).toBeNull();
  });

  it("defaults to visibilityHeight 400", async () => {
    await el.updateComplete;
    expect(el.visibilityHeight).toBe(400);
  });

  it("defaults to position bottom-right", async () => {
    await el.updateComplete;
    expect(el.position).toBe("bottom-right");
  });

  it("shows button when visibility-height is 0", async () => {
    el.visibilityHeight = 0;
    // Force visible state by triggering scroll handler
    window.dispatchEvent(new Event("scroll"));
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-bt-btn")).not.toBeNull();
  });

  it("fires sp-click event on button click", async () => {
    el.visibilityHeight = 0;
    window.dispatchEvent(new Event("scroll"));
    await el.updateComplete;
    const received: CustomEvent[] = [];
    el.addEventListener("sp-click", (e) => received.push(e as CustomEvent));
    const btn = el.shadowRoot?.querySelector<HTMLButtonElement>(".sp-bt-btn");
    btn?.click();
    expect(received.length).toBe(1);
  });

  it("has aria-label on button", async () => {
    el.visibilityHeight = 0;
    window.dispatchEvent(new Event("scroll"));
    await el.updateComplete;
    const btn = el.shadowRoot?.querySelector<HTMLButtonElement>(".sp-bt-btn");
    expect(btn?.getAttribute("aria-label")).toBeTruthy();
  });

  it("accepts custom slot content", async () => {
    el.innerHTML = "<span>Top</span>";
    await el.updateComplete;
    expect(el.querySelector("span")).not.toBeNull();
  });
});
