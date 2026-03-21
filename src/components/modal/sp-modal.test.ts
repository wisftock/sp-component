import { describe, it, expect, beforeEach, vi } from "vitest";
import "./sp-modal.js";
import type { SpModalComponent } from "./sp-modal.js";

function createElement(): SpModalComponent {
  const el = document.createElement("sp-modal") as SpModalComponent;
  document.body.appendChild(el);
  return el;
}

describe("sp-modal", () => {
  let el: SpModalComponent;

  beforeEach(() => {
    document.body.innerHTML = "";
    el = createElement();
  });

  // ---- Rendering ----

  it("renders a dialog element in shadow DOM", async () => {
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector("dialog")).not.toBeNull();
  });

  it("dialog is not open by default", async () => {
    await el.updateComplete;
    expect(el.open).toBe(false);
    expect(el.hasAttribute("open")).toBe(false);
  });

  it("calls showModal when open is set to true", async () => {
    await el.updateComplete;
    const dialog = el.shadowRoot?.querySelector("dialog") as HTMLDialogElement;
    const spy = vi.spyOn(dialog, "showModal").mockImplementation(() => {});
    el.open = true;
    await el.updateComplete;
    expect(spy).toHaveBeenCalledOnce();
  });

  it("calls close when open is set to false after being open", async () => {
    await el.updateComplete;
    const dialog = el.shadowRoot?.querySelector("dialog") as HTMLDialogElement;
    vi.spyOn(dialog, "showModal").mockImplementation(() => {});
    const closeSpy = vi.spyOn(dialog, "close").mockImplementation(() => {});
    el.open = true;
    await el.updateComplete;
    el.open = false;
    await el.updateComplete;
    expect(closeSpy).toHaveBeenCalledOnce();
  });

  // ---- Reflection ----

  it("reflects default size attribute as 'md'", async () => {
    await el.updateComplete;
    expect(el.getAttribute("size")).toBe("md");
  });

  it("reflects open attribute when set", async () => {
    el.open = true;
    await el.updateComplete;
    expect(el.hasAttribute("open")).toBe(true);
  });

  it("reflects closable attribute (default true)", async () => {
    await el.updateComplete;
    expect(el.hasAttribute("closable")).toBe(true);
  });

  it("reflects custom size attribute", async () => {
    el.size = "lg";
    await el.updateComplete;
    expect(el.getAttribute("size")).toBe("lg");
  });

  // ---- Close button ----

  it("renders close button when closable=true", async () => {
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-modal-close")).not.toBeNull();
  });

  it("does not render close button when closable=false", async () => {
    el.closable = false;
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-modal-close")).toBeNull();
  });

  it("close button click sets open=false", async () => {
    el.open = true;
    await el.updateComplete;
    const closeBtn = el.shadowRoot?.querySelector(
      ".sp-modal-close",
    ) as HTMLButtonElement;
    closeBtn.click();
    await el.updateComplete;
    expect(el.open).toBe(false);
  });

  // ---- Events ----

  it("emits sp-show when modal is opened", async () => {
    await el.updateComplete;
    const listener = vi.fn();
    el.addEventListener("sp-show", listener);
    el.open = true;
    await el.updateComplete;
    expect(listener).toHaveBeenCalledOnce();
  });

  it("emits sp-hide when modal is closed", async () => {
    el.open = true;
    await el.updateComplete;
    const listener = vi.fn();
    el.addEventListener("sp-hide", listener);
    el.open = false;
    await el.updateComplete;
    expect(listener).toHaveBeenCalledOnce();
  });

  // ---- Keyboard ----

  it("closes on ESC key", async () => {
    el.open = true;
    await el.updateComplete;
    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
    await el.updateComplete;
    expect(el.open).toBe(false);
  });

  // ---- Slots ----

  it("renders default slot content", async () => {
    el.innerHTML = "<p>Body content</p>";
    await el.updateComplete;
    expect(el.querySelector("p")?.textContent).toBe("Body content");
  });
});
