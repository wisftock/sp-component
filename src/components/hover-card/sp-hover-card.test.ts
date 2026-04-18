import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import "./sp-hover-card.js";
import type { SpHoverCardComponent } from "./sp-hover-card.js";

function createElement(): SpHoverCardComponent {
  const el = document.createElement("sp-hover-card") as SpHoverCardComponent;
  document.body.appendChild(el);
  return el;
}

describe("sp-hover-card", () => {
  let el: SpHoverCardComponent;
  beforeEach(() => {
    vi.useFakeTimers();
    document.body.innerHTML = "";
    el = createElement();
  });
  afterEach(() => { vi.useRealTimers(); });

  it("renders wrapper in shadow DOM", async () => {
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-hc-wrapper")).not.toBeNull();
  });

  it("card is not visible by default", async () => {
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-hc-card")).toBeNull();
  });

  it("shows card after delay on mouseenter", async () => {
    el.openDelay = 100;
    await el.updateComplete;
    const wrapper = el.shadowRoot?.querySelector<HTMLElement>(".sp-hc-wrapper");
    wrapper?.dispatchEvent(new MouseEvent("mouseenter"));
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-hc-card")).toBeNull(); // not yet
    vi.advanceTimersByTime(200);
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-hc-card")).not.toBeNull();
  });

  it("hides card after delay on mouseleave", async () => {
    el.openDelay = 0;
    el.closeDelay = 100;
    await el.updateComplete;
    const wrapper = el.shadowRoot?.querySelector<HTMLElement>(".sp-hc-wrapper");
    wrapper?.dispatchEvent(new MouseEvent("mouseenter"));
    vi.advanceTimersByTime(10);
    await el.updateComplete;
    wrapper?.dispatchEvent(new MouseEvent("mouseleave"));
    vi.advanceTimersByTime(200);
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-hc-card")).toBeNull();
  });

  it("defaults to bottom placement", async () => {
    await el.updateComplete;
    expect(el.placement).toBe("bottom");
  });

  it("applies placement class to card", async () => {
    el.openDelay = 0;
    el.placement = "top";
    await el.updateComplete;
    const wrapper = el.shadowRoot?.querySelector<HTMLElement>(".sp-hc-wrapper");
    wrapper?.dispatchEvent(new MouseEvent("mouseenter"));
    vi.advanceTimersByTime(10);
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-hc-card--top")).not.toBeNull();
  });

  it("renders default and content slots", async () => {
    el.innerHTML = "<span slot='content'>Info</span><button>Hover me</button>";
    await el.updateComplete;
    expect(el.querySelector("button")).not.toBeNull();
    expect(el.querySelector("[slot='content']")).not.toBeNull();
  });
});
