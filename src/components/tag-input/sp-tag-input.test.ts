import { describe, it, expect, beforeEach, vi } from "vitest";
import "./sp-tag-input.js";
import type { SpTagInputComponent } from "./sp-tag-input.js";

function createElement(): SpTagInputComponent {
  const el = document.createElement("sp-tag-input") as SpTagInputComponent;
  document.body.appendChild(el);
  return el;
}

async function typeInInput(el: SpTagInputComponent, value: string) {
  const input = el.shadowRoot?.querySelector<HTMLInputElement>(".sp-tag-input-input")!;
  input.value = value;
  input.dispatchEvent(new Event("input", { bubbles: true }));
  await el.updateComplete;
}

async function pressKey(el: SpTagInputComponent, key: string) {
  const input = el.shadowRoot?.querySelector<HTMLInputElement>(".sp-tag-input-input")!;
  const ev = new KeyboardEvent("keydown", { key, bubbles: true });
  input.dispatchEvent(ev);
  await el.updateComplete;
}

describe("sp-tag-input", () => {
  let el: SpTagInputComponent;

  beforeEach(() => {
    document.body.innerHTML = "";
    el = createElement();
  });

  // ---- Rendering ----

  it("renders in shadow DOM", async () => {
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-tag-input")).not.toBeNull();
  });

  it("renders inner input element", async () => {
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-tag-input-input")).not.toBeNull();
  });

  // ---- Adding tags ----

  it("adds tag via Enter key", async () => {
    await el.updateComplete;
    await typeInInput(el, "hello");
    el._inputValue = "hello";
    await pressKey(el, "Enter");
    expect(el._tags).toContain("hello");
  });

  it("clears input after adding tag via Enter", async () => {
    await el.updateComplete;
    el._inputValue = "world";
    await pressKey(el, "Enter");
    expect(el._inputValue).toBe("");
  });

  it("adds tag via delimiter (comma)", async () => {
    await el.updateComplete;
    await typeInInput(el, "foo,");
    expect(el._tags).toContain("foo");
  });

  it("renders chip for each tag", async () => {
    el.values = "alpha,beta";
    await el.updateComplete;
    const chips = el.shadowRoot?.querySelectorAll(".sp-tag-input-chip");
    expect(chips?.length).toBe(2);
  });

  // ---- Removing tags ----

  it("removes tag with × button", async () => {
    el.values = "a,b,c";
    await el.updateComplete;
    const removeBtn = el.shadowRoot?.querySelector<HTMLButtonElement>(".sp-tag-input-chip-remove")!;
    removeBtn.click();
    await el.updateComplete;
    expect(el._tags).not.toContain("a");
  });

  it("Backspace on empty input removes last tag", async () => {
    el.values = "x,y";
    await el.updateComplete;
    el._inputValue = "";
    await pressKey(el, "Backspace");
    expect(el._tags).not.toContain("y");
    expect(el._tags).toContain("x");
  });

  // ---- max prop ----

  it("max prop prevents adding beyond limit", async () => {
    el.max = 2;
    el.values = "one,two";
    await el.updateComplete;
    el._inputValue = "three";
    await pressKey(el, "Enter");
    expect(el._tags.length).toBe(2);
    expect(el._tags).not.toContain("three");
  });

  // ---- allowDuplicates ----

  it("allowDuplicates=false rejects duplicates", async () => {
    el.values = "dup";
    await el.updateComplete;
    el._inputValue = "dup";
    await pressKey(el, "Enter");
    expect(el._tags.filter((t) => t === "dup").length).toBe(1);
  });

  it("allowDuplicates=true allows duplicates", async () => {
    el.allowDuplicates = true;
    el.values = "dup";
    await el.updateComplete;
    el._inputValue = "dup";
    await pressKey(el, "Enter");
    expect(el._tags.filter((t) => t === "dup").length).toBe(2);
  });

  // ---- Events ----

  it("emits sp-change when tag added", async () => {
    const listener = vi.fn();
    el.addEventListener("sp-change", listener);
    el._inputValue = "newtag";
    await pressKey(el, "Enter");
    expect(listener).toHaveBeenCalled();
  });

  it("emits sp-change when tag removed", async () => {
    el.values = "rem";
    await el.updateComplete;
    const listener = vi.fn();
    el.addEventListener("sp-change", listener);
    el._removeTag("rem");
    await el.updateComplete;
    expect(listener).toHaveBeenCalled();
  });

  it("emits sp-add when tag added", async () => {
    const listener = vi.fn();
    el.addEventListener("sp-add", listener);
    el._addTag("addme");
    await el.updateComplete;
    expect(listener).toHaveBeenCalledOnce();
    expect((listener.mock.calls[0][0] as CustomEvent).detail.value).toBe("addme");
  });

  it("emits sp-remove when tag removed", async () => {
    el.values = "gone";
    await el.updateComplete;
    const listener = vi.fn();
    el.addEventListener("sp-remove", listener);
    el._removeTag("gone");
    await el.updateComplete;
    expect(listener).toHaveBeenCalledOnce();
    expect((listener.mock.calls[0][0] as CustomEvent).detail.value).toBe("gone");
  });

  // ---- Disabled ----

  it("disabled prevents adding tags", async () => {
    el.disabled = true;
    await el.updateComplete;
    el._addTag("blocked");
    expect(el._tags).not.toContain("blocked");
  });

  it("disabled hides remove buttons", async () => {
    el.disabled = true;
    el.values = "chip";
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-tag-input-chip-remove")).toBeNull();
  });

  // ---- values prop sync ----

  it("values prop syncs to _tags array", async () => {
    el.values = "a,b,c";
    await el.updateComplete;
    expect(el._tags).toEqual(["a", "b", "c"]);
  });

  // ---- Form participation ----

  it("formResetCallback clears all tags", async () => {
    el.values = "one,two";
    await el.updateComplete;
    el.formResetCallback();
    expect(el._tags.length).toBe(0);
    expect(el.values).toBe("");
  });

  // ---- Blur ----

  it("blur adds pending input as tag", async () => {
    await el.updateComplete;
    el._inputValue = "blurtag";
    const input = el.shadowRoot?.querySelector<HTMLInputElement>(".sp-tag-input-input")!;
    input.dispatchEvent(new Event("blur", { bubbles: true }));
    await el.updateComplete;
    expect(el._tags).toContain("blurtag");
  });

  it("reflects default size attribute", async () => {
    await el.updateComplete;
    expect(el.getAttribute("size")).toBe("md");
  });
});
