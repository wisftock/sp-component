import { describe, it, expect, beforeEach, vi } from "vitest";
import "./sp-code-editor.js";
import type { SpCodeEditorComponent } from "./sp-code-editor.js";

function createElement(): SpCodeEditorComponent {
  const el = document.createElement("sp-code-editor") as SpCodeEditorComponent;
  document.body.appendChild(el);
  return el;
}

describe("sp-code-editor", () => {
  let el: SpCodeEditorComponent;

  beforeEach(() => {
    document.body.innerHTML = "";
    el = createElement();
  });

  it("renders the editor container in shadow DOM", async () => {
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-ce")).not.toBeNull();
  });

  it("renders header with macOS dots", async () => {
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-ce-dots")).not.toBeNull();
  });

  it("renders textarea in editor area", async () => {
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector("textarea")).not.toBeNull();
  });

  it("renders highlight overlay", async () => {
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-ce-highlight")).not.toBeNull();
  });

  it("has default language of js", async () => {
    await el.updateComplete;
    expect(el.language).toBe("js");
  });

  it("shows language badge", async () => {
    el.language = "ts";
    await el.updateComplete;
    const badge = el.shadowRoot?.querySelector(".sp-ce-lang-badge");
    expect(badge?.textContent?.trim()).toBe("ts");
  });

  it("shows filename when set", async () => {
    el.filename = "index.ts";
    await el.updateComplete;
    const fname = el.shadowRoot?.querySelector(".sp-ce-filename");
    expect(fname?.textContent?.trim()).toBe("index.ts");
  });

  it("textarea is readonly when readonly=true", async () => {
    el.readonly = true;
    await el.updateComplete;
    const ta = el.shadowRoot?.querySelector<HTMLTextAreaElement>("textarea");
    expect(ta?.readOnly).toBe(true);
  });

  it("emits sp-change event on input", async () => {
    await el.updateComplete;
    const listener = vi.fn();
    el.addEventListener("sp-change", listener);
    const ta = el.shadowRoot?.querySelector<HTMLTextAreaElement>("textarea")!;
    ta.value = "const x = 1;";
    ta.dispatchEvent(new Event("input", { bubbles: true, composed: true }));
    expect(listener).toHaveBeenCalledOnce();
    expect((listener.mock.calls[0]![0] as CustomEvent).detail.value).toBe("const x = 1;");
  });

  it("renders line numbers in gutter", async () => {
    el.value = "line1\nline2\nline3";
    await el.updateComplete; // updated() sets _value (@state) → queues second render
    await el.updateComplete;
    const gutterLines = el.shadowRoot?.querySelectorAll(".sp-ce-gutter-line");
    expect(gutterLines?.length).toBe(3);
  });

  it("initializes textarea with value prop", async () => {
    el.value = "const hello = 'world';";
    await el.updateComplete; // updated() sets _value (@state) → queues second render
    await el.updateComplete;
    const ta = el.shadowRoot?.querySelector<HTMLTextAreaElement>("textarea");
    expect(ta?.value).toBe("const hello = 'world';");
  });
});
