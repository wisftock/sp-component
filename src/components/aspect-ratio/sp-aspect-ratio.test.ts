import { describe, it, expect, beforeEach } from "vitest";
import "./sp-aspect-ratio.js";
import type { SpAspectRatioComponent } from "./sp-aspect-ratio.js";

function createElement(): SpAspectRatioComponent {
  const el = document.createElement("sp-aspect-ratio") as SpAspectRatioComponent;
  document.body.appendChild(el);
  return el;
}

describe("sp-aspect-ratio", () => {
  let el: SpAspectRatioComponent;
  beforeEach(() => { document.body.innerHTML = ""; el = createElement(); });

  it("renders container in shadow DOM", async () => {
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-ar")).not.toBeNull();
  });

  it("renders content wrapper", async () => {
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-ar-content")).not.toBeNull();
  });

  it("defaults to 16/9 ratio", async () => {
    await el.updateComplete;
    expect(el.ratio).toBe("16/9");
  });

  it("applies 56.25% padding for 16/9", async () => {
    el.ratio = "16/9";
    await el.updateComplete;
    const wrap = el.shadowRoot?.querySelector<HTMLElement>(".sp-ar");
    expect(wrap?.style.getPropertyValue("--sp-ar-padding")).toBe("56.25%");
  });

  it("applies 75% padding for 4/3", async () => {
    el.ratio = "4/3";
    await el.updateComplete;
    const wrap = el.shadowRoot?.querySelector<HTMLElement>(".sp-ar");
    expect(wrap?.style.getPropertyValue("--sp-ar-padding")).toBe("75%");
  });

  it("applies 100% padding for 1/1", async () => {
    el.ratio = "1/1";
    await el.updateComplete;
    const wrap = el.shadowRoot?.querySelector<HTMLElement>(".sp-ar");
    expect(wrap?.style.getPropertyValue("--sp-ar-padding")).toBe("100%");
  });

  it("accepts numeric ratio", async () => {
    el.ratio = 2; // width:height = 2:1 → 50%
    await el.updateComplete;
    const wrap = el.shadowRoot?.querySelector<HTMLElement>(".sp-ar");
    expect(wrap?.style.getPropertyValue("--sp-ar-padding")).toBe("50%");
  });

  it("renders slot content", async () => {
    el.innerHTML = "<img src='test.jpg' alt='test'>";
    await el.updateComplete;
    expect(el.querySelector("img")).not.toBeNull();
  });
});
