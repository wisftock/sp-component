import { describe, it, expect, beforeEach, vi } from "vitest";
import "./sp-banner.js";
import type { SpBannerComponent } from "./sp-banner.js";

function createElement(): SpBannerComponent {
  const el = document.createElement("sp-banner") as SpBannerComponent;
  document.body.appendChild(el);
  return el;
}

describe("sp-banner", () => {
  let el: SpBannerComponent;

  beforeEach(() => {
    document.body.innerHTML = "";
    el = createElement();
  });

  // ---- Rendering ----

  it("renders the banner wrapper in shadow DOM", async () => {
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-banner")).not.toBeNull();
  });

  it("has role=status and aria-live=polite", async () => {
    await el.updateComplete;
    const div = el.shadowRoot?.querySelector(".sp-banner");
    expect(div?.getAttribute("role")).toBe("status");
    expect(div?.getAttribute("aria-live")).toBe("polite");
  });

  // ---- Default props ----

  it("has variant info by default", async () => {
    await el.updateComplete;
    expect(el.variant).toBe("info");
    expect(el.getAttribute("variant")).toBe("info");
  });

  it("has dismissable=true by default", async () => {
    await el.updateComplete;
    expect(el.dismissable).toBe(true);
  });

  it("has icon=true by default", async () => {
    await el.updateComplete;
    expect(el.icon).toBe(true);
  });

  it("has sticky=false by default", async () => {
    await el.updateComplete;
    expect(el.sticky).toBe(false);
    expect(el.hasAttribute("sticky")).toBe(false);
  });

  // ---- Variant ----

  it("reflects variant attribute", async () => {
    el.variant = "error";
    await el.updateComplete;
    expect(el.getAttribute("variant")).toBe("error");
  });

  it("applies variant class to wrapper", async () => {
    el.variant = "success";
    await el.updateComplete;
    const div = el.shadowRoot?.querySelector(".sp-banner");
    expect(div?.classList.contains("sp-banner--success")).toBe(true);
  });

  it("applies info variant class by default", async () => {
    await el.updateComplete;
    const div = el.shadowRoot?.querySelector(".sp-banner");
    expect(div?.classList.contains("sp-banner--info")).toBe(true);
  });

  // ---- Title / message ----

  it("renders title when title prop is set", async () => {
    el.title = "Mantenimiento programado";
    await el.updateComplete;
    const titleEl = el.shadowRoot?.querySelector(".sp-banner-title");
    expect(titleEl?.textContent?.trim()).toBe("Mantenimiento programado");
  });

  it("does not render title element when title is empty", async () => {
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-banner-title")).toBeNull();
  });

  it("renders message when message prop is set", async () => {
    el.message = "El servicio estará inactivo de 2am a 4am.";
    await el.updateComplete;
    const desc = el.shadowRoot?.querySelector(".sp-banner-desc");
    expect(desc?.textContent?.trim()).toBe("El servicio estará inactivo de 2am a 4am.");
  });

  it("does not render message element when message is empty", async () => {
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-banner-desc")).toBeNull();
  });

  // ---- Icon ----

  it("renders icon when icon=true", async () => {
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-banner-icon")).not.toBeNull();
  });

  it("does not render icon when icon=false", async () => {
    el.icon = false;
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-banner-icon")).toBeNull();
  });

  // ---- Dismiss button ----

  it("renders close button when dismissable=true", async () => {
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-banner-close")).not.toBeNull();
  });

  it("does not render close button when dismissable=false", async () => {
    el.dismissable = false;
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-banner-close")).toBeNull();
  });

  // ---- Dismiss event ----

  it("emits sp-dismiss event when close button is clicked", async () => {
    await el.updateComplete;
    const listener = vi.fn();
    el.addEventListener("sp-dismiss", listener);

    const btn = el.shadowRoot?.querySelector(".sp-banner-close") as HTMLButtonElement;
    btn.click();

    expect(listener).toHaveBeenCalledOnce();
  });

  it("sets hidden attribute after dismiss", async () => {
    await el.updateComplete;
    const btn = el.shadowRoot?.querySelector(".sp-banner-close") as HTMLButtonElement;
    btn.click();
    expect(el.hasAttribute("hidden")).toBe(true);
  });

  // ---- Sticky ----

  it("reflects sticky attribute when set", async () => {
    el.sticky = true;
    await el.updateComplete;
    expect(el.hasAttribute("sticky")).toBe(true);
  });

  // ---- Variants correctness ----

  it("applies warning class when variant is warning", async () => {
    el.variant = "warning";
    await el.updateComplete;
    const div = el.shadowRoot?.querySelector(".sp-banner");
    expect(div?.classList.contains("sp-banner--warning")).toBe(true);
  });

  it("applies error class when variant is error", async () => {
    el.variant = "error";
    await el.updateComplete;
    const div = el.shadowRoot?.querySelector(".sp-banner");
    expect(div?.classList.contains("sp-banner--error")).toBe(true);
  });
});
