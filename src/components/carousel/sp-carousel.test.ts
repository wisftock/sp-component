import { describe, it, expect, beforeEach, vi } from "vitest";
import "./sp-carousel.js";
import "./sp-carousel-slide.js";
import type { SpCarouselComponent } from "./sp-carousel.js";

function createElement(slideCount = 3): SpCarouselComponent {
  const el = document.createElement("sp-carousel") as SpCarouselComponent;
  for (let i = 0; i < slideCount; i++) {
    const slide = document.createElement("sp-carousel-slide");
    slide.textContent = `Slide ${i + 1}`;
    el.appendChild(slide);
  }
  document.body.appendChild(el);
  return el;
}

describe("sp-carousel", () => {
  let el: SpCarouselComponent;

  beforeEach(() => {
    document.body.innerHTML = "";
    el = createElement(3);
  });

  // ---- Rendering ----

  it("renders carousel in shadow DOM", async () => {
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-carousel")).not.toBeNull();
  });

  it("renders arrow buttons by default", async () => {
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-carousel-arrow--prev")).not.toBeNull();
    expect(el.shadowRoot?.querySelector(".sp-carousel-arrow--next")).not.toBeNull();
  });

  it("renders dots by default", async () => {
    await el.updateComplete;
    // Trigger slot change to count slides
    el._onSlotChange();
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-carousel-dots")).not.toBeNull();
  });

  it("hides arrows when show-arrows=false", async () => {
    el.showArrows = false;
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-carousel-arrow--prev")).toBeNull();
  });

  it("hides dots when show-dots=false", async () => {
    el.showDots = false;
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-carousel-dots")).toBeNull();
  });

  // ---- Default state ----

  it("starts at index 0", async () => {
    await el.updateComplete;
    expect(el.currentIndex).toBe(0);
  });

  it("reflects currentIndex attribute", async () => {
    await el.updateComplete;
    expect(el.getAttribute("current-index")).toBe("0");
  });

  // ---- Navigation ----

  it("advances to next slide", async () => {
    await el.updateComplete;
    el._next();
    expect(el.currentIndex).toBe(1);
  });

  it("goes back to previous slide", async () => {
    el.currentIndex = 1;
    await el.updateComplete;
    el._prev();
    expect(el.currentIndex).toBe(0);
  });

  it("goTo moves to specific index", async () => {
    await el.updateComplete;
    el._goTo(2);
    expect(el.currentIndex).toBe(2);
  });

  it("does not go past the last slide when loop=false", async () => {
    el.currentIndex = 2;
    await el.updateComplete;
    el._next();
    expect(el.currentIndex).toBe(2);
  });

  it("does not go before first slide when loop=false", async () => {
    await el.updateComplete;
    el._prev();
    expect(el.currentIndex).toBe(0);
  });

  it("wraps around to last when loop=true and at start", async () => {
    el.loop = true;
    await el.updateComplete;
    el._prev();
    expect(el.currentIndex).toBe(2);
  });

  it("wraps around to first when loop=true and at end", async () => {
    el.loop = true;
    el.currentIndex = 2;
    await el.updateComplete;
    el._next();
    expect(el.currentIndex).toBe(0);
  });

  // ---- Events ----

  it("emits sp-slide-change when slide changes", async () => {
    await el.updateComplete;
    const listener = vi.fn();
    el.addEventListener("sp-slide-change", listener);
    el._next();
    expect(listener).toHaveBeenCalledOnce();
    expect((listener.mock.calls[0]?.[0] as CustomEvent<{ index: number }>).detail).toEqual({ index: 1 });
  });

  it("does not emit sp-slide-change when index does not change", async () => {
    await el.updateComplete;
    const listener = vi.fn();
    el.addEventListener("sp-slide-change", listener);
    el._goTo(0); // already at 0
    expect(listener).not.toHaveBeenCalled();
  });

  // ---- Keyboard navigation ----

  it("ArrowRight advances slide (horizontal)", async () => {
    await el.updateComplete;
    el.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true }));
    expect(el.currentIndex).toBe(1);
  });

  it("ArrowLeft goes back (horizontal)", async () => {
    el.loop = true;
    await el.updateComplete;
    el.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowLeft", bubbles: true }));
    expect(el.currentIndex).toBe(2);
  });

  it("Home goes to first slide", async () => {
    el.currentIndex = 2;
    await el.updateComplete;
    el.dispatchEvent(new KeyboardEvent("keydown", { key: "Home", bubbles: true }));
    expect(el.currentIndex).toBe(0);
  });

  it("End goes to last slide", async () => {
    await el.updateComplete;
    el.dispatchEvent(new KeyboardEvent("keydown", { key: "End", bubbles: true }));
    expect(el.currentIndex).toBe(2);
  });

  it("ArrowDown advances slide (vertical)", async () => {
    el.orientation = "vertical";
    await el.updateComplete;
    el.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true }));
    expect(el.currentIndex).toBe(1);
  });

  // ---- Touch swipe ----

  it("swipe left advances slide", async () => {
    await el.updateComplete;
    el._onTouchStart({ touches: [{ clientX: 200, clientY: 0 }] } as unknown as TouchEvent);
    el._onTouchEnd({ changedTouches: [{ clientX: 140, clientY: 0 }] } as unknown as TouchEvent);
    expect(el.currentIndex).toBe(1);
  });

  it("swipe right goes back", async () => {
    el.loop = true;
    await el.updateComplete;
    el._onTouchStart({ touches: [{ clientX: 100, clientY: 0 }] } as unknown as TouchEvent);
    el._onTouchEnd({ changedTouches: [{ clientX: 160, clientY: 0 }] } as unknown as TouchEvent);
    expect(el.currentIndex).toBe(2);
  });

  it("small swipe (below threshold) does not change slide", async () => {
    await el.updateComplete;
    el._onTouchStart({ touches: [{ clientX: 100, clientY: 0 }] } as unknown as TouchEvent);
    el._onTouchEnd({ changedTouches: [{ clientX: 120, clientY: 0 }] } as unknown as TouchEvent);
    expect(el.currentIndex).toBe(0);
  });

  // ---- Mouse drag ----

  it("mouse drag left advances slide", async () => {
    await el.updateComplete;
    el._onMouseDown({ button: 0, clientX: 200, clientY: 0 } as MouseEvent);
    // simulate move > threshold
    window.dispatchEvent(new MouseEvent("mousemove", { clientX: 140, clientY: 0 }));
    window.dispatchEvent(new MouseEvent("mouseup"));
    expect(el.currentIndex).toBe(1);
  });

  it("mouse drag right goes back (with loop)", async () => {
    el.loop = true;
    await el.updateComplete;
    el._onMouseDown({ button: 0, clientX: 100, clientY: 0 } as MouseEvent);
    window.dispatchEvent(new MouseEvent("mousemove", { clientX: 160, clientY: 0 }));
    window.dispatchEvent(new MouseEvent("mouseup"));
    expect(el.currentIndex).toBe(2);
  });

  it("mouse drag below threshold does not change slide", async () => {
    await el.updateComplete;
    el._onMouseDown({ button: 0, clientX: 100, clientY: 0 } as MouseEvent);
    window.dispatchEvent(new MouseEvent("mousemove", { clientX: 120, clientY: 0 }));
    window.dispatchEvent(new MouseEvent("mouseup"));
    expect(el.currentIndex).toBe(0);
  });

  it("non-left mouse button does not start drag", async () => {
    await el.updateComplete;
    el._onMouseDown({ button: 1, clientX: 100, clientY: 0 } as MouseEvent);
    window.dispatchEvent(new MouseEvent("mousemove", { clientX: 20, clientY: 0 }));
    window.dispatchEvent(new MouseEvent("mouseup"));
    expect(el.currentIndex).toBe(0);
  });

  // ---- Effect: fade ----

  it("defaults to slide effect", async () => {
    await el.updateComplete;
    expect(el.effect).toBe("slide");
  });

  it("accepts fade effect", async () => {
    el.effect = "fade";
    await el.updateComplete;
    expect(el.getAttribute("effect")).toBe("fade");
  });

  // ---- Pause on hover ----

  it("pause-on-hover stops autoplay on mouseenter", async () => {
    el.autoplay = true;
    el.pauseOnHover = true;
    await el.updateComplete;
    const stopSpy = vi.spyOn(el as any, "_stopAutoplay");
    el._onMouseEnter();
    expect(stopSpy).toHaveBeenCalledOnce();
  });

  it("pause-on-hover resumes autoplay on mouseleave", async () => {
    el.autoplay = true;
    el.pauseOnHover = true;
    await el.updateComplete;
    const startSpy = vi.spyOn(el as any, "_startAutoplay");
    el._onMouseLeave();
    expect(startSpy).toHaveBeenCalledOnce();
  });

  it("mouseleave without pauseOnHover does not restart autoplay", async () => {
    el.autoplay = false;
    el.pauseOnHover = false;
    await el.updateComplete;
    const startSpy = vi.spyOn(el as any, "_startAutoplay");
    el._onMouseLeave();
    expect(startSpy).not.toHaveBeenCalled();
  });
});
