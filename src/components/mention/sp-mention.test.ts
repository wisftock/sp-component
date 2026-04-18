import { describe, it, expect, beforeEach } from "vitest";
import "./sp-mention.js";
import type { SpMentionComponent } from "./sp-mention.js";

function createElement(): SpMentionComponent {
  const el = document.createElement("sp-mention") as SpMentionComponent;
  document.body.appendChild(el);
  return el;
}

describe("sp-mention", () => {
  let el: SpMentionComponent;
  beforeEach(() => { document.body.innerHTML = ""; el = createElement(); });

  it("renders input in shadow DOM", async () => {
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-mention__input")).not.toBeNull();
  });

  it("suggestions are not shown by default", async () => {
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-mention__dropdown")).toBeNull();
  });

  it("defaults placeholder", async () => {
    await el.updateComplete;
    expect(el.placeholder).toBe("Type @ to mention...");
  });

  it("shows label when set", async () => {
    el.label = "Mencionar usuario";
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-mention__label")?.textContent?.trim()).toBe("Mencionar usuario");
  });

  it("fires sp-change on input", async () => {
    await el.updateComplete;
    const received: CustomEvent[] = [];
    el.addEventListener("sp-change", (e) => received.push(e as CustomEvent));
    const input = el.shadowRoot?.querySelector<HTMLInputElement>(".sp-mention__input");
    input!.value = "hello";
    input?.dispatchEvent(new Event("input", { bubbles: true }));
    expect(received.length).toBe(1);
    expect(received[0].detail.value).toBe("hello");
  });

  it("shows suggestions when @ is typed", async () => {
    el.items = [{ id: "u1", label: "Juan" }, { id: "u2", label: "María" }];
    await el.updateComplete;
    const input = el.shadowRoot?.querySelector<HTMLInputElement>(".sp-mention__input");
    Object.defineProperty(input, "selectionStart", { value: 1, writable: true });
    input!.value = "@";
    input?.dispatchEvent(new Event("input", { bubbles: true }));
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-mention__dropdown")).not.toBeNull();
  });

  it("fires sp-mention on suggestion mousedown", async () => {
    el.items = [{ id: "u1", label: "Juan" }];
    await el.updateComplete;
    const input = el.shadowRoot?.querySelector<HTMLInputElement>(".sp-mention__input");
    Object.defineProperty(input, "selectionStart", { value: 1, writable: true });
    input!.value = "@";
    input?.dispatchEvent(new Event("input", { bubbles: true }));
    await el.updateComplete;
    const received: CustomEvent[] = [];
    el.addEventListener("sp-mention", (e) => received.push(e as CustomEvent));
    const item = el.shadowRoot?.querySelector<HTMLElement>(".sp-mention__option");
    item?.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));
    expect(received.length).toBe(1);
    expect(received[0].detail.id).toBe("u1");
  });

  it("input is disabled when disabled is set", async () => {
    el.disabled = true;
    await el.updateComplete;
    const input = el.shadowRoot?.querySelector<HTMLInputElement>(".sp-mention__input");
    expect(input?.disabled).toBe(true);
  });
});
