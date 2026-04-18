import { describe, it, expect, beforeEach, vi } from "vitest";
import "./sp-lightbox.js";
import type { SpLightboxComponent } from "./sp-lightbox.js";

function createElement(): SpLightboxComponent {
  const el = document.createElement("sp-lightbox") as SpLightboxComponent;
  document.body.appendChild(el);
  return el;
}

describe("sp-lightbox", () => {
  let el: SpLightboxComponent;

  beforeEach(() => {
    document.body.innerHTML = "";
    el = createElement();
  });

  it("renders gallery thumbnails in shadow DOM", async () => {
    el.images = [{ src: "a.jpg" }, { src: "b.jpg" }];
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-lb-gallery")).not.toBeNull();
  });

  it("renders correct number of thumbnails", async () => {
    el.images = [{ src: "a.jpg" }, { src: "b.jpg" }, { src: "c.jpg" }];
    await el.updateComplete;
    const thumbs = el.shadowRoot?.querySelectorAll(".sp-lb-thumb");
    expect(thumbs?.length).toBe(3);
  });

  it("lightbox overlay is not visible by default", async () => {
    el.images = [{ src: "a.jpg" }];
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-lb-overlay")).toBeNull();
  });

  it("opens overlay when openAt() is called", async () => {
    el.images = [{ src: "a.jpg" }];
    await el.updateComplete;
    el.openAt(0);
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-lb-overlay")).not.toBeNull();
  });

  it("closes overlay when close button is clicked", async () => {
    el.images = [{ src: "a.jpg" }];
    await el.updateComplete;
    el.openAt(0);
    await el.updateComplete;
    el.shadowRoot?.querySelector<HTMLButtonElement>(".sp-lb-close")?.click();
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-lb-overlay")).toBeNull();
  });

  it("shows navigation arrows for multiple images", async () => {
    el.images = [{ src: "a.jpg" }, { src: "b.jpg" }];
    await el.updateComplete;
    el.openAt(0);
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-lb-arrow--prev")).not.toBeNull();
    expect(el.shadowRoot?.querySelector(".sp-lb-arrow--next")).not.toBeNull();
  });

  it("navigates to next image on next arrow click", async () => {
    el.images = [{ src: "a.jpg" }, { src: "b.jpg" }];
    await el.updateComplete;
    el.openAt(0);
    await el.updateComplete;
    el.shadowRoot?.querySelector<HTMLButtonElement>(".sp-lb-arrow--next")?.click();
    await el.updateComplete;
    const counter = el.shadowRoot?.querySelector(".sp-lb-counter");
    expect(counter?.textContent).toContain("2");
  });

  it("emits sp-close event when closed", async () => {
    el.images = [{ src: "a.jpg" }];
    await el.updateComplete;
    el.openAt(0);
    await el.updateComplete;
    const listener = vi.fn();
    el.addEventListener("sp-close", listener);
    el.shadowRoot?.querySelector<HTMLButtonElement>(".sp-lb-close")?.click();
    expect(listener).toHaveBeenCalledOnce();
  });

  it("emits sp-change event on navigation", async () => {
    el.images = [{ src: "a.jpg" }, { src: "b.jpg" }];
    await el.updateComplete;
    el.openAt(0);
    await el.updateComplete;
    const listener = vi.fn();
    el.addEventListener("sp-change", listener);
    el.shadowRoot?.querySelector<HTMLButtonElement>(".sp-lb-arrow--next")?.click();
    expect(listener).toHaveBeenCalledOnce();
  });

  it("shows counter with current/total", async () => {
    el.images = [{ src: "a.jpg" }, { src: "b.jpg" }, { src: "c.jpg" }];
    await el.updateComplete;
    el.openAt(1);
    await el.updateComplete;
    const counter = el.shadowRoot?.querySelector(".sp-lb-counter");
    expect(counter?.textContent).toContain("2 / 3");
  });
});
