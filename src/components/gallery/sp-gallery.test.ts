import { describe, it, expect, beforeEach, vi } from "vitest";
import "./sp-gallery.js";
import type { SpGalleryComponent } from "./sp-gallery.js";
import type { SpGalleryItem } from "./sp-gallery.types.js";

const ITEMS: SpGalleryItem[] = [
  { src: "a.jpg", alt: "Image A", caption: "Caption A" },
  { src: "b.jpg", alt: "Image B" },
  { src: "c.jpg", alt: "Image C" },
];

function createElement(): SpGalleryComponent {
  const el = document.createElement("sp-gallery") as SpGalleryComponent;
  document.body.appendChild(el);
  return el;
}

describe("sp-gallery", () => {
  let el: SpGalleryComponent;

  beforeEach(() => {
    document.body.innerHTML = "";
    el = createElement();
  });

  // ---- Rendering ----

  it("renders in shadow DOM", async () => {
    el.items = ITEMS;
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-gallery")).not.toBeNull();
  });

  it("renders empty state when items is empty", async () => {
    el.items = [];
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-gallery-empty")).not.toBeNull();
  });

  it("renders skeleton when loading is true", async () => {
    el.loading = true;
    el.skeletonCount = 6;
    await el.updateComplete;
    const skeletons = el.shadowRoot?.querySelectorAll(".sp-gallery-item--skeleton");
    expect(skeletons?.length).toBe(6);
  });

  it("renders correct number of items", async () => {
    el.items = ITEMS;
    await el.updateComplete;
    const items = el.shadowRoot?.querySelectorAll(".sp-gallery-item");
    expect(items?.length).toBe(3);
  });

  it("renders images with lazy loading", async () => {
    el.items = ITEMS;
    await el.updateComplete;
    const imgs = el.shadowRoot?.querySelectorAll<HTMLImageElement>(".sp-gallery-img");
    imgs?.forEach((img) => expect(img.getAttribute("loading")).toBe("lazy"));
  });

  it("renders caption for items that have one", async () => {
    el.items = ITEMS;
    await el.updateComplete;
    const captions = el.shadowRoot?.querySelectorAll(".sp-gallery-item-caption");
    expect(captions?.length).toBe(1);
  });

  // ---- Layout ----

  it("applies grid class by default", async () => {
    el.items = ITEMS;
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-gallery--grid")).not.toBeNull();
  });

  it("applies masonry class when layout=masonry", async () => {
    el.items = ITEMS;
    el.layout = "masonry";
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-gallery--masonry")).not.toBeNull();
  });

  it("passes columns as CSS variable", async () => {
    el.items = ITEMS;
    el.columns = 4;
    await el.updateComplete;
    const grid = el.shadowRoot?.querySelector<HTMLElement>(".sp-gallery");
    expect(grid?.style.getPropertyValue("--sp-gallery-cols")).toBe("4");
  });

  it("passes gap as CSS variable", async () => {
    el.items = ITEMS;
    el.gap = 16;
    await el.updateComplete;
    const grid = el.shadowRoot?.querySelector<HTMLElement>(".sp-gallery");
    expect(grid?.style.getPropertyValue("--sp-gallery-gap")).toBe("16px");
  });

  // ---- Events ----

  it("emits sp-item-click when item is clicked", async () => {
    el.items = ITEMS;
    await el.updateComplete;
    const listener = vi.fn();
    el.addEventListener("sp-item-click", listener);
    const item = el.shadowRoot?.querySelectorAll<HTMLElement>(".sp-gallery-item")[1]!;
    item.click();
    expect(listener).toHaveBeenCalledOnce();
    expect(listener.mock.calls[0]![0].detail.index).toBe(1);
  });

  // ---- Lightbox ----

  it("_openLightbox sets _lightboxOpen and index", () => {
    el.items = ITEMS;
    el._openLightbox(1);
    expect(el._lightboxOpen).toBe(true);
    expect(el._lightboxIndex).toBe(1);
  });

  it("_closeLightbox clears _lightboxOpen", () => {
    el.items = ITEMS;
    el._openLightbox(0);
    el._closeLightbox();
    expect(el._lightboxOpen).toBe(false);
  });

  it("renders lightbox when open", async () => {
    el.items = ITEMS;
    el._openLightbox(0);
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-gallery-lightbox")).not.toBeNull();
  });

  it("does not render lightbox when closed", async () => {
    el.items = ITEMS;
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-gallery-lightbox")).toBeNull();
  });

  it("_lightboxNext advances index", () => {
    el.items = ITEMS;
    el._openLightbox(0);
    el._lightboxNext();
    expect(el._lightboxIndex).toBe(1);
  });

  it("_lightboxNext wraps from last to first", () => {
    el.items = ITEMS;
    el._openLightbox(2);
    el._lightboxNext();
    expect(el._lightboxIndex).toBe(0);
  });

  it("_lightboxPrev goes to previous", () => {
    el.items = ITEMS;
    el._openLightbox(2);
    el._lightboxPrev();
    expect(el._lightboxIndex).toBe(1);
  });

  it("_lightboxPrev wraps from first to last", () => {
    el.items = ITEMS;
    el._openLightbox(0);
    el._lightboxPrev();
    expect(el._lightboxIndex).toBe(2);
  });

  it("emits sp-lightbox-open when opening", () => {
    el.items = ITEMS;
    const listener = vi.fn();
    el.addEventListener("sp-lightbox-open", listener);
    el._openLightbox(1);
    expect(listener).toHaveBeenCalledOnce();
    expect(listener.mock.calls[0]![0].detail.index).toBe(1);
  });

  it("emits sp-lightbox-close when closing", () => {
    el.items = ITEMS;
    el._openLightbox(0);
    const listener = vi.fn();
    el.addEventListener("sp-lightbox-close", listener);
    el._closeLightbox();
    expect(listener).toHaveBeenCalledOnce();
  });

  it("lightbox=false prevents lightbox from opening on item click", async () => {
    el.items = ITEMS;
    el.lightbox = false;
    await el.updateComplete;
    el.shadowRoot?.querySelectorAll<HTMLElement>(".sp-gallery-item")[0]!.click();
    expect(el._lightboxOpen).toBe(false);
  });

  // ---- Selection ----

  it("selectable: clicking item toggles selection", async () => {
    el.items = ITEMS;
    el.selectable = true;
    await el.updateComplete;
    el._onItemClick(0);
    expect(el.selectedIndices).toContain(0);
  });

  it("selectable: clicking selected item deselects it", () => {
    el.items = ITEMS;
    el.selectable = true;
    el._onItemClick(1);
    el._onItemClick(1);
    expect(el.selectedIndices).not.toContain(1);
  });

  it("selectable: emits sp-selection-change on toggle", () => {
    el.items = ITEMS;
    el.selectable = true;
    const listener = vi.fn();
    el.addEventListener("sp-selection-change", listener);
    el._onItemClick(0);
    expect(listener).toHaveBeenCalledOnce();
    expect(listener.mock.calls[0]![0].detail.indices).toContain(0);
  });

  it("selectable: does not open lightbox", () => {
    el.items = ITEMS;
    el.selectable = true;
    el._onItemClick(0);
    expect(el._lightboxOpen).toBe(false);
  });

  it("selectAll selects all indices", () => {
    el.items = ITEMS;
    el.selectAll();
    expect(el.selectedIndices.length).toBe(3);
  });

  it("clearSelection empties selection", () => {
    el.items = ITEMS;
    el.selectedIndices = [0, 1];
    el.clearSelection();
    expect(el.selectedIndices.length).toBe(0);
  });
});
