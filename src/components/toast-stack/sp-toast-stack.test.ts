import { describe, it, expect, beforeEach, vi } from "vitest";
import "./sp-toast-stack.js";
import type { SpToastStackComponent } from "./sp-toast-stack.js";

function createElement(): SpToastStackComponent {
  const el = document.createElement("sp-toast-stack") as SpToastStackComponent;
  document.body.appendChild(el);
  return el;
}

describe("sp-toast-stack", () => {
  let el: SpToastStackComponent;

  beforeEach(() => {
    document.body.innerHTML = "";
    el = createElement();
  });

  // ---- Rendering ----

  it("renders container in shadow DOM", async () => {
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-toast-stack")).not.toBeNull();
  });

  it("renders no toasts by default", async () => {
    await el.updateComplete;
    expect(el.shadowRoot?.querySelectorAll(".sp-toast-card").length).toBe(0);
  });

  // ---- show() ----

  it("show() adds a toast", async () => {
    el.show({ message: "Hello!" });
    await el.updateComplete;
    expect(el.shadowRoot?.querySelectorAll(".sp-toast-card").length).toBe(1);
  });

  it("show() returns a string id", () => {
    const id = el.show({ message: "Test" });
    expect(typeof id).toBe("string");
    expect(id.length).toBeGreaterThan(0);
  });

  it("show() adds toast with correct message", async () => {
    el.show({ message: "My notification" });
    await el.updateComplete;
    const msg = el.shadowRoot?.querySelector(".sp-toast-message");
    expect(msg?.textContent).toBe("My notification");
  });

  // ---- dismiss() ----

  it("dismiss(id) removes specific toast", async () => {
    const id = el.show({ message: "Gone" });
    await el.updateComplete;
    el.dismiss(id);
    await el.updateComplete;
    expect(el.shadowRoot?.querySelectorAll(".sp-toast-card").length).toBe(0);
  });

  it("dismiss(id) only removes the targeted toast", async () => {
    el.show({ message: "Keep me" });
    const id2 = el.show({ message: "Remove me" });
    await el.updateComplete;
    el.dismiss(id2);
    await el.updateComplete;
    expect(el.shadowRoot?.querySelectorAll(".sp-toast-card").length).toBe(1);
    expect(el.shadowRoot?.querySelector(".sp-toast-message")?.textContent).toBe("Keep me");
  });

  // ---- dismissAll() ----

  it("dismissAll() clears all toasts", async () => {
    el.show({ message: "A" });
    el.show({ message: "B" });
    el.show({ message: "C" });
    await el.updateComplete;
    el.dismissAll();
    await el.updateComplete;
    expect(el.shadowRoot?.querySelectorAll(".sp-toast-card").length).toBe(0);
  });

  // ---- max prop ----

  it("max prop limits visible toasts", async () => {
    el.max = 2;
    el.show({ message: "1" });
    el.show({ message: "2" });
    el.show({ message: "3" });
    await el.updateComplete;
    expect(el.shadowRoot?.querySelectorAll(".sp-toast-card").length).toBe(2);
  });

  // ---- duration=0 ----

  it("duration=0 keeps toast persistent", async () => {
    vi.useFakeTimers();
    el.show({ message: "Persistent", duration: 0 });
    await el.updateComplete;
    vi.advanceTimersByTime(10000);
    await el.updateComplete;
    expect(el._toasts.length).toBe(1);
    vi.useRealTimers();
  });

  // ---- Events ----

  it("emits sp-show with id when toast is added", async () => {
    const listener = vi.fn();
    el.addEventListener("sp-show", listener);
    const id = el.show({ message: "Event test" });
    await el.updateComplete;
    expect(listener).toHaveBeenCalledOnce();
    expect((listener.mock.calls[0]![0] as CustomEvent).detail.id).toBe(id);
  });

  it("emits sp-dismiss with id when toast is removed", async () => {
    const listener = vi.fn();
    el.addEventListener("sp-dismiss", listener);
    const id = el.show({ message: "Dismiss me" });
    el.dismiss(id);
    await el.updateComplete;
    expect(listener).toHaveBeenCalledOnce();
    expect((listener.mock.calls[0]![0] as CustomEvent).detail.id).toBe(id);
  });

  // ---- variant ----

  it("variant prop sets correct class on card", async () => {
    el.show({ message: "Success!", variant: "success" });
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-toast-card--success")).not.toBeNull();
  });

  it("reflects default position attribute", async () => {
    await el.updateComplete;
    expect(el.getAttribute("position")).toBe("bottom-right");
  });
});
