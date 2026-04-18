import { describe, it, expect, beforeEach } from "vitest";
import "./sp-image-compare.js";
import type { SpImageCompareComponent } from "./sp-image-compare.js";

function createElement(): SpImageCompareComponent {
  const el = document.createElement("sp-image-compare") as SpImageCompareComponent;
  document.body.appendChild(el);
  return el;
}

describe("sp-image-compare", () => {
  let el: SpImageCompareComponent;
  beforeEach(() => { document.body.innerHTML = ""; el = createElement(); });

  it("renders the compare container in shadow DOM", async () => {
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-ic")).not.toBeNull();
  });

  it("renders handle", async () => {
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-ic-handle")).not.toBeNull();
  });

  it("sets beforeSrc on img element", async () => {
    el.beforeSrc = "before.jpg";
    await el.updateComplete;
    const img = el.shadowRoot?.querySelector<HTMLImageElement>(".sp-ic-before img");
    expect(img?.src).toContain("before.jpg");
  });

  it("sets afterSrc on img element", async () => {
    el.afterSrc = "after.jpg";
    await el.updateComplete;
    const img = el.shadowRoot?.querySelector<HTMLImageElement>(".sp-ic-after img");
    expect(img?.src).toContain("after.jpg");
  });

  it("has default initial position of 50", async () => {
    await el.updateComplete;
    expect(el.initial).toBe(50);
  });

  it("applies height style", async () => {
    el.height = "300px";
    await el.updateComplete;
    const wrap = el.shadowRoot?.querySelector<HTMLElement>(".sp-ic");
    expect(wrap?.style.height).toBe("300px");
  });

  it("shows before label when set", async () => {
    el.beforeLabel = "Antes";
    await el.updateComplete;
    const label = el.shadowRoot?.querySelector(".sp-ic-label--before");
    expect(label?.textContent?.trim()).toBe("Antes");
  });

  it("shows after label when set", async () => {
    el.afterLabel = "Después";
    await el.updateComplete;
    const label = el.shadowRoot?.querySelector(".sp-ic-label--after");
    expect(label?.textContent?.trim()).toBe("Después");
  });
});
