import { describe, it, expect, beforeEach, vi } from "vitest";
import "./sp-button.js";
import type { SpButtonComponent } from "./sp-button.js";

function createElement(): SpButtonComponent {
  const el = document.createElement("sp-button") as SpButtonComponent;
  document.body.appendChild(el);
  return el;
}

describe("sp-button", () => {
  let el: SpButtonComponent;

  beforeEach(() => {
    document.body.innerHTML = "";
    el = createElement();
  });

  // ---- Rendering ----

  it("renders a button element in shadow DOM by default", async () => {
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector("button")).not.toBeNull();
    expect(el.shadowRoot?.querySelector("a")).toBeNull();
  });

  it("renders an anchor element when href is set", async () => {
    el.href = "https://example.com";
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector("a")).not.toBeNull();
    expect(el.shadowRoot?.querySelector("button")).toBeNull();
  });

  // ---- Default props ----

  it("reflects default variant attribute", async () => {
    await el.updateComplete;
    expect(el.getAttribute("variant")).toBe("primary");
  });

  it("reflects default size attribute", async () => {
    await el.updateComplete;
    expect(el.getAttribute("size")).toBe("md");
  });

  it("is not disabled by default", async () => {
    await el.updateComplete;
    expect(el.disabled).toBe(false);
    expect(el.hasAttribute("disabled")).toBe(false);
  });

  it("is not loading by default", async () => {
    await el.updateComplete;
    expect(el.loading).toBe(false);
    expect(el.hasAttribute("loading")).toBe(false);
  });

  // ---- Variant & size reflection ----

  it("reflects custom variant attribute", async () => {
    el.variant = "destructive";
    await el.updateComplete;
    expect(el.getAttribute("variant")).toBe("destructive");
  });

  it("reflects custom size attribute", async () => {
    el.size = "lg";
    await el.updateComplete;
    expect(el.getAttribute("size")).toBe("lg");
  });

  // ---- Disabled ----

  it("reflects disabled attribute when set", async () => {
    el.disabled = true;
    await el.updateComplete;
    expect(el.hasAttribute("disabled")).toBe(true);
  });

  it("does NOT emit sp-click when disabled", async () => {
    el.disabled = true;
    await el.updateComplete;
    const listener = vi.fn();
    el.addEventListener("sp-click", listener);
    el.click();
    expect(listener).not.toHaveBeenCalled();
  });

  // ---- Loading ----

  it("reflects loading attribute when set", async () => {
    el.loading = true;
    await el.updateComplete;
    expect(el.hasAttribute("loading")).toBe(true);
  });

  it("renders spinner when loading", async () => {
    el.loading = true;
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-spinner")).not.toBeNull();
  });

  it("does not render spinner when not loading", async () => {
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-spinner")).toBeNull();
  });

  it("does NOT emit sp-click when loading", async () => {
    el.loading = true;
    await el.updateComplete;
    const listener = vi.fn();
    el.addEventListener("sp-click", listener);
    el.click();
    expect(listener).not.toHaveBeenCalled();
  });

  // ---- sp-click event ----

  it("emits sp-click event when clicked", async () => {
    await el.updateComplete;
    const listener = vi.fn();
    el.addEventListener("sp-click", listener);
    el.click();
    expect(listener).toHaveBeenCalledOnce();
  });

  it("emits sp-click detail with source", async () => {
    await el.updateComplete;
    let detail: { source: string } | null = null;
    el.addEventListener("sp-click", (e) => {
      detail = (e as CustomEvent<{ source: string }>).detail;
    });
    el.click();
    expect(detail).toEqual({ source: "sp-button" });
  });

  // ---- href ----

  it("sets href on anchor element", async () => {
    el.href = "https://example.com";
    await el.updateComplete;
    const anchor = el.shadowRoot?.querySelector("a");
    expect(anchor?.getAttribute("href")).toBe("https://example.com");
  });

  it("removes href from anchor when disabled", async () => {
    el.href = "https://example.com";
    el.disabled = true;
    await el.updateComplete;
    const anchor = el.shadowRoot?.querySelector("a");
    expect(anchor?.getAttribute("href")).toBeNull();
  });

  it("sets target on anchor element", async () => {
    el.href = "https://example.com";
    el.target = "_blank";
    await el.updateComplete;
    const anchor = el.shadowRoot?.querySelector("a");
    expect(anchor?.getAttribute("target")).toBe("_blank");
  });

  // ---- Form attributes ----

  it("sets name on button element", async () => {
    el.name = "submit-btn";
    await el.updateComplete;
    const btn = el.shadowRoot?.querySelector("button");
    expect(btn?.getAttribute("name")).toBe("submit-btn");
  });

  it("sets value on button element", async () => {
    el.value = "confirm";
    await el.updateComplete;
    const btn = el.shadowRoot?.querySelector("button");
    expect(btn?.getAttribute("value")).toBe("confirm");
  });

  // ---- Slot content ----

  it("renders default slot content", async () => {
    el.innerHTML = "Guardar";
    await el.updateComplete;
    expect(el.textContent).toBe("Guardar");
  });
});
