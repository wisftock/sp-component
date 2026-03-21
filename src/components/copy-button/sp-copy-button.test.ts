import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import "./sp-copy-button.js";
import type { SpCopyButtonComponent } from "./sp-copy-button.js";

function createElement(): SpCopyButtonComponent {
  const el = document.createElement("sp-copy-button") as SpCopyButtonComponent;
  document.body.appendChild(el);
  return el;
}

describe("sp-copy-button", () => {
  let el: SpCopyButtonComponent;

  beforeEach(() => {
    document.body.innerHTML = "";
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn().mockResolvedValue(undefined),
      },
    });
    el = createElement();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders a button element", async () => {
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector("button")).not.toBeNull();
  });

  it("reflects disabled attribute", async () => {
    el.disabled = true;
    await el.updateComplete;
    expect(el.hasAttribute("disabled")).toBe(true);
  });

  it("shows default label Copy", async () => {
    await el.updateComplete;
    const btn = el.shadowRoot?.querySelector("button");
    expect(btn?.textContent?.trim()).toContain("Copy");
  });

  it("shows successLabel after copy", async () => {
    el.text = "hello";
    await el.updateComplete;

    const btn = el.shadowRoot?.querySelector("button") as HTMLButtonElement;
    btn.click();
    await el.updateComplete;

    expect(btn.textContent?.trim()).toContain("Copied!");
  });

  it("emits sp-copy event with text", async () => {
    el.text = "test text";
    await el.updateComplete;

    const listener = vi.fn();
    el.addEventListener("sp-copy", listener);

    const btn = el.shadowRoot?.querySelector("button") as HTMLButtonElement;
    btn.click();

    // Wait for the async clipboard write
    await new Promise((r) => setTimeout(r, 0));
    await el.updateComplete;

    expect(listener).toHaveBeenCalledOnce();
    const detail = (listener.mock.calls[0][0] as CustomEvent<{ text: string }>).detail;
    expect(detail.text).toBe("test text");
  });

  it("does not emit when disabled", async () => {
    el.text = "test";
    el.disabled = true;
    await el.updateComplete;

    const listener = vi.fn();
    el.addEventListener("sp-copy", listener);

    el._handleClick();
    await new Promise((r) => setTimeout(r, 0));

    expect(listener).not.toHaveBeenCalled();
  });

  it("reflects size attribute", async () => {
    el.size = "lg";
    await el.updateComplete;
    expect(el.getAttribute("size")).toBe("lg");
  });

  it("reflects variant attribute", async () => {
    el.variant = "primary";
    await el.updateComplete;
    expect(el.getAttribute("variant")).toBe("primary");
  });
});
