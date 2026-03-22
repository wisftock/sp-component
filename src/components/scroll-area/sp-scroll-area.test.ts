import { describe, it, expect, beforeEach } from "vitest";
import "./sp-scroll-area.js";
import type { SpScrollAreaComponent } from "./sp-scroll-area.js";

function createElement(): SpScrollAreaComponent {
  const el = document.createElement("sp-scroll-area") as SpScrollAreaComponent;
  document.body.appendChild(el);
  return el;
}

describe("sp-scroll-area", () => {
  let el: SpScrollAreaComponent;

  beforeEach(() => {
    document.body.innerHTML = "";
    el = createElement();
  });

  it("renders viewport and slot", async () => {
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-scroll-area-viewport")).not.toBeNull();
    expect(el.shadowRoot?.querySelector("slot")).not.toBeNull();
  });

  it("max-height style applied when maxHeight is set", async () => {
    el.maxHeight = "300px";
    await el.updateComplete;
    const wrapper = el.shadowRoot?.querySelector(".sp-scroll-area") as HTMLElement;
    expect(wrapper?.getAttribute("style")).toContain("max-height:300px");
  });

  it("max-width style applied when maxWidth is set", async () => {
    el.maxWidth = "500px";
    await el.updateComplete;
    const wrapper = el.shadowRoot?.querySelector(".sp-scroll-area") as HTMLElement;
    expect(wrapper?.getAttribute("style")).toContain("max-width:500px");
  });

  it("orientation prop sets correct class — vertical", async () => {
    el.orientation = "vertical";
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-scroll-area--vertical")).not.toBeNull();
  });

  it("orientation prop sets correct class — horizontal", async () => {
    el.orientation = "horizontal";
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-scroll-area--horizontal")).not.toBeNull();
  });

  it("orientation prop sets correct class — both", async () => {
    el.orientation = "both";
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-scroll-area--both")).not.toBeNull();
  });

  it("scrollbar='always' reflects attribute", async () => {
    el.scrollbar = "always";
    await el.updateComplete;
    expect(el.getAttribute("scrollbar")).toBe("always");
  });

  it("scrollbar='never' reflects attribute", async () => {
    el.scrollbar = "never";
    await el.updateComplete;
    expect(el.getAttribute("scrollbar")).toBe("never");
  });

  it("renders vertical scrollbar by default (orientation=vertical)", async () => {
    el.orientation = "vertical";
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-scroll-area-scrollbar--vertical")).not.toBeNull();
    expect(el.shadowRoot?.querySelector(".sp-scroll-area-scrollbar--horizontal")).toBeNull();
  });

  it("renders horizontal scrollbar for horizontal orientation", async () => {
    el.orientation = "horizontal";
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-scroll-area-scrollbar--horizontal")).not.toBeNull();
    expect(el.shadowRoot?.querySelector(".sp-scroll-area-scrollbar--vertical")).toBeNull();
  });

  it("renders both scrollbars for both orientation", async () => {
    el.orientation = "both";
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-scroll-area-scrollbar--vertical")).not.toBeNull();
    expect(el.shadowRoot?.querySelector(".sp-scroll-area-scrollbar--horizontal")).not.toBeNull();
  });
});
