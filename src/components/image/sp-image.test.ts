import { describe, it, expect, beforeEach, vi } from "vitest";
import "./sp-image.js";
import type { SpImageComponent } from "./sp-image.js";

function createElement(): SpImageComponent {
  const el = document.createElement("sp-image") as SpImageComponent;
  document.body.appendChild(el);
  return el;
}

describe("sp-image", () => {
  let el: SpImageComponent;

  beforeEach(() => {
    document.body.innerHTML = "";
    el = createElement();
  });

  // ---- Rendering ----

  it("renders img element in shadow DOM", async () => {
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector("img")).not.toBeNull();
  });

  it("renders wrapper div in shadow DOM", async () => {
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-image-wrapper")).not.toBeNull();
  });

  // ---- Attributes ----

  it("sets src attribute on img", async () => {
    el.src = "https://example.com/photo.jpg";
    await el.updateComplete;
    const img = el.shadowRoot?.querySelector("img");
    expect(img?.getAttribute("src")).toBe("https://example.com/photo.jpg");
  });

  it("sets alt attribute on img", async () => {
    el.alt = "A beautiful photo";
    await el.updateComplete;
    const img = el.shadowRoot?.querySelector("img");
    expect(img?.getAttribute("alt")).toBe("A beautiful photo");
  });

  it("sets alt to empty string by default", async () => {
    await el.updateComplete;
    const img = el.shadowRoot?.querySelector("img");
    expect(img?.getAttribute("alt")).toBe("");
  });

  it("sets loading=lazy by default", async () => {
    await el.updateComplete;
    const img = el.shadowRoot?.querySelector("img");
    expect(img?.getAttribute("loading")).toBe("lazy");
  });

  it("sets loading=eager when lazy is false", async () => {
    el.lazy = false;
    await el.updateComplete;
    const img = el.shadowRoot?.querySelector("img");
    expect(img?.getAttribute("loading")).toBe("eager");
  });

  // ---- Default props ----

  it("default fit is cover", async () => {
    await el.updateComplete;
    expect(el.fit).toBe("cover");
  });

  it("lazy defaults to true", async () => {
    await el.updateComplete;
    expect(el.lazy).toBe(true);
  });

  it("rounded defaults to false", async () => {
    await el.updateComplete;
    expect(el.rounded).toBe(false);
  });

  // ---- Events ----

  it("emits sp-error when image fails to load", async () => {
    el.src = "https://example.com/broken.jpg";
    await el.updateComplete;
    const listener = vi.fn();
    el.addEventListener("sp-error", listener);
    const img = el.shadowRoot?.querySelector("img") as HTMLImageElement;
    img.dispatchEvent(new Event("error"));
    expect(listener).toHaveBeenCalledOnce();
  });

  it("emits sp-load when image loads successfully", async () => {
    el.src = "https://example.com/photo.jpg";
    await el.updateComplete;
    const listener = vi.fn();
    el.addEventListener("sp-load", listener);
    const img = el.shadowRoot?.querySelector("img") as HTMLImageElement;
    img.dispatchEvent(new Event("load"));
    expect(listener).toHaveBeenCalledOnce();
  });

  // ---- Error state ----

  it("shows fallback slot on error", async () => {
    el.src = "https://example.com/broken.jpg";
    await el.updateComplete;
    const img = el.shadowRoot?.querySelector("img") as HTMLImageElement;
    img.dispatchEvent(new Event("error"));
    await el.updateComplete;
    expect(el._error).toBe(true);
    expect(el.shadowRoot?.querySelector(".sp-image-fallback")).not.toBeNull();
  });

  it("sets _loaded to true on load event", async () => {
    el.src = "https://example.com/photo.jpg";
    await el.updateComplete;
    const img = el.shadowRoot?.querySelector("img") as HTMLImageElement;
    img.dispatchEvent(new Event("load"));
    await el.updateComplete;
    expect(el._loaded).toBe(true);
  });

  // ---- Rounded ----

  it("rounded prop adds rounded class to wrapper", async () => {
    el.rounded = true;
    await el.updateComplete;
    const wrapper = el.shadowRoot?.querySelector(".sp-image-wrapper");
    expect(wrapper?.classList.contains("sp-image--rounded")).toBe(true);
  });

  it("rounded prop reflects attribute", async () => {
    el.rounded = true;
    await el.updateComplete;
    expect(el.hasAttribute("rounded")).toBe(true);
  });

  // ---- Skeleton ----

  it("shows skeleton while not loaded and no error", async () => {
    el.src = "https://example.com/photo.jpg";
    await el.updateComplete;
    const skeleton = el.shadowRoot?.querySelector(".sp-image-skeleton");
    expect(skeleton?.hasAttribute("hidden")).toBe(false);
  });

  it("hides skeleton after image loads", async () => {
    el.src = "https://example.com/photo.jpg";
    await el.updateComplete;
    const img = el.shadowRoot?.querySelector("img") as HTMLImageElement;
    img.dispatchEvent(new Event("load"));
    await el.updateComplete;
    const skeleton = el.shadowRoot?.querySelector(".sp-image-skeleton");
    expect(skeleton?.hasAttribute("hidden")).toBe(true);
  });

  // ---- Aspect ratio ----

  it("sets aspect-ratio style on wrapper when ratio is provided", async () => {
    el.ratio = "16/9";
    await el.updateComplete;
    const wrapper = el.shadowRoot?.querySelector(".sp-image-wrapper") as HTMLElement;
    expect(wrapper?.style.aspectRatio.replace(/ /g, "")).toBe("16/9");
  });
});
