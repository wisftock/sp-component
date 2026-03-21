import { describe, it, expect, beforeEach } from "vitest";
import "./sp-skeleton.js";
import type { SpSkeletonComponent } from "./sp-skeleton.js";

function createElement(): SpSkeletonComponent {
  const el = document.createElement("sp-skeleton") as SpSkeletonComponent;
  document.body.appendChild(el);
  return el;
}

describe("sp-skeleton", () => {
  let el: SpSkeletonComponent;

  beforeEach(() => {
    document.body.innerHTML = "";
    el = createElement();
  });

  // ---- Rendering ----

  it("renders the skeleton div", async () => {
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-skeleton")).not.toBeNull();
  });

  // ---- Variant ----

  it("reflects default variant=text attribute", async () => {
    await el.updateComplete;
    expect(el.getAttribute("variant")).toBe("text");
  });

  it("reflects variant=circle attribute", async () => {
    el.variant = "circle";
    await el.updateComplete;
    expect(el.getAttribute("variant")).toBe("circle");
  });

  it("reflects variant=rect attribute", async () => {
    el.variant = "rect";
    await el.updateComplete;
    expect(el.getAttribute("variant")).toBe("rect");
  });

  it("renders skeleton div for circle variant", async () => {
    el.variant = "circle";
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-skeleton")).not.toBeNull();
  });

  // ---- Animation ----

  it("has sp-skeleton--animated class by default", async () => {
    await el.updateComplete;
    const skeleton = el.shadowRoot?.querySelector(".sp-skeleton");
    expect(skeleton?.classList.contains("sp-skeleton--animated")).toBe(true);
  });

  it("removes sp-skeleton--animated class when animated=false", async () => {
    el.animated = false;
    await el.updateComplete;
    const skeleton = el.shadowRoot?.querySelector(".sp-skeleton");
    expect(skeleton?.classList.contains("sp-skeleton--animated")).toBe(false);
  });

  it("reflects animated attribute", async () => {
    await el.updateComplete;
    expect(el.hasAttribute("animated")).toBe(true);
  });

  it("reflects animated=false removes attribute", async () => {
    el.animated = false;
    await el.updateComplete;
    expect(el.hasAttribute("animated")).toBe(false);
  });

  // ---- Width / Height ----

  it("applies width style when width prop is set", async () => {
    el.width = "200px";
    await el.updateComplete;
    const skeleton = el.shadowRoot?.querySelector<HTMLElement>(".sp-skeleton");
    expect(skeleton?.getAttribute("style")).toContain("width: 200px");
  });

  it("applies height style when height prop is set", async () => {
    el.height = "48px";
    await el.updateComplete;
    const skeleton = el.shadowRoot?.querySelector<HTMLElement>(".sp-skeleton");
    expect(skeleton?.getAttribute("style")).toContain("height: 48px");
  });

  it("applies both width and height when both are set", async () => {
    el.width = "100%";
    el.height = "16px";
    await el.updateComplete;
    const skeleton = el.shadowRoot?.querySelector<HTMLElement>(".sp-skeleton");
    const style = skeleton?.getAttribute("style") ?? "";
    expect(style).toContain("width: 100%");
    expect(style).toContain("height: 16px");
  });

  // ---- Accessibility ----

  it("has aria-hidden=true on skeleton div", async () => {
    await el.updateComplete;
    const skeleton = el.shadowRoot?.querySelector(".sp-skeleton");
    expect(skeleton?.getAttribute("aria-hidden")).toBe("true");
  });
});
