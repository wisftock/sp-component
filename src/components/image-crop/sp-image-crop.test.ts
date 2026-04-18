import { describe, it, expect, beforeEach } from "vitest";
import "./sp-image-crop.js";
import type { SpImageCropComponent } from "./sp-image-crop.js";

function createElement(): SpImageCropComponent {
  const el = document.createElement("sp-image-crop") as SpImageCropComponent;
  document.body.appendChild(el);
  return el;
}

describe("sp-image-crop", () => {
  let el: SpImageCropComponent;
  beforeEach(() => { document.body.innerHTML = ""; el = createElement(); });

  it("renders crop container in shadow DOM", async () => {
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-crop")).not.toBeNull();
  });

  it("shows empty/placeholder state when no src", async () => {
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-crop--empty")).not.toBeNull();
  });

  it("shows label when set with no image", async () => {
    el.label = "Recortar imagen";
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-crop__label")?.textContent?.trim()).toBe("Recortar imagen");
  });

  it("defaults aspectRatio to 0 (free)", async () => {
    await el.updateComplete;
    expect(el.aspectRatio).toBe(0);
  });

  it("defaults format to png", async () => {
    await el.updateComplete;
    expect(el.format).toBe("png");
  });

  it("defaults quality to 0.92", async () => {
    await el.updateComplete;
    expect(el.quality).toBe(0.92);
  });

  it("placeholder text shows no image when src is empty", async () => {
    await el.updateComplete;
    const placeholder = el.shadowRoot?.querySelector(".sp-crop__placeholder");
    expect(placeholder?.textContent).toContain("No image source provided");
  });

  it("placeholder text changes when src is set (loading)", async () => {
    el.src = "image.jpg";
    await el.updateComplete;
    const placeholder = el.shadowRoot?.querySelector(".sp-crop__placeholder");
    // After setting src but before image loads
    if (placeholder) {
      expect(placeholder.textContent).toContain("Loading");
    }
  });
});
