import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import "./sp-toast.js";
import type { SpToastComponent } from "./sp-toast.js";

function createElement(): SpToastComponent {
  const el = document.createElement("sp-toast") as SpToastComponent;
  document.body.appendChild(el);
  return el;
}

describe("sp-toast", () => {
  let el: SpToastComponent;

  beforeEach(() => {
    document.body.innerHTML = "";
    el = createElement();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  // ---- Rendering ----

  it("renders the toast div", async () => {
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-toast")).not.toBeNull();
  });

  it("does not have sp-toast--open class when open=false", async () => {
    el.open = false;
    await el.updateComplete;
    const toast = el.shadowRoot?.querySelector(".sp-toast");
    expect(toast?.classList.contains("sp-toast--open")).toBe(false);
  });

  it("has sp-toast--open class when open=true", async () => {
    el.open = true;
    await el.updateComplete;
    const toast = el.shadowRoot?.querySelector(".sp-toast");
    expect(toast?.classList.contains("sp-toast--open")).toBe(true);
  });

  it("has sp-toast--hidden class when open=false", async () => {
    el.open = false;
    await el.updateComplete;
    const toast = el.shadowRoot?.querySelector(".sp-toast");
    expect(toast?.classList.contains("sp-toast--hidden")).toBe(true);
  });

  // ---- Default props ----

  it("reflects default variant=neutral attribute", async () => {
    await el.updateComplete;
    expect(el.getAttribute("variant")).toBe("neutral");
  });

  it("reflects variant attribute when changed", async () => {
    el.variant = "success";
    await el.updateComplete;
    expect(el.getAttribute("variant")).toBe("success");
  });

  // ---- Message ----

  it("shows message text in the toast", async () => {
    el.message = "File saved";
    await el.updateComplete;
    const msgEl = el.shadowRoot?.querySelector(".sp-toast-message");
    expect(msgEl?.textContent?.trim()).toContain("File saved");
  });

  // ---- Closable ----

  it("shows close button when closable=true", async () => {
    el.closable = true;
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-toast-close")).not.toBeNull();
  });

  it("does not show close button when closable=false", async () => {
    el.closable = false;
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-toast-close")).toBeNull();
  });

  it("reflects closable attribute", async () => {
    el.closable = true;
    await el.updateComplete;
    expect(el.hasAttribute("closable")).toBe(true);
  });

  // ---- Close button click ----

  it("emits sp-hide event when close button is clicked", async () => {
    el.open = true;
    el.closable = true;
    await el.updateComplete;
    let fired = false;
    el.addEventListener("sp-hide", () => { fired = true; });
    const btn = el.shadowRoot?.querySelector<HTMLButtonElement>(".sp-toast-close");
    btn?.click();
    expect(fired).toBe(true);
  });

  it("sets open=false when close button is clicked", async () => {
    el.open = true;
    el.closable = true;
    await el.updateComplete;
    const btn = el.shadowRoot?.querySelector<HTMLButtonElement>(".sp-toast-close");
    btn?.click();
    await el.updateComplete;
    expect(el.open).toBe(false);
  });

  // ---- sp-show event ----

  it("emits sp-show event when open changes to true", async () => {
    let fired = false;
    el.addEventListener("sp-show", () => { fired = true; });
    el.open = true;
    await el.updateComplete;
    expect(fired).toBe(true);
  });

  // ---- Auto-close timer ----

  it("does not auto-close when duration=0", async () => {
    vi.useFakeTimers();
    el.duration = 0;
    el.open = true;
    await el.updateComplete;
    vi.advanceTimersByTime(10000);
    await el.updateComplete;
    expect(el.open).toBe(true);
  });

  it("auto-closes after duration ms when duration > 0", async () => {
    vi.useFakeTimers();
    el.duration = 1000;
    el.open = true;
    await el.updateComplete;
    vi.advanceTimersByTime(1000);
    await el.updateComplete;
    expect(el.open).toBe(false);
  });

  // ---- All variants render ----

  it("renders toast for all variants", async () => {
    for (const variant of ["neutral", "info", "success", "warning", "error"] as const) {
      el.variant = variant;
      await el.updateComplete;
      expect(el.shadowRoot?.querySelector(".sp-toast")).not.toBeNull();
    }
  });

  // ---- role / aria ----

  it("has role=status on the toast div", async () => {
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector("[role='status']")).not.toBeNull();
  });
});
