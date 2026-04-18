import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import "./sp-search-input.js";
import type { SpSearchInputComponent } from "./sp-search-input.js";

function createElement(): SpSearchInputComponent {
  const el = document.createElement("sp-search-input") as SpSearchInputComponent;
  document.body.appendChild(el);
  return el;
}

describe("sp-search-input", () => {
  let el: SpSearchInputComponent;

  beforeEach(() => {
    vi.useFakeTimers();
    document.body.innerHTML = "";
    el = createElement();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("renders input in shadow DOM", async () => {
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector("input")).not.toBeNull();
  });

  it("renders search icon", async () => {
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector("svg")).not.toBeNull();
  });

  it("shows placeholder when set", async () => {
    el.placeholder = "Buscar...";
    await el.updateComplete;
    const input = el.shadowRoot?.querySelector<HTMLInputElement>("input");
    expect(input?.placeholder).toBe("Buscar...");
  });

  it("emits sp-search with debounce on input", async () => {
    await el.updateComplete;
    const listener = vi.fn();
    el.addEventListener("sp-search", listener);
    const input = el.shadowRoot?.querySelector<HTMLInputElement>("input")!;
    input.value = "hello";
    input.dispatchEvent(new Event("input", { bubbles: true, composed: true }));
    expect(listener).not.toHaveBeenCalled();
    vi.advanceTimersByTime(400);
    expect(listener).toHaveBeenCalledOnce();
    expect((listener.mock.calls[0]![0] as CustomEvent).detail.value).toBe("hello");
  });

  it("emits sp-search immediately on Enter", async () => {
    await el.updateComplete;
    const listener = vi.fn();
    el.addEventListener("sp-search", listener);
    const input = el.shadowRoot?.querySelector<HTMLInputElement>("input")!;
    input.value = "test";
    input.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true }));
    expect(listener).toHaveBeenCalledOnce();
  });

  it("clears value on Escape", async () => {
    el.value = "something";
    await el.updateComplete;
    const input = el.shadowRoot?.querySelector<HTMLInputElement>("input")!;
    input.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
    await el.updateComplete;
    expect(el.value).toBe("");
  });

  it("shows clear button when value is not empty", async () => {
    el.value = "test";
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-si-clear")).not.toBeNull();
  });

  it("hides clear button when value is empty", async () => {
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-si-clear")).toBeNull();
  });

  it("clears value when clear button is clicked", async () => {
    el.value = "test";
    await el.updateComplete;
    el.shadowRoot?.querySelector<HTMLButtonElement>(".sp-si-clear")?.click();
    await el.updateComplete;
    expect(el.value).toBe("");
  });

  it("reflects disabled prop", async () => {
    el.disabled = true;
    await el.updateComplete;
    const input = el.shadowRoot?.querySelector<HTMLInputElement>("input");
    expect(input?.disabled).toBe(true);
  });
});
