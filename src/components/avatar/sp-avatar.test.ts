import { describe, it, expect, beforeEach } from "vitest";
import "./sp-avatar.js";
import type { SpAvatarComponent } from "./sp-avatar.js";

function createElement(): SpAvatarComponent {
  const el = document.createElement("sp-avatar") as SpAvatarComponent;
  document.body.appendChild(el);
  return el;
}

describe("sp-avatar", () => {
  let el: SpAvatarComponent;

  beforeEach(() => {
    document.body.innerHTML = "";
    el = createElement();
  });

  // ---- Rendering ----

  it("renders a .sp-avatar div in shadow DOM", async () => {
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-avatar")).not.toBeNull();
  });

  it("renders placeholder when no src and no initials", async () => {
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-avatar-placeholder")).not.toBeNull();
    expect(el.shadowRoot?.querySelector("img")).toBeNull();
    expect(el.shadowRoot?.querySelector(".sp-avatar-initials")).toBeNull();
  });

  it("renders image when src is set", async () => {
    el.src = "https://example.com/avatar.jpg";
    await el.updateComplete;
    const img = el.shadowRoot?.querySelector("img");
    expect(img).not.toBeNull();
    expect(img?.getAttribute("src")).toBe("https://example.com/avatar.jpg");
  });

  it("sets alt attribute on img element", async () => {
    el.src = "https://example.com/avatar.jpg";
    el.alt = "John Doe";
    await el.updateComplete;
    const img = el.shadowRoot?.querySelector("img");
    expect(img?.getAttribute("alt")).toBe("John Doe");
  });

  it("renders initials span when no src but initials are provided", async () => {
    el.initials = "Jane Doe";
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-avatar-initials")).not.toBeNull();
    expect(el.shadowRoot?.querySelector("img")).toBeNull();
  });

  // ---- _getInitials ----

  it("_getInitials returns up to 2 uppercase letters", async () => {
    el.initials = "John Doe";
    await el.updateComplete;
    expect(el._getInitials()).toBe("JD");
  });

  it("_getInitials trims to 2 characters for 3+ word names", async () => {
    el.initials = "Ana Maria Lopez";
    await el.updateComplete;
    expect(el._getInitials()).toBe("AM");
  });

  it("_getInitials handles single word", async () => {
    el.initials = "Alice";
    await el.updateComplete;
    expect(el._getInitials()).toBe("A");
  });

  // ---- Image error fallback ----

  it("falls back to initials after image error", async () => {
    el.src = "https://broken.example.com/avatar.jpg";
    el.initials = "JD";
    await el.updateComplete;

    el._handleImageError();
    await el.updateComplete;

    expect(el.shadowRoot?.querySelector(".sp-avatar-initials")).not.toBeNull();
    expect(el.shadowRoot?.querySelector("img")).toBeNull();
  });

  it("falls back to placeholder after image error when no initials", async () => {
    el.src = "https://broken.example.com/avatar.jpg";
    await el.updateComplete;

    el._handleImageError();
    await el.updateComplete;

    expect(el.shadowRoot?.querySelector(".sp-avatar-placeholder")).not.toBeNull();
    expect(el.shadowRoot?.querySelector("img")).toBeNull();
  });

  // ---- Shape reflection ----

  it("reflects default shape attribute as 'circle'", async () => {
    await el.updateComplete;
    expect(el.getAttribute("shape")).toBe("circle");
  });

  it("reflects shape attribute when changed to 'square'", async () => {
    el.shape = "square";
    await el.updateComplete;
    expect(el.getAttribute("shape")).toBe("square");
  });

  // ---- Size reflection ----

  it("reflects default size attribute as 'md'", async () => {
    await el.updateComplete;
    expect(el.getAttribute("size")).toBe("md");
  });

  it("reflects size attribute when changed", async () => {
    el.size = "xl";
    await el.updateComplete;
    expect(el.getAttribute("size")).toBe("xl");
  });
});
