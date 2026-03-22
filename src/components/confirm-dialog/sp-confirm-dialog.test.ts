import { describe, it, expect, beforeEach, vi } from "vitest";
import "./sp-confirm-dialog.js";
import type { SpConfirmDialogComponent } from "./sp-confirm-dialog.js";

function createElement(): SpConfirmDialogComponent {
  const el = document.createElement("sp-confirm-dialog") as SpConfirmDialogComponent;
  document.body.appendChild(el);
  return el;
}

describe("sp-confirm-dialog", () => {
  let el: SpConfirmDialogComponent;

  beforeEach(() => {
    document.body.innerHTML = "";
    el = createElement();
  });

  // ---- Rendering ----

  it("renders dialog element in shadow DOM", async () => {
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector("dialog")).not.toBeNull();
  });

  it("renders confirm button", async () => {
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-confirm-ok")).not.toBeNull();
  });

  it("renders cancel button by default", async () => {
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-confirm-cancel")).not.toBeNull();
  });

  // ---- open prop ----

  it("open prop calls showModal on dialog", async () => {
    await el.updateComplete;
    const dialog = el.shadowRoot?.querySelector("dialog") as HTMLDialogElement;
    const spy = vi.spyOn(dialog, "showModal").mockImplementation(() => {});
    el.open = true;
    await el.updateComplete;
    expect(spy).toHaveBeenCalledOnce();
  });

  it("open=false calls close on dialog when it was open", async () => {
    await el.updateComplete;
    const dialog = el.shadowRoot?.querySelector("dialog") as HTMLDialogElement;
    vi.spyOn(dialog, "showModal").mockImplementation(() => {});
    const closeSpy = vi.spyOn(dialog, "close").mockImplementation(() => {});
    el.open = true;
    await el.updateComplete;
    // Simulate dialog being open
    Object.defineProperty(dialog, "open", { value: true, writable: true, configurable: true });
    el.open = false;
    await el.updateComplete;
    expect(closeSpy).toHaveBeenCalled();
  });

  // ---- Events ----

  it("emits sp-confirm when confirm button clicked", async () => {
    await el.updateComplete;
    const listener = vi.fn();
    el.addEventListener("sp-confirm", listener);
    const dialog = el.shadowRoot?.querySelector("dialog") as HTMLDialogElement;
    vi.spyOn(dialog, "showModal").mockImplementation(() => {});
    vi.spyOn(dialog, "close").mockImplementation(() => {});
    el.open = true;
    await el.updateComplete;
    const confirmBtn = el.shadowRoot?.querySelector<HTMLButtonElement>(".sp-confirm-ok")!;
    confirmBtn.click();
    await el.updateComplete;
    expect(listener).toHaveBeenCalledOnce();
  });

  it("emits sp-cancel when cancel button clicked", async () => {
    await el.updateComplete;
    const listener = vi.fn();
    el.addEventListener("sp-cancel", listener);
    const dialog = el.shadowRoot?.querySelector("dialog") as HTMLDialogElement;
    vi.spyOn(dialog, "showModal").mockImplementation(() => {});
    vi.spyOn(dialog, "close").mockImplementation(() => {});
    el.open = true;
    await el.updateComplete;
    const cancelBtn = el.shadowRoot?.querySelector<HTMLButtonElement>(".sp-confirm-cancel")!;
    cancelBtn.click();
    await el.updateComplete;
    expect(listener).toHaveBeenCalledOnce();
  });

  // ---- hideCancel ----

  it("hideCancel hides cancel button", async () => {
    el.hideCancel = true;
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-confirm-cancel")).toBeNull();
  });

  // ---- variant ----

  it("variant destructive sets destructive class on confirm button", async () => {
    el.variant = "destructive";
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-confirm-ok--destructive")).not.toBeNull();
  });

  it("variant default sets default class on confirm button", async () => {
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-confirm-ok--default")).not.toBeNull();
  });

  // ---- Labels ----

  it("confirmLabel prop sets button text", async () => {
    el.confirmLabel = "Delete";
    await el.updateComplete;
    const btn = el.shadowRoot?.querySelector(".sp-confirm-ok");
    expect(btn?.textContent?.trim()).toBe("Delete");
  });

  it("cancelLabel prop sets button text", async () => {
    el.cancelLabel = "Go back";
    await el.updateComplete;
    const btn = el.shadowRoot?.querySelector(".sp-confirm-cancel");
    expect(btn?.textContent?.trim()).toBe("Go back");
  });

  // ---- _confirm / _cancel set open=false ----

  it("_confirm() sets open=false", async () => {
    const dialog = el.shadowRoot?.querySelector("dialog") as HTMLDialogElement;
    vi.spyOn(dialog, "showModal").mockImplementation(() => {});
    vi.spyOn(dialog, "close").mockImplementation(() => {});
    el.open = true;
    await el.updateComplete;
    el._confirm();
    await el.updateComplete;
    expect(el.open).toBe(false);
  });

  it("_cancel() sets open=false", async () => {
    const dialog = el.shadowRoot?.querySelector("dialog") as HTMLDialogElement;
    vi.spyOn(dialog, "showModal").mockImplementation(() => {});
    vi.spyOn(dialog, "close").mockImplementation(() => {});
    el.open = true;
    await el.updateComplete;
    el._cancel();
    await el.updateComplete;
    expect(el.open).toBe(false);
  });

  // ---- Static confirm() method ----

  it("static confirm() method exists", () => {
    const SpConfirmDialogComponent = customElements.get("sp-confirm-dialog") as any;
    expect(typeof SpConfirmDialogComponent?.confirm).toBe("function");
  });

  it("reflects default variant attribute", async () => {
    await el.updateComplete;
    expect(el.getAttribute("variant")).toBe("default");
  });
});
